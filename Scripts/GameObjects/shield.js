/* File: shield.js
 *
 * The Shield class provides an interface for any GameObject to reduce or
 * manipulate incoming damage. By default, the Shield class does not mitigate
 * any damage or do anything, but provides the function hooks to attach
 * specific shield objects.
 */


function Shield(gameObj) {

    this.gameObj = gameObj;
    
    
    /* Because shields can mitigate incoming damage, this function acts as a
     *  filter to customize the HealthManager module of the parent game object.
     * To mitigate health, create a new HealthManager and modify its
     *  applyDamage function, and return that instead.
     * For example, to reduce all damage by half:
     *  >   this.healthMngr = new HealthManager(this.gameObj);
     *  >   this.healthMngr.applyDamage = function(dmg) {
     *  >       return this.healthMngr.applyDamageDefault(dmg / 2);
     *  >   }
     * applyDamageDefault() is a part of the HealthManager API for convenience.
     */
    
    // The default shield just returns the existing object's HealthManager.
    this.getHealthManager = function() {
        return this.gameObj.healthMngr;
    }

    
    // Override this function to draw the shield animation each frame. The
    //  shield will be drawn on top of (over) the parent GameObject.
    this.draw = function(ctx) { }
}
