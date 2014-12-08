/* File: game_menu.js
 *
 * TODO - will contain the game's main menu.
 */


function GameMenu() {
    this.addButton("hi", 10, 10, 150, 30);
    this.addButton("hey", 10, 50, 150, 30);
    this.addButton("omg", 10, 100, 150, 30);
    this.addButton("DESTROY", 10, 150, 150, 30, this.destroy);
}
GameMenu.prototype = new Menu();