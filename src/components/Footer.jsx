 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Facebook, Instagram,
  Youtube, ChevronUp, Send, Heart, Shield, Truck
} from "lucide-react";

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Social media links - UPDATED
  const socialLinks = {
    facebook: "https://www.facebook.com/share/1D4YwLWZfN/",
    instagram: "https://www.instagram.com/hlpowergenerators?igsh=NHZteG5oa3FyejBx",
    youtube: "https://www.youtube.com/@hlpowergenerators",
    tiktok: "https://tiktok.com/@hl.powergenerator"
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
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
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      {/* Back to Top Button */}
      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full shadow-lg hover:from-teal-700 hover:to-teal-600 transition-all hover:scale-110"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}

      <footer className="bg-gradient-to-r from-teal-800 to-teal-600 text-white pt-16 pb-8 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {/* Company Info */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <span className="text-2xl font-bold block">HL Power</span>
              <p className="text-teal-200 leading-relaxed">
                Premium generator brand owned by Hangool Enterprises Limited. 
                Providing reliable backup power solutions across Kenya since 2010.
              </p>
              <div className="flex gap-4 pt-2">
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Youtube size={20} />
                </motion.a>
                {/* TikTok icon using a simple SVG */}
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Products", path: "/products" },
                  { name: "Offers", path: "/offers" },
                  { name: "About Us", path: "/about" },
                  { name: "Blog", path: "/blog" },
                  { name: "Contact", path: "/contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-teal-200 hover:text-white transition flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-teal-400 rounded-full group-hover:w-2 transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-teal-300 mt-1 flex-shrink-0" />
                  <span className="text-teal-200">Industrial Area, Funzi Road, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-teal-300 flex-shrink-0" />
                  <a href="tel:+254799959279" className="text-teal-200 hover:text-white transition">
                    +254 799 959 279
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-teal-300 flex-shrink-0" />
                  <a href="mailto:hlpowergenerators@gmail.com" className="text-teal-200 hover:text-white transition">
                    hlpowergenerator@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={20} className="text-teal-300 flex-shrink-0" />
                  <span className="text-teal-200">Mon-Fri: 8am-6pm, Sat: 9am-2pm</span>
                </li>
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h3 className="text-xl font-bold relative inline-block">
                Newsletter
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"></span>
              </h3>
              <p className="text-teal-200">Subscribe for updates on new products and special offers.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-teal-500 to-teal-400 rounded-lg hover:from-teal-600 hover:to-teal-500 transition"
                  >
                    <Send size={16} />
                  </button>
                </div>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-300 text-sm"
                  >
                    Thank you for subscribing!
                  </motion.p>
                )}
              </form>

              {/* Trust badges */}
              <div className="flex gap-3 pt-4">
                <div className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full">
                  <Shield size={14} className="text-teal-300" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full">
                  <Truck size={14} className="text-teal-300" />
                  <span>Delivery</span>
                </div>
                <div className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full">
                  <Heart size={14} className="text-teal-300" />
                  <span>Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border-t border-white/20 pt-8 mt-8 text-center text-teal-200 text-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>&copy; {new Date().getFullYear()} HL Power. All rights reserved. Digital Brand 254717771909.</p>
              <div className="flex gap-4">
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Add animation keyframes to global CSS */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default Footer;