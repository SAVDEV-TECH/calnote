"use client";

import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Search, Calendar, Clock, Mic, Share2, Trash2, MoreVertical, Calculator as CalcIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const HistoryTimeline = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const history = useLiveQuery(
    () => db.calculations.orderBy('created_at').reverse().toArray()
  );

  const filteredHistory = history?.filter(item => 
    item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.expression.includes(searchQuery) ||
    item.result.includes(searchQuery)
  );

  const deleteRecord = async (id: number) => {
    if (confirm('Delete this calculation?')) {
      await db.calculations.delete(id);
    }
  };

  const shareRecord = (item: any) => {
    const text = `CalcNote: ${item.caption}\n${item.expression} = ${item.result}\nSaved at: ${new Date(item.created_at).toLocaleString()}`;
    if (navigator.share) {
      navigator.share({
        title: 'Calculation Details',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-accent" />
          History
        </h2>
        <span className="text-muted-foreground text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {filteredHistory?.length || 0} Records
        </span>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder="Search by caption or number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
        />
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory?.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-5 rounded-3xl space-y-3 relative overflow-hidden group hover:bg-white/[0.05] transition-colors border border-white/5"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                    <span className="mx-1 opacity-50">•</span>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xl font-bold text-white line-clamp-2 leading-tight">
                    {item.caption}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => shareRecord(item)}
                    className="p-2 hover:bg-accent/20 rounded-full text-muted-foreground hover:text-accent transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => item.id && deleteRecord(item.id)}
                    className="p-2 hover:bg-red-500/20 rounded-full text-muted-foreground hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CalcIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-mono">{item.expression}</div>
                    <div className="text-xl font-bold text-white font-mono">= {item.result}</div>
                  </div>
                </div>
                {item.is_voice_caption && (
                  <div className="bg-accent/20 p-2 rounded-full" title="Captured via voice">
                    <Mic className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!filteredHistory?.length && (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-medium">No records found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTimeline;
