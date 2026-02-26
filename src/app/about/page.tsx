import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Cardinal Studio",
};

const skills = ["Full-stack", "React", "Product thinking", "Indie apps"];

const projects = [
  {
    name: "Gameium",
    description:
      "A game discovery and release calendar platform. Search across platforms, track upcoming releases, and explore ratings.",
    href: "https://gameium.cardinalstudio.dev",
  },
  {
    name: "Caloficit",
    description:
      "A fitness and calorie tracking app with meal planning, workouts, and progress tracking.",
    href: "https://caloficit.cardinalstudio.dev",
  },
  {
    name: "Portfolio",
    description:
      "A showcase of my work, projects, and skills.",
    href: "https://portfolio.cardinalstudio.dev",
  },
  {
    name: "ApplyHelp",
    description:
      "A Chrome extension that auto-fills job application forms with your profile data.",
    href: "https://applyhelp.cardinalstudio.dev",
  },
];

const links = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:#" },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-20 pb-10 px-6">
        <div className="max-w-xl mx-auto">
          <Link
            href="/"
            className="animate-fade-in-up stagger-1 inline-flex items-center gap-1.5 text-sm text-gray-400 link-underline transition-colors hover:text-gray-600"
          >
            ← Home
          </Link>
          <h1 className="animate-fade-in-up stagger-2 mt-6 text-3xl font-bold tracking-tight">
            About
          </h1>
          <div className="animate-fade-in stagger-3 mt-4 w-12 h-px bg-gray-300" />
        </div>
      </header>

      <main className="flex-1 px-6 max-w-xl mx-auto w-full">
        <section className="animate-fade-in-up stagger-3">
          <p className="text-gray-500 leading-relaxed text-base">
            Diogo is a solo developer building web apps under the Cardinal
            Studio label. Focused on shipping useful, well-crafted products.
          </p>
        </section>

        <section className="animate-fade-in-up stagger-4 mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Focus
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="pill-tag rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up stagger-5 mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Projects
          </h2>
          <div className="mt-4 space-y-4">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glow block rounded-2xl border border-gray-100 p-5"
              >
                <h3 className="font-semibold tracking-tight line-accent">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {project.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up stagger-6 mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            Links
          </h2>
          <div className="mt-4 flex gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 link-underline transition-colors hover:text-gray-800"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="animate-fade-in stagger-6 py-12 px-6 text-center text-xs text-gray-300 tracking-wide">
        Built by Diogo · Cardinal Studio · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
