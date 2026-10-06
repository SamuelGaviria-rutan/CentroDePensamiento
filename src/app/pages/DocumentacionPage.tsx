import { useState, useEffect, useRef } from "react";
import { FloatingNav } from "../components/FloatingNav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search, ChevronDown, ArrowRight, Download, Activity, FileText,
  ExternalLink, ClipboardList, BarChart2
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Imports, types and data
// ─────────────────────────────────────────────────────────────────────────────

type NormType = "acuerdo" | "decreto" | "nacional";

const NORM_TYPE_LABELS: Record<NormType, string> = {
  acuerdo: "Acuerdo del Concejo",
  decreto: "Decreto de la Alcaldía",
  nacional: "Norma nacional",
};

const NORM_TYPE_COLORS: Record<NormType, string> = {
  acuerdo: "#C0D400",
  decreto: "#00B8A3",
  nacional: "#0068FF",
};

interface TimelineMilestone {
  id: string;
  period: string;
  norms: string;
  content: string;
  types: NormType[];
  vigencia: "Vigente" | "Modificada";
  vigenciaNote?: string;
}

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: "m2011",
    period: "2011–2012",
    norms: "Acuerdo 024",
    content: "El Plan CTi se adopta como política pública municipal.",
    types: ["acuerdo"],
    vigencia: "Modificada",
    vigenciaNote: "Modificada por Acuerdo 050 · 2021",
  },
  {
    id: "m2014",
    period: "2014–2015",
    norms: "Acuerdo 035 / Decreto 1485",
    content: "Política de Innovación y Emprendimiento Social y su reglamentación.",
    types: ["acuerdo", "decreto"],
    vigencia: "Vigente",
  },
  {
    id: "m2015",
    period: "2015–2018",
    norms: "Acuerdo 052 / Decreto 0082",
    content: "Política de Organizaciones de la Sociedad Civil y su reglamentación.",
    types: ["acuerdo", "decreto"],
    vigencia: "Vigente",
  },
  {
    id: "m2020",
    period: "2020–2022",
    norms: "Acuerdo 016 / Decreto 310",
    content: "Compra Pública de Innovación sostenible y su reglamentación.",
    types: ["acuerdo", "decreto"],
    vigencia: "Vigente",
  },
  {
    id: "m2021",
    period: "2021",
    norms: "Acto Legislativo 01 / Acuerdo 050",
    content: "Medellín, Distrito Especial de CTi; prórroga del Plan CTi 2011–2021.",
    types: ["nacional", "acuerdo"],
    vigencia: "Vigente",
  },
  {
    id: "m2023",
    period: "2023",
    norms: "Ley 2286 / Acuerdos 078, 092 y 093 / Decreto 1139",
    content: "Régimen del Distrito Especial CTi; Política Distrital CTi para la Sostenibilidad; Fondo Distrital CTi; Estampilla Pro-Innovación; Plan de Transición a Distrito.",
    types: ["nacional", "acuerdo", "decreto"],
    vigencia: "Vigente",
  },
  {
    id: "m2024",
    period: "2024",
    norms: "CONPES 4130 / Decreto 1082",
    content: "Política para la vocación CTi; modificación del Plan de Transición.",
    types: ["nacional", "decreto"],
    vigencia: "Vigente",
  },
  {
    id: "m2025",
    period: "2025–2026",
    norms: "Decretos 603, 1036, 015 y 0032",
    content: "Plan SDCTi 2024–2033; modificación del Plan de Transición; Política de Economía Circular; reglamentación del Fondo Distrital CTi.",
    types: ["decreto"],
    vigencia: "Vigente",
  },
];

interface MarcoRow {
  id: string;
  norma: string;
  articulaCon: string;
  rolRutaN: string;
}

