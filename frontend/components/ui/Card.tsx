import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-bg-surface border border-border p-5',
          'shadow-card',
          hoverable && 'hover:shadow-card-hover transition-shadow cursor-pointer',
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

export default Card;
