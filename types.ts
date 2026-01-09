
export interface ReceiptData {
  merchant: string;
  date: string;
  category: string;
  subtotal: number;
  tax: number;
  total: number;
  confidence: number;
  currency: string;
}

export type AppState = 'IDLE' | 'SCANNING' | 'VERIFYING' | 'SUCCESS';
