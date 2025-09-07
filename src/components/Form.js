import styles from "./Forms.module.css";

export default function Form({ children, onSubmit }) {
  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
