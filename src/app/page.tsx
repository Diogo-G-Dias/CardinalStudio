import Link from "next/link";

const apps = [
  {
    name: "Gameium",
    emoji: "\uD83C\uDFAE",
    tagline: "Discover & track games",
    href: "https://gameium.cardinalstudio.dev",
  },
  {
    name: "Caloficit",
    emoji: "\uD83D\uDD25",
    tagline: "Your slim journey",
    href: "https://caloficit.cardinalstudio.dev",
  },
  {
    name: "Portfolio",
    emoji: "\uD83D\uDCBC",
    tagline: "My work & projects",
    href: "https://portfolio-diogodiascardinal.vercel.app",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-16 pb-12 px-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Cardinal Studio</h1>
        <p className="mt-2 text-sm text-gray-500">Built by Diogo</p>
      </header>

      <main className="flex-1 px-6 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-3xl">{app.emoji}</span>
              <h2 className="mt-3 text-lg font-semibold">{app.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{app.tagline}</p>
            </a>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-400">
          A small studio building useful things for the web.
        </p>
      </main>

      <footer className="py-8 px-6 text-center text-xs text-gray-400">
        <p>
          Made by Diogo &middot; Cardinal Studio &middot; 2025
        </p>
        <Link
          href="/about"
          className="mt-2 inline-block text-gray-400 hover:text-gray-600 transition-colors"
        >
          About
        </Link>
      </footer>
    </div>
  );
}
