import React from "react";
import classes from "./LoadingIndicator.module.css";

export default function LoadingIndicator() {
  return (
    <div className={classes["loading-backdrop"]}>
      <div className={classes["loading-indicator"]}></div>
    </div>
  );
}
