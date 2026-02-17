import { Product, Category } from '../types';

// Calculate similarity between two strings (0-1, where 1 is perfect match)
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 1;
  
  // One contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Levenshtein distance for typo handling
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(s1, s2);
  const similarity = 1 - distance / maxLen;
  
  return Math.max(0, similarity);
};

// Levenshtein distance algorithm
const levenshteinDistance = (s1: string, s2: string): number => {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[s2.length][s1.length];
};

// Enhanced search with fuzzy matching and category suggestions
export const searchProducts = (
  products: Product[],
  searchTerm: string,
  category: Category
): Product[] => {
  if (!searchTerm.trim()) {
    return category === Category.ALL
      ? products
      : products.filter(p => p.category === category);
  }
  
  // First, find products with similarity score
  const scored = products.map(product => ({
    product,
    score: calculateSimilarity(product.name, searchTerm)
  }));
  
  // Filter by search relevance (threshold: 0.6)
  const relevantByName = scored.filter(item => item.score >= 0.6);
  
  // Also add partial keyword matches
  const keywords = searchTerm.toLowerCase().split(' ');
  const keywordMatches = scored.filter(item => {
    const productName = item.product.name.toLowerCase();
    return keywords.some(keyword => productName.includes(keyword)) && item.score < 0.6;
  });
  
  // Combine results: sort by score, then add keyword matches
  const combinedResults = [
    ...relevantByName.sort((a, b) => b.score - a.score),
    ...keywordMatches
  ];
  
  // If we found good matches, use them
  if (combinedResults.length > 0) {
    let results = combinedResults.map(item => item.product);
    
    // Filter by category if specified
    if (category !== Category.ALL) {
      results = results.filter(p => p.category === category);
    }
    
    if (results.length > 0) return results;
  }
  
  // If no matches, show products from the same category (suggestions)
  const categorySuggestions = products.filter(p => 
    category === Category.ALL || p.category === category
  );
  
  return categorySuggestions;
};
