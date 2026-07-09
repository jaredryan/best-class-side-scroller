# Snack Attack: Re-theme & Presentation Redesign

Date: 2026-07-08
Branch: `standaloneGame`
Status: Approved by user, proceeding to implementation plan

## Summary

Re-theme the existing "Nest Invaders" horizontal shooter (bird vs. UFO/girl/ironman
sprites, dark sci-fi styling) into **Snack Attack**: a goofy, coherent, flat-vector
food-fight arcade game (Tiny Chef vs. rogue snacks in a diner kitchen). This is a
visual/copy/presentation pass on top of the existing gameplay engine — not a
gameplay rebuild.

## Goals

- One coherent art direction across every screen and every sprite (currently: a
  photoreal night-sky background + cartoon bird + UFO gif + cartoon girl + 8-bit
  Iron Man spritesheet — four unrelated styles).
- New copy, palette, and typography per the "Lunch-Rush Arcade" direction.
- New hand-authored flat-vector SVG characters/projectiles (chef, soda bottle,
  hot dog pile, nacho plate, Hero Toaster gag) replacing all existing art.
- Reworked scoring formula, computed once at round-end; live score hidden during
  play; HUD shows health only.
- Four screens re-skinned: Title, Kitchen Briefing (controls+difficulty), Game,
  Kitchen Report (result).

## Non-goals (explicitly preserved / out of scope)

- No changes to movement, spawn timing, wave data, collision math, level count,
  or difficulty balance, beyond the scoring-formula change specified below.
- No new screens, routes, or gameplay systems.
- Hero Toaster is a static visual gag only — no boss fight, no new mechanic.
- No pixel art, no photoreal/realistic art.
- Internal enemy type identifiers (`ufo`, `girl`, `ironman`) are **not** renamed.

## Enemy & asset mapping (verified against code)

Checked `Game.js` and all three `Data/*.js` files. Exactly three enemy types
exist across all three levels — no surprises to plan around.

| Internal type | Spawn position (unchanged) | Bullet behavior (unchanged) | New skin | New projectile |
|---|---|---|---|---|
| `ufo` | 3 per wave, spread top/mid/bottom, box ~50w×29h (wide/short) | straight left | Soda bottle (drawn on its side to fit the wide/short box) | Fizz bubbles (soda-blue circles) |
| `ironman` | top of field (`top:15`), box ~34w×50h (narrow/tall) | diagonal down-left | Hot dog pile (stacked silhouette, tall) | Ketchup/mustard streak (thin rotated rect, alternating color) |
| `girl` | bottom of field (`top:295`), box ~35w×50h (narrow/tall) | diagonal up-left | Nacho plate (stacked chip silhouette, tall) | Triangular cheese chip (CSS clip-path triangle) |

Player container is ~50w×35h (wide/short) → Tiny Chef drawn as a side-profile
character sized for a wide, short box, matching the existing bird's silhouette
footprint.

Rationale for keeping identifiers: renaming would require touching wave data in
three `Data/*.js` files (~70+ occurrences) plus every conditional branch in
`Game.js` (movement targeting, bullet spawn dimensions, bullet trajectory) for
zero player-visible benefit. Reskinning only the CSS/render layer is materially
lower risk and matches the "behavior preservation over semantic naming" priority
from the brief.

## Art & animation approach

- **No image-generation tool is available in this environment**, and no free
  asset pack exists that would give a coherently-styled chef + soda + hot dog +
  nacho + toaster family. All character art will be **hand-authored inline SVG
  React components**. Simple projectiles (pea, fizz bubble, ketchup/mustard
  streak, triangular chip) will be plain CSS shapes (border-radius circles,
  `clip-path` triangle, thin rotated rects) — no SVG needed for those.
- **Component location:** new sprite components live in a dedicated directory,
  e.g. `src/main/Components/Sprites/` (`TinyChef.js`, `SodaBottle.js`,
  `HotdogPile.js`, `NachoPlate.js`, `HeroToaster.js`, plus a small
  `Projectiles.js` for the CSS-shape bullets). `Game.js` imports and renders
  these instead of the current empty `<div className="enemy ufo" />`-style
  background-image hooks, but its simulation/collision logic is untouched.
- **Fit within existing hitboxes:** every SVG uses `viewBox` + `preserveAspectRatio`
  tuned so the character visually fills its existing container (per user
  feedback, art should not look tiny inside the old box, even though hitboxes
  themselves are not changing). Orientation follows the box shape:
  - `ufo`/soda: wide-and-short → bottle drawn lying on its side (cap toward the
    player), not an upright can that would look cramped.
  - `ironman`/hot dog and `girl`/nacho: narrow-and-tall → both drawn as stacked
    cartoon silhouettes (hot dogs stacked vertically; nacho chips stacked into
    a small leaning tower), not realistic horizontal plates.
