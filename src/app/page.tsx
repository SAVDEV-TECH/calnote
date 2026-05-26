"use client";

import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import HistoryTimeline from '@/components/HistoryTimeline';
import CaptionModal from '@/components/CaptionModal';
import { saveCalculation } from '@/lib/firestore';
import { useAuth } from '@/lib/AuthContext';
import { LayoutGrid, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calc' | 'history'>('calc');
  const [isCaptionOpen, setIsCaptionOpen] = useState(false);
  const [currentCalc, setCurrentCalc] = useState({ expression: '', result: '' });
  const { user, loading, login, signup } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuth = async () => {
    try {
      setAuthError('');
      if (authMode === 'login') {
        await login(authEmail, authPassword);
      } else {
        await signup(authEmail, authPassword);
      }
      setIsAuthOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    }
  };

  const handleSaveInit = (expression: string, result: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentCalc({ expression, result });
    setIsCaptionOpen(true);
  };

  const handleFinalSave = async (caption: string, isVoice: boolean) => {
    if (!user) return;
    try {
      await saveCalculation(user.uid, {
        expression: currentCalc.expression,
        result: currentCalc.result,
        caption,
        created_at: new Date().toISOString(),
        is_voice_caption: isVoice
      });
      setIsCaptionOpen(false);
      setActiveTab('history');
    } catch (error) {
      alert('Failed to save calculation');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Tabs */}
      {!loading && user && (
        <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10" role="tablist" aria-label="Navigation">
          <div className="max-w-md mx-auto px-4 py-3 flex gap-2">
            <button
              onClick={() => setActiveTab('calc')}
              role="tab"
              aria-selected={activeTab === 'calc'}
              className={cn(
                "flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-semibold text-sm sm:text-base",
                activeTab === 'calc' 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              role="tab"
              aria-selected={activeTab === 'history'}
              className={cn(
                "flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all font-semibold text-sm sm:text-base",
                activeTab === 'history' 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
              )}
            >
              <HistoryIcon className="w-5 h-5" />
              <span>History</span>
            </button>
          </div>
        </nav>
      )}

      {/* Auth Modal */}
      {!loading && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Welcome to CalcNote</h2>
            <p className="text-muted-foreground">Sign in to save your calculations</p>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {authError && <p className="text-red-400 text-sm">{authError}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleAuth}
                className="flex-1 h-12 bg-accent text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
              >
                {authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="w-full text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              {authMode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </button>
          </motion.div>
        </div>
      )}

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
        {user && (
          <div className="flex gap-2">
            <div className="text-right text-xs">
              <p className="text-white font-semibold">{user.email?.split('@')[0]}</p>
              <button 
                onClick={() => {
                  // Logout will be handled by context
                }}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {!loading && user ? (
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
        ) : loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
        ) : null}
      </div>

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
