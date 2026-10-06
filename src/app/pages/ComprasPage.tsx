import { useState, useEffect, useRef } from "react";
import { FloatingNav } from "../components/FloatingNav";
import { Breadcrumb } from "../components/Breadcrumb";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Download, ArrowRight, ArrowUpRight, Globe, TrendingUp, ClipboardList, Activity } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS PÚBLICAS INNOVADORAS — Data
// ─────────────────────────────────────────────────────────────────────────────

interface CPIQuestion {
  id: string;
  text: string;
  hint?: string;
  yesIsGood: boolean;
}

const CPI_QUESTIONS: CPIQuestion[] = [
  {
    id: "q1",
    text: "¿La solución que necesitas ya existe como producto o servicio disponible en el mercado hoy?",
    hint: "Si ya existe, la contratación tradicional puede ser más eficiente.",
    yesIsGood: false,
  },
  {
    id: "q2",
    text: "¿Puedes describir el problema o el reto con precisión, aunque no sepas cómo resolverlo?",
    hint: "La CPI parte de un reto claro, no de una solución predefinida.",
    yesIsGood: true,
  },
  {
    id: "q3",
    text: "¿Tu entidad está dispuesta a compartir el riesgo del proceso de desarrollo con el proveedor?",
    yesIsGood: true,
  },
  {
    id: "q4",
    text: "¿El resultado esperado es verificable y medible al final del contrato?",
    yesIsGood: true,
  },
  {
    id: "q5",
    text: "¿Tienes el respaldo institucional para explorar una metodología de contratación diferente a la tradicional?",
    yesIsGood: true,
  },
];

const CPI_KPIS = [
  { value: "[N]", label: "procesos estructurados" },
  { value: "[N]", label: "entidades públicas vinculadas" },
  { value: "$[XXX]", label: "millones movilizados" },
  { value: "[N]", label: "soluciones contratadas" },
] as const;

interface CPIActa {
  id: string;
  label: string;
  date: string;
  summary: string;
}

