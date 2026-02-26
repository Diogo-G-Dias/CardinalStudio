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
];

const links = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:#" },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-16 pb-8 px-6">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            &larr; Home
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">About</h1>
        </div>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full">
        <section>
          <p className="text-gray-600 leading-relaxed">
            Diogo is a solo developer building web apps under the Cardinal
            Studio label. Focused on shipping useful, well-crafted products.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Focus
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Projects
          </h2>
          <div className="mt-3 space-y-4">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {project.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Links
          </h2>
          <div className="mt-3 flex gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 text-center text-xs text-gray-400">
        Made by Diogo &middot; Cardinal Studio &middot; 2025
      </footer>
    </div>
  );
}
