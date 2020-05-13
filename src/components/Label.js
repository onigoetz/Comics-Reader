import React from "react";

import styles from "./Label.module.css";

export default function Message({ children, error }) {
  return (
    <label className={styles.Label}>
      {children}
      {error && <span className="Label__text">{error}</span>}
    </label>
  );
}
