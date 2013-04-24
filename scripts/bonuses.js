/* File comments updated: Thursday, May 18, 2012 at 7:47 AM
 *
 *  BONUS CLASS
 */

// ABSTRACT BONUS OBJECT:
//  contains basic variables for the bonuses
//  such as x and y position
// PARAMETERS: x and y position, and lifetime (in seconds) to keep
//	the bonus on the screen before it disappears.
function bonus(x,y, lifeTime){
    // bonus position (x, y)
    this.x = x;
    this.y = y;
	this.r = 15; //Radius
	this.speedX=0;
	this.speedY=15/FPS; // default speed if moving down
	
	// Get X
	this.getX = function(){
		return this.x;
	}
	// Get Y
	this.getY = function(){
		return this.y;
	}
	
	// Collision, just a circle
	this.collision = new standardCollision(this.r);
	this.collision.parent = this;
	
	// create radial gradient
	this.grd = context.createRadialGradient(2, -2, this.r*0.15, 0, 0, this.r*0.85);
	
	// label is the text associated with this bonus (usually pops up
	//	as floating text when the user collects it)
    this.label = "BONUS";
	
	// duration applies only to shield and weapon bonuses
	//	(how long will the bonus remain attached to the player)
	//	(if it is 0, it is indefinate)
	this.duration = 0;
	
	// the lifetime of this bonus (in frames)
	this.lifeTime = secToFrames(lifeTime);
	// the time of death (in frames, relative to gameTime) of this bonus (that is, when
	//	this bonus is to be removed from the screen)
    this.deathTime = gameTime + secToFrames(lifeTime);
	// time that the bonus was created (used to calculate percentage of lifetime remaining)
	this.creationTime = gameTime;
	
	// generic update call
	this.update = function(){
		// if the bonus is above the top third of the screen, move it down
		//	to be more easily reachable by the player.
		if(this.y < contextHeight/3)
			this.y += this.speedY;
	}
	
	// override this function to draw the icon
	this.drawIcon = function(ctx){}
	
	// icon (and border) color: override this value for each bonus
	this.iconColor = "#FFFFFF";
	
	// generic draw function
	this.draw = function(ctx){
		ctx.save();
        ctx.translate(this.x, this.y);
        
		// draw the inner fill gradient
        ctx.fillStyle = this.grd;
        ctx.strokeStyle = this.iconColor;
        ctx.beginPath();
		ctx.arc(0, 0, this.r, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
		
        this.drawIcon(ctx);
        
        ctx.restore();
	}
	
	// draws a timer on the screen illustrating the time this bonus will remain on the screen
	this.drawTimerBar = function(ctx){
		ctx.save();
		ctx.fillStyle = "rgba(0, 255, 255, 0.6)";
		// determine the decimal percentage of time remaining, and draw the timer bar
		//	above the bonus graphic
		var timeRemaining = 1 - ((gameTime - this.creationTime) / this.lifeTime);
		ctx.fillRect(this.getX() - 15, this.getY() - 23,
			30*timeRemaining, 3);
		ctx.restore();
	}
	
	// this function can be called by level to apply the bonus to player
	this.activate = function(player){}
	// returns true as long as death time is not passed by gametime
	this.isAlive = function(){
		return (gameTime <= this.deathTime);
	}
}


// HEALTH BONUS
function healthBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
    newBonus.heal = 30; // heal by 30 points
	
	// bonus text is "30" to resemble the effect of activing this bonus
	//	30 represents the amount by which this bonus heals
    newBonus.label = newBonus.heal;
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#FFFFFF");// light
	newBonus.grd.addColorStop(1, "#CCCCCC");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FF0000"; // red icon
	newBonus.drawIcon = drawHealthIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the heal value (+30) to the player.
	newBonus.activate = function(player){
		player.addHealth(this.heal);
	}
	return newBonus;
}


// ADD LIFE BONUS
//  gives the player one extra life
function extraLifeBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Extra Life";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#FFFFFF");// light
	newBonus.grd.addColorStop(1, "#CCCCCC");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FF0000"; // red icon
	newBonus.drawIcon = drawAddLifeIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies one extra life to the player
	newBonus.activate = function(player){
        player.addLife();
	}
	return newBonus;
}


