import { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search, X, ChevronDown, Download, ArrowRight, SlidersHorizontal,
  ExternalLink, BarChart2, TrendingUp, Users, Building2, Rocket, MapPin
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

type Dashboard = {
  id: string;
  title: string;
  desc: string;
  updated: string;
  ind: number;
  icon: React.ElementType;
  color: string;
  chartData: { label: string; value: number }[];
  chartType: "area" | "bar" | "line";
  unit: string;
};

const DASHBOARDS: Dashboard[] = [
  {
    id: "inversion",
    title: "Inversión y financiación",
    desc: "Métricas de venture capital, inversión pública y privada en I+D y fondos disponibles en el ecosistema CTI de Medellín.",
    updated: "Nov 2024",
    ind: 14,
    icon: TrendingUp,
    color: "#C0D400",
    chartType: "area",
    unit: "M USD",
    chartData: [
      { label: "2019", value: 38 },
      { label: "2020", value: 29 },
      { label: "2021", value: 55 },
      { label: "2022", value: 72 },
      { label: "2023", value: 91 },
      { label: "2024", value: 118 },
    ],
  },
  {
    id: "talento",
    title: "Talento y capital humano",
    desc: "Graduados STEM, investigadores per cápita y déficit de talento en el sector TI de la región metropolitana.",
    updated: "Oct 2024",
    ind: 9,
    icon: Users,
    color: "#00B8A3",
    chartType: "bar",
    unit: "Miles",
    chartData: [
      { label: "2019", value: 12.4 },
      { label: "2020", value: 13.1 },
      { label: "2021", value: 14.8 },
      { label: "2022", value: 16.2 },
      { label: "2023", value: 17.9 },
      { label: "2024", value: 19.3 },
    ],
  },
  {
    id: "empresas",
    title: "Empresas e innovación",
    desc: "Gasto empresarial en innovación, patentes, spin-offs y adopción de tecnologías maduras por sector.",
    updated: "Oct 2024",
    ind: 18,
    icon: Building2,
    color: "#0068FF",
    chartType: "line",
    unit: "Patentes",
    chartData: [
      { label: "2019", value: 44 },
      { label: "2020", value: 38 },
      { label: "2021", value: 52 },
      { label: "2022", value: 67 },
      { label: "2023", value: 83 },
      { label: "2024", value: 95 },
    ],
  },
  {
    id: "startups",
    title: "Emprendimiento y startups",
    desc: "Mortalidad y supervivencia empresarial, mapeo de startups por sector y madurez tecnológica.",
    updated: "Nov 2024",
    ind: 12,
    icon: Rocket,
    color: "#FF4C17",
    chartType: "bar",
    unit: "Startups",
    chartData: [
      { label: "2019", value: 210 },
      { label: "2020", value: 185 },
      { label: "2021", value: 267 },
      { label: "2022", value: 341 },
      { label: "2023", value: 408 },
      { label: "2024", value: 472 },
    ],
  },
  {
    id: "ciudad",
    title: "Ciudad y calidad de vida",
    desc: "Adopción de tecnologías cívicas, movilidad inteligente y cohesión social tecnológica en el territorio.",
    updated: "Sep 2024",
    ind: 15,
    icon: MapPin,
    color: "#FFCA00",
    chartType: "area",
    unit: "Índice",
    chartData: [
      { label: "2019", value: 52 },
      { label: "2020", value: 49 },
      { label: "2021", value: 58 },
      { label: "2022", value: 63 },
      { label: "2023", value: 71 },
      { label: "2024", value: 78 },
    ],
  },
];

type SourceDoc = {
  title: string;
  year: string;
  scope: string;
  weight: string;
  type: "informe" | "ranking" | "metodologia" | "datos";
};

type Source = {
  name: string;
  desc: string;
  color: string;
  docs: SourceDoc[];
};

const SOURCES: Source[] = [
  {
    name: "GEIAL",
    color: "#007C6B",
    desc: "Comunidad de medición de ecosistemas de emprendimiento dinámico e innovador en América Latina.",
    docs: [
      { title: "GEIAL Medellín 2024", year: "2024", scope: "Local", weight: "2.4 MB", type: "informe" },
      { title: "GEIAL comparado 2024", year: "2024", scope: "Comparativo", weight: "3.1 MB", type: "ranking" },
      { title: "GEIAL Medellín 2023", year: "2023", scope: "Local", weight: "2.1 MB", type: "informe" },
      { title: "GEIAL comparado 2023", year: "2023", scope: "Comparativo", weight: "2.8 MB", type: "ranking" },
      { title: "Nota metodológica GEIAL 2023", year: "2023", scope: "Global", weight: "0.8 MB", type: "metodologia" },
    ],
  },
  {
    name: "IESE Cities in Motion",
    color: "#0050E0",
    desc: "Plataforma de investigación de IESE Business School sobre gobernanza urbana y ciudades inteligentes.",
    docs: [
      { title: "Cities in Motion Index 2024", year: "2024", scope: "Global", weight: "5.2 MB", type: "ranking" },
      { title: "Cities in Motion Index 2023", year: "2023", scope: "Global", weight: "4.9 MB", type: "ranking" },
    ],
  },
  {
    name: "StartupBlink",
    color: "#253D36",
    desc: "Mapa global de ecosistemas de startups y centro de investigación en economía de la innovación.",
    docs: [
      { title: "Global Startup Ecosystem Report 2024", year: "2024", scope: "Global", weight: "12 MB", type: "informe" },
      { title: "Colombia Tech Report 2024", year: "2024", scope: "Comparativo", weight: "4.5 MB", type: "informe" },
      { title: "Medellín Ecosystem Health Check 2024", year: "2024", scope: "Local", weight: "1.8 MB", type: "datos" },
      { title: "Global Startup Ecosystem Report 2023", year: "2023", scope: "Global", weight: "10.5 MB", type: "informe" },
    ],
  },
  {
    name: "Medellín Cómo Vamos",
    color: "#6A7700",
    desc: "Programa ciudadano de seguimiento y evaluación de la calidad de vida en Medellín.",
    docs: [
      { title: "Encuesta de Percepción 2024", year: "2024", scope: "Local", weight: "3.7 MB", type: "datos" },
      { title: "Informe de Calidad de Vida 2024", year: "2024", scope: "Local", weight: "8.1 MB", type: "informe" },
      { title: "Encuesta de Percepción 2023", year: "2023", scope: "Local", weight: "3.5 MB", type: "datos" },
    ],
  },
];

const TYPE_LABELS: Record<string, string> = {
  informe: "Informe",
  ranking: "Ranking",
  metodologia: "Metodología",
  datos: "Datos abiertos",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  informe:     { bg: "#E8F4FF", text: "#0050E0" },
  ranking:     { bg: "#EBF2EA", text: "#007C6B" },
  metodologia: { bg: "#FFF8E1", text: "#9B7700" },
  datos:       { bg: "#F3F0FF", text: "#6C4BCC" },
};

const SCOPE_OPTIONS = ["Todos", "Local", "Comparativo", "Global"];
const YEAR_OPTIONS  = ["Todos", "2024", "2023", "2022"];
const TYPE_OPTIONS  = ["Todos", ...Object.keys(TYPE_LABELS)];

// ─────────────────────────────────────────────────────────────────────────────
// MINI CHART
// ─────────────────────────────────────────────────────────────────────────────

function MiniChart({ d }: { d: Dashboard }) {
  const { chartData, chartType, color } = d;

  if (chartType === "area") {
    const gradId = `mini-grad-${d.id}`;
    return (
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop key="stop-start" offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop key="stop-end"   offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area key={`area-${d.id}`} type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} dot={false} />
          <XAxis key={`xaxis-${d.id}`} dataKey="label" hide />
          <YAxis key={`yaxis-${d.id}`} hide />
          <Tooltip
            key={`tooltip-${d.id}`}
            contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "'Source Sans 3',sans-serif" }}
            formatter={(v: number) => [`${v} ${d.unit}`, ""]}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "bar") return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barSize={10}>
        <Bar key={`bar-${d.id}`} dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
        <XAxis key={`xaxis-${d.id}`} dataKey="label" hide />
        <YAxis key={`yaxis-${d.id}`} hide />
        <Tooltip
          key={`tooltip-${d.id}`}
          contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "'Source Sans 3',sans-serif" }}
          formatter={(v: number) => [`${v} ${d.unit}`, ""]}
          labelStyle={{ color: "rgba(255,255,255,0.6)" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line key={`line-${d.id}`} type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3, fill: color, strokeWidth: 0 }} />
        <XAxis key={`xaxis-${d.id}`} dataKey="label" hide />
        <YAxis key={`yaxis-${d.id}`} hide />
        <Tooltip
          key={`tooltip-${d.id}`}
          contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "'Source Sans 3',sans-serif" }}
          formatter={(v: number) => [`${v} ${d.unit}`, ""]}
          labelStyle={{ color: "rgba(255,255,255,0.6)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA BANNER
// ─────────────────────────────────────────────────────────────────────────────

function DataBanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".data-banner-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
      gsap.fromTo(".data-banner-h1",      { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.12, ease: "power2.out" });
      gsap.fromTo(".data-banner-p",       { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.24, ease: "power2.out" });
      gsap.fromTo(".data-banner-stats > *", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.36, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="radar-hero" className="bg-[#253D36] text-white px-6 lg:px-10 xl:px-12 relative overflow-hidden flex flex-col justify-center" style={{ minHeight: "60svh", paddingTop: 120, paddingBottom: 80 }}>
      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(192,212,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(192,212,0,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      {/* Accent lines */}
      <div className="absolute top-0 right-0 w-[480px] h-full pointer-events-none opacity-15">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="100" stroke="#C0D400" strokeWidth="0.6" />
          <line x1="25" y1="0" x2="100" y2="75" stroke="#00B8A3" strokeWidth="0.6" />
          <line x1="50" y1="0" x2="100" y2="50" stroke="#0068FF" strokeWidth="0.6" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <p className="data-banner-eyebrow text-[10px] tracking-[0.32em] uppercase mb-6"
          style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif", fontWeight: "bold" }}>
          Radar CTI · Data
        </p>
        <h1 className="data-banner-h1 text-white mb-6 max-w-4xl"
          style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2.5rem,4vw,3.75rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          El dato crudo, disponible para todos
        </h1>
        <p className="data-banner-p text-lg md:text-xl max-w-2xl"
          style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}>
          Tableros dinámicos, series históricas y el repositorio de reportes oficiales del ecosistema CTI. Filtra, compara, descarga y saca tus propias conclusiones: para eso publicamos.
        </p>

        {/* Quick stats */}
        <div className="data-banner-stats flex flex-wrap gap-8 mt-12 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {[
            { n: "5", label: "tableros temáticos" },
            { n: "68", label: "indicadores activos" },
            { n: "17", label: "documentos descargables" },
            { n: "4", label: "fuentes internacionales" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-black text-[#C0D400]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>{s.n}</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SECTION
// ─────────────────────────────────────────────────────────────────────────────

function DataDashboardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".dash-card",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const activeDash = DASHBOARDS.find(d => d.id === active) ?? null;

  return (
    <section ref={sectionRef} id="radar-tableros" className="py-24 bg-[#FAFAF8] relative" style={{ borderBottom: "1px solid rgba(37,61,54,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <p className="text-[10px] tracking-[0.28em] uppercase font-bold mb-3"
            style={{ color: "#00B8A3", fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            Tableros interactivos
          </p>
          <h2 className="text-[#253D36] mb-4"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", fontSize: "clamp(1.85rem,3vw,2.5rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
            Explora los datos por tema
          </h2>
          <p className="text-lg text-[#253D36]/65"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}>
            Cada tablero reúne indicadores sobre un mismo tema, con series temporales desde 2019. Pasa el cursor por la gráfica para ver los valores exactos.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DASHBOARDS.map(d => {
            const Icon = d.icon;
            const isActive = active === d.id;
            const trend = d.chartData[d.chartData.length - 1].value - d.chartData[0].value;
            const trendPct = Math.round((trend / d.chartData[0].value) * 100);

            return (
              <div
                key={d.id}
                className={`dash-card bg-white rounded-md border transition-all duration-300 cursor-pointer flex flex-col ${
                  isActive
                    ? "border-[#C0D400] shadow-lg ring-2 ring-[#C0D400]/40"
                    : "border-[rgba(37,61,54,0.08)] shadow-sm hover:border-[rgba(37,61,54,0.2)] hover:shadow-md"
                }`}
                onClick={() => setActive(isActive ? null : d.id)}
              >
                {/* Card header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0"
                      style={{ background: `${d.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: d.color }} />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${d.color}18`, color: d.color, fontFamily: "'Source Sans 3',sans-serif" }}>
                      {d.ind} indicadores
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-[#253D36] mb-2"
                    style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                    {d.title}
                  </h3>
                  <p className="text-sm text-[#253D36]/55 leading-snug"
                    style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                    {d.desc}
                  </p>
                </div>

                {/* Chart preview */}
                <div className="px-6 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#253D36]/35"
                      style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
                      {d.unit} · 2019–2024
                    </span>
                    <span className="text-xs font-bold" style={{ color: trendPct >= 0 ? "#00B8A3" : "#FF4C17", fontFamily: "'Source Sans 3',sans-serif" }}>
                      {trendPct >= 0 ? "+" : ""}{trendPct}%
                    </span>
                  </div>
                  <MiniChart d={d} />
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-6 py-4 mt-auto"
                  style={{ borderTop: "1px solid rgba(37,61,54,0.07)" }}>
                  <span className="text-[11px] text-[#253D36]/45" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
                    Actualizado: {d.updated}
                  </span>
                  <button
                    className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: isActive ? "#253D36" : d.color, fontFamily: "'Neue Haas Grotesk Display Pro',sans-serif" }}
                    onClick={e => { e.stopPropagation(); setActive(isActive ? null : d.id); }}
                  >
                    {isActive ? "Cerrar" : "Ver tablero"} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded dashboard view */}
        {activeDash && (
          <div className="rounded-md border border-[#C0D400] bg-white shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid rgba(37,61,54,0.08)", background: "#FAFAF8" }}>
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-[4px] flex items-center justify-center" style={{ background: `${activeDash.color}20` }}>
                  <activeDash.icon className="w-4 h-4" style={{ color: activeDash.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',sans-serif" }}>{activeDash.title}</h3>
                  <p className="text-xs text-[#253D36]/50" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>Serie 2019–2024 · {activeDash.ind} indicadores · Actualizado {activeDash.updated}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0068FF] hover:underline" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir en pantalla completa
                </button>
                <button onClick={() => setActive(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F0] hover:bg-[#E4E6E0] transition-colors">
                  <X className="w-4 h-4 text-[#253D36]/60" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-px bg-[rgba(37,61,54,0.08)] rounded-sm mb-8">
                {[
                  { label: "Valor 2024", value: `${activeDash.chartData[activeDash.chartData.length - 1].value} ${activeDash.unit}` },
                  { label: "Crecimiento 5 años", value: `+${Math.round(((activeDash.chartData[activeDash.chartData.length - 1].value - activeDash.chartData[0].value) / activeDash.chartData[0].value) * 100)}%` },
                  { label: "Indicadores incluidos", value: `${activeDash.ind}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-white px-6 py-5">
                    <p className="text-xs font-semibold text-[#253D36]/50 mb-1" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>{stat.label}</p>
                    <p className="text-2xl font-black text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',sans-serif", color: activeDash.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  {activeDash.chartType === "bar" ? (
                    <BarChart data={activeDash.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }} barSize={32}>
                      <Bar dataKey="value" fill={activeDash.color} radius={[3, 3, 0, 0]} />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.4 }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, fontFamily: "'Source Sans 3',sans-serif" }} formatter={(v: number) => [`${v} ${activeDash.unit}`, activeDash.title]} />
                    </BarChart>
                  ) : activeDash.chartType === "area" ? (
                    <AreaChart data={activeDash.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <defs>
                        <linearGradient id={`exp-${activeDash.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop key="stop-start" offset="5%"  stopColor={activeDash.color} stopOpacity={0.2} />
                          <stop key="stop-end"   offset="95%" stopColor={activeDash.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={activeDash.color} strokeWidth={2.5} fill={`url(#exp-${activeDash.id})`} dot={{ r: 4, fill: activeDash.color, strokeWidth: 0 }} />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.4 }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, fontFamily: "'Source Sans 3',sans-serif" }} formatter={(v: number) => [`${v} ${activeDash.unit}`, activeDash.title]} />
                    </AreaChart>
                  ) : (
                    <LineChart data={activeDash.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <Line type="monotone" dataKey="value" stroke={activeDash.color} strokeWidth={2.5} dot={{ r: 4, fill: activeDash.color, strokeWidth: 0 }} />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "'Source Sans 3',sans-serif", fill: "#253D36", opacity: 0.4 }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip contentStyle={{ background: "#253D36", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, fontFamily: "'Source Sans 3',sans-serif" }} formatter={(v: number) => [`${v} ${activeDash.unit}`, activeDash.title]} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS SECTION
// ─────────────────────────────────────────────────────────────────────────────

function DocTypePill({ type }: { type: string }) {
  const colors = TYPE_COLORS[type] ?? { bg: "#F2F4F0", text: "#253D36" };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded"
      style={{ background: colors.bg, color: colors.text, fontFamily: "'Source Sans 3',sans-serif", letterSpacing: "0.02em" }}>
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

export function DataReportsSection({
  title = "Reportes y documentos fuente",
  subtitle = "Los documentos oficiales de rankings y mediciones del ecosistema, organizados por fuente y año, disponibles para descarga directa.",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [yearFilter,  setYear]  = useState("Todos");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return SOURCES.map(source => ({
      ...source,
      docs: source.docs.filter(doc => {
        const matchSearch = !q || doc.title.toLowerCase().includes(q) || source.name.toLowerCase().includes(q) || doc.year.includes(q);
        const matchYear   = yearFilter === "Todos"  || doc.year  === yearFilter;
        return matchSearch && matchYear;
      }),
    })).filter(s => s.docs.length > 0);
  }, [search, yearFilter]);

  const totalDocs = filtered.reduce((acc, s) => acc + s.docs.length, 0);
  const hasFilters = search || yearFilter !== "Todos";

  const clearAll = () => { setSearch(""); setYear("Todos"); };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".report-source-block",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.09, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="radar-reportes" className="py-12 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        <div className="max-w-3xl mb-6">
          <p className="text-[10px] tracking-[0.28em] uppercase font-bold mb-3"
            style={{ color: "#0068FF", fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            Repositorio de documentos
          </p>
          <h2 className="text-[#253D36] mb-4"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", fontSize: "clamp(1.85rem,3vw,2.5rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          <p className="text-lg text-[#253D36]/65"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* Filter bar */}
        {/* Filter bar — single compact row */}
        <div className="flex items-center gap-2 mb-6">
          {/* Search */}
          <div className="relative" style={{ maxWidth: 280 }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#253D36]/35 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar documento…"
              className="w-full h-9 bg-white pl-9 pr-8 rounded-sm border border-[rgba(37,61,54,0.12)] text-[#111] focus:outline-none focus:border-[#C0D400] focus:ring-1 focus:ring-[#C0D400] text-xs"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-sm text-[#253D36]/35 hover:text-[#253D36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Year */}
          <div className="relative shrink-0">
            <select
              value={yearFilter}
              onChange={e => setYear(e.target.value)}
              className="appearance-none h-9 bg-white text-xs font-semibold text-[#253D36] border border-[rgba(37,61,54,0.12)] rounded-sm pl-3 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C0D400]"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              <option value="Todos">Año: Todos</option>
              {YEAR_OPTIONS.filter(o => o !== "Todos").map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#253D36]/35 pointer-events-none" />
          </div>

          {/* Status + clear */}
          <span className="ml-1 text-xs text-[#253D36]/45 shrink-0" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
            {hasFilters
              ? <><strong className="text-[#253D36] font-bold">{totalDocs}</strong> {totalDocs === 1 ? "doc." : "docs."}</>
              : <>17 disponibles</>
            }
          </span>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="ml-auto text-xs font-bold text-[#0068FF] hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
              style={{ fontFamily: "'Source Sans 3',sans-serif" }}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-[#FAFAF8] rounded-md border border-dashed border-[rgba(37,61,54,0.15)]">
            <div className="w-14 h-14 rounded-full bg-[#EBF2EA] flex items-center justify-center mx-auto mb-5">
              <BarChart2 className="w-6 h-6 text-[#00B8A3]" />
            </div>
            <h3 className="font-bold text-[#253D36] mb-2"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro',sans-serif", fontSize: "1.2rem" }}>
              Sin resultados
            </h3>
            <p className="text-sm text-[#253D36]/55 max-w-sm mx-auto mb-6"
              style={{ fontFamily: "'Source Sans 3',sans-serif", lineHeight: 1.6 }}>
              No encontramos documentos con esos filtros. Prueba ampliando el año o consulta el listado completo.
            </p>
            <button onClick={clearAll}
              className="text-sm font-bold text-white bg-[#253D36] px-5 py-2.5 rounded-sm hover:bg-[#1a2e28] transition-colors"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro',sans-serif" }}>
              Ver todos los documentos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {filtered.map((source, idx) => (
              <div key={idx} className="report-source-block">
                {/* Source header */}
                <div className="flex items-start justify-between mb-6 pb-5">
                  <div>
                    <div className="h-[3px] w-10 rounded-full mb-3" style={{ backgroundColor: source.color }} aria-hidden="true" />
                    <h3 className="text-2xl font-black mb-1"
                      style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.015em", color: source.color }}>
                      {source.name}
                    </h3>
                    <p className="text-sm text-[#253D36]/55"
                      style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", maxWidth: 520, lineHeight: 1.5 }}>
                      {source.desc}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#253D36]/40 mt-1"
                    style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
                    {source.docs.length} {source.docs.length === 1 ? "doc." : "docs."}
                  </span>
                </div>

                {/* Doc cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {source.docs.map((doc, dIdx) => (
                    <div key={dIdx}
                      className="group flex flex-col rounded-[4px] bg-white overflow-hidden transition-colors duration-150"
                      style={{ border: "1px solid rgba(37,61,54,0.09)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#253D36"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,61,54,0.09)"; }}
                    >
                      <span className="block h-[3px] shrink-0" style={{ backgroundColor: source.color }} aria-hidden="true" />
                      <div className="p-4 flex flex-col flex-1">
                        <div className="mb-2">
                          <DocTypePill type={doc.type} />
                        </div>
                        <h4 className="text-[15px] font-bold mb-auto leading-snug transition-colors duration-150 group-hover:text-[#0050E0]"
                          style={{ color: "#253D36", fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                          {doc.title}
                        </h4>
                        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(37,61,54,0.07)" }}>
                          <span className="text-[10px] text-[#253D36]/45" style={{ fontFamily: "'Source Sans 3',sans-serif" }}>
                            {doc.year} · {doc.weight}
                          </span>
                          <a href="#descargar"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0050E0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm relative z-10"
                            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                            <Download className="w-3 h-3" /> Descargar
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

