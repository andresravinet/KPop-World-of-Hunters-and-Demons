/* ===========================
   Save / Load System
   Uses localStorage
   =========================== */

const Storage = {
    SAVE_KEY: 'kpop_demon_hunters_save',

    // Save game state
    save(gameState, team) {
        const saveData = {
            version: 1,
            timestamp: Date.now(),
            state: {
                crystals: gameState.crystals,
                totalRescued: gameState.totalRescued,
                regionProgress: gameState.regionProgress,
                currentRegion: gameState.currentRegion,
                items: gameState.items
            },
            team: team.map(char => ({
                id: char.id,
                level: char.level,
                xp: char.xp,
                hp: char.hp,
                maxHp: char.maxHp,
                spirit: char.spirit,
                maxSpirit: char.maxSpirit,
                attack: char.attack,
                defense: char.defense,
                speed: char.speed
            }))
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Failed to save:', e);
            return false;
        }
    },

    // Load game state
    load() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            if (!data) return null;
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to load:', e);
            return null;
        }
    },

    // Check if a save exists
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    },

    // Delete save
    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
    }
};
