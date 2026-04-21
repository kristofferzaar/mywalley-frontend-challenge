import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={['button', `button--${variant}`, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
