/* File: keybindings.js
 *
 * The KeyBindings class maps key strokes to actions that are used by the
 * UserInteraction object to provide an interface between a user's keyboard
 * input and the game.
 */


function KeyBindings() {
    /* Constructor:
     * Initializes all ASCII key values to their default bindings. Unbound values
     * are set to -1.
     */

    this.up1 = 119;			// 'w'
    this.up2 = 87;			// 'W'
    this.up3 = 38;			// up arrow
    this.up4 = -1;			// unbound
    
    this.down1 = 115;		// 's'
    this.down2 = 83;		// 'S'
    this.down3 = 40;		// down arrow
    this.down4 = -1;		// unbound
    
    this.left1 = 97;		// 'a'
    this.left2 = 65;		// 'A'
    this.left3 = 37;		// left arrow
    this.left4 = -1;		// unbound
    
    this.right1 = 100;		// 'd'
    this.right2 = 68;		// 'D'
    this.right3 = 39;		// right arrow
    this.right4 = -1;		// unbound
    
    this.shoot1 = 32;		// space
    this.shoot2 = -1;		// unbound
    this.shoot3 = -1;		// unbound
    this.shoot4 = -1;		// unbound
    
    this.pause1 = 27;		// escape
    this.pause2 = -1;		// unbound
    this.pause3 = -1;		// unbound
    this.pause4 = -1;		// unbound
    
    this.healthBars1 = 9;	// tab
    this.healthBars2 = -1;	// unbound
    this.healthBars3 = -1;	// unbound
    this.healthBars4 = -1;	// unbound
    
    this.timerBars1 = 9;	// tab
    this.timerBars2 = -1;	// unbound
    this.timerBars3 = -1;	// unbound
    this.timerBars4 = -1;	// unbound
    
    
    // bind all functions (uses settings to access user database if the user
    //  is logged in to load the user's custom keybindings. Otherwise, it keeps
    //  the default bindings.
    this.bind = function(settings) {
        // if not logged in, return
        if(!settings.loggedIn)
            return;
    }
    

    /***** KEYBINDINGS CHECK FUNCTIONS *****/
    // returns TRUE if the key binding matches the given key code
    this.upBinding = function(keyCode){ // UP movement
        return keyCode == this.up1 || keyCode == this.up2 ||
               keyCode == this.up3 || keyCode == this.up4;
    }
    this.downBinding = function(keyCode){ // DOWN movement
        return keyCode == this.down1 || keyCode == this.down2 ||
               keyCode == this.down3 || keyCode == this.down4;
    }
    this.leftBinding = function(keyCode){ // LEFT movement
        return keyCode == this.left1 || keyCode == this.left2 ||
               keyCode == this.left3 || keyCode == this.left4;
    }
    this.rightBinding = function(keyCode){ // RIGHT movement
        return keyCode == this.right1 || keyCode == this.right2 ||
               keyCode == this.right3 || keyCode == this.right4;
    }
    this.shootBinding = function(keyCode){ // SHOOT action
        return keyCode == this.shoot1 || keyCode == this.shoot2 ||
               keyCode == this.shoot3 || keyCode == this.shoot4;
    }
    this.pauseBinding = function(keyCode){ // PAUSE toggle
        return keyCode == this.pause1 || keyCode == this.pause2 ||
               keyCode == this.pause3 || keyCode == this.pause4;
    }
    this.healthBarToggleBinding = function(keyCode){ // HEALTH BAR toggle
        return keyCode == this.healthBars1 || keyCode == this.healthBars2 ||
               keyCode == this.healthBars3 || keyCode == this.healthBars4;
    }
    this.timerBarToggleBinding = function(keyCode){ // TIMER BAR toggle
        return keyCode == this.timerBars1 || keyCode == this.timerBars2 ||
               keyCode == this.timerBars3 || keyCode == this.timerBars4;
    }
}