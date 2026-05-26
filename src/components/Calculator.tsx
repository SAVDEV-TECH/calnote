"use client";

import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';
import { Delete, Plus, Minus, X, Divide, Equal, History, Save, Mic, Trash2, Share2, Calculator as CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import Particle from './ParticleEffect';

interface CalculatorProps {
  onSave: (expression: string, result: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [tape, setTape] = useState<Array<{ key: string; type: 'number' | 'operator' | 'equals' | 'clear' | 'delete'; time: number }>>([]);
  const [showTape, setShowTape] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; text: string; color: string }>>([]);
  const { playClickSound } = useAudioFeedback();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const createParticles = (x: number, y: number, text: string, color: string) => {
    const newParticles = Array.from({ length: 3 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x,
      y,
      text,
      color
    }));
    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  };

  const handleKeyPress = (key: string) => {
    // Track in tape
    const getTapeType = (k: string): 'number' | 'operator' | 'equals' | 'clear' | 'delete' => {
      if (k === '=') return 'equals';
      if (k === 'C') return 'clear';
      if (k === 'DEL') return 'delete';
      if (['+', '-', '×', '÷', '(', ')'].includes(k)) return 'operator';
      return 'number';
    };
    
    setTape(prev => [...prev, { key, type: getTapeType(key), time: Date.now() }]);

    // Instant state update - no delay
    if (key === 'C') {
      setExpression('');
      setResult('');
      setTape([]); // Clear tape on clear
    } else if (key === '=') {
      calculate();
    } else if (key === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else {
      setExpression(prev => prev + key);
    }

    // Audio and particles happen after state update (non-blocking)
    requestAnimationFrame(() => {
      playClickSound();
      
      const buttonEl = buttonRefs.current[key];
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const isOperator = ['+', '-', '×', '÷', '(', ')', 'C', 'DEL'].includes(key);
        const color = isOperator ? '#8b5cf6' : '#ffffff';
        createParticles(x, y, key, color);
      }
    });
  };

  const calculate = () => {
    try {
      if (!expression) return;
      const cleanExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const calculated = evaluate(cleanExpression);
      
      // Handle NaN and Infinity
      if (!isFinite(calculated)) {
        setResult('Math Error');
        return;
      }
      
      const resultStr = String(calculated);
      setResult(resultStr);
      setHistory(prev => [expression + ' = ' + resultStr, ...prev.slice(0, 4)]);
    } catch (error) {
      setResult('Error');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const validKeys = '0123456789+-*/.()';
      if (validKeys.includes(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Enter') {
        calculate();
      } else if (e.key === 'Backspace') {
        handleKeyPress('DEL');
      } else if (e.key === 'Escape') {
        handleKeyPress('C');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  const buttons = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'DEL', '=']
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4 relative">
      {/* Particle Container */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {particles.map(particle => (
            <Particle key={particle.id} {...particle} />
          ))}
        </AnimatePresence>
      </div>

      {/* Display Area */}
      <div className="glass-dark rounded-3xl p-6 flex flex-col items-end justify-end min-h-[160px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 left-4 opacity-20">
          <CalculatorIcon className="w-6 h-6" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={expression}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.05 }}
            className={cn(
              "font-medium tracking-tight mb-2 break-all",
              expression.length > 20 ? "text-lg" : "text-xl",
              "text-muted-foreground"
            )}
          >
            {expression || '0'}
          </motion.div>
        </AnimatePresence>
        <motion.div 
          animate={{ scale: result ? 1.05 : 1 }}
          transition={{ duration: 0.05 }}
          className={cn(
            "font-bold tracking-tighter text-white break-all",
            result.length > 15 ? "text-3xl" : "text-5xl"
          )}
        >
          {result || ' '}
        </motion.div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn) => (
          <button
            key={btn}
            ref={el => { if (el) buttonRefs.current[btn] = el; }}
            onClick={() => handleKeyPress(btn)}
            onTouchStart={(e) => (e.currentTarget).style.transform = 'scale(0.95)'}
            onTouchEnd={(e) => (e.currentTarget).style.transform = 'scale(1)'}
            onMouseDown={(e) => (e.currentTarget).style.transform = 'scale(0.95)'}
            onMouseUp={(e) => (e.currentTarget).style.transform = 'scale(1)'}
            onMouseLeave={(e) => (e.currentTarget).style.transform = 'scale(1)'}
            className={cn(
              "h-16 rounded-2xl text-xl font-semibold flex items-center justify-center shadow-sm relative overflow-hidden active:opacity-80 transition-transform duration-75",
              btn === '=' ? "bg-primary text-white col-span-1" : 
              ['+', '-', '×', '÷', '(', ')', 'C', 'DEL'].includes(btn) ? "glass text-accent hover:bg-white/10" : 
              "glass text-white hover:bg-white/5"
            )}
          >
            {btn === 'DEL' ? <Delete className="w-6 h-6" /> : btn}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex gap-3 mt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTape(!showTape)}
          className="flex-1 bg-accent/20 border border-accent/30 text-accent h-14 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-accent/30 transition-colors"
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">Tape</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!result || result === 'Error'}
          onClick={() => onSave(expression, result)}
          className="flex-1 bg-accent/20 border border-accent/30 text-accent h-14 rounded-2xl flex items-center justify-center gap-2 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span className="hidden sm:inline">Save</span>
        </motion.button>
      </div>

      {/* Tape Modal */}
      <AnimatePresence>
        {showTape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowTape(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 w-full sm:w-96 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-accent" />
                  Calculator Tape
                </h3>
                <button
                  onClick={() => setShowTape(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tape Display */}
              {tape.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No operations yet</p>
                  <p className="text-xs">Your calculation steps will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 bg-black/20 rounded-2xl p-4 border border-white/10">
                  {tape.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono",
                        item.type === 'equals' && "bg-primary/20 text-primary font-bold",
                        item.type === 'operator' && "bg-accent/20 text-accent",
                        item.type === 'clear' && "bg-red-500/20 text-red-400",
                        item.type === 'delete' && "bg-orange-500/20 text-orange-400",
                        item.type === 'number' && "text-white"
                      )}
                    >
                      <span className="text-xs text-muted-foreground w-8 text-right">{idx + 1}.</span>
                      <span className="flex-1">{item.key === 'DEL' ? '← DEL' : item.key === 'C' ? 'CLEAR' : item.key}</span>
                      {item.type === 'equals' && <span className="text-accent">=</span>}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Clear Tape Button */}
              {tape.length > 0 && (
                <button
                  onClick={() => setTape([])}
                  className="w-full h-10 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-semibold"
                >
                  Clear Tape
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calculator;
