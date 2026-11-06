import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { motion } from 'framer-motion';
import {
  Percent, ShoppingCart, Eye, Flame, Zap, Clock,
  Search, Heart, X, ArrowLeft, Star, Tag, TrendingUp, Filter
} from 'lucide-react';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(48);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalProductId, setModalProductId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showFilter, setShowFilter] = useState(false); // unified filter toggle
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hlpower_favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('hlpower_favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'products'));
        const snapshot = await getDocs(q);
        const cats = new Set();
        snapshot.forEach(doc => {
          const category = doc.data()?.category;
          if (category) cats.add(category);
        });
        setCategories([...cats]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch and filter products
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'));
        const snapshot = await getDocs(q);
        let all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Keep only products with discount >= 1
        all = all.filter(p => p.discount && p.discount >= 1);

        // Sort by discount descending
        all.sort((a, b) => (b.discount || 0) - (a.discount || 0));

        setProducts(all);
        applyFilters(all, activeCategory, searchQuery);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Apply filters whenever category, search, or products change
  const applyFilters = (productList = products, category = activeCategory, search = searchQuery) => {
    let filtered = [...productList];

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower)
      );
    }

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    applyFilters(products, category, searchQuery);
    setShowFilter(false); // optional: close filter after selection
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    applyFilters(products, activeCategory, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const calculateSavings = (price, discount) => {
    return (price * discount) / 100;
  };

  const getDiscountBadge = (discount) => {
    if (discount >= 50) return { text: 'MEGA SALE', icon: Flame, color: 'bg-red-500' };
    if (discount >= 30) return { text: 'HOT DEAL', icon: Zap, color: 'bg-orange-500' };
    if (discount >= 20) return { text: 'SPECIAL', icon: Percent, color: 'bg-purple-500' };
    return { text: 'DISCOUNT', icon: Percent, color: 'bg-green-500' };
  };

  const openImageModal = (productId, imageUrl) => {
    setModalImage(imageUrl);
    setModalProductId(productId);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalProductId(null);
  };

  const goToProductDetails = () => {
    if (modalProductId) {
      navigate(`/product/${modalProductId}`);
      closeModal();
    }
  };

  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Special <span className="text-teal-600">Offers</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited time discounts on premium generators. Grab the best deals before they're gone!
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Filter Toggle Button (always visible) */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full font-semibold shadow-lg hover:bg-teal-700 transition"
          >
            <Filter size={18} />
            {showFilter ? 'Hide Categories' : 'Filter by Category'}
          </button>
        </div>

        {/* Scrollable Category Row (conditionally shown) */}
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-medium text-gray-700">Categories</span>
              <button onClick={() => setShowFilter(false)} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Offers
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition capitalize whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No offers found.</p>
              </div>
            ) : (
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {currentProducts.map(product => {
                  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                  const savings = calculateSavings(product.price, product.discount);
                  const badge = getDiscountBadge(product.discount);
                  const isFavorite = favorites.has(product.id);
                  const BadgeIcon = badge.icon;

                  return (
                    <motion.div
                      key={product.id}
                      variants={fadeInUp}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden relative group"
                    >
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        <Heart
                          size={18}
                          className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                      </button>

                      {/* Discount Badge */}
                      <div className={`absolute top-2 left-2 z-10 ${badge.color} text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1`}>
                        <BadgeIcon size={12} />
                        <span>{badge.text}</span>
                      </div>

                      {/* Image */}
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <img
                          src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                          alt={product.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openImageModal(product.id, product.images?.[0] || product.image)}
                        />
                        {/* Quick actions overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => openImageModal(product.id, product.images?.[0] || product.image)}
                            className="p-2 bg-white rounded-full shadow-lg mr-2 hover:bg-gray-100"
                          >
                            <Eye size={18} className="text-teal-600" />
                          </button>
                          <button
                            onClick={() => addToBasket(product, 1)}
                            className="p-2 bg-teal-600 rounded-full shadow-lg hover:bg-teal-700"
                          >
                            <ShoppingCart size={18} className="text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-400 line-through text-sm">
                            KSh {product.price?.toLocaleString()}
                          </span>
                          <span className="text-teal-600 font-bold">
                            KSh {discountedPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Tag size={14} /> Save KSh {savings.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> Limited
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="w-full py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-teal-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              >
                <X size={24} />
              </button>
              <img src={modalImage} alt="Product" className="w-full h-auto max-h-[80vh] object-contain" />
              <div className="p-4 flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={goToProductDetails}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-teal-800 to-teal-600 text-white p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-center mb-6">Why Shop Our Discounts?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">Best Prices</div>
              <p className="text-sm text-teal-200">Guaranteed lowest prices</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold">Fast Delivery</div>
              <p className="text-sm text-teal-200">Quick shipping across Kenya</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-semibold">Quality Guarantee</div>
              <p className="text-sm text-teal-200">Premium quality products</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔄</div>
              <div className="font-semibold">Easy Returns</div>
              <p className="text-sm text-teal-200">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;