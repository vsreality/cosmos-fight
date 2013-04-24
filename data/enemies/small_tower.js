//===================== Small Tower ====================================================
function smallTowerEnemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 30;
    newEnemy.health = 30;
    newEnemy.score = 30;
	newEnemy.name = "Small Tower";
	newEnemy.weight = 30; // inflicts 50 damage if player crashes into it
	newEnemy.height = 20;
	
    newEnemy.addWeapon(new enemyWeapon(10))
        .onShootEvent = function(enemy){
            var bul1 = enemyBullet(14, 0, 
                                    enemy.getAngle(), 
                                    6, 10);
            rotatePoint(bul1, enemy.getAngle());
            translatePoint(bul1,enemy.getX(), enemy.getY());

            enemy.enemySys.addBullet(bul1);
        }
    newEnemy.addCollision(new standardCollision(13));
        //.addObject(new cCircle({x:0,y:0},13));
    

	// OVERRIDE
    // Draw function called each frame to draw this enemy onto the canvas.
	//	This draws the enemies specific appearance and animations
    newEnemy.draw = function(ctx){
		// save context (start new drawing stack)
        ctx.save();
		// move context to enemy's x and y position
        ctx.translate(this.getX(), this.getY());
        // rotate context
        ctx.rotate(this.angle);
		// draw the tower image
		ctx.drawImage(gameImgs.get("smallTower"), -13, -13);
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
	// when enemy dies, create a blue round explosion
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.basicBlueExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark on the side that the bullet hit
    newEnemy.hitEffect = function(x, y){
		// create an angle
        var angle;
		// if bullet hit from the right, shift angle to the right side
        if(x > this.x)
            angle = Math.PI/3;
		// if bullet hit from the left, shift angle to the left side
        else if(x < this.x)
            angle = (2*Math.PI)/3;
		// otherwise, it hit in the middle so create the effect directed down
        else
            angle = (3*Math.PI)/2;
		// push the effect into the enemySys effect system
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, angle));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
    return newEnemy;
}