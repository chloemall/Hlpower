import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "../context/BasketContext";
import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

// Helper to calculate discounted price
const getDiscountedPrice = (price, discount) => {
  return discount ? price - (price * discount) / 100 : price;
};

// Animated checkmark icon
const CheckIcon = () => (
  <svg
    className="w-24 h-24 text-green-500 animate-bounce"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'
  const [checkoutRequestId, setCheckoutRequestId] = useState("");

  // Calculate totals with discounts applied
  const total = basket.totalPrice; // already discounted from context
  const vat = total - total / 1.16; // VAT amount (16% inclusive)
  const subtotal = total - vat;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Poll transaction status
  const pollStatus = async (requestId) => {
    const checkStatus = httpsCallable(functions, 'checkStatus');
    const interval = setInterval(async () => {
      try {
        const result = await checkStatus({ checkoutRequestId: requestId });
        const status = result.data.status;
        if (status === 'completed') {
          clearInterval(interval);
          setPaymentStatus('success');
          clearBasket();          // Clear basket, but stay on checkout
        } else if (status === 'failed') {
          clearInterval(interval);
          setPaymentStatus('failed');
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus(null);

    try {
      const orderData = {
        ...formData,
        items: basket.items,
        totalPrice: basket.totalPrice,
        totalItems: basket.totalItems,
        createdAt: new Date().toISOString()
      };

      const stkPush = httpsCallable(functions, 'stkPush');
      const response = await stkPush({
        phone: formData.phone,
        amount: Math.round(basket.totalPrice),
        orderDetails: orderData
      });

      if (response.data.success) {
        setPaymentStatus('pending');
        setCheckoutRequestId(response.data.checkoutRequestId);
        pollStatus(response.data.checkoutRequestId);
      } else {
        alert('Payment initiation failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // No automatic redirect when basket empty – show a message instead
  if (basket.items.length === 0 && paymentStatus !== 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your basket is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your basket before checking out.</p>
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

  // Success screen – no automatic navigation, big checkmark, buttons to shop more or home
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center p-8 max-w-md">
          <div className="flex justify-center mb-6">
            <CheckIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-8">Your order has been placed. Thank you for shopping with us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Shop More
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form (including pending and failed states)
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (M‑Pesa) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="254712345678"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Include country code (254) without leading zero or +</p>
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

                <button
                  type="submit"
                  disabled={loading || paymentStatus === 'pending'}
                  className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? "Initiating..." : paymentStatus === 'pending' ? "Waiting for PIN..." : "Pay with M‑Pesa"}
                </button>
              </form>
            </div>
          </div>

          {/* Right column – Order summary */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 sticky top-28">
              <h2 className="text-xl font-semibold mb-6">Your order</h2>

              {/* Product list with images and discounted prices */}
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

              {/* Price breakdown with VAT (inclusive) */}
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
                  <span>KSh {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Payment info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span>🔒</span> Secure payment via M‑Pesa
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  You will receive a prompt on your phone to enter your M‑Pesa PIN.
                </p>
              </div>

              {/* Pending state indicator */}
              {paymentStatus === 'pending' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-blue-700 text-sm">Waiting for your M‑Pesa confirmation...</p>
                  </div>
                </div>
              )}

              {/* Failed state */}
              {paymentStatus === 'failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-700 text-sm">Payment failed. Please try again or contact support.</p>
                  <button
                    onClick={() => setPaymentStatus(null)}
                    className="text-sm text-red-600 underline mt-1"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;