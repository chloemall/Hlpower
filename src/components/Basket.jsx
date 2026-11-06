import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBasket } from "../context/BasketContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Shield, Clock } from "lucide-react";

const Basket = () => {
  const { basket, removeFromBasket, updateQuantity, clearBasket } = useBasket();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  const summaryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }
  };

  if (basket.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your basket is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any generators yet. Explore our range of premium power solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-600 transition-all transform hover:-translate-y-1 shadow-2xl"
                >
                  Start Shopping <ArrowRight size={20} />
                </Link>
                <Link
                  to="/offers"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 border-2 border-teal-600 rounded-xl font-semibold text-lg hover:bg-teal-50 transition-all"
                >
                  View Offers
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your <span className="text-teal-600">Basket</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Review your items and proceed to checkout.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {basket.items.map(item => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="sm:w-32 h-32 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || item.image || 'https://via.placeholder.com/300'}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.title || item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.category || 'Generator'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-teal-600 font-bold">
                          KSh {item.price?.toLocaleString()}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Price and Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span className="font-bold text-gray-900">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/products"
                className="px-6 py-3 border border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition flex items-center gap-2"
              >
                <ArrowRight size={18} className="rotate-180" />
                Continue Shopping
              </Link>
              <button
                onClick={clearBasket}
                className="px-6 py-3 border border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Clear Basket
              </button>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Subtotal */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({basket.totalItems} items)</span>
                  <span className="font-semibold">KSh {basket.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-sm text-teal-600">Depends on machine</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Installation</span>
                  <span className="text-sm text-teal-600">Depends on machine</span>
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Total */}
              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-teal-600">KSh {basket.totalPrice.toLocaleString()}</span>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white text-center rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-600 transition-all transform hover:-translate-y-1 shadow-xl mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div className="flex flex-col items-center p-2">
                  <Truck size={20} className="text-teal-600 mb-1" />
                  <span>Delivery</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <Shield size={20} className="text-teal-600 mb-1" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center p-2">
                  <Clock size={20} className="text-teal-600 mb-1" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Basket;