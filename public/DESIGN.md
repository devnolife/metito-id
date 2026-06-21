---
name: Luminous Energy System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444934'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757961'
  outline-variant: '#c5c9ae'
  surface-tint: '#526600'
  primary: '#526600'
  on-primary: '#ffffff'
  primary-container: '#d4ff37'
  on-primary-container: '#5e7400'
  inverse-primary: '#aed500'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#edeff1'
  on-tertiary-container: '#696c6e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8f328'
  primary-fixed-dim: '#aed500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3d4d00'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is built for the "Green Power" brand, embodying a personality that is visionary, clean, and technologically advanced. It centers on the intersection of sustainability and high-performance engineering. 

The visual language utilizes a **Modern Corporate** style with heavy **Glassmorphism** influences. It balances high-contrast energy (vibrant lime accents) with professional stability (deep navy and crisp white). The emotional goal is to evoke a sense of optimism, clarity, and trust. Key characteristics include large-scale imagery, significant whitespace, and translucent layering that suggests transparency and lightness.

## Colors

The palette is dominated by a vibrant "Electric Lime" primary color, designed to pop against both light and dark backgrounds. 

- **Primary (Electric Lime):** Used for calls to action, highlights, and status indicators. It represents energy and growth.
- **Secondary (Deep Navy):** Used for hero backgrounds, primary text, and grounding elements. It conveys authority and reliability.
- **Tertiary (Ice White/Blue):** A series of very light blues and whites used for surface backgrounds and card containers to maintain a fresh, airy feel.
- **Neutral (Slate):** Used for secondary body text and subtle borders to ensure high legibility without the harshness of pure black.

## Typography

The system utilizes **Hanken Grotesk** across all roles to achieve a unified, technical, and contemporary look. The typeface’s sharp geometry matches the precision of energy technology.

- **Headlines:** Use tighter letter spacing and heavy weights to create a strong visual anchor.
- **Body:** Open line heights are maintained for maximum readability on data-heavy pages.
- **Labels:** Uppercase styling is used for overlines and category tags (e.g., "ABOUT US") to differentiate them from interactive elements.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width of 1280px. A 12-column system is used for desktop, collapsing to 4 columns on mobile. 

Whitespace is treated as a core design element. Large vertical gaps (120px+) between sections are required to maintain the "clean" aesthetic. Content should feel uncrowded, with generous internal padding within cards (32px-48px) to support the glassmorphism effects. Elements often overlap image boundaries to create depth and movement.

## Elevation & Depth

Depth is achieved through a combination of **Glassmorphism** and **Ambient Shadows**.

1.  **Glass Layers:** Secondary surfaces (cards, navigation bars) use a backdrop blur (12px-20px) with a semi-transparent white stroke (1px, 20% opacity). This allows the background imagery to "peek" through, reinforcing the theme of transparency.
2.  **Soft Shadows:** Use very large blur radii (30px-60px) with extremely low opacity (4%-8%) navy-tinted shadows. This makes elements appear to float gently rather than sit heavily on the page.
3.  **Tonal Stacking:** Use the Tertiary color (light blue-white) for cards sitting on pure white backgrounds to create subtle "level 1" elevation without relying on shadows alone.

## Shapes

The shape language is defined by **large, friendly radiuses**. 

- **Standard Elements:** Buttons and small chips use a 0.5rem (8px) radius.
- **Containers:** Main cards and image containers use a "Large" radius (1rem / 16px).
- **Featured Sections:** Hero elements and large content blocks use an "Extra Large" radius (1.5rem / 24px) to create a soft, approachable silhouette that balances the high-tech typography.
- **Circular Accents:** Icon backgrounds and profile images should be fully rounded (pill/circle).

## Components

- **Buttons:** Primary buttons are pill-shaped or highly rounded, using the Electric Lime background with Deep Navy text. They often include a small leading or trailing icon (e.g., an arrow) to signify action.
- **Glass Cards:** Used for testimonials or feature highlights. These must have a subtle white border, backdrop blur, and a soft shadow.
- **Chips / Tags:** Small, uppercase labels with light lime backgrounds and dark green/navy text for category markers like "SERVICE" or "ABOUT US."
- **Action Icons:** Small, circular Lime Green buttons with dark icons, often positioned at the bottom-right of image cards to provide a "View More" or "Next" action.
- **Inputs:** Clean, white backgrounds with soft borders, using the secondary navy color for high-contrast focus states.
- **Avatars:** Grouped avatars (facepiles) should have a thick white border to separate them from background glass layers.