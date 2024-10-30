import React from "react";
import styles from "./InputField.module.scss";

export default function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  type,
}) {
  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]}>{label}</label>
      <textarea
        type={type}
        className={styles["input-field"]}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
