'use client';

import { ArrowRight, Command, Sparkles } from 'lucide-react';

interface Props {
  onEnter: () => void;
}

const QUOTE =
  'The best way to predict the future of retail is to orchestrate it — with intelligence at every entrance, every aisle, every moment.';

const ATTRIBUTION = 'MallMind Operations Philosophy';

export default function LandingPage({ onEnter }: Props) {
  return (
    <div className="landing-shell relative flex min-h-screen flex-col overflow-hidden text-white">
      <div className="landing-glow pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center border border-[#5d3c86]/60 bg-[#120d1d]/80 text-[#d9c8ff] backdrop-blur">
            <Command size={18} strokeWidth={1.8} />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/90">
            MallMind
          </span>
        </div>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-[#8f879d] sm:inline">
          AI Mall Operations
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 md:px-10">
        <div className="landing-enter mb-8 flex items-center gap-2 border border-[#3a2c52]/50 bg-[#0b0910]/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#a98cff] backdrop-blur">
          <Sparkles size={12} />
          Westfield Grand Mall · Dallas, TX
        </div>

        <h1
          className="landing-enter landing-enter-delay-1 max-w-4xl text-center text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ animationDelay: '80ms' }}
        >
          Where malls think
          <span className="block bg-gradient-to-r from-[#c4b5fd] via-[#8b5cf6] to-[#6ee7b7] bg-clip-text text-transparent">
            before they move.
          </span>
        </h1>

        <blockquote
          className="landing-enter landing-enter-delay-2 mt-10 max-w-2xl border-l-2 border-[#8b5cf6]/70 pl-6 text-left md:mt-12"
          style={{ animationDelay: '160ms' }}
        >
          <p className="text-base font-light italic leading-relaxed text-[#d4cfe6] md:text-lg">
            &ldquo;{QUOTE}&rdquo;
          </p>
          <footer className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#7f768f]">
            — {ATTRIBUTION}
          </footer>
        </blockquote>

        <div
          className="landing-enter landing-enter-delay-3 mt-14 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <button
            type="button"
            onClick={onEnter}
            className="group click-adapt flex items-center gap-3 border border-[#6d4ea0] bg-[#24143a] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(139,92,246,0.2)]"
          >
            Enter Operations Center
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
          <p className="text-xs text-[#655d72]">
            Live traffic · incidents · campaigns · AI agent
          </p>
        </div>

        <div
          className="landing-enter landing-enter-delay-4 mt-20 grid w-full max-w-3xl grid-cols-3 gap-px border border-[#241d34]/80 bg-[#241d34]/80"
          style={{ animationDelay: '320ms' }}
        >
          {[
            { label: 'Zones monitored', value: '12+' },
            { label: 'Refresh cadence', value: '30s' },
            { label: 'Agent tools', value: '8' }
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-[#09080d]/90 px-4 py-5 text-center backdrop-blur"
            >
              <p className="text-xl font-semibold text-[#c4b5fd] md:text-2xl">{value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#7f768f]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 px-6 py-5 text-center text-[10px] uppercase tracking-[0.2em] text-[#4a4458] md:px-10">
        MallMind · Professional mall operations intelligence
      </footer>
    </div>
  );
}
