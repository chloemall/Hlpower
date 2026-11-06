import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu as MenuIcon,
  X as CloseIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Package as PackageIcon,
  Tag as TagIcon,
  MessageSquare as MessageIcon,
  ShoppingCart as CartIcon
} from "lucide-react";
import { useBasket } from "../context/BasketContext";

const Navbar = React.forwardRef((props, ref) => {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { basket } = useBasket();

  const contactInfo = [
    { type: "phone", value: "+254799959279" },
    { type: "email", value: "hlpowergenerator@gmail.com" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenu(!menu);
  const closeMenu = () => setMenu(false);

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon size={18} /> },
    { name: "Products", path: "/products", icon: <PackageIcon size={18} /> },
    { name: "Offers", path: "/offers", icon: <TagIcon size={18} /> },
    { name: "About", path: "/about", icon: <InfoIcon size={18} /> },
    { name: "Blog", path: "/blog", icon: <MessageIcon size={18} /> },
    { name: "Contact", path: "/contact", icon: <PhoneIcon size={18} /> },
  ];

  return (
    <div ref={ref} className="fixed w-full z-50">
      {/* Top Contact Bar - solid background */}
      <div className="bg-teal-700 p-2 text-white text-sm font-medium flex justify-center lg:justify-between lg:px-12 items-center">
        <span className="hidden lg:flex items-center gap-2 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Industrial Area, Funzi Road, Nairobi, Kenya
        </span>
        <span className="hidden lg:flex items-center gap-8">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="flex items-center gap-2 hover:text-teal-200 transition-colors">
              {info.type === "phone" ? (
                <PhoneIcon size={16} className="text-teal-300" />
              ) : (
                <MailIcon size={16} className="text-teal-300" />
              )}
              <span className="text-xs">{info.value}</span>
            </div>
          ))}
        </span>
        <div className="lg:hidden flex items-center gap-2">
          <PhoneIcon size={16} className="text-teal-300" />
          <span className="text-xs">+254799959279</span>
        </div>
      </div>

      {/* Main Navbar - padding adjusted to keep height with larger logo */}
      <div className={`bg-white transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo - larger image, no gradients */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavigation("/")}
          >
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/dollar-eda6d.firebasestorage.app/o/blog-images%2FWhatsApp_Image_2026-03-14_at_8.30.13_PM-removebg-preview.png?alt=media&token=b69af370-0f3a-4769-8009-c55a2ecc9e81"
              alt="HL Power Logo"
              className="w-14 h-14 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-teal-700">
                HL Power
              </span>
              <span className="text-xs text-gray-500">Home of Generators</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200 group"
              >
                <span className="text-teal-500 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
            <button 
              onClick={() => handleNavigation("/basket")}
              className="ml-4 px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <CartIcon size={18} />
              Basket ({basket.totalItems})
            </button>
          </nav>

          {/* Mobile: Basket icon + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => handleNavigation("/basket")}
              className="relative p-2 text-teal-600 hover:text-teal-800 transition-colors"
              aria-label="Basket"
            >
              <CartIcon size={24} />
              {basket.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {basket.totalItems}
                </span>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 text-teal-600 hover:text-teal-800 transition-colors"
              aria-label="Menu"
            >
              {menu ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-64 bg-white transform transition-transform duration-300 z-40 ${
          menu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/dollar-eda6d.firebasestorage.app/o/blog-images%2FWhatsApp_Image_2026-03-14_at_8.30.13_PM-removebg-preview.png?alt=media&token=b69af370-0f3a-4769-8009-c55a2ecc9e81"
                alt="HL Power Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-teal-700">HL Power</span>
            </div>
            <CloseIcon 
              size={20} 
              className="text-gray-500 cursor-pointer" 
              onClick={closeMenu}
            />
          </div>
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
              >
                <span className="text-teal-500">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menu && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        ></div>
      )}
    </div>
  );
});

export default Navbar;