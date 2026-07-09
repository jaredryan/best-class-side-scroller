# Snack Attack Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-theme "Nest Invaders" into "Snack Attack" — a coherent flat-vector food-fight arcade game — across every screen and sprite, without changing gameplay mechanics.

**Architecture:** Pure presentation-layer rewrite on top of the existing React/CRA app. New hand-authored inline-SVG sprite components replace image-based sprites; a new pure scoring module replaces the two scoring functions in `GameContainer.js`; CSS is rewritten around a token system; copy is rewritten screen-by-screen. No changes to `Game.js`'s simulation loop, `Data/*.js` wave definitions, or collision math.

**Tech Stack:** React 19 (CRA/`react-scripts`), plain CSS (no CSS-in-JS), Jest (via `react-scripts test`) for the one pure-function unit test.

## Global Constraints

- Internal enemy type identifiers `ufo`, `girl`, `ironman` are never renamed (spec: `docs/superpowers/specs/2026-07-08-snack-attack-redesign-design.md`).
- No changes to movement, spawn timing, wave data, collision math, level count, or difficulty balance, except the scoring formula given below.
- No new screens, routes, or gameplay systems. Hero Toaster is a static visual gag only.
- No pixel art, no photoreal/realistic art. Flat vector/CSS shapes only.
- Do not delete old image assets (`space.jpg`, `original-space.jpg`, `birdSprite.png`, `enemyGirl.png`, `ironman.png`, `ufo.gif`, `ninjaStar.png`) until Task 16, and only after a grep confirms zero remaining references and the build succeeds.
- New SVG sprites must visually fill their existing containers (player ~50×35, ufo/soda ~50×29, ironman/hotdog ~34×50, girl/nacho ~35×50) — use `viewBox` + `preserveAspectRatio="xMidYMid meet"` tuned to each box's aspect ratio; do not change the numeric width/height values in `Data/*.js` or `Game.js`.
- Keep `Game.js` readable: sprite components live in `src/main/Components/Sprites/` and are imported, never inlined.
- This codebase has no existing component test suite. Verification for visual tasks is "the build succeeds + a manual/Playwright screenshot check", not new snapshot-testing infrastructure. The one exception is the scoring formula (pure function, genuinely worth a unit test).

---

## File Structure

**New files:**
- `src/main/scoring.js` — pure `calculateFinalScore(...)` function.
- `src/main/scoring.test.js` — Jest unit tests for it.
- `src/main/Components/Sprites/TinyChef.js` — player SVG.
- `src/main/Components/Sprites/SodaBottle.js` — `ufo` enemy SVG.
- `src/main/Components/Sprites/HotdogPile.js` — `ironman` enemy SVG.
- `src/main/Components/Sprites/NachoPlate.js` — `girl` enemy SVG.
- `src/main/Components/Sprites/HeroToaster.js` — gag sprite, used on Title + Kitchen Report only (not in `Game.js`).

**Modified files:**
- `public/index.html` — font links.
- `src/style.css` — tokens, full palette/typography rewrite, new component classes, removal of old spritesheet animation CSS.
- `src/main/App.js` — shared background chrome (replaces starfield photo).
- `src/main/Title.js` — copy, layout, Hero Toaster placement.
- `src/main/Instructions.js` — Kitchen Briefing controls copy/markup.
- `src/main/Levels.js` — difficulty labels/markup.
- `src/main/Game/Game.js` — render functions only (`renderPlayer`, `renderEnemies`, `renderEnemyBullets`, HUD JSX). Simulation loop untouched.
- `src/main/Game/GameContainer.js` — scoring wiring, Kitchen Report markup/copy.

**Deleted (Task 16 only):** the seven unused image files listed above.

---

## Task 1: Design tokens and typography

**Files:**
- Modify: `public/index.html`
- Modify: `src/style.css:1-30`

**Interfaces:**
- Produces: CSS custom properties (`--bg-deep`, `--bg-warm`, `--panel-cream`, `--panel-light`, `--ink`, `--ketchup`, `--mustard`, `--cheese`, `--pea`, `--soda-blue`, `--line`, `--shadow`, `--font-display`, `--font-body`) consumed by every later CSS task.

- [ ] **Step 1: Swap font links in `public/index.html`**

Replace this line:
```html
    <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900" rel="stylesheet">
```
with:
```html
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
```
Also update the theme-color meta tags (there are two — keep both, both should read the warm brown):
```html
    <meta name="theme-color" content="#24130f">
```
(both occurrences)

- [ ] **Step 2: Add token block + base rules at the top of `src/style.css`**

Replace lines 1-19 of `src/style.css` (the `*`, heading, and old `.canvas, .levelButtons, button, .instructions, .scoreResults` rules) with:

```css
:root {
    --bg-deep: #24130f;
    --bg-warm: #3a2118;
    --panel-cream: #fff1cf;
    --panel-light: #fff8e7;
    --ink: #321b14;

    --ketchup: #e5392d;
    --mustard: #f5b83b;
    --cheese: #ffc947;
    --pea: #5fbd45;
    --soda-blue: #38aeea;

    --line: rgba(50, 27, 20, 0.22);
    --shadow: rgba(36, 19, 15, 0.32);

    --font-display: "Luckiest Guy", cursive;
    --font-body: "Nunito Sans", system-ui, -apple-system, sans-serif;
}

* {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6 {
    text-align: center;
    margin: 0;
    font-family: var(--font-body);
}

h1, h2, h3, h4, h5, h6, p {
    color: var(--ink);
}

.card-sticker {
    background-color: var(--panel-cream);
    border: 3px solid var(--ink);
    border-radius: 18px;
    box-shadow: 0 6px 0 var(--shadow);
}

.btn-chunky {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: 20px;
    color: var(--panel-light);
    background-color: var(--ketchup);
    border: 3px solid var(--ink);
    border-radius: 14px;
    padding: 14px 36px;
    box-shadow: 0 5px 0 var(--ink);
    cursor: pointer;
    -webkit-transition: transform 120ms ease, box-shadow 120ms ease;
            transition: transform 120ms ease, box-shadow 120ms ease;
}

.btn-chunky:hover {
    background-color: #ef5445;
}

.btn-chunky:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 var(--ink);
}

.stamp {
    display: inline-block;
    font-family: var(--font-body);
    font-weight: 800;
    font-size: 13px;
    color: var(--ink);
    background-color: var(--cheese);
    border: 2px dashed var(--ink);
    border-radius: 999px;
    padding: 6px 14px;
    transform: rotate(-4deg);
}
```

