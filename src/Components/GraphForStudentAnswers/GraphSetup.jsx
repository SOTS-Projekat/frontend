import React, { useRef, useState } from 'react';
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
      return Math.sqrt(dx * dx + dy * dy) < 20; 
    });

    if (clickedNode) {
      handleNodeClick(clickedNode, event); // If an existing node is clicked, rename it
    } else {
      const label = prompt("Enter a new node:");
      if (label) {
        const newNode = { id: `node-${nodes.length}`, x: coords[0], y: coords[1], label };
        setNodes((prevNodes) => [...prevNodes, newNode]);
      }
    }
  };

  const handleNodeClick = (node) => {
    console.log("Node clicked:", node);

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
      setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id)); //  Remove nodes and edges associated with this node
      setEdges((prevEdges) => prevEdges.filter((e) => e.source.id !== node.id && e.target.id !== node.id));
    }
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
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // Render nodes
    svg.selectAll(".node")
    .data(nodes)
    .join("circle")
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", "#69b3a2")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("cursor", "pointer") 
    .on("click", (event, d) => handleNodeClick(d, event)) 
    .on("contextmenu", (event, d) => handleNodeRightClick(event, d)) // Handle right-click to remove node
    .call(drag);

    // Render labels
    svg.selectAll(".label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 20)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text((d) => d.label);
  };

  const addEdge = (sourceNode, targetNode) => {
    if (sourceNode.id !== targetNode.id) {
      const newEdge = { source: sourceNode, target: targetNode };
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    }
  };

  React.useEffect(() => {
    updateGraph();
  }, [nodes, edges]);

  
  return (
    <div>
      <svg ref={svgRef} onClick={handleSvgClick} style={{ background: "#f0f0f0", width: '800px', height: '600px' }}></svg>
      <button onClick={() => {
        if (nodes.length >= 2) {
          addEdge(nodes[0], nodes[1]); // Just an example, add an edge between first two nodes
        }
      }}>
        Add Edge between First Two Nodes
      </button>
    </div>
  );
};


export default GraphSetup;
