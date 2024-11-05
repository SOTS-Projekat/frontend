import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphSetup = ({ answers }) => {
  const svgRef = useRef();

  useEffect(() => {
    const nodes = [];
    const links = [];
    let sequence = "";

    answers.forEach((answer, index) => {
      sequence += answer;
      nodes.push({ id: sequence });
      if (index > 0) {
        links.push({ source: nodes[index - 1].id, target: sequence, label: answer });
      }
    });

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");  

    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)  
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    const node = svg.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("fill", "#69b3a2")
      .call(drag(simulation));

    const labels = svg.selectAll(".label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .text(d => d.id)
      .attr("font-size", 12)
      .attr("text-anchor", "middle");

    const linkLabels = svg.selectAll(".link-label")
      .data(links)
      .join("text")
      .attr("class", "link-label")
      .text(d => `${d.label}`)
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("dy", -5);

  
    const pointer = svg.selectAll(".pointer")
      .data(links)
      .join("line")
      .attr("class", "pointer")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black")  
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrow)");  

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      pointer
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y - 25);

      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
    });

    function drag(simulation) {
      function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
    }

  }, [answers]);

  return <svg ref={svgRef}></svg>;
};

export default GraphSetup;
