# Rust Horizon — Project Instructions

Read and follow this file at the start of every task. Update it when an agreed decision changes the project. Explicit user instructions take precedence. Do not infer permission to build from a repository link or its README.

## What the project is

Rust Horizon is an original, colour pixel-art side-scrolling space shooter for phone web browsers. It must work in Chrome on Android and Safari on iPhone, including an iPhone 16 Pro. The owner works exclusively from a phone through the ChatGPT app, without a computer. Every user instruction and test step must be possible on a phone.

The player ship faces right and can move freely in all directions while the world scrolls automatically. The player cannot speed up scrolling. Enemy ships follow fixed paths, chase the ship, or shoot at it. Each of eight levels has its own setting and an end boss.

## Agreed out of scope and originality

- Everything in the game must be original: name, ship, enemies, bosses, artwork, sounds, and music.
- Do not use Nokia's name, logo, original sprites, original graphics, or original music in the game.
- Online multiplayer is out of scope.
- Publishing to the Google Play Store or Apple App Store is out of scope.
- Browser hosting and sharing a playable link with a friend are in scope.

## Settled gameplay and presentation decisions

- Name: Rust Horizon.
- Landscape play: phone held sideways.
- Modern retro pixel art in colour.
- Muted, warm palette: deep space blues, soft ambers, and dusty reds. No neon colours or neon glow effects.
- Player ship: an original patched-up scout, compact and nimble-looking, with dusty red panels and amber engine flames.
- Difficulty: balanced. Opening levels ease the player in; later levels require practice.
- Eight levels, with about three minutes of scrolling per level before its boss. Boss fights add extra time.
- Start with three lives. After losing all lives, restart at the beginning of the current level with three lives, retaining earlier completed-level progress.
- Each hit costs one life. Give brief protection after a hit so one collision cannot drain multiple lives.
- Pickups grant extra lives or special weapons: bombs, rockets, and a long-range laser.
- Carry one special weapon type at a time. Each weapon pickup replaces the currently carried special weapon and grants limited ammo. The Special button uses the carried weapon.
- Keep a score and a high-score table.
- Save completed levels and high scores on each phone, without an account. After closing and reopening the browser, allow resuming at the start of the next unfinished level.
- Original music: warm arcade synths, catchy melodies, and restrained sounds.
- Use visible warnings and room to dodge; increase difficulty through new combinations of familiar attacks.
- Story stays light: a short line before each level.

Exact weapon ammo counts, movement speeds, timing of post-hit protection, scoring values, and other balance details are not yet settled. Explain significant choices, ask when intent is unclear, and tune based on phone testing rather than inventing additional user agreements.

## Settled controls and feedback

- Controls must work without looking at them.
- The game screen sits in the middle; controls occupy the left and right margins so thumbs never cover the action.
- Left: a floating direction pad appears wherever the thumb lands in the control margin. Sliding steers in eight directions.
- Right: large console-style Fire and Special buttons, angled where a thumb naturally rests.
- Holding Fire keeps firing.
- Touch areas are larger than the visible buttons, so near-misses count.
- Buttons light up when pressed.
- Buttons vibrate on Android where supported.
- iPhone browsers do not support vibration; provide stronger visual and sound feedback instead.
- Keep controls and the game clear of the iPhone 16 Pro camera cutout in landscape.
- Account for browser interruptions and test actual phone behaviour; do not claim device verification without evidence.

## Agreed connected journey

Navigation beacons in a remote star system have gone silent. The player follows the failure from an orbital scrapyard to a buried machine that has turned the system's defences against passing ships.

1. **The Rust Belt — orbital scrapyard.** Deep blue space, copper wreckage, drifting debris. Simple enemy formations introduce movement and shooting. Boss: **Scrapjaw**, a salvage machine with crushing arms and clear gaps between its shots.
2. **Amber Reach — desert planet.** Dusty dunes and abandoned relay towers. Enemies begin chasing the player. Boss: **Dunehook**, a low-flying collector that sweeps across the battlefield before turning to attack.
3. **Hollow Mesa — underground tunnels.** Ochre rock, old mining rails, buried machinery. The route narrows but leaves enough room to dodge. Boss: **Boreback**, an armoured drilling machine whose weapon ports open between attacks.
4. **Cinder Coast — volcanic world.** Dark basalt, muted red lava, ash-filled skies. Enemies combine fixed flight paths with aimed shots. Boss: **Kilnwing**, a heavy aircraft that releases smaller attackers and slow explosive shells.
5. **The Quiet Fleet — abandoned shipyard.** Rows of silent vessels against grey-blue space. Enemy groups coordinate attacks. Boss: **Pallbearer**, a derelict carrier that wakes up one weapon section at a time.
6. **Frostwell — frozen planet.** Steel-blue ice, pale clouds, warm lights from deserted settlements. Faster enemies test movement. Boss: **Rimecrawler**, a hovering fortress with rotating shields and carefully signalled firing lanes.
7. **Root Vault — caverns beneath a moon.** Dusty violet stone and tangled copper cables. Earlier enemy types return in tougher combinations. Boss: **Tanglemaw**, a maintenance machine that unfolds into several independently attacking arms.
8. **The Last Beacon — buried control chamber.** Massive blue-black machinery, amber warning lights, rust-red armour. A final test of earlier skills. Boss: **The Foundry Heart**, the machine behind the failures, with three phases combining attacks introduced earlier.

