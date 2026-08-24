/**
 * Centro de Pensamiento Ruta N — Main Application
 *
 * Phased build: reusable site header with full GSAP
 * motion system, accessible desktop dropdowns, global search,
 * newsletter CTA, scroll-direction behaviour, and a mobile drawer
 * with focus-trap and GSAP-animated accordions.
 *
 * All visible copy is in Spanish. Code, types and comments in English.
 * Replace the <RutaNMark /> SVG with the official logo asset when available.
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Outlet, RouterProvider, createBrowserRouter, useNavigate, useLocation } from "react-router";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Menu,
  ArrowDown,
  Download,
  Image as ImageIcon,
  Activity,
  Globe,
  Database,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Info
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { AnalisisCTIPage } from "./pages/AnalisisPage";
import { LabPoliticasPage } from "./pages/LabPoliticasPage";
import { DocumentacionPage } from "./pages/DocumentacionPage";
import { ComprasPage } from "./pages/ComprasPage";
import { BlogPage } from "./pages/BlogPage";
import { DataPage } from "./pages/DataPage";
import { FloatingNav } from "./components/FloatingNav";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SubmenuItem {
  label: string;
  description: string;
  href: string;
}

interface NavItem {
  id: string;
  label: string;
  descriptor: string;
  href: string;
  submenu?: SubmenuItem[];
}

interface SubNavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  activePage?: string;
  subnav?: SubNavItem[];
  onNavigate?: (href: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const NAV_CONFIG: NavItem[] = [
  {
    id: "radar-cti",
    label: "Mapeo",
    descriptor: "Datos, rankings y pulso del ecosistema",
    href: "/radar-cti",
    submenu: [
      {
        label: "Mapeo",
        description: "Inicio de la sección",
        href: "/radar-cti",
      },
      {
        label: "Repositorio",
        description: "Explora documentos y recursos",
        href: "/radar-cti/repositorio",
      },
      {
        label: "Oportunidades",
        description: "Encuentra convocatorias y proyectos",
        href: "/radar-cti/oportunidades",
      },
      {
        label: "Rankings",
        description: "Medellín en el mapa global",
        href: "/radar-cti/rankings",
      },
      {
        label: "Data",
        description: "Tableros, series y reportes",
        href: "/radar-cti/data",
      },
    ],
  },
  {
    id: "analisis-cti",
    label: "Medición",
    descriptor: "Análisis a profundidad y prospectiva",
    href: "/analisis-cti",
    submenu: [
      {
        label: "Medición",
        description: "Inicio de la sección",
        href: "/analisis-cti",
      },
      {
        label: "Pulso CTI",
        description: "Ir a la página de Ruta N",
        href: "https://www.rutanmedellin.org",
      },
    ],
  },
  {
    id: "lab-de-politicas",
    label: "Lab Política",
    descriptor: "Política pública que habilita la innovación",
    href: "/lab-de-politicas",
    submenu: [
      {
        label: "Inicio Lab Política",
        description: "Portada de la sección",
        href: "/lab-de-politicas",
      },
      {
        label: "Documentación",
        description: "Repositorio normativo del Distrito CTI",
        href: "/lab-de-politicas/documentacion",
      },
      {
        label: "Compras Públicas Innovadoras",
        description: "Cómo comprar innovación",
        href: "/lab-de-politicas/compras",
      },
    ],
  },
  {
    id: "blog",
    label: "Blog",
    descriptor: "Lo que estamos pensando",
    href: "/blog",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: FOCUS TRAP
// ─────────────────────────────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RUTA N LOGO MARK
// Replace with official SVG/PNG asset when available.
// ─────────────────────────────────────────────────────────────────────────────

function RutaNMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="54"
      height="30"
      viewBox="0 0 54 30"
      fill="none"
      aria-hidden="true"
      className={className}
      role="img"
    >
      <rect width="54" height="30" rx="3" fill="#253D36" />
      <text
        x="6"
        y="21"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="12"
        fontWeight="600"
        fill="#C0D400"
        letterSpacing="0.3"
      >
        ruta
      </text>
      <text
        x="37"
        y="21"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#FFFFFF"
        letterSpacing="-0.5"
      >
        N
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE HEADER
// ─────────────────────────────────────────────────────────────────────────────

function SiteHeader({
  activePage = "/",
  onNavigate,
  subnav,
}: SiteHeaderProps) {
  // ── Refs ──────────────────────────────────────────────────────────────────

  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Dropdown panels & their list items
  const dropdownRefs = useRef<Record<string, HTMLElement | null>>({});
  const dropdownRowRefs = useRef<Record<string, HTMLElement[]>>({});

  // Mobile drawer
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerNavItemsRef = useRef<HTMLLIElement[]>([]);
  const accordionContentRefs = useRef<Record<string, HTMLElement | null>>({});
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeDrawerBtnRef = useRef<HTMLButtonElement>(null);

  // Search
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Track current open dropdown imperatively to avoid stale closures
  const currentDropdownId = useRef<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── State ─────────────────────────────────────────────────────────────────

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  // ── Reduced-motion preference ─────────────────────────────────────────────

  const prefersReduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const d = (base: number) => (prefersReduced.current ? 0 : base);

  // ── Scroll behaviour — always visible, only compacts ─────────────────────

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    if (!header || !inner) return;

    let pending = false;
    let raf = 0;
    const THRESHOLD_COMPACT = 80;

    const update = () => {
      const y = window.scrollY;
      const dur = d(0.32);
      const ease = "power2.out";

      if (y <= THRESHOLD_COMPACT) {
        gsap.to(inner, { height: 88, duration: dur, ease });
      } else {
        gsap.to(inner, { height: 64, duration: dur, ease });
      }

      pending = false;
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Global keyboard handler ───────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (searchOpen) {
        closeSearch();
      } else if (currentDropdownId.current) {
        animateCloseDropdown(currentDropdownId.current);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // ── Outside-click closes open dropdown ───────────────────────────────────

  useEffect(() => {
    if (!openDropdown) return;
    const onMousedown = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        animateCloseDropdown(currentDropdownId.current);
      }
    };
    document.addEventListener("mousedown", onMousedown);
    return () => document.removeEventListener("mousedown", onMousedown);
  }, [openDropdown]);

  // ── Body scroll lock when mobile menu is open ─────────────────────────────

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ── Focus trap for mobile drawer ──────────────────────────────────────────

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!mobileOpen || !drawer) return;

    const onTab = (e: KeyboardEvent) => trapFocus(drawer, e);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };

    drawer.addEventListener("keydown", onTab);
    drawer.addEventListener("keydown", onEsc);

    // Move focus into drawer after animation
    const timer = setTimeout(() => {
      closeDrawerBtnRef.current?.focus();
    }, d(420));

    return () => {
      drawer.removeEventListener("keydown", onTab);
      drawer.removeEventListener("keydown", onEsc);
      clearTimeout(timer);
    };
  }, [mobileOpen]);

  // ── Dropdown helpers ──────────────────────────────────────────────────────

  const animateOpenDropdown = (id: string) => {
    const el = dropdownRefs.current[id];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.set(el, { display: "block" });
    gsap.fromTo(
      el,
      { opacity: 0, y: -10, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: d(0.28), ease: "power2.out", overwrite: true }
    );
    const rows = dropdownRowRefs.current[id] ?? [];
    if (rows.length) {
      gsap.killTweensOf(rows);
      gsap.fromTo(
        rows,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: d(0.22), stagger: d(0.055), delay: d(0.07), ease: "power2.out", overwrite: true }
      );
    }
  };

  const animateCloseDropdown = (id: string | null) => {
    if (!id) return;
    const el = dropdownRefs.current[id];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: -8,
      scale: 0.98,
      duration: d(0.2),
      ease: "power2.in",
      overwrite: true,
      onComplete: () => gsap.set(el, { display: "none" }),
    });
    currentDropdownId.current = null;
    setOpenDropdown(null);
  };

  const openDropdownMenu = useCallback((id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (currentDropdownId.current === id) return;
    // Close previous
    if (currentDropdownId.current) {
      animateCloseDropdown(currentDropdownId.current);
    }
    currentDropdownId.current = id;
    setOpenDropdown(id);
    animateOpenDropdown(id);
  }, []);

  const closeDropdownMenu = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      animateCloseDropdown(currentDropdownId.current);
    }, 150);
  }, []);

  const toggleDropdown = useCallback(
    (id: string) => {
      if (currentDropdownId.current === id) closeDropdownMenu();
      else openDropdownMenu(id);
    },
    [openDropdownMenu, closeDropdownMenu]
  );

  // ── Search helpers ────────────────────────────────────────────────────────

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => desktopSearchInputRef.current?.focus(), 40);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ── Mobile menu helpers ───────────────────────────────────────────────────

  const openMobileMenu = () => {
    setMobileOpen(true);
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (prefersReduced.current) {
      gsap.set(drawer, { display: "flex", opacity: 1, x: 0 });
      return;
    }

    gsap.set(drawer, { display: "flex", x: "100%", opacity: 1 });
    gsap.to(drawer, { x: 0, duration: 0.42, ease: "power3.out" });

    const items = drawerNavItemsRef.current;
    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.28, stagger: 0.065, delay: 0.22, ease: "power2.out" }
      );
    }
  };

  const closeMobileMenu = () => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const finish = () => {
      gsap.set(drawer, { display: "none" });
      setMobileOpen(false);
      setMobileAccordion(null);
      hamburgerRef.current?.focus();
    };

    if (prefersReduced.current) {
      finish();
      return;
    }

    gsap.to(drawer, {
      x: "100%",
      duration: 0.32,
      ease: "power3.in",
      onComplete: finish,
    });
  };

  const toggleMobileAccordion = (id: string) => {
    const el = accordionContentRefs.current[id];
    if (!el) return;

    if (mobileAccordion === id) {
      // Close
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: d(0.24),
        ease: "power2.in",
      });
      setMobileAccordion(null);
    } else {
      // Close any open accordion
      if (mobileAccordion) {
        const prev = accordionContentRefs.current[mobileAccordion];
        if (prev) {
          gsap.to(prev, { height: 0, opacity: 0, duration: d(0.2) });
        }
      }
      // Open new
      gsap.set(el, { height: "auto", opacity: 1 });
      const { height } = el.getBoundingClientRect();
      gsap.from(el, {
        height: 0,
        opacity: 0,
        duration: d(0.3),
        ease: "power2.out",
        clearProps: "height",
      });
      setMobileAccordion(id);
    }
  };

  // ── Derived active-page helpers ───────────────────────────────────────────

  const isActive = (item: NavItem) =>
    activePage === item.href ||
    (item.submenu?.some((s) => activePage === s.href) ?? false);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── MAIN HEADER ────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="rn-safe-top fixed top-0 inset-x-0 z-50 bg-white"
        style={{ borderBottom: "1px solid rgba(37,61,54,0.09)" }}
      >
        {/* Primary bar */}
        <div
          ref={innerRef}
          className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 flex items-center justify-between gap-4"
          style={{ height: 88 }}
        >
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate?.("/"); }}
            className="flex items-center gap-3 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-2"
            aria-label="Centro de Pensamiento Ruta N — Inicio"
          >
            <RutaNMark />
            <span
              className="hidden sm:block text-[10px] tracking-[0.14em] uppercase leading-tight max-w-[120px]"
              style={{
                color: "rgba(37,61,54,0.6)",
                fontFamily:
                  "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              }}
            >
              Centro de Pensamiento
            </span>
          </a>

          {/* ── Desktop navigation ───────────────────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-0 flex-1 justify-center"
            aria-label="Navegación principal"
          >
            {NAV_CONFIG.map((item) => {
              const active = isActive(item);
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.submenu && openDropdownMenu(item.id)}
                  onMouseLeave={() => item.submenu && closeDropdownMenu()}
                >
                  {/* Nav trigger */}
                  {item.submenu ? (
                    <button
                      id={`nav-${item.id}`}
                      aria-expanded={openDropdown === item.id}
                      aria-controls={`dd-${item.id}`}
                      aria-haspopup="true"
                      onClick={() => toggleDropdown(item.id)}
                      className={`relative flex items-center gap-1.5 px-4 h-11 text-[13.5px] rounded-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-1 ${
                        active
                          ? "text-[#253D36] font-semibold bg-[#253D36]/8"
                          : "text-[#253D36]/65 hover:text-[#253D36] hover:bg-[#253D36]/8 font-medium"
                      }`}
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          openDropdown === item.id ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#C0D400] transition-opacity duration-150 ${active || openDropdown === item.id ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); onNavigate?.(item.href); }}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center px-4 h-11 text-[13.5px] rounded-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-1 ${
                        active
                          ? "text-[#253D36] font-semibold bg-[#253D36]/8"
                          : "text-[#253D36]/65 hover:text-[#253D36] hover:bg-[#253D36]/8 font-medium"
                      }`}
                      style={{
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#C0D400] transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      />
                    </a>
                  )}

                  {/* ── Dropdown panel ─────────────────────────────────── */}
                  {item.submenu && (
                    <div
                      id={`dd-${item.id}`}
                      ref={(el) => { dropdownRefs.current[item.id] = el; }}
                      role="region"
                      aria-labelledby={`nav-${item.id}`}
                      className="absolute left-0 w-72 pt-1.5"
                      style={{
                        top: "100%",
                        display: "none",
                      }}
                    >
                      <div className="bg-white rounded-sm overflow-hidden" style={{ border: "1px solid rgba(37,61,54,0.10)", boxShadow: "0 8px 24px rgba(37,61,54,0.10), 0 2px 6px rgba(37,61,54,0.06)" }}>
                        {(() => {
                          const [root, ...branches] = item.submenu!;
                          return (
                            <div className="px-4 py-4">
                              {/* Root node (Inicio de la sección) */}
                              <a
                                ref={(el) => {
                                  if (!dropdownRowRefs.current[item.id])
                                    dropdownRowRefs.current[item.id] = [];
                                  if (el) dropdownRowRefs.current[item.id][0] = el;
                                }}
                                href={root.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  closeDropdownMenu();
                                  onNavigate?.(root.href);
                                }}
                                className="flex items-center gap-2 rounded-sm px-2 py-1.5 mb-1 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                                style={{ outline: "none" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(37,61,54,0.10)";
                                  const dot = e.currentTarget.querySelector<HTMLElement>(".root-dot");
                                  const label = e.currentTarget.querySelector<HTMLElement>(".root-label");
                                  if (dot) dot.style.background = "#C0D400";
                                  if (label) label.style.color = "#253D36";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "";
                                  const dot = e.currentTarget.querySelector<HTMLElement>(".root-dot");
                                  const label = e.currentTarget.querySelector<HTMLElement>(".root-label");
                                  if (dot) dot.style.background = "#253D36";
                                  if (label) label.style.color = "#253D36";
                                }}
                                onFocus={(e) => { e.currentTarget.style.background = "rgba(37,61,54,0.10)"; }}
                                onBlur={(e) => { e.currentTarget.style.background = ""; }}
                              >
                                {/* Root dot */}
                                <span
                                  className="root-dot shrink-0 rounded-full transition-colors duration-150"
                                  style={{ width: 7, height: 7, background: "#253D36", display: "inline-block" }}
                                  aria-hidden="true"
                                />
                                <span
                                  className="root-label text-sm font-bold text-[#253D36] leading-tight transition-colors duration-150"
                                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                                >
                                  {item.label}
                                </span>
                              </a>

                              {/* Branch items */}
                              <ul role="list" className="pl-3" style={{ borderLeft: "1.5px solid rgba(37,61,54,0.18)" }}>
                                {branches.map((sub, idx) => {
                                  const isLast = idx === branches.length - 1;
                                  return (
                                    <li key={sub.href} className="flex items-stretch">
                                      {/* Horizontal branch connector */}
                                      <div
                                        className="shrink-0 mt-[17px]"
                                        style={{ width: 12, height: 1.5, background: "rgba(37,61,54,0.18)" }}
                                        aria-hidden="true"
                                      />
                                      <a
                                        ref={(el) => {
                                          if (!dropdownRowRefs.current[item.id])
                                            dropdownRowRefs.current[item.id] = [];
                                          if (el) dropdownRowRefs.current[item.id][idx + 1] = el;
                                        }}
                                        href={sub.href}
                                        target={sub.href.startsWith("http") ? "_blank" : undefined}
                                        rel={sub.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        onClick={(e) => {
                                          if (sub.href.startsWith("http")) {
                                            closeDropdownMenu();
                                            return;
                                          }
                                          e.preventDefault();
                                          closeDropdownMenu();
                                          onNavigate?.(sub.href);
                                        }}
                                        className="flex-1 min-w-0 rounded-sm px-2 py-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                                        style={{ outline: "none" }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = "rgba(192,212,0,0.10)";
                                          const label = e.currentTarget.querySelector<HTMLElement>(".branch-label");
                                          if (label) label.style.color = "#253D36";
                                          if (label) label.style.fontWeight = "700";
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = "";
                                          const label = e.currentTarget.querySelector<HTMLElement>(".branch-label");
                                          if (label) label.style.color = "#253D36";
                                          if (label) label.style.fontWeight = "500";
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.background = "rgba(192,212,0,0.10)"; }}
                                        onBlur={(e) => { e.currentTarget.style.background = ""; }}
                                      >
                                        <p
                                          className="branch-label text-sm text-[#253D36] leading-tight transition-all duration-150"
                                          style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", fontWeight: 500 }}
                                        >
                                          {sub.label}
                                        </p>
                                        <p
                                          className="text-xs leading-snug mt-0.5"
                                          style={{ color: "rgba(37,61,54,0.50)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                                        >
                                          {sub.description}
                                        </p>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Desktop utilities ─────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Search */}
            {searchOpen ? (
              <div
                className="flex items-center gap-2 rounded-sm px-3 bg-white"
                style={{
                  border: "1px solid rgba(37,61,54,0.15)",
                  minWidth: 320,
                }}
              >
                <Search
                  className="w-4 h-4 shrink-0"
                  style={{ color: "rgba(37,61,54,0.38)" }}
                  aria-hidden="true"
                />
                <input
                  ref={desktopSearchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca un dato, un informe o una norma…"
                  className="flex-1 py-2.5 text-sm bg-transparent focus:outline-none text-[#111111]"
                  style={{
                    fontFamily:
                      "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                  }}
                  aria-label="Buscar en el sitio"
                />
                <button
                  onClick={closeSearch}
                  aria-label="Cerrar búsqueda"
                  className="p-1 rounded-sm transition-colors hover:bg-[#253D36]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                  style={{ color: "rgba(37,61,54,0.45)" }}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                onClick={openSearch}
                aria-label="Abrir búsqueda"
                className="p-2.5 rounded-sm transition-colors hover:bg-[#253D36]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                style={{ color: "rgba(37,61,54,0.50)" }}
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* Newsletter CTA */}
            <a
              href="#newsletter"
              onClick={(e) => { e.preventDefault(); onNavigate?.("#newsletter"); }}
              className="group flex items-center gap-2 font-semibold text-sm text-[#253D36] bg-[#C0D400] px-5 rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2"
              style={{
                minHeight: 44,
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              }}
            >
              Suscribirme al boletín
            </a>
          </div>

          {/* ── Mobile controls ───────────────────────────────────────────── */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              aria-label="Abrir búsqueda"
              className="rn-tap flex items-center justify-center rounded-sm transition-colors hover:bg-[#253D36]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
              style={{ color: "rgba(37,61,54,0.55)", minWidth: 44, minHeight: 44 }}
              onClick={openSearch}
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              ref={hamburgerRef}
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={openMobileMenu}
              className="rn-tap flex items-center justify-center rounded-sm transition-colors hover:bg-[#253D36]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
              style={{ color: "rgba(37,61,54,0.55)", minWidth: 44, minHeight: 44 }}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Optional sub-navigation bar ────────────────────────────────── */}
        {subnav && subnav.length > 0 && (
          <div
            className="hidden lg:block"
            style={{ borderTop: "1px solid rgba(37,61,54,0.07)" }}
          >
            <div className="max-w-[1440px] mx-auto px-10 xl:px-12">
              <nav
                aria-label="Navegación de sección"
                className="flex items-stretch gap-0"
              >
                {subnav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); onNavigate?.(item.href); }}
                    className="px-5 py-2.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C0D400]"
                    style={{
                      color: "rgba(37,61,54,0.55)",
                      borderBottom: "2px solid transparent",
                      fontFamily:
                        "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#253D36";
                      (e.currentTarget as HTMLElement).style.borderBottomColor = "#C0D400";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "rgba(37,61,54,0.55)";
                      (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* ── MOBILE SEARCH OVERLAY (shown when search triggered on mobile) ── */}
      {searchOpen && (
        <div
          className="rn-safe-top fixed top-0 inset-x-0 z-[60] lg:hidden bg-white p-4 flex items-center gap-3"
          style={{
            borderBottom: "1px solid rgba(37,61,54,0.09)",
            boxShadow: "0 4px 12px rgba(37,61,54,0.08)",
          }}
        >
          <Search
            className="w-4 h-4 shrink-0"
            style={{ color: "rgba(37,61,54,0.38)" }}
            aria-hidden="true"
          />
          <input
            ref={mobileSearchInputRef}
            type="search"
            placeholder="Busca un dato, un informe o una norma…"
            autoFocus
            className="flex-1 text-sm text-[#111111] bg-transparent focus:outline-none"
            style={{
              fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
            }}
            aria-label="Buscar en el sitio"
          />
          <button
            onClick={closeSearch}
            aria-label="Cerrar búsqueda"
            className="rn-tap flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
            style={{ color: "rgba(37,61,54,0.50)", minWidth: 44, minHeight: 44 }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ── MOBILE NAVIGATION DRAWER ─────────────────────────────────────── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed inset-0 z-[100] flex-col bg-white"
        style={{ display: "none" }}
      >
        {/* Drawer header */}
        <div
          className="rn-safe-top flex items-center justify-between px-6"
          style={{
            borderBottom: "1px solid rgba(37,61,54,0.09)",
            flexShrink: 0,
            minHeight: 64,
          }}
        >
          <a
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
            aria-label="Inicio"
          >
            <RutaNMark />
            <span
              className="text-[10px] tracking-[0.14em] uppercase"
              style={{
                color: "rgba(37,61,54,0.6)",
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              }}
            >
              Centro de Pensamiento
            </span>
          </a>
          <button
            ref={closeDrawerBtnRef}
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
            className="flex items-center justify-center rounded-sm transition-colors hover:bg-[#253D36]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
            style={{
              minWidth: 44,
              minHeight: 44,
              color: "rgba(37,61,54,0.55)",
            }}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="rn-drawer-scroll flex-1 overflow-y-auto">
          {/* Search inside drawer */}
          <div className="px-6 pt-5 pb-3">
            <div
              className="flex items-center gap-3 px-4 rounded-sm"
              style={{ border: "1px solid rgba(37,61,54,0.14)" }}
            >
              <Search
                className="w-4 h-4 shrink-0"
                style={{ color: "rgba(37,61,54,0.38)" }}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Busca un dato, un informe o una norma…"
                className="flex-1 py-3 text-sm text-[#111111] bg-transparent focus:outline-none"
                style={{
                  fontFamily:
                    "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                }}
                aria-label="Buscar en el sitio"
              />
            </div>
          </div>

          {/* Nav items */}
          <nav className="px-4 pb-4" aria-label="Navegación principal móvil">
            <ul role="list">
              {NAV_CONFIG.map((item, i) => (
                <li
                  key={item.id}
                  ref={(el) => { if (el) drawerNavItemsRef.current[i] = el; }}
                  style={{ borderBottom: "1px solid rgba(37,61,54,0.08)" }}
                >
                  {item.submenu ? (
                    /* Accordion trigger */
                    <div>
                      <button
                        onClick={() => toggleMobileAccordion(item.id)}
                        aria-expanded={mobileAccordion === item.id}
                        aria-controls={`mob-acc-${item.id}`}
                        className="rn-tap flex items-center justify-between w-full py-4 px-2 transition-colors hover:bg-[#253D36]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C0D400] rounded-sm"
                        style={{ minHeight: 52 }}
                      >
                        <span
                          className="text-[15px] font-semibold text-[#253D36]"
                          style={{
                            fontFamily:
                              "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                          }}
                        >
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileAccordion === item.id ? "rotate-180" : ""
                          }`}
                          style={{ color: "rgba(37,61,54,0.38)" }}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Accordion content */}
                      <div
                        id={`mob-acc-${item.id}`}
                        ref={(el) => { accordionContentRefs.current[item.id] = el; }}
                        className="overflow-hidden"
                        style={{ height: 0, opacity: 0 }}
                      >
                        <ul
                          className="pb-3 pl-2 space-y-0"
                          role="list"
                        >
                          {item.submenu.map((sub) => (
                            <li key={sub.href}>
                              <a
                                href={sub.href}
                                target={sub.href.startsWith("http") ? "_blank" : undefined}
                                rel={sub.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                onClick={(e) => {
                                  if (!sub.href.startsWith("http")) {
                                    e.preventDefault();
                                    onNavigate?.(sub.href);
                                  }
                                  closeMobileMenu();
                                }}
                                className="rn-tap flex items-start gap-3 py-3 px-2 rounded-sm group transition-colors hover:bg-[#253D36]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C0D400]"
                                style={{ minHeight: 52 }}
                              >
                                <ArrowRight
                                  className="w-3.5 h-3.5 text-[#C0D400] shrink-0 mt-1"
                                  aria-hidden="true"
                                />
                                <div>
                                  <p
                                    className="text-sm font-semibold text-[#253D36] leading-snug"
                                    style={{
                                      fontFamily:
                                        "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                                    }}
                                  >
                                    {sub.label}
                                  </p>
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{
                                      color: "rgba(37,61,54,0.52)",
                                      fontFamily:
                                        "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                                    }}
                                  >
                                    {sub.description}
                                  </p>
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Direct link */
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        onNavigate?.(item.href);
                      }}
                      aria-current={activePage === item.href ? "page" : undefined}
                      className="rn-tap flex items-center px-2 py-4 text-[15px] font-semibold text-[#253D36] transition-colors rounded-sm hover:bg-[#253D36]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C0D400]"
                      style={{
                        minHeight: 52,
                        fontFamily:
                          "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Drawer footer — newsletter CTA */}
        <div
          className="rn-safe-bottom px-6 py-5 shrink-0"
          style={{ borderTop: "1px solid rgba(37,61,54,0.09)" }}
        >
          <a
            href="#newsletter"
            onClick={() => {
              closeMobileMenu();
              onNavigate?.("#newsletter");
            }}
            className="rn-tap-cta flex items-center justify-center w-full font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36]"
            style={{
              minHeight: 48,
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
            }}
          >
            Suscribirme al boletín
          </a>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA NETWORK VISUALIZATION
// Abstract SVG composition: nodes, connections, tracers — brand colors only.
// ─────────────────────────────────────────────────────────────────────────────

interface Node {
  id: string; cx: number; cy: number; r: number;
  color: string; rings?: number; label?: string; labelY?: number;
}

const NODES: Node[] = [
  { id: "hub",  cx: 300, cy: 168, r: 22, color: "#C0D400",  rings: 2, label: "847", labelY: 210 },
  { id: "n2",   cx: 112, cy: 248, r: 9,  color: "#00B8A3",  label: "CTI",  labelY: 268 },
  { id: "n3",   cx: 478, cy: 198, r: 13, color: "#0068FF",  label: "2.3%", labelY: 222 },
  { id: "n4",   cx:  68, cy: 378, r: 6,  color: "#FFCA00" },
  { id: "n5",   cx: 394, cy: 318, r: 11, color: "#00B8A3",  label: "R&D",  labelY: 340 },
  { id: "n6",   cx: 188, cy: 462, r: 15, color: "#C0D400",  rings: 1, label: "5.1B", labelY: 486 },
  { id: "n7",   cx: 508, cy: 432, r: 7,  color: "#0068FF" },
  { id: "n8",   cx: 148, cy: 564, r: 9,  color: "#00B8A3" },
  { id: "n9",   cx: 428, cy: 542, r: 11, color: "#FFCA00",  label: "+12%", labelY: 564 },
  { id: "n10",  cx: 312, cy: 502, r: 6,  color: "#C0D400" },
  { id: "n11",  cx:  46, cy: 494, r: 4,  color: "#0068FF" },
  { id: "n12",  cx: 548, cy: 314, r: 5,  color: "#FFCA00" },
  { id: "n13",  cx: 252, cy: 358, r: 7,  color: "#00B8A3" },
  { id: "n14",  cx: 360, cy: 418, r: 5,  color: "#C0D400" },
];

const EDGES = [
  ["hub","n2"],["hub","n3"],["hub","n5"],["hub","n13"],
  ["n2","n4"],["n2","n13"],["n4","n11"],["n4","n6"],
  ["n3","n12"],["n3","n7"],["n5","n7"],["n5","n12"],
  ["n5","n14"],["n13","n6"],["n13","n14"],["n6","n8"],
  ["n6","n10"],["n10","n9"],["n9","n7"],["n8","n10"],["n14","n9"],
];

// Animated tracers: path defined as [from nodeId, to nodeId, ...to nodeId]
const TRACER_PATHS = [
  { id: "t1", nodes: ["hub","n3","n7","n9"],  color: "#C0D400",  dur: 6 },
  { id: "t2", nodes: ["n2","n13","n14","n10"], color: "#00B8A3", dur: 8 },
  { id: "t3", nodes: ["hub","n5","n12"],       color: "#0068FF", dur: 5 },
];

function DataVizCanvas({ reduced }: { reduced: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const ringRefs = useRef<Record<string, SVGCircleElement[]>>({});
  const tracerRefs = useRef<(SVGCircleElement | null)[]>([]);

  const nodeMap: Record<string, Node> = {};
  NODES.forEach((n) => { nodeMap[n.id] = n; });

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {

      // Slow vertical float on the whole SVG
      gsap.to(svgRef.current, {
        y: -12, duration: 5.5, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });

      // Pulse rings
      NODES.forEach((n) => {
        if (!n.rings) return;
        const rings = ringRefs.current[n.id] ?? [];
        rings.forEach((ring, i) => {
          gsap.fromTo(ring,
            { attr: { r: n.r + 2 }, opacity: 0.55 },
            {
              attr: { r: n.r + 22 + i * 10 }, opacity: 0,
              duration: 2.8 + i * 0.6, ease: "power1.out",
              repeat: -1, delay: i * 1.2,
            }
          );
        });
      });

      // Node gentle scale pulse (selected nodes)
      ["hub","n6"].forEach((id, i) => {
        const el = nodeRefs.current[id];
        if (!el) return;
        gsap.to(el, {
          attr: { r: (nodeMap[id].r * 1.18) },
          duration: 2.2 + i * 0.5, ease: "sine.inOut",
          yoyo: true, repeat: -1, delay: i * 1.1,
        });
      });

      // Animate tracer dots along their paths
      TRACER_PATHS.forEach((tp, ti) => {
        const dot = tracerRefs.current[ti];
        if (!dot) return;
        const pts = tp.nodes.map((id) => ({ x: nodeMap[id].cx, y: nodeMap[id].cy }));

        const tl = gsap.timeline({ repeat: -1 });
        pts.forEach((pt, i) => {
          if (i === 0) {
            tl.set(dot, { attr: { cx: pt.x, cy: pt.y }, opacity: 0 });
            tl.to(dot, { opacity: 1, duration: 0.25 });
            return;
          }
          tl.to(dot, {
            attr: { cx: pt.x, cy: pt.y },
            duration: (tp.dur / (pts.length - 1)),
            ease: "none",
          });
        });
        tl.to(dot, { opacity: 0, duration: 0.35 });
        tl.delay(ti * 1.8);
      });

    }, svgRef);

    return () => ctx.revert();
  }, [reduced]);

  const getNode = (id: string) => nodeMap[id];

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
      style={{ maxHeight: 620 }}
    >
      {/* Subtle grid lines */}
      {[160, 240, 320, 400, 480, 560].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y}
          stroke="white" strokeOpacity="0.045" strokeWidth="1" />
      ))}
      {[120, 240, 360, 480].map((x) => (
        <line key={x} x1={x} y1="80" x2={x} y2="620"
          stroke="white" strokeOpacity="0.03" strokeWidth="1" />
      ))}

      {/* Large background arc — framing element */}
      <circle cx="520" cy="310" r="260"
        stroke="#C0D400" strokeOpacity="0.07" strokeWidth="1.5" />
      <circle cx="520" cy="310" r="195"
        stroke="#00B8A3" strokeOpacity="0.055" strokeWidth="1" />

      {/* Small axis tick marks */}
      {[160, 240, 320, 400, 480].map((y) => (
        <line key={y} x1="30" y1={y} x2="42" y2={y}
          stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      ))}

      {/* Edges */}
      <g>
        {EDGES.map(([a, b]) => {
          const na = getNode(a); const nb = getNode(b);
          const isDashed = Math.abs(na.cx - nb.cx) + Math.abs(na.cy - nb.cy) > 260;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
              stroke="white"
              strokeOpacity={isDashed ? "0.07" : "0.13"}
              strokeWidth={isDashed ? "0.8" : "1"}
              strokeDasharray={isDashed ? "4 5" : undefined}
            />
          );
        })}
      </g>

      {/* Pulse rings for key nodes */}
      {NODES.filter((n) => n.rings).map((n) =>
        Array.from({ length: n.rings! }).map((_, i) => (
          <circle
            key={`ring-${n.id}-${i}`}
            ref={(el) => {
              if (!ringRefs.current[n.id]) ringRefs.current[n.id] = [];
              if (el) ringRefs.current[n.id][i] = el;
            }}
            cx={n.cx} cy={n.cy} r={n.r + 2}
            stroke={n.color} strokeOpacity="0" strokeWidth="1.5" fill="none"
          />
        ))
      )}

      {/* Nodes */}
      {NODES.map((n) => (
        <g key={n.id}>
          {/* Outer ring glow */}
          <circle cx={n.cx} cy={n.cy} r={n.r + 5}
            fill={n.color} fillOpacity="0.1" />
          {/* Core node */}
          <circle
            ref={(el) => { nodeRefs.current[n.id] = el; }}
            cx={n.cx} cy={n.cy} r={n.r}
            fill={n.color} fillOpacity={n.r > 10 ? "0.92" : "0.78"}
          />
          {/* Center dot for large nodes */}
          {n.r >= 12 && (
            <circle cx={n.cx} cy={n.cy} r={Math.round(n.r * 0.32)}
              fill="rgba(37,61,54,0.55)" />
          )}
          {/* Data labels */}
          {n.label && (
            <text
              x={n.cx + (n.r + 8)}
              y={n.labelY ?? n.cy + 4}
              fill={n.color}
              fillOpacity="0.72"
              fontSize="9"
              fontFamily="'Source Sans 3','Source Sans Pro',Arial,sans-serif"
              fontWeight="600"
              letterSpacing="0.04em"
            >
              {n.label}
            </text>
          )}
        </g>
      ))}

      {/* Tracer dots */}
      {TRACER_PATHS.map((tp, i) => {
        const start = nodeMap[tp.nodes[0]];
        return (
          <circle
            key={tp.id}
            ref={(el) => { tracerRefs.current[i] = el; }}
            cx={start.cx} cy={start.cy} r="4"
            fill={tp.color} opacity="0"
            style={{ filter: `drop-shadow(0 0 4px ${tp.color})` }}
          />
        );
      })}

      {/* Corner measurement decoration */}
      <text x="30" y="108"
        fill="white" fillOpacity="0.18"
        fontSize="7.5" fontFamily="'Source Sans 3',Arial,sans-serif"
        letterSpacing="0.12em"
      >
        CTI/MDE
      </text>
      <text x="30" y="122"
        fill="white" fillOpacity="0.12"
        fontSize="7" fontFamily="'Source Sans 3',Arial,sans-serif"
        letterSpacing="0.08em"
      >
        2024 · DATOS
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

function ScrollIndicator({ reduced }: { reduced: boolean }) {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    // Arrow bounces up-down
    gsap.to(arrowRef.current, {
      y: 8, duration: 0.9, ease: "sine.inOut",
      yoyo: true, repeat: -1,
    });
    // Outer ring pulses opacity
    gsap.to(ringRef.current, {
      scale: 1.18, opacity: 0, duration: 1.2, ease: "power1.out",
      yoyo: true, repeat: -1,
    });
  }, [reduced]);

  return (
    <button
      aria-label="Desplázate hacia abajo"
      onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
      className="flex flex-col items-center gap-3 group cursor-pointer focus-visible:outline-none"
    >
      {/* Label */}
      <span
        className="text-[11px] tracking-[0.3em] uppercase transition-colors group-hover:text-white"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Source Sans 3',Arial,sans-serif",
          fontWeight: 600,
        }}
      >
        Scroll
      </span>

      {/* Circle with arrow */}
      <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
        {/* Pulse ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid #C0D400", opacity: 0.5 }}
        />
        {/* Main circle */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300 group-hover:bg-[#C0D400]"
          style={{ border: "2px solid rgba(192,212,0,0.7)", background: "rgba(192,212,0,0.1)" }}
        />
        {/* Arrow */}
        <div ref={arrowRef} className="relative z-10">
          <ArrowDown
            className="transition-colors duration-300 group-hover:text-[#253D36]"
            style={{ width: 22, height: 22, color: "#C0D400" }}
          />
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION — Section 1
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);

    const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current) return;

    const dur = 0.72;
    const ease = "power3.out";

    const tl = gsap.timeline({ defaults: { ease, duration: dur } });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0 }
    )
    .fromTo(headlineRef.current,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0 }, "-=0.42"
    )
    .fromTo(bodyRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 }, "-=0.46"
    )
    .fromTo(ctasRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.56 }, "-=0.44"
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }, "-=0.1"
    )
    .fromTo(vizRef.current,
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.9, ease: "power2.out" }, 0.18
    );

  }, []);

  return (
    <section
      id="fn-hero"
      ref={sectionRef}
      aria-labelledby="hero-headline"
      style={{
        minHeight: "100svh",
        background: "linear-gradient(148deg, #253D36 0%, #1C2E29 50%, #162420 100%)",
        paddingTop: 88,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture: large faint circle bottom-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", bottom: -160, right: -120,
          width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,212,0,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Top-left corner accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 88, left: 0,
          width: 360, height: 360,
          background: "radial-gradient(circle at 0% 0%, rgba(0,184,163,0.065) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-8"
        style={{ minHeight: "calc(100svh - 88px)", paddingBottom: 64 }}
      >
        {/* ── LEFT COLUMN — copy ─────────────────────────────────────── */}
        <div
          className="flex flex-col items-start flex-1 pt-16 lg:pt-0"
          style={{ maxWidth: 560 }}
        >
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="text-[10px] tracking-[0.32em] uppercase mb-8"
            style={{
              color: "#C0D400",
              fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              opacity: reduced.current ? 1 : 0,
            }}
          >
            CENTRO DE PENSAMIENTO · RUTA N
          </p>

          {/* Headline */}
          <h1
            ref={headlineRef}
            id="hero-headline"
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk Text Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: "clamp(2.75rem, 5.5vw, 5.25rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
              marginBottom: "1.75rem",
              opacity: reduced.current ? 1 : 0,
            }}
          >
            Las grandes
            {" "}
            <span style={{ color: "#C0D400" }}>transfor</span>
            maciones
            <br />
            no nacen del azar.
          </h1>

          {/* Body */}
          <p
            ref={bodyRef}
            className="text-[17px] leading-[1.65] mb-10"
            style={{
              color: "rgba(255,255,255,0.62)",
              fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              maxWidth: 440,
              opacity: reduced.current ? 1 : 0,
            }}
          >
            Bienvenidos al lugar donde la ciencia, la tecnología y la innovación
            de Medellín se cuentan con evidencia.
          </p>

          {/* CTAs */}
          <div
            ref={ctasRef}
            className="flex flex-wrap items-center gap-4 mb-16"
            style={{ opacity: reduced.current ? 1 : 0 }}
          >
            <a
              href="/radar-cti/pulso"
              className="group inline-flex items-center gap-2.5 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36]"
              style={{
                minHeight: 52,
                paddingLeft: "1.75rem",
                paddingRight: "1.5rem",
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              }}
            >
              Pulso CTI de Medellín
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>

            <a
              href="/nova"
              className="inline-flex items-center font-medium text-sm transition-colors duration-200 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#253D36]"
              style={{
                minHeight: 52,
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                color: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontFamily:
                  "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ffffff";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Conoce a Nova
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            ref={scrollRef}
            style={{ opacity: reduced.current ? 0.4 : 0 }}
          >
            <ScrollIndicator reduced={reduced.current} />
          </div>
        </div>

        {/* ── RIGHT COLUMN — visualization ──────────────────────────── */}
        <div
          ref={vizRef}
          className="flex-1 flex items-center justify-center self-stretch"
          style={{
            maxWidth: 580,
            minHeight: 380,
            opacity: reduced.current ? 1 : 0,
          }}
          aria-hidden="true"
        >
          <DataVizCanvas reduced={reduced.current} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER SECTIONS — subsequent pages, to be built in later steps
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE SECTION — Section 2
// ─────────────────────────────────────────────────────────────────────────────

const FRAGMENTS = [
  "ESTE ES EL CEREBRO\nESTRATÉGICO DE RUTA N",
  "Recolectamos, analizamos\ny convertimos datos en evidencia",
  "Producimos informes a profundidad,\nsustentados en cifras concretas",
  "Creamos contenidos que sensibilizan\ne inspiran a la ciudadanía y al ecosistema",
  "Leemos el presente y anticipamos\nlas tendencias que vienen",
  "Orientamos programas que mejoran\nla calidad de vida de la ciudad",
  "Y potenciamos las decisiones que transforman\nel desarrollo económico y social de Medellín",
  "ESTE ES EL CENTRO DE\nPENSAMIENTO DE RUTA N"
];

function NarrativeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const stStartRef = useRef<number>(0);
  const stEndRef   = useRef<number>(0);

  const handleSkipDown = () => window.scrollTo({ top: stEndRef.current,   behavior: "smooth" });
  const handleSkipUp   = () => window.scrollTo({ top: stStartRef.current, behavior: "smooth" });

  useEffect(() => {
    const ctx = gsap.matchMedia();

    ctx.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      const slides = gsap.utils.toArray<HTMLElement>('.narrative-slide', container);
      const n = slides.length;

      const totalScroll = (n - 1) * window.innerWidth;

      const scrollTween = gsap.to(container, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.6,
          end: () => "+=" + totalScroll,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (n - 1),
            duration: { min: 0.3, max: 0.7 },
            delay: 0.05,
            ease: "power2.inOut",
          },
          onUpdate(self) {
            const idx = Math.round(self.progress * (n - 1));
            setActiveIdx(idx);
            stStartRef.current = self.start;
            stEndRef.current   = self.end;
          },
        }
      });

      // Per-slide: fade in when entering center, fade out when leaving
      slides.forEach((slide) => {
        const text = slide.querySelector('.narrative-text');
        if (!text) return;

        gsap.fromTo(text,
          { opacity: 0.1, y: 12 },
          {
            opacity: 1, y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: "left 65%",
              end: "center center",
              scrub: true,
            }
          }
        );

        gsap.to(text, {
          opacity: 0.1, y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: slide,
            containerAnimation: scrollTween,
            start: "center center",
            end: "right 35%",
            scrub: true,
          }
        });
      });
    });

    // Mobile / Reduced Motion: Vertical sequence with reveals
    ctx.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      if (!mobileRef.current) return;
      const slides = gsap.utils.toArray<HTMLElement>('.narrative-slide-mobile', mobileRef.current);

      slides.forEach((slide) => {
        const text = slide.querySelector('.narrative-text-mobile');
        if (!text) return;

        gsap.fromTo(text,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: slide,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div id="fn-narrative" className="narrative-pin-wrapper">
      <section
        id="cerebro-estrategico"
        ref={sectionRef}
        className="relative bg-white overflow-hidden"
      >
        {/* DESKTOP: Single horizontal strip with snap stops */}
        <div
          className="hidden lg:flex h-screen items-center"
          ref={containerRef}
          style={{ width: `${FRAGMENTS.length * 100}vw` }}
        >
          {FRAGMENTS.map((fragment, i) => {
            const isHighlight = i === 0 || i === FRAGMENTS.length - 1;
            return (
              <div
                key={i}
                className="narrative-slide flex items-center justify-center h-full shrink-0"
                style={{ width: "100vw", padding: "0 clamp(4rem, 10vw, 12rem)" }}
              >
                <h2
                  className="narrative-text text-center text-[#253D36]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    fontSize: isHighlight ? "clamp(2.2rem, 4vw, 4rem)" : "clamp(1.6rem, 3vw, 3rem)",
                    fontWeight: isHighlight ? 900 : 500,
                    letterSpacing: isHighlight ? "-0.025em" : "-0.01em",
                    lineHeight: 1.15,
                    willChange: "opacity, transform",
                  }}
                >
                  {fragment.split('\n').map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Progress dots + navigation buttons */}
        <div className="hidden lg:flex absolute bottom-10 left-0 right-0 items-center justify-center gap-5 z-20 px-10">

          {/* ← Volver arriba */}
          <button
            onClick={handleSkipUp}
            aria-label="Volver al inicio de la sección"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 group"
            style={{
              background: "transparent",
              border: "1px solid transparent",
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(37,61,54,0.45)",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(37,61,54,0.9)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(37,61,54,0.45)"; }}
          >
            <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Sección anterior
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {FRAGMENTS.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-300"
                style={{
                  width:  i === activeIdx ? 20 : 6,
                  height: 6,
                  background: i === activeIdx ? "#253D36" : "rgba(37,61,54,0.25)",
                }}
              />
            ))}
          </div>

          {/* Saltar sección → */}
          <button
            onClick={handleSkipDown}
            aria-label="Saltar esta sección"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 group"
            style={{
              background: "transparent",
              border: "1px solid transparent",
              fontFamily: "'Source Sans 3',Arial,sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(37,61,54,0.45)",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(37,61,54,0.9)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(37,61,54,0.45)"; }}
          >
            Saltar sección
            <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

        </div>

        {/* MOBILE: Vertical Stack */}
        <div className="lg:hidden py-32 px-6" ref={mobileRef}>
          <div className="flex flex-col gap-24 max-w-xl mx-auto">
            {FRAGMENTS.map((fragment, i) => {
              const isHighlight = i === 0 || i === FRAGMENTS.length - 1;
              return (
                <div key={i} className="narrative-slide-mobile flex items-center min-h-[40vh]">
                  <h2
                    className="narrative-text-mobile text-[#253D36]"
                    style={{
                      fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      fontSize: isHighlight ? "2.5rem" : "2rem",
                      fontWeight: isHighlight ? 900 : 500,
                      letterSpacing: isHighlight ? "-0.02em" : "-0.01em",
                      lineHeight: 1.15,
                    }}
                  >
                    {fragment.split('\n').map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG SECTION — Section 3
// ─────────────────────────────────────────────────────────────────────────────

type TabId = "mas-leidos" | "reciente" | "nova";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
}

const TABS: { id: TabId; label: string }[] = [
  { id: "mas-leidos", label: "Más leídos" },
  { id: "reciente", label: "Lo más reciente" },
  { id: "nova", label: "Selección de Nova" },
];

const POSTS_DATA: Record<TabId, BlogPost[]> = {
  "mas-leidos": [
    {
      id: "ml-1",
      category: "Análisis CTI",
      title: "El impacto de la inteligencia artificial en el tejido empresarial de Medellín",
      excerpt: "Un recorrido exploratorio por los sectores que lideran la adopción tecnológica y los retos de talento para las pymes.",
    },
    {
      id: "ml-2",
      category: "Lab de Políticas",
      title: "Habilitadores normativos para la compra pública de innovación",
      excerpt: "Cómo el Distrito CTI está estructurando un marco legal que permita al Estado ser un cliente inteligente.",
    },
    {
      id: "ml-3",
      category: "Radar CTI",
      title: "Medellín en el mapa global: Análisis de nuestro posicionamiento 2024",
      excerpt: "Una mirada a profundidad a los rankings internacionales y las áreas clave donde la ciudad debe enfocar su inversión.",
    },
  ],
  "reciente": [
    {
      id: "re-1",
      category: "Análisis CTI",
      title: "Tendencias de financiamiento en emprendimientos de base tecnológica",
      excerpt: "El comportamiento del capital emprendedor y la inversión extranjera directa en el ecosistema local durante el último semestre.",
    },
    {
      id: "re-2",
      category: "Blog",
      title: "Construyendo un ecosistema de innovación centrado en el bienestar",
      excerpt: "Reflexiones sobre cómo alinear las políticas de CTI con las metas de desarrollo social y sostenibilidad de la ciudad.",
    },
    {
      id: "re-3",
      category: "Radar CTI",
      title: "Reporte de indicadores de Ciencia, Tecnología e Innovación",
      excerpt: "Cifras consolidadas del ecosistema, patentes, grupos de investigación y formación de talento especializado.",
    },
  ],
  "nova": [
    {
      id: "no-1",
      category: "Selección",
      title: "Prospectiva tecnológica: Los diez sectores clave para la próxima década",
      excerpt: "He analizado múltiples reportes globales para identificar las áreas con mayor potencial de crecimiento económico para la ciudad.",
    },
    {
      id: "no-2",
      category: "Selección",
      title: "Cerrando la brecha de género en carreras STEM",
      excerpt: "Una compilación de intervenciones basadas en evidencia que han demostrado efectividad en otras ciudades innovadoras.",
    },
    {
      id: "no-3",
      category: "Selección",
      title: "Innovación abierta: Casos de éxito corporativo en Antioquia",
      excerpt: "Cómo las grandes empresas están colaborando con startups para resolver desafíos complejos y dinamizar el mercado.",
    },
  ],
};

function BlogSection() {
  const [activeTab, setActiveTab] = useState<TabId>("mas-leidos");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Scroll entrance animation
  useEffect(() => {
    if (reduced.current || !sectionRef.current || !headerRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      gsap.fromTo(gridRef.current!.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab || isTransitioning) return;
    
    if (reduced.current) {
      setActiveTab(tab);
      return;
    }

    setIsTransitioning(true);
    
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.to(cards, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        // Let React render the new cards, then animate them in
        requestAnimationFrame(() => {
          const newCards = gridRef.current?.children;
          if (!newCards) {
            setIsTransitioning(false);
            return;
          }
          gsap.fromTo(newCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              onComplete: () => setIsTransitioning(false)
            }
          );
        });
      }
    });
  };

  const posts = POSTS_DATA[activeTab];

  return (
    <section
      id="fn-blog"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#F2F4F0]"
      aria-labelledby="blog-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        {/* Header Area */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2
              id="blog-title"
              className="text-[#253D36] mb-5"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Lo que estamos pensando
            </h2>
            <p
              className="text-lg"
              style={{
                color: "rgba(37,61,54,0.75)",
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                lineHeight: 1.6,
              }}
            >
              Análisis, hallazgos y perspectivas firmados por el Centro de Pensamiento. Aquí es donde empieza la conversación sobre el futuro de Medellín.
            </p>
          </div>
          
          <div className="shrink-0 pb-1">
            <a
              href="/blog"
              className="group inline-flex items-center gap-2.5 font-bold text-sm text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F4F0] px-6 py-4"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              }}
            >
              Ver todo el blog
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10" role="tablist" aria-label="Filtros de contenido">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className="whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F4F0]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    backgroundColor: isActive ? "#253D36" : "transparent",
                    color: isActive ? "#FFFFFF" : "#253D36",
                    border: isActive ? "1px solid #253D36" : "1px solid rgba(37,61,54,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget.style.backgroundColor = "rgba(37,61,54,0.04)");
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget.style.backgroundColor = "transparent");
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid */}
        <div 
          id={`panel-${activeTab}`}
          role="tabpanel"
          ref={gridRef} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-white rounded-md overflow-hidden transition-shadow duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#C0D400] focus-within:ring-offset-2 focus-within:ring-offset-[#F2F4F0]"
              style={{
                border: "1px solid rgba(37,61,54,0.08)",
              }}
            >
              {/* Card Image Area (Abstract representation) */}
              <div 
                className="w-full h-48 bg-[#253D36] relative overflow-hidden"
                aria-hidden="true"
              >
                {/* Subtle pattern / gradients */}
                <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(45deg, #00B8A3 0%, transparent 100%)" }} />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #C0D400 0%, transparent 70%)" }} />
                
                {/* Category tag overlaid */}
                <div className="absolute top-4 left-4">
                  <span 
                    className="inline-flex items-center px-3 py-1 rounded-[2px] text-[11px] font-bold tracking-[0.08em] uppercase text-[#111111] bg-[#C0D400]"
                    style={{
                      fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                    }}
                  >
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="flex flex-col flex-1 p-6 md:p-8">
                <h3
                  className="text-xl text-[#253D36] font-bold leading-tight mb-4 transition-colors duration-200 group-hover:text-[#0068FF]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <a href={`/blog/${post.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </a>
                </h3>
                
                <p
                  className="text-sm flex-1 mb-8"
                  style={{
                    color: "rgba(37,61,54,0.65)",
                    fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {post.excerpt}
                </p>

                <div className="flex flex-col gap-4 mt-auto">
                  {/* Microcopy metadata */}
                  <p
                    className="text-xs"
                    style={{
                      color: "rgba(37,61,54,0.5)",
                      fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                    }}
                  >
                    6 min de lectura · Publicado el [fecha]
                  </p>
                  
                  {/* Fake CTA line */}
                  <div 
                    className="flex items-center gap-1.5 text-sm font-bold text-[#0068FF]"
                    style={{
                      fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    }}
                  >
                    Leer el artículo
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION PANEL SECTION — Section 4
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORDS = [
  { label: "Inteligencia artificial", count: 72 },
  { label: "Deeptech", count: 28 },
  { label: "Economía circular", count: 45 },
  { label: "Ciudades inteligentes", count: 54 },
  { label: "Talento digital", count: 68 },
  { label: "Emprendimiento", count: 89 },
  { label: "Startups", count: 76 },
  { label: "Inversión en I+D", count: 32 },
  { label: "Compra pública innovadora", count: 21 },
  { label: "Distrito CTI", count: 82 },
  { label: "Transferencia de tecnología", count: 41 },
  { label: "Capital inteligente", count: 36 },
  { label: "Vigilancia tecnológica", count: 24 },
  { label: "Prospectiva", count: 39 },
  { label: "Gobernanza pública", count: 48 },
  { label: "Sostenibilidad", count: 61 }
];

const MAX_COUNT = Math.max(...KEYWORDS.map(k => k.count));
const MIN_COUNT = Math.min(...KEYWORDS.map(k => k.count));

// Helper to generate fake grouped content
function generateResults(keyword: string) {
  return [
    {
      group: "Radar CTI",
      items: [
        { type: "Dato", title: `Indicadores de adopción de ${keyword} en empresas locales` },
        { type: "Dashboard", title: `Mapeo de actores clave en ${keyword}` }
      ]
    },
    {
      group: "Análisis CTI",
      items: [
        { type: "Informe", title: `Prospectiva al 2030: El impacto de ${keyword} en Medellín` }
      ]
    },
    {
      group: "Lab de Políticas",
      items: [
        { type: "Norma", title: `Lineamientos éticos y regulatorios para ${keyword}` }
      ]
    },
    {
      group: "Blog",
      items: [
        { type: "Artículo", title: `5 casos de éxito implementando ${keyword} en la ciudad` },
        { type: "Artículo", title: `¿Cómo empezar a entender ${keyword}?` }
      ]
    }
  ];
}

function NavigationPanelSection() {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [results, setResults] = useState<ReturnType<typeof generateResults> | null>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const cloudRef    = useRef<HTMLDivElement>(null);
  const resultsRef  = useRef<HTMLDivElement>(null);
  const svgRef         = useRef<SVGSVGElement>(null);
  const keywordRefs    = useRef<(HTMLButtonElement | null)[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);
  const connectionsRef = useRef<[number, number][]>([]);
  const rafRef         = useRef<number>(0);

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // ── Build nearest-neighbor graph after first render ────────────────────────
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud || reduced.current) return;

    // Wait one frame so layout is complete
    const id = requestAnimationFrame(() => {
      const containerRect = cloud.getBoundingClientRect();
      const centers = keywordRefs.current.map(el => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
      });

      const added = new Set<string>();
      const conns: [number, number][] = [];
      const n = centers.length;

      // Each node → 2 nearest neighbors
      centers.forEach((c, i) => {
        const sorted = centers
          .map((c2, j) => ({ j, d: Math.hypot(c2.x - c.x, c2.y - c.y) }))
          .filter(({ j }) => j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);

        sorted.forEach(({ j }) => {
          const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
          if (!added.has(key)) { added.add(key); conns.push([i, j]); }
        });
      });

      connectionsRef.current = conns;
      setConnections(conns);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // ── RAF loop: update SVG lines + node dots to follow floating elements ──────
  useEffect(() => {
    if (reduced.current) return;
    const draw = () => {
      const svg   = svgRef.current;
      const cloud = cloudRef.current;
      if (svg && cloud) {
        const cRect  = cloud.getBoundingClientRect();
        const lines  = svg.querySelectorAll<SVGLineElement>('line');
        const dots   = svg.querySelectorAll<SVGCircleElement>('circle');

        // Collect node centers for dot positions
        const centers: { x: number; y: number }[] = keywordRefs.current.map(el => {
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top };
        });

        // Update lines
        connectionsRef.current.forEach(([a, b], idx) => {
          const line = lines[idx];
          if (!line) return;
          line.setAttribute('x1', String(centers[a].x));
          line.setAttribute('y1', String(centers[a].y));
          line.setAttribute('x2', String(centers[b].x));
          line.setAttribute('y2', String(centers[b].y));
        });

        // Update node dots
        centers.forEach((c, i) => {
          const dot = dots[i];
          if (!dot) return;
          dot.setAttribute('cx', String(c.x));
          dot.setAttribute('cy', String(c.y));
        });
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Cloud Floating Animation ───────────────────────────────────────────────
  useEffect(() => {
    if (reduced.current || !cloudRef.current || selectedKeyword) return;

    const ctx = gsap.context(() => {
      keywordRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          y: "random(-24, 24)",
          x: "random(-18, 18)",
          rotation: "random(-3, 3)",
          duration: "random(2.5, 5)",
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: "random(0, -5)"
        });
      });
    }, cloudRef);

    return () => ctx.revert();
  }, [selectedKeyword]);

  // Handle Selection
  const handleKeywordClick = (keyword: string) => {
    const isDeselecting = selectedKeyword === keyword;
    
    if (isDeselecting) {
      // Close
      gsap.to(resultsRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setSelectedKeyword(null);
          setResults(null);
        }
      });
      // Revert cloud styles
      gsap.to(keywordRefs.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    } else {
      // Select new
      setSelectedKeyword(keyword);
      setResults(generateResults(keyword));
      
      // Highlight selected, dim others
      keywordRefs.current.forEach((el) => {
        if (!el) return;
        const isSelected = el.dataset.keyword === keyword;
        gsap.killTweensOf(el); // Stop floating
        gsap.to(el, {
          opacity: isSelected ? 1 : 0.25,
          scale: isSelected ? 1.05 : 0.95,
          y: 0,
          x: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      // Expand results
      setTimeout(() => {
        if (!resultsRef.current) return;
        gsap.fromTo(resultsRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      }, 50);
    }
  };

  return (
    <section
      id="fn-start"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white"
      aria-labelledby="nav-panel-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12 text-center">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2
            id="nav-panel-title"
            className="text-[#253D36] mb-6"
            style={{
              fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
              fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            ¿Por dónde quieres empezar?
          </h2>
          <p
            className="text-lg md:text-xl"
            style={{
              color: "rgba(37,61,54,0.75)",
              fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              lineHeight: 1.5,
            }}
          >
            Cada palabra es una puerta. Elige la que despierte tu curiosidad y te llevo directo a todo lo que hemos construido sobre ese tema: datos, informes, normas y artículos.
          </p>
        </div>

        {/* ── DESKTOP CLOUD VIEW ── */}
        <div
          ref={cloudRef}
          className="hidden lg:block relative max-w-6xl mx-auto py-8"
        >
          {/* SVG thread overlay — redrawn each frame by RAF */}
          <svg
            ref={svgRef}
            aria-hidden="true"
            className="pointer-events-none overflow-visible"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          >
            {/* Connection lines */}
            {connections.map((_, idx) => (
              <line
                key={`line-${idx}`}
                x1="0" y1="0" x2="0" y2="0"
                stroke="#00B8A3"
                strokeWidth="1.5"
                strokeOpacity="0.45"
                strokeLinecap="round"
              />
            ))}
            {/* Node dots — one per keyword */}
            {KEYWORDS.map((_, idx) => (
              <circle
                key={`dot-${idx}`}
                cx="0" cy="0" r="3"
                fill="#00B8A3"
                fillOpacity="0.5"
              />
            ))}
          </svg>

          {/* Keywords */}
          <div
            className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12"
            role="list"
            aria-label="Nube de palabras clave"
            style={{ position: "relative", zIndex: 1 }}
          >
            {KEYWORDS.map((kw, i) => {
              const ratio = (kw.count - MIN_COUNT) / (MAX_COUNT - MIN_COUNT);
              const fontSize = 1 + ratio * 2.2;
              const isSelected = selectedKeyword === kw.label;

              return (
                <button
                  key={kw.label}
                  ref={el => { keywordRefs.current[i] = el; }}
                  data-keyword={kw.label}
                  onClick={() => handleKeywordClick(kw.label)}
                  className="relative inline-block transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                  style={{
                    fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                    fontSize: `${fontSize}rem`,
                    fontWeight: isSelected ? 900 : 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: isSelected ? "#0068FF" : "#253D36",
                    willChange: "transform, opacity",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { if (!selectedKeyword) e.currentTarget.style.color = "#0068FF"; }}
                  onMouseLeave={e => { if (!selectedKeyword) e.currentTarget.style.color = "#253D36"; }}
                >
                  {kw.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE GRID VIEW ── */}
        <div className="lg:hidden flex flex-wrap justify-center gap-3">
          {KEYWORDS.map((kw) => {
            const isSelected = selectedKeyword === kw.label;
            return (
              <button
                key={kw.label}
                onClick={() => handleKeywordClick(kw.label)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400]"
                style={{
                  fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                  backgroundColor: isSelected ? "#253D36" : "#F2F4F0",
                  color: isSelected ? "#FFFFFF" : "#253D36",
                  border: isSelected ? "1px solid #253D36" : "1px solid rgba(37,61,54,0.1)",
                }}
              >
                <span>{kw.label}</span>
                <span 
                  className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold"
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : "rgba(37,61,54,0.08)",
                    color: isSelected ? "#FFFFFF" : "rgba(37,61,54,0.6)"
                  }}
                >
                  {kw.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── DYNAMIC RESULTS AREA ── */}
        <div 
          ref={resultsRef} 
          className="overflow-hidden mt-12 text-left"
          style={{ height: 0, opacity: 0 }}
        >
          {results && (
            <div 
              className="p-8 lg:p-12 rounded-lg bg-[#FAFAF8]"
              style={{ border: "1px solid rgba(37,61,54,0.08)" }}
            >
              <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: "1px solid rgba(37,61,54,0.08)" }}>
                <h3 
                  className="text-2xl font-bold text-[#253D36]"
                  style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", letterSpacing: "-0.01em" }}
                >
                  Explorando: <span className="text-[#0068FF]">{selectedKeyword}</span>
                </h3>
                <button
                  onClick={() => handleKeywordClick(selectedKeyword)}
                  className="p-2 rounded-full transition-colors hover:bg-[rgba(37,61,54,0.05)] text-[#253D36]"
                  aria-label="Cerrar resultados"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {results.map((group) => (
                  <div key={group.group} className="flex flex-col">
                    <h4 
                      className="text-[11px] font-bold tracking-[0.12em] uppercase mb-4"
                      style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      {group.group}
                    </h4>
                    <ul className="flex flex-col gap-4">
                      {group.items.map((item, idx) => (
                        <li key={idx}>
                          <a 
                            href="#item" 
                            className="group flex flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm p-1 -m-1"
                          >
                            <span 
                              className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] w-max"
                              style={{ 
                                backgroundColor: "rgba(37,61,54,0.05)",
                                color: "rgba(37,61,54,0.6)",
                                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" 
                              }}
                            >
                              {item.type}
                            </span>
                            <span 
                              className="text-sm font-semibold text-[#253D36] leading-snug transition-colors group-hover:text-[#0068FF]"
                              style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                            >
                              {item.title}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER SECTION — Section 5
// ─────────────────────────────────────────────────────────────────────────────

function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "already-registered">("idle");

  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current || !sectionRef.current || !leftColRef.current || !rightColRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      tl.fromTo(leftColRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      ).fromTo(rightColRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Simulate API call
    setTimeout(() => {
      if (email.includes("registrado")) {
        setFormStatus("already-registered");
      } else {
        setFormStatus("success");
      }
    }, 1200);
  };

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#253D36" }}
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* ── LEFT COLUMN: Copy ── */}
          <div ref={leftColRef} className="flex flex-col text-white">
            <p
              className="text-[10px] tracking-[0.32em] uppercase mb-6"
              style={{
                color: "#C0D400",
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
              }}
            >
              BOLETÍN SEMESTRAL
            </p>
            
            <h2
              id="newsletter-title"
              className="mb-8"
              style={{
                fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Cada seis meses, lo esencial en un solo lugar
            </h2>
            
            <p
              className="text-lg md:text-xl mb-12"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                lineHeight: 1.55,
                maxWidth: 540
              }}
            >
              Reunimos los análisis más potentes del semestre en una sola publicación y la enviamos directo a tu correo. Sin boletines semanales, sin relleno: solo la evidencia que necesitas para tomar mejores decisiones sobre ciencia, tecnología e innovación.
            </p>

            <div className="flex items-center gap-6 mt-auto">
              {/* Optional Thumbnail */}
              <div 
                className="w-16 h-20 rounded-[2px] bg-white flex flex-col p-1.5 shadow-lg shrink-0 overflow-hidden relative"
                aria-hidden="true"
              >
                <div className="w-full h-1/2 bg-[#F2F4F0] mb-1" />
                <div className="w-3/4 h-1 bg-[#E2E8E4] mb-1" />
                <div className="w-1/2 h-1 bg-[#E2E8E4]" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-[#C0D400]" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
              </div>
              
              <a 
                href="#ultima-edicion"
                className="group inline-flex items-center gap-2 font-bold text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm transition-colors hover:text-[#C0D400]"
                style={{
                  fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                }}
              >
                Ver la última edición
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Form Card ── */}
          <div ref={rightColRef} className="w-full max-w-[540px] mx-auto lg:ml-auto">
            <div 
              className="bg-white rounded-md p-8 md:p-10 shadow-2xl relative overflow-hidden"
              style={{ borderTop: "4px solid #C0D400" }}
            >
              
              {formStatus === "success" || formStatus === "already-registered" ? (
                <div className="flex flex-col items-center justify-center text-center py-12" role="alert" aria-live="polite">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: "rgba(192, 212, 0, 0.15)", color: "#253D36" }}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 
                    className="text-2xl font-bold text-[#253D36] mb-4"
                    style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", letterSpacing: "-0.01em" }}
                  >
                    {formStatus === "success" 
                      ? "Listo. Nos vemos en la próxima edición. — Nova"
                      : "Ya estabas en la lista. Nos alegra tenerte de vuelta."}
                  </h3>
                  <button 
                    onClick={() => setFormStatus("idle")}
                    className="text-sm font-semibold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
                    style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                  >
                    Volver al formulario
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Nombre */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="nl-name" 
                      className="text-sm font-bold text-[#253D36]"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Nombre <span className="text-[#FF4C17]" aria-hidden="true">*</span>
                    </label>
                    <input 
                      id="nl-name"
                      name="name"
                      type="text" 
                      required
                      placeholder="¿Cómo te llamas?"
                      className="w-full px-4 py-3 bg-[#F2F4F0] border border-transparent rounded-[4px] text-[#111111] placeholder:text-[#111111]/40 focus:bg-white focus:border-[#C0D400] focus:outline-none focus:ring-1 focus:ring-[#C0D400] transition-colors"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    />
                  </div>

                  {/* Correo electrónico */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="nl-email" 
                      className="text-sm font-bold text-[#253D36]"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Correo electrónico <span className="text-[#FF4C17]" aria-hidden="true">*</span>
                    </label>
                    <input 
                      id="nl-email"
                      name="email"
                      type="email" 
                      required
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-3 bg-[#F2F4F0] border border-transparent rounded-[4px] text-[#111111] placeholder:text-[#111111]/40 focus:bg-white focus:border-[#C0D400] focus:outline-none focus:ring-1 focus:ring-[#C0D400] transition-colors"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    />
                  </div>

                  {/* Organización */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="nl-org" 
                      className="text-sm font-bold text-[#253D36]"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Organización (opcional)
                    </label>
                    <input 
                      id="nl-org"
                      name="org"
                      type="text" 
                      placeholder="¿Dónde trabajas o estudias?"
                      className="w-full px-4 py-3 bg-[#F2F4F0] border border-transparent rounded-[4px] text-[#111111] placeholder:text-[#111111]/40 focus:bg-white focus:border-[#C0D400] focus:outline-none focus:ring-1 focus:ring-[#C0D400] transition-colors"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    />
                  </div>

                  {/* Rol en el ecosistema */}
                  <div className="flex flex-col gap-1.5">
                    <label 
                      htmlFor="nl-role" 
                      className="text-sm font-bold text-[#253D36]"
                      style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Rol en el ecosistema <span className="text-[#FF4C17]" aria-hidden="true">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        id="nl-role"
                        name="role"
                        required
                        className="w-full px-4 py-3 bg-[#F2F4F0] border border-transparent rounded-[4px] text-[#111111] appearance-none focus:bg-white focus:border-[#C0D400] focus:outline-none focus:ring-1 focus:ring-[#C0D400] transition-colors cursor-pointer"
                        style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                        defaultValue=""
                      >
                        <option value="" disabled className="text-[#111111]/40">Selecciona tu rol principal</option>
                        <option value="Sector público">Sector público</option>
                        <option value="Academia e investigación">Academia e investigación</option>
                        <option value="Empresa">Empresa</option>
                        <option value="Emprendimiento y startups">Emprendimiento y startups</option>
                        <option value="Inversión">Inversión</option>
                        <option value="Medios de comunicación">Medios de comunicación</option>
                        <option value="Ciudadanía interesada">Ciudadanía interesada</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Casilla de privacidad */}
                  <div className="flex items-start gap-3 mt-2">
                    <div className="flex items-center h-5">
                      <input
                        id="nl-privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="w-4 h-4 border-gray-300 rounded-[2px] text-[#253D36] focus:ring-[#C0D400] bg-[#F2F4F0] cursor-pointer"
                      />
                    </div>
                    <label 
                      htmlFor="nl-privacy" 
                      className="text-xs leading-snug cursor-pointer"
                      style={{ color: "rgba(37,61,54,0.7)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Autorizo el tratamiento de mis datos personales según la política de privacidad de Ruta N.
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="w-full flex items-center justify-center font-bold text-[#253D36] bg-[#C0D400] rounded-[4px] transition-colors duration-200 hover:bg-[#AABC00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        minHeight: 52,
                        fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif",
                      }}
                    >
                      {formStatus === "submitting" ? "Procesando..." : "Quiero recibirlo"}
                    </button>
                    <p 
                      className="text-center text-xs"
                      style={{ color: "rgba(37,61,54,0.5)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
                    >
                      Se publica en [mes] y [mes]. Puedes darte de baja cuando quieras, con un clic.
                    </p>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SITE FOOTER
// ─────────────────────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="bg-white pt-16 pb-8" style={{ borderTop: "1px solid rgba(37,61,54,0.1)" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Identidad */}
          <div className="flex flex-col">
            <h3
              className="text-lg font-bold text-[#253D36] mb-4"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", letterSpacing: "-0.01em", lineHeight: 1.25 }}
            >
              Centro de Pensamiento<br />Ruta N Medellín
            </h3>
            <p
              className="text-sm"
              style={{ color: "rgba(37,61,54,0.7)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Contacto:{" "}
              <a
                href="mailto:centrodepensamiento@rutanmedellin.org"
                className="font-semibold text-[#0068FF] underline hover:text-[#253D36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
              >
                centrodepensamiento@rutanmedellin.org
              </a>
            </p>
          </div>

          {/* Mapa del sitio */}
          <div className="flex flex-col">
            <h4 
              className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5"
              style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
            >
              Mapa del sitio
            </h4>
            <ul className="flex flex-col gap-3">
              {["Radar CTI", "Señales", "Reglas del Juego", "Blog", "Boletín"].map((item) => {
                let href = `/${item.toLowerCase().replace(/ /g, "-")}`;
                if (item === "Boletín") href = "#newsletter";
                return (
                  <li key={item}>
                    <a 
                      href={href}
                      className="text-sm font-semibold text-[#253D36] transition-colors hover:text-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
                      style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Transparencia */}
          <div className="flex flex-col">
            <h4 
              className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5"
              style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
            >
              Transparencia
            </h4>
            <ul className="flex flex-col gap-3">
              {["Nuestras fuentes", "Metodologías", "Política de datos abiertos", "Cómo citarnos"].map((item) => (
                <li key={item}>
                  <a 
                    href="#transparencia"
                    className="text-sm font-semibold text-[#253D36] transition-colors hover:text-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm"
                    style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col">
            <h4 
              className="text-[11px] font-bold tracking-[0.12em] uppercase mb-5"
              style={{ color: "#00B8A3", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
            >
              Contacto
            </h4>
            <p 
              className="text-sm mb-4"
              style={{ color: "rgba(37,61,54,0.7)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", lineHeight: 1.6 }}
            >
              Escríbele al equipo del Centro de Pensamiento: <a href="mailto:[correo]" className="font-bold text-[#0068FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">[correo]</a>.
            </p>
            <p 
              className="text-sm"
              style={{ color: "rgba(37,61,54,0.7)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", lineHeight: 1.6 }}
            >
              ¿Tienes un dato que deberíamos conocer? Cuéntanos.
            </p>
          </div>

        </div>

        {/* Línea final */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
          style={{ borderTop: "1px solid rgba(37,61,54,0.1)" }}
        >
          <p 
            className="text-xs"
            style={{ color: "rgba(37,61,54,0.55)", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}
          >
            Ruta N Medellín · Centro de Pensamiento · Medellín, Distrito de Ciencia, Tecnología e Innovación · [año]
          </p>
        </div>
      </div>
    </footer>
  );
}


function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: rgba(37,61,54,0.2) transparent; }
        *::-webkit-scrollbar { width: 5px; height: 5px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(37,61,54,0.18); border-radius: 4px; }
        ::selection { background: #C0D400; color: #111111; }
        [data-focus-visible] { outline: 2px solid #C0D400; outline-offset: 2px; }

        /* ── Mobile interaction polish ─────────────────────────────────── */
        /* Prevent iOS auto-inflating text on rotation / avoid layout jumps */
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        /* Remove the default grey/blue tap flash; we provide our own feedback */
        a, button, [role="button"], input, select, textarea, label {
          -webkit-tap-highlight-color: transparent;
        }
        /* Kill the 300ms tap delay on interactive elements */
        a, button, [role="button"] { touch-action: manipulation; }
        /* Branded, instant touch feedback on tap (works where :hover doesn't) */
        @media (hover: none) and (pointer: coarse) {
          .rn-tap:active { background: rgba(37,61,54,0.10) !important; }
          .rn-tap-cta:active { background: #AABC00 !important; transform: scale(0.985); }
        }
        /* Native-feeling scroll inside the mobile drawer, no scroll chaining */
        .rn-drawer-scroll {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        /* Respect notches / home indicators when viewport-fit=cover is active */
        .rn-safe-top { padding-top: env(safe-area-inset-top, 0px); }
        .rn-safe-bottom { padding-bottom: max(env(safe-area-inset-bottom, 0px), 0px); }
      `}</style>

      <SiteHeader activePage={location.pathname} onNavigate={(path) => {
        if(path.startsWith('#')) {
          const el = document.querySelector(path);
          if(el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate(path);
          window.scrollTo(0, 0);
        }
      }} />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

const HOME_SECTIONS = [
  { id: "fn-hero",       label: "Inicio" },
  { id: "fn-narrative",  label: "Nuestro enfoque" },
  { id: "fn-blog",       label: "Publicaciones" },
  { id: "fn-start",      label: "¿Por dónde empezar?" },
  { id: "newsletter",    label: "Boletín" },
];

function HomePage() {
  return (
    <>
      <FloatingNav sections={HOME_SECTIONS} />
      <HeroSection />
      <NarrativeSection />
      <BlogSection />
      <NavigationPanelSection />
      <NewsletterSection />
    </>
  );
}

function BlankPage({ title, desc }: { title: string, desc: string }) {
  return (
    <section className="py-32 px-6 text-center min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F4F0]">
      <p
        className="text-[10px] tracking-[0.28em] uppercase mb-4 text-[#C0D400]"
        style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}
      >
        Plantilla en blanco
      </p>
      <h1 className="text-4xl md:text-5xl font-black text-[#253D36] mb-4" style={{ fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif", letterSpacing: "-0.02em" }}>{title}</h1>
      <p className="text-lg text-[#253D36]/60 max-w-2xl" style={{ fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif" }}>{desc}</p>
    </section>
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
              RADAR CTI · MEDICIÓN
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
      className="py-24 lg:py-32 bg-[#FAFAF8]" 
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
            La primera es el <a href="#seccion-4" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Pulso CTI de Medellín</a>, nuestra medición propia, construida con datos primarios levantados entre quienes hacen innovación en la ciudad.
          </p>
          <p>
            La segunda son los <a href="#seccion-4" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Rankings globales, regionales y locales</a> que ubican a Medellín en el mapa de la competitividad y que aquí no solo se listan: se explican, se comparan con ciudades pares y se leen críticamente.
          </p>
          <p>
            La tercera es <a href="#seccion-4" className="font-bold text-[#253D36] underline decoration-[#C0D400] decoration-2 underline-offset-4 transition-colors hover:text-[#0068FF] hover:decoration-[#0068FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] rounded-sm">Data</a>, un conjunto de tableros dinámicos con las series históricas y los indicadores del ecosistema, filtrables por año y por variable, junto con el repositorio de reportes oficiales disponibles para descarga.
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
      className="py-24 lg:py-32 bg-white" 
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
      id="seccion-4"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#FAFAF8]"
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
      className="w-full flex flex-col lg:flex-row"
      aria-labelledby="pulse-band-title"
    >
      {/* ── TEXT COLUMN ── */}
      <div 
        ref={textColRef}
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-20 lg:px-16 xl:px-24"
        style={{ backgroundColor: "#C0D400" }} // Ruta N Lime Accent
      >
        <p
          className="text-[10px] tracking-[0.32em] uppercase mb-6"
          style={{ color: "#253D36", fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif", fontWeight: "bold" }}
        >
          PULSO CTI · MEDICIÓN PROPIA
        </p>

        <h2
          id="pulse-band-title"
          className="text-[#253D36] mb-8"
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
            color: "rgba(37,61,54,0.85)",
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
          <p className="font-bold text-[#253D36]">
            Cada respuesta se convierte en evidencia. Cada dato, en una decisión mejor tomada.
          </p>
        </div>

        {/* Microdatos */}
        <div 
          className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10 py-5"
          style={{ borderTop: "1px solid rgba(37,61,54,0.15)", borderBottom: "1px solid rgba(37,61,54,0.15)" }}
        >
          <span className="text-sm font-bold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] organizaciones participantes
          </span>
          <span className="text-[#253D36]/40 hidden md:block" aria-hidden="true">•</span>
          <span className="text-sm font-bold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] preguntas
          </span>
          <span className="text-[#253D36]/40 hidden md:block" aria-hidden="true">•</span>
          <span className="text-sm font-bold text-[#253D36]" style={{ fontFamily: "'Source Sans 3',Arial,sans-serif" }}>
            [N] años de serie
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          <a
            href="/radar-cti/pulso/resultados"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-white bg-[#253D36] rounded-[4px] transition-colors duration-200 hover:bg-[#1C2E29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 px-6"
            style={{ minHeight: 52, fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
          >
            Ver los resultados del último Pulso
          </a>
          <a
            href="/radar-cti/pulso/metodologia"
            className="w-full sm:w-auto inline-flex justify-center items-center font-bold text-sm text-[#253D36] bg-transparent rounded-[4px] transition-colors duration-200 hover:bg-[rgba(37,61,54,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#253D36] focus-visible:ring-offset-2 px-6"
            style={{ minHeight: 52, border: "2px solid #253D36", fontFamily: "'Neue Haas Grotesk Display Pro','Helvetica Neue',Arial,sans-serif" }}
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
          fetchPriority="high"
        />
        {/* Subtle overlay to ensure the brand tone is maintained */}
        <div className="absolute inset-0 bg-[#253D36]/20 mix-blend-multiply" />
      </div>
    </section>
  );
}


function RadarCTIPage() {
  return (
    <>
      <RadarCTIHero />
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
    <section className="py-32 px-6 text-center min-h-[70vh] flex flex-col items-center justify-center bg-[#F2F4F0]">
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
    <section className="bg-[#253D36] text-white pt-32 pb-20 px-6 lg:px-10 xl:px-12 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10">
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
    <section className="py-16 bg-[#F2F4F0]">
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
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
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
    <section className="py-20 bg-[#F2F4F0]">
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
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 xl:px-12">
        <div className="max-w-3xl mb-12">
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
          
          <div className="w-full h-[280px] relative mt-12 mb-8">
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

function RankingsPage() {
  return (
    <>
      <RankingsBanner />
      <RankingsKPIs />
      <RankingsPanels />
      <RankingsStrengthsGaps />
      <RankingsEvolution />
    </>
  );
}


// DataPage is handled by src/app/pages/DataPage.tsx


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "radar-cti/pulso", element: <RedirectPulso /> },
      { path: "radar-cti/rankings", element: <RankingsPage /> },
      { path: "radar-cti/data", element: <DataPage /> },
      { path: "radar-cti/*", element: <RadarCTIPage /> },
      { path: "analisis-cti/*", element: <AnalisisCTIPage /> },
      { path: "lab-de-politicas/documentacion", element: <DocumentacionPage /> },
      { path: "lab-de-politicas/compras", element: <ComprasPage /> },
      { path: "lab-de-politicas/*", element: <LabPoliticasPage /> },
      { path: "blog/*", element: <BlogPage /> },
      { path: "nova", element: <BlankPage title="Conoce a Nova" desc="Asistente de inteligencia artificial." /> },
      { path: "*", element: <BlankPage title="Esta sección se construirá en el siguiente paso." desc="Utiliza la navegación para volver." /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
