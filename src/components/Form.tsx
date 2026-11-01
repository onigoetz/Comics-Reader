import { FormEvent, ReactNode } from "react";

import styles from "./Forms.module.css";

interface FormProps {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit }: FormProps) {
  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
