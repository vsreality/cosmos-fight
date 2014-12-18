/* File: game.js
 *
 * The Game class contains all of the global game variables and settings.
 */


function Game(canvas_id) {
    /* Constructor:
     *  Sets up global game values, adds global event listeners, loads all global game
     *  data, and displays the main menu.
     *  Parameters:
     *      canvas_id   - the ID value of the canvas to use in the document.
     */
    
    var last_frame_time = 0;
    var settings = new Settings();
    var display = new Display(canvas_id);
    display.enableDoubleBuffering();
    
    /*this.images = new Images(); // TODO - rename class?
    this.images.add([
        ["payerBaseShip", "images/35_base.png"],
        ["playerMassiveShip", "images/35_rockets.png"],
        ["corvetShip", "images/corvet1.png"],
        ["smallTower", "images/small_tower.png"],
        ["star3Ship", "images/3-star-70.png"]
    ]);
    this.images.loadImages(); // TODO - change this to just load()
    
    this.sounds = new Sounds(); // TODO - rename class?
    this.sounds.add([
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
        ["shoot_basic", "audio/common/shoot_basic.wav"]
    ]);
    this.sounds.loadSounds(); // TODO - change this to just load()*/
    
    var userInteractionMngr = new UserInteractionManager();
    userInteractionMngr.bindTo(display.getCanvasID());
    
    // start initially with the main menu
    var state = new GameMenu(this);
    
    // Sets the state and binds the user interaction manager to it.
    this.setState = function(game_state_obj) {
        state = game_state_obj;
        userInteractionMngr.setTarget(state);
    }
    
    // Loads the given state by the given state string (a "state factory" of sorts).
    this.loadState = function(state_str) {
        state.destroy();
        userInteractionMngr.unsetTarget();
        settings.getKeyBindings().resetKeys();
        switch(state_str) {
            case "level 1":
                this.setState(new Level("1", this));
                break;
            case "main menu":
            default:
                this.setState(new GameMenu(this));
                break;
        }
    }
    
    
    // Starts updating the current state (i.e. menu or level) of the game. The
    // updates will be called automatically until the game is stopped.
    this.start = function() {
        last_frame_time = Date.now();
        window.requestAnimationFrame(this.update.bind(this));
    }
    
    // Stops updating the game state (i.e. current menu or level).
    // Calling this function will freeze the current game state.
    this.stop = function() {
        window.cancelAnimationFrame();
    }
    
    // Computes the elapsed time (in milliseconds) since the last update call, and
    // calls update to the current game state with that value.
    this.update = function() {
        var cur_time = Date.now();
        var elapsed = cur_time - last_frame_time;
        last_frame_time = cur_time;
        
        state.update(elapsed);
        display.clear();
        state.draw(display.getContext());
        display.render(elapsed);
        
        window.requestAnimationFrame(this.update.bind(this));
    }
    
    
    // Various getters for private objects.
    this.getSettings = function() {
        return settings;
    }
    this.getDisplay = function() { // TODO only used by "hack" in index.html
        return display;
    }
}