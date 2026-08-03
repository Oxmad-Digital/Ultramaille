"use client";

import { useState } from "react";
import styles from "./PasswordField.module.css";

export default function PasswordField({
  id,
  value,
  onChange,
  autoComplete,
  className,
  inputClassName,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={`${styles.input} ${inputClassName ?? ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.6 21.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
