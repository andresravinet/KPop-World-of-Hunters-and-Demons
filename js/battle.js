/* ===========================
   Turn-Based Battle System
   Sparkly and fun!
   =========================== */

const Battle = {
    team: [],
    enemies: [],
    currentCharIndex: 0,
    isBossBattle: false,
    turnActions: [],
    isAnimating: false,

    // Start a new battle
    start(team, enemies, isBoss) {
        this.team = team;
        this.enemies = enemies;
        this.isBossBattle = isBoss || false;
        this.currentCharIndex = 0;
        this.turnActions = [];
        this.isAnimating = false;

        // Reset battle states
        this.team.forEach(c => {
            c.isDefending = false;
            c.isProtecting = null;
        });

        UI.showScreen('battle');
        UI.clearBattleLog();
        UI.renderBattle(this.enemies, this.team);

        if (this.isBossBattle) {
            const boss = this.enemies[0];
            UI.battleLog(`${boss.emoji} ${boss.name} — ${boss.title} appears!`, 'special');
        } else {
            UI.battleLog('Silly demons appeared! Time to battle!', 'info');
        }

        this.startPlayerTurn();
    },

    // Begin player turn phase — pick actions for each character
    startPlayerTurn() {
        // Reset defending status
        this.team.forEach(c => {
            c.isDefending = false;
            c.isProtecting = null;
        });

        this.currentCharIndex = 0;
        this.turnActions = [];
        this.promptNextCharacter();
    },

    // Move to next character for action selection
    promptNextCharacter() {
        // Skip resting characters
        while (this.currentCharIndex < this.team.length && this.team[this.currentCharIndex].isResting) {
            this.currentCharIndex++;
        }

        if (this.currentCharIndex >= this.team.length) {
            // All characters have chosen — execute the turn
            this.executeTurn();
            return;
        }

        const char = this.team[this.currentCharIndex];
        UI.setActiveTurn(char.id);
        this.showMainMenu();
    },

    // Show main action menu for current character
    showMainMenu() {
        const char = this.team[this.currentCharIndex];
        UI.showActionMenu(char);
    },

    // Show abilities sub-menu
    showAbilities() {
        const char = this.team[this.currentCharIndex];
        UI.showAbilityMenu(char);
    },

    // Show items sub-menu
    showItems() {
        UI.showItemMenu(Game.state.items);
    },

    // Player chose a basic action
    chooseAction(action) {
        if (this.isAnimating) return;
        const char = this.team[this.currentCharIndex];

        if (action === 'attack') {
            const aliveEnemies = this.enemies.filter(e => !e.isDefeated);
            if (aliveEnemies.length === 1) {
                this.turnActions.push({ char, action: 'attack', target: aliveEnemies[0] });
                this.currentCharIndex++;
                this.promptNextCharacter();
            } else {
                UI.showTargetSelect('Attack who?', aliveEnemies, 'Battle.selectEnemyTarget');
            }
        } else if (action === 'defend') {
            this.turnActions.push({ char, action: 'defend' });
            this.currentCharIndex++;
            this.promptNextCharacter();
        }
    },

    // Choose an ability
    chooseAbility(abilityName) {
        if (this.isAnimating) return;
        const char = this.team[this.currentCharIndex];
        const abilities = getAvailableAbilities(char.id, char.level);
        const ability = abilities.find(a => a.name === abilityName);
        if (!ability || char.spirit < ability.cost) return;

        // Determine target
        if (ability.target === 'enemy') {
            const aliveEnemies = this.enemies.filter(e => !e.isDefeated);
            if (aliveEnemies.length === 1) {
                this.turnActions.push({ char, action: 'ability', ability, target: aliveEnemies[0] });
                this.currentCharIndex++;
                this.promptNextCharacter();
            } else {
                this._pendingAbility = ability;
                UI.showTargetSelect(`${ability.name} — target?`, aliveEnemies, 'Battle.selectAbilityEnemyTarget');
            }
        } else if (ability.target === 'ally') {
            const aliveAllies = this.team.filter(c => !c.isResting);
            this._pendingAbility = ability;
            UI.showTargetSelect(`${ability.name} — who?`, aliveAllies, 'Battle.selectAllyTarget');
        } else {
            // self, team, all_enemies, all
            this.turnActions.push({ char, action: 'ability', ability });
            this.currentCharIndex++;
            this.promptNextCharacter();
        }
    },

    // Target selection callbacks
    selectEnemyTarget(enemyId) {
        UI.hideTargetSelect();
        const enemy = Battle.enemies.find(e => e.id === enemyId);
        const char = Battle.team[Battle.currentCharIndex];
        Battle.turnActions.push({ char, action: 'attack', target: enemy });
        Battle.currentCharIndex++;
        Battle.promptNextCharacter();
    },

    selectAbilityEnemyTarget(enemyId) {
        UI.hideTargetSelect();
        const enemy = Battle.enemies.find(e => e.id === enemyId);
        const char = Battle.team[Battle.currentCharIndex];
        Battle.turnActions.push({ char, action: 'ability', ability: Battle._pendingAbility, target: enemy });
        Battle.currentCharIndex++;
        Battle.promptNextCharacter();
    },

    selectAllyTarget(charId) {
        UI.hideTargetSelect();
        const ally = Battle.team.find(c => c.id === charId);
        const char = Battle.team[Battle.currentCharIndex];
        Battle.turnActions.push({ char, action: 'ability', ability: Battle._pendingAbility, target: ally });
        Battle.currentCharIndex++;
        Battle.promptNextCharacter();
    },

    cancelTarget() {
        UI.hideTargetSelect();
        this.showMainMenu();
    },

    // Use an item
    useItem(itemId) {
        if (this.isAnimating) return;
        const item = Game.state.items.find(i => i.id === itemId);
        if (!item || item.count <= 0) return;

        const char = this.team[this.currentCharIndex];

        if (item.target === 'ally') {
            const aliveAllies = this.team.filter(c => !c.isResting);
            this._pendingItem = item;
            UI.showTargetSelect(`Use ${item.name} on who?`, aliveAllies, 'Battle.selectItemTarget');
        } else {
            this.turnActions.push({ char, action: 'item', item });
            item.count--;
            this.currentCharIndex++;
            this.promptNextCharacter();
        }
    },

    selectItemTarget(charId) {
        UI.hideTargetSelect();
        const ally = Battle.team.find(c => c.id === charId);
        const char = Battle.team[Battle.currentCharIndex];
        const item = Battle._pendingItem;
        Battle.turnActions.push({ char, action: 'item', item, target: ally });
        item.count--;
        Battle.currentCharIndex++;
        Battle.promptNextCharacter();
    },

    // Execute the full turn (player actions then enemy actions)
    async executeTurn() {
        this.isAnimating = true;
        const actions = document.getElementById('battle-actions');
        actions.innerHTML = '<p style="color: var(--gold); font-weight: 700;">⚡ Battle in progress... ⚡</p>';

        // Execute player actions
        for (const action of this.turnActions) {
            await this.executePlayerAction(action);
            if (this.checkBattleEnd()) return;
        }

        // Execute enemy actions
        await this.executeEnemyTurn();
        if (this.checkBattleEnd()) return;

        // Tick down buffs
        this.tickBuffs();

        this.isAnimating = false;
        this.startPlayerTurn();
    },

    // Execute a single player action
    async executePlayerAction(action) {
        const { char, target } = action;

        if (action.action === 'attack') {
            const damage = this.calcDamage(char.attack, target.defense);
            target.hp = Math.max(0, target.hp - damage);
            UI.battleLog(`${char.emoji} ${char.name} attacks ${target.emoji} ${target.name} for ${damage} damage!`, 'player');
            UI.applyEffect('enemy-' + target.id, 'flash-hit');
            await this.wait(500);

            if (target.hp <= 0) {
                target.isDefeated = true;
                UI.battleLog(`${target.emoji} ${target.name} poofs into sparkles! ✨`, 'special');
                UI.updateEnemy(target);
                // Jinu hearts when Rumi defeats an enemy
                if (char.id === 'rumi') {
                    const jinuEl = document.getElementById('member-jinu');
                    if (jinuEl) {
                        jinuEl.classList.add('jinu-hearts');
                        setTimeout(() => jinuEl.classList.remove('jinu-hearts'), 1500);
                    }
                }
            } else {
                UI.updateEnemy(target);
            }

        } else if (action.action === 'defend') {
            char.isDefending = true;
            UI.battleLog(`${char.emoji} ${char.name} is defending! 🛡️`, 'info');
            UI.applyEffect('member-' + char.id, 'shield-up');
            UI.updateMember(char);
            await this.wait(300);

        } else if (action.action === 'ability') {
            await this.executeAbility(char, action.ability, target);

        } else if (action.action === 'item') {
            await this.executeItem(char, action.item, target);
        }
    },

    // Execute an ability
    async executeAbility(char, ability, target) {
        char.spirit = Math.max(0, char.spirit - ability.cost);
        UI.updateMember(char);
        char.lastAbility = ability;

        switch (ability.type) {
            case 'attack':
                const dmg = this.calcDamage(ability.power + char.attack * 0.5, target.defense);
                target.hp = Math.max(0, target.hp - dmg);
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! ${dmg} damage! ✨`, 'player');
                UI.applyEffect('enemy-' + target.id, 'sparkle-burst');
                await this.wait(600);
                if (target.hp <= 0) {
                    target.isDefeated = true;
                    UI.battleLog(`${target.emoji} ${target.name} poofs into sparkles! ✨`, 'special');
                }
                UI.updateEnemy(target);
                if (char.id === 'rumi' && target.isDefeated) {
                    const jinuEl = document.getElementById('member-jinu');
                    if (jinuEl) { jinuEl.classList.add('jinu-hearts'); setTimeout(() => jinuEl.classList.remove('jinu-hearts'), 1500); }
                }
                break;

            case 'attack_all': {
                const aliveEnemies = this.enemies.filter(e => !e.isDefeated);
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! Hits everyone! 🌈`, 'special');
                UI.applyEffect('screen-battle', 'screen-shake');
                await this.wait(300);
                for (const enemy of aliveEnemies) {
                    const d = this.calcDamage(ability.power + char.attack * 0.3, enemy.defense);
                    enemy.hp = Math.max(0, enemy.hp - d);
                    UI.applyEffect('enemy-' + enemy.id, 'flash-hit');
                    if (enemy.hp <= 0) {
                        enemy.isDefeated = true;
                        UI.battleLog(`${enemy.emoji} ${enemy.name} poofs! ✨`, 'special');
                    }
                    UI.updateEnemy(enemy);
                }
                await this.wait(400);
                break;
            }

            case 'heal':
                const healTarget = target || char;
                const healAmt = ability.power + Math.floor(char.maxSpirit * 0.3);
                healTarget.hp = Math.min(healTarget.maxHp, healTarget.hp + healAmt);
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! ${healTarget.name} heals ${healAmt} HP! 💚`, 'heal');
                UI.applyEffect('member-' + healTarget.id, 'heal-glow');
                UI.updateMember(healTarget);
                await this.wait(500);
                break;

            case 'shield':
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! Team shielded! 🛡️✨`, 'info');
                this.team.forEach(c => {
                    if (!c.isResting) {
                        c.buffs.push({ type: 'shield', duration: ability.duration, reduction: 0.4 });
                        UI.applyEffect('member-' + c.id, 'shield-up');
                    }
                });
                await this.wait(500);
                break;

            case 'buff_attack':
                const buffTarget = target || char;
                buffTarget.buffs.push({ type: 'attack_up', duration: 3, bonus: Math.floor(char.attack * 0.5) });
                UI.battleLog(`${char.emoji} ${char.name} cheers on ${buffTarget.name}! Attack UP! 💪`, 'heal');
                UI.applyEffect('member-' + buffTarget.id, 'buff-sparkle');
                await this.wait(400);
                break;

            case 'buff_dodge':
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! Team is harder to hit! 💃`, 'info');
                this.team.forEach(c => {
                    if (!c.isResting) {
                        c.buffs.push({ type: 'dodge', duration: ability.duration, chance: 0.35 });
                    }
                });
                await this.wait(400);
                break;

            case 'buff_team':
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! Everyone powered up! 🌟`, 'special');
                this.team.forEach(c => {
                    if (!c.isResting) {
                        c.buffs.push({ type: 'attack_up', duration: 2, bonus: Math.floor(char.attack * 0.4) });
                        UI.applyEffect('member-' + c.id, 'buff-sparkle');
                    }
                });
                await this.wait(500);
                break;

            case 'protect':
                const protectTarget = target;
                char.isProtecting = protectTarget.id;
                UI.battleLog(`${char.emoji} ${char.name} guards ${protectTarget.name}! 🛡️`, 'info');
                UI.applyEffect('member-' + char.id, 'shield-up');
                await this.wait(400);
                break;

            case 'block_all':
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! TOTAL BLOCK! 🧱`, 'special');
                this.team.forEach(c => {
                    if (!c.isResting) {
                        c.buffs.push({ type: 'block', duration: 1 });
                        UI.applyEffect('member-' + c.id, 'shield-up');
                    }
                });
                await this.wait(500);
                break;

            case 'brave_attack': {
                let power = ability.power + char.attack * 0.5;
                // Double power when protecting Rumi!
                if (char.isProtecting === 'rumi' || char.id === 'jinu') {
                    const rumi = this.team.find(c => c.id === 'rumi');
                    if (rumi && !rumi.isResting) {
                        power *= 2;
                        UI.battleLog(`${char.emoji} Jinu's courage surges! DOUBLE POWER! 💕`, 'special');
                        const jinuEl = document.getElementById('member-jinu');
                        if (jinuEl) { jinuEl.classList.add('jinu-hearts'); setTimeout(() => jinuEl.classList.remove('jinu-hearts'), 1500); }
                    }
                }
                const braveDmg = this.calcDamage(power, target.defense);
                target.hp = Math.max(0, target.hp - braveDmg);
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! ${braveDmg} damage! 💥`, 'player');
                UI.applyEffect('enemy-' + target.id, 'sparkle-burst');
                UI.applyEffect('screen-battle', 'screen-shake');
                await this.wait(600);
                if (target.hp <= 0) {
                    target.isDefeated = true;
                    UI.battleLog(`${target.emoji} ${target.name} poofs! ✨`, 'special');
                }
                UI.updateEnemy(target);
                break;
            }

            case 'encore': {
                const lastAbility = char.lastAbility;
                if (lastAbility && lastAbility.type !== 'encore') {
                    UI.battleLog(`${char.emoji} ${char.name} does an Encore! 🔁`, 'special');
                    await this.wait(300);
                    const encoreTarget = this.enemies.find(e => !e.isDefeated) || char;
                    await this.executeAbility(char, lastAbility, encoreTarget);
                } else {
                    UI.battleLog(`${char.emoji} ${char.name} tries an Encore... but nothing to repeat! 😅`, 'info');
                    await this.wait(300);
                }
                break;
            }

            case 'ultimate':
                UI.battleLog(`${char.emoji} ${char.name} uses ${ability.name}! ULTIMATE POWER! 🌟✨🌟`, 'special');
                UI.applyEffect('screen-battle', 'screen-shake');
                await this.wait(400);
                // Heal team
                this.team.forEach(c => {
                    if (!c.isResting) {
                        c.hp = c.maxHp;
                        UI.applyEffect('member-' + c.id, 'heal-glow');
                        UI.updateMember(c);
                    }
                });
                await this.wait(300);
                // Damage all enemies
                const aliveEnemies = this.enemies.filter(e => !e.isDefeated);
                for (const enemy of aliveEnemies) {
                    const d = this.calcDamage(ability.power + char.attack, enemy.defense);
                    enemy.hp = Math.max(0, enemy.hp - d);
                    UI.applyEffect('enemy-' + enemy.id, 'sparkle-burst');
                    if (enemy.hp <= 0) {
                        enemy.isDefeated = true;
                        UI.battleLog(`${enemy.emoji} ${enemy.name} poofs! ✨`, 'special');
                    }
                    UI.updateEnemy(enemy);
                }
                await this.wait(500);
                break;

            case 'heal_and_attack':
                UI.battleLog(`${char.emoji} ${char.name} drops the ${ability.name}! 🎵`, 'special');
                // Heal team
                this.team.forEach(c => {
                    if (!c.isResting) {
                        const heal = Math.floor(ability.power * 0.8);
                        c.hp = Math.min(c.maxHp, c.hp + heal);
                        UI.applyEffect('member-' + c.id, 'heal-glow');
                        UI.updateMember(c);
                    }
                });
                await this.wait(400);
                // Damage enemies
                const alive = this.enemies.filter(e => !e.isDefeated);
                for (const enemy of alive) {
                    const d = this.calcDamage(ability.power + char.attack * 0.3, enemy.defense);
                    enemy.hp = Math.max(0, enemy.hp - d);
                    UI.applyEffect('enemy-' + enemy.id, 'flash-hit');
                    if (enemy.hp <= 0) {
                        enemy.isDefeated = true;
                        UI.battleLog(`${enemy.emoji} ${enemy.name} poofs! ✨`, 'special');
                    }
                    UI.updateEnemy(enemy);
                }
                await this.wait(400);
                break;
        }
    },

    // Execute an item use
    async executeItem(char, item, target) {
        const t = target || char;
        switch (item.type) {
            case 'heal_hp':
                t.hp = Math.min(t.maxHp, t.hp + item.power);
                UI.battleLog(`${char.emoji} ${char.name} uses ${item.emoji} ${item.name} on ${t.name}! +${item.power} HP! 💚`, 'heal');
                UI.applyEffect('member-' + t.id, 'heal-glow');
                UI.updateMember(t);
                break;
            case 'heal_sp':
                t.spirit = Math.min(t.maxSpirit, t.spirit + item.power);
                UI.battleLog(`${char.emoji} ${char.name} uses ${item.emoji} ${item.name} on ${t.name}! +${item.power} SP! 💜`, 'heal');
                UI.applyEffect('member-' + t.id, 'buff-sparkle');
                UI.updateMember(t);
                break;
            case 'revive':
                if (t.isResting) {
                    t.isResting = false;
                    t.hp = Math.floor(t.maxHp * 0.5);
                    UI.battleLog(`${char.emoji} ${t.name} is back in action! 🌟`, 'special');
                    UI.applyEffect('member-' + t.id, 'heal-glow');
                    UI.updateMember(t);
                }
                break;
        }
        await this.wait(500);
    },

    // Enemy turn
    async executeEnemyTurn() {
        const aliveEnemies = this.enemies.filter(e => !e.isDefeated);

        for (const enemy of aliveEnemies) {
            if (enemy.isBoss) {
                await this.executeBossAction(enemy);
            } else {
                await this.executeEnemyAction(enemy);
            }
            if (this.team.every(c => c.isResting)) break;
        }
    },

    // Regular enemy action
    async executeEnemyAction(enemy) {
        const aliveTeam = this.team.filter(c => !c.isResting);
        if (aliveTeam.length === 0) return;

        const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];

        // Check if someone is protecting this target
        const protector = this.team.find(c => c.isProtecting === target.id && !c.isResting);
        const actualTarget = protector || target;

        // Special abilities
        if (enemy.special && Math.random() < 0.3) {
            await this.executeEnemySpecial(enemy, actualTarget);
            return;
        }

        let damage = this.calcDamage(enemy.attack, actualTarget.defense);

        // Check dodge buff
        const dodgeBuff = actualTarget.buffs.find(b => b.type === 'dodge');
        if (dodgeBuff && Math.random() < dodgeBuff.chance) {
            UI.battleLog(`${enemy.emoji} ${enemy.name} attacks ${actualTarget.name}... but misses! 💨`, 'enemy');
            await this.wait(400);
            return;
        }

        // Check block buff
        const blockBuff = actualTarget.buffs.find(b => b.type === 'block');
        if (blockBuff) {
            UI.battleLog(`${enemy.emoji} ${enemy.name} attacks... BLOCKED! 🧱`, 'info');
            await this.wait(400);
            return;
        }

        // Check shield buff
        const shieldBuff = actualTarget.buffs.find(b => b.type === 'shield');
        if (shieldBuff) damage = Math.floor(damage * (1 - shieldBuff.reduction));

        // Check defending
        if (actualTarget.isDefending) damage = Math.floor(damage * 0.5);

        actualTarget.hp = Math.max(0, actualTarget.hp - damage);

        if (protector && protector !== target) {
            UI.battleLog(`${enemy.emoji} ${enemy.name} attacks ${target.name}, but ${protector.name} takes the hit! ${damage} damage!`, 'enemy');
        } else {
            UI.battleLog(`${enemy.emoji} ${enemy.name} attacks ${actualTarget.name} for ${damage} damage!`, 'enemy');
        }
        UI.applyEffect('member-' + actualTarget.id, 'flash-hit');
        UI.updateMember(actualTarget);
        await this.wait(500);

        if (actualTarget.hp <= 0) {
            actualTarget.isResting = true;
            actualTarget.isProtecting = null;
            UI.battleLog(`${actualTarget.emoji} ${actualTarget.name} needs a rest! 😴`, 'enemy');
            UI.updateMember(actualTarget);
        }
    },

    // Enemy special attack
    async executeEnemySpecial(enemy, target) {
        switch (enemy.special) {
            case 'stun':
                UI.battleLog(`${enemy.emoji} ${enemy.name} yells silly nonsense at ${target.name}! Stunned! 🗣️😵`, 'enemy');
                target.buffs.push({ type: 'stun', duration: 1 });
                UI.applyEffect('member-' + target.id, 'flash-hit');
                break;
            case 'confuse':
                UI.battleLog(`${enemy.emoji} ${enemy.name} makes silly illusions! ${target.name} is confused! 😵‍💫`, 'enemy');
                target.buffs.push({ type: 'confuse', duration: 1 });
                break;
            case 'slow':
                UI.battleLog(`${enemy.emoji} ${enemy.name} splatters goo on ${target.name}! Slowed down! 🫠`, 'enemy');
                target.buffs.push({ type: 'slow', duration: 2 });
                break;
        }
        await this.wait(500);
    },

    // Boss action (uses phase patterns)
    async executeBossAction(boss) {
        // Determine phase based on HP
        const hpRatio = boss.hp / boss.maxHp;
        let phase = boss.phases[0];
        for (let i = boss.phases.length - 1; i >= 0; i--) {
            if (hpRatio <= boss.phases[i].hpThreshold) {
                phase = boss.phases[i];
                break;
            }
        }

        const actionName = phase.pattern[boss.patternIndex % phase.pattern.length];
        boss.patternIndex++;

        const aliveTeam = this.team.filter(c => !c.isResting);
        if (aliveTeam.length === 0) return;

        const randomTarget = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];

        switch (actionName) {
            case 'attack': {
                const dmg = this.calcDamage(boss.attack, randomTarget.defense);
                const actualDmg = this.applyDefenses(randomTarget, dmg);
                randomTarget.hp = Math.max(0, randomTarget.hp - actualDmg);
                UI.battleLog(`${boss.emoji} ${boss.name} attacks ${randomTarget.name} for ${actualDmg}!`, 'enemy');
                UI.applyEffect('member-' + randomTarget.id, 'flash-hit');
                UI.updateMember(randomTarget);
                if (randomTarget.hp <= 0) { randomTarget.isResting = true; UI.battleLog(`${randomTarget.name} needs a rest! 😴`, 'enemy'); UI.updateMember(randomTarget); }
                break;
            }
            case 'power_attack': {
                const dmg = this.calcDamage(boss.attack * 1.5, randomTarget.defense);
                const actualDmg = this.applyDefenses(randomTarget, dmg);
                randomTarget.hp = Math.max(0, randomTarget.hp - actualDmg);
                UI.battleLog(`${boss.emoji} ${boss.name} does a POWER ATTACK on ${randomTarget.name}! ${actualDmg} damage! 💥`, 'enemy');
                UI.applyEffect('member-' + randomTarget.id, 'flash-hit');
                UI.applyEffect('screen-battle', 'screen-shake');
                UI.updateMember(randomTarget);
                if (randomTarget.hp <= 0) { randomTarget.isResting = true; UI.battleLog(`${randomTarget.name} needs a rest! 😴`, 'enemy'); UI.updateMember(randomTarget); }
                break;
            }
            case 'silence':
            case 'freeze':
                UI.battleLog(`${boss.emoji} ${boss.name} tries to ${actionName} ${randomTarget.name}! 🥶`, 'enemy');
                randomTarget.buffs.push({ type: 'stun', duration: 1 });
                UI.applyEffect('member-' + randomTarget.id, 'flash-hit');
                break;
            case 'hide':
                UI.battleLog(`${boss.emoji} ${boss.name} hides in the shadows! 👤`, 'enemy');
                boss.buffs = boss.buffs || [];
                boss.hiding = true;
                break;
            case 'sneak_attack': {
                const sneakPower = boss.hiding ? boss.attack * 2 : boss.attack;
                boss.hiding = false;
                const dmg = this.calcDamage(sneakPower, randomTarget.defense);
                const actualDmg = this.applyDefenses(randomTarget, dmg);
                randomTarget.hp = Math.max(0, randomTarget.hp - actualDmg);
                UI.battleLog(`${boss.emoji} ${boss.name} sneak attacks ${randomTarget.name}! ${actualDmg} damage! 💨`, 'enemy');
                UI.applyEffect('member-' + randomTarget.id, 'flash-hit');
                UI.updateMember(randomTarget);
                if (randomTarget.hp <= 0) { randomTarget.isResting = true; UI.battleLog(`${randomTarget.name} needs a rest! 😴`, 'enemy'); UI.updateMember(randomTarget); }
                break;
            }
            case 'shadow_clones':
            case 'summon_minions':
                UI.battleLog(`${boss.emoji} ${boss.name} summons minions! 👿👿`, 'enemy');
                // Add some imps
                const regionIndex = REGIONS.findIndex(r => r.bossId === boss.id);
                const scale = 1 + (regionIndex >= 0 ? regionIndex : 0) * 0.25;
                const minion = createDemon('imp', scale);
                this.enemies.push(minion);
                UI.renderBattle(this.enemies, this.team);
                break;
            case 'echo_attack':
            case 'dark_wave':
            case 'blizzard': {
                UI.battleLog(`${boss.emoji} ${boss.name} unleashes ${actionName.replace('_', ' ')}! Hits everyone! 🌊`, 'enemy');
                UI.applyEffect('screen-battle', 'screen-shake');
                for (const c of aliveTeam) {
                    const dmg = this.calcDamage(boss.attack * 0.7, c.defense);
                    const actualDmg = this.applyDefenses(c, dmg);
                    c.hp = Math.max(0, c.hp - actualDmg);
                    UI.applyEffect('member-' + c.id, 'flash-hit');
                    UI.updateMember(c);
                    if (c.hp <= 0) { c.isResting = true; UI.battleLog(`${c.name} needs a rest! 😴`, 'enemy'); UI.updateMember(c); }
                }
                break;
            }
            case 'copy':
                UI.battleLog(`${boss.emoji} ${boss.name} copies your moves! So annoying! 🔊`, 'enemy');
                // Copies a random team member's last attack
                const copyDmg = this.calcDamage(boss.attack, randomTarget.defense);
                const copyActual = this.applyDefenses(randomTarget, copyDmg);
                randomTarget.hp = Math.max(0, randomTarget.hp - copyActual);
                UI.applyEffect('member-' + randomTarget.id, 'flash-hit');
                UI.updateMember(randomTarget);
                if (randomTarget.hp <= 0) { randomTarget.isResting = true; UI.battleLog(`${randomTarget.name} needs a rest! 😴`, 'enemy'); UI.updateMember(randomTarget); }
                break;
            case 'ice_wall':
                UI.battleLog(`${boss.emoji} ${boss.name} creates an ice wall! Defense UP! ❄️🧱`, 'enemy');
                boss.defense = Math.floor(boss.defense * 1.3);
                break;
            case 'tantrum':
                UI.battleLog(`${boss.emoji} ${boss.name} throws a BIG TANTRUM! 😤😤😤`, 'enemy');
                UI.applyEffect('screen-battle', 'screen-shake');
                for (const c of aliveTeam) {
                    const dmg = this.calcDamage(boss.attack * 0.5, c.defense);
                    c.hp = Math.max(0, c.hp - dmg);
                    UI.updateMember(c);
                    if (c.hp <= 0) { c.isResting = true; UI.battleLog(`${c.name} needs a rest! 😴`, 'enemy'); UI.updateMember(c); }
                }
                break;
            case 'ultimate_grump': {
                UI.battleLog(`${boss.emoji} ${boss.name} uses ULTIMATE GRUMP! The grumpiest attack! 😡`, 'special');
                UI.applyEffect('screen-battle', 'screen-shake');
                await this.wait(300);
                for (const c of aliveTeam) {
                    const dmg = this.calcDamage(boss.attack * 1.2, c.defense);
                    c.hp = Math.max(0, c.hp - dmg);
                    UI.applyEffect('member-' + c.id, 'flash-hit');
                    UI.updateMember(c);
                    if (c.hp <= 0) { c.isResting = true; UI.battleLog(`${c.name} needs a rest! 😴`, 'enemy'); UI.updateMember(c); }
                }
                break;
            }
        }
        await this.wait(500);
    },

    // Apply defensive buffs/states to damage
    applyDefenses(target, damage) {
        let dmg = damage;
        if (target.isDefending) dmg = Math.floor(dmg * 0.5);
        const shield = target.buffs.find(b => b.type === 'shield');
        if (shield) dmg = Math.floor(dmg * (1 - shield.reduction));
        const block = target.buffs.find(b => b.type === 'block');
        if (block) dmg = 0;
        return dmg;
    },

    // Calculate damage
    calcDamage(attackPower, defense) {
        const base = Math.max(1, attackPower - defense * 0.5);
        const variance = 0.85 + Math.random() * 0.3;
        return Math.floor(base * variance);
    },

    // Tick down buff durations
    tickBuffs() {
        this.team.forEach(char => {
            char.buffs = char.buffs.filter(b => {
                b.duration--;
                return b.duration > 0;
            });
        });
    },

    // Check if battle is over
    checkBattleEnd() {
        const allEnemiesDefeated = this.enemies.every(e => e.isDefeated);
        const allTeamResting = this.team.every(c => c.isResting);

        if (allEnemiesDefeated) {
            this.isAnimating = false;
            setTimeout(() => this.onVictory(), 500);
            return true;
        }

        if (allTeamResting) {
            this.isAnimating = false;
            setTimeout(() => this.onDefeat(), 500);
            return true;
        }

        return false;
    },

    // Victory!
    onVictory() {
        let totalXP = 0;
        let totalCrystals = 0;

        this.enemies.forEach(e => {
            totalXP += e.xpReward;
            totalCrystals += e.crystalReward;
        });

        // Award XP and crystals
        Game.state.crystals += totalCrystals;
        const levelsGained = [];

        this.team.forEach(char => {
            char.xp += totalXP;
            const levels = checkLevelUp(char);
            if (levels.length > 0) {
                levels.forEach(lvl => {
                    const newAbilities = getAvailableAbilities(char.id, lvl);
                    const prevAbilities = getAvailableAbilities(char.id, lvl - 1);
                    const newAbility = newAbilities.find(a => !prevAbilities.includes(a));
                    levelsGained.push({
                        name: char.name,
                        level: lvl,
                        newAbility: newAbility ? newAbility.name : null
                    });
                });
            }
        });

        UI.showVictory(totalXP, totalCrystals, levelsGained);
        UI.showScreen('victory');
    },

    // Defeat — time to regroup
    onDefeat() {
        // Restore team to half HP
        this.team.forEach(c => {
            c.isResting = false;
            c.hp = Math.floor(c.maxHp * 0.5);
            c.spirit = Math.floor(c.maxSpirit * 0.5);
            c.buffs = [];
            c.isDefending = false;
            c.isProtecting = null;
        });
        UI.showScreen('defeat');
    },

    // Utility: wait ms
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
