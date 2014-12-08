/* File: menu.js
 *
 * The Menu object acts as a wrapper to create HTML components (styled by CSS)
 * that serve as various game menus.
 * A menu contains buttons, links, selection options, etc. Each action can have
 * a callback function associated with it.
 */


// Global constants for menu positioning.
MENU_POSITION_LEFT = "left";
MENU_POSITION_CENTER = "center";
MENU_POSITION_RIGHT = "right";


// Menu object
function Menu() {

    // Determines the positioning scheme of the next object added.
    this.position = MENU_POSITION_LEFT;
    
    
    // Sets the positioning scheme for all elements added in the future.
    // Existing elements (already added) will be unaffected.
    this.elementPosition = function(pos) {
        this.position = pos;
    }
    
    
    // Adds a button the the screen. This button will be positioned on the
    // screen at the given x, y location. If "callback" is provided, that
    // function will be invoked when the button is clicked.
    this.addButton = function(text, xPos, yPos, width, height, callback) {
        // handle default parameters
        callback = typeof callback !== 'undefined' ? callback : this.doNothing;
        
        var button = document.createElement("button");
        var button_text = document.createTextNode(text);
        button.appendChild(button_text);
        
        button.className = "gui_element gui_button";
        button.style.left = xPos;
        button.style.top = yPos;
        button.style.width = width + "px";
        button.style.height = height + "px";
        
        button.onclick = callback;
        document.getElementById(SCREEN_CONTAINER_ID).appendChild(button);
    }
    
    
    // Adds a regular text label to the screen. The size will be the size of the
    // label's text. Set "centered" to true to center this label on the screen
    // horizontally.
    this.addLabel = function(text, xPos, yPos, size) {
        var label = document.createElement("span");
        var label_text = document.createTextNode(text);
        label.appendChild(label_text);
        
        label.className = "gui_element gui_label";
        label.style.top = yPos;
        label.style.fontSize = size + "px";
        
        // set position based on positioning scheme
        if(this.position == "center") {
            label.style.width = SCREEN_WIDTH + "px";
            label.style.left = 0;
        }
        else if(this.position == "right") {
            label.style.right = xPos;
        }
        else {
            label.style.left = xPos;
        }
        
        document.getElementById(SCREEN_CONTAINER_ID).appendChild(label);
    }
    
    
    // Destroys all elements of the menu, clearing off the screen. This method
    // should be called before switching states.
    this.destroy = function() {
        var container = document.getElementById(SCREEN_CONTAINER_ID);
        for(var i=0; i<container.children.length; i++) {
            var child = container.children[i];
            if(child.id !== "screen") {
                container.removeChild(child)
                i--;
            }
        }
    }
    
    
    // Default callback function.
    // TODO - alerts for debugging, but eventually take away the alert.
    this.doNothing = function() {
        alert("'" + this.innerHTML + "' clicked.");
    }
    
    
}

Menu.prototype = new GameState();