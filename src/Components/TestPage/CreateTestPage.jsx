import { useState } from "react";
import classes from "./CreateTestPage.module.scss";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import AddQuestionModal from "./AddQuestionModal";
import Question from "./Question"; // Import your Question component
import TestService from "../Services/TestService";

const CreateTestPage = () => {
  const [title, setTitle] = useState("");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = (question) => {
    setQuestions((prevState) => [...prevState, question]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, i) => i !== index)
    );
  };

  const handleCreateTest = () => {
    if (questions.length !== 0 && title !== "") {
      TestService.createTest({ title: title, questions: questions });
    } else {
      alert("Morate dodati naslov i pitanja");
    }
  };

  return (
    <div className={classes.container}>
      {showAddQuestionModal && (
        <AddQuestionModal
          onCreate={handleAddQuestion}
          onClose={() => setShowAddQuestionModal(false)}
        />
      )}
      <div className={classes["test-container"]}>
        <div className={classes.header}>
          <h1>Kreiraj test</h1>
        </div>
        <div className={classes.content}>
          <div className={classes["container-input"]}>
            <div className={classes.input}>
              <InputField
                type="text"
                label="Naziv*"
                placeholder="Unesite naziv"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={""}
              />
            </div>
            <Button
              type="create"
              label="Dodaj pitanje"
              onClick={() => setShowAddQuestionModal(true)}
            />
          </div>

          {/* Section for listing questions */}
          <div className={classes["questions-list"]}>
            {questions.map((question, index) => (
              <Question
                key={index}
                serialNumber={index + 1}
                question={question}
                onDelete={() => handleDeleteQuestion(index)} // Pass delete handler
              />
            ))}
          </div>
        </div>
        <div>
          <Button
            type="create"
            label="Kreiraj test"
            onClick={() => handleCreateTest()}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTestPage;
