class MainGame extends Phaser.Scene {

	constructor() {
		super({key:"mainGame"});
	}

	preload() {
		this.load.baseURL = 'assets/img/';
		this.load.image('player', 'player.png');
		this.load.image('playerLeft', 'playerLeft.png');
		this.load.image('playerRight', 'playerRight.png');
		this.load.spritesheet('playerDead', 'animPlayerDead.png', { frameWidth: 120, frameHeight: 120 });

		this.load.image('border', 'border.png');
		this.load.image('wall', 'wall.png');
		this.load.image('bg', 'bg.png');
		this.load.image('star', 'star.png');

		this.load.spritesheet('bullet', 'bullet.png', { frameWidth: 10, frameHeight: 110 });
		this.load.spritesheet('bulletHit', 'animBulletHit.png', { frameWidth: 100, frameHeight: 59 });

		this.load.image('enemy', 'enemy.png');
		this.load.spritesheet('enemyHit', 'animEnemyHit.png', { frameWidth: 100, frameHeight: 69 });

		this.load.bitmapFont('scoreFont', '../font/scoreFont.png', '../font/scoreFont.fnt');

		this.load.spritesheet('life', 'animLifeBreak.png', { frameWidth: 60, frameHeight: 120 });

		this.load.image('title', 'title.png');
		this.load.image('gameoff', 'gameoff.png');
		this.load.image('gameover', 'gameover.png');

		this.load.image('redSkill', 'redSkill.png');
		this.load.image('blueSkill', 'blueSkill.png');
		this.load.image('yellowSkill', 'yellowSkill.png');
		this.load.image('redSkillCooldown', 'redSkillCooldown.png');
		this.load.image('blueSkillCooldown', 'blueSkillCooldown.png');
		this.load.image('yellowSkillCooldown', 'yellowSkillCooldown.png');
		this.load.image('skillMask', 'skillMask.png');
		this.load.image('selectSkill', 'selectSkill.png');
		this.load.image('blueShield', 'blueShield.png');

		this.load.audio('gameLoop', ['../sound/gameLoop.mp3']);
		this.load.audio('endLoop', ['../sound/endLoop.mp3']);
	}

