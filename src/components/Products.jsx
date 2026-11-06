import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../context/BasketContext';
import { motion } from 'framer-motion';
import { Search, Tag, Percent, ShoppingCart, Eye, Filter, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(48);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalProductId, setModalProductId] = useState(null);
  const [showFilter, setShowFilter] = useState(false); // unified filter toggle
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

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

  const fetchProducts = async (category = 'all', search = '', page = 1) => {
    setLoading(true);
    try {
      let q;
      if (category !== 'all') {
        q = query(collection(db, 'products'), where('category', '==', category));
      } else {
        q = query(collection(db, 'products'));
      }

      const snapshot = await getDocs(q);
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allProducts.filter(product => {
        const title = product.title?.toLowerCase() || '';
        const cat = product.category?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        return title.includes(searchLower) || cat.includes(searchLower);
      });

      setTotalProducts(filtered.length);

      const paginated = filtered.slice(
        (page - 1) * productsPerPage,
        page * productsPerPage
      );

      setProducts(paginated);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    fetchProducts(category, searchQuery, 1);
    setShowFilter(false); // optional: close filter after selection
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchProducts(activeCategory, value, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(activeCategory, searchQuery, page);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
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
            Our <span className="text-teal-600">Products</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of premium generators for home, business, and industry.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
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
                All Products
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
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {products.map(product => {
                const discountedPrice = product.discount > 0
                  ? calculateDiscountedPrice(product.price, product.discount)
                  : product.price;

                return (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                  >
                    <div className="relative h-40 md:h-48 overflow-hidden group">
                      <img
                        src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openImageModal(product.id, product.images?.[0] || product.image)}
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => openImageModal(product.id, product.images?.[0] || product.image)}
                          className="p-2 bg-white rounded-full shadow-lg mr-2"
                        >
                          <Eye size={18} className="text-teal-600" />
                        </button>
                        <button
                          onClick={() => addToBasket(product, 1)}
                          className="p-2 bg-teal-600 rounded-full shadow-lg"
                        >
                          <ShoppingCart size={18} className="text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-gray-400 line-through text-sm">
                              KSh {product.price?.toLocaleString()}
                            </span>
                            <span className="text-teal-600 font-bold">
                              KSh {discountedPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-teal-600 font-bold">
                            KSh {product.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-full mt-2 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {products.length === 0 && (
              <p className="text-center text-gray-500 py-12">No products found.</p>
            )}

            {/* Pagination */}
            {totalProducts > productsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(totalProducts / productsPerPage) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-teal-50'
                      }`}
                    >
                      {i + 1}
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
                &times;
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
      </div>
    </div>
  );
};

export default Products;