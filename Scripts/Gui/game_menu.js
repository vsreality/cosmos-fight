/* File: game_menu.js
 *
 * Contains the game's main menu.
 */


function GameMenu() {
    this.addTitle("Main Menu");
    
    this.elementPosition("center");
    var center = Math.floor(SCREEN_WIDTH / 2);
    this.addButton("Play Test Level", center, 120, 150, 30);
    this.addButton("Settings", center, 180, 150, 30);
    this.addButton("Log In", center, 240, 150, 30);
    
    this.addCredit("VsReality");
}

GameMenu.prototype = new Menu();