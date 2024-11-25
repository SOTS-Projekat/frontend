import React from "react";
import styles from "./Button.module.scss";

const Button = ({
  text = "Click Me",
  width = "100px",
  height = "40px",
  backgroundColor, // Prebacuje boju ako je prosleđena
  textColor = "white",
  fontSize = "16px",
  borderRadius = "5px",
  onClick,
  disabled = false,
}) => {
  const buttonStyle = {
    width,
    height,
    backgroundColor: backgroundColor || "rgba(50, 88, 123, 1)", // Podrazumevana boja
    color: textColor,
    fontSize,
    borderRadius,
  };

  return (
    <button
      className={styles.button}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
