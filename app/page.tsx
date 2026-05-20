import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const currentYear = 2026;

  return (
    // 'data-theme' can be forced here, or handled by your theme-provider
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary/20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 opacity-20 [background:radial-gradient(circle_400px_at_50%_300px,theme(colors.primary),transparent)]" />

        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-32">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left content */}
            <div className="flex flex-col items-start space-y-8">
              <div className="badge badge-outline badge-lg gap-2 py-4">
                🚀 AI-Powered Media Platform
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
                Transform your media with{" "}
                <span className="text-primary">MediaMorphAI</span>
              </h1>

              <p className="max-w-xl text-lg opacity-80">
                Upload, optimize, and transform images & videos using
                intelligent AI workflows. Fast, scalable, and built for modern
                developers.
              </p>

              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="btn btn-primary btn-lg rounded-xl shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/sign-in"
                  className="btn btn-outline btn-lg rounded-xl"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right visual: using daisyUI mockup for a cleaner look */}
            <div className="hidden lg:block relative group">
              <div className="absolute -inset-1 rounded-[2rem] bg-primary opacity-20 blur group-hover:opacity-30 transition" />
              <div className="mockup-window border border-base-300 bg-base-200 shadow-2xl">
                <div className="flex justify-center bg-base-100">
                  {/*<Image
                    src="/dashboard-preview.png"
                    alt="MediaMorphAI dashboard preview"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-base-200/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl italic uppercase">
              Engineered for Speed
            </h2>
            <div className="divider divider-primary w-24 mx-auto"></div>
            <p className="mt-4 opacity-70">
              Everything you need to manage assets at scale.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary/50 transition-all hover:-translate-y-2"
              >
                <div className="card-body">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-2xl mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-xl font-bold uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer footer-center p-10 bg-base-100 text-base-content border-t border-base-300">
        <aside>
          <p className="font-bold text-lg">MediaMorphAI</p>
          <p>© {currentYear} - All rights reserved</p>
        </aside>
        <nav className="grid grid-flow-col gap-6">
          <Link href="#" className="link link-hover">
            Privacy
          </Link>
          <Link href="#" className="link link-hover">
            Terms
          </Link>
          <Link href="#" className="link link-hover text-primary font-bold">
            Twitter
          </Link>
        </nav>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "⚡",
    title: "Fast AI Processing",
    description:
      "Optimized pipelines for video & image transformations at scale.",
  },
  {
    icon: "☁️",
    title: "Cloud-Native",
    description: "Built on modern cloud infrastructure with seamless uploads.",
  },
  {
    icon: "🔒",
    title: "Secure by Design",
    description: "Authentication and data safety handled professionally.",
  },
  {
    icon: "🎥",
    title: "Smart Video Handling",
    description: "Upload once, deliver optimized formats dynamically.",
  },
  {
    icon: "📈",
    title: "Developer Friendly",
    description: "Clean APIs, Prisma, Next.js, and scalable architecture.",
  },
  {
    icon: "✨",
    title: "Modern UI",
    description: "Minimal, responsive, and dark-mode ready interface.",
  },
];