// TRIPPLE GUN BONUS:
//  Gives the player a weapon that shoots two extra slightly weaker
//  bullets on either side in addition to the standard gun.
function trippleGunBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(11) + 20; // 20-30 seconds
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Tripple Gun";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#00AACC");// light
	newBonus.grd.addColorStop(1, "#003366");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FFFF00"; // yello icon
	newBonus.drawIcon = drawTrippleGunIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the weapon attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setWeapon(trippleGun(player), this.duration);
	}
	return newBonus;
}


// DISPERSE GUN BONUS
//  gives the player a gun that shoots 4 extra weaker bullets to the side
//  at an angle in addition to the default weapon's function.
function disperseGunBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(6) + 20; // 20-25 seconds
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Disperse Gun";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#00AACC");// light
	newBonus.grd.addColorStop(1, "#003366");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FFFF00"; // yello icon
	newBonus.drawIcon = drawDisperseGunIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the weapon attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setWeapon(disperseGun(player), this.duration);
	}
	return newBonus;
}


// BASIC LASER GUN BONUS
//  gives the player a laser that fires at the closest enemy within the radius (120)
//	and does damage over time as long as the player keeps firing.
function laserGunBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(6) + 20; // 20-25 seconds
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Laser Gun";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#00AACC");// light
	newBonus.grd.addColorStop(1, "#003366");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FFFF00"; // yello icon
	newBonus.drawIcon = drawBasicLaserIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the weapon attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setWeapon(laserGun(player), this.duration);
	}
	return newBonus;
}


// SUPER LASER GUN BONUS
//  gives the player a laser that fires ALL enemies within the radius (120) and
//	does damage over time to all of them as long as the player keeps shooting.
function superLaserGunBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(6) + 10; // 10-15 seconds
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Super Laser";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#00AACC");// light
	newBonus.grd.addColorStop(1, "#003366");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#FFFF00"; // yello icon
	newBonus.drawIcon = drawSuperLaserIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the weapon attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setWeapon(superLaserGun(player), this.duration);
	}
	return newBonus;
}


// ARMOR SHIELD BONUS
function armorShieldBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = 0; // 0 implies it will last until depleted
    
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Armor Shield";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#C0C0C0");// light
	newBonus.grd.addColorStop(1, "#999999");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#33CCFF"; // light blue icon/border
	newBonus.drawIcon = drawArmorShieldIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the armor attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setShield(armorShield(player), this.duration);
	}
	return newBonus;
}


// ABSORB SHIELD BONUS
function reductionShieldBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(11) + 20; // 20-30 seconds
    
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Reduction Shield";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#C0C0C0");// light
	newBonus.grd.addColorStop(1, "#999999");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#33CCFF"; // light blue icon/border
	newBonus.drawIcon = drawReductionShieldIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the armor attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setShield(reductionShield(player), this.duration);
	}
	return newBonus;
}


// REFLECTIVE SHIELD BONUS
function reflectiveShieldBonus(x,y, lifeTime){
	var newBonus = new bonus(x,y, lifeTime);
	
	// duration of bonus (how long [seconds] it will remain attached to player)
    newBonus.duration = getRandNum(11) + 10; // 10-20 seconds
    
	// bonus description (usually what is shown in the floating text)
    newBonus.label = "Reflective Shield";
	
	//Add gradient colors
	newBonus.grd.addColorStop(0, "#C0C0C0");// light
	newBonus.grd.addColorStop(1, "#999999");// dark
	
	// draw values (icon/border color, and icon graphic function)
	newBonus.iconColor = "#33CCFF"; // light blue icon/border
	newBonus.drawIcon = drawReflectiveShieldIcon; // icon to draw
	
	// activate function: this function gets called if/when the player
	//	collects the bonus, and applies the armor attachement to the player
	//	for the predetermined duration (this.duration)
	newBonus.activate = function(player){
        player.setShield(reflectiveShield(player), this.duration);
	}
	return newBonus;
}


