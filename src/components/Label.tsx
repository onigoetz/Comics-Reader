import { ReactNode } from "react";

import styles from "./Label.module.css";

interface LabelProps {
  children: ReactNode;
  error?: ReactNode;
}

export default function Label({ children, error }: LabelProps) {
  return (
    <label className={styles.Label}>
      {children}
      {error && <span className="Label__text">{error}</span>}
    </label>
  );
}
