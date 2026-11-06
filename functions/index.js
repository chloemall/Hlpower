const {
  onCall,
  onRequest,
} = require("firebase-functions/v2/https");
const {
  setGlobalOptions,
} = require("firebase-functions");
const {
  defineString,
} = require("firebase-functions/params");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({maxInstances: 10});

// ==================== Define environment variables ====================
const consumerKey = defineString("MPESA_CONSUMER_KEY");
const consumerSecret = defineString("MPESA_CONSUMER_SECRET");
const passkey = defineString("MPESA_PASSKEY");
const shortCode = defineString("MPESA_SHORTCODE");
const callbackUrl = defineString("MPESA_CALLBACK_URL");

// Helper: Get OAuth token
const getAccessToken = async () => {
  const auth = Buffer.from(
      `${consumerKey.value()}:${consumerSecret.value()}`,
  ).toString("base64");
  try {
    const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {headers: {Authorization: `Basic ${auth}`}},
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token", error);
    throw new Error("Failed to obtain access token");
  }
};

// ==================== STK Push initiation ====================
exports.stkPush = onCall({cors: true}, async (request) => {
  // Optional: enforce authentication
  // if (!request.auth) throw new Error("User must be authenticated");

  const {phone, amount, orderDetails} = request.data;
  const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
  const businessShortCode = shortCode.value();
  const password = Buffer.from(
      businessShortCode + passkey.value() + timestamp,
  ).toString("base64");

  const token = await getAccessToken();

  const stkPayload = {
    BusinessShortCode: businessShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: phone,
    PartyB: businessShortCode,
    PhoneNumber: phone,
    CallBackURL: callbackUrl.value(),
    AccountReference: "HL Power Order",
    TransactionDesc: "Payment for generator order",
  };

  try {
    const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        stkPayload,
        {headers: {Authorization: `Bearer ${token}`}},
    );

    // Store transaction in Firestore
    const transactionRef = db
        .collection("Transactions")
        .doc(response.data.CheckoutRequestID);
    await transactionRef.set({
      phone,
      amount: Math.round(amount),
      orderDetails,
      status: "pending",
      merchantRequestId: response.data.MerchantRequestID,
      checkoutRequestId: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      responseDescription: response.data.ResponseDescription,
      customerMessage: response.data.CustomerMessage,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: response.data.CustomerMessage,
      checkoutRequestId: response.data.CheckoutRequestID,
    };
  } catch (error) {
    console.error("STK push error", error);
    throw new Error("Failed to initiate payment");
  }
});

// ==================== Callback from Safaricom ====================
exports.stkCallback = onRequest({cors: true}, async (req, res) => {
  const callbackData = req.body;
  console.log("Callback received:", JSON.stringify(callbackData));

  const {Body} = callbackData;
  if (!Body || !Body.stkCallback) {
    return res.status(400).send("Invalid callback");
  }

  const {
    ResultCode,
    ResultDesc,
    CheckoutRequestID,
    CallbackMetadata,
  } = Body.stkCallback;

  const transactionRef = db
      .collection("Transactions")
      .doc(CheckoutRequestID);
  const updateData = {
    resultCode: ResultCode,
    resultDesc: ResultDesc,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (ResultCode === 0) {
    // Success – extract metadata
    const metadata = {};
    if (CallbackMetadata && CallbackMetadata.Item) {
      CallbackMetadata.Item.forEach((item) => {
        metadata[item.Name] = item.Value;
      });
    }
    updateData.status = "completed";
    updateData.metadata = metadata;
    updateData.mpesaReceiptNumber = metadata.MpesaReceiptNumber;

    // Also create an order in the "Orders" collection
    const transactionDoc = await transactionRef.get();
    if (transactionDoc.exists) {
      const orderData = transactionDoc.data().orderDetails;
      await db.collection("Orders").add({
        ...orderData,
        paymentStatus: "paid",
        mpesaReceipt: metadata.MpesaReceiptNumber,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        checkoutRequestId: CheckoutRequestID,
      });
    }
  } else {
    updateData.status = "failed";
  }

  await transactionRef.update(updateData);

  // Respond to Safaricom
  res.status(200).json({ResultCode: 0, ResultDesc: "Success"});
});

// ==================== Check transaction status (for polling) ====================
exports.checkStatus = onCall({cors: true}, async (request) => {
  const {checkoutRequestId} = request.data;
  const doc = await db
      .collection("Transactions")
      .doc(checkoutRequestId)
      .get();
  if (!doc.exists) {
    throw new Error("Transaction not found");
  }
  return doc.data();
});
