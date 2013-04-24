/* File comments updated: Monday, May 28, 2012 at 5:25 PM
 *
 *  ENEMY CLASS
 */
 
 
 /* Main enemy constructor: sets up enemy with all necessary
  *    initial variables and internal functions.
  */
function enemy(x, y, angle, speed){
    //Default values
	x = typeof x !== 'undefined' ? x : 0;
    y = typeof y !== 'undefined' ? y : 0;
    angle = typeof angle !== 'undefined' ? angle : 0;
    speed = typeof speed !== 'undefined' ? speed : 0;
    
    // === Enemy variables==
    this.enemySys; //Will be set when enemy will be pass to addEnemy()
    this.id = 0; // Enemy unique id, will be set when enemy will be pass to addEnemy()
	// Parent of enemy
	this.parent;
	// Arrey of enemy parts
    this.parts = new Array();
	// x and y position (update regularly)
	// For part of enemy it is local coordinats
    this.x = x;
    this.y = y;
    // Orientation of enemy
    this.angle = angle;
	// speed/velocity values (x and y)
    this.speed = speed;
    this.speedX = speed*Math.cos(angle)*(30/FPS); // scaled speed by FPS
    this.speedY = speed* Math.sin(angle)*(30/FPS); // scaled speed by FPS
	
	// the normal speed of this enemy (in case speed is modified)
	this.normalSpeed = speed;
	
	// timer to reset the speed of this enemy to the normal speed after some time
	this.speedResetTimer = new Timer(-1);
	this.speedResetTimer.property = this;
	this.speedResetTimer.onTime = function(enmy){
            enmy.setSpeed(enmy.normalSpeed);
        };
    
	// modify the speed of this enemy for the given time (in seconds):
	this.modifySpeed = function(newSpeed, duration){
		this.setSpeed(newSpeed);
		this.speedResetTimer.set(secToFrames(duration));
	}
	
	// maximum health of enemy:
	this.maxHealth = 0;
	// current health of enemy:
    this.health = 0;
	// the amount of points this enemy gives for being killed:
    this.score = 0;
	// the weight of this enemy (weight is used to calculate crash damage)
	this.weight = 0;
	// how big this enemy is by height (y-dimension) - used to calculate display values
	this.height = 0; // 0 by default
	
	// name of the enemy (each enemy should have its own name)
	this.name = "Enemy";
    // Weapon object
    this.weapon = new noneWeapon();
    // Collision object (circle collision with radius 25)
    this.collision = new standardCollision(25);
    this.collision.parent = this;
	
	// true if the health bar should be displayed, false otherwise.
	//	This flag is controlled by the enemy system.
	this.displayHealthBar = false;
	
	// event function that is called when the enemy dies
	this.onDeathEvent = function(){}
	
	// Return global x coordinate of the enemy
    this.getX = function(){
        if(this.parent)
            return this.x+this.parent.getX();
        else
            return this.x;
    }
    // Return global y coordinate of the enemy
    this.getY = function(){
        if(this.parent)
            return this.y+this.parent.getY();
        else
            return this.y;
    }
    
	// Set oreintation of the enemy
    // If 'speed' of enemy not equal '0', it change direction of speed(speedX, speedY)
    this.setAngle = function(angle){
        this.angle = angle;
        if(this.speed!=0){
            this.speedX = this.speed*Math.cos(this.angle)*(30/FPS);
            this.speedY = this.speed*Math.sin(this.angle)*(30/FPS);
        }
        return this;
    }
	// Get oreintation of the enemy
    this.getAngle = function(){
        return this.angle;
    }
	
	//Set speed methods with correction on FPS
    this.setSpeedX = function(speedX){
        this.speedX = speedX * (30/FPS); // scaled speed by FPS;
        return this;
    }
    this.setSpeedY = function(speedY){
        this.speedY = speedY * (30/FPS); // scaled speed by FPS;
        return this;
    }
	// function set the speed of this enemy (calculates framerate conversions)
    this.setSpeed = function(speed){
        this.speed = speed;
        this.speedX = this.speed*Math.cos(this.angle)*(30/FPS);
        this.speedY = this.speed*Math.sin(this.angle)*(30/FPS);
        return this;
    }
	// Get x component of enemy speed
    this.getSpeedX = function(){
        return this.speedX / (30/FPS);
    }
	// Get y component of enemy speed
    this.getSpeedY = function(){
        return this.speedY / (30/FPS);
    }
	
    // Add part to enemy
    this.addPart = function(eny){
        this.parts.push(eny);
        eny.parent = this;
        return this;
    }
    
    // Return enemy part by it unique id
    this.getPartById = function(id){
        for(var i=0; i<this.parts.length; i++){
            if(this.parts[i].id = id)
                return this.parts[i];
        }
        return false;
    }
    // Add weapon, return weapon object
    this.addWeapon = function(weapon){
        weapon.shootTimer.property = this;
        this.weapon = weapon;
        return weapon;
    }
    // Add collision, return collision object
    this.addCollision = function(collision){
        collision.parent = this;
        this.collision = collision;
        return collision;
    }
    
    // Event called if this enemy leaves the screen (checked in update function)
	//	Empty by default, use to override events for each specific enemy
    this.onOutOfScreen = function(){}
    
	
	// UpdateEnemy is a generic function to be used for movement and other functionality
	//	of an enemy that is specific to that enemy. By default, this function simply
	//	updates the position of the enemy on the bases of the speedX and speedY variables,
	//	but it should be overridden for more complex enemy activity.
    this.updateEnemy = function(){
		// increase x and y values based on x and y velocities
        this.x += this.speedX;
        this.y += this.speedY;
    }
    
	// update: updates the x and y position of this enemy on the basis of
	//	its x and y speeds, and also updates its shoot interval, and if it
	//	is time to shoot, create a bullet.
    this.update = function(){
		// call the generic updateEnemy function (used by custom enemy classes for
		//	movement and other mechanisms)
        this.updateEnemy();
		
		// update the speed reset timer
		this.speedResetTimer.update();
        
		// update shoot interval, and fire a bullet if it's time to shoot it
		//	(if the timer to shoot timer ticks out)
		// NOTE: this can be replaced with a timer object set,
		//	and should probably be added into the specific enemy classes instead.
        this.weapon.update();
        
		// if enemy goes under the screen, call the outOfScreen event function
        if(!this.parent){
            if(this.y > areaHeight+30 || this.x<-30 || this.x > areaWidth+30 || this.y<-30){
                this.onOutOfScreen(); // function overriden in extended enemy classes
            }            
        }
    } 
    
	// OVERRIDE: This function should be specified in the specific
	//	enemy classes, but defined here nonetheless.
    this.draw = function(ctx){}
	
	// Function used to draw this enemy's health bar above it: this function only
	//	draws healthBars if the displayHealthBar value is toggled true
	this.drawHealthBar = function(ctx){
		if(this.displayHealthBar){
			ctx.save();
				ctx.beginPath();
					ctx.lineWidth = 1;
					//ctx.strokeStyle = "#CCFFCC";
					ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
					ctx.fillRect(this.getX() - 15, this.getY() - this.height/2,
						30*(this.health/this.maxHealth), 3);
					//ctx.rect(this.x - 15, this.y - 7, 30, 3);
					//ctx.stroke();
				ctx.closePath();
			ctx.restore();
		}
	}
    
	// apply the given amount of damage to the enemy
    this.applyDamage = function(dmg){
        this.health -= dmg;
        if(this.health < 0)
            this.health = 0;
    }
    
	// an effect that is created when this enemy dies
    this.deathEffect = function(){}
    
	// an effect that is created when this enemy is hit (by a bullet)
    this.hitEffect = function(x, y){}
	
	// an effect that is created when this enemy is burned (by a laser)
    this.burnEffect = function(x, y){}
    
	// returns TRUE if this enemy is not dead, FALSE if it is dead
    this.isAlive = function(){
        return this.health != 0;
    }
}

//======================================================================================
// ENEMY SYSTEM: this is the system incharge of managing, updating and drawing
//	enemies and all enemy bullets. This system, controlled by the level, tracks
//	all enemies and their actions throughout gameplay.
// Takes the player as a parameter.
function enemySystem(lvl){
	// reference to player for enemy targetting and AI
	this.lvl = lvl;
    this.currentID = 0;

	// array of all active enemies of all types
    this.enemies = new Array();
	// array of all active enemy bullet objects
    this.enemyBullets = new Array();
    // array of all active enemy missile objects
    this.enemyMissiles = new Array();
	// array of all active enemy laser objects
	this.enemyLasers = new Array();
    
    this.effectSys = new effectSystem();
	
	// variable to keep track of whether or not health bars are being displayed or not
	//	(other than just by mouseover)
	this.showingHealthBars = false;
    
	// add an enemy to this system (to the enemies array) and return
	//	the enemy just added
    this.addEnemy = function(enemy){
        this.currentID++;
        enemy.enemySys = this;
        enemy.id = this.currentID;
		// if health bars are showing, toggle this enemy with health bar display
		if(this.showingHealthBars)
			enemy.displayHealthBar = true;
		
		this.enemies.push(enemy);
		//Add all parts of enemy to enemy system
		for(var i=0; i<enemy.parts.length;i++)
            this.addEnemy(enemy.parts[i]);
        return enemy;
    }
    // Get enemy object by id
    this.getEnemyById = function(id){
        for(var i=0; i<this.enemies.length; i++){
            if(this.enemies[i].id = id)
                return this.enemies[i];
        }
        return false;
    }
    // Delete enemy and its parts from enemy system, return deleted enemy
    // with preserved parts
    this.deleteEnemyById = function(id){
        for(var i=0; i<this.enemies.length; i++){
			/* Note: mistakes:
			*	1) the "if" didn't have { }, so it deleted every enemy
			*	2) it was this.enemies[i].id = id, instead of "==", so again
			*		it deleted every enemy
			 */
            if(this.enemies[i].id == id){
                var enemy = this.enemies[i];
                this.enemies.splice(i,1);
                for(var j = 0; j < enemy.parts.length; j++){
                    this.deleteEnemyById(enemy.parts[j].id);
                }           
                return enemy
			}
        }
        return false;
    }
    // delete the enemy and its parts from the enemies array at the given index.
    // return delited enemy with preserved parts
    this.deleteEnemy = function(i){
        var enemy = this.enemies[i];
        if(enemy){
            this.enemies.splice(i,1);
            for(var j = 0; j < enemy.parts.length; j++){
                this.deleteEnemyById(enemy.parts[j].id);
            }
            return enemy;
        }else{
            return false;
        }
    }
    
	// creates and returns a new (generic) enemy on the screen at a
	//	random position just above the top of the screen (that is, random
	//	x position). It also adds that enemy into the array.
    this.createEnemy = function(){
        var newEnemy = basicEnemy(
            getRandNum(areaWidth - 60) + 30, // X coordinate
            -30, // Y coordinate
            Math.PI/2, // Angle
            getRandNum(3)+1 // Speed
        );
		// if health bars are showing, toggle this enemy with health bar display
		if(this.showingHealthBars)
			newEnemy.displayHealthBar = true;
        this.addEnemy(newEnemy);
        return newEnemy;
    }

	// add a bullet to the array of bullets in this enemy system
    this.addBullet = function(bullet){
        this.enemyBullets.push(bullet);
        return this;
    }
    
    // add a missile to the array of missiles in this enemy system
    this.addMissile = function(missile){
        this.enemyMissiles.push(missile);
        return this;
    }
    
    // add a laser instance to the array of lasers in this enemy system
    this.addLaser= function(laser){
        this.enemyLasers.push(laser);
        return this;
    }
    
	// update function: update ALL enemies and enemy bullets.
    this.update = function(){
        // update all enemies
        for(var i=0; i<this.enemies.length; i++){
            this.enemies[i].update();
        }
		// update all bullets
        for(var i=0; i<this.enemyBullets.length; i++){
            this.enemyBullets[i].update();
        }
        // check if bullets go off screen
        for(var i=0; i<this.enemyBullets.length; i++){
            // check if bullets go off screen
            if(	this.enemyBullets[i].y > areaHeight ||
				this.enemyBullets[i].y < 0 ||
				this.enemyBullets[i].x > areaWidth ||
				this.enemyBullets[i].x < 0){
                this.enemyBullets.splice(i, 1);
                i--;
                continue;
            }
        }
        // update all enemy missiles
        for(var i=0; i<this.enemyMissiles.length; i++){
            this.enemyMissiles[i].update();
            // if dead, remove it
            if(!this.enemyMissiles[i].isAlive()){
                this.enemyMissiles.splice(i, 1);
                i--;
            }
        }
		// update all enemy lasers (toggle inactive if active, else delete if
		//	already inactive
		for(var i=0; i<this.enemyLasers.length; i++){
			// if active, toggle inactive
			if(this.enemyLasers[i].active){
				this.enemyLasers[i].active = false;
			}
			// otherwise, it's inactive so delete
			else{
				this.enemyLasers.splice(i, 1);
				i--;
			}
		}
    }
	
	// draw function: draw all enemies and bullets on the screen
	//	in their immediate x and y positions.
    this.draw = function(ctx){
		// draw all enemies
        for(var i=0; i<this.enemies.length; i++){
            this.enemies[i].draw(ctx);
			this.enemies[i].drawHealthBar(ctx);
        }
		// draw all enemy bullets
        for(var i=0; i<this.enemyBullets.length; i++){
            this.enemyBullets[i].draw(ctx);
        }
        // draw all enemy missiles
        for(var i=0; i<this.enemyMissiles.length; i++){
            this.enemyMissiles[i].draw(ctx);
        }
		// draw all of enemy lasers
		for(var i=0; i<this.enemyLasers.length; i++){
			this.enemyLasers[i].draw(ctx);
		}
        // update and draw the active effects from all enemies
        this.effectSys.update();
        this.effectSys.draw(ctx);
    }
    
	// mouseover function: called by level if mouse is moved, and determins whether or not
	//	an enemy is intersecting with the mouse pointer.
	// If enemy is intersecting, toggle to display its health bar, otherwise do not
	//	display its health bar
	this.mouseOver = function(x, y){
		// if health bars are not already being shown anyway
		if(!this.showingHealthBars){
			// check mouseover of all enemies
			for(var i=0; i<this.enemies.length; i++){
				// set the health bar flag to true if the enemy interescts the mouse
				//	coordinates, and false otherwise
				//this.enemies[i].displayHealthBar = this.enemies[i].intersects(x, y);
			}
		}
	}
	
	// function to toggle all health bars (on or off: switches the mode)
	this.toggleHealthBars = function(){
		if(this.showingHealthBars)
			this.hideHealthBars();
		else
			this.showHealthBars();
	}
	
	// function call to force all enemies on the screen to display health bars
	this.showHealthBars = function(){
		for(var i=0; i<this.enemies.length; i++){
			this.enemies[i].displayHealthBar = true;
		}
		// toggle showing health bars variable as true
		//	(this is used by the mouseOver function)
		this.showingHealthBars = true;
	}
	
	// function call to force all enemies on the screen to hide health bars
	this.hideHealthBars = function(){
		for(var i=0; i<this.enemies.length; i++){
			this.enemies[i].displayHealthBar = false;
		}
		// toggle showing health bars variable as false
		//	(this is used by the mouseOver function)
		this.showingHealthBars = false;
	}
	
	// add an effect to the enemy system's effect system
    this.addEffect = function(effect){
        this.effectSys.addEffect(effect);
    }
    
    // RESET: removes all enemies and enemy bullets, missiles and lasers
    this.reset = function(){
        this.enemies = new Array();
        this.enemyBullets = new Array();
		this.enemyLasers = new Array();
    }
}