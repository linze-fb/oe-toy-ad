import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { adId, category, company, triggeredKeywords } = await request.json();

  const keywordsJson = JSON.stringify(triggeredKeywords);  // Serialize keywords array since SQLite does not support lists of primitives

  const performance = await prisma.adPerformance.findFirst({
    where: { adId, category, company },
  });

  if (performance) {
    await prisma.adPerformance.update({
      where: { id: performance.id },
      data: {
        impressions: performance.impressions + 1,
        triggeredKeywords: keywordsJson,
      },
    });
  } else {
    await prisma.adPerformance.create({
      data: {
        adId,
        category,
        company,
        impressions: 1,
        clicks: 0,
        triggeredKeywords: keywordsJson,
      },
    });
  }

  return NextResponse.json({ message: 'Ad impression logged.' });
}
