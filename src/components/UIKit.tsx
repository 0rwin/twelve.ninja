import React from 'react'
import { Sun, Home, Users, Shield, Zap } from 'lucide-react'

// --- Reusable UI primitives ---

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl shadow-black/40 backdrop-blur-sm ${className}`}>
            {children}
        </div>
    )
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="text-center">
            <div className="text-sm uppercase tracking-wider text-white/80">{subtitle}</div>
            <h2 className="text-2xl font-semibold tracking-wide text-white mt-1">{title}</h2>
        </div>
    )
}

export function CodeBadge({ label, accent = 'text-yellow-400' }: { label: string; accent?: string }) {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/3 border border-white/6 ${accent}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="3" /></svg>
            <span className="text-sm font-medium text-white/90">{label}</span>
        </div>
    )
}

export function StatBlock({ stats }: { stats: Record<string, number | string> }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Object.entries(stats).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/6">
                    <div className="text-xs text-white/80 tracking-wide">{k}</div>
                    <div className="font-semibold text-white">{v}</div>
                </div>
            ))}
        </div>
    )
}

export function IconNav() {
    const items = [
        { icon: Home, label: 'Home' },
        { icon: Users, label: 'Party' },
        { icon: Shield, label: 'Territory' },
        { icon: Zap, label: 'Combat' },
    ]
    return (
        <div className="flex items-center justify-around p-2 bg-white/3 rounded-2xl border border-white/6">
            {items.map((it) => (
                <button key={it.label} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition">
                    <it.icon className="w-5 h-5 text-white/90" />
                    <span className="text-[11px] text-white/70">{it.label}</span>
                </button>
            ))}
        </div>
    )
}

export function ProfileCard({ name, code, stats, silhouette }: { name: string; code: string; stats: Record<string, number | string>; silhouette?: string }) {
    return (
        <Panel className="max-w-md mx-auto">
            <div className="flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full bg-white/3 border border-white/6 flex items-center justify-center overflow-hidden">
                    {silhouette ? (
                        <img src={silhouette} alt="silhouette" className="w-full h-full object-contain" />
                    ) : (
                        <svg viewBox="0 0 120 120" className="w-28 h-28 opacity-95" fill="currentColor"><circle cx="60" cy="40" r="18" /><rect x="22" y="64" width="76" height="28" rx="6" /></svg>
                    )}
                    <div className="absolute -bottom-4 right-4">
                        <CodeBadge label={code} />
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <div className="text-lg font-semibold text-white">{name}</div>
                    <div className="text-sm text-white/70 mt-1">Seasoned operative • Level 27</div>
                </div>

                <div className="w-full mt-6">
                    <StatBlock stats={stats} />
                </div>
            </div>
        </Panel>
    )
}

// --- App shell demonstrating components ---

export default function AppShell() {
    const dummyStats = { STR: 14, DEX: 18, VIT: 12, INT: 10, WIS: 11, LUK: 8 }

    return (
        <div className="min-h-screen bg-[#0d0d0f] text-gray-100 antialiased py-12 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column: profile + nav */}
                <div className="space-y-6">
                    <ProfileCard name="Kalyx" code="Snake" stats={dummyStats} silhouette={undefined} />

                    <Panel>
                        <SectionHeader title="Quick Actions" subtitle="Prepare" />
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button className="px-4 py-3 rounded-xl bg-white/4 border border-white/6">Travel</button>
                            <button className="px-4 py-3 rounded-xl bg-white/4 border border-white/6">Infiltrate</button>
                            <button className="px-4 py-3 rounded-xl bg-white/4 border border-white/6">Defend</button>
                            <button className="px-4 py-3 rounded-xl bg-white/4 border border-white/6">Gather</button>
                        </div>
                    </Panel>

                    <Panel>
                        <SectionHeader title="Navigation" subtitle="World" />
                        <div className="mt-4">
                            <IconNav />
                        </div>
                    </Panel>
                </div>

                {/* Center column: main content */}
                <div className="lg:col-span-2 space-y-6">
                    <Panel className="mb-2">
                        <SectionHeader title="Blackford Outskirts" subtitle="Tile 42, -7" />
                        <div className="mt-4 text-white/80">
                            <p className="mb-4">Night patrols increase detection. The wind carries the smell of coal and a single watchtower can be seen on the ridge.</p>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <div className="bg-white/3 p-4 rounded-lg border border-white/6">
                                        <div className="font-semibold">Encounter:</div>
                                        <div className="text-sm text-white/70 mt-1">Scout patrol — avoid or engage?</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-col gap-2">
                                        <button className="px-3 py-2 rounded-xl bg-yellow-500/20 border border-yellow-400">Engage</button>
                                        <button className="px-3 py-2 rounded-xl bg-white/4 border border-white/6">Sneak</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <Panel>
                        <SectionHeader title="Combat Log" subtitle="Recent" />
                        <div className="mt-4 font-mono text-sm text-white/80 space-y-2">
                            <div>• Kalyx slipped past the outer post at 01:03 — detection roll 14/20.</div>
                            <div>• Scout patrol engaged — Kalyx dealt 12 damage (critical).</div>
                            <div>• Victory: +18 XP, +6 Ryo.</div>
                        </div>
                    </Panel>

                    <Panel>
                        <SectionHeader title="Public Notice" subtitle="Town Board" />
                        <div className="mt-4 text-white/80">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Warden taxes increased in Eastwatch.</li>
                                <li>Contested tile near Watchtower 7.</li>
                                <li>Coup petition filed by three households.</li>
                            </ul>
                        </div>
                    </Panel>
                </div>
            </div>

            {/* Footer nav */}
            <div className="max-w-5xl mx-auto mt-8">
                <Panel>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Sun className="w-6 h-6 text-white/90" />
                            <div className="text-sm text-white/80">Season: Midwinter • New Moon</div>
                        </div>

                        <div className="w-48">
                            <IconNav />
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    )
}
