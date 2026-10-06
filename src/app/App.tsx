import { useState, useEffect, useRef } from "react";
import { Outlet, RouterProvider, createBrowserRouter, useNavigate, useLocation } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronDown,
  ArrowRight,
  Download,
  Image as ImageIcon,
  Activity,
  Globe,
  Database,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { AnalisisCTIPage } from "./pages/AnalisisPage";
import { LabPoliticasPage } from "./pages/LabPoliticasPage";
import { DocumentacionPage } from "./pages/DocumentacionPage";
import { ComprasPage } from "./pages/ComprasPage";
import { BlogPage } from "./pages/BlogPage";
import { DataReportsSection } from "./pages/DataPage";
import { Breadcrumb } from "./components/Breadcrumb";
import { FloatingNav } from "./components/FloatingNav";

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { label: "Informes y Tendencias", href: "/radar-cti/data" },
  { label: "Rankings",              href: "/radar-cti/rankings" },
  { label: "Lab de políticas",      href: "/lab-de-politicas" },
];

function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = MAIN_TABS.find((t) =>
    location.pathname === t.href || location.pathname.startsWith(t.href + "/")
  );

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: rgba(37,61,54,0.2) transparent; }
        *::-webkit-scrollbar { width: 5px; height: 5px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(37,61,54,0.18); border-radius: 4px; }
        ::selection { background: #C0D400; color: #111111; }
        :focus-visible { outline: 2px solid #C0D400; outline-offset: 2px; border-radius: 2px; }

        /* ── Mobile interaction polish ─────────────────────────────────── */
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        a, button, [role="button"], input, select, textarea, label {
          -webkit-tap-highlight-color: transparent;
        }
        a, button, [role="button"] { touch-action: manipulation; }
        @media (hover: none) and (pointer: coarse) {
          .rn-tap:active { background: rgba(37,61,54,0.10) !important; }
          .rn-tap-cta:active { background: #AABC00 !important; transform: scale(0.985); }
        }
        .rn-drawer-scroll {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .rn-safe-top { padding-top: env(safe-area-inset-top, 0px); }
        .rn-safe-bottom { padding-bottom: max(env(safe-area-inset-bottom, 0px), 0px); }
      `}</style>

      {/* ── 3-tab page switcher ────────────────────────────────────────── */}
      <header
        className="fixed top-0 inset-x-0 z-50 bg-white"
        style={{ borderBottom: "1px solid rgba(37,61,54,0.10)" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 flex items-center gap-1 h-14">
          {MAIN_TABS.map((tab) => {
            const isActive = activeTab?.href === tab.href;
            return (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(tab.href);
                  window.scrollTo(0, 0);
                }}
                className="relative flex items-center px-5 h-full text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-inset rounded-sm"
                style={{
                  fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                  color: isActive ? "#253D36" : "rgba(37,61,54,0.52)",
                }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-[#C0D400]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </div>
      </header>

      <main style={{ paddingTop: 56 }}>
        <Outlet />
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 1: Hero
// ─────────────────────────────────────────────────────────────────────────────

const RADAR_HISTORICAL_DATA = [
  { year: '2016', value: 1.15 },
  { year: '2017', value: 1.34 },
  { year: '2018', value: 1.68 },
  { year: '2019', value: 2.05 },
  { year: '2020', value: 1.95 },
  { year: '2021', value: 2.24 },
  { year: '2022', value: 2.45 },
  { year: '2023', value: 2.68 },
  { year: '2024', value: 2.85 },
];

const useClientOnly = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
};

function RadarCTIHero() {
    const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      
      tl.fromTo(contentRef.current?.children ? Array.from(contentRef.current.children) : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1 }
      )
      .fromTo(chartRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 1 },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="medicion-hero"
      className="bg-[#253D36] text-white overflow-hidden relative"
      style={{ minHeight: "55svh", paddingTop: 120, paddingBottom: 80 }}
      aria-labelledby="radar-hero-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: Text ── */}
          <div ref={contentRef} className="flex flex-col">
            <p
              className="text-[10px] tracking-[0.32em] uppercase mb-6"
              style={{ color: "#C0D400", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
            >
              MEDICIÓN · RADAR CTI
            </p>
            
            <h1
              id="radar-hero-title"
              className="mb-5"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Lo que no se mide, no se transforma
            </h1>

            {/* Etiqueta de vigencia */}
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B8A3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00B8A3]"></span>
              </span>
              <p 
                className="text-sm font-semibold tracking-wide"
                style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
              >
                Datos actualizados a [mes de año] · [N] fuentes verificadas
              </p>
            </div>

            <p
              className="text-lg mb-10"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Este es el espacio del Centro de Pensamiento de Ruta N donde centralizamos los rankings, los indicadores y los tableros que muestran dónde está el ecosistema de ciencia, tecnología e innovación de Medellín, hacia dónde se mueve y qué decisiones habilita esa información.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#tableros"
                className="inline-flex items-center justify-center font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{ minHeight: 48, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
              >
                Explorar los tableros
              </a>
              <a
                href="/radar-cti/pulso"
                className="inline-flex items-center justify-center font-semibold text-sm text-white rounded-[4px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{ minHeight: 48, border: "1px solid rgba(255,255,255,0.2)", fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              >
                Conocer el Pulso CTI
              </a>
            </div>

            {/* Microcopy de confianza */}
            <p 
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
            >
              Toda la información es pública, trazable y citada en su fuente original.
            </p>
          </div>

          {/* ── RIGHT COLUMN: Animated Real Data Chart ── */}
          <div ref={chartRef} className="w-full h-[320px] lg:h-[400px] bg-[#1C2E29] rounded-lg p-6 flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}>Serie Histórica: Evolución CTI</h3>
              <p className="text-xs text-white/50" style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}>Inversión como % del PIB local</p>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              
<div className="w-full h-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(192,212,0,0.1) 0%, transparent 100%)" }}>
  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0,80 Q25,70 50,40 T100,20 L100,100 L0,100 Z" fill="#C0D400" opacity="0.3" />
    <path d="M0,80 Q25,70 50,40 T100,20" fill="none" stroke="#C0D400" strokeWidth="2" />
  </svg>
</div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 2: Descriptive Paragraph
// ─────────────────────────────────────────────────────────────────────────────

function RadarCTIDescription() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current!.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="medicion-descripcion"
      className="relative py-24 lg:py-32 bg-[#FAFAF8]"
      aria-labelledby="radar-desc-title"
    >
      <div
        ref={contentRef}
        className="max-w-[960px] mx-auto px-6"
      >
        <h2 id="radar-desc-title" className="sr-only">Descripción de la página</h2>

        {/* Intro title — full width, centered */}
        <p
          className="text-[#253D36] mb-12 text-center"
          style={{
            fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          En esta página encontrarás tres formas complementarias de leer el ecosistema CTI de Medellín.
        </p>

        {/* 3 paragraphs in 3 columns — one per paragraph */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6 mb-10"
          style={{
            color: "rgba(37,61,54,0.75)",
            fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.65,
          }}
        >
          <p>
            La primera es el <a href="#medicion-modulos" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Pulso CTI de Medellín</a>, nuestra medición propia, construida con datos primarios levantados entre quienes hacen innovación en la ciudad.
          </p>
          <p>
            La segunda son los <a href="#medicion-modulos" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Rankings globales, regionales y locales</a> que ubican a Medellín en el mapa de la competitividad y que aquí no solo se listan: se explican, se comparan con ciudades pares y se leen críticamente.
          </p>
          <p>
            La tercera es <a href="#medicion-modulos" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Data</a>, un conjunto de tableros dinámicos con las series históricas y los indicadores del ecosistema, filtrables por año y por variable, junto con el repositorio de reportes oficiales disponibles para descarga.
          </p>
        </div>

        {/* Footer note — full width */}
        <p
          className="pt-10 border-t text-center"
          style={{
            borderColor: "rgba(37,61,54,0.12)",
            color: "rgba(37,61,54,0.75)",
            fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.65,
          }}
        >
          Cada cifra que verás aquí indica su fuente y su fecha de corte. No trabajamos con estimaciones ni con aproximaciones de conveniencia: si un dato no está confirmado, no está publicado.
        </p>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 3: Tableros dinámicos y cifras destacadas
// ─────────────────────────────────────────────────────────────────────────────

const KPI_DATA = [
  {
    id: "kpi-1",
    value: "2,85",
    unit: "% del PIB",
    tag: "Meta 2024: 3,00 %",
    tagColor: "neutral", // grey/neutral
    title: "Inversión en Actividades de Ciencia, Tecnología e Innovación (ACTI)",
    context: "Histórico consolidado del esfuerzo público y privado.",
  },
  {
    id: "kpi-2",
    value: "1,25",
    unit: "% del PIB",
    tag: "▲ +0,12 p.p.",
    tagColor: "positive", // green/lime
    title: "Inversión en investigación y desarrollo (I+D)",
    context: "Capital destinado a investigación aplicada y experimental.",
  },
  {
    id: "kpi-3",
    value: "24,5",
    unit: "% de las org.",
    tag: "Meta 2024: 30 %",
    tagColor: "neutral",
    title: "Porcentaje de organizaciones que innovan",
    context: "Empresas locales introduciendo nuevos productos o procesos.",
  },
  {
    id: "kpi-4",
    value: "12.450",
    unit: "empleos",
    tag: "▲ +4,5 %",
    tagColor: "positive",
    title: "Empleos generados por empresas innovadoras",
    context: "Puestos de trabajo formales de base tecnológica.",
  },
  {
    id: "kpi-5",
    value: "USD $450",
    unit: "millones",
    tag: "▼ -2,1 %",
    tagColor: "negative", // red/orange
    title: "Inversión captada por startups",
    context: "Levantamiento de capital emprendedor en Medellín.",
  },
  {
    id: "kpi-6",
    isEmpty: true,
    title: "Patentes otorgadas a residentes",
    context: "Indicador de propiedad intelectual del ecosistema.",
  }
];

const CHART_10_YEARS = [
  { year: "2015", acti: 1.10, id: 0.65, meta: 1.50 },
  { year: "2016", acti: 1.15, id: 0.70, meta: 1.70 },
  { year: "2017", acti: 1.34, id: 0.75, meta: 1.90 },
  { year: "2018", acti: 1.68, id: 0.85, meta: 2.10 },
  { year: "2019", acti: 2.05, id: 1.05, meta: 2.30 },
  { year: "2020", acti: 1.95, id: 1.00, meta: 2.50 },
  { year: "2021", acti: 2.24, id: 1.10, meta: 2.70 },
  { year: "2022", acti: 2.45, id: 1.18, meta: 2.80 },
  { year: "2023", acti: 2.68, id: 1.20, meta: 2.90 },
  { year: "2024", acti: 2.85, id: 1.25, meta: 3.00 },
];

const CHART_PEERS = [
  { name: "Bogotá", score: 68 },
  { name: "Medellín", score: 62 },
  { name: "Santiago", score: 58 },
  { name: "Cali", score: 45 },
];

function RadarCTIDashboards() {
    const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const kpiGridRef = useRef<HTMLDivElement>(null);
  const chartsGridRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;
    
    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: headerRef.current, start: "top 85%" } }
      );

      // KPIs Stagger
      if (kpiGridRef.current?.children) {
        gsap.fromTo(kpiGridRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: kpiGridRef.current, start: "top 80%" } }
        );
      }

      // Charts
      if (chartsGridRef.current?.children) {
        gsap.fromTo(chartsGridRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: chartsGridRef.current, start: "top 75%" } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="medicion-tableros"
      className="relative py-24 lg:py-32 bg-white"
      aria-labelledby="dashboards-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        
        {/* ── HEADER ── */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2
              id="dashboards-title"
              className="text-[#253D36] mb-5"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              El ecosistema hoy
            </h2>
            <p
              className="text-lg"
              style={{
                color: "rgba(37,61,54,0.75)",
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                lineHeight: 1.6,
              }}
            >
              Un vistazo rápido a las cifras que mejor explican el momento de Medellín. Cada una enlaza al tablero completo, con su serie histórica y su metodología.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center">
            {/* Year Selector */}
            <div className="relative inline-flex flex-col">
              <label htmlFor="year-select" className="sr-only">Seleccionar año</label>
              <select
                id="year-select"
                className="appearance-none bg-[#F2F4F0] text-[#253D36] font-bold text-sm px-5 py-3 pr-10 rounded-[4px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] transition-colors hover:bg-[#E8EDE6]"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                defaultValue="2024"
              >
                <option value="2024">Año de análisis: 2024</option>
                <option value="2023">Año de análisis: 2023</option>
                <option value="2022">Año de análisis: 2022</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#253D36] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ── KPI GRID (Top Row) ── */}
        <div ref={kpiGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {KPI_DATA.map((kpi) => (
            <div 
              key={kpi.id} 
              className="flex flex-col p-6 rounded-md bg-white transition-shadow duration-300 hover:shadow-lg relative group"
              style={{ border: "1px solid rgba(37,61,54,0.12)" }}
            >
              {kpi.isEmpty ? (
                // Empty State
                <div className="flex-1 flex flex-col justify-center items-start min-h-[140px]">
                  <h3 className="text-[15px] font-bold text-[#253D36] mb-3" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", lineHeight: 1.3 }}>
                    {kpi.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#0068FF] mb-2" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                    Sin dato consolidado para este año. Consulta la serie histórica.
                  </p>
                  <p className="text-xs text-[#253D36]/60" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                    {kpi.context}
                  </p>
                  <a href={`/radar-cti/indicador/${kpi.id}`} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-md">
                    <span className="sr-only">Ver la serie completa de {kpi.title}</span>
                  </a>
                </div>
              ) : (
                // Data State
                <div className="flex flex-col flex-1">
                  <div className="flex items-end flex-wrap gap-x-2 gap-y-2 mb-4">
                    <span 
                      className="text-4xl font-black text-[#253D36] leading-none tracking-tight"
                      style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                    >
                      {kpi.value}
                    </span>
                    <span 
                      className="text-lg font-bold text-[#253D36]/70 leading-none pb-0.5"
                      style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                    >
                      {kpi.unit}
                    </span>
                  </div>
                  
                  <div className="mb-5">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[11px] font-bold tracking-wide uppercase"
                      style={{ 
                        fontFamily: "'Source Sans 3',Arial,sans-serif",
                        backgroundColor: kpi.tagColor === 'positive' ? "rgba(192,212,0,0.2)" : kpi.tagColor === 'negative' ? "rgba(255,76,23,0.1)" : "rgba(37,61,54,0.06)",
                        color: kpi.tagColor === 'negative' ? "#FF4C17" : "#253D36"
                      }}
                    >
                      {kpi.tag}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#253D36] mb-1.5" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", lineHeight: 1.3 }}>
                    {kpi.title}
                  </h3>
                  
                  <p className="text-sm text-[#253D36]/60 mb-6 flex-1" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.4 }}>
                    {kpi.context}
                  </p>

                  <div 
                    className="flex items-center gap-1.5 text-sm font-bold text-[#0068FF] mt-auto relative z-20"
                    style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                  >
                    Ver la serie completa
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </div>

                  {/* Hit area link */}
                  <a href={`/radar-cti/indicador/${kpi.id}`} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-md">
                    <span className="sr-only">Ver la serie completa de {kpi.title}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── CHARTS GRID (Bottom Row) ── */}
        <div ref={chartsGridRef} className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
          
          {/* Chart Block 1: 10 Years */}
          <div className="flex flex-col bg-white rounded-md overflow-hidden" style={{ border: "1px solid rgba(37,61,54,0.12)" }}>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <h3 className="text-xl font-bold text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}>
                  Diez años de inversión en CTI
                </h3>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" /> Descargar los datos (CSV)
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" /> Descargar la imagen
                  </button>
                </div>
              </div>
              
              {/* Recharts Container */}
              <div className="w-full h-[300px] mb-6 relative">
                
<div className="w-full h-full relative flex items-end justify-between px-4 pb-8" style={{ borderBottom: "1px dashed rgba(37,61,54,0.1)" }}>
  {[20, 30, 40, 50, 70, 60, 80, 90, 85, 100].map((h, i) => (
    <div key={i} className="flex flex-col justify-end items-center gap-1 w-8 h-full relative">
      <div className="w-4 bg-[#00B8A3] rounded-t-sm" style={{ height: `${h * 0.4}%` }} />
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[rgba(192,212,0,0.2)] to-transparent" style={{ height: `${h}%` }} />
      <div className="absolute top-4 w-full h-[2px] bg-[#FF4C17]" />
      <span className="absolute -bottom-6 text-[10px] text-gray-400">201{5+i}</span>
    </div>
  ))}
</div>

              </div>

              <div className="mt-auto pt-5" style={{ borderTop: "1px solid rgba(37,61,54,0.08)" }}>
                <p className="text-[11px] text-[#253D36]/50" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Fuente: Observatorio de Ciencia, Tecnología e Innovación (OCTI), Informe Anual 2024. Corte: Diciembre de 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Chart Block 2: Peers */}
          <div className="flex flex-col bg-white rounded-md overflow-hidden" style={{ border: "1px solid rgba(37,61,54,0.12)" }}>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <h3 className="text-xl font-bold text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}>
                  Medellín frente a sus pares
                </h3>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" /> Descargar los datos (CSV)
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" /> Descargar la imagen
                  </button>
                </div>
              </div>
              
              {/* Recharts Container */}
              <div className="w-full h-[300px] mb-6 relative">
                
<div className="w-full h-full flex flex-col justify-center gap-4">
  {CHART_PEERS.map((p, i) => (
    <div key={i} className="flex items-center gap-4">
      <span className="w-16 text-xs font-bold text-[#253D36] text-right">{p.name}</span>
      <div className="flex-1 bg-gray-100 h-6 rounded-r-md overflow-hidden flex items-center">
        <div className="h-full bg-[#0068FF]" style={{ width: `${p.score}%` }} />
        <span className="text-xs font-bold text-[#253D36] ml-2">{p.score}</span>
      </div>
    </div>
  ))}
</div>

              </div>

              <div className="mt-auto pt-5" style={{ borderTop: "1px solid rgba(37,61,54,0.08)" }}>
                <p className="text-[11px] text-[#253D36]/50" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Fuente: Global Innovation Index (WIPO), Informe de Ciudades 2024. Corte: Octubre de 2024.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── GLOBAL CTA ── */}
        <div className="flex justify-center mt-6">
          <a
            href="/radar-cti/tableros"
            className="group inline-flex items-center gap-2.5 font-bold text-sm text-white bg-[#253D36] rounded-[4px] transition-colors duration-200 hover:bg-[#1C2E29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 px-8"
            style={{ minHeight: 52, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
          >
            Ver todos los tableros
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 4: Los tres módulos del portal
// ─────────────────────────────────────────────────────────────────────────────

const MODULES_DATA = [
  {
    id: "pulso",
    title: "Pulso CTI de Medellín",
    descriptor: "Nuestra propia medición",
    paragraph: "La radiografía del ecosistema, construida con datos primarios recogidos entre las empresas, universidades, emprendimientos e instituciones que hacen ciencia, tecnología e innovación en Medellín. Lo que los índices internacionales no alcanzan a ver, aquí lo preguntamos directamente.",
    indicator: "[N] organizaciones participantes en la última medición",
    linkText: "Entrar al Pulso",
    href: "/radar-cti/pulso",
    icon: Activity,
    color: "#C0D400"
  },
  {
    id: "rankings",
    title: "Rankings",
    descriptor: "Medellín en el mapa global",
    paragraph: "Posición, evolución y lectura crítica de los índices internacionales que evalúan innovación, emprendimiento y ciudades inteligentes. No publicamos solo el puesto: explicamos qué mide cada índice, qué explica el resultado y qué tan comparable es con el de otras ciudades.",
    indicator: "[N] índices monitoreados",
    linkText: "Ver los rankings",
    href: "/radar-cti/rankings",
    icon: Globe,
    color: "#0068FF"
  },
  {
    id: "data",
    title: "Data",
    descriptor: "Los datos, sin intermediarios",
    paragraph: "Tableros dinámicos e interactivos con las series históricas del ecosistema, filtrables por indicador y por año, y el repositorio completo de reportes oficiales disponibles para descarga. Para quien necesita el dato crudo y quiere sacar sus propias conclusiones.",
    indicator: "[N] tableros · [N] reportes descargables",
    linkText: "Explorar los datos",
    href: "/radar-cti/data",
    icon: Database,
    color: "#00B8A3"
  }
];

function RadarCTIModules() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;
    
    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: titleRef.current, start: "top 85%" } }
      );

      if (gridRef.current?.children) {
        gsap.fromTo(gridRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: gridRef.current, start: "top 80%" } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="medicion-modulos"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#FAFAF8]"
      style={{ borderTop: "1px solid rgba(37,61,54,0.06)" }}
      aria-labelledby="modules-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <h2
            id="modules-title"
            ref={titleRef}
            className="text-[#253D36]"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Tres formas de leer el ecosistema
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {MODULES_DATA.map((mod) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id}
                className="group flex flex-col bg-white rounded-md p-8 relative overflow-hidden transition-shadow duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#C0D400]"
                style={{ border: "1px solid rgba(37,61,54,0.12)" }}
              >
                {/* Decorative subtle top border */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: mod.color }} />
                
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(37,61,54,0.03)" }}
                >
                  <Icon className="w-6 h-6" style={{ color: mod.color }} aria-hidden="true" />
                </div>

                <h3 
                  className="text-[22px] font-bold text-[#253D36] mb-2 leading-tight"
                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", letterSpacing: "-0.01em" }}
                >
                  {mod.title}
                </h3>
                
                <p 
                  className="text-sm font-bold mb-4"
                  style={{ color: "#00B8A3", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                >
                  {mod.descriptor}
                </p>

                <p 
                  className="text-[15px] flex-1 mb-8"
                  style={{ color: "rgba(37,61,54,0.7)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}
                >
                  {mod.paragraph}
                </p>

                <div className="mt-auto flex flex-col gap-4" style={{ paddingTop: 24, borderTop: "1px solid rgba(37,61,54,0.08)" }}>
                  <p 
                    className="text-xs font-semibold"
                    style={{ color: "rgba(37,61,54,0.5)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                  >
                    {mod.indicator}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-sm font-bold transition-colors" style={{ color: mod.color, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}>
                    {mod.linkText}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>

                {/* Hit area */}
                <a href={mod.href} className="absolute inset-0 z-10 focus-visible:outline-none">
                  <span className="sr-only">{mod.linkText} - {mod.title}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 5: Franja destacada del Pulso CTI
// ─────────────────────────────────────────────────────────────────────────────

function RadarCTIPulseBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imgColRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;
    
    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      tl.fromTo(textColRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(imgColRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="medicion-pulso"
      className="relative w-full flex flex-col lg:flex-row"
      aria-labelledby="pulse-band-title"
    >
      {/* ── TEXT COLUMN ── */}
      <div 
        ref={textColRef}
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-20 lg:px-16 xl:px-24"
        style={{ backgroundColor: "#212121" }}
      >
        <p
          className="text-[10px] tracking-[0.32em] uppercase mb-6"
          style={{ color: "#FFFFFF", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", fontWeight: "bold" }}
        >
          PULSO CTI · MEDICIÓN PROPIA
        </p>

        <h2
          id="pulse-band-title"
          className="text-white mb-8"
          style={{
            fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          El Pulso CTI de Medellín: la ciudad medida por quienes la construyen
        </h2>

        <div 
          className="flex flex-col gap-5 mb-10"
          style={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.6,
          }}
        >
          <p>
            Los índices internacionales evalúan a Medellín desde afuera, con metodologías diseñadas para comparar cientos de ciudades a la vez. Son útiles, pero no alcanzan a capturar lo que ocurre dentro del ecosistema.
          </p>
          <p>
            El Pulso CTI (ciencia, tecnología e innovación) de Medellín es el instrumento propio del Centro de Pensamiento para levantar datos primarios: capacidades reales, inversión, talento, barreras y oportunidades, en la voz de las empresas, universidades, emprendimientos e instituciones que hacen innovación en la ciudad.
          </p>
          <p className="font-bold text-white">
            Cada respuesta se convierte en evidencia. Cada dato, en una decisión mejor tomada.
          </p>
        </div>

        {/* Microdatos */}
        <div 
          className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }}
        >
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] organizaciones participantes
          </span>
          <span className="text-white/40 hidden md:block" aria-hidden="true">•</span>
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] preguntas
          </span>
          <span className="text-white/40 hidden md:block" aria-hidden="true">•</span>
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] años de serie
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <a
            href="/radar-cti/pulso/resultados"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-white bg-[#0068FF] rounded-[4px] transition-colors duration-200 hover:bg-[#0055D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2 px-6"
            style={{ minHeight: 52, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
          >
            Ver los resultados del último Pulso
          </a>
          <a
            href="/radar-cti/pulso/metodologia"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-white bg-transparent rounded-[4px] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212121] px-6"
            style={{ minHeight: 52, border: "2px solid #FFFFFF", fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
          >
            Conocer la metodología
          </a>
        </div>
      </div>

      {/* ── IMAGE COLUMN ── */}
      <div 
        ref={imgColRef}
        className="w-full lg:w-1/2 min-h-[400px] lg:min-h-full relative overflow-hidden bg-[#253D36]"
        aria-label="Fotografía del ecosistema de innovación de Medellín"
        role="img"
      >
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
          alt="Personas colaborando en un laboratorio de tecnología"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          decoding="async"
        />
        {/* Subtle overlay to ensure the brand tone is maintained */}
        <div className="absolute inset-0 bg-[#253D36]/20 mix-blend-multiply" />
      </div>
    </section>
  );
}


const MEDICION_SECTIONS = [
  { id: "medicion-hero",        label: "Inicio" },
  { id: "medicion-descripcion", label: "Descripción" },
  { id: "medicion-tableros",    label: "Tableros" },
  { id: "medicion-modulos",     label: "Módulos" },
  { id: "medicion-pulso",       label: "Pulso CTI" },
];

function RadarCTIPage() {
  return (
    <>
      <FloatingNav sections={MEDICION_SECTIONS} />
      <RadarCTIHero />
      <Breadcrumb items={[
        { label: "Contenidos", href: "#contenidos" },
        { label: "Rankings" }
      ]} />
      <RadarCTIDescription />
      <RadarCTIDashboards />
      <RadarCTIModules />
      <RadarCTIPulseBand />
    </>
  );
}

function RedirectPulso() {
  useEffect(() => {
    window.location.replace("https://rutanmedellin.org/pulso-cti-rutan");
  }, []);
  return (
    <section className="relative py-32 px-6 text-center min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F4F0]">
      <div className="w-8 h-8 rounded-full border-2 border-[#C0D400] border-t-transparent animate-spin mb-4" />
      <p className="text-lg font-bold text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}>
        Redirigiendo al sitio externo del Pulso CTI...
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RANKINGS SUBPAGE
// ─────────────────────────────────────────────────────────────────────────────

function RankingsBanner() {
  return (
    <section id="rankings-hero" className="bg-[#253D36] text-white px-6 lg:px-10 xl:px-12 relative overflow-hidden flex flex-col justify-center" style={{ minHeight: "60svh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="max-w-[1440px] mx-auto relative z-10 w-full">
        <p className="text-[10px] tracking-[0.32em] uppercase mb-6" style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif", fontWeight: "bold" }}>
          RANKINGS
        </p>
        <h1 className="text-white mb-6 max-w-4xl" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Dónde está Medellín en el mapa global de la innovación
        </h1>
        <p className="text-lg md:text-xl max-w-3xl" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.55 }}>
          Posición, evolución y lectura crítica de los índices internacionales, regionales y locales que evalúan el ecosistema. Con el contexto necesario para entender qué significa cada puesto.
        </p>
      </div>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,184,163,0.15)_0%,transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/3" />
    </section>
  );
}

function RankingsKPIs() {
  const kpis = [
    { title: "Global Startup Ecosystem Index", val: "Puesto 65", sub: "StartupBlink", var: "▲ +5 puestos vs 2023", pos: true },
    { title: "Densidad del ecosistema", val: "320 startups", sub: "Participación nacional", var: "28% del total país", pos: true },
    { title: "Inversión captada", val: "USD $150M", sub: "Venture Capital 2024", var: "▼ -2% interanual", pos: false },
    { title: "Empleo especializado", val: "12,5%", sub: "Actividades profesionales y científicas", var: "▲ +1,2 p.p.", pos: true },
  ];

  return (
    <section id="rankings-kpis" className="relative py-8 bg-[#F2F4F0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-md shadow-sm border border-[rgba(37,61,54,0.06)] flex flex-col">
              <h3 className="text-sm font-bold text-[#253D36] mb-1" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>{kpi.title}</h3>
              <p className="text-xs text-[#253D36]/50 mb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>{kpi.sub}</p>
              <div className="mt-auto">
                <span className="text-3xl font-black text-[#253D36] tracking-tight block mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>{kpi.val}</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] ${kpi.pos ? "bg-[rgba(192,212,0,0.2)] text-[#253D36]" : "bg-[rgba(255,76,23,0.1)] text-[#FF4C17]"}`} style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  {kpi.var}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RankingsPanels() {
  return (
    <section id="rankings-indices" className="relative py-10 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* IBEI */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Entorno de negocios (IBEI)</h3>
            <p className="text-sm text-[#253D36]/60 mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Puesto global por país en América Latina</p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { name: "Chile", score: 82 },
                { name: "Uruguay", score: 78 },
                { name: "Colombia (Medellín)", score: 71, hl: true },
                { name: "Brasil", score: 65 },
                { name: "México", score: 62 },
                { name: "Puerto Rico", score: 59 },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className={`w-32 text-xs font-bold text-right ${c.hl ? "text-[#0068FF]" : "text-[#253D36]"}`} style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>{c.name}</span>
                  <div className="flex-1 bg-[#F2F4F0] h-6 rounded-r-[2px] flex items-center">
                    <div className="h-full" style={{ width: `${c.score}%`, backgroundColor: c.hl ? "#0068FF" : "#253D36" }} />
                    <span className="text-xs font-bold ml-2 text-[#253D36]">{c.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ICIM */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Dimensiones de ciudad (ICIM)</h3>
            <p className="text-sm text-[#253D36]/60 mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Desempeño de Medellín por categoría</p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { name: "Movilidad", score: 76 },
                { name: "Cohesión social", score: 42 },
                { name: "Economía", score: 68 },
                { name: "Gobernanza", score: 85 },
                { name: "Planeación", score: 70 },
                { name: "Capital humano", score: 60 },
                { name: "Tecnología", score: 88 },
              ].sort((a,b)=>b.score-a.score).map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-32 text-xs font-bold text-right text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>{c.name}</span>
                  <div className="flex-1 bg-[#F2F4F0] h-6 rounded-r-[2px] flex items-center">
                    <div className="h-full bg-[#00B8A3]" style={{ width: `${c.score}%` }} />
                    <span className="text-xs font-bold ml-2 text-[#253D36]">{c.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LASICI 2.0 */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Pilares LASICI 2.0</h3>
            <p className="text-sm text-[#253D36]/60 mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Desempeño subnacional de Antioquia (Puntaje 0-100)</p>
            <div className="bg-[#FAFAF8] border border-[rgba(37,61,54,0.08)] p-6 rounded-md flex-1 relative min-h-[240px]">
              <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Grid */}
                {[0, 50, 100, 150, 200].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(37,61,54,0.05)" />)}
                {/* Points: Capacidad(85), Rendimiento(70), Economia(60), Globalizacion(45) */}
                {/* Y mapping: 100 -> 0, 0 -> 200 */}
                <path d="M 0,30 L 133,60 L 266,80 L 400,110" fill="none" stroke="#C0D400" strokeWidth="4" />
                <circle cx="0" cy="30" r="5" fill="#253D36" />
                <circle cx="133" cy="60" r="5" fill="#253D36" />
                <circle cx="266" cy="80" r="5" fill="#253D36" />
                <circle cx="400" cy="110" r="5" fill="#253D36" />
              </svg>
              <div className="flex justify-between w-full mt-4 text-[10px] font-bold text-[#253D36] uppercase tracking-wider" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                <span>Capacidad</span>
                <span>Rendimiento</span>
                <span>Economía</span>
                <span>Globalización</span>
              </div>
            </div>
          </div>

          {/* IMD Smart City */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Matriz IMD Smart City</h3>
            <p className="text-sm text-[#253D36]/60 mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Principales ciudades de Colombia</p>
            <div className="overflow-x-auto flex-1 border border-[rgba(37,61,54,0.08)] rounded-md">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#F2F4F0] text-[11px] uppercase tracking-wider text-[#253D36]/60" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                    <th className="p-4 font-bold">Ciudad</th>
                    <th className="p-4 font-bold">Puesto</th>
                    <th className="p-4 font-bold">Calificación</th>
                    <th className="p-4 font-bold">Tendencia</th>
                    <th className="p-4 font-bold">Nota Distintiva</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  <tr className="border-t border-[rgba(37,61,54,0.08)] bg-white">
                    <td className="p-4 font-bold text-[#0068FF]">Medellín</td>
                    <td className="p-4 font-black">72</td>
                    <td className="p-4">BBB</td>
                    <td className="p-4"><TrendingUp className="w-4 h-4 text-[#C0D400]" /></td>
                    <td className="p-4 text-xs">Líder en movilidad integrada</td>
                  </tr>
                  <tr className="border-t border-[rgba(37,61,54,0.08)] bg-[#FAFAF8]">
                    <td className="p-4 font-bold">Bogotá</td>
                    <td className="p-4 font-black">98</td>
                    <td className="p-4">BB</td>
                    <td className="p-4"><TrendingUp className="w-4 h-4 text-[#C0D400]" /></td>
                    <td className="p-4 text-xs">Hub corporativo nacional</td>
                  </tr>
                  <tr className="border-t border-[rgba(37,61,54,0.08)] bg-white">
                    <td className="p-4 font-bold">Cali</td>
                    <td className="p-4 font-black">112</td>
                    <td className="p-4">B</td>
                    <td className="p-4"><TrendingDown className="w-4 h-4 text-[#FF4C17]" /></td>
                    <td className="p-4 text-xs">Crecimiento en bioeconomía</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Index Explanation Accordion */}
        <div className="mt-10 bg-[#FAFAF8] border border-[rgba(37,61,54,0.08)] rounded-md p-6">
          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between font-bold text-[#253D36] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm list-none" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>
              <span className="flex items-center gap-2"><Info className="w-4 h-4" /> Qué mide este índice ↓</span>
            </summary>
            <p className="mt-4 text-sm text-[#253D36]/70 leading-relaxed" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
              Los índices agrupados evalúan pilares estructurales: adopción tecnológica, calidad de vida urbana, apertura a los negocios, capital humano disponible y cohesión social. <a href="#metodologia" className="text-[#0068FF] font-bold hover:underline">Ver la metodología oficial completa.</a>
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

function RankingsStrengthsGaps() {
  return (
    <section id="rankings-fortalezas" className="relative py-10 bg-[#F2F4F0]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fortalezas */}
        <div className="bg-[#EBF2EA] p-8 lg:p-12 rounded-md" style={{ borderTop: "4px solid #00B8A3" }}>
          <h3 className="text-2xl font-bold text-[#253D36] mb-4" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
            Fortalezas del ecosistema
          </h3>
          <p className="text-base text-[#253D36]/80 leading-relaxed" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            Lo que los índices reconocen de forma consistente: gobernanza institucional eficiente, articulación Universidad-Empresa-Estado dinamizada por Ruta N, inversión en infraestructura digital y entornos regulatorios de prueba, y servicios ciudadanos digitales.
          </p>
        </div>

        {/* Brechas */}
        <div className="bg-[#FFF4E5] p-8 lg:p-12 rounded-md" style={{ borderTop: "4px solid #FFCA00" }}>
          <h3 className="text-2xl font-bold text-[#253D36] mb-4" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
            Brechas críticas
          </h3>
          <p className="text-base text-[#253D36]/80 leading-relaxed" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            Lo que aparece de forma recurrente como factor de riesgo: rezago en cohesión social, baja cobertura de globalización, restricciones para escalar capital e indicadores urbanos de alta complejidad.
          </p>
        </div>
      </div>
    </section>
  );
}

function RankingsEvolution() {
  return (
    <section id="rankings-evolucion" className="relative py-10 lg:py-14 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="max-w-3xl mb-6">
          <h2 className="text-4xl md:text-5xl font-black text-[#253D36] mb-4" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.02em" }}>
            Evolución en el tiempo
          </h2>
          <p className="text-xl text-[#0068FF] font-bold" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            Un puesto aislado dice poco. Una trayectoria lo dice todo.
          </p>
        </div>

        <div className="bg-[#FAFAF8] border border-[rgba(37,61,54,0.08)] rounded-md p-8 lg:p-12 relative overflow-hidden">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Índice de Innovación Global (GII) - Trayectoria Medellín</h3>
          </div>
          
          <div className="w-full h-[220px] relative mt-6 mb-4">
            <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path d="M 0,150 Q 200,160 400,100 T 800,40" fill="none" stroke="#C0D400" strokeWidth="4" />
              <path d="M 0,150 Q 200,160 400,100 T 800,40 L 800,200 L 0,200 Z" fill="rgba(192,212,0,0.1)" />
              <circle cx="0" cy="150" r="6" fill="#253D36" />
              <circle cx="400" cy="100" r="6" fill="#253D36" />
              <circle cx="800" cy="40" r="6" fill="#253D36" />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end pb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
              <div className="text-center translate-y-12">
                <span className="block text-xl font-black text-[#253D36]">#89</span>
                <span className="text-xs text-[#253D36]/60">2018</span>
              </div>
              <div className="text-center translate-y-12">
                <span className="block text-xl font-black text-[#253D36]">#74</span>
                <span className="text-xs text-[#253D36]/60">2021</span>
              </div>
              <div className="text-center translate-y-12">
                <span className="block text-xl font-black text-[#253D36]">#65</span>
                <span className="text-xs text-[#253D36]/60">2024</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-16 pt-6 border-t border-[rgba(37,61,54,0.1)]">
            <div className="w-5 h-5 rounded-full bg-[rgba(255,76,23,0.1)] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-[#FF4C17]">!</span>
            </div>
            <p className="text-xs text-[#253D36]/60 leading-relaxed" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
              <strong className="text-[#253D36]">Advertencia metodológica:</strong> Los índices cambian de metodología entre ediciones. Cuando eso ocurre, lo señalamos junto al dato. La serie de 2021 sufrió un ajuste en las métricas de capital humano que impide una comparación 1:1 absoluta con la edición anterior.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const RANKINGS_SECTIONS = [
  { id: "rankings-hero",       label: "Inicio" },
  { id: "rankings-kpis",       label: "Indicadores" },
  { id: "rankings-indices",    label: "Índices" },
  { id: "rankings-fortalezas", label: "Fortalezas" },
  { id: "rankings-evolucion",  label: "Evolución" },
  { id: "radar-reportes",      label: "Documentos" },
];

function RankingsPage() {
  return (
    <>
      <FloatingNav sections={RANKINGS_SECTIONS} />
      <RankingsBanner />
      <Breadcrumb items={[
        { label: "Contenidos", href: "#contenidos" },
        { label: "Rankings" }
      ]} />
      <RankingsKPIs />
      <RankingsPanels />
      <RankingsStrengthsGaps />
      <RankingsEvolution />
      <DataReportsSection
        title="Los documentos oficiales de rankings y mediciones del ecosistema."
        subtitle="Organizados por fuente y año, disponibles para descarga directa."
      />
    </>
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <AnalisisCTIPage /> },
      { path: "radar-cti/data", element: <AnalisisCTIPage /> },
      { path: "radar-cti/rankings", element: <RankingsPage /> },
      { path: "lab-de-politicas/documentacion", element: <DocumentacionPage /> },
      { path: "lab-de-politicas/compras", element: <ComprasPage /> },
      { path: "lab-de-politicas/*", element: <LabPoliticasPage /> },
      { path: "radar-cti/pulso", element: <RedirectPulso /> },
      { path: "radar-cti/*", element: <RadarCTIPage /> },
      { path: "analisis-cti/*", element: <AnalisisCTIPage /> },
      { path: "blog/*", element: <BlogPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
