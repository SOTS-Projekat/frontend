import React, { useRef, useState } from 'react';
import * as d3 from 'd3';

const GraphSetup = () => {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null); // Track selected node for linking

  const handleSvgClick = (event) => {
    const coords = d3.pointer(event);
    
    // Check if the click is near an existing node
    const clickedNode = nodes.find(node => {
      const dx = coords[0] - node.x;
      const dy = coords[1] - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 20; // Check if within radius of existing node (20px)
    });

    if (clickedNode) {
      // If a node is clicked, select it for linking
      handleNodeClick(clickedNode);
    } else {
      // If no node is clicked, create a new node
      const label = prompt("Enter a name for this node:");
      if (label) {
        const newNode = { id: `node-${nodes.length}`, x: coords[0], y: coords[1], label };
        setNodes((prevNodes) => [...prevNodes, newNode]);
      }
    }
  };

  const handleNodeClick = (node) => {
    if (selectedNode) {
      // If a node is already selected, create a link between the two nodes
      if (selectedNode !== node) {
        const newLink = { source: selectedNode, target: node };
        setLinks((prevLinks) => [...prevLinks, newLink]);
      }
      setSelectedNode(null); // Reset selected node after link creation
    } else {
      // If no node is selected, set the current node as selected
      setSelectedNode(node);
    }
  };

  const drag = d3.drag()
    .on("start", (event, d) => {
      // Start the drag from the node
      d3.select(event.sourceEvent.target).raise().classed("active", true);
    })
    .on("drag", (event, d) => {
      // Update the dragged node's position during drag
      d.x = event.x;
      d.y = event.y;
      updateGraph();
    })
    .on("end", (event, d) => {
      // On drag end, reset dragging state
      d3.select(event.sourceEvent.target).classed("active", false);
    });

  const updateGraph = () => {
    const svg = d3.select(svgRef.current);

    // Render links
    svg.selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // Render nodes
    const nodeElements = svg.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 15)
      .attr("fill", "#69b3a2")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .on("click", (event, d) => handleNodeClick(d))  // Handle node click
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

    // Render link labels
    svg.selectAll(".link-label")
      .data(links)
      .join("text")
      .attr("class", "link-label")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .text((d) => d.label);
  };

  // Initial render and update when nodes or links change
  React.useEffect(() => {
    updateGraph();
  }, [nodes, links]);

  return (
    <svg ref={svgRef} onClick={handleSvgClick} style={{ background: "#f0f0f0", width: '800px', height: '600px' }}></svg>
  );
};

export default GraphSetup;
