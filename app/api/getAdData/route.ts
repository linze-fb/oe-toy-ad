import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const ads = await prisma.ad.findMany();
    const categories = await prisma.category.findMany();
    const companies = await prisma.company.findMany();

    //Deserialize again since sqlite does not support primitive lists
    const parsedCategories = categories.map(category => ({
      ...category,
      keywords: JSON.parse(category.keywords)
    }));

    const parsedCompanies = companies.map(company => ({
      ...company,
    }));

    return NextResponse.json({
      ads,
      categories: parsedCategories,
      companies: parsedCompanies,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ad data' }, { status: 500 });
  }
}
