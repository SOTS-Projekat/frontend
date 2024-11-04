import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphSetup = ({ answers }) => {
  const svgRef = useRef();

  useEffect(() => {
    // 1. Kreiramo kumulativne čvorove i veze
    const nodes = [];
    const links = [];
    let sequence = "";

    answers.forEach((answer, index) => {
      sequence += answer;
      nodes.push({ id: sequence });
      if (index > 0) {
        links.push({ source: nodes[index - 1].id, target: sequence });
      }
    });

    // 2. Postavljanje dimenzija SVG-a
    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0");

    // 3. Postavljanje simulacije
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // 4. Crtanje linkova (strelica između čvorova)
    const link = svg.selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    // Dodajemo strelice
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

    // 5. Crtanje čvorova
    const node = svg.selectAll(".node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", 20)
      .attr("fill", "#69b3a2")
      .call(drag(simulation));

    // 6. Dodajemo tekst za svaki čvor
    const labels = svg.selectAll(".label")
      .data(nodes)
      .join("text")
      .attr("class", "label")
      .text(d => d.id)
      .attr("font-size", 12)
      .attr("text-anchor", "middle");

    // 7. Ažuriranje položaja na osnovu simulacije
    simulation.on("tick", () => {
      link
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
    });

    // Funkcija za drag-and-drop podršku
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
