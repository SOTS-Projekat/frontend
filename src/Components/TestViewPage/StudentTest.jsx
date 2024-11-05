import React from "react";
import styles from "./StudentTest.module.scss";

const StudentTest = ({ test }) => {
  return (
    <div className={styles.testContainer}>
      <h2>{test.title}</h2>
      {test.questions.map((question) => (
        <div key={question.id} className={styles.question}>
          <h4 className={styles.questionTitle}>{question.questionText}</h4>
          <ul className={styles.answerList}>
            {question.offeredAnswers.map((answer) => (
              <li
                key={answer.id}
                className={`${styles.answerItem} ${
                  answer.correct
                    ? styles.correct
                    : answer.userAnswerFlag
                    ? styles.incorrect
                    : ""
                } ${answer.userAnswerFlag ? styles.selected : ""}`}
              >
                {answer.answerText}
                {answer.correct && (
                  <span
                    className={`${styles.answerBadge} ${styles.correctBadge}`}
                  >
                    Tačno
                  </span>
                )}
                {answer.userAnswerFlag && (
                  <span
                    className={`${styles.answerBadge} ${styles.incorrectBadge}`}
                  >
                    Odgovor studenta
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default StudentTest;
