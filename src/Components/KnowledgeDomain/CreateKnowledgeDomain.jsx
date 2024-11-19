import React, { useState } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import GraphBuilder from "../GraphForStudentAnswers/GraphBuilder";
import { getDecodedToken } from "../../hooks/authUtils";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import { useNavigate } from "react-router";

const CreateKnowledgeDomain = () => {
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [savedGraphData, setSavedGraphData] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSave = () => {
    if (!domainName.trim()) {
      setError("Please enter a valid domain name.");
      return;
    }

    if (!savedGraphData || savedGraphData.nodes.length === 0) {
      setError("Please create and save a graph before submitting.");
      return;
    }

    setError("");

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
        <label htmlFor="domainName" className={styles.label}>
          Domain Name
        </label>
        <input
          id="domainName"
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter the domain name"
          className={styles.input}
        />
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the description"
          className={styles.input}
        />
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <GraphBuilder onSaveGraph={handleGraphSave} />

      <button onClick={handleSave} className={styles.saveButton}>
        Save Knowledge Domain
      </button>
    </div>
  );
};

export default CreateKnowledgeDomain;
