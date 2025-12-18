import React, { useState } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { useNavigate } from "react-router";
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import { useSession } from "../../hooks/sessionContext";

const CreateKnowledgeDomain = () => {
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [savedGraphData, setSavedGraphData] = useState(null);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [graphError, setGraphError] = useState("");

  const { user, token } = useSession();

  const navigate = useNavigate();

  const handleSave = async () => {
    const nameErr = !domainName.trim()
      ? "Please enter a valid domain name."
      : "";
    const descErr = !description.trim() ? "Please enter description." : "";
    const graphErr =
      !savedGraphData ||
        !Array.isArray(savedGraphData.nodes) ||
        savedGraphData.nodes.length === 0
        ? "Please create and save a graph before submitting."
        : "";

    setNameError(nameErr);
    setDescriptionError(descErr);
    setGraphError(graphErr);

    const hasErrors = !!(nameErr || descErr || graphErr);
    if (hasErrors) return;

    try {
      const knowledgeDomain = {
        professorId: user.id,
        name: domainName.trim(),
        description: description.trim(),
        nodes: savedGraphData.nodes,
        links: savedGraphData.links,
      };

      await KnowledgeDomainService.createKnowledgeDomain(
        knowledgeDomain,
        token
      );
      navigate("/knowledge-domain");
    } catch (err) {
      setGraphError(
        err?.message
          ? `Failed to create knowledge domain: ${err.message}`
          : "Failed to create knowledge domain."
      );
    }
  };

  const handleGraphSave = (graphData) => {
    setSavedGraphData(graphData);
    setGraphError("");
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
          onChange={(e) => {
            setDomainName(e.target.value);
            if (nameError) setNameError("");
          }}
          error={nameError}
          inputStyle={{ height: "40px" }}
        />
        <InputField
          type="text"
          label="Description*"
          placeholder="Insert description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (descriptionError) setDescriptionError("");
          }}
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
