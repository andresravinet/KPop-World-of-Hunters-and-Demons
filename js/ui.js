/* ===========================
   UI System
   Renders all game screens
   =========================== */

const UI = {

    // Switch to a screen by ID
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById('screen-' + screenId);
        if (screen) {
            screen.classList.add('active');
            screen.classList.add('fade-in');
            setTimeout(() => screen.classList.remove('fade-in'), 500);
        }
    },

    // Render team character cards (team screen)
    renderTeamCards(team) {
        const container = document.getElementById('team-cards');
        container.innerHTML = team.map(char => {
            const template = CHARACTERS[char.id];
            return `
                <div class="char-card ${char.colorClass} pop-in">
                    <span class="char-emoji">${char.emoji}</span>
                    <div class="char-name">${char.name}</div>
                    <div class="char-role">${char.role}</div>
                    <div class="char-weapon">${char.weapon}</div>
                    ${this.renderStatBars(char)}
                </div>
            `;
        }).join('');
    },

    // Render stat bars for a character card
    renderStatBars(char) {
        const maxStat = 25;
        const stats = [
            { label: 'HP', value: char.maxHp, max: 120, cls: 'hp' },
            { label: 'ATK', value: char.attack, max: maxStat, cls: 'atk' },
            { label: 'DEF', value: char.defense, max: maxStat, cls: 'def' },
            { label: 'SPD', value: char.speed, max: maxStat, cls: 'spd' },
            { label: 'SPR', value: char.maxSpirit, max: maxStat, cls: 'spr' }
        ];

        return stats.map(s => `
            <div class="stat-bar-container">
                <span class="stat-label">${s.label}</span>
                <div class="stat-bar">
                    <div class="stat-fill ${s.cls}" style="width: ${Math.min(100, (s.value / s.max) * 100)}%"></div>
                </div>
                <span class="stat-value">${s.value}</span>
            </div>
        `).join('');
    },

    // Render the world map
    renderWorldMap(gameState) {
        const container = document.getElementById('world-map');
        document.getElementById('map-rescued').textContent = `👥 Rescued: ${gameState.totalRescued}/20`;
        document.getElementById('map-crystals').textContent = `💎 Crystals: ${gameState.crystals}`;

        container.innerHTML = REGIONS.map((region, i) => {
            const progress = gameState.regionProgress[region.id] || { battlesWon: 0, rescued: 0, bossDefeated: false };
            const isCompleted = progress.bossDefeated;
            const isUnlocked = i === 0 || (gameState.regionProgress[REGIONS[i - 1].id] || {}).bossDefeated;
            const isCurrent = isUnlocked && !isCompleted;

            let statusText = '';
            let statusClass = '';
            if (isCompleted) {
                statusText = '✅ Complete!';
                statusClass = 'rescued';
            } else if (isUnlocked) {
                statusText = `👥 ${progress.rescued}/${region.humansToRescue}`;
                statusClass = 'rescued';
            } else {
                statusText = '🔒 Locked';
                statusClass = 'locked-text';
            }

            const regionClass = isCompleted ? 'completed' : (isCurrent ? 'current' : (isUnlocked ? '' : 'locked'));

            return `
                <div class="map-region ${regionClass}" onclick="${isUnlocked ? `Game.enterRegion('${region.id}')` : ''}">
                    <span class="region-icon">${region.icon}</span>
                    <div class="region-info">
                        <h3>${region.name}</h3>
                        <p>${region.desc}</p>
                    </div>
                    <span class="region-status ${statusClass}">${statusText}</span>
                </div>
            `;
        }).join('');
    },

    // Render region detail screen
    renderRegion(region, gameState) {
        const progress = gameState.regionProgress[region.id] || { battlesWon: 0, rescued: 0, bossDefeated: false };
        const totalBattles = region.encounters.length;
        const battlesNeeded = totalBattles;

        document.getElementById('region-name').textContent = `${region.icon} ${region.name}`;
        document.getElementById('region-desc').textContent = region.desc;

        const rescuePerBattles = Math.ceil(totalBattles / region.humansToRescue);

        document.getElementById('region-progress').innerHTML = `
            <h3>Progress</h3>
            <p>Battles won: ${progress.battlesWon} / ${totalBattles}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(progress.battlesWon / totalBattles) * 100}%"></div>
            </div>
            <p>Humans rescued: ${progress.rescued} / ${region.humansToRescue} 👥</p>
        `;

        const bossBtn = document.getElementById('btn-boss');
        if (progress.battlesWon >= totalBattles && !progress.bossDefeated) {
            bossBtn.style.display = 'inline-block';
        } else {
            bossBtn.style.display = 'none';
        }
    },

    // Render battle scene
    renderBattle(enemies, team) {
        // Enemies
        const enemyArea = document.getElementById('enemy-area');
        enemyArea.innerHTML = enemies.map(enemy => `
            <div class="enemy-sprite${enemy.isDefeated ? ' defeated' : ''}" id="enemy-${enemy.id}">
                <span class="enemy-emoji">${enemy.emoji}</span>
                <div class="enemy-name">${enemy.name}</div>
                <div class="enemy-hp-bar">
                    <div class="enemy-hp-fill" style="width: ${(enemy.hp / enemy.maxHp) * 100}%"></div>
                </div>
            </div>
        `).join('');

        // Team
        const teamArea = document.getElementById('team-area');
        teamArea.innerHTML = team.map(char => `
            <div class="team-member ${char.isResting ? 'resting' : ''} ${char.isDefending ? 'defending' : ''}" id="member-${char.id}">
                <span class="member-emoji">${char.emoji}</span>
                <div class="member-name ${char.id}-name">${char.name}</div>
                <div class="member-hp-bar">
                    <div class="member-hp-fill" id="hp-${char.id}" style="width: ${(char.hp / char.maxHp) * 100}%"></div>
                </div>
                <span class="member-hp-text">${char.hp}/${char.maxHp}</span>
                <div class="member-sp-bar">
                    <div class="member-sp-fill" id="sp-${char.id}" style="width: ${(char.spirit / char.maxSpirit) * 100}%"></div>
                </div>
                <span class="member-sp-text">SP ${char.spirit}</span>
            </div>
        `).join('');
    },

    // Update a single team member's display in battle
    updateMember(char) {
        const el = document.getElementById('member-' + char.id);
        if (!el) return;

        el.className = 'team-member' +
            (char.isResting ? ' resting' : '') +
            (char.isDefending ? ' defending' : '');

        const hpFill = document.getElementById('hp-' + char.id);
        if (hpFill) hpFill.style.width = (char.hp / char.maxHp) * 100 + '%';

        const spFill = document.getElementById('sp-' + char.id);
        if (spFill) spFill.style.width = (char.spirit / char.maxSpirit) * 100 + '%';

        const hpText = el.querySelector('.member-hp-text');
        if (hpText) hpText.textContent = `${Math.max(0, char.hp)}/${char.maxHp}`;

        const spText = el.querySelector('.member-sp-text');
        if (spText) spText.textContent = `SP ${char.spirit}`;
    },

    // Update enemy display
    updateEnemy(enemy) {
        const el = document.getElementById('enemy-' + enemy.id);
        if (!el) return;

        if (enemy.isDefeated) {
            el.classList.add('poof');
            setTimeout(() => el.classList.add('defeated'), 600);
        } else {
            const hpFill = el.querySelector('.enemy-hp-fill');
            if (hpFill) hpFill.style.width = (enemy.hp / enemy.maxHp) * 100 + '%';
        }
    },

    // Set active turn indicator
    setActiveTurn(charId) {
        document.querySelectorAll('.team-member').forEach(el => {
            el.classList.remove('active-turn', 'pulse');
        });
        const el = document.getElementById('member-' + charId);
        if (el) {
            el.classList.add('active-turn', 'pulse');
        }
    },

    // Show battle action menu for a character
    showActionMenu(char) {
        const label = document.getElementById('battle-turn-label');
        label.textContent = `${char.emoji} ${char.name}'s Turn!`;

        const actions = document.getElementById('battle-actions');
        actions.innerHTML = `
            <button class="btn btn-action attack" onclick="Battle.chooseAction('attack')">⚡ Attack</button>
            <button class="btn btn-action ability" onclick="Battle.showAbilities()">✨ Ability</button>
            <button class="btn btn-action item" onclick="Battle.showItems()">🎒 Item</button>
            <button class="btn btn-action defend" onclick="Battle.chooseAction('defend')">🛡️ Defend</button>
        `;
    },

    // Show ability sub-menu
    showAbilityMenu(char) {
        const abilities = getAvailableAbilities(char.id, char.level);
        const actions = document.getElementById('battle-actions');

        actions.innerHTML = `
            <div class="ability-list">
                ${abilities.map(a => `
                    <button class="ability-btn" onclick="Battle.chooseAbility('${a.name}')"
                        ${char.spirit < a.cost ? 'disabled' : ''}>
                        ${a.name} — ${a.desc}
                        <span class="ability-cost">${a.cost > 0 ? a.cost + ' SP' : 'Free!'}</span>
                    </button>
                `).join('')}
                <button class="btn btn-back" onclick="Battle.showMainMenu()">← Back</button>
            </div>
        `;
    },

    // Show item sub-menu
    showItemMenu(items) {
        const actions = document.getElementById('battle-actions');

        if (items.length === 0) {
            actions.innerHTML = `
                <div class="item-list">
                    <p style="color: var(--coral); font-weight: 700;">No items! 😅</p>
                    <button class="btn btn-back" onclick="Battle.showMainMenu()">← Back</button>
                </div>
            `;
            return;
        }

        actions.innerHTML = `
            <div class="item-list">
                ${items.map(item => `
                    <button class="item-btn" onclick="Battle.useItem('${item.id}')"
                        ${item.count <= 0 ? 'disabled' : ''}>
                        ${item.emoji} ${item.name} — ${item.desc}
                        <span class="item-count">x${item.count}</span>
                    </button>
                `).join('')}
                <button class="btn btn-back" onclick="Battle.showMainMenu()">← Back</button>
            </div>
        `;
    },

    // Show target selection overlay
    showTargetSelect(title, targets, callback) {
        const overlay = document.getElementById('target-overlay');
        document.getElementById('target-title').textContent = title;

        const buttons = document.getElementById('target-buttons');
        buttons.innerHTML = targets.map(t => `
            <button class="btn btn-target" onclick="${callback}('${t.id}')">
                ${t.emoji} ${t.name} ${t.hp !== undefined ? `(HP: ${t.hp}/${t.maxHp})` : ''}
            </button>
        `).join('');

        overlay.style.display = 'flex';
    },

    hideTargetSelect() {
        document.getElementById('target-overlay').style.display = 'none';
    },

    // Add message to battle log
    battleLog(message, type) {
        const log = document.getElementById('battle-log');
        const p = document.createElement('p');
        p.className = 'log-' + (type || 'info');
        p.textContent = message;
        log.appendChild(p);
        log.scrollTop = log.scrollHeight;
    },

    clearBattleLog() {
        document.getElementById('battle-log').innerHTML = '';
    },

    // Apply a visual effect to an element
    applyEffect(elementId, effectClass) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.classList.remove(effectClass);
        void el.offsetWidth; // Force reflow
        el.classList.add(effectClass);
        setTimeout(() => el.classList.remove(effectClass), 1000);
    },

    // Show victory screen
    showVictory(xpGained, crystalsGained, levelsGained) {
        const details = document.getElementById('victory-details');
        let html = `
            <h3>Battle Won!</h3>
            <p>⭐ XP Gained: +${xpGained}</p>
            <p>💎 Crystals: +${crystalsGained}</p>
        `;

        if (levelsGained.length > 0) {
            html += '<hr style="margin: 10px 0; border-color: #EEE;">';
            levelsGained.forEach(lg => {
                html += `<p style="color: var(--gold);">🎉 ${lg.name} leveled up to Lv.${lg.level}!</p>`;
                if (lg.newAbility) {
                    html += `<p style="color: var(--purple);">✨ New ability: ${lg.newAbility}!</p>`;
                }
            });
        }

        details.innerHTML = html;
    },

    // Show rescue screen
    showRescue(count, regionName) {
        const details = document.getElementById('rescue-details');
        details.innerHTML = `
            <p style="font-size: 2em;">👥</p>
            <p>You rescued <strong>${count}</strong> person${count > 1 ? 's' : ''}!</p>
            <p>They're safe now thanks to the team!</p>
        `;
    },

    // Show celebration screen
    showCelebration(region, gameState) {
        const progress = gameState.regionProgress[region.id];
        document.getElementById('celebration-text').innerHTML = `<p>${region.celebration}</p>`;
        document.getElementById('celebration-stats').innerHTML = `
            <p>👥 Humans rescued: ${progress.rescued}/${region.humansToRescue}</p>
            <p>⚔️ Battles won: ${progress.battlesWon}</p>
            <p>💎 Total crystals: ${gameState.crystals}</p>
        `;
    },

    // Show ending screen
    showEnding(gameState) {
        document.getElementById('ending-text').innerHTML = `
            <p>Rumi, Mira, Zoey, and Jinu defeated Gwi-ma and saved all 20 humans!</p>
            <p>The Demon World is free from Gwi-ma's grumpy reign. Music and happiness fill every corner!</p>
            <p>The team performs one last amazing concert as the barrier between worlds is sealed with the power of friendship and music!</p>
            <p>Gwi-ma? He's not so grumpy anymore... he's actually tapping his foot to the beat! 🎵</p>
        `;
    }
};
