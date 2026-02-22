# KPop Demon Hunters - Game Plan

## Game Concept

**Genre:** Browser-based RPG / Action Adventure
**Theme:** A KPop idol named Rumi is trapped in the Demon World and must rescue captured humans and defeat the Demon King, Gwi-ma
**Target Platform:** Web browser (desktop + mobile friendly)

---

## Story

**Rumi** is a rising KPop star with a secret — she can see through the veil between the human world and the Demon World. When Gwi-ma, the fearsome Demon King, begins kidnapping innocent people and dragging them into the Demon World, Rumi is the only one who can follow.

Armed with her musical powers, Rumi crosses into the Demon World — a dark, twisted reflection of reality — to rescue the captured humans and put an end to Gwi-ma's reign of terror.

But the path to Gwi-ma is long and dangerous. His demon generals guard each region of the Demon World, and the kidnapped humans are scattered across its darkest corners. Rumi must fight through hordes of demons, free the prisoners, grow stronger, and ultimately face Gwi-ma himself.

**The goal:** Rescue all the captured humans and defeat Gwi-ma.

---

## Main Character: Rumi

| Attribute | Details |
|-----------|---------|
| **Name** | Rumi |
| **Role** | KPop Idol / Demon Hunter |
| **Weapon** | Enchanted Microphone (channels musical energy into attacks) |
| **Base Stats** | HP: 100, Attack: 15, Defense: 10, Speed: 12, Spirit: 20 |
| **Power Source** | Musical energy — her songs become weapons in the Demon World |

### Rumi's Abilities (unlock as she levels up)

| Level | Ability | Effect |
|-------|---------|--------|
| 1 | **Sonic Strike** | Basic musical attack — a blast of sound energy |
| 3 | **Healing Chorus** | Rumi sings to restore her own HP |
| 5 | **Rhythm Shield** | A beat-powered barrier that reduces damage for 3 turns |
| 8 | **Encore** | Repeats the last ability used (double turn) |
| 12 | **High Note Fury** | Powerful multi-hit vocal attack |
| 16 | **Idol's Light** | Ultimate move — massive damage + heals to full HP |

---

## The Villain: Gwi-ma (귀마) — The Demon King

| Attribute | Details |
|-----------|---------|
| **Name** | Gwi-ma (귀마 — "Demon Ghost") |
| **Title** | King of the Demon World |
| **Power** | Feeds on human fear and despair |
| **Weakness** | Music, hope, and courage — everything Rumi represents |
| **Goal** | Capture enough humans to break the barrier between worlds permanently |

Gwi-ma is the final boss. He's powerful, terrifying, and has multiple battle phases. But he fears one thing — the power of music, because it gives people hope, and hope weakens his control.

---

## The Demon World — Locations

The Demon World is divided into regions, each guarded by one of Gwi-ma's generals. Rumi must clear each region (fight demons + rescue humans) to unlock the path to the next.

| Region | Description | Boss (General) | Humans to Rescue |
|--------|-------------|----------------|-----------------|
| **The Shattered Stage** | A ruined concert hall, twisted and dark | **Mok-sori** (Demon of Silence) | 3 |
| **The Neon Graveyard** | A city of dead lights and broken screens | **Geurimja** (Shadow Demon) | 4 |
| **The Echo Caverns** | Underground caves where sounds become monsters | **Meari** (Echo Demon) | 3 |
| **The Frozen Ballroom** | An icy palace where time moves slowly | **Eol-eum** (Ice Demon) | 4 |
| **Gwi-ma's Fortress** | The Demon King's throne room | **Gwi-ma** himself | 6 (final rescue) |

### Total: 20 humans to rescue across 5 regions

---

## Demon Enemies (Regular Encounters)

| Demon | HP | Attack | Description |
|-------|----|--------|-------------|
| **Jam-gwi** (Imp) | 20 | 5 | Small, fast, annoying — attacks in groups |
| **Geu-neul** (Shade) | 35 | 8 | Shadow creature, hard to hit |
| **Bi-myeong** (Screamer) | 30 | 12 | Sonic attacks that can stun Rumi |
| **Cheol-gwi** (Iron Demon) | 50 | 10 | Heavy armor, high defense |
| **Heol-gwi** (Blood Demon) | 40 | 15 | Drains HP with each attack |
| **Mong-ma** (Nightmare) | 45 | 13 | Can confuse Rumi, making her skip turns |

---

## Allies (Rescued humans who help Rumi)

As Rumi rescues humans, some of them join her cause and provide support abilities:

| Ally | Found In | Support Ability |
|------|----------|----------------|
| **Jin** (a brave kid) | Shattered Stage | Throws items for Rumi in battle |
| **Dr. Park** (a scientist) | Neon Graveyard | Crafts potions and power-ups |
| **Hana** (a dancer) | Echo Caverns | Boosts Rumi's Speed in battle |
| **Master Yoon** (a martial artist) | Frozen Ballroom | Boosts Rumi's Attack in battle |