// BONUS SYSTEM (bonus control system managed by Level)
function bonusSystem(){
	// array of all bonuses active in the game area
	this.bonuses = new Array();
	
	// if true, draws the timer bars above each bonus
	this.timerBarsEnabled = false;
	
	// create a new bonus, push it into the array, and return it
	this.createBonus = function(newBonus){
		this.bonuses.push(newBonus);
		return newBonus;
	}
	
    // create a +health bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createHealthBonus = function(x, y, lifeTime){
		return this.createBonus(healthBonus(x, y, lifeTime));
    }
    
    // create a tripple gun weapon bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createTrippleGunBonus = function(x, y, lifeTime){
		return this.createBonus(trippleGunBonus(x, y, lifeTime));
    }
    
    // create a disperse gun weapon bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createDisperseGunBonus = function(x, y, lifeTime){
		return this.createBonus(disperseGunBonus(x, y, lifeTime));
    }
    
	this.createLaserGunBonus = function(x, y, lifeTime){
		return this.createBonus(laserGunBonus(x, y, lifeTime));
	}
	
	this.createSuperLaserGunBonus = function(x, y, lifeTime){
		return this.createBonus(superLaserGunBonus(x, y, lifeTime));
	}
	
    // create an extra life bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createExtraLifeBonus = function(x, y, lifeTime){
		return this.createBonus(extraLifeBonus(x, y, lifeTime));
    }
    
    // create an armor shield bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createArmorShieldBonus = function(x, y, lifeTime){
		return this.createBonus(armorShieldBonus(x, y, lifeTime));
    }
    
    // create an absorb shield bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createReductionShieldBonus = function(x, y, lifeTime){
		return this.createBonus(reductionShieldBonus(x, y, lifeTime));
    }
    
    // create an reflective shield bonus in the given x, y location for the
    //  provided number of seconds (lifeTime)
    this.createReflectiveShieldBonus = function(x, y, lifeTime){
		return this.createBonus(reflectiveShieldBonus(x, y, lifeTime));
    }
	
	/* doesn't work so well if you do for example bonusSys["update"] it runs update function
	// reference dictionary of all create bonus functions by name
	this["health"] = this.createHealthBonus;
	this["tripple gun"] = this.createTrippleGunBonus;
	this["disperse gun"] = this.createDisperseGunBonus;
	this["laser gun"] = this.createLaserGunBonus;
	this["super laser gun"] = this.createSuperLaserGunBonus;
	this["extra life"] = this.createExtraLifeBonus;
	this["armor shield"] = this.createArmorShieldBonus;
	this["reduction shield"] = this.createReductionShieldBonus;
	this["reflective shield"] = this.createReflectiveShieldBonus;*/
	
	// create bonus function by dictionary reference
	this.createBonusByName = function(name, x, y, lifeTime){
		switch(name){
			case "heatlh":
				return this.createHealthBonus(x, y, lifeTime);
				break;
			case "tripple gun":
				return this.createTrippleGunBonus(x, y, lifeTime);
				break;
			case "disperse gun":
				return this.createDisperseGunBonus(x, y, lifeTime);
				break;
			case "laser gun":
				return this.createLaserGunBonus(x, y, lifeTime);
				break;
			case "super laser gun":
				return this.createSuperLaserGunBonus(x, y, lifeTime);
				break;
			case "extra life":
				return this.createExtraLifeBonus(x, y, lifeTime);
				break;
			case "armor shield":
				return this.createArmorShieldBonus(x, y, lifeTime);
				break;
			case "reduction shield":
				return this.createReductionShieldBonus(x, y, lifeTime);
				break;
			case "reflective shield":
				return this.createReflectiveShieldBonus(x, y, lifeTime);
				break;
			default: return false;
		}
	}
	
    
	// update function: check if all bonuses are alive (if not,
	//	remove them and do not continue to draw them).
	this.update = function(){
		for(var i=0; i<this.bonuses.length; i++){		
			// update all bonuses
			this.bonuses[i].update();
			// check if all bonuses are still alive. If not (that is, if
			//	their time-to-live expired), remove them from the game screen.
			if(!this.bonuses[i].isAlive()){
				this.bonuses.splice(i,1);
				i--;
			}
		}
	}
	
	// draw function: loop through and draw all active bonuses
	this.draw = function(ctx){
		for(var i=0; i<this.bonuses.length; i++){
			this.bonuses[i].draw(ctx);
			if(this.timerBarsEnabled)
				this.bonuses[i].drawTimerBar(ctx);
		}
	}
	
	// enable timer bars above bonuses to indicate how much time there is left on them
	this.toggleTimerBars = function(){
		this.timerBarsEnabled = !this.timerBarsEnabled;
	}
    
    // RESET: removes all active bonuses on the screen
    this.reset = function(){
        this.bonuses = new Array();
    }
}