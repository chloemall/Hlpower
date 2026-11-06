import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../context/BasketContext";

// Helper to calculate discounted price
const getDiscountedPrice = (price, discount) => {
  return discount ? price - (price * discount) / 100 : price;
};

const Checkout = () => {
  const { basket, clearBasket } = useBasket();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [paymentMethod, setPaymentMethod] = useState("normal"); // "normal" or "mpesa"
  const [mpesaCode, setMpesaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Calculate totals
  const total = basket.totalPrice;
  const vat = total - total / 1.16;
  const subtotal = total - vat;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate order message (plain text)
  const generateOrderMessage = () => {
    const itemsList = basket.items
      .map(
        (item) =>
          `- ${item.title || item.name} x${item.quantity} @ KSh ${getDiscountedPrice(
            item.price,
            item.discount
          ).toLocaleString()} each`
      )
      .join("\n");

    const paymentInfo =
      paymentMethod === "mpesa"
        ? `Payment Method: M-PESA (Buy Goods Till 9810921)\nM-PESA Code: ${mpesaCode}`
        : "Payment Method: Normal Order";

    return `
*New Order from HL Power Website*

*Customer Details*
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Delivery Address: ${formData.address}
City: ${formData.city}
${formData.notes ? `Additional Notes: ${formData.notes}` : ""}

*Payment Details*
${paymentInfo}

*Order Summary*
${itemsList}

*Totals*
Subtotal (excl. VAT): KSh ${subtotal.toFixed(2)}
VAT (16%): KSh ${vat.toFixed(2)}
Total: KSh ${total.toFixed(2)}

Thank you for choosing HL Power!
    `.trim();
  };

  // Generate Gmail compose URL
  const getGmailComposeUrl = () => {
    const to = "hlpowergenerator@gmail.com";
    const subject = "New Order from HL Power Website";
    const body = generateOrderMessage();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Copy order details to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateOrderMessage());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      alert("Failed to copy. Please select and copy manually.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate M-PESA code if M-PESA is selected
    if (paymentMethod === "mpesa" && !mpesaCode.trim()) {
      alert("Please enter your M-PESA transaction code.");
      return;
    }

    setLoading(true);

    if (contactMethod === "whatsapp") {
      const phone = "254799959279";
      const message = encodeURIComponent(generateOrderMessage());
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    } else {
      // Open Gmail compose in a new tab
      window.open(getGmailComposeUrl(), "_blank");
    }

    // Save order summary for success screen
    setOrderSummary({
      ...formData,
      items: basket.items,
      total,
      subtotal,
      vat,
      paymentMethod,
      mpesaCode: paymentMethod === "mpesa" ? mpesaCode : null
    });

    clearBasket();
    setOrderPlaced(true);
    setLoading(false);
  };

  // Empty basket view
  if (basket.items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your basket is empty</h2>
          <p className="text-gray-600 mb-8">Add some products before checking out.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Shop Products
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (orderPlaced && orderSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Success header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Order Placed Successfully!</h1>
              <p className="text-green-100 text-lg">Thank you for choosing HL Power</p>
            </div>

            {/* Order summary */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Customer Details</h3>
                <p className="text-gray-600"><span className="font-medium">Name:</span> {orderSummary.fullName}</p>
                <p className="text-gray-600"><span className="font-medium">Email:</span> {orderSummary.email}</p>
                <p className="text-gray-600"><span className="font-medium">Phone:</span> {orderSummary.phone}</p>
                <p className="text-gray-600"><span className="font-medium">Address:</span> {orderSummary.address}, {orderSummary.city}</p>
                {orderSummary.notes && <p className="text-gray-600"><span className="font-medium">Notes:</span> {orderSummary.notes}</p>}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Payment Details</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Method:</span>{" "}
                  {orderSummary.paymentMethod === "mpesa" ? "M-PESA (Buy Goods Till 9810921)" : "Normal Order"}
                </p>
                {orderSummary.paymentMethod === "mpesa" && (
                  <p className="text-gray-600"><span className="font-medium">M-PESA Code:</span> {orderSummary.mpesaCode}</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
                {orderSummary.items.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price, item.discount);
                  return (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">{item.title || item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} x KSh {discountedPrice.toLocaleString()}</p>
                      </div>
                      <p className="font-semibold text-gray-800">KSh {(discountedPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>KSh {orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>VAT (16%)</span>
                  <span>KSh {orderSummary.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>KSh {orderSummary.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Contact options */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">We'll be in touch shortly</h3>
                <p className="text-gray-600 mb-4">
                  You can also contact us directly using the options below:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/254799959279?text=${encodeURIComponent("I just placed an order on HL Power website")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.01.57 3.97 1.66 5.66L2 22l4.57-1.67c1.64.97 3.52 1.5 5.47 1.5 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.09c-1.66 0-3.28-.44-4.7-1.27l-.34-.2-2.81 1.03 1.08-2.66-.2-.34c-.91-1.5-1.4-3.24-1.4-5.04 0-4.6 3.74-8.34 8.34-8.34s8.34 3.74 8.34 8.34-3.74 8.34-8.34 8.34z" />
                      <path d="M16.68 13.49c-.27-.13-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.13-.18.26-.71.87-.87 1.05-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.13-.6-1.45-.82-1.98-.22-.53-.44-.46-.59-.46-.15 0-.33-.01-.51-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.95 4.68 4.05.65.26 1.16.41 1.56.53.66.18 1.26.15 1.73.09.53-.07 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.26-.2-.53-.33z" />
                    </svg>
                    WhatsApp
                  </a>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Send order via Gmail:</p>
                    <div className="flex gap-2">
                      <a
                        href={getGmailComposeUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Open Gmail
                      </a>
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition relative"
                        title="Copy order details to clipboard"
                      >
                        {copySuccess ? "✓" : "📋"}
                      </button>
                    </div>
                    {copySuccess && (
                      <p className="text-sm text-green-600 mt-2">Copied to clipboard!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-black transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-8 tracking-tight">
          Complete your order
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column – Delivery form */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6">Delivery details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 712 345 678"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery address *</label>
                  <textarea
                    name="address"
                    required
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                    placeholder="Street, building, apartment number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="Nairobi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="e.g. gate code"
                    />
                  </div>
                </div>

                {/* Payment method selection */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment method</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition flex-1">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="normal"
                        checked={paymentMethod === "normal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-gray-800"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Normal Order</span>
                        <p className="text-sm text-gray-500">Pay on delivery or later</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition flex-1">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={paymentMethod === "mpesa"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://thejoshuagenerationtrust.org/wp-content/uploads/2020/07/mpesa-logo.png" 
                          alt="M-PESA" 
                          className="h-6 w-auto"
                        />
                        <span className="font-medium text-gray-800">M-PESA</span>
                      </div>
                    </label>
                  </div>

                  {/* M-PESA details (shown only when M-PESA is selected) */}
                  {paymentMethod === "mpesa" && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Lipa Na M-PESA Buy Goods</span> – Till number: <span className="font-mono font-bold">9810921</span>
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        After payment, enter the transaction code below.
                      </p>
                      <label className="block text-sm font-medium text-gray-700 mb-1">M-PESA Transaction Code *</label>
                      <input
                        type="text"
                        value={mpesaCode}
                        onChange={(e) => setMpesaCode(e.target.value)}
                        placeholder="e.g. QW123456"
                        required={paymentMethod === "mpesa"}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                  )}
                </div>

                {/* Contact method selection */}
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">How would you like to place your order?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={contactMethod === "whatsapp"}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <div>
                        <span className="font-medium text-gray-800">WhatsApp</span>
                        <p className="text-sm text-gray-500">+254 799 959 279</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={contactMethod === "email"}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Gmail</span>
                        <p className="text-sm text-gray-500">hlpowergenerator@gmail.com</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? "Preparing..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Right column – Order summary */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 sticky top-28">
              <h2 className="text-xl font-semibold mb-6">Your order</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {basket.items.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price, item.discount);
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <span>📦</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.title || item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <div className="flex items-center gap-2">
                          {item.discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              KSh {item.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm font-semibold text-blue-600">
                            KSh {discountedPrice.toLocaleString()} each
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (16% included)</span>
                  <span>KSh {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span>📱</span> After placing your order, you'll be redirected to WhatsApp or Gmail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;