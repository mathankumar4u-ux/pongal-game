import { clsx } from 'clsx';

const variants = {
  primary: 'bg-gold hover:bg-gold-light text-maroon-dark',
  secondary: 'bg-white hover:bg-gray-100 text-maroon',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white',
  outline: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-maroon-dark'
};

const sizes = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg'
};

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={clsx(
        'font-semibold rounded-xl transition-all duration-200',
        'active:scale-[0.98] touch-manipulation',
        'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'min-h-[48px]', // Touch-friendly
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
