import { NextResponse } from 'next/server';
import { getServices } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
