/* File comments updated: Tuesday, June 5, 2012 at 7:46 PM
 *
 *  PLAYER WEAPON CLASS
 */
 

// WEAPON: a generic weapon attachement class used for the
//	player. By default, this class does nothing.
function weapon(unit){
	// which unit the weapon belongs to (e.g. Player)
    this.unit = unit;
    
	// animation of the weapon
    this.draw = function(ctx){}
    
	// shoot (adds bullets on triggering weapon fire)
	//	PARAMETER: ready is TRUE if the cooldown is up, and the gun is
	//	ready to fire. Most weapons will not fire if "ready" is false,
	//	but some, for example, lasers, will fire each frame.
    this.shoot = function(ready){}
	
	// TIMERS: used for the weapon icon's border to display how long
	//	until the weapon goes away
	// timer is at 100 (ratio in percentages)
	this.timer = 100;
	// timerDelta is how much to reduce the timer by each frame
	this.timerDelta = 0;
	// function to apply a duration to this weapon's timer
	this.setTimerDelta = function(duration){
		this.timerDelta = this.timer / secToFrames(duration);
	}
    
	// draw the icon (border and icon) on the screen as the weapon's
	//	icon visible to the player. This icon appears in the lower-left
	//	hand corner of the screen and displays the emblem of the active
	//	weapon. Each weapon should override the drawEmblem(ctx) function
	//	to correctly draw its own weapon.
	this.drawIcon = function(ctx){
		this.drawIconBorder(ctx);
		ctx.save();
		ctx.translate(19, contextHeight-17);
		this.drawEmblem(ctx);
		ctx.restore();
	}
	
	// This function draws the emblem of the active weapon onto the
	//	screen. The overridden needs only to call the correct draw
	//	icon function (most likely the same one used to draw the
	//	corresponding bonus, if exists).
	this.drawEmblem = function(ctx){
		// use this as an example for the drawEmblem function
		drawTrippleGunIcon(ctx);
	}

	// internal function used to draw the border surrounding the icon of the
	//	weapon. This function acts as the draw function as well as the update
	//	function for the timers simultaneously (so that the timers stop when the
	//	game is paused)
	this.iconAlpha = 0.6; // weapon icon border alpha
	this.iconAlphaDelta = -1.2/FPS; // when blinking, this is the rate of change of alpha
	this.drawIconBorder = function(ctx){
		ctx.save();
		
		// set the draw transparency to the current alpha value of the shield icon
		ctx.globalAlpha = this.iconAlpha;
		// if the current timer is within 5 seconds of expiring, update the alpha
		//	with the current alpha delta
		if(this.timerDelta*FPS*5 >= this.timer){
			// update alpha
			this.iconAlpha += this.iconAlphaDelta;
			// if alpha is less than 0.3 or more than 0.9, reverse the direction
			//	of the alhpa delta
			if(this.iconAlpha <= 0.3 || this.iconAlpha >= 0.9)
				this.iconAlphaDelta *= -1;
		}
		
		// set the width of the line for the border to 4 pixels
		ctx.lineWidth = 4;
		
		// fill in the background and draw the outline (timed)
        ctx.beginPath();
			// create the gradient that will act as the timer to switch between
			//		red (time remaining) and white (time spent)
			// 		the gradient is moved between the ratio of the timer (100 to 0)
			// create the gradient object between the start and end points:
			var gradient = ctx.createLinearGradient(0, contextHeight-40, 40, contextHeight);
			// check if timer is still > 0 (if not, set it to 0 to prevent errors)
			if(this.timer == 0)
				this.timer = 0;
			// set the gradient between the ratio sum
			gradient.addColorStop(0, "#FFFFFF");
			gradient.addColorStop(1-(this.timer/100), "#FFFFFF");
			gradient.addColorStop(1-(this.timer/100), "#FF0000");
			gradient.addColorStop(1, "#FF0000");
			ctx.strokeStyle = gradient; // set the stroke the be the gradient object
			
			// create the fill gradient (bright to dark coloring of the icon)
			//	going from the corner up towards the upper-left end of the icon
			var fillGrd = ctx.createLinearGradient(0, // inner x
												   contextHeight, // inner y
												   30, // outer x
												   contextHeight-30); // outer y
			fillGrd.addColorStop(0, "#001144"); // dark color
			fillGrd.addColorStop(1, "#00AACC"); // bright color
			ctx.fillStyle = fillGrd;//"#003366";
			
			// starting point
			ctx.moveTo(0, contextHeight-40);
			// line 1 (horizontal)
			ctx.lineTo(25, contextHeight-40);
			// line 2 (angled)
			ctx.lineTo(40, contextHeight-25);
			// line 3 (vertical)
			ctx.lineTo(40, contextHeight);
			ctx.stroke(); // draw the line
			// return to origin
			ctx.lineTo(0, contextHeight);
			ctx.fill(); // fill in the background
		ctx.closePath();
		
		ctx.restore();
	}
	
	// timer updates (to keep it independent of the animation)
	this.update = function(){
		// update the timer for next time
		if(this.timer > 0)
			this.timer-=this.timerDelta;
	}
}


