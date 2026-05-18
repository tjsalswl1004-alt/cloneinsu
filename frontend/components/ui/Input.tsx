'use client';

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  togglePassword?: boolean;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, togglePassword, type = 'text', error, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputType = togglePassword ? (visible ? 'text' : 'password') : type;
    const inputId = id ?? `input-${label ?? Math.random().toString(36).slice(2, 7)}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'h-11 w-full rounded-lg border bg-bg-surface px-3 text-sm text-text-primary',
              'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-fa-purple/30',
              'focus:border-fa-purple transition-colors',
              icon && 'pl-10',
              togglePassword && 'pr-10',
              error ? 'border-red-400' : 'border-border',
              className,
            )}
            {...props}
          />
          {togglePassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {visible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export default Input;
