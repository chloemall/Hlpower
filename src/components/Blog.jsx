 import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, Search, Tag, X, Image as ImageIcon,
  Video as VideoIcon, Share2, Check, Facebook, Twitter, Linkedin,
  Mail, Copy, Globe, Smartphone
} from "lucide-react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharePost, setSharePost] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate?.() || new Date(),
          images: doc.data().images || (doc.data().image ? [doc.data().image] : []),
          videos: doc.data().videos || (doc.data().videoUrl ? [doc.data().videoUrl] : [])
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle sharing via URL parameter
  useEffect(() => {
    const handleUrlPost = async () => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get("post");
      if (postId) {
        let post = posts.find(p => p.id === postId);
        if (!post && posts.length > 0) {
          try {
            const postDoc = await getDoc(doc(db, "blogs", postId));
            if (postDoc.exists()) {
              const data = postDoc.data();
              post = {
                id: postDoc.id,
                ...data,
                date: data.date?.toDate?.() || new Date(),
                images: data.images || (data.image ? [data.image] : []),
                videos: data.videos || (data.videoUrl ? [data.videoUrl] : [])
              };
            }
          } catch (error) {
            console.error("Error fetching shared post:", error);
          }
        }
        if (post) {
          setSelectedPost(post);
          setDrawerOpen(true);
          document.body.style.overflow = 'hidden';
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    };
    if (posts.length > 0 || !loading) {
      handleUrlPost();
    }
  }, [posts, loading]);

  /**
   * Process HTML content to ensure:
   * - Only explicit <a> tags become links (no auto-linkification)
   * - All links open in a new tab with security attributes
   * - No unintended link creation from plain URLs
   */
  const processContent = (html) => {
    if (!html) return html;
    // Use a temporary div to safely manipulate only <a> elements
    const div = document.createElement('div');
    div.innerHTML = html;
    const links = div.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      // Add a class for additional styling if needed
      link.classList.add('blog-link');
    });
    return div.innerHTML;
  };

  const categories = ["all", ...new Set(posts.map(post => post.category).filter(Boolean))];

  const filtered = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(search.toLowerCase()) ||
                          post.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(p => p.featured);

  const openDrawer = (post) => {
    setSelectedPost(post);
    setDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
    if (window.location.search.includes('post=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const openShareModal = (post) => {
    setSharePost(post);
    setShareModalOpen(true);
    setCopied(false);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setSharePost(null);
    setCopied(false);
  };

  const getShareUrl = (post) => {
    return `${window.location.origin}${window.location.pathname}?post=${post.id}`;
  };

  const copyToClipboard = async () => {
    if (!sharePost) return;
    const url = getShareUrl(sharePost);
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
    const url = getShareUrl(sharePost);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = getShareUrl(sharePost);
    const text = encodeURIComponent(sharePost.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = getShareUrl(sharePost);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(sharePost.title)}`, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = getShareUrl(sharePost);
    window.open(`https://wa.me/?text=${encodeURIComponent(sharePost.title + ' - ' + url)}`, '_blank');
  };

  const shareToEmail = () => {
    const url = getShareUrl(sharePost);
    window.location.href = `mailto:?subject=${encodeURIComponent(sharePost.title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share && sharePost) {
      try {
        await navigator.share({
          title: sharePost.title,
          text: sharePost.excerpt,
          url: getShareUrl(sharePost),
        });
        closeShareModal();
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-24 overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://powersolutions.co.ke/wp-content/uploads/2025/04/HL-POWER-80KVA-Generator2-FB-PSK.png')] bg-cover bg-center"
        />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              HL Power <span className="text-teal-300">Blog</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Insights, guides, and news about generators, power solutions, and energy efficiency.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
              onClick={() => openDrawer(featuredPost)}
            >
              <div className="lg:flex">
                <div className="lg:w-2/3 relative">
                  <img
                    src={featuredPost.images?.[0] || 'https://via.placeholder.com/800x400'}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="lg:w-1/3 p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Calendar size={14} />
                      {featuredPost.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock size={14} />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{featuredPost.author?.[0] || 'H'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="py-10">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category !== "all" && (
                  <span className="ml-2 text-sm opacity-75">
                    ({posts.filter(p => p.category === category).length})
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 text-lg"
            >
              No blog posts found.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filtered.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openDrawer(post)}>
                    <img
                      src={post.images?.[0] || 'https://via.placeholder.com/400x200'}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-teal-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Tag size={12} /> {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 cursor-pointer" onClick={() => openDrawer(post)}>
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 cursor-pointer" onClick={() => openDrawer(post)}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {post.author?.split(' ').map(n => n[0]).join('') || 'HP'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">{post.author || 'HL Power'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openShareModal(post);
                        }}
                        className="p-2 text-gray-500 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Share this post"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Stay Powered Up</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest generator news, tips, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Right Drawer for Blog Post */}
      <AnimatePresence>
        {drawerOpen && selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-900">Blog Post</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openShareModal(selectedPost)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Share this post"
                  >
                    <Share2 size={18} className="text-gray-500" />
                  </button>
                  <button
                    onClick={closeDrawer}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Images */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon size={20} className="text-teal-600" />
                      Images ({selectedPost.images.length})
                    </h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2">
                      {selectedPost.images.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-64 h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`${selectedPost.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {selectedPost.videos && selectedPost.videos.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <VideoIcon size={20} className="text-teal-600" />
                      Videos ({selectedPost.videos.length})
                    </h3>
                    <div className="space-y-4">
                      {selectedPost.videos.map((video, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden bg-gray-100">
                          <video src={video} controls className="w-full max-h-80 object-contain" controlsList="nodownload" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {selectedPost.date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {selectedPost.readTime}
                    </span>
                    <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                      <Tag size={12} />
                      {selectedPost.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {selectedPost.author?.split(' ').map(n => n[0]).join('') || 'HP'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedPost.author || 'HL Power'}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                </div>

                {/* Content - only explicit <a> tags become links; plain text URLs remain plain */}
                <div className="blog-content prose prose-lg max-w-none text-gray-700">
                  {selectedPost.content ? (
                    <div dangerouslySetInnerHTML={{ __html: processContent(selectedPost.content) }} />
                  ) : (
                    <p className="text-gray-600">{selectedPost.excerpt}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive Share Modal */}
      <AnimatePresence>
        {shareModalOpen && sharePost && (
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
                  <h3 className="text-xl font-bold text-gray-900">Share this post</h3>
                  <button onClick={closeShareModal} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-500" /></button>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sharePost.title}</p>
                {navigator.share && (
                  <button onClick={handleNativeShare} className="w-full mb-4 py-3 bg-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition">
                    <Smartphone size={18} /> Share via Device
                  </button>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <button onClick={copyToClipboard} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                    {copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} className="text-gray-700" />}
                    <span className="text-xs font-medium">{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                  <button onClick={shareToFacebook} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#1877f2] hover:bg-[#0e5fc7] rounded-xl transition text-white"><Facebook size={24} /><span className="text-xs font-medium">Facebook</span></button>
                  <button onClick={shareToTwitter} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#1da1f2] hover:bg-[#0d8de8] rounded-xl transition text-white"><Twitter size={24} /><span className="text-xs font-medium">Twitter</span></button>
                  <button onClick={shareToLinkedIn} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#0a66c2] hover:bg-[#084d96] rounded-xl transition text-white"><Linkedin size={24} /><span className="text-xs font-medium">LinkedIn</span></button>
                  <button onClick={shareToWhatsApp} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-[#25d366] hover:bg-[#1da95a] rounded-xl transition text-white">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.562 1.098 3.677l-1.267 3.799 3.926-1.221c1.07.578 2.278.884 3.511.883 3.18 0 5.767-2.586 5.768-5.766.001-1.58-.614-3.065-1.727-4.176-.913-.91-2.102-1.413-3.351-1.413zm0 10.206c-1.054 0-2.087-.288-2.984-.834l-2.224.692.771-2.12c-.614-1.01-.94-2.158-.939-3.332.001-2.625 2.136-4.76 4.76-4.76 1.27 0 2.464.495 3.362 1.394.897.899 1.392 2.092 1.391 3.362-.001 2.625-2.136 4.76-4.76 4.76zm2.857-3.419c-.15-.075-1.26-.621-1.456-.692-.195-.071-.337-.107-.479.107-.142.214-.548.692-.672.834-.124.143-.248.161-.398.086-.15-.075-.636-.234-1.212-.748-.448-.4-.75-.892-.838-1.043-.088-.15-.01-.232.066-.307.068-.067.15-.178.225-.267.075-.089.1-.15.15-.25.05-.1.025-.186-.012-.26-.038-.075-.339-.817-.465-1.119-.122-.292-.246-.253-.338-.257-.087-.004-.187-.005-.287-.005-.1 0-.262.038-.399.188-.137.15-.523.511-.523 1.246 0 .735.535 1.445.61 1.545.075.1 1.053 1.607 2.549 2.254.356.154.634.246.851.315.358.113.684.097.941.059.287-.042.884-.361 1.008-.71.124-.349.124-.648.087-.71-.037-.063-.137-.1-.287-.175z"/></svg>
                    <span className="text-xs font-medium">WhatsApp</span>
                  </button>
                  <button onClick={shareToEmail} className="flex flex-col items-center justify-center gap-2 py-3 px-2 bg-gray-600 hover:bg-gray-700 rounded-xl transition text-white"><Mail size={24} /><span className="text-xs font-medium">Email</span></button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1"><Globe size={12} /> {getShareUrl(sharePost)}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Styles: only anchor tags are styled; plain text remains untouched */}
      <style jsx>{`
        .blog-content a {
          color: #0d9488;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .blog-content a:hover {
          color: #0f766e;
          background-color: rgba(13, 148, 136, 0.1);
          text-decoration-thickness: 2px;
          padding: 0 2px;
          border-radius: 4px;
        }
        /* Optional external link indicator */
        .blog-content a[target="_blank"]::after {
          content: " ↗";
          font-size: 0.8em;
          display: inline-block;
          margin-left: 2px;
        }
      `}</style>
    </div>
  );
};

export default Blog;