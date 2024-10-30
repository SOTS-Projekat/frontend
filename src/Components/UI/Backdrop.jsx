import classes from "./Backdrop.module.scss";

export default function Backdrop({ onClose }) {
  return <div className={classes["backdrop"]} onClick={onClose}></div>;
}
