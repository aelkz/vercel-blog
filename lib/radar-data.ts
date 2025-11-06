export interface RadarQuadrant {
  name: string;
  color: string;
}

export interface RadarEntry {
  id: string;
  name: string;
  quadrant: number; // 0-3 (index into quadrants array)
  ring: number; // 0-3 (0=Adopt, 1=Trial, 2=Assess, 3=Hold)
  description: string;
  tags: string[];
  url?: string; // Optional link for more info
  image?: string; // Optional image path (e.g., "/radar/docker-logo.png")
  moved?: number; // -1=down, 0=no change, 1=up (since last update)
  last_update: string; // ISO date string (e.g., "2025-01-15")
}

export interface RadarConfig {
  id: string; // "technology" or "ai"
  title: string;
  quadrants: RadarQuadrant[];
  rings: string[]; // ["Adopt", "Trial", "Assess", "Hold"]
  entries: RadarEntry[];
}

// Technology Radar
export const technologyRadar: RadarConfig = {
  id: "technology",
  title: "Technology Radar",
  quadrants: [
    { name: "Techniques", color: "#8FA1B3" },
    { name: "Tools", color: "#B48EAD" },
    { name: "Platforms", color: "#A3BE8C" },
    { name: "Languages & Frameworks", color: "#CD853F" }, // Peru (coffee-themed orange-brown)
  ],
  rings: ["Adopt", "Trial", "Assess", "Hold"],
  entries: [
    {
      id: "docker",
      name: "Docker",
      quadrant: 2, // Platforms
      ring: 0, // Adopt
      description:
        "Industry-standard containerization platform. Essential for modern development and deployment workflows. Provides consistency across environments and simplifies dependency management.",
      tags: ["containers", "devops", "infrastructure"],
      url: "https://www.docker.com/",
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "typescript",
      name: "TypeScript",
      quadrant: 3, // Languages & Frameworks
      ring: 0, // Adopt
      description:
        "Typed superset of JavaScript that compiles to plain JavaScript. Dramatically improves code quality, maintainability, and developer experience. De facto standard for modern JavaScript development.",
      tags: ["javascript", "type-safety", "frontend", "backend"],
      url: "https://www.typescriptlang.org/",
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "kubernetes",
      name: "Kubernetes",
      quadrant: 2, // Platforms
      ring: 1, // Trial
      description:
        "Production-grade container orchestration platform. Powerful but complex. Consider for large-scale deployments with multiple services.",
      tags: ["containers", "orchestration", "cloud-native"],
      url: "https://kubernetes.io/",
      moved: 1,
      last_update: "2025-01-15",
    },
    {
      id: "ci-cd-automation",
      name: "CI/CD Automation",
      quadrant: 0, // Techniques
      ring: 0, // Adopt
      description:
        "Automated testing, building, and deployment pipelines. Critical for modern software development. Reduces human error and accelerates delivery.",
      tags: ["automation", "devops", "testing"],
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "micro-frontends",
      name: "Micro Frontends",
      quadrant: 0, // Techniques
      ring: 2, // Assess
      description:
        "Architectural approach to split frontend monoliths into smaller, more manageable pieces. Promising but adds complexity. Assess carefully before adopting.",
      tags: ["architecture", "frontend", "modularity"],
      moved: 0,
      last_update: "2025-01-15",
    },
  ],
};

// AI Radar
export const aiRadar: RadarConfig = {
  id: "ai",
  title: "AI Radar",
  quadrants: [
    { name: "LLM Tools", color: "#8FA1B3" },
    { name: "AI Platforms", color: "#B48EAD" },
    { name: "ML Frameworks", color: "#A3BE8C" },
    { name: "AI Techniques", color: "#CD853F" }, // Peru (coffee-themed orange-brown)
  ],
  rings: ["Adopt", "Trial", "Assess", "Hold"],
  entries: [
    {
      id: "claude",
      name: "Claude",
      quadrant: 0, // LLM Tools
      ring: 0, // Adopt
      description:
        "Anthropic's AI assistant with strong reasoning capabilities. Excellent for complex tasks, coding assistance, and long-context analysis. Currently using for development workflows.",
      tags: ["llm", "ai-assistant", "coding", "anthropic"],
      url: "https://www.anthropic.com/claude",
      moved: 1,
      last_update: "2025-01-15",
    },
    {
      id: "langchain",
      name: "LangChain",
      quadrant: 2, // ML Frameworks
      ring: 1, // Trial
      description:
        "Framework for developing applications powered by language models. Useful for building LLM-powered apps with context management and tool integration.",
      tags: ["framework", "llm", "python", "typescript"],
      url: "https://www.langchain.com/",
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "prompt-engineering",
      name: "Prompt Engineering",
      quadrant: 3, // AI Techniques
      ring: 0, // Adopt
      description:
        "The practice of crafting effective prompts to get better results from LLMs. Essential skill for working with modern AI tools. Significantly impacts output quality.",
      tags: ["technique", "llm", "optimization"],
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "vector-databases",
      name: "Vector Databases",
      quadrant: 1, // AI Platforms
      ring: 2, // Assess
      description:
        "Databases optimized for storing and querying vector embeddings. Key for semantic search and RAG applications. Several options emerging (Pinecone, Weaviate, pgvector).",
      tags: ["database", "embeddings", "search"],
      moved: 0,
      last_update: "2025-01-15",
    },
  ],
};
