import React from "react";
import classnames from "classnames";

import styles from "./Input.module.css";

const Input = React.forwardRef(({ className, isSearch, ...props }, ref) => {
  const classes = classnames(styles.Input, className, {
    [styles["Input--search"]]: isSearch
  });

  return <input className={classes} ref={ref} {...props} />;
});

export default Input;
