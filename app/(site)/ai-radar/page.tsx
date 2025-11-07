import { Metadata } from "next";

import { aiRadar } from "@/lib/ai-radar-data";
import { defaultAuthor } from "@/lib/metadata";
import { TechnologyRadar } from "@/components/technology-radar";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "AI Radar",
    description: `${defaultAuthor.name}'s personal AI Radar - tracking AI tools, techniques, and developments`,
  };
}

export default function AIRadarPage() {
  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">AI Radar</h1>
        <p className="text-muted-foreground">
          My personal AI Radar, tracking artificial intelligence tools, techniques, and platforms I'm exploring or
          using. Focused on practical applications and emerging technologies in the AI space.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <hr className="my-4" />

        <div className="not-prose">
          <TechnologyRadar config={aiRadar} />
        </div>

        {/* Quadrant descriptions */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {aiRadar.quadrants.map((quadrant, i) => (
            <div key={i} className="rounded-lg border p-4">
              <h3 className="mb-2 mt-0 text-sm font-semibold" style={{ color: quadrant.color }}>
                {quadrant.name}
              </h3>
              <p className="m-0 text-xs text-muted-foreground">
                {i === 0 && "Large Language Models and AI-powered tools for development and productivity"}
                {i === 1 && "Cloud platforms, APIs, and services for AI/ML workloads"}
                {i === 2 && "Libraries, SDKs, and frameworks for building AI applications"}
                {i === 3 && "Methods, patterns, and best practices for working with AI"}
              </p>
            </div>
          ))}
        </div>

        {/* Ring descriptions */}
        <div className="not-prose mt-6">
          <h2 className="mb-4 text-2xl font-bold">Understanding the Rings</h2>
          <div className="space-y-3">
            {aiRadar.rings.map((ring, i) => (
              <div key={i} className="rounded-lg border border-[#6B5D4F] bg-[#5a5a5a] p-3">
                <h4 className="mb-1 mt-0 text-sm font-semibold text-[#F5DEB3]">{ring}</h4>
                <p className="m-0 text-xs text-[#e8e8e8]">
                  {i === 0 && "AI technologies I actively use and recommend. Proven and reliable."}
                  {i === 1 && "Worth pursuing through experiments and pilot projects. Ready to use with some risk."}
                  {i === 2 && "Worth exploring to understand potential impact. Not ready for production use yet."}
                  {i === 3 && "Proceed with caution. May be overhyped, problematic, or not suitable for my use cases."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
