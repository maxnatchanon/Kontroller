class StartScreen extends Phaser.Scene {

	constructor() {
		super({key:"startScreen"});
	}

	preload() {
        this.load.baseURL = 'assets/startScreen/';
		this.load.image('logo', 'logo.png');
		this.load.image('titleText', 'title.png');
		this.load.image('pressAnyKey', 'pressAnyKey.png');
        this.load.image('bg', 'bg.png');
        this.load.image('star', 'star.png');
        this.load.audio('startLoop', ['../mainGame/sound/endLoop.mp3']);
        this.load.image('tutorial', 'tutorial.png');
        this.load.image('tutorialRemapped', 'tutorialRemapped.png');
        this.load.image('fireToContinue', 'fireToContinue.png');

        this.load.image('remapKeysText', 'remapKeysText.png');
        this.load.image('pressToRemapText', 'mapPressText.png');

        this.load.image('remapLR_KB', 'remapLR.png');
        this.load.image('remapFire_KB', 'remapFire.png');
        this.load.image('remapSkill_KB', 'remapSkill.png');
        this.load.image('remapSkillSWL_KB', 'remapSkillSWL.png');
        this.load.image('remapSkillSWR_KB', 'remapSkillSWR.png');

        this.load.image('remapL_Text', 'mapTextLeft.png');
        this.load.image('remapR_Text', 'mapTextRight.png');
        this.load.image('remapFire_Text', 'mapTextFire.png');
        this.load.image('remapSkill_Text', 'mapTextSkill.png');
        this.load.image('remapSkillSWL_Text', 'mapTextSkillSwitchL.png');
        this.load.image('remapSkillSWR_Text', 'mapTextSkillSwitchR.png');
    }

	create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setDepth(-2);
        this.star = this.add.tileSprite(480, 270, 960, 1000, 'star').setDepth(-1);
        this.logo = this.add.image(20, 0, 'logo').setOrigin(0, 0);
        this.titleText = this.add.image(375, 300, 'titleText').setOrigin(0, 0);
        this.pressAnyKey = this.add.image(657, 480, 'pressAnyKey').setOrigin(0, 0);

        this.tutorial = this.add.image(480, 230, 'tutorial').setAlpha(0);
        this.fireToContinue = this.add.image(480, 490, 'fireToContinue').setAlpha(0);

        this.remapHeaderText = this.add.image(480, 70, 'remapKeysText').setAlpha(0);
        this.remapKB = this.add.image(480, 230, 'remapLR_KB').setAlpha(0);
        this.remapButtonText = this.add.image(480, 400, 'remapL_Text').setAlpha(0);
        this.remapPressText = this.add.image(480, 460, 'pressToRemapText').setAlpha(0);

        this.remapped = false;
        this.remapKeys = {
            fire: null,
            switchSkillDown: null,
            switchSkillUp: null,
            skillActivate: null,
            moveLeft: null,
            moveRight: null
        };

        this.state = 0;

        this.startBgm = this.sound.add('startLoop', { volume: 0.70, loop: true });
        this.startBgm.play();

        this.tick = 0;

        var game = this;
        this.input.keyboard.on('keydown', function (event) {
            if (game.state === 0) {
                game.state = 1;
                game.tick = 0;
            }
            else if (game.state === 2) {
                if (event.keyCode == 32) {
                    game.remapped = true;
                    game.remappingKey = 0;
                    game.state = 3;
                    game.tick = 0;
                    game.remapKB.setTexture('remapLR_KB');
                    game.remapButtonText.setTexture('remapL_Text');
                }
                else if (!game.remapped && [50, 191, 98, 99, 51].includes(event.keyCode)) {
                    game.state = 9;
                    game.tick = 0;
                }
                else if (game.remapped && event.keyCode == game.remapKeys.fire) {
                    game.state = 9;
                    game.tick = 0;
                }
            }
            else if (game.state === 4) {
                if (game.remappingKey === 0) {
                    game.remapKeys.moveLeft = event.keyCode;
                    game.remapButtonText.setTexture('remapR_Text');
                    game.remappingKey++;
                }
                else if (game.remappingKey === 1) {
                    game.remapKeys.moveRight = event.keyCode;
                    game.remapKB.setTexture('remapFire_KB');
                    game.remapButtonText.setTexture('remapFire_Text');
                    game.remappingKey++;
                }
                else if (game.remappingKey === 2) {
                    game.remapKeys.fire = event.keyCode;
                    game.remapKB.setTexture('remapSkill_KB');
                    game.remapButtonText.setTexture('remapSkill_Text');
                    game.remappingKey++;
                }
                else if (game.remappingKey === 3) {
                    game.remapKeys.skillActivate = event.keyCode;
                    game.remapKB.setTexture('remapSkillSWL_KB');
                    game.remapButtonText.setTexture('remapSkillSWL_Text');
                    game.remappingKey++;
                }
                else if (game.remappingKey === 4) {
                    game.remapKeys.switchSkillUp = event.keyCode;
                    game.remapKB.setTexture('remapSkillSWR_KB');
                    game.remapButtonText.setTexture('remapSkillSWR_Text');
                    game.remappingKey++;
                }
                else if (game.remappingKey === 5) {
                    game.remapKeys.switchSkillDown = event.keyCode;
                    game.remappingKey++;
                }
            }
        });
    }

	update() {
        this.tick++;
        this.star.tilePositionY -= 0.75;

        if (this.state === 0) this.blink(this.pressAnyKey);
        else if (this.state === 1) this.transitionToTutorial();
        else if (this.state === 2) this.blink(this.fireToContinue);
        else if (this.state === 3) this.transitionToRemap();
        else if (this.state === 4) this.startRemap();
        else if (this.state === 5) this.transitionBackToTutorial();
        else this.startGame();
    }

    // ===============================================================================

    // Blink the input sprite - 45 tick on / 30 tick off
    blink(text) {
        if ((text.alpha === 1)) {
            if (this.tick === 45) {
                text.setAlpha(0);
                this.tick = 0;
            }
        }
        else {
            if (this.tick === 30) {
                text.setAlpha(1);
                this.tick = 0;
            }
        }
    }

    // Transition to tutorial screen
    transitionToTutorial() {
        if (this.tick <= 50) {
            this.logo.alpha -= 0.02;
            this.pressAnyKey.alpha -= 0.02;
            this.titleText.alpha -= 0.02;
        }
        else if (this.tick <= 100) {
            this.tutorial.alpha += 0.02;
        }
        else {
            this.state = 2;
            this.tick = 0;
            this.fireToContinue.setAlpha(1);
        }
    }

    // Transition to remap screen
    transitionToRemap() {
        if (this.tick <= 50) {
            this.tutorial.alpha -= 0.02;
            this.fireToContinue.alpha -= 0.02;
        }
        else if (this.tick <= 100) {
            this.remapHeaderText.alpha += 0.02;
            this.remapKB.alpha += 0.02;
            this.remapButtonText.alpha += 0.02;
        }
        else {
            this.state = 4;
            this.tick = 0;
            this.remapPressText.alpha = 1;
        }
    }

    // Start remapping
    startRemap() {
        this.blink(this.remapPressText)
        if (this.remappingKey >= 6) {
            this.tutorial.setTexture('tutorialRemapped');
            this.state = 5;
            this.tick = 0;
        }
    }

    // Remapping finished
    transitionBackToTutorial() {
        if (this.tick <= 50) {
            this.remapHeaderText.alpha -= 0.02;
            this.remapKB.alpha -= 0.02;
            this.remapButtonText.alpha -= 0.02;
            this.remapPressText.alpha -= 0.02;
        }
        else if (this.tick <= 100) {
            this.tutorial.alpha += 0.02;
        }
        else {
            this.state = 2;
            this.tick = 0;
            this.fireToContinue.setAlpha(1);
        }
    }

    // Fade everything out and switch to main game scene
    startGame() {
        if (this.tick <= 50) {
            this.tutorial.alpha -= 0.02;
            this.fireToContinue.alpha -= 0.02;
            this.bg.alpha -= 0.02;
            this.star.alpha -= 0.02;
        }
        else {
            this.startBgm.stop();
            this.scene.stop();
            this.scene.start('mainGame', { remapped: this.remapped, remapKeys: this.remapKeys });
        }
    }
}