"use client";

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export const OfflineIndicator = () => {
  const { isOnline, getPendingCalculations } = useOfflineStorage();
  const [showPending, setShowPending] = useState(false);
  const pendingCalcs = getPendingCalculations();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-0 left-0 right-0 z-50 bg-orange-500/90 backdrop-blur-sm border-b border-orange-400/50"
        >
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <WifiOff className="w-4 h-4 animate-pulse" />
              <span>You're offline</span>
              {pendingCalcs.length > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {pendingCalcs.length} pending
                </span>
              )}
            </div>
            <button
              onClick={() => setShowPending(!showPending)}
              className="text-xs text-white/80 hover:text-white transition-colors underline"
            >
              Details
            </button>
          </div>

          {/* Pending calculations info */}
          <AnimatePresence>
            {showPending && pendingCalcs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-orange-400/30 bg-black/20 px-4 py-2 text-xs text-white/80"
              >
                <p className="font-medium mb-1">Saved locally, will sync when online:</p>
                <ul className="space-y-1">
                  {pendingCalcs.slice(0, 3).map((calc) => (
                    <li key={calc.id} className="text-white/60">
                      • {calc.expression} = {calc.result}
                    </li>
                  ))}
                  {pendingCalcs.length > 3 && (
                    <li className="text-white/60">• +{pendingCalcs.length - 3} more</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {isOnline && pendingCalcs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500/90 backdrop-blur-sm border-b border-green-400/50"
        >
          <div className="max-w-md mx-auto px-4 py-2 flex items-center gap-2 text-white text-sm font-medium">
            <Wifi className="w-4 h-4" />
            <span>You're back online! Syncing {pendingCalcs.length} calculation(s)...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
