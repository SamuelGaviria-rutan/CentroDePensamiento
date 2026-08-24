import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import novaBg from "../../imports/Nova_frontview-1.png";
import {
  Search, X, ChevronDown, ArrowRight, ArrowDown, Download, ArrowUpRight,
  Info, Database, Activity, Image as ImageIcon, SlidersHorizontal,
  BookOpen, Sparkles, Send, FileText
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// ANÁLISIS CTI — Section 1: Banner principal
// ─────────────────────────────────────────────────────────────────────────────

function AnalisisCTIHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

      tl.fromTo(leftColRef.current?.children ? Array.from(leftColRef.current.children) : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1 }
      )
      .fromTo(rightColRef.current?.children ? Array.from(rightColRef.current.children) : [],
        { opacity: 0, x: 20, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.1 },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#253D36] text-white overflow-hidden relative"
      style={{ minHeight: "60svh", paddingTop: 140, paddingBottom: 100 }}
      aria-labelledby="analisis-hero-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: Text & Search (Takes up 7 columns on desktop) ── */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col">
            <p
              className="text-[10px] tracking-[0.32em] uppercase mb-6"
              style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", fontWeight: "bold" }}
            >
              ANÁLISIS CTI · INVESTIGACIÓN
            </p>

            <h1
              id="analisis-hero-title"
              className="mb-6"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Aquí el dato se vuelve criterio
            </h1>

            <p
              className="text-lg md:text-xl mb-12 max-w-2xl"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Esta es la parte más densa del Centro de Pensamiento: informes de tendencias, vigilancia tecnológica y análisis a profundidad, construidos a la medida de las preguntas reales de Medellín y su ecosistema. No son lecturas rápidas. Son las que sostienen decisiones que duran años.
            </p>

            {/* Prominent Search Bar */}
            <div className="relative max-w-xl mb-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#253D36]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Busca un informe por título, tema o palabra clave…"
                className="w-full bg-white text-[#111111] pl-14 pr-5 py-4 rounded-sm border-2 border-transparent focus:outline-none focus:border-[#C0D400] transition-colors"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", fontSize: "16px" }}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#253D36] text-white px-4 py-2 rounded-[2px] font-bold text-sm transition-colors hover:bg-[#1C2E29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
              >
                Buscar
              </button>
            </div>

            {/* Microdato */}
            <p
              className="text-xs font-semibold mb-10"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              [N] publicaciones · [N] descargas en [año]
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#categorias"
                className="inline-flex items-center justify-center font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{ minHeight: 48, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
              >
                Explorar por categoría
              </a>
              <a
                href="#destacados"
                className="inline-flex items-center gap-2 font-bold text-sm text-white hover:text-[#C0D400] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
              >
                Ver los más descargados
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Cover Mosaic (Takes up 5 columns on desktop) ── */}
          <div ref={rightColRef} className="lg:col-span-5 relative h-[400px] lg:h-[500px] w-full hidden md:block">
            {/* The mosaic structure - representing reports */}

            {/* Cover 1 - Back left */}
            <div className="absolute top-[10%] left-[5%] w-[45%] aspect-[1/1.414] bg-[#F2F4F0] rounded-sm shadow-xl flex flex-col p-4 opacity-60 -rotate-6 transform origin-bottom-right" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-8 h-1 bg-[#0068FF] mb-3" />
              <div className="w-full h-2 bg-[#253D36]/20 mb-2 rounded-sm" />
              <div className="w-3/4 h-2 bg-[#253D36]/20 mb-auto rounded-sm" />
              <div className="w-full h-1/2 bg-[#253D36]/10 rounded-sm" />
            </div>

            {/* Cover 2 - Back right */}
            <div className="absolute top-[5%] right-[5%] w-[50%] aspect-[1/1.414] bg-white rounded-sm shadow-2xl flex flex-col p-5 opacity-80 rotate-3 transform origin-bottom-left" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="w-10 h-1.5 bg-[#00B8A3] mb-4" />
              <div className="w-full h-3 bg-[#253D36] mb-2 rounded-sm" />
              <div className="w-4/5 h-3 bg-[#253D36] mb-2 rounded-sm" />
              <div className="w-2/3 h-3 bg-[#253D36] mb-auto rounded-sm" />
              <div className="w-full aspect-video bg-[#F2F4F0] rounded-sm relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#00B8A3] rounded-full translate-x-1/3 translate-y-1/3 opacity-20" />
              </div>
            </div>

            {/* Cover 3 - Front center (Hero cover) */}
            <div className="absolute bottom-[5%] left-[20%] w-[55%] aspect-[1/1.414] bg-[#FAFAF8] rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col p-6 z-10 -rotate-2">
              <p className="text-[8px] font-bold tracking-widest text-[#253D36]/50 mb-4 uppercase" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Vigilancia Tecnológica</p>
              <h3 className="text-xl font-black text-[#253D36] mb-3 leading-tight" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                El impacto de la Inteligencia Artificial
              </h3>
              <div className="w-full h-full bg-[#EBF2EA] rounded-sm mt-auto relative overflow-hidden flex items-center justify-center border border-[rgba(37,61,54,0.05)]">
                <div className="w-20 h-20 border-[6px] border-[#C0D400] rounded-full opacity-80 mix-blend-multiply" />
                <div className="absolute top-4 left-4 w-12 h-12 bg-[#00B8A3] rounded-sm opacity-20 mix-blend-multiply rotate-12" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANÁLISIS CTI — Section 2: Clasificación y guía de navegación
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  {
    id: "tendencias",
    title: "Informes de tendencias",
    desc: "Prospectiva a mediano y largo plazo: hacia dónde se mueve un sector y qué significa para Medellín. Lectura larga, con escenarios y recomendaciones.",
  },
  {
    id: "vigilancia",
    title: "Vigilancia tecnológica",
    desc: "Monitoreo sistemático de tecnologías emergentes, patentes, actores y señales tempranas. Para anticipar antes de que sea evidente.",
  },
  {
    id: "ecosistema",
    title: "Análisis de ecosistema",
    desc: "Radiografías sectoriales construidas con datos propios y de aliados.",
  },
  {
    id: "notas",
    title: "Notas de análisis",
    desc: "Documentos breves que traducen un hallazgo en una recomendación accionable. Diez minutos de lectura, una conclusión clara.",
  },
  {
    id: "memorias",
    title: "Memorias y talleres",
    desc: "Materiales de apropiación y formación producidos por el Centro de Pensamiento.",
  }
];

