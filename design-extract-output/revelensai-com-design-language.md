# Design Language: Unknown Site

> Extracted from `https://revelensai.com/reports/task/4605d41f-97b3-48df-ae16-3ea7c5810511` on April 28, 2026
> 84 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ffffff` | hsl(0, 0%, 100%) | 85 |
| `#262626` | hsl(0, 0%, 15%) | 82 |
| `#000000` | hsl(0, 0%, 0%) | 5 |
| `#171717` | hsl(0, 0%, 9%) | 3 |

### Background Colors

Used on large-area elements: `#000000`

### Text Colors

Text color palette: `#ffffff`, `#fafafa`, `#171717`

### Gradients

```css
background-image: linear-gradient(rgba(20, 20, 20, 0.88), rgba(20, 20, 20, 0.78));
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#ffffff` | text, border, background | 85 |
| `#262626` | border | 82 |
| `#000000` | background | 5 |
| `#171717` | text | 3 |

## Typography

### Font Families

- **Times** — used for body (84 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 16px | 1rem | 400 | 24px | normal | html, head, meta, link |
| 14px | 0.875rem | 500 | 20px | normal | button, svg, line, circle |
| 12px | 0.75rem | 500 | 16px | normal | a, button, svg, path |

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: 24px; }
```

### Font Weights in Use

`400` (64x), `500` (20x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-4 | 4px | 0.25rem |
| spacing-32 | 32px | 2rem |
| spacing-57 | 57px | 3.5625rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 4px | 1 |
| lg | 12px | 1 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
```

**lg** — blur: 24px
```css
box-shadow: rgba(0, 0, 0, 0.45) 0px 8px 24px 0px, rgba(0, 0, 0, 0.3) 0px 2px 8px 0px;
```

## CSS Custom Properties

### Colors

```css
--foreground: 0 0% 3.9%;
--card: 0 0% 100%;
--card-foreground: 0 0% 3.9%;
--popover: 0 0% 100%;
--popover-foreground: 0 0% 3.9%;
--primary: 0 0% 9%;
--primary-foreground: 0 0% 98%;
--secondary: 0 0% 96.1%;
--secondary-foreground: 0 0% 9%;
--muted: 0 0% 96.1%;
--muted-foreground: 0 0% 45.1%;
--accent: 0 0% 96.1%;
--accent-foreground: 0 0% 9%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
--border: 0 0% 89.8%;
--ring: 0 0% 3.9%;
--color-one: #ffbd7a;
--color-two: #fe8bbb;
--color-three: #9e7aff;
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-shadow: 0 0 #0000;
--tw-ring-inset: ;
--tw-border-spacing-x: 0;
--tw-ring-color: rgb(59 130 246 / 0.5);
--tw-ring-offset-color: #fff;
--tw-ring-offset-width: 0px;
--tw-shadow-colored: 0 0 #0000;
--tw-border-spacing-y: 0;
```

### Spacing

```css
--tw-numeric-spacing: ;
--tw-contain-size: ;
```

### Shadows

```css
--tw-drop-shadow: ;
--tw-shadow: 0 0 #0000;
```

### Radii

```css
--radius: 0.5rem;
```

### Other

