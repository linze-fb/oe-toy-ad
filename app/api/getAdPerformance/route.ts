import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const company = url.searchParams.get('company') || '';
  
    const adPerformance = await prisma.adPerformance.findMany({
      where: company ? { company } : {},
    });
  
    const performanceWithKeywords = adPerformance.map((performance: typeof adPerformance[0]) => ({
      ...performance,
      triggeredKeywords: JSON.parse(performance.triggeredKeywords), // Deserialize to string array again
    }));
  
    return NextResponse.json(performanceWithKeywords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ad performance data' }, { status: 500 });
  }
}
