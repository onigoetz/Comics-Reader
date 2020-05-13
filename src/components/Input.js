import React from "react";
import classnames from "classnames";

import styles from "./Input.module.css";

export function Input({ className, isSearch, ...props }) {
  const classes = classnames(styles.Input, className, {
    [styles.InputSearch]: isSearch
  });

  return <input className={classes} {...props} />;
}
