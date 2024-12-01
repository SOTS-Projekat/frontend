import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import styles from "./NetworkGraph.module.scss";

const NetworkGraph = ({ onSaveGraph }) => {
  const [graphData, setGraphData] = useState({
    nodes: [],
    links: [],
  });

  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  let tempLink = null;
  let selectedNode = null;

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
        const newName = prompt("Rename the node:", clickedNode.name);
        if (newName) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === clickedNode.id ? { ...node, name: newName } : node
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
        name: name,
        x: x,
        y: y,
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
    }
  };

  const handleMiddleMouseDown = (event) => {
    event.preventDefault();
    if (event.button !== 1) return;

    const svg = d3.select(svgRef.current);
    const coords = d3.pointer(event);

    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt(
        Math.pow(coords[0] - node.x, 2) + Math.pow(coords[1] - node.y, 2)
      );
      return distance < 30;
    });

    if (clickedNode) {
      selectedNode = clickedNode;

      tempLink = svg
        .append("line")
        .attr("class", "temp-link")
        .attr("x1", clickedNode.x)
        .attr("y1", clickedNode.y)
        .attr("x2", clickedNode.x)
        .attr("y2", clickedNode.y)
        .attr("stroke", "grey")
        .attr("stroke-width", 2);
    }

    const handleMouseMove = (moveEvent) => {
        if (tempLink) {
            const moveCoords = d3.pointer(moveEvent);
            tempLink
            .attr("x2", moveCoords[0])
            .attr("y2", moveCoords[1]);
        }
        
    };

    const handleMouseUp = (upEvent) => {
    
        const moveCoords = d3.pointer(upEvent);
        const targetNode = nodes.find((node) => {
            const distance = Math.sqrt(
            Math.pow(moveCoords[0] - node.x, 2) + Math.pow(moveCoords[1] - node.y, 2)
            );
            return distance < 30;
        });

        if (targetNode && selectedNode !== targetNode) {
            const linkName = prompt("Name the connection:");
            if (linkName) {
            const newLink = { source: selectedNode.id, target: targetNode.id, name: linkName };
            
            setLinks((prevLinks) => {
                const updatedLinks = [...prevLinks, newLink];
                console.log("Created link:", newLink);  
                return updatedLinks;
            });
            }
        }

        if (tempLink) {
            tempLink.remove();
            tempLink = null;
        }

        
        };

        svg.on("mousemove", handleMouseMove);
        svg.on("mouseup", handleMouseUp);
  };

  const handleRightClick = (event, node) => {
    event.preventDefault();  

    const confirmDelete = window.confirm(`Are you sure you want to delete node ${node.name}?`);
    if (confirmDelete) {
      setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));
      setLinks((prevLinks) => prevLinks.filter((link) => link.source !== node.id && link.target !== node.id));
    }
  };

  const updateGraph = () => {
    const svg = d3.select(svgRef.current);

    const link = svg.selectAll(".link").data(links, (d) => `${d.source}-${d.target}`);
  
    link
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr("y1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr("x2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.target);
        return targetNode ? targetNode.x : 0;
      })
      .attr("y2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.target);
        return targetNode ? targetNode.y : 0;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        console.log(d);
        event.stopPropagation(); 
        const newName = prompt("Rename the connection:", d.name);
        if (newName) {
          setLinks((prevLinks) =>
            prevLinks.map((link) =>
              link.source === d.source && link.target === d.target
                ? { ...link, name: newName }
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
              (link) => !(link.source === d.source && link.target === d.target)
            )
          );
        }
      });
  
    link
      .exit()
      .remove();  
  
    const linkLabel = svg.selectAll(".link-label").data(links, (d) => `${d.source}-${d.target}`);
  
    linkLabel
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("x", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        const targetNode = nodes.find((node) => node.id === d.target);
        return (sourceNode.x + targetNode.x) / 2;
      })
      .attr("y", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.source);
        const targetNode = nodes.find((node) => node.id === d.target);
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
        const newName = prompt("Rename the node:", d.name);
        if (newName) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === d.id ? { ...node, name: newName } : node
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
      .text((d) => d.name)
      .style("font-size", "12px")
      .style("fill", "black");
  
    nodeLabel
      .exit()
      .remove(); 

      //update nakon sto preimenujemo
    nodeLabel  
        .text((d) => d.name);
    linkLabel
        .text((d) => d.name);
  };
  
  useEffect(() => {
    setGraphData({ nodes, links });
  }, [nodes, links]);

  const handleSaveGraph = () => {
    console.log("Graph Data:", graphData);
    if (onSaveGraph) {
      onSaveGraph(graphData);
    }
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
        onMouseDown={handleMiddleMouseDown}
      ></svg>
      <button onClick={handleSaveGraph} className={styles.saveButton}>
        Save Graph
      </button>
    </div>
  );
};

export default NetworkGraph;
