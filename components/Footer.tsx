
import React from 'react';
import { SHOP_NAME, SHOP_WHATSAPP_NUMBER, SHOP_ADDRESS, SHOP_MOBILE } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">{SHOP_NAME}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Serving the best quality household essentials, snacks, and gadgets at unbeatable prices in Patna. Freshness and trust guaranteed.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Contact Info</h4>
            <p className="text-gray-600 text-sm mb-2">
              <i className="fa-solid fa-location-dot mr-2 text-blue-500"></i>
              {SHOP_ADDRESS}
            </p>
            <p className="text-gray-600 text-sm">
              <i className="fa-solid fa-phone mr-2 text-blue-500"></i>
              {SHOP_MOBILE}
            </p>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} {SHOP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${SHOP_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:bg-green-600 transition-all hover:scale-110 active:scale-90"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </footer>
  );
};

export default Footer;
