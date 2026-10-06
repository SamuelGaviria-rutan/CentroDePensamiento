import { useState, useEffect, useRef } from "react";
import { FloatingNav } from "../components/FloatingNav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Sparkles, X } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// BLOG PAGE — Types and Data
// ─────────────────────────────────────────────────────────────────────────────

interface BlogArticle {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  novaSelection: boolean;
}

const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "a-1",
    tag: "Análisis CTI",
    title: "El impacto de la inteligencia artificial en el tejido empresarial de Medellín",
    excerpt: "Un recorrido exploratorio por los sectores que lideran la adopción tecnológica y los retos de talento para las pymes.",
    date: "15 jul 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: true,
  },
  {
    id: "a-2",
    tag: "Lab de Políticas",
    title: "Habilitadores normativos para la compra pública de innovación",
    excerpt: "Cómo el Distrito CTI está estructurando un marco legal que permita al Estado ser un cliente inteligente.",
    date: "3 jul 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: false,
  },
  {
    id: "a-3",
    tag: "Radar CTI",
    title: "Medellín en el mapa global: Análisis de nuestro posicionamiento 2024",
    excerpt: "Una mirada a profundidad a los rankings internacionales y las áreas clave donde la ciudad debe enfocar su inversión.",
    date: "19 jun 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: true,
  },
  {
    id: "a-4",
    tag: "Análisis CTI",
    title: "Tendencias de financiamiento en emprendimientos de base tecnológica",
    excerpt: "El comportamiento del capital emprendedor y la inversión extranjera directa en el ecosistema local durante el último semestre.",
    date: "11 jun 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: false,
  },
  {
    id: "a-5",
    tag: "Blog",
    title: "Construyendo un ecosistema de innovación centrado en el bienestar",
    excerpt: "Reflexiones sobre cómo alinear las políticas de CTI con las metas de desarrollo social y sostenibilidad de la ciudad.",
    date: "28 may 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: false,
  },
  {
    id: "a-6",
    tag: "Radar CTI",
    title: "Reporte de indicadores de Ciencia, Tecnología e Innovación",
    excerpt: "Cifras consolidadas del ecosistema, patentes, grupos de investigación y formación de talento especializado.",
    date: "14 may 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: false,
  },
  {
    id: "a-7",
    tag: "Selección de Nova",
    title: "Prospectiva tecnológica: Los diez sectores clave para la próxima década",
    excerpt: "He analizado múltiples reportes globales para identificar las áreas con mayor potencial de crecimiento económico para la ciudad.",
    date: "29 abr 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: true,
  },
  {
    id: "a-8",
    tag: "Selección de Nova",
    title: "Cerrando la brecha de género en carreras STEM",
    excerpt: "Una compilación de intervenciones basadas en evidencia que han demostrado efectividad en otras ciudades innovadoras.",
    date: "10 abr 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: true,
  },
  {
    id: "a-9",
    tag: "Blog",
    title: "Innovación abierta: Casos de éxito corporativo en Antioquia",
    excerpt: "Cómo las grandes empresas están colaborando con startups para resolver desafíos complejos y dinamizar el mercado.",
    date: "18 mar 2025",
    author: "Centro de Pensamiento de Ruta N",
    novaSelection: false,
  },
];

// All unique tags (in defined order)
const ALL_TAGS = ["Todos", ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.tag)))];

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — Banner
// ─────────────────────────────────────────────────────────────────────────────

function BlogBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
        );
      }
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
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
      id="blog-hero"
      className="pt-32 pb-20 px-6 lg:px-10 xl:px-12 relative overflow-hidden"
      style={{ background: "#253D36" }}
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
        <div className="max-w-[680px]">
          <p
            className="text-[10px] tracking-[0.32em] uppercase font-bold mb-6"
            style={{ color: "#C0D400", fontFamily: "'Source Sans 3',Arial,sans-serif" }}
          >
            Blog
          </p>
          <h1
            ref={headingRef}
            className="text-white mb-5"
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
            Blog
          </h1>
          <p
            ref={descRef}
            className="text-white/70"
            style={{
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              opacity: 0,
            }}
          >
            Lo que estamos pensando.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — Selección de Nova strip
// ─────────────────────────────────────────────────────────────────────────────

