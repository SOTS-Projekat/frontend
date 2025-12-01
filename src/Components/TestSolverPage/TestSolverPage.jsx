import React, { useEffect, useState } from "react";
import styles from "./TestSolverPage.module.scss";
import TestService from "../Services/TestService";
import { useParams } from "react-router";
import LoadingIndicator from "../UI/LoadingIndicator";
import { useSession } from "../../hooks/useSession";
import Button from "../UI/Button";

const TestSolverPage = () => {
  const { id } = useParams();
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);

  const { user, token } = useSession();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const fetchedTest = await TestService.getTestById(id, token);
        setTestData(fetchedTest);
        setAnswers(new Array(fetchedTest.questions.length).fill(null));
        setCurrentQuestionIndex(0);
      } catch (error) {
        console.error("Greška prilikom učitavanja testa:", error);
      }
    };
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (testData) {
      setSelectedAnswer(answers[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, testData]);

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = index;
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleFinishTest = async () => {
    setCompleted(true);
    const score = calculateScore();

    const answeredQuestions = answers.map((answerIndex, questionIndex) => ({
      questionId: testData.questions[questionIndex].id,
      answerId:
        answerIndex !== null
          ? testData.questions[questionIndex].offeredAnswers[answerIndex].id
          : null,
    }));

    await TestService.solveTest(
      {
        testId: id,
        userId: user.id,
        answeredQuestions,
        score,
      },
      token
    );
  };

  const calculateScore = () => {
    const pointsPerQuestion = 100 / testData.questions.length;
    return answers.reduce((score, answerIndex, i) => {
      return (
        score +
        (answerIndex !== null &&
        testData.questions[i].offeredAnswers[answerIndex].correct
          ? pointsPerQuestion
          : 0)
      );
    }, 0);
  };

  if (!testData) {
    return <LoadingIndicator />;
  }

  const currentQuestion = testData.questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.testContainer}>
        <h1>{testData.title}</h1>
        <div className={styles.questionContainer}>
          <h2>{currentQuestion.questionText}</h2>
          <div className={styles.answers}>
            {currentQuestion.offeredAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`${styles.answerButton} ${
                  selectedAnswer === index ? styles.selected : ""
                }`}
              >
                {answer.answerText}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.navigationButtons}>
          <Button
            text="Prethodno pitanje"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            width="150px"
          />
          {currentQuestionIndex < testData.questions.length - 1 ? (
            <Button
              text="Naredno pitanje"
              onClick={handleNextQuestion}
              width="150px"
            />
          ) : (
            <Button
              text="Završi test"
              onClick={handleFinishTest}
              width="150px"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSolverPage;
