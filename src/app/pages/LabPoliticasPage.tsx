import { useState, useEffect, useRef } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { FloatingNav } from "../components/FloatingNav";
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
      id="lab-hero"
      className="bg-[#253D36] text-white relative overflow-hidden flex flex-col justify-center"
      style={{ minHeight: "60svh", paddingTop: 120, paddingBottom: 80 }}
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
              className="text-lg md:text-xl mb-6 max-w-3xl"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Source Sans 3',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Aquí el Centro de Pensamiento de Ruta N centraliza lo más relevante en política pública para el ecosistema: las normas externas que enmarcan a Medellín como Distrito CTI y las iniciativas que impulsamos y lideramos desde la organización. Conocerlas no es un trámite: es la diferencia entre esperar a que el entorno cambie y usarlo a favor.
            </p>

            {/* Microdatos */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 pb-4 border-b border-[rgba(255,255,255,0.1)]">
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
    <section ref={sectionRef} id="lab-acceso" className="relative py-10 lg:py-14 bg-[#FAFAF8]" style={{ borderTop: "1px solid rgba(37,61,54,0.06)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">

        {/* Título de Sección */}
        <div className="lab-cards-title max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-[#253D36]" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Dos formas de usar la política pública a tu favor
          </h2>
        </div>

        {/* Grilla de dos tarjetas */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* ── TARJETA 1: Documentación ── */}
          <article className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(37,61,54,0.08)] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#C0D400]" style={{ border: "1px solid rgba(37,61,54,0.1)" }}>
            {/* Mitad superior: Imagen tratada (Sobria, documental) */}
            <div className="w-full h-52 bg-[#E8EDE6] relative overflow-hidden flex items-center justify-center border-b border-[rgba(37,61,54,0.1)]">
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
            <div className="flex flex-col flex-1 p-6 lg:p-8">
              <h3 className="text-2xl font-black text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                Documentación
              </h3>
              <p className="text-base font-bold text-[#00B8A3] mb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                El repositorio de política pública de la organización.
              </p>
              <p className="text-[#253D36]/70 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                Toda la normativa que construyó y sostiene al Distrito CTI, reunida y explicada en un solo lugar: acuerdos del Concejo, decretos de la Alcaldía, leyes nacionales y documentos CONPES. Cada norma con su año, su contenido en una línea y el rol concreto que Ruta N cumple en ella. Del Acuerdo 024 de 2011 al Plan SDCTI 2024–2033.
              </p>

              <div className="mb-6">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#253D36]/50 mb-3" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Contiene:
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {["Cronología interactiva 2011–2026", "Ruta N en el marco normativo", "Repositorio descargable", "Seguimiento de políticas vigentes"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
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
            <div className="w-full h-52 bg-[#253D36] relative overflow-hidden flex items-center justify-center border-b border-[#1C2E29]">
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
            <div className="flex flex-col flex-1 p-6 lg:p-8">
              <h3 className="text-2xl font-black text-[#253D36] mb-2" style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif", letterSpacing: "-0.01em" }}>
                Compras Públicas Innovadoras
              </h3>
              <p className="text-base font-bold text-[#0068FF] mb-4" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                El Estado como primer cliente de la innovación.
              </p>
              <p className="text-[#253D36]/70 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                La compra pública para la innovación le permite a una entidad pública adquirir soluciones que todavía no existen en el mercado: en lugar de pedir un producto, plantea un reto. Aquí encuentras los mecanismos, las guías, el test de autodiagnóstico y los tableros de resultados para apropiarte de este tipo de contratación, seas comprador público o proveedor de innovación.
              </p>

              <div className="mb-6">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#253D36]/50 mb-3" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
                  Contiene:
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {["Guía CPI", "Test de autodiagnóstico", "Plan anual e informes trimestrales", "Tablero de resultados", "Actas de las mesas estratégicas"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-semibold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
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
      id="lab-que-es"
      className="relative bg-[#111111] px-6 py-10 lg:py-14"
      aria-labelledby="lab-que-es-heading"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* ── Text block ── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 mb-10 lg:mb-14">
          <div className="lg:col-span-5 mb-6 lg:mb-0">
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

// ─────────────────────────────────────────────────────────────────────────────
// LAB DE POLÍTICAS — Section: Cronología interactiva 2011–2026
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
  {
    year: "2011",
    color: "#0068FF",
    title: "Acuerdo 024 de 2011",
    type: "Acuerdo del Concejo",
    body: "El Concejo de Medellín crea Ruta N y establece las bases del modelo de gestión de la ciencia, la tecnología y la innovación en la ciudad.",
  },
  {
    year: "2015",
    color: "#00B8A3",
    title: "Plan CTI de Medellín",
    type: "Política pública",
    body: "La Alcaldía adopta el primer Plan de Ciencia, Tecnología e Innovación para orientar la inversión y las capacidades del ecosistema local.",
  },
  {
    year: "2018",
    color: "#FFCA00",
    title: "Estrategia Compras Públicas Innovadoras",
    type: "Mecanismo de contratación",
    body: "Ruta N lidera el primer ciclo de compra pública de innovación en Colombia, usando retos abiertos en lugar de especificaciones cerradas.",
  },
  {
    year: "2021",
    color: "#C0D400",
    title: "Ley 2086 — Distrito de CTI",
    type: "Ley Nacional",
    body: "El Congreso declara a Medellín Distrito Especial de Ciencia, Tecnología e Innovación, abriendo un nuevo marco de gobernanza y financiamiento para el ecosistema.",
  },
  {
    year: "2022",
    color: "#FF4C17",
    title: "Decreto reglamentario Distrito CTI",
    type: "Decreto de la Alcaldía",
    body: "La Alcaldía reglamenta el funcionamiento del Distrito CTI y define las competencias de las entidades que integran el Sistema Municipal de Innovación.",
  },
  {
    year: "2024",
    color: "#C0D400",
    title: "Plan SDCTI 2024–2033",
    type: "Plan estratégico",
    body: "El Plan Estratégico del Sistema Distrital de CTI traza la hoja de ruta de Medellín para la próxima década: inversión, talento, internacionalización y gobernanza.",
  },
] as const;

type TimelineEvent = (typeof TIMELINE_EVENTS)[number];

function TimelineNode({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div ref={nodeRef} className="timeline-node relative flex gap-6 md:gap-8">
      {/* ── Axis ── */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={`${event.year}: ${event.title}`}
          className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1F1A] z-10"
          style={{
            backgroundColor: expanded ? event.color : "rgba(255,255,255,0.06)",
            border: `2px solid ${event.color}`,
            boxShadow: expanded ? `0 0 0 4px ${event.color}22` : "none",
            focusVisibleRingColor: event.color,
          }}
        >
          <span
            className="text-[10px] font-black"
            style={{
              color: expanded ? "#111" : event.color,
              fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            }}
          >
            {event.year.slice(2)}
          </span>
        </button>
        {!isLast && (
          <div
            className="w-[2px] flex-1 min-h-[2rem] mt-1"
            style={{ background: `linear-gradient(to bottom, ${event.color}55, rgba(255,255,255,0.06))` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Content ── */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] font-bold tracking-[0.22em] uppercase px-2 py-0.5 rounded-[2px]"
            style={{
              color: event.color,
              backgroundColor: `${event.color}18`,
              fontFamily: "'Source Sans 3',Arial,sans-serif",
            }}
          >
            {event.type}
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            {event.year}
          </span>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-left w-full group focus-visible:outline-none"
        >
          <h3
            className="mb-0 transition-colors duration-200"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              color: expanded ? "#fff" : "rgba(255,255,255,0.85)",
            }}
          >
            {event.title}
          </h3>
        </button>

        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: expanded ? "200px" : "0px", opacity: expanded ? 1 : 0 }}
        >
          <p
            className="mt-3 leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.65,
            }}
          >
            {event.body}
          </p>
        </div>

        {!expanded && (
          <p
            className="mt-1 text-sm leading-snug line-clamp-2"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Source Sans 3',Arial,sans-serif",
            }}
          >
            {event.body}
          </p>
        )}
      </div>
    </div>
  );
}

function LabCronologiaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);

  const prefersReduced = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReduced.current) return;

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
          }
        );
      }

      if (nodesRef.current) {
        const nodes = nodesRef.current.querySelectorAll<HTMLElement>(".timeline-node");
        gsap.fromTo(
          nodes,
          { opacity: 0, x: -24 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.14,
            scrollTrigger: { trigger: nodesRef.current, start: "top 80%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    null
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

const LAB_SECTIONS = [
  { id: "lab-hero",      label: "Inicio" },
  { id: "lab-acceso",   label: "Acceso" },
  { id: "cronologia",   label: "Cronología" },
  { id: "lab-que-es",   label: "¿Qué es?" },
];

export function LabPoliticasPage() {
  return (
    <>
      <FloatingNav sections={LAB_SECTIONS} />
      <LabPoliticasHero />
      <Breadcrumb items={[
        { label: "Contenidos", href: "#contenidos" },
        { label: "Lab de Políticas" }
      ]} />
      <LabPoliticasCards />
      <LabCronologiaSection />
      <LabQueEsSection />
      <PlaceholderSections />
    </>
  );
}
