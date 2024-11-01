import classes from "./Answer.module.scss";

const Answer = ({
  answer,
  onDelete,
  serialNumber,
  isCorrect,
  onCorrectAnswerChange,
}) => {
  return (
    <div className={classes.container}>
      <input
        type="checkbox"
        checked={isCorrect}
        onChange={() => onCorrectAnswerChange(serialNumber)}
      />
      <p>
        {serialNumber + 1}. <strong>{answer}</strong>
      </p>
      <button className={classes["delete-button"]} onClick={onDelete}>
        X
      </button>
    </div>
  );
};

export default Answer;
