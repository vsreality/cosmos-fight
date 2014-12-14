/* File: user_interaction.js
 *
 * A UserInteractionManager is designed to keep track of all user input,
 * namely keyboard and mouse events, and forward them as events to a currently
 * active GameState object (the target).
 *
 * The target can subscribe to events it receives by defining functions on
 * the following API:
 *      keyDown(ascii_val)
 *      keyUp(ascii_val)
 *      mouseDown(x, y)
 *      mouseUp(x, y)
 *      mouseMove(x, y)
 *
 * If a function remains undefined, that event will not be triggered.
 */


function UserInteractionManager() {

    // The element being listened to and the target subscribed.
    this.element = null;
    this.target = null;
    
    // Binds this listener to the given HTML element (by ID).
    this.bindTo = function(elem_id) {
        this.element = document.getElementById(elem_id);
        this.element.onmousedown = this.mouseDown.bind(this);
        this.element.onmouseup = this.mouseUp.bind(this);
        this.element.onmousemove = this.mouseMove.bind(this);
    }
    
    // Keyboard event handlers:
    this.keyDown = function(ascii_val) {
        if(this.target !== null && this.target.keyDown !== undefined)
            this.target.keyDown(ascii_val);
    }
    this.keyUp = function(ascii_val) {
        if(this.target !== null && this.target.keyUp !== undefined)
            this.target.keyUp(ascii_val);
    }
    
    // Mouse event handlers:
    this.mouseDown = function(event) {
        if(this.target !== null && this.target.mouseDown !== undefined) {
            var p = this.getRelativePosition(event.pageX, event.pageY);
            this.target.mouseDown(p.x, p.y);
        }
    }
    this.mouseUp = function(event) {
        if(this.target !== null && this.target.mouseUp !== undefined) {
            var p = this.getRelativePosition(event.pageX, event.pageY);
            this.target.mouseUp(p.x, p.y);
        }
    }
    this.mouseMove = function(event) {
        if(this.target !== null && this.target.mouseMove !== undefined) {
            var p = this.getRelativePosition(event.pageX, event.pageY);
            this.target.mouseMove(p.x, p.y);
        }
    }
    
    // Given an absolute x, y screen position, returns the x, y position
    // relative to the event element in the form of a Point. If the element
    // hasn't been bound yet, returns the absolute Point (x, y) as is.
    this.getRelativePosition = function(x, y) {
        if(this.element !== null) {
            x = Math.floor(x - $(this.element).offset().left);
            y = Math.floor(y - $(this.element).offset().top);
        }
        return new Point(x, y);
    }
    
    // Binds this user interaction event handler to the given GameState object.
    // All events are passed to the target as needed.
    // A target can subscribe to events by defining the functions specified above.
    this.setTarget = function(game_state_obj) {
        this.target = game_state_obj;
    }
    
    // Unbinds the target, leaving the current target undefined.
    this.unsetTarget = function() {
        this.target = null;
    }
}