import React from "react";
import styles from "./SelectField.module.scss";

export default function SelectField({
  label,
  options,
  value,
  onChange,
  error,
}) {
  return (
    <div className={styles["select-container"]}>
      <label className={styles["select-label"]}>{label}</label>
      <select
        className={`${styles["select-field"]} ${
          error && styles["select-error"]
        }`}
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={styles["select-error-text"]}>{error}</p>}
    </div>
  );
}
