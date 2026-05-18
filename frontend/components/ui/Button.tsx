import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'kakao' | 'naver';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-fa-purple text-white hover:bg-fa-purple-hover active:bg-fa-purple-hover disabled:opacity-50',
  secondary:
    'bg-bg-subtle text-text-primary border border-border hover:bg-bg-main disabled:opacity-50',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle',
  kakao:
    'bg-kakao text-kakao-text hover:brightness-95 active:brightness-90',
  naver:
    'bg-naver text-naver-text hover:brightness-95 active:brightness-90',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-lg',
  lg: 'h-12 px-5 text-base rounded-xl font-semibold',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-fa-purple focus:ring-offset-2',
          'disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export default Button;
