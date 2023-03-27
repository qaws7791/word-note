
import React, { FC, ButtonHTMLAttributes, ReactElement } from 'react';
import styles from '@/styles/Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function Button({ 
  children,
  className = '', 
  onClick, 
  ...rest 
}: ButtonProps) :ReactElement {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};