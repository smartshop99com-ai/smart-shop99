
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onSelect: (product: Product) => void;
  onToggleWishlist: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isWishlisted, 
  onAddToCart, 
  onSelect, 
  onToggleWishlist 
}) => {
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist();
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      className="bg-white rounded-lg overflow-hidden flex flex-col cursor-pointer group"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Best Seller Badge */}
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-[#00A299] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            Best Seller
          </div>
        )}

        {/* Heart Icon */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <i className={`fa-solid fa-heart text-sm ${isWishlisted ? 'scale-110' : ''}`}></i>
        </button>
      </div>

      {/* Product Details Section */}
      <div className="py-2 px-1 flex flex-col gap-1">
        {/* Add to Cart */}
        <div className="flex items-center justify-end">
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-bag-shopping text-sm"></i>
          </button>
        </div>

        {/* Product Name */}
        <h3 className="text-[13px] leading-snug font-medium text-gray-700 line-clamp-2 min-h-[32px]">
          {product.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[15px] font-bold text-gray-900">₹{product.price}</span>
          <span className="text-[11px] text-gray-400 line-through">₹{product.mrp}</span>
          <div className="bg-[#FF4D4D] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-tighter">
            {discountPercent}% OFF
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