---

## Combat System

### Turn-Based Battle
Each battle is Rumi vs one or more demons, taking turns:

**Rumi's Actions:**
- **Attack** — Basic strike with her enchanted mic
- **Ability** — Use a special musical power (costs Spirit points)
- **Item** — Use a potion or power-up
- **Defend** — Guard to reduce incoming damage by 50%
- **Rescue** — (Special) Free a captured human when available in the area

### Battle Flow
```
1. Rumi chooses an action
2. Rumi's action plays out (with animation)
3. Demon(s) attack
4. Demon action plays out (with animation)
5. Check: Is anyone defeated?
6. Repeat until battle ends
```

### Rewards
- **XP** — Rumi levels up and gets stronger
- **Items** — Potions, shields, power-ups drop from demons
- **Spirit Crystals** — Currency to buy upgrades between battles

---

## Game Features (Phases)

### Phase 1: Core Foundation
- [ ] Project setup (HTML/CSS/JS file structure)
- [ ] Title screen — "KPop Demon Hunters" with dark/neon KPop aesthetic
- [ ] Story intro sequence (text-based, sets up Rumi's mission)
- [ ] Basic game UI (HP bar, Spirit bar, menus)

### Phase 2: Rumi & The First Region
- [ ] Rumi's character stats, abilities, and leveling system
- [ ] The Shattered Stage — first region with demon encounters
- [ ] Turn-based combat system (Attack, Ability, Item, Defend)
- [ ] First boss fight: Mok-sori (Demon of Silence)
- [ ] Rescue mechanic — save 3 humans in this region

### Phase 3: Full Demon World
- [ ] Remaining 4 regions with unique enemies and bosses
- [ ] Ally system — rescued humans provide battle support
- [ ] World map to navigate between regions
- [ ] Save/load game progress (localStorage)

### Phase 4: Gwi-ma & Endgame
- [ ] Gwi-ma's Fortress — final region
- [ ] Multi-phase final boss battle against Gwi-ma
- [ ] Ending sequence — Rumi saves the day
- [ ] Victory screen with stats (humans rescued, battles won, etc.)

### Phase 5: Polish & Extras
- [ ] Battle animations and visual effects
- [ ] Sound effects and music references
- [ ] Inventory and item shop (spend Spirit Crystals)
- [ ] Achievement/badge system
- [ ] Difficulty settings (Easy/Normal/Hard)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Structure | HTML5 | Universal browser support |
| Styling | CSS3 + Animations | Smooth visuals, no extra dependencies |
| Game Logic | Vanilla JavaScript | No frameworks needed, great for learning |
| Graphics | HTML5 Canvas + CSS Sprites | Lightweight 2D rendering |
| Data | Local Storage | Save game progress in the browser |
| Build | None (static files) | Open `index.html` and play! |

> **Why vanilla HTML/CSS/JS?** It's beginner-friendly, requires no build tools, and is a great way to learn web development while building something fun!

---

## File Structure

```
KPop-World-of-Hunters-and-Demons/
├── index.html              # Main entry point
├── css/
│   ├── style.css           # Global styles & KPop/Demon World theme
│   ├── battle.css          # Battle screen styles
│   └── animations.css      # Attack & effect animations
├── js/
│   ├── main.js             # Game initialization & screen management
│   ├── rumi.js             # Rumi's stats, abilities, leveling
│   ├── demons.js           # Demon data & boss definitions
│   ├── allies.js           # Rescued ally support abilities
│   ├── battle.js           # Turn-based combat system
│   ├── world.js            # Demon World map & region logic
│   ├── ui.js               # UI updates & rendering
│   └── storage.js          # Save/load with localStorage
├── assets/
│   └── (pixel art, sprites, or emoji-based graphics)
├── GAME_PLAN.md            # This file
└── README.md               # Project description
```

---

## Visual Style

- **Color palette:** Deep crimson, electric purple, black, ghostly white, neon pink accents
- **Demon World feel:** Dark backgrounds, glowing eyes, eerie mist effects
- **KPop contrast:** Rumi glows with bright, colorful energy against the dark world
- **Font style:** Bold, modern (Google Fonts — Orbitron for titles, Noto Sans for text)
- **UI style:** Dark cards with glowing neon borders
- **Effects:** CSS glow, particle-like animations, screen shake on hits

---

## How to Build It (Step by Step)

1. **Title screen** — Get "KPop Demon Hunters" on screen with the dark/neon look
2. **Rumi** — Create her stats, show her character card
3. **First battle** — Fight a basic demon with the turn-based system
4. **First region** — Complete The Shattered Stage with boss + rescues
5. **Expand the world** — Add remaining regions and the world map
6. **Final boss** — Build the Gwi-ma battle
7. **Polish** — Animations, items, achievements, sound

Each step produces something playable!

---

## Getting Started

To play the game during development:
1. Open `index.html` in any web browser
2. That's it! No servers, no installs, no build steps.
