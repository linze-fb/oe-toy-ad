import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ads = [
  // Pfizer Ads
  {
    id: 1,
    imageUrl: 'https://pbs.twimg.com/profile_images/1811079654352039936/Hbx9TN_p_400x400.jpg',
    title: 'Control Hypertension with Pfizer',
    description: 'Pfizer’s breakthrough solutions for hypertension and heart health.',
    link: 'https://example.com/hypertension-care',
    category: 'hypertension',
    company: 'Pfizer',
  },
  {
    id: 2,
    imageUrl: 'https://pbs.twimg.com/profile_images/1811079654352039936/Hbx9TN_p_400x400.jpg',
    title: 'Cutting-edge Breast Cancer Therapies',
    description: 'Discover the latest breast cancer treatments from Pfizer.',
    link: 'https://example.com/breast-cancer-therapies',
    category: 'breast cancer',
    company: 'Pfizer',
  },
  {
    id: 3,
    imageUrl: 'https://pbs.twimg.com/profile_images/1811079654352039936/Hbx9TN_p_400x400.jpg',
    title: 'Asthma Control Solutions',
    description: 'Explore asthma management solutions from Pfizer.',
    link: 'https://example.com/asthma-control',
    category: 'asthma',
    company: 'Pfizer',
  },

  // Genentech Ads
  {
    id: 4,
    imageUrl: 'https://pbs.twimg.com/profile_images/1628169431347249153/yKxHPPld_400x400.jpg',
    title: 'Advanced Pancreatic Cancer Treatments',
    description: 'Learn about the latest in pancreatic cancer therapies from Genentech.',
    link: 'https://example.com/pancreatic-cancer-treatment',
    category: 'pancreatic cancer',
    company: 'Genentech',
  },
  {
    id: 5,
    imageUrl: 'https://pbs.twimg.com/profile_images/1628169431347249153/yKxHPPld_400x400.jpg',
    title: 'Breast Cancer Treatment Options',
    description: 'Learn about Genentech’s targeted therapy solutions for breast cancer.',
    link: 'https://example.com/breast-cancer-care',
    category: 'breast cancer',
    company: 'Genentech',
  },

  // GSK Ads
  {
    id: 6,
    imageUrl: 'https://pbs.twimg.com/profile_images/1572193753930113024/biwviwDR_400x400.jpg',
    title: 'GSK Asthma Treatment',
    description: 'Find out how GSK’s respiratory treatments can help control your asthma.',
    link: 'https://example.com/asthma-treatment',
    category: 'asthma',
    company: 'GSK',
  },
  {
    id: 7,
    imageUrl: 'https://pbs.twimg.com/profile_images/1572193753930113024/biwviwDR_400x400.jpg',
    title: 'Hypertension Management',
    description: 'Find advanced hypertension treatments from GSK.',
    link: 'https://example.com/hypertension-management',
    category: 'hypertension',
    company: 'GSK',
  },

  // Eli Lilly Ads
  {
    id: 8,
    imageUrl: 'https://pbs.twimg.com/profile_images/1542612027142717442/q2BxTXTj_400x400.png',
    title: 'Type 2 Diabetes Care',
    description: 'Manage your blood sugar effectively with Eli Lilly’s insulin therapy.',
    link: 'https://example.com/type-2-diabetes-care',
    category: 'type 2 diabetes',
    company: 'Eli Lilly',
  },
  {
    id: 9,
    imageUrl: 'https://pbs.twimg.com/profile_images/1542612027142717442/q2BxTXTj_400x400.png',
    title: 'Eli Lilly Arthritis Treatment',
    description: 'Eli Lilly’s new biologics provide relief for rheumatoid arthritis patients.',
    link: 'https://example.com/arthritis-treatment',
    category: 'arthritis',
    company: 'Eli Lilly',
  },
  {
    id: 10,
    imageUrl: 'https://pbs.twimg.com/profile_images/1542612027142717442/q2BxTXTj_400x400.png',
    title: 'New Advances in Breast Cancer Treatment',
    description: 'Discover Eli Lilly’s latest solutions for breast cancer care.',
    link: 'https://example.com/breast-cancer-advances',
    category: 'breast cancer',
    company: 'Eli Lilly',
  },

  // One more Pfizer
  {
    id: 11,
    imageUrl: 'https://pbs.twimg.com/profile_images/1811079654352039936/Hbx9TN_p_400x400.jpg',
    title: 'Breakthroughs in Pancreatic Cancer',
    description: 'Explore breakthrough immunotherapy options for pancreatic cancer patients.',
    link: 'https://example.com/pancreatic-cancer-immunotherapy',
    category: 'pancreatic cancer',
    company: 'Pfizer',
  },
];


const categories = [
  {
    id: 1,
    name: 'pancreatic cancer',
    keywords: JSON.stringify(['pancreatic cancer', 'tumor', 'pancreas', 'chemotherapy', 'cancer treatment']),
  },
  {
    id: 2,
    name: 'breast cancer',
    keywords: JSON.stringify(['breast cancer', 'oncology', 'mammogram', 'cancer treatment', 'tumor']),
  },
  {
    id: 3,
    name: 'arthritis',
    keywords: JSON.stringify(['arthritis', 'rheumatoid', 'joint pain', 'biologic therapy']),
  },
  {
    id: 4,
    name: 'type 2 diabetes',
    keywords: JSON.stringify(['type 2 diabetes', 'insulin', 'blood sugar', 'glucose', 'diabetes management']),
  },
  {
    id: 5,
    name: 'asthma',
    keywords: JSON.stringify(['asthma', 'inhaler', 'bronchitis', 'wheezing', 'COPD']),
  },
  {
    id: 6,
    name: 'hypertension',
    keywords: JSON.stringify(['hypertension', 'blood pressure', 'cholesterol', 'heart health']),
  },
];

const companies = [
  {
    name: 'Pfizer',
    subscribedCategories: JSON.stringify(['hypertension', 'breast cancer', 'asthma']),
  },
  {
    name: 'Genentech',
    subscribedCategories: JSON.stringify(['pancreatic cancer', 'breast cancer']),
  },
  {
    name: 'GSK',
    subscribedCategories: JSON.stringify(['asthma', 'hypertension']),
  },
  {
    name: 'Eli Lilly',
    subscribedCategories: JSON.stringify(['type 2 diabetes', 'arthritis', 'breast cancer']),
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  for (const ad of ads) {
    await prisma.ad.create({ data: ad });
  }

  for (const company of companies) {
    await prisma.company.create({
      data: {
        name: company.name,
        subscribedCategories: company.subscribedCategories,
      },
    });
  }
}

main()
  .then(() => {
    console.log('Database seeded successfully.');
  })
  .catch((e) => {
    console.error('Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
