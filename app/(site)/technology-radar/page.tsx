import { Metadata } from "next";

import { defaultAuthor } from "@/lib/metadata";
import { technologyRadar } from "@/lib/technology-radar-data";
import { TechnologyRadar } from "@/components/technology-radar";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Technology Radar",
    description: `${defaultAuthor.name}'s personal Technology Radar - tracking technologies, tools, and techniques`,
  };
}

export default function TechnologyRadarPage() {
  return (
    <div className="container mb-4">
      <div className="prose mx-auto max-w-5xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:leading-tight hover:prose-a:text-accent-foreground prose-a:prose-headings:no-underline">
        <h1 className="mt-0">Technology Radar</h1>
        <p className="text-muted-foreground">
          My personal Technology Radar, inspired by{" "}
          <a
            href="https://nealford.com/memeagora/2013/05/28/build_your_own_technology_radar.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Neal Ford's approach
          </a>
          . This is a living document to assess risks and rewards of technologies I'm exploring or using.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <hr className="my-4" />

        <div className="not-prose">
          <TechnologyRadar config={technologyRadar} />
        </div>

        {/* Quadrant descriptions */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {technologyRadar.quadrants.map((quadrant, i) => (
            <div key={i} className="rounded-lg border p-4">
              <h3 className="mb-2 mt-0 text-sm font-semibold" style={{ color: quadrant.color }}>
                {quadrant.name}
              </h3>
              <p className="m-0 text-xs text-muted-foreground">
                {i === 0 && "Methods, practices, and approaches for building software"}
                {i === 1 && "Software tools, utilities, and applications"}
                {i === 2 && "Infrastructure, platforms, and deployment targets"}
                {i === 3 && "Programming languages, frameworks, and libraries"}
              </p>
            </div>
          ))}
        </div>

        {/* Ring descriptions */}
        <div className="not-prose mt-6">
          <h2 className="mb-4 text-2xl font-bold">Understanding the Rings</h2>
          <div className="space-y-3">
            {technologyRadar.rings.map((ring, i) => (
              <div key={i} className="rounded-lg border border-[#6B5D4F] bg-[#5a5a5a] p-3">
                <h4 className="mb-1 mt-0 text-sm font-semibold text-[#F5DEB3]">{ring}</h4>
                <p className="m-0 text-xs text-[#e8e8e8]">
                  {i === 0 && "Technologies I actively use and recommend. Proven and reliable."}
                  {i === 1 && "Worth pursuing through pilot projects and experiments. Ready to use with some risk."}
                  {i === 2 && "Worth exploring to understand potential impact. Not ready for production use yet."}
                  {i === 3 &&
                    "Proceed with caution. May be outdated, problematic, or not recommended for new projects."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
