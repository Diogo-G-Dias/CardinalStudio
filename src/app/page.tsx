import Image from "next/image";
import Link from "next/link";

const apps = [
  {
    name: "Gameium",
    emoji: "🎮",
    tagline: "Discover & track games",
    href: "https://gameium.cardinalstudio.dev",
  },
  {
    name: "Caloficit",
    emoji: "🔥",
    tagline: "Your slim journey",
    href: "https://caloficit.cardinalstudio.dev",
  },
  {
    name: "Portfolio",
    emoji: "💼",
    tagline: "My work & projects",
    href: "https://portfolio-diogodiascardinal.vercel.app",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <header className="pt-24 pb-16 px-6 text-center">
        <div className="animate-fade-in-up stagger-1 mx-auto w-fit logo-float">
          <Image
            src="/cardinal-logo.png"
            alt="Cardinal Studio"
            width={140}
            height={140}
            className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            priority
          />
        </div>
        <h1 className="animate-fade-in-up stagger-2 mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
          Cardinal Studio
        </h1>
        <p className="animate-fade-in-up stagger-3 mt-3 text-base text-gray-400 max-w-sm mx-auto">
          A small studio building useful things for the web.
        </p>
        <div className="animate-fade-in stagger-4 mt-6 w-12 h-px bg-gray-300 mx-auto" />
      </header>

      {/* App Cards */}
      <main className="flex-1 px-6 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {apps.map((app, i) => (
            <a
              key={app.name}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`card-glow animate-fade-in-up stagger-${i + 3} block rounded-2xl border border-gray-100 p-7 text-center`}
            >
              <span className="inline-block text-4xl">{app.emoji}</span>
              <h2 className="mt-4 text-base font-semibold tracking-tight">
                {app.name}
              </h2>
              <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
                {app.tagline}
              </p>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="animate-fade-in stagger-6 py-12 px-6 text-center">
        <p className="text-xs text-gray-300 tracking-wide">
          Built by Diogo · {new Date().getFullYear()}
        </p>
        <Link
          href="/about"
          className="mt-3 inline-block text-xs text-gray-400 link-underline transition-colors hover:text-gray-600"
        >
          About
        </Link>
      </footer>
    </div>
  );
}
