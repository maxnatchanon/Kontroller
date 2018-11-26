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
    }

	create() {
        this.add.image(0, 0, 'bg').setOrigin(0, 0).setDepth(-2);
        this.star = this.add.tileSprite(480, 270, 960, 1000, 'star').setDepth(-1);
        this.add.image(20, 0, 'logo').setOrigin(0, 0);
        this.add.image(375, 300, 'titleText').setOrigin(0, 0);
        this.pressAnyKey = this.add.image(657, 480, 'pressAnyKey').setOrigin(0, 0);

        this.startBgm = this.sound.add('startLoop', {
			volume: 0.70,
			loop: true
        });
        this.startBgm.play();

        this.tick = 0;

        var game = this;
        this.input.keyboard.on('keydown', function (event) {
            //game.startBgm.stop();
            game.scene.stop();
            game.scene.start('mainGame');
        });
    }

	update() {
        this.tick++;
        this.star.tilePositionY -= 0.75;
        
        if ((this.pressAnyKey.alpha === 1)) {
            if (this.tick === 45) {
                this.pressAnyKey.setAlpha(0);
                this.tick = 0;
            }
        }
        else {
            if (this.tick === 30) {
                this.pressAnyKey.setAlpha(1);
                this.tick = 0;
            }
        }
    }
}