import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';

const GraphSetup = () => {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleSvgClick = (event) => {
    const coords = d3.pointer(event);

    const clickedNode = nodes.find(node => {
      const dx = coords[0] - node.x;
      const dy = coords[1] - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 25; 
    });

    if (clickedNode) {
      handleNodeClick(clickedNode);
    } else {
      const label = prompt("Enter a new node:");
      if (label) {
        const newNode = { id: `node-${nodes.length}`, x: coords[0], y: coords[1], label };
        setNodes((prevNodes) => {
          const newNodes = [...prevNodes, newNode];
          
          const newEdges = [];
          newNodes.forEach((newNode) => {
            newNodes.forEach((existingNode) => {
              if (newNode !== existingNode) {
                const dx = newNode.x - existingNode.x;
                const dy = newNode.y - existingNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= 130) {
                  const edgeId = `${newNode.id}-${existingNode.id}`;
                  if (!edges.some(edge => edge.id === edgeId)) {
                    const edgeName = prompt(`Name the edge between ${newNode.label} and ${existingNode.label}:`);
                    if (edgeName) {
                      newEdges.push({
                        id: edgeId,
                        name: edgeName,
                        source: newNode.id,
                        target: existingNode.id,
                      });
                    }
                  }
                }
              }
            });
          });

          setEdges((prevEdges) => [...prevEdges, ...newEdges]);

          return newNodes;
        });
      }
    }
  };

  const handleNodeClick = (node) => {
    const newLabel = prompt("Rename current node:", node.label);
    if (newLabel) {
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === node.id ? { ...n, label: newLabel } : n
        )
      );
    }
  };

  const handleNodeRightClick = (event, node) => {
    event.preventDefault();
    const confirmation = window.confirm("Are you sure you want to delete this node?");
    if (confirmation) {
      setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));
      setEdges((prevEdges) => prevEdges.filter((e) => e.source.id !== node.id && e.target.id !== node.id));
    }
  };

  const handleEdgeClick = (edge, event) => {
    event.stopPropagation();
    const newEdgeName = prompt("Rename the edge:", edge.name);
    if (newEdgeName) {
      setEdges((prevEdges) =>
        prevEdges.map((e) =>
          e.id === edge.id ? { ...e, name: newEdgeName } : e
        )
      );
    }
    console.log(edge);
  };

  const drag = d3.drag()
    .on("start", (event) => {
      d3.select(event.sourceEvent.target).raise().classed("active", true);
    })
    .on("drag", (event, d) => {
      d.x = event.x;
      d.y = event.y;
      updateGraph();
    })
    .on("end", (event) => {
      d3.select(event.sourceEvent.target).classed("active", false);
    });

  const updateGraph = () => {
    const svg = d3.select(svgRef.current);

    // Render edges
    svg.selectAll(".edge")
      .data(edges)
      .join("line")
      .attr("class", "edge")
      .attr("stroke", "#999")
      .attr("stroke-width", 4)
      .attr("stroke-dasharray", "5,5")
      .attr("x1", (d) => nodes.find(node => node.id === d.source)?.x) //  These 4 coordinates connects edges to the nodes
      .attr("y1", (d) => nodes.find(node => node.id === d.source)?.y)
      .attr("x2", (d) => nodes.find(node => node.id === d.target)?.x)
      .attr("y2", (d) => nodes.find(node => node.id === d.target)?.y)
      .style("cursor", "pointer")
      .on("click", (event, edge) => handleEdgeClick(edge, event));

    // Render edge labels
    svg.selectAll(".edge-label")
      .data(edges)
      .join("text")
      .attr("class", "edge-label")
      .attr("x", (d) => {
        const sourceNode = nodes.find(node => node.id === d.source);
        const targetNode = nodes.find(node => node.id === d.target);
        return sourceNode && targetNode ? (sourceNode.x + targetNode.x) / 2 : 0;
      })
      .attr("y", (d) => {
        const sourceNode = nodes.find(node => node.id === d.source);
        const targetNode = nodes.find(node => node.id === d.target);
        return sourceNode && targetNode ? (sourceNode.y + targetNode.y) / 2 : 0;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text(d => d.name);

    // Render nodes
    svg.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("fill", "#69b3a2")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .style("cursor", "pointer")
      .on("click", (event, d) => handleNodeClick(d))
      .on("contextmenu", (event, d) => handleNodeRightClick(event, d))
      .call(drag);

    // Render node labels
    svg.selectAll(".label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text(d => d.label);
  };

  useEffect(() => {
    updateGraph();
  }, [nodes, edges]);

  return (
    <div>
      <svg ref={svgRef} onClick={handleSvgClick} style={{ background: "#f0f0f0", width: '800px', height: '600px' }}></svg>
    </div>
  );
};

export default GraphSetup;
