# Rust Horizon

An original landscape space shooter for phone web browsers. Warm, muted pixel art; a floating eight-direction pad on the left; large Fire and Special controls on the right. The controls sit outside the action.

## Current version: Stage 1 flight test (v0.1.1)

- Original scout and scrolling orbital scrapyard.
- Enemy formations, hold-to-fire shooting, three lives, score, and a three-minute trial.
- One life per hit, with 1.8 seconds of protection afterward.
- Start, pause/resume, retry, and original synthesized sound effects with a mute control.
- Automatic pause on app interruptions and portrait rotation.
- Android vibration where supported, plus visible button and sound feedback.
- Nearly full-height central playfield, dark thumb margins, low-left floating pad, amber Fire and dusty-red Special; iPhone safe-area spacing.
- Pause and sound controls in the upper left margin; score and ship-shaped lives inside the playfield.

Special weapons, pickups, Scrapjaw, and saved level progress arrive in Stage 2. Music and the high-score table arrive later. The current version does not pretend to contain these features.

## Phone testing

GitHub Pages is configured to publish the `preview` branch from `/(root)`. Only share the Pages URL after the matching deployment is confirmed.

1. Open the game link in Chrome on Android or Safari on iPhone, and turn the phone sideways.
2. Tap **START FLIGHT**.
3. Touch anywhere in the left margin and slide to steer. Hold **FIRE** with the right thumb at the same time.
4. Check that thumbs stay outside the action and near-misses around the Fire button register.
5. Tap **PAUSE**, then **RESUME FLIGHT**. Switching apps or rotating upright should also pause safely.
6. After losing three lives, tap **TRY AGAIN**. Lives and score should reset.

The game uses the browser's built-in drawing and audio systems. There are no game-library dependencies, accounts, or borrowed assets. Sound preference is stored locally when browser storage is available.

## Saving workflow

Work in progress is saved to `preview` for phone testing. The owner tests, requests revisions, and explicitly approves before merging a pull request into `main`. Preserve `preview` after merging because the testing site depends on it. Read [AGENTS.md](./AGENTS.md) before every task.

## Developer checks

Use `npm test` for simulation checks. Serve this folder through a static HTTP server to test the browser modules. No installation or build step is needed. The owner only uses a phone and must not be asked to run these commands.
