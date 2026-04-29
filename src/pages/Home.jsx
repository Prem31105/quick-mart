import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Play, Heart, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api';
import './Home.css';

// Import ad images
import adBanner from '../assets/ad_banner.png';
import adInstagram from '../assets/ad_instagram.png';
import adYoutube from '../assets/ad_youtube.png';

const adCards = [
  {
    id: 'banner',
    type: 'Shot Ad',
    icon: '📺',
    platform: 'TV / Digital',
    label: 'FEATURED AD',
    labelColor: '#f59e0b',
    image: adBanner,
    title: 'Quick Mart Mega Sale',
    subtitle: 'Up to 60% OFF on Electronics',
    cta: 'Shop the Sale',
    accent: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    borderAccent: '#f59e0b',
  },
  {
    id: 'instagram',
    type: 'Instagram',
    icon: '📸',
    platform: '@mostlysane',
    label: 'SPONSORED',
    labelColor: '#e1306c',
    image: adInstagram,
    title: 'Prajakta Koli × Quick Mart',
    subtitle: '"Obsessed with my new phone!" 📱',
    cta: 'View on Instagram',
    accent: 'linear-gradient(135deg, #833ab4, #e1306c, #f77737)',
    borderAccent: '#e1306c',
  },
  {
    id: 'youtube',
    type: 'YouTube',
    icon: '▶️',
    platform: 'Flying Beast',
    label: '2.3M VIEWS',
    labelColor: '#ff0000',
    image: adYoutube,
    title: 'Mega Unboxing — Flying Beast',
    subtitle: 'Quick Mart\'s INSANE Deals! 🔥',
    cta: 'Watch on YouTube',
    accent: 'linear-gradient(135deg, #ff0000, #cc0000)',
    borderAccent: '#ff0000',
    isVideo: true,
  },
];

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [hoveredAd, setHoveredAd] = useState(null);

  useEffect(() => {
    fetchProducts().then(data => setProducts(data.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* ── Compact Multi-Platform Ads ── */}
        <section className="ads-strip-section">
          <div className="ads-strip-header">
            <div className="ads-strip-title-row">
              <span className="ads-live-dot"></span>
              <h3 className="ads-strip-title">Trending Ads</h3>
            </div>
            <p className="ads-strip-sub">See Quick Mart everywhere — TV, Instagram &amp; YouTube</p>
          </div>

          <div className="ads-strip-grid">
            {adCards.map((ad) => (
              <div
                key={ad.id}
                className={`ad-card ad-card--${ad.id}`}
                onMouseEnter={() => setHoveredAd(ad.id)}
                onMouseLeave={() => setHoveredAd(null)}
                style={{ '--ad-accent': ad.borderAccent }}
              >
                {/* Platform badge */}
                <div className="ad-card-platform-badge" style={{ background: ad.accent }}>
                  {ad.icon}
                  <span>{ad.type}</span>
                </div>

                {/* Image */}
                <div className="ad-card-img-wrap">
                  <img src={ad.image} alt={ad.title} className="ad-card-img" />
                  {ad.isVideo && (
                    <div className="ad-play-overlay">
                      <div className="ad-play-btn">
                        <Play size={20} fill="white" color="white" />
                      </div>
                    </div>
                  )}
                  <div className="ad-card-label" style={{ background: ad.labelColor }}>
                    {ad.label}
                  </div>
                </div>

                {/* Info */}
                <div className="ad-card-info">
                  <h4 className="ad-card-title">{ad.title}</h4>
                  <p className="ad-card-subtitle">{ad.subtitle}</p>
                  <div className="ad-card-footer">
                    <span className="ad-card-platform-name">{ad.platform}</span>
                    <button className="ad-card-cta" style={{ background: ad.accent }}>
                      {ad.cta} <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className="products-section" style={{ paddingTop: '2rem' }}>
          <div className="section-header text-center animate-fade-in">
            <h2 className="section-title">Featured Highlights</h2>
            <p className="section-subtitle mx-auto">Top-tier electronics recommended for you</p>
          </div>

          <div className="product-grid featured-grid">
            {products.map((product, index) => (
              <div key={product._id} className={`product-card glass-card animate-fade-in delay-${(index + 1) * 100}`}>
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <span className="product-category">{product.category}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>
                  <div className="product-meta">
                    <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <div className="product-rating">
                      <Star size={16} fill="var(--warning)" color="var(--warning)" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <button className="btn-primary w-full add-to-cart-btn" onClick={() => addToCart(product)}>
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
