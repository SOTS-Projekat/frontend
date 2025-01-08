import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import styles from "./NetworkGraph.module.scss";

const NetworkGraph = ({ onSaveGraph, graphData }) => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const draggingSourceNode = useRef(null);

  const simulation = useRef(
    d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(250, 250))
  ).current;

  useEffect(() => {
    simulateForceLayout(nodes, links);
  }, [nodes, links]);

  useEffect(() => {
  if (graphData) {
    const updatedNodes = (graphData.nodes || []).map((node) => ({
      ...node,
      name: node.label,
      x: Math.random() * 500,
      y: Math.random() * 500,
    }));
    const updatedLinks = (graphData.links || []).map((link) => ({
      id: link.id,
      name: link.label,
      sourceNodeId: +link.sourceNode?.id,
      targetNodeId: +link.targetNode?.id,
    }));

    setNodes(updatedNodes);
    setLinks(updatedLinks);

    simulateForceLayout(updatedNodes, updatedLinks);
  }
  }, [graphData]);

  const simulateForceLayout = (nodes, links) => {
    const svg = d3.select(svgRef.current);
    const width = 500;
    const height = 500;

    svg.select("defs").remove(); 
    const defs = svg.append("defs");

    defs
      .append("marker") //  Strelica na target
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10) 
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5") 
      .attr("fill", "black");
  
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  
    simulation.nodes(nodes).on("tick", () => {
      nodes.forEach((node) => {
        node.x = clamp(node.x, 10, width - 10);
        node.y = clamp(node.y, 10, height - 10);
      });
  
      svg.selectAll(".link")
      .data(links, (d) => `${d.sourceNodeId}-${d.targetNodeId}`)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)")
            .style("cursor", "pointer")
            .on("click", (event, d) => {
              console.log(d);
              event.stopPropagation();
              const newLabel = prompt("Rename the link:", d.name);
              if (newLabel) {
                setLinks((prevLinks) =>
                  prevLinks.map((link) =>
                    link.sourceNodeId === d.sourceNodeId &&
                    link.targetNodeId === d.targetNodeId
                      ? { ...link, name: newLabel }
                      : link
                  )
                );
              }
            })
            .on("contextmenu", (event, d) => handleRightClickLink(event, d)),
        (update) => update.attr("marker-end", "url(#arrowhead)"),
        (exit) => exit.remove()
      )
      .attr("x1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNodeId);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr("y1", (d) => {
        const sourceNode = nodes.find((node) => node.id === d.sourceNodeId);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr("x2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.targetNodeId);
        return targetNode ? targetNode.x : 0;
      })
      .attr("y2", (d) => {
        const targetNode = nodes.find((node) => node.id === d.targetNodeId);
        return targetNode ? targetNode.y : 0;
      });

      svg.selectAll(".node")
      .data(nodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "node")
            .attr("r", 20)
            .attr("fill", "red")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mousedown", (event, d) => {
              if (event.button === 1) { // Check for middle mouse button
                handleNodeMiddleClick(event, d);
              }
            }) 
            .on("contextmenu", (event, d) => handleRightClickNode(event, d))
            .call(
              d3.drag()
                .on("start", (event, d) => {
                  if (!event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on("drag", (event, d) => {
                  d.fx = event.x;
                  d.fy = event.y;
                })
                .on("end", (event, d) => {
                  if (!event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
            ),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
    

      svg.selectAll(".node-label")
        .data(nodes, (d) => d.id)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "node-label")
              .attr("text-anchor", "middle")
              .style("font-size", "12px")
              .style("fill", "black"),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 35)
        .text((d) => d.name);
  
      svg.selectAll(".link-label")
        .data(links, (d) => `${d.sourceNodeId}-${d.targetNodeId}`)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("class", "link-label")
              .attr("text-anchor", "middle")
              .style("font-size", "12px")
              .style("fill", "black"),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("x", (d) => {
          const sourceNode = nodes.find((node) => node.id === d.sourceNodeId);
          const targetNode = nodes.find((node) => node.id === d.targetNodeId);
          return (sourceNode.x + targetNode.x) / 2;
        })
        .attr("y", (d) => {
          const sourceNode = nodes.find((node) => node.id === d.sourceNodeId);
          const targetNode = nodes.find((node) => node.id === d.targetNodeId);
          return (sourceNode.y + targetNode.y) / 2 - 10;
        })
        .text((d) => d.name);
    });
  
    simulation.force("link").links(
      links.map((link) => ({
        source: nodes.find((node) => node.id === link.sourceNodeId),
        target: nodes.find((node) => node.id === link.targetNodeId),
      }))
    );
  
    simulation.alpha(1).restart();
  };
  
  
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
      console.log(clickedNode);
      const newName = prompt("Rename the node:", clickedNode.name);
      if (newName) {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === clickedNode.id ? { ...node, name: newName } : node
          )
        );
      }
      return; 
    }

    createNode(coords[0], coords[1]);
  }
};

