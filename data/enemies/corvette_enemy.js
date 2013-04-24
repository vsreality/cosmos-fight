//===================== Corvet enemy ===================================================
function corvetteEnemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 200;
    newEnemy.health = 200;
    newEnemy.score = 50;
	newEnemy.name = "Corver";
	newEnemy.weight = 50; // inflicts 50 damage if player crashes into it
	newEnemy.height = 40;

    newEnemy.addCollision(new standardCollision(77))
        .addObject(new cTriangle({x:-77,y:-17},{x:-77,y:17},{x:60,y:-17}))
        .addObject(new cTriangle({x:-77,y:17},{x:60,y:-17},{x:60,y:17}))
        .addObject(new cCircle({x:60,y:0},17));
    
	// OVERRIDE
	// function called by enemy abstract class when enemy falls off screen:
    newEnemy.onOutOfScreen = function(){}

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
		ctx.drawImage(gameImgs.get("corvetShip"), -77, -17);
        
        //--------Collision circle-------
        /*
        ctx.strokeStyle = "#FF00FF";
        ctx.beginPath();
        ctx.arc(0, 0, 77,0,Math.PI*2,true);
        ctx.closePath();
        ctx.stroke();
		*/
        //-------------------------------
        
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
	// when enemy dies, create a blue round explosion
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.midBlueExplosion(this.getX(), this.getY()));
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