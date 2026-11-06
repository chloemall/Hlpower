 import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useBasket } from '../context/BasketContext';
import {
  ArrowLeft, ShoppingCart, Check, MessageCircle, Facebook,
  Star, Minus, Plus, Truck, Shield, Clock, Info, Play,
  Share2, Twitter, Linkedin, Mail, Copy, X, Globe, Smartphone
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  const [product, setProduct] = useState(null);
  const [media, setMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(4);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const VAT_RATE = 0.16;
  const WHATSAPP_NUMBER = '+254799959279';
  const FACEBOOK_URL = 'https://www.facebook.com/share/1D4YwLWZfN/';
  const INSTAGRAM_URL = 'https://www.instagram.com/hl.power?igsh=NHZteG5oa3FyejBx';
  const YOUTUBE_URL = 'https://youtube.com/@hlpower-ke?si=hcuLUTo69TgPaeQ9';
  const TIKTOK_URL = 'http://tiktok.com/@hl.power';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          const mediaItems = [];
          if (data.images && Array.isArray(data.images)) {
            data.images.forEach(url => mediaItems.push({ type: 'image', url }));
          }
          if (data.video) {
            mediaItems.push({ type: 'video', url: data.video });
          }
          setMedia(mediaItems);
          setCurrentMediaIndex(0);
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ========== INJECT JSON‑LD SCHEMA FOR THIS PRODUCT (SEO) ==========
  useEffect(() => {
    if (!product) return;

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.images?.[0] || '',
      "description": product.description?.substring(0, 200) || '',
      "brand": { "@type": "Brand", "name": "HL Power" },
      "sku": product.productNo || id,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "KES",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "url": window.location.href
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(productSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [product, id]);

  const calculatePrices = () => {
    if (!product) return {};
    const basePrice = product.price || 0;
    const discount = product.discount || 0;
    const discountedPrice = basePrice - (basePrice * discount) / 100;
    const vatAmount = discountedPrice - discountedPrice / (1 + VAT_RATE);
    return { basePrice, discount, discountedPrice, vatAmount, finalPrice: discountedPrice };
  };

  const handlePrevMedia = () => {
    if (media.length <= 1) return;
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleNextMedia = () => {
    if (media.length <= 1) return;
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentMediaIndex(index);
  };

  const handleQuantityChange = (type) => {
    setQuantity(prev => type === 'inc' ? prev + 1 : Math.max(prev - 1, 1));
  };

  const handleAddToBasket = () => {
    addToBasket(product, quantity);
  };

  const handleBuyNow = () => {
    addToBasket(product, quantity);
    navigate('/basket');
  };

  const handleWhatsAppOrder = () => {
    const prices = calculatePrices();
    const total = prices.finalPrice * quantity;
    const message = `Hello HL Power! I'd like to order:\n\n*${product.title}*\nQuantity: ${quantity}\nPrice per unit: KSh ${prices.finalPrice.toFixed(2)}\nTotal: KSh ${total.toFixed(2)}\n\nProduct link: ${window.location.href}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFacebookShop = () => {
    window.open(FACEBOOK_URL, '_blank');
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    const newReview = { rating, text: reviewText, date: new Date().toISOString() };
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { reviews: arrayUnion(newReview) });
      setReviews(prev => [...prev, newReview]);
      setReviewText('');
      setRating(4);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  // Share functions
  const getShareUrl = () => window.location.href;

  const copyToClipboard = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Could not copy link. Please copy manually: " + url);
    }
  };

  const shareToFacebook = () => {
    const url = getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(product.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = getShareUrl();
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(product.title)}`, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(product.title + ' - ' + url)}`, '_blank');
  };

  const shareToEmail = () => {
    const url = getShareUrl();
    window.location.href = `mailto:?subject=${encodeURIComponent(product.title)}&body=${encodeURIComponent(`Check out this product: ${url}`)}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: getShareUrl(),
        });
        closeShareModal();
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    }
  };

  const openShareModal = () => {
    setShareModalOpen(true);
    setCopied(false);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setCopied(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-center">Product not found.</p>
      </div>
    );
  }

  const prices = calculatePrices();
  const totalPrice = prices.finalPrice * quantity;
  const currentMedia = media[currentMediaIndex] || { type: 'image', url: 'https://via.placeholder.com/600' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4 text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left column: Media gallery */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4">
              <div className="relative aspect-square sm:aspect-auto sm:h-96 flex items-center justify-center bg-gray-50">
                {currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    className="max-w-full max-h-full"
                    style={{ objectFit: 'contain' }}
                  />
                )}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextMedia}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                {media.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg cursor-pointer border-2 overflow-hidden ${
                      idx === currentMediaIndex ? 'border-teal-600' : 'border-gray-200'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                        <video src={item.url} className="w-full h-full object-cover" />
                        <Play size={24} className="absolute text-white opacity-70" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 mb-6 lg:mb-0">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle size={20} />
                Order on WhatsApp
              </button>
              <button
                onClick={handleFacebookShop}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Facebook size={20} />
                Shop on Facebook
              </button>
            </div>
          </div>

          {/* Right column: Product details */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex-1">{product.title}</h1>
                <button
                  onClick={openShareModal}
                  className="p-2 text-gray-500 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-100"
                  title="Share this product"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl mb-6">
                <h3 className="font-semibold mb-3 text-sm sm:text-base">Price Details</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  {prices.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span className="line-through text-gray-500">KSh {prices.basePrice.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Our Price:</span>
                    <span className="text-teal-600 text-base sm:text-xl">KSh {prices.finalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1"><Info size={14} /> Includes 16% VAT:</span>
                    <span>KSh {prices.vatAmount.toFixed(2)}</span>
                  </div>
                  {prices.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save:</span>
                      <span>KSh {(prices.basePrice - prices.finalPrice).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs whitespace-nowrap">
                    {product.category}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Product No:</span>
                  <span className="ml-2 font-mono text-xs">{product.productNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Available:</span>
                  <span className="ml-2">{product.quantity || 'In Stock'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <span className="ml-2">{product.size || 'Standard'}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 text-sm">Quantity</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex border rounded-lg overflow-hidden">
                    <button onClick={() => handleQuantityChange('dec')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-2 text-center w-12 text-sm">{quantity}</span>
                    <button onClick={() => handleQuantityChange('inc')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200">
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-semibold text-sm sm:text-base">Total: KSh {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToBasket}
                  className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Basket
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Buy Now
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <Truck size={18} className="mx-auto mb-1 text-teal-600" />
                  <span>Delivery</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <Shield size={18} className="mx-auto mb-1 text-teal-600" />
                  <span>Warranty</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <Clock size={18} className="mx-auto mb-1 text-teal-600" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-8 md:mt-12 bg-white rounded-2xl shadow-lg p-5 sm:p-6">
          <div className="border-b flex gap-4 sm:gap-6 mb-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-2 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'description' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-teal-600'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-teal-600'
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'faqs' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-600 hover:text-teal-600'
              }`}
            >
              FAQs
            </button>
          </div>

          <div className="text-sm sm:text-base">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p>{product.description || 'No description available.'}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="space-y-4 mb-6">
                  {reviews.length > 0 ? (
                    reviews.map((rev, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} size={14} className={star <= rev.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{new Date(rev.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{rev.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  )}
                </div>
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">Rating:</span>
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        size={18}
                        className={`cursor-pointer ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    rows="3"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-3 border rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-sm"
                  />
                  <button
                    onClick={handleAddReview}
                    className="mt-3 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm sm:text-base"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'faqs' && (
              <div>
                <p className="text-gray-500">Frequently asked questions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Share Modal - Bottom Sheet on Mobile, Centered on Desktop */}
      <AnimatePresence>
        {shareModalOpen && product && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeShareModal}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Share this product</h3>
                  <button onClick={closeShareModal} className="p-1 hover:bg-gray-100 rounded-full">
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.title}</p>

                {navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full mb-4 py-3 bg-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition"
                  >
                    <Smartphone size={18} />
                    Share via Device
                  </button>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={copyToClipboard}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                  >
                    {copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-gray-700" />}
                    <span className="text-xs font-medium">{copied ? "Copied!" : "Copy Link"}</span>
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#1877f2] hover:bg-[#0e5fc7] rounded-xl transition text-white"
                  >
                    <Facebook size={24} />
                    <span className="text-xs font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#1da1f2] hover:bg-[#0d8de8] rounded-xl transition text-white"
                  >
                    <Twitter size={24} />
                    <span className="text-xs font-medium">Twitter</span>
                  </button>

                  <button
                    onClick={shareToLinkedIn}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#0a66c2] hover:bg-[#084d96] rounded-xl transition text-white"
                  >
                    <Linkedin size={24} />
                    <span className="text-xs font-medium">LinkedIn</span>
                  </button>

                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#25d366] hover:bg-[#1da95a] rounded-xl transition text-white"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.562 1.098 3.677l-1.267 3.799 3.926-1.221c1.07.578 2.278.884 3.511.883 3.18 0 5.767-2.586 5.768-5.766.001-1.58-.614-3.065-1.727-4.176-.913-.91-2.102-1.413-3.351-1.413zm0 10.206c-1.054 0-2.087-.288-2.984-.834l-2.224.692.771-2.12c-.614-1.01-.94-2.158-.939-3.332.001-2.625 2.136-4.76 4.76-4.76 1.27 0 2.464.495 3.362 1.394.897.899 1.392 2.092 1.391 3.362-.001 2.625-2.136 4.76-4.76 4.76zm2.857-3.419c-.15-.075-1.26-.621-1.456-.692-.195-.071-.337-.107-.479.107-.142.214-.548.692-.672.834-.124.143-.248.161-.398.086-.15-.075-.636-.234-1.212-.748-.448-.4-.75-.892-.838-1.043-.088-.15-.01-.232.066-.307.068-.067.15-.178.225-.267.075-.089.1-.15.15-.25.05-.1.025-.186-.012-.26-.038-.075-.339-.817-.465-1.119-.122-.292-.246-.253-.338-.257-.087-.004-.187-.005-.287-.005-.1 0-.262.038-.399.188-.137.15-.523.511-.523 1.246 0 .735.535 1.445.61 1.545.075.1 1.053 1.607 2.549 2.254.356.154.634.246.851.315.358.113.684.097.941.059.287-.042.884-.361 1.008-.71.124-.349.124-.648.087-.71-.037-.063-.137-.1-.287-.175z"/>
                    </svg>
                    <span className="text-xs font-medium">WhatsApp</span>
                  </button>

                  <button
                    onClick={shareToEmail}
                    className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-gray-600 hover:bg-gray-700 rounded-xl transition text-white"
                  >
                    <Mail size={24} />
                    <span className="text-xs font-medium">Email</span>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <Globe size={12} />
                    {getShareUrl()}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;