
import React from 'react';
import { Product, CartItem } from '../types';
import { SHOP_WHATSAPP_NUMBER, SHOP_NAME } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, products, onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  const cartDetails = items.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return {
      product,
      quantity: item.quantity,
      subtotal: product.price * item.quantity
    };
  });

  const total = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = () => {
    let message = `Hi ${SHOP_NAME}! I want to place an order for the following items:\n\n`;
    cartDetails.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n   Qty: ${item.quantity} | Price: ₹${item.subtotal}\n\n`;
    });
    message += `*Total Amount: ₹${total}*\n\nPlease confirm my order.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Cart Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-cart-shopping text-blue-600 text-2xl"></i>
            <h2 className="text-xl font-bold text-gray-800">My Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="bg-gray-50 p-8 rounded-full mb-4">
                <i className="fa-solid fa-cart-arrow-down text-5xl text-gray-300"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 max-w-[250px]">Add some daily essentials to start shopping!</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartDetails.map((item) => (
              <div key={item.product.id} className="flex gap-4 group">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center bg-gray-50">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                    <button 
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">₹{item.product.price} / unit</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-3 py-1 hover:bg-white transition-colors text-gray-600 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        <i className="fa-solid fa-minus text-[10px]"></i>
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-700 text-sm border-x border-gray-200 bg-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-3 py-1 hover:bg-white transition-colors text-gray-600"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                      </button>
                    </div>
                    <span className="font-bold text-gray-800">₹{item.subtotal}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-gray-50 border-t space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600 font-medium">Grand Total</span>
              <span className="text-2xl font-extrabold text-blue-600">₹{total}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-green-500 text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-green-100"
            >
              <i className="fa-brands fa-whatsapp text-2xl"></i>
              Order via WhatsApp
            </button>
            <p className="text-center text-[11px] text-gray-400">
              *Your order list will be shared via WhatsApp for final confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
