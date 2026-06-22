---
name: The Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin: 48px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style

The design system is rooted in the heritage of editorial design and traditional printing. It prioritizes clarity, authority, and the physical sensation of paper and ink. By eschewing modern trends like gradients and rounded corners, it evokes an atmosphere of intellectual rigor and professional permanence. 

The aesthetic is strictly **Minimalist** and **Grid-based**, leaning into a document-oriented layout. It treats the digital screen as a high-quality stationery surface, emphasizing the "white space" as a functional element rather than empty space. The emotional response is one of calm, structured reliability—ideal for archival content, technical documentation, or high-end editorial platforms.

## Colors

The color palette of the design system is binary and uncompromising, utilizing a high-contrast foundation to ensure maximum legibility and a classic print feel.

- **Pure Black (#000000):** Used for primary text, heavy borders, and high-emphasis interactive elements. It represents the "ink" of the system.
- **Pure White (#FFFFFF):** The primary surface color, acting as the "paper."
- **Light Gray (#F5F5F5):** Used for large background sections or subtle container fills to distinguish between different content areas without introducing color.
- **Medium Gray (#CCCCCC):** Reserved for secondary UI elements such as thin dividers, disabled states, and placeholder text.

## Typography

This design system employs a sophisticated typographic pairing that balances traditional editorial flair with modern functional clarity.

- **Headlines (Newsreader):** This serif typeface provides an authoritative, literary tone. Larger headings should utilize heavier weights to mimic the impact of a newspaper masthead. 
- **Body & Labels (Inter):** A neutral, systematic sans-serif ensures that dense information remains highly legible across all screen sizes. 
- **Execution:** Use generous line heights (1.6) for body text to improve the reading experience, mimicking the leading found in high-quality print journals. Labels and small metadata should use uppercase styling with increased letter spacing for a technical, "cataloged" look.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model, strictly adhering to a 12-column structure for desktop interfaces. This ensures that every element feels anchored and intentional.

- **Margins:** Large outer margins (48px+) are used to frame content, creating the "editorial" feel of a page margin.
- **Rhythm:** Spacing follows a 4px baseline, but content blocks should primarily be separated by larger increments (32px or 64px) to emphasize the minimalist aesthetic.
- **Alignment:** All text and components must snap to the grid. Use vertical dividers (1px Medium Gray) to separate columns where information density is high.

## Elevation & Depth

The design system rejects depth through shadows or blurs. Instead, it uses **Bold Borders** and **Tonal Layering** to communicate hierarchy.

- **Borders:** All containers are defined by 1px solid lines. Primary containers use Pure Black, while secondary or nested containers use Medium Gray.
- **Stacking:** Elements do not "float" over one another. Instead, they are laid out in a flat, planar fashion. If an element must appear "on top" (like a modal), it is defined by a heavy 2px black border and a solid white background, creating a physical "cut-out" effect on the page.
- **Interaction:** Hover states should not use shadows; instead, use inverted colors (Black background with White text) or a subtle shift to Light Gray (#F5F5F5) backgrounds.

## Shapes

The shape language is strictly **Sharp**. Every button, input field, card, and modal must have 0px corner radii. This reinforces the "document" aesthetic, suggesting the sharp edges of paper and the precision of a printing press. Circular elements are permitted only for functional icons or user avatars, but even these should be housed within square containers where possible.

## Components

Components in this design system are treated as functional blocks of a larger document.

- **Buttons:** Primary buttons are solid Pure Black with Pure White text. Secondary buttons are Pure White with a 1px Pure Black border. All buttons use sharp corners and uppercase Inter for the label.
- **Input Fields:** Use a simple 1px Medium Gray bottom border for a "form" look, or a full 1px black box for higher visibility. Focus states should transition the border to 2px Pure Black.
- **Cards:** Cards should have no box-shadow. They are defined by a 1px Medium Gray border. For high-emphasis cards, use a 1px Pure Black border with a generous padding of 32px.
- **Lists:** Use 1px horizontal dividers between list items. Use the Newsreader typeface for list titles to maintain the editorial feel.
- **Checkboxes/Radios:** These are strictly square (even for radios) to maintain the sharp-edged aesthetic, using a heavy black tick or inner square for the "selected" state.
- **Data Tables:** Tables are a core component. Use 1px borders for all cells and a Light Gray (#F5F5F5) header row to differentiate from the data.