/* File: game_object.js
 *
 * A GameObject is a common interface object for dealing with most of the
 * sprites seen throughout the game. This interface includes the (x, y)
 * position of an object, and common functions necessary to use the object
 * in the Level subsystem.
 *
 * Main Object: GameObject() [abstract object]
 */


// GameObject class
function GameObject() {

    // this object's on-screen (x, y) coordinates, orientation angle, and size
    this.x = 0;
    this.y = 0;
    this.angle = ANGLE_UP;
    this.size = 0;
    
    
    
    // Position setter: given an x, y position and (optionally) an angle.
    //  Angle defaults to facing up if no angle is provided.
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
    
    // Position getters:
    this.getX = function() {
        return this.x;
    }
    this.getY = function() {
        return this.y;
    }
    
    // Size setter and getter:
    this.setSize = function(size) {
        this.size = size;
    }
    this.getSize = function() {
        return this.size;
    }
    
    
    
    // Keep track of all of the object's events, and update them as they come.
    this.events = new Array();
    this.addEvent = function(event) {
        this.events.push(event);
    }
    
    
    
    // Add a COLLISION MANAGER to this object:
    this.hasCollisionMngr = false;
    this.setCollisionManager = function(radius) {
        this.collisionMngr = new CollisionManager(this);
        this.collisionMngr.setCollision(radius);
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
    
    
    
    // Add a MOTION CONTROLLER to this object:
    this.hasMotionCtrl = false;
    this.setMotionController = function(speed, angle) {
        this.motionCtrl = new MotionController(this);
        this.motionCtrl.setSpeed(speed);
        this.motionCtrl.setAngle(angle);
        this.hasMotionCtrl = true;
    }
    // Returns the Motion Controller of this object. If no Motion Controller
    //  was set, returns a new Motion Controller for this object.
    this.getMotionController = function() {
        if(this.hasMotionCtrl)
            return this.motionCtrl;
        else
            return new MotionController(this);
    }
    
    
    
    // Add an EFFECTS MANAGER to this object:
    
    
    
    // Add a HEALTH MANAGER to this object:
    this.hasHealthMngr = false;
    this.setHealthManager = function(health) {
        this.healthMngr = new HealthManager(this);
        this.healthMngr.initHealth(health);
        this.hasHealthMngr = true;
    }
    // Returns the Health Manager of this object. If no Health Manager
    //  was set, returns a new Health Manager for this object.
    this.getHealthManager = function() {
        if(this.hasHealthMngr)
            return this.healthMngr;
        else
            return new HealthManager(this);
    }
    
    
    
    // Add an ATTACHMENT MANAGER to this object:
    //  - weapons
    //  - shields
    
    
    
    // Add an ACTION CONTROLLER to this object:
    
    
    
    // Add a USER INPUT MANAGER to this object:
    
    
    
    // isAlive generally returns true as long as this object is active. The
    //  object can be deactivated by setting alive to false.
    // This function is overwritten by a HealthManager when set to return true
    //  as long as the object's health is above 0.
    this.alive = true;
    this.isAlive = function() {
        return this.alive;
    }
    
    // Deactivates the object by flagging it as not alive.
    this.deactivate = function() {
        this.alive = false;
    }
    
    
    
    // Update function: update this object for this frame.
    this.update = function() {
        // update all object controllers and managers
        if(this.hasCollisionMngr)
            this.getCollisionManager().update();
        if(this.hasMotionCtrl)
            this.getMotionController().update();
        //if(this.hasEffectsMngr)
        //    this.getEffectsManager().update();
        if(this.hasHealthMngr)
            this.getHealthManager().update();
        //if(this.hasAttachmentsMngr)
        //    this.hasAttachmentsManager().update();
        //if(this.hasActionCtrl)
        //    this.getActionController().update();
        //if(this.hasInputMngr)
        //    this.getInputManager().update();
        
        // Update all events associated with this object. If an event is fired,
        //  its action is executed (this needs to be defined by each object
        //  individually). The executeAction function can - and should - reset
        //  the event if it's to be reused. If after this the event is still
        //  flagged as dead (i.e. isAlive returns false), it will be removed.
        for(var i=0; i<this.events.length; i++) {
            this.events[i].update();
            if(this.events[i].fired())
                this.events[i].executeAction();
            if(!this.events[i].isAlive()) {
                this.events.splice(i, 1);
                i--;
            }
        }
    }
    
    // Draw function: animate this object on the screen.
    // OVERRIDE to draw object-specific graphics. By default, it will draw
    //  a red circle around the object's (x, y) position.
    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.getX(), this.getY());
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, ANGLE_FULL_CIRCLE);
        ctx.fill();
        ctx.restore();
    }
    
}