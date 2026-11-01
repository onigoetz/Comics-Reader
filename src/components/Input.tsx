import { ComponentProps } from "react";
import classnames from "classnames";

import styles from "./Input.module.css";

interface InputProps extends ComponentProps<"input"> {
  isSearch?: boolean;
}

export default function Input({
  ref,
  className,
  isSearch,
  ...props
}: InputProps) {
  const classes = classnames(styles.Input, className, {
    [styles["Input--search"]]: isSearch
  });

  return <input className={classes} ref={ref} {...props} />;
}
