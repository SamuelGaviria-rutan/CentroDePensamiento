import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface FloatingNavSection {
  id: string;
  label: string;
}

interface FloatingNavProps {
  sections: FloatingNavSection[];
}

export function FloatingNav({ sections }: FloatingNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [hovered, setHovered] = useState(false);
  const activeIdRef = useRef<string>(sections[0]?.id ?? "");

  // Absolute document offset of an element, resilient to CSS transforms
  // (getBoundingClientRect is affected by GSAP's x-translate on pinned content,
  // so we walk offsetTop instead).
  const docOffsetTop = (el: HTMLElement) => {
    let top = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return top;
  };

  useEffect(() => {
    const tick = () => {
      // Marker line: a point ~40% down the viewport, in document coordinates.
      const marker = window.scrollY + window.innerHeight * 0.4;
      let candidate = sections[0]?.id ?? "";

      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (docOffsetTop(el) <= marker) {
          candidate = id;
        }
      }

      if (candidate !== activeIdRef.current) {
        activeIdRef.current = candidate;
        setActiveId(candidate);
      }
    };

    gsap.ticker.add(tick);
    tick();

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: Math.max(0, docOffsetTop(el) - 88), behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Navegación de secciones"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hidden lg:flex"
      style={{
        position: "fixed",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(37,61,54,0.10)",
        borderRadius: 14,
        padding: hovered ? "12px 16px 12px 20px" : "12px 14px",
        boxShadow: "0 4px 24px rgba(37,61,54,0.10), 0 1px 4px rgba(37,61,54,0.06)",
        transition: "padding 0.22s ease",
      }}
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={label}
            title={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "5px 0",
              outline: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Source Sans 3','Source Sans Pro',Arial,sans-serif",
                fontSize: "0.78rem",
                fontWeight: isActive ? 700 : 400,
                letterSpacing: "0.03em",
                color: isActive ? "#253D36" : "rgba(37,61,54,0.45)",
                whiteSpace: "nowrap",
                opacity: hovered ? 1 : 0,
                maxWidth: hovered ? 160 : 0,
                overflow: "hidden",
                transform: hovered ? "translateX(0)" : "translateX(6px)",
                transition: "opacity 0.22s ease, transform 0.22s ease, color 0.18s ease, max-width 0.22s ease",
                pointerEvents: hovered ? "auto" : "none",
              }}
            >
              {label}
            </span>

            <span
              style={{
                display: "block",
                width: isActive ? 22 : 7,
                height: 7,
                borderRadius: 9999,
                backgroundColor: isActive ? "#C0D400" : "rgba(37,61,54,0.20)",
                transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease, box-shadow 0.2s ease",
                flexShrink: 0,
                boxShadow: isActive ? "0 0 0 3px rgba(192,212,0,0.22)" : "none",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
