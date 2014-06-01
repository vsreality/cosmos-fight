/* File: team_manager.js
 *
 * The TeamManager is responsible for updating everything on a specific team
 * in the game level. The most typical use for team is player (team 0) and
 * the in-game enemies (team 1). Teams fight against each other in the game,
 * and can be controlled by players or AI. However, teams can be extended to
 * multiplayer applications.
 *
 * Main Object: TeamManager(lvl, teamNumber)
 */



// TeamManager: this is the manager in charge of managing, updating and drawing
//  all units of a given team, including projectiles, weapons and shields.
// This manager is controlled by the given level object.
// Parameters: the parent level that controls this manager and the team number.
function TeamManager(lvl, teamNumber) {
    
    // level object and team number
    this.lvl = lvl;
    this.teamNumber = teamNumber;
    
    // Each unit is assigned a unique teammate ID number, starting with 0.
    //  This keeps track of the current ID to be assigned.
    this.currentID = 0;

    this.units = new Array();		// array of all units on this team
    this.bullets = new Array();		// array of all team bullets
    this.missiles = new Array();	// array of all team missiles
    this.lasers = new Array();		// array of all team laser objects
    
    // TODO - need shields and weapons, too
    
    // Subsystems:
    this.effectSys = new effectSystem();
    
    // Variable to keep track of whether or not health bars are being displayed
    //  or not (other than just by mouseover).
    // TODO - this may need to be moved to settings
    this.showingHealthBars = false;
    
    
    // Add a bullet to the array of bullets in this manager.
    this.addBullet = function(bullet) {
        this.bullets.push(bullet);
    }
    
    
    // Add a missile to the array of missiles in this manager.
    this.addMissile = function(missile) {
        this.missiles.push(missile);
    }
    
    
    // Add a laser to the array of lasers in this manager.
    this.addLaser= function(laser) {
        this.lasers.push(laser);
    }
    
    
    // Adds the given unit to this manager (to the units array) and returns
    //  the unit that was just added.
    this.addUnit = function(unit) {
        unit.teamManager = this;
        unit.id = this.currentID;
        this.currentID++;
        
        // if health bars are showing, toggle this enemy with health bar display
        if(this.showingHealthBars)
            unit.displayHealthBar = true;
        
        this.units.push(unit);
        
        // If this unit has children parts, add all parts of unit to the team.
        // NOTE: units can be comprised of multiple parts, and each part acts
        //  as a standalone unit in the team, connected by the main node.
        for(var i=0; i<unit.parts.length; i++)
            this.addUnit(unit.parts[i]);
    }
    
    
    // Returns a unit by its ID number, or false if nothing is found..
    this.getUnitById = function(id) {
        for(var i=0; i<this.units.length; i++) {
            if(this.units[i].id == id)
                return this.units[i];
        }
        return false;
    }
    
    
    // Removes the unit and its parts from the team manager, and returns the
    //  removed unit. If the unit is not found, returns false.
    // The removed units are not destroyed, just removed from the team manager.
    this.removeUnitById = function(id) {
        // look through the array of units to find the one we need
        for(var i=0; i<this.units.length; i++) {
            if(this.units[i].id == id) {
                var unit = this.units[i];
                this.units.splice(i,1);
                // remove all of the unit's parts
                for(var j=0; j<unit.parts.length; j++){
                    this.removeUnitById(unit.parts[j].id);
                }           
                return unit;
            }
        }
        return false;
    }
    
    
    // Removes the unit and its parts from the unit array at the given index.
    //  If found, the removed enemy is returned, else false is returned.
    // The removed units are not destroyed, just removed from the team manager.
    this.removeUnit = function(index) {
        var unit = this.units[index];
        if(unit) { // check that unit exists
            this.units.splice(index, 1);
            // remove all of the unit's parts
            for(var j=0; j<unit.parts.length; j++) {
                this.removeUnitById(unit.parts[j].id);
            }
            return unit;
        } else {
            return false;
        }
    }
    
    
    // Calls update on all team units, bullets, missiles, and lasers.
    this.update = function() {
        // Update all units.
        for(var i=0; i<this.units.length; i++) {
            this.units[i].update();
        }
        
        // Update all bullets. If a bullet has been deactivated (most likely
        //  from going off screen), remove it instead.
        for(var i=0; i<this.bullets.length; i++) {
            if(this.bullets[i].isAlive()) {
                this.bullets[i].update();
            } else {
                this.bullets.splice(i, 1);
                i--;
            }
        }
        
        // Update all missiles.
        for(var i=0; i<this.missiles.length; i++) {
            this.missiles[i].update();
            // If the missile is not alive (i.e. deactivated, exploded,
            //	out of range, etc), remove it.
            if(!this.missiles[i].isAlive()) {
                this.missiles.splice(i, 1);
                i--;
            }
        }
        
        // Update all lasers: (toggle inactive if active, else delete if
        //	already inactive)
        // TODO - lasers need revamping, and this has to change.
        for(var i=0; i<this.lasers.length; i++) {
            // if active, toggle inactive
            if(this.enemyLasers[i].active){
                this.enemyLasers[i].active = false;
            }
            // otherwise, it's inactive so delete
            else {
                this.enemyLasers.splice(i, 1);
                i--;
            }
        }
    }
    
    
    // Draw everything associated with this team on the screen.
    // Parameter: 2D context object to draw on.
    this.draw = function(ctx) {
        // Draw all units.
        for(var i=0; i<this.units.length; i++) {
            this.units[i].draw(ctx);
            this.units[i].drawHealthBar(ctx);
        }
        
        // Draw all bullets.
        for(var i=0; i<this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
        }
        
        // Draw all missiles.
        for(var i=0; i<this.missiles.length; i++) {
            this.missiles[i].draw(ctx);
        }
        
        // Draw all of lasers.
        for(var i=0; i<this.lasers.length; i++) {
            this.lasers[i].draw(ctx);
        }
        
        // Update and draw the active effects from the effects subsystem.
        this.effectSys.update();
        this.effectSys.draw(ctx);
    }
    
    
    // Called by the parent level if the mouse is moved, and determines whether
    //  or not a unit is intersecting with the mouse pointer. If a unit is
    //  under the mouse pointer, its health bar is displayed.
    this.mouseover = function(x, y) {
        // Only do anything if health bars are not already being shown anyway.
        if(!this.showingHealthBars) {
            // check mouseover of all units
            for(var i=0; i<this.units.length; i++) {
                // set the health bar flag to true if the unit intersects the mouse
                //  coordinates, and false otherwise
                //this.units[i].displayHealthBar = this.units[i].intersects(x, y);
                // TODO - why is this commented?
            }
        }
    }
    
    
    // Toggle all health bars on or off: switches the mode.
    this.toggleHealthBars = function() {
        if(this.showingHealthBars)
            this.hideHealthBars();
        else
            this.showHealthBars();
    }
    
    
    // Force all units of this team on the screen to display their health bars.
    this.showHealthBars = function(){
        for(var i=0; i<this.units.length; i++){
            this.units[i].displayHealthBar = true;
        }
        // toggle showing health bars variable as true
        //  (this is used by the mouseOver function)
        this.showingHealthBars = true;
    }
    
    
    // Force all units of this team on the screen to hide their health bars.
    this.hideHealthBars = function() {
        for(var i=0; i<this.units.length; i++){
            this.units[i].displayHealthBar = false;
        }
        // toggle showing health bars variable as false
        //  (this is used by the mouseOver function)
        this.showingHealthBars = false;
    }
    
    
    // Adds an effect to the team manager's effect subsystem.
    this.addEffect = function(effect) {
        this.effectSys.addEffect(effect);
    }
    
    
    // Removes all units and bullets, missiles and lasers, effectively
    //  resetting the team to its initial empty state.
    this.reset = function() {
        this.units = new Array();
        this.bullets = new Array();
        this.missiles = new Array();
        this.lasers = new Array();
    }
}