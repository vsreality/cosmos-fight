// ENEMY: miniBoss1 Enemy
//	A standard enemy unit constructed as an extention of the abstract enemy class
function miniBoss1(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 200;
    newEnemy.health = 200;
    newEnemy.score = 250;
	newEnemy.name = "Alien Battleship";
	newEnemy.weight = 200; // inflicts 200 damage if player crashes into it
	newEnemy.height = 55;
    // balance: this variable is used to animate the enemy (see draw function)
    newEnemy.balance = -10;
    newEnemy.dBalance = (30/FPS); // change in balance per frame based on FPS
    // Add weapon
    newEnemy.addWeapon(new enemyWeapon(Math.ceil(20 + getRandNum(30))))
        .onShootEvent = function(enemy){
            var bul1 = enemyBullet(-16, -20,
                                    enemy.getAngle(), 
                                    6, 5, "#CC33FF");
            rotatePoint(bul1, enemy.getAngle());
            translatePoint(bul1,enemy.getX(), enemy.getY());
            
            var bulCenter = enemyBullet(29, 0, 
                                    enemy.getAngle(), 
                                    6, 10, "#CC33FF");
            rotatePoint(bulCenter, enemy.getAngle());
            translatePoint(bulCenter,enemy.getX(), enemy.getY());
            
            var bul2 = enemyBullet(-16, 20, 
                                    enemy.getAngle(), 
                                    6, 5, "#CC33FF");
            rotatePoint(bul2, enemy.getAngle());
            translatePoint(bul2,enemy.getX(), enemy.getY());
            
            var bul3 = enemyBullet(-16, -20, 
                                    enemy.getAngle() - Math.PI/6,  
                                    6, 5, "#CC33FF");
            rotatePoint(bul3, enemy.getAngle());
            translatePoint(bul3,enemy.getX(), enemy.getY());
            
            var bul4 = enemyBullet(-16, 20, 
                                    enemy.getAngle() + Math.PI/6,
                                    6, 5, "#CC33FF");
            rotatePoint(bul4, enemy.getAngle());
            translatePoint(bul4,enemy.getX(), enemy.getY());
            
            
            enemy.enemySys.addBullet(bul1)
            .addBullet(bulCenter)
            .addBullet(bul2)
            .addBullet(bul3)
            .addBullet(bul4);
        }
    // Add collision
    newEnemy.addCollision(new standardCollision(50))
        .addObject(new cTriangle({x:29,y:0},{x:-21,y:20},{x:-21,y:-20}));
	// OVERRIDE
	// function called by enemy abstract class when enemy falls off screen:
	//	This function resets the enemy position to the top of the screen at a
	//	random X position.
    newEnemy.onOutOfScreen = function(){
        this.y = -30;
        this.x = getRandNum(areaWidth - 60) + 30;
    }
    
	// OVERRIDE
    // Draw function called each frame to draw this enemy onto the canvas.
	//	This draws the enemies specific appearance and animations
    newEnemy.draw = function(ctx){
        // update enemy animation (using balance variable)
        if(this.balance>=20)
            this.balance=-20;
        else // update balance based on dBalance (change value)
            this.balance += this.dBalance;
        
		// save context (start new drawing stack)
        ctx.save();
		// move context to enemy's x and y position
        ctx.translate(this.getX(), this.getY());
        // rotate context
        ctx.rotate(this.angle);

        //lines: FF9900
        //bg:   FFCCFF

		// set stroke (lines) to ORANGE color
        ctx.strokeStyle = "rgb(" + Math.round(255-2*(100-this.health)) +
            ", 153, " + Math.round(2*(100-this.health)) + ")";
        
		// start drawing enemy
        ctx.beginPath();
        ctx.moveTo(-24, -this.balance);
        ctx.lineTo(29, 0);
        ctx.closePath();
        ctx.stroke();
        
        //ctx.fillStyle = "rgb(255, " + (204-(100-this.health)) +
        //    ", 255)"; //background color (orangish)
		ctx.fillStyle = "#222222";
        ctx.beginPath();
        ctx.moveTo(-21, 0);
        ctx.lineTo(29, 0);
        ctx.lineTo(-21, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        //ctx.fillStyle = "rgb(207, " + (170-(100-this.health)) + ", 207)";
		ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.moveTo(-21, 0);
        ctx.lineTo(29, 0);
        ctx.lineTo(-21, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-24, this.balance);
        ctx.lineTo(29, 0);
        ctx.closePath();
        
        ctx.stroke();
        
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
    
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.giantExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark on the side that the bullet hit
    newEnemy.hitEffect = function(x, y){
		// create an angle
        var angle;
		// if bullet hit from the right, shift angle to the right side
        if(x > this.getX())
            angle = Math.PI/3;
		// if bullet hit from the left, shift angle to the left side
        else if(x < this.getX())
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