// Basic Weapon: A standard one-bullet weapon with no
//	animation that fires from the top/middle of the unit.
// This weapon was designed for Player.
function basicWeapon(unit){
    var newWeapon = new weapon(unit);
    newWeapon.shoot = function(ready){
		// do nothing if the weapon cooldown is not ready
		if(!ready) return;
		
		// launch a single regular bullet from the front of the ship
        this.unit.bullets.push(playerBullet(this.unit.x, this.unit.y - 18, 10));
		// add a fire effect to the player
		/*this.unit.effectSys.addEffect(
			this.unit.effectSys.miniSpark(this.unit.x,
										  this.unit.y - 18,
										  Math.PI/2));*/
    }
	
	// this weapon does not have an icon... thus no icon
	//	will be on the screen for this weapon, and this is the
	//	override of the drawIcon function to do nothing.
	newWeapon.drawIcon = function(ctx){}
	
    return newWeapon;
}


// Tripple Gun: A more advanced weapon that fires three bullets:
//	the standard bullet (same as basic weapon) is fired from the front
//	of the ship, and two weaker bullets are fired from either side
//	in addition. This weapon has an added animation.
function trippleGun(unit){
    var newWeapon = new weapon(unit);
	// shoot: launch 3 bullets (1 central, and 2 side/weaker bullets)
    newWeapon.shoot = function(ready){
		// do nothing if the weapon cooldown is not ready
		if(!ready) return;
		
        this.unit.bullets.push(playerBullet(this.unit.x - 17, this.unit.y + 17, 5));
        this.unit.bullets.push(playerBullet(this.unit.x, this.unit.y - 18, 10));
        this.unit.bullets.push(playerBullet(this.unit.x + 17, this.unit.y + 17, 5));
    }
	// draw the two additional cannons on either side of the ship
    newWeapon.draw = function(ctx){
		ctx.drawImage(payerMassiveShip, -28, -18);
		/*
        ctx.lineWidth = 4;
        ctx.beginPath();
			var gradient = ctx.createLinearGradient(-15, 18, -15, 5);
			gradient.addColorStop(0, "rgb(230, 230, 230)");
			gradient.addColorStop(1, "rgb(255, 90, 0)");
			ctx.strokeStyle = gradient;
			ctx.moveTo(-15, 18);
			ctx.lineTo(-15, 5);
			ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
			var gradient = ctx.createLinearGradient(15, 18, 15, 5);
			gradient.addColorStop(0, "rgb(210, 210, 210)");
			gradient.addColorStop(1, "rgb(255, 90, 0)");
			ctx.strokeStyle = gradient;
			ctx.moveTo(15, 18);
			ctx.lineTo(15, 5);
			ctx.stroke();
        ctx.closePath();
		*/
    }
	// emblem that represents this weapon
	newWeapon.drawEmblem = function(ctx){
		drawTrippleGunIcon(ctx);
	}
    return newWeapon;
}


// Disperse Gun: A more advanced weapon that fires five bullets:
//	the standard bullet (same as basic weapon) is fired from the front
//	of the ship, and four weaker bullets are fired from either side
//	in addition. This is the same as Tripple Gun BUT the additional
//  bullets fire in angles to the side, and are significantly weaker.
//  This weapon has an added animation.
function disperseGun(unit){
    var newWeapon = new weapon(unit);
	// shoot: launch 3 bullets (1 central, and 2 side/weaker bullets)
    newWeapon.shoot = function(ready){
		// do nothing if the weapon cooldown is not ready
		if(!ready) return;
		
        this.unit.bullets.push(playerBullet(this.unit.x - 15, this.unit.y + 17, 2).setSpeedX(-5));
        this.unit.bullets.push(playerBullet(this.unit.x - 15, this.unit.y + 17, 3).setSpeedX(-2.5));
        this.unit.bullets.push(playerBullet(this.unit.x + 15, this.unit.y + 17, 3).setSpeedX(2.5));
        this.unit.bullets.push(playerBullet(this.unit.x + 15, this.unit.y + 17, 2).setSpeedX(5));
        this.unit.bullets.push(playerBullet(this.unit.x, this.unit.y - 18, 10));
    }
	// draw the two additional cannons on either side of the ship
    newWeapon.draw = function(ctx){
		ctx.lineWidth = 12;
        ctx.beginPath();
			var gradient = ctx.createLinearGradient(-10, 16, -18, 8);
			//gradient.addColorStop(0, "rgb(100, 186, 177)");
			//gradient.addColorStop(1, "rgb(255, 200, 0)");
			gradient.addColorStop(0, "rgb(255, 220, 220)");
			gradient.addColorStop(1, "rgb(270, 000, 020)");
			ctx.strokeStyle = gradient;
			ctx.moveTo(-10, 16);
			ctx.lineTo(-18, 8);
			ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
			var gradient = ctx.createLinearGradient(10, 16, 18, 8);
			gradient.addColorStop(0, "rgb(255, 220, 220)");
			gradient.addColorStop(1, "rgb(270, 000, 020)");
			ctx.strokeStyle = gradient;
			ctx.moveTo(10, 16);
			ctx.lineTo(18, 8);
			ctx.stroke();
        ctx.closePath();
    }
	// emblem that represents this weapon
	newWeapon.drawEmblem = function(ctx){
		drawDisperseGunIcon(ctx);
	}
    return newWeapon;
}


