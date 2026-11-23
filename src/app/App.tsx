import { useState, useEffect, useRef, useMemo } from "react"
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useLocation,
} from "react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ChevronDown,
  ArrowRight,
  Download,
  Image as ImageIcon,
  Activity,
  Globe,
  Database,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

import { AnalisisCTIPage } from "./pages/AnalisisPage"
import { LabPoliticasPage } from "./pages/LabPoliticasPage"
import { DocumentacionPage } from "./pages/DocumentacionPage"
import { ComprasPage } from "./pages/ComprasPage"
import { BlogPage } from "./pages/BlogPage"
import { DataReportsSection } from "./pages/DataPage"
import { Breadcrumb } from "./components/Breadcrumb"
import { FloatingNav } from "./components/FloatingNav"
import { RankingsDataPanels } from "./components/RankingsDataPanels"
import { ExpandablePanel } from "./components/ExpandablePanel"
import { CorporateInnovationHighlight } from "./components/CorporateInnovationHighlight"
import pulsoCtiLogoWhite from "../assets/pulso-cti-logo-white.png"
import pwsoLogoWhite from "../assets/pwso-logo-white.webp"

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

const MAIN_TABS = [
  { label: "Informes y Tendencias", href: "/radar-cti/data" },
  { label: "Rankings", href: "/radar-cti/rankings" },
  { label: "Lab de políticas", href: "/lab-de-politicas" },
]

function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = MAIN_TABS.find(
    (t) =>
      location.pathname === t.href ||
      location.pathname.startsWith(t.href + "/"),
  )

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
            const isActive = activeTab?.href === tab.href
            return (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(tab.href)
                  window.scrollTo(0, 0)
                }}
                className="relative flex items-center px-5 h-full text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-inset rounded-sm"
                style={{
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
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
            )
          })}
        </div>
      </header>

      <main style={{ paddingTop: 56 }}>
        <Outlet />
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 1: Hero
// ─────────────────────────────────────────────────────────────────────────────

const RADAR_HISTORICAL_DATA = [
  { year: "2016", value: 1.15 },
  { year: "2017", value: 1.34 },
  { year: "2018", value: 1.68 },
  { year: "2019", value: 2.05 },
  { year: "2020", value: 1.95 },
  { year: "2021", value: 2.24 },
  { year: "2022", value: 2.45 },
  { year: "2023", value: 2.68 },
  { year: "2024", value: 2.85 },
]

const useClientOnly = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

function RadarCTIHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      })

      tl.fromTo(
        contentRef.current?.children
          ? Array.from(contentRef.current.children)
          : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1 },
      ).fromTo(
        chartRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 1 },
        "-=0.6",
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
              style={{
                color: "#C0D400",
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
              }}
            >
              MEDICIÓN · RADAR CTI
            </p>

            <h1
              id="radar-hero-title"
              className="mb-5"
              style={{
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
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
                style={{
                  color: "#00B8A3",
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                }}
              >
                Datos actualizados a [mes de año] · [N] fuentes verificadas
              </p>
            </div>

            <p
              className="text-lg mb-10"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                lineHeight: 1.6,
              }}
            >
              Este es el espacio del Centro de Pensamiento de Ruta N donde
              centralizamos los rankings, los indicadores y los tableros que
              muestran dónde está el ecosistema de ciencia, tecnología e
              innovación de Medellín, hacia dónde se mueve y qué decisiones
              habilita esa información.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <a
                href="#tableros"
                className="inline-flex items-center justify-center font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{
                  minHeight: 48,
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                }}
              >
                Explorar los tableros
              </a>
              <a
                href="/radar-cti/pulso"
                className="inline-flex items-center justify-center font-semibold text-sm text-white rounded-[4px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{
                  minHeight: 48,
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
                }}
              >
                Conocer el Pulso CTI
              </a>
            </div>

            {/* Microcopy de confianza */}
            <p
              className="text-xs"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
              }}
            >
              Toda la información es pública, trazable y citada en su fuente
              original.
            </p>
          </div>

          {/* ── RIGHT COLUMN: Animated Real Data Chart ── */}
          <div
            ref={chartRef}
            className="w-full h-[320px] lg:h-[400px] bg-[#1C2E29] rounded-lg p-6 flex flex-col"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="mb-4">
              <h3
                className="text-sm font-bold text-white mb-1"
                style={{
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                }}
              >
                Serie Histórica: Evolución CTI
              </h3>
              <p
                className="text-xs text-white/50"
                style={{
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                }}
              >
                Inversión como % del PIB local
              </p>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
              <div
                className="w-full h-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(192,212,0,0.1) 0%, transparent 100%)",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,80 Q25,70 50,40 T100,20 L100,100 L0,100 Z"
                    fill="#C0D400"
                    opacity="0.3"
                  />
                  <path
                    d="M0,80 Q25,70 50,40 T100,20"
                    fill="none"
                    stroke="#C0D400"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 2: Descriptive Paragraph
// ─────────────────────────────────────────────────────────────────────────────

