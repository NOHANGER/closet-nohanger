export enum Category {
  TOPS = 'Tops',
  BOTTOMS = 'Bottoms',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORIES = 'Accessories',
  DRESSES = 'Dresses'
}

export enum Season {
  SUMMER = 'Summer',
  WINTER = 'Winter',
  SPRING = 'Spring',
  AUTUMN = 'Autumn',
  ALL_SEASON = 'All Season'
}

export interface ClothingItem {
  id: string;
  imageUrl: string;
  originalImageUrl?: string; // In case background was removed
  category: Category;
  subCategory?: string; // e.g., "T-Shirt", "Jeans"
  color: string[];
  season: Season[];
  tags: string[];
  dateAdded: number;
}

export interface Outfit {
  id: string;
  items: ClothingItem[];
  dateCreated: number;
  scheduledDate?: number; // timestamp
  tags: string[];
}

export interface UserProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  stylePreferences: string[];
}