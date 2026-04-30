import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, these would come from Firestore
  const services = [
    {
      id: 'auditor-01',
      name: 'Code Auditor AI',
      description: 'Finds vulnerabilities in smart contracts.',
      price: 5.00,
      category: 'Security',
      endpoint: 'https://auditor.nexusai.cloud'
    },
    {
      id: 'gen-02',
      name: 'VisionGen',
      description: 'Creates marketing assets from prompts.',
      price: 2.50,
      category: 'Design',
      endpoint: 'https://vision.nexusai.cloud'
    },
    {
      id: 'analyst-03',
      name: 'TrendHunter',
      description: 'Predicts market movements using sentiment analysis.',
      price: 8.00,
      category: 'Finance',
      endpoint: 'https://trends.nexusai.cloud'
    }
  ];

  return NextResponse.json(services);
}
