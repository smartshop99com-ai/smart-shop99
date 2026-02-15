
import { Category, Product } from './types';

export const SHOP_WHATSAPP_NUMBER = '917070216321';
export const SHOP_NAME = 'Smart Shop99';
export const SHOP_ADDRESS = 'Pachamba Road, Bishanpur, Near Masjid';
export const SHOP_MOBILE = '+91 7070216321';

// Default products - will be overridden by CSV data when app loads
export const PRODUCTS: Product[] = [
  {
    id: 5,
    name: "Airtight Kitchen Container Set (3 Pcs)",
    category: Category.KITCHEN,
    price: 399,
    mrp: 599,
    description: "Keep your pulses and snacks fresh with our BPA-free airtight locking containers.",
    image: "https://images.unsplash.com/photo-1590735204425-2771844b4179?q=80&w=400&auto=format&fit=crop",
    additionalImages: [],
    youtubeId: "dQw4w9WgXcQ",
    rating: 4.7,
    reviewCount: 120,
    isBestSeller: true
  },
  {
    id: 6,
    name: "Classic Chocolate Chip Cookies Pack",
    category: Category.SNACKS,
    price: 150,
    mrp: 180,
    description: "Crispy and buttery cookies loaded with premium dark chocolate chips.",
    image: "https://images.unsplash.com/photo-1499636136210-65422ff0d330?q=80&w=400&auto=format&fit=crop",
    additionalImages: [],
    youtubeId: "dQw4w9WgXcQ",
    rating: 4.9,
    reviewCount: 210
  },
  {
    id: 7,
    name: "Heavy Duty Plastic Bucket 20L",
    category: Category.HOUSEHOLD,
    price: 249,
    mrp: 350,
    description: "Strong and durable 20 liter bucket for daily household chores.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    additionalImages: [],
    youtubeId: "dQw4w9WgXcQ",
    rating: 4.4,
    reviewCount: 88
  },
  {
    id: 8,
    name: "Bluetooth Mini Speaker Portable",
    category: Category.GADGETS,
    price: 499,
    mrp: 999,
    description: "Compact wireless speaker with high quality sound and long battery life.",
    image: "https://images.unsplash.com/photo-1608156639585-342c718e37ca?q=80&w=400&auto=format&fit=crop",
    additionalImages: [],
    youtubeId: "dQw4w9WgXcQ",
    rating: 4.5,
    reviewCount: 156
  },
  {
    id: 9,
    name: "Magnetic Phone Holder for Car",
    category: Category.GADGETS,
    price: 199,
    mrp: 499,
    description: "Strong magnetic mount for your dashboard. Universal compatibility.",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=400&auto=format&fit=crop",
    additionalImages: [],
    youtubeId: "dQw4w9WgXcQ",
    rating: 4.3,
    reviewCount: 92
  }
];
