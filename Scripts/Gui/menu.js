/* File: menu.js
 *
 * The Menu object acts as a wrapper to create HTML components (styled by CSS)
 * that serve as various game menus.
 * A menu contains buttons, links, selection options, etc. Each action can have
 * a callback function associated with it.
 */


// Menu object
function Menu() {


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
        document.getElementById("screen_container").appendChild(button);
    }
    
    
    // Adds a regular text label to the screen. The size will be the size of the
    // label's text.
    this.addLabel = function(text, xPos, yPos, size) {
        var label = document.createElement("span");
        var label_text = document.createTextNode(text);
        label.appendChild(label_text);
        
        label.className = "gui_element gui_label";
        label.style.left = xPos;
        label.style.top = yPos;
        label.style.fontSize = size + "px";
        
        document.getElementById("screen_container").appendChild(label);
    }
    
    
    // Destroys all elements of the menu, clearing off the screen. This method
    // should be called before switching states.
    this.destroy = function() {
        var container = document.getElementById("screen_container");
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