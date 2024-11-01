import { useState } from "react";
import Backdrop from "../UI/Backdrop";
import Button from "../UI/Button";
import TextAreaField from "../UI/TextAreaField";
import Answer from "./Answer";
import classes from "./AddQuestionModal.module.scss";
import { toast } from "react-toastify";

const AddQuestionModal = ({ onCreate, onClose }) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddQuestion = () => {
    if (answers.length < 4 && inputAnswer.trim()) {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { answerText: inputAnswer, isCorrect: false },
      ]);
      setInputAnswer("");
    } else {
      //toast.info("Maksimalan broj pitanja je 4!");
    }
  };

  const handleCorrectAnswerChange = (index) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, i) => ({
        ...answer,
        isCorrect: i === index,
      }))
    );
  };

  const handleCreate = () => {
    if (question && answers.length >= 2) {
      const hasCorrectAnswer = answers.some((answer) => answer.isCorrect);

      if (!hasCorrectAnswer) {
        alert("Molimo označite bar jedan tačan odgovor.");
        return;
      }

      const q = { questionText: question, offeredAnswers: answers };
      console.log(q);
      onCreate(q);
      onClose();
    } else {
      alert("Molimo unesite pitanje i dodajte barem dva odgovora.");
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className={classes.dialog}>
        <div className={classes.header}>
          <h2>Evidentiraj</h2>
        </div>
        <div className={classes["inputs-container"]}>
          <div className={classes["question-input"]}>
            <TextAreaField
              type="text"
              label="Pitanje*"
              placeholder="Unesite pitanje"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={""}
            />
            <Button
              type="create"
              label="Dodaj odgovor"
              onClick={() => setShowInput(!showInput)}
            />
          </div>
          {showInput && (
            <div className={classes["question-input"]}>
              <TextAreaField
                type="text"
                label="Odgovor*"
                placeholder="Unesite odgovor"
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                error={""}
              />
              <Button type="create" label="+" onClick={handleAddQuestion} />
            </div>
          )}
          <div className={classes["answers-container"]}>
            {answers.map((a, index) => (
              <Answer
                key={index}
                answer={a.answerText}
                serialNumber={index}
                isCorrect={a.isCorrect}
                onCorrectAnswerChange={handleCorrectAnswerChange}
                onDelete={() => {
                  setAnswers((prevAnswers) =>
                    prevAnswers.filter((_, i) => i !== index)
                  );
                }}
              />
            ))}
          </div>
        </div>
        <div className={classes["buttons-container"]}>
          <Button type="create" label="Kreiraj" onClick={handleCreate} />
          <Button type="cancel" label="Otkaži" onClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default AddQuestionModal;