// Laser Gun: this is a LASER weapon, shooting at each frame (damage is scaled
//	by the framerate in the lasers class). This laser shoots at the closest enemy
//	within a 120 pixel radius of the center of the laser gun (on top of the player)
function laserGun(unit){
	var newWeapon = new weapon(unit);
	
	newWeapon.radius = 120; // radius that surrounds this weapon
	
	// fire whenever called (ignores the "ready" parameter)
	newWeapon.shoot = function(ready){
		// find closest enemy (if any) and fire at it
		var closestEnemy = null;
		for(var i=0; i<this.unit.enemySys.enemies.length; i++){
			// find the square distance of the enemy to the laser's origin point
			var enemyDist = (this.unit.enemySys.enemies[i].x - this.unit.x) *
							(this.unit.enemySys.enemies[i].x - this.unit.x)
							+
							((this.unit.enemySys.enemies[i].y+15) - (this.unit.y-18)) *
							((this.unit.enemySys.enemies[i].y+15) - (this.unit.y-18));
			if(enemyDist < this.radius*this.radius){
				if(closestEnemy == null || closestEnemy.distToPlayer > enemyDist){
					closestEnemy = this.unit.enemySys.enemies[i];
					closestEnemy.distToPlayer = enemyDist;
				}
			}
		}
		
		// if a closest enemy is found, fire a laser at it
		if(closestEnemy != null){
			//Get actual distance
			closestEnemy.distToPlayer = Math.sqrt(closestEnemy.distToPlayer);
			var laser = playerLaser(this.unit.x, this.unit.y-18,
				closestEnemy.x, closestEnemy.y, closestEnemy);
			this.unit.lasers.push(laser);
		}
	}
	
	// draw function: draw a radius around the laser to indicate to the player
	//	the laser's radius, and then draw the weapon graphic
	newWeapon.draw = function(ctx){
		// draw the radius circle
		ctx.strokeStyle = "#00FF00";
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
			ctx.arc(0, -18, this.radius, 0, 2*Math.PI, false);
			ctx.stroke();
		ctx.closePath();
		
		// draw attachement here
		ctx.lineWidth = 5;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#669966";
		ctx.beginPath();
			ctx.moveTo(0, -13);
			ctx.lineTo(0, -20);
			ctx.stroke();
		ctx.closePath();
	}
	
	newWeapon.drawEmblem = function(ctx){
		drawBasicLaserIcon(ctx);
	}
	
	return newWeapon;
}


// Super Laser Gun: this is a LASER weapon, shooting at each frame (damage is scaled
//	by the framerate in the lasers class). This laser shoots at ALL enemies
//	within a 120 pixel radius of the center of the laser gun (on top of the player)
function superLaserGun(unit){
	var newWeapon = new weapon(unit);
	
	newWeapon.radius = 120; // radius that surrounds this weapon
	
	// fire whenever called (ignores the "ready" parameter)
	newWeapon.shoot = function(ready){
		// find all enemies within range, and shoot at them
		for(var i=0; i<this.unit.enemySys.enemies.length; i++){
			// find the square distance of the enemy to the laser's origin point
			var enemyDist = (this.unit.enemySys.enemies[i].x - this.unit.x) *
							(this.unit.enemySys.enemies[i].x - this.unit.x)
							+
							((this.unit.enemySys.enemies[i].y+15) - (this.unit.y-18)) *
							((this.unit.enemySys.enemies[i].y+15) - (this.unit.y-18));
			
			if(enemyDist < this.radius*this.radius){
				var laser = playerLaser(this.unit.x, this.unit.y-18,
					this.unit.enemySys.enemies[i].x,
					this.unit.enemySys.enemies[i].y,
					this.unit.enemySys.enemies[i]);
				this.unit.lasers.push(laser);
			}
		}
	}
	
	
	
	// draw function: draw a radius around the laser to indicate to the player
	//	the laser's radius, and then draw the weapon graphic
	newWeapon.draw = function(ctx){
		// draw the radius circle
		ctx.strokeStyle = "#00FF00";
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
			ctx.arc(0, -18, this.radius, 0, 2*Math.PI, false);
			ctx.stroke();
		ctx.closePath();
		
		// draw attachement here
		ctx.lineWidth = 5;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#336699";
		ctx.beginPath();
			ctx.moveTo(0, -13);
			ctx.lineTo(0, -20);
			ctx.stroke();
		ctx.closePath();
	}
	
	newWeapon.drawEmblem = function(ctx){
		drawSuperLaserIcon(ctx);
	}
	
	return newWeapon;
}