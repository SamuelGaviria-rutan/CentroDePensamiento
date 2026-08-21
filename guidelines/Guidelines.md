# Centro de Pensamiento Ruta N — Project Guidelines

## 1. Project objective

Help create the new website for the **Centro de Pensamiento de Ruta N**, following the attached website PDF completely, using the complementary information provided in the PowerPoint presentation and applying the relevant skills included in the attached `.zip` folder.

The project must become a distinctive, accessible, responsive and production-aware digital experience that presents the Centro de Pensamiento as the strategic knowledge hub of Ruta N.

The website must make evidence, data, analysis, reports, rankings, public policy resources and institutional knowledge easier to explore, understand and use.

The final experience must not feel like a generic institutional landing page or a standard SaaS template.

It should combine:

- **The Sage:** knowledge, clarity, evidence, rigor, transparency, credibility and depth.
- **The Magician:** transformation, innovation, intelligent interaction, exploration and meaningful visual surprise.

The result should feel:

- Editorial.
- Data-driven.
- Strategic.
- Credible.
- Contemporary.
- Human.
- Innovative.
- Clear.
- Exploratory.
- Useful for decision-making.

---

## 2. Immediate delivery goal

The immediate objective is to create a strong and presentable **MVP for the first delivery on Friday**.

The MVP may be developed in HTML, React or another format that can be presented easily, as long as it:

- Looks polished and intentional.
- Includes the required GSAP animations.
- Works correctly on desktop and mobile.
- Represents the real visual and interaction direction of the final product.
- Can later be translated accurately into an editable Figma design.
- Is structured so developers can understand how it should eventually be implemented in HubSpot.

The MVP must not be a static mockup without interaction.

It must demonstrate the expected navigation, responsive behavior, layout logic and motion system.

---

## 3. Source of truth

Use the provided project documents as the primary source of truth.

### Content source

1. **Centro de Pensamiento Ruta N — Textos y estructura del sitio web PDF**
2. Complementary content provided in the attached PowerPoint presentation.
3. Explicit instructions provided by the user during the working process.

### Visual source

1. **Manual de Diseño de Marca Ruta N 2025**
2. Approved Ruta N visual assets already included in the project.
3. Explicit visual decisions approved by the user.

### Technical and workflow source

1. Relevant skills included in the attached `.zip` folder.
2. These project guidelines.
3. Current UI, UX, accessibility and performance best practices.

When there is a conflict, use this priority:

1. The latest explicit user instruction.
2. The Centro de Pensamiento website PDF.
3. The complementary PowerPoint.
4. The Ruta N brand manual.
5. The relevant skills from the `.zip`.
6. These general guidelines.

Do not invent institutional information.

Do not invent:

- Metrics.
- Rankings.
- Dates.
- Legal information.
- Publication counts.
- Sources.
- Download counts.
- Organizations.
- Normative status.
- Dashboard results.
- Contact information.
- Newsletter publication dates.

Keep placeholders such as `[N]`, `[año]`, `[mes]`, `[correo]`, `[fecha]` and `[XXX]` exactly as placeholders until real information is provided.

---

## 4. Mandatory content integrity

### Visible language

All visible website content must remain in **Spanish**.

English may only be used for:

- Code.
- Component names.
- Variable names.
- Internal technical documentation.
- Developer comments.
- Figma Make instructions.

### Copy restrictions

It is mandatory to use the exact titles, labels, paragraphs, buttons, descriptions and microcopy provided in the Centro de Pensamiento PDF or complementary PowerPoint.

Do not:

- Translate visible copy.
- Rewrite copy.
- Simplify copy.
- Summarize copy.
- Correct copy without approval.
- Replace words with synonyms.
- Change titles.
- Invent additional headings.
- Invent CTAs.
- Add marketing slogans.
- Add generic placeholder text.
- Use lorem ipsum.
- Create microcopy that is not included in the source documents.
- change capitalization or punctuation when the source defines it explicitly.

When the interface requires a label, message or state that is not included in the documents, ask the user before inventing it.

The only exceptions are:

- Accessibility labels that are not visible.
- Internal code names.
- Technical metadata required for implementation.
- Temporary developer notes that do not appear in the final interface.

---

## 5. Mandatory working method

Work **step by step, page by page and section by section**.

Do not attempt to build the entire website in a single request.

### Required workflow

1. Read and understand the source section.
2. Identify its content, layout, interaction and responsive requirements.
3. Build only the section requested in the current prompt.
4. Do not generate future sections in advance.
5. Test desktop and mobile behavior.
6. Review content fidelity.
7. Review Ruta N brand compliance.
8. Review animation performance.
9. Correct the section before continuing.
10. Reuse the approved component in later sections.

