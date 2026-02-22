# KPop Demon Hunters - Game Plan

## Game Concept

**Genre:** Browser-based RPG / Action Adventure
**Theme:** KPop idols who are secretly demon hunters protecting the world from supernatural threats
**Target Platform:** Web browser (desktop + mobile friendly)

---

## Story Premise

By day, they're the hottest KPop group in the world. By night, they're elite demon hunters protecting humanity from creatures that lurk in the shadows. Players build a team of KPop idol hunters, each with unique musical powers, to battle demons across iconic locations.

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

## Game Features (Phases)

### Phase 1: Core Foundation
- [ ] Project setup (HTML/CSS/JS structure)
- [ ] Title screen with KPop aesthetic (neon, pink/purple gradients)
- [ ] Character selection screen (pick your idol hunter)
- [ ] Basic game UI (health bars, menus, status display)

### Phase 2: Characters & Stats
- [ ] Create 4-6 playable KPop idol hunter characters
- [ ] Character stats (HP, Attack, Defense, Speed, Style)
- [ ] Special musical abilities per character
- [ ] Character profile cards with pixel art or emoji-based visuals

### Phase 3: Combat System
- [ ] Turn-based battle system (player vs demon)
- [ ] Attack, Defend, Special Ability, and Item commands
- [ ] Demon enemies with different types and weaknesses
- [ ] Battle animations (CSS-based effects)
- [ ] Victory/defeat screens with rewards

### Phase 4: World & Progression
- [ ] World map with selectable locations (Concert Hall, Dark Alley, Haunted Studio, etc.)
- [ ] Multiple demon encounters per location
- [ ] Boss demons at the end of each area
- [ ] Experience points and leveling up
- [ ] Save/load game progress (localStorage)

### Phase 5: Polish & Extras
- [ ] Background music references and sound effects
- [ ] Inventory system (items, potions, costumes)
- [ ] Team formation (pick 3 hunters for a mission)
- [ ] Achievement/badge system
- [ ] Final boss battle

---

## Character Ideas

| Hunter Name | Role | Musical Power | Special Move |
|------------|------|---------------|--------------|
| Luna | Leader / Balanced | Vocals | "High Note Blast" - sonic wave attack |
| Blaze | Attacker | Dance | "Fire Step" - blazing kick combo |
| Echo | Support / Healer | DJ / Beats | "Healing Remix" - restores team HP |
| Storm | Tank / Defender | Drums | "Thunder Beat" - shield + counterattack |
| Prism | Magic / Ranged | Synth | "Light Show" - multi-hit laser attack |
| Shadow | Speed / Stealth | Rap | "Mic Drop" - critical hit ambush |

---

## Demon Types

| Demon | Location | Weakness | Description |
|-------|----------|----------|-------------|
| Shade Dancers | Dark Alley | Dance moves | Shadow creatures that mimic movements |
| Feedback Fiend | Haunted Studio | Vocals | A monster made of distorted sound |
| Spotlight Wraith | Concert Hall | Light/Synth | Ghost that hides in stage lights |
| Bass Golem | Underground Club | Drums/Beats | Giant creature powered by bass drops |
| The Anti-Fan | Social Media Realm | Rap/Words | Final boss - feeds on negativity |

---

## File Structure

```
KPop-World-of-Hunters-and-Demons/
├── index.html              # Main entry point
├── css/
│   ├── style.css           # Global styles & KPop theme
│   ├── battle.css          # Battle screen styles
│   └── animations.css      # Attack & effect animations
├── js/
│   ├── main.js             # Game initialization & screen management
│   ├── characters.js       # Character data & classes
│   ├── demons.js           # Demon data & classes
│   ├── battle.js           # Combat system logic
│   ├── world.js            # World map & location logic
│   ├── ui.js               # UI updates & rendering
│   └── storage.js          # Save/load with localStorage
├── assets/
│   └── (pixel art, sprites, or emoji-based graphics)
├── GAME_PLAN.md            # This file
└── README.md               # Project description
```

---

## Visual Style

- **Color palette:** Neon pink, electric purple, black, white, gold accents
- **Font style:** Bold, modern (Google Fonts - something like Orbitron or Russo One)
- **UI style:** Clean cards with glowing borders, KPop album cover aesthetic
- **Characters:** Pixel art style or stylized emoji/icon representations
- **Effects:** CSS glow, particle-like animations, screen shake on hits

---

## How to Build It (Step by Step)

This is designed so you can build it together, one piece at a time:

1. **Start simple** - Get a title screen showing in the browser
2. **Add characters** - Create the data and show character cards
3. **Build battles** - Get the turn-based combat working
4. **Add enemies** - Create demons to fight
5. **Connect it all** - World map, progression, saving
6. **Make it shine** - Animations, effects, polish

Each step produces something playable, so you'll see progress the whole way!

---

## Getting Started

To play the game during development:
1. Open `index.html` in any web browser
2. That's it! No servers, no installs, no build steps.
