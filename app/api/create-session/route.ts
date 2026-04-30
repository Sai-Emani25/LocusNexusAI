import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { serviceId, agentId } = await req.json();

    // Simulation: Locus used for payments, now we use a "Google Payout" simulation.
    // In a real scenario, this might connect to a Stripe Checkout Session or a Wallet integration.
    
    const sessionId = `gx_${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = `${process.env.APP_URL || 'http://localhost:3000'}/checkout/${sessionId}`;

    // Record the pending transaction in our ledger (Firestore)
    // For now, we return the session info
    
    return NextResponse.json({
      sessionId,
      checkoutUrl,
      status: 'pending',
      amount: 5.00, // Mock amount for now
      currency: 'USDC'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
