/*
 *  SETTINGS CLASS
 * This class contains and controls all settings and options for the game. These
 *	settings are adjusted from the options menu, and from the user's profile settings.
 * The Settings class is also responsible for saving and loading user data from the
 *	database, as well as managing user accounts.
 */

// main settings object
function Settings(){
	// account information
	this.loggedIn = false;

	// list of settings variables

	this.soundEnabled = true;

	this.effectsScale = 1;

	this.effectsLevel = 2;

	this.showEnemyHealthBars = false;
	this.showBonusTimerBars = false;
	
	// list of settings functions

	this.setSoundEnabled = function(trueOrFalse){

		this.soundEnabled = trueOrFalse;

	}

	this.setEffectsLevel = function(val){

		this.effectsScale = val/2;

		this.effectsLevel = val;

	}
	
	// create the keybindings object, and bind it to the user's preferences
	//	(if the user is logged in)
	this.keyBindings = new KeyBindings();
	this.keyBindings.bind(this);
}


// KEY BINDINGS:
// this class is used to set up and apply bindings from different keyboard input
//	to pre-determined actions of gameplay, such as ship movement.
function KeyBindings(){
	/***** KEY BINDING VARIABLES (defaults set here) *****/
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
	//	is logged in to load the user's custom keybindings. Otherwise, it keeps
	//	the default bindings.
	this.bind = function(settingsObject){
		// if not logged in, return
		if(!settingsObject.loggedIn)
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