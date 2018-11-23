// Check if player pressed move button
MainGame.prototype.checkSkillSwitch = function() {
    if (this.skillBtnDown === null) {
        if (this.switchSkillUp.isDown) {
            this.switchSkill(true);
            this.skillBtnDown = this.switchSkillUp;
        }
        else if (this.switchSkillDown[0].isDown) {
            this.switchSkill(false);
            this.skillBtnDown = this.switchSkillDown[0];
        }
        else if (this.switchSkillDown[1].isDown) {
            this.switchSkill(false);
            this.skillBtnDown = this.switchSkillDown[1];
        }
    }
    else {
        if (!this.skillBtnDown.isDown) {
            this.skillBtnDown = null;
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