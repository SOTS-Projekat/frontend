import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const GraphSetup = () => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const distanceThreshold = 100; // Max distance (in pixels) to create a link

  // Function to calculate distance between two nodes
  const calculateDistance = (node1, node2) => {
    const dx = node2.x - node1.x;
    const dy = node2.y - node1.y;
    return Math.sqrt(dx * dx + dy * dy); // Euclidean distance
  };

  // Add node when canvas is clicked
  const handleCanvasClick = (e) => {
    const svg = d3.select(svgRef.current);
    const [x, y] = d3.pointer(e);

    // Add a new node at the click position
    const newNode = { id: nodes.length, x, y, name: `Node ${nodes.length + 1}` };
    const newNodes = [...nodes];

    // If there are existing nodes, find the closest one to the new node
    if (nodes.length > 0) {
      let closestNode = null;
      let minDistance = Infinity;

      // Find the closest node to the new node
      nodes.forEach((existingNode) => {
        const distance = calculateDistance(existingNode, newNode);
        if (distance < minDistance) {
          minDistance = distance;
          closestNode = existingNode;
        }
      });

      // If the distance to the closest node is within the threshold, create a link
      if (minDistance <= distanceThreshold && closestNode) {
        const newLink = { source: closestNode, target: newNode };
        setLinks([...links, newLink]);
      }
    }

    newNodes.push(newNode);
    setNodes(newNodes);
  };

  // Handle clicking on a node to change its name (left-click)
  const handleNodeClick = (node, e) => {
    e.stopPropagation(); // Prevent the canvas click from being triggered
    const newName = prompt("Enter new name for the node:", node.name);
    if (newName) {
      node.name = newName;
      setNodes([...nodes]);
    }

    // Log node details to the console
    console.log(`Node ID: ${node.id}, Name: ${node.name}, Position: (${node.x}, ${node.y})`);
  };

  // Remove a node on right-click
  const handleNodeRightClick = (node, e) => {
    e.preventDefault(); // Prevent the default right-click menu
    const newNodes = nodes.filter((n) => n.id !== node.id); // Remove the node
    const newLinks = links.filter((link) => link.source.id !== node.id && link.target.id !== node.id); // Remove links associated with the node
    setNodes(newNodes);
    setLinks(newLinks);
  };

  // Handle creating a link between two nodes
  const handleLinkNodes = (node1, node2) => {
    if (node1 !== node2) {
      const newLink = { source: node1, target: node2 };
      setLinks([...links, newLink]);
    }
  };

  // Setup D3 rendering
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .on('click', handleCanvasClick); // Handle adding nodes on canvas click

    svg.selectAll('*').remove(); // Clear canvas before re-rendering

    // Define arrow marker for the links
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 10) // Position of the arrowhead
      .attr('refY', 5)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
      .attr('fill', 'black'); // Arrow color

    // Draw links with dotted lines and arrows
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5') // Dotted line
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('marker-end', 'url(#arrow)'); // Add arrowhead at the end of the link

    // Draw nodes
    const nodeElements = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .on('click', (e, d) => handleNodeClick(d, e)) // Handle node click to rename
      .on('contextmenu', (e, d) => handleNodeRightClick(d, e)); // Handle right-click to remove node

    // Add node names
    svg.selectAll('.node-label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dy', -30)
      .text(d => d.name);

    // Add drag behavior to nodes
    const drag = d3.drag()
      .on('drag', (e, d) => {
        // Update the node position during drag
        d.x = e.x;
        d.y = e.y;
        d3.select(this)
          .attr('cx', d.x)
          .attr('cy', d.y);

        // Update the links when the node is dragged
        svg.selectAll('.link')
          .filter(link => link.source.id === d.id || link.target.id === d.id)
          .attr('x1', link => link.source.x)
          .attr('y1', link => link.source.y)
          .attr('x2', link => link.target.x)
          .attr('y2', link => link.target.y);
      });

    nodeElements.call(drag);

  }, [nodes, links]); // Re-run when nodes or links change

  return (
    <div style={{ position: 'relative', width: '600px', height: '400px', border: '1px solid black' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphSetup;
