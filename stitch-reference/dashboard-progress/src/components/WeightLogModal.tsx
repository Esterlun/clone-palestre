import React, { useState } from 'react';

interface WeightLogModalProps {
  mode: 'weight' | 'bodyFat';
  currentWeight: number;
  currentBodyFat: number;
  unit: 'kg' | 'lbs';
  onClose: () => void;
  onSaveWeight: (newWeightKg: number) => void;
  onSaveBodyFat: (newBfPct: number) => void;
}

export const WeightLogModal: React.FC<WeightLogModalProps> = ({
  mode,
  currentWeight,
  currentBodyFat,
  unit,
  onClose,
  onSaveWeight,
  onSaveBodyFat
}) => {
  const [val, setVal] = useState<number>(
    mode === 'weight'
      ? (unit === 'lbs' ? Number((currentWeight * 2.20462).toFixed(1)) : currentWeight)
      : currentBodyFat
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'weight') {
      const weightInKg = unit === 'lbs' ? val / 2.20462 : val;
      onSaveWeight(weightInKg);
    } else {
      onSaveBodyFat(val);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b24]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#c8c4d8]/30">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-xl text-[#1b1b24]">
            {mode === 'weight' ? `Record Peso (${unit.toUpperCase()})` : 'Record Massa Grassa (%)'}
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae6f4] flex items-center justify-center text-[#474555]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center py-4 bg-[#f6f1ff] rounded-2xl border border-[#c8c4d8]/20">
            <span className="text-xs font-semibold text-[#787587] uppercase tracking-wider block mb-1">
              New Measurement
            </span>
            <div className="flex items-center justify-center gap-2">
              <input 
                type="number"
                step="0.1"
                required
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                className="w-32 text-center text-4xl font-extrabold text-[#1b1b24] bg-white border border-[#c8c4d8]/40 rounded-xl py-1 focus:ring-2 focus:ring-[#5340e4] outline-hidden"
              />
              <span className="text-xl font-bold text-[#5340e4]">
                {mode === 'weight' ? unit : '%'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#c8c4d8]/50 text-sm font-semibold text-[#474555] hover:bg-[#eae6f4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5340e4] hover:bg-[#402dcd] text-white text-sm font-bold shadow-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
