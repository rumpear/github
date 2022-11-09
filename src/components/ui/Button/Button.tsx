import { ReactNode } from 'react';
import classNames from 'classnames';
import { TType, TVariant } from './types';
import './Button.scss';

interface IButtonProps {
  type?: TType;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  variant?: TVariant;
}

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  ariaLabel,
  variant = 'default',
}: IButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames([
        'Button',
        { 'Button-default': variant === 'default' },
        { 'Button-icon': variant === 'icon' },
      ])}
    >
      {children}
    </button>
  );
};

export default Button;
