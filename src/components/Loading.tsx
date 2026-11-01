import { ReactNode } from "react";

import styles from "./Loading.module.css";

interface RawLoadingProps {
  children: ReactNode;
  inline?: boolean;
}

export function RawLoading({ children, inline }: RawLoadingProps) {
  return (
    <div
      className={`${styles.Loading} ${
        inline ? styles["Loading--inline"] : styles["Loading--overlay"]
      }`}
    >
      <div className={styles.Loading__container}>
        <div className={styles.Loading__spinner} />
        <h1 className={styles.Loading__block}>{children}</h1>
      </div>
    </div>
  );
}

export default function Loading({ inline }: { inline?: boolean }) {
  return <RawLoading inline={inline}>Loading...</RawLoading>;
}