const CPI_ACTAS: CPIActa[] = [
  {
    id: "ca1",
    label: "Mesa estratégica [N]",
    date: "[mes] 2025",
    summary: "Avance en la estructuración del proceso de CPI para el sector de movilidad.",
  },
  {
    id: "ca2",
    label: "Mesa estratégica [N]",
    date: "[mes] 2024",
    summary: "Definición de criterios de elegibilidad para el piloto de compra de innovación en salud.",
  },
  {
    id: "ca3",
    label: "Mesa estratégica [N]",
    date: "[mes] 2024",
    summary: "Revisión del plan anual CPI 2024 y ajuste de metas por entidad participante.",
  },
  {
    id: "ca4",
    label: "Mesa estratégica [N]",
    date: "[mes] 2024",
    summary: "Presentación de resultados de los procesos finalizados y lecciones aprendidas.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Test CPI modal
// ─────────────────────────────────────────────────────────────────────────────

interface TestCPIProps {
  onClose: () => void;
}

function TestCPI({ onClose }: TestCPIProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current && panelRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    if (overlayRef.current && panelRef.current) {
      gsap.to(panelRef.current, { opacity: 0, y: 16, duration: 0.2 });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
    } else {
      onClose();
    }
  };

  const currentQ = CPI_QUESTIONS[step];

  const answer = (value: boolean) => {
    const next = { ...answers, [currentQ.id]: value };
    setAnswers(next);
    if (step < CPI_QUESTIONS.length - 1) {
      gsap.fromTo(
        panelRef.current!.querySelector<HTMLElement>(".test-body"),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const positiveCount = Object.entries(answers).filter(([qid, val]) => {
    const q = CPI_QUESTIONS.find((q) => q.id === qid);
    return q ? (q.yesIsGood ? val === true : val === false) : false;
  }).length;

  const isPositive = positiveCount >= 3;

  const progress = showResult ? 100 : ((step) / CPI_QUESTIONS.length) * 100;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-8"
      style={{ background: "rgba(17,17,17,0.85)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Test CPI"
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[580px] rounded-[6px] overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 border-b border-[rgba(37,61,54,0.1)]"
          style={{ background: "#253D36" }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.28em] uppercase text-[#C0D400] mb-0.5"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              Test CPI
            </p>
            {!showResult && (
              <p
                className="text-white/60"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif", fontSize: "0.8rem" }}
              >
                Pregunta {step + 1} de {CPI_QUESTIONS.length}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Cerrar el test"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-[rgba(37,61,54,0.08)]">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: "#C0D400" }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Body */}
        <div className="test-body px-8 py-10">
          {!showResult ? (
            <div>
              <p
                className="text-[#253D36] mb-3 leading-snug"
                style={{
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "1.1875rem",
                  fontWeight: 800,
                  lineHeight: 1.35,
                  letterSpacing: "-0.02em",
                }}
              >
                {currentQ.text}
              </p>
              {currentQ.hint && (
                <p
                  className="text-[#253D36]/45 mb-8"
                  style={{
                    fontFamily: "'Source Sans 3',Arial,sans-serif",
                    fontSize: "0.8125rem",
                    lineHeight: 1.55,
                  }}
                >
                  {currentQ.hint}
                </p>
              )}
              {!currentQ.hint && <div className="mb-8" />}

              <div className="flex gap-3">
                <button
                  onClick={() => answer(true)}
                  className="flex-1 py-3.5 rounded-[4px] font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] hover:bg-[#253D36] hover:text-[#C0D400]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                    background: "rgba(37,61,54,0.07)",
                    color: "#253D36",
                    border: "1px solid rgba(37,61,54,0.15)",
                  }}
                >
                  Sí
                </button>
                <button
                  onClick={() => answer(false)}
                  className="flex-1 py-3.5 rounded-[4px] font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] hover:bg-[#253D36] hover:text-[#C0D400]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                    background: "rgba(37,61,54,0.07)",
                    color: "#253D36",
                    border: "1px solid rgba(37,61,54,0.15)",
                  }}
                >
                  No
                </button>
              </div>

              {step > 0 && (
                <button
                  onClick={goBack}
                  className="mt-5 inline-flex items-center min-h-11 px-2 text-xs text-[#253D36]/40 hover:text-[#253D36] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] rounded-sm"
                  style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                >
                  ← Volver a la pregunta anterior
                </button>
              )}
            </div>
          ) : (
            <div>
              <div
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-[3px] mb-6"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  background: isPositive ? "rgba(192,212,0,0.14)" : "rgba(255,76,23,0.1)",
                  color: isPositive ? "#5E6A00" : "#C93800",
                  border: `1px solid ${isPositive ? "rgba(192,212,0,0.3)" : "rgba(255,76,23,0.25)"}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isPositive ? "#8FAA00" : "#FF4C17" }}
                  aria-hidden="true"
                />
                {isPositive ? "Reto apto para CPI" : "Otro mecanismo más adecuado"}
              </div>

              <p
                className="text-[#253D36] mb-4"
                style={{
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                }}
              >
                {isPositive
                  ? "Tu reto tiene condiciones para estructurarse como compra pública de innovación. Estos son los siguientes pasos."
                  : "Por ahora tu reto encaja mejor en otro mecanismo de contratación. Te contamos cuál y por qué."}
              </p>

              <p
                className="text-[#253D36]/60 mb-8 leading-relaxed"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.65,
                }}
              >
                {isPositive
                  ? "El equipo de CPI de Ruta N puede acompañarte en la estructuración del proceso. Escríbenos para coordinar una sesión de trabajo."
                  : "Hay otras modalidades de contratación que pueden adaptarse mejor a tu situación. El equipo de CPI puede orientarte."}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] px-5 transition-colors hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{ minHeight: 44, fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
                >
                  Escribirle al equipo CPI
                </a>
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 font-bold text-sm text-[#253D36] border border-[rgba(37,61,54,0.2)] rounded-[4px] px-5 transition-colors hover:bg-[rgba(37,61,54,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{ minHeight: 44, fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
                >
                  Repetir el test
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 border-t border-[rgba(37,61,54,0.08)]"
          style={{ background: "rgba(37,61,54,0.03)" }}
        >
          <p
            className="text-[10px] text-[#253D36]/35"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Toma alrededor de 5 minutos · Recibes el resultado al instante
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Banner
// ─────────────────────────────────────────────────────────────────────────────

function ComprasBanner({ onOpenTest }: { onOpenTest: () => void }) {
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
      id="compras-hero"
      className="bg-[#253D36] text-white pt-32 pb-20 px-6 lg:px-10 xl:px-12 relative overflow-hidden"
    >
      {/* Decorative diagonal line pattern */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[480px] opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(192,212,0,1) 18px, rgba(192,212,0,1) 19px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="max-w-[780px]">
          <p
            className="text-[10px] tracking-[0.32em] uppercase font-bold mb-6"
            style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Compras Públicas Innovadoras
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
            Cuando el Estado compra distinto, la ciudad cambia
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
              La compra pública para la innovación (CPI) le permite a una entidad pública adquirir soluciones que todavía no existen en el mercado: en vez de pedir un producto, plantea un reto y deja que el ecosistema lo resuelva. Aquí están los mecanismos, las herramientas y los resultados para apropiarte de este tipo de contratación.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onOpenTest}
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] px-6 transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36]"
                style={{
                  minHeight: 48,
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                }}
              >
                Hacer el Test CPI
              </button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-white border border-white/30 rounded-[4px] px-6 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  minHeight: 48,
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                }}
              >
                <Download className="w-4 h-4" /> Descargar la Guía CPI
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Bloque 1: Dos caminos
// ─────────────────────────────────────────────────────────────────────────────

function ComprasDosCAMINOS() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards =
          cardsRef.current.querySelectorAll<HTMLElement>(".camino-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      id="compras-caminos"
      className="bg-[#F7F7F5] px-6 py-24 lg:py-28 relative"
      aria-labelledby="dos-caminos-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 1 · Dos caminos
          </p>
          <h2
            id="dos-caminos-heading"
            className="text-[#253D36]"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Dos caminos, la misma herramienta
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Entidad pública */}
          <article
            className="camino-card bg-white rounded-[4px] p-8 lg:p-10 flex flex-col gap-6 border border-[rgba(37,61,54,0.1)] hover:border-[rgba(37,61,54,0.25)] transition-colors duration-200"
            style={{ opacity: 0 }}
          >
            <div
              className="w-11 h-11 rounded-[4px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(192,212,0,0.14)", border: "1px solid rgba(192,212,0,0.3)" }}
              aria-hidden="true"
            >
              <Globe className="w-5 h-5" style={{ color: "#5E6A00" }} />
            </div>

            <div>
              <p
                className="text-[10px] uppercase tracking-wider text-[#253D36]/40 mb-3"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Si eres una entidad pública
              </p>
              <p
                className="text-[#253D36] leading-relaxed"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              >
                Puedes resolver un problema real de tu operación con una solución que aún no existe, compartiendo el riesgo del desarrollo y sin renunciar a la seguridad jurídica.
              </p>
            </div>

          </article>

          {/* Card: Empresa / emprendimiento */}
          <article
            className="camino-card bg-[#253D36] rounded-[4px] p-8 lg:p-10 flex flex-col gap-6"
            style={{ opacity: 0 }}
          >
            <div
              className="w-11 h-11 rounded-[4px] flex items-center justify-center shrink-0"
              style={{ background: "rgba(192,212,0,0.18)", border: "1px solid rgba(192,212,0,0.35)" }}
              aria-hidden="true"
            >
              <TrendingUp className="w-5 h-5 text-[#C0D400]" />
            </div>

            <div>
              <p
                className="text-[10px] uppercase tracking-wider text-white/40 mb-3"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Si eres una empresa o un emprendimiento
              </p>
              <p
                className="text-white/75 leading-relaxed"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              >
                Puedes convertir al Estado en tu primer cliente y en tu primer caso de éxito, con un contrato que reconoce el valor de lo que todavía estás construyendo.
              </p>
            </div>

          </article>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Bloque 2: Cómo empezar
// ─────────────────────────────────────────────────────────────────────────────

function ComprasComoEmpezar({ onOpenTest }: { onOpenTest: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stepsRef.current) {
        const steps = stepsRef.current.querySelectorAll<HTMLElement>(".step-card");
        gsap.fromTo(
          steps,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.14,
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

  return (
    <section
      ref={sectionRef}
      id="compras-como-empezar"
      className="bg-white px-6 py-24 lg:py-28 relative"
      aria-labelledby="como-empezar-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 2 · Cómo empezar
          </p>
          <h2
            id="como-empezar-heading"
            className="text-[#253D36]"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Tres pasos para entrar
          </h2>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Step 1: Entiende */}
          <article
            className="step-card border border-[rgba(37,61,54,0.1)] rounded-[4px] p-8 flex flex-col gap-5"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
                style={{
                  background: "#253D36",
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 900,
                }}
                aria-hidden="true"
              >
                1
              </span>
              <p
                className="text-[10px] uppercase tracking-wider text-[#253D36]/40"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Entiende
              </p>
            </div>

            <h3
              className="text-[#253D36]"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                fontSize: "1.0625rem",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              Guía CPI, videos explicativos y documentos de referencia
            </h3>

            <p
              className="text-[#253D36]/60 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.65,
              }}
            >
              Empieza por lo esencial: qué es, qué la diferencia de una contratación tradicional y qué marco normativo la respalda en Medellín.
            </p>

            <div
              className="flex items-center gap-3 pt-4 border-t border-[rgba(37,61,54,0.08)]"
            >
              <span
                className="text-[10px] text-[#253D36]/40 flex items-center gap-1"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Lectura de [N] minutos
              </span>
              <span className="text-[#253D36]/20 text-xs">·</span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF] rounded-sm"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                <Download className="w-3.5 h-3.5" /> PDF descargable
              </a>
            </div>
          </article>

          {/* Step 2: Diagnostica */}
          <article
            className="step-card bg-[#253D36] rounded-[4px] p-8 flex flex-col gap-5"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[#253D36]"
                style={{
                  background: "#C0D400",
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 900,
                }}
                aria-hidden="true"
              >
                2
              </span>
              <p
                className="text-[10px] uppercase tracking-wider text-white/40"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Diagnostica
              </p>
            </div>

            <h3
              className="text-white"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                fontSize: "1.0625rem",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              Test CPI
            </h3>

            <p
              className="text-white/65 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.65,
              }}
            >
              ¿Tu reto es apto para compra pública de innovación? Responde el autodiagnóstico y recibe una recomendación con los siguientes pasos concretos para tu caso.
            </p>

            <div className="mt-auto pt-4 border-t border-white/10">
              <button
                onClick={onOpenTest}
                className="inline-flex items-center gap-2 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] px-5 transition-colors hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36]"
                style={{
                  minHeight: 44,
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                }}
              >
                Hacer el test
              </button>
              <p
                className="text-white/35 text-[10px] mt-3"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Toma alrededor de 5 minutos · Recibes el resultado al instante
              </p>
            </div>
          </article>

          {/* Step 3: Ejecuta */}
          <article
            className="step-card border border-[rgba(37,61,54,0.1)] rounded-[4px] p-8 flex flex-col gap-5"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
                style={{
                  background: "#253D36",
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 900,
                }}
                aria-hidden="true"
              >
                3
              </span>
              <p
                className="text-[10px] uppercase tracking-wider text-[#253D36]/40"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                Ejecuta
              </p>
            </div>

            <h3
              className="text-[#253D36]"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                fontSize: "1.0625rem",
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              Instrumentos de gestión y seguimiento
            </h3>

            <p
              className="text-[#253D36]/60 leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "0.9rem",
                lineHeight: 1.65,
              }}
            >
              Plan Anual de CPI, informes trimestrales, actas de las mesas estratégicas y el tablero de resultados. Todo lo necesario para estructurar el proceso y para hacerle seguimiento después.
            </p>

          </article>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Bloque 3: Resultados
// ─────────────────────────────────────────────────────────────────────────────

function ComprasResultados() {
  const sectionRef = useRef<HTMLElement>(null);
  const kpisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (kpisRef.current) {
        const cards = kpisRef.current.querySelectorAll<HTMLElement>(".kpi-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      id="compras-resultados"
      className="bg-[#253D36] px-6 py-24 lg:py-28 relative"
      aria-labelledby="resultados-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14 lg:mb-16">
          <div className="lg:col-span-6 mb-8 lg:mb-0">
            <p
              className="text-[10px] tracking-[0.28em] uppercase text-[#C0D400] mb-4"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
            >
              Bloque 3 · Resultados
            </p>
            <h2
              id="resultados-heading"
              className="text-white"
              style={{
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(1.6rem,3vw,2.25rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Lo que ya está pasando
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p
              className="text-white/65 leading-relaxed mb-6"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              El tablero de resultados de CPI muestra los procesos estructurados, las entidades participantes y el valor movilizado. La compra pública de innovación no es una promesa: aquí están los números.
            </p>
          </div>
        </div>

        {/* KPI grid */}
        <div ref={kpisRef} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-sm overflow-hidden">
          {CPI_KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="kpi-card bg-[#253D36] px-6 py-8 flex flex-col gap-2"
              style={{ opacity: 0 }}
            >
              <span
                className="text-[#C0D400]"
                style={{
                  fontFamily:
                    "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                  fontSize: "clamp(1.75rem,3.5vw,2.75rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {kpi.value}
              </span>
              <span
                className="text-white/55"
                style={{
                  fontFamily: "'Source Sans 3',Arial,sans-serif",
                  fontSize: "0.8125rem",
                  lineHeight: 1.4,
                }}
              >
                {kpi.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS — Bloque 4: Mesas estratégicas
// ─────────────────────────────────────────────────────────────────────────────

function ComprasMesas() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (listRef.current) {
        const items = listRef.current.querySelectorAll<HTMLElement>("li");
        gsap.fromTo(
          items,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      id="mesas"
      className="bg-[#F7F7F5] px-6 py-24 lg:py-28 relative"
      aria-labelledby="mesas-heading"
    >
      <div className="max-w-[1200px] mx-auto lg:grid lg:grid-cols-12 lg:gap-16">
        {/* Left: header */}
        <div className="lg:col-span-4 mb-12 lg:mb-0">
          <p
            className="text-[10px] tracking-[0.28em] uppercase text-[#253D36]/40 mb-4"
            style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Bloque 4 · Mesas estratégicas
          </p>
          <h2
            id="mesas-heading"
            className="text-[#253D36] mb-4"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(1.5rem,2.5vw,2rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Las mesas estratégicas de CPI
          </h2>
          <p
            className="text-[#253D36]/60 leading-relaxed"
            style={{
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
            }}
          >
            El espacio donde las entidades del Distrito coordinan sus procesos de compra pública de innovación. Publicamos las actas porque la trazabilidad de estas decisiones es parte del valor público que generan.
          </p>

        </div>

        {/* Right: Actas list */}
        <div className="lg:col-span-8">
          <ul ref={listRef} className="divide-y divide-[rgba(37,61,54,0.1)]">
            {CPI_ACTAS.map((acta) => (
              <li
                key={acta.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 group"
                style={{ opacity: 0 }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-[3px] flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(37,61,54,0.08)",
                    border: "1px solid rgba(37,61,54,0.12)",
                  }}
                  aria-hidden="true"
                >
                  <ClipboardList className="w-4 h-4" style={{ color: "#253D36" }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span
                      className="text-[#253D36]"
                      style={{
                        fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 800,
                      }}
                    >
                      {acta.label}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wider text-[#253D36]/40 px-2 py-0.5 rounded-[2px]"
                      style={{
                        fontFamily: "'Source Sans 3',Arial,sans-serif",
                        background: "rgba(37,61,54,0.07)",
                      }}
                    >
                      {acta.date}
                    </span>
                  </div>
                  <p
                    className="text-[#253D36]/55"
                    style={{
                      fontFamily: "'Source Sans 3',Arial,sans-serif",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {acta.summary}
                  </p>
                </div>

                {/* Download */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#253D36]/50 hover:text-[#253D36] hover:bg-[rgba(37,61,54,0.08)] px-3 min-h-11 rounded-[3px] transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
                  aria-label={`Descargar ${acta.label}`}
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPRAS PAGE
// ─────────────────────────────────────────────────────────────────────────────

const COMPRAS_SECTIONS = [
  { id: "compras-hero",         label: "Inicio" },
  { id: "compras-caminos",      label: "Dos caminos" },
  { id: "compras-como-empezar", label: "¿Cómo empezar?" },
  { id: "compras-resultados",   label: "Resultados" },
  { id: "mesas",                label: "Mesas de trabajo" },
];

export function ComprasPage() {
  const [testOpen, setTestOpen] = useState(false);

  return (
    <>
      <FloatingNav sections={COMPRAS_SECTIONS} />
      {testOpen && <TestCPI onClose={() => setTestOpen(false)} />}
      <ComprasBanner onOpenTest={() => setTestOpen(true)} />
      <Breadcrumb items={[
        { label: "Contenidos", href: "#contenidos" },
        { label: "Lab de Políticas", href: "/lab-de-politicas" },
        { label: "Compras Públicas Innovadoras" }
      ]} />
      <ComprasDosCAMINOS />
      <ComprasComoEmpezar onOpenTest={() => setTestOpen(true)} />
      <ComprasResultados />
      <ComprasMesas />
    </>
  );
}
