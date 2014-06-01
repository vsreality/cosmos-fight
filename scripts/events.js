/* File: events.js
 *
 * This file provides an object called GameEvents that contains a set of events
 * interfaced by public fired(), reset(), and isAlive() functions. Each event
 * fires when the parent object enters a certain state. Use isAlive() to check
 * whether the event needs to be removed or not.
 *
 * See documentation for each event object individually for more details.
 *
 * For Timers, see timers.js. Alternatively, use the built-in JavaScript Timing
 * Events (i.e. setTimeout and setInterval) for performance.
 */



// GameEvents contains all events. To create a new event, do as follows:
//  var enemyOffscreen = new GameEvents.OffscreenEvent(enemy);
// Then, proceed to update the event each iteration. Use fired() and reset()
//  to check if the event fired, and to reset it, respectively. Resetting an
//  event makes it marked as not fired again.
var GameEvents = {

    // Basic event structure to contain functions for firing the event,
    //  checking if it has been fired, and resetting and updating the event.
    AbstractEvent: function() {
        this.hasFired = false;
        this.fire = function()    { this.hasFired = true; }
        this.fired = function()   { return this.hasFired; }
        this.reset = function()   { this.hasFired = false; }
        this.isAlive = function() { return !this.hasFired; }
        this.update = function()  { /* OVERRIDE THIS FUNCTION */ }
        this.executeAction = function() { /* OVERRIDE THIS FUNCTION */ }
    },
    
    
    // Event triggered when the given parent GameObject goes off screen.
    // Parameter: a valid GameObject with a set size value to indicate how big
    //  of a leeway to give it before saying it has gone off screen.
    OffscreenEvent: function(gameObj) {
        this.gameObj = gameObj;
        
        // Checks if the parent GameObject has gone off-screen by its (x, y)
        //  position. If so, the event fires.
        this.update = function() {
            var leeway = this.gameObj.getSize();
            var objX = this.gameObj.getX();
            var objY = this.gameObj.getY();
            if( objX < (0 - leeway) ||
                objX > (areaWidth + leeway) ||
                objY < (0 - leeway) ||
                objY > (areaHeight + leeway) ) {
                this.fire();
            }
        }
    }
    
};

// All events are prototyped to the AbstractEvent:
GameEvents.OffscreenEvent.prototype = new GameEvents.AbstractEvent();