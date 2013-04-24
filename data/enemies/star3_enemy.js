// ENEMY: Star Enemy
//	A standard enemy unit constructed as an extention of the abstract enemy class
function Star3Enemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 30;
    newEnemy.health = 30;
    newEnemy.score = 10;
	newEnemy.name = "Star Alien Invader";
	newEnemy.weight = 50; // inflicts 50 damage if player crashes into it
	newEnemy.height = 30;
	
    newEnemy.addCollision(new standardCollision(40))
        .addObject(new cTriangle({x:-7,y:-4},{x:0,y:-40},{x:7,y:-4}))
        .addObject(new cTriangle({x:-35,y:20},{x:-7,y:-4},{x:0,y:8}))
        .addObject(new cTriangle({x:0,y:8},{x:7,y:-4},{x:35,y:20}))
        .addObject(new cTriangle({x:-7,y:-4},{x:7,y:-4},{x:0,y:8}));
    
	// OVERRIDE
	// function called by enemy abstract class when enemy falls off screen:
	//	This function resets the enemy position to the top of the screen at a
	//	random X position.
    newEnemy.onOutOfScreen = function(){
        
    }

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

        // draw the ship image
		ctx.drawImage(gameImgs.get("star3Ship"), -35, -40);
        
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