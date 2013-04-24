/* File comments updated: Sunday, July 1, 2012 at 1:58 AM
*/

//FPS: the game's predetermined frames per second to animate at.
var FPS = 30;
// tLim is the number of milliseconds between each frame
//  (used by animation/update functions)
var tLim = Math.floor(1000/FPS);
// true as long as the animation loop is running
//	(set to false to pause or stop animation loop)
var animating = true;

// time values used to determine how many milliseconds to wait
//	until the next frame (dTime)
// See animation loop below for details
var currentTime = 0;
var lastTime = 0;
var dTime = 0;

// general images
var gameImgs = new Images();
gameImgs.add([
    ["payerBaseShip", "images/35_base.png"],
    ["corvetShip", "images/corvet1.png"],
    ["smallTower", "images/small_tower.png"],
    ["star3Ship", "images/3-star-70.png"]
]);
gameImgs.loadImages();

var payerMassiveShip = new Image();
payerMassiveShip.src = "images/35_rockets.png";



/* GLOBAL VARIABLES */

//Time of game in frames (that is, how many frames passed since the game
//	game animation started)
var gameTime = 0;

// screen and context (painting system) variables
var scrn = document.getElementById("screen");
var scrnContext = scrn.getContext("2d");

// screen width/height
var contextWidth = $("#screen").width();
var contextHeight = $("#screen").height();
// game area width/height (used by game levels if area is bigger that the screen size)
var areaWidth = contextWidth;
var areaHeight = contextHeight;

// double canvas rendering variables
var doubleCanvas = document.createElement("canvas");
doubleCanvas.width = contextWidth;
doubleCanvas.height = contextHeight;
var context = doubleCanvas.getContext("2d");

// global game settings object
var settings = new Settings();

// key press values (checks which keys are pressed)
var keyUpDown = false;
var keyDownDown = false;
var keyLeftDown = false;
var keyRightDown = false;
var keyShootDown = false;
var keyEscDown = false;


/* GLOBAL FUNCTIONS */

// returns a random number from 0 to the given range
function getRandNum(range){
    return Math.floor(Math.random() * range);
}

// converts the given time in seconds to the time in frames
//  (adjusted by the current FPS rate)
function secToFrames(sec){
    return Math.ceil(sec*FPS);
}

// Create path of rounded rectangle on context
function pathRoundedRectangle(ctx,x,y,w,h,r){
	// start point (upper left corner [after the arc])
	ctx.moveTo(x+r, y);
	// top line
	ctx.lineTo(x+w-r, y);
	// arc in upper right corner (all arcs are quarter circles of radius 10)
	// arc: centerX, centerY, radius, startAngle, endAngle, clockwise
	ctx.arc(x+w-r, y+r, r, -Math.PI/2, 0, false);
	// right side line
	ctx.lineTo(x+w, y+h-r);
	// lower right corner arc
	ctx.arc(x+w-r, y+h-r, r, 0, Math.PI/2, false);
	// bottom line
	ctx.lineTo(x+r, y+h);
	// lower left corner
	ctx.arc(x+r, y+h-r, r, Math.PI/2, Math.PI, false);
	// left side line
	ctx.lineTo(x, y+r);
	// upper left corner
	ctx.arc(x+r, y+r, r, Math.PI, 3*Math.PI/2, false);
}

