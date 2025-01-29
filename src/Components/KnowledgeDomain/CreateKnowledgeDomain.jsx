import React, { useState } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import { getDecodedToken } from "../../hooks/authUtils";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { useNavigate } from "react-router";
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import InputField from "../UI/InputField";
import Button from "../UI/Button";

const CreateKnowledgeDomain = () => {
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [savedGraphData, setSavedGraphData] = useState(null);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [graphError, setGraphError] = useState("");

  const navigate = useNavigate();

  const handleSave = () => {
    if (!domainName.trim()) {
      setNameError("Please enter a valid domain name.");
    }

    if (!description.trim()) {
      setDescriptionError("Please enter description.");
    }

    if (!savedGraphData || savedGraphData.nodes.length === 0) {
      setGraphError("Please create and save a graph before submitting.");
    }

    if (nameError === "" || descriptionError === "" || graphError === "") {
      return;
    }

    setNameError("");
    setDescriptionError("");
    setGraphError("");

    const decodedToken = getDecodedToken();

    const knowledgeDomain = {
      professorId: decodedToken.id,
      name: domainName,
      description: description,
      nodes: savedGraphData.nodes,
      links: savedGraphData.links,
    };

    const response =
      KnowledgeDomainService.createKnowledgeDomain(knowledgeDomain);
    // Reset forme (opciono)
    navigate("/knowledge-domain");
  };

  const handleGraphSave = (graphData) => {
    setSavedGraphData(graphData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Create Knowledge Domain</h1>

      <div className={styles.form}>
        <InputField
          type="text"
          label="Domain Name*"
          placeholder="Insert name"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          error={nameError}
          inputStyle={{ height: "40px" }}
        />
        <InputField
          type="text"
          label="Description*"
          placeholder="Insert description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={descriptionError}
          inputStyle={{ height: "40px" }}
        />
      </div>

      <NetworkGraph onSaveGraph={handleGraphSave} showSaveButton={true} />
      {graphError && <div className={styles.error}>{graphError}</div>}
      <Button
        text="Create knowledge domain"
        width="250px"
        height="35px"
        onClick={handleSave}
      />
    </div>
  );
};

export default CreateKnowledgeDomain;
