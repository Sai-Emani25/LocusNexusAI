import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST() {
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');
  
  try {
    // 1. Fetch available services (simulated internally)
    const services = [
      { id: 'auditor-01', name: 'Code Auditor AI', price: 5.00, category: 'Security' },
      { id: 'gen-02', name: 'VisionGen', price: 2.50, category: 'Design' },
      { id: 'analyst-03', name: 'TrendHunter', price: 8.00, category: 'Finance' }
    ];

    // 2. Decide using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Select exactly one service from this list for a security audit: ${JSON.stringify(services)}. Return only the service name.`;
    const result = await model.generateContent(prompt);
    const selectedName = result.response.text().trim();

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
