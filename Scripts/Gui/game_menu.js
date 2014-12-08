/* File: game_menu.js
 *
 * TODO - will contain the game's main menu.
 */


function GameMenu() {
    this.elementPosition("center");
    this.addLabel("Main Menu", 0, 50, 30);
    this.elementPosition("right");
    this.addLabel("right", 10, 400, 20);
    this.elementPosition("left");
    this.addLabel("left", 40, 100, 20);
    
    this.elementPosition("center");
    this.addButton("hi", 10, 10, 150, 30);
    this.elementPosition("right");
    this.addButton("hey", 10, 50, 150, 30);
    this.elementPosition("left");
    this.addButton("omg", 10, 100, 150, 30);
    this.addButton("DESTROY", 10, 150, 150, 30, this.destroy);
}
GameMenu.prototype = new Menu();