function RadarCTIDescription() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (reduced.current || !sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current!.children, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="medicion-descripcion"
      className="relative py-24 lg:py-32 bg-[#FAFAF8]"
      aria-labelledby="radar-desc-title"
    >
      <div ref={contentRef} className="max-w-[960px] mx-auto px-6">
        <h2 id="radar-desc-title" className="sr-only">
          Descripción de la página
        </h2>

        {/* Intro title — full width, centered */}
        <p
          className="text-[#253D36] mb-12 text-center"
          style={{
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          En esta página encontrarás tres formas complementarias de leer el
          ecosistema CTI de Medellín.
        </p>

        {/* 3 paragraphs in 3 columns — one per paragraph */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-6 mb-10"
          style={{
            color: "rgba(37,61,54,0.75)",
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.65,
          }}
        >
          <p>
            La primera es el{" "}
            <a
              href="#medicion-modulos"
              className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
            >
              Pulso CTI de Medellín
            </a>
            , nuestra medición propia, construida con datos primarios levantados
            entre quienes hacen innovación en la ciudad.
          </p>
          <p>
            La segunda son los{" "}
            <a
              href="#medicion-modulos"
              className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
            >
              Rankings globales, regionales y locales
            </a>{" "}
            que ubican a Medellín en el mapa de la competitividad y que aquí no
            solo se listan: se explican, se comparan con ciudades pares y se
            leen críticamente.
          </p>
          <p>
            La tercera es{" "}
            <a
              href="#medicion-modulos"
              className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
            >
              Data
            </a>
            , un conjunto de tableros dinámicos con las series históricas y los
            indicadores del ecosistema, filtrables por año y por variable, junto
            con el repositorio de reportes oficiales disponibles para descarga.
          </p>
        </div>

        {/* Footer note — full width */}
        <p
          className="pt-10 border-t text-center"
          style={{
            borderColor: "rgba(37,61,54,0.12)",
            color: "rgba(37,61,54,0.75)",
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.65,
          }}
        >
          Cada cifra que verás aquí indica su fuente y su fecha de corte. No
          trabajamos con estimaciones ni con aproximaciones de conveniencia: si
          un dato no está confirmado, no está publicado.
        </p>
      </div>
    </section>
  )
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
    title:
      "Inversión en Actividades de Ciencia, Tecnología e Innovación (ACTI)",
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
  },
]

const CHART_10_YEARS = [
  { year: "2015", acti: 1.1, id: 0.65, meta: 1.5 },
  { year: "2016", acti: 1.15, id: 0.7, meta: 1.7 },
  { year: "2017", acti: 1.34, id: 0.75, meta: 1.9 },
  { year: "2018", acti: 1.68, id: 0.85, meta: 2.1 },
  { year: "2019", acti: 2.05, id: 1.05, meta: 2.3 },
  { year: "2020", acti: 1.95, id: 1.0, meta: 2.5 },
  { year: "2021", acti: 2.24, id: 1.1, meta: 2.7 },
  { year: "2022", acti: 2.45, id: 1.18, meta: 2.8 },
  { year: "2023", acti: 2.68, id: 1.2, meta: 2.9 },
  { year: "2024", acti: 2.85, id: 1.25, meta: 3.0 },
]

const CHART_PEERS = [
  { name: "Bogotá", score: 68 },
  { name: "Medellín", score: 62 },
  { name: "Santiago", score: 58 },
  { name: "Cali", score: 45 },
]

function RadarCTIDashboards() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const kpiGridRef = useRef<HTMLDivElement>(null)
  const chartsGridRef = useRef<HTMLDivElement>(null)

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return

    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
      })

      // KPIs Stagger
      if (kpiGridRef.current?.children) {
        gsap.fromTo(kpiGridRef.current.children, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: kpiGridRef.current, start: "top 80%" },
        })
      }

      // Charts
      if (chartsGridRef.current?.children) {
        gsap.fromTo(chartsGridRef.current.children, { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: chartsGridRef.current, start: "top 75%" },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="medicion-tableros"
      className="relative py-24 lg:py-32 bg-white"
      aria-labelledby="dashboards-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div className="max-w-2xl">
            <h2
              id="dashboards-title"
              className="text-[#253D36] mb-5"
              style={{
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
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
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                lineHeight: 1.6,
              }}
            >
              Un vistazo rápido a las cifras que mejor explican el momento de
              Medellín. Cada una enlaza al tablero completo, con su serie
              histórica y su metodología.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            {/* Year Selector */}
            <div className="relative inline-flex flex-col">
              <label htmlFor="year-select" className="sr-only">
                Seleccionar año
              </label>
              <select
                id="year-select"
                className="appearance-none bg-[#F2F4F0] text-[#253D36] font-bold text-sm px-5 py-3 pr-10 rounded-[4px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] transition-colors hover:bg-[#E8EDE6]"
                style={{
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                }}
                defaultValue="2024"
              >
                <option value="2024">Año de análisis: 2024</option>
                <option value="2023">Año de análisis: 2023</option>
                <option value="2022">Año de análisis: 2022</option>
              </select>
              <ChevronDown
                className="w-4 h-4 text-[#253D36] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* ── KPI GRID (Top Row) ── */}
        <div
          ref={kpiGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {KPI_DATA.map((kpi) => (
            <div
              key={kpi.id}
              className="flex flex-col p-6 rounded-md bg-white transition-shadow duration-300 hover:shadow-lg relative group"
              style={{ border: "1px solid rgba(37,61,54,0.12)" }}
            >
              {kpi.isEmpty ? (
                // Empty State
                <div className="flex-1 flex flex-col justify-center items-start min-h-[140px]">
                  <h3
                    className="text-[15px] font-bold text-[#253D36] mb-3"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {kpi.title}
                  </h3>
                  <p
                    className="text-sm font-semibold text-[#0068FF] mb-2"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    Sin dato consolidado para este año. Consulta la serie
                    histórica.
                  </p>
                  <p
                    className="text-xs text-[#253D36]/60"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    {kpi.context}
                  </p>
                  <a
                    href={`/radar-cti/indicador/${kpi.id}`}
                    className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-md"
                  >
                    <span className="sr-only">
                      Ver la serie completa de {kpi.title}
                    </span>
                  </a>
                </div>
              ) : (
                // Data State
                <div className="flex flex-col flex-1">
                  <div className="flex items-end flex-wrap gap-x-2 gap-y-2 mb-4">
                    <span
                      className="text-4xl font-black text-[#253D36] leading-none tracking-tight"
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {kpi.value}
                    </span>
                    <span
                      className="text-lg font-bold text-[#253D36]/70 leading-none pb-0.5"
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {kpi.unit}
                    </span>
                  </div>

                  <div className="mb-5">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[11px] font-bold tracking-wide uppercase"
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                        backgroundColor:
                          kpi.tagColor === "positive"
                            ? "rgba(192,212,0,0.2)"
                            : kpi.tagColor === "negative"
                              ? "rgba(255,76,23,0.1)"
                              : "rgba(37,61,54,0.06)",
                        color:
                          kpi.tagColor === "negative" ? "#FF4C17" : "#253D36",
                      }}
                    >
                      {kpi.tag}
                    </span>
                  </div>

                  <h3
                    className="text-[15px] font-bold text-[#253D36] mb-1.5"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {kpi.title}
                  </h3>

                  <p
                    className="text-sm text-[#253D36]/60 mb-6 flex-1"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {kpi.context}
                  </p>

                  <div
                    className="flex items-center gap-1.5 text-sm font-bold text-[#0068FF] mt-auto relative z-20"
                    style={{
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    Ver la serie completa
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Hit area link */}
                  <a
                    href={`/radar-cti/indicador/${kpi.id}`}
                    className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-md"
                  >
                    <span className="sr-only">
                      Ver la serie completa de {kpi.title}
                    </span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── CHARTS GRID (Bottom Row) ── */}
        <div
          ref={chartsGridRef}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12"
        >
          {/* Chart Block 1: 10 Years */}
          <div
            className="flex flex-col bg-white rounded-md overflow-hidden"
            style={{ border: "1px solid rgba(37,61,54,0.12)" }}
          >
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <h3
                  className="text-xl font-bold text-[#253D36]"
                  style={{
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                  }}
                >
                  Diez años de inversión en CTI
                </h3>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    Descargar los datos (CSV)
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    Descargar la imagen
                  </button>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="w-full h-[300px] mb-6 relative">
                <div
                  className="w-full h-full relative flex items-end justify-between px-4 pb-8"
                  style={{ borderBottom: "1px dashed rgba(37,61,54,0.1)" }}
                >
                  {[20, 30, 40, 50, 70, 60, 80, 90, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-end items-center gap-1 w-8 h-full relative"
                    >
                      <div
                        className="w-4 bg-[#00B8A3] rounded-t-sm"
                        style={{ height: `${h * 0.4}%` }}
                      />
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[rgba(192,212,0,0.2)] to-transparent"
                        style={{ height: `${h}%` }}
                      />
                      <div className="absolute top-4 w-full h-[2px] bg-[#FF4C17]" />
                      <span className="absolute -bottom-6 text-[10px] text-gray-400">
                        201{5 + i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-auto pt-5"
                style={{ borderTop: "1px solid rgba(37,61,54,0.08)" }}
              >
                <p
                  className="text-[11px] text-[#253D36]/50"
                  style={{
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                  }}
                >
                  Fuente: Observatorio de Ciencia, Tecnología e Innovación
                  (OCTI), Informe Anual 2024. Corte: Diciembre de 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Chart Block 2: Peers */}
          <div
            className="flex flex-col bg-white rounded-md overflow-hidden"
            style={{ border: "1px solid rgba(37,61,54,0.12)" }}
          >
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <h3
                  className="text-xl font-bold text-[#253D36]"
                  style={{
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                  }}
                >
                  Medellín frente a sus pares
                </h3>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    Descargar los datos (CSV)
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#253D36]/60 hover:text-[#0068FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1">
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    Descargar la imagen
                  </button>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="w-full h-[300px] mb-6 relative">
                <div className="w-full h-full flex flex-col justify-center gap-4">
                  {CHART_PEERS.map((p, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-16 text-xs font-bold text-[#253D36] text-right">
                        {p.name}
                      </span>
                      <div className="flex-1 bg-gray-100 h-6 rounded-r-md overflow-hidden flex items-center">
                        <div
                          className="h-full bg-[#0068FF]"
                          style={{ width: `${p.score}%` }}
                        />
                        <span className="text-xs font-bold text-[#253D36] ml-2">
                          {p.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="mt-auto pt-5"
                style={{ borderTop: "1px solid rgba(37,61,54,0.08)" }}
              >
                <p
                  className="text-[11px] text-[#253D36]/50"
                  style={{
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                  }}
                >
                  Fuente: Global Innovation Index (WIPO), Informe de Ciudades
                  2024. Corte: Octubre de 2024.
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
            style={{
              minHeight: 52,
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            }}
          >
            Ver todos los tableros
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 4: Los tres módulos del portal
// ─────────────────────────────────────────────────────────────────────────────

const MODULES_DATA = [
  {
    id: "pulso",
    title: "Pulso CTI de Medellín",
    descriptor: "Nuestra propia medición",
    paragraph:
      "La radiografía del ecosistema, construida con datos primarios recogidos entre las empresas, universidades, emprendimientos e instituciones que hacen ciencia, tecnología e innovación en Medellín. Lo que los índices internacionales no alcanzan a ver, aquí lo preguntamos directamente.",
    indicator: "[N] organizaciones participantes en la última medición",
    linkText: "Entrar al Pulso",
    href: "/radar-cti/pulso",
    icon: Activity,
    color: "#C0D400",
  },
  {
    id: "rankings",
    title: "Rankings",
    descriptor: "Medellín en el mapa global",
    paragraph:
      "Posición, evolución y lectura crítica de los índices internacionales que evalúan innovación, emprendimiento y ciudades inteligentes. No publicamos solo el puesto: explicamos qué mide cada índice, qué explica el resultado y qué tan comparable es con el de otras ciudades.",
    indicator: "[N] índices monitoreados",
    linkText: "Ver los rankings",
    href: "/radar-cti/rankings",
    icon: Globe,
    color: "#0068FF",
  },
  {
    id: "data",
    title: "Data",
    descriptor: "Los datos, sin intermediarios",
    paragraph:
      "Tableros dinámicos e interactivos con las series históricas del ecosistema, filtrables por indicador y por año, y el repositorio completo de reportes oficiales disponibles para descarga. Para quien necesita el dato crudo y quiere sacar sus propias conclusiones.",
    indicator: "[N] tableros · [N] reportes descargables",
    linkText: "Explorar los datos",
    href: "/radar-cti/data",
    icon: Database,
    color: "#00B8A3",
  },
]

function RadarCTIModules() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return

    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
      })

      if (gridRef.current?.children) {
        gsap.fromTo(gridRef.current.children, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Tres formas de leer el ecosistema
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {MODULES_DATA.map((mod) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.id}
                className="group flex flex-col bg-white rounded-md p-8 relative overflow-hidden transition-shadow duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#C0D400]"
                style={{ border: "1px solid rgba(37,61,54,0.12)" }}
              >
                {/* Decorative subtle top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: mod.color }}
                />

                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(37,61,54,0.03)" }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: mod.color }}
                    aria-hidden="true"
                  />
                </div>

                <h3
                  className="text-[22px] font-bold text-[#253D36] mb-2 leading-tight"
                  style={{
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {mod.title}
                </h3>

                <p
                  className="text-sm font-bold mb-4"
                  style={{
                    color: "#00B8A3",
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                  }}
                >
                  {mod.descriptor}
                </p>

                <p
                  className="text-[15px] flex-1 mb-8"
                  style={{
                    color: "rgba(37,61,54,0.7)",
                    fontFamily:
                      "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                    lineHeight: 1.6,
                  }}
                >
                  {mod.paragraph}
                </p>

                <div
                  className="mt-auto flex flex-col gap-4"
                  style={{
                    paddingTop: 24,
                    borderTop: "1px solid rgba(37,61,54,0.08)",
                  }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color: "rgba(37,61,54,0.5)",
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    {mod.indicator}
                  </p>

                  <div
                    className="flex items-center gap-1.5 text-sm font-bold transition-colors"
                    style={{
                      color: mod.color,
                      fontFamily:
                        "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    {mod.linkText}
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Hit area */}
                <a
                  href={mod.href}
                  className="absolute inset-0 z-10 focus-visible:outline-none"
                >
                  <span className="sr-only">
                    {mod.linkText} - {mod.title}
                  </span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CTI — Section 5: Franja destacada del Pulso CTI
// ─────────────────────────────────────────────────────────────────────────────

function RadarCTIPulseBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const textColRef = useRef<HTMLDivElement>(null)
  const imgColRef = useRef<HTMLDivElement>(null)

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return

    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      })

      tl.fromTo(textColRef.current, { opacity: 0, x: -30 }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
      }).fromTo(
        imgColRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
          style={{
            color: "#FFFFFF",
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            fontWeight: "bold",
          }}
        >
          PULSO CTI · MEDICIÓN PROPIA
        </p>

        <h2
          id="pulse-band-title"
          className="text-white mb-8"
          style={{
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
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
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            fontSize: "1.125rem",
            lineHeight: 1.6,
          }}
        >
          <p>
            Los índices internacionales evalúan a Medellín desde afuera, con
            metodologías diseñadas para comparar cientos de ciudades a la vez.
            Son útiles, pero no alcanzan a capturar lo que ocurre dentro del
            ecosistema.
          </p>
          <p>
            El Pulso CTI (ciencia, tecnología e innovación) de Medellín es el
            instrumento propio del Centro de Pensamiento para levantar datos
            primarios: capacidades reales, inversión, talento, barreras y
            oportunidades, en la voz de las empresas, universidades,
            emprendimientos e instituciones que hacen innovación en la ciudad.
          </p>
          <p className="font-bold text-white">
            Cada respuesta se convierte en evidencia. Cada dato, en una decisión
            mejor tomada.
          </p>
        </div>

        {/* Microdatos */}
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 py-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span
            className="text-sm font-bold text-white"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            }}
          >
            [N] organizaciones participantes
          </span>
          <span className="text-white/40 hidden md:block" aria-hidden="true">
            •
          </span>
          <span
            className="text-sm font-bold text-white"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            }}
          >
            [N] preguntas
          </span>
          <span className="text-white/40 hidden md:block" aria-hidden="true">
            •
          </span>
          <span
            className="text-sm font-bold text-white"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            }}
          >
            [N] años de serie
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <a
            href="/radar-cti/pulso/resultados"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-white bg-[#0068FF] rounded-[4px] transition-colors duration-200 hover:bg-[#0055D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] focus-visible:ring-offset-2 px-6"
            style={{
              minHeight: 52,
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            }}
          >
            Ver los resultados del último Pulso
          </a>
          <a
            href="/radar-cti/pulso/metodologia"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-white bg-transparent rounded-[4px] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212121] px-6"
            style={{
              minHeight: 52,
              border: "2px solid #FFFFFF",
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            }}
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
  )
}

const MEDICION_SECTIONS = [
  { id: "medicion-hero", label: "Inicio" },
  { id: "medicion-descripcion", label: "Descripción" },
  { id: "medicion-tableros", label: "Tableros" },
  { id: "medicion-modulos", label: "Módulos" },
  { id: "medicion-pulso", label: "Pulso CTI" },
]

function RadarCTIPage() {
  return (
    <>
      <FloatingNav sections={MEDICION_SECTIONS} />
      <RadarCTIHero />
      <Breadcrumb
        items={[
          { label: "Contenidos", href: "#contenidos" },
          { label: "Rankings" },
        ]}
      />
      <RadarCTIDescription />
      <RadarCTIDashboards />
      <RadarCTIModules />
      <RadarCTIPulseBand />
    </>
  )
}

function RedirectPulso() {
  useEffect(() => {
    window.location.replace("https://rutanmedellin.org/pulso-cti-rutan")
  }, [])
  return (
    <section className="relative py-32 px-6 text-center min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F4F0]">
      <div className="w-8 h-8 rounded-full border-2 border-[#C0D400] border-t-transparent animate-spin mb-4" />
      <p
        className="text-lg font-bold text-[#253D36]"
        style={{
          fontFamily:
            "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
        }}
      >
        Redirigiendo al sitio externo del Pulso CTI...
      </p>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RANKINGS SUBPAGE
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// PULSO CTI — Ranking oficial de innovación de Medellín (vigencia 2025)
// ─────────────────────────────────────────────────────────────────────────────

const PULSO_FONT =
  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif"
const PULSO_BODY_FONT = PULSO_FONT

type PulsoReading = string[] | "reserved"

interface PulsoSegment {
  name: string
  color: string
  textColor?: string
  outlined?: boolean
  contribution: PulsoReading
  intensity: PulsoReading
}

const PULSO_COLORS = {
  investment: "#FF4C17",
  talent: "#C0D400",
  innovation: "#0068FF",
  businessGroups: "#0068FF",
  largeCompanies: "#FF4C17",
  mediumCompanies: "#C0D400",
  smallCompanies: "#FFCA00",
  higherEducation: "#FFFFFF",
  clinics: "#ABD23B",
  researchCenters: "#F09070",
  publicConglomerate: "#6BA4FF",
} as const

const pulsoTextColor = (color: string) =>
  color === PULSO_COLORS.investment || color === PULSO_COLORS.innovation
    ? "#FFFFFF"
    : "#212121"

const PULSO_TABS = [
  { id: "inversion", label: "Inversión", color: PULSO_COLORS.investment },
  { id: "talento", label: "Talento", color: PULSO_COLORS.talent },
  { id: "innovacion", label: "Innovación", color: PULSO_COLORS.innovation },
] as const

const PULSO_INVESTMENT: PulsoSegment[] = [
  {
    name: "Grupos empresariales",
    color: PULSO_COLORS.businessGroups,
    contribution: ["BANCOLOMBIA", "POSTOBON", "SURA", "SOFASA", "EMTELCO"],
    intensity: ["POSTOBON", "SOFASA", "SURA", "EMTELCO", "BANCOLOMBIA"],
  },
  {
    name: "Empresas grandes",
    color: PULSO_COLORS.largeCompanies,
    contribution: [
      "ALICO",
      "BIOXCELLERATOR",
      "WOLKVOX",
      "CONSTRUCTORA CAPITAL MEDELLÍN",
      "FONDO DE GARANTIAS",
    ],
    intensity: [
      "BIOXCELLERATOR",
      "CHOUCAIR CARDENAS TESTING",
      "WOLKVOX",
      "ALICO",
      "NEURUM",
    ],
  },
  {
    name: "Empresas medianas",
    color: PULSO_COLORS.mediumCompanies,
    contribution: ["D'GROUPE", "QUIND", "NETUX", "B2CHAT", "CALDERAS J.C.T"],
    intensity: ["D'GROUPE", "CALDERAS J.C.T", "QUIND", "NETUX", "B2CHAT"],
  },
  {
    name: "Empresas pequeñas",
    color: PULSO_COLORS.smallCompanies,
    contribution: [
      "CONSENTIDO HUMANO",
      "ALTA GAMA PROPIEDADES",
      "BIXU",
      "CONTROLT",
      "EDITORIAL AVANCEMOS",
    ],
    intensity: [
      "MIRACLE AI",
      "GRUPO EQUEX",
      "HIROKI 360",
      "CONSENTIDO HUMANO",
      "IANALITICS",
    ],
  },
  {
    name: "Instituciones de educación superior",
    color: PULSO_COLORS.higherEducation,
    contribution: [
      "UNIVERSIDAD DE ANTIOQUIA",
      "UNIVERSIDAD EAFIT",
      "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN",
      "UNIVERSIDAD CES",
      "INSTITUCION UNIVERSITARIA - ITM",
    ],
    intensity: [
      "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN",
      "UNIVERSIDAD EAFIT",
      "UNIVERSIDAD CES",
      "UNIVERSIDAD EIA",
      "UNIVERSIDAD DE ANTIOQUIA",
    ],
  },
  {
    name: "Clínicas y hospitales",
    color: PULSO_COLORS.clinics,
    outlined: true,
    contribution: ["HOSPITAL ALMA MATER DE ANTIOQUIA", "CLINICA CARDIO VID"],
    intensity: "reserved",
  },
  {
    name: "Centros de investigación",
    color: PULSO_COLORS.researchCenters,
    contribution: [
      "CTA",
      "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO",
      "ROCCAP",
      "TECNNOVA",
      "CRÉAME",
    ],
    intensity: [
      "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO",
      "CTA",
      "TECNNOVA",
      "ROCCAP",
      "CRÉAME",
    ],
  },
  {
    name: "Conglomerado público",
    color: PULSO_COLORS.publicConglomerate,
    outlined: true,
    contribution: [
      "EPM",
      "METRO DE MEDELLÍN",
      "COLEGIO MAYOR DE ANTIOQUIA",
      "SAPIENCIA",
      "EMPRESA DE DESARROLLO URBANO",
    ],
    intensity: [
      "COLEGIO MAYOR DE ANTIOQUIA",
      "METRO DE MEDELLÍN",
      "EMPRESA DE DESARROLLO URBANO",
      "SAPIENCIA",
      "EPM",
    ],
  },
]

const PULSO_TALENT: PulsoSegment[] = [
  {
    name: "Grupos empresariales",
    color: PULSO_COLORS.businessGroups,
    contribution: ["BANCOLOMBIA", "SURA", "POSTOBON", "EMTELCO", "SURENTING"],
    intensity: ["BANCOLOMBIA", "SURA", "POSTOBON", "EMTELCO", "SURENTING"],
  },
  {
    name: "Empresas grandes",
    color: PULSO_COLORS.largeCompanies,
    contribution: [
      "WOLKVOX",
      "BIOXCELLERATOR",
      "ALICO",
      "CONSTRUCTORA CAPITAL MEDELLÍN",
      "CHOUCAIR CARDENAS TESTING",
    ],
    intensity: [
      "BIOXCELLERATOR",
      "WOLKVOX",
      "NEURUM",
      "TODO DROGAS",
      "CHOUCAIR CARDENAS TESTING",
    ],
  },
  {
    name: "Empresas medianas",
    color: PULSO_COLORS.mediumCompanies,
    contribution: ["QUIND", "NETUX", "CONCEPT BPO", "B2CHAT", "C&S TECNOLOGIA"],
    intensity: ["QUIND", "NETUX", "INBIOS", "B2CHAT", "INVERSIONES BOR"],
  },
  {
    name: "Empresas pequeñas",
    color: PULSO_COLORS.smallCompanies,
    contribution: [
      "CONTROLT",
      "ALTA GAMA PROPIEDADES",
      "MIRACLE AI",
      "CAUSA & EFECTO",
    ],
    intensity: [
      "DIGITAL EXPRESS",
      "VELANJO",
      "SUNUBE",
      "CONTROLT",
      "CAUSA & EFECTO",
    ],
  },
  {
    name: "Instituciones de educación superior",
    color: PULSO_COLORS.higherEducation,
    contribution: [
      "UNIVERSIDAD EAFIT",
      "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN",
      "UNIVERSIDAD DE ANTIOQUIA",
      "UNIVERSIDAD PONTIFICIA BOLIVARIANA",
      "INSTITUCION UNIVERSITARIA - ITM",
    ],
    intensity: [
      "UNIVERSIDAD EAFIT",
      "UNIVERSIDAD DE MEDELLIN",
      "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN",
      "UNIVERSIDAD DE ANTIOQUIA",
      "UNIVERSIDAD CES",
    ],
  },
  {
    name: "Clínicas y hospitales",
    color: PULSO_COLORS.clinics,
    outlined: true,
    contribution: ["HOSPITAL ALMA MATER DE ANTIOQUIA", "CLINICA CARDIO VID"],
    intensity: ["CLINICA CARDIO VID", "HOSPITAL ALMA MATER DE ANTIOQUIA"],
  },
  {
    name: "Centros de investigación",
    color: PULSO_COLORS.researchCenters,
    contribution: [
      "CTA",
      "TECNNOVA",
      "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO",
      "CRÉAME",
    ],
    intensity: [
      "TECNNOVA",
      "CTA",
      "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO",
      "CRÉAME",
    ],
  },
  {
    name: "Conglomerado público",
    color: PULSO_COLORS.publicConglomerate,
    outlined: true,
    contribution: [
      "EPM",
      "METRO DE MEDELLÍN",
      "SAPIENCIA",
      "AEROPUERTO OLAYA HERRERA",
    ],
    intensity: [
      "AEROPUERTO OLAYA HERRERA",
      "SAPIENCIA",
      "METRO DE MEDELLÍN",
      "EPM",
    ],
  },
]

const PULSO_INNOVATION: PulsoSegment[] = [
  {
    name: "Grupos empresariales",
    color: PULSO_COLORS.businessGroups,
    contribution: ["POSTOBON", "EMTELCO", "BANCOLOMBIA", "SURA", "SURENTING"],
    intensity: ["EMTELCO", "SOFASA", "BANCOLOMBIA", "POSTOBON", "SURA"],
  },
  {
    name: "Empresas grandes",
    color: PULSO_COLORS.largeCompanies,
    contribution: [
      "TODO DROGAS",
      "NEURUM",
      "ALICO",
      "CONSTRUCTORA CAPITAL MEDELLÍN",
      "WOLKVOX",
    ],
    intensity: [
      "CONSTRUCTORA CAPITAL MEDELLÍN",
      "CHOUCAIR CARDENAS TESTING",
      "BIOXCELLERATOR",
      "WOLKVOX",
      "NEURUM",
    ],
  },
  {
    name: "Empresas medianas",
    color: PULSO_COLORS.mediumCompanies,
    contribution: [
      "NETUX",
      "D'GROUPE",
      "QUIND",
      "INGENIERIA EN CONSTRUCCIONES CIVILES",
      "CONCEPT BPO",
    ],
    intensity: ["SERVIREFRIAIRE", "D'GROUPE", "NETUX", "QUIND", "B2CHAT"],
  },
  {
    name: "Empresas pequeñas",
    color: PULSO_COLORS.smallCompanies,
    contribution: [
      "INDENOX",
      "DIGITAL EXPRESS",
      "TECNOLOGIA Y SUMINISTROS",
      "MIRACLE AI",
      "GRUPO PROYECCIÓN CONTABLE",
    ],
    intensity: [
      "GRUPO PROYECCIÓN CONTABLE",
      "BIXU",
      "GRUPO EQUEX",
      "CAUSA & EFECTO",
      "DATABIZ",
    ],
  },
  {
    name: "Instituciones de educación superior",
    color: PULSO_COLORS.higherEducation,
    contribution: [
      "UNIVERSIDAD EAFIT",
      "UNIVERSIDAD DE ANTIOQUIA",
      "UNIVERSIDAD PONTIFICIA BOLIVARIANA",
      "UNIVERSIDAD DE MEDELLIN",
      "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN",
    ],
    intensity: [
      "INSTITUCION UNIVERSITARIA - ITM",
      "UNIVERSIDAD EIA",
      "UNIVERSIDAD CES",
      "UNIVERSIDAD DE ANTIOQUIA",
      "UNIVERSIDAD EAFIT",
    ],
  },
  {
    name: "Clínicas y hospitales",
    color: PULSO_COLORS.clinics,
    outlined: true,
    contribution: ["HOSPITAL ALMA MATER DE ANTIOQUIA", "CLINICA CARDIO VID"],
    intensity: "reserved",
  },
  {
    name: "Centros de investigación",
    color: PULSO_COLORS.researchCenters,
    contribution: ["ROCCAP", "CTA", "CRÉAME"],
    intensity: [
      "CRÉAME",
      "ROCCAP",
      "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO",
    ],
  },
  {
    name: "Conglomerado público",
    color: PULSO_COLORS.publicConglomerate,
    outlined: true,
    contribution: [
      "METRO DE MEDELLÍN",
      "EPM",
      "COLEGIO MAYOR DE ANTIOQUIA",
      "EMPRESA DE DESARROLLO URBANO",
    ],
    intensity: [
      "COLEGIO MAYOR DE ANTIOQUIA",
      "EPM",
      "METRO DE MEDELLÍN",
      "EMPRESA DE DESARROLLO URBANO",
    ],
  },
]

const PULSO_RANKINGS: Record<typeof PULSO_TABS[number]["id"], PulsoSegment[]> =
  {
    inversion: PULSO_INVESTMENT,
    talento: PULSO_TALENT,
    innovacion: PULSO_INNOVATION,
  }

const PULSO_SEGMENT_FILTERS = PULSO_INVESTMENT.map(
  ({ name, color, outlined }) => ({
    id: name,
    label: name,
    color,
    outlined,
  }),
)

const PULSO_ORGANIZATION_SEGMENTS = new Map<string, PulsoSegment>(
  Object.values(PULSO_RANKINGS).flatMap((ranking) =>
    ranking.flatMap((segment) => {
      const organizations = [
        ...(segment.contribution === "reserved" ? [] : segment.contribution),
        ...(segment.intensity === "reserved" ? [] : segment.intensity),
      ]
      return organizations.map(
        (organization) => [organization, segment] as const,
      )
    }),
  ),
)

function PulsoMarker({
  color,
  outlined = false,
}: {
  color: string
  outlined?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-[2px]"
      style={
        outlined ? { border: `2px solid ${color}` } : { backgroundColor: color }
      }
    />
  )
}

function PulsoReadingList({
  reading,
  segment,
}: {
  reading: PulsoReading
  segment: PulsoSegment
}) {
  if (reading === "reserved") {
    return (
      <div className="flex min-h-28 flex-col justify-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">
          Reservado
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/60">
          Ninguna organización supera el umbral de denominador.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2.5">
      {reading.map((organization) => (
        <li
          key={organization}
          className="flex items-start gap-2.5 text-xs font-bold uppercase leading-snug text-white"
        >
          <PulsoMarker color={segment.color} outlined={segment.outlined} />
          <span>{organization}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Org logo placeholder card ────────────────────────────────────────────────

const PULSO_LOGO_ASSETS = import.meta.glob("../assets/logos/pulso/*.webp", {
  eager: true,
  query: "?url&no-inline",
  import: "default",
}) as Record<string, string>

const pulsoLogo = (filename: string) => {
  const logo = PULSO_LOGO_ASSETS[`../assets/logos/pulso/${filename}`]
  if (!logo) throw new Error(`Logo de Pulso CTI no encontrado: ${filename}`)
  return logo
}

const ORG_LOGOS: Record<string, string> = {
  ALICO: pulsoLogo("alico.webp"),
  "ALTA GAMA PROPIEDADES": pulsoLogo("alta-gama.webp"),
  B2CHAT: pulsoLogo("b2chat.webp"),
  BANCOLOMBIA: pulsoLogo("bancolombia.webp"),
  BIOXCELLERATOR: pulsoLogo("bioxcellerator.webp"),
  "C&S TECNOLOGIA": pulsoLogo("cys-tecnologia.webp"),
  "CALDERAS J.C.T": pulsoLogo("calderas-jct.webp"),
  "CAUSA & EFECTO": pulsoLogo("causa-y-efecto.webp"),
  "CHOUCAIR CARDENAS TESTING": pulsoLogo("choucair.webp"),
  "CLINICA CARDIO VID": pulsoLogo("clinica-cardio-vid.webp"),
  "COLEGIO MAYOR DE ANTIOQUIA": pulsoLogo("colegio-mayor-de-antioquia.webp"),
  "CONCEPT BPO": pulsoLogo("concept-bpo.webp"),
  "CONSENTIDO HUMANO": pulsoLogo("consentido-humano.webp"),
  "CONSTRUCTORA CAPITAL MEDELLÍN": pulsoLogo("constructora-capital.webp"),
  CONTROLT: pulsoLogo("controlt.webp"),
  CRÉAME: pulsoLogo("creame.webp"),
  CTA: pulsoLogo("centro-de-ciencia-y-tecnologia-de-antioquia.webp"),
  DATABIZ: pulsoLogo("databiz.webp"),
  "D'GROUPE": pulsoLogo("dgroupe.webp"),
  "EDITORIAL AVANCEMOS": pulsoLogo("editorial-avancemos.webp"),
  "EMPRESA DE DESARROLLO URBANO": pulsoLogo(
    "empresa-de-desarrollo-urbano.webp",
  ),
  EMTELCO: pulsoLogo("emtelco.webp"),
  EPM: pulsoLogo("epm.webp"),
  "FONDO DE GARANTIAS": pulsoLogo("fondo-de-garantias.webp"),
  "GRUPO EQUEX": pulsoLogo("grupo-equex.webp"),
  "GRUPO PROYECCIÓN CONTABLE": pulsoLogo("grupo-proyeccion-contable.webp"),
  "HIROKI 360": pulsoLogo("hiroki-360.webp"),
  "HOSPITAL ALMA MATER DE ANTIOQUIA": pulsoLogo("hospital-alma-mater.webp"),
  IANALITICS: pulsoLogo("ianalitics.webp"),
  "INSTITUTO DE CAPACITACION E INVESTIGACION DEL PLASTICO Y DEL CAUCHO":
    pulsoLogo("icipc.webp"),
  INBIOS: pulsoLogo("inbios.webp"),
  INDENOX: pulsoLogo("indenox.webp"),
  "INGENIERIA EN CONSTRUCCIONES CIVILES": pulsoLogo(
    "ingenieria-en-construcciones-civiles.webp",
  ),
  "INSTITUCION UNIVERSITARIA - ITM": pulsoLogo("itm.webp"),
  "METRO DE MEDELLÍN": pulsoLogo("metro-de-medellin.webp"),
  "MIRACLE AI": pulsoLogo("miracle-ai.webp"),
  NETUX: pulsoLogo("netux.webp"),
  NEURUM: pulsoLogo("neurum.webp"),
  "AEROPUERTO OLAYA HERRERA": pulsoLogo("olaya-herrera.webp"),
  POSTOBON: pulsoLogo("postobon.webp"),
  QUIND: pulsoLogo("quind.webp"),
  ROCCAP: pulsoLogo("roccap.webp"),
  SAPIENCIA: pulsoLogo("sapiencia.webp"),
  SOFASA: pulsoLogo("sofasa.webp"),
  SUNUBE: pulsoLogo("sunube.webp"),
  SURA: pulsoLogo("sura.webp"),
  SURENTING: pulsoLogo("surenting.webp"),
  TECNNOVA: pulsoLogo("tecnnova.webp"),
  "TECNOLOGIA Y SUMINISTROS": pulsoLogo("tecnologia-y-suministros.webp"),
  "TODO DROGAS": pulsoLogo("tododrogas.webp"),
  "UNIVERSIDAD CES": pulsoLogo("universidad-ces.webp"),
  "UNIVERSIDAD DE ANTIOQUIA": pulsoLogo("universidad-de-antioquia.webp"),
  "UNIVERSIDAD DE MEDELLIN": pulsoLogo("universidad-de-medellin.webp"),
  "UNIVERSIDAD EAFIT": pulsoLogo("universidad-eafit.webp"),
  "UNIVERSIDAD EIA": pulsoLogo("universidad-eia.webp"),
  "UNIVERSIDAD NACIONAL DE COLOMBIA - SEDE MEDELLÍN": pulsoLogo(
    "universidad-nacional.webp",
  ),
  "UNIVERSIDAD PONTIFICIA BOLIVARIANA": pulsoLogo("upb.webp"),
  VELANJO: pulsoLogo("velanjo.webp"),
  WOLKVOX: pulsoLogo("wolkvox.webp"),
}

function OrgLogoCard({ name }: { name: string }) {
  const logo = ORG_LOGOS[name]
  const segment = PULSO_ORGANIZATION_SEGMENTS.get(name)
  const accentColor = segment?.color ?? "#FFFFFF"
  const logoSizeClass =
    name === "BANCOLOMBIA"
      ? "max-h-12 w-[90%]"
      : name === "CTA"
        ? "max-h-14 w-[80%]"
        : name === "METRO DE MEDELLÍN"
          ? "max-h-[72px] w-auto"
          : name === "B2CHAT"
            ? "max-h-14 w-[55%]"
            : "max-h-14 w-[78%]"
  return (
    <div
      className="my-1 flex min-h-[76px] w-full shrink-0 items-center justify-center rounded-[2px] border border-white/10 bg-white/5 p-2 transition-all duration-200 [contain:layout_paint] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.09] sm:my-1.5 sm:min-h-24 sm:p-3"
      style={{
        borderColor: `${accentColor}66`,
        boxShadow: `inset 3px 0 0 ${accentColor}`,
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={`Logo de ${name}`}
          className={`${logoSizeClass} object-contain`}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : (
        <span
          className="max-w-[90%] text-center text-[11px] font-black uppercase leading-tight tracking-[0.08em] sm:text-sm"
          style={{ color: accentColor, fontFamily: PULSO_FONT }}
        >
          {name}
        </span>
      )}
    </div>
  )
}

// ─── Info tooltip (ⓘ) ────────────────────────────────────────────────────────

interface InfoTooltipProps {
  id: string
  text: string
}

function InfoTooltip({ id, text }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-describedby={`tooltip-${id}`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white/25 text-[9px] font-black text-white/45 transition-colors hover:border-[#C0D400]/60 hover:text-[#C0D400] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C0D400]"
        style={{ fontFamily: PULSO_FONT, lineHeight: 1 }}
        aria-label="Más información"
      >
        i
      </button>
      <span
        role="tooltip"
        id={`tooltip-${id}`}
        className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2.5 w-64 -translate-x-1/2 rounded-[2px] border border-white/15 bg-[#2c2c2c] p-3.5 text-xs leading-relaxed text-white/80 shadow-2xl transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ fontFamily: PULSO_FONT }}
        aria-hidden={!visible}
      >
        <span
          className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-[#2c2c2c]"
          aria-hidden="true"
        />
        {text}
      </span>
    </span>
  )
}

// ─── Pulso CTI section — checkboxes + infinite marquee grid ──────────────────

const PULSO_COLUMN_FILTERS = [
  {
    id: "contribucion",
    label: "Contribución al ecosistema",
    tooltip:
      "Cuánto capital, talento o innovación moviliza la organización en términos absolutos, sin ajustar por su tamaño: cuánto gasto, cuántas personas y cuántas innovaciones puso sobre la mesa en la vigencia.",
  },
  {
    id: "intensidad",
    label: "Intensidad de la apuesta",
    tooltip:
      "Qué proporción de sus propias capacidades destina la organización a la CTi. La lectura que revela a quienes hacen la mayor apuesta sin importar su tamaño.",
  },
] as const

interface PulsoMobileFilterOption {
  id: string
  label: string
  color: string
  outlined?: boolean
}

function PulsoMobileFilterMenu({
  id,
  label,
  options,
  selected,
  isOpen,
  onOpenChange,
  onToggle,
}: {
  id: string
  label: string
  options: readonly PulsoMobileFilterOption[]
  selected: Set<string>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (id: string) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const animation = gsap.fromTo(
      menuRef.current,
      { autoAlpha: 0, y: reduceMotion ? 0 : -8 },
      {
        autoAlpha: 1,
        y: 0,
        duration: reduceMotion ? 0 : 0.2,
        ease: "power2.out",
      },
    )
    return () => {
      animation.kill()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onOpenChange])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`pulso-mobile-${id}`}
        onClick={() => onOpenChange(!isOpen)}
        className="flex min-h-12 w-full items-center justify-between border border-white/15 bg-white/[0.03] px-4 text-left transition-colors hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C0D400]"
        style={{ fontFamily: PULSO_FONT }}
      >
        <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
          {label}
        </span>
        <span className="flex items-center gap-3">
          {selected.size > 0 && (
            <span className="flex min-w-6 items-center justify-center border border-[#C0D400]/50 px-1.5 py-0.5 text-[10px] font-black text-[#C0D400]">
              {selected.size}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 text-white/55 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={`pulso-mobile-${id}`}
          className="absolute inset-x-0 top-full z-40 mt-1 max-h-[min(55vh,420px)] overflow-y-auto border border-white/15 bg-[#292929] p-2 shadow-2xl"
        >
          {options.map((option) => {
            const checked = selected.has(option.id)
            return (
              <label
                key={option.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2 text-sm font-bold text-white/80 transition-colors hover:bg-white/[0.06]"
                style={{
                  fontFamily: PULSO_FONT,
                  backgroundColor: checked ? option.color : undefined,
                  color: checked ? pulsoTextColor(option.color) : undefined,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px]"
                  style={
                    checked
                      ? {
                          border: `2px solid ${option.color}`,
                          backgroundColor: `${option.color}26`,
                        }
                      : { border: "1px solid rgba(255,255,255,0.25)" }
                  }
                >
                  {checked && (
                    <span
                      className="h-1.5 w-1.5"
                      style={
                        option.outlined
                          ? { border: `1.5px solid ${option.color}` }
                          : { backgroundColor: option.color }
                      }
                    />
                  )}
                </span>
                <PulsoMarker color={option.color} outlined={option.outlined} />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PulsoSection() {
  const [activeDims, setActiveDims] = useState<Set<string>>(new Set())
  const [activeCols, setActiveCols] = useState<Set<string>>(new Set())
  const [activeSegments, setActiveSegments] = useState<Set<string>>(new Set())
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null)
  const hasActiveFilters =
    activeDims.size > 0 || activeCols.size > 0 || activeSegments.size > 0

  const toggleDim = (id: string) =>
    setActiveDims((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const toggleCol = (id: string) =>
    setActiveCols((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const toggleSegment = (id: string) =>
    setActiveSegments((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const filteredOrgs = useMemo(() => {
    const dims =
      activeDims.size === 0
        ? ["inversion", "talento", "innovacion"] as const
        : (["inversion", "talento", "innovacion"] as const).filter((d) =>
            activeDims.has(d),
          )
    const useBoth = activeCols.size === 0
    const useContrib = useBoth || activeCols.has("contribucion")
    const useIntensity = useBoth || activeCols.has("intensidad")
    const orgs = new Set<string>()
    for (const dim of dims) {
      for (const seg of PULSO_RANKINGS[dim]) {
        if (activeSegments.size > 0 && !activeSegments.has(seg.name)) continue
        if (useContrib && seg.contribution !== "reserved") {
          for (const org of seg.contribution as string[]) {
            if (ORG_LOGOS[org]) orgs.add(org)
          }
        }
        if (useIntensity && seg.intensity !== "reserved") {
          for (const org of seg.intensity as string[]) {
            if (ORG_LOGOS[org]) orgs.add(org)
          }
        }
      }
    }
    return Array.from(orgs).sort()
  }, [activeDims, activeCols, activeSegments])

  const ROW_COUNT = 4
  const rows = useMemo<string[][]>(() => {
    const result: string[][] = Array.from({ length: ROW_COUNT }, () => [])
    filteredOrgs.forEach((org, i) => result[i % ROW_COUNT].push(org))
    return result
  }, [filteredOrgs])

  return (
    <section
      id="rankings-pulso"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#212121] pb-6 pt-10 text-white sm:pb-8 sm:pt-14 lg:pb-10 lg:pt-16"
    >
      <style>{`
        @keyframes pulso-up {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(0, -50%, 0); }
        }
        @keyframes pulso-down {
          from { transform: translate3d(0, -50%, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .pulso-col-u,
        .pulso-col-d {
          will-change: transform;
          backface-visibility: hidden;
        }
        .pulso-col-u { animation: pulso-up linear infinite; }
        .pulso-col-d { animation: pulso-down linear infinite; }
        .pulso-col-u:hover,
        .pulso-col-d:hover { animation-play-state: paused; }
        ${PULSO_TABS.map(
          (tab) => `
          .pulso-filter-${tab.id}:hover {
            border-color: ${tab.color} !important;
            background-color: ${tab.color}18 !important;
            box-shadow: 0 0 0 1px ${tab.color}33, 0 0 16px ${tab.color}40, inset 0 0 10px ${tab.color}12 !important;
            color: ${tab.color} !important;
            transform: translateY(-1px);
          }
          .pulso-filter-${tab.id}:hover .pulso-filter-led {
            background-color: ${tab.color} !important;
            box-shadow: 0 0 5px ${tab.color}, 0 0 10px ${tab.color}80 !important;
          }
        `,
        ).join("")}
        ${PULSO_SEGMENT_FILTERS.map(
          (segment, index) => `
          .pulso-filter-segment-${index}:hover {
            border-color: ${segment.color} !important;
            background-color: ${segment.color}18 !important;
            box-shadow: 0 0 0 1px ${segment.color}33, 0 0 16px ${segment.color}40, inset 0 0 10px ${segment.color}12 !important;
            color: ${segment.color} !important;
            transform: translateY(-1px);
          }
          .pulso-filter-segment-${index}:hover .pulso-filter-led {
            background-color: ${
              segment.outlined ? "transparent" : segment.color
            } !important;
            border-color: ${segment.color} !important;
            box-shadow: 0 0 5px ${segment.color}, 0 0 10px ${segment.color}80 !important;
          }
        `,
        ).join("")}
        .pulso-filter-reading:hover {
          border-color: #C0D400 !important;
          background-color: #C0D40018 !important;
          box-shadow: 0 0 0 1px #C0D40033, 0 0 16px #C0D40040, inset 0 0 10px #C0D40012 !important;
          color: #C0D400 !important;
          transform: translateY(-1px);
        }
        .pulso-filter-reading:hover .pulso-filter-led {
          background-color: #C0D400 !important;
          box-shadow: 0 0 5px #C0D400, 0 0 10px #C0D40080 !important;
        }
        .pulso-filter-input:focus-visible + .pulso-filter-button {
          outline: 2px solid #C0D400;
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .pulso-col-u, .pulso-col-d { animation: none; }
          .pulso-filter-button:hover { transform: none; }
        }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 border-b border-white/15 pb-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-16 lg:pb-10 xl:gap-x-20">
          <div>
            <h2
              className="font-black"
              style={{
                fontFamily: PULSO_FONT,
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
              }}
            >
              Ranking Oficial de Innovación del Distrito
            </h2>
            <p
              className="mt-3 text-lg font-bold leading-snug text-[#C0D400] sm:mt-4 sm:text-xl lg:text-2xl"
              style={{ fontFamily: PULSO_FONT }}
            >
              El pulso sincronizado del ecosistema CTI de Medellín
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 sm:mt-7 sm:gap-5">
              <img
                src={pulsoCtiLogoWhite}
                alt="Exclusivo en Forbes Colombia"
                className="h-auto w-full max-w-[140px] object-contain sm:max-w-[160px]"
              />
            </div>
          </div>
          <div
            className="mt-6 max-w-3xl space-y-3 text-[15px] leading-relaxed text-white/75 sm:mt-8 sm:space-y-4 sm:text-base lg:mt-0 lg:justify-self-end lg:text-lg"
            style={{ fontFamily: PULSO_BODY_FONT }}
          >
            <img
              src={pwsoLogoWhite}
              alt="PWSO, Ciencia, Tecnología, Innovación de Medellín"
              width="219"
              height="94"
              className="h-auto w-full max-w-[140px] object-contain sm:max-w-[160px]"
            />
            <p>
              Este Ranking creado por Ruta N muestra los rostros de las
              organizaciones que impulsan la innovación en la ciudad en tres
              dimensiones: inversión, talento e innovación. Cada dimensión se
              lee desde dos categorías. Contribución al ecosistema muestra
              cuánto aporta cada organización en cifras totales: lo que
              invierte, las personas que dedica a la CTI y las innovaciones que
              lleva al mercado. Intensidad de la apuesta muestra qué proporción
              de sus propias capacidades destina a la CTI. Así, una empresa
              pequeña puede marcar el pulso junto a una grande.
            </p>
            <p>
              Cada organización se compara con las de su segmento, entre ocho
              diferentes que van de grupos empresariales a clínicas y centros de
              investigación. En cada segmento y en cada una de las seis lecturas
              aparecen hasta cinco organizaciones destacadas, en orden
              alfabético. Es un grupo, no un podio.
            </p>
            <a
              href="https://rutanmedellin.org/pulso-cti-rutan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 w-fit items-center gap-3 bg-white px-6 py-[13.6px] text-[#212121] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#212121]"
            >
              <img
                src="/assets/a099d.svg"
                alt=""
                width="16"
                height="16"
                className="shrink-0"
                aria-hidden="true"
              />
              <span
                className="whitespace-nowrap text-[14.4px] font-bold uppercase leading-[21.6px] tracking-[1.152px]"
                style={{ fontFamily: "'Inter:Bold'" }}
              >
                Radiografía CTI
              </span>
            </a>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="border-b border-white/15 py-5 sm:py-7 lg:py-8">
          <p
            className="mb-4 text-sm text-white/70 sm:mb-5"
            style={{ fontFamily: PULSO_FONT }}
          >
            Selecciona los filtros para conocer las organizaciones
          </p>
          <div className="grid gap-2 md:hidden">
            <PulsoMobileFilterMenu
              id="dimension"
              label="Dimensión"
              options={PULSO_TABS}
              selected={activeDims}
              isOpen={openMobileMenu === "dimension"}
              onOpenChange={(open) =>
                setOpenMobileMenu(open ? "dimension" : null)
              }
              onToggle={toggleDim}
            />
            <PulsoMobileFilterMenu
              id="lectura"
              label="Lectura"
              options={PULSO_COLUMN_FILTERS.map((column) => ({
                id: column.id,
                label: column.label,
                color: PULSO_COLORS.talent,
              }))}
              selected={activeCols}
              isOpen={openMobileMenu === "lectura"}
              onOpenChange={(open) =>
                setOpenMobileMenu(open ? "lectura" : null)
              }
              onToggle={toggleCol}
            />
            <PulsoMobileFilterMenu
              id="segmento"
              label="Segmento"
              options={PULSO_SEGMENT_FILTERS}
              selected={activeSegments}
              isOpen={openMobileMenu === "segmento"}
              onOpenChange={(open) =>
                setOpenMobileMenu(open ? "segmento" : null)
              }
              onToggle={toggleSegment}
            />
          </div>

          <div className="hidden gap-x-8 gap-y-7 md:grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-[minmax(200px,0.75fr)_minmax(270px,1fr)_minmax(0,2.25fr)]">
            {/* Dimension toggle buttons */}
            <fieldset>
              <legend
                className="mb-4 text-[9px] font-bold uppercase tracking-[0.32em] text-white/25"
                style={{ fontFamily: PULSO_FONT }}
              >
                Dimensión
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {PULSO_TABS.map((tab) => {
                  const checked = activeDims.has(tab.id)
                  return (
                    <label
                      key={tab.id}
                      className="group relative cursor-pointer select-none"
                      style={{ fontFamily: PULSO_FONT }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDim(tab.id)}
                        className="pulso-filter-input sr-only"
                        aria-label={tab.label}
                      />
                      <span
                        className={`pulso-filter-button pulso-filter-${tab.id} relative flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-200`}
                        style={{
                          border: `1px solid ${
                            checked ? tab.color : "rgba(255,255,255,0.1)"
                          }`,
                          backgroundColor: checked
                            ? tab.color
                            : "rgba(255,255,255,0.02)",
                          color: checked
                            ? pulsoTextColor(tab.color)
                            : "rgba(255,255,255,0.3)",
                          boxShadow: checked
                            ? `0 0 0 1px ${tab.color}44, 0 0 18px ${tab.color}55, inset 0 0 12px ${tab.color}18`
                            : "none",
                        }}
                      >
                        {/* Corner brackets */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderTop: `2px solid ${tab.color}`,
                            borderLeft: `2px solid ${tab.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderTop: `2px solid ${tab.color}`,
                            borderRight: `2px solid ${tab.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderBottom: `2px solid ${tab.color}`,
                            borderLeft: `2px solid ${tab.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderBottom: `2px solid ${tab.color}`,
                            borderRight: `2px solid ${tab.color}`,
                          }}
                        />
                        {/* LED dot */}
                        <span
                          aria-hidden="true"
                          className="pulso-filter-led h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: checked
                              ? tab.color
                              : "rgba(255,255,255,0.18)",
                            boxShadow: checked
                              ? `0 0 5px ${tab.color}, 0 0 10px ${tab.color}90`
                              : "none",
                          }}
                        />
                        {tab.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Column toggle buttons */}
            <fieldset className="lg:border-l lg:border-white/10 lg:pl-8">
              <legend
                className="mb-4 text-[9px] font-bold uppercase tracking-[0.32em] text-white/25"
                style={{ fontFamily: PULSO_FONT }}
              >
                Lectura
              </legend>
              <div className="flex flex-col gap-2.5">
                {PULSO_COLUMN_FILTERS.map((col) => {
                  const checked = activeCols.has(col.id)
                  const color = PULSO_COLORS.talent
                  return (
                    <div key={col.id} className="flex items-center gap-2.5">
                      <label
                        className="group relative cursor-pointer select-none"
                        style={{ fontFamily: PULSO_FONT }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCol(col.id)}
                          className="pulso-filter-input sr-only"
                          aria-label={col.label}
                        />
                        <span
                          className="pulso-filter-button pulso-filter-reading relative flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] transition-all duration-200"
                          style={{
                            border: `1px solid ${
                              checked ? color : "rgba(255,255,255,0.1)"
                            }`,
                            backgroundColor: checked
                              ? color
                              : "rgba(255,255,255,0.02)",
                            color: checked
                              ? pulsoTextColor(color)
                              : "rgba(255,255,255,0.3)",
                            boxShadow: checked
                              ? `0 0 0 1px ${color}44, 0 0 18px ${color}55, inset 0 0 12px ${color}18`
                              : "none",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                            style={{
                              opacity: checked ? 1 : 0,
                              borderTop: `2px solid ${color}`,
                              borderLeft: `2px solid ${color}`,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                            style={{
                              opacity: checked ? 1 : 0,
                              borderTop: `2px solid ${color}`,
                              borderRight: `2px solid ${color}`,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 transition-opacity duration-200"
                            style={{
                              opacity: checked ? 1 : 0,
                              borderBottom: `2px solid ${color}`,
                              borderLeft: `2px solid ${color}`,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 transition-opacity duration-200"
                            style={{
                              opacity: checked ? 1 : 0,
                              borderBottom: `2px solid ${color}`,
                              borderRight: `2px solid ${color}`,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="pulso-filter-led h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
                            style={{
                              backgroundColor: checked
                                ? color
                                : "rgba(255,255,255,0.18)",
                              boxShadow: checked
                                ? `0 0 5px ${color}, 0 0 10px ${color}90`
                                : "none",
                            }}
                          />
                          {col.label}
                        </span>
                      </label>
                      <InfoTooltip id={col.id} text={col.tooltip} />
                    </div>
                  )
                })}
              </div>
            </fieldset>

            {/* Segment toggle buttons */}
            <fieldset className="md:col-span-2 lg:col-span-1 lg:border-l lg:border-white/10 lg:pl-8">
              <legend
                className="mb-4 text-[9px] font-bold uppercase tracking-[0.32em] text-white/25"
                style={{ fontFamily: PULSO_FONT }}
              >
                Segmento
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {PULSO_SEGMENT_FILTERS.map((segment, index) => {
                  const checked = activeSegments.has(segment.id)
                  return (
                    <label
                      key={segment.id}
                      className="group relative cursor-pointer select-none"
                      style={{ fontFamily: PULSO_FONT }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSegment(segment.id)}
                        className="pulso-filter-input sr-only"
                        aria-label={segment.label}
                      />
                      <span
                        className={`pulso-filter-button pulso-filter-segment-${index} relative flex min-h-11 items-center gap-2.5 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-200`}
                        style={{
                          border: `1px solid ${
                            checked ? segment.color : "rgba(255,255,255,0.1)"
                          }`,
                          backgroundColor: checked
                            ? segment.color
                            : "rgba(255,255,255,0.02)",
                          color: checked
                            ? pulsoTextColor(segment.color)
                            : "rgba(255,255,255,0.3)",
                          boxShadow: checked
                            ? `0 0 0 1px ${segment.color}44, 0 0 18px ${segment.color}55, inset 0 0 12px ${segment.color}18`
                            : "none",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderTop: `2px solid ${segment.color}`,
                            borderLeft: `2px solid ${segment.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderTop: `2px solid ${segment.color}`,
                            borderRight: `2px solid ${segment.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderBottom: `2px solid ${segment.color}`,
                            borderLeft: `2px solid ${segment.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 transition-opacity duration-200"
                          style={{
                            opacity: checked ? 1 : 0,
                            borderBottom: `2px solid ${segment.color}`,
                            borderRight: `2px solid ${segment.color}`,
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="pulso-filter-led h-2.5 w-2.5 shrink-0 rounded-[2px] transition-all duration-200"
                          style={
                            segment.outlined
                              ? {
                                  border: `2px solid ${
                                    checked
                                      ? segment.color
                                      : "rgba(255,255,255,0.18)"
                                  }`,
                                  boxShadow: checked
                                    ? `0 0 5px ${segment.color}, 0 0 10px ${segment.color}90`
                                    : "none",
                                }
                              : {
                                  backgroundColor: checked
                                    ? segment.color
                                    : "rgba(255,255,255,0.18)",
                                  boxShadow: checked
                                    ? `0 0 5px ${segment.color}, 0 0 10px ${segment.color}90`
                                    : "none",
                                }
                          }
                        />
                        {segment.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          {/* Count */}
          <p
            className="mt-4 border-t border-white/10 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 sm:mt-6 sm:pt-5"
            style={{ fontFamily: PULSO_FONT }}
          >
            {filteredOrgs.length}{" "}
            {filteredOrgs.length === 1 ? "organización" : "organizaciones"} ·
            Pulso CTI 2025
          </p>
        </div>
      </div>

      {hasActiveFilters ? (
        /* ── Static filtered results ─────────────────────────────── */
        <div className="mx-auto mt-6 grid max-w-[1440px] grid-cols-3 gap-2 px-4 sm:mt-8 sm:gap-3 sm:px-6 md:grid-cols-4 lg:px-10 xl:px-12">
          {filteredOrgs.map((org) => (
            <OrgLogoCard key={org} name={org} />
          ))}
        </div>
      ) : (
        /* ── Infinite vertical marquee — 4 columns ──────────────── */
        <div className="mx-auto mt-6 grid h-[360px] max-w-[1440px] grid-cols-2 gap-2 overflow-hidden px-4 sm:mt-8 sm:h-[520px] sm:gap-3 sm:px-6 md:grid-cols-4 lg:px-10 xl:px-12">
          {rows.map((colOrgs, colIndex) => {
            if (colOrgs.length === 0) return null
            const doubled = [...colOrgs, ...colOrgs]
            const isDown = colIndex % 2 === 1
            const speed = 28
            return (
              <div key={colIndex} className="overflow-hidden">
                <div
                  className={isDown ? "pulso-col-d" : "pulso-col-u"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    animationDuration: `${speed}s`,
                  }}
                >
                  {doubled.map((org, i) => (
                    <OrgLogoCard key={`${org}-${i}`} name={org} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
function RankingsBanner() {
  return (
    <section
      id="rankings-hero"
      className="relative flex flex-col justify-center overflow-hidden bg-[#253D36] text-white"
      style={{ minHeight: "60svh", paddingTop: 120, paddingBottom: 80 }}
    >
      <img
        src="https://images.unsplash.com/photo-1715503234327-b57d32e5da0f?auto=format&fit=crop&q=85&w=2000"
        alt="Vista panorámica de Medellín entre montañas"
        className="absolute inset-0 h-full w-full object-cover object-center"
        decoding="async"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.18)_100%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-12">
        <p
          className="text-[10px] tracking-[0.32em] uppercase mb-6"
          style={{
            color: "#C0D400",
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            fontWeight: "bold",
          }}
        >
          RANKINGS
        </p>
        <h1
          className="text-white mb-6 max-w-4xl"
          style={{
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Medellín en el mapa global y el Ranking Oficial de Innovación de Pulso
          CTI
        </h1>
        <p
          className="text-lg md:text-xl max-w-3xl"
          style={{
            color: "rgba(255,255,255,0.75)",
            fontFamily:
              "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif",
            lineHeight: 1.55,
          }}
        >
          Conoce la posición, evolución y lectura de data de rankings
          internacionales, regionales y locales.
        </p>
      </div>
    </section>
  )
}

const RANKING_KPIS = [
  {
    title: "Global Startup Index",
    value: "#130",
    badge: "↑ Subió 28",
    description:
      "Puesto global (6° en LATAM). Mayor score de negocios en LATAM hispana.",
  },
  {
    title: "Densidad de Ecosistema",
    value: "30%",
    badge: "698 Startups",
    description:
      "Concentración de startups a nivel nacional. Crecimiento anual >40%.",
  },
  {
    title: "Inversión Captada",
    value: "US$157M",
    badge: "Ticket medio: $5.4M",
    description: "Equivale al 18% del capital capturado en el país.",
  },
  {
    title: "Empleo PTS (Antioquia)",
    value: "8.0%",
    badge: "Líder Nacional",
    description:
      "Participación en áreas Profesionales, Técnicas y Científicas.",
  },
]

function RankingsKPIs() {
  return (
    <section id="rankings-kpis" className="relative bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
        <h2 className="mb-5 text-[1.75rem] font-black tracking-tight text-[#253D36] sm:mb-7 sm:text-3xl md:text-4xl">
          Qué dicen los Rankings en el mundo de Medellín
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {RANKING_KPIS.map((kpi) => (
            <article
              key={kpi.title}
              className="flex min-h-40 flex-col rounded-[2px] border border-[#253D36]/10 bg-white p-4 shadow-[0_8px_24px_rgba(37,61,54,0.06)] sm:min-h-44 sm:p-6"
            >
              <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0068FF]/60">
                {kpi.title}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="text-3xl font-black tracking-tight text-[#212121]">
                  {kpi.value}
                </p>
                <span className="rounded-[2px] bg-[#00B8A3]/10 px-2 py-1 text-xs font-bold text-[#00B8A3]">
                  {kpi.badge}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#253D36]/70">
                {kpi.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const RANKINGS_SECTIONS = [
  { id: "rankings-hero", label: "Inicio" },
  { id: "rankings-pulso", label: "Pulso CTI" },
  { id: "rankings-kpis", label: "Indicadores" },
  { id: "rankings-cimi", label: "CIMI" },
  { id: "rankings-startupblink", label: "StartupBlink" },
  { id: "rankings-geial", label: "GEIAL" },
  { id: "documentos-oficiales", label: "Documentos" },
]

function RankingsPage() {
  return (
    <div className="overflow-x-clip">
      <style>{`
        @media (max-width: 767px) {
          html, body {
            scrollbar-width: none;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        }
      `}</style>
      <FloatingNav sections={RANKINGS_SECTIONS} />
      <RankingsBanner />
      <PulsoSection />
      <CorporateInnovationHighlight />
      <RankingsKPIs />
      <RankingsDataPanels />
      <section className="bg-[#F2F4F0] pb-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-12">
          <ExpandablePanel
            id="documentos-oficiales"
            title="Documentos oficiales del ranking"
          >
            <DataReportsSection
              title="Los documentos oficiales de rankings y mediciones del ecosistema."
              subtitle="Organizados por fuente y año, disponibles para descarga directa."
              eyebrow={null}
              compactMobile
              backgroundClassName="bg-[#F2F4F0]"
            />
          </ExpandablePanel>
        </div>
      </section>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <AnalisisCTIPage /> },
      { path: "radar-cti/data", element: <AnalisisCTIPage /> },
      { path: "radar-cti/rankings", element: <RankingsPage /> },
      {
        path: "lab-de-politicas/documentacion",
        element: <DocumentacionPage />,
      },
      { path: "lab-de-politicas/compras", element: <ComprasPage /> },
      { path: "lab-de-politicas/*", element: <LabPoliticasPage /> },
      { path: "radar-cti/pulso", element: <RedirectPulso /> },
      { path: "radar-cti/*", element: <RadarCTIPage /> },
      { path: "analisis-cti/*", element: <AnalisisCTIPage /> },
      { path: "blog/*", element: <BlogPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
