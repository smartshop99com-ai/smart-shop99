
export enum Category {
  ALL = 'All Products',
  GADGETS = 'Gadgets',
  KITCHEN = 'Kitchen Tools',
  HOUSEHOLD = 'Household',
  SNACKS = 'Snacks',
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  mrp: number;
  description: string;
  image: string;
  additionalImages: string[];
  youtubeId: string;
  rating?: number;
  reviewCount?: number;
  isBestSeller?: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
}