function NovaSelectionStrip() {
  const novaArticles = BLOG_ARTICLES.filter((a) => a.novaSelection);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>(".nova-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
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
      id="blog-nova"
      className="py-16 lg:py-20 px-6 lg:px-10 xl:px-12 relative"
      style={{ background: "#111111" }}
      aria-labelledby="nova-strip-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2 mb-10">
          <Sparkles className="w-4 h-4 text-[#C0D400]" aria-hidden="true" />
          <h2
            id="nova-strip-heading"
            className="text-[#C0D400]"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
              fontSize: "0.875rem",
              fontWeight: 800,
              letterSpacing: "-0.01em",
            }}
          >
            Selección de Nova
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {novaArticles.map((article) => (
            <a
              key={article.id}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="nova-card group flex flex-col gap-4 p-5 rounded-[4px] border border-white/10 hover:border-[#C0D400]/40 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
              style={{ background: "rgba(255,255,255,0.03)", opacity: 0 }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#C0D400] self-start"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {article.tag}
              </span>
              <p
                className="text-white leading-snug group-hover:text-[#C0D400] transition-colors duration-200"
                style={{
                  fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                  fontSize: "0.9375rem",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                }}
              >
                {article.title}
              </p>
              <p
                className="text-white/50 text-sm leading-relaxed line-clamp-2"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                {article.excerpt}
              </p>
              <p
                className="text-white/30 text-xs mt-auto"
                style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              >
                {article.date}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — Article Card
// ─────────────────────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="article-card group flex flex-col gap-4 p-6 rounded-[4px] border border-[rgba(37,61,54,0.1)] bg-white hover:border-[rgba(37,61,54,0.25)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
      style={{ opacity: 0 }}
      aria-label={article.title}
    >
      {/* Tag */}
      <span
        className="inline-flex items-center text-[10px] uppercase tracking-wider self-start px-2.5 py-1 rounded-[3px]"
        style={{
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          background: "rgba(37,61,54,0.07)",
          color: "#253D36",
          border: "1px solid rgba(37,61,54,0.12)",
        }}
      >
        {article.tag}
      </span>

      {/* Title */}
      <p
        className="text-[#253D36] leading-snug group-hover:text-[#253D36]/80 transition-colors duration-200"
        style={{
          fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
          fontSize: "1.0625rem",
          fontWeight: 800,
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
        }}
      >
        {article.title}
      </p>

      {/* Excerpt */}
      <p
        className="text-[#253D36]/55 text-sm leading-relaxed line-clamp-1 flex-1"
        style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
      >
        {article.excerpt}
      </p>

      {/* Footer: date + author */}
      <div className="flex flex-col gap-0.5 pt-3 border-t border-[rgba(37,61,54,0.08)]">
        <span
          className="text-[#253D36]/35 text-xs"
          style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
        >
          {article.date}
        </span>
        <span
          className="text-[#253D36]/50 text-xs"
          style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
        >
          {article.author}
        </span>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — Main grid section
// ─────────────────────────────────────────────────────────────────────────────

function BlogGrid() {
  const [activeTag, setActiveTag] = useState("Todos");
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = BLOG_ARTICLES.filter((a) => {
    const matchTag = activeTag === "Todos" || a.tag === activeTag;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tag.toLowerCase().includes(q);
    return matchTag && matchQuery;
  });

  // Animate cards in when filter/query changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".article-card");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.07 }
    );
  }, [activeTag, query]);

  // Scroll entrance animation (only on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".article-card");
      if (cards.length === 0) return;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog-articulos"
      className="py-20 lg:py-28 px-6 lg:px-10 xl:px-12 relative"
      style={{ background: "#F7F7F5" }}
      aria-labelledby="blog-grid-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Search + filters */}
        <div className="flex flex-col gap-5 mb-12">
          <h2
            id="blog-grid-heading"
            className="text-[#253D36] sr-only"
          >
            Artículos del blog
          </h2>

          {/* Search */}
          <div className="relative max-w-[420px]">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#253D36]/35 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Busca un artículo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-sm text-[#253D36] placeholder:text-[#253D36]/35 bg-white border border-[rgba(37,61,54,0.15)] rounded-[4px] focus:outline-none focus:border-[#253D36] focus:ring-1 focus:ring-[#253D36] transition-all duration-200"
              style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
              aria-label="Buscar artículos"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#253D36]/35 hover:text-[#253D36] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] rounded-sm"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            {ALL_TAGS.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="px-4 py-2 rounded-[4px] text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif",
                    background: isActive ? "#253D36" : "rgba(37,61,54,0.07)",
                    color: isActive ? "#C0D400" : "#253D36",
                    border: `1px solid ${isActive ? "#253D36" : "rgba(37,61,54,0.12)"}`,
                  }}
                  aria-pressed={isActive}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <p
              className="text-[#253D36]/50 max-w-[380px] leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3',Arial,sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              No encontramos nada con esos criterios. Prueba con menos filtros o con otra palabra.
            </p>
            <button
              onClick={() => { setActiveTag("Todos"); setQuery(""); }}
              className="mt-6 px-5 py-2.5 rounded-[4px] text-sm font-bold text-[#253D36] border border-[rgba(37,61,54,0.2)] hover:bg-[rgba(37,61,54,0.06)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro',Arial,sans-serif" }}
            >
              Quitar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG PAGE
// ─────────────────────────────────────────────────────────────────────────────

const BLOG_SECTIONS = [
  { id: "blog-hero",      label: "Inicio" },
  { id: "blog-nova",      label: "Selección Nova" },
  { id: "blog-articulos", label: "Artículos" },
];

export function BlogPage() {
  return (
    <>
      <FloatingNav sections={BLOG_SECTIONS} />
      <BlogBanner />
      <NovaSelectionStrip />
      <BlogGrid />
    </>
  );
}