When the prompt says “build only the header,” do not create:

- The hero.
- The footer.
- Dashboard cards.
- Blog cards.
- Newsletter forms.
- Decorative page sections.
- Additional page content.

Preserve previously approved work.

Do not redesign or remove an approved component unless the user explicitly requests it.

If the task becomes too large or ambiguous, divide it into smaller steps rather than delivering an incomplete or low-quality result.

---

## 6. Questions and uncertainty

When there is a genuine uncertainty that affects content, functionality, information architecture or implementation, ask the user one precise and useful question.

A good question must:

- Explain the specific uncertainty.
- Explain why it affects the design.
- Present the most reasonable options.
- Recommend one option when possible.
- Avoid stopping progress for minor decisions that can be handled safely.

Do not ask vague questions such as:

- “How do you want it?”
- “What style do you prefer?”
- “Can you provide more information?”

Instead, ask questions such as:

> The document mentions a secondary navigation with three sections, but the main menu defines four top-level sections. Should the internal navigation include Radar CTI, Análisis CTI, Lab de Políticas and Blog, or only three of them? I recommend keeping it configurable until the final information architecture is confirmed.

When an uncertainty does not block the current section, continue using a reversible and configurable solution.

---

## 7. Technical foundation

### Preferred implementation

Use:

- React.
- TypeScript.
- Semantic HTML.
- Modular components.
- GSAP.
- GSAP ScrollTrigger for scroll-based sequences.
- Clean CSS, CSS modules or a consistent utility-based system.
- Accessible native elements whenever possible.

### Technical quality

The implementation must:

- Use reusable components.
- Use typed properties and interfaces.
- Keep content in structured configuration objects.
- Separate content, presentation and behavior.
- Avoid duplicated markup.
- Avoid large monolithic components.
- Avoid unnecessary dependencies.
- Use clear component and variable names in English.
- Scope GSAP animations to their corresponding components.
- Clean up GSAP timelines and ScrollTrigger instances when components unmount.
- Avoid fragile DOM selectors.
- Avoid layout shifts.
- Avoid animation logic that depends on arbitrary page heights.
- Prepare content to be managed later from HubSpot.

### Suggested structure

