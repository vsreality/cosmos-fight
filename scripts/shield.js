/* File: shield.js
 *
 * The Shield class provides an interface for any GameObject to reduce or
 * manipulate incoming damage. By default, the Shield class does not
 * mitigate any damage, but provides the function hooks to attach specific
 * shielding objects.
 */


function Shield(gameObj) {

    this.gameObj = gameObj;

    // Default process damage function does not mitigate any damage, and
    //  applies all damage directly to the Game Object.
    this.defaultProcessDamageFunc = function(obj, dmg) {
        this.gameObj.applyDamage(dmg);
    }
    
    // Default reset condition is to never reset (always returns false).
    this.defaultResetConditionFunc = function() {
        return false;
    }


    // Sets new process damage and reset condition functions to the shield.
    this.set = function(processFunc, resetFunc) {
        this.processDamage = processFunc;
        this.resetCondition = resetFunc;
    }

    this.update = function() {
        if(this.resetCondition())
            this.reset();
    }

    // Resets the shield to its default setting: doing nothing.
    this.reset = function() {
        this.processDamage = this.defaultProcessDamageFunc;
        this.resetCondition = this.defaultResetConditionFunc;
    }

    // Reset initially to set the processDamage and resetCondition functions.
    this.reset();
}
