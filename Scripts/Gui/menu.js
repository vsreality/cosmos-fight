/* File: menu.js
 *
 * The Menu object acts as a wrapper to create HTML components (styled by CSS)
 * that serve as various game menus.
 * A menu contains buttons, links, selection options, etc. Each button should have
 * a callback associated.
 */


function Menu() {


    // Adds a button the the screen. This button will be positioned on the
    // screen at the given x, y location. If "callback" is provided, that
    // function will be invoked when the button is clicked.
    this.addButton = function(text, xPos, yPos, width, height, callback) {
        // handle default parameters
        callback = typeof callback !== 'undefined' ? callback : this.doNothing;
        
        var button = document.createElement("button");
        var text = document.createTextNode(text);
        button.appendChild(text);
        
        button.className = "gui_button";
        button.style.left = xPos;
        button.style.top = yPos;
        button.style.width = width;
        button.style.height = height;
        
        button.onclick = callback;
        document.getElementById("screen_container").appendChild(button);
    }
    
    
    // Default callback function.
    // TODO - alerts for debugging, but eventually take away the alert.
    this.doNothing = function() {
        alert("'" + this.innerHTML + "' clicked.");
    }
    
    
}

Menu.prototype = new GameState();