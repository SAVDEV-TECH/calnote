'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Delete Record',
  message = 'This action cannot be undone.'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-dark w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{title}</h2>
                </div>
              </div>

              <p className="text-muted-foreground">{message}</p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 h-12 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