```css
--background: 0 0% 100%;
--input: 0 0% 89.8%;
--navigation-height: 3.5rem;
--tw-backdrop-sepia: ;
--tw-sepia: ;
--tw-ordinal: ;
--tw-backdrop-saturate: ;
--tw-contain-style: ;
--tw-backdrop-invert: ;
--tw-brightness: ;
--tw-backdrop-grayscale: ;
--tw-hue-rotate: ;
--tw-scale-y: 1;
--tw-pan-y: ;
--tw-backdrop-contrast: ;
--tw-backdrop-brightness: ;
--tw-pan-x: ;
--tw-translate-y: 0;
--tw-rotate: 0;
--tw-contrast: ;
--tw-skew-x: 0;
--tw-backdrop-blur: ;
--tw-translate-x: 0;
--tw-gradient-via-position: ;
--tw-saturate: ;
--tw-scroll-snap-strictness: proximity;
--tw-grayscale: ;
--tw-scale-x: 1;
--tw-backdrop-hue-rotate: ;
--aca-sticky-top: 57px;
--tw-gradient-to-position: ;
--tw-numeric-fraction: ;
--tw-skew-y: 0;
--tw-slashed-zero: ;
--tw-blur: ;
--tw-invert: ;
--tw-backdrop-opacity: ;
--tw-gradient-from-position: ;
--tw-numeric-figure: ;
--tw-pinch-zoom: ;
--tw-contain-paint: ;
--tw-contain-layout: ;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| xs | 360px | min-width |
| sm | 600px | max-width |
| sm | 640px | min-width |
| md | 768px | min-width |
| lg | 1024px | min-width |
| xl | 1280px | min-width |
| 1400px | 1400px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`

**Durations:** `0.15s`, `1s`

### Common Transitions

