import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import styles from "./NetworkGraph.module.scss";

const NetworkGraph = ({ onSaveGraph, graphData }) => {

  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const setGraphData = (newNodes, newLinks) => {
    setNodes(newNodes);
    setLinks(newLinks);
    onSaveGraph({ nodes: newNodes, links: newLinks });
  };

  useEffect(() => {
    if (graphData) {
      console.log("Graph data received:", graphData);
      setNodes(graphData.nodes);
      setLinks(graphData.links);
    }
  }, [graphData]);


  const handleSvgClick = (event) => {
    if (event.button === 0) {
      const coords = d3.pointer(event);
      const clickedNode = nodes.find((node) => {
        const distance = Math.sqrt(
          Math.pow(coords[0] - node.x, 2) + Math.pow(coords[1] - node.y, 2)
        );
        return distance < 30;
      });

      if (clickedNode) {
        const newName = prompt("Rename the node:", clickedNode.label);
        if (newName) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === clickedNode.id ? { ...node, label: newName } : node
            )
          );
        }
      } else {
        createNode(coords[0], coords[1]);
      }
    }
  };

  const createNode = (x, y) => {
    const newNodeId = crypto.randomUUID();
    const name = prompt("Name a new node:");
    if (name) {
      const newNode = {
        id: newNodeId,
        label: name,
        x: x, // Set coordinates for the new node
        y: y,
      };
      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes, newNode];
        setGraphData(updatedNodes, links); // Odmah u metodi stavimo, umesto na kraju da zovemo uz useEffect
        return updatedNodes;
      });
    }
  };


const handleRightClick = (event, node) => {
  event.preventDefault();
  event.stopPropagation();

  const confirmDelete = window.confirm(`Are you sure you want to delete node: ${node.label}?`);
  if (confirmDelete) {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter((n) => n.id !== node.id);

      setLinks((prevLinks) => prevLinks.filter((link) => link.sourceNode.id !== node.id && link.targetNode.id !== node.id));
      setGraphData(updatedNodes, links);
      return updatedNodes;
    });
  }
};

const handleSaveGraph = () => {
  console.log("Graph Data:", graphData);
  if (onSaveGraph) {
    onSaveGraph(graphData);
  }
};

  const updateGraph = () => {
    const svg = d3.select(svgRef.current);

    const link = svg.selectAll(".link").data(links, (d) => `${d.sourceNode}-${d.targetNode}`);
  
    link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNode.id);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr("y1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNode.id);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr("x2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.targetNode.id);
        return targetNode ? targetNode.x : 0;
      })
      .attr("y2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.targetNode.id);
        return targetNode ? targetNode.y : 0;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        console.log(d);
        event.stopPropagation(); 
        const newName = prompt("Rename the connection:", d.label);
        if (newName) {
          setLinks((prevLinks) =>
            prevLinks.map((link) =>
              link.sourceNode.id === d.sourceNode.id && link.targetNode.id === d.targetNode.id
                ? { ...link, label: newName }
                : link
            )
          );
        }
      })
      .on("contextmenu", (event, d) => {
        event.preventDefault();  
        const confirmDelete = window.confirm(`Are you sure you want to delete this link?`);
        if (confirmDelete) {
          setLinks((prevLinks) =>
            prevLinks.filter(
              (link) => !(link.sourceNode.id === d.sourceNode.id && link.targetNode.id === d.targetNode.id)
            )
          );
        }
      });
  
    link
      .exit()
      .remove();  
  
    const linkLabel = svg.selectAll(".link-label").data(links, (d) => `${d.sourceNode.id}-${d.targetNode.id}`);
  
    linkLabel
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("x", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNode.id);
        const targetNode = nodes.find((node) => node.id === d.targetNode.id);
        return (sourceNode.x + targetNode.x) / 2;
      })
      .attr("y", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNode.id);
        const targetNode = nodes.find((node) => node.id === d.targetNode.id);
        return (sourceNode.y + targetNode.y) / 2 - 10; 
      })
      .attr("text-anchor", "middle")
      .text((d) => d.name)
      .style("font-size", "12px")
      .style("fill", "black");
  
    linkLabel
      .exit()
      .remove(); 
  
    const node = svg.selectAll(".node").data(nodes, (d) => d.id);
  
    node
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", "red")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        console.log(d);
        const newName = prompt("Rename the node:", d.label);
        if (newName) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === d.id ? { ...node, label: newName } : node
            )
          );
        }
      })
      .on("contextmenu", (event, d) => handleRightClick(event, d))
      .on("mouseenter", function () {
        d3.select(this)
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .style("filter", "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.3))");
      })
      .on("mouseleave", function () {
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .style("filter", "none");
      });
  
    node
      .exit()
      .remove();  
  
    const nodeLabel = svg.selectAll(".node-label").data(nodes, (d) => d.id);
  
    nodeLabel
      .enter()
      .append("text")
      .attr("class", "node-label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 35) // Position label a bit below the node
      .attr("text-anchor", "middle")
      .text((d) => d.label)
      .style("font-size", "12px")
      .style("fill", "black");
  
    nodeLabel
      .exit()
      .remove(); 

      //update nakon sto preimenujemo
    nodeLabel  
        .text((d) => d.label);
    linkLabel
        .text((d) => d.label);
  };

  useEffect(() => {
    updateGraph();
  }, [nodes, links]);


  return (
    <div className={styles.wrapper}>
      <svg
        ref={svgRef}
        className={styles.svg}
        onClick={handleSvgClick}
        
      ></svg>
      <button onClick={handleSaveGraph} className={styles.saveButton}>
        Save Graph
      </button>
    </div>
  );
};

export default NetworkGraph;
