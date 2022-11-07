import { ReactNode } from 'react';
import './Button.scss';

interface IButtonProps {
  type?: 'button' | 'submit';
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  // variant: string;
}

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  ariaLabel,
}: // variant,
IButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className='Button'
      // variant={variant}
    >
      {children}
    </button>
  );
};

export default Button;