- [ ] **Step 3: Update `body` background**

Find:
```css
body {
    background-color: black;
    margin: 0;
}
```
Replace with:
```css
body {
    background-color: var(--bg-deep);
    margin: 0;
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds (warnings about unused old classes are fine at this stage — later tasks remove them).

- [ ] **Step 5: Commit**

```bash
git add public/index.html src/style.css
git commit -m "Add Snack Attack design tokens and swap fonts to Luckiest Guy / Nunito Sans"
```

---

## Task 2: Pure scoring module + unit test

**Files:**
- Create: `src/main/scoring.js`
- Create: `src/main/scoring.test.js`

**Interfaces:**
- Produces: `calculateFinalScore({ playerHealth, shotsFired, successfulShotsFired, timer, level })` → `{ healthBonus, accuracyBonus, accuracyPercent, rushBonus, elapsedSeconds, spiceBonus, finalScore }`. Consumed by Task 3.

- [ ] **Step 1: Write the failing tests**

Create `src/main/scoring.test.js`:
```js
import { calculateFinalScore } from './scoring';

describe('calculateFinalScore', () => {
  it('awards full bonuses for a flawless, instant, max-level win', () => {
    const result = calculateFinalScore({
      playerHealth: 10,
      shotsFired: 10,
      successfulShotsFired: 10,
      timer: 0,
      level: 3,
    });
    expect(result.healthBonus).toBe(10000);
    expect(result.accuracyBonus).toBe(10000);
    expect(result.rushBonus).toBe(30000);
    expect(result.spiceBonus).toBe(60000);
    expect(result.finalScore).toBe(110000);
  });

  it('floors the rush bonus at zero after 60 seconds', () => {
    const result = calculateFinalScore({
      playerHealth: 0,
      shotsFired: 4,
      successfulShotsFired: 2,
      timer: 90000,
      level: 1,
    });
    expect(result.elapsedSeconds).toBe(90);
    expect(result.rushBonus).toBe(0);
  });

  it('does not divide by zero when no shots were fired', () => {
    const result = calculateFinalScore({
      playerHealth: 5,
      shotsFired: 0,
      successfulShotsFired: 0,
      timer: 1000,
      level: 2,
    });
    expect(result.accuracyPercent).toBe(0);
    expect(result.accuracyBonus).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx react-scripts test --watchAll=false src/main/scoring.test.js`
Expected: FAIL — `Cannot find module './scoring'`

- [ ] **Step 3: Implement `src/main/scoring.js`**

```js
export const calculateFinalScore = ({
  playerHealth,
  shotsFired,
  successfulShotsFired,
  timer,
  level,
}) => {
  const healthBonus = playerHealth * 1000;

  const accuracyPercent = shotsFired ? successfulShotsFired / shotsFired : 0;
  const accuracyBonus = Math.round(accuracyPercent * 10000);

  const elapsedSeconds = Math.floor(timer / 1000);
  const rushBonus = Math.max(0, 30000 - elapsedSeconds * 500);

  const spiceBonus = level * 20000;

  const finalScore = healthBonus + accuracyBonus + rushBonus + spiceBonus;

  return {
    healthBonus,
    accuracyBonus,
    accuracyPercent,
    rushBonus,
    elapsedSeconds,
    spiceBonus,
    finalScore,
  };
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx react-scripts test --watchAll=false src/main/scoring.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/main/scoring.js src/main/scoring.test.js
git commit -m "Add pure scoring module for Kitchen Report formula"
```

---

## Task 3: Wire scoring into GameContainer, hide live score

**Files:**
- Modify: `src/main/Game/GameContainer.js:93-115` (the two score functions)
- Modify: `src/main/Game/GameContainer.js:159` (the `currentScore` prop passed to `Game`)
- Modify: `src/main/Game/Game.js:862-863` (HUD JSX — score line removed here; health line restyled in Task 11)

**Interfaces:**
- Consumes: `calculateFinalScore` from `./../scoring` (Task 2).
- Produces: `GameContainer` no longer computes a live score; `Game` no longer receives or renders `currentScore`.

- [ ] **Step 1: Import scoring module in `GameContainer.js`**

Add near the top imports:
```js
import { calculateFinalScore } from '../scoring';
```

- [ ] **Step 2: Replace `calculateCurrentScore` / `calculateFinalScore` with one call site**

Delete the existing `calculateCurrentScore` and `calculateFinalScore` function definitions (lines 93-115). The loss branch doesn't display a score breakdown (per spec), so only the `hasWon` result branch (around line 178-196) needs it. Compute the report once there:

```js
const report = calculateFinalScore({
  playerHealth,
  shotsFired,
  successfulShotsFired,
  timer,
  level,
});
```

Place this `const report = ...` line at the top of the `else if (hasWon)` block, right before `displayComponent = (`. The `report` object's fields (`healthBonus`, `accuracyBonus`, `accuracyPercent`, `rushBonus`, `elapsedSeconds`, `spiceBonus`, `finalScore`) are consumed by Task 14's Kitchen Report markup.

- [ ] **Step 3: Stop passing `currentScore` to `Game`**

In the `isRunning` branch's `<Game ... />` props, delete this line:
```js
                        currentScore={calculateCurrentScore()}
```

- [ ] **Step 4: Remove the score HUD line in `Game.js`**

In `Game.js`, find:
```jsx
          <div className="gameHealth">HP: {playerHealthRef?.current}</div>
          <div className="gameScore">SCORE: {props.currentScore}</div>
```
Replace with:
```jsx
          <div className="gameHealth">HEALTH: {playerHealthRef?.current}</div>
```
(Full HUD restyle happens in Task 11 — this step only removes the live score and relabels HP → HEALTH per the spec's exact HUD copy.)

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds, no references to `calculateCurrentScore` or `props.currentScore` remain.

Run: `grep -rn "calculateCurrentScore\|currentScore" src/`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/main/Game/GameContainer.js src/main/Game/Game.js
git commit -m "Compute score once at round-end via scoring module; hide live score"
```

---

## Task 4: Tiny Chef sprite (player)

**Files:**
- Create: `src/main/Components/Sprites/TinyChef.js`

**Interfaces:**
- Produces: default-exported `TinyChef` component, no props, renders an `<svg>` sized to fill its parent (`width="100%" height="100%"`). Consumed by Task 10.

- [ ] **Step 1: Create the component**

```jsx
import React from 'react';

const TinyChef = () => (
  <svg
    viewBox="0 0 120 84"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="26" y="32" width="56" height="42" rx="16" fill="var(--panel-cream)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="44" y="50" width="22" height="16" rx="4" fill="var(--pea)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="82" cy="28" r="18" fill="#f2c49a" stroke="var(--ink)" strokeWidth="4" />
    <rect x="66" y="12" width="32" height="9" rx="4" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="72" cy="8" r="10" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="82" cy="4" r="12" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="93" cy="8" r="10" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M87 22 L98 18" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="91" cy="30" r="2.5" fill="var(--ink)" />
    <path d="M86 38 Q92 42 98 38" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="94" y="42" width="24" height="9" rx="4" fill="#c9c2b7" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="118" cy="46" r="4" fill="var(--ink)" />
  </svg>
);

export default TinyChef;
```

- [ ] **Step 2: Verify it renders**

This component has no standalone test (visual-only leaf component per Global Constraints). It will be visually verified once wired in Task 10. Confirm only that it's valid JS:

Run: `npx eslint src/main/Components/Sprites/TinyChef.js`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main/Components/Sprites/TinyChef.js
git commit -m "Add Tiny Chef SVG sprite"
```

---

## Task 5: Soda Bottle sprite (`ufo`)

**Files:**
- Create: `src/main/Components/Sprites/SodaBottle.js`

**Interfaces:**
- Produces: default-exported `SodaBottle` component, no props. Consumed by Task 10 wherever `enemy.type === 'ufo'`.

- [ ] **Step 1: Create the component**

Drawn lying on its side (wide/short box), cap toward the left (toward the player):

```jsx
import React from 'react';

const SodaBottle = () => (
  <svg
    viewBox="0 0 120 70"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="18" y="18" width="88" height="34" rx="14" fill="var(--soda-blue)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="2" y="26" width="20" height="18" rx="6" fill="#bfe9fb" stroke="var(--ink)" strokeWidth="4" />
    <rect x="40" y="24" width="34" height="22" rx="6" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="88" cy="12" r="5" fill="#ffffff" opacity="0.85" />
    <circle cx="98" cy="24" r="4" fill="#ffffff" opacity="0.7" />
    <circle cx="92" cy="58" r="4" fill="#ffffff" opacity="0.7" />
  </svg>
);

export default SodaBottle;
```

- [ ] **Step 2: Lint check**

Run: `npx eslint src/main/Components/Sprites/SodaBottle.js`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main/Components/Sprites/SodaBottle.js
git commit -m "Add Soda Bottle SVG sprite for ufo enemy type"
```

---

## Task 6: Hot Dog Pile sprite (`ironman`)

**Files:**
- Create: `src/main/Components/Sprites/HotdogPile.js`

**Interfaces:**
- Produces: default-exported `HotdogPile` component, no props. Consumed by Task 10 wherever `enemy.type === 'ironman'`.

- [ ] **Step 1: Create the component**

Drawn as two stacked hot dogs (narrow/tall box):

```jsx
import React from 'react';

const HotdogPile = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="6" y="12" width="58" height="22" rx="11" fill="#e8b579" stroke="var(--ink)" strokeWidth="4" />
    <rect x="12" y="16" width="46" height="14" rx="7" fill="var(--ketchup)" stroke="var(--ink)" strokeWidth="2" />
    <path d="M14 23 Q22 17 30 23 T46 23 T58 23" stroke="var(--mustard)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="6" y="58" width="58" height="22" rx="11" fill="#e8b579" stroke="var(--ink)" strokeWidth="4" />
    <rect x="12" y="62" width="46" height="14" rx="7" fill="#a9432f" stroke="var(--ink)" strokeWidth="2" />
    <path d="M14 69 Q22 63 30 69 T46 69 T58 69" stroke="var(--mustard)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="45" r="2.5" fill="var(--ink)" />
    <circle cx="50" cy="45" r="2.5" fill="var(--ink)" />
    <path d="M22 50 Q35 56 48 50" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export default HotdogPile;
```

- [ ] **Step 2: Lint check**

Run: `npx eslint src/main/Components/Sprites/HotdogPile.js`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main/Components/Sprites/HotdogPile.js
git commit -m "Add Hot Dog Pile SVG sprite for ironman enemy type"
```

---

## Task 7: Nacho Plate sprite (`girl`)

**Files:**
- Create: `src/main/Components/Sprites/NachoPlate.js`

**Interfaces:**
- Produces: default-exported `NachoPlate` component, no props. Consumed by Task 10 wherever `enemy.type === 'girl'`.

- [ ] **Step 1: Create the component**

Drawn as a leaning tower of triangular chips (narrow/tall box):

```jsx
import React from 'react';

const NachoPlate = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon points="35,4 62,34 8,34" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <polygon points="28,30 58,58 -2,58" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <polygon points="35,54 65,86 5,86" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <circle cx="30" cy="46" r="2.5" fill="#8a5a2b" />
    <circle cx="42" cy="50" r="2.5" fill="#8a5a2b" />
    <circle cx="35" cy="70" r="2.5" fill="#8a5a2b" />
    <circle cx="22" cy="20" r="2.5" fill="var(--ink)" />
    <circle cx="46" cy="20" r="2.5" fill="var(--ink)" />
    <path d="M24 26 Q34 32 44 26" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="35" cy="16" rx="6" ry="3" fill="var(--pea)" stroke="var(--ink)" strokeWidth="2" />
  </svg>
);

export default NachoPlate;
```

- [ ] **Step 2: Lint check**

Run: `npx eslint src/main/Components/Sprites/NachoPlate.js`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main/Components/Sprites/NachoPlate.js
git commit -m "Add Nacho Plate SVG sprite for girl enemy type"
```

---

## Task 8: Hero Toaster gag sprite

**Files:**
- Create: `src/main/Components/Sprites/HeroToaster.js`

**Interfaces:**
- Produces: default-exported `HeroToaster` component, no props, self-contained square-ish SVG. Consumed by Task 12 (Title) and Task 14 (Kitchen Report). Never imported into `Game.js`.

- [ ] **Step 1: Create the component**

```jsx
import React from 'react';

const HeroToaster = () => (
  <svg
    viewBox="0 0 90 90"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon points="45,18 68,50 45,42 22,50" fill="var(--ketchup)" stroke="var(--ink)" strokeWidth="3" />
    <rect x="14" y="30" width="62" height="42" rx="10" fill="#d7d0c4" stroke="var(--ink)" strokeWidth="4" />
    <rect x="24" y="20" width="14" height="16" rx="4" fill="var(--ink)" />
    <rect x="52" y="20" width="14" height="16" rx="4" fill="var(--ink)" />
    <circle cx="32" cy="56" r="3" fill="var(--ink)" />
    <circle cx="58" cy="56" r="3" fill="var(--ink)" />
    <path d="M34 64 Q45 70 56 64" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="40" y="72" width="10" height="8" rx="2" fill="var(--ink)" />
  </svg>
);

export default HeroToaster;
```

- [ ] **Step 2: Lint check**

Run: `npx eslint src/main/Components/Sprites/HeroToaster.js`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main/Components/Sprites/HeroToaster.js
git commit -m "Add Hero Toaster gag sprite"
```

---

## Task 9: Projectile visuals (CSS only)

**Files:**
- Modify: `src/style.css` (`.playerBullet`, `.enemyBullet.ufo`, `.enemyBullet.ironman`, `.enemyBullet.girl` rules, currently around lines 271-296)

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces: recolored/reshaped bullet classes. `.enemyBullet.ironman` gains two modifier classes, `.enemyBullet.ironman.ketchup` and `.enemyBullet.ironman.mustard`, consumed by Task 11's `Game.js` change.

- [ ] **Step 1: Replace the bullet rules**

Find and delete:
```css
.enemyBullet {
    position: absolute;
    -webkit-animation: none;
            animation: none;
    background-image: none;
    background-size: unset;
}

.enemyBullet.ufo {
    background-color: green;
    border-radius: 50px;

}

.enemyBullet.ironman {
    border-radius: 50px;
    /* transform: rotate(-28deg); */
    background-color: gold;
}

.enemyBullet.girl {
    border-radius: 50%;
    background-color: black;
    background-image: url("images/enemyGirl.png");
    background-size: 470%;
}
```
and
```css
.playerBullet {
    position: absolute;
    background-color: burlywood;
    border-radius: 50%;
}
```

Replace both blocks with:
```css
.enemyBullet {
    position: absolute;
}

.enemyBullet.ufo {
    background: linear-gradient(90deg, var(--soda-blue), #bfe9fb);
    border-radius: 50px;
    border: 2px solid var(--ink);
}

.enemyBullet.ironman {
    background-color: var(--mustard);
    border-radius: 6px;
    border: 2px solid var(--ink);
}

.enemyBullet.ironman.ketchup {
    background-color: var(--ketchup);
}

.enemyBullet.girl {
    background-color: var(--cheese);
    border: 2px solid var(--ink);
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.playerBullet {
    background-color: var(--pea);
    border: 2px solid var(--ink);
    border-radius: 50%;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "Restyle projectiles as peas, fizz bubbles, ketchup/mustard streaks, and nacho chips"
```

---

## Task 10: Wire character sprites into `Game.js`

**Files:**
- Modify: `src/main/Game/Game.js` (imports + `renderPlayer`, `renderEnemies`)

**Interfaces:**
- Consumes: `TinyChef`, `SodaBottle`, `HotdogPile`, `NachoPlate` (Tasks 4-7).
- Produces: `.player` and `.enemy.<type>` divs now render the matching sprite component as a child instead of relying on `background-image`.

- [ ] **Step 1: Import the sprite components**

At the top of `Game.js`, add:
```js
import TinyChef from '../Components/Sprites/TinyChef';
import SodaBottle from '../Components/Sprites/SodaBottle';
import HotdogPile from '../Components/Sprites/HotdogPile';
import NachoPlate from '../Components/Sprites/NachoPlate';
```

- [ ] **Step 2: Render Tiny Chef inside the player container**

In `renderPlayer`, find:
```jsx
        <div className="player" />
```
Replace with:
```jsx
        <div className="player">
          <TinyChef />
        </div>
```

- [ ] **Step 3: Render the matching enemy sprite by type**

In `renderEnemies`, find:
```jsx
          <div className={`enemy ${enemy.type}`} />
```
Replace with:
```jsx
          <div className={`enemy ${enemy.type}`}>
            {enemy.type === 'ufo' && <SodaBottle />}
            {enemy.type === 'ironman' && <HotdogPile />}
            {enemy.type === 'girl' && <NachoPlate />}
          </div>
```

- [ ] **Step 4: Remove the now-dead spritesheet CSS**

In `src/style.css`, delete the `.ufo`, `.enemy.ufo`, `@keyframes ufoMove` (both prefixed and unprefixed), `.girl`, `.enemy.girl`, `@keyframes girlMove` (both), `.ironman`, `.enemy.ironman`, `@keyframes ironMove` (both), and `.player { background-image: ...; animation: myMove ...; }` rules (roughly lines 121-236 of the original file). Keep `.enemyAnimationContainer, .enemy { width:100%; height:100%; }`, `.playerAnimationContainer, .player { width:100%; height:100%; }`, and the `.healthbar`/`.health` rules — those are layout, not art.

Replace the now-empty spots with just enough to size the new SVGs, since `TinyChef`/`SodaBottle`/etc. already declare `width="100%" height="100%"` on their own `<svg>`:
```css
.player,
.enemy {
    width: 100%;
    height: 100%;
    display: block;
}
```

- [ ] **Step 5: Verify build and run a manual smoke test**

Run: `npm run build`
Expected: succeeds.

Run: `npm start`, open the app, click through to a game (any difficulty), and confirm all four character types render as flat-vector shapes (no broken image icons, no leftover spritesheet artifacts). Take a screenshot for the record.

- [ ] **Step 6: Commit**

```bash
git add src/main/Game/Game.js src/style.css
git commit -m "Render Tiny Chef and food-enemy SVG sprites in place of image spritesheets"
```

---

## Task 11: Game screen chrome — HUD, bullet color alternation, explosion retint, canvas frame

**Files:**
- Modify: `src/main/Game/Game.js` (`renderEnemyBullets`, HUD JSX)
- Modify: `src/style.css` (`.gameHealth`, `.gameDiv`, `.canvas`, `.explosion::before/::after`)

**Interfaces:**
- Consumes: `.enemyBullet.ironman.ketchup` / `.mustard` classes from Task 9.
- Produces: no new interfaces — this is the last visual-only task touching `Game.js`.

- [ ] **Step 1: Alternate ketchup/mustard on hot-dog-pile bullets**

In `renderEnemyBullets`, find:
```jsx
          className={`enemyBullet ${bullet.type}`}
```
Replace with:
```jsx
          className={`enemyBullet ${bullet.type}${
            bullet.type === 'ironman' ? (bullet.id % 2 === 0 ? ' ketchup' : ' mustard') : ''
          }`}
```

- [ ] **Step 2: Restyle the HUD**

Find:
```css
.gameScore,
.gameHealth {
    position: absolute;
    margin: 0;
    padding: 0;
    color: white;
    width: 160px;
    display: inline-block;
    top: 0;
    margin: auto;
    text-align: center;
}

.gameScore {
    left: 160px;
}

.gameHealth {
    left: 0px;
}
```
Replace with:
```css
.gameHealth {
    position: absolute;
    top: 8px;
    left: 8px;
    margin: 0;
    padding: 4px 12px;
    color: var(--panel-light);
    font-weight: 800;
    font-size: 15px;
    background-color: var(--bg-warm);
    border: 2px solid var(--ink);
    border-radius: 8px;
}
```

- [ ] **Step 3: Reskin the surrounding game page and canvas frame**

Find:
```css
.gameDiv {
    ...
    background: url("./images/space.jpg") no-repeat center center;
    background-size: cover;
    height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
}
```
Replace the `background` declaration with:
```css
    background: radial-gradient(circle at 50% 0%, var(--bg-warm), var(--bg-deep) 70%);
```
(leave `background-size`, `height`, `width` as-is; delete the now-redundant `background-size: cover;` line since the gradient doesn't need it).

Find:
```css
.canvas, .levelButtons, button, .instructions, .scoreResults {
    border-radius: 10px;
    box-shadow: 0 1px 10px -5px white;
}
```
(this rule was already removed/replaced in Task 1 — if any part of it still targets `.canvas`, add instead):
```css
.canvas {
    border-radius: 10px;
    border: 4px solid var(--ink);
    box-shadow: 0 6px 0 var(--shadow);
}
```

- [ ] **Step 4: Retint the explosion burst**

Find:
```css
.explosion::before,
.explosion::after {
  ...
  background-color: rgba(255, 255, 255, 1); /* Adjust color and opacity */
  ...
}
```
Replace the `background-color` line with:
```css
  background-color: rgba(255, 201, 71, 0.9); /* cheese-colored food splat */
```

- [ ] **Step 5: Verify build and smoke test**

Run: `npm run build`
Expected: succeeds.

Run: `npm start`, play a round, confirm: HUD shows only `HEALTH: 10` (no score), hot-dog-pile bullets alternate red/yellow, defeating an enemy shows a warm-colored burst instead of white, and the canvas frame reads as a warm "order window" instead of a glowing white-on-black box.

- [ ] **Step 6: Commit**

```bash
git add src/main/Game/Game.js src/style.css
git commit -m "Reskin game HUD, canvas frame, and explosion effect to Snack Attack palette"
```

---

## Task 12: Title screen + shared site background

**Files:**
- Modify: `src/main/App.js`
- Modify: `src/main/Title.js`
- Modify: `src/style.css` (`.titleImage`, `.overlay`, `.titlePage`, `.titleText`, new `.heroToasterCorner`)

**Interfaces:**
- Consumes: `HeroToaster` (Task 8).
- Produces: shared warm-gradient background used by Title, Kitchen Briefing (Task 13), and Kitchen Report (Task 14) — those tasks add cards on top of this, they don't redefine the page background.

- [ ] **Step 1: Replace the photo background in `App.js`**

`App.js` currently renders:
```jsx
      <div className="overlay">
        <div className="titleImage" />
      </div>
```
Leave this structure in place (it's the shared background layer for every non-fullscreen-game screen) — only the CSS backing it changes, in Step 3 below. No JSX change needed in `App.js` for this task.

- [ ] **Step 2: Rewrite `Title.js` copy and structure**

Replace the full contents of `src/main/Title.js`:
```jsx
import React from 'react';
import HeroToaster from './Components/Sprites/HeroToaster';

const Title = (props) => {
    return (
        <div className="titleText">
            <div className="heroToasterCorner">
                <HeroToaster />
            </div>
            <h1 className="displayTitle">SNACK ATTACK</h1>
            <h2>
                The kitchen has gone rogue. The snacks have feelings now — and most
                of those feelings are violent.
            </h2>
            <h2 className="titleSubline">
                Enter: a tiny chef, a pea shooter, and one very questionable lunch rush.
            </h2>
            <div className="titleDescription">
                <button onClick={props.setPageAsGame} className="btn-chunky start">
                    START FOOD FIGHT
                </button>
            </div>
        </div>
    );
}

export default Title;
```

- [ ] **Step 3: Rewrite the background and title typography CSS**

Find:
```css
.titleImage {
    background: url("./images/space.jpg") no-repeat center center;
    background-size: cover;
    opacity: 0.6;
    z-index: 3;
}
```
Replace with:
```css
.titleImage {
    background:
        radial-gradient(circle at 20% 15%, rgba(255, 201, 71, 0.25), transparent 40%),
        radial-gradient(circle at 80% 85%, rgba(94, 189, 69, 0.18), transparent 45%),
        linear-gradient(160deg, var(--bg-warm), var(--bg-deep) 65%);
    z-index: 3;
}
```

Find:
```css
.overlay {
    background-color: black;
    z-index: -1;
}
```
Replace with:
```css
.overlay {
    background-color: var(--bg-deep);
    z-index: -1;
}
```

Find:
```css
.titleText h1 {
    font-size: 70px;
    font-weight: 300;
    text-shadow: 0px 6px 8px black;
    line-height: 90px;
    margin: 0 0 50px 0;
}
```
Replace with:
```css
.titleText .displayTitle {
    font-family: var(--font-display);
    font-weight: normal;
    font-size: 76px;
    letter-spacing: 2px;
    color: var(--cheese);
    -webkit-text-stroke: 2px var(--ink);
    text-shadow: 0 6px 0 var(--ink);
    line-height: 1;
    margin: 0 0 32px 0;
}
```

Find:
```css
.titleText h2 {
    font-size: 30px;
    font-weight: 500;
    text-shadow: 0px 3px 4px black;
    margin: 0;
}
```
Replace with:
```css
.titleText h2 {
    font-size: 24px;
    font-weight: 700;
    color: var(--panel-light);
    text-shadow: 0 2px 3px rgba(0,0,0,0.5);
    margin: 0 0 12px 0;
    max-width: 640px;
}

.titleText .titleSubline {
    font-weight: 600;
    font-size: 19px;
    opacity: 0.9;
}
```

Add a new rule for the Hero Toaster corner placement:
```css
.heroToasterCorner {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 64px;
    height: 64px;
    transform: rotate(-6deg);
}

@media (max-width: 555px) {
    .heroToasterCorner {
        width: 44px;
        height: 44px;
        top: 10px;
        right: 10px;
    }
}
```

`.titleText` needs `position: relative` for the corner to anchor correctly — find:
```css
.titleText {
    color: white;
    padding: 50px;
    max-width: 1200px;
}
```
Replace with:
```css
.titleText {
    position: relative;
    color: var(--panel-light);
    padding: 50px;
    max-width: 1200px;
}
```

- [ ] **Step 4: Update the button hover/base rules used by `.start`**

Find:
```css
.titleText button {
    background-color: green;
    margin: 48px 0 0 0;
}

.titleText button:hover {
    cursor: pointer;
    background-color: rgb(91, 215, 91);
    -webkit-transition-duration: 300ms;
            transition-duration: 300ms;
}
```
Delete both rules — `.btn-chunky` (Task 1) already covers color/hover/press states. Keep only spacing:
```css
.titleText .btn-chunky {
    margin: 48px 0 0 0;
}
```

- [ ] **Step 5: Verify visually**

Run: `npm start`, open the title screen, confirm: warm gradient background (no starfield), "SNACK ATTACK" in the display font with a cheese-yellow fill and ink outline, hero copy readable, Hero Toaster visible but clearly secondary in the top-right corner, `START FOOD FIGHT` button uses the chunky button style. Screenshot at both desktop (1440×900) and mobile (390×844) widths.

- [ ] **Step 6: Commit**

```bash
git add src/main/App.js src/main/Title.js src/style.css
git commit -m "Reskin title screen: Snack Attack copy, warm gradient background, Hero Toaster corner gag"
```

---

## Task 13: Kitchen Briefing (controls + difficulty)

**Files:**
- Modify: `src/main/Instructions.js`
- Modify: `src/main/Levels.js`
- Modify: `src/style.css` (`.instructions*`, `.controlContainer`, `.difficultyContainer`, `.levelBox`, `.levelButtons`)

**Interfaces:**
- Consumes: `.card-sticker`, `.btn-chunky` (Task 1).
- Produces: no props/interfaces consumed elsewhere — leaf presentational rewrite. `Levels.js` keeps its existing `props.setLevel`/`props.level` contract unchanged (`GameContainer.js` is not touched by this task).

- [ ] **Step 1: Rewrite `Instructions.js` copy**

Replace the full contents of `src/main/Instructions.js`:
```jsx
import React from 'react';

const Instructions = () => {
    return (
        <div className="instructions card-sticker">
            <div className="instructionsText">
                <h4 className="instructionHeading">Kitchen Briefing</h4>
                <p className="instructionBody standalone">
                    You're the Tiny Chef. Fire peas at the snacks storming in from the right.
                </p>
                <div className="controlContainer">
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Move</b></p>
                        <p className="instructionBody">Mouse / touch left side</p>
                    </div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Fire</b></p>
                        <p className="instructionBody">Space / click / touch right side</p>
                    </div>
                    <div className="instructionControl">
                        <p className="instructionBody"><b>Combo zone</b></p>
                        <p className="instructionBody">Middle area moves and fires</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Instructions
```

- [ ] **Step 2: Rewrite `Levels.js` with chunky, labeled difficulty cards**

Replace the full contents of `src/main/Levels.js`:
```jsx
import React from 'react';

const difficulties = [
    { level: 1, label: 'Mild', blurb: 'A warm-up food fight.' },
    { level: 2, label: 'Spicy', blurb: 'More snacks. More splatter.' },
    { level: 3, label: 'Extra Crispy', blurb: 'Full kitchen chaos.' },
];

const Levels = (props) => {
    return (
        <div className="levelButtons card-sticker">
            <div className="difficultyContainer">
                <div className="difficulty">Select Difficulty</div>
                <div className="buttons">
                    {difficulties.map(({ level, label, blurb }) => (
                        <div
                            key={level}
                            onClick={() => props.setLevel(level)}
                            className={`levelBox${props.level === level ? ' highlighted' : ''}`}
                        >
                            <div className="levelNumber">{level}</div>
                            <div className="levelLabel">{label}</div>
                            <div className="levelBlurb">{blurb}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Levels
```

- [ ] **Step 3: Restyle the instructions card**

Find:
```css
.instructions, .scoreResults {
    background-color: black;
    color: white;
    padding: 20px;
}
```
Replace with:
```css
.instructions {
    padding: 20px;
}
```
(`.scoreResults` gets its own rule in Task 14.)

Find:
```css
.instructionHeading {
    font-size: 20px;
    font-weight: 600;
    color: limegreen;
}
```
Replace with:
```css
.instructionHeading {
    font-size: 22px;
    font-weight: 800;
    color: var(--ketchup);
}
```

Find:
```css
.controlContainer {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;
}
```
Keep as-is, but update `.instructionControl` (used per-row now, 3 rows instead of 2 nested-columns):
```css
.instructionControl {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--line);
}

.instructionControl:last-child {
    border-bottom: none;
    padding-bottom: 0;
}
```

Remove the now-unused `.instructionsText h5`, `.instructionControl .instructionBody:first-of-type/:last-of-type`, and `.instructionBody.standalone b` rules (they targeted the old two-column keyboard/touch layout that no longer exists).

- [ ] **Step 4: Restyle the difficulty cards**

Find:
```css
.difficultyContainer {
    width: 204px;
    height: 136px;
    text-align: center;
    font-size: 22px;
    font-weight: 500;
    margin: auto;
}

.difficulty {
    font-size: 22px;
    height: 68px;
    padding-top: 19px;
    color: limegreen;
    background-color: black;
}

.levelBox {
    width: 68px;
    height: 68px;
    text-align: center;
    display: inline-block;
    padding-bottom: 0px;
    padding-top: 2px;
    background-color: rgb(60, 60, 60);
    -webkit-transition-duration: 300ms;
            transition-duration: 300ms;
}

.levelBox:hover {
    background-color: rgb(90, 90, 90);
}

.levelBox.highlighted {
    background-color: limegreen;
}

.levelBox.highlighted:hover {
    background-color: rgb(91, 215, 91);
}

.level {
    color: white;
    font-size: 30px;
    padding-top: 10px;
    padding-bottom: 4px;
    font-weight: 500;
}
```
Replace the whole block with:
```css
.difficultyContainer {
    width: 100%;
    max-width: 340px;
    text-align: center;
    margin: auto;
}

.difficulty {
    font-size: 20px;
    font-weight: 800;
    color: var(--ketchup);
    margin-bottom: 12px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.levelBox {
    padding: 12px 16px;
    border: 3px solid var(--ink);
    border-radius: 14px;
    background-color: var(--panel-light);
    box-shadow: 0 4px 0 var(--shadow);
    cursor: pointer;
    text-align: left;
    -webkit-transition: transform 120ms ease, background-color 200ms ease;
            transition: transform 120ms ease, background-color 200ms ease;
}

.levelBox:hover {
    transform: translateY(-2px);
}

.levelBox.highlighted {
    background-color: var(--cheese);
}

.levelNumber {
    font-family: var(--font-display);
    font-size: 14px;
    color: var(--ink);
    opacity: 0.55;
}

.levelLabel {
    font-size: 19px;
    font-weight: 800;
    color: var(--ink);
}

.levelBlurb {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    opacity: 0.8;
}
```

Also delete the two now-obsolete rules that referenced the old first/last-child border:
```css
.buttons > * {
    background-color: black;
    color: white;
}

.buttons > div:first-of-type {
    border-right: 1px solid white;
}

.buttons > div:last-of-type {
    border-left: 1px solid white;
}

.buttons:hover {
    cursor: pointer;
}

.buttons {
    padding-bottom: 0px !important;
}
```
(the `.buttons` selector is redefined fresh above as a flex column).

- [ ] **Step 5: Rename the CTA on the pre-game screen**

In `src/main/Game/GameContainer.js`, find:
```jsx
                <button onClick={startGame} className="start">START GAME</button>
```
Replace with:
```jsx
                <button onClick={startGame} className="btn-chunky start">ENTER THE KITCHEN</button>
```

- [ ] **Step 6: Make `.instructionsContainer` two-column on desktop, stacked on mobile**

The current rule is always a column (stacked), regardless of viewport. Find:
```css
.instructionsContainer {
    width: 100%;
    max-width: 550px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 50px;
}
```
Replace with:
```css
.instructionsContainer {
    width: 100%;
    max-width: 720px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    gap: 24px;
}

.instructionsContainer > .instructions,
.instructionsContainer > .levelButtons {
    flex: 1 1 0;
    min-width: 0;
}

@media (max-width: 555px) {
    .instructionsContainer {
        flex-direction: column;
        align-items: center;
        max-width: 400px;
    }
}
```
The DOM order in `GameContainer.js` is already `<Instructions />` then `<Levels />`, so this automatically gives controls-first/difficulty-second on mobile (stacked column) and controls-left/difficulty-right on desktop (row) with no JSX changes.

- [ ] **Step 7: Verify visually**

Run: `npm start`, click through to the Kitchen Briefing screen at 1440px width and confirm the controls card and difficulty card sit side-by-side. Resize to 390px and confirm it stacks controls-first, difficulty-second, CTA last. Screenshot both.

- [ ] **Step 8: Commit**

```bash
git add src/main/Instructions.js src/main/Levels.js src/main/Game/GameContainer.js src/style.css
git commit -m "Reskin Kitchen Briefing: ticket-style controls card and chunky Mild/Spicy/Extra Crispy difficulty cards"
```

---

## Task 14: Kitchen Report (result screen)

**Files:**
- Modify: `src/main/Game/GameContainer.js` (win/loss `displayComponent` branches)
- Modify: `src/style.css` (`.scoreResults`, `.gameResults`, `.explainScore`, `.finalScore`, `.emphasis`)

**Interfaces:**
- Consumes: `report` object from Task 3 (`healthBonus`, `accuracyBonus`, `accuracyPercent`, `rushBonus`, `elapsedSeconds`, `spiceBonus`, `finalScore`), `playerHealth`, `HeroToaster` (Task 8).

- [ ] **Step 1: Rewrite the win branch**

Find the `else if (hasWon)` block and replace its contents with (keeping the `const report = calculateFinalScore(...)` line added in Task 3 directly above `displayComponent = (`):

```jsx
        displayComponent = (
            <div className="gameResults">
                <h1>Kitchen Saved!</h1>
                <div className="scoreResults card-sticker">
                    <h2 className="emphasis">Kitchen Report</h2>
                    <div className="explainScore">
                        <h3><b>Health Bonus:</b>{`${playerHealth} HP × 1000 = ${report.healthBonus}`}</h3>
                        <h3><b>Snack Accuracy:</b>{`${Math.round(report.accuracyPercent * 100)}% = ${report.accuracyBonus}`}</h3>
                        <h3><b>Rush Bonus:</b>{`${report.elapsedSeconds}s = ${report.rushBonus}`}</h3>
                        <h3><b>Spice Bonus:</b>{`Level ${level} = ${report.spiceBonus}`}</h3>
                    </div>
                    <h2 className="emphasis"><b>Final Tip</b></h2>
                    <h3 className="finalScore">{report.finalScore}</h3>
                    <div className="heroToasterStamp">
                        <div className="stamp">Approved by Hero Toaster</div>
                    </div>
                </div>
                <Levels setLevel={setLevel} level={level} />
                <button onClick={restartGame} className="btn-chunky start">PLAY AGAIN</button>
            </div>
        )
```

- [ ] **Step 2: Rewrite the loss branch**

Find the `else if (!hasWon)` block and replace its contents with:

```jsx
        displayComponent = (
            <div className="gameResults">
                <h1>Kitchen Overrun!</h1>
                <p className="loseCopy">
                    The snacks are getting cocky. Grab another handful of peas and show
                    them who's head chef.
                </p>
                <Levels setLevel={setLevel} level={level} />
                <button onClick={restartGame} className="btn-chunky start">TRY AGAIN</button>
            </div>
        )
```

- [ ] **Step 3: Restyle the result card**

Find:
```css
.gameResults h1 {
    font-size: 40px;
    font-weight: 600;
}

.gameResults h2 {
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 10px;
    margin-top: 0;
}
```
Replace with:
```css
.gameResults h1 {
    font-family: var(--font-display);
    font-size: 44px;
    color: var(--cheese);
    -webkit-text-stroke: 1.5px var(--ink);
    text-shadow: 0 4px 0 var(--ink);
}

.gameResults h2 {
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 10px;
    margin-top: 0;
}

.loseCopy {
    max-width: 420px;
    text-align: center;
    color: var(--panel-light);
    font-weight: 600;
    font-size: 16px;
}
```

Find:
```css
.instructions, .scoreResults {
    background-color: black;
    color: white;
    padding: 20px;
}
```
(already narrowed to just `.instructions` in Task 13 — now add the `.scoreResults` rule back on its own):
```css
.scoreResults {
    padding: 24px;
    position: relative;
    width: 100%;
    max-width: 420px;
}
```

Find:
```css
.emphasis {
    color: limegreen;
}
```
Replace with:
```css
.emphasis {
    color: var(--ketchup);
}
```

Find:
```css
.explainScore {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
}
```
Keep as-is (layout-only, still correct).

Find:
```css
.scoreResults b {
    font-weight: 600;
    margin-right: 10px;
}
```
Keep as-is.

Add a new rule for the stamp placement:
```css
.heroToasterStamp {
    display: flex;
    justify-content: center;
    margin-top: 18px;
}
```

- [ ] **Step 4: Verify visually**

Since winning/losing requires playing the game out, use the browser devtools console during a `npm start` session to force the state for a quick visual check: play until either outcome occurs naturally (fastest path: pick "Mild", let the round run out your health by not moving, or clear all waves to win), and screenshot both the win and loss Kitchen Report screens. Confirm: score rows show correct labels/values, Hero Toaster stamp appears only on the win screen, loss copy matches exactly, no leftover black/limegreen styling.

- [ ] **Step 5: Commit**

```bash
git add src/main/Game/GameContainer.js src/style.css
git commit -m "Reskin result screen as Kitchen Report with score breakdown and Hero Toaster stamp"
```

---

## Task 15: Full visual QA pass

**Files:** none (verification-only task; fixes go wherever the QA finds issues)

- [ ] **Step 1: Build check**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 2: Grep for leftover old-theme references**

Run: `grep -rn "limegreen\|Poppins" src/`
Expected: no output (both fully replaced by tokens/Nunito Sans).

- [ ] **Step 3: Screenshot all four screens at desktop (1440×900) and mobile (390×844)**

Using `npm start` + a browser (or Playwright), capture: Title, Kitchen Briefing, an in-progress Game screen, and a Kitchen Report (win). Compare each against the spec's screen list (`docs/superpowers/specs/2026-07-08-snack-attack-redesign-design.md`) and confirm: consistent flat-vector art style across all sprites, no mismatched visual styles, palette matches tokens throughout, Hero Toaster present but secondary on Title and Kitchen Report, HUD shows health only.

- [ ] **Step 4: Gameplay regression check**

Play one full round on "Mild": confirm movement, shooting, enemy spawn timing/waves, and collisions feel identical to before the redesign (only the visuals changed). Confirm the three enemy types still move/shoot exactly as before (soda bottles shoot straight, hot dogs shoot diagonally down-left with alternating ketchup/mustard color, nachos shoot diagonally up-left as triangular chips).

- [ ] **Step 5: Fix any issues found**

Address them in the relevant file from Tasks 1-14 (no new task needed — this step exists to close out anything the smoke tests in earlier tasks missed).

---

## Task 16: Delete unused legacy image assets

**Files:**
- Delete: `src/images/space.jpg`
- Delete: `src/images/original-space.jpg`
- Delete: `src/images/birdSprite.png`
- Delete: `src/images/enemyGirl.png`
- Delete: `src/images/ironman.png`
- Delete: `src/images/ufo.gif`
- Delete: `src/images/ninjaStar.png`

- [ ] **Step 1: Confirm zero remaining references**

Run: `grep -rn "space.jpg\|original-space\|birdSprite\|enemyGirl\|ironman.png\|ufo.gif\|ninjaStar" src/`
Expected: no output. If anything shows up, fix that reference first (it means an earlier task missed a spot) and re-run this grep before proceeding.

- [ ] **Step 2: Confirm the build still succeeds without them**

Run: `git rm src/images/space.jpg src/images/original-space.jpg src/images/birdSprite.png src/images/enemyGirl.png src/images/ironman.png src/images/ufo.gif src/images/ninjaStar.png`
Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Final full smoke test**

Run: `npm start`, click through all four screens once more, play a full round. Confirm nothing broke from the deletion (a missed reference would show as a broken image icon or a build failure — both already ruled out by Steps 1-2, this is a final human-eyes pass).

- [ ] **Step 4: Commit**

```bash
git commit -m "Remove unused Nest Invaders legacy image assets"
```
