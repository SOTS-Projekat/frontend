import { useState } from "react";
import Backdrop from "../UI/Backdrop";
import Button from "../UI/Button";
import TextAreaField from "../UI/TextAreaField";
import Answer from "./Answer";
import classes from "./AddQuestionModal.module.scss";
import { toast } from "react-toastify";
import DropdownList from "../UI/DropdownList";

const AddQuestionModal = ({ onCreate, onClose, nodeOptionsProp }) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [] = useState(false);
  const [nodeOptions] = useState(nodeOptionsProp);
  const [selectedNode, setSelectedNode] = useState();

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
        toast.info("Molimo označite bar jedan tačan odgovor.");
        return;
      }

      const q = {
        questionText: question,
        connectedNodeId: selectedNode,
        offeredAnswers: answers,
      };
      console.log(q);
      onCreate(q);
      onClose();
    } else {
      toast.info("Molimo unesite pitanje i dodajte barem dva odgovora.");
    }
  };

  const nodeChangeHandler = (value) => {
    setSelectedNode(value);
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className={classes.dialog}>
        <div className={classes.header}>
          <h2>Add question</h2>
        </div>
        <div className={classes["inputs-container"]}>
          <div className={classes["question-input"]}>
            <TextAreaField
              type="text"
              label="Question*"
              placeholder="Insert question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={""}
            />
          </div>
          {nodeOptions.length != 0 && (
            <div>
              <DropdownList
                label="Connect node*"
                labelStyle={{ fontSize: "16px" }}
                options={nodeOptions ? nodeOptions : []}
                value={selectedNode}
                style={{ width: "auto" }}
                allowClear={true}
                onClear={() => setSelectedNode()}
                onChangeDropdown={nodeChangeHandler}
                placeholder={"Select node"}
                size={"large"}
                status={selectedNode ? "success" : "error"}
              />
            </div>
          )}
          <div className={classes["question-input"]}>
            <TextAreaField
              type="text"
              label="Answer*"
              placeholder="Insert answer"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              error={""}
            />
            <Button
              text="+"
              width="40px"
              height="35px"
              onClick={handleAddQuestion}
            />
          </div>
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
          <Button text="Kreiraj" onClick={handleCreate} />
          <Button
            text="Otkaži"
            backgroundColor="rgb(158, 158, 158)"
            onClick={onClose}
          />
        </div>
      </div>
    </>
  );
};

export default AddQuestionModal;
