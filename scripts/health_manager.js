/* File: health_manager.js
 *
 * A HealthManager is an object that can interface with any GameObject
 * to track health and apply damage to the object.
 *
 * Main Object: HealthManager(gameObj)
 */


// HealthManager class
// Parameter: gameObj to control, must be a GameObject interface.
function HealthManager(gameObj) {

    // keep track of the game object
    this.gameObj = gameObj;
    
    // keep track of the object's current and maximum health
    this.health = 0;
    this.maxHealth = 0;
    
    
    
    // Sets the current and maximum health of the object at the given value,
    //  and overwrites the object's isAlive function to return true when the
    //  object's health is above 0. Given health should be larger than 0.
    this.initHealth = function(health) {
        this.health = health;
        this.maxHealth = health;
        
        this.gameObj.isAlive = function() {
            return this.getHealthManager().getHealth() > 0;
        }
    }
    
    // Updates the object's maximum health. If the current health is larger
    //  than the maximum health, it will be reduced accordingly.
    this.setMaxHealth = function(maxHealth) {
        this.maxHealth = maxHealth;
        
        if(this.health > this.maxHealth)
            this.health = this.maxHealth;
    }
    
    // Updates the object's current health to the given value. If new health
    //  amount is less than 0 or greater than maxHealth, it will be cut off
    //  accordingly.
    this.setHealth = function(health) {
        this.health = health;
        
        if(this.health > this.maxHealth)
            this.health = this.maxHealth;
        if(this.health < 0)
            this.health = 0;
    }
    
    
    
    // Returns this object's current health.
    this.getHealth = function() {
        return this.health;
    }
    
    // Returns this object's maximum health value.
    this.getMaxHealth = function() {
        return this.maxHealth;
    }
    
    // Returns the decimal representation of the object's health percentage.
    // Value returned is between 0 and 1: 0 is no health, 1 is max health.
    // NOTE: if maxHealth <= 0 (it shouldn't be!), this function returns 0.
    this.getHealthPercent = function() {
        if(this.maxHealth > 0)
            return this.health / this.maxHealth;
        else
            return 0;
    }
    
    
    
    // Apply the given amount of damage to this object: reduce its health
    //  by that amount. If health goes below 0, it is cut off at 0.
    // Parameters: amount should be a positive value.
    this.applyDamage = function(amount) {
        this.health -= amount;
        if(this.health < 0)
            this.health = 0;
    }
    
    // Heal the object by the given amount of points: increase its health by
    //  that amount. If health goes above maxHealth, it is cut off at maxHealth.
    // Parameters: amount should be a positive value.
    this.applyHeal = function(amount) {
        this.health += amount;
        if(this.health > this.maxHealth)
            this.health = this.maxHealth;
    }
    
    // Since shields may overwrite the applyDamage/applyHeal functions, these
    //  defaults are set for convenience in case they are needed.
    this.applyDamageDefault = this.applyDamage;
    this.applyHealDefault = this.applyHeal;
}