```css
transition: all;
transition: color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), fill 0.15s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.15s cubic-bezier(0.4, 0, 0.2, 1);
transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations

**fade-in**
```css
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: none; }
}
```

**fade-up**
```css
@keyframes fade-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: none; }
}
```

**marquee**
```css
@keyframes marquee {
  0% { transform: translateX(0px); }
  100% { transform: translateX(calc(-100% - var(--gap))); }
}
```

**marquee-vertical**
```css
@keyframes marquee-vertical {
  0% { transform: translateY(0px); }
  100% { transform: translateY(calc(-100% - var(--gap))); }
}
```

**pulse**
```css
@keyframes pulse {
  50% { opacity: 0.5; }
}
```

**shimmer**
```css
@keyframes shimmer {
  0%, 90%, 100% { background-position: calc(-100% - var(--shimmer-width)) 0; }
  30%, 60% { background-position: calc(100% + var(--shimmer-width)) 0; }
}
```

**spin**
```css
@keyframes spin {
  100% { transform: rotate(360deg); }
}
```

**enter**
```css
@keyframes enter {
  0% { opacity: var(--tw-enter-opacity, 1); transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0)); }
}
```

**exit**
```css
@keyframes exit {
  100% { opacity: var(--tw-exit-opacity, 1); transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0)); }
}
```

**image-glow**
```css
@keyframes image-glow {
  0% { content: var(--tw-content); opacity: 0; animation-timing-function: cubic-bezier(0.74, 0.25, 0.76, 1); }
  10% { content: var(--tw-content); opacity: 0.7; animation-timing-function: cubic-bezier(0.12, 0.01, 0.08, 0.99); }
  100% { content: var(--tw-content); opacity: 0.4; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (8 instances)

```css
.button {
  background-color: rgb(250, 250, 250);
  color: rgb(250, 250, 250);
  font-size: 14px;
  font-weight: 500;
  padding-top: 8px;
  padding-right: 12px;
  border-radius: 6px;
}
```

### Links (3 instances)

```css
.link {
  color: rgb(250, 250, 250);
  font-size: 12px;
  font-weight: 500;
}
```

### Navigation (3 instances)

```css
.navigatio {
  background-color: rgb(0, 0, 0);
  color: rgb(250, 250, 250);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Dropdowns (1 instances)

```css
.dropdown {
  border-radius: 0px;
  border-color: rgb(38, 38, 38);
  padding-top: 0px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 4 instances, 2 variants

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(250, 250, 250);
  padding: 8px 16px 8px 16px;
  border-radius: 6px;
  border: 0px solid rgb(38, 38, 38);
  font-size: 14px;
  font-weight: 500;
```

**Variant 2** (2 instances)

```css
  background: rgb(250, 250, 250);
  color: rgb(23, 23, 23);
  padding: 8px 16px 8px 16px;
  border-radius: 6px;
  border: 0px solid rgb(38, 38, 38);
  font-size: 14px;
  font-weight: 500;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(250, 250, 250);
  padding: 0px 12px 0px 12px;
  border-radius: 6px;
  border: 0px solid rgb(38, 38, 38);
  font-size: 12px;
  font-weight: 500;
```

## Layout System

**0 grid containers** and **17 flex containers** detected.

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 16x |
| column/nowrap | 1x |

**Gap values:** `12px`, `4px`, `8px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 3 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#171717` | `#fafafa` | 17.18:1 | AAA |

## Design System Score

**Overall: 89/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 85/100 |
| Typography Consistency | 100/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- No clear primary brand color detected
- 37 !important rules — prefer specificity over overrides
- 99% of CSS is unused — consider purging
- 5021 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | — | 2 | brand |

```css
background: linear-gradient(rgba(20, 20, 20, 0.88), rgba(20, 20, 20, 0.78));
```

## Z-Index Map

**3 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1000,1000 | div |
| sticky | 20,50 | div.a.b.s.o.l.u.t.e. .l.e.f.t.-.4. .t.o.p.-.4. .z.-.2.0. .f.l.e.x. .i.t.e.m.s.-.c.e.n.t.e.r. .g.a.p.-.2, div.a.b.s.o.l.u.t.e. .r.i.g.h.t.-.4. .t.o.p.-.4. .z.-.2.0, header.f.i.x.e.d. .l.e.f.t.-.0. .t.o.p.-.0. .z.-.5.0. .w.-.f.u.l.l. .t.r.a.n.s.l.a.t.e.-.y.-.[.-.1.r.e.m.]. .a.n.i.m.a.t.e.-.f.a.d.e.-.i.n. .b.o.r.d.e.r.-.b. .o.p.a.c.i.t.y.-.0. .b.a.c.k.d.r.o.p.-.b.l.u.r.-.[.1.2.p.x.]. .[.-.-.a.n.i.m.a.t.i.o.n.-.d.e.l.a.y.:.6.0.0.m.s.] |

## SVG Icons

**2 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| sm | 2 |

**Icon colors:** `currentColor`

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 1 | objectFit: fill, borderRadius: 4px, shape: rounded |

**Aspect ratios:** 1:1 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |

### Easing Families

- **custom** (11 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `fade-in` | slide-y | opacity, transform | 1 |

## Component Anatomy

### button — 6 instances

**Slots:** label
**Variants:** outline
**Sizes:** md · medium

## Brand Voice

**Tone:** neutral · **Pronoun:** third-person · **Headings:** unknown (tight)

### Top CTA Verbs

- **reject** (1)
- **allow** (1)
- **resources** (1)
- **login** (1)

### Button Copy Patterns

- "reject" (1×)
- "allow" (1×)
- "resources" (1×)
- "中" (1×)
- "login" (1×)

## Page Intent

**Type:** `unknown` (confidence 0)

## Section Roles

Reading order (top→bottom): nav → content → content → content

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.4 |
| 1 | content | — | 0.3 |
| 2 | content | — | 0.3 |
| 3 | content | — | 0.3 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 12px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `icon-only` (confidence 0.6)
**Counts:** total 1, svg 0, icon 2, screenshot-like 0, photo-like 0
**Dominant aspect:** square-ish
**Radius profile on images:** square

## Component Library

**Detected:** `shadcn/ui` (confidence 0.65)

Evidence:
- shadcn css tokens

Also considered: tailwindcss (0.3)

## Component Screenshots

6 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--outline--md | 0 | 68 × 36 | `screenshots/button-outline-md-0.png` |
| button--outline--md | 1 | 67 × 36 | `screenshots/button-outline-md-1.png` |
| button--outline--md | 2 | 36 × 36 | `screenshots/button-outline-md-2.png` |
| button--outline--medium | 0 | 93 × 32 | `screenshots/button-outline-medium-0.png` |
| button--outline--medium | 1 | 64 × 32 | `screenshots/button-outline-medium-1.png` |
| button--outline--medium | 2 | 53 × 32 | `screenshots/button-outline-medium-2.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Times` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
