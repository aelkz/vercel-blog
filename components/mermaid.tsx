"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
}

let mermaidInitialized = false;

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Generate a unique key for this diagram based on chart content
  const diagramKey = useRef<string | null>(null);

  if (!diagramKey.current) {
    // Create a simple hash from the chart content for a stable key
    let hash = 0;
    for (let i = 0; i < chart.length; i++) {
      const char = chart.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    diagramKey.current = `mermaid-diagram-${hash}`;
  }

  // Wait for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check localStorage after component mounts on client
  useEffect(() => {
    if (!isMounted) return;

    try {
      const wasLoaded = localStorage.getItem(diagramKey.current!);
      if (wasLoaded === "true") {
        setShouldRender(true);
      }
    } catch (e) {
      // localStorage not available, silently continue
    }
  }, [isMounted]);

  const handleLoadDiagram = () => {
    setShouldRender(true);
    try {
      localStorage.setItem(diagramKey.current!, "true");
    } catch (e) {
      // localStorage not available, silently continue
    }
  };

  useEffect(() => {
    if (!shouldRender) return;

    const renderDiagram = async () => {
      try {
        setIsLoading(true);

        // Initialize only once
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              primaryColor: "#D2C0AA",
              primaryTextColor: "#2C1810",
              primaryBorderColor: "#A97125",
              lineColor: "#A97125",
              secondaryColor: "#E6E5DF",
              tertiaryColor: "#CA9F55",
              background: "#F5F5F0",
              mainBkg: "#E6E5DF",
              secondBkg: "#D2C0AA",
              tertiaryBkg: "#CA9F55",
              nodeBorder: "#A97125",
              clusterBkg: "#E6E5DF",
              clusterBorder: "#A97125",
              defaultLinkColor: "#A97125",
              titleColor: "#2C1810",
              edgeLabelBackground: "#F5F5F0",
              nodeTextColor: "#2C1810",
            },
            flowchart: {
              htmlLabels: true,
              curve: "basis",
            },
            sequence: {
              actorMargin: 50,
              width: 150,
              height: 65,
              boxMargin: 10,
            },
          });
          mermaidInitialized = true;
        }

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError("");
      } catch (err: any) {
        console.error("Mermaid rendering error:", err);
        setError(`Failed to render diagram: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart, shouldRender]);

  // Reset zoom and position when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (error) {
    return (
      <div className="my-4 rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
        <pre className="mt-2 overflow-x-auto text-xs">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  // Show load button if not yet rendered
  if (!shouldRender) {
    return (
      <div className="my-6 flex min-h-[200px] items-center justify-center rounded-lg bg-[#F5F5F0] p-8">
        <button
          onClick={handleLoadDiagram}
          className="flex items-center gap-2 rounded-md bg-[#A97125] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#8B5E1F] hover:shadow-xl"
        >
          <Maximize2 size={20} />
          Load Diagram
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-6 flex min-h-[200px] items-center justify-center rounded-lg bg-[#F5F5F0] p-8">
        <div className="text-center">
          <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#CA9F55] border-t-[#A97125]"></div>
          <p className="text-sm text-[#A97125]">Loading diagram...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative my-6 overflow-hidden rounded-lg bg-[#F5F5F0] p-4">
        <div
          ref={ref}
          className="mermaid-diagram group relative flex cursor-pointer justify-center overflow-x-auto transition-all hover:shadow-lg"
          onClick={() => setIsModalOpen(true)}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {/* Expand icon hint */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute right-2 top-2 rounded-md bg-[#A97125] p-2 text-white opacity-0 transition-opacity hover:bg-[#8B5E1F] group-hover:opacity-100"
          aria-label="Open diagram in full screen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Full-screen Modal with Zoom Controls */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Control Panel */}
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleZoomIn}
              className="rounded-md bg-[#A97125] p-3 text-white shadow-lg transition-colors hover:bg-[#8B5E1F]"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={handleZoomOut}
              className="rounded-md bg-[#A97125] p-3 text-white shadow-lg transition-colors hover:bg-[#8B5E1F]"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleReset}
              className="rounded-md bg-[#A97125] p-3 text-white shadow-lg transition-colors hover:bg-[#8B5E1F]"
              aria-label="Reset zoom"
              title="Reset zoom"
            >
              <RotateCcw size={20} />
            </button>
            <div className="rounded-md bg-[#A97125] px-3 py-2 text-center text-sm font-semibold text-white shadow-lg">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-[#A97125] p-3 text-white shadow-lg transition-colors hover:bg-[#8B5E1F]"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Diagram Container with white background */}
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
          >
            <div
              ref={diagramRef}
              className="mermaid-diagram-fullscreen absolute inset-0 flex items-center justify-center transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-[#A97125] px-4 py-2 text-sm text-white shadow-lg">
            Click and drag to pan • ESC to close
          </div>
        </div>
      )}
    </>
  );
}
