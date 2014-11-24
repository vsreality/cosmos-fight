/* File: user_interaction.js
 *
 * A UserInteractionManager is designed to keep track of all user input,
 * namely keyboard and mouse events, and forward them as events to the Game
 * object.
 */


function UserInteractionManager() {

    // Binds all keystrokes that happen
    this.bindKeyboardEvents = function() {
        // TODO - set up keyboard events here
    }
    
    
    // Binds mouse events that happen on the canvas to the appropriate event handles.
    this.bindMouseEvents = function(canvasID) {
        var canvas = document.getElementById(canvasID);
        /*canvas.onmouseclick = this.handleMouseClick;
        canvas.onmouseclick = this.handleMouseClick;
        canvas.onmouseclick = this.handleMouseClick;
        canvas.onmouseclick = this.handleMouseClick;*/
    }
}