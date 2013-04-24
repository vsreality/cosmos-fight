/* ENEMY: Vampire Enemy
 *	An enemy that drains health from the player and uses it to heal other enemies around it.
 *	If it has drain health in its resource pool, it will use this extra health to shield
 *	itself until the player destroys it.
 * Enemy features:
 *	- Drains health from the player
 *	- Heals nearby enemies (if not fully healed already) using the drained health
 *	- On dying, always drops a health bonus. This is a special bonus.
 *	- Can use a "blur" ability where its speed is increased greatly for a short period
 *		of time. This ability creates blur-like effect on the screen.
*/
function vampireEnemy(x, y, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    newEnemy.maxHealth = 100;
    newEnemy.health = 100;
    newEnemy.score = 35;
	newEnemy.name = "Vampire Vessel";
	newEnemy.weight = 75; // inflicts 75 damage if player crashes into it
	newEnemy.height = 50;
	
	// vampire mode variables
	newEnemy.DRAIN_MODE = 0;
	newEnemy.HEAL_MODE = 1;
	newEnemy.EVADE_MODE = 2;
	
	/*** VAMPIRE VARIABLES ***/
	newEnemy.drainedHealth = 0; // how much drained health it currently has
	newEnemy.maxDrainedHealth = 100; // max amount of drained health it can store
	newEnemy.drainRange = 150; // max distance it can drain health from player
	newEnemy.drainRate = 5/FPS; // speed of damage to player (scaled by FPS)
	newEnemy.feedRange = 150; // max distance to another enemy to heal it
	newEnemy.avoidDistance = 100; // minimum distance at which to avoid player in evade mode
	// mode: one of three (draining the player, feeding enemies, or avoiding player)
	newEnemy.mode = newEnemy.DRAIN_MODE;
	// heal target: if in healing mode (drainMode = false), this is the target to heal
	newEnemy.healTarget; // nothing by default

	// collision: made up of an icecream-cone-like representation of this ship's teardrop
	//	shape, consisting of a triangle and a circle on top
    newEnemy.addCollision(new standardCollision(77))
        .addObject(new cTriangle({x:0,y:25},{x:-12,y:-5},{x:12,y:-5}))
        .addObject(new cCircle({x:0,y:-12},12));
	
	// create an empty target point as a reference for the follow path to evade to
	//	when in evasion mode (default to (0, 0), but updated during evasion mode)
	newEnemy.evasionPoint = new EmptyTargetPoint(0, 0);
	
	// establish a follow path to follow the player (pass in the 0, 0 point to start with)
	newEnemy.followPath = new FollowTargetSystem(
			100, 40, 90, newEnemy.evasionPoint);
	// set the initial follow mode to follow the player (drain mode) - this is different
	//	from the vampire's phases and used for updating the paths
	newEnemy.followPath.mode = -1; // set mode to null for now
	
	// blur effect timer: a timer that triggers a cooldown reset on the vampire's blur
	//	ability after it has been used; after it has been used, the blurReady variable
	//	gets set to false.
	newEnemy.blurReady = true;
	newEnemy.blurTimer = new Timer(-1);
	newEnemy.blurTimer.property = newEnemy;
	newEnemy.blurTimer.onTime = function(vampire){
		vampire.blurReady = true;
	}
	
	// update function: this is where all the pathing and AI happens
	newEnemy.updateEnemy = function(){
		// DRAIN MODE: if in drain mode (current focus is draining from the player)
		if(this.mode == this.DRAIN_MODE){
			// if not full on drained health, check if player is close enough to drain
			if(this.drainedHealth < this.maxDrainedHealth){
				var plyr = this.enemySys.lvl.player;
				var playerDist = getDistance2(plyr.getX(), plyr.getY(), this.getX(), this.getY()+25);
				
				// if player is in range to be drained:
				if(playerDist < this.drainRange*this.drainRange){
					// create the laser and add it to the enemy system's laser array
					var laser = vampireDrainLaser(this.getX(), this.getY()+20,
								plyr.getX(), plyr.getY(), this.drainRate, plyr);
					this.enemySys.addLaser(laser);
					
					// if this enemy is not at full health, the drained health heals it at
					//	4X the rate of the actual damage
					if(this.health < this.maxHealth){
						this.health += this.drainRate*4;
						if(this.health > this.maxHealth)
							this.health = this.maxHealth;
					}
					// otherwise, increase the drained health count (up to the max drained health):
					//	health drained increases 4X the rate of the actual damage
					else{
						this.drainedHealth += this.drainRate*4;
						if(this.drainedHealth > this.maxDrainedHealth)
							this.drainedHealth = this.maxDrainedHealth;
					}
					
					// update movement to stop
					this.followPath.stop();
				}
				
				// otherwise, make an effort to get closer to the player
				else{
					// set follow path to player if not already set
					if(this.followPath.mode != this.DRAIN_MODE){
						this.followPath.setTarget(this.enemySys.lvl.player);
						this.followPath.mode = this.DRAIN_MODE;
					}
					// tell the target to go
					this.followPath.go();
				}
			}
			
			// otherwise check to switch to heal-enemy mode or evasive mode
			else{
				// check for a heal target; if found, go into heal mode
				if(this.checkForHealTarget()){
					this.mode = this.HEAL_MODE;
				}
				// otherwise, avoid the player
				else {
					this.mode = this.EVADE_MODE;
				}
			}
		}
		
		// HEAL MODE: if mode is heal mode, go dump some drained health to the heal target
		else if(this.mode == this.HEAL_MODE){
			// if drained health is depleted, return to drain mode
			if(this.drainedHealth <= 0){
				this.mode = this.DRAIN_MODE;
			}
			
			// otherwise, if target enemy is dead or at full health, or for some reason the
			//	pointer is undefined:
			else if(!this.healTarget || // if undefined or null
					this.healTarget.health <= 0 || // if dead
					this.healTarget.health >= this.healTarget.maxHealth){ // if at full health
				// try to find a new heal target. If not found, go into evade mode
				if(!this.checkForHealTarget()){
					this.mode = this.EVADE_MODE;
				}
			}
			
			// otherwise, run the healing algorithm here
			else {
				// HEAL!
			}
		}
		
		// EVADE MODE: otherwise, avoid the player
		else{
			// if drained health is depleted, return to drain mode
			if(this.drainedHealth <= 0){
				this.mode = this.DRAIN_MODE;
				this.evasionPoint.ready = false;
			}
			
			// otherwise, if a heal target is within range, go into heal mode
			else if(this.checkForHealTarget()){
				this.mode = this.HEAL_MODE;
				this.evasionPoint.ready = false;
			}
			
			// otherwise, if too close to the player or if in danger of being hit
			//	by player attacks (very close on the x-axis), avoid the player
			else {
				/*** evasion algorithm here ***/
				// if evasion point was not set, create it here
				if(!this.evasionPoint.ready){
					this.findEvasionPoint();
					this.evasionPoint.ready = true;
				}
				
				// if follow mode was not set to evasion mode, set the evasionPoint
				//	as the target.
				if(this.followPath.mode != this.EVADE_MODE){
					this.followPath.setTarget(this.evasionPoint);
					this.followPath.mode = this.EVADE_MODE;
				}
				
				// calculate distance to evasion point
				var evasionDist = getDistance2(
					this.evasionPoint.x, this.evasionPoint.y,
					this.getX(), this.getY()+25);
			
				// if more than 100*100=10000 (100 pixels) from target, keep going to it
				if(evasionDist > 10000){
					// if blur ability is ready, use it to move to evasion point
					if(this.blurReady)
						this.blurTo(this.evasionPoint.x, this.evasionPoint.y);
					
					// otherwise, tell the target to go, or continue going
					else
						this.followPath.go();
				}
				else{
					// if player is too close,
					if((getDistance2(this.enemySys.lvl.player.getX(),
							this.enemySys.lvl.player.getY(), this.getX(), this.getY())
						< this.avoidDistance*this.avoidDistance) // if too close to player
							|| // or if very close on the x-axis (1/4th of avoidDistance)
						Math.abs(this.enemySys.lvl.player.getX()-this.getX())
							< this.avoidDistance/4){
						
						// then find a new evasion point
						this.findEvasionPoint();
					}
					this.followPath.stop();
				}
			}
		}
		
		// finally, update the movement as needed using the follow target system
		this.followPath.update(this.getX(), this.getY());
		this.x += this.followPath.getXdelta();
		this.y += this.followPath.getYdelta();
		this.angle = this.followPath.getAngle();
		
		// update the blur ability timer here
		this.blurTimer.update();
	}
	
	
	// checks to see if there are available heal targets on the screen.
	//	if a target is found, returns TRUE and sets the healTarget to the located enemy
	//	If no target is found, returns FALSE
	newEnemy.checkForHealTarget = function(){
		var targetFound = false;
		// check all enemies on the screen if they need healing; ignore if enemy is THIS one
		//	for whatever reason
		for(var i=0; i<this.enemySys.enemies.length; i++){
			if(this.enemySys.enemies[i].health < this.enemySys.enemies[i].maxHealth
				&& this.enemySys.enemies[i] != this){
				// target this enemy
				this.healTarget = this.enemySys.enemies[i];
				targetFound = true;
				break;
			}
		}
		return targetFound;
	}
	
	
	// applies the blur ability to the given x, y location on the screen, and triggers
	//	the cooldown timer on the blur ability
	newEnemy.blurTo = function(x, y){
		this.x = x;
		this.y = y;
		
		// set the blur effect to cooldown mode
		this.blurReady = false;
		
		// set a 15 second cooldown on the blur ability
		this.blurTimer.set(secToFrames(15));
	}
	
	
	// set the evasion point to a random position away from the player, but
	//	in reach of the player's attacks.
	newEnemy.findEvasionPoint = function(){
		// randomly choose a point x, y on the upper half of the screen (50 px margins)
		var evadeToY = getRandNum(contextHeight/2)+25;
		var evadeToX = getRandNum(contextWidth);
		
		// if player X is within 30% of the screen width of evadeToX value,
		//	add or substract 50% of the screen width (and adjust overflow to other
		//	side of screen if it goes off screen).
		var plyr = this.enemySys.lvl.player;
		if(Math.abs(plyr.getX() - evadeToX) <= contextWidth/10 * 3){
			var modify = contextWidth/2;
			if((plyr.getX() - evadeToX) > 0)
				modify *= -1;
			evadeToX += modify;
			if(evadeToX < 0){
				evadeToX += contextWidth;
			}else if(evadeToX > contextWidth){
				evadeToX -= contextWidth;
			}
		}
		
		// set the evasion point to these values
		this.evasionPoint.x = evadeToX;
		this.evasionPoint.y = evadeToY;
	}
	
	
	// OVERRIDE applyDamage: if this enemy has some drained health in its reserve, the
	//	drained health will be depleted instead of the base health pool first
    newEnemy.applyDamage = function(dmg){
		// try to remove health from the drained health pool first
		this.drainedHealth -= dmg;
		// if there drained health pool was exceeded, increment the damage back
		//	up to the amount of drained health over-used
		if(this.drainedHealth < 0){
			dmg = -this.drainedHealth;
			this.drainedHealth = 0;
		}
		// otherwise, no damage is inflicted
		else
			dmg = 0;
		// then apply the damage normally
        this.health -= dmg;
        if(this.health < 0)
            this.health = 0;
    }
	
	// OVERRIDE
    // Draw function called each frame to draw this enemy onto the canvas.
	//	This draws the enemies specific appearance and animations
    newEnemy.draw = function(ctx){
		// save context (start new drawing stack)
        ctx.save();
		// move context to enemy's x and y position
        ctx.translate(this.getX(), this.getY());
        // rotate context
        ctx.rotate(this.angle);
		
		// draw the enemy: a red teardrop-shaped ship that starts as dark and
		//	half-transparent, but becomes less transparent and brighter as it drains
		//	more health from the player
		var grd = ctx.createRadialGradient(0, 0, 0,
										   0, 0, 30);
		grd.addColorStop(0, "rgb(" + Math.floor(160 + this.drainedHealth/2) + ",0,0)");
		grd.addColorStop(1, "#600000");
        ctx.fillStyle = grd;
		ctx.globalAlpha = 0.5 + (this.drainedHealth/this.maxDrainedHealth)/2;
		ctx.beginPath();
			ctx.moveTo(0, -25);
			ctx.quadraticCurveTo(-25, -25, 0, 25);
			ctx.moveTo(0, -25);
			ctx.quadraticCurveTo(25, -25, 0, 25);
			ctx.fill();
        ctx.closePath();
        
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
	// when enemy dies, create a red round explosion
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.slowRedExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark where the bullet hit
    newEnemy.hitEffect = function(x, y){
		// push the effect into the enemySys effect system
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, (3*Math.PI)/2));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
    return newEnemy;
}


function EmptyTargetPoint(x, y){
	this.x = x;
	this.y = y;
	this.ready = false;
	this.getX = function(){
		return this.x;
	}
	this.getY = function(){
		return this.y
	}
}