const createNode = (x, y) => {
  const name = prompt("Name a new node:");
  if (name) {
    setNodes((prevNodes) => {
      
      const newNode = {
        id: crypto.randomUUID(),
        name: name,
        x: x,
        y: y,
      };

      return [...prevNodes, newNode];
    });
  }
};

const handleRightClickNode = (event, node) => {
  event.preventDefault();
  event.stopPropagation();

  const confirmDelete = window.confirm(`Are you sure you want to delete node: ${node.name}?`);
  if (confirmDelete) {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.filter((n) => n.id !== node.id);
      setLinks((prevLinks) =>
        prevLinks.filter(
          (link) => link.sourceNodeId !== node.id && link.targetNodeId !== node.id
        )
      );

      return updatedNodes;
    });
  }
};

const handleRightClickLink = (event, link) => {
  event.preventDefault();
  event.stopPropagation();

  const confirmDelete = window.confirm(`Are you sure you want to delete link: ${link.name}?`);
  if (confirmDelete) {
    setLinks((prevLinks) =>
      prevLinks.filter(
        (l) =>
          l.sourceNodeId !== link.sourceNodeId || l.targetNodeId !== link.targetNodeId
      )
    );
  }
};

const handleNodeMiddleClick = (event, sourceNode) => {
  if (event.button === 1) {
    event.preventDefault(); // Prevent default middle mouse behavior
    draggingSourceNode.current = sourceNode;

    const svg = d3.select(svgRef.current);
    const tempLine = svg
      .append("line")
      .attr("class", "temp-link")
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    svg.on("mousemove", (event) => {
      const [x, y] = d3.pointer(event);
      tempLine
        .attr("x1", sourceNode.x)
        .attr("y1", sourceNode.y)
        .attr("x2", x)
        .attr("y2", y);
    });

    svg.on("mouseup", (event) => {
      const [x, y] = d3.pointer(event);
      console.log("SOURCE Node:", draggingSourceNode.current);
    
      const targetNode = nodes.find(
        (node) => Math.hypot(node.x - x, node.y - y) < 20
      );
    
      console.log("TARGET Node:", targetNode);
    
      if (targetNode && targetNode.id !== draggingSourceNode.current.id) {
        const label = prompt("Enter link label:");
        if (label) {
          addLink(draggingSourceNode.current.id, targetNode.id, label);
        }
      }
    
      tempLine.remove();
      svg.on("mousemove", null).on("mouseup", null);
      draggingSourceNode.current = null;
    });
  }
}

  const addLink = (sourceNodeId, targetNodeId, name = "New Link") => {
      setLinks((prevLinks) => {
        const newLink = {
          name,
          sourceNodeId,
          targetNodeId
        };

        return [...prevLinks, newLink];
      });
    };


    const handleSaveGraph = () => {
      const transformedLinks = (links || []).map((link) => ({
        name: link.name,
        source: { id: link.sourceNodeId },
        target: { id: link.targetNodeId },
      }));
    
      const currentGraphData = {
        nodes: nodes || [], 
        links: transformedLinks || [], 
      };
    
      console.log("Graph Data to Save:", currentGraphData);
    
      if (onSaveGraph) {
        onSaveGraph(currentGraphData);
      }
    };
    
    

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