	create() {

		// Background
		this.add.image(480, 270, 'bg').setDepth(-10);
		this.star = this.add.tileSprite(480, 270, 960, 1000, 'star').setDepth(-9);
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
		this.anims.create({
			key: 'playerDead',
			frames: this.anims.generateFrameNumbers('playerDead', { start: 0, end: 6 }),
			frameRate: 60,
			repeat: 0
		});

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
		this.fireInterval = 20;

		// Enemy
		this.enemies = this.physics.add.group();
		this.physics.add.collider(this.enemies, this.bullets, this.bulletHitEnemy, null, this);
		this.anims.create({
			key: 'enemyHit',
			frames: this.anims.generateFrameNumbers('enemyHit', { start: 0, end: 5 }),
			frameRate: 50,
			repeat: 0
		});

		// Difficulty
		this.currentLevel = 0;
		this.enemyIntervalLevel = [150, 115, 90, 70, 55, 45, 35, 30];
		this.enemySpeedLevel = [70, 80, 90, 95, 100, 105, 110, 120];
		this.enemyTick = 0;
		this.enemyInterval = this.enemyIntervalLevel[this.currentLevel];
		this.enemySpeed = this.enemySpeedLevel[this.currentLevel];
		this.enemySpeedRange = 40;
		
		// Text
		this.scoreText = this.add.bitmapText(846, 70, 'scoreFont','0', 75);
		this.scoreText.setOrigin(0.5,0.5);
		this.currentScore = 0;

		this.title = this.add.image(18, 28, 'title');
		this.title.setOrigin(0, 0);

		this.gameoff = this.add.image(18, 508, 'gameoff');
		this.gameoff.setOrigin(0, 0);

		this.endGameText = this.add.image(480, 270, 'gameover');
		this.endGameText.setOrigin(0.5, 0.5);
		this.endGameText.setDepth(1);
		this.endGameText.setAlpha(0);

		// Life
		this.lifes = [];
		this.lifes.push(this.physics.add.sprite(48, 270, 'life'));
		this.lifes.push(this.physics.add.sprite(113, 270, 'life'));
		this.lifes.push(this.physics.add.sprite(178, 270, 'life'));
		this.currentLifePoint = 3;
		this.anims.create({
			key: 'lifeBreak',
			frames: this.anims.generateFrameNumbers('life', { start: 0, end: 5 }),
			frameRate: 40,
			repeat: 0
		});
		
		// Skill
		this.currentSkill = 0;
		this.skillPos = [195, 317, 439];
		this.skillCoolDownTime = [2000, 2500, 6000];
		this.skillMaxCooldownTime = [2000, 2500, 6000];
		this.skillActiveTime = [0, 0, 0];
		this.skillMaxActiveTime = [0, 600, 2000];

		this.add.image(845, 195, 'redSkillCooldown');
		this.add.image(845, 317, 'yellowSkillCooldown');
		this.add.image(845, 439, 'blueSkillCooldown');
		this.redSkill = this.add.image(845, 195, 'redSkill').setDepth(1);
		this.yellowSkill = this.add.image(845, 317, 'yellowSkill').setDepth(1);
		this.blueSkill = this.add.image(845, 439, 'blueSkill').setDepth(1);

		this.skillMask = [];
		this.skillMask.push(this.add.image(845, 195+43, 'skillMask').setVisible(false).setOrigin(0.5, 1).setScale(1, 0));
		this.redSkill.setMask(this.skillMask[0].createBitmapMask());

		this.skillMask.push(this.add.image(845, 317+43, 'skillMask').setVisible(false).setOrigin(0.5, 1).setScale(1, 0));
		this.yellowSkill.setMask(this.skillMask[1].createBitmapMask());

		this.skillMask.push(this.add.image(845, 439+43, 'skillMask').setVisible(false).setOrigin(0.5, 1).setScale(1, 0));
		this.blueSkill.setMask(this.skillMask[2].createBitmapMask());

		this.selectSkill = this.add.image(845, 195, 'selectSkill').setDepth(-1);

		this.blueShield = this.add.image(230, 380, 'blueShield').setOrigin(0, 0).setDepth(1).setAlpha(1);

		// Input
		this.left = this.input.keyboard.addKey(16);
		this.right = this.input.keyboard.addKey(90)
		this.fire = [this.input.keyboard.addKey(53),
					this.input.keyboard.addKey(222)];
		this.switchSkillUp = this.input.keyboard.addKey(192);
		this.switchSkillDown = [this.input.keyboard.addKey(109),
								this.input.keyboard.addKey(8)];
		this.skillPress = [this.input.keyboard.addKey(57),
							this.input.keyboard.addKey(221),
							this.input.keyboard.addKey(65)];
		this.skillSwitchBtnDown = null;
		this.skillPressBtnDown = null;
		
		// Game status
		this.isPlaying = true;	
		
		this.gameBgm = this.sound.add('gameLoop', {
			volume: 1,
			loop: true,
		});
		this.endBgm = this.sound.add('endLoop', {
			volume: 1,
			loop: true,
		});

		this.gameBgm.play();
	}

	update() {
		// Move background star
		this.star.tilePositionY -= 0.75;
		if (this.isPlaying) {
			this.checkPlayerMove();
			this.checkFire();	
			this.clearBullet();
			this.generateEnemy();
			this.checkEnemyReachBottom();
			this.checkEnemyCollidePlayer();

			this.checkSkillSwitch();
			this.cooldownSkill();
			this.checkSkillPress();
			this.checkSkillActivateTime();

			this.fireTick++;
			this.enemyTick++;
		}   
		else {
			this.checkReset();
		}
	}
}