"use client";

import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { Delete, Plus, Minus, X, Divide, Equal, History, Save, Mic, Trash2, Share2, Calculator as CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorProps {
  onSave: (expression: string, result: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleKeyPress = (key: string) => {
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
  };

  const calculate = () => {
    try {
      if (!expression) return;
      const cleanExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const calculated = evaluate(cleanExpression);
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
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
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
            className="text-muted-foreground text-xl font-medium tracking-tight mb-2 break-all"
          >
            {expression || '0'}
          </motion.div>
        </AnimatePresence>
        <motion.div 
          animate={{ scale: result ? 1.1 : 1 }}
          className="text-5xl font-bold tracking-tighter text-white break-all"
        >
          {result || ' '}
        </motion.div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn) => (
          <motion.button
            key={btn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleKeyPress(btn)}
            className={cn(
              "h-16 rounded-2xl text-xl font-semibold flex items-center justify-center transition-colors shadow-sm",
              btn === '=' ? "bg-primary text-white col-span-1" : 
              ['+', '-', '×', '÷', '(', ')', 'C', 'DEL'].includes(btn) ? "glass text-accent" : 
              "glass text-white hover:bg-white/5"
            )}
          >
            {btn === 'DEL' ? <Delete className="w-6 h-6" /> : btn}
          </motion.button>
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