const MARCO_ROWS: MarcoRow[] = [
  {
    id: "mn1",
    norma: "Acuerdo 035 · 2014",
    articulaCon: "Secretaría de Desarrollo Económico e Inclusión Social",
    rolRutaN: "Apoya la coordinación de la Red de Innovación y Emprendimiento Social; es miembro de su Secretaría Técnica.",
  },
  {
    id: "mn2",
    norma: "Acuerdo 052 · 2015",
    articulaCon: "Secretaría de Participación Ciudadana",
    rolRutaN: "Apoya el Centro de Innovación Social y las estrategias de formación en tecnologías para el empoderamiento.",
  },
  {
    id: "mn3",
    norma: "Acuerdo 016 · 2020",
    articulaCon: "Secretaría de Suministros y Servicios (líder)",
    rolRutaN: "Coordina las mesas de compras públicas innovadoras; participa en los comités técnico y operativo.",
  },
  {
    id: "mn4",
    norma: "Ley 2286 · 2023",
    articulaCon: "Organismo Asesor del Sistema Distrital CTi",
    rolRutaN: "El Director de Ruta N es miembro del Organismo Asesor del Sistema de CTi.",
  },
  {
    id: "mn5",
    norma: "Acuerdo 078 · 2023",
    articulaCon: "Secretaría de Desarrollo Económico (coordinadora)",
    rolRutaN: "Articulador técnico especializado del SDCTI: instrumentos, mecanismos, actores y recursos.",
  },
  {
    id: "mn6",
    norma: "Decreto 1139 · 2023",
    articulaCon: "Transversal a la Administración Distrital",
    rolRutaN: "Corresponsable de ajustar las políticas de emprendimiento y empleabilidad.",
  },
  {
    id: "mn7",
    norma: "Decreto 015 · 2025",
    articulaCon: "Secretarías de Medio Ambiente y de Desarrollo Económico (líderes)",
    rolRutaN: "Responsable o corresponsable de las estrategias de economía circular.",
  },
];

type DocResourceType = "documento" | "acta" | "tablero" | "video";

interface RepositoryDoc {
  id: string;
  title: string;
  type: DocResourceType;
  year: string;
  policy: string;
  description: string;
}

