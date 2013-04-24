/* File comments updated: Sunday, March 25, 2012 at 12:37 AM
 *
 *  BULLET CLASS
 */
 
 
 /* Main bullet constructor: sets up bullet with all necessary
  *    initial variables and internal functions.
  */
function bullet(x, y, angle, speed, damage){
	// BULLET VARIABLES
	// position (x and y)
    this.x = x;
    this.y = y;
	
	// Orientation
	this.angle = angle;
	
	// bullet speed (x and y)
	this.speed = speed;
    this.speedX = speed*Math.cos(angle)*(30/FPS); // scaled speed by FPS
    this.speedY = speed*Math.sin(angle)*(30/FPS); // scaled speed by FPS
	
	// Collision, just a point
	this.collision = new standardCollision();
	this.collision.parent = this;
	
	// Get X
	this.getX = function(){
		return this.x;
	}
	// Get Y
	this.getY = function(){
		return this.y;
	}
	
	this.setSpeedX = function(speedX){
		this.speedX = speedX * (30/FPS);
		return this;
	}
	this.setSpeedY = function(speedY){
		this.speedY = speedY * (30/FPS);
		return this;
	}
	
	// the amount of damage this bullet inflicts on hit
    this.damage = damage;
	
	// the amount of damage this bullet potentially applies
	//	(this value can be modified by whatever the bullet interacts
	//	with and change throughout the bullet's lifetime, and works
	//	independently of the unchanging damage value.
	// see player.js:[player.applyBulletDamage(bullet)]
	//	for an example of this variable's application.
	this.appliedDamage = this.damage;
	
	// color of the bullet (animation color)
    this.color = "#000000";
	
	// size of the bullet (how wide the line is)
	this.size = 2;
    
	// update function: update the bullet x and y position on the
	//	bases of x and y speed values.
    this.update = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    
    // draw function: animate this bullet on the screen.
    this.draw = function(ctx){}
}


// ENEMY BULLET TYPE:
//	a basic bullet used by enemies
//	constructed with initial x and y values
//	and initial damage (inflicted to player on hit)
function enemyBullet(x, y, angle, speed, dmg, color, size){
	//Default values
	dmg = typeof dmg !== 'undefined' ? dmg : 10;
    color = typeof color !== 'undefined' ? color : "#FF0022";
    size = typeof size !== 'undefined' ? size : 2;
	
    var newBullet = new bullet(x, y, angle, speed , dmg);
	newBullet.color = color;
	newBullet.size = size;
	
	// draw function: animate this bullet on the screen (this draws
	//	a line of the color provided by the this.color variable).
    newBullet.draw = function(ctx){
        ctx.save();
		// move to bullet's x and y position
        ctx.translate(this.x, this.y);
		
		ctx.rotate(this.angle+Math.PI/2);
        
		// set to bullet's specified color
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(0, -3);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    return newBullet;
}


// PLAYER BULLET TYPE:
//	a basic bullet used by the player
//	constructed with initial x and y values
//	and initial damage (inflicted to enemy on hit)
function playerBullet(x, y, dmg, coler, size){
	//Default values
    color = typeof color !== 'undefined' ? color : "#FFFF66";
    size = typeof size !== 'undefined' ? size : 2;
	
    var newBullet = new bullet(x, y, -Math.PI/2, 6, dmg);
	newBullet.color = color;
	newBullet.size = size;
	// draw function: animate this bullet on the screen (this draws
	//	a line of the color provided by the this.color variable).
    newBullet.draw = function(ctx){
        ctx.save();
		// move to bullet's x and y position
        ctx.translate(this.x, this.y);
		// set to bullet's specified color
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(0, -3);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    return newBullet;
}