/* File: game_state.js
 *
 * The GameState serves as a prototype for all of the main components that
 * are controlled directly by the Game object (i.e. Level and Menu).
 * This prototype mandates an interface that all game state objects follow.
 */


function GameState() {
    this.update = function() {}
    this.draw = function(ctx) {}
}