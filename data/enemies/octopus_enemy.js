// ENEMY: Octopus Enemy
//	An enemy that resembles an octopus. It has tentacles that it uses to attack, and
//	moves (steadily, unlike a real octopus) by moving its tentacles.
function octopusEnemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 50;
    newEnemy.health = 50;
    newEnemy.score = 50;
	newEnemy.name = "Octopus Ship";
	newEnemy.weight = 50; // inflicts 50 damage if player crashes into it
	newEnemy.height = 40;
	
	// add a triangular collision object to this enemy
    newEnemy.addCollision(new standardCollision(21));
        //.addObject(new cTriangle({x:15,y:0},{x:-10,y:10},{x:-10,y:-10}));
	
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
		
		ctx.fillStyle = "#00FF00";
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 3;
		ctx.beginPath();
			ctx.arc(0, 0, 20, -4*Math.PI/6, 4*Math.PI/6, false);
			ctx.fill();
			ctx.stroke();
		ctx.closePath();
        
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
	// when enemy dies, create a red round explosion
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.basicRedExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark on the side that the bullet hit
    newEnemy.hitEffect = function(x, y){
		// push the effect into the enemySys effect system
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, angle));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
	
    return newEnemy;
}