/* File: effects_manager.js
 *
 * An EffectsManager is an object that can interface with any GameObject
 * to provide standard visual effects properties, including particle effects.
 *
 * Main Object: EffectsManager(gameObj)
 */


// TODO - needs implementing
// EffectsManager class
// Parameter: gameObj to control, must be a GameObject interface.
function EffectsManager(gameObj) {

    // keep track of the game object
    this.gameObj = gameObj;
    
    
    this.particleSystems = new Array();
    
}
