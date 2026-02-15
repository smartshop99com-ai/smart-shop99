
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface WishlistProps {
  products: Product[];
  wishlistIds: number[];
  onBack: () => void;
  onSelect: (product: Product) => void;
  onAddToCart: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ 
  products,
  wishlistIds, 
  onBack, 
  onSelect, 
  onAddToCart, 
  toggleWishlist 
}) => {
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:translate-x-[-4px] transition-transform"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Shopping
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-heart text-red-500"></i>
          My Wishlist
        </h1>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
          {wishlistProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isWishlisted={true}
              onAddToCart={() => onAddToCart(product.id)}
              onSelect={onSelect}
              onToggleWishlist={() => toggleWishlist(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl">
          <div className="bg-white inline-block p-8 rounded-full mb-6 shadow-sm">
            <i className="fa-solid fa-heart-crack text-5xl text-red-200"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Save the items you love to find them later and order whenever you want!
          </p>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-100"
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
