
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

/**
 * NexusAI Buyer Agent Simulation
 * Uses Google Gemini to autonomously:
 * 1. Discover services
 * 2. Select the best service based on a mission
 * 3. Execute the payment settlement logic
 */

const API_BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

async function simulateBuyerAgent() {
  console.log('🤖 Google Nexus Agent starting...');

  try {
    // 1. Discovery Phase
    console.log('🔍 Fetching service registry from NexusAI...');
    const discoveryResponse = await axios.get(`${API_BASE_URL}/api/discovery`);
    const services = discoveryResponse.data;
    
    console.log(`✅ Found ${services.length} services.`);

    // 2. Intelligent Selection using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an autonomous procurement agent. Your mission is to find an AI service that can help with "Smart Contract Security". 
    Available services: ${JSON.stringify(services)}. 
    Return ONLY the exact JSON object of the service you choose.`;

    console.log('🧠 Asking Gemini to select service...');
    const result = await model.generateContent(prompt);
    const selectionText = result.response.text();
    const targetService = JSON.parse(selectionText.replace(/```json|```/g, ''));

    console.log(`🎯 Selection: "${targetService.name}" for ${targetService.price} USDC`);

    // 3. Payment Initiation via Google-friendly Checkout
    console.log('💳 Creating settlement session...');
    const sessionResponse = await axios.post(`${API_BASE_URL}/api/create-session`, {
      serviceId: targetService.id,
      agentId: 'nexus-autonomous-agent-01'
    });

    const { checkoutUrl, sessionId } = sessionResponse.data;
    console.log(`🔗 Settlement Link: ${checkoutUrl}`);
    console.log(`🆔 Session ID: ${sessionId}`);

    // 4. Autonomous Fulfillment Logic
    console.log('📄 Parsing payload for machine-to-machine settlement...');
    console.log('🚀 Finalizing USDC settlement via simulated Google Web3 Rails.');
    
  } catch (error: any) {
    console.error('❌ Agent simulation failed:', error.message);
  }
}

simulateBuyerAgent();

