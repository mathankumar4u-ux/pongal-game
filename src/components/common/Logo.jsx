import { clsx } from 'clsx';

const sizes = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-32 h-32',
  xlarge: 'w-40 h-40'
};

export function Logo({ size = 'medium', className = '' }) {
  return (
    <div className={clsx('flex justify-center', className)}>
      <img
        src="/qtmlogo.png"
        alt="QTM Logo"
        className={clsx(
          sizes[size],
          'object-contain'
        )}
      />
    </div>
  );
}
