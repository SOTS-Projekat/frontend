import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as d3 from "d3";
import styles from "./NetworkGraph.module.scss";
import { useSession } from "../../hooks/sessionContext";
import { FiSave } from "react-icons/fi";

const WIDTH = 1000;
const HEIGHT = 500;
const NODE_R = 20;

const toId = (v) => {
  if (v == null) return null;
  if (typeof v === "object") return v.id != null ? String(v.id) : null;
  return String(v);
};

export default function NetworkGraph({
  onSaveGraph,
  graphData,
  showSaveButton,
  predictedGraphData,
  readOnly = false,
}) {
  const { user } = useSession();

  const svgRef = useRef(null);

  // D3 instance refs (ne želimo state za ovo)
  const dragSourceRef = useRef(null);
  const simRef = useRef(null);

  const selRef = useRef({
    linkSel: null,
    nodeSel: null,
    nodeLabelSel: null,
    linkLabelSel: null,
  });

  // “latest” refs da tick/handleri ne hvataju stale vrednosti
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const readOnlyRef = useRef(readOnly);

  useEffect(() => {
    readOnlyRef.current = readOnly;
  }, [readOnly]);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  // predicted pairs
  const predictedLinkPairs = useMemo(() => {
    const set = new Set();
    const pls = predictedGraphData?.links ?? [];
    for (const l of pls) {
      const s = toId(l.sourceNodeId ?? l.source?.id ?? l.sourceNode?.id);
      const t = toId(l.targetNodeId ?? l.target?.id ?? l.targetNode?.id);
      if (s && t) set.add(`${s}|${t}`);
    }
    return set;
  }, [predictedGraphData]);

  const isDifferentRef = useRef(() => false);
  useEffect(() => {
    isDifferentRef.current = (link) => {
      if (!predictedGraphData) return false;
      return !predictedLinkPairs.has(`${link.sourceNodeId}|${link.targetNodeId}`);
    };
  }, [predictedGraphData, predictedLinkPairs]);

  // --- Stable handleri (ne zavise od nodes/links da ne rebajnduješ stalno)
  const onLinkClick = useCallback((event, d) => {
    if (readOnlyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const newLabel = prompt("Rename the link:", d.label);
    if (newLabel) {
      setLinks((prev) => prev.map((l) => (l.id === d.id ? { ...l, label: newLabel } : l)));
    }
  }, []);

  const onLinkContext = useCallback((event, d) => {
    if (readOnlyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const ok = window.confirm(`Are you sure you want to delete link: ${d.label}?`);
    if (ok) setLinks((prev) => prev.filter((l) => l.id !== d.id));
  }, []);

  const onNodeClick = useCallback((event, d) => {
    if (readOnlyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const newName = prompt("Rename the node:", d.label);
    if (newName) {
      setNodes((prev) => prev.map((n) => (n.id === d.id ? { ...n, label: newName } : n)));
    }
  }, []);

  const onNodeContext = useCallback((event, d) => {
    if (readOnlyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const ok = window.confirm(`Are you sure you want to delete node: ${d.label}?`);
    if (!ok) return;

    setNodes((prev) => prev.filter((n) => n.id !== d.id));
    setLinks((prev) => prev.filter((l) => l.sourceNodeId !== d.id && l.targetNodeId !== d.id));
  }, []);

  const onNodeMouseDown = useCallback((event, d) => {
    if (readOnlyRef.current) return;
    if (event.button !== 1) return; // middle click
    event.preventDefault();
    event.stopPropagation();

    const svgEl = svgRef.current;
    if (!svgEl) return;

    dragSourceRef.current = d;

    const svg = d3.select(svgEl);

    const tempLine = svg
      .append("line")
      .attr("class", "temp-link")
      .attr("stroke", "gray")
      .attr("stroke-width", 2);

    const onMove = (ev) => {
      const [x, y] = d3.pointer(ev, svgEl);
      tempLine
        .attr("x1", d.x)
        .attr("y1", d.y)
        .attr("x2", x)
        .attr("y2", y);
    };

    const onUp = (ev) => {
      const [x, y] = d3.pointer(ev, svgEl);

      // koristi latest nodes iz ref-a (da ne bude stale)
      const allNodes = nodesRef.current ?? [];
      const target = allNodes.find(
        (n) => Math.hypot((n.x ?? 0) - x, (n.y ?? 0) - y) < NODE_R
      );

      if (target && target.id !== d.id) {
        const label = prompt("Enter link label:");
        if (label) {
          setLinks((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              label,
              sourceNodeId: d.id,
              targetNodeId: target.id,
            },
          ]);
        }
      }

      tempLine.remove();
      svg.on("mousemove.temp", null).on("mouseup.temp", null);
      dragSourceRef.current = null;
    };

    // namespaced eventovi da ih lako skineš
    svg.on("mousemove.temp", onMove).on("mouseup.temp", onUp);
  }, []);


  // --- INIT (jednom)
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    // defs (arrowhead) — napravi jednom
    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "black")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    // groups — napravi jednom
    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "link-labels");
    svg.append("g").attr("class", "nodes");
    svg.append("g").attr("class", "node-labels");

    // simulation — jednom
    const sim = d3
      .forceSimulation()
      .force("link", d3.forceLink().id((d) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2));

    simRef.current = sim;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    // tick koristi ref-ove (uvek latest)
    sim.on("tick", () => {
      const { linkSel, nodeSel, nodeLabelSel, linkLabelSel } = selRef.current;
      if (!linkSel || !nodeSel || !nodeLabelSel || !linkLabelSel) return;

      const nn = nodesRef.current;
      for (const n of nn) {
        n.x = clamp(n.x ?? WIDTH / 2, NODE_R, WIDTH - NODE_R);
        n.y = clamp(n.y ?? HEIGHT / 2, NODE_R, HEIGHT - NODE_R);
      }

      linkSel
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeSel.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      nodeLabelSel.attr("x", (d) => d.x).attr("y", (d) => d.y + 35);

      linkLabelSel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2 - 10);
    });

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, []);

  // --- Mapiraj incoming graphData -> nodes/links state
  useEffect(() => {
    if (!graphData) return;

    const incomingNodes = (graphData.nodes ?? []).map((n) => ({
      ...n,
      id: toId(n.id ?? n.frontendId ?? crypto.randomUUID()),
      label: n.label ?? n.name ?? "",
    }));

    const incomingLinks = (graphData.links ?? [])
      .map((l) => {
        const s = toId(l.sourceNodeId ?? l.source?.id ?? l.sourceNode?.id);
        const t = toId(l.targetNodeId ?? l.target?.id ?? l.targetNode?.id);
        if (!s || !t) return null;
        return {
          ...l,
          id: toId(l.id ?? crypto.randomUUID()),
          label: l.label ?? l.name ?? "",
          sourceNodeId: s,
          targetNodeId: t,
        };
      })
      .filter(Boolean);

    // sačuvaj pozicije ako postoje
    setNodes((prev) => {
      const prevById = new Map(prev.map((p) => [String(p.id), p]));
      return incomingNodes.map((n) => {
        const p = prevById.get(String(n.id));
        return p
          ? { ...n, x: p.x, y: p.y, vx: p.vx, vy: p.vy }
          : { ...n, x: Math.random() * WIDTH, y: Math.random() * HEIGHT };
      });
    });

    setLinks(incomingLinks);
  }, [graphData]);

  // --- UPDATE: data join (kad se nodes/links promene)
  useEffect(() => {
    const svgEl = svgRef.current;
    const sim = simRef.current;
    if (!svgEl || !sim) return;

    // update “latest” refs za tick
    nodesRef.current = nodes;
    linksRef.current = links;

    const svg = d3.select(svgEl);

    const nodeById = new Map(nodes.map((n) => [String(n.id), n]));

    // simLinks: source/target su objekti, ne id string
    const simLinks = links
      .map((l) => ({
        ...l,
        source: nodeById.get(String(l.sourceNodeId)),
        target: nodeById.get(String(l.targetNodeId)),
      }))
      .filter((l) => l.source && l.target);

    // LINKS join
    const linkSel = svg
      .select("g.links")
      .selectAll("line.link")
      .data(simLinks, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "link")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)")
            .style("cursor", "pointer")
            .on("click", onLinkClick)
            .on("contextmenu", onLinkContext),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("stroke", (d) => (isDifferentRef.current(d) ? "blue" : "black"));

    // NODES join
    const nodeSel = svg
      .select("g.nodes")
      .selectAll("circle.node")
      .data(nodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "node")
            .attr("r", NODE_R)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", onNodeClick)
            .on("contextmenu", onNodeContext)
            .on("mousedown", onNodeMouseDown)
            .call(
              d3
                .drag()
                .on("start", (event, d) => {
                  if (!event.active) sim.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                })
                .on("drag", (event, d) => {
                  d.fx = event.x;
                  d.fy = event.y;
                })
                .on("end", (event, d) => {
                  if (!event.active) sim.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                })
            ),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("fill", (d) => {
        if (d.correct === true) return "green";
        if (d.correct === false) return "red";
        return "#ddd";
      });

    // Node labels join
    const nodeLabelSel = svg
      .select("g.node-labels")
      .selectAll("text.node-label")
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
      .text((d) => d.label);

    // Link labels join
    const linkLabelSel = svg
      .select("g.link-labels")
      .selectAll("text.link-label")
      .data(simLinks, (d) => d.id)
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
      .text((d) => d.label);

    // sačuvaj selekcije za tick
    selRef.current = { linkSel, nodeSel, nodeLabelSel, linkLabelSel };

    // update sim data + restart
    sim.nodes(nodes);
    sim.force("link").links(simLinks);
    sim.alpha(1).restart();
  }, [nodes, links, onLinkClick, onLinkContext, onNodeClick, onNodeContext, onNodeMouseDown]);

  // click na pozadinu SVG-a (dodavanje noda)
  const handleSvgClick = (e) => {
    if (readOnly) return;
    if (e.button !== 0) return;

    const t = e.target;
    if (
      t?.closest?.(".node") ||
      t?.closest?.(".link") ||
      t?.closest?.(".link-label") ||
      t?.closest?.(".node-label")
    ) {
      return;
    }

    const [x, y] = d3.pointer(e.nativeEvent, svgRef.current);
    const name = prompt("Name a new node:");
    if (!name) return;

    setNodes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: name, x, y },
    ]);
  };

  const handleSaveGraph = () => {
    const transformedLinks = (links ?? []).map((l) => ({
      name: l.label,
      source: { id: l.sourceNodeId },
      target: { id: l.targetNodeId },
    }));

    const transformedNodes = (nodes ?? []).map((n) => ({
      ...n,
      name: n.label,
    }));

    onSaveGraph?.({ nodes: transformedNodes, links: transformedLinks });
  };

  return (
    <div className={styles.wrapper}>
      <svg ref={svgRef} className={styles.svg} onClick={handleSvgClick} />

      {user?.role === "PROFESSOR" && showSaveButton && (
        <div className={styles["inner-container"]}>
          <button
            type="button"
            onClick={handleSaveGraph}
            className={styles.iconButton}
            title="Save graph"
          >
            <FiSave size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
