import { clsx } from 'clsx';
import { ANSWER_OPTIONS } from '../../utils/constants';

export function AnswerOptions({
  options,
  selectedAnswer,
  onSelect,
  disabled
}) {
  return (
    <div className="space-y-3">
      {ANSWER_OPTIONS.map((label) => (
        <button
          key={label}
          onClick={() => onSelect(label)}
          disabled={disabled || selectedAnswer !== null}
          className={clsx(
            "w-full p-4 rounded-xl text-left transition-all duration-200",
            "flex items-center gap-4",
            "active:scale-[0.98] touch-manipulation",
            "min-h-[60px]",
            "focus:outline-none focus:ring-2 focus:ring-gold",
            selectedAnswer === label
              ? "bg-gold text-maroon-dark ring-4 ring-gold-light"
              : "bg-white text-gray-800 hover:bg-gold/10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Option label badge */}
          <span className={clsx(
            "flex-shrink-0 w-10 h-10 rounded-full",
            "flex items-center justify-center font-bold text-lg",
            selectedAnswer === label
              ? "bg-maroon text-white"
              : "bg-gold/20 text-maroon"
          )}>
            {label}
          </span>

          {/* Option text */}
          <span className="flex-1 font-medium">
            {options[label]}
          </span>
        </button>
      ))}
    </div>
  );
}
