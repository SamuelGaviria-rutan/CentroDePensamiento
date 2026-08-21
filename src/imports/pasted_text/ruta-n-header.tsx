Create the reusable global website header for the “Centro de Pensamiento de Ruta N”.

IMPORTANT:
Build only the header and its navigation interactions. Do not create the hero section, page content, footer, dashboards, cards, or any additional website sections yet.

TECHNICAL APPROACH
- Build it as a reusable React component using TypeScript.
- Use clean, modular, production-ready code.
- Use GSAP for the navigation, dropdown, search, mobile menu, and scroll-direction animations.
- Keep all navigation content in a structured configuration object so labels, descriptions, links, and submenus can be edited easily later.
- Use semantic HTML: header, nav, buttons, links, lists, and form elements.
- Do not use placeholder lorem ipsum.

BRAND AND VISUAL DIRECTION
Create a sophisticated, editorial, data-driven institutional header that feels like the strategic knowledge hub of Ruta N.

The visual personality should combine:
- The Sage: clarity, knowledge, evidence, credibility and depth.
- The Magician: innovation, transformation, subtle surprise and intelligent motion.

The design must feel modern and distinctive, but not futuristic, flashy, playful, or visually overloaded.

Use the Ruta N visual system:
- Dark green: #253D36
- Lime green: #C0D400
- Teal: #00B8A3
- Blue: #0068FF
- Yellow: #FFCA00
- Orange-red: #FF4C17
- White and near-black neutrals

Use dark green as the main institutional color and lime green as the primary accent. Use the remaining brand colors only for subtle details or interaction states.

Typography:
- Neue Haas Grotesk for navigation labels, headings and strong interface text.
- Source Sans Pro for descriptions, utility text and search input text.
- Use sensible fallbacks if these fonts are unavailable.
- Maintain strong contrast and WCAG AA readability.

LOGO AREA
On the left side:
- Use the existing official Ruta N logo asset from the project.
- Do not redraw, distort, recolor, crop, modify or recreate the logo.
- Respect its clear space and minimum digital size.
- Place the text “Centro de Pensamiento” beside the logo as a separate typographic identifier.
- The full logo area must link to the Centro de Pensamiento homepage.

DESKTOP STRUCTURE
Create a full-width header with a centered content container of approximately 1440px maximum width.

Default header height:
- Approximately 88px at the top of the page.
- White or very light neutral background.
- Thin bottom divider with low contrast.
- Generous horizontal spacing.
- Avoid heavy shadows.

Header layout:
1. Left: Ruta N logo and “Centro de Pensamiento” identifier.
2. Center: main navigation.
3. Right: global search and newsletter subscription button.

MAIN NAVIGATION

1. “Radar CTI”
This item has a dropdown.

Descriptor:
“Datos, rankings y pulso del ecosistema”

Dropdown links:
- “Pulso CTI de Medellín”
  Supporting text: “Nuestra medición propia”
- “Rankings”
  Supporting text: “Medellín en el mapa global”
- “Data”
  Supporting text: “Tableros, series y reportes”

2. “Análisis CTI”
This is a direct navigation link with no dropdown.

Its conceptual descriptor is:
“Análisis a profundidad y prospectiva”

Do not display this descriptor permanently in the main header. It may appear as accessible supporting information or subtle hover context, but the main item must remain visually clean.

3. “Lab de Políticas”
This item has a dropdown.

Descriptor:
“Política pública que habilita la innovación”

Dropdown links:
- “Documentación”
  Supporting text: “Repositorio normativo del Distrito CTI”
- “Compras Públicas Innovadoras”
  Supporting text: “Cómo comprar innovación”

4. “Blog”
This is a direct navigation link with no dropdown.

Its conceptual descriptor is:
“Lo que estamos pensando”

DROPDOWN DESIGN
- Use a refined editorial dropdown, not a generic browser menu.
- Position it directly below the related navigation item.
- Use a white surface, subtle border, soft shadow and generous internal spacing.
- Include the section descriptor at the top as contextual text.
- Show submenu links as clear interactive rows.
- Each row includes a strong title, supporting description and a subtle directional arrow.
- Use simple linear icons only when they add meaning.
- Do not use filled or decorative icon illustrations.
- Highlight hover and keyboard focus states using dark green, lime green and subtle background changes.
- Animate opening and closing with GSAP using opacity, vertical movement and a slight stagger.
- Keep animation duration between 250ms and 400ms.
- Only one dropdown may remain open at a time.
- Close the dropdown when:
  - the user clicks outside,
  - presses Escape,
  - selects a link,
  - or opens another dropdown.

GLOBAL SEARCH
Place the global search control on the right side.

