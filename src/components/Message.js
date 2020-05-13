import React from "react";

import styles from "./Message.module.css";

export default function Message({ children }) {
  return <div className={`${styles.Message} ${styles.error}`}>{children}</div>;
}
