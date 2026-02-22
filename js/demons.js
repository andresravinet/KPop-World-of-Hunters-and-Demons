/* ===========================
   Demons & Bosses
   Silly, not scary!
   =========================== */

const DEMON_TYPES = {
    imp: {
        name: 'Jam-gwi',
        subtitle: 'Imp',
        emoji: '👿',
        hp: 20, attack: 5, defense: 2, speed: 14,
        desc: 'Tiny, bouncy troublemakers!',
        xpReward: 8,
        crystalReward: 2
    },
    shade: {
        name: 'Geu-neul',
        subtitle: 'Shade',
        emoji: '👤',
        hp: 35, attack: 8, defense: 4, speed: 12,
        desc: 'Giggly shadow blobs!',
        xpReward: 14,
        crystalReward: 3
    },
    screamer: {
        name: 'Bi-myeong',
        subtitle: 'Screamer',
        emoji: '🗣️',
        hp: 30, attack: 12, defense: 3, speed: 10,
        desc: 'Yells silly nonsense!',
        xpReward: 16,
        crystalReward: 4,
        special: 'stun'
    },
    iron: {
        name: 'Cheol-gwi',
        subtitle: 'Iron Demon',
        emoji: '🤖',
        hp: 50, attack: 10, defense: 10, speed: 5,
        desc: 'Clumsy armored goofball!',
        xpReward: 20,
        crystalReward: 5
    },
    nightmare: {
        name: 'Mong-ma',
        subtitle: 'Nightmare',
        emoji: '😈',
        hp: 45, attack: 13, defense: 5, speed: 9,
        desc: 'Makes silly illusions!',
        xpReward: 22,
        crystalReward: 5,
        special: 'confuse'
    },
    sticky: {
        name: 'Kkul-gwi',
        subtitle: 'Sticky Demon',
        emoji: '🫠',
        hp: 40, attack: 8, defense: 6, speed: 7,
        desc: 'Gloopy and stretchy!',
        xpReward: 18,
        crystalReward: 4,
        special: 'slow'
    }
};

const BOSSES = {
    moksori: {
        name: 'Mok-sori',
        title: 'Demon of Silence',
        emoji: '🤫',
        hp: 120, attack: 14, defense: 8, speed: 10,
        desc: 'Shushes everyone! Tries to silence your music!',
        xpReward: 80,
        crystalReward: 25,
        phases: [
            { hpThreshold: 1.0, pattern: ['attack', 'silence', 'attack'] },
            { hpThreshold: 0.5, pattern: ['silence', 'attack', 'power_attack', 'attack'] }
        ]
    },
    geurimja: {
        name: 'Geurimja',
        title: 'Shadow Demon',
        emoji: '👥',
        hp: 180, attack: 16, defense: 10, speed: 14,
        desc: 'Hides in your shadow! Now you see me, now you don\'t!',
        xpReward: 120,
        crystalReward: 35,
        phases: [
            { hpThreshold: 1.0, pattern: ['attack', 'hide', 'sneak_attack'] },
            { hpThreshold: 0.4, pattern: ['hide', 'sneak_attack', 'shadow_clones', 'attack'] }
        ]
    },
    meari: {
        name: 'Meari',
        title: 'Echo Demon',
        emoji: '🔊',
        hp: 200, attack: 18, defense: 7, speed: 11,
        desc: 'Copies everything you say! Super annoying!',
        xpReward: 160,
        crystalReward: 45,
        phases: [
            { hpThreshold: 1.0, pattern: ['echo_attack', 'attack', 'copy'] },
            { hpThreshold: 0.5, pattern: ['copy', 'echo_attack', 'power_attack', 'echo_attack'] }
        ]
    },
    eoleum: {
        name: 'Eol-eum',
        title: 'Ice Demon',
        emoji: '🥶',
        hp: 250, attack: 20, defense: 12, speed: 8,
        desc: 'Freezes the dance floor! Brrr!',
        xpReward: 200,
        crystalReward: 55,
        phases: [
            { hpThreshold: 1.0, pattern: ['freeze', 'attack', 'ice_wall'] },
            { hpThreshold: 0.5, pattern: ['blizzard', 'freeze', 'power_attack', 'ice_wall'] }
        ]
    },
    gwima: {
        name: 'Gwi-ma',
        title: 'The Demon King',
        emoji: '👹',
        hp: 400, attack: 25, defense: 15, speed: 12,
        desc: 'The grumpiest villain ever! Time to end this!',
        xpReward: 500,
        crystalReward: 100,
        phases: [
            { hpThreshold: 1.0, pattern: ['attack', 'dark_wave', 'attack', 'tantrum'] },
            { hpThreshold: 0.6, pattern: ['dark_wave', 'power_attack', 'summon_minions', 'tantrum'] },
            { hpThreshold: 0.3, pattern: ['ultimate_grump', 'dark_wave', 'power_attack', 'dark_wave'] }
        ]
    }
};

// Regions define the game progression
const REGIONS = [
    {
        id: 'shattered_stage',
        name: 'The Shattered Stage',
        icon: '🎭',
        desc: 'A wonky, upside-down concert hall',
        bossId: 'moksori',
        humansToRescue: 3,
        encounters: [
            { enemies: ['imp', 'imp'] },
            { enemies: ['imp', 'shade'] },
            { enemies: ['imp', 'imp', 'imp'] },
            { enemies: ['shade', 'shade'] },
            { enemies: ['screamer', 'imp'] }
        ],
        celebration: 'The team fixes the stage and performs their first concert together in the Demon World! Confetti and sparkles everywhere! Rumi grabs the mic and the whole team sings their hearts out!'
    },
    {
        id: 'neon_graveyard',
        name: 'The Neon Graveyard',
        icon: '🌃',
        desc: 'A city of flickering lights and silly signs',
        bossId: 'geurimja',
        humansToRescue: 4,
        encounters: [
            { enemies: ['shade', 'shade'] },
            { enemies: ['shade', 'imp', 'imp'] },
            { enemies: ['screamer', 'shade'] },
            { enemies: ['iron', 'imp'] },
            { enemies: ['shade', 'shade', 'shade'] },
            { enemies: ['nightmare', 'shade'] }
        ],
        celebration: 'All the dead lights flicker back on — the city lights up in rainbow colors! The team has a dance party in the streets! Even the rescued humans join in!'
    },
    {
        id: 'echo_caverns',
        name: 'The Echo Caverns',
        icon: '🦇',
        desc: 'Caves where sounds bounce into goofy creatures',
        bossId: 'meari',
        humansToRescue: 3,
        encounters: [
            { enemies: ['screamer', 'screamer'] },
            { enemies: ['sticky', 'imp', 'imp'] },
            { enemies: ['nightmare', 'screamer'] },
            { enemies: ['iron', 'sticky'] },
            { enemies: ['screamer', 'nightmare', 'imp'] },
            { enemies: ['iron', 'screamer', 'screamer'] }
        ],
        celebration: 'The caves fill with beautiful harmonies instead of goofy echoes! The team sings together and the whole cavern glows with colorful musical light!'
    },
    {
        id: 'frozen_ballroom',
        name: 'The Frozen Ballroom',
        icon: '❄️',
        desc: 'A sparkly ice palace where everything moves in slow-mo',
        bossId: 'eoleum',
        humansToRescue: 4,
        encounters: [
            { enemies: ['iron', 'iron'] },
            { enemies: ['sticky', 'nightmare'] },
            { enemies: ['iron', 'screamer', 'imp'] },
            { enemies: ['nightmare', 'nightmare'] },
            { enemies: ['sticky', 'iron', 'shade'] },
            { enemies: ['iron', 'nightmare', 'screamer'] },
            { enemies: ['sticky', 'sticky', 'iron'] }
        ],
        celebration: 'The ice melts into a sparkling dance floor! The team has a big ballroom dance. Jinu nervously asks Rumi to dance... and she says yes! Mira and Zoey cheer from the side!'
    },
    {
        id: 'gwima_fortress',
        name: 'Gwi-ma\'s Fortress',
        icon: '🏰',
        desc: 'The Demon King\'s big grumpy castle',
        bossId: 'gwima',
        humansToRescue: 6,
        encounters: [
            { enemies: ['iron', 'iron', 'shade'] },
            { enemies: ['nightmare', 'screamer', 'sticky'] },
            { enemies: ['iron', 'nightmare', 'nightmare'] },
            { enemies: ['sticky', 'iron', 'screamer', 'imp'] },
            { enemies: ['nightmare', 'iron', 'sticky'] },
            { enemies: ['iron', 'iron', 'nightmare', 'screamer'] },
            { enemies: ['nightmare', 'nightmare', 'sticky', 'sticky'] },
            { enemies: ['iron', 'iron', 'iron'] }
        ],
        celebration: 'THE ULTIMATE CELEBRATION! All 20 rescued humans join the team for a HUGE KPop concert! Gwi-ma\'s grumpy castle transforms into a giant concert stage with lights and sparkles everywhere!'
    }
];

// Create a live demon instance from a type
function createDemon(typeId, levelScale) {
    const template = DEMON_TYPES[typeId];
    const scale = levelScale || 1;
    return {
        id: typeId + '_' + Math.random().toString(36).substr(2, 4),
        typeId: typeId,
        name: template.name,
        subtitle: template.subtitle,
        emoji: template.emoji,
        maxHp: Math.floor(template.hp * scale),
        hp: Math.floor(template.hp * scale),
        attack: Math.floor(template.attack * scale),
        defense: Math.floor(template.defense * scale),
        speed: template.speed,
        special: template.special || null,
        xpReward: Math.floor(template.xpReward * scale),
        crystalReward: Math.floor(template.crystalReward * scale),
        isDefeated: false
    };
}

// Create a boss instance
function createBoss(bossId, levelScale) {
    const template = BOSSES[bossId];
    const scale = levelScale || 1;
    return {
        id: bossId,
        name: template.name,
        title: template.title,
        emoji: template.emoji,
        maxHp: Math.floor(template.hp * scale),
        hp: Math.floor(template.hp * scale),
        attack: Math.floor(template.attack * scale),
        defense: Math.floor(template.defense * scale),
        speed: template.speed,
        phases: template.phases,
        currentPhase: 0,
        patternIndex: 0,
        xpReward: Math.floor(template.xpReward * scale),
        crystalReward: Math.floor(template.crystalReward * scale),
        isBoss: true,
        isDefeated: false
    };
}

// Create encounter enemies for a region
function createEncounter(region, encounterIndex) {
    const regionIndex = REGIONS.indexOf(region);
    const scale = 1 + regionIndex * 0.25;
    const encounter = region.encounters[encounterIndex];
    return encounter.enemies.map(typeId => createDemon(typeId, scale));
}