Default desktop state:
- Display a compact search field or search trigger with a linear search icon.
- Use the exact placeholder:
  “Busca un dato, un informe o una norma…”

Interaction:
- Clicking the search control expands it smoothly using GSAP.
- The input receives keyboard focus automatically.
- Display a clear close button.
- Pressing Escape closes the expanded search.
- For now, show a clean empty search state without creating real search results.
- Prepare the component structure so predictive search results can be added later.
- Do not navigate or reload the page while typing.

NEWSLETTER CTA
Create a high-visibility button with the exact label:
“Suscribirme al boletín”

Style:
- Lime green background #C0D400.
- Dark green text #253D36.
- Clear hover, active and keyboard-focus states.
- Avoid excessive rounding; use a refined medium radius.
- Minimum touch target of 44px.
- Add a subtle GSAP hover interaction, such as a restrained arrow movement or background transition.
- Do not use bouncing, scaling-heavy or playful animation.

ACTIVE PAGE STATES
- Clearly indicate the current section.
- Use a subtle underline, small marker or color change.
- The active state must remain distinguishable without relying only on color.
- Dropdown parent items must also show an active state when one of their child pages is active.

SCROLL BEHAVIOR WITH GSAP
Make the header persistent and responsive to scroll direction.

At the top of the page:
- Use the full approximately 88px header height.
- Keep all controls visible.

When scrolling down:
- Smoothly transition to a compact approximately 64px state.
- Reduce vertical padding and slightly reduce the secondary identifier size.
- Preserve full usability and do not make text too small.
- After continued downward scrolling, the compact header may slide out of view without producing layout shift.

At the first upward scroll gesture:
- Immediately reveal the compact header.
- Do not wait for the user to return to the top.

When returning to the top:
- Restore the full header state.

Use GSAP transforms instead of layout-heavy animation.
Avoid scroll jitter, abrupt transitions and cumulative layout shift.

OPTIONAL INTERNAL-PAGE SUBNAVIGATION
Prepare an optional secondary navigation row as part of the reusable header architecture.

Requirements:
- It must be hidden on the homepage.
- It can be enabled through configuration on internal pages.
- It must support configurable tabs and active states.
- It must remain visually subordinate to the main navigation.
- Do not populate or display it in this first homepage header prototype.

TABLET BEHAVIOR
- Maintain the desktop structure while enough horizontal space is available.
- Gradually reduce gaps and search width.
- Do not allow navigation labels to wrap.
- Switch to the mobile navigation before the layout becomes crowded.
- Do not simply shrink everything until it becomes unreadable.

MOBILE HEADER
For mobile screens:
- Use a compact 64px header.
- Keep the Ruta N logo and “Centro de Pensamiento” identifier readable.
- Place a search icon and hamburger menu on the right.
- Use 44px minimum touch targets.

MOBILE MENU
Create a full-screen or near-full-screen navigation drawer.

Structure:
- Header area with logo and close button.
- Main navigation displayed vertically.
- “Radar CTI” and “Lab de Políticas” work as accessible accordions.
- “Análisis CTI” and “Blog” remain direct links.
- Place the “Suscribirme al boletín” button prominently near the bottom.
- Include the global search field inside the mobile menu.

GSAP mobile animation:
- Animate the drawer with a smooth slide and fade.
- Stagger navigation items subtly.
- Animate accordion content using height and opacity without abrupt jumps.
- Lock background scrolling while the menu is open.
- Restore scroll position correctly after closing.

ACCESSIBILITY
- Fully support keyboard navigation.
- Use visible focus states.
- Use aria-expanded, aria-controls, aria-current and accessible labels correctly.
- Allow dropdowns and mobile accordions to work with Enter and Space.
- Escape must close any open dropdown, search panel or mobile menu.
- Trap focus inside the mobile drawer while it is open.
- Restore focus to the triggering control when it closes.
- Respect prefers-reduced-motion by disabling non-essential movement.
- Maintain WCAG AA contrast.
- Do not communicate states through color alone.

RESPONSIVE QUALITY
Test the component at:
- 1440px desktop
- 1024px tablet
- 768px small tablet
- 390px mobile
- 360px mobile

The header must not have:
- Horizontal overflow
- Overlapping elements
- Wrapped navigation labels
- Unreadable text
- Excessive shadows
- Generic template styling
- Decorative animations without functional value

DELIVERABLE
Produce one polished, fully functional and responsive header component with:
- Desktop navigation
- Dropdown interactions
- Global search interaction
- Newsletter CTA
- Active states
- GSAP scroll behavior
- Tablet adaptation
- Accessible mobile drawer
- Optional internal-page subnavigation architecture

Use Spanish for every visible interface label and English only for code, component names and internal developer documentation.