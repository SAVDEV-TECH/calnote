import { useEffect, useState } from 'react';

export interface OfflineCalculation {
  id: string;
  expression: string;
  result: string;
  caption: string;
  created_at: string;
  is_voice_caption: boolean;
  synced: boolean;
}

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState<OfflineCalculation[]>([]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save calculation to localStorage when offline
  const saveOfflineCalculation = (calc: Omit<OfflineCalculation, 'id' | 'synced'>) => {
    try {
      const id = `offline-${Date.now()}`;
      const offlineCalc: OfflineCalculation = {
        ...calc,
        id,
        synced: false
      };

      const existing = localStorage.getItem('calnote_offline_calcs');
      const calcs: OfflineCalculation[] = existing ? JSON.parse(existing) : [];
      calcs.push(offlineCalc);
      localStorage.setItem('calnote_offline_calcs', JSON.stringify(calcs));

      return offlineCalc;
    } catch (error) {
      console.error('Error saving offline calculation:', error);
      return null;
    }
  };

  // Get pending offline calculations
  const getPendingCalculations = (): OfflineCalculation[] => {
    try {
      const existing = localStorage.getItem('calnote_offline_calcs');
      return existing ? JSON.parse(existing) : [];
    } catch (error) {
      console.error('Error getting pending calculations:', error);
      return [];
    }
  };

  // Mark calculation as synced
  const markAsSynced = (id: string) => {
    try {
      const existing = localStorage.getItem('calnote_offline_calcs');
      if (!existing) return;

      const calcs: OfflineCalculation[] = JSON.parse(existing);
      const updated = calcs.map(c => c.id === id ? { ...c, synced: true } : c);
      localStorage.setItem('calnote_offline_calcs', JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking as synced:', error);
    }
  };

  // Clear synced calculations
  const clearSyncedCalculations = () => {
    try {
      const existing = localStorage.getItem('calnote_offline_calcs');
      if (!existing) return;

      const calcs: OfflineCalculation[] = JSON.parse(existing);
      const remaining = calcs.filter(c => !c.synced);
      localStorage.setItem('calnote_offline_calcs', JSON.stringify(remaining));
    } catch (error) {
      console.error('Error clearing synced calculations:', error);
    }
  };

  return {
    isOnline,
    pendingSyncs: getPendingCalculations(),
    saveOfflineCalculation,
    getPendingCalculations,
    markAsSynced,
    clearSyncedCalculations
  };
};
