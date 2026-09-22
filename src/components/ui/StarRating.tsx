import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number; // 0 to 5 (può essere decimale per sola visualizzazione)
  onChange?: (val: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 18,
  interactive = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={`transition-transform ${
              interactive ? 'hover:scale-125 cursor-pointer focus:outline-none' : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300 dark:text-slate-600 dark:fill-slate-800'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
