
import React from 'react';
import { ReceiptData } from '../types';

interface DetailsFormProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  isEditable: boolean;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ data, onChange, isEditable }) => {
  const handleFieldChange = (field: keyof ReceiptData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section className="bg-white dark:bg-surface-dark rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] px-4 pt-2 pb-32 -mt-4 relative z-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
      {/* Bottom Sheet Handle */}
      <div className="flex justify-center py-3">
        <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <div className="flex items-center justify-between px-1 mb-4">
        <h3 className="text-gray-900 dark:text-white text-xl font-bold">Extracted Details</h3>
        <span className="text-xs font-semibold px-2 py-1 bg-accent/20 text-accent rounded uppercase tracking-wider">
          {Math.round(data.confidence * 100)}% Match
        </span>
      </div>

      <div className="space-y-4">
        {/* Merchant Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Merchant</label>
          <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/50 focus-within:ring-2 ring-primary/50 transition-all">
            <input
              readOnly={!isEditable}
              className="flex-1 bg-transparent border-none text-gray-900 dark:text-white h-14 px-4 text-lg font-semibold focus:ring-0"
              value={data.merchant}
              onChange={(e) => handleFieldChange('merchant', e.target.value)}
            />
            <div className="flex items-center px-4 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
          </div>
        </div>

        {/* Date & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Date</label>
            <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/50">
              <input
                readOnly={!isEditable}
                className="flex-1 bg-transparent border-none text-gray-900 dark:text-white h-14 px-4 text-base font-semibold focus:ring-0"
                value={data.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Category</label>
            <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background-dark/50">
              <select
                disabled={!isEditable}
                className="flex-1 bg-transparent border-none text-gray-900 dark:text-white h-14 px-4 text-base font-semibold focus:ring-0 appearance-none cursor-pointer"
                value={data.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
              >
                <option value="Food & Drink">Food & Drink</option>
                <option value="Travel">Travel</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        {data.items && data.items.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest pl-1">Line Items</label>
            <div className="bg-gray-50 dark:bg-background-dark/30 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Item</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase text-center w-12">Qty</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase text-right w-20">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-bold text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financials Section */}
        <div className="bg-gray-50 dark:bg-background-dark/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
              <div className="flex items-center">
                <span className="text-gray-400 font-semibold mr-1">$</span>
                <input
                  readOnly={!isEditable}
                  type="number"
                  step="0.01"
                  className="w-24 text-right bg-transparent border-none p-0 text-gray-900 dark:text-white font-semibold focus:ring-0"
                  value={data.subtotal}
                  onChange={(e) => handleFieldChange('subtotal', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Tax</span>
                <span className="material-symbols-outlined text-accent text-[16px]">info</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 font-semibold mr-1">$</span>
                <input
                  readOnly={!isEditable}
                  type="number"
                  step="0.01"
                  className="w-24 text-right bg-transparent border-none p-0 text-gray-900 dark:text-white font-semibold focus:ring-0"
                  value={data.tax}
                  onChange={(e) => handleFieldChange('tax', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-900 dark:text-white font-bold text-lg">Total</span>
              <div className="flex items-center">
                <span className="text-primary font-bold text-xl mr-1">$</span>
                <input
                  readOnly={!isEditable}
                  type="number"
                  step="0.01"
                  className="w-32 text-right bg-transparent border-none p-0 text-primary dark:text-primary font-bold text-2xl focus:ring-0"
                  value={data.total}
                  onChange={(e) => handleFieldChange('total', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="flex items-center justify-between px-1 py-2">
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-white font-semibold">Match to Bank Transaction</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Found 1 potential match in Chase ***42</span>
          </div>
          <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-primary transition-colors focus:outline-none">
            <span className="inline-block h-5 w-5 transform translate-x-6 rounded-full bg-white transition-transform shadow-sm"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DetailsForm;
