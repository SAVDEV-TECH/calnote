"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Clock, Mic, Share2, Trash2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { subscribeToCalculations, deleteCalculation, CalculationRecord } from '@/lib/firestore';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Calculator as CalcIcon } from 'lucide-react';

const HistoryTimeline = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false });
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationRecord | null>(null);
  const { user } = useAuth();

  // ✅ Subscribe to real-time Firestore updates
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToCalculations(user.uid, (calculations) => {
      setHistory(calculations);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // ✅ Memoize filtered results
  const filteredHistory = useMemo(() => {
    return history.filter(item =>
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.expression.includes(searchQuery) ||
      item.result.includes(searchQuery)
    );
  }, [history, searchQuery]);

  const handleDelete = async () => {
    if (deleteConfirm.id && user) {
      try {
        await deleteCalculation(user.uid, deleteConfirm.id);
        setDeleteConfirm({ open: false });
        setSelectedCalculation(null);
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete calculation');
      }
    }
  };

  const shareRecord = (item: CalculationRecord) => {
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

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="h-[500px] overflow-y-auto scroll-smooth pr-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredHistory?.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCalculation(item)}
                className="glass p-5 rounded-3xl space-y-3 relative overflow-hidden group hover:bg-white/[0.08] transition-all border border-white/5 cursor-pointer hover:border-accent/30"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
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
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareRecord(item);
                      }}
                      className="p-2 hover:bg-accent/20 rounded-full text-muted-foreground hover:text-accent transition-all"
                      aria-label="Share calculation"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ open: true, id: item.id });
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-full text-muted-foreground hover:text-red-400 transition-all"
                      aria-label="Delete calculation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CalcIcon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                      <div className="text-sm text-muted-foreground font-mono whitespace-nowrap">{item.expression}</div>
                      <div className="text-xl font-bold text-white font-mono whitespace-nowrap">= {item.result}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.is_voice_caption && (
                      <div className="bg-accent/20 p-2 rounded-full" title="Captured via voice">
                        <Mic className="w-4 h-4 text-accent" />
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!filteredHistory?.length && !loading && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-medium">No records found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCalculation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCalculation(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 w-full sm:w-96 p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{selectedCalculation.caption}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedCalculation.created_at).toLocaleDateString()}
                    <span className="mx-1 opacity-50">•</span>
                    {new Date(selectedCalculation.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCalculation(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Calculation Display */}
              <div className="bg-black/30 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Expression</p>
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    <div className="text-2xl font-mono font-bold text-accent whitespace-nowrap py-2">
                      {selectedCalculation.expression}
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-white/10" />
                
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Result</p>
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    <div className="text-3xl font-mono font-bold text-white whitespace-nowrap py-2">
                      = {selectedCalculation.result}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="bg-black/20 rounded-2xl p-4 space-y-3 border border-white/5">
                {selectedCalculation.is_voice_caption && (
                  <div className="flex items-center gap-2 text-accent text-sm">
                    <Mic className="w-4 h-4" />
                    <span>Recorded via voice input</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Created: {new Date(selectedCalculation.created_at).toLocaleString()}</div>
                  <div>Updated: {new Date(selectedCalculation.updated_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    shareRecord(selectedCalculation);
                    setSelectedCalculation(null);
                  }}
                  className="flex-1 h-12 rounded-2xl bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => {
                    setSelectedCalculation(null);
                    setDeleteConfirm({ open: true, id: selectedCalculation.id });
                  }}
                  className="flex-1 h-12 rounded-2xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={deleteConfirm.open}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false })}
        title="Delete Calculation?"
        message="This calculation will be permanently deleted from your history."
      />
    </div>
  );
};

export default HistoryTimeline;
