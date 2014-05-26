/* File: bullets.js
 *
 * Bullets are used as common weapon projectiles for the player and for enemies.
 * Each bullet is a game object equipped with direction (angle), speed, and
 * a damage value that it deals on impact.
 *
 * Main Object:  Bullet(x, y, angle, speed, damage)
 * Prototype(s): GameObject()
 */



// Main Bullet object: sets up an arbitrary with all necessary initial
//	variables and internal functions.
function Bullet(x, y, angle, speed, damage){
	// Location
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
	
	// draw function: draw the bullet on the screen in the correct place
	this.draw = function(ctx) {
		ctx.save();
		
		// move to bullet's x and y position and rotate correctly
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle+Math.PI/2);
		
		// set to bullet's specified color, size, and draw it
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.size;
		ctx.beginPath();
		ctx.moveTo(0, 3);
		ctx.lineTo(0, -3);
		ctx.closePath();
		ctx.stroke();
		
		ctx.restore();
	}
	
}
// Bullet is a Game Object.
Bullet.prototype = new GameObject();



// BulletFactory contains methods for creating different types of bullets.
var BulletFactory = {

	// Create a Player Bullet with default values if none are specified.
	playerBullet: function(x, y, angle, speed, dmg, color, size) {
		return BulletFactory.createBullet(x, y, -Math.PI/2, 6,
			typeof dmg !== 'undefined' ? dmg : 10,				// damage
			typeof color !== 'undefined' ? color : "#FFFF66",	// color
			typeof size !== 'undefined' ? size : 2				// size
		);
	},
	
	// Create an Enemy Bullet with default values if none are specified.
	enemyBullet: function(x, y, angle, speed, dmg, color, size) {
		return BulletFactory.createBullet(x, y, angle, speed,
			typeof dmg !== 'undefined' ? dmg : 10,				// damage
			typeof color !== 'undefined' ? color : "#FF0022",	// color
			typeof size !== 'undefined' ? size : 2				// size
		);
	},
	
	// Construct an arbitrary bullet (given the pre-defined parameters).
	createBullet: function(x, y, angle, speed, dmg, color, size) {
		var newBullet = new Bullet(x, y, angle, speed, dmg);
		newBullet.color = color;
		newBullet.size = size;
		return newBullet;
	}

}
