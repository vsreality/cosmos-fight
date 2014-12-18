/* File: keybindings.js
 *
 * The KeyBindings class maps key strokes to actions that are used by the
 * UserInteraction object to provide an interface between a user's keyboard
 * input and the game.
 */


function KeyBindings() {

    // array tracking all keys currently pressed (ASCII)
    this.resetKeys = function() {
        this.keys_pressed = Array.apply(null,
            new Array(256)).map(Boolean.prototype.valueOf, false);
    }
    this.resetKeys();
    
    // Fordward key press events to these functions:
    this.keyDown = function(ascii_val) {
        if(!this.keys_pressed[ascii_val]) {
            this.keys_pressed[ascii_val] = true;
            this.processKeyDownEvent(ascii_val);
        }
    }
    this.keyUp = function(ascii_val) {
        if(this.keys_pressed[ascii_val]) {
            this.keys_pressed[ascii_val] = false;
            this.processKeyUpEvent(ascii_val);
        }
    }
    
    // These functions check each possible action assignment, and trigger the
    // appropriate event function (if applicable).
    this.processKeyDownEvent = function(ascii_val) {
        if(this.upBinding(ascii_val))
            this.upPressEvent();
        else if(this.downBinding(ascii_val))
            this.downPressEvent();
        else if(this.leftBinding(ascii_val))
            this.leftPressEvent();
        else if(this.rightBinding(ascii_val))
            this.rightPressEvent();
        else if(this.shootBinding(ascii_val))
            this.shootPressEvent();
        else if(this.pauseBinding(ascii_val))
            this.pausePressEvent();
        else if(this.healthBarToggleBinding(ascii_val))
            this.healthBarTogglePressEvent();
        else if(this.timerBarToggleBinding(ascii_val))
            this.timerBarTogglePressEvent();
        else
            this.otherKeyPressEvent(ascii_val);
    }
    this.processKeyUpEvent = function(ascii_val) {
        if(this.upBinding(ascii_val))
            this.upReleaseEvent();
        else if(this.downBinding(ascii_val))
            this.downReleaseEvent();
        else if(this.leftBinding(ascii_val))
            this.leftReleaseEvent();
        else if(this.rightBinding(ascii_val))
            this.rightReleaseEvent();
        else if(this.shootBinding(ascii_val))
            this.shootReleaseEvent();
        else if(this.pauseBinding(ascii_val))
            this.pauseReleaseEvent();
        else if(this.healthBarToggleBinding(ascii_val))
            this.healthBarToggleReleaseEvent();
        else if(this.timerBarToggleBinding(ascii_val))
            this.timerBarToggleReleaseEvent();
        else
            this.otherKeyReleaseEvent(ascii_val);
    }
    
    
    // The individual event functions are defined here. Override as needed.
    this.upPressEvent = function() {}
    this.downPressEvent = function() {}
    this.leftPressEvent = function() {}
    this.rightPressEvent = function() {}
    this.shootPressEvent = function() {}
    this.pausePressEvent = function() {}
    this.healthBarTogglePressEvent = function() {}
    this.timerBarTogglePressEvent = function() {}
    this.otherKeyPressEvent = function(ascii_val) {}
    this.upReleaseEvent = function() {}
    this.downReleaseEvent = function() {}
    this.leftReleaseEvent = function() {}
    this.rightReleaseEvent = function() {}
    this.shootReleaseEvent = function() {}
    this.pauseReleaseEvent = function() {}
    this.healthBarToggleReleaseEvent = function() {}
    this.timerBarToggleReleaseEvent = function() {}
    this.otherKeyReleaseEvent = function(ascii_val) {}
    
    
    // Assignment binding function: binds the given action to the given event.
    this.bindEvent = function(event_name, func) {
        switch(event_name) {
            case KeyBindings.UP_PRESSED:
                this.upPressEvent = func;
                break;
            case KeyBindings.UP_RELEASED:
                this.upReleaseEvent = func;
                break;
            case KeyBindings.DOWN_PRESSED:
                this.downPressEvent = func;
                break;
            case KeyBindings.DOWN_RELEASED:
                this.downReleaseEvent = func;
                break;
            case KeyBindings.LEFT_PRESSED:
                this.leftPressEvent = func;
                break;
            case KeyBindings.LEFT_RELEASED:
                this.leftReleaseEvent = func;
                break;
            case KeyBindings.RIGHT_PRESSED:
                this.rightPressEvent = func;
                break;
            case KeyBindings.RIGHT_RELEASED:
                this.rightReleaseEvent = func;
                break;
            case KeyBindings.SHOOT_PRESSED:
                this.shootPressEvent = func;
                break;
            case KeyBindings.SHOOT_RELEASED:
                this.shootReleaseEvent = func;
                break;
            case KeyBindings.PAUSE_PRESSED:
                this.pausePressEvent = func;
                break;
            case KeyBindings.PAUSE_RELEASED:
                this.pauseReleaseEvent = func;
                break;
            case KeyBindings.HEALTH_TOGGLE_PRESSED:
                this.healthBarTogglePressEvent = func;
                break;
            case KeyBindings.HEALTH_TOGGLE_RELEASED:
                this.healthBarToggleReleaseEvent = func;
                break;
            case KeyBindings.TIMER_BAR_TOGGLE_PRESSED:
                this.timerBarTogglePressEvent = func;
                break;
            case KeyBindings.TIMER_BAR_TOGGLE_RELEASED:
                this.timerBarToggleReleaseEvent = func;
                break;
            case KeyBindings.OTHER_KEY_PRESSED:
                this.otherKeyPressEvent = func;
                break;
            case KeyBindings.OTHER_KEY_RELEASED:
                this.otherKeyReleaseEvent = func;
                break;
            default:
                break;
        }
    }
    

    // KEY BINDING ASSIGNMENTS:
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
    
    
    // KEY BINDING CHECK FUNCTIONS:
    // Returns true if the key binding matches the given key code.
    this.upBinding = function(keyCode) { // UP movement
        return keyCode == this.up1 || keyCode == this.up2 ||
               keyCode == this.up3 || keyCode == this.up4;
    }
    this.downBinding = function(keyCode) { // DOWN movement
        return keyCode == this.down1 || keyCode == this.down2 ||
               keyCode == this.down3 || keyCode == this.down4;
    }
    this.leftBinding = function(keyCode) { // LEFT movement
        return keyCode == this.left1 || keyCode == this.left2 ||
               keyCode == this.left3 || keyCode == this.left4;
    }
    this.rightBinding = function(keyCode) { // RIGHT movement
        return keyCode == this.right1 || keyCode == this.right2 ||
               keyCode == this.right3 || keyCode == this.right4;
    }
    this.shootBinding = function(keyCode) { // SHOOT action
        return keyCode == this.shoot1 || keyCode == this.shoot2 ||
               keyCode == this.shoot3 || keyCode == this.shoot4;
    }
    this.pauseBinding = function(keyCode) { // PAUSE toggle
        return keyCode == this.pause1 || keyCode == this.pause2 ||
               keyCode == this.pause3 || keyCode == this.pause4;
    }
    this.healthBarToggleBinding = function(keyCode) { // HEALTH BAR toggle
        return keyCode == this.healthBars1 || keyCode == this.healthBars2 ||
               keyCode == this.healthBars3 || keyCode == this.healthBars4;
    }
    this.timerBarToggleBinding = function(keyCode) { // TIMER BAR toggle
        return keyCode == this.timerBars1 || keyCode == this.timerBars2 ||
               keyCode == this.timerBars3 || keyCode == this.timerBars4;
    }
}


