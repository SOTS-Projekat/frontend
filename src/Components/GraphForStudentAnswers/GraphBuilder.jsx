import React, { useState, useEffect, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";
import styles from "./GraphBuilder.module.scss";

const GraphBuilder = ({ onSaveGraph }) => {
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeName, setNodeName] = useState("");
  const [nodeColor, setNodeColor] = useState("#007bff");
  const [linkSource, setLinkSource] = useState("");
  const [linkTarget, setLinkTarget] = useState("");
  const [linkName, setLinkName] = useState("");

  const graphRef = useRef();

  // Dodavanje čvora
  const addNode = () => {
    if (!nodeName.trim()) return alert("Ime čvora ne može biti prazno!");
    const newNodeId = crypto.randomUUID(); // Generisanje jedinstvenog ID-a
    setGraphData((prevData) => ({
      ...prevData,
      nodes: [
        ...prevData.nodes,
        { id: newNodeId, name: nodeName, color: nodeColor }, // Dodaj novi čvor sa jedinstvenim ID-om
      ],
    }));
    setNodeName("");
    setNodeColor("#007bff");
  };

  // Dodavanje veze sa imenom
  const addLink = () => {
    if (!linkSource || !linkTarget) {
      return alert("Izaberi oba čvora za povezivanje!");
    }
    if (linkSource === linkTarget) {
      return alert("Čvor ne može biti povezan sam sa sobom!");
    }
    if (!linkName.trim()) return alert("Ime veze ne može biti prazno!");
    setGraphData((prevData) => ({
      ...prevData,
      links: [
        ...prevData.links,
        { source: linkSource, target: linkTarget, name: linkName },
      ],
    }));
    setLinkSource("");
    setLinkTarget("");
    setLinkName("");
  };

  // Izmena čvora
  const editNode = () => {
    if (!selectedNode) return alert("Izaberi čvor za uređivanje!");
    setGraphData((prevData) => ({
      ...prevData,
      nodes: prevData.nodes.map((node) =>
        node.id === selectedNode
          ? { ...node, name: nodeName, color: nodeColor }
          : node
      ),
    }));
    setSelectedNode(null);
    setNodeName("");
    setNodeColor("#007bff");
  };

  // Brisanje čvora i povezanih veza
  const deleteNode = () => {
    if (!selectedNode) return alert("Izaberi čvor za brisanje!");
    setGraphData((prevData) => ({
      nodes: prevData.nodes.filter((node) => node.id !== selectedNode),
      links: prevData.links.filter(
        (link) => link.source !== selectedNode && link.target !== selectedNode
      ),
    }));
    setSelectedNode(null);
  };

  // Čuvanje grafa
  const handleSaveGraph = () => {
    console.log("Graph Data:", graphData);
    if (onSaveGraph) {
      onSaveGraph(graphData);
    }
  };

  // Konfiguracija razmaka između povezanih čvorova
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("link").distance(() => 150); // Podešavanje razmaka
    }
  }, [graphData]);

  return (
    <div className={styles.container}>
      {/* Dodavanje i izmena čvorova */}
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Ime čvora"
          className={styles.input}
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
        />
        <input
          type="color"
          className={styles.input}
          value={nodeColor}
          onChange={(e) => setNodeColor(e.target.value)}
        />
        <button onClick={addNode} className={styles.button}>
          Dodaj čvor
        </button>
        <button onClick={editNode} className={styles.button}>
          Izmeni čvor
        </button>
        <button onClick={deleteNode} className={styles.button}>
          Obriši čvor
        </button>
      </div>

      <div className={styles.inputGroup}>
        <select
          value={selectedNode || ""}
          onChange={(e) => setSelectedNode(e.target.value)}
          className={styles.select}
        >
          <option value="">Izaberi čvor za uređivanje</option>
          {graphData.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dodavanje veze */}
      <div className={styles.inputGroup}>
        <select
          value={linkSource}
          onChange={(e) => setLinkSource(e.target.value)}
          className={styles.select}
        >
          <option value="">Izvor čvora</option>
          {graphData.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
        <select
          value={linkTarget}
          onChange={(e) => setLinkTarget(e.target.value)}
          className={styles.select}
        >
          <option value="">Ciljni čvor</option>
          {graphData.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Ime veze"
          className={styles.input}
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />
        <button onClick={addLink} className={styles.button}>
          Poveži čvorove
        </button>
      </div>

      {/* Graf */}
      <div className={styles.graphContainer}>
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          linkDirectionalArrowLength={8} // Dodaje strelice za smer veze
          linkDirectionalArrowRelPos={0.5} // Pozicija strelice na sredini veze
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";

            // Crtanje imena iznad čvora
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x, node.y);

            ctx.stroke();
          }}
          width={800}
          height={600}
        />
      </div>

      <button onClick={handleSaveGraph} className={styles.saveButton}>
        Save Graph
      </button>
    </div>
  );
};

export default GraphBuilder;
