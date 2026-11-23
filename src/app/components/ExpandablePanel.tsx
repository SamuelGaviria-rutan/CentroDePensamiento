import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ExpandablePanel({
  id,
  title,
  children,
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}: {
  id: string
  title: string
  children: ReactNode
  className?: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}) {
  const [localIsOpen, setLocalIsOpen] = useState(false)
  const isOpen = controlledIsOpen ?? localIsOpen
  const contentRef = useRef<HTMLDivElement>(null)
  const hasMounted = useRef(false)
  const contentId = `${id}-content`

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (!hasMounted.current) {
      gsap.set(content, { height: 0, opacity: 0, visibility: "hidden" })
      hasMounted.current = true
      return
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const duration = reduceMotion ? 0.01 : 0.42

    if (isOpen) {
      gsap.set(content, { visibility: "visible" })
      gsap.fromTo(content, { height: 0, opacity: 0 }, {
        height: "auto",
        opacity: 1,
        duration,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
      })
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(content, { visibility: "hidden" })
          ScrollTrigger.refresh()
        },
      })
    }

    return () => {
      gsap.killTweensOf(content)
    }
  }, [isOpen])

  const togglePanel = () => {
    const nextIsOpen = !isOpen
    if (controlledIsOpen === undefined) {
      setLocalIsOpen(nextIsOpen)
    }
    onOpenChange?.(nextIsOpen)
  }

  return (
    <div id={id} className={`scroll-mt-24 ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={togglePanel}
        className="group flex min-h-14 w-full items-center justify-between gap-5 border border-[#253D36]/15 bg-white px-5 py-4 text-left text-[#253D36] transition-colors hover:border-[#253D36]/35 hover:bg-[#F8F9F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0D400] focus-visible:ring-offset-2 sm:min-h-16 sm:px-6"
      >
        <span className="text-lg font-black tracking-tight sm:text-xl">
          {title}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#C0D400] text-[#253D36]">
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        id={contentId}
        aria-hidden={!isOpen}
        className="overflow-hidden"
      >
        {children}
      </div>
    </div>
  )
}
