# UI Design System

## Color Palette

- **CSS Variable Color System**: Centralized color palette management:
  - `--primary` (#A3C4DC): Main buttons, highlights, navigation
  - `--accent` (#6EC6FF): Links, time displays, hover effects
  - `--highlight` (#F5F5F5): Body text, general content
  - `--secondary` (#273B4A): Background panels, popovers
  - `--glow` (#B2E3FF): Hover/focus glow effects
  - `--background` (#0B0E16): Deep night blue base

**Notes:**

- Background should be a deep night blue (`#0B0E16`).
- Use gradients sparingly (example: `#0B0E16 → #273B4A` for hero sections).
- Apply subtle shadow/glow to important UI elements.

## Typography System

- **Headlines**: Playfair Display (serif) - All h1, h2, h3 elements
- **Body Text**: Inter (sans-serif) - Paragraphs, lists, general content
- **Data/Times**: Rubik (sans-serif) - Time displays, astronomical data
- **Special**: Playfair Display italic - Subtitle in header
- **FormattedTime Component**: Created reusable component handling both Date
  objects and time strings with consistent formatting, including displaying with
  raised colons for better visual hierarchy and readability

```css
h1,
h2,
h3 {
  font-family: "Playfair Display", serif;
}

body {
  font-family: "Inter", sans-serif;
}

.data-time {
  font-family: "Rubik", sans-serif;
  letter-spacing: 0.03em;
}
```

**Weights & Sizes**

- Headlines: `Playfair Display`, **bold** or **semi-bold**, ≥ 28px
- Body: `Inter`, normal (400) or medium (500), 16–18px
- Data: `Rubik`, medium or bold, slightly letter-spaced

**Best Practices**

- Use `Rubik` **only for numeric/time data**, not for labels.
- Keep labels in `Inter` for clarity.
- Use `Accent` color for key data highlights.

## Visual Elements

- **Glassmorphism**: `background: rgba(255, 255, 255, 0.05)`,
  `backdrop-filter: blur(8px)`, `border-radius: 24px`
- **Background Images**:
  - Body: Repeating `sky-tile.jpg` for seamless starfield
  - Header: `milky-way-hero-3.jpg` featuring galactic core
- **Button Styles**: Primary buttons with hover glow effect using #B2E3FF
- **Dark/Field Mode**: Red color scheme (#ff4444) for astronomy field use

### Links

- Color: `Accent` (`#6EC6FF`)
- Underline on hover
- Optional glow for key calls-to-action

### Data Presentation

For **rise/set times, durations, altitudes**:

```html
<div class="data-block">
  <span class="label">Rise:</span>
  <span class="data-time">21:18</span>
</div>
```

```css
.data-block {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}
.label {
  font-family: "Inter", sans-serif;
  color: #f5f5f5;
}
.data-time {
  font-family: "Orbitron", sans-serif;
  color: #6ec6ff;
  letter-spacing: 0.03em;
}
```

## Motion & Microinteractions

- Subtle scroll-based animations — e.g., stars fading in, constellations
  connecting, parallax layers.
- Hover effects that gently scale or glow elements.
- Loading animation: a rotating star map or a twinkling star cluster.

## Responsive Design

- **Mobile:** Stack sections vertically, increase font size for data.
- **Tablet:** Maintain 2-column layouts where possible.
- **Desktop:** Use wider hero images and multi-column data grids.

## Accessibility

- Minimum contrast ratio 4.5:1 for text.
- All interactive elements must have hover and focus states.
- Provide alt text for images (e.g., `"Milky Way over desert landscape"`).
