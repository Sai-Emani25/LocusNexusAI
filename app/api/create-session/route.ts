import { NextResponse } from 'next/server';
import { recordSettlement } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { serviceId, agentId } = await req.json();

    const sessionId = `gx_${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = `${process.env.APP_URL || 'http://localhost:3000'}/checkout/${sessionId}`;

    // Record the pending transaction in Google Cloud / Firebase ledger
    await recordSettlement({
      id: sessionId,
      agent: agentId,
      service: serviceId,
      amount: 5.00,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      sessionId,
      checkoutUrl,
      status: 'pending',
      amount: 5.00,
      currency: 'USDC'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
