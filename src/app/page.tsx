"use client";

import React, { useState } from 'react';
import Calculator from '@/components/Calculator';
import HistoryTimeline from '@/components/HistoryTimeline';
import CaptionModal from '@/components/CaptionModal';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { saveCalculation } from '@/lib/firestore';
import { useAuth } from '@/lib/AuthContext';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { LayoutGrid, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'calc' | 'history'>('calc');
  const [isCaptionOpen, setIsCaptionOpen] = useState(false);
  const [currentCalc, setCurrentCalc] = useState({ expression: '', result: '' });
  const { user, loading, login, signup, loginWithGoogle, logout } = useAuth();
  const { isOnline, saveOfflineCalculation } = useOfflineStorage();
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

  const handleGoogleAuth = async () => {
    try {
      setAuthError('');
      await loginWithGoogle();
      setIsAuthOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (error: any) {
      setAuthError(error.message || 'Google sign-in failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
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
      const calcData = {
        expression: currentCalc.expression,
        result: currentCalc.result,
        caption,
        created_at: new Date().toISOString(),
        is_voice_caption: isVoice
      };

      if (isOnline) {
        // Save online to Firestore
        await saveCalculation(user.uid, calcData);
      } else {
        // Save offline to localStorage
        saveOfflineCalculation(calcData);
      }

      setIsCaptionOpen(false);
      setActiveTab('history');
    } catch (error) {
      alert('Failed to save calculation');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Offline Indicator */}
      <OfflineIndicator />

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

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <p className="text-xs text-muted-foreground">or</p>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full h-12 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

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
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-400 transition-colors text-sm font-medium"
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
