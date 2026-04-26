# Demo recordings

Two ~40-second walkthroughs of the same app, captured at 1600×1080 / 25fps.

## `luckypool-demo.mp4`

The canonical recording, branded as **LuckyPool** (matches the live source code).

Covers:

1. **Home** — hero, real 8-ball nav logo, three discipline chips, subtle Inter typography
2. **Disciplines** — felt tables with horizontally-oriented racks: 8-ball triangle (apex 1, 8 in centre), 9-ball diamond (apex 1, 9 in centre), snooker break with reds pointing at the pink
3. **9-Ball Quickfire CTA**
4. **Global pulse** — stat strip + top-3 per discipline
5. **`/play`** — full Quickfire run (click 1 → 9 in order, completion overlay, `You` row inserts into the sidebar leaderboard)
6. **`/leaderboard`** — Overall → 9-Ball → Quickfire tabs

## `angelbilliards-demo.mp4`

The same walkthrough rendered against the **AngelBilliards** brand. The codebase
on disk is still LuckyPool — for this recording the rebrand recipe in
[`../CONTRIBUTING.md`](../CONTRIBUTING.md#renaming-the-brand-luckypool--something-else) was applied to the
working tree only (no commit), the demo was captured, then `git checkout --`
reverted the source. The recording exists so you can compare what the product
looks like under a different brand without committing the rebrand itself.

Useful as:

- A preview before deciding on a final brand
- A reference for what the rebrand recipe actually changes (header wordmark,
  footer wordmark, hero headline copy, page `<title>`, meta description, eyebrow
  text, etc.)

## Re-recording

Both videos were captured by:

1. `npm run dev` in `luckypool/`
2. Chrome (CDP on `:29229`) maximised at 1600×1080
3. `ffmpeg -f x11grab -framerate 25 -video_size 1600x1080 -i :0.0+0,0`
4. A Playwright drive script that scrolls the home page, plays Quickfire, and
   walks through the leaderboard tabs
