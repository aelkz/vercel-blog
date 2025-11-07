import { RadarConfig } from "./radar-types";

// AI Radar
// Auto-generated radar data for ai radar
export const aiRadar: RadarConfig = {
  id: "ai",
  title: "AI Radar",
  quadrants: [
    {
      name: "LLM Tools",
      color: "#8FA1B3",
    },
    {
      name: "AI Platforms",
      color: "#B48EAD",
    },
    {
      name: "ML Frameworks",
      color: "#A3BE8C",
    },
    {
      name: "AI Techniques",
      color: "#CD853F",
    },
  ],
  rings: ["Adopt", "Trial", "Assess", "Hold"],
  entries: [
    {
      id: "claude",
      name: "Claude",
      quadrant: 0,
      ring: 0,
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
      quadrant: 2,
      ring: 1,
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
      quadrant: 3,
      ring: 0,
      description:
        "The practice of crafting effective prompts to get better results from LLMs. Essential skill for working with modern AI tools. Significantly impacts output quality.",
      tags: ["technique", "llm", "optimization"],
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "vector-databases",
      name: "Vector Databases",
      quadrant: 1,
      ring: 2,
      description:
        "Databases optimized for storing and querying vector embeddings. Key for semantic search and RAG applications. Several options emerging (Pinecone, Weaviate, pgvector).",
      tags: ["database", "embeddings", "search"],
      moved: 0,
      last_update: "2025-01-15",
    },
    {
      id: "cursor",
      name: "Cursor IDE",
      quadrant: 0,
      ring: 0,
      description:
        "Cursor IDE is an AI-powered code editor that is a fork of Visual Studio Code, designed to help developers code faster by integrating large language models (LLMs) directly into the workflow. It understands your project's codebase to assist with writing, editing, and debugging code through natural language prompts, acting like a pair programming partner. Key features include AI-powered chat, code generation, and assistance with refactoring, all while maintaining compatibility with the VS Code ecosystem.",
      tags: ["llm", "ai-assistant", "coding", "ide"],
      url: "https://cursor.com/",
      image: "",
      moved: 1,
      last_update: "2025-07-11",
    },
  ],
};
