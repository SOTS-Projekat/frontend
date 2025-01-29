import React, { useState, useEffect } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import { useNavigate, useParams } from "react-router";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import NetworkGraph from "../NetworkGraph/NetworkGraph";

const EditKnowledgeDomain = () => {
  const { id } = useParams(); 
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [graphDataOne, setGraphDataOne] = useState(null);
  const [graphDataTwo, setGraphDataTwo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { //  Ovo se poziva 2 puta, pogledati posle da li je mozda greska
    const fetchDomainData = async () => {
      try {
        const response = await KnowledgeDomainService.getOneById(id);
        console.log(response);
        setDomainName(response.name);
        setDescription(response.description);
        setGraphDataOne({
          nodes: response.nodes || [],
          links: response.links || [],
        });

        const secondGraphResponse = await KnowledgeDomainService.getRealKnowledgeDomainById(id);
        console.log(secondGraphResponse);
        setGraphDataTwo({
          nodes: secondGraphResponse.nodes || [],
          links: secondGraphResponse.links || [],
        });
      } catch (error) {
        setError("No real knowledge space for selected space.");
      }
    };

    fetchDomainData();
  }, [id]);

  const handleSave = async () => {
    if (!domainName.trim()) {
      setError("Please enter a valid domain name.");
      return;
    }

    if (!graphDataOne || graphDataOne.nodes.length === 0) {
      setError("Please save a graph before submitting.");
      return;
    }

    setError("");

    const updatedDomain = {
      name: domainName,
      description: description,
      nodes: graphDataOne.nodes,
      links: graphDataOne.links,
    };

    try {
      await KnowledgeDomainService.updateKnowledgeDomain(id, updatedDomain);
      navigate("/knowledge-domain"); 
    } catch (error) {
      setError("Error saving domain data.");
    }
  };

  const handleGraphSave = (graphDataOne) => {
    setGraphDataOne(graphDataOne);
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

      <h2>Pretpostavljeni prostor znanja</h2>
      <NetworkGraph
        onSaveGraph={handleGraphSave} graphData={graphDataOne} showSaveButton={true} 
      />
    
    {graphDataTwo?.nodes?.length > 0 && graphDataTwo?.links?.length > 0 && (
  <>
    <h2>Realni prostor znanja</h2>
    <NetworkGraph
      graphData={graphDataTwo}
      predictedGraphData={graphDataOne}
      showSaveButton={false}
    />
  </>
)}

    
      <button onClick={handleSave} className={styles.saveButton}>
        Save Knowledge Domain
      </button>
    </div>
  );
};

export default EditKnowledgeDomain;
