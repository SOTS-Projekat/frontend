import React, { useEffect, useState } from "react";
import styles from "./TestSolverPage.module.scss";
import test from "../../data";
import TestService from "../Services/TestService";
import { useParams } from "react-router";
import LoadingIndicator from "../UI/LoadingIndicator";
import { getDecodedToken } from "../../hooks/authUtils";

const TestSolverPage = () => {
  const { id } = useParams();
  const [testData, setTestData] = useState(test);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState(
    Array(testData.questions.length).fill(null)
  );
  const [completed, setCompleted] = useState(false);
  const decodedToken = getDecodedToken();

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(answers[currentQuestionIndex + 1] || null);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
  };

  const handleFinishTest = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
    setCompleted(true);

    // Strukturiranje podataka za ResultResponse
    const answeredQuestions = updatedAnswers.map(
      (answerIndex, questionIndex) => ({
        questionId: testData.questions[questionIndex].id,
        answerId:
          answerIndex !== null
            ? testData.questions[questionIndex].offeredAnswers[answerIndex].id
            : null,
      })
    );

    TestService.solveTest({
      testId: testData.id,
      userId: decodedToken.id,
      answeredQuestions,
    });
  };

  const calculateScore = () => {
    return answers.reduce((score, answerIndex, i) => {
      return (
        score +
        (answerIndex !== null &&
        testData.questions[i].offeredAnswers[answerIndex].isCorrect
          ? 1
          : 0)
      );
    }, 0);
  };

  // if (completed) {
  //   const score = calculateScore();
  //   return (
  //     <div className={styles.completed}>
  //       <h2>Test završen!</h2>
  //       <p>
  //         Vaš rezultat: {score} / {testData.questions.length}
  //       </p>
  //       <p>Hvala na učestvovanju.</p>
  //     </div>
  //   );
  // }

  // if (!testData) {
  //   return <LoadingIndicator />;
  // }

  const currentQuestion = testData.questions[currentQuestionIndex];

  useEffect(() => {
    const fetchTest = async () => {
      try {
        console.log(id);
        const fetchedTest = await TestService.getTestById(id);
        console.log(fetchedTest);
        setTestData(fetchedTest);
        setAnswers(Array(fetchedTest.questions.length).fill(null));
      } catch (error) {
        console.error("Greška prilikom učitavanja testa:", error);
      }
    };

    fetchTest();
  }, [id]);

  return (
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
        <button
          onClick={handlePrevQuestion}
          className={styles.navButton}
          disabled={currentQuestionIndex === 0}
        >
          Prethodno pitanje
        </button>
        {currentQuestionIndex < testData.questions.length - 1 ? (
          <button onClick={handleNextQuestion} className={styles.navButton}>
            Sledeće pitanje
          </button>
        ) : (
          <button onClick={handleFinishTest} className={styles.finishButton}>
            Završi test
          </button>
        )}
      </div>
    </div>
  );
};

export default TestSolverPage;
