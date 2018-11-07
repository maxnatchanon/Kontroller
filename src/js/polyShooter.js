class polyShooter extends Phaser.Scene {

	constructor() {
		super({key:"polyShooter"});
	}

	preload() {
		this.load.baseURL = 'assets/polyShooter/';
		this.load.image('player', 'player.png');
		this.load.image('playerLeft', 'playerLeft.png');
		this.load.image('playerRight', 'playerRight.png');
		this.load.image('border', 'border.png');
		this.load.image('wall', 'wall.png');
		this.load.image('bg', 'bg.png');
		this.load.image('star', 'star.png')
		this.load.spritesheet('bullet', 'bullet.png', { frameWidth: 10, frameHeight: 110 });
	}


	create() {
		// Background
		this.add.image(480, 270, 'bg');
		this.star = this.add.tileSprite(480, 270, 960, 1000, 'star');
		this.sideGlow = this.physics.add.staticGroup();
		this.sideGlow.create(293, 0, 'border').setOrigin(0,0).setScale(-1, 1).refreshBody();
		this.sideGlow.create(667, 0, 'border').setOrigin(0,0).refreshBody();
		this.wall = this.physics.add.staticGroup();
		this.wall.create(0, 0, 'wall').setOrigin(0,0).refreshBody();
		this.wall.create(728, 0, 'wall').setOrigin(0,0).refreshBody();

		// Player
		this.player = this.physics.add.sprite(480, 480, 'player');
		this.player.setOrigin(0.5, 0.5);
		this.physics.add.collider(this.player, this.wall);

		// Bullet
		this.bullets = this.physics.add.group();
		this.anims.create({
			key: 'fire',
			frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 5 }),
			frameRate: 70,
			repeat: 0
		});
		this.fireTick = 0;
		this.fireInterval = 25;

		// Input
		this.left = this.input.keyboard.addKey('SHIFT')
		this.right = this.input.keyboard.addKey('Z')
		this.fire = [this.input.keyboard.addKey('QUOTES'),
					this.input.keyboard.addKey('NUMPAD_FIVE'),
					this.input.keyboard.addKey('FIVE')];
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

		for (let index = 0; index < this.fire.length; index++) {
			if (this.fire[index].isDown && this.fireTick > this.fireInterval) {
				this.bullet = this.physics.add.sprite(this.player.x, this.player.y + 10, 'bullet');
				this.bullets.add(this.bullet);
				this.bullet.anims.play('fire', true);
				this.bullet.setVelocityY(-1000);
				this.fireTick = 0;
			}
		}

		this.fireTick++;

	}

}