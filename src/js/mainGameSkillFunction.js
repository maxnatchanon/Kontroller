// Check if player pressed move button
MainGame.prototype.checkSkillSwitch = function() {
    if (this.skillSwitchBtnDown === null) {
        if (this.switchSkillUp.isDown) {
            this.switchSkill(true);
            this.skillSwitchBtnDown = this.switchSkillUp;
        }
        else if (this.switchSkillDown[0].isDown) {
            this.switchSkill(false);
            this.skillSwitchBtnDown = this.switchSkillDown[0];
        }
        else if (this.switchSkillDown[1].isDown) {
            this.switchSkill(false);
            this.skillSwitchBtnDown = this.switchSkillDown[1];
        }
    }
    else {
        if (!this.skillSwitchBtnDown.isDown) {
            this.skillSwitchBtnDown = null;
        }
    }
}

// Switch skill
MainGame.prototype.switchSkill = function(up) {
    if (up) {
        this.currentSkill--;
        if (this.currentSkill === -1) this.currentSkill = 2;
    }
    else {
        this.currentSkill = (this.currentSkill + 1) % 3;
    }
    this.selectSkill.y = this.skillPos[this.currentSkill];
}

// Reduce skill cooldown time
MainGame.prototype.cooldownSkill = function() {
    for (let index = 0; index < 3; index++) {
        if (this.skillCoolDownTime[index] > 0) {
            this.skillCoolDownTime[index]--;
            this.skillMask[index].setScale(1, 1-(this.skillCoolDownTime[index]/this.skillMaxCooldownTime[index]));
        }
    }
}

// Check if player use skill
MainGame.prototype.checkSkillPress = function() {
    if (this.skillPressBtnDown === null) {
        for (let btnIdx = 0; btnIdx < 3; btnIdx++) {
            if (this.skillPress[btnIdx].isDown) {
                this.useSkill();
                this.skillPressBtnDown = this.skillPress[0];
                break;
            }
        }
    }
    else {
        if (!this.skillPressBtnDown.isDown) {
            this.skillPressBtnDown = null;
        }
    }
}

// Use the current skill
MainGame.prototype.useSkill = function() {
    if (this.skillCoolDownTime[this.currentSkill] === 0) {
        if (this.currentSkill === 0) this.activateRedSkill();
        else if (this.currentSkill === 1) this.activateYellowSkill();
        else if (this.currentSkill === 2) this.activateBlueSkill();
    }
}

// Activate skill
MainGame.prototype.activateRedSkill = function() {
    var killList = [];
    this.enemies.children.iterate(function (enemy) {
        var onRight = Math.floor(Math.random() * 2);
        killList.push([enemy, onRight]);
    });
    for (let index = 0; index < killList.length; index++) {
        this.killEnemy(killList[index][0], killList[index][1]);
    }
    this.skillCoolDownTime[0] = this.skillMaxCooldownTime[0];
}
MainGame.prototype.activateYellowSkill = function() {
    this.fireInterval = 5;
    this.skillActiveTime[1] = this.skillMaxActiveTime[1];
    this.skillCoolDownTime[1] = this.skillMaxCooldownTime[1];
}
MainGame.prototype.activateBlueSkill = function() {
    this.skillActiveTime[2] = this.skillMaxActiveTime[2];
    this.skillCoolDownTime[2] = this.skillMaxCooldownTime[2];
}

// Deactivate skill if active time ran out
MainGame.prototype.checkSkillActivateTime = function() {
    this.skillActiveTime[1] -= (this.skillActiveTime[1] > 0) ? 1 : 0;
    this.skillActiveTime[2] -= (this.skillActiveTime[2] > 0) ? 1 : 0;

    if (this.skillActiveTime[1] === 0) {
        this.fireInterval = 20;
    }

    if (this.skillActiveTime[2] === 0) {
        this.blueShield.setAlpha(0);
    }
    else {
        var opacityVal = (this.skillActiveTime[2] % 100)
        opacityVal -= (opacityVal > 50) ? (opacityVal - 50) * 2 : 0;
        opacityVal /= 50;
        if (this.skillActiveTime[2] <= 1950 && this.skillActiveTime[2] > 50) opacityVal = opacityVal * (1 - 0.35) / 1 + 0.35;
        this.blueShield.setAlpha(opacityVal);
        this.checkShieldHitEnemy();
    }
}

// Check if enemy hit the blue shield
MainGame.prototype.checkShieldHitEnemy = function(shield, enemy) {
    var killList = [];
    this.enemies.children.iterate(function (enemy) {
        if (enemy.y > 380 - 20) {
            killList.push([enemy, enemy.x > 270]);
        }
    });
    for (let index = 0; index < killList.length; index++) {
        this.killEnemy(killList[index][0], killList[index][1]);
    }
}