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
	
	
	// Add a Motion Controller to this object:
	this.hasMotionCtrl = false;
	this.setMotionController = function(speed, angle) {
		this.motionCtrl = new MotionController(this);
		this.motionCtrl.setSpeed(speed);
		this.motionCtrl.setAngle(angle);
		this.hasMotionCtrl = true;
	}
	// Returns the motion controller of this object. If no motion controller
	//	was set, returns a new Motion Controller for this object.
	this.getMotionController = function() {
		if(this.hasMotionCtrl)
			return this.motionCtrl;
		else
			return new MotionController(this);
	}
	
	
	// Position getters:
	this.getX = function() {
		return this.x;
	}
	this.getY = function() {
		return this.y;
	}
	
	// Position setters:
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
	
	
	// Update function: update this object for this frame.
	this.update = function() { }
	
    // Draw function: animate this object on the screen.
	this.draw = function(ctx) { }
	
	
	// Visual effects animations:
	this.hitEffect = function() { }
	
	
	// Damage variables and functions:
	this.health = 0;
	this.applyDamage = function(damage) {
		this.health -= damage;
		if(this.health < 0)
			this.health = 0;
	}
	
	
	// isAlive is generally TRUE as long as this object is active and at some
	//   amount of health in the game. It should return FALSE when the object
	//   needs to be removed from the game.
	this.alive = true;
	this.isAlive = function() {
		return this.alive;
	}
	
}
