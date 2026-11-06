import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useBasket } from "../context/BasketContext";
import {
  ArrowRight, ShoppingCart, Eye, Percent, Flame, Zap,
  Clock, Truck, Wrench, ChevronLeft, ChevronRight
} from "lucide-react";

// Marketing image URL (using an existing generator image)
const marketingImage = "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.35%20AM.jpeg?alt=media&token=2a9f7ed2-20ae-42ed-85db-b261582ffbe3";

const Home = () => {
  // Provided slide images
  const slideImages = [
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.35%20AM.jpeg?alt=media&token=2a9f7ed2-20ae-42ed-85db-b261582ffbe3",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.36%20AM.jpeg?alt=media&token=ea89b85a-687d-472e-9ae2-e827686760ec",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.38%20AM.jpeg?alt=media&token=caea7f57-79b2-4789-ae51-312416eb1ea7",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.35%20AM.jpeg?alt=media&token=2a9f7ed2-20ae-42ed-85db-b261582ffbe3",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.36%20AM.jpeg?alt=media&token=ea89b85a-687d-472e-9ae2-e827686760ec",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.38%20AM.jpeg?alt=media&token=caea7f57-79b2-4789-ae51-312416eb1ea7"
  ];

  const [slides] = useState(
    slideImages.map((img, idx) => ({
      image: img,
      title: idx === 0 ? "Emergency Home Backup" :
             idx === 1 ? "Industrial Generator Repairs" :
             idx === 2 ? "Silent Diesel Technology" :
             idx === 3 ? "Construction Site Power" :
             idx === 4 ? "Modern Generator Engineering" :
             "HL Power 80kVA Generator",
      subtitle: idx === 0 ? "Automatic power for your home" :
                idx === 1 ? "Expert service across Kenya" :
                idx === 2 ? "Quiet, efficient, reliable" :
                idx === 3 ? "Heavy-duty solutions" :
                idx === 4 ? "Cutting-edge design" :
                "Premium quality, locally supported"
    }))
  );

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const offersRowRef = useRef(null);
  const blogRowRef = useRef(null);
  const navigate = useNavigate();
  const { addToBasket } = useBasket();

  // Provided blog images and dummy data
  const blogImages = [
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.33%20AM.jpeg?alt=media&token=b207d97f-a702-42dd-bc5f-141eb428ce0a",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.36%20AM.jpeg?alt=media&token=68b4a94d-5339-454a-9af2-7166777e6ec9",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.37%20AM.jpeg?alt=media&token=52fceb43-d3f5-4a7b-a0fe-0a38181fdb7e",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.38%20AM.jpeg?alt=media&token=caea7f57-79b2-4789-ae51-312416eb1ea7",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.36%20AM.jpeg?alt=media&token=ea89b85a-687d-472e-9ae2-e827686760ec",
    "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.35%20AM.jpeg?alt=media&token=2a9f7ed2-20ae-42ed-85db-b261582ffbe3"
  ];

  const blogTitles = [
    "HL Power 80kVA – Now in Stock",
    "Whole‑House Generator Installation Guide",
    "Expert Generator Repair Services",
    "Industrial Generator Maintenance Tips",
    "Choosing the Right Generator for Your Business",
    "Portable Power for Emergency Preparedness"
  ];

  const blogExcerpts = [
    "Our most popular three‑phase generator is available for immediate delivery. Features genuine Cummins engine and ATS.",
    "Learn what it takes to install a whole‑house backup system. From load calculation to final commissioning.",
    "Our technicians share common faults and how to avoid them. Keep your generator running year‑round.",
    "Keep your industrial generator running smoothly with these preventive maintenance tips from our experts.",
    "A step‑by‑step guide to sizing and selecting commercial generators for your business needs.",
    "Why every home should consider a portable generator for outages. Models from 1.5kVA to 7.5kVA."
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products for popular products row (limit 8)
        const productsQuery = query(collection(db, "products"), limit(8));
        const productsSnapshot = await getDocs(productsQuery);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);

        // Fetch up to 50 products for offers carousel
        const offersQuery = query(collection(db, "products"), limit(50));
        const offersSnapshot = await getDocs(offersQuery);
        const allProducts = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Separate discounted and non-discounted products
        const discounted = allProducts
          .filter(p => {
            const discount = parseFloat(p.discount);
            return !isNaN(discount) && discount >= 1;
          })
          .sort((a, b) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0));

        const nonDiscounted = allProducts
          .filter(p => {
            const discount = parseFloat(p.discount);
            return isNaN(discount) || discount < 1;
          })
          .sort((a, b) => (a.title || '').localeCompare(b.title || '')); // sort by title for consistency

        // Combine: take all discounted first, then fill up to 10 with non-discounted
        let offersList = [...discounted];
        if (offersList.length < 10) {
          const needed = 10 - offersList.length;
          // Add unique products from nonDiscounted that are not already in offersList
          const existingIds = new Set(offersList.map(p => p.id));
          const filler = nonDiscounted.filter(p => !existingIds.has(p.id)).slice(0, needed);
          offersList = [...offersList, ...filler];
        }

        setOffers(offersList);

        // Set blogs (dummy data)
        setBlogs(blogImages.map((img, idx) => ({
          id: `blog-${idx}`,
          title: blogTitles[idx],
          excerpt: blogExcerpts[idx],
          image: img,
          date: new Date(2025, 3, 10 + idx).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          author: "HL Power Team"
        })));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollOffers = (direction) => {
    if (offersRowRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'right'
        ? offersRowRef.current.scrollLeft + scrollAmount
        : offersRowRef.current.scrollLeft - scrollAmount;
      offersRowRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const scrollBlogs = (direction) => {
    if (blogRowRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'right'
        ? blogRowRef.current.scrollLeft + scrollAmount
        : blogRowRef.current.scrollLeft - scrollAmount;
      blogRowRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    const numericDiscount = parseFloat(discount) || 0;
    return price - (price * numericDiscount) / 100;
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
      transition: { staggerChildren: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 overflow-hidden">
      {/* Hero Slides - Dark overlay removed */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay removed as requested */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={index === currentSlide ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center text-center"
            >
              <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
                  {slide.subtitle}
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-600 transition-all transform hover:-translate-y-1 shadow-2xl"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ))}
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Offers Row - Horizontally Scrollable (always up to 10 items) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Special <span className="text-teal-600">Offers</span>
            </h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollOffers('left')}
                className="p-2 bg-teal-50 rounded-full shadow hover:bg-teal-100 transition"
                aria-label="Scroll offers left"
              >
                <ChevronLeft size={24} className="text-teal-600" />
              </button>
              <button
                onClick={() => scrollOffers('right')}
                className="p-2 bg-teal-50 rounded-full shadow hover:bg-teal-100 transition"
                aria-label="Scroll offers right"
              >
                <ChevronRight size={24} className="text-teal-600" />
              </button>
            </div>
          </motion.div>

          {/* Scrollable container */}
          <div className="relative">
            <div className="md:hidden text-center mb-3 text-sm text-gray-500">
              ← Swipe to see more offers →
            </div>
            <motion.div
              ref={offersRowRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {offers.map((product) => {
                const discount = parseFloat(product.discount) || 0;
                const discountedPrice = discount >= 1
                  ? calculateDiscountedPrice(product.price, discount)
                  : product.price;
                const hasDiscount = discount >= 1;
                return (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                    className="flex-shrink-0 w-64 bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-40 overflow-hidden group">
                      <img
                        src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {hasDiscount && discount >= 50 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <Flame size={12} /> MEGA SALE
                        </div>
                      )}
                      {hasDiscount && discount < 50 && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {discount}% OFF
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
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
                        {hasDiscount ? (
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
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        {hasDiscount ? (
                          <>
                            <span className="flex items-center gap-1">
                              <Percent size={14} /> {discount}% OFF
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> Limited
                            </span>
                          </>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Truck size={14} /> In Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            {offers.length === 0 && (
              <p className="text-center text-gray-500 py-8">No products available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Marketing Card - Fully Responsive */}
      <div className="container mx-auto px-6 my-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Text Content */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Premium Power Solutions
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 leading-relaxed">
                Discover our range of reliable, fuel-efficient generators for home, business, and industry. Backed by expert support and genuine Cummins technology.
              </p>
              <Link
                to="/products"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition text-sm md:text-base"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right: Image */}
            <div className="h-64 md:h-full">
              <img
                src={marketingImage}
                alt="HL Power Generator"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Row */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular <span className="text-teal-600">Products</span>
            </h2>
            <Link to="/products" className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="relative h-40 overflow-hidden group">
                  <img
                    src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {parseFloat(product.discount) > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
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
                  <p className="text-teal-600 font-bold mb-2">
                    KSh {product.discount > 0
                      ? calculateDiscountedPrice(product.price, product.discount).toLocaleString()
                      : product.price?.toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full mt-2 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Explanation */}
      <section className="py-16 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            Why Choose <span className="text-teal-600">HL Power</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "24/7 Technical Support", desc: "Round-the-clock assistance from expert engineers." },
              { icon: Truck, title: "Delivery Fee Depends on Machine", desc: "Cost calculated based on generator size and location." },
              { icon: Wrench, title: "Installation Depends on Machine", desc: "Professional installation priced per generator model." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrollable Blog Row */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest from <span className="text-teal-600">Blog</span>
            </h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollBlogs('left')}
                className="p-2 bg-teal-50 rounded-full shadow hover:bg-teal-100"
                aria-label="Scroll blog left"
              >
                <ChevronLeft size={24} className="text-teal-600" />
              </button>
              <button
                onClick={() => scrollBlogs('right')}
                className="p-2 bg-teal-50 rounded-full shadow hover:bg-teal-100"
                aria-label="Scroll blog right"
              >
                <ChevronRight size={24} className="text-teal-600" />
              </button>
            </div>
          </motion.div>

          <div className="relative">
            <div className="md:hidden text-center mb-3 text-sm text-gray-500">
              ← Swipe to see more articles →
            </div>
            <motion.div
              ref={blogRowRef}
              className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <p className="text-sm text-teal-600 mb-2">{blog.date}</p>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Ready to Power Your World?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Contact us today for expert advice and the best generator deals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition transform hover:scale-105"
            >
              Get a Quote
            </Link>
            <a
              href="tel:+254799959279"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition transform hover:scale-105"
            >
              Call +254 799 959 279
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;