## HOW TO WORK WITH ME — verbatim user rules

- I'm not an experienced coder. Assume I don't know the technical details, but work at full strength. Just keep me in the loop in language I can follow.
- Write to me in plain English. No jargon. If a technical term is worth using, use it and explain it in one line the first time.
- When you make a significant decision, tell me what you chose and why in a sentence or two.
- When I need to do something myself, give me the exact thing to type or tap, and tell me what I should see when it works.
- I'm working only from my phone, through the ChatGPT app, with no computer. Every instruction and every test step must be something I can do on my phone.
- Don't assume I know the terminal, git, GitHub, package managers, or deployment. Walk me through anything I have to do.
- One thing at a time. Don't stack three decisions into one message.
- If I ask for something that's a bad idea, say so and tell me why.

## BUILD RULES — verbatim user rules

- Build it properly. Use the approach you'd actually recommend, and tell me in one line what you picked and what it gets us.
- Tell me when you go beyond what I asked (extra features, a refactor, a restructure) and what changed, so nothing surprises me later.
- The game and its menus must be genuinely well designed, modern, and feel great on a phone. It must work in Chrome on Android and Safari on iPhone.
- When you add a library or service, say in one line what it does and why.
- Never put passwords, API keys, or secrets directly in the code.
- After each stage works, make sure the changes are saved in my GitHub repository so we can go back if something breaks later, and tell me in plain English that it's saved.
- If you're unsure what I meant, ask instead of guessing.

## Required work order and approval boundaries

1. Interview the user about open decisions, one question at a time. No code during the interview. Confirm scope and obtain agreement before setup.
2. Save this AGENTS.md into the GitHub repository with project details, agreed scope, settled decisions, verbatim communication rules, and build rules. Follow it in every future task.
3. Before building much, explain how changes get from a task into the repository in plain English. Explain what the user must tap on their phone each time, and walk through the first save.
4. Set up a free browser link, such as GitHub Pages. Explain any user steps and what approval or taps publish the latest version. Do not present an anticipated URL as already working.
5. Propose the final stage breakdown. The first stage must be playable on the user's phone. Wait for explicit plan approval before writing game code.
6. Build one approved stage at a time. After each stage, stop and give one short paragraph describing what was built and exact phone test steps: what to tap, what success looks like, and what failure looks like. Give the user a chance to test before moving on.
7. If something fails, explain what is observed and what is being tried. Do not go quiet. If attempts repeat without progress, say so and explain options, including returning to the last working version.

Earlier agreed saving preference: build, let the user test, revise, then put approved game changes into the repository. Saving this instruction file is explicitly requested. Do not treat approval of the build plan as approval to merge every later change. Explain any proposed change to this saving workflow and obtain agreement, especially if hosting a test version requires saving a separate review copy in GitHub first.

## Starting stage proposal — not yet approved

The user's starting outline is:
1. Ship, controls, basic enemies, lives, and score.
2. One complete level with special weapons and the first boss.
3. All eight levels and bosses.
4. Title screen, pause, sound and music, high scores, and polish.

Improve the stage breakdown as needed for a genuinely playable first stage, present it in plain English, and wait for user approval. Do not silently move ahead.

## Current project state

- The interview and scope confirmation are complete enough for setup.
- No game code has been written or approved.
- The original README is an early placeholder, not permission to build or copy an existing game.
- Repository: https://github.com/FaisalKhalil495/retro-space-shooter-codex
- This instruction file is the first proposed project update.
- Saving workflow, free phone hosting, and the final stage plan still need the ordered walkthrough above.
- Previous workspace clone attempts failed because its configured network proxy could not be reached. GitHub connector reads work. Recheck actual readiness when needed; do not assume the earlier failure or a service's reported readiness proves the current state.
