import classes from "./Question.module.scss";

const Question = ({ serialNumber, question, onDelete }) => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  return (
    <div className={classes.questionContainer}>
      <h3>
        {serialNumber}. {question.questionText}
      </h3>
      <ul className={classes.answersList}>
        {question.offeredAnswers.map((answer, index) => (
          <li
            key={index}
            className={`${classes.answerItem} ${
              answer.isCorrect ? classes.correctAnswer : ""
            }`}
          >
            {letters[index]}) {answer.answerText}
            {answer.isCorrect && (
              <span className={classes.correctLabel}>✓ Tačan odgovor</span>
            )}
          </li>
        ))}
      </ul>
      <button className={classes["delete-button"]} onClick={onDelete}>
        X
      </button>
    </div>
  );
};

export default Question;
