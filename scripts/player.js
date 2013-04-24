/* File comments updated: Friday, May 11, 2012 at 9:49 PM
 *
 *  PLAYER CLASS
 */
 

/* Main player constructor: sets up player with all necessary
 *    initial variables.
 */
function player(){
	// reference to the level's enemy system (for weapon targetting)
	this.enemySys = null;

    // player variables
    this.x = areaWidth / 2;
    this.y = areaHeight - 30;
    this.r = 17; //Radius of collision
	
	// score, health, life data
    this.score = 0;
    this.health = 100;
    this.lives = 2;
	
	// animation and movement variables
    this.balance = 0;
    this.speed = 5 * (30/FPS);
    this.speedX = 0;
    this.speedY = 0;
    
	// effect system for player: contains all effects,
	//	primarily the ship's rocket fire particle system.
    this.effectSys = new effectSystem();
    
	// all bullets associated with the player
    this.bullets = new Array();
	// all lasers associated with the player
	this.lasers = new Array();
	// standard bullet speed
    this.maxBulletSpeed = secToFrames(0.2);
    this.nextShotTime = 0;
	
	this.invulnerable = false;
	
	// Get X
	this.getX = function(){
		return this.x;
	}
	// Get Y
	this.getY = function(){
		return this.y;
	}
    /*************** PLAYER WEAPON VARIABLES ***************/
	// weapon (defaults to basic weapon) and may be changed
	//	by bonuses
    this.weapon = basicWeapon(this);//basicWeapon(this);
	// when weaponTimer expires, switch back to default weapon
    //  -1 means timer defaults to expired, so it doesn't execute right away
    this.weaponTimer = new Timer(-1);
    this.weaponTimer.property = this;
	// switch to basic weapon when timer expires
    this.weaponTimer.onTime = function(player){
            player.weapon = basicWeapon(player);
        };
    
    /*************** PLAYER SHIELD VARIABLES ***************/
    // the active shield (by default none) and may be changed by
    //  bonuses
    this.shield = noShield(this);
    // when shieldTimer expires, switch back to default (none) shield
    //  -1 means timer defaults to expired, so it doesn't execute right away
    this.shieldTimer = new Timer(-1);
    this.shieldTimer.property = this;
    // switch to default shield (none) when timer expires
    this.shieldTimer.onTime = function(player){
            player.shield = noShield(this);
        };
	// Collision object
    this.collision = new standardCollision(25);
	this.collision.parent = this;
	this.collision.addObject(new cTriangle({x:-15,y:17},{x:0,y:-18},{x:15,y:17}));
	//this.collision.addObject(new cCircle({x:0,y:0}, 10));

	// update function (player position based on keys currently held down,
	//	and weapons)
    this.update = function(){
		// update the weapon timer
        this.weaponTimer.update();
        
        // update the shield timer
        this.shieldTimer.update();
		
		// update weapon and shield animation timers
        this.weapon.update();
		this.shield.update();
    
	
		/*************** LEFT-RIGHT MOVEMENT ***************/
		
        // if LEFT button is pressed
        if(keyLeftDown){
			// increasingly decrement x-velocity when moving left as long as max
			//	left (negative) speed is not surpassed
            if(this.speedX > -1*this.speed)
                this.speedX = this.speedX - (this.speed / 10);
        }
		
		// if LEFT button is RELEASED and ship is still moving left,
		//	increment speed steadily to reach 0 (equilibrium)
        else if(this.speedX < 0){
            this.speedX = 0;//this.speedX + (this.speed / 50);
        }
        
		// if RIGHT button is pressed
        if(keyRightDown){
			// increasingly increment x-velocity when moving right as long as max
			//	right (positive) speed is not surpassed.
            if(this.speedX < this.speed)
                this.speedX = this.speedX + (this.speed / 10);
        }
		
		// if RIGHT button is RELEASED and ship is still moving right,
		//	decrement speed steadily to reach 0 (equilibrium)
        else if(this.speedX > 0){
            this.speedX = 0;//this.speedX - (this.speed / 50);
        }
		
		// if NEITHER left nor right buttons are pressed, the speed must be 0 (to prevent
		//	the ship from moving when the player isn't controlling it)
        if(!keyLeftDown && !keyRightDown)
            this.speedX=0;
        
		// update x-position by the above-calculated x-velocity
        this.x += this.speedX;
		
		// if ship is out of bounds of the screen, reset position to be within bounts
        if(this.x > areaWidth - 15){
            this.x = areaWidth - 15;
            this.speedX = 0;
        }
		else if(this.x < 15){
            this.x = 15;
            this.speedX = 0;
        }
		
		
        /*************** UP-DOWN MOVEMENT ***************/
		
        // if UP key is pressed
        if(keyUpDown){
			// increasingly decrement y-velocity when moving up as long as max
			//	up (negative) speed is not surpassed
            if(this.speedY > -1*this.speed)
                this.speedY = this.speedY - (this.speed / 10);
        }
		
		// if UP button is RELEASED and ship is still moving up,
		//	steadily add velocity back to reach 0 again (equilibrium)
        else if(this.speedY < 0){
            this.speedY = 0;//this.speedY + (this.speed / 50);
        }
        
		// if DOWN key is pressed
        if(keyDownDown){
			// increasingly increment y-velocity when moving down as long as max
			//	down (positive) speed is not surpassed
            if(this.speedY < this.speed)
                this.speedY = this.speedY + (this.speed / 10);
        }
		
		// if DOWN key is RELEASED and ship is still moving down,
		//	steadily reduce velocity back to 0 again (equilibrium)
        else if(this.speedY > 0){
            this.speedY = 0;//this.speedY - (this.speed / 50);
        }
        
		// if NEITHER up nor down are pressed, speed must be 0 (to prevent
		//	the ship from moving when the player isn't controlling it)
        if(!keyUpDown && !keyDownDown)
            this.speedY=0;
        
		// update the y-position with the above-calculated y-velocity
        this.y += this.speedY;
		
		// if ship is out of bounds of the canvas, reset its position so that it is
		//	within bounds again
        if(this.y > areaHeight - 17){
            this.y = areaHeight - 17;
            this.speedX = 0;
        }
		else if(this.y < 30){
            this.y = 30;
            this.speedX = 0;
        }
        
        
        // update the rocket fire effect (add a new particle set for each frame to
		//	simulate a rocket fire effect using the particle system)
        this.effectSys.addEffect(
			// add new effect
            this.effectSys.shipRocketFire(
                this.x, // at ship's x-position (center)
                this.y + 14, // y+14 is slightly below the ship (where a rocket engine would be)
				this.speedY < 0)); // speedY < 0 is TRUE only when the ship is moving UP
        
		// update all effects
        this.effectSys.update();
        
		
		/*************** SHOOT MECHANISM ***************/
		
        // if SHOOT BUTTON is pushed, use the timer system to identify and
		//	launch a new bullet when appropriate (there is a timer delay)
        if(keyShootDown){
			// call the shoot function on the weapon, but the parameter will only be
			//	TRUE if it's time to shoot. Some weapons ignore cooldown time, but
			//	most will not fire if the value passed in is false.
            this.weapon.shoot(this.nextShotTime <= gameTime);
			// update next shoot timer if it needs to update
			if(this.nextShotTime <= gameTime){
				this.nextShotTime = gameTime + this.maxBulletSpeed;
			}
        }
        
        // update all player bullets
        for(var i=0; i<this.bullets.length; i++){
            this.bullets[i].update();

            // check if bullet is off screen
            if(this.bullets[i].y < 0){
				// if it is off screen, delete it
                this.bullets.splice(i, 1);
                i--;
                continue;
            }
        }
		
		// update all player lasers (toggle inactive if active, else delete if
		//	already inactive
		for(var i=0; i<this.lasers.length; i++){
			// if active, toggle inactive
			if(this.lasers[i].active){
				this.lasers[i].active = false;
			}
			// otherwise, it's inactive so delete
			else{
				this.lasers.splice(i, 1);
				i--;
			}
		}
    }
    
    
	// draw function: draws the player ship on the canvas
	//	in the x and y positions indicated by the current
	//	this.x and this.y positions. This contains all data
	//	that renders how the ship looks on screen. This is drawn relative
	//	to the game area. The parameter should be the AREA CONTEXT if
	//	the area is different from the actual screen context.
    this.draw = function(ctx){
		ctx.save();
		
		// draw all of player's bullets
		for(var i=0; i<this.bullets.length; i++){
			this.bullets[i].draw(ctx);
		}
		
		// draw all of player's lasers
		for(var i=0; i<this.lasers.length; i++){
			this.lasers[i].draw(ctx);
		}
		
		/*************** DRAW THE PLAYER SHIP ***************/
		
		// (only draw it if the player is alive)
		if(this.isAlive()){
			// save the context and start drawing this specific ship
			ctx.save();
			ctx.translate(this.x, this.y);
			
			// draw the ship image
			ctx.drawImage(gameImgs.get("payerBaseShip"), -12, -18);
			//-------------------------------
			/*
			ctx.strokeStyle = "#FF00FF";
			ctx.beginPath();
			ctx.arc(0, 0, 25,0,Math.PI*2,true);
			ctx.closePath();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(-15, 17);
			ctx.lineTo(0, -18);
			ctx.lineTo(15, 17);
			ctx.closePath();
			ctx.stroke();
			*/
			//-------------------------------
			
			// draw the currently active weapon
			this.weapon.draw(ctx);
			
			// draw the currently active shield
			this.shield.draw(ctx);
			
			ctx.restore();
		}
		
		// draw all of the effects (e.g. rocket fire)
        this.effectSys.draw(ctx);
		
        ctx.restore();
	}
	
	// draw GUI function: draws the GUI components of the player, including
	//	the health bar, score and indicator icons. This is drawn relative to
	//	the screen exactly. The parameter should be the MAIN CANVAS CONTEXT.
	this.drawGUI = function(ctx){
		/*************** DRAW THE PLAYER GUI ***************/
		
		// if health is low, draw a red warning color on the screen
		if(this.health <= 30){
			ctx.save();
				// set up the gradient (center to edge of decreasingly
				//	transparent red coloring)
				var grd = ctx.createRadialGradient(
						contextWidth/2, // inner x (center of screen)
						contextHeight/2, // inner y (center of screen)
						0, // inner radius (staring at 0, center)
						contextWidth/2, // outer x (center of screen as well)
						contextHeight/2, // outer y (center of screen as well)
						contextWidth/2); // outer radius: half of screen width
				grd.addColorStop(0, "rgba(255, 0, 0, 0)"); // inner color (transparent)
				grd.addColorStop(1, "rgba(255, 0, 0, 0.4)"); // outer color (faded red)
				ctx.fillStyle = grd;
				ctx.fillRect(0, 0, contextWidth, contextHeight);
			ctx.restore();
		}
        
        ctx.save();
		
        // draw the health bar
        ctx.fillStyle = "rgba(255, 102, 102, 0.7)";
        ctx.strokeStyle = "#CCFFCC";
		ctx.lineWidth = 2;
        ctx.fillRect(contextWidth-250, 15,
            235 * (this.health / 100), 15);
        ctx.strokeRect(contextWidth-250, 15, 235, 15);
        
        // draw the texts (health and score)
        ctx.fillStyle = "#CCFFCC"; // text color
        ctx.font = "10pt MainFont"; // text font/size for health
        var healthText = "Health: " + Math.round(this.health) + "%";
        var textWidth = ctx.measureText(healthText).width;
        // draw health text (in the center of health bar):
		ctx.fillText(healthText,
            contextWidth-250 + 117 - textWidth/2, // x-pos
            27); // y-pos
        
        ctx.font = "18pt MainFont"; // text font/size for score
        // draw score text (upper-left corner of screen)
        ctx.fillText("" + this.score,
            15, 28); // x, y pos
        
		// display the number of lives player has remaining
		ctx.save();
		// set color and alpha to same as the healthbar's color
		ctx.fillStyle = "rgba(255, 102, 102, 0.7)";
		// hearthDim is the "size" of the heart (scale). 2 is small.
		var heartDim = 2;
		// heartX is where the hearts start (from the left)
		//	screen width minus 37:
		//	37 comes from the following factors:
		//		the healthbar is offset from the right edge of the screen by +15
		//		the hearts are separated by 21 pixels and there is room for
		//			10 hearts (21 * 10 = 210)
		//		the healthbar is 235 pixels wide, leaving an offest of 235-210 = 25
		//		taking half of the offset from either side, we get +12.5 offset from the right
		//		the hearts are 10 pixels wide, so we leave room for +10 pixels.
		//		10 + 15 + 12.5 = 37.5 ; we round down to 37.
		var heartX = contextWidth - 37;
		// heartY is simply a good y-position under the healthbar.
		var heartY = 45;
		//currentLevel.player.lives = 10;
		for(var i=0; i<this.lives; i++){
			// draw the filled heart shape using bezierCurve algorithm
			ctx.beginPath();		
			ctx.moveTo(0*heartDim + heartX, -2*heartDim + heartY);
			ctx.bezierCurveTo(-4*heartDim + heartX, -5*heartDim + heartY, -5*heartDim + heartX,
				1*heartDim + heartY, 0*heartDim + heartX, 4*heartDim + heartY);
			ctx.bezierCurveTo(5*heartDim + heartX, 1*heartDim + heartY, 4*heartDim + heartX,
				-5*heartDim + heartY, 0*heartDim + heartX, -2*heartDim + heartY);
			ctx.closePath();
			ctx.fill();
			// move next heart over by 21 pixels to the left
			heartX -= 21;
		}
		ctx.restore();
		
        ctx.fillText("Lives: " + this.lives,
            150, 28); // x, y pos
        
		// restore the context to its original state
        ctx.restore();
        
		// draw the icons (if any) of the active sheild and weapon:
		//	these icons display on the bottom corners of the screen to indicate
		//	active shields/weapons and their timers
		this.weapon.drawIcon(ctx);
		this.shield.drawIcon(ctx);
    }
    
	
	// apply damage: the given dmg value is subtracted from the
	//	player's health pool. If player's health is below 0, it is
	//	automatically reset to 0 (it can't be negative)
    this.applyDamage = function(dmg){
		// if player is flagged as invulnerable (can't be damaged), do nothing
		if(this.invulnerable)
			return "Immune";
		// otherwise, apply damage normally
        this.health -= dmg;
        if(this.health<0)
            this.health=0;
        return dmg;
    }
    
    // specific damage application: apply damage from a bullet, filtered by the active shield,
    //  hitting the player. Also generates a particle effect when hit.
	// returns a STRING (can be in the form of a number) of the damage applied
	//	and, if applicable, any damage alteration effect text (provided by
	//	individual shields)
    this.applyBulletDamage = function(bullet){
		// process the bullet's damage through the shield, and get
		//	the damage returned after shield is applied
		var dmg = this.applyDamage(this.shield.absorb(bullet));
		
		// set applied damage variable into the bullet to preserve it:
		//	this function will allow for more dynamic level design, including
		//	special event or achievement tracking.
		// Applied damage is the actual damage applied to the player after all
		//	calculations, including shield absorbtion, etc.
		bullet.appliedDamage = dmg;
		
		// create the particle effect of being hit by the bullet
		var angle; // find the correct angle of impact
		if(bullet.x > this.x)
			angle = -Math.PI/3;
		else if(bullet.x < this.x)
			angle = -(2*Math.PI)/3;
		else
			angle = -(3*Math.PI)/2;
		// add the effect
		this.effectSys.addEffect(this.effectSys.basicRedSpark( // add a red spark
                bullet.x, bullet.y, // create it at the bullet's x, y position
				angle)); 
		
		// if the damage was altered by the shield and the shield has
		//	action text associated with it, add the action text to the
		//	damage string; return the damage string
		if(dmg != bullet.damage && this.shield.actionText != ""){
			return ("" + bullet.damage + " (" + this.shield.actionText + ")");
		}
		else
			return dmg;
    }
	
	// apply damage from an enemy laser
	this.applyLaserDamage = function(laser){
		// apply damage (after shield absorbtion)
		this.applyDamage(this.shield.absorb(laser));
		// add the effect
		this.effectSys.addEffect(this.effectSys.basicBurnEffect(laser.x, laser.y));
	}
    
    // specific damage application: apply damage from a crash
    //  into another enemy (this is usually larger damage)
    this.applyCrashDamage = function(enemy){
		// set this enemy to apply 50 damage
        enemy.damage = enemy.weight;
		// apply the damage after filtering it through the shield
		var dmg = this.applyDamage(this.shield.absorb(enemy));
		
		// if the damage was altered by the shield and the shield has
		//	action text associated with it, add the action text to the
		//	damage string; return the damage string
		if(dmg != enemy.damage && this.shield.actionText != ""){
			return ("" + enemy.damage + " (" + this.shield.actionText + ")");
		}
		else
			return dmg;
    }
	
	// add health to the player. If player health exceeds 100,
	//	it is reset to 100 (it cannot surpass 100 hp).
    this.addHealth = function(hp){
        this.health += hp;
        if(this.health>100)
            this.health=100;
    }
    
	// set the player's current weapon to the given weapon object
	//	for the duration (given in SECONDS). When duration expires,
	//	the weapon is again reset to the predetermined default
	//	weapon.
    this.setWeapon = function(newWeapon, duration){
        this.weapon = newWeapon; // set the weapon to player ship
		// set the weapon's duration (for its own display use):
		newWeapon.setTimerDelta(duration);
		// set the weapon's duration timer in player to remove when
		//	duration runs out:
        this.weaponTimer.set(secToFrames(duration));
    }
    
    // set the player's current shield to the new shield provided.
    //  If duration is 0, this shield will last only until it is
    //  destroyed. Otherwise, it will last until it is destroyed
    //  or until the duration (in seconds) runs out, whichever comes first.
    this.setShield = function(newShield, duration){
        // if duration is greater than 0, set the shield's duration
        //  to whatever was passed in.
        if(duration > 0){
			// set the border animation timer for shield icon:
			newShield.setTimerDelta(duration);
			// set the timer for shield removal:
            this.shieldTimer.set(secToFrames(duration));
        }
        else{
            this.shieldTimer.set(-1);
        }
        this.shield = newShield;
    }
    
    // increase the player's number of lives by one
    this.addLife = function(){
        this.lives++;
    }
    
	// returns TRUE if the player is dead; that is, if the player's health
	//	is 0.
    this.isAlive = function(){
        return (this.health > 0);
    }
    
    
    // RESET FUNCTION: reset the player to a default position after the player
    //  dies and loses a life. How sad.
    this.reset = function(){
        // score penalty for reset (dying)
        this.score = Math.ceil(this.score*0.9);
        
        // reset weapons and bullets/lasers
        this.weapon = basicWeapon(this);
        this.bullets = new Array();
		this.lasers = new Array();
        
        // reset shield
        this.shield = noShield(this);
        
        // reset position of the player
        this.x = areaWidth / 2;
        this.y = areaHeight - 30;
        
        // reset player movement speeds (stop moving!)
        this.speedX = 0;
        this.speedY = 0;
        
        // reset lives and health (1 less life, 100 health)
        this.lives--;
        this.health = 100;
    }
}
