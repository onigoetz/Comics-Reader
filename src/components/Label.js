// eslint-disable-next-line no-unused-vars
import React from "react";

import styles from "./Label.module.css";

export default function Label({ children, error }) {
  return (
    <label className={styles.Label}>
      {children}
      {error && <span className="Label__text">{error}</span>}
    </label>
  );
}
