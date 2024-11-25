import React from "react";
import styles from "./InputField.module.scss";

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text", // Podrazumevani tip input-a
  error,
  style = {}, // Dodatni stilovi
  labelStyle = {}, // Stilovi za labelu
  inputStyle = {}, // Stilovi za input
}) {
  return (
    <div className={styles["input-container"]} style={style}>
      <label className={styles["input-label"]} style={labelStyle}>
        {label}
      </label>
      <input
        type={type}
        className={`${styles["input-field"]} ${error && styles["input-error"]}`}
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className={styles["input-error-text"]}>{error}</p>}
    </div>
  );
}
