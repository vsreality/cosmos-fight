/* File: main.js
 *
 * Defines global variables, and creates the Game object.
 */


// TODO - get rid of the globals?
var SCREEN_ID;
var SCREEN_CONTAINER_ID;
var SCREEN_WIDTH;
var SCREEN_HEIGHT;

var game;

function initGame() {
    SCREEN_ID = "screen";
    SCREEN_CONTAINER_ID = "screen_container";
    
    //--- TODO - hack (fix this)
    var canvas = document.getElementById(SCREEN_ID);
    canvas.width = 800;
    canvas.height = 500;
    SCREEN_WIDTH = document.getElementById(SCREEN_ID).width;
    SCREEN_HEIGHT = document.getElementById(SCREEN_ID).height;
    //--------------------------
    
    game = new Game(SCREEN_ID);
    game.start();
}