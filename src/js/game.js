var config = {
	type: Phaser.AUTO,
	width: 960,
	height: 540,
	parent: "gameDiv",
	physics: {
		default: 'arcade'
	},
	scene: [StartScreen, MainGame]
}

var game = new Phaser.Game(config)