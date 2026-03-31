# Indus Automation Inc. — Website Codebase

**Industrial automation company website — static HTML/CSS/JS, hosted on GitHub Pages.**

Live: [sukhmeet468.github.io/Website](https://sukhmeet468.github.io/Website/)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 with semantic elements |
| Styling | CSS3 with custom properties (variables) |
| Scripting | Vanilla JavaScript (ES6+, no frameworks) |
| Fonts | Google Fonts — Barlow Condensed + Barlow |
| Forms | Formspree (email notifications + file uploads) |
| SEO | JSON-LD structured data, Open Graph, XML sitemap |
| Hosting | GitHub Pages (static) |

No build tools, no npm, no dependencies. Every file is hand-written and production-ready.

---

## Project Structure

```
WEBSITE/
│
├── assets/
│   └── images/
│       └── favicon.svg              Brand favicon
│
├── css/
│   ├── style.css                    Master stylesheet
│   └── responsive.css               Breakpoints & media queries
│
├── js/
│   ├── form-handler.js              Contact form → Formspree
│   ├── hero-animation.js            Animated canvas hero effect
│   ├── include-loader.js            Runtime HTML component loader
│   ├── main.js                      Core site functionality
│   └── seo.js                       Structured data injection
│
├── services/                        Service detail pages (8)
│   ├── commissioning.html
│   ├── control-panels.html
│   ├── design-drafting.html
│   ├── documentation.html
│   ├── instrumentation.html
│   ├── plc-programming.html
│   ├── procurement.html
│   └── troubleshooting.html
│
├── specialties/                     Industry specialty pages (12)
│   ├── agriculture.html
│   ├── breweries.html
│   ├── building-controls.html
│   ├── custom-apps.html
│   ├── food-processing.html
│   ├── heavy-industry.html
│   ├── manufacturing-oem.html
│   ├── metal-processing.html
│   ├── mining.html
│   ├── refrigeration.html
│   ├── utilities.html
│   └── water-treatment.html
│
├── 404.html                         Custom error page
├── contact.html                     Contact form + company info
├── faq.html                         Frequently asked questions
├── index.html                       Home page (main landing)
├── llms.txt                         AI engine optimization file
├── manifest.json                    PWA web app manifest
├── partners.html                    Siemens & Schneider partnerships
├── projects.html                    Featured project case studies
├── robots.txt                       Search engine crawler rules
├── services.html                    Services overview / index
├── sitemap.xml                      XML sitemap for Google
└── specialties.html                 Industry specialties overview
```

---

## File-by-File Documentation

### Root Pages

| File | Purpose |
|---|---|
| `index.html` | **Home page.** The main landing page visitors see first. Contains 7 sections: animated hero with tagline and CTAs, experience/about intro, core values (Integrity, Quality, Safety), why choose us grid, brand partner logos (ABB, Siemens, Allen-Bradley, Schneider, Eaton, Omron, Honeywell, GE, Benshaw), professional certifications and affiliations, client testimonials with Google Review link, and a CTA band. Loads `hero-animation.js` for the interactive canvas background. |
| `services.html` | **Services overview.** Grid of 8 service cards, each linking to its dedicated sub-page. Covers control panels, PLC programming, design, documentation, commissioning, troubleshooting, procurement, and instrumentation. |
| `specialties.html` | **Industry specialties overview.** Grid of 12 industry cards linking to sub-pages — agriculture, breweries, food processing, metal processing, mining, refrigeration, water treatment, utilities, building controls, manufacturing/OEM, heavy industry, and custom applications. |
| `contact.html` | **Contact page.** Detailed multi-section form with: personal info (name, company, email, phone), project details (service dropdown, industry dropdown, timeline, description textarea), drag-and-drop file upload zone (5 files max, 10MB each), preference checkboxes (quote, callback, emergency), and honeypot spam protection. Sidebar shows Google Maps embed, office address, phone/fax, email, business hours, service area, and 24-hour emergency note. |
| `faq.html` | **FAQ page.** 7 expandable accordion questions covering project timelines, manufacturers used, panel usability, emergency support, warranties, PLC platform compatibility, and remote support. Uses inline JS click handlers for expand/collapse. |
| `projects.html` | **Featured projects.** 4 case study cards: Split Lake WTP upgrade (water/wastewater), automated grain receiving system (agriculture), automated coating application (machine automation), and packaging conveyor upgrade (food processing). |
| `partners.html` | **Partner page.** Two feature cards: Siemens Solution Provider partnership and Schneider Electric Alliance Registered System Integrator Partner, with descriptions of what each partnership means for clients. |
| `404.html` | **Error page.** Shown when a visitor hits a broken URL. Displays a large "404" with navigation back to home and contact page. Marked `noindex` so search engines skip it. |

---

### `/services/` — Service Detail Pages

Each page has the same layout: page hero with breadcrumb navigation, main content area with overview description and capabilities bullet list, and a sidebar with a quote CTA and links to all other services.

| File | Service |
|---|---|
| `control-panels.html` | **Control Panel Design & Fabrication.** CSA-certified panels — MCCs, PLC cabinets, VFD panels, operator consoles, junction boxes. Covers FAT testing, UL 508A and CSA C22.2 compliance, 3D thermal modeling. Displays CSA certification badge. |
| `plc-programming.html` | **PLC/HMI/SCADA Programming.** Allen-Bradley (ControlLogix, CompactLogix), Siemens (S7-1500, S7-1200, TIA Portal), FactoryTalk View, Ignition SCADA, Omron, Schneider. Structured Text, Ladder Logic, Function Block. Displays Siemens Solution Provider badge. |
| `design-drafting.html` | **Design & Drafting.** Electrical schematics, panel layouts, P&IDs, single-line diagrams, cable schedules, I/O lists. AutoCAD Electrical and EPLAN. As-built documentation and 3D enclosure modeling. |
| `documentation.html` | **Documentation.** Functional design specs (FDS), O&M manuals, SOPs, loop diagrams, FAT/SAT procedures, HAZOP support, change management, digital and printed deliverables. |
| `commissioning.html` | **Commissioning.** Pre-commissioning inspections, I/O checkout, loop verification, point-to-point wiring validation, control logic testing, VFD tuning, alarm verification, operator training, performance testing. |
| `troubleshooting.html` | **Troubleshooting & Maintenance.** 24-hour emergency support, PLC/HMI/network fault diagnosis, electrical repair, instrument calibration, preventive maintenance programs, thermal imaging, backup and disaster recovery, firmware updates. |
| `procurement.html` | **Procurement.** BOM management, vendor sourcing, Allen-Bradley/Siemens/ABB/Schneider components, long-lead tracking, spare parts planning, freight coordination, warranty administration, cost tracking. |
| `instrumentation.html` | **Instrumentation Services.** Instrument selection, pressure/temperature/flow/level instruments, analytical instrumentation (pH, conductivity), ISA-standard field wiring, HART and Foundation Fieldbus configuration, recalibration programs. Displays CSA certification badge. |

---

### `/specialties/` — Industry Specialty Pages

Each page has the same layout: page hero with breadcrumb, overview paragraph, applications bullet list, and a sidebar with quote CTA and links to all 12 specialties.

| File | Industry |
|---|---|
| `agriculture.html` | **Agriculture & Grain Handling.** Bulk grain facilities, grain elevators, hammermills, harvesters, progressioners, pulse cleaning plants, straw plants. |
| `breweries.html` | **Breweries.** Brewhouses, centrifuges, effluent treatment systems, fermenters. |
| `food-processing.html` | **Food Processing.** Cheese conveyors, ham tumblers, palletizers, perogy machines, pizza pop machines, poultry air chill lines, rendering equipment. |
| `metal-processing.html` | **Metal Processing.** Conveyors, magnetic drums, shakers, shredders. |
| `mining.html` | **Mining.** Reciprocating booster compressors, screw booster compressors, underground drilling, surface drilling equipment. |
| `refrigeration.html` | **Industrial Refrigeration.** Ammonia pumps, blast chillers, condensers, coolers, morgues, arena ice, brine pumps, compressors, freezers, recirculators, underfloor heating. |
| `water-treatment.html` | **Water & Wastewater Treatment.** Lift stations, reservoirs, pumphouses, WTP & WWTP systems, OEM treatment skids, chemical dosing, UV treatment. This is described as Indus's "bread and butter" — their most established area of expertise. |
| `utilities.html` | **Utilities & Power Systems.** Diesel electric generator controls, power distribution controls, smoothing reactor panels. |
| `building-controls.html` | **Commercial Building Controls.** Lighting control panels (National Energy Code compliant), overhead door control systems, parking lot control panels, door lock control systems. |
| `manufacturing-oem.html` | **Manufacturing & OEM Systems.** OEM panel manufacturing, plastic rotational molding systems. |
| `heavy-industry.html` | **Heavy Industry.** Steel, pulp & paper, sawmills, power generation. |
| `custom-apps.html` | **Custom Applications.** Autoclaves, waterslide traffic control systems — unique one-of-a-kind projects. |

---

### `/css/` — Stylesheets

| File | Purpose |
|---|---|
| `style.css` | **Master stylesheet (~600 lines).** Contains all design tokens (CSS custom properties), base reset, typography rules, layout primitives, and every component style used across the site. Key sections: design tokens/brand colors (`--red: #e60000`, `--bg-primary: #0d0d0d`), navigation (sticky, blur backdrop, mobile toggle), hero section, intro/about layout, industry and specialty card grids, service card and detail layouts, CTA bands, contact form and info cards, footer grid, back-to-top button, breadcrumbs, video wrapper, certification badges, sidebar components, and scroll-reveal animation classes (`.fade-up`). All fonts reference Barlow Condensed (headings) and Barlow (body) via Google Fonts. |
| `responsive.css` | **Breakpoints and media queries (~100 lines).** Three breakpoints: 1024px (tablet landscape — collapses hero grid, service detail, contact layout), 768px (tablet portrait — mobile nav hamburger, single-column grids, reduced padding), 480px (mobile — full-width buttons, stacked cards). Also includes print styles that hide nav/footer and reset colors to black-on-white. |

---

### `/js/` — JavaScript Modules

| File | Purpose |
|---|---|
| `main.js` | **Core site functionality (~120 lines).** Runs on every page. Handles: sticky nav scroll effect (adds `.scrolled` class on scroll for darker background), mobile hamburger menu (open/close with escape key support and body scroll lock), back-to-top button visibility toggle, scroll-reveal animations (IntersectionObserver adds `.visible` to `.fade-up` elements when they enter viewport), lazy loading (swaps `data-src` and `data-bg` attributes to real `src`/`background-image` when elements approach viewport), active nav link highlighting based on current URL path, and smooth-scroll for anchor links. |
| `hero-animation.js` | **Animated canvas hero background (~80 lines).** Creates an interactive circuit board / industrial grid effect on the `<canvas id="heroCanvas">` element on the home page. Generates a grid of nodes connected by L-shaped paths (circuit board style). Red pulses travel along connections. Nodes glow and connections brighten when the mouse hovers nearby. Responsive — recalculates on window resize. Uses `requestAnimationFrame` for smooth 60fps rendering. The entire animation is procedurally generated — no images or video files needed. |
| `form-handler.js` | **Contact form submission via Formspree (~160 lines).** Handles the contact form on `contact.html`. Collects all form fields into a `FormData` object (supports file attachments), validates required fields with real-time feedback, checks the honeypot field to reject bot submissions, and POSTs to Formspree's API. In demo mode (when `FORMSPREE_ID` is `'YOUR_FORM_ID'`), it simulates a send and logs data to console. In live mode, it sends the form data including file attachments and shows success/error status. Configuration requires only pasting a Formspree Form ID on line 14. |
| `seo.js` | **Structured data injection (~100 lines).** Called on each page via `injectStructuredData('pageType')`. Generates and injects JSON-LD `<script>` tags into the document `<head>` at runtime. Schemas generated: `Organization` (company name, logo, contact, area served), `LocalBusiness` / `ElectricalContractor` (address, geo coordinates, opening hours, service catalog), `WebSite` (site-level metadata), `Service` (on service detail pages), and `BreadcrumbList` (navigation trail). All schemas reference the company constants defined at the top of the file (name, URL, phone, address, geo coordinates). |
| `include-loader.js` | **HTML component loader (~20 lines).** Optional utility that loads external HTML fragments into elements with `data-include` attributes (e.g., `<div data-include="/includes/header.html">`). Used during development when working with separate header/footer files. Not actively used in the deployed build since header and footer are pre-injected by the build script, but kept for development convenience. |

---

### `/assets/` — Static Assets

| File | Purpose |
|---|---|
| `images/favicon.svg` | **SVG favicon.** Red rounded rectangle with a white lightning bolt icon — matches the nav logo. Renders crisply at all sizes since it's vector-based. Referenced in every page's `<head>` via `<link rel="icon">`. |
| `images/` | **Image directory.** Placeholder for production images: hero backgrounds, OG social sharing images (1200×630), brand logos, project photos, team photos, apple-touch-icon, and PWA icons. |
| `videos/` | **Video directory.** Placeholder for self-hosted video files (MP4/WebM) if YouTube embeds aren't used. |

---

### Root Configuration Files

| File | Purpose |
|---|---|
| `robots.txt` | **Search engine crawler rules.** Allows all crawlers to index the site. Blocks `/includes/` directory. Allows AI crawlers (GPTBot, ClaudeBot, Google-Extended, Bingbot) explicitly. Blocks low-value scraper bots (CCBot). Sets a 2-second crawl delay. Points to `sitemap.xml` location. |
| `sitemap.xml` | **XML sitemap for search engines.** Lists all 27 indexable pages with their canonical URLs, last-modified dates, and priority scores (1.0 for home, 0.9 for services/contact, 0.7–0.8 for sub-pages). Submitted to Google Search Console to accelerate indexing. |
| `manifest.json` | **PWA web app manifest.** Defines the site name ("Indus Automation Inc."), short name, description, theme color (`#e60000`), background color (`#0d0d0d`), and icon references. Allows the site to be "installed" on mobile home screens with a native app-like experience. |
| `llms.txt` | **AI engine optimization file.** Plain-text summary of the business formatted specifically for AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews). Contains structured information about services, industries served, contact details, and certifications in a format that's easy for language models to parse and cite. |
| `.htaccess` | **Apache server configuration.** Only applies when hosted on Apache servers (e.g., Bluehost), not on GitHub Pages. Contains: HTTPS redirect, www canonicalization, clean URL rewrites (removes .html extension), security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy), browser caching rules (1-year for static assets), gzip compression, bad bot blocking, hotlink protection, and directory listing prevention. |

---

## Brand Design Tokens

All visual design is controlled through CSS custom properties in `style.css`:

```
--red: #e60000           Primary brand color
--red-dark: #b30000      Hover/active state
--bg-primary: #0d0d0d    Page background
--bg-secondary: #141414  Section alternating background
--bg-card: #1a1a1a       Card/panel background
--border: #2a2a2a        Default border color
--text-primary: #ffffff  Headings and primary text
--text-secondary: #b0b0b0 Body text
--text-muted: #777777    Captions and labels
--font-heading: 'Barlow Condensed'  All headings, buttons, labels
--font-body: 'Barlow'              Body text, paragraphs, inputs
```

---

## Page Count Summary

| Section | Pages |
|---|---|
| Root pages | 8 (home, services, specialties, contact, faq, projects, partners, 404) |
| Service sub-pages | 8 |
| Specialty sub-pages | 12 |
| **Total HTML pages** | **28** |
| CSS files | 2 |
| JS modules | 5 |
| Config files | 5 (robots.txt, sitemap.xml, manifest.json, llms.txt, .htaccess) |
| **Total files** | **41** |

---

## How to Modify

**Adding a new page:** Copy any existing page as a template. Update the `<title>`, `<meta description>`, canonical URL, breadcrumb, and page content. Add a nav link in the header section of every page. Add a `<url>` entry in `sitemap.xml`.

**Changing brand colors:** Edit the CSS custom properties at the top of `css/style.css`. All components reference these variables, so one change propagates everywhere.

**Enabling the contact form:** Open `js/form-handler.js`, replace `YOUR_FORM_ID` on line 14 with your Formspree form ID.

**Switching to a custom domain:** Replace all `/Website/` path prefixes back to `/` across all HTML files. Update canonical URLs and OG tags to the new domain.

**Viewing the website locally:** Make sure you are in root folder such that you see Website/ folder. Run the command 'python -m http.server 8000' and then visit http://localhost:8000/Website/
---

Built for **Indus Automation Inc.** — 1-442 Higgins Ave, Winnipeg, MB R3A 1S5 — [204-943-0050](tel:+12049430050)
