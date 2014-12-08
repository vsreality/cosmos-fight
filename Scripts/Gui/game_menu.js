/* File: game_menu.js
 *
 * TODO - will contain the game's main menu.
 */


function GameMenu() {
    this.elementPosition("center");
    this.addLabel("Main Menu", 0, 40, 30);
    
    this.elementPosition("center");
    var center = Math.floor(SCREEN_WIDTH / 2);
    this.addButton("Play Test Level", center, 120, 150, 30);
    this.addButton("Settings", center, 180, 150, 30);
    this.addButton("Log In", center, 240, 150, 30);
    
    this.elementPosition("right");
    this.addLabel("VsReality", 30, SCREEN_HEIGHT - 50, 20);
}
GameMenu.prototype = new Menu();