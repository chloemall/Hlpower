import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Shield, Users, Award, MapPin, Clock, Phone, Mail,
  CheckCircle, Zap, Heart, Globe, Briefcase, ChevronRight,
  Star, ThumbsUp, Truck, Wrench, Battery, Cpu, Settings,
  Headphones, Building, Home, Store, Hospital
} from "lucide-react";

const About = () => {
  // Images from previous requests
  const heroImage = "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.35%20AM.jpeg?alt=media&token=2a9f7ed2-20ae-42ed-85db-b261582ffbe3";
  const missionImage = "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.36%20AM.jpeg?alt=media&token=ea89b85a-687d-472e-9ae2-e827686760ec";
  const whyChooseImage = "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.38%20AM.jpeg?alt=media&token=caea7f57-79b2-4789-ae51-312416eb1ea7";
  const expertiseImage = "https://firebasestorage.googleapis.com/v0/b/law-5f0ed.firebasestorage.app/o/hlpower%2FWhatsApp%20Image%202026-02-22%20at%204.41.33%20AM.jpeg?alt=media&token=b207d97f-a702-42dd-bc5f-141eb428ce0a";
  const footprintImage = "https://firebasestorage.googleapis.com/v0/b/dollar-eda6d.firebasestorage.app/o/blog-images%2FWhatsApp_Image_2026-03-14_at_8.30.13_PM-removebg-preview.png?alt=media&token=b69af370-0f3a-4769-8009-c55a2ecc9e81";

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

  // Core values from profile
  const coreValues = [
    { icon: <Shield size={32} />, title: "Integrity", description: "Transparent and ethical business conduct in all our dealings." },
    { icon: <Zap size={32} />, title: "Reliability", description: "Consistent power performance when it matters most." },
    { icon: <Target size={32} />, title: "Innovation", description: "Adoption of modern engine and inverter technologies." },
    { icon: <Users size={32} />, title: "Professionalism", description: "Skilled technical and customer-focused teams." },
    { icon: <Heart size={32} />, title: "Customer Commitment", description: "Long-term service partnerships built on trust." }
  ];

  // Updated Product Portfolio – specific HL Power models
  const productCategories = [
    {
      title: "HL Power 18.7kVA Silent Diesel Generator with ATS",
      description: "Three phase, standby output 20.5kVA, automatic changeover.",
      icon: <Battery size={32} />
    },
    {
      title: "HL Power 11kVA Silent Diesel Generator with inbuilt ATS",
      description: "Three phase, automatic transfer switch.",
      icon: <Battery size={32} />
    },
    {
      title: "HL Power 12.5kVA Silent Diesel Generator Heavy-duty Manual",
      description: "Three phase, manual start, without ATS.",
      icon: <Settings size={32} />
    },
    {
      title: "HL Power 15kVA Silent Diesel Generator with ATS",
      description: "Single phase, automatic transfer switch.",
      icon: <Battery size={32} />
    },
    {
      title: "HL Power 6.5kVA Super Silent Inverter Petrol Generator",
      description: "Single phase, ultra-quiet inverter technology.",
      icon: <Zap size={32} />
    },
    {
      title: "HL Power 100kVA Cummins Engine Silent Diesel Generator with ATS",
      description: "Three phase, standby output 110kVA, automatic changeover, genuine Cummins engine.",
      icon: <Cpu size={32} />
    }
  ];

  // Our Approach steps
  const approachSteps = [
    "Needs Assessment – Load evaluation and technical consultation.",
    "Custom Solution Design – Matching generator capacity to client demand.",
    "Professional Installation – Safe delivery, offloading, positioning, and commissioning.",
    "Testing & Handover – Performance validation and client training.",
    "After-Sales Support – Maintenance, servicing, and spare parts support."
  ];

  // Core Services
  const coreServices = [
    "Generator supply and distribution",
    "Installation and commissioning",
    "Automatic Transfer Switch (ATS) integration",
    "Preventive maintenance and servicing",
    "Technical diagnostics and troubleshooting",
    "Capacity upgrades and custom power solutions"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24 overflow-hidden">
      {/* Hero Section - Dark Shiny Black */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="HL Power Generator"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-black/60"></div>
        <div className="container mx-auto px-6 lg:px-12 relative h-full flex items-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              About <span className="text-teal-300">HL Power</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              Premium generator brand owned by Hangool Enterprises Limited – powering Kenya with reliability since 2010.
            </p>
            <div className="flex items-center gap-4 text-white/80 text-sm mb-8 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={16} /> Industrial Area, Funzi Road, Nairobi</span>
              <span className="flex items-center gap-1"><Phone size={16} /> +254 799 959 279</span>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-teal-600 transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Get in Touch <ChevronRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Executive <span className="text-teal-600">Summary</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              HL Power is a premium generator brand owned and distributed by Hangool Enterprises Limited, a Nairobi-based company specializing in reliable backup power solutions. The brand is built on engineering excellence, reliability, fuel efficiency, and modern generator technology. HL Power delivers silent diesel and super silent inverter petrol generators designed for residential, commercial, industrial, and institutional applications across Kenya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us with Image */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-teal-600">HL Power</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Premium engineered generator systems with high performance output.",
                  "Genuine Cummins-powered heavy-duty models for superior reliability.",
                  "Fuel-efficient, low-noise technology suitable for modern environments.",
                  "Professional installation, commissioning, and after-sales support.",
                  "Strong technical and sales support team with hands-on expertise.",
                  "Proven track record in high-rise buildings, malls, hospitals, and residential estates."
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="text-teal-600 flex-shrink-0 mt-1" size={24} />
                    <p className="text-gray-700 text-lg">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={whyChooseImage}
                alt="HL Power Generator on site"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white p-6 rounded-2xl shadow-2xl">
                <p className="text-2xl font-bold">10+ Years</p>
                <p>of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-teal-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To provide dependable, fuel-efficient, and technologically advanced backup power solutions that ensure uninterrupted operations for homes, businesses, and industries.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-teal-50 to-white p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become East Africa's most trusted premium generator brand by delivering excellence in product quality, service reliability, and customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-teal-600">Values</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              The principles that guide our work and define our company culture.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  {value.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Portfolio – Updated with specific models */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-teal-600">Product Portfolio</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              A comprehensive range of generators for every need.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {productCategories.map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-teal-50 p-8 rounded-2xl shadow-lg border border-gray-100 flex gap-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {product.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-teal-600">Approach</span>
              </h2>
              <div className="space-y-4">
                {approachSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 text-lg">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={expertiseImage}
                alt="Technical expertise"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Core <span className="text-teal-600">Services</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comprehensive support from supply to after-sales.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coreServices.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4"
              >
                <CheckCircle className="text-teal-600 flex-shrink-0" size={24} />
                <span className="text-gray-700">{service}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* In-House Technical & Sales Expertise */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                In-House <span className="text-teal-600">Technical & Sales</span> Expertise
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Hangool Enterprises Limited maintains a dedicated team of qualified technical engineers and trained sales professionals. The technical team specializes in electrical load analysis, ATS integration, Cummins engine systems, generator control panels, and power system installation. The sales team provides consultative support, site assessments, and tailored product recommendations to ensure each client receives an optimal backup power solution.
              </p>
              <div className="flex items-center gap-4 text-teal-600">
                <div className="flex items-center gap-2">
                  <Wrench size={20} /> Engineers
                </div>
                <div className="flex items-center gap-2">
                  <Headphones size={20} /> 24/7 Support
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={expertiseImage}
                alt="Technical team"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Experience & Footprint */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Project <span className="text-teal-600">Experience</span>
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                HL Power generators have been supplied, delivered, and installed in modern tall buildings, residential estates, commercial malls, restaurants, and hospitals across Kenya. Key counties we have served include <span className="font-semibold">Nairobi, Kiambu, Mombasa, Kisumu, Nakuru, Isiolo, Eldoret, Mandera,</span> and many others cities.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Additionally, we have expanded our footprint to strategic regional markets including:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  "Kampala, Uganda",
                  "Kigali, Rwanda",
                  "Bujumbura, Burundi",
                  "Arusha, Tanzania",
                  "Lusaka, Zambia",
                  "Juba, South Sudan",
                  "Jubaland, Somalia"
                ].map((location, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Globe size={18} className="text-teal-600" />
                    <span className="text-gray-700">{location}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-lg italic">
                HL Power stands as a symbol of strength, reliability, and premium backup energy solutions — powering progress across East Africa and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={footprintImage}
                alt="HL Power installations"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Power Your World?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Contact us today for expert advice, unbeatable offers, and reliable backup power.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
              >
                Get a Quote
              </Link>
              <a
                href="tel:+254799959279"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition transform hover:scale-105"
              >
                Call +254 799 959 279
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;