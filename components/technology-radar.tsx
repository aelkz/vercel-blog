"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { RadarConfig, RadarEntry } from "@/lib/radar-data";

interface TechnologyRadarProps {
  config: RadarConfig;
}

interface PinnedTooltip {
  id: string;
  entry: RadarEntry;
  x: number;
  y: number;
}

export function TechnologyRadar({ config }: TechnologyRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pinnedTooltips, setPinnedTooltips] = useState<PinnedTooltip[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  useEffect(() => {
    // Handle responsive sizing
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 800);
      setDimensions({ width, height: width });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2;
    const center = { x: width / 2, y: height / 2 };

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "mx-auto");

    const g = svg.append("g").attr("transform", `translate(${center.x},${center.y})`);

    // Coffee-themed colors for rings (from light to dark)
    const ringColors = [
      "#F5DEB3", // Wheat (Adopt - lightest)
      "#D2B48C", // Tan (Trial)
      "#C19A6B", // Camel (Assess)
      "#8B7355", // Burlywood4 (Hold - darkest)
    ];

    // Draw rings with background colors
    const rings = config.rings;
    const ringWidth = radius / rings.length;

    // Draw all ring backgrounds first (from largest to smallest for proper layering)
    for (let i = rings.length - 1; i >= 0; i--) {
      const ringRadius = (i + 1) * ringWidth;

      g.append("circle").attr("r", ringRadius).attr("fill", ringColors[i]).attr("opacity", 0.15);
    }

    // Draw ring borders and labels
    rings.forEach((ring, i) => {
      const ringRadius = (i + 1) * ringWidth;

      // Ring border
      g.append("circle")
        .attr("r", ringRadius)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1)
        .attr("opacity", 0.3);

      // Ring label (show ALL rings including Hold)
      g.append("text")
        .attr("y", -ringRadius + 20)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm fill-muted-foreground")
        .style("font-weight", "500")
        .text(ring);
    });

    // Draw quadrant lines
    const quadrantAngles = [0, 90, 180, 270];
    quadrantAngles.forEach((angle) => {
      const radian = (angle * Math.PI) / 180;
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", Math.cos(radian) * radius)
        .attr("y2", Math.sin(radian) * radius)
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1)
        .attr("opacity", 0.3);
    });

    // Draw quadrant labels with Quantico font
    config.quadrants.forEach((quadrant, i) => {
      const angle = (i * 90 + 45) * (Math.PI / 180);
      const labelRadius = radius - 40;
      const x = Math.cos(angle) * labelRadius;
      const y = Math.sin(angle) * labelRadius;

      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("class", "text-lg")
        .style("fill", quadrant.color)
        .style("font-weight", "bold")
        .style("font-family", "Quantico, sans-serif")
        .text(quadrant.name);
    });

    // Plot entries
    config.entries.forEach((entry) => {
      // Calculate position
      const quadrantIndex = entry.quadrant;
      const ringIndex = entry.ring;

      // Random position within quadrant and ring
      const baseAngle = quadrantIndex * 90;
      const angleRange = 90;
      const randomAngle = baseAngle + Math.random() * angleRange - angleRange / 2 + 45;
      const radian = (randomAngle * Math.PI) / 180;

      const innerRadius = ringIndex * ringWidth;
      const outerRadius = (ringIndex + 1) * ringWidth;
      const randomRadius = innerRadius + Math.random() * (outerRadius - innerRadius);

      const x = Math.cos(radian) * randomRadius;
      const y = Math.sin(radian) * randomRadius;

      // Determine shape based on 'moved' status
      const shape = entry.moved !== 0 ? "triangle" : "circle";

      if (shape === "circle") {
        const circle = g
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 6)
          .attr("fill", config.quadrants[quadrantIndex].color)
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("class", "cursor-pointer transition-all")
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
          .on("mouseenter", function () {
            d3.select(this).attr("r", 9);
          })
          .on("mouseleave", function () {
            d3.select(this).attr("r", 6);
          })
          .on("click", function (event) {
            const pageX = event.pageX;
            const pageY = event.pageY;
            setPinnedTooltips((prev) => [...prev, { id: `${entry.id}-${Date.now()}`, entry, x: pageX, y: pageY }]);
          });

        // Add title element for native tooltip
        circle.append("title").text(entry.name);

        // Add text label with background
        const labelGroup = g.append("g").attr("class", "icon-label");

        // Background rectangle
        const text = labelGroup
          .append("text")
          .attr("x", x)
          .attr("y", y + 21)
          .attr("text-anchor", "middle")
          .attr("class", "text-xs pointer-events-none")
          .style("fill", "#1a1a1a")
          .style("font-size", "11px")
          .style("font-weight", "500")
          .text(entry.name);

        const bbox = (text.node() as SVGTextElement).getBBox();

        labelGroup
          .insert("rect", "text")
          .attr("x", bbox.x - 3)
          .attr("y", bbox.y - 2)
          .attr("width", bbox.width + 6)
          .attr("height", bbox.height + 4)
          .attr("rx", 3)
          .attr("fill", config.quadrants[quadrantIndex].color)
          .attr("opacity", 0.75)
          .attr("class", "pointer-events-none");
      } else {
        // Triangle (moved item)
        const triangleSize = 8;
        const trianglePath =
          entry.moved === 1
            ? // Upward triangle
              `M ${x},${y - triangleSize} L ${x - triangleSize},${y + triangleSize} L ${x + triangleSize},${y + triangleSize} Z`
            : // Downward triangle
              `M ${x},${y + triangleSize} L ${x - triangleSize},${y - triangleSize} L ${x + triangleSize},${y - triangleSize} Z`;

        const triangleGroup = g
          .append("g")
          .attr("class", "cursor-pointer")
          .on("mouseenter", function () {
            d3.select(this).select("path").attr("transform", "scale(1.3)");
          })
          .on("mouseleave", function () {
            d3.select(this).select("path").attr("transform", "scale(1)");
          })
          .on("click", function (event) {
            const pageX = event.pageX;
            const pageY = event.pageY;
            setPinnedTooltips((prev) => [...prev, { id: `${entry.id}-${Date.now()}`, entry, x: pageX, y: pageY }]);
          });

        triangleGroup
          .append("path")
          .attr("d", trianglePath)
          .attr("fill", config.quadrants[quadrantIndex].color)
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          .attr("transform-origin", `${x}px ${y}px`)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
          .style("transition", "transform 0.2s ease");

        // Add title element for native tooltip
        triangleGroup.append("title").text(entry.name);

        // Add text label with background
        const labelGroup = g.append("g").attr("class", "icon-label");

        // Background rectangle
        const text = labelGroup
          .append("text")
          .attr("x", x)
          .attr("y", y + 23)
          .attr("text-anchor", "middle")
          .attr("class", "text-xs pointer-events-none")
          .style("fill", "#1a1a1a")
          .style("font-size", "11px")
          .style("font-weight", "500")
          .text(entry.name);

        const bbox = (text.node() as SVGTextElement).getBBox();

        labelGroup
          .insert("rect", "text")
          .attr("x", bbox.x - 3)
          .attr("y", bbox.y - 2)
          .attr("width", bbox.width + 6)
          .attr("height", bbox.height + 4)
          .attr("rx", 3)
          .attr("fill", config.quadrants[quadrantIndex].color)
          .attr("opacity", 0.75)
          .attr("class", "pointer-events-none");
      }
    });
  }, [config, dimensions]);

  const handleCloseTooltip = (id: string) => {
    setPinnedTooltips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="mx-auto" />

      {/* Pinned Tooltips */}
      {pinnedTooltips.map((tooltip) => (
        <div
          key={tooltip.id}
          className="fixed z-50 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            maxWidth: tooltip.entry.image ? "400px" : "320px",
          }}
        >
          <div className={`flex gap-3 ${tooltip.entry.image ? "" : "flex-col"}`}>
            {/* Image (if exists) */}
            {tooltip.entry.image && (
              <div className="flex-shrink-0">
                <img src={tooltip.entry.image} alt={tooltip.entry.name} className="h-20 w-20 rounded object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h4 className="font-semibold" style={{ color: config.quadrants[tooltip.entry.quadrant].color }}>
                  {tooltip.entry.name}
                </h4>
                <div className="flex items-center gap-2">
                  {tooltip.entry.moved !== 0 && (
                    <span className="text-xs text-muted-foreground">
                      {tooltip.entry.moved === 1 ? "↑ Moved up" : "↓ Moved down"}
                    </span>
                  )}
                  <button
                    onClick={() => handleCloseTooltip(tooltip.id)}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="mb-2 text-sm text-[#2a2a2a]">{tooltip.entry.description}</p>

              {/* Tags */}
              {tooltip.entry.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {tooltip.entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-xs text-white"
                      style={{
                        backgroundColor: config.quadrants[tooltip.entry.quadrant].color,
                        opacity: 0.9,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {config.quadrants[tooltip.entry.quadrant].name} • {config.rings[tooltip.entry.ring]}
                </span>
                <span>Updated: {tooltip.entry.last_update}</span>
              </div>

              {/* Link */}
              {tooltip.entry.url && (
                <a
                  href={tooltip.entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-primary hover:underline"
                >
                  Learn more →
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#8B7355] opacity-70" />
          <span className="text-foreground/80">No change</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-0 w-0 border-b-[12px] border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent opacity-70"
            style={{ transform: "translateY(-2px)", borderBottomColor: "#8B7355" }}
          />
          <span className="text-foreground/80">Moved up</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent opacity-70"
            style={{ transform: "translateY(2px)", borderTopColor: "#8B7355" }}
          />
          <span className="text-foreground/80">Moved down</span>
        </div>
      </div>
    </div>
  );
}
