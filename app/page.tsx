'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Code, 
  BarChart, 
  CircleDollarSign,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  endpoint: string;
}

interface LogEntry {
  id: string;
  agent: string;
  service: string;
  amount: number;
  status: 'pending' | 'settled' | 'failed';
  timestamp: string;
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState(false);

  const triggerAgent = async () => {
    setRunningAgent(true);
    try {
      const res = await fetch('/api/run-agent', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        const newLog: LogEntry = {
          id: data.sessionId,
          agent: 'autonomous-gemini-agent',
          service: data.decision,
          amount: 5.00,
          status: 'settled',
          timestamp: data.timestamp
        };
        setLogs(prev => [newLog, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunningAgent(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/discovery');
        const data = await res.json();
        setServices(data);
        
        // Mock initial logs
        setLogs([
          {
            id: 'log_01',
            agent: 'nexus-agent-01',
            service: 'Code Auditor AI',
            amount: 5.00,
            status: 'settled',
            timestamp: new Date().toISOString()
          },
          {
            id: 'log_02',
            agent: 'vision-bot-3',
            service: 'TrendHunter',
            amount: 8.00,
            status: 'pending',
            timestamp: new Date(Date.now() - 50000).toISOString()
          }
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case 'Security': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Finance': return <BarChart className="w-5 h-5 text-blue-400" />;
      case 'Design': return <Zap className="w-5 h-5 text-amber-400" />;
      default: return <Code className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-6 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            NexusAI Registry
          </h1>
          <p className="text-gray-400 text-sm mt-1">Autonomous Machine-to-Machine Marketplace</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={triggerAgent}
            disabled={runningAgent}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {runningAgent ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            {runningAgent ? 'Agent Thinking...' : 'Trigger Agent Run'}
          </button>
          <div className="flex items-center gap-4 bg-gray-900/50 border border-gray-800 rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-gray-300">SYSTEM ONLINE</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-800" />
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold">14,204.50 USDC</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registry Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Available Agents
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search agents..." 
                className="bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-gray-900/20 border border-gray-800 rounded-xl animate-pulse" />
              ))
            ) : (
              services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-gray-900/30 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-gray-800/50 rounded-lg">
                      {getIcon(service.category)}
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      {service.price} USDC
                    </span>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{service.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{service.category}</span>
                    <button className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
                      View Metadata <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Settlement Ledger */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Settlement Ledger
          </h2>
          <div className="bg-gray-900/20 border border-gray-800 rounded-xl overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-800/50 last:border-0 hover:bg-white/[0.02]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-gray-500">{log.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                      log.status === 'settled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-medium text-gray-300">{log.agent}</p>
                      <p className="text-[10px] text-gray-500">Paid for: {log.service}</p>
                    </div>
                    <p className="text-sm font-bold text-white">-{log.amount} USDC</p>
                  </div>
                  <p className="text-[9px] text-gray-600 mt-2">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="p-4 bg-gray-900/50 border-t border-gray-800 text-center">
              <p className="text-[10px] text-gray-500 italic">Listening for on-chain events...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