const REPOSITORY_DOCS: RepositoryDoc[] = [
  {
    id: "rd1",
    title: "Recomendaciones para la experimentación: participación en las mesas CONPES 4130",
    type: "documento",
    year: "2024",
    policy: "CONPES 4130",
    description: "Síntesis de las recomendaciones técnicas elaboradas por el Lab para el proceso participativo de construcción del CONPES 4130.",
  },
  {
    id: "rd2",
    title: "Modelo de gobernanza del Acuerdo 078",
    type: "documento",
    year: "2023",
    policy: "Acuerdo 078",
    description: "Propuesta de arquitectura institucional para el Sistema Distrital CTi conforme al Acuerdo 078 de 2023.",
  },
  {
    id: "rd3",
    title: "Informe del Plan de Transición y sus actualizaciones",
    type: "documento",
    year: "2024",
    policy: "Plan de Transición",
    description: "Estado de avance del plan de transición de Medellín al régimen de Distrito Especial de CTi, con las actualizaciones incorporadas por el Decreto 1082.",
  },
  {
    id: "rd4",
    title: "Informe de Economía Circular",
    type: "documento",
    year: "2025",
    policy: "Decreto 015",
    description: "Análisis de la política distrital de economía circular y su implementación en el marco del Decreto 015 de 2025.",
  },
  {
    id: "rd5",
    title: "Actas de Innovación y Emprendimiento",
    type: "acta",
    year: "2024",
    policy: "Acuerdo 035",
    description: "Registro de las sesiones de la Red de Innovación y Emprendimiento Social correspondientes al periodo [año].",
  },
  {
    id: "rd6",
    title: "Informe de Organizaciones Sociales",
    type: "documento",
    year: "2023",
    policy: "Acuerdo 052",
    description: "Seguimiento a la política de Organizaciones de la Sociedad Civil y sus resultados medidos en términos de innovación social.",
  },
  {
    id: "rd7",
    title: "Análisis normativo y acompañamiento a la experimentación",
    type: "documento",
    year: "2024",
    policy: "Acuerdo 078",
    description: "Marco jurídico y técnico para los mecanismos de experimentación en política pública habilitados por el SDCTI.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

function VigenciaBadge({
  vigencia,
  note,
}: {
  vigencia: "Vigente" | "Modificada";
  note?: string;
}) {
  const isVigente = vigencia === "Vigente";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-[3px] shrink-0"
      title={note}
      style={{
        fontFamily: "'Source Sans 3',Arial,sans-serif",
        background: isVigente ? "rgba(192,212,0,0.14)" : "rgba(255,76,23,0.1)",
        color: isVigente ? "#5E6A00" : "#C93800",
        border: `1px solid ${isVigente ? "rgba(192,212,0,0.3)" : "rgba(255,76,23,0.25)"}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: isVigente ? "#8FAA00" : "#FF4C17" }}
        aria-hidden="true"
      />
      {note ?? vigencia}
    </span>
  );
}

function NormTypePill({ type }: { type: NormType }) {
  const darkColors: Record<NormType, string> = {
    acuerdo: "#5E6A00",
    decreto: "#007A6B",
    nacional: "#0047B3",
  };
  return (
    <span
      className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] whitespace-nowrap"
      style={{
        fontFamily: "'Source Sans 3',Arial,sans-serif",
        background: `${NORM_TYPE_COLORS[type]}18`,
        color: darkColors[type],
        border: `1px solid ${NORM_TYPE_COLORS[type]}40`,
      }}
    >
      {NORM_TYPE_LABELS[type]}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Banner
// ─────────────────────────────────────────────────────────────────────────────

function DocBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
        );
      }
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.45 }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="doc-hero"
      className="bg-[#253D36] text-white pt-32 pb-20 px-6 lg:px-10 xl:px-12 relative overflow-hidden"
    >
      {/* Grid texture */}
      <div
        className="absolute right-0 top-0 w-[500px] h-full opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(192,212,0,1) 39px,rgba(192,212,0,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(192,212,0,1) 39px,rgba(192,212,0,1) 40px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="max-w-[760px]">
          <p
            className="text-[10px] tracking-[0.32em] uppercase font-bold mb-6"
            style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Documentación
          </p>
          <h1
            ref={headingRef}
            className="text-white mb-8"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(2rem,4.5vw,3.5rem)",
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              opacity: 0,
            }}
          >
            Quince años construyendo el Distrito CTI, norma por norma
          </h1>
          <div ref={bodyRef} style={{ opacity: 0 }}>
            <p
              className="text-white/70 mb-10 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "1.125rem",
                lineHeight: 1.7,
              }}
            >
              El repositorio de política pública de Ruta N y del ecosistema de ciencia, tecnología e innovación de Medellín. Cada acuerdo, cada decreto y cada ley que hizo posible lo que hoy es la ciudad, con su contexto, su contenido y el papel que jugamos en cada uno.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#cronologia"
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] px-6 transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36]"
                style={{
                  minHeight: 48,
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                }}
              >
                Recorrer la cronología
              </a>
              <a
                href="#repositorio"
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-white border border-white/30 rounded-[4px] px-6 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  minHeight: 48,
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                }}
              >
                Buscar una norma
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Bloque 1: Cronología interactiva
// ─────────────────────────────────────────────────────────────────────────────

function TimelineDetailPanel({ milestone }: { milestone: TimelineMilestone }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [milestone.id]);

  return (
    <div
      ref={panelRef}
      className="mt-8 p-8 rounded-[4px] border border-[rgba(37,61,54,0.12)] bg-white"
      role="region"
      aria-label={`Detalle: ${milestone.norms}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <p
            className="text-[10px] uppercase tracking-wider text-[#253D36]/40 mb-2"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            {milestone.period}
          </p>
          <h3
            className="text-[#253D36]"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {milestone.norms}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {milestone.types.map((t) => (
            <NormTypePill key={t} type={t} />
          ))}
        </div>
      </div>

      <p
        className="text-[#253D36]/70 mb-6 leading-relaxed"
        style={{
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          fontSize: "1rem",
          lineHeight: 1.7,
        }}
      >
        {milestone.content}
      </p>

      <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-[rgba(37,61,54,0.08)]">
        <VigenciaBadge vigencia={milestone.vigencia} note={milestone.vigenciaNote} />
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] rounded-sm"
          style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
        >
          Ver el texto oficial <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function DocCronologia() {
  const [activeFilter, setActiveFilter] = useState<NormType | "todos">("todos");
  const [selectedId, setSelectedId] = useState<string>("m2023");
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: prefersReduced ? 0.1 : 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (dotsContainerRef.current) {
        const wrappers =
          dotsContainerRef.current.querySelectorAll<HTMLElement>(".tl-dot-wrap");
        gsap.fromTo(
          wrappers,
          { opacity: 0, y: prefersReduced ? 0 : 14 },
          {
            opacity: 1,
            y: 0,
            duration: prefersReduced ? 0.1 : 0.45,
            ease: "power3.out",
            stagger: prefersReduced ? 0 : 0.07,
            delay: prefersReduced ? 0 : 0.55,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const FILTER_OPTIONS: { value: NormType | "todos"; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "acuerdo", label: "Acuerdo del Concejo" },
    { value: "decreto", label: "Decreto de la Alcaldía" },
    { value: "nacional", label: "Norma nacional" },
  ];

  const selectedMilestone =
    TIMELINE_MILESTONES.find((m) => m.id === selectedId) ?? null;

  return (
    <section
      ref={sectionRef}
      id="cronologia"
      className="bg-[#F7F7F5] px-6 py-24 lg:py-32 overflow-hidden relative"
      aria-labelledby="cronologia-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 1 · Cronología y evolución
          </p>
          <h2
            id="cronologia-heading"
            className="text-[#253D36] mb-4"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            De un plan municipal a un Distrito de Ciencia, Tecnología e Innovación
          </h2>
          <p
            className="text-[#253D36]/60 max-w-[640px] leading-relaxed"
            style={{
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Una línea de tiempo navegable que documenta el tránsito de la política municipal de CTI hacia la consolidación de Medellín como Distrito Especial, entre 2011 y 2026. Cada hito indica el nivel de la norma y qué cambió con ella.
          </p>
        </div>

        {/* Filter chips */}
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label="Filtrar por nivel de norma"
        >
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className="px-4 py-2 rounded-[4px] text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                background:
                  activeFilter === f.value ? "#253D36" : "rgba(37,61,54,0.08)",
                color: activeFilter === f.value ? "#C0D400" : "#253D36",
                border:
                  activeFilter === f.value
                    ? "1px solid #253D36"
                    : "1px solid transparent",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Desktop horizontal timeline ── */}
        <div className="hidden lg:block">
          <div className="relative" ref={dotsContainerRef}>
            {/* Track line */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-[rgba(37,61,54,0.1)]"
              style={{ top: 28 }}
              aria-hidden="true"
            >
              <div
                ref={lineRef}
                className="absolute inset-0 origin-left"
                style={{ background: "#253D36", transform: "scaleX(0)" }}
              />
            </div>

            {/* Milestone columns */}
            <div className="flex justify-between gap-1">
              {TIMELINE_MILESTONES.map((m) => {
                const visible =
                  activeFilter === "todos" ||
                  m.types.includes(activeFilter as NormType);
                const isSelected = selectedId === m.id;
                const primaryColor = NORM_TYPE_COLORS[m.types[0]];

                return (
                  <div
                    key={m.id}
                    className="tl-dot-wrap flex flex-col items-center shrink-0 flex-1"
                    style={{ minWidth: 80, opacity: 0 }}
                  >
                    <button
                      onClick={() => setSelectedId(m.id)}
                      aria-pressed={isSelected}
                      aria-label={`${m.period}: ${m.norms}`}
                      className="flex flex-col items-center gap-2 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] rounded-sm pt-1"
                      style={{
                        opacity: visible ? 1 : 0.2,
                        transition: "opacity 0.3s",
                      }}
                    >
                      {/* Dot */}
                      <div
                        className="w-[14px] h-[14px] rounded-full border-2 border-[#253D36] mt-[21px] transition-all duration-200"
                        style={{
                          background: isSelected ? primaryColor : "#F7F7F5",
                          transform: isSelected ? "scale(1.5)" : "scale(1)",
                          boxShadow: isSelected
                            ? `0 0 0 4px ${primaryColor}30`
                            : "none",
                        }}
                        aria-hidden="true"
                      />
                      {/* Year */}
                      <span
                        className="text-center"
                        style={{
                          fontFamily:
                            "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                          fontSize: "0.68rem",
                          fontWeight: isSelected ? 900 : 700,
                          color: isSelected ? "#253D36" : "rgba(37,61,54,0.6)",
                          lineHeight: 1.2,
                        }}
                      >
                        {m.period}
                      </span>
                      {/* Norm label abbreviated */}
                      <span
                        className="text-center px-1 leading-tight"
                        style={{
                          fontFamily: "'Source Sans 3',Arial,sans-serif",
                          fontSize: "0.6rem",
                          color: "rgba(37,61,54,0.45)",
                          lineHeight: 1.3,
                        }}
                      >
                        {m.norms.length > 18
                          ? m.norms.slice(0, 18) + "…"
                          : m.norms}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selectedMilestone && (
            <TimelineDetailPanel milestone={selectedMilestone} />
          )}

          <p
            className="text-[10px] text-[#253D36]/35 mt-5"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Avanza por la línea o salta directo a un año
          </p>
        </div>

        {/* ── Mobile vertical timeline ── */}
        <div className="block lg:hidden">
          <div className="relative pl-8">
            <div
              className="absolute left-[11px] top-0 bottom-0 w-[2px]"
              style={{ background: "rgba(37,61,54,0.15)" }}
              aria-hidden="true"
            />

            {TIMELINE_MILESTONES.map((m) => {
              const visible =
                activeFilter === "todos" ||
                m.types.includes(activeFilter as NormType);
              const isSelected = selectedId === m.id;
              const primaryColor = NORM_TYPE_COLORS[m.types[0]];

              return (
                <div
                  key={m.id}
                  className="relative"
                  style={{
                    opacity: visible ? 1 : 0.2,
                    transition: "opacity 0.3s",
                  }}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-[-29px] top-[22px] w-[10px] h-[10px] rounded-full border-2 border-[#253D36] transition-all duration-200"
                    style={{
                      background: isSelected ? primaryColor : "#F7F7F5",
                    }}
                    aria-hidden="true"
                  />

                  <button
                    onClick={() => setSelectedId(m.id)}
                    aria-expanded={isSelected}
                    className="w-full text-left py-5 border-b border-[rgba(37,61,54,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] rounded-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="font-black text-[#253D36]"
                        style={{
                          fontFamily:
                            "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                          fontSize: "0.8rem",
                        }}
                      >
                        {m.period}
                      </span>
                      {m.types.map((t) => (
                        <NormTypePill key={t} type={t} />
                      ))}
                    </div>
                    <p
                      className="text-[#253D36] mb-1"
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      {m.norms}
                    </p>
                    <p
                      className="text-[#253D36]/55"
                      style={{
                        fontFamily: "'Source Sans 3',Arial,sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {m.content}
                    </p>

                    {isSelected && (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <VigenciaBadge
                          vigencia={m.vigencia}
                          note={m.vigenciaNote}
                        />
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0068FF] hover:underline"
                          style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                        >
                          Ver el texto oficial <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Bloque 2: Ruta N en el marco normativo
// ─────────────────────────────────────────────────────────────────────────────

function DocRutaNMarco() {
  const [query, setQuery] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered = MARCO_ROWS.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.norma.toLowerCase().includes(q) ||
      r.articulaCon.toLowerCase().includes(q) ||
      r.rolRutaN.toLowerCase().includes(q)
    );
  });

  return (
    <section
      ref={sectionRef}
      id="doc-marco"
      className="bg-white px-6 py-24 lg:py-32 relative"
      aria-labelledby="marco-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 2 · Ruta N en el marco normativo
          </p>
          <h2
            id="marco-heading"
            className="text-[#253D36] mb-4"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Qué papel jugamos en cada norma
          </h2>
          <p
            className="text-[#253D36]/60 max-w-[640px] leading-relaxed mb-8"
            style={{
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Para cada norma relevante indicamos con qué secretarías u organismos distritales se articula Ruta N y cuál es el rol que tiene asignado. Es la forma más directa de entender dónde puede acompañar la organización y dónde no.
          </p>

          {/* Search */}
          <div className="relative max-w-[480px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#253D36]/35"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por norma o por secretaría…"
              className="w-full pl-11 pr-4 py-3 border border-[rgba(37,61,54,0.18)] rounded-[4px] bg-[#F7F7F5] text-[#253D36] focus:outline-none focus:ring-2 focus:ring-[#253D36] focus:border-transparent"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9rem",
              }}
              aria-label="Buscar por norma o secretaría"
            />
          </div>
        </div>

        {/* Desktop table header */}
        <div className="hidden lg:grid grid-cols-12 gap-6 pb-3 mb-1 border-b-2 border-[#253D36]">
          {(
            [
              ["col-span-3", "Norma"],
              ["col-span-4", "Se articula con"],
              ["col-span-5", "Rol de Ruta N"],
            ] as [string, string][]
          ).map(([cols, label]) => (
            <div
              key={label}
              className={`${cols} text-[10px] uppercase tracking-[0.2em] text-[#253D36]/50 font-bold`}
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-[#253D36]/40"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9375rem",
              }}
            >
              No encontramos normas con esos criterios. Prueba con el número del acuerdo o revisa la cronología completa.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((row) => {
              const isExpanded = mobileExpanded === row.id;
              return (
                <div
                  key={row.id}
                  className="border-b border-[rgba(37,61,54,0.08)] last:border-0"
                >
                  {/* Desktop row */}
                  <div className="hidden lg:grid grid-cols-12 gap-6 py-5 rounded-[2px] hover:bg-[#F7F7F5] transition-colors">
                    <div className="col-span-3">
                      <span
                        className="text-[#253D36]"
                        style={{
                          fontFamily:
                            "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                          fontSize: "0.875rem",
                          fontWeight: 800,
                          lineHeight: 1.3,
                        }}
                      >
                        {row.norma}
                      </span>
                    </div>
                    <div className="col-span-4">
                      <span
                        className="text-[#253D36]/70"
                        style={{
                          fontFamily: "'Source Sans 3',Arial,sans-serif",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {row.articulaCon}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <span
                        className="text-[#253D36]/70"
                        style={{
                          fontFamily: "'Source Sans 3',Arial,sans-serif",
                          fontSize: "0.9rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {row.rolRutaN}
                      </span>
                    </div>
                  </div>

                  {/* Mobile expandable card */}
                  <div className="lg:hidden">
                    <button
                      className="w-full text-left py-5 flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] rounded-sm"
                      onClick={() =>
                        setMobileExpanded(isExpanded ? null : row.id)
                      }
                      aria-expanded={isExpanded}
                    >
                      <span
                        className="text-[#253D36]"
                        style={{
                          fontFamily:
                            "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 800,
                        }}
                      >
                        {row.norma}
                      </span>
                      <ChevronDown
                        className="w-4 h-4 text-[#253D36]/40 shrink-0 transition-transform duration-200"
                        style={{
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div className="pb-5 space-y-4">
                        <div>
                          <p
                            className="text-[9px] uppercase tracking-wider text-[#253D36]/40 mb-1"
                            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                          >
                            Se articula con
                          </p>
                          <p
                            className="text-[#253D36]/65"
                            style={{
                              fontFamily: "'Source Sans 3',Arial,sans-serif",
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                            }}
                          >
                            {row.articulaCon}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[9px] uppercase tracking-wider text-[#253D36]/40 mb-1"
                            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                          >
                            Rol de Ruta N
                          </p>
                          <p
                            className="text-[#253D36]/65"
                            style={{
                              fontFamily: "'Source Sans 3',Arial,sans-serif",
                              fontSize: "0.875rem",
                              lineHeight: 1.55,
                            }}
                          >
                            {row.rolRutaN}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN — Bloque 3: Repositorio y seguimiento
// ─────────────────────────────────────────────────────────────────────────────

function getDocTypeMeta(type: DocResourceType): {
  label: string;
  color: string;
} {
  const map: Record<DocResourceType, { label: string; color: string }> = {
    documento: { label: "Documento", color: "#0068FF" },
    acta: { label: "Acta", color: "#FF4C17" },
    tablero: { label: "Tablero", color: "#00B8A3" },
    video: { label: "Video", color: "#FFCA00" },
  };
  return map[type];
}

function DocTypeIcon({ type }: { type: DocResourceType }) {
  if (type === "documento") return <FileText className="w-3.5 h-3.5" />;
  if (type === "acta") return <ClipboardList className="w-3.5 h-3.5" />;
  if (type === "tablero") return <BarChart2 className="w-3.5 h-3.5" />;
  return <Activity className="w-3.5 h-3.5" />;
}

function RepositoryCard({ doc }: { doc: RepositoryDoc }) {
  const meta = getDocTypeMeta(doc.type);
  return (
    <article className="bg-white rounded-[4px] border border-[rgba(37,61,54,0.1)] p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-[#253D36] focus-within:ring-offset-2 focus-within:ring-offset-[#F7F7F5]">
      {/* Type badge + year */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-[3px]"
          style={{
            fontFamily: "'Source Sans 3',Arial,sans-serif",
            background: `${meta.color}14`,
            color: meta.color,
            border: `1px solid ${meta.color}30`,
          }}
        >
          <DocTypeIcon type={doc.type} />
          {meta.label}
        </div>
        <span
          className="text-xs text-[#253D36]/40"
          style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
        >
          {doc.year}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-[#253D36] grow"
        style={{
          fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
          fontSize: "0.9375rem",
          fontWeight: 800,
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
        {doc.title}
      </h3>

      {/* Description */}
      <p
        className="text-[#253D36]/55"
        style={{
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
        }}
      >
        {doc.description}
      </p>

      {/* Policy tag */}
      <div
        className="text-[9px] uppercase tracking-wider text-[#253D36]/40 px-2 py-1 rounded-[2px] self-start"
        style={{
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          background: "rgba(37,61,54,0.06)",
        }}
      >
        {doc.policy}
      </div>

      {/* Link */}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] rounded-sm mt-auto"
        style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
        aria-label={`Ver el texto oficial de ${doc.title}`}
      >
        Ver el texto oficial <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </article>
  );
}

function DocRepositorio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<DocResourceType | "todos">("todos");
  const [activeYear, setActiveYear] = useState("todos");
  const sectionRef = useRef<HTMLElement>(null);

  const years = [
    "todos",
    ...Array.from(new Set(REPOSITORY_DOCS.map((d) => d.year))).sort((a, b) =>
      b.localeCompare(a)
    ),
  ];

  const typeFilters: (DocResourceType | "todos")[] = [
    "todos",
    "documento",
    "acta",
    "tablero",
    "video",
  ];

  const typeLabels: Record<DocResourceType | "todos", string> = {
    todos: "Todos",
    documento: "Documento",
    acta: "Acta",
    tablero: "Tablero",
    video: "Video",
  };

  const filtered = REPOSITORY_DOCS.filter((d) => {
    const matchType = activeType === "todos" || d.type === activeType;
    const matchYear = activeYear === "todos" || d.year === activeYear;
    const matchSearch =
      !searchQuery.trim() ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.year.includes(searchQuery);
    return matchType && matchYear && matchSearch;
  });

  return (
    <section
      ref={sectionRef}
      id="repositorio"
      className="bg-[#F7F7F5] px-6 py-24 lg:py-32 relative"
      aria-labelledby="repositorio-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 3 · Repositorio y seguimiento
          </p>
          <h2
            id="repositorio-heading"
            className="text-[#253D36] mb-4"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Documentos y seguimiento
          </h2>
          <p
            className="text-[#253D36]/60 max-w-[640px] leading-relaxed mb-8"
            style={{
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            Los documentos de política pública disponibles para consulta y descarga, junto con los informes de seguimiento que produce el Lab.
          </p>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative max-w-[440px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#253D36]/35"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por número de norma, año o tema…"
                className="w-full pl-11 pr-4 py-3 border border-[rgba(37,61,54,0.18)] rounded-[4px] bg-white text-[#253D36] focus:outline-none focus:ring-2 focus:ring-[#253D36] focus:border-transparent"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  fontSize: "0.875rem",
                }}
                aria-label="Buscar documentos por norma, año o tema"
              />
            </div>

            {/* Type chips */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filtrar por tipo de documento"
            >
              {typeFilters.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  aria-pressed={activeType === t}
                  className="px-3 py-2 rounded-[4px] text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{
                    fontFamily: "'Source Sans 3',Arial,sans-serif",
                    background: activeType === t ? "#253D36" : "white",
                    color: activeType === t ? "#C0D400" : "#253D36",
                    border: "1px solid rgba(37,61,54,0.18)",
                  }}
                >
                  {typeLabels[t]}
                </button>
              ))}
              <span
                className="self-center text-[#253D36]/25 text-xs select-none px-2"
                aria-hidden="true"
              >
                ·
              </span>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  aria-pressed={activeYear === y}
                  className="px-3 py-2 rounded-[4px] text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{
                    fontFamily: "'Source Sans 3',Arial,sans-serif",
                    background: activeYear === y ? "#253D36" : "white",
                    color: activeYear === y ? "#C0D400" : "#253D36",
                    border: "1px solid rgba(37,61,54,0.18)",
                  }}
                >
                  {y === "todos" ? "Todos los años" : y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p
              className="text-[#253D36]/40"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9375rem",
              }}
            >
              No encontramos normas con esos criterios. Prueba con el número del acuerdo o revisa la cronología completa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => (
              <RepositoryCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTACIÓN PAGE
// ─────────────────────────────────────────────────────────────────────────────

const DOC_SECTIONS = [
  { id: "doc-hero",   label: "Inicio" },
  { id: "cronologia", label: "Cronología" },
  { id: "doc-marco",  label: "Marco Ruta N" },
  { id: "repositorio", label: "Repositorio" },
];

export function DocumentacionPage() {
  return (
    <>
      <FloatingNav sections={DOC_SECTIONS} />
      <DocBanner />
      <DocCronologia />
      <DocRutaNMarco />
      <DocRepositorio />
    </>
  );
}
