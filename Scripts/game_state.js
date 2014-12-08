/* File: game_state.js
 *
 * The GameState serves as a prototype for all of the main components that
 * are controlled directly by the Game object (i.e. Level and Menu).
 * This prototype mandates an interface that all game state objects follow.
 */


function GameState() {
    this.update = function(dT) {
        if(this.background !== 'undefined')
            this.background.update(dT);
    }
    this.draw = function(ctx) {
        if(this.background !== 'undefined')
            this.background.draw(ctx);
    }
    
    this.setBackground = function(background) {
        this.background = background;
    }
}