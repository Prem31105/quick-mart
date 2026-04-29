import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api';
import './Products.css';

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeBrand, setActiveBrand] = useState('All');

  useEffect(() => {
    fetchProducts().then(data => setProducts(data)).catch(console.error);
  }, []);

  const brands = ['All', ...new Set(products.map(p => p.brand))];

  const filteredProducts = activeBrand === 'All'
    ? products
    : products.filter(p => p.brand === activeBrand);

  return (
    <div className="page-wrapper products-page">
      <div className="container">
        <header className="products-header text-center animate-fade-in">
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle mx-auto">Explore our premium catalog of multi-brand electronics</p>
        </header>

        <div className="filter-section animate-fade-in delay-100">
          <div className="filter-header">
            <Filter size={18} />
            <span>Filter by Brand</span>
          </div>
          <div className="brand-filters">
            {brands.map(brand => (
              <button
                key={brand}
                className={`brand-chip ${activeBrand === brand ? 'active' : ''}`}
                onClick={() => setActiveBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid all-products-grid mt-4">
          {filteredProducts.map((product, index) => (
            <div key={product._id} className={`product-card glass-card animate-fade-in delay-${(index % 5 + 1) * 100}`}>
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
                <button className="btn-secondary w-full add-to-cart-btn" onClick={() => addToCart(product)}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
