/* File: game_state.js
 *
 * The GameState serves as a prototype for all of the main components that
 * are controlled directly by the Game object (i.e. Level and Menu).
 * This prototype mandates an interface that all game state objects follow.
 */


function GameState() {

    // A list of this state's components.
    this.components = new Array();

    // Updates all components.
    this.update = function(dT) {
        if(this.background !== undefined)
            this.background.update(dT);
        for(var i=0; i<this.components.length; i++)
            this.components[i].update(dT);
    }
    
    // Draws all components to the Canvas.
    this.draw = function(ctx) {
        if(this.background !== undefined)
            this.background.draw(ctx);
        for(var i=0; i<this.components.length; i++)
            this.components[i].draw(ctx);
    }
    
    // Adds an animated background object. Backgrounds are always rendered first.
    this.setBackground = function(background) {
        this.background = background;
    }
    
    // Adds a new component to the state that will be updated and drawn.
    // Each component must adhere to the following interface:
    //      update(dT)
    //      draw(ctx)
    this.addComponent = function(component) {
        this.components.push(component);
    }
    
    // OVERRIDE - clears off any HTML components added for this GameState.
    this.destroy = function() { }
}