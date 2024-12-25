import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const InputDataNetworkGraph = ({ graphData }) => {
  const svgRef = useRef(null); // Reference for the SVG element
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (graphData && graphData.nodes && graphData.links) {
      console.log(graphData);

      // Randomly assign initial positions for nodes, without using x and y
      const nodesWithPosition = graphData.nodes.map(node => ({
        ...node,
        x: Math.random() * 800, // Random x position within the SVG width
        y: Math.random() * 600  // Random y position within the SVG height
      }));

      // Create a mapping for node id -> node object to map links correctly
      const nodeMap = new Map(nodesWithPosition.map(node => [node.id, node]));

      // Transform the links to contain actual node objects as source and target
      const transformedLinks = graphData.links.map(link => ({
        ...link,
        source: nodeMap.get(link.sourceNode), // Map sourceNode to actual node object
        target: nodeMap.get(link.targetNode), // Map targetNode to actual node object
      }));

      setNodes(nodesWithPosition);  // Set nodes with random x/y positions
      setLinks(transformedLinks);   // Set transformed links with actual node objects
    }
  }, [graphData]);

  useEffect(() => {
    if (!nodes || !links || nodes.length === 0 || links.length === 0) return; // Ensure nodes and links exist

    // Set the dimensions of the graph
    const width = 800;
    const height = 600;

    // Create the force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))  // Links force
      .force("charge", d3.forceManyBody().strength(-300))  // Repulsion force
      .force("center", d3.forceCenter(width / 2, height / 2))  // Center force
      .on("tick", ticked);  // Update positions on each tick

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create links (lines between nodes)
    const link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes (circles)
    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", "#1f77b4")
      .call(d3.drag().on("start", dragstart).on("drag", dragged).on("end", dragend));

    // Add labels for nodes
    svg
      .selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => d.x + 15) // Position label next to the node
      .attr("y", d => d.y)
      .text(d => d.label);

    // Function to update positions on each simulation tick
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      svg
        .selectAll(".label")
        .attr("x", d => d.x + 15) // Keep labels next to their nodes
        .attr("y", d => d.y);
    }

    // Drag event handlers
    function dragstart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragend(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function to remove the SVG and reset the simulation
    return () => {
      svg.selectAll("*").remove(); // Remove all elements when the component is unmounted
      simulation.stop(); // Stop the simulation
    };
  }, [nodes, links]);

  return <svg ref={svgRef}></svg>;
};

export default InputDataNetworkGraph;
