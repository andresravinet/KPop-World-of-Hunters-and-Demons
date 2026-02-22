/* ===========================
   World Map & Region Logic
   =========================== */

const World = {

    // Get region by ID
    getRegion(regionId) {
        return REGIONS.find(r => r.id === regionId);
    },

    // Get or create region progress
    getProgress(gameState, regionId) {
        if (!gameState.regionProgress[regionId]) {
            gameState.regionProgress[regionId] = {
                battlesWon: 0,
                rescued: 0,
                bossDefeated: false
            };
        }
        return gameState.regionProgress[regionId];
    },

    // Check if a region is unlocked
    isUnlocked(gameState, regionId) {
        const regionIndex = REGIONS.findIndex(r => r.id === regionId);
        if (regionIndex === 0) return true;
        const prevRegion = REGIONS[regionIndex - 1];
        const prevProgress = this.getProgress(gameState, prevRegion.id);
        return prevProgress.bossDefeated;
    },

    // Get the next encounter for a region (or null if all battles done)
    getNextEncounter(region, gameState) {
        const progress = this.getProgress(gameState, region.id);
        if (progress.battlesWon >= region.encounters.length) {
            return null; // All encounters done — boss time!
        }
        return progress.battlesWon;
    },

    // Record a battle win in a region
    recordBattleWin(region, gameState) {
        const progress = this.getProgress(gameState, region.id);
        progress.battlesWon++;

        // Check if a rescue happens
        const rescueInterval = Math.ceil(region.encounters.length / region.humansToRescue);
        if (progress.battlesWon % rescueInterval === 0 && progress.rescued < region.humansToRescue) {
            progress.rescued++;
            gameState.totalRescued++;
            return true; // Rescue happened!
        }
        return false;
    },

    // Record boss defeat
    recordBossDefeat(region, gameState) {
        const progress = this.getProgress(gameState, region.id);
        progress.bossDefeated = true;

        // Rescue remaining humans in this region
        const remaining = region.humansToRescue - progress.rescued;
        if (remaining > 0) {
            progress.rescued = region.humansToRescue;
            gameState.totalRescued += remaining;
        }
    },

    // Check if all regions are complete
    isGameComplete(gameState) {
        return REGIONS.every(r => {
            const progress = this.getProgress(gameState, r.id);
            return progress.bossDefeated;
        });
    },

    // Get total rescue count
    getTotalRescued(gameState) {
        let total = 0;
        REGIONS.forEach(r => {
            const progress = this.getProgress(gameState, r.id);
            total += progress.rescued;
        });
        return total;
    }
};