// Static constant event names defined for convenience.
KeyBindings.UP_PRESSED = "up pressed";
KeyBindings.UP_RELEASED = "up released";
KeyBindings.DOWN_PRESSED = "down pressed";
KeyBindings.DOWN_RELEASED = "down released";
KeyBindings.LEFT_PRESSED = "left pressed";
KeyBindings.LEFT_RELEASED = "left released";
KeyBindings.RIGHT_PRESSED = "right pressed";
KeyBindings.RIGHT_RELEASED = "right released";
KeyBindings.SHOOT_PRESSED = "shoot pressed";
KeyBindings.SHOOT_RELEASED = "shoot released";
KeyBindings.PAUSE_PRESSED = "paused pressed";
KeyBindings.PAUSE_RELEASED = "pause released";
KeyBindings.HEALTH_TOGGLE_PRESSED = "health toggle pressed";
KeyBindings.HEALTH_TOGGLE_RELEASED = "health toggle released";
KeyBindings.TIMER_BAR_TOGGLE_PRESSED = "timer bar toggle pressed";
KeyBindings.TIMER_BAR_TOGGLE_RELEASED = "timer bar toggle released";
KeyBindings.OTHER_KEY_PRESSED = "other key pressed";
KeyBindings.OTHER_KEY_RELEASED = "other key released";