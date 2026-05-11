import Dexie, { type Table } from 'dexie';

export interface CalculationRecord {
  id?: number;
  expression: string;
  result: string;
  caption: string;
  created_at: string;
  is_voice_caption: boolean;
}

export class CalcNoteDB extends Dexie {
  calculations!: Table<CalculationRecord>;

  constructor() {
    super('CalcNoteDB');
    this.version(1).stores({
      calculations: '++id, expression, result, caption, created_at, is_voice_caption'
    });
  }
}

export const db = new CalcNoteDB();
