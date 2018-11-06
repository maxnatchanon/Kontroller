class polyShooter extends Phaser.Scene {

	constructor() {
		super({key:"polyShooter"});
	}

	preload() {
		this.load.image('player', 'assets/polyShooter/player.png');
		this.load.image('playerLeft', 'assets/polyShooter/playerLeft.png');
		this.load.image('playerRight', 'assets/polyShooter/playerRight.png');
		this.load.image('border', 'assets/polyShooter/border.png');
		this.load.image('wall', 'assets/polyShooter/wall.png');
		this.load.image('bg', 'assets/polyShooter/bg.png');
		this.load.image('star', 'assets/polyShooter/star.png')
	}


	create() {

		this.add.image(480, 270, 'bg');
		this.star = this.add.tileSprite(480, 270, 960, 1000, 'star');

		this.sideGlow = this.physics.add.staticGroup();
		this.sideGlow.create(293, 0, 'border').setOrigin(0,0).setScale(-1, 1).refreshBody();
		this.sideGlow.create(667, 0, 'border').setOrigin(0,0).refreshBody();

		this.wall = this.physics.add.staticGroup();
		this.wall.create(0, 0, 'wall').setOrigin(0,0).refreshBody();
		this.wall.create(728, 0, 'wall').setOrigin(0,0).refreshBody();

		this.player = this.physics.add.sprite(480, 480, 'player');
		this.player.setOrigin(0.5, 0.5);

		this.physics.add.collider(this.player, this.wall);

		this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	}

	update() {
		this.star.tilePositionY -= 1;
		if (this.left.isDown) {
			this.player.setVelocityX(-180);
			this.player.setTexture('playerLeft');
			this.player.setOrigin(0.5, 0.475);
		}
		else if (this.right.isDown) {
			this.player.setVelocityX(180);
			this.player.setTexture('playerRight');
			this.player.setOrigin(0.5, 0.475);
		}
		else {
			this.player.setVelocityX(0);
			this.player.setTexture('player');
			this.player.setOrigin(0.5, 0.5);
		}
	}

}