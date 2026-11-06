 import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle, User,
  Building, MessageCircle, Facebook, Instagram, Youtube
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  // Social media links - UPDATED
  const socialLinks = {
    facebook: "https://www.facebook.com/share/1D4YwLWZfN/",
    instagram: "https://www.instagram.com/hlpowergenerators?igsh=NHZteG5oa3FyejBx",
    youtube: "https://www.youtube.com/@hlpowergenerators",
    tiktok: "https://tiktok.com/@hl.powergenerator"
  };

  const contactInfo = [
    { icon: <Phone size={24} />, title: "Phone", details: ["+254 799 959 279"], color: "from-teal-500 to-teal-400" },
    { icon: <Mail size={24} />, title: "Email", details: ["hlpowergenerator@gmail.com", "sales@hlpowergenerator.com"], color: "from-purple-500 to-pink-400" },
    { icon: <MapPin size={24} />, title: "Address", details: ["Industrial Area, Funzi Road", "Nairobi, Kenya"], color: "from-green-500 to-emerald-400" },
    { icon: <Clock size={24} />, title: "Working Hours", details: ["Mon-Fri: 8am - 6pm", "Sat: 9am - 2pm"], color: "from-orange-500 to-yellow-400" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `*New Inquiry from HL Power Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Company:* ${formData.company}%0A*Message:* ${formData.message}`;
    window.open(`https://wa.me/254799959279?text=${message}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
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
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 overflow-hidden">
      {/* Hero Section - Dark Shiny Black */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-24 overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"
        />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In <span className="text-teal-300">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're here to help with all your generator needs. Reach out today for expert advice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mx-auto mb-6 text-white`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">{detail}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-white to-teal-50 rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <MessageCircle size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600">We'll reply via WhatsApp within minutes.</p>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">WhatsApp opened with your message. Our team will respond shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                          placeholder="+254 712 345 678"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      required
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      placeholder="Tell us about your generator needs, capacity, and any specific requirements..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle size={20} />
                    Send via WhatsApp
                  </motion.button>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    By submitting, you agree to our privacy policy and consent to being contacted.
                  </p>
                </form>
              )}
            </motion.div>

            {/* Right: Map & Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-96">
                <iframe
                  title="HL Power Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816216986289!2d36.8294444!3d-1.2922222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1136d5e2b8b3%3A0x8f5b5c5e5e5e5e5e!2sIndustrial%20Area%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Quick Contact & Social */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
                <div className="space-y-4 mb-6">
                  <a href="tel:+254799959279" className="flex items-center gap-3 hover:text-teal-200 transition">
                    <Phone size={20} />
                    <span>+254 799 959 279</span>
                  </a>
                  <a href="mailto:hlpowergenerator@gmail.com" className="flex items-center gap-3 hover:text-teal-200 transition">
                    <Mail size={20} />
                    <span>hlpowergenerator@gmail.com</span>
                  </a>
                  <a href="mailto:sales@hlpowergenerator.com" className="flex items-center gap-3 hover:text-teal-200 transition">
                    <Mail size={20} />
                    <span>sales@hlpowergenerator.com</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="mt-1" />
                    <span>Industrial Area, Funzi Road, Nairobi, Kenya</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    <Facebook size={20} />
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    <Instagram size={20} />
                  </a>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    <Youtube size={20} />
                  </a>
                  {/* TikTok SVG */}
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-teal-600">Questions</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Quick answers to common questions about our generators and services.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                question: "What's the best way to contact you?",
                answer: "For fastest response, use WhatsApp (+254 799 959 279) or fill our contact form. You can also call our office line."
              },
              {
                question: "Do you offer free delivery?",
                answer: "No, delivery fee depends on the generator size and your location. We provide a quote before dispatch."
              },
              {
                question: "How much does installation cost?",
                answer: "Installation cost varies by generator model and complexity. Our team provides a detailed quote after assessment."
              },
              {
                question: "What areas do you serve?",
                answer: "We serve Nairobi and surrounding areas, and can arrange delivery across Kenya."
              },
              {
                question: "Do you provide after-sales support?",
                answer: "Yes, we offer 24/7 technical support, maintenance, and spare parts for all our generators."
              },
              {
                question: "Can I get a custom generator solution?",
                answer: "Absolutely. We provide tailored power solutions based on your load requirements and budget."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Our team is ready to assist you with any inquiries.
            </p>
            <a
              href="https://wa.me/254799959279"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;