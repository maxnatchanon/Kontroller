// Check if player pressed move button
PolyShooter.prototype.checkPlayerMove = function() {
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
PolyShooter.prototype.checkFire = function() {
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
PolyShooter.prototype.clearBullet = function() {
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
PolyShooter.prototype.generateEnemy = function() {
    if (this.enemyTick > this.enemyInterval) {
        var enemy = this.physics.add.sprite(Math.floor(Math.random() * 437) + 262, -Math.floor(Math.random() * 150), 'enemy');
        this.enemies.add(enemy);
        enemy.setVelocityY(Math.floor(Math.random() * this.enemySpeedRange) + this.enemySpeed);
        this.enemyTick = 0;
    }
}

// Check if enemy reach reached the bottom of screen
PolyShooter.prototype.checkEnemyReachBottom = function() {
    var reachedEnemies = [];
    this.enemies.children.iterate(function (enemy) {
        if (enemy.y > 540 + 40) {
            // TODO: Reduce player's life by 1
            reachedEnemies.push(enemy);
        }
    });
    for (let index = 0; index < reachedEnemies.length; index++) {
        this.enemies.remove(reachedEnemies[index], true, true);
    }
}

// Bullet and enemy collide callback function
PolyShooter.prototype.hitEnemy = function(enemy, bullet) {
    let diffX = bullet.x - enemy.x;
    if (diffX <= -5) {
        console.log('HIT ON THE LEFT!');
    }
    else if (diffX >= 5) {
        console.log('HIT ON THE RIGHT!');
    }
    else {
        console.log('HIT RIGHT AT THE CENTER!');
    }
    this.enemies.remove(enemy, true, true);
    this.bullets.remove(bullet, true, true);
}