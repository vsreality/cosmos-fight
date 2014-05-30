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
    this.onTime = function(property){}
    
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