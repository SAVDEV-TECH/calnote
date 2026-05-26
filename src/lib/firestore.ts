import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export interface CalculationRecord {
  id?: string;
  userId: string;
  expression: string;
  result: string;
  caption: string;
  created_at: string;
  is_voice_caption: boolean;
  updated_at: string;
}

// Save calculation to Firestore
export const saveCalculation = async (userId: string, data: Omit<CalculationRecord, 'id' | 'userId' | 'updated_at'>) => {
  try {
    const calculationsRef = collection(db, 'calculations', userId, 'records');
    const docRef = await addDoc(calculationsRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw error;
  }
};

// Get all calculations for a user (real-time listener)
export const subscribeToCalculations = (userId: string, callback: (calculations: CalculationRecord[]) => void) => {
  try {
    const calculationsRef = collection(db, 'calculations', userId, 'records');
    const q = query(
      calculationsRef,
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const calculations: CalculationRecord[] = [];
      querySnapshot.forEach((doc) => {
        calculations.push({
          id: doc.id,
          userId,
          ...doc.data()
        } as CalculationRecord);
      });
      callback(calculations);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to calculations:', error);
    throw error;
  }
};

// Delete calculation
export const deleteCalculation = async (userId: string, docId: string) => {
  try {
    await deleteDoc(doc(db, 'calculations', userId, 'records', docId));
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
};
