import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight, Download, Globe, TrendingUp, Activity, CheckCircle2, ArrowDown
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// LAB DE POLÍTICAS — Section 1: Banner principal
// ─────────────────────────────────────────────────────────────────────────────

function LabPoliticasHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;

    if (!gsap.plugins.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

      tl.fromTo(leftColRef.current?.children ? Array.from(leftColRef.current.children) : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1 }
      )
      .fromTo(rightColRef.current,
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
      className="bg-[#253D36] text-white relative overflow-hidden"
      style={{ minHeight: "55svh", paddingTop: 140, paddingBottom: 100 }}
      aria-labelledby="lab-hero-title"
    >
      {/* Decorative texture representing a document/timeline grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-10 bg-gradient-to-r from-transparent to-[#C0D400]" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div ref={leftColRef} className="lg:col-span-8 flex flex-col">
            <p
              className="text-[10px] tracking-[0.32em] uppercase mb-6"
              style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif", fontWeight: "bold" }}
            >
              LAB DE POLÍTICAS · NORMATIVA
            </p>

            <h1
              id="lab-hero-title"
              className="mb-6 max-w-4xl"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Políticas que potencian la ciencia, tecnología, innovación e investigación en el Distrito
            </h1>

            <p
              className="text-lg md:text-xl mb-12 max-w-3xl"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Aquí el Centro de Pensamiento de Ruta N centraliza lo más relevante en política pública para el ecosistema: las normas externas que enmarcan a Medellín como Distrito CTI y las iniciativas que impulsamos y lideramos desde la organización. Conocerlas no es un trámite: es la diferencia entre esperar a que el entorno cambie y usarlo a favor.
            </p>

            {/* Microdatos */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 pb-6 border-b border-[rgba(255,255,255,0.1)]">
              <span className="text-sm font-bold text-[#00B8A3]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                [N] normas mapeadas
              </span>
              <span className="text-white/30 hidden md:block" aria-hidden="true">•</span>
              <span className="text-sm font-bold text-[#C0D400]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                15 años de trayectoria
              </span>
              <span className="text-white/30 hidden md:block" aria-hidden="true">•</span>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                [N] herramientas descargables
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#cronologia"
                className="inline-flex items-center justify-center font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{ minHeight: 48, fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
              >
                Recorrer la línea de tiempo
              </a>
              <a
                href="#recursos"
                className="inline-flex items-center justify-center font-semibold text-sm text-white rounded-[4px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36] px-6"
                style={{ minHeight: 48, border: "1px solid rgba(255,255,255,0.2)", fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              >
                Explorar los recursos
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Interactive Timeline Thumbnail ── */}
          <div ref={rightColRef} className="lg:col-span-4 hidden lg:flex justify-end">
            <a
              href="#cronologia"
              className="group relative w-[280px] h-[360px] bg-[#1C2E29] rounded-sm p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              aria-label="Ir a la línea de tiempo 2011-2026"
            >
              {/* Timeline graphic */}
              <div className="absolute top-0 bottom-0 left-8 w-[2px] bg-[#253D36] group-hover:bg-[rgba(255,255,255,0.1)] transition-colors" />

              <div className="flex flex-col gap-6 w-full z-10">
                {[
                  { y: "2011", t: "Fundación de Ruta N", c: "#0068FF" },
                  { y: "2015", t: "Plan CTI", c: "#253D36" },
                  { y: "2021", t: "Distrito CTI", c: "#00B8A3" },
                  { y: "2026", t: "Proyección", c: "#C0D400" },
                ].map((node, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="relative mt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-[#1C2E29]" style={{ backgroundColor: node.c }} />
                      <div className="absolute inset-0 rounded-full animate-ping opacity-0 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: node.c }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white/50 mb-0.5" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>{node.y}</span>
                      <span className="text-sm font-semibold text-white/90 leading-tight" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}>{node.t}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-xs font-bold text-[#C0D400]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>Ver cronología</span>
                <div className="w-6 h-6 rounded-full bg-[rgba(192,212,0,0.1)] flex items-center justify-center group-hover:bg-[#C0D400] transition-colors">
                  <ArrowDown className="w-3.5 h-3.5 text-[#C0D400] group-hover:text-[#253D36] transition-colors" />
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAB DE POLÍTICAS — Section 2: Franja de dos casillas
// ─────────────────────────────────────────────────────────────────────────────

function LabPoliticasCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current) return;

    if (!gsap.plugins.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade up the title
      gsap.fromTo(".lab-cards-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );

      // Stagger the cards
      if (gridRef.current?.children) {
        gsap.fromTo(gridRef.current.children,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: gridRef.current, start: "top 75%" } }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#FAFAF8]" style={{ borderTop: "1px solid rgba(37,61,54,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        {/* Título de Sección */}
        <div className="lab-cards-title max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Dos formas de usar la política pública a tu favor
          </h2>
        </div>

        {/* Grilla de dos tarjetas */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* ── TARJETA 1: Documentación ── */}
          <article className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(37,61,54,0.08)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#C0D400]" style={{ border: "1px solid rgba(37,61,54,0.1)" }}>
            {/* Mitad superior: Imagen tratada (Sobria, documental) */}
            <div className="w-full h-64 bg-[#E8EDE6] relative overflow-hidden flex items-center justify-center border-b border-[rgba(37,61,54,0.1)]">
              {/* Textura de cuadricula sutil / documento */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(37,61,54,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,61,54,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {/* Ilustración de abstracción de folios / leyes */}
              <div className="relative w-40 h-48 bg-white shadow-sm border border-[rgba(37,61,54,0.05)] rotate-[-4deg] translate-x-4 flex flex-col p-4">
                <div className="w-full h-1 bg-[#253D36] mb-3 opacity-20" />
                <div className="w-3/4 h-1 bg-[#253D36] mb-2 opacity-10" />
                <div className="w-5/6 h-1 bg-[#253D36] mb-2 opacity-10" />
                <div className="w-2/3 h-1 bg-[#253D36] mb-auto opacity-10" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-[#C0D400] rounded-full opacity-50" />
              </div>
              <div className="absolute w-40 h-48 bg-[#FAFAF8] shadow-md border border-[rgba(37,61,54,0.08)] rotate-2 -translate-x-6 z-10 flex flex-col p-4">
                <div className="w-10 h-1.5 bg-[#00B8A3] mb-4" />
                <div className="w-full h-1 bg-[#253D36] mb-2 opacity-30" />
                <div className="w-full h-1 bg-[#253D36] mb-2 opacity-30" />
                <div className="w-4/5 h-1 bg-[#253D36] mb-2 opacity-30" />
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#253D36] rounded-[2px]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                NORMATIVA
              </div>
            </div>

            {/* Mitad inferior: Contenido */}
            <div className="flex flex-col flex-1 p-8 lg:p-10">
              <h3 className="text-3xl font-black text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                Documentación
              </h3>
              <p className="text-base font-bold text-[#00B8A3] mb-5" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                El repositorio de política pública de la organización.
              </p>
              <p className="text-[#253D36]/70 leading-relaxed mb-8" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                Toda la normativa que construyó y sostiene al Distrito CTI, reunida y explicada en un solo lugar: acuerdos del Concejo, decretos de la Alcaldía, leyes nacionales y documentos CONPES. Cada norma con su año, su contenido en una línea y el rol concreto que Ruta N cumple en ella. Del Acuerdo 024 de 2011 al Plan SDCTI 2024–2033.
              </p>

              <div className="mb-10">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#253D36]/50 mb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Contiene:
                </p>
                <ul className="flex flex-col gap-3">
                  {["Cronología interactiva 2011–2026", "Ruta N en el marco normativo", "Repositorio descargable", "Seguimiento de políticas vigentes"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      <CheckCircle2 className="w-4 h-4 text-[#00B8A3] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <a href="/lab-de-politicas/documentacion" className="inline-flex items-center gap-2 font-bold text-sm text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm transition-all group-hover:gap-3" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Entrar a Documentación <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>

          {/* ── TARJETA 2: Compras Públicas Innovadoras ── */}
          <article className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(37,61,54,0.08)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#C0D400]" style={{ border: "1px solid rgba(37,61,54,0.1)" }}>
            {/* Mitad superior: Imagen tratada (Herramienta, vibrante) */}
            <div className="w-full h-64 bg-[#253D36] relative overflow-hidden flex items-center justify-center border-b border-[#1C2E29]">
              {/* Textura de puntos y degradado dinámico */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,212,0,0.15)_0%,transparent_70%)]" />
              {/* Ilustración tipo interfaz de usuario / dashboard */}
              <div className="relative w-64 h-40 bg-[#1C2E29] rounded-t-md shadow-2xl border border-[rgba(255,255,255,0.1)] flex flex-col overflow-hidden translate-y-8">
                <div className="h-6 bg-[rgba(255,255,255,0.05)] w-full flex items-center px-3 gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 p-4 grid grid-cols-3 gap-3">
                  <div className="col-span-1 bg-[#C0D400] rounded-sm opacity-90" />
                  <div className="col-span-2 flex flex-col gap-2">
                    <div className="w-full h-4 bg-white/10 rounded-sm" />
                    <div className="w-3/4 h-4 bg-white/10 rounded-sm" />
                    <div className="w-full h-12 bg-[#0068FF] rounded-sm mt-auto opacity-80" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#C0D400] rounded-[2px]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                HERRAMIENTA
              </div>
            </div>

            {/* Mitad inferior: Contenido */}
            <div className="flex flex-col flex-1 p-8 lg:p-10">
              <h3 className="text-3xl font-black text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                Compras Públicas Innovadoras
              </h3>
              <p className="text-base font-bold text-[#0068FF] mb-5" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                El Estado como primer cliente de la innovación.
              </p>
              <p className="text-[#253D36]/70 leading-relaxed mb-8" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                La compra pública para la innovación le permite a una entidad pública adquirir soluciones que todavía no existen en el mercado: en lugar de pedir un producto, plantea un reto. Aquí encuentras los mecanismos, las guías, el test de autodiagnóstico y los tableros de resultados para apropiarte de este tipo de contratación, seas comprador público o proveedor de innovación.
              </p>

              <div className="mb-10">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#253D36]/50 mb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Contiene:
                </p>
                <ul className="flex flex-col gap-3">
                  {["Guía CPI", "Test de autodiagnóstico", "Plan anual e informes trimestrales", "Tablero de resultados", "Actas de las mesas estratégicas"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                      <CheckCircle2 className="w-4 h-4 text-[#C0D400] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <a href="/lab-de-politicas/compras" className="inline-flex items-center gap-2 font-bold text-sm text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm transition-all group-hover:gap-3" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Entrar a Compras Públicas Innovadoras <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// LAB DE POLÍTICAS — Section 3: Qué es el Lab
// ─────────────────────────────────────────────────────────────────────────────

const LAB_ATTRIBUTES = [
  {
    key: "evidencia",
    label: "Evidencia",
    description: "Ninguna recomendación sale de aquí sin datos que la sostengan.",
    icon: "E",
    color: "#C0D400",
  },
  {
    key: "articulacion",
    label: "Articulación",
    description: "Conectamos secretarías, academia, empresa y ciudadanía alrededor de un mismo marco.",
    icon: "A",
    color: "#00B8A3",
  },
  {
    key: "innovacion",
    label: "Innovación",
    description: "Probamos mecanismos nuevos de gestión pública antes de proponerlos como norma.",
    icon: "I",
    color: "#0068FF",
  },
  {
    key: "valor-publico",
    label: "Valor público",
    description: "Medimos el resultado en calidad de vida, no en documentos producidos.",
    icon: "V",
    color: "#FF4C17",
  },
] as const;

function LabQueEsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReduced.current;

      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: reduced ? 0 : 32 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.2 : 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Body text reveal
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: reduced ? 0 : 24 },
          {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.2 : 0.7,
            ease: "power3.out",
            delay: reduced ? 0 : 0.15,
            scrollTrigger: {
              trigger: bodyRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Attribute cards stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>(".lab-attr-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reduced ? 0.2 : 0.65,
            ease: "power3.out",
            stagger: reduced ? 0 : 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#111111] px-6 py-24 lg:py-32"
      aria-labelledby="lab-que-es-heading"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* ── Text block ── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 mb-20 lg:mb-28">
          <div className="lg:col-span-5 mb-10 lg:mb-0">
            <p
              className="text-[10px] tracking-[0.28em] uppercase text-[#C0D400] mb-5"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              Quiénes somos
            </p>
            <h2
              id="lab-que-es-heading"
              ref={headingRef}
              className="text-white"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                opacity: 0,
              }}
            >
              Un laboratorio,<br />no una oficina jurídica
            </h2>
          </div>

          <div ref={bodyRef} className="lg:col-span-7" style={{ opacity: 0 }}>
            <p
              className="text-white/75 mb-6 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
              }}
            >
              El Lab de Política Pública es el espacio de articulación técnica de Ruta N que conecta el conocimiento, la evidencia y el ecosistema CTI para fortalecer la innovación pública y apoyar el desarrollo de políticas más efectivas para Medellín, Distrito de Ciencia, Tecnología e Innovación.
            </p>
            <p
              className="text-white/75 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
              }}
            >
              Trabajamos sobre cuatro atributos: evidencia, articulación, innovación y valor público. Con ellos fortalecemos capacidades institucionales en política pública basada en evidencia, promovemos la innovación en la gestión pública y generamos recomendaciones y soluciones escalables.
            </p>
          </div>
        </div>

        {/* ── Four attributes ── */}
        <div ref={cardsRef}>
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-white/35 mb-10"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Los cuatro atributos
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-sm overflow-hidden">
            {LAB_ATTRIBUTES.map((attr) => (
              <LabAttributeCard key={attr.key} attr={attr} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

interface LabAttr {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

function LabAttributeCard({ attr }: { attr: LabAttr }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!cardRef.current || !accentRef.current) return;
    gsap.to(accentRef.current, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(cardRef.current, { backgroundColor: "rgba(255,255,255,0.04)", duration: 0.25 });
  };

  const handleLeave = () => {
    if (!cardRef.current || !accentRef.current) return;
    gsap.to(accentRef.current, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    gsap.to(cardRef.current, { backgroundColor: "rgba(255,255,255,0)", duration: 0.25 });
  };

  return (
    <div
      ref={cardRef}
      className="lab-attr-card relative bg-transparent px-8 py-10 flex flex-col gap-5 transition-colors"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ opacity: 0 }}
    >
      {/* Top accent bar */}
      <div
        ref={accentRef}
        className="absolute top-0 left-0 right-0 h-[3px] origin-left"
        style={{ background: attr.color, transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      {/* Icon badge */}
      <div
        className="w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0"
        style={{ background: `${attr.color}22`, border: `1px solid ${attr.color}44` }}
        aria-hidden="true"
      >
        <span
          className="font-black"
          style={{
            color: attr.color,
            fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1,
          }}
        >
          {attr.icon}
        </span>
      </div>

      {/* Label */}
      <h3
        className="text-white m-0 p-0"
        style={{
          fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
          fontSize: "1.25rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {attr.label}
      </h3>

      {/* Description */}
      <p
        className="text-white/55 m-0 p-0"
        style={{
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          fontSize: "0.9375rem",
          lineHeight: 1.65,
        }}
      >
        {attr.description}
      </p>
    </div>
  );
}

function PlaceholderSections() {
  const sections = [
    {
      bg: "#F2F4F0",
      label: "Radar CTI",
      body: "Tableros dinámicos, series históricas y rankings del ecosistema CTI de Medellín.",
    },
    {
      bg: "#FFFFFF",
      label: "Lab de Políticas",
      body: "Marco normativo del Distrito CTI y herramientas para la compra pública de innovación.",
    },
    {
      bg: "#253D36",
      label: "Suscríbete al boletín semestral",
      body: "Cada seis meses, lo esencial en un solo lugar.",
      dark: true,
    },
  ];

  return (
    <>
      {sections.map((s) => (
        null
      ))}
    </>
  );
}

export function LabPoliticasPage() {
  return (
    <>
      <LabPoliticasHero />
      <LabPoliticasCards />
      <LabQueEsSection />
      <PlaceholderSections />
    </>
  );
}
