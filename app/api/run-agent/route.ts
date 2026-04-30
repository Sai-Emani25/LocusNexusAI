import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  
  try {
    // 1. Fetch available services
    const services = [
      { id: 'auditor-01', name: 'Google Code Auditor', price: 5.00, category: 'Security' },
      { id: 'gen-02', name: 'MediaFlow Gen', price: 2.50, category: 'Design' },
      { id: 'analyst-03', name: 'MarketPath', price: 8.00, category: 'Finance' }
    ];

    // 2. Decide using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Select exactly one service from this list for a security audit: ${JSON.stringify(services)}. Return only the service name.`,
    });
    
    const selectedName = response.text?.trim() || 'Google Code Auditor';

    // 3. Simulate session creation
    const sessionId = `tx_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      success: true,
      decision: selectedName,
      sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
