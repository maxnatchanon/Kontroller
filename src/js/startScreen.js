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
        this.load.image('fireToContinue', 'fireToContinue.png');
    }

	create() {
        this.bg = this.add.image(0, 0, 'bg').setOrigin(0, 0).setDepth(-2);
        this.star = this.add.tileSprite(480, 270, 960, 1000, 'star').setDepth(-1);
        this.logo = this.add.image(20, 0, 'logo').setOrigin(0, 0);
        this.titleText = this.add.image(375, 300, 'titleText').setOrigin(0, 0);
        this.pressAnyKey = this.add.image(657, 480, 'pressAnyKey').setOrigin(0, 0);

        this.tutorial = this.add.image(480, 240, 'tutorial').setAlpha(0);
        this.fireToContinue = this.add.image(480, 500, 'fireToContinue').setAlpha(0);

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
            else if (game.state === 2 && (event.keyCode === 50 || event.keyCode === 191)) {
                game.state = 3;
                game.tick = 0;
            }
        });
    }

	update() {
        this.tick++;
        this.star.tilePositionY -= 0.75;

        if (this.state === 0) this.blink(this.pressAnyKey);
        else if (this.state === 1) this.transition();
        else if (this.state === 2) this.blink(this.fireToContinue);
        else this.startGame();
    }

    // ===============================================================================

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

    transition() {
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
            this.scene.start('mainGame');
        }
    }
}