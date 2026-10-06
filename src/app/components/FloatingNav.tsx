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
    null
  );
}
