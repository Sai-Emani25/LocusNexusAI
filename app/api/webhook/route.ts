import { NextResponse } from 'next/server';
import { recordSettlement } from '@/lib/firebase-admin';

/**
 * NexusAI Settlement Webhook
 * Simulates the reception of on-chain settlement events.
 */

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // In a real Google-powered Web3 app, we would verify the signature 
    // from the settlement provider.
    
    console.log('🔔 Settlement webhook received:', payload);

    if (payload.event === 'settlement.completed') {
      await recordSettlement({
        id: payload.sessionId,
        agent: payload.agentId || 'unknown-agent',
        service: payload.serviceId || 'unknown-service',
        amount: payload.amount || 0,
        status: 'settled',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json({ received: true, status: 'processed' });
    }

    return NextResponse.json({ received: true, status: 'ignored' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
