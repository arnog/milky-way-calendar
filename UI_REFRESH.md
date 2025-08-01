# Milky Way Calendar – Redesign Guidelines

## 1. Color Palette

Use the following color scheme to maintain a consistent night-sky aesthetic.

| Name          | Hex Code  | Usage                                |
| ------------- | --------- | ------------------------------------ |
| **Primary**   | `#A3C4DC` | Main buttons, highlights             |
| **Accent**    | `#6EC6FF` | Emphasized links, hover effects      |
| **Highlight** | `#F5F5F5` | Body text, general content           |
| **Secondary** | `#273B4A` | Background panels, contrast sections |
| **Glow**      | `#B2E3FF` | Hover/focus glow effect              |

**Notes:**

- Background should be a deep night blue (`#0B0E16`).
- Use gradients sparingly (example: `#0B0E16 → #273B4A` for hero sections).
- Apply subtle shadow/glow to important UI elements.

---

## 2. Typography

### Fonts

- **Headlines:**
  [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), serif
- **Body:** [Inter](https://fonts.google.com/specimen/Inter), sans-serif
- **Data/Times:** [Orbitron](https://fonts.google.com/specimen/Orbitron),
  sans-serif

### Usage

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
  font-family: "Orbitron", sans-serif;
  letter-spacing: 0.03em;
}
```

**Weights & Sizes**

- Headlines: `Playfair Display`, **bold** or **semi-bold**, ≥ 28px
- Body: `Inter`, normal (400) or medium (500), 16–18px
- Data: `Orbitron`, medium or bold, slightly letter-spaced

**Best Practices**

- Use `Orbitron` **only for numeric/time data**, not for labels.
- Keep labels in `Inter` for clarity.
- Use `Accent` color for key data highlights.

---

## 3. Layout

- **Hero Section:** Full-width Milky Way background image, optionally with
  parallax scrolling.
- **Section Separation:** Use angled or wave-shaped dividers between sections.
- **Content Width:** Max 1200px, centered with adequate padding (`min 24px` on
  mobile).
- **Dark Mode First:** Light text on dark background, high contrast.
- **Cards:** Use **glassmorphism** for calendar items:
  ```css
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  ```

---

## 4. UI Elements

### Buttons

```css
.button-primary {
  background-color: #a3c4dc;
  color: #273b4a;
  padding: 12px 24px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}
.button-primary:hover {
  background-color: #6ec6ff;
  box-shadow: 0 0 8px #b2e3ff;
}
```

### Links

- Color: `Accent` (`#6EC6FF`)
- Underline on hover
- Optional glow for key calls-to-action

---

## 5. Data Presentation

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

---

## 6. Motion & Microinteractions

- Subtle scroll-based animations — e.g., stars fading in, constellations
  connecting, parallax layers.
- Hover effects that gently scale or glow elements.
- Loading animation: a rotating star map or a twinkling star cluster.

## 7. Responsive Design

- **Mobile:** Stack sections vertically, increase font size for data.
- **Tablet:** Maintain 2-column layouts where possible.
- **Desktop:** Use wider hero images and multi-column data grids.

---

## 8. Accessibility

- Minimum contrast ratio 4.5:1 for text.
- All interactive elements must have hover and focus states.
- Provide alt text for images (e.g., `"Milky Way over desert landscape"`).
