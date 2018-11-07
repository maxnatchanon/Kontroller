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
		this.load.image('enemy', 'enemy.png');
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
		this.fireInterval = 20;

		// Enemy
		this.enemies = this.physics.add.group();
		this.enemyTick = 0;
		this.enemyInterval = 100;

		// Input
		this.left = this.input.keyboard.addKey(16);
		this.right = this.input.keyboard.addKey(90)
		this.fire = [this.input.keyboard.addKey(53),
					this.input.keyboard.addKey(222)];
		this.switchSkillLeft = this.input.keyboard.addKey(192);
		this.switchSkillRight = [this.input.keyboard.addKey(109),
								this.input.keyboard.addKey(8)];
	}

	update() {
		// Move background star
		this.star.tilePositionY -= 1.25;

		this.checkPlayerMove();
		this.checkFire();
		this.clearBullet()
		this.generateEnemy()

		this.fireTick++;
		this.enemyTick++;
	}

	// Check if player pressed move button
	checkPlayerMove() {
		if (this.left.isDown) {
			this.player.setVelocityX(-250);
			this.player.setTexture('playerLeft');
			this.player.setOrigin(0.5, 0.475);
		}
		else if (this.right.isDown) {
			this.player.setVelocityX(250);
			this.player.setTexture('playerRight');
			this.player.setOrigin(0.5, 0.475);
		}
		else {
			this.player.setVelocityX(0);
			this.player.setTexture('player');
			this.player.setOrigin(0.5, 0.5);
		}
	}

	// Check if player pressed fire button
	checkFire() {
		for (let index = 0; index < this.fire.length; index++) {
			if (this.fire[index].isDown && this.fireTick > this.fireInterval) {
				var bullet = this.physics.add.sprite(this.player.x, this.player.y + 10, 'bullet');
				this.bullets.add(bullet);
				bullet.anims.play('fire');
				// bullet.on("animationcomplete", function() {
				// 	bullet.destroy();
				// }, this);
				bullet.setVelocityY(-1000);
				this.fireTick = 0;
			}
		}
	}

	// Clear bullets that are out of screen
	clearBullet() {
		var outBullets = []
		this.bullets.children.iterate(function (bullet) {
			if (bullet.y < -100) {
				outBullets.push(bullet);
			}
		});

		for (let index = 0; index < outBullets.length; index++) {
			this.bullets.remove(outBullets[index], true, true);
		}
	}

	generateEnemy() {
		if (this.enemyTick > this.enemyInterval) {
			var enemy = this.physics.add.sprite(Math.floor(Math.random() * 436) + 262, -50, 'enemy');
			this.enemyTick = 0;
			this.enemies.add(enemy);
			enemy.setVelocityY(110);
		}
	}

}