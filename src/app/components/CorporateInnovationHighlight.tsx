import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import corporateInnovationImage from "../../assets/rankings-corporate-innovation.jpg"
import corporateMark from "../../assets/rankings-corporate-mark.png"

gsap.registerPlugin(ScrollTrigger)

const DISPLAY_FONT =
  "'Neue Haas Grotesk Display Pro','Neue Haas Grotesk','Helvetica Neue',Arial,sans-serif"

export function CorporateInnovationHighlight() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo("[data-corporate-reveal]", { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        })
      })
    }, section)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="corporate-innovation-title"
      className="relative isolate overflow-hidden bg-[#202020] text-white"
      style={{ fontFamily: DISPLAY_FONT }}
    >
      <img
        src={corporateInnovationImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[52%_center]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.02)_0%,rgba(17,17,17,0.02)_38%,rgba(20,20,20,0.72)_67%,#202020_94%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0)_58%,rgba(0,0,0,0.08))]" />

      <div className="relative mx-auto flex min-h-[660px] max-w-[1440px] flex-col px-6 pb-6 pt-7 sm:px-8 sm:pt-8 lg:min-h-[690px] lg:px-10 xl:px-12">
        <div
          data-corporate-reveal
          className="flex items-start justify-between gap-6"
        >
          <p
            className="pt-1 text-[10px] font-bold uppercase tracking-[0.36em] text-white sm:text-xs"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Radiografía del distrito
          </p>
          <img
            src={corporateMark}
            alt=""
            aria-hidden="true"
            className="h-auto w-14 shrink-0 sm:w-16 lg:w-[72px]"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:mt-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
          <h2
            id="corporate-innovation-title"
            data-corporate-reveal
            className="text-[clamp(1.75rem,2.8vw,2.7rem)] font-black leading-[1.02] tracking-[-0.025em]"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Primera en innovación corporativa
          </h2>
          <p
            data-corporate-reveal
            className="max-w-2xl text-base font-medium leading-[1.3] text-[#202020] sm:text-lg lg:text-xl"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Dos mediciones nuevas ubican a Medellín como la{" "}
            <strong className="font-black">
              ciudad líder del país en la conexión entre grandes empresas,
              startups y negocios.
            </strong>
          </p>
        </div>

        <p
          data-corporate-reveal
          className="mt-5 whitespace-nowrap text-[clamp(2.7rem,10.5vw,9.25rem)] font-black leading-[0.88] tracking-[0.015em] lg:mt-6"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          #1 Colombia
        </p>

        <div className="mt-auto grid gap-7 pt-10 md:grid-cols-2 md:gap-8 lg:gap-10">
          <article data-corporate-reveal>
            <h3
              className="text-[10px] font-black uppercase leading-snug tracking-[0.16em] sm:text-xs"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Innovación corporativa · StartupBlink
            </h3>
            <div className="mt-2 h-1 w-full bg-[#C0D400]" />
            <p
              className="mt-2.5 text-[clamp(2.25rem,3.2vw,3.4rem)] font-black leading-none"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              #98{" "}
              <span className="text-[0.45em] tracking-[0.08em] text-white/45">
                en el mundo
              </span>
            </p>
            <p
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 lg:text-base"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Corporate Startup Activity Index (CSAI). El índice reconoce la
              interacción entre las grandes empresas y el ecosistema de
              startups. Ruta N ha sido un actor clave para esta articulación.
            </p>
          </article>

          <article data-corporate-reveal>
            <h3
              className="text-[10px] font-black uppercase leading-snug tracking-[0.16em] sm:text-xs"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Ecosistema de negocios · Índice de Competitividad
            </h3>
            <div className="mt-2 h-1 w-full bg-[#0068FF]" />
            <p
              className="mt-3 max-w-xl text-lg font-black leading-snug lg:text-[1.3rem]"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Medellín es la primera ciudad del país en ecosistema de negocios,
              por encima de Bogotá.
            </p>
            <p
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 lg:text-base"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Índice de Competitividad de Ciudades 2026, del Consejo Privado de
              Competitividad de Colombia, lanzado el 12 de noviembre de 2026.
              Respalda la lectura de StartupBlink.
            </p>
          </article>
        </div>

        <div
          data-corporate-reveal
          className="mt-6 border-b border-white/20 pb-2 text-[9px] leading-relaxed text-white/45 sm:text-[10px]"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Resultados preliminares del CSAI: el lanzamiento oficial es el 17 de
          noviembre de 2026 y, por solicitud de StartupBlink, se mantienen
          reservados hasta esa fecha. Fuentes: StartupBlink, Corporate Startup
          Activity Index (preliminar, 2026); Consejo Privado de Competitividad,
          Índice de Competitividad de Ciudades 2026.
        </div>
        <p
          data-corporate-reveal
          className="mt-2 text-[9px] uppercase tracking-[0.34em] text-white/45"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Ranking Oficial de Innovación de Medellín
        </p>
      </div>
    </section>
  )
}