```text
src/
  components/
    layout/
    navigation/
    ui/
    content/
    data-visualization/
    forms/
  sections/
    home/
    radar-cti/
    analysis-cti/
    policy-lab/
    blog/
  pages/
  hooks/
  lib/
    gsap/
    accessibility/
    analytics/
  data/
  styles/
    tokens.css
    globals.css
  types/

  8. GSAP motion system

GSAP animations are mandatory.

Do not deliver sections that are visually complete but lack their intended motion and interaction.

Animations must have a functional or narrative purpose.

Use GSAP for:

Header behavior based on scroll direction.
Dropdown menus.
Mobile navigation.
Hero entrances.
Horizontal narrative scrolling.
Content reveals.
Number and KPI transitions.
Timeline navigation.
Filter and result transitions.
Card reorganization.
Search expansion.
Accordion behavior.
Data visualization entrances.
Meaningful hover feedback.
Motion principles

Animations must be:

Smooth.
Restrained.
Intentional.
Performant.
Consistent.
Easy to understand.
Appropriate for an institutional knowledge platform.

Avoid:

Excessive bouncing.
Large scale effects.
Random rotations.
Constant decorative motion.
Aggressive parallax.
Long animations that delay access to content.
Effects that make text difficult to read.
Animating every element independently.
Motion that competes with the information.
Heavy animation on mobile devices.
Performance rules

Prefer animating:

transform
opacity

Avoid repeatedly animating:

Width.
Height.
Top.
Left.
Large blur values.
Expensive filters.

Use ScrollTrigger carefully.

Do not create multiple competing pinned sections.

All scroll-based interactions must:

Work with natural scrolling.
Avoid trapping the user unnecessarily.
Preserve navigation access.
Avoid scroll jitter.
Avoid cumulative layout shift.
Work correctly after responsive resizing.
Reduced motion

Support prefers-reduced-motion.

When reduced motion is enabled:

Remove non-essential movement.
Replace long transitions with short fades.
Disable pinned narrative effects when necessary.
Preserve all content and functionality.
9. Ruta N brand system

The project must strictly follow the Ruta N Brand Manual.

Do not introduce other colors, typography systems or visual styles.

Official color palette
:root {
  --rn-dark-green: #253D36;
  --rn-lime: #C0D400;
  --rn-teal: #00B8A3;
  --rn-blue: #0068FF;
  --rn-yellow: #FFCA00;
  --rn-orange-red: #FF4C17;

  --rn-white: #FFFFFF;
  --rn-black: #111111;
}

Neutral colors may only be derived carefully from white, black or dark green for:

Page backgrounds.
Borders.
Disabled states.
Subtle dividers.
Secondary surfaces.

Do not introduce unrelated purple, pink, beige, cyan or gradient palettes.

Color hierarchy
Use #253D36 as the primary institutional color.
Use #C0D400 as the principal accent and action color.
Use #00B8A3, #0068FF, #FFCA00 and #FF4C17 selectively.
Do not use all brand colors in every section.
Every color must serve hierarchy, categorization, status or interaction.
Ensure accessible contrast.
Never rely only on color to communicate a state.
Typography

Use:

Neue Haas Grotesk for headings, navigation, labels, KPIs and strong interface text.
Source Sans Pro for paragraphs, descriptions, metadata, forms and supporting text.

Suggested technical fallbacks:

--font-display: "Neue Haas Grotesk", "Helvetica Neue", Arial, sans-serif;
--font-body: "Source Sans Pro", Arial, sans-serif;

Fallbacks may be used temporarily in the coded MVP when the official fonts are technically unavailable.

The final Figma design must use the official typography.

Do not use:

Inter.
Poppins.
Montserrat.
Roboto.
Open Sans.
Decorative display fonts.
Serif fonts not approved by the brand manual.
Logo

Use the official Ruta N logo already provided in the project.

Do not:

Recreate the logo.
Distort it.
Condense it.
Change its proportions.
Change its typography.
Add or remove elements.
Apply unofficial colors.
Place it over a background with insufficient contrast.

Respect:

Clear space.
Minimum digital size.
Approved full-color, black or white versions.
Brand review requirements.
Icons

Use linear icons with a consistent stroke weight.

Icons should support:

Data.
Science.
Technology.
Legal information.
Finance.
Communication.
Connections.
Search.
Filters.
Documents.
Downloads.
External links.

Do not mix unrelated icon families or use decorative filled illustrations.

Photography

Photography must reflect:

Medellín.
Local people.
Science, technology, innovation and entrepreneurship.
Collaboration.
Research.
Learning.
Real projects.
Real events.
Warmth.
Openness.
Human connection.

Avoid:

Generic futuristic stock images.
Anonymous people using holograms.
Cyberpunk cities.
Decorative robots.
Abstract technology images without connection to the ecosystem.
Images used only to fill empty space.
10. Visual direction

The website should feel like a combination of:

A strategic observatory.
An editorial research library.
A public evidence platform.
A civic innovation laboratory.
A modern institutional archive.
Desired characteristics
Strong typographic hierarchy.
Generous spacing.
Clear information structure.
High-quality data presentation.
Controlled use of brand color.
Editorial layouts.
Intelligent motion.
Visible traceability.
Clear sources and dates.
Human and credible photography.
Useful interaction rather than decorative interaction.
Avoid
Generic landing page templates.
Generic SaaS dashboards.
Excessive glassmorphism.
Heavy shadows.
Neon effects.
Random gradients.
Decorative 3D shapes.
Over-rounded cards.
Pill-shaped buttons everywhere.
Floating elements without purpose.
Dense institutional text walls.
Unnecessary carousels.
Decorative animations without functional value.
11. Information architecture

Use the following main navigation structure.

Radar CTI

Descriptor:

Datos, rankings y pulso del ecosistema

Subsections:

Pulso CTI de Medellín — Nuestra medición propia
Rankings — Medellín en el mapa global
Data — Tableros, series y reportes
Análisis CTI

Descriptor:

Análisis a profundidad y prospectiva

No main dropdown.

Navigation through categories occurs within the page.

Lab de Políticas

Descriptor:

Política pública que habilita la innovación

Subsections:

Documentación — Repositorio normativo del Distrito CTI
Compras Públicas Innovadoras — Cómo comprar innovación
Blog

Descriptor:

Lo que estamos pensando

No main dropdown.

Persistent utilities
Global search.
Newsletter subscription.

Exact search placeholder:

Busca un dato, un informe o una norma…

Exact newsletter button:

Suscribirme al boletín

12. Navigation behavior

The main navigation must be persistent.

Desktop behavior
Full header at the top of the page.
Header becomes more compact while scrolling down.
Header may hide after continued downward scrolling.
Header reappears at the first upward scroll gesture.
Returning to the top restores the full state.
Only one dropdown may be open at a time.
Dropdowns close with Escape, outside click or link selection.
Internal pages

Prepare an optional secondary tab navigation for internal pages.

Do not permanently define its items until the final architecture is confirmed.

The document contains an ambiguity because it mentions three sections in the secondary navigation while the main architecture contains four top-level sections.

Keep the component configurable.

Mobile behavior
Compact header.
Search access.
Hamburger control.
Full-screen or near-full-screen navigation drawer.
Accessible accordions for sections with submenus.
Prominent newsletter CTA.
Background scroll lock.
Focus trap.
Correct focus restoration.
13. Responsive design

Every section must be designed and tested for:

Large desktop: 1440px.
Standard desktop: 1280px.
Tablet landscape: 1024px.
Tablet portrait: 768px.
Mobile: 390px.
Small mobile: 360px.

Do not create desktop first and simply reduce its scale for mobile.

Mobile must have its own considered layout.

Responsive requirements
No horizontal overflow.
No overlapping content.
No unreadable text.
No controls below 44px touch size.
No navigation labels wrapping unexpectedly.
No charts cropped without an alternative interaction.
No horizontal scroll unless it is an intentional component.
No pinned GSAP section that prevents mobile navigation.
No hover-only functionality.
No content hidden only because it is difficult to adapt.

For complex desktop interactions, create an equivalent mobile interaction.

Example:

Desktop keyword cloud → mobile grid of topic cards.
Desktop horizontal timeline → mobile vertical timeline.
Desktop comparison table → scrollable or stacked mobile presentation.
Desktop pinned narrative → simplified vertical narrative when necessary.
14. Accessibility

Target WCAG 2.2 AA.

Use:

Semantic landmarks.
Correct heading order.
Keyboard-accessible interactions.
Visible focus states.
aria-expanded.
aria-controls.
aria-current.
Accessible field labels.
Error messages associated with their fields.
Sufficient contrast.
Alternative text for meaningful images.
Screen-reader text for icon-only controls.
Focus management for drawers, modals and search panels.

Do not communicate information only through:

Color.
Animation.
Position.
Iconography.

All functionality must work without a mouse.

15. HubSpot-ready design

The final implementation will be developed in HubSpot.

The prototype and Figma design must therefore be prepared for a modular CMS implementation.

Build sections as configurable modules

Content that may change must not be embedded permanently into the layout logic.

Use structured content for:

Navigation.
Cards.
Publications.
Reports.
Filters.
Keywords.
Documents.
Timeline events.
KPIs.
Sources.
Newsletter fields.
CTAs.
System states.
Avoid
Hard-coded repeated content.
Animations that depend on exact text length.
Layouts that break when a title has two lines.
Components that only work with a fixed number of cards.
Absolute positioning for core content.
Unnecessary custom backend dependencies.
Reloading the page for basic filters, tabs or accordions.
Potential Triario responsibilities

Triario may be required for:

HubSpot custom modules.
Custom templates.
HubDB or structured CMS content.
Shared taxonomy between Blog, Home and content repositories.
Predictive global search.
Dynamic filtering.
Document repositories.
Download tracking.
Dashboard embeds.
Data connections.
Chart export to CSV or image.
Newsletter automation and contact deduplication.
Consent and personal-data processing.
Nova AI integration.
Source citation logic.
Analytics events.
Microsoft Clarity validation.
GSAP optimization in production.
Cross-browser QA.
HubSpot editor compatibility.

The prototype may simulate these behaviors but must not pretend that external services are already connected.

Clearly distinguish:

Functional front-end interaction.
Simulated data.
Functionality requiring backend integration.
16. Figma handoff requirement

This project will ultimately be delivered as an editable design inside a Figma board.

The coded MVP must therefore use a measurable and systematic layout that can be recreated accurately in Figma.

The design must define
Frame widths.
Breakpoints.
Maximum content widths.
Columns.
Gutters.
Margins.
Spacing scale.
Typography scale.
Line heights.
Button dimensions.
Input dimensions.
Card dimensions.
Border radii.
Border styles.
Icon sizes.
Component states.
Animation behavior.
Responsive transformations.
Figma structure

The final Figma file should contain:

Cover and project summary.
Brand foundations.
Color variables.
Typography styles.
Spacing system.
Grid and breakpoint documentation.
Icon rules.
Reusable components.
Component variants.
Desktop page frames.
Tablet page frames.
Mobile page frames.
Interaction notes.
GSAP motion specifications.
HubSpot implementation notes.
Developer handoff annotations.
Figma component requirements

Use:

Auto Layout.
Components.
Variants.
Variables.
Text styles.
Color styles or variables.
Consistent naming.
Responsive constraints.
Reusable nested components.

Suggested naming:

Navigation/Header/Desktop
Navigation/Header/Mobile
Navigation/Dropdown
Navigation/Subnav
Button/Primary
Button/Secondary
Button/Text
Form/Input
Form/Select
Form/Checkbox
Card/Article
Card/Publication
Card/KPI
Card/Dashboard
Filter/Chip
Filter/Select
Data/ChartContainer
Feedback/EmptyState
Feedback/ErrorState
Feedback/LoadingState
Motion documentation

Each animated component must include:

Trigger.
Initial state.
Final state.
Duration.
Easing.
Stagger.
Scroll behavior.
Mobile alternative.
Reduced-motion alternative.

Do not leave motion only inside the coded prototype without documenting it for developers.

After the MVP is approved, provide a clear step-by-step method for transferring the approved system to Figma while preserving:

Layout.
Sizes.
Colors.
Typography.
Components.
Responsive behavior.
Motion specifications.
HubSpot implementation intent.
17. Component design rules
Buttons
Minimum height: 44px.
Clear primary and secondary hierarchy.
Medium corner radius.
Visible hover, active, focus and disabled states.
Avoid excessive scale animation.
Use the exact CTA copy provided in the documents.
Cards

Use cards only when they improve grouping and scanning.

Do not place every piece of information inside a card.

Cards must have:

Clear hierarchy.
Consistent internal spacing.
Predictable metadata placement.
Keyboard-accessible actions.
Responsive behavior.
Enough flexibility for different title lengths.
Forms

Forms must include:

Visible labels.
Useful placeholders only when provided.
Required-field indicators.
Validation states.
Error messages.
Success states.
Privacy authorization when required.
Proper keyboard order.
Mobile-friendly controls.

Do not use placeholders as the only field label.

Data visualizations

Charts must represent real or clearly labeled placeholder data.

Each chart must provide:

Title.
Context.
Source.
Date or data cutoff.
Accessible description.
Data download action when required.
Image download action when required.
Empty or unavailable-data state.

Do not use decorative fake charts as hero illustrations when the document asks for a real series.

Documents

Publication and document cards must preserve:

Cover.
Content type.
Title.
Summary.
Topic.
Year.
File format.
Number of pages.
File size.
Download action.
Online reading action when applicable.
Source or institutional ownership.
18. System states

Use the exact system messages defined in the source document.

404

Este dato no está donde lo buscabas. Puede que la página haya cambiado de lugar. Volvamos al inicio y busquemos juntos.

Actions:

Ir al Home
Buscar en el sitio
Server error

Algo falló de nuestro lado. Ya lo estamos revisando. Intenta de nuevo en unos minutos.

Search with no results

No encontramos nada con esos criterios. Prueba con menos filtros o con otra palabra. Si crees que deberíamos estar analizando ese tema, cuéntanoslo.

Section under construction

Estamos preparando esta sección. Suscríbete al boletín y te avisamos cuando esté lista.

Data unavailable

Sin dato consolidado para este periodo. Consulta la serie histórica o revisa la nota metodológica.

Loading

Reuniendo la información…

Form submitted

Listo. Gracias por participar.

Required field empty

Falta este campo para poder continuar.

Do not replace these messages with generic alternatives.

19. Quality checklist

Before considering any section complete, verify:

Content
All visible copy comes from the approved sources.
No words have been changed.
No content has been invented.
Placeholders remain visible when data is unknown.
Spanish accents and punctuation are correct.
Brand
Only approved colors are used.
Only approved typography is used.
The logo is used correctly.
Icons follow the linear style.
Photography follows the brand direction.
Contrast is accessible.
UX
The hierarchy is clear.
The primary action is understandable.
The user knows where they are.
The user knows what is interactive.
States and feedback are visible.
The design works with keyboard navigation.
Mobile is not a reduced desktop copy.
GSAP
Required animations are implemented.
Animations serve a purpose.
Scroll behavior is stable.
No layout shift occurs.
Mobile performance is acceptable.
Reduced motion is supported.
Timelines are cleaned up correctly.
Responsive
Tested at 1440px.
Tested at 1024px.
Tested at 768px.
Tested at 390px.
Tested at 360px.
No horizontal overflow.
No overlapping.
No inaccessible controls.
Figma readiness
Layout values are systematic.
Components are reusable.
States are documented.
Responsive changes are clear.
Motion can be explained to developers.
The design can be recreated using Auto Layout and variables.
HubSpot readiness
Content is separated from presentation.
Repeatable content uses structured data.
External integrations are identified.
Backend requirements are not simulated as completed.
Potential Triario tasks are documented.