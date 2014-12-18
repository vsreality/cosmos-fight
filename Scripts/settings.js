/* File: settings.js
 *
 * The Settings class contains and controls all settings and options for the game.
 * The Level object and other GameStates can access the settings variables to
 * modify or view settings properties.
 *
 * TODO:
 * In addition, the Settings object can also obtain and save its information from or
 * to a user profile in a database.
 */


function Settings() {

    // USER ACCOUNT INFO HERE
    
    // Volume levels: scale from 0.0 to 1.0
    this.soundVolume = 1.0;
    this.musicVolume = 1.0;
    
    
    
    // TODO - modify this stuff
    
    // visual effects (particle system) setting variables
    this.effectsScale = 1;
    this.effectsLevel = 2;
    
    // in-game GUI display values
    this.showEnemyHealthBars = false;
    this.showBonusTimerBars = false;
    
    // set the volume of the game's sound
    this.setSoundVolume = function(vol){
        this.soundVolume = vol;
    }

    // set the visual effect level of the game's particle system
    this.setEffectsLevel = function(val){
        this.effectsScale = val/2;
        this.effectsLevel = val;
    }
    
    
    // KEYBINDINGS
    var keyBindings = new KeyBindings();
    this.getKeyBindings = function() {
        return keyBindings;
    }
    
}