import React from 'react';
import { StarRating } from './StarRating';

interface CategoryRatingSliderProps {
  label: string;
  icon?: React.ReactNode;
  value: number; // 1 to 5
  onChange: (val: number) => void;
  description?: string;
}

export const CategoryRatingSlider: React.FC<CategoryRatingSliderProps> = ({
  label,
  icon,
  value,
  onChange,
  description,
}) => {
  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Critico';
      case 2: return 'Scarso';
      case 3: return 'Sufficiente';
      case 4: return 'Buono';
      case 5: return 'Eccellente';
      default: return '';
    }
  };

  const getScoreColor = (val: number) => {
    if (val <= 2) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (val === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-500">{icon}</div>}
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{label}</h4>
            {description && <p className="text-xs text-slate-400">{description}</p>}
          </div>
        </div>

        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getScoreColor(value)}`}>
          {value}/5 · {getRatingLabel(value)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <StarRating value={value} onChange={onChange} interactive size={18} />
      </div>
    </div>
  );
};
