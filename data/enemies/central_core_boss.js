// ARMORED BASE ENEMY

// the core is the center of the boss, and controls the other enemies
//  (the shield fragments) around it. All fragments report events to the core.
function centralCommandCore(x, y){
	// create at x, y position, 0 angle, 0 speed
	var newEnemy = new enemy(x, y, 0, 0);
	
	// this enemy dies in 1 normal hit
	newEnemy.maxHealth = 10;
	newEnemy.health = 10;
	newEnemy.score = 1000;
	newEnemy.name = "Base Command Core";
	newEnemy.weight = 200; // does 200 damage if player crashes into it
	newEnemy.height = 0; // health bar displayed at center
    
    // immune in the beginning to prevent accidental destruction before
    //  the boss is fully setup
    newEnemy.immune = true;
    
    // damage values (use to balance the damage)
    //  standard turret bullet damage:
    newEnemy.basicBulletDamage = 10;
    //  special ability damage:
    newEnemy.bulletStreamDamage = 20;
    newEnemy.bulletDisperseDamage = 20;
    newEnemy.nukeDamage = 100;
    newEnemy.nukeRadius = 30;
    //  layer destruction AOE damage
    newEnemy.layerBreakDisperseDamage = 20;
    
    // override applyDamage function to prevent any damange when immune
    newEnemy.applyDamage = function(dmg){
        if(this.immune)
            return;
        
        this.health -= dmg;
        if(this.health < 0)
            this.health = 0;
    }
    
	// add a very dark gradient color
	newEnemy.grd = context.createRadialGradient(0, 0, 0, 0, 0, 30);
	newEnemy.grd.addColorStop(0, "#000000");// inner
	newEnemy.grd.addColorStop(1, "#000015");// outer
    
	
    // angle of the turret - updated as attacks occur
    newEnemy.turretAngle = Math.PI/2; // initially facing down
    
    // when enabled, allow fireing of the standard bullet (disabled when
    //  the turret is being used for something else)
    newEnemy.turretEnabled = true;
    
    // the maximum speed at which the turret can rotate when following
    //  the player
    newEnemy.maxTurretRotateDelta = (Math.PI/8)/FPS;
    
    
    // override the update function to include updating the turret
    //  position when possible
    newEnemy.update = function(){
        // call updateEnemy function
        this.updateEnemy();
        
        // update turret IF turret is enabled to follow the player
        if(this.turretEnabled){
            // find the desired angle
            var distX = this.enemySys.lvl.player.x - this.getX();
            var distY = this.enemySys.lvl.player.y - this.getY();
            //var desiredAngle = Math.atan2(distY, distX);
            var desiredAngle = Math.atan(distY/distX);
            // if X is negative, the coordinates reset, so add one half-circle
            if(distX < 0)
                desiredAngle += Math.PI;
            //alert(desiredAngle*180/Math.PI);
            
            // adjust the angle of the turret by the appropriate sum, or
            //  less if the player is within range of a rotation interval
            // if player is within range, just set the angle to the desired angle
            if(Math.abs(this.turretAngle - desiredAngle) < this.maxTurretRotateDelta)
                this.turretAngle = desiredAngle
            // otherwise check whether to increase or decrease by the delta
            else if(this.turretAngle < desiredAngle)
                this.turretAngle += this.maxTurretRotateDelta;
            else
                this.turretAngle -= this.maxTurretRotateDelta;
        }
		
		// if dead, start the death event
		if(this.health <= 0){
			this.deathEvent();
			// now remove the deathEvent function so it doesn't get called again
			this.deathEvent = function(){}
		}
    }
	
	// draw function: draw a gradient dark core of the enemy
	newEnemy.draw = function(ctx){
		ctx.save();
		
		ctx.fillStyle = this.grd;
		ctx.beginPath();
		ctx.arc(this.getX(), this.getY(), 30, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#003030";
		ctx.stroke();
		ctx.closePath();
        
        // draw the bullet turret
        ctx.translate(this.getX(), this.getY());
        ctx.rotate(this.turretAngle);
        ctx.drawImage(gameImgs.get("smallTower"), -13, -13);
		
		ctx.restore();
	}
	
    // keeps track of which the current direction is (can be used for special attacks
    //  at different positions
    newEnemy.curDirection = 0; // standards, 0-3 rotated positions by 45 degrees
    
    // keeps track of how many of the shield pieces died at this position
    //  (reset during a rotation)
    newEnemy.fragmentDeathStreak = 0;
    
    // an event called by each individual fragment when it dies. The
    //  fragment reports the layer that it died on. This function rotates
    //  the boss to mitigate incoming damage by using all areas of the shield.
    newEnemy.registerPartDeath = function(layer){
        // if the fragment killed is the low level (first away from the core),
        //  activate a special ability and rotate
        if(layer == 0){
            // activate 1st layer ability: dispatch an area effect of bullets that
            //  almost unavoidably strike the player for 20 damage.
            for(var i=0; i<80; i++){
				// x y angle speed dmg color size
				var bullet = enemyBullet(
					Math.cos(Math.PI/40*i)*20,
					Math.sin(Math.PI/40*i)*20,
					(Math.PI/40*i),
					8, this.layerBreakDisperseDamage,
					"#007070");
				
				translatePoint(bullet, this.getX(), this.getY());
				this.enemySys.addBullet(bullet);
			}
			
			// launch a giant blast wave that causes all player bullets to be reflected:
			// reflect all of player's bullets
			for(var i=0; i<this.enemySys.lvl.player.bullets.length; i++){
				// insert the bullet into the enemy system's bullets
				this.enemySys.addBullet(this.enemySys.lvl.player.bullets[i]);
				// reverse the bullet's direction
				this.enemySys.lvl.player.bullets[i].speedX *= -1;
				this.enemySys.lvl.player.bullets[i].speedY *= -1;
				// remove the bullet from the player bullet array
				this.enemySys.lvl.player.bullets.splice(i, 1);
				i--;
			}
			// create the effect
			this.enemySys.addEffect(this.enemySys.effectSys.giantBlastWave(this.getX(), this.getY()));
            
            // rotate if not already rotating (-1 means rotations are locked)
            if(this.fragmentDeathStreak != -1)
                this.rotateToNextPosition();
        }
        
        // if death streak is -1, the rotation is temporarily locked, so return
        //  and do nothing
        else if(this.fragmentDeathStreak == -1)
            return;
        
        // if second layer from the core, just rotate around immediately
        else if(layer == 1){
            this.rotateToNextPosition();
        }
        
        // otherwise, increment the streak counter, and check if it's time
        //  to rotate anyway
        else{
            this.fragmentDeathStreak++;
            // if the deathStreak is at 4 or more, it's time to rotate
            if(this.fragmentDeathStreak >= 4){
                this.rotateToNextPosition();
            }
        }
    }
    
    // current angle (in radians) of the enemy - 0 is default, 2PI is full rotation
    newEnemy.curAngle = 0;
    // amount to rotate by per frame when the boss is rotation to next position
    newEnemy.rotateDelta = (Math.PI/8)/FPS; // 1 shift in 4 seconds
    // counter of how many updates happened (to stop at correct position)
    newEnemy.rotateUpdateCount = 0;
    
    // rotate function: temporarily override the updateEnemy function
    //  to apply the steady rotation, and once completed, override the
    //  function again to default (empty)
    newEnemy.rotateToNextPosition = function(){
        // lock the death streak temporarily until rotation is finished
        this.fragmentDeathStreak = -1;
        
        // setup the update function
        this.updateEnemy = function(){
            // increase the update counter
            this.rotateUpdateCount++;
            // rotate all parts around this enemy's center
            for(var i=0; i<this.parts.length; i++){
                rotatePoint(this.parts[i], this.rotateDelta);
                this.parts[i].setAngle(this.parts[i].getAngle() + this.rotateDelta);
            }
            // update the current angle, too
            this.curAngle += this.rotateDelta;
            
            // if the current angle achieved the desired location, stop the
            //  rotation and change back the update function
            // This is calculated by updated rotateUpdateCount by 1 each frame,
            //  and once it reaches or exceeds 4 seconds (4 times Frames Per Second)
            //  then this if statement is executed to finish the rotation
            if(this.rotateUpdateCount >= 4*FPS){
                // reset the update counter
                this.rotateUpdateCount = 0;
                // reset the death streak
                this.fragmentDeathStreak = 0;
                // update the current position
                this.curDirection++;
                // if exceeded pos. 3 (360 degrees spin), reset position and angle to 0
                if(this.curDirection > 3){
                    this.curDirection = 0;
                    this.curAngle = 0;
                }
                // reset the update function to nothing (stop rotation script)
                this.updateEnemy = function(){}
            }
        }
    }
    
    // starts a timer to fire the next bullet
    newEnemy.startFireBulletTimer = function(){
        // create the event to launch a bullet in 2 to 5 seconds
        this.fireTimer = this.enemySys.lvl.createEvent(secToFrames(getRandNum(4)+2));
        this.fireTimer.boss = this;
        
        // ontime function: fire the bullet (if turret is not busy), and
        //  clean out event from memory
        this.fireTimer.onTime = function(lvl){
            // do this only if the standard bullet fire flag is enabled and boss is
            //  still alive
            if(this.boss.turretEnabled && this.boss.isAlive()){
                // determine a color based on the boss's current rotation position
                var color = "#FFFFFF";
                switch(this.boss.curDirection){
                
                }
                // create the bullet
                var bullet = enemyBullet(
                    // increment the angle by up to Math.PI/2, scaled by the base staring
                    //  angle
                    Math.cos(this.boss.turretAngle)*16,
                    Math.sin(this.boss.turretAngle)*16,
                    (this.boss.turretAngle),
                    8, this.boss.basicBulletDamage,
                    "#FFFFFF", 2); // bright orange color and slightly bigger
                translatePoint(bullet, this.boss.getX(), this.boss.getY());
                this.boss.enemySys.addBullet(bullet);
            }
            
            // restart the fire event again if the boss is still alive
            if(this.boss.isAlive())
                this.boss.startFireBulletTimer();
        }
    }
    
    // fire a random powerful ability (nuke, bullet stream, or dispersed shot)
    newEnemy.fireSpecial = function(){
        // randomly choose an attack
        var randVal = getRandNum(3);
        // execute attack based on random choice
        switch(randVal){
        case 0: // fire a nuke ability
            var playerContainer = new Array();
            playerContainer.push(this.enemySys.lvl.player);
            var missile = new StandardMissile(
                this.getX(), this.getY(), // start x and y
                this.enemySys.lvl.player.getX(), // target x position (player x)
                this.enemySys.lvl.player.getY(), // target y position (player y)
                5, // speed of 5
                100,//this.nukeDamage, // damage
                150,//this.nukeRadius, // blast radius
                playerContainer, // player in target list
                this.enemySys); // reference to the enemySystem as a parent
            this.enemySys.addMissile(missile);
            break;
        
        // BULLET STREAM: fires a chain of 15 bullets in a randomly-directed stream
        //  along the bottom of the screen (the bullets cover 1/4 of an area
        //  along the core's center)
        case 1: // fire a bullet stream ability
            // first, disable the turret from any other actions temporarily
            this.turretEnabled = false;
            
            // choose a random starting angle between PI/4 and 3PI/4:
            //  random number chooses 1 of 41 locations, from 0 to 40,
            //  and finds the decimal value (0 to 1) of 2PI to add
            //  to the base PI/4; the smallest case is 0 + PI/4, and
            //  the biggest case is PI/2 + PI/4 (3PI/4)
            var angle = ((getRandNum(41)/40)*Math.PI)/2 + Math.PI/4;
            
            // create an event to start firing the missiles in 2 seconds
            var startFireEvent = this.enemySys.lvl.createEvent(secToFrames(2));
            // setup all the variable links
            startFireEvent.angle = angle;
            startFireEvent.boss = this;
            
            // when it is time to fire, launch the fire event loop
            startFireEvent.onTime = function(lvl){
                // fire the bullet stream by using a looped event
                var t = this.boss.enemySys.lvl.createLoopedEvent(secToFrames(0.1));
                t.boss = this.boss;
                t.angle = this.angle;
                // if angle less than PI/2, then positive direction; else negative.
                t.direction = (this.angle < Math.PI/2) ? 1 : -1;
                // set the event's ontime functon to launch a bullet in the next valid
                //  direction again; if it fired 15 times, stop
                t.onTime = function(){
                    // if 15 shots were fired (including this one), turn this event into
                    //  not alive anymore, so the level can clean it up; also, re-enables
                    //  the boss's turret for other uses
                    if(this.numLoops == 14){ // stop at 14 as this is the 15th iteration
                        this.deactivate();
                        this.boss.turretEnabled = true;
                    }
                    
                    // calculate the current angle of the bullet based on the loop number
                    var curAngle = Math.PI/30*this.numLoops*this.direction + this.angle;
                    
                    // create the bullet (x y angle speed dmg color size)
                    var bullet = enemyBullet(
                        // increment the angle by up to Math.PI/2, scaled by the base starting
                        //  angle
                        Math.cos(curAngle)*18,
                        Math.sin(curAngle)*18,
                        (curAngle),
                        8, this.property.bulletStreamDamage,
                        "#FA9223", 3); // bright orange color and slightly bigger
                    
                    // adjust the boss's turret angle position too
                    this.boss.turretAngle = curAngle;
                    
                    // start the bullet at the center of the core
                    translatePoint(bullet, this.boss.getX(), this.boss.getY());
                    // add the bullet to the enemy bullets array
                    this.boss.enemySys.addBullet(bullet);
                }
            }
                
            // before it is time to fire, move the turret into place over 2 seconds
            var moveRange = angle - this.turretAngle;
            var moveEvent = this.enemySys.lvl.createLoopedEvent(1);
            moveEvent.moveDelta = moveRange/(2*FPS);
            //alert(this.turretAngle + ", " + angle);//moveEvent.moveDelta);
            moveEvent.property = this;
            moveEvent.onTime = function(){
                // if positioning is finished, return and set isAlive to false, so that
                //  the level system cleans out this event
                if(this.numLoops >= 2*FPS){
                    this.deactivate();
                    return;
                }
                
                // else update the turret angle
                this.property.turretAngle += this.moveDelta;
            }
            
            break;
            
        // DISPERSE SHOT: fires an avoidable shot all around in an area under the core
        case 2:
            // give a slight offset
            var offset = Math.PI/100*getRandNum(10);
            for(var i=0; i<18; i++){
                // create the bullet (x y angle speed dmg color size)
				var bullet = enemyBullet(
                    // increment the angle by up to Math.PI/2, scaled by the base staring
                    //  angle
					Math.cos(Math.PI/20*i+offset)*20,
					Math.sin(Math.PI/20*i+offset)*20,
					(Math.PI/20*i+offset),
					8, this.bulletDisperseDamage, // 30 damage if hit
					"#FF0000", 2); // bright orange color and slightly bigger
                translatePoint(bullet, this.getX(), this.getY());
                this.enemySys.addBullet(bullet);
            }
            break;
        }
    }
        
    // start the boss (must be called to start the shooting events AFTER
    //  the enemySystem is linked by the addEnemy() function
    newEnemy.start = function(){
        // start bullet fire event
        this.startFireBulletTimer();
        
        // start the special ability attacks event
        this.specialAttackEvent = this.enemySys.lvl.createLoopedEvent(secToFrames(15))
        this.specialAttackEvent.boss = this;
        this.specialAttackEvent.onTime = function(lvl){
            // if boss is dead, remove this event
            if(!this.boss.isAlive())
                this.deactivate();
            
            // otherwise, fire the special ability
            else
                this.boss.fireSpecial();
        }

        // remove immunity shield to prevent accidental destruction in 4 seconds
        var immunityEvent = this.enemySys.lvl.createEvent(secToFrames(4))
        immunityEvent.boss = this;
        immunityEvent.onTime = function(lvl){
            this.boss.immune = false;
        }
    }
	
	// a function called automatically when this enemy dies to create a special
	//	animation to apply the death effect and stop all active attacks
	newEnemy.deathEvent = function(){
		// stop the turret fire event (if it exists)
		if(this.fireTimer != undefined)
			this.fireTimer.deactivate();
		// stop the special event timer event (if it exists)
		if(this.specialAttackEvent != undefined)
			this.specialAttackEvent.deactivate();
		
		// clear out all dead parts from the parts array (note: this should be automatic!)
		for(var i=0; i<this.parts.length; i++){
			if(!this.parts[i].isAlive()){
				this.parts.splice(i, 1);
				i--;
			}
		}
		
		// shake the screen
		this.enemySys.lvl.shake(this.parts.length);
		
		// start the chain destruction of all remaining parts
		this.destroyNextPart();
	}
	
	newEnemy.destroyNextPart = function(){
		if(this.parts.length > 0){
			// get a random part to explode
			var partIndex = getRandNum(this.parts.length);
			// kill the part (this will automatically create an explosion effect)
			this.parts[partIndex].health = 0;
			// remove the onDeathEvent so that the part's death will not trigger any of
			//	the boss's abilities
			this.parts[partIndex].onDeathEvent = function(){}
			// remove the part from the boss's parts array
			this.parts.splice(partIndex, 1);
			// set a timer to kill the next part in a half of a second
			var nextDestroyEvent = this.enemySys.lvl.createEvent(secToFrames(0.1));
			nextDestroyEvent.property = this;
			nextDestroyEvent.onTime = function(boss){
				boss.destroyNextPart();
			}
		}
		else
			this.onAllPartsDestroyed();
	}
	newEnemy.onAllPartsDestroyed = function(){
		// kill the boss (set the isAlive function to be false now) so that the enemySystem
		//	registers the death and removes it. This will generate the deathEffect
		this.isAlive = function() { return false; }
		// stop the shake effect
		this.enemySys.lvl.shake(0);
	}
	
	// set isAlive to always return true (this boss has a special death
	//	event sequence that is called when it dies automatically
	newEnemy.isAlive = function(){
		return true;
	}
    
	// add a basic circular collision
	newEnemy.addCollision(new standardCollision(30));
	
	// when enemy dies, create a giant explosion
	newEnemy.deathEffect = function(){
		// create the massive destruction effect:
		// first, add a blast wave
		this.enemySys.addEffect(this.enemySys.effectSys.giantBlastWave(this.getX(), this.getY()));
		// then add a giant particle explosion, too
		this.enemySys.addEffect(this.enemySys.effectSys.giantExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark where the bullet hit
    newEnemy.hitEffect = function(x, y){
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, (3*Math.PI)/2));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
	
	return newEnemy;
}

// constructs an isoceles right triangle shaped enemy that acts as a single
//  piece of the shielded base boss (a shield fragment). This fragment is controlled
//  by the core (the main part of the enemy)
function baseShieldFragment(x, y, angle, layer){
    // create the fragment part
	var newEnemy = new enemy(x, y, angle, 0);
    // add standard values: (100 health, 50 score, 50 weight, etc.);
	newEnemy.maxHealth = 100;
	newEnemy.health = 100;
	newEnemy.score = 50;
	newEnemy.weight = 50;
	newEnemy.name = "Base Shield Fragment";
	newEnemy.height = 0; // health bar displayed at center
    
    // layer variable is used to let the core understand, when a part of
    //  the shield dies, which layer the death comes from to react accordingly.
    newEnemy.layer = layer;
	
    // stnadard draw function (draws a right isoceles triangle)
	newEnemy.draw = function(ctx){
		ctx.save();
		
        // adjust the context position and angle
		ctx.translate(this.getX(), this.getY());
        ctx.rotate(this.angle);
        
		ctx.strokeStyle = "#66CC99";
		ctx.fillStyle = "#000018";
		ctx.lineWidth = 1;
		// start drawing enemy
        ctx.beginPath();
		ctx.moveTo(15, 15);
		ctx.lineTo(-15, 15);
		ctx.lineTo(-15, -15);
		ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
		
		ctx.restore();
	}
	
	// when the enemy dies, register the death the the core with the
    //  layer this enemy currently represents
	newEnemy.onDeathEvent = function(){
		this.parent.registerPartDeath(this.layer);
	}
	
	// create a basic explosion
	newEnemy.deathEffect = function(){
		this.enemySys.addEffect(this.enemySys.effectSys.basicExplosion(this.getX(), this.getY()));
	}
    
	// when enemy is hit by a bullet, create a spark on the side that the bullet hit
    newEnemy.hitEffect = function(x, y){
		// push the effect into the enemySys effect system
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, (3*Math.PI)/2));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
	
	// add the collision triangle object
	newEnemy.addCollision(new standardCollision(40))
        .addObject(new cTriangle({x:18,y:18},{x:-18,y:18},{x:-18,y:-18}));
	
	return newEnemy;
}

function createCentralCoreBoss(x, y){
	var baseCore = centralCommandCore(x, y);
	var rad = 60; // the radius away from the center (60 for closest layer)
	// FIRST LAYER (layer 0)
	for(var i=0; i<4; i++){ // bottom of center square
		var fragAngle = Math.PI*(i/2);
        // ------- x pos, ypos, angle, layer position (layer 0)
		var fragment = baseShieldFragment(0, rad, fragAngle, 0);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // top of center square
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(0, rad, fragAngle + Math.PI, 0);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // left of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad, fragAngle + Math.PI, 0);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // right of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(30, rad, fragAngle + Math.PI/2, 0);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second left of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad-30, fragAngle, 0);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	
	// SECOND LAYER (layer 1)
	for(var i=0; i<4; i++){ // bottom of center square
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(0, rad+30, fragAngle - Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // top of center square
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(0, rad+30, fragAngle + Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // left of bottom center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad, fragAngle, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // right of bottom center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(30, rad, fragAngle - Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // left of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad+30, fragAngle + Math.PI, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // right of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(30, rad+30, fragAngle + Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second left of bottom center (inner) piece
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-60, rad, fragAngle - Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second left of bottom center (outer) piece
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-60, rad, fragAngle + Math.PI/2, 1);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	
	// THIRD LAYER (layer 2)
	for(var i=0; i<4; i++){ // bottom of center square
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(0, rad+60, fragAngle, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // top of center square
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(0, rad+60, fragAngle + Math.PI, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // left of last (lower) center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad+30, fragAngle, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // right of last (lower) center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(30, rad+30, fragAngle - Math.PI/2, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // first left of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-30, rad+60, fragAngle + Math.PI, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second left of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-60, rad+30, fragAngle + Math.PI, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // first right of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(30, rad+60, fragAngle + Math.PI/2, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second right of center
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(60, rad+30, fragAngle + Math.PI/2, 2);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	
	// FOURTH LAYER (layer 3)
	for(var i=0; i<4; i++){ // first of bump (left-to-right)
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-60, rad+30, fragAngle, 3);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // second (middle) of bump (left-to-right)
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-90, rad+30, fragAngle + Math.PI, 3);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	for(var i=0; i<4; i++){ // third of bump (left-to-right)
		var fragAngle = Math.PI*(i/2);
		var fragment = baseShieldFragment(-90, rad, fragAngle, 3);
		rotatePoint(fragment, fragAngle);
		baseCore.addPart(fragment);
	}
	
	return baseCore;
}


/*
    NOTES:
    
    - EVENTS: run the deactivate() function in each event update func. instead of doing it
        manually, and just un-set the deactive function to true if the event shouldn't
        be deleted (in the case of the player weapon event)
        Use functions event.deactivate() and event.reactivate()
    
    - Use different attacks on different positions (or at least color differently)
    
    Possible Attacks: (most should be evadable by the player, if not all)
    - Bullet Stream - shoots a stream of bullets that hits everything in a path along some
        part of the screen, possible selected randomly, or based on where the player is
    - Bullet Dispersion - shoots a lot of bullets at once such that they cover a larger
        portion of the screen
    - Heat-Seeking missiles - fires missiles that chase the player, and do a decent damage
        if the player gets hit by them
    - Nukes - fires a powerful missile (not heat-seeking); if the player gets hit directly,
        this is an instant death. If the player is within range, and the missile already passed
        (that is, the player evaded it), it explodes. The player takes damage from the radius
        of the explosion based on how close he is (really close hurts, far away doesn't hurt much)
    
    Destorying an inner (layer 0) fragment:
    - Instead of sending out a wave of bullets, send out a "lazer" wave that inavoidably hits
        the player causing x damage per second; the player must minimize this damage by flying
        into it (and thus colliding with it for the shortest possible time). In addition, this
        wave also reflects any bullets or attacks fired by the player behind it, thus providing
        momentary immunity to the core.
*/