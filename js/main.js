/* ===========================
   Main Game Controller
   KPop Demon Hunters
   =========================== */

const Game = {
    team: [],
    state: {
        crystals: 0,
        totalRescued: 0,
        regionProgress: {},
        currentRegion: null,
        items: [
            { id: 'cookie', name: 'Star Cookie', emoji: '🍪', desc: 'Restores 30 HP', type: 'heal_hp', power: 30, target: 'ally', count: 5 },
            { id: 'juice', name: 'Sparkle Juice', emoji: '🧃', desc: 'Restores 15 SP', type: 'heal_sp', power: 15, target: 'ally', count: 3 },
            { id: 'plushie', name: 'Lucky Plushie', emoji: '🧸', desc: 'Wakes up a resting friend', type: 'revive', power: 0, target: 'ally', count: 2 }
        ]
    },
    introStep: 0,
    pendingRescue: false,
    pendingBossVictory: false,

    // Story intro dialogue
    introDialogue: [
        { portrait: '🎤', text: 'Hi! I\'m Rumi, a KPop idol! I love singing and performing on stage with my friends!' },
        { portrait: '🎤', text: 'But I have a secret... I can see through the veil between the human world and the Demon World!' },
        { portrait: '👹', text: 'BWAHAHA! I am Gwi-ma, the Demon King! I\'m capturing humans and bringing them to MY world!' },
        { portrait: '🎤', text: 'Oh no! Gwi-ma is kidnapping people! I have to save them!' },
        { portrait: '🎀', text: 'I\'m Mira! Rumi, you\'re not going alone! I\'ve got my ribbon wand ready!' },
        { portrait: '🎧', text: 'I\'m Zoey! I\'ve already got a plan. Let\'s mix some beats and save some people!' },
        { portrait: '🎸', text: 'I\'m... uh... Jinu. I\'ll protect you— I mean, protect EVERYONE. Let\'s go.' },
        { portrait: '🎤', text: 'Together, we\'ll use the power of music and friendship to stop Gwi-ma! Let\'s go, team!' }
    ],

    // Initialize the game
    init() {
        // Check for existing save
        if (Storage.hasSave()) {
            document.querySelector('.btn-load').style.display = 'inline-block';
        } else {
            document.querySelector('.btn-load').style.display = 'none';
        }

        this.showTitle();
    },

    // Show title screen
    showTitle() {
        UI.showScreen('title');

        if (Storage.hasSave()) {
            document.querySelector('.btn-load').style.display = 'inline-block';
        } else {
            document.querySelector('.btn-load').style.display = 'none';
        }
    },

    // Start story intro
    startIntro() {
        this.introStep = 0;
        UI.showScreen('intro');
        this.showIntroStep();
    },

    // Show current intro dialogue step
    showIntroStep() {
        const step = this.introDialogue[this.introStep];
        document.getElementById('intro-portrait').textContent = step.portrait;
        document.getElementById('intro-text').textContent = step.text;
    },

    // Advance intro dialogue
    nextIntro() {
        this.introStep++;
        if (this.introStep >= this.introDialogue.length) {
            // Intro done — create team and show character cards
            this.newGame();
        } else {
            this.showIntroStep();
        }
    },

    // Start a new game
    newGame() {
        this.team = [
            createCharacter('rumi'),
            createCharacter('mira'),
            createCharacter('zoey'),
            createCharacter('jinu')
        ];

        this.state = {
            crystals: 0,
            totalRescued: 0,
            regionProgress: {},
            currentRegion: null,
            items: [
                { id: 'cookie', name: 'Star Cookie', emoji: '🍪', desc: 'Restores 30 HP', type: 'heal_hp', power: 30, target: 'ally', count: 5 },
                { id: 'juice', name: 'Sparkle Juice', emoji: '🧃', desc: 'Restores 15 SP', type: 'heal_sp', power: 15, target: 'ally', count: 3 },
                { id: 'plushie', name: 'Lucky Plushie', emoji: '🧸', desc: 'Wakes up a resting friend', type: 'revive', power: 0, target: 'ally', count: 2 }
            ]
        };

        UI.renderTeamCards(this.team);
        UI.showScreen('team');
    },

    // Show world map
    showMap() {
        // Sync totalRescued
        this.state.totalRescued = World.getTotalRescued(this.state);
        UI.renderWorldMap(this.state);
        UI.showScreen('map');
    },

    // Enter a region
    enterRegion(regionId) {
        const region = World.getRegion(regionId);
        if (!region || !World.isUnlocked(this.state, regionId)) return;

        const progress = World.getProgress(this.state, regionId);
        if (progress.bossDefeated) return; // Already completed

        this.state.currentRegion = regionId;
        UI.renderRegion(region, this.state);
        UI.showScreen('region');
    },

    // Start a regular battle in the current region
    startBattle() {
        const region = World.getRegion(this.state.currentRegion);
        const encounterIndex = World.getNextEncounter(region, this.state);

        if (encounterIndex === null) return; // All battles done

        const enemies = createEncounter(region, encounterIndex);

        // Partial heal between battles
        restTeam(this.team);

        this.pendingRescue = false;
        this.pendingBossVictory = false;
        Battle.start(this.team, enemies, false);
    },

    // Start boss battle
    startBossBattle() {
        const region = World.getRegion(this.state.currentRegion);
        const boss = createBoss(region.bossId, 1 + REGIONS.indexOf(region) * 0.25);

        // Full heal before boss
        this.team.forEach(c => {
            c.hp = c.maxHp;
            c.spirit = c.maxSpirit;
            c.isResting = false;
            c.buffs = [];
        });

        this.pendingRescue = false;
        this.pendingBossVictory = true;
        Battle.start(this.team, [boss], true);
    },

    // Called after victory screen "Continue" button
    afterBattle() {
        if (this.pendingBossVictory) {
            // Boss was defeated
            const region = World.getRegion(this.state.currentRegion);
            World.recordBossDefeat(region, this.state);

            // Check if game complete
            if (World.isGameComplete(this.state)) {
                // Show final celebration then ending
                UI.showCelebration(region, this.state);
                UI.showScreen('celebration');
                this._finalCelebration = true;
                return;
            }

            // Show celebration for this region
            UI.showCelebration(region, this.state);
            UI.showScreen('celebration');
            this._finalCelebration = false;
            return;
        }

        // Regular battle — record win and check for rescue
        const region = World.getRegion(this.state.currentRegion);
        const rescued = World.recordBattleWin(region, this.state);

        if (rescued) {
            // Show rescue screen
            UI.showRescue(1, region.name);
            UI.showScreen('rescue');
        } else {
            // Back to region
            this.enterRegion(this.state.currentRegion);
        }
    },

    // After rescue screen
    afterRescue() {
        this.enterRegion(this.state.currentRegion);
    },

    // After celebration screen
    afterCelebration() {
        if (this._finalCelebration) {
            // Game complete!
            UI.showEnding(this.state);
            UI.showScreen('ending');
            Storage.deleteSave();
        } else {
            // Restock some items after region clear
            this.restockItems();
            this.showMap();
        }
    },

    // Restock items between regions
    restockItems() {
        const cookie = this.state.items.find(i => i.id === 'cookie');
        const juice = this.state.items.find(i => i.id === 'juice');
        const plushie = this.state.items.find(i => i.id === 'plushie');
        if (cookie) cookie.count = Math.min(cookie.count + 3, 10);
        if (juice) juice.count = Math.min(juice.count + 2, 8);
        if (plushie) plushie.count = Math.min(plushie.count + 1, 4);
    },

    // Save game
    saveGame() {
        const success = Storage.save(this.state, this.team);
        if (success) {
            alert('Game saved! 💾✨');
        } else {
            alert('Oops! Could not save. 😅');
        }
    },

    // Load game
    loadGame() {
        const saveData = Storage.load();
        if (!saveData) {
            alert('No saved game found! 🤔');
            return;
        }

        // Restore state
        this.state = saveData.state;

        // Rebuild team from save data
        this.team = saveData.team.map(saved => {
            const char = createCharacter(saved.id);
            char.level = saved.level;
            char.xp = saved.xp;
            char.hp = saved.hp;
            char.maxHp = saved.maxHp;
            char.spirit = saved.spirit;
            char.maxSpirit = saved.maxSpirit;
            char.attack = saved.attack;
            char.defense = saved.defense;
            char.speed = saved.speed;
            return char;
        });

        this.showMap();
    }
};

// Start the game when page loads
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
