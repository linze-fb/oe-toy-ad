import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { adId, category, company } = await request.json();

  const performance = await prisma.adPerformance.findFirst({
    where: { adId, category, company },
  });

  if (performance) {
    await prisma.adPerformance.update({
      where: { id: performance.id },
      data: { clicks: performance.clicks + 1 },
    });
    return NextResponse.json({ message: 'Ad click logged.' });
  } else {
    return NextResponse.json({ message: 'Ad performance not found' }, { status: 404 });
  }
}
