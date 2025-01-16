import classes from "./DeleteModal.module.scss";
import Backdrop from "../UI/Backdrop";
import Button from "../UI/Button";

export default function DeleteModal({ onDelete, onClose }) {
  return (
    <>
      <Backdrop onClose={onClose} />
      <div className={classes.dialog}>
        <div className={classes.header}>
          <h2>Warning</h2>
        </div>
        <div className={classes.message}>
          <p>Are you sure you want to delete the test?</p>
        </div>
        <div className={classes["buttons-container"]}>
          <Button text="Cancel" onClick={onClose} backgroundColor="gray" />
          <Button text="Delete" onClick={onDelete} backgroundColor="red" />
        </div>
      </div>
    </>
  );
}
