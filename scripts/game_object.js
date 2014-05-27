/* File: game_object.js
 *
 * A GameObject is a common interface object for dealing with most of the
 * sprites seen throughout the game. This interface includes the (x, y)
 * position of an object, and common functions necessary to use the object
 * in the Level subsystem.
 *
 * Main Object: GameObject()
 */


// GameObject class
function GameObject() {

	// this object's on-screen (x, y) coordinates
	this.x = 0;
	this.y = 0;
	
	// collision - TODO implement this part
	this.collision = 0;
	
	// damage variables and functions
	this.health = 0;
	this.applyDamage = function(damage) {
		this.health -= damage;
		if(this.health < 0)
			this.health = 0;
	}
	
	// visual effects
	this.hitEffect = function() { }
	
	// update function: update this object for this frame.
	this.update = function() { }
	
    // draw function: animate this object on the screen.
	this.draw = function(ctx) { }
	
	// position getters
	this.getX = function() {
		return this.x;
	}
	this.getY = function() {
		return this.y;
	}
	
	// position setters
	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}
	this.setX = function(x) {
		this.x = x;
	}
	this.setY = function(y) {
		this.y = y;
	}
	
	// isAlive is generally TRUE as long as this object is active and at some
	//   amount of health in the game. It should return FALSE when the object
	//   needs to be removed from the game.
	this.alive = true;
	this.isAlive = function() {
		return this.alive;
	}
	
}
