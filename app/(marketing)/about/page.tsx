import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      <div className="flex min-h-[calc(100vh-81px)]">
        <section className="grid grid-cols-1 w-full ml-40 mt-10 mb-10 mr-10 items">
          <Card className="pl-10 pb-10 pr-10 pt-10 border bg-white dark:bg-zinc-900/50">
            <p className="text-zinc-400 dark:text-amber-600 text-[16px] tracking-[0.2em] font-semibold">
              How It Started
            </p>
            <h1 className="font-bold text-6xl pt-5 tracking-tighter text-zinc-900 dark:text-zinc-200">
              Our Mission is Technical Interview Mastery
            </h1>
            <p className="mt-auto text-[15px] text-zinc-500 dark:text-zinc-400 leading-loose">
              AI-Trainer was founded by Shreyash Mishra, a developer who
              realized that the gap between a great engineer and a great job is
              often just a 45-minute conversation. Driven by a mission to
              democratize elite coaching, Shreyash built this platform to ensure
              that every candidate—regardless of their background—has access to
              high-fidelity, real-world simulation. We combine advanced AI with
              deep industry insights so you can walk into your next interview
              with total confidence and zero anxiety.
            </p>
          </Card>
        </section>
        <section className="grid grid-cols-1 w-full mb-10 mr-40 mt-10 space-y-6">
          <Card className="relative overflow-hidden border border-zinc-200/50 aspect-video">
            <Image src="/ai-interview.webp" alt="ai-interview" fill />
          </Card>
          <Card className="p-10 border shadow-sm bg-zinc-200/50 dark:bg-zinc-900 min-h-[250px]">
            <div className="grid grid-cols-2 gap-8">
              <Card className="p-6 border-none bg-white dark:bg-zinc-900 flex flex-col items-center text-center gap-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  500+
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  Scenarios
                </p>
              </Card>

              <Card className="p-6 border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center gap-1">
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  24/7
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  AI Support
                </p>
              </Card>

              <Card className="p-6 border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center gap-1">
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  0%
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  Judgment
                </p>
              </Card>

              <Card className="p-6 border-none bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center gap-1">
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  100%
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  Privacy
                </p>
              </Card>
            </div>
          </Card>
        </section>
      </div>
      <section className="w-full px-10 lg:px-40 py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
        <div className="flex flex-col gap-10 max-w-2xl">
          <h4
            className="animate-reveal tracking-[0.3em] text-sm font-semibold text-zinc-500 uppercase"
            style={{ animationDelay: "0.1s" }}
          >
            Founder's Note
          </h4>

          <h2
            className="animate-reveal text-5xl font-bold text-zinc-900 dark:text-zinc-50 leading-[1.1] tracking-tight"
            style={{ animationDelay: "0.3s" }}
          >
            The gap between a great engineer and a great job is often just a
            45-minute conversation.
          </h2>

          <div className="flex flex-col gap-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 text-left">
            <p className="animate-reveal" style={{ animationDelay: "0.5s" }}>
              I spent years mastering the syntax, only to realize that the
              industry doesn't just hire code—it hires people.
            </p>

            <div className="relative pl-8 italic">
              <div
                className="animate-line absolute left-0 top-0 w-[2px] bg-zinc-300 dark:bg-zinc-700"
                style={{ animationDelay: "1.2s" }}
              />
              <p className="animate-reveal" style={{ animationDelay: "0.7s" }}>
                I built AI-Trainer because elite interview coaching shouldn't be
                a luxury reserved for the few. Whether you're a student or a
                senior lead, your story deserves to be heard with clarity and
                confidence.
              </p>
            </div>

            <p className="animate-reveal" style={{ animationDelay: "0.9s" }}>
              This platform is the mentor I wish I had when I was starting
              out—relentless, objective, and always available.
            </p>
          </div>

          <div
            className="animate-reveal mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-8"
            style={{ animationDelay: "1.1s" }}
          >
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Shreyash Mishra
            </p>
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-medium">
              Founder & Lead Architect
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/Admin.jpeg"
            alt="Shreyash Mishra - Founder of AI-Trainer"
            width={500}
            height={625}
            className="rounded-[2rem] object-cover aspect-[4/5] grayscale-[20%] contrast-[1.1] brightness-[95%] shadow-2xl border border-zinc-200/50"
          />
        </div>
      </section>
      <div>
        <h1 className="text-6xl font-bold tracking-tighter text-zinc-950 dark:text-zinc-200 flex flex-col items-center">
          Engineering the Future of Technical Interviews.
        </h1>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-10 lg:px-40 py-24 items-center ">
          <div className="group relative flex flex-col border rounded-3xl min-h-[250px] hover:bg-white dark:hover:bg-zinc-300 hover:shadow-2xl hover:-translate-y-3 bg-zinc-300 dark:bg-zinc-400 pl-4 pt-2 transition-all duration-500">
            <span
              className="text-sm font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-300 group-hover:text-zinc-950
                dark:group-hover:text-zinc-600 transition-colors"
            >
              01
            </span>
            <h1 className="text-2xl font-bold mt-6 text-zinc-900 leading-tight">
              Adaptive Intelligence
            </h1>
            <p className="mt-auto leading-relaxed group-hover:text-zinc-600 transition-colors pb-8">
              An AI that evolves with your stack. From React hooks to complex
              DSA patterns, it identifies exactly where your logic falters in
              real time.
            </p>
          </div>
          <div className="group relative flex flex-col border rounded-3xl min-h-[250px] hover:bg-white dark:hover:bg-zinc-300 hover:shadow-2xl hover:-translate-y-3 bg-zinc-300 dark:bg-zinc-400 pl-4 pt-2 transition-all duration-500">
            <span
              className="text-sm font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-300 group-hover:text-zinc-950
                dark:group-hover:text-zinc-600 transition-colors"
            >
              02
            </span>
            <h1 className="text-2xl font-bold mt-6 text-zinc-900  leading-tight">
              Real-Time Synthesis
            </h1>
            <p className="mt-auto leading-relaxed group-hover:text-zinc-600 transition-colors pb-8">
              Eliminate the feedback gap. Get instant, surgical analysis on your
              technical communication and coding speed the moment you finish a
              response.
            </p>
          </div>
          <div className="group relative flex flex-col border rounded-3xl min-h-[250px] hover:bg-white dark:hover:bg-zinc-300 hover:shadow-2xl hover:-translate-y-3 bg-zinc-300 dark:bg-zinc-400 pl-4 pt-2 transition-all duration-500">
            <span
              className="text-sm font-mono font-bold tracking-widest text-zinc-400 dark:text-zinc-300 group-hover:text-zinc-950
                dark:group-hover:text-zinc-600 transition-colors"
            >
              03
            </span>
            <h1 className="text-2xl font-bold mt-6 text-zinc-900  leading-tight">
              Adaptive Intelligence
            </h1>
            <p className="mt-auto leading-relaxed group-hover:text-zinc-600 transition-colors pb-8">
              Replace guesswork with data. Track your progress through granular
              performance heatmaps designed to meet the hiring bars of top-tier
              tech firms.
            </p>
          </div>
        </section>
      </div>
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-10 lg:px-40 mb-16">
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
            Curated Excellence across the Modern Stack.
          </h2>
          <p className="text-zinc-500 mt-2 text-lg">
            AI-Trainer is built on the same foundations used by industry
            leaders.{" "}
            <span className="text-zinc-900 dark:text-zinc-300 font-medium">
              Mastery isn't optional.
            </span>
          </p>
        </div>

        <div className="relative flex">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 lg:gap-24">
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase outline-text">
              React
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Next.js
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Node.js
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              MongoDB
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              DSA
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Java
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              TypeScript
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              JavaScript
            </span>

            {/* (Duplicated for seamless loop) */}
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              React
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Next.js
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Node.js
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              MongoDB
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              DSA
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              Java
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              TypeScript
            </span>
            <span className="text-6xl lg:text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
              JavaScript
            </span>
          </div>
        </div>
      </section>
      <section className="px-10 lg:px-40 relative z-10 -mb-10 mt-10">
        <div className="bg-zinc-950 rounded-[2.5rem] p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between border border-zinc-800 shadow-2xl overflow-hidden relative">
          <div className="max-w-xl z-10">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-4">
              Experience superior <br /> technical training.
            </h2>
            <p className="text-zinc-400 text-lg mb-8">
              150+ granular data points per interview session.
            </p>
            <Link href="/sign-up">
              <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all active:scale-95">
                Get started
              </button>
            </Link>
            <div className="absolute -right-20 -top-20 w-[600px] h-[600px] opacity-30 pointer-events-none">
              <Image
                src="/image.png"
                alt="Globe Decor"
                fill
                className="object-contain mix-blend-screen opacity-70 [mask-image:radial-gradient(circle_at_center,white_80%,transparent_100%)]"
              />
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none opacity-50" />
        </div>
      </section>
      <footer className="bg-black pt-18 pb-10 px-10 lg:px-40">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-30 border-b border-white/5 pb-20">
            <div className="md:col-span-3 flex flex-col items-start">
              <Link
                href="/"
                className="text-2xl font-black tracking-tighter text-white uppercase mb-6"
              >
                AI-Trainer
              </Link>
              <div className="text-zinc-500 text-sm space-y-1 mb-10">
                <p>Engineering the future of</p>
                <p>technical interviews.</p>
              </div>

              <div className="flex gap-16 mt-auto">
                <div>
                  <h5 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3 font-bold">
                    Phone
                  </h5>
                  <p className="text-zinc-300 text-sm hover:text-white cursor-pointer transition-colors">
                    1-800-AI-READY
                  </p>
                </div>
                <div>
                  <h5 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-3 font-bold">
                    Email
                  </h5>
                  <p className="text-zinc-300 text-sm hover:text-white cursor-pointer transition-colors">
                    support@ai-trainer.com
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 md:col-start-4">
              <h4 className="text-white text-sm font-bold mb-6">Quick links</h4>
              <ul className="space-y-4 text-[13px] text-zinc-500">
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h4 className="text-white text-sm font-bold mb-6">Social</h4>
              <ul className="space-y-4 text-[13px] text-zinc-500">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h4 className="text-white text-sm font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-[13px] text-zinc-500">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.2em] text-zinc-600 uppercase font-medium">
            <p>
              © 2026 AI-TRAINER. ALL RIGHTS RESERVED.
              <br />
              DESIGNED BY SHREYASH MISHRA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
