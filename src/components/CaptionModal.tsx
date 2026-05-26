"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Check, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { cn } from '@/lib/utils';

interface CaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caption: string, isVoice: boolean) => void;
  expression: string;
  result: string;
}

const CaptionModal: React.FC<CaptionModalProps> = ({ isOpen, onClose, onSave, expression, result }) => {
  const [caption, setCaption] = useState('');
  const { isListening, transcript, error, startListening } = useSpeechRecognition();
  const [isVoiceUsed, setIsVoiceUsed] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    if (transcript) {
      setCaption(prev => prev + (prev ? ' ' : '') + transcript);
      setIsVoiceUsed(true);
      setModalError(null); // ✅ Clear error on success
    }
  }, [transcript]);

  const handleTextChange = (value: string) => {
    setCaption(value);
    // ✅ Clear error when user types
    if (value.length > 0) {
      setModalError(null);
    }
  };

  const handleSave = () => {
    onSave(caption, isVoiceUsed);
    setCaption('');
    setIsVoiceUsed(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="glass-dark w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Add Context</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-muted-foreground text-sm mb-1">{expression}</div>
            <div className="text-2xl font-bold text-white">= {result}</div>
          </div>

          <div className="relative">
            <textarea
              autoFocus
              placeholder="What is this calculation for?"
              value={caption}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 min-h-[120px] text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
            />
            {error && (
              <p className="text-red-400 text-xs mt-1 px-2">{error}</p>
            )}
            <button
              onClick={startListening}
              className={cn(
                "absolute bottom-4 right-4 p-3 rounded-full transition-all shadow-lg",
                isListening ? "bg-red-500 animate-pulse" : "bg-accent hover:scale-110 active:scale-95"
              )}
            >
              {isListening ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Mic className="w-5 h-5 text-white" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!caption.trim()}
              className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Check className="w-5 h-5" />
              Save Record
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaptionModal;
