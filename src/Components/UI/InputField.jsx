import React from "react";
import styles from "./InputField.module.scss";

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  type,
  error,
}) {
  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>{label}</label>
      <input
        type={type}
        className={`${styles["input-field"]} ${error && styles["input-error"]}`} // Dodajemo klasu za grešku ako postoji
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className={styles["input-error-text"]}>{error}</p>}{" "}
    </div>
  );
}
