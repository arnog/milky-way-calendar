# UI Design System

## Color Palette

- Use as much as possible the following colors:

```css
:root {
  --red-25: #fff8f7;
  --red-50: #fff1ef;
  --red-100: #ffeae6;
  --red-200: #ffcac1;
  --red-300: #ffa495;
  --red-400: #ff7865;
  --red-500: #f21c0d;
  --red-600: #e50018;
  --red-700: #d30024;
  --red-800: #bd002c;
  --red-900: #a1002f;
  --orange-25: #fffbf8;
  --orange-50: #fff7f1;
  --orange-100: #fff3ea;
  --orange-200: #ffe1c9;
  --orange-300: #ffcca2;
  --orange-400: #ffb677;
  --orange-500: #fe9310;
  --orange-600: #f58700;
  --orange-700: #ea7c00;
  --orange-800: #dc6d00;
  --orange-900: #ca5b00;
  --brown-25: #fff8ef;
  --brown-50: #fff1df;
  --brown-100: #ffe9ce;
  --brown-200: #ebcca6;
  --brown-300: #cdaf8a;
  --brown-400: #af936f;
  --brown-500: #856a47;
  --brown-600: #7f5e34;
  --brown-700: #78511f;
  --brown-800: #6e4200;
  --brown-900: #593200;
  --yellow-25: #fffdf9;
  --yellow-50: #fffcf2;
  --yellow-100: #fffaec;
  --yellow-200: #fff2ce;
  --yellow-300: #ffe8ab;
  --yellow-400: #ffdf85;
  --yellow-500: #ffcf33;
  --yellow-600: #f1c000;
  --yellow-700: #dfb200;
  --yellow-800: #c9a000;
  --yellow-900: #ad8a00;
  --lime-25: #f4ffee;
  --lime-50: #e9ffdd;
  --lime-100: #ddffca;
  --lime-200: #a8fb6f;
  --lime-300: #94e659;
  --lime-400: #80d142;
  --lime-500: #63b215;
  --lime-600: #45a000;
  --lime-700: #268e00;
  --lime-800: #007417;
  --lime-900: #005321;
  --green-25: #f5fff5;
  --green-50: #ebffea;
  --green-100: #e0ffdf;
  --green-200: #a7ffa7;
  --green-300: #5afa65;
  --green-400: #45e953;
  --green-500: #17cf36;
  --green-600: #00b944;
  --green-700: #00a34a;
  --green-800: #008749;
  --green-900: #00653e;
  --teal-25: #f3ffff;
  --teal-50: #e6fffe;
  --teal-100: #d9fffe;
  --teal-200: #8dfffe;
  --teal-300: #57f4f4;
  --teal-400: #43e5e5;
  --teal-500: #17cfcf;
  --teal-600: #00c2c0;
  --teal-700: #00b5b1;
  --teal-800: #00a49e;
  --teal-900: #009087;
  --cyan-25: #f7fcff;
  --cyan-50: #eff8ff;
  --cyan-100: #e7f5ff;
  --cyan-200: #c2e6ff;
  --cyan-300: #95d5ff;
  --cyan-400: #61c4ff;
  --cyan-500: #13a7ec;
  --cyan-600: #069eda;
  --cyan-700: #0095c9;
  --cyan-800: #0088b2;
  --cyan-900: #0a7897;
  --blue-25: #f7faff;
  --blue-50: #eef5ff;
  --blue-100: #e5f1ff;
  --blue-200: #bfdbff;
  --blue-300: #92c2ff;
  --blue-400: #63a8ff;
  --blue-500: #0d80f2;
  --blue-600: #0077db;
  --blue-700: #006dc4;
  --blue-800: #0060a7;
  --blue-900: #094668;
  --indigo-25: #f8f7ff;
  --indigo-50: #f1efff;
  --indigo-100: #eae7ff;
  --indigo-200: #ccc3ff;
  --indigo-300: #ac99ff;
  --indigo-400: #916aff;
  --indigo-500: #63c;
  --indigo-600: #5a21b2;
  --indigo-700: #4e0b99;
  --indigo-800: #3b0071;
  --indigo-900: #220040;
  --purple-25: #fbf7ff;
  --purple-50: #f8f0ff;
  --purple-100: #f4e8ff;
  --purple-200: #e4c4ff;
  --purple-300: #d49aff;
  --purple-400: #c36aff;
  --purple-500: #a219e6;
  --purple-600: #9000c4;
  --purple-700: #7c009f;
  --purple-800: #600073;
  --purple-900: #3d0043;
  --magenta-25: #fff8fb;
  --magenta-50: #fff2f6;
  --magenta-100: #ffebf2;
  --magenta-200: #ffcddf;
  --magenta-300: #ffa8cb;
  --magenta-400: #ff7fb7;
  --magenta-500: #eb4799;
  --magenta-600: #da3689;
  --magenta-700: #c82179;
  --magenta-800: #b00065;
  --magenta-900: #8a004c;

  --neutral-1000: black;
  --neutral-900: #302e33;
  --neutral-800: #3b3a3f;
  --neutral-700: hsl(255, 3%, 30%);
  --neutral-600: #5d5c60;
  --neutral-500: #818384;
  --neutral-400: hsl(240, 6%, 72%);
  --neutral-300: hsl(240, 12%, 85%);
  --neutral-200: hsl(225, 18%, 92%);
  --neutral-100: hsl(225, 18%, 94%);
  --neutral-75: hsl(225, 25%, 96%);
  --neutral-50: hsl(225, 25%, 98%);
  --neutral-25: hsl(225, 25%, 100%);
  --neutral-0: white;

  /* For informational messages */
  --semantic-blue: var(--blue-700);
  --semantic-bg-blue: var(--blue-25);

  /* For error conditions */
  --semantic-red: var(--red-400);
  --semantic-bg-red: var(--red-25);

  /* For warnings or alerts */
  --semantic-orange: var(--orange-400);
  --semantic-bg-orange: var(--orange-25);

  /* For success messages */
  --semantic-green: var(--green-700);
  --semantic-bg-green: var(--green-25);
}
```

- **CSS Variable Color System**: Centralized color palette management:
  - `--primary` (`--blue-200`): Main buttons, highlights, navigation
  - `--accent` (`--blue-300`): Links, time displays, hover effects
  - `--highlight` (`--neutral-75`): Body text, general content
  - `--secondary` (`--neutral-800`): Background panels, popovers
  - `--glow` (`--blue-100`): Hover/focus glow effects
  - `--background` (`--blue-900`): Deep night blue base

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
- **Button Styles**: Primary buttons with hover glow effect using `--glow` color
- **Dark/Field Mode**: Red color scheme (`--red-500`) for astronomy field use

### Links

- Color: `Accent` (`--blue-300`)
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
  color: var(--neutral-25);
}
.data-time {
  font-family: "Orbitron", sans-serif;
  color: var(--blue-300);
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
