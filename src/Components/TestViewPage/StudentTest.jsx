import React, { useState } from "react";
import styles from "./StudentTest.module.scss";
import Button from "../UI/Button";

const StudentTest = ({ test }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = test.questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.testContainer}>
        <h1>{test.title}</h1>
        <div className={styles.questionContainer}>
          <h2>{currentQuestion.questionText}</h2>
          <div className={styles.answers}>
            {currentQuestion.offeredAnswers.map((answer) => (
              <div
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
                {answer.userAnswerFlag && !answer.correct && (
                  <span
                    className={`${styles.answerBadge} ${styles.incorrectBadge}`}
                  >
                    Vaš odgovor
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.navigationButtons}>
          <Button
            text="Prethodno pitanje"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            width="150px"
            backgroundColor="rgba(50, 88, 123, 1)"
          />
          <Button
            text={
              currentQuestionIndex < test.questions.length - 1
                ? "Sljedeće pitanje"
                : "Završi pregled"
            }
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === test.questions.length - 1}
            width="150px"
            backgroundColor="rgba(50, 88, 123, 1)"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentTest;
