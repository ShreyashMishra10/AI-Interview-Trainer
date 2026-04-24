import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <>
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
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Services
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
    </>
  );
}
