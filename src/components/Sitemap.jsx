import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Sitemap = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch all products from Firestore
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const baseUrl = 'https://hlpower.co.ke';
        
        // Static pages with their priorities
        const staticPages = [
          { url: '/', priority: '1.0', changefreq: 'daily' },
          { url: '/products', priority: '0.9', changefreq: 'daily' },
          { url: '/offers', priority: '0.8', changefreq: 'weekly' },
          { url: '/contact', priority: '0.7', changefreq: 'monthly' },
          { url: '/blog', priority: '0.8', changefreq: 'weekly' },
          { url: '/about', priority: '0.6', changefreq: 'monthly' },
          { url: '/basket', priority: '0.5', changefreq: 'monthly' }
        ];

        // Build XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add static pages
        staticPages.forEach(page => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
          xml += `    <priority>${page.priority}</priority>\n`;
          xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
          xml += `  </url>\n`;
        });

        // Add product pages
        products.forEach(product => {
          const lastmod = product.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString();
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
          xml += `    <lastmod>${lastmod}</lastmod>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `  </url>\n`;
        });

        xml += '</urlset>';

        // Clear the document and display XML
        document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap;">${xml}</pre>`;
        document.contentType = 'application/xml';
        
        // Set proper content type header (works in production with server config)
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Type');
        meta.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(meta);
        
      } catch (error) {
        console.error('Error generating sitemap:', error);
        document.body.innerHTML = 'Error generating sitemap';
      }
    };

    generateSitemap();
  }, []);

  return null;
};

export default Sitemap;