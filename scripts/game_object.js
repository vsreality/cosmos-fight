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

	// this object's on-screen (x, y) coordinates and orientation angle
	this.x = 0;
	this.y = 0;
	this.angle = ANGLE_UP;
	
	
	// Add a Collision Manager to this object:
	this.hasCollisionMngr = false;
	this.setCollisionManager = function() {
		this.collisionMngr = new CollisionManager(this);
		this.hasCollisionMngr = true;
	}
	// Returns the Collision Manager of this object. If no Collision Manager
	//	was set, returns a new Collision Manager for this object.
	this.getCollisionManager = function() {
		if(this.hasCollisionMngr)
			return this.collisionMngr;
		else
			return new CollisionManager(this);
	}
	
	
	// Add a Motion Controller to this object:
	this.hasMotionCtrl = false;
	this.setMotionController = function(speed, angle) {
		this.motionCtrl = new MotionController(this);
		this.motionCtrl.setSpeed(speed);
		this.motionCtrl.setAngle(angle);
		this.hasMotionCtrl = true;
	}
	// Returns the Motion Controller of this object. If no Motion Controller
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
	
	
	// Position setter: given an x, y position and (optionally) an angle.
	//	Angle defaults to facing up if no angle is provided.
	this.setPosition = function(x, y, angle) {
		this.x = x;
		this.y = y;
		this.angle = (typeof angle !== 'undefined' ? angle : ANGLE_UP);
	}
	
	// Position setters for each variable:
	this.setX = function(x) {
		this.x = x;
	}
	this.setY = function(y) {
		this.y = y;
	}
	this.setAngle = function(angle) {
		this.angle = angle;
	}
	
	
	// Update function: update this object for this frame.
	this.update = function() { }
	
    // Draw function: animate this object on the screen.
	this.draw = function(ctx) { }
	
	
	// Visual effects animations: TODO - put inside EffectsManager
	this.hitEffect = function() { }
	
	
	// Damage variables and functions: TODO - put inside another manager class?
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
