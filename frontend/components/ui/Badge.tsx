import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'auth' | 'unauth' | 'locked' | 'success' | 'review' | 'pending';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  auth: 'bg-badge-auth-bg text-badge-auth-text',
  unauth: 'bg-badge-unauth-bg text-badge-unauth-text',
  locked: 'bg-bg-subtle text-text-muted',
  success: 'bg-status-done text-status-done-text',
  review: 'bg-status-review text-status-review-text',
  pending: 'bg-status-pending text-status-pending-text',
};

export default function Badge({
  variant = 'auth',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
