import { useEffect, useState } from "react";
import classes from "./CreateTestPage.module.scss";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import AddQuestionModal from "./AddQuestionModal";
import Question from "./Question";
import TestService from "../Services/TestService";
import DropdownList from "../UI/DropdownList";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSession } from "../../hooks/useSession";

const CreateTestPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedKnowledgeDomain, setSelectedKnowledgeDomain] = useState();
  const [knowledgeDomainOptions, setKnowledgeDomainOptions] = useState([]);
  const [nodeOptions, setNodeOptions] = useState([]);
  const [knowledgeDomains, setKnowledgeDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tests, setTests] = useState([]);

  const { user, token } = useSession();

  const role = user.role;

  const fetchTests = async () => {
    try {
      const data = await TestService.getAllTests(user.role, user.id, token);
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error.message);
    }
  };

  const fetchKnowledgeDomains = async () => {
    try {
      const data = await KnowledgeDomainService.getById(user.id, token);
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
      const payload = {
        title,
        knowledgeDomainId: selectedKnowledgeDomain,
        professorId: user.id,
        questions, // ensure each answer has boolean `correct`
      };

      console.log("CreateTest payload:", payload);

      TestService.createTest(payload, token);

      toast.success("Test created successfully");
      navigate("/test");
    } else {
      toast.info("Morate dodati naslov i pitanja");
    }
  };

  const knowledgeDomainChangeHandler = (value) => {
    setSelectedKnowledgeDomain(value);
    const nodeOptionsData = [];
    const knowledgeDomain = knowledgeDomains.find((item) => item.id === value);
    knowledgeDomain.nodes.map((item) => {
      nodeOptionsData.push({
        value: item.id,
        label: item.label,
      });
    });
    console.log(nodeOptionsData);
    setNodeOptions(nodeOptionsData);
  };

  const handleOpenAddQuestionModal = () => {
    if (!selectedKnowledgeDomain) {
      toast.info("Select knowledge domain.");
      return;
    }
    setShowAddQuestionModal(true);
  };

  const handleTestClick = (testId) => {
    navigate(`/test/${testId}`);
  };

  useEffect(() => {
    fetchKnowledgeDomains();
    fetchTests();
  }, []);

  console.log(role);
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
                      Created on:{" "}
                      {new Date(test.createdAt).toLocaleDateString()}
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
            <h1>Create test</h1>
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
                <div className={classes["add-question-button"]}>
                  <Button
                    text="Add question"
                    width="170px"
                    onClick={handleOpenAddQuestionModal}
                  />
                </div>
              </div>
              <div className={classes.input}>
                <DropdownList
                  label="Select knowledge domains*"
                  labelStyle={{ fontSize: "16px" }}
                  options={knowledgeDomainOptions || []}
                  value={selectedKnowledgeDomain}
                  style={{ width: "300px" }}
                  allowClear={true}
                  onClear={() => setSelectedKnowledgeDomain()}
                  onChangeDropdown={knowledgeDomainChangeHandler}
                  placeholder={"Select knowledge domain"}
                  size={"large"}
                  status={selectedKnowledgeDomain ? "success" : "error"}
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