- **Animation:** the current per-sprite spritesheet `steps()` walk-cycles
  (bird/ufo/girl/ironman `background-position` filmstrips) are removed —
  flat vector doesn't need a filmstrip. Idle personality comes from lightweight
  CSS transforms instead (idle bob, soda fizz bob, subtle wiggle), per the
  "small motion is okay" guidance.
- **Existing hit/dying/spawning/explosion keyframes are reused as-is** —
  they animate the container (filter/transform/opacity), not the art inside,
  so they're visual-agnostic. The one change: the white `.explosion` radial
  burst is retinted to a cream/cheese color so it reads as a food splat.

## Screens

All four screens map onto existing components — no new routes/files for pages.

1. **Title / Splash** (`Title.js`) — CSS gradient/diner-tile background
   (photo background removed), Luckiest Guy display title "SNACK ATTACK",
   approved hero copy, Hero Toaster tucked in a corner as a small sticker,
   `START FOOD FIGHT` CTA.
2. **Kitchen Briefing** (`Instructions.js` + `Levels.js`, rendered together in
   `GameContainer`'s pre-game state) — two-column ticket/prep-board card
   (controls left, difficulty right on desktop; stacked controls-then-difficulty
   on mobile). Difficulty cards: **Mild / Spicy / Extra Crispy** as primary
   labels, 1/2/3 secondary, chunky/obviously-selectable states. CTA relabeled
   `ENTER THE KITCHEN`.
3. **Game** (`Game.js`) — canvas mechanics untouched. HUD simplified to
   `HEALTH: 10` only (score `<div>` removed from render entirely). Background
   outside the canvas reskinned to the diner palette. Sprites swapped per the
   mapping table above.
4. **Kitchen Report** (`GameContainer.js` win/loss branches) — receipt-style
   card. Win: "Kitchen Saved!" / Loss: "Kitchen Overrun!" with retry copy
   "The snacks are getting cocky. Grab another handful of peas and show them
   who's head chef." Four score rows (Health/Accuracy/Rush/Spice) + Final Tip
   total, Hero Toaster stamp ("Approved by Hero Toaster"), `TRY AGAIN` button.

## Scoring & HUD

Replace `calculateCurrentScore` / `calculateFinalScore` in `GameContainer.js`
with a single formula computed once at round-end (win or loss), using the
existing `timer` (ms), `playerHealth`, `shotsFired`, `successfulShotsFired`,
and `level` state — no new state needed:

```js
const healthBonus = playerHealth * 1000;
const accuracyPercent = shotsFired ? successfulShotsFired / shotsFired : 0;
const accuracyBonus = Math.round(accuracyPercent * 10000);
const elapsedSeconds = Math.floor(timer / 1000);
const rushBonus = Math.max(0, 30000 - elapsedSeconds * 500);
const spiceBonus = level * 20000;
const finalScore = healthBonus + accuracyBonus + rushBonus + spiceBonus;
```

Live score is not computed/displayed during play. `Game.js`'s HUD renders only
`HEALTH: 10` (styled, not the current bare white text).

## Design tokens & typography

CSS custom properties (from the brief) added at the top of `style.css`,
replacing the black/limegreen/white system everywhere:

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
}
```

`public/index.html` font `<link>` swaps from Poppins to **Luckiest Guy**
(display/title only) + **Nunito Sans** (everything else — controls, difficulty,
scoring stay readable, not cartoony).

## Asset cleanup

Old image files (`space.jpg`, `original-space.jpg`, `birdSprite.png`,
`enemyGirl.png`, `ironman.png`, `ufo.gif`, `ninjaStar.png`) become fully unused
once the reskin lands. **Per user instruction: do not delete them until after
the redesign builds successfully and a grep confirms zero remaining
imports/references.** Deletion is the last step of implementation, not an
early one.

## Risks / open implementation notes

- `Game.js` currently renders enemies as `<div className="enemy {type}" />`
  with all visuals coming from CSS `background-image`. Swapping to rendering
  actual SVG components changes that div's children, which touches the
  gameplay file — acceptable per the brief ("visuals/CSS/copy" changes are
  fine; logic is not touched), but the diff should stay scoped to the render
  functions (`renderPlayer`, `renderEnemies`) and not the simulation loop.
- Keep `Game.js` readable per user request: sprite components are imported
  from `Components/Sprites/`, not inlined.
- Build must be verified (`npm run build` or `npm start` + manual smoke test)
  before the asset-cleanup deletion step.
