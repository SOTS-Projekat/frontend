import { useEffect, useState } from "react";
import classes from "./CreateTestPage.module.scss";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import AddQuestionModal from "./AddQuestionModal";
import Question from "./Question"; // Import your Question component
import TestService from "../Services/TestService";
import DropdownList from "../UI/DropdownList";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getDecodedToken } from "../../hooks/authUtils";

const CreateTestPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedKnowledgeDomains, setSelectedKnowledgeDomains] = useState([]);
  const [knowledgeDomainOptions, setKnowledgeDomainOptions] = useState([]);
  const [nodeOptions, setNodeOptions] = useState([]);
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tests, setTests] = useState([]);
  const decodedToken = getDecodedToken();

  const role = decodedToken?.role;

  const fetchTests = async () => {
    try {
      const data = await TestService.getAllTests();
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error.message);
    }
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm)
  );

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

  const handleOpenAddQuestionModal = () => {
    if (selectedKnowledgeDomains.length == 0) {
      toast.info("Select at least one domain of knowledge.");
    } else {
      setShowAddQuestionModal(true);
    }
  };

  const handleTestClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  useEffect(() => {
    fetchKnowledgeDomains();
    fetchTests();
  }, []);

  if (!role) {
    return (
      <div className={classes.container}>
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );

  } else if (role === "STUDENT") {
    return (
      <div className={classes.container}>
        <div className={classes.testsSection}>
        <h1>Izaberi test za polaganje</h1> 
          <input
            type="text"
            className={classes.searchInput}
            placeholder="Search tests..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className={classes.grid}>
            {filteredTests.length === 0 ? (
              <div className={classes.emptyMessage}>No tests found.</div>
            ) : (
              filteredTests.map((test) => (
                <div
                  key={test.id}
                  className={classes.card}
                  onClick={() => handleTestClick(test.id)}
                >
                  <div className={classes.cardHeader}>
                    <h3>{test.title}</h3>
                  </div>
                  <div className={classes.cardFooter}>
                    <span>
                      Created on: {new Date(test.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

  } else if (role === "PROFESSOR") {
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
                  options={knowledgeDomainOptions || []}
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
                  onDelete={() => handleDeleteQuestion(index)} 
                />
              ))}
            </div>
          </div>
          <div>
            <Button text="Create test" onClick={handleCreateTest} />
          </div>

          {/* Search and Test List */}
          <div className={classes.testsSection}>
            <input
              type="text"
              className={classes.searchInput}
              placeholder="Search tests..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className={classes.grid}>
              {filteredTests.length === 0 ? (
                <div className={classes.emptyMessage}>No tests found.</div>
              ) : (
                filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className={classes.card}
                    onClick={() => handleTestClick(test.id)}
                  >
                    <div className={classes.cardHeader}>
                      <h3>{test.title}</h3>
                    </div>
                    <div className={classes.cardFooter}>
                      <span>
                        Created on: {new Date(test.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );

  } else {
    return (
      <div className={classes.container}>
        <h2>Access Denied</h2>
        <p>Your role does not have permission to access this page.</p>
      </div>
    );
  }
};


export default CreateTestPage;
