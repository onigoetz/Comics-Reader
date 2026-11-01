import { ReactNode } from "react";

import styles from "./Message.module.css";

export default function Message({ children }: { children: ReactNode }) {
  return <div className={`${styles.Message} ${styles.error}`}>{children}</div>;
}
