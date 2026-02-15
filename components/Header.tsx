
import React from 'react';
import { SHOP_NAME } from '../constants';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  cartCount, 
  wishlistCount, 
  onCartClick, 
  onWishlistClick 
}) => {
  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center cursor-pointer" onClick={() => window.location.reload()}>
            <i className="fa-solid fa-bag-shopping mr-2"></i>
            {SHOP_NAME}
          </span>
          <p className="hidden md:block text-xs text-gray-500 font-medium ml-2 border-l pl-2 border-gray-200">
            Affordable Daily Essentials & More!
          </p>
        </div>

        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search daily essentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-gray-50 text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onWishlistClick}
            className="relative cursor-pointer bg-red-50 p-2.5 rounded-full text-red-500 hover:bg-red-100 transition-colors"
          >
            <i className="fa-solid fa-heart text-xl"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={onCartClick}
            className="relative cursor-pointer bg-blue-50 p-2.5 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
