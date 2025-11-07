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
