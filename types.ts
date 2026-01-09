
export interface ReceiptItem {
  description: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  merchant: string;
  date: string;
  category: string;
  subtotal: number;
  tax: number;
  total: number;
  confidence: number;
  currency: string;
  items: ReceiptItem[];
}

export type AppState = 'IDLE' | 'SCANNING' | 'VERIFYING' | 'SUCCESS';
