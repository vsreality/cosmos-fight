/* File: pause_menu.js
 *
 * A menu object that is used to display over an active level as the pause menu
 * when the user pauses the game. Contains options to quit or continue.
 */


function PauseMenu(level) {
    
    // Callback functions:
    this.resumePressed = function() {
        level.resume();
    }
    this.restartPressed = function() {
        level.restart();
    }
    this.quitPressed = function() {
        level.quit();
    }
    
    
    // Add all Menu components:
    this.addTitle("Paused");
    
    this.elementPosition("center");
    var center = Math.floor(SCREEN_WIDTH / 2);
    this.addButton("Resume", center, 120, 150, 30, this.resumePressed);
    this.addButton("Restart", center, 180, 150, 30, this.restartPressed);
    this.addButton("Quit", center, 240, 150, 30, this.quitPressed);
    
    this.addCredit("VsReality");
}

PauseMenu.prototype = new Menu();