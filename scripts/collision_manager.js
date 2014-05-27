/* File: collision_manager.js
 *
 * A CollisionManager is an object that can interface with any GameObject
 * to provide standard physics properties, namely collision. Movement is
 * separately managed by the MotionController class.
 *
 * Main Object: CollisionManager(gameObj)
 */


// CollisionManager class
// Parameter: gameObj to control, must be a GameObject interface.
function CollisionManager(gameObj) {

	// keep track of the game object
	this.gameObj = gameObj;
	
	
	// Adds a new standard collision radius around the object and allows the
	//	collision manager to update and check if its parent object collides
	//	with other game objects that have collision enabled.
	// More precise collision shapes can be added using the functions below.
	this.hasCollisionObj = false;
	this.setCollision = function(radius) {
		this.collisionObj = new standardCollision(radius);
		this.collisionObj.x = this.gameObj.getX();
		this.collisionObj.y = this.gameObj.getY();
		this.hasCollisionObj = true;
	}
	
	
	// Adds a triangle collision shape to the object.
	this.addTriangle = function(x1, y1, x2, y2, x3, y3) {
		if(this.hasCollisionObj) {
			this.collisionObj.addObject(
				new cTriangle({x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}));
		}
	}
	
	// Adds a circular collision shape to the object.
	this.addCircle = function(x, y, r) {
		if(this.hasCollisionObj) {
			this.collisionObj.addObject(new cCircle({x:x, y:y}, r));
		}
	}
	
	// TODO - more shapes: square, oval, cone, etc?
	
	
	this.collidesWith = function(otherGameObj) {
		// TODO - needs serious revamping here, to consider mid-frame collisions
		var otherColMngr = otherGameObj.getCollisionManager();
		if(!this.hasCollisionObj || !otherColMngr.hasCollisionObj)
			return false;
		else
			return isCollide(this.collisionObj, otherColMngr.collisionObj);
	}
	
	
	this.update = function() {
		// TODO - this needs to be revamped to introduce better collision
		this.collisionObj.x = this.gameObj.getX();
		this.collisionObj.y = this.gameObj.getY();
	}
	
}