// returns the distance between two points, given by coordinates
function getDistance(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// returns the distance between two points (squared, for optimization),
//	given by coordinates
function getDistance2(x1, y1, x2, y2){
	return ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// returns 1 if positive, -1 if negative, or 0 if 0
function getSign(val){
    if(val < 0)
        return -1;
    else if(val > 0)
        return 1;
    else
        return 0;
}


/* TIMER OBJECTS */

// creates a Timer object that triggers onTime function when
//  time runs out
// Timer is based on gameTime global property.
// SINGLE EVENT TIMER
function Timer(interval){
    this.property;
    this.interval = gameTime + interval;
    this.onTime = function(property){}
    
    // set a new interval to this event (change it from the last one)
    this.set = function(interval){
        this.interval = gameTime + interval;
		// this.reactivate(); // reactivate in case it was deactivated
    }
    
    // check if the timer's interval value is up-to-date with
    //  the game's timer; if it is, execute the onTime function.
    //  Then disable this event
    this.update = function(){
        if(gameTime == this.interval){
            this.onTime(this.property);
            this.deactivate(); // finished, so stop the event
        }
    }
    
    // returns TRUE if timer is still going, or
    //  FALSE if it already activated; that is, returns false
    //  if the timer is overdue (past its point of activation).
    //  This is used by the level to know when to automatically
    //  delete the timer and remove it from functioning in the game.
    this.isAlive = function(){
        return (gameTime < this.interval + 1);
    }
    
    // deactivate this event: set the isAlive function to always return false
    this.deactivate = function(){
        this.isAlive = function() { return false; }
    }
    
    // reactive this event: if the event was deactivated (toggled for deletion from
    //  the level's updater), reactivating this will force the isAlive function to return
    //  the same value again (true if gameInterval < this.interval + 1) - the default
    //  value
    this.reactive = function(){
        this.isAlive = function() { return (gameTime < this.interval + 1); }
    }
}

// creates a timer object that loops and re-calls the onTime function
//  every passing interval.
// LOOPED EVENT TIMER
function LoopedTimer(interval){
    this.property;
    this.interval = interval;
    this.numLoops = 0;
    this.nextTime = this.interval + gameTime;
    this.onTime = function(){}
    
    // check if the timer's interval value is up-to-date with
    //  the game's timer; if it is, execute the onTime function and
    //  increment the loop counter.
    this.update = function(){
        // if the timer's time is up
        if(gameTime >= this.nextTime){
            // trigger action
            this.onTime(this.property);
            // reset the time interval to the next point
            this.nextTime = this.interval + gameTime;
            // increment the number of loops (how many times this timer looped)
            this.numLoops++;
        }
    }
    
    // always returns TRUE (since a looped timer never dies, it
    //  just loops forever)
    //  The isAlive functions are used to check if a timer should
    //  be auto-deleted by a level (false = delete because timer is "dead")
    this.isAlive = function(){
        return true;
    }
    
    // deactivate this event: set the isAlive function to always return false
    this.deactivate = function(){
        this.isAlive = function() { return false; }
    }
    
    // reactive this event: if the event was deactivated (toggled for deletion from
    //  the level's updater), reactivating this will force the isAlive function to return
    //  TRUE again, and thus linger on
    this.reactive = function(){
        this.isAlive = function() { return true; }
    }
}


/* GAME LEVEL AND MENU (for future reference and
    initializing the game…
    This is where the currentLevel and mainMenu global
        variables get created, and this is where the
        game update system loads.
    This set of functions is called only after the entire
        javascript/web page is loaded.
*/
//levels and loading (when everything is ready, start game)
$(document).ready(function(){
	
	// create the options menu (set the back function to the main menu)
	optionsMenu = new OptionsMenu(function(){
		currentLevel = mainMenu;
	});
	
	// create and setup the main menu
    mainMenu = new StandardMenu("Cosmos Fight");
	// add the play button (which brings up the level selection menu)
    mainMenu.pushButton("Play!").onClick = function(){
		currentLevel = levelMenu;
	}
	// add the options button (which brings up the options menu)
	mainMenu.setSpacing(100);
	mainMenu.pushButton("Options").onClick = function(){
		currentLevel = optionsMenu;
	}
	// add the login button
	mainMenu.pushButton("Log In").setEnabled(false);
	// add the create account button right under it
	mainMenu.setSpacing(80);
	var createAccountButton = mainMenu.pushTextButton("Create an Account");
	createAccountButton.size = 12;
	createAccountButton.setEnabled(false);
	
	// create and setup the levelMenu
	levelMenu = new StandardMenu("Choose A Level");
    // add the menu button for level 1
    levelMenu.pushButton("Level 1").onClick = function(){
        currentLevel = createLevel1();
    };
    // add the menu button for level 2
    levelMenu.pushButton("Level 2").onClick = function(){
        currentLevel = createLevel2();
    };
    // add the menu button for survival level
    levelMenu.pushButton("Survival Level").onClick = function(){
        currentLevel = createLevelSurvival();
    };
    // add the menu button for test level
    levelMenu.pushButton("Test Level").onClick = function(){
        currentLevel = createLevelTest();
    };
    // add the menu button for test level
    levelMenu.pushButton("Test Level 2").onClick = function(){
        currentLevel = createLevelTest2();
    };
    // add the menu button for the API test level (3)
    levelMenu.pushButton("All Enemies").onClick = function(){
        currentLevel = createLevelEnemies();
    };
	levelMenu.addBackButton(function(){
		currentLevel = mainMenu;
	});
    
    // create the GLOBAL currentLevel, and set it to be the
    //  main menu (currentLevel is either a menu or actual level)
    currentLevel = mainMenu;
	
	
	/***** ADD MOUSE LISTENERS *****/
	/* Mouse listener functions (click)
	 *  These functions are used to listen for mouse clicks
	 *  in menu screens and active levels. Levels which are not menus or any
	 *  object referenced to by "currentLevel" simply ignores
	 *  it if they do not need click events.
	 */
	$("#screen").mousedown(function(e){
			var x = e.pageX - $("#screen").offset().left;
			var y = e.pageY - $("#screen").offset().top;
			currentLevel.mousedown(x, y);
		});
	$("#screen").mouseup(function(e){
			var x = e.pageX - $("#screen").offset().left;
			var y = e.pageY - $("#screen").offset().top;
			currentLevel.mouseup(x, y);
		});
	// Mouse movement listener: used to listen to mouse motion.
	//	currentLevel objects that do not use this function simply
	//	ignore the function call.
	$("#screen").mousemove(function(e){
			var x = e.pageX - $("#screen").offset().left;
			var y = e.pageY - $("#screen").offset().top;
			currentLevel.mousemove(x, y);
		});

		
    // START THE GAME LOOP!
    // set last time to now
    lastTime = new Date().getTime();
    updateGame();
});



/***** ADD KEYBOARD LISTENERS *****/
/* Keyboard listeners register a button when it is pressed,
 *	and un-register a button when it is released. Levels or menus
 *	can use the input from these events together with the key bindings
 *	object to create interactive user environments.
 * These functions also prevent default Javascript actions
 *	when buttons are pressed.
 */
// keyboard button press listener
$(document).keydown(function(event){
		// get the key code
        var key = event.keyCode;
        
        // prevent defaults for some specific keys
        switch(key){
            case 32: // SPACE button
				event.preventDefault(); // stop default action
                break;
            case 27: // ESCAPE button
				event.preventDefault(); // stop default action
				break;
			case 9: // TAB button
				event.preventDefault(); // stop default action
				break;
            default:
                break;
        }
        
        // check key press events to register actions:
        // up pressed
        if(settings.keyBindings.upBinding(key)){
			keyUpDown = true;
			keyDownDown = false;
        }
        // down pressed
        else if(settings.keyBindings.downBinding(key)){
			keyDownDown = true;
			keyUpDown = false;
        }
        // left pressed
		else if(settings.keyBindings.leftBinding(key)){
			keyLeftDown = true;
			keyRightDown = false;
		}
		// right pressed
		else if(settings.keyBindings.rightBinding(key)){
			keyRightDown = true;
			keyLeftDown = false;
		}
		// shoot pressed
		else if(settings.keyBindings.shootBinding(key)){
			keyShootDown = true;
		}
		// pause pressed
		else if(settings.keyBindings.pauseBinding(key)){
			keyEscDown = true;
        }
        else{
			// toggle health bars pressed
			if(settings.keyBindings.healthBarToggleBinding(key)){
				currentLevel.toggleHealthBars();
			}
			// toggle timer bars pressed
			if(settings.keyBindings.timerBarToggleBinding(key)){
				currentLevel.toggleTimerBars();
			}
		}
    });

// keyboard button release listener
$(document).keyup(function(event){
       var key = event.keyCode;
       
       // check key release events to register actions:
        // up released
        if(settings.keyBindings.upBinding(key)){
			keyUpDown = false;
        }
        // down released
        else if(settings.keyBindings.downBinding(key)){
			keyDownDown = false;
        }
        // left released
		else if(settings.keyBindings.leftBinding(key)){
			keyLeftDown = false;
		}
		// right released
		else if(settings.keyBindings.rightBinding(key)){
			keyRightDown = false;
		}
		// shoot released
		else if(settings.keyBindings.shootBinding(key)){
			keyShootDown = false;
		}
		// pause released
		else if(settings.keyBindings.pauseBinding(key)){
			if(keyEscDown){
				currentLevel.paused = !currentLevel.paused;
			}
			keyEscDown = false;
        }
   });


/* Main update function called by timer interval,
 *   updates after init() is called in the beginning
 *   of the script.
 */
function updateGame(){

    currentLevel.update();
    if(!currentLevel.paused){
        // update current level in this frame
        //update game timer
        gameTime++;
    }
	
    // clear the screen and redraw background
	context.clearRect(0, 0, contextWidth, contextHeight);
    // draw the current level
    currentLevel.draw(context);
    scrnContext.clearRect(0, 0, contextWidth, contextHeight);
    scrnContext.drawImage(doubleCanvas, 0, 0);
    
	// find what the current time is
    currentTime = new Date().getTime();
	
	// set call next frame in the time of the maximum miliseconds between frames
	//	minus the difference of current time (this frame) and last time (last frame)
	// dTime is the time to wait until calling the next frame
    dTime = tLim - (currentTime - lastTime);
	
	// restrict dTime to a minimum of 1 millisecond to the next frame
    if(dTime < 1)
        dTime = 1;
	
	// set lastTime to now plus dTime (the time it would take to get to next frame
	//	if animation and updates took no time)
    lastTime = currentTime + dTime;

	// if animating is TRUE (game is not stopped or paused) set the next update call
	//	in dTime milliseconds
	if(animating)
		setTimeout(updateGame, dTime);
}