const TOPICS = [
  "Inteligencia artificial", "Deeptech", "Economía circular", "Ciudades inteligentes",
  "Talento y educación", "Emprendimiento y startups", "Política pública CTI",
  "Sostenibilidad", "Industrias creativas", "Transferencia de tecnología"
];

const YEARS = ["Todos", "2024", "2023", "2022", "2021", "2020"];

function AnalisisCTILibrary() {
  const sectionRef = useRef<HTMLElement>(null);

  // States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("Todos");
  const [sortOrder, setSortOrder] = useState<string>("Más recientes");

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;

    if (!gsap.plugins.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".library-fade-up",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedYear("Todos");
  };

  // Mocking results count
  const isSearchEmpty = selectedTopics.includes("Deeptech") && selectedYear === "2020";
  const resultCount = isSearchEmpty ? 0 : 42 - (selectedTypes.length * 3) - (selectedTopics.length * 2) - (selectedYear !== "Todos" ? 15 : 0);

  return (
    <section ref={sectionRef} id="categorias" className="py-24 lg:py-32 bg-[#FAFAF8]" style={{ borderTop: "1px solid rgba(37,61,54,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        {/* ── INTRO ── */}
        <div className="library-fade-up max-w-3xl mb-16">
          <h2 className="text-[#253D36] mb-6" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Cómo recorrer esta biblioteca
          </h2>
          <p className="text-lg" style={{ color: "rgba(37,61,54,0.75)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}>
            Organizamos cada publicación en tres capas: qué tipo de documento es, sobre qué tema trata y de qué año es. Puedes combinarlas libremente. Nuestra recomendación: empieza por el tema si sabes qué te interesa, empieza por el tipo si sabes cómo quieres leerlo, y usa el buscador si ya sabes exactamente qué necesitas.
          </p>
        </div>

        {/* ── FILTERS ── */}
        <div className="flex flex-col gap-12 mb-16">

          {/* Capa 1: Tipo */}
          <div className="library-fade-up flex flex-col gap-4">
            <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#00B8A3]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Capa 1 · Tipo de contenido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {CONTENT_TYPES.map(type => {
                const isActive = selectedTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className="group text-left p-5 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                    style={{
                      backgroundColor: isActive ? "#253D36" : "white",
                      border: isActive ? "1px solid #253D36" : "1px solid rgba(37,61,54,0.12)",
                      boxShadow: isActive ? "0 8px 24px rgba(37,61,54,0.15)" : "none",
                    }}
                  >
                    <h4
                      className="text-sm font-bold mb-2 transition-colors"
                      style={{ color: isActive ? "#FFFFFF" : "#253D36", fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
                    >
                      {type.title}
                    </h4>
                    <p
                      className="text-xs transition-colors"
                      style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(37,61,54,0.6)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.5 }}
                    >
                      {type.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Capa 2: Tema */}
            <div className="library-fade-up lg:col-span-8 flex flex-col gap-4">
              <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#00B8A3]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Capa 2 · Tema</h3>
              <div className="flex flex-wrap gap-2.5">
                {TOPICS.map(topic => {
                  const isActive = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                      style={{
                        fontFamily: "'Source Sans 3',Arial,sans-serif",
                        backgroundColor: isActive ? "#C0D400" : "transparent",
                        color: "#253D36",
                        border: isActive ? "1px solid #C0D400" : "1px solid rgba(37,61,54,0.2)",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(37,61,54,0.05)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capa 3: Año */}
            <div className="library-fade-up lg:col-span-4 flex flex-col gap-4">
              <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#00B8A3]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Capa 3 · Año</h3>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none bg-white text-[#253D36] font-bold text-sm px-5 py-3.5 border border-[rgba(37,61,54,0.2)] rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] transition-colors hover:bg-[rgba(37,61,54,0.02)]"
                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <ChevronDown className="w-5 h-5 text-[#253D36] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          </div>

        </div>

        {/* ── ACTIVE FILTERS & RESULTS HEADER ── */}
        <div className="library-fade-up bg-[#FAFAF8] py-4" style={{ borderBottom: "1px solid rgba(37,61,54,0.1)" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                {resultCount} publicaciones coinciden con tu búsqueda
              </p>

              {/* Active Filter Chips */}
              {(selectedTypes.length > 0 || selectedTopics.length > 0 || selectedYear !== "Todos") && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTypes.map(id => {
                    const title = CONTENT_TYPES.find(t => t.id === id)?.title;
                    return (
                      <button key={id} onClick={() => toggleType(id)} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#253D36] text-white rounded-[2px] text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                        Tipo: {title} <X className="w-3 h-3 opacity-70 hover:opacity-100" />
                      </button>
                    );
                  })}
                  {selectedTopics.map(topic => (
                    <button key={topic} onClick={() => toggleTopic(topic)} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C0D400] text-[#253D36] rounded-[2px] text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      Tema: {topic} <X className="w-3 h-3 opacity-70 hover:opacity-100" />
                    </button>
                  ))}
                  {selectedYear !== "Todos" && (
                    <button onClick={() => setSelectedYear("Todos")} className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(37,61,54,0.1)] text-[#253D36] rounded-[2px] text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      Año: {selectedYear} <X className="w-3 h-3 opacity-70 hover:opacity-100" />
                    </button>
                  )}
                  <button onClick={clearAllFilters} className="text-xs font-bold text-[#0068FF] hover:underline ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                    Quitar todos los filtros
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-[#253D36]/60 flex items-center gap-1" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                <SlidersHorizontal className="w-3.5 h-3.5" /> Orden:
              </span>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-transparent text-sm font-bold text-[#253D36] pr-6 py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
                  style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                >
                  <option value="Más recientes">Más recientes</option>
                  <option value="Más descargados">Más descargados</option>
                  <option value="A–Z">A–Z</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#253D36] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              </div>
            </div>

          </div>
        </div>

        {/* ── RESULTS AREA (Empty State or Grid) ── */}
        <div className="library-fade-up pt-12 pb-16 min-h-[400px]">
          {isSearchEmpty ? (
            <div className="text-center py-20 bg-white rounded-md border border-dashed border-[rgba(37,61,54,0.15)] max-w-3xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#FAFAF8] flex items-center justify-center mb-5" style={{ border: "1px solid rgba(37,61,54,0.06)" }}>
                <Search className="w-6 h-6 text-[#253D36]/30" />
              </div>
              <h3 className="text-xl font-bold text-[#253D36] mb-3" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>Sin resultados</h3>
              <p className="text-[#253D36]/60 mb-6 max-w-md leading-relaxed" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                No encontramos nada con esa combinación. Prueba ampliando el año o quitando un filtro. Si crees que deberíamos estar analizando ese tema, cuéntanoslo.
              </p>
              <button onClick={clearAllFilters} className="font-bold text-sm text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Dummy cards to represent grid */}
              {Array.from({ length: Math.min(8, resultCount) }).map((_, i) => (
                <div key={i} className="bg-white rounded-md overflow-hidden flex flex-col group transition-all hover:shadow-lg border border-[rgba(37,61,54,0.08)] focus-within:ring-2 focus-within:ring-[#C0D400]">
                  <div className="w-full aspect-[4/3] bg-[#EBF2EA] relative overflow-hidden flex items-center justify-center">
                    <div className="w-16 h-20 bg-white shadow-sm -rotate-3 rounded-sm border border-[rgba(37,61,54,0.05)]" />
                    <div className="absolute top-3 left-3 bg-[#00B8A3] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] shadow-sm">
                      {selectedTypes[0] ? CONTENT_TYPES.find(t => t.id === selectedTypes[0])?.title : "Informe"}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-bold text-[#0068FF] mb-2" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      {selectedTopics[0] || "Inteligencia artificial"}
                    </p>
                    <h4 className="text-lg font-bold text-[#253D36] mb-3 leading-tight group-hover:text-[#0068FF] transition-colors" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                      <a href="#reporte" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        Reporte de evaluación y prospectiva {selectedYear !== "Todos" ? selectedYear : "2024"}
                      </a>
                    </h4>
                    <p className="text-xs text-[#253D36]/50 mt-auto" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Publicado: {selectedYear !== "Todos" ? selectedYear : "Oct 2024"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ANÁLISIS CTI — Section 3: Informes destacados y más descargados
// ─────────────────────────────────────────────────────────────────────────────

const FEATURED_REPORTS = [
  {
    id: "rep-1",
    title: "Medellín Tech Report 2024: Mapeo y evolución del ecosistema",
    type: "Análisis de ecosistema",
    topic: "Emprendimiento y startups",
    year: "2024",
    summary: "Una radiografía completa de las startups de base tecnológica en la ciudad. Analizamos las tasas de supervivencia, las rondas de inversión levantadas en el último año y las brechas de talento más apremiantes según los propios fundadores. Incluye el censo oficial de actores del Distrito CTI.",
    pages: 120,
    mb: 15,
    downloads: "1.2k",
    color: "#C0D400"
  },
  {
    id: "rep-2",
    title: "Adopción de IA en Mipymes locales",
    type: "Vigilancia tecnológica",
    topic: "Inteligencia artificial",
    year: "2024",
    summary: "Casos de uso reales, barreras de entrada y herramientas de bajo costo que están transformando la productividad de las pequeñas empresas.",
    pages: 45,
    mb: 4.2,
    downloads: "840",
    color: "#00B8A3"
  },
  {
    id: "rep-3",
    title: "El futuro del talento IT",
    type: "Informes de tendencias",
    topic: "Talento y educación",
    year: "2024",
    summary: "Proyecciones de demanda laboral tecnológica para la próxima década y recomendaciones para la actualización curricular.",
    pages: 60,
    mb: 6.0,
    downloads: "650",
    color: "#0068FF"
  },
  {
    id: "rep-4",
    title: "Circularidad en la industria local",
    type: "Notas de análisis",
    topic: "Economía circular",
    year: "2023",
    summary: "Cinco modelos de negocio circular que están logrando rentabilidad en el Valle de Aburrá sin depender de subsidios.",
    pages: 15,
    mb: 1.2,
    downloads: "520",
    color: "#FFCA00"
  },
  {
    id: "rep-5",
    title: "Impacto del Distrito CTI",
    type: "Memorias y talleres",
    topic: "Política pública CTI",
    year: "2023",
    summary: "Resultados del primer año de implementación de la política pública y retos en la articulación interinstitucional.",
    pages: 85,
    mb: 8.5,
    downloads: "410",
    color: "#FF4C17"
  }
];

function AnalisisCTIFeatured() {
  const [activeTab, setActiveTab] = useState("Más descargados");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;
    if (!gsap.plugins.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(".featured-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab || isTransitioning) return;
    if (reduced.current) {
      setActiveTab(tab);
      return;
    }

    setIsTransitioning(true);
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.to(cards, {
      opacity: 0, y: -10, duration: 0.2, stagger: 0.05, ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        requestAnimationFrame(() => {
          const newCards = gridRef.current?.children;
          if (!newCards) { setIsTransitioning(false); return; }
          gsap.fromTo(newCards,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", onComplete: () => setIsTransitioning(false) }
          );
        });
      }
    });
  };

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        {/* ── HEADER ── */}
        <div className="featured-fade max-w-3xl mb-12">
          <h2 className="text-[#253D36] mb-5" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", fontSize: "clamp(2.25rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Los más consultados
          </h2>
          <p className="text-lg" style={{ color: "rgba(37,61,54,0.75)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}>
            Lo que el ecosistema está leyendo ahora mismo. Buen punto de partida si no sabes por dónde empezar.
          </p>
        </div>

        {/* ── TABS ── */}
        <div className="featured-fade mb-12" role="tablist">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {["Más descargados", "Más recientes", "Selección de Nova"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab)}
                  className="whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                    backgroundColor: isActive ? "#253D36" : "#F2F4F0",
                    color: isActive ? "#FFFFFF" : "#253D36",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(37,61,54,0.1)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "#F2F4F0"; }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GRID (Estantería) ── */}
        <div ref={gridRef} className="featured-fade grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {FEATURED_REPORTS.map((report, idx) => {
            const isFeatured = idx === 0;

            return (
              <article
                key={report.id}
                className={`group flex flex-col bg-[#FAFAF8] relative overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,61,54,0.15)] shadow-[0_8px_20px_rgba(37,61,54,0.08)] ${isFeatured ? "col-span-1 md:col-span-2 xl:col-span-2" : "col-span-1"}`}
                style={{
                  border: "1px solid rgba(37,61,54,0.1)",
                  borderLeft: `8px solid ${report.color}`,
                  borderRadius: "2px 6px 6px 2px",
                  minHeight: isFeatured ? "auto" : "460px"
                }}
              >
                {/* Lomo / Spine shading */}
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />

                {/* Sutil textura de papel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

                {/* Contenido impreso en la portada */}
                <div className="flex flex-col flex-1 p-8 lg:p-10 relative z-10">
                  <div className="mb-6">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-[2px] text-[10px] font-bold tracking-widest uppercase mb-6"
                      style={{ backgroundColor: "rgba(37,61,54,0.06)", color: "#253D36", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                    >
                      {report.type}
                    </span>
                    <h3
                      className={`font-black text-[#253D36] mb-4 leading-tight group-hover:text-[#0068FF] transition-colors ${isFeatured ? "text-3xl lg:text-4xl pr-8" : "text-2xl"}`}
                      style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.02em" }}
                    >
                      <a href="#descargar" className="focus-visible:outline-none before:absolute before:inset-0 before:z-10">
                        {report.title}
                      </a>
                    </h3>
                    <p
                      className={`text-[#253D36]/70 leading-relaxed ${isFeatured ? "text-lg line-clamp-4" : "text-sm line-clamp-3"}`}
                      style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                    >
                      {report.summary}
                    </p>
                  </div>

                  <div className="mt-auto pt-8 flex flex-col gap-5">
                    {/* Metadatos superiores (Tema, Año) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      <span style={{ color: report.color === "#C0D400" ? "#8A9900" : report.color }}>{report.topic}</span>
                      <span className="text-[#253D36]/30">·</span>
                      <span className="text-[#253D36]/60">{report.year}</span>
                    </div>

                    {/* Metadatos técnicos */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#253D36]/60 font-medium" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      <span>PDF</span>
                      <span className="text-[#253D36]/30">·</span>
                      <span>{report.pages} páginas</span>
                      <span className="text-[#253D36]/30">·</span>
                      <span>{report.mb} MB</span>
                      <span className="text-[#253D36]/30">·</span>
                      <span className="font-bold text-[#253D36]">{report.downloads} descargas</span>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-5 mt-2 relative z-20" style={{ borderTop: "1px solid rgba(37,61,54,0.1)", paddingTop: "1rem" }}>
                      <a href="#pdf" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                        <Download className="w-4 h-4" /> Descargar PDF
                      </a>
                      <a href="#leer" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#253D36] hover:text-[#00B8A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm transition-colors" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                        <BookOpen className="w-4 h-4" /> Leer en línea
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="featured-fade flex flex-col items-center justify-center border-t border-[rgba(37,61,54,0.1)] pt-12 text-center">
          <a
            href="/analisis-cti/publicaciones"
            className="inline-flex items-center justify-center font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 px-8 mb-6"
            style={{ minHeight: 52, fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
          >
            Ver todas las publicaciones
          </a>
          <p className="text-xs text-[#253D36]/50 max-w-md mx-auto mb-16" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.5 }}>
            No pedimos registro para descargar. El conocimiento del Centro de Pensamiento es público.
          </p>

          <div className="bg-[#EBF2EA] w-full p-8 md:p-12 rounded-md flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderLeft: "4px solid #00B8A3" }}>
            <div className="text-left max-w-xl">
              <h3 className="text-xl font-bold text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-sm text-[#253D36]/70" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                Cuéntanos qué necesita analizar la ciudad.
              </p>
            </div>
            <a href="#sugerir" className="shrink-0 inline-flex items-center font-bold text-sm text-white bg-[#253D36] rounded-[4px] hover:bg-[#1C2E29] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] px-6 py-3" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>
              Sugerir un tema
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ANÁLISIS CTI — Section 4: Pregúntale al Centro de Pensamiento (NOVA AI)
// ─────────────────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "¿Cuál fue el puesto de Medellín en StartupBlink este año?",
  "¿Qué proyectos ejecutó Ruta N en apropiación social de la CTI?",
  "¿Qué normas regulan la compra pública de innovación en Medellín?",
  "¿Cuánto invierte la ciudad en investigación y desarrollo?"
];

// ─── Wave canvas hook ────────────────────────────────────────────────────────
function useWaveCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  chatState: string,
  typeDone: boolean
) {
  const ampRef = useRef({ value: 0 });
  const rafRef = useRef<number>(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  
  // Utilizaremos un ref para mantener actualizados los estados dentro del loop de requestAnimationFrame
  const stateRef = useRef({ chatState, typeDone });
  useEffect(() => {
    stateRef.current = { chatState, typeDone };
  }, [chatState, typeDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adjusted frequencies and speeds to simulate voice modulation
    const waves = [
      { freq: 0.035, speed: 0.12, amp: 0.90, phase: 0,    color: "rgba(192,212,0,0.8)" },
      { freq: 0.050, speed: 0.15, amp: 0.65, phase: 2.1,  color: "rgba(0,184,163,0.6)" },
      { freq: 0.025, speed: 0.08, amp: 0.50, phase: 4.3,  color: "rgba(192,212,0,0.4)" },
      { freq: 0.040, speed: 0.10, amp: 0.35, phase: 1.2,  color: "rgba(255,255,255,0.3)" },
    ];

    let tick = 0;
    let voiceAmp = 0;
    let targetVoiceAmp = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const { chatState, typeDone } = stateRef.current;
      const isSpeaking = (chatState === "answered" || chatState === "error") && !typeDone;
      
      const { width, height } = canvas;
      const baseAmp = ampRef.current.value;
      ctx.clearRect(0, 0, width, height);

      // Simulate a voice audio signal changing over time only if speaking
      if (tick % 6 === 0) {
        if (isSpeaking) {
          // Voice phoneme spikes
          targetVoiceAmp = baseAmp > 0.1 ? 0.3 + Math.random() * 0.7 : 0.1;
        } else {
          // Flat/silence when thinking or idle
          targetVoiceAmp = 0.02; 
        }
      }
      
      // Smooth interpolation towards target voice amplitude
      voiceAmp += (targetVoiceAmp - voiceAmp) * 0.2;

      waves.forEach((w) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          // Envelope: tapers off at the edges (0) and is max at the center (1)
          const normalizedX = x / width;
          const envelope = Math.pow(Math.sin(normalizedX * Math.PI), 1.8);

          // Calculate sine wave responding to time, frequency, base activation, and voice peaks
          const audioWave = Math.sin(x * w.freq + tick * w.speed + w.phase);
          const y = height / 2 + audioWave * ((height / 2.2) * w.amp * baseAmp * voiceAmp * envelope);
          
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2.5; // Thicker lines for voice effect
        ctx.lineCap = "round";
        ctx.stroke();
      });

      tick++;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [canvasRef]);

  // Animate amplitude in/out based on state
  useEffect(() => {
    const isSpeaking = (chatState === "answered" || chatState === "error") && !typeDone;
    
    tweenRef.current?.kill();
    if (isSpeaking) {
      tweenRef.current = gsap.to(ampRef.current, { value: 1, duration: 0.6, ease: "power2.out" });
    } else {
      // Return to flat line quickly when not speaking
      tweenRef.current = gsap.to(ampRef.current, { value: 0, duration: 0.8, ease: "power3.inOut" });
    }
  }, [chatState, typeDone]);
}

// ─── Typewriter hook ─────────────────────────────────────────────────────────
function useTypewriter(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return { displayed, done };
}

const NOVA_ANSWER = `En la edición 2024 del Global Startup Ecosystem Index (publicada por StartupBlink), Medellín se ubicó en el puesto 65 a nivel global, escalando 5 posiciones respecto al año anterior. A nivel regional (América Latina y el Caribe), la ciudad se consolidó como el quinto ecosistema más fuerte y el segundo a nivel nacional después de Bogotá.`;

const NOVA_ERROR = `Esto excede lo que tengo documentado. Puedes buscarlo manualmente en la biblioteca o escribirle al equipo del Centro de Pensamiento.`;

function AnalisisCTINova() {
  const [question, setQuestion]   = useState("");
  const [chatState, setChatState] = useState<"idle" | "typing" | "answered" | "error">("idle");
  const sectionRef  = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const answerText = chatState === "error" ? NOVA_ERROR : NOVA_ANSWER;
  const typeActive = chatState === "answered" || chatState === "error";
  const { displayed, done: typeDone } = useTypewriter(answerText, typeActive);

  // Pasamos el chatState y typeDone al hook para que reaccione exactamente al habla
  useWaveCanvas(canvasRef, chatState, typeDone);

  // Status computation for UI elements
  const isSpeaking = (chatState === "answered" || chatState === "error") && !typeDone;

  // Section entrance
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );
  }, []);

  // Auto-scroll chat body
  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [displayed, chatState]);

  const handleAsk = (e?: React.FormEvent, presetQ?: string) => {
    e?.preventDefault();
    const q = presetQ ?? question;
    if (!q.trim() || chatState === "typing") return;
    setQuestion(q);
    setChatState("typing");
    setTimeout(() => {
      setChatState(
        q.toLowerCase().includes("startupblink") || q.toLowerCase().includes("puesto")
          ? "answered"
          : "error"
      );
    }, 1800);
  };

  const resetChat = () => { setQuestion(""); setChatState("idle"); inputRef.current?.focus(); };

  return (
    <section
      ref={sectionRef}
      className="py-14 lg:py-20 bg-[#111111] relative overflow-hidden"
      aria-labelledby="nova-heading"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url(${novaBg})`,
          backgroundSize: "cover",
          backgroundPosition: "calc(60% + 110px) center", // Desplazado ~110px a la derecha
          backgroundRepeat: "no-repeat",
          opacity: 0.35 // Reducimos la opacidad para que se mezcle mejor con el fondo negro
        }} 
      />
      {/* Top and bottom fade for better integration */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "linear-gradient(to bottom, #111111 0%, transparent 20%, transparent 80%, #111111 100%)" }} />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(192,212,0,0.15) 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 relative z-10 flex flex-col items-center">

        {/* ── Section header ── */}
        <div className="text-center max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full"
            style={{ background: "rgba(192,212,0,0.08)", border: "1px solid rgba(192,212,0,0.2)" }}>
            <Sparkles className="w-3.5 h-3.5 text-[#C0D400]" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#C0D400]"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
              NOVA AI
            </span>
          </div>
          <h2
            id="nova-heading"
            className="text-white mb-4"
            style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", fontSize: "clamp(1.75rem,3.2vw,2.75rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            ¿Y si pudieras preguntarle directamente al archivo?
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.60)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.55 }}>
            Puedo consultar por ti los informes, planes y reportes de gestión de Ruta N y responderte en lenguaje natural, citando siempre el documento del que salió la respuesta. Si algo no está en mis fuentes, te lo digo: prefiero un "no lo sé" honesto a un dato inventado.
          </p>
        </div>

        {/* ── Chat interface ── */}
        <div
          ref={containerRef}
          className="w-full max-w-4xl flex flex-col relative z-10"
        >
          {/* ── Interface header bar ── */}
          <div className="flex items-center justify-between px-2 py-2.5 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#C0D400]" style={{ boxShadow: isSpeaking ? "0 0 8px #C0D400" : "none", transition: "box-shadow 0.5s" }} aria-hidden="true" />
              <span className="text-[12px] font-bold text-white/70 tracking-[0.12em] uppercase"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                Nova · Centro de Pensamiento
              </span>
            </div>
            {chatState !== "idle" && (
              <button
                onClick={resetChat}
                className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0D400] rounded-sm px-1"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                aria-label="Limpiar conversación"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" /> Limpiar
              </button>
            )}
          </div>

          {/* ── Wave canvas zone ── */}
          <div
            className="relative"
            style={{
              height: 64,
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
              style={{ display: "block" }}
            />
            {/* Center state label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {chatState === "typing" && (
                <span className="text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: "rgba(192,212,0,0.5)", fontFamily: "'Source Sans 3',Arial,sans-serif", background: "rgba(17,17,17,0.7)", padding: "4px 8px", borderRadius: "4px" }}>
                  procesando…
                </span>
              )}
            </div>
          </div>

          {/* ── Chat body ── */}
          <div
            ref={chatBodyRef}
            className="flex flex-col gap-5 px-2 py-4 overflow-y-auto"
            style={{ minHeight: 170, maxHeight: 300 }}
            aria-live="polite"
            aria-label="Conversación con Nova"
          >
            {/* Idle: suggested questions */}
            {chatState === "idle" && (
              <div className="flex flex-col gap-4 mt-auto">
                <p className="text-[10px] font-bold tracking-[0.22em] uppercase"
                  style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Preguntas sugeridas
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleAsk(undefined, q)}
                      className="text-left px-5 py-4 rounded-xl text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0D400]"
                      style={{
                        fontFamily: "'Source Sans 3',Arial,sans-serif",
                        lineHeight: 1.45,
                        color: "rgba(255,255,255,0.75)",
                        background: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(192,212,0,0.1)";
                        e.currentTarget.style.borderColor = "rgba(192,212,0,0.3)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active conversation */}
            {chatState !== "idle" && (
              <div className="flex flex-col gap-5">

                {/* User bubble */}
                <div className="self-end max-w-[85%] px-5 py-4 rounded-t-2xl rounded-bl-2xl text-[15px]"
                  style={{
                    background: "rgba(192,212,0,0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(192,212,0,0.3)",
                    color: "rgba(255,255,255,0.95)",
                    fontFamily: "'Source Sans 3',Arial,sans-serif",
                    lineHeight: 1.55,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                  }}>
                  {question}
                </div>

                {/* Nova response */}
                <div className="self-start w-full max-w-[92%]">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(192,212,0,0.15)", border: "1px solid rgba(192,212,0,0.3)" }}>
                      <Sparkles className="w-2.5 h-2.5 text-[#C0D400]" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.10em] text-[#C0D400]"
                      style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      Nova
                    </span>
                  </div>

                  {/* Typing indicator */}
                  {chatState === "typing" && (
                    <div className="inline-flex gap-1.5 px-5 py-4 rounded-b-2xl rounded-tr-2xl"
                      style={{ 
                        background: "rgba(255,255,255,0.06)", 
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                      }}>
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: "#C0D400", animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  )}

                  {/* Answer with typewriter */}
                  {(chatState === "answered" || chatState === "error") && (
                    <div className="flex flex-col gap-4 px-6 py-5 rounded-b-2xl rounded-tr-2xl"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        border: chatState === "error"
                          ? "1px solid rgba(255,76,23,0.3)"
                          : "1px solid rgba(255,255,255,0.15)",
                      }}>
                      <p className="text-[15px]"
                        style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.65 }}>
                        {displayed}
                        {!typeDone && (
                          <span
                            aria-hidden="true"
                            style={{
                              display: "inline-block",
                              width: 2,
                              height: "1em",
                              background: "#C0D400",
                              marginLeft: 2,
                              verticalAlign: "text-bottom",
                              animation: "nova-blink 0.8s step-end infinite",
                            }}
                          />
                        )}
                      </p>

                      {/* Citation — visible only when typing is done and it's not an error */}
                      {typeDone && chatState === "answered" && (
                        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className="text-[11px] flex items-center gap-1.5"
                            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                            <FileText className="w-3 h-3" aria-hidden="true" />
                            Fuente: Medellín Tech Report 2024.
                          </p>
                          <a
                            href="#descargar"
                            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0D400] rounded-sm"
                            style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#C0D400")}
                          >
                            Descargar documento completo →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Input bar ── */}
          <div className="px-2 pb-2 pt-4">
            <form onSubmit={handleAsk} className="relative flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe tu pregunta sobre el ecosistema CTI de Medellín…"
                className="flex-1 py-4 pl-5 pr-5 rounded-full text-[15px] transition-all duration-150 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.95)",
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(192,212,0,0.5)";
                  e.currentTarget.style.background  = "rgba(255,255,255,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.background  = "rgba(255,255,255,0.06)";
                }}
                aria-label="Pregunta para Nova"
                disabled={chatState === "typing"}
              />
              <button
                type="submit"
                disabled={!question.trim() || chatState === "typing"}
                className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]"
                style={{
                  background: question.trim() && chatState !== "typing" ? "#C0D400" : "rgba(255,255,255,0.1)",
                  color: question.trim() && chatState !== "typing" ? "#111111" : "rgba(255,255,255,0.3)",
                  cursor: !question.trim() || chatState === "typing" ? "not-allowed" : "pointer",
                  boxShadow: question.trim() && chatState !== "typing" ? "0 8px 24px rgba(192,212,0,0.25)" : "none"
                }}
                aria-label="Enviar pregunta"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>
            <p className="text-center text-[11px] mt-3"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.5 }}>
              Las respuestas se generan a partir de los documentos públicos del Centro de Pensamiento. Verifica siempre en la fuente citada.
            </p>
          </div>
        </div>
      </div>

      {/* Animations keyframes */}
      <style>{`
        @keyframes nova-blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}



export function AnalisisCTIPage() {
  return (
    <>
      <AnalisisCTIHero />
      <AnalisisCTILibrary />
      <AnalisisCTIFeatured />
      <AnalisisCTINova />
    </>
  );
}
