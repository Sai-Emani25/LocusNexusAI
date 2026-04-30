import * as admin from 'firebase-admin';

/**
 * Google Cloud Functions Backend Service Layer
 * This handles the interface with Firebase/Google Cloud services.
 */

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    // In development environment, we might not have applicationDefault credentials
    // We'll gracefully handle this or use local emulation
    console.warn('Firebase Admin initialization skipped: Missing credentials.');
  }
}

export const db = admin.firestore();

export interface AgentService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  endpoint: string;
}

export interface SettlementLog {
  id: string;
  agent: string;
  service: string;
  amount: number;
  status: 'pending' | 'settled' | 'failed';
  timestamp: string;
}

export async function getServices(): Promise<AgentService[]> {
  // Try to fetch from Firestore, fallback to static registry if not ready
  try {
    const snapshot = await db.collection('services').get();
    if (snapshot.empty) return DEFAULT_SERVICES;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AgentService));
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function recordSettlement(log: SettlementLog) {
  try {
    await db.collection('settlements').add(log);
  } catch (error) {
    console.error('Failed to record settlement in Firestore:', error);
  }
}

const DEFAULT_SERVICES: AgentService[] = [
  {
    id: 'auditor-01',
    name: 'Google Code Auditor',
    description: 'Securing smart contracts via advanced Google Cloud Analysis.',
    price: 5.00,
    category: 'Security',
    endpoint: 'https://security-analysis.nexusai.google'
  },
  {
    id: 'gen-02',
    name: 'MediaFlow Gen',
    description: 'Generative AI for marketing assets powered by Google Vertex.',
    price: 2.50,
    category: 'Design',
    endpoint: 'https://media-gen.nexusai.google'
  },
  {
    id: 'analyst-03',
    name: 'MarketPath',
    description: 'Market predictions using Google Cloud Data Warehouse.',
    price: 8.00,
    category: 'Finance',
    endpoint: 'https://market-path.nexusai.google'
  }
];
