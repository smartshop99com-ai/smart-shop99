import { Product, Category } from '../types';
import Papa from 'papaparse';

// Map CSV category values to Category enum
const categoryMap: { [key: string]: Category } = {
  'GADGETS': Category.GADGETS,
  'KITCHEN': Category.KITCHEN,
  'HOUSEHOLD': Category.HOUSEHOLD,
  'SNACKS': Category.SNACKS,
};

export interface CSVProduct {
  id: string;
  name: string;
  main_image: string;
  additional_images: string;
  mrp: string;
  special_price: string;
  description: string;
  video_url: string;
  category: string;
  stock_status: string;
}

export const parseCSVToProducts = (csvText: string): Product[] => {
  const products: Product[] = [];
  
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    step: (row: any) => {
      if (row.data && row.data.id) {
        const data = row.data as CSVProduct;
        
        // Extract YouTube ID from video_url if present
        let youtubeId = '';
        if (data.video_url) {
          const match = data.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          youtubeId = match ? match[1] : '';
        }

        // Parse additional images
        const additionalImages = data.additional_images
          ? data.additional_images.split(',').map(img => img.trim()).filter(img => img)
          : [];

        const product: Product = {
          id: parseInt(data.id),
          name: data.name.trim(),
          category: categoryMap[data.category] || Category.ALL,
          price: parseInt(data.special_price),
          mrp: parseInt(data.mrp),
          description: data.description.trim(),
          image: data.main_image.trim(),
          additionalImages,
          youtubeId,
        };
        
        products.push(product);
      }
    },
    error: (error) => {
      console.error('CSV parsing error:', error);
    },
  });

  return products;
};

// Async version for use in useEffect
export const loadProductsFromCSV = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/PRODUCT.CSV.csv');
    const csvText = await response.text();
    return parseCSVToProducts(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};
