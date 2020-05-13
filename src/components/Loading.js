import React from "react";

import styles from "./Loading.module.css";

export function RawLoading({ children }) {
  return (
    <div className={styles.Loading}>
      <div className={styles.Loading__container}>
        <h1 className={styles.Loading__block}>{children}</h1>
      </div>
    </div>
  );
}

export default function Loading() {
  return <RawLoading>Loading...</RawLoading>;
}
