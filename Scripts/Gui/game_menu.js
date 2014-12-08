/* File: game_menu.js
 *
 * Contains the game's main menu.
 */


function GameMenu() {
    
    // Callback function for the start level button.
    this.startTestLevel = function() {
        alert("starting level!");
    }
    
    
    // Add all Menu components:
    this.addTitle("Main Menu");
    
    this.elementPosition("center");
    var center = Math.floor(SCREEN_WIDTH / 2);
    this.addButton("Play Test Level", center, 120, 150, 30, this.startTestLevel);
    this.addButton("Settings", center, 180, 150, 30);
    this.addButton("Log In", center, 240, 150, 30);
    
    this.addCredit("VsReality");
    
    this.setBackground(new Background());
}

GameMenu.prototype = new Menu();