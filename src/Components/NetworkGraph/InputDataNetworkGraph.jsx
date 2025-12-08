import React, { useEffect } from 'react';
import * as d3 from 'd3';



const InputDataNetworkGraph = ({ }) => {

  const graphData = {
    nodes: [
      { id: 'A', label: 'Node A', frontendId: 'node_1' },
      { id: 'B', label: 'Node B', frontendId: 'node_2' },
      { id: 'C', label: 'Node C', frontendId: 'node_3' },
      { id: 'D', label: 'Node D', frontendId: 'node_4' },
    ],
    links: [
      { id: '1', sourceNode: 'A', targetNode: 'B', label: 'Link A-B' },
      { id: '2', sourceNode: 'B', targetNode: 'C', label: 'Link B-C' },
      { id: '3', sourceNode: 'C', targetNode: 'D', label: 'Link C-D' },
      { id: '4', sourceNode: 'D', targetNode: 'A', label: 'Link D-A' },
    ]
  };
  useEffect(() => {
    if (graphData) {
      createForceGraph(graphData);
    }
  }, [graphData]);

  const createForceGraph = (graphData) => {
    const width = 928;
    const height = 600;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const { nodes, links } = graphData;

    console.log('Nodes:', nodes);
    console.log('Links:', links);

    const linksWithNodes = links.map(link => ({
      ...link,
      source: nodeMap.get(link.sourceNode),
      target: nodeMap.get(link.targetNode)
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(linksWithNodes)
        .id(d => d.id)
        .links(linksWithNodes)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    const svg = d3.select('#graph-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll()
      .data(linksWithNodes)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    link.append('title')
      .text(d => d.label); // Display link's label

    // Add circles for nodes.
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll()
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', d => color(d.id));

    node.append('title')
      .text(d => `${d.id}: ${d.label}`); // Display node's id and label

    const nodeLabels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', 10)
      .attr('y', 10)
      .attr('font-size', 12)
      .text(d => d.label);

    node.call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));


    function ticked() {

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);


      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);


      nodeLabels
        .attr('x', d => d.x + 10)
        .attr('y', d => d.y);
    }


    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return svg.node();
  };

  return (
    <div id="graph-container" />
  );
};

export default InputDataNetworkGraph;
