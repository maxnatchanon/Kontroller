// Check if player pressed move button
MainGame.prototype.checkPlayerMove = function() {
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
MainGame.prototype.checkFire = function() {
    for (let index = 0; index < this.fire.length; index++) {
        if (this.fire[index].isDown && this.fireTick > this.fireInterval) {
            var bullet = this.physics.add.sprite(this.player.x, this.player.y + 10, 'bullet');
            this.bullets.add(bullet);
            bullet.anims.play('fire');
            bullet.setVelocityY(-1200);
            bullet.setMass(0);
            this.fireTick = 0;
            this.sound.play('fireSound', { volume: 0.85, seek: 0.05 });
        }
    }
}

// Clear bullets that are out of screen
MainGame.prototype.clearBullet = function() {
    var outBullets = [];
    this.bullets.children.iterate(function (bullet) {
        if (bullet.y < -100) {
            outBullets.push(bullet);
        }
    });
    for (let index = 0; index < outBullets.length; index++) {
        this.bullets.remove(outBullets[index], true, true);
    }
}

// Generate new enemy if tick reach current interval
MainGame.prototype.generateEnemy = function() {
    if (this.enemyTick > this.enemyInterval) {
        var enemy = this.physics.add.sprite(Math.floor(Math.random() * 437) + 262, -Math.floor(Math.random() * 150), 'enemy');
        this.enemies.add(enemy);
        enemy.setVelocityY(Math.floor(Math.random() * this.enemySpeedRange) + this.enemySpeed);
        enemy.setMass(0);
        this.enemyTick = 0;
    }
}

// Check if enemy reach reached the bottom of screen
MainGame.prototype.checkEnemyReachBottom = function() {
    var reachedEnemies = [];
    this.enemies.children.iterate(function (enemy) {
        if (enemy.y > 540 + 40) { 
            reachedEnemies.push(enemy);
        }
    });
    for (let index = 0; index < reachedEnemies.length; index++) {
        this.enemies.remove(reachedEnemies[index], true, true);
        this.reduceLifePoint();
    }
}

// Bullet and enemy collide callback function
MainGame.prototype.bulletHitEnemy = function(enemy, bullet) {
    if (bullet.x < enemy.x) {
        bullet.setVelocityY(0);
        bullet.setOrigin(0.5,0.95)
        bullet.anims.play('bulletHit');
        this.bullets.remove(bullet, false, false);
        bullet.on("animationcomplete", function() {
            bullet.destroy(true, false);
        }, this);
        this.killEnemy(enemy, true);
    }
    else {
        bullet.setVelocityY(0);
        bullet.setOrigin(0.5,0.95);
        bullet.anims.play('bulletHit');
        bullet.setScale(-1,1);
        this.bullets.remove(bullet, false, false);
        bullet.on('animationcomplete', function() {
            bullet.destroy(true, false);
        }, this);
        this.killEnemy(enemy, false);
    }
}         

// Check enemy and player collision
MainGame.prototype.checkEnemyCollidePlayer = function() {
    // Player and enemy body are both 40x40 pixel
    let playerTop = this.player.y - 20;
    let playerX = this.player.x;
    let playerLeft = playerX - 20;
    let playerRight = playerX + 20;
    var collidedEnemies = [];
    this.enemies.children.iterate(function (enemy) {
        if (enemy.y + 20 >= playerTop) {
            if (enemy.x + 20 >= playerLeft && enemy.x + 20 <= playerRight) { 
                collidedEnemies.push([enemy, enemy.x > playerX]);
            }
            if (enemy.x - 20 >= playerLeft && enemy.x - 20 <= playerRight) { 
                collidedEnemies.push([enemy, enemy.x > playerX]);
            }
        }
    });
    for (let index = 0; index < collidedEnemies.length; index++) {
        this.killEnemy(collidedEnemies[index][0], collidedEnemies[index][1]);
        this.reduceLifePoint();
    }
}

// Kill enemy
MainGame.prototype.killEnemy = function(enemy, onRight) {
    this.sound.play('enemyDeadSound', { volume: 0.25, seek: 0.05 });
    this.addScore();
    if (onRight) {
        enemy.setVelocityY(0);
        enemy.anims.play('enemyHit');
        enemy.setScale(-1,1);
        this.enemies.remove(enemy, false, false);
        enemy.on("animationcomplete", function() {
            enemy.destroy(true, false);
        }, this);
    }
    else {
        enemy.setVelocityY(0);
        enemy.anims.play('enemyHit');
        this.enemies.remove(enemy, false, false);
        enemy.on('animationcomplete', function() {
            enemy.destroy(true, false);
        }, this);
    }
}

// Add current score by 1
MainGame.prototype.addScore = function() {
    this.currentScore++;
    this.scoreText.setText(this.currentScore);
    if (this.currentScore <= 100 && this.currentScore % 10 == 0) {
        this.currentLevel += (this.currentLevel < 8) ? 1 : 0;
        if (this.currentLevel < 8) {
            this.enemyInterval = this.enemyIntervalLevel[this.currentLevel];
            this.enemySpeed = this.enemySpeedLevel[this.currentLevel];
        }
        else if (this.currentScore === 100) {
            this.enemyInterval = this.enemyIntervalLevel[this.currentLevel];
            this.enemySpeed = this.enemySpeedLevel[this.currentLevel];
        }
    }
}

// Reduce life point and end game if life point is 0
MainGame.prototype.reduceLifePoint = function() {
    this.currentLifePoint--;
    var life = this.lifes[this.currentLifePoint];
    life.anims.play('lifeBreak');
    life.on('animationcomplete', function() {
        life.destroy(true, false);
    });
    if (this.currentLifePoint == 0) {
        this.sound.play('gameOverSound', { volume: 0.7, seek: 0.05 });
        this.player.setVelocityX(0);
        this.isPlaying = false;
        this.player.anims.play('playerDead');
        this.player.on('animationcomplete', function() {
            this.destroy();
        });
        this.endGameText.setAlpha(1);
        this.gameBgm.stop();
        this.endBgm.play();
    }
    else {
        this.sound.play('lifeBreakSound', { volume: 0.6 });
    }
}

// Restart the game
MainGame.prototype.resetGame = function() {
    this.sound.play('startGameSound', { volume: 0.45 });

    this.enemies.clear(true, true);
    this.bullets.clear(true, true)

    this.currentLifePoint = 3;
    this.lifes = [];
    this.lifes.push(this.physics.add.sprite(48, 270, 'life'));
    this.lifes.push(this.physics.add.sprite(113, 270, 'life'));
    this.lifes.push(this.physics.add.sprite(178, 270, 'life'));

    this.currentScore = 0;
    this.scoreText.setText(this.currentScore);

    this.currentLevel = 0;
    this.enemyTick = 0;
	this.enemyInterval = this.enemyIntervalLevel[this.currentLevel];
	this.enemySpeed = this.enemySpeedLevel[this.currentLevel];
    this.enemySpeedRange = 40;
    
    this.player = this.physics.add.sprite(480, 480, 'player');
    this.player.setOrigin(0.5, 0.5);
    this.physics.add.collider(this.player, this.wall);

    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, this.bullets, this.bulletHitEnemy, null, this);
    
    this.endGameText.setAlpha(0);
    this.isPlaying = true;	

    this.currentSkill = 0;
    this.skillCoolDownTime[0] = 2000;
    this.skillCoolDownTime[1] = 2500;
    this.skillCoolDownTime[2] = 6000;
    this.skillActiveTime[0] = 0;
    this.skillActiveTime[1] = 0;
    this.skillActiveTime[2] = 0;
    this.selectSkill.y = this.skillPos[this.currentSkill];

    this.endBgm.stop();
    this.gameBgm.play();
}

// Check if player press fire to restart the game
MainGame.prototype.checkReset = function() {
    for (let index = 0; index < this.fire.length; index++) {
        if (this.fire[index].isDown && this.fireTick > this.fireInterval) {
            this.resetGame();
        }
    }
}