import React, { useRef, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Basket from './components/Basket';
import Checkout from './components/Checkout';
import Offers from './components/Offers';
import Footer from './components/Footer';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { BasketProvider } from './context/BasketContext';
import Sitemap from './components/Sitemap';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const navbarRef = useRef(null);
  const chatModalRef = useRef(null);
  const whatsappButtonRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);

  // Use ResizeObserver for precise height updates
  useEffect(() => {
    if (!navbarRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setNavbarHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(navbarRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Close chat modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target) &&
          whatsappButtonRef.current && !whatsappButtonRef.current.contains(event.target)) {
        setChatVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleChat = () => setChatVisible(prev => !prev);

  const openWhatsApp = (message = '') => {
    const phoneNumber = '254799959279';
    const defaultMessage = "Hello HL Power! I'm interested in your generators.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
    window.open(url, '_blank');
    setChatVisible(false);
  };

  const handleQuickAction = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    let message = '';
    switch (action) {
      case 'quote':
        message = "Hello HL Power! I'd like to request a quote for a generator.";
        break;
      case 'emergency':
        message = "URGENT: I need immediate generator support!";
        break;
      case 'support':
        message = "Hello HL Power! I need technical support for my generator.";
        break;
      default:
        message = "Hello HL Power! I need assistance.";
    }
    openWhatsApp(message);
  };

  return (
    <BasketProvider>
      {/* CSS reset – removes all default margins/paddings */}
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        * {
          box-sizing: border-box;
        }
        /* Force remove top margin from first element inside main */
        main > *:first-child {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
      `}</style>

      <Navbar ref={navbarRef} />
      <ScrollToTop />

      {/* Main content – paddingTop ensures it starts below fixed navbar */}
      <main style={{ paddingTop: navbarHeight, marginTop: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sitemap.xml" element={<Sitemap />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/offers" element={<Offers />} />
        </Routes>
      </main>

      {/* Floating buttons and modal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          ref={whatsappButtonRef}
          onClick={toggleChat}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-bounce-slow hover:animate-none relative group"
          aria-label="Open WhatsApp chat"
        >
          <FaWhatsapp className="text-3xl" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat with us
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </button>

        <a
          href="tel:+254799959279"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 animate-pulse-slow hover:animate-none relative group"
          aria-label="Emergency call"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Call us: +254 799 959 279
            <div className="absolute -bottom-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </a>
      </div>

      {chatVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setChatVisible(false);
          }}
        >
          <div
            ref={chatModalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold">HL Power Support</h3>
                    <p className="text-sm text-blue-100">Generator Experts</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatVisible(false)}
                  className="text-white hover:text-blue-200 text-xl transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label="Close chat"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Chat body */}
            <div className="flex-grow overflow-y-auto p-4 bg-blue-50">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">HL</span>
                </div>
                <div className="bg-white rounded-xl rounded-tl-none p-4 shadow-sm max-w-[80%]">
                  <p className="text-gray-800">
                    Hello! Welcome to HL Power. How can we assist you with generator sales, installation, or support?
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Online now</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600 mb-2 font-medium">Quick Actions:</div>

                <button
                  onClick={(e) => handleQuickAction('quote', e)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-blue-100 hover:bg-blue-50 transition-all duration-200 hover:shadow-md flex items-start gap-3 group active:scale-95"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-xl">💰</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-blue-700">Get a Quote</div>
                    <div className="text-sm text-gray-600 mt-1">Request pricing for generators</div>
                  </div>
                </button>

                <button
                  onClick={(e) => handleQuickAction('emergency', e)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-red-100 hover:bg-red-50 transition-all duration-200 hover:shadow-md flex items-start gap-3 group active:scale-95"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <span className="text-red-600 text-xl">🚨</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-red-600">Emergency Support</div>
                    <div className="text-sm text-gray-600 mt-1">Immediate technical assistance</div>
                  </div>
                </button>

                <button
                  onClick={(e) => handleQuickAction('support', e)}
                  className="w-full text-left p-4 bg-white rounded-xl border border-green-100 hover:bg-green-50 transition-all duration-200 hover:shadow-md flex items-start gap-3 group active:scale-95"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-xl">💬</span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-green-700">General Inquiry</div>
                    <div className="text-sm text-gray-600 mt-1">Ask about products or services</div>
                  </div>
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-gray-700 mb-2 font-medium">Direct Contact:</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📞</span>
                    <span className="text-sm">Emergency: <span className="font-semibold">+254 799 959 279</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">💬</span>
                    <span className="text-sm">WhatsApp: <span className="font-semibold">+254 799 959 279</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✉️</span>
                    <span className="text-sm">Email: <span className="font-semibold">hlpowergenerator@gmail.com</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✉️</span>
                    <span className="text-sm">Sales: <span className="font-semibold">sales@hlpowergenerator.com</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat footer */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => openWhatsApp()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <FaWhatsapp className="text-xl" />
                Open WhatsApp
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Response time: Usually within minutes
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </BasketProvider>
  );
};

export default App;