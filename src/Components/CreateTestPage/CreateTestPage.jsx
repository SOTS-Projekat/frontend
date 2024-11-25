import { useEffect, useState } from "react";
import classes from "./CreateTestPage.module.scss";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import AddQuestionModal from "./AddQuestionModal";
import Question from "./Question"; // Import your Question component
import TestService from "../Services/TestService";
import DropdownList from "../UI/DropdownList";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { getDecodedToken } from "../../hooks/authUtils";
import { toast } from "react-toastify";

const CreateTestPage = () => {
  const [title, setTitle] = useState("");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedKnowledgeDomains, setSelectedKnowledgeDomains] = useState([]);
  const [knowledgeDomainOptions, setKnowledgeDomainOptions] = useState([]);
  const [nodeOptions, setNodeOptions] = useState([]);
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);

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
      toast.info("Morate dodati naslov i pitanja");
    }
  };

  const knowledgeDomainChangeHandler = (value) => {
    setSelectedKnowledgeDomains(value);
    const nodeOptionsData = [];
    for (let i = 0; i < value.length; i++) {
      const knowledgeDomain = knowledgeDomains.find(
        (item) => item.id === value[i]
      );
      knowledgeDomain.nodes.map((item) => {
        nodeOptionsData.push({
          value: item.id,
          label: item.label,
        });
      });
    }

    setNodeOptions(nodeOptionsData);
  };

  const fetchKnowledgeDomains = async () => {
    try {
      const data = await KnowledgeDomainService.getById();
      setKnowledgeDomains(data);

      const knowledgeDomainData = [];
      data.map((item) => {
        knowledgeDomainData.push({
          value: item.id,
          label: item.name,
        });
      });

      setKnowledgeDomainOptions(knowledgeDomainData);
    } catch (error) {
      console.error("Error fetching and processing data:", error.message);
    }
  };
  const handleOpenAddQuestionModal = () => {
    if (selectedKnowledgeDomains.length == 0) {
      toast.info("Select at least one domain of knowledge.");
    } else {
      setShowAddQuestionModal(true);
    }
  };

  useEffect(() => {
    fetchKnowledgeDomains();
  }, []);

  return (
    <div className={classes.container}>
      {showAddQuestionModal && (
        <AddQuestionModal
          onCreate={handleAddQuestion}
          onClose={() => setShowAddQuestionModal(false)}
          nodeOptionsProp={nodeOptions}
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
                label="Test name*"
                placeholder="Insert name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={""}
                inputStyle={{ height: "40px" }}
              />
              <Button
                text="Add question"
                width="170px"
                onClick={handleOpenAddQuestionModal}
              />
            </div>
            <div className={classes.input}>
              <DropdownList
                label="Select knowledge domains*"
                labelStyle={{ fontSize: "16px" }}
                options={knowledgeDomainOptions ? knowledgeDomainOptions : []}
                value={selectedKnowledgeDomains}
                style={{ width: "300px" }}
                mode={"multiple"}
                allowClear={true}
                onClear={() => setSelectedKnowledgeDomains([])}
                onChangeDropdown={knowledgeDomainChangeHandler}
                placeholder={"Select knowledge domains"}
                size={"large"}
                status={selectedKnowledgeDomains ? "success" : "error"}
              />
            </div>
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
          <Button text="Create test" onClick={() => handleCreateTest()} />
        </div>
      </div>
    </div>
  );
};

export default CreateTestPage;
