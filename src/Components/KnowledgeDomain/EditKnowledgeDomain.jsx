import React, { useState, useEffect } from "react";
import styles from "./CreateKnowledgeDomain.module.scss";
import { useNavigate, useParams } from "react-router";
import KnowledgeDomainService from "../Services/KnowledgeDomainService";
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import InputField from "../UI/InputField";
import Button from "../UI/Button";
import { useSession } from "../../hooks/useSession";

const EditKnowledgeDomain = () => {
  const { id } = useParams();
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [graphDataOne, setGraphDataOne] = useState(null);
  const [graphDataTwo, setGraphDataTwo] = useState(null);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [graphError, setGraphError] = useState("");
  const navigate = useNavigate();

  const { token, user } = useSession();

  useEffect(() => {
    //  Ovo se poziva 2 puta, pogledati posle da li je mozda greska
    const fetchDomainData = async () => {
      try {
        const response = await KnowledgeDomainService.getOneById(id, token);
        console.log(response);
        setDomainName(response.name);
        setDescription(response.description);
        setGraphDataOne({
          nodes: response.nodes || [],
          links: response.links || [],
        });

        const secondGraphResponse =
          await KnowledgeDomainService.getRealKnowledgeDomainById(id, token);
        console.log(secondGraphResponse);
        setGraphDataTwo({
          nodes: secondGraphResponse.nodes || [],
          links: secondGraphResponse.links || [],
        });
      } catch (error) {
        setGraphError("No real knowledge space for selected space.");
        console.error(error);
      }
    };

    fetchDomainData();
  }, [id]);

  const handleSave = async () => {
    if (!domainName.trim()) {
      setNameError("Please enter a valid domain name.");
    }

    if (!description.trim()) {
      setDescriptionError("Please enter description.");
    }

    if (!graphDataOne || graphDataOne.nodes.length === 0) {
      setGraphError("Please create and save a graph before submitting.");
    }

    if (nameError === "" || descriptionError === "" || graphError === "") {
      return;
    }

    setNameError("");
    setDescriptionError("");
    setGraphError("");

    const updatedDomain = {
      name: domainName,
      description: description,
      nodes: graphDataOne.nodes,
      links: graphDataOne.links,
    };

    try {
      await KnowledgeDomainService.updateKnowledgeDomain(
        id,
        updatedDomain,
        token
      );
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

      <h1>Pretpostavljeni prostor znanja</h1>
      <NetworkGraph
        onSaveGraph={handleGraphSave}
        graphData={graphDataOne}
        showSaveButton={true}
      />

      {graphDataTwo?.nodes?.length > 0 && graphDataTwo?.links?.length > 0 && (
        <>
          <h1>Realni prostor znanja</h1>
          <NetworkGraph
            graphData={graphDataTwo}
            predictedGraphData={graphDataOne}
            showSaveButton={false}
          />
        </>
      )}
      {graphError && <div className={styles.error}>{graphError}</div>}

      {user?.role === "PROFESSOR" && (
        <Button
          text="Save updated knowledge domain"
          width="270px"
          height="35px"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default EditKnowledgeDomain;
