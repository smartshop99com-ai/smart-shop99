
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SuggestionForm from './components/SuggestionForm';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import { PRODUCTS, SHOP_WHATSAPP_NUMBER } from './constants';
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
  const [isCartPage, setIsCartPage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
  }, [selectedProduct, isWishlistOpen, isCartPage]);

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
    
    // Show toast notification
    const product = products.find(p => p.id === productId);
    if (product) {
      setToastMessage(`✓ ${product.name} added to cart!`);
      setTimeout(() => setToastMessage(null), 2500);
    }
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
        onCartClick={() => {
          setIsCartPage(true);
          setSelectedProduct(null);
          setIsWishlistOpen(false);
        }}
        onWishlistClick={() => {
          setIsWishlistOpen(true);
          setSelectedProduct(null);
        }}
      />
      
      {!selectedProduct && !isWishlistOpen && !isCartPage && (
        <Navbar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
      )}

      <main className="container mx-auto px-4 py-4 flex-grow">
        {isCartPage ? (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setIsCartPage(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <i className="fa-solid fa-arrow-left text-lg"></i>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="fa-solid fa-cart-shopping text-blue-600"></i>
                  My Shopping Cart
                </h1>
                <p className="text-sm text-gray-500">{totalCartCount} item{totalCartCount !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                <div className="bg-white inline-block p-6 rounded-full mb-4">
                  <i className="fa-solid fa-cart-arrow-down text-5xl text-gray-300"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some daily essentials to start shopping!</p>
                <button 
                  onClick={() => setIsCartPage(false)}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    const subtotal = product.price * item.quantity;
                    return (
                      <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center bg-gray-50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-3">₹{product.price} per unit</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                              <button 
                                onClick={() => handleUpdateQuantity(product.id, -1)}
                                className="px-3 py-2 hover:bg-white transition-colors text-gray-600 disabled:opacity-30 text-sm"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="px-4 py-2 text-sm font-semibold text-gray-800">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQuantity(product.id, 1)}
                                className="px-3 py-2 hover:bg-white transition-colors text-gray-600 text-sm"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                              <p className="text-lg font-bold text-gray-900">₹{subtotal}</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(product.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors h-fit"
                        >
                          <i className="fa-solid fa-trash-can text-lg"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 sticky top-24 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6 pb-6 border-b border-blue-200">
                      {cartItems.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <div key={product.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{product.name} x {item.quantity}</span>
                            <span className="font-semibold text-gray-800">₹{product.price * item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{cartItems.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Delivery</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6 pt-3 border-t border-blue-200">
                      <span>Total</span>
                      <span className="text-blue-600">₹{cartItems.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const total = cartItems.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0);
                        const message = `Hi ${PRODUCTS.length > 0 ? 'Smart Shop' : 'Shop'}! I want to place an order for the following items:\n\n${cartItems.map((item, idx) => {
                          const product = products.find(p => p.id === item.productId);
                          return `${idx + 1}. ${product?.name}\n   Qty: ${item.quantity} | Price: ₹${(product?.price || 0) * item.quantity}`;
                        }).join('\n\n')}\n\n*Total Amount: ₹${total}*\n\nPlease confirm my order.`;
                        const encodedMessage = encodeURIComponent(message);
                        window.open(`https://wa.me/919716062306?text=${encodedMessage}`, '_blank');
                      }}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <i className="fa-brands fa-whatsapp mr-2"></i>
                      Checkout via WhatsApp
                    </button>
                    <button 
                      onClick={() => setIsCartPage(false)}
                      className="w-full mt-3 bg-white text-blue-600 font-semibold py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : isWishlistOpen ? (
          <Wishlist 
            products={products}
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

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300 z-50">
          {toastMessage}
        </div>
      )}

      {!isCartPage && <Footer />}
    </div>
  );
};

export default App;
