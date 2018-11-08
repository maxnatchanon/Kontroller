class PolyShooter extends Phaser.Scene {

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
		this.load.image('star', 'star.png');
		this.load.spritesheet('bullet', 'bullet.png', { frameWidth: 10, frameHeight: 110 });
		this.load.spritesheet('bulletHit', 'animBulletHit.png', { frameWidth: 100, frameHeight: 59 });
		this.load.image('enemy', 'enemy.png');
		this.load.spritesheet('enemyHit', 'animEnemyHit.png', { frameWidth: 100, frameHeight: 69 });
		this.load.bitmapFont('scoreFont', '../font/scoreFont.png', '../font/scoreFont.fnt');
		this.load.bitmapFont('titleFont', '../font/titleFont.png', '../font/titleFont.fnt');
		this.load.bitmapFont('gameFont', '../font/gameFont.png', '../font/gameFont.fnt')
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
			frameRate: 60,
			repeat: 0
		});
		this.anims.create({
			key: 'bulletHit',
			frames: this.anims.generateFrameNumbers('bulletHit', { start: 0, end: 5 }),
			frameRate: 50,
			repeat: 0
		});
		this.fireTick = 0;
		this.fireInterval = 25;

		// Enemy
		this.enemies = this.physics.add.group();
		this.physics.add.collider(this.enemies, this.bullets, this.hitEnemy, null, this);
		this.anims.create({
			key: 'enemyHit',
			frames: this.anims.generateFrameNumbers('enemyHit', { start: 0, end: 5 }),
			frameRate: 50,
			repeat: 0
		});
		this.enemyTick = 0;
		this.enemyInterval = 150;
		this.enemySpeed = 70;
		this.enemySpeedRange = 40;

		// Text
		this.scoreText = this.add.bitmapText(846, 70, 'scoreFont','0', 75);
		this.scoreText.setOrigin(0.5,0.5);
		this.currentScore = 0;
		this.title = this.add.bitmapText(12, 28, 'titleFont','Kontroller', 18);
		this.gameTitle = this.add.bitmapText(9, 48, 'gameFont','PolyShooter', 35);

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
		this.star.tilePositionY -= 0.75;

		this.checkPlayerMove();
		this.checkFire();
		this.clearBullet();
		this.generateEnemy();
		this.checkEnemyReachBottom();

		this.fireTick++;
		this.enemyTick++;
	}
}