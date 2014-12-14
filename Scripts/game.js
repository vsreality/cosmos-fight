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
    
    this.last_frame_time = 0;
    this.settings = new Settings();
    this.display = new Display(canvas_id);
    this.display.enableDoubleBuffering();
    
    // GameWorld defines global properties of the 2D virtual world.
    this.world = new GameWorld(this.display.getWidth(), this.display.getHeight());
    
    this.images = new Images(); // TODO - rename class?
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
    this.sounds.loadSounds(); // TODO - change this to just load()
    
    this.userInteractionMngr = new UserInteractionManager();
    this.userInteractionMngr.bindTo(this.display.getCanvasID());
    
    // start initially with the main menu
    this.state = new GameMenu(this);
    
    // Sets the state and binds the user interaction manager to it.
    this.setState = function(game_state_obj) {
        this.state = game_state_obj;
        this.userInteractionMngr.setTarget(this.state);
    }
    
    // Loads the given state by the given state string (a "state factory" of sorts).
    this.loadState = function(state_str) {
        this.state.destroy();
        this.userInteractionMngr.unsetTarget();
        switch(state_str) {
            case "level 1":
                this.setState(new Level("1"));
                break;
            case "main menu":
            default:
                this.setStat(new GameMenu());
                break;
        }
    }
    
    
    // Starts updating the current state (i.e. menu or level) of the game. The
    // updates will be called automatically until the game is stopped.
    this.start = function() {
        this.last_frame_time = Date.now();
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
        var elapsed = cur_time - this.last_frame_time;
        this.last_frame_time = cur_time;
        
        this.state.update(elapsed);
        this.display.clear();
        this.state.draw(this.display.getContext());
        this.display.render();
        
        window.requestAnimationFrame(this.update.bind(this));
    }
}