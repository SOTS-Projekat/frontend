import React, { useState, useEffect } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import { useNavigate, useParams } from "react-router";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import NetworkGraph from "../NetworkGraph/NetworkGraph";

const EditRealKnowledgeDomain = () => {
  const { id } = useParams(); 
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [savedGraphData, setSavedGraphData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { 
    const fetchDomainData = async () => {
      try {
        const response = await KnowledgeDomainService.getRealKnowledgeDomainById(id);
        console.log("Fetched domain data:", response);
        setDomainName(response.name);
        setDescription(response.description);
        setSavedGraphData({
          nodes: response.nodes || [],
          links: response.links || [],
        });
      } catch (error) {
        setError("Error fetching domain data.");
      }
    };

    fetchDomainData();
  }, [id]);

  const handleSave = async () => {
    if (!domainName.trim()) {
      setError("Please enter a valid domain name.");
      return;
    }

    if (!savedGraphData || savedGraphData.nodes.length === 0) {
      setError("Please save a graph before submitting.");
      return;
    }

    setError("");

    const updatedDomain = {
      name: domainName,
      description: description,
      nodes: savedGraphData.nodes,
      links: savedGraphData.links,
    };

    try {
      await KnowledgeDomainService.updateKnowledgeDomain(id, updatedDomain);
      navigate("/knowledge-domain"); 
    } catch (error) {
      setError("Error saving domain data.");
    }
  };

  const handleGraphSave = (graphData) => {
    setSavedGraphData(graphData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Edit Knowledge Domain</h1>

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

      <NetworkGraph onSaveGraph={handleGraphSave} graphData={savedGraphData} />

      <button onClick={handleSave} className={styles.saveButton}>
        Save Real Knowledge Domain
      </button>
    </div>
  );
};

export default EditRealKnowledgeDomain;
