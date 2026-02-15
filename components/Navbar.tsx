
import React from 'react';
import { Category } from '../types';

interface NavbarProps {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeCategory, setActiveCategory }) => {
  const categories = Object.values(Category);

  const getIcon = (cat: Category) => {
    switch(cat) {
      case Category.ALL: return 'fa-border-all';
      case Category.GADGETS: return 'fa-microchip';
      case Category.KITCHEN: return 'fa-utensils';
      case Category.HOUSEHOLD: return 'fa-house';
      case Category.SNACKS: return 'fa-cookie-bite';
      default: return 'fa-tag';
    }
  };

  return (
    <nav className="bg-white border-b overflow-x-auto whitespace-nowrap scrollbar-hide sticky top-[68px] md:top-[76px] z-40">
      <div className="container mx-auto flex py-3 px-4 gap-4 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-full border ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'text-gray-600 border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
            }`}
          >
            <i className={`fa-solid ${getIcon(cat)} text-xs`}></i>
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
