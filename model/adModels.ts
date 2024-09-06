export interface Ad {
  id: number;
  imageUrl?: string;
  title: string;
  description: string;
  link: string;
  category: string;
  company: string;
}

export interface Category {
  id: number;
  name: string;
  keywords: string[];
}

export interface Company {
  name: string;
  subscribedCategories: string[];
}

export interface AdPerformance {
  id: number;
  adId: number;
  category: string;
  company: string;
  impressions: number;
  clicks: number;
  triggeredKeywords: string[];
}
