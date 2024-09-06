import { Ad, Category, Company } from '@/model/adModels';
import axios from 'axios';
export const matchAd = async (questionOrAnswer: string): Promise<Ad | null> => {
  try {
    //Get ad data from the api
    const { data } = await axios.get('/api/getAdData');

    const ads: Ad[] = data.ads;
    const categories: Category[] = data.categories;
    const companies: Company[] = data.companies;

    const matchedCategory: Category | undefined = categories.find((category: Category) =>
      category.keywords.some((keyword: string) =>
        questionOrAnswer.toLowerCase().includes(keyword)
      )
    );

    if (!matchedCategory) {
      console.warn('No category match found.');
      return null;
    }

    
    const subscribedCompanies = companies.filter(company =>
      company.subscribedCategories.includes(matchedCategory.name)
    );
    
    if (subscribedCompanies.length === 0) {
      console.warn(`No subscribed companies found for the category: ${matchedCategory.name}`);
      return null;
    }

    const matchingAds: Ad[] = ads.filter((ad: Ad) =>
      ad.category === matchedCategory.name &&
      subscribedCompanies.some((company: Company) => company.name === ad.company)
    );

    if (matchingAds.length === 0) {
      console.warn(`No ads found for the category: ${matchedCategory.name}`);
      return null;
    }

    //Return only 1 ad
    return matchingAds[Math.floor(Math.random() * matchingAds.length)];
  } catch (error) {
    console.error('Error matching ad:', error);
    return null;
  }
};
