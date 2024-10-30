import React from "react";
import classes from "./Button.module.scss";

export default function Button({ type, label, onClick }) {
  const buttonClass =
    type === "create" ? classes["create-button"] : classes["cancel-button"];

  return (
    <button className={`${classes["button"]} ${buttonClass}`} onClick={onClick}>
      {label}
    </button>
  );
}
