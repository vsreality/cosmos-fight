/* File: game.js
 *
 * Contains the Game class. This class keeps track of all game variables and
 *  runs the main game loop.
 */


function Game(FPS, canvas_name) {

    //FPS: the game's predetermined frames per second to animate at.
    this.FPS = FPS;

    // tLim is the number of milliseconds between each frame
    //  (used by animation/update functions)
    this.tLim = Math.floor(1000/FPS);
    
    // true as long as the animation loop is running
    //	(set to false to pause or stop animation loop)
    this.animating = true;


    // time values used to determine how many milliseconds to wait
    //	until the next frame (dTime)
    // See animation loop below for details
    this.currentTime = 0;
    this.lastTime = 0;
    this.dTime = 0;

    // Time of game in frames (that is, how many frames passed since the game
    //  game animation started)
    this.gameTime = 0;
    
    // TODO - left off here


    /* LOAD GAME MEDIA (sounds and images) */
    // general images
    var gameImgs = new Images();
    gameImgs.add([
        ["payerBaseShip", "images/35_base.png"],
        ["corvetShip", "images/corvet1.png"],
        ["smallTower", "images/small_tower.png"],
        ["star3Ship", "images/3-star-70.png"]
    ]);
    gameImgs.loadImages();

    // player ship graphic
    var payerMassiveShip = new Image();
    payerMassiveShip.src = "images/35_rockets.png";

    // general sounds
    var gameSounds = new Sounds();
    gameSounds.add([
        // add menu/gui sounds:
        ["menu_mouseover", "audio/gui/mouseover.mp3"],
        ["menu_click", "audio/gui/click.mp3"],
        ["menu_back", "audio/gui/back.mp3"],
        // add standard ambiance sounds:
        //["ambiance_cosmic_energy", "audio/ambiance/cosmic_energy.mp3"],
        // add standard game sounds:
        ["low_health", "audio/common/low_health.mp3"],
        ["bonus_heal", "audio/common/bonus_heal.wav"],
        ["bonus_shield", "audio/common/bonus_shield.mp3"],
        //["bonus_weapon", "audio/common/bonus_weapon.wav"], TODO - bad sound, replace
        ["bonus_weapon", "audio/common/bonus_shield.mp3"],
        ["explosion1", "audio/common/explosion1.mp3"],
        ["death_explosion", "audio/common/death_explosion.mp3"],
        ["level_complete", "audio/common/level_complete.wav"],
        ["shoot_basic", "audio/common/shoot_basic.wav"],
    ]);
    gameSounds.loadSounds();


    /* GLOBAL VARIABLES: initialize all  */

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
    
    // set call next frame in the time of the maximum milliseconds between frames
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