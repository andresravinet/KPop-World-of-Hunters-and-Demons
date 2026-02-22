/* ===========================
   Characters: Rumi, Mira, Zoey & Jinu
   =========================== */

const CHARACTERS = {
    rumi: {
        name: 'Rumi',
        emoji: '🎤',
        role: 'KPop Idol / Demon Hunter',
        weapon: 'Enchanted Microphone',
        personality: 'Brave leader with the power of song',
        colorClass: 'rumi',
        baseStats: { hp: 100, attack: 15, defense: 10, speed: 12, spirit: 20 },
        abilities: [
            { name: 'Sonic Strike', level: 1, cost: 0, power: 18, type: 'attack', target: 'enemy',
              desc: 'A sparkly blast of sound energy!' },
            { name: 'Healing Chorus', level: 3, cost: 8, power: 30, type: 'heal', target: 'self',
              desc: 'Rumi sings a sweet song to restore her HP' },
            { name: 'Rhythm Shield', level: 5, cost: 10, power: 0, type: 'shield', target: 'team', duration: 3,
              desc: 'A shimmery bubble shield for 3 turns!' },
            { name: 'Encore', level: 8, cost: 12, power: 0, type: 'encore', target: 'self',
              desc: 'Repeat the last ability — double turn!' },
            { name: 'High Note Fury', level: 12, cost: 16, power: 25, type: 'attack_all', target: 'all_enemies',
              desc: 'A dazzling rainbow vocal blast!' },
            { name: 'Idol\'s Light', level: 16, cost: 25, power: 40, type: 'ultimate', target: 'all',
              desc: 'Giant burst of starlight — heals and zaps!' }
        ]
    },

    mira: {
        name: 'Mira',
        emoji: '🎀',
        role: 'Dancer / Support',
        weapon: 'Enchanted Ribbon Wand',
        personality: 'Brave, cheerful, always encouraging',
        colorClass: 'mira',
        baseStats: { hp: 80, attack: 10, defense: 12, speed: 16, spirit: 15 },
        abilities: [
            { name: 'Pep Talk', level: 1, cost: 5, power: 0, type: 'buff_attack', target: 'ally',
              desc: 'Boosts a friend\'s Attack with a cheer!' },
            { name: 'Dance Dodge', level: 3, cost: 8, power: 0, type: 'buff_dodge', target: 'team', duration: 2,
              desc: 'Makes the team harder to hit for 2 turns!' },
            { name: 'Sparkle Spin', level: 6, cost: 12, power: 15, type: 'attack_all', target: 'all_enemies',
              desc: 'A twirling dance attack that hits all enemies!' },
            { name: 'Best Friends Boost', level: 10, cost: 18, power: 0, type: 'buff_team', target: 'team',
              desc: 'Powers up the whole team\'s next moves!' }
        ]
    },

    zoey: {
        name: 'Zoey',
        emoji: '🎧',
        role: 'DJ / Healer',
        weapon: 'Magic Headphones',
        personality: 'Smart, funny, always has a plan',
        colorClass: 'zoey',
        baseStats: { hp: 85, attack: 8, defense: 14, speed: 10, spirit: 22 },
        abilities: [
            { name: 'Healing Beat', level: 1, cost: 6, power: 25, type: 'heal', target: 'ally',
              desc: 'Plays a soothing track to restore a friend\'s HP' },
            { name: 'Bass Drop', level: 3, cost: 8, power: 16, type: 'attack', target: 'enemy',
              desc: 'A thumpy sound wave that shakes enemies!' },
            { name: 'Remix Shield', level: 6, cost: 12, power: 0, type: 'shield', target: 'team', duration: 2,
              desc: 'Mixes a protective tune for the team!' },
            { name: 'Ultimate Mixtape', level: 10, cost: 22, power: 20, type: 'heal_and_attack', target: 'all',
              desc: 'Heals the whole team AND damages all enemies!' }
        ]
    },

    jinu: {
        name: 'Jinu',
        emoji: '🎸',
        role: 'Guardian / Tank',
        weapon: 'Glowing Guitar Shield',
        personality: 'Cool and quiet, secretly likes Rumi',
        colorClass: 'jinu',
        baseStats: { hp: 110, attack: 12, defense: 18, speed: 8, spirit: 14 },
        abilities: [
            { name: 'Power Chord', level: 1, cost: 0, power: 16, type: 'attack', target: 'enemy',
              desc: 'A strong sound blast from his guitar!' },
            { name: 'Shield Strum', level: 3, cost: 8, power: 0, type: 'protect', target: 'ally',
              desc: 'Takes hits for a teammate!' },
            { name: 'Rock Wall', level: 6, cost: 14, power: 0, type: 'block_all', target: 'team', duration: 1,
              desc: 'Blocks ALL attacks for 1 turn!' },
            { name: 'Heart\'s Courage', level: 10, cost: 18, power: 30, type: 'brave_attack', target: 'enemy',
              desc: 'When protecting Rumi, power doubles!' }
        ]
    }
};

// XP needed per level (level 1 = 0 XP, level 2 = 30 XP, etc.)
const XP_TABLE = [0, 0, 30, 70, 120, 180, 260, 360, 480, 620, 780, 960, 1160, 1400, 1680, 2000, 2400];

// Create a live character instance from template
function createCharacter(id) {
    const template = CHARACTERS[id];
    const stats = { ...template.baseStats };
    return {
        id: id,
        name: template.name,
        emoji: template.emoji,
        role: template.role,
        weapon: template.weapon,
        colorClass: template.colorClass,
        level: 1,
        xp: 0,
        maxHp: stats.hp,
        hp: stats.hp,
        maxSpirit: stats.spirit,
        spirit: stats.spirit,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
        buffs: [],
        isResting: false,
        isDefending: false,
        isProtecting: null,
        lastAbility: null
    };
}

// Get available abilities for a character at their current level
function getAvailableAbilities(charId, level) {
    return CHARACTERS[charId].abilities.filter(a => a.level <= level);
}

// Level up a character
function levelUp(char) {
    char.level++;
    const template = CHARACTERS[char.id];
    const growthRate = 1 + (char.level - 1) * 0.12;

    char.maxHp = Math.floor(template.baseStats.hp * growthRate);
    char.attack = Math.floor(template.baseStats.attack * growthRate);
    char.defense = Math.floor(template.baseStats.defense * growthRate);
    char.speed = Math.floor(template.baseStats.speed * growthRate);
    char.maxSpirit = Math.floor(template.baseStats.spirit * growthRate);

    // Full heal on level up!
    char.hp = char.maxHp;
    char.spirit = char.maxSpirit;

    return char.level;
}

// Check if character can level up, and do it
function checkLevelUp(char) {
    const levelsGained = [];
    while (char.level < 16 && char.xp >= XP_TABLE[char.level + 1]) {
        levelsGained.push(levelUp(char));
    }
    return levelsGained;
}

// Heal the whole team between battles (partial heal)
function restTeam(team) {
    team.forEach(char => {
        char.hp = Math.min(char.maxHp, char.hp + Math.floor(char.maxHp * 0.3));
        char.spirit = Math.min(char.maxSpirit, char.spirit + Math.floor(char.maxSpirit * 0.3));
        char.isResting = false;
        char.isDefending = false;
        char.isProtecting = null;
        char.buffs = [];
    });
}
