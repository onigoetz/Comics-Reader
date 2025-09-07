import classnames from "classnames";

import styles from "./Input.module.css";

export default function Input({ ref, className, isSearch, ...props }) {
  const classes = classnames(styles.Input, className, {
    [styles["Input--search"]]: isSearch
  });

  return <input className={classes} ref={ref} {...props} />;
}
