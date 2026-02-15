
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SuggestionForm from './components/SuggestionForm';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import { PRODUCTS } from './constants';
import { Category, Product, CartItem } from './types';
import Papa from 'papaparse';
import { loadProductsFromCSV } from './utils/csvParser';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Load products from CSV on mount
  useEffect(() => {
    const loadCSVProducts = async () => {
      try {
        const csvProducts = await loadProductsFromCSV();
        if (csvProducts.length > 0) {
          setProducts(csvProducts);
        }
      } catch (error) {
        console.error('Failed to load CSV products:', error);
      }
    };
    loadCSVProducts();
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedProduct, isWishlistOpen]);

  // Load state from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('smartshop99_cart');
    const savedWishlist = localStorage.getItem('smartshop99_wishlist');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
    if (savedWishlist) {
      try { setWishlistItems(JSON.parse(savedWishlist)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smartshop99_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('smartshop99_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === Category.ALL || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  const handleAddToCart = (productId: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const toggleWishlist = (productId: number) => {
    setWishlistItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => {
          setIsWishlistOpen(true);
          setSelectedProduct(null);
        }}
      />
      
      {!selectedProduct && !isWishlistOpen && (
        <Navbar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
      )}

      <main className="container mx-auto px-4 py-4 flex-grow">
        {isWishlistOpen ? (
          <Wishlist 
            wishlistIds={wishlistItems}
            onBack={() => setIsWishlistOpen(false)}
            onSelect={(p) => {
              setSelectedProduct(p);
              setIsWishlistOpen(false);
            }}
            onAddToCart={handleAddToCart}
            toggleWishlist={toggleWishlist}
          />
        ) : selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)}
            onAddToCart={() => handleAddToCart(selectedProduct.id)}
            isWishlisted={wishlistItems.includes(selectedProduct.id)}
            onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
          />
        ) : (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-gray-900">
                {activeCategory === Category.ALL ? 'All Items' : activeCategory}
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({filteredProducts.length} items)
                </span>
              </h1>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isWishlisted={wishlistItems.includes(product.id)}
                    onAddToCart={() => handleAddToCart(product.id)}
                    onSelect={setSelectedProduct}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-50 inline-block p-6 rounded-full mb-4">
                  <i className="fa-solid fa-box-open text-4xl text-gray-200"></i>
                </div>
                <p className="text-gray-500 text-sm">No products found for "{searchTerm}"</p>
                <button 
                  onClick={() => {setSearchTerm(''); setActiveCategory(Category.ALL);}}
                  className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            <SuggestionForm />
          </div>
        )}
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <Footer />
    </div>
  );
};

export default App;
