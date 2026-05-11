"use client";

import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import HistoryTimeline from '@/components/HistoryTimeline';
import CaptionModal from '@/components/CaptionModal';
import { db } from '@/lib/db';
import { LayoutGrid, History as HistoryIcon, Search, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calc' | 'history'>('calc');
  const [isCaptionOpen, setIsCaptionOpen] = useState(false);
  const [currentCalc, setCurrentCalc] = useState({ expression: '', result: '' });

  const handleSaveInit = (expression: string, result: string) => {
    setCurrentCalc({ expression, result });
    setIsCaptionOpen(true);
  };

  const handleFinalSave = async (caption: string, isVoice: boolean) => {
    await db.calculations.add({
      expression: currentCalc.expression,
      result: currentCalc.result,
      caption,
      created_at: new Date().toISOString(),
      is_voice_caption: isVoice
    });
    setIsCaptionOpen(false);
    setActiveTab('history');
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pb-24">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
            <span className="text-2xl font-black text-white italic">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">CalcNote</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Smart Memory</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'calc' ? (
            <motion.div
              key="calc"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Calculator onSave={handleSaveInit} />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <HistoryTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[280px] z-40">
        <div className="glass-dark rounded-full p-2 flex gap-2 shadow-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('calc')}
            className={cn(
              "flex-1 h-12 rounded-full flex items-center justify-center gap-2 transition-all font-semibold",
              activeTab === 'calc' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className={cn(activeTab !== 'calc' && "hidden sm:inline")}>Calc</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 h-12 rounded-full flex items-center justify-center gap-2 transition-all font-semibold",
              activeTab === 'history' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <HistoryIcon className="w-5 h-5" />
            <span className={cn(activeTab !== 'history' && "hidden sm:inline")}>History</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <CaptionModal
        isOpen={isCaptionOpen}
        onClose={() => setIsCaptionOpen(false)}
        onSave={handleFinalSave}
        expression={currentCalc.expression}
        result={currentCalc.result}
      />
    </main>
  );
}
