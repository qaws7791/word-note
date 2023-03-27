import React, { ChangeEvent, InputHTMLAttributes, ReactElement } from 'react';
import styles from "@/styles/Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  type,
  value,
  onChange,
  placeholder,
  className = '',
  ...rest
}: InputProps): ReactElement {
  return (
    <input
      type={type}
      className={`${styles.input} ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
}