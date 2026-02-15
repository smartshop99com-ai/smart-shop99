
import React, { useState } from 'react';
import { Product } from '../types';
import { SHOP_WHATSAPP_NUMBER, SHOP_NAME } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) => {
  const [mainImage, setMainImage] = useState(product.image);
  const allImages = [product.image, ...product.additionalImages];
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleWhatsAppOrder = () => {
    const message = `Hi ${SHOP_NAME}! I want to order ${product.name} for ₹${product.price}. I saw it on your website.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:translate-x-[-4px] transition-transform"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Products
        </button>
        
        <button 
          onClick={onToggleWishlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border ${
            isWishlisted 
              ? 'bg-red-50 text-red-500 border-red-100' 
              : 'bg-white text-gray-500 border-gray-100 hover:border-red-100 hover:text-red-500'
          }`}
        >
          <i className={`fa-solid fa-heart ${isWishlisted ? 'text-red-500' : ''}`}></i>
          {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {allImages.length > 1 && allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-50 ${
                  mainImage === img ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-4">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-green-600">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-lg">
                {discountPercent}% OFF
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Product Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {product.youtubeId && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Product Video</h3>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <iframe
                  src={`https://www.youtube.com/embed/${product.youtubeId}?rel=0&modestbranding=1`}
                  title={`${product.name} Review`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
            <button
              onClick={onAddToCart}
              className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-cart-plus text-xl"></i>
              Add to Shopping Cart
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-green-200"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
              Order via WhatsApp Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
