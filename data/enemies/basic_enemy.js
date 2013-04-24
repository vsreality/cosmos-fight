// ENEMY: Basic Enemy
//	A standard enemy unit constructed as an extention of the abstract enemy class
function basicEnemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 10;
    newEnemy.health = 10;
    newEnemy.score = 10;
	newEnemy.name = "Alien Invader";
	newEnemy.weight = 50; // inflicts 50 damage if player crashes into it
	newEnemy.height = 30;
	
	// color: blue color by default, adjust by setColor function
	newEnemy.color = "#0000FF";
	
	// setColor function: to customize the color of this enemy:
	// PARAMETER: a color string (e.g. "#FF0000")
	newEnemy.setColor = function(newColor){
		this.color = newColor;
	}

    // balance: this variable is used to animate the enemy (see draw function)
    newEnemy.balance = -10;
    newEnemy.dBalance = (30/FPS); // change in balance per frame based on FPS

	// add a weapon to this enemy that shoots a single bullet at a random interval
    newEnemy.addWeapon(new enemyWeapon(Math.ceil(20 + getRandNum(30))))
        .onShootEvent = function(enemy){
            var bul1 = enemyBullet(14, 0, 
                                    enemy.getAngle(), 
                                    6, 10);
            rotatePoint(bul1, enemy.getAngle());
            translatePoint(bul1,enemy.getX(), enemy.getY());

            enemy.enemySys.addBullet(bul1);
        }
	
	// add a triangular collision object to this enemy
    newEnemy.addCollision(new standardCollision(25))
        .addObject(new cTriangle({x:15,y:0},{x:-10,y:10},{x:-10,y:-10}));
    
	// OVERRIDE
	// function called by enemy abstract class when enemy falls off screen:
	//	This function resets the enemy position to the top of the screen at a
	//	random X position.
    newEnemy.onOutOfScreen = function(){
        this.y = -30;
        this.x = getRandNum(areaWidth - 60) + 30;
        this.setSpeed(getRandNum(3) + 1);
		this.normalSpeed = this.speed;
    }

	// OVERRIDE
    // Draw function called each frame to draw this enemy onto the canvas.
	//	This draws the enemies specific appearance and animations
    newEnemy.draw = function(ctx){
        // update enemy animation (using balance variable)
        if(this.balance>=10)
            this.balance=-10;
        else // update balance based on dBalance (change value)
            this.balance += this.dBalance;
        
		// save context (start new drawing stack)
        ctx.save();
		// move context to enemy's x and y position
        ctx.translate(this.getX(), this.getY());
        // rotate context
        ctx.rotate(this.angle);
		// set stroke (lines) to BLUE color
        ctx.strokeStyle = this.color;
        
		// start drawing enemy
        ctx.beginPath();
        ctx.moveTo(-13, -this.balance);
        ctx.lineTo(15, 0);
        ctx.closePath();
        ctx.stroke();
        
        ctx.fillStyle = "#FFFAF0";
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(-10, -10);//?
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = "#CFAF8F";
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(-10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-13, this.balance);
        ctx.lineTo(15, 0);
        ctx.closePath();
        
        ctx.stroke();
        
        //--------Collision circle-------
        /*
        ctx.strokeStyle = "#FF00FF";
        ctx.beginPath();
        ctx.arc(0, 0, 40,0,Math.PI*2,true);
        ctx.closePath();
        ctx.stroke();
        */
        //-------------------------------
        
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