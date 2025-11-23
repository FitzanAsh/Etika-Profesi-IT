'use client';
import MeteorBackground from '@/components/ui/meteor-background';
import { Rocket } from 'lucide-react';

export default function ZFlaskPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            <MeteorBackground />

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-medium tracking-widest uppercase mb-6 backdrop-blur-sm animate-pulse">
                    <Rocket className="h-3 w-3" /> Coming Soon
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-[0_0_35px_rgba(0,255,255,0.3)]">
                    Z-FLASK
                </h1>

                <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
                    The Future of Hydration for Gamers. <br />
                    <span className="text-cyan-400">Temperature Control. RGB Sync. Status Display.</span>
                </p>

                <form className="mt-10 flex w-full max-w-sm items-center space-x-2">
                    <input
                        type="email"
                        placeholder="Enter email for early access"
                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm"
                    />
                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    >
                        Notify Me
                    </button>
                </form>
            </div>
        </div>
    );
}
