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
    
    // motion variables
    this.speed = 0;
    this.speed_x = 0;
    this.speed_y = 0;
    this.speedScale = 1.0;
    this.angle = 0;
    this.moving = false;
    
    // Sets the speed of the GameObject to the given value.
    this.setSpeed = function(speed) {
        this.speed = speed;
    }
    
    // Sets the direction of travel to the given angle. Movement will be
    // translated appropriately in the X and Y axis.
    this.setAngle = function(angle) {
        this.angle = angle;
    }
    
    // Movement value for each degree of freedom.
    this.motion_dirs = new Array(MotionController.NUM_DOF).map(
        Boolean.prototype.valueOf, false);
    
    // TODO - do something with angle here?
    this.move = function(direction, on) {
        if(direction >= 0 && direction < MotionController.NUM_DOF)
            this.motion_dirs[direction] = on;
    }
    
    // Motion toggle functions defined for the input bindings.
    this.moveUpStart    = function() { this.move(MotionController.MOVE_UP, true);     }
    this.moveUpEnd      = function() { this.move(MotionController.MOVE_UP, false);    }
    this.moveDownStart  = function() { this.move(MotionController.MOVE_DOWN, true);   }
    this.moveDownEnd    = function() { this.move(MotionController.MOVE_DOWN, false);  }
    this.moveLeftStart  = function() { this.move(MotionController.MOVE_LEFT, true);   }
    this.moveLeftEnd    = function() { this.move(MotionController.MOVE_LEFT, false);  }
    this.moveRightStart = function() { this.move(MotionController.MOVE_RIGHT, true);  }
    this.moveRightEnd   = function() { this.move(MotionController.MOVE_RIGHT, false); }
    
    // Movement will be controlled through the given KeyBindings instead of manually
    // by the implementing object. KeyBindings should also be bound to a
    // UserInteractionManager to have motion events triggered by user interactions.
    this.bindInput = function(keyBindings) {
        keyBindings.bindEvent(KeyBindings.UP_PRESSED, this.moveUpStart.bind(this));
        keyBindings.bindEvent(KeyBindings.UP_RELEASED, this.moveUpEnd.bind(this));
        keyBindings.bindEvent(KeyBindings.DOWN_PRESSED, this.moveDownStart.bind(this));
        keyBindings.bindEvent(KeyBindings.DOWN_RELEASED, this.moveDownEnd.bind(this));
        keyBindings.bindEvent(KeyBindings.LEFT_PRESSED, this.moveLeftStart.bind(this));
        keyBindings.bindEvent(KeyBindings.LEFT_RELEASED, this.moveLeftEnd.bind(this));
        keyBindings.bindEvent(KeyBindings.RIGHT_PRESSED, this.moveRightStart.bind(this));
        keyBindings.bindEvent(KeyBindings.RIGHT_RELEASED, this.moveRightEnd.bind(this));
    }
    
    this.setBoundary = function(rect) {
        // TODO - restricts movement to within the given boundary
    }
    
    this.update = function(dT) {
        var x_vel = 0;
        var y_vel = 0;
        if(this.motion_dirs[MotionController.MOVE_UP])
            y_vel -= this.speed;
        if(this.motion_dirs[MotionController.MOVE_DOWN])
            y_vel += this.speed;
        if(this.motion_dirs[MotionController.MOVE_LEFT])
            x_vel -= this.speed;
        if(this.motion_dirs[MotionController.MOVE_RIGHT])
            x_vel += this.speed;
        this.gameObj.setX(this.gameObj.getX() + x_vel / dT);
        this.gameObj.setY(this.gameObj.getY() + y_vel / dT);
    }
    
    /*// Speed is the object's current speed, normalSpeed is the standard. For
    //  efficiency, we pre-compute compute the X and Y speeds only the angle
    //  or speed is adjusted to avoid doing so every frame.
    this.speed = 0;
    this.normalSpeed = 0;
    this.speedX = 0;
    this.speedY = 0;
    
    // angle of the object's motion (in radians)
    this.angle = 0;
    
    
    // Speed reset Timer: whenever an object is slowed or sped up, it can be
    //  reset to its normal speed using this Timer.
    // Call speedResetTimer.set(seconds) - see modifySpeed function.
    this.speedResetTimer = new Timer(-1);
    this.speedResetTimer.property = this;
    this.speedResetTicking = false;
    this.speedResetTimer.onTime = function(controller){
            controller.setSpeed(controller.normalSpeed);
        };
    
    
    // Set the speed of the object for the given amount of time (in seconds).
    //  If no duration is provided, the speed change will be permanent and
    //  will also set the normal speed to the given value.
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
    //  the ratio amount given - for example, if 0.5 is given as ratio, the
    //  speed will be half of what it was. Otherwise, same functionality as
    //  setSpeed().
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
    }*/
    
}


// Number of degrees of freedom (up, down, left, right).
MotionController.NUM_DOF    = 4;

// Direction constants
MotionController.MOVE_UP    = 0;
MotionController.MOVE_DOWN  = 1;
MotionController.MOVE_LEFT  = 2;
MotionController.MOVE_RIGHT = 3;