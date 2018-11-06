class polyShooter extends Phaser.Scene {

	constructor() {
		super({key:"polyShooter"});
	}

	preload() {
		this.load.image('player', 'assets/polyShooter/player.png');
		this.load.image('border', 'assets/polyShooter/border.png');
		this.load.image('wall', 'assets/polyShooter/wall.png');
		this.load.image('bg', 'assets/polyShooter/bg.png');
	}


	create() {

		this.add.image(480, 270, 'bg');

		this.sideGlow = this.physics.add.staticGroup();
		this.sideGlow.create(293, 0, 'border').setOrigin(0,0).setScale(-1, 1).refreshBody();
		this.sideGlow.create(667, 0, 'border').setOrigin(0,0).refreshBody();

		this.wall = this.physics.add.staticGroup();
		this.wall.create(0, 0, 'wall').setOrigin(0,0).refreshBody();
		this.wall.create(728, 0, 'wall').setOrigin(0,0).refreshBody();

		this.player = this.physics.add.sprite(480, 480, 'player');

		this.physics.add.collider(this.player, this.wall);

		this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
	}

	update() {
		if (this.left.isDown) {
			this.player.setVelocityX(-180);
		}
		else if (this.right.isDown) {
			this.player.setVelocityX(180);
		}
		else {
			this.player.setVelocityX(0);
		}
	}

}