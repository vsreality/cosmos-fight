/* File: input_controller.js
 *
 * A InputController is an object that can interface with any GameObject
 * to provide a mapping from user input to in-game object control. The
 * InputController is based on the MotionController, except operates on
 * demand of user input instead of each frame.
 *
 * Main Object: InputController(gameObj)
 * Prototype(s): MotionController()
 */


// InputController class
// Parameter: gameObj to control, must be a GameObject interface.
function InputController(gameObj) {

    // keep track of the game object
    this.gameObj = gameObj;
    
    
    // NOTE: although GameController deals with "speedX" and "speedY", it is
    // possible to directly use the "speed" value by itself.
    
    
    // update function: update the object's motion for this frame.
    // TODO - update this for variable framerate
    this.update = function() {
        if(keyboard.upPressed()) {
            //
        }
        this.gameObj.setX(this.gameObj.getX() + this.speedX);
        this.gameObj.setY(this.gameObj.getY() + this.speedY);
    }
    
}
// InputController is a MotionController.
InputController.protoype = new MotionController(0);