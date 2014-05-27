/* File: motion_controller.js
 *
 * A MotionController is an object that can interface with any GameObject
 * to provide standard motion properties, including basic movement over time,
 * acceleration/deceleration, and speeding up or speeding down time.
 *
 * Main Object: MotionController(gameObj)
 */


// MotionController class
// Parameter: gameObj to control, must be a GameObject interface.
function MotionController(gameObj) {

	// keep track of the game object
	this.gameObj = gameObj;
	
	// Speed is the object's current speed, normalSpeed is the standard. For
	//	efficiency, we pre-compute compute the X and Y speeds only the angle
	//	or speed is adjusted to avoid doing so every frame.
	this.speed = 0;
	this.normalSpeed = 0;
	this.speedX = 0;
    this.speedY = 0;
	
	// angle of the object's motion (in radians)
	this.angle = 0;
	
	
	// Speed reset Timer: whenever an object is slowed or sped up, it can be
	//	reset to its normal speed using this Timer.
	// Call speedResetTimer.set(seconds) - see modifySpeed function.
	this.speedResetTimer = new Timer(-1);
	this.speedResetTimer.property = this;
	this.speedResetTicking = false;
	this.speedResetTimer.onTime = function(controller){
            controller.setSpeed(controller.normalSpeed);
        };
	
	
	// Set the speed of the object for the given amount of time (in seconds).
	//	If no duration is provided, the speed change will be permanent and
	//	will also set the normal speed to the given value.
	// Parameters: the "speed" value to set, and the "duration" in seconds.
	this.setSpeed = function(speed, duration) {
		if (typeof duration === 'undefined') {
			this.speed = speed;
			this.normalSpeed = speed;
			this.speedResetTicking = false;
		} else {
			this.speed = speed;
			this.speedResetTimer.set(secToFrames(duration));
			this.speedResetTicking = true;
		}
		
		// adjust the x and y speeds based on angle.
		// TODO - scale FPS in update function!!!
		this.speedX = this.speed * Math.cos(this.angle) * (30/FPS);
		this.speedY = this.speed * Math.sin(this.angle) * (30/FPS);
	}
	
	
	// Set the speed of the object for a given amount of time (in seconds) by
	//	the ratio amount given - for example, if 0.5 is given as ratio, the
	//	speed will be half of what it was. Otherwise, same functionality as
	//	setSpeed().
	this.setSpeedRelative = function(ratio, duration) {
		this.setSpeed(this.speed * ratio, duration);
	}
	
	
	// Set the angle that this object will be moving at.
	this.setAngle = function(angle) {
		this.angle = angle;
		
		// adjust the x and y speeds based on angle.
		// TODO - scale FPS in update function!!!
		this.speedX = this.speed * Math.cos(this.angle) * (30/FPS);
		this.speedY = this.speed * Math.sin(this.angle) * (30/FPS);
	}
	
	
	// update function: update the object's motion for this frame.
	// TODO - update this for variable framerate
	this.update = function() {
		this.gameObj.setX(this.gameObj.getX() + this.speedX);
		this.gameObj.setY(this.gameObj.getY() + this.speedY);
	}
	
}
