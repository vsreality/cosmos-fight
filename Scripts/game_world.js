/* File: game_world.js
 *
 * The GameWorld object defines properties of the game environment,
 * including the world size, static environment effects and objects, and
 * the background animations.
 */


function GameWorld(width, height) {
    this.width = width;
    this.height = height;
    
    this.setDimensions = function(width, height) {
        this.width = width;
        this.height = height;
    }
}