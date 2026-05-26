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
    // Instant state update - no delay
    if (key === 'C') {
      setExpression('');
      setResult('');
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
          disabled={!result || result === 'Error'}
          onClick={() => onSave(expression, result)}
          className="flex-1 bg-accent/20 border border-accent/30 text-accent h-14 rounded-2xl flex items-center justify-center gap-2 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          Save with Caption
        </motion.button>
      </div>
    </div>
  );
};

export default Calculator;
