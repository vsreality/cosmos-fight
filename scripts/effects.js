/* File comments updated: Thursday, May 24, 2012 at 4:34 PM
 *
 * PARTICLE SYSTEM CLASS
 *  An effect inserted into the effectSystem class must have the three
 *  generic functions:
 *      boolean isAlive()
 *      void update()
 *      void draw(HTML5CanvasContext ctx)
 */

 
 /*** CONSTANT VARIABLES: use these to reference which type of particle to use ***/
 var FIRE_PARTICLE = 1;
 var BLUE_PARTICLE = 2;
 var RED_PARTICLE = 3;
 
 
 // Effect System class
 //		The effectSystem can be implemented by any subsystem or level
 //		to keep track of all active effects on the screen.
 //		Effects are not interactive, but rather simply provide a means
 //		to animate effects on the screen.
function effectSystem(){

	// array of all effects (objects / particle systems that animate effects)
    this.effects = new Array();
    
	// add a new effect to this system
    this.addEffect = function(effect){
        this.effects.push(effect);
    }
    
	// call every frame to update all contained effect objects or particle systems
	//	See individual effects' update functions. These functions generally
	//	deal with moving animation.
    this.update = function(){
        for(var i=0; i<this.effects.length; i++){
			// if effect is dead (that is, it is no longer active), remove it
            if(!this.effects[i].isAlive()){
                this.effects.splice(i, 1);
                i--;
            }
            else
				// update here (call that effect's update function)
                this.effects[i].update();
        }
    }
    
	// draw all effects of this system on the screen
    this.draw = function(ctx){
        for(var i=0; i<this.effects.length; i++){
            this.effects[i].draw(ctx);
        }
    }
    
	// creates a particle set containing a very tiny fire-colored spark
	//	at the x, y position and angled by the given angle (in radians)
    this.miniSpark = function(x, y, angle){
		// x y angle speed numParticles range lifeSpan size
        return new particleSet(x, y, angle, 5, 10, Math.PI/12, 0.25, 1);
    }
    
	// creates a particle set containing a small fire-colored spark
	//	at the x, y position and angled by the given angle (in radians)
    this.basicSpark = function(x, y, angle){
		// x y angle speed numParticles range lifeSpan size type
        return new particleSet(x, y, angle, 8, 30, Math.PI/6, 0.3, 2, FIRE_PARTICLE);
    }
    
	// creates a particle set containing a small fire-colored spark
	//	at the x, y position and angled by the given angle (in radians)
    this.basicRedSpark = function(x, y, angle){
		// x y angle speed numParticles range lifeSpan size type
        return new particleSet(x, y, angle, 8, 30, Math.PI/6, 0.3, 2, RED_PARTICLE);
    }
	
	// creates a particle set in a circle around the given x, y location containing
	//	small, spark-like fire particles.
	this.basicBurnEffect = function(x, y){
		return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   8, // speed of particles
							   20, // number of particles
							   Math.PI, // range (PI in each direction, 2PI total)
							   0.5, // lifespan (about average)
							   2, // particle size
							   FIRE_PARTICLE); // particle type (fire)
	}
    
	// creates a particle set containing a small fire-colored explosion
	//	at the given x, y position (this explosion is 360-degrees dispersed)
    this.basicExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   50, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.2, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   FIRE_PARTICLE); // particle type (fire)
    }
	
	// same as basicExplosion (above) but the particles are blue
	this.basicBlueExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   70, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.2, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   BLUE_PARTICLE); // particle type (fire)
    }
	
	// same as basicExplosion (above) but the particles are red
	this.basicRedExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   70, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.2, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   RED_PARTICLE); // particle type (fire)
    }
	
	// same as basicExplosion (above) but the particles are red
	this.slowRedExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   1, // speed of the particles
							   70, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.05, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   RED_PARTICLE); // particle type (fire)
    }
	
	// creates a particle set containing a middle-sized fire-colored explosion
	//	at the given x, y position (this explosion is 360-degrees dispersed)
    this.midExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   100, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.15, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   FIRE_PARTICLE); // particle type (fire)
    }
	
	// creates a particle set containing a middle-sized red-colored explosion
	//	at the given x, y position (this explosion is 360-degrees dispersed)
    this.midRedExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   100, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.15, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   RED_PARTICLE); // particle type (red)
    }
	
	// creates a particle set containing a middle-sized red-colored explosion
	//	at the given x, y position (this explosion is 360-degrees dispersed)
    this.midBlueExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   5, // speed of the particles
							   100, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.15, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   BLUE_PARTICLE); // particle type (blue)
    }
    
	// creates a particle set containing a very big fire-colored explosion
	//	that has a long duration (the particles stay on screen for a long time)
	//	at the given x and y location (this explosion is 360-degrees dispersed)
    this.giantExplosion = function(x, y){
        return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   6, // speed of the particles
							   150, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.03, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   FIRE_PARTICLE); // particle type (fire)
    }
	
	// same as giantExplosion, but with red particles
	this.giantRedExplosion = function(x, y){
		return new particleSet(x, y, // x, y position
							   0, // angle (0, since it's a 360-degree span)
							   6, // speed of the particles
							   150, // number of particles
							   Math.PI, // range (PI in each direction, so 2PI total)
							   0.03, // lifeSpan (shorter is longer, 0.3 is standard)
							   3, // particle size (radius)
							   RED_PARTICLE); // particle type (fire)
	}
    
	// creates an animated blast wave effect to depict a circular missile explosion
	//	at the given x and y location
    this.missileExplosion = function(x, y){
        return new blastWave(x, y, 150, 0.4);
    }
    
	// creates an animated blast wave effect to depict a circular missile explosion
	//	at the given x and y location
    this.giantBlastWave = function(x, y){
        return new blastWave(x, y, areaWidth/2, 0.4);
    }
    
	// creates a particle set for that single frame at the given x, y location.
	//	This will be a frame of a randomly-generated "rocket fire" animation.
	//	If forward (boolean) is true, then the direction of the ship is forward,
	//	so the fire's velocity will be downwards (propelling the upwards moving ship)
    this.shipRocketFire = function(x, y, forward){
		// if moving forward, create a backwards-projecting fire
        if(forward)
            /*return new particleSet(x, y, //position
                               (3*Math.PI)/2, //angle
                               5, //speed
                               40, //number of particles
                               Math.PI/6, //range
                               0.4, //lifetime
                               3); //size*/
            return new particleSet(x, y, //position
                               (3*Math.PI)/2, //angle
                               4, //speed
                               20 * (30/FPS), //number of particles scaled by FPS
                               Math.PI/20, //range
                               1, //lifetime
                               3, //size
							   FIRE_PARTICLE); // particle type (fire)
		// if not moving forward, create a regular smaller fire
        else
            return new particleSet(x, y, //position
                               (3*Math.PI)/2, //angle
                               3, //speed
                               10 * (30/FPS), //number of particles scaled by FPS
                               Math.PI/12, // range
                               1, //lifetime (bigger = less)
                               2, // size
							   FIRE_PARTICLE); // particle type (fire)
    }
    
	// creates a particle set for that single frame at the given x, y location
    //  rotated to the given angle. This will be a frame of a randomly-generated
	//	"rocket fire" animation (similar to shipRocketFire)
    this.missileRocketFire = function(x, y, angle){
        return new particleSet(x, y, //position
                               angle, //angle
                               12, //speed
                               15, //number of particles scaled by FPS
                               Math.PI/12, // range
                               0.1, //lifetime (bigger = less)
                               3, // size
							   FIRE_PARTICLE); // particle type (fire)
    }
}


// BLAST WAVE OBJECT:
//  This is an object that animates a blast wave using circles, transparency,
//      and multi-level gradients animated on a frame-by-frame bases over
//      the given period of time (duration, given in seconds). The radius
//      is the expansion range of the blast wave. Radius is reached when
//      the blast wave is exhausted
function blastWave(x, y, radius, duration){
    // x, y position
    this.x = x;
    this.y = y;
    // blast radius
    this.radius = radius
    
    // calculate how long (scaled by FPS) this blastwave will run for,
    //  and the rate of animation
    this.tVal = 0;
    this.tDelta = 1/secToFrames(duration);
    
    this.update = function(){
        this.tVal += this.tDelta;
        if(this.tVal > 1)
            this.tVal = 1;
    }
    
    this.draw = function(ctx){
        ctx.save();
        
        // draw the blast wave
        ctx.strokeStyle = "#FFFF00";
        ctx.fillStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
            ctx.arc(this.x, this.y,
                    Math.round(this.radius*this.tVal),
                    0, 2*Math.PI, false);
            ctx.globalAlpha = 1-this.tVal;
            ctx.fill();
            ctx.globalAlpha = 1-this.tVal*this.tVal;
            ctx.stroke();
        ctx.closePath();
        
        ctx.restore();
    }
    
    // returns TRUE if alive, false otherwise (this effect is considered
    //  alive if the tVal (time) is not yet exausted
    this.isAlive = function(){
        return this.tVal < 1;
    }
}


// PARTICLE SET:
//	This function creates a very specific set of particles (often used in a particle system)
//	that will provide a set of particles with all of the provided parameters and
//	advanced specializations.
function particleSet(x, y, angle, speed, numParticles, range, lifeSpan, particleSize,
			particleType){ // particle type is determined by the constants (see top of page)
	// array to contain all individual particles
    this.particles = new Array();
    
    // scale number of particles and their duration based on effect settings
    numParticles *= settings.effectsScale;
    lifeSpan /= settings.effectsScale;
	
	// create each particle seperately (at a randomized position based on the provided
	//	particleSet parameters)
    for(var i=0; i<numParticles; i++){
        // get an offset between -range and range
		var offset = range*2*Math.random() - range;
		var scaleX = Math.round(speed*Math.random()) + 1; // scale by FPS
		var scaleY = Math.round(speed*Math.random()) + 1; // scale by FPS
		var newParticle; // create an empty particle variable
		// set the particle to be one of the following colors
		switch(particleType){
			case FIRE_PARTICLE: // fire (basic) particle - orange hue fades to red
				newParticle = new particle(x, y,
					Math.cos(angle+offset) * scaleX,
					Math.sin(angle+offset) * scaleY,
					lifeSpan, particleSize);
				break;
			case BLUE_PARTICLE: // blue particle - blue colored hue
				newParticle = blueParticle(x, y,
					Math.cos(angle+offset) * scaleX,
					Math.sin(angle+offset) * scaleY,
					lifeSpan, particleSize);
				break;
			case RED_PARTICLE: // red particle - a red hue particle but similar to the fire particle
				newParticle = redParticle(x, y,
					Math.cos(angle+offset) * scaleX,
					Math.sin(angle+offset) * scaleY,
					lifeSpan, particleSize);
				break;
			default: // by default set it to the fire particle
				newParticle = new particle(x, y,
					Math.cos(angle+offset) * scaleX,
					Math.sin(angle+offset) * scaleY,
					lifeSpan, particleSize);
		}
		this.particles.push(newParticle);
    }
	
	// update function: updates each particle in the set, and if a particle dies
	//	then removes it.
	this.update = function(){
		// loop through all particles
		for(var i=0; i<this.particles.length; i++){
			// if particle is dead, remove it
			if(this.particles[i].dead()){
				this.particles.splice(i, 1);
				i--;
			}
			// update the particle
			else{
				this.particles[i].update();
			}
		}
    }
    
	// draw: loop through all active particles and draw them
    this.draw = function(ctx){
        for(var i=0; i<this.particles.length; i++){
			this.particles[i].draw(ctx);
        }
    }
    
	// returns true as long as this set has particles.
	//	if no more particles are in this set, the set is "dead" and therefore
	//	can be deleted.
    this.isAlive = function(){
        return this.particles.length > 0;
    }
}


// PARTICLE OBJECT:
//	This is an object resembling a specific particle at the given x and y position,
//		the given velocities, and the given size (in radius in pixels). This particle
//		lasts as long as it is visible; that is, until its alpha reaches 0. The change
//		in alpha is determined by "lifeSpan", scaled by FPS counter
function particle(x, y, xVelocity, yVelocity, lifeSpan, size){
	// x, y position
	this.x = x;
	this.y = y;
	// size (radius) of the particle
    this.size = size;
	// velocity (in the x and y directions, scaled by FPS)
	this.xVelocity = xVelocity * (60/FPS);
	this.yVelocity = yVelocity * (60/FPS);
	// transparency (1.0 means fully visible, 0 means invisible)
	this.alpha = 1.0;
	// delta alpha: how much the alpha is reduced per frame (scaled by FPS)
	this.dAlpha = (Math.random()*lifeSpan + 0.15*lifeSpan) * (60/FPS); // scale by FPS
	
	// update function: updates the positions by the velocities and
	//	degrades alpha value by the delta alpha variable
	this.update = function(){
		// update velocity:
		this.x += this.xVelocity;
		this.y -= this.yVelocity;
		// update alpha
		this.alpha -= this.dAlpha;
		// check if alpha is negative, set it to 0 to prevent issues of a
		//	negative alpha value
		if(this.alpha < 0)
			this.alpha = 0;
	}
	
	// draw function: draw this particle to the given canvas context (ctx)
	this.draw = function(ctx){
		ctx.save();
			// fill RGB (custom per type of particle) -- see below
			this.setColor(ctx);
			// set the transparency (alpha) of this particle
			ctx.globalAlpha = this.alpha;
			// draw the arc (circle) with the given properties on the canvas
			ctx.beginPath();
				// x-position, y-position, radius (size),
				//	begin path (0 degrees), end path (2PI degrees),
				//	false = draw circle clockwise (full circle doesn't matter)
				ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
				// fill the arc in the canvas
				ctx.fill();
			ctx.closePath();
		ctx.restore();
	}
	
	// this is the color of the particle at any given time.
	//	This function can be overridden by custom particles that
	//	are a different color (i.e. this one is fire-colored by default,
	//	but you may want to use a green or blue colored particle set!)
	this.setColor = function(ctx){
		// use this as an example to create the custom coloring scheme:
		//	RED is always 255, BLUE is 255 but scaled by the alpha value,
		//		(e.g. when alpha is 1.0 blue is 255, when alpha is 0.5 blue is 128)
		//	GREEN is scaled by alpha cubed (e.g. when alpha is 1.0, green is
		//		255, when alpha is 0.5, green is 32 (255 * 0.5 * 0.5 * 0.5 =
		//		255 * 0.125 = 31.875 & rounded = 32)
		// Overall, this makes a yellow-ish hue that fades into a reddish hue
		ctx.fillStyle = "rgb(255, " + Math.round(255*this.alpha) + ", " +
			Math.round((255*this.alpha*this.alpha*this.alpha))+ ")"; // (yellow)
	}
	
	// returns true if the particle is dead; that is, a particle is dead when
	//	its alpha is 0 (it is completely invisible)... it is assumed that every
	//	particle reduces to 0 alpha at some point; if not, adjust this function
	//	in the custom particle
	this.dead = function(){
		return this.alpha <= 0;
	}
}

// customized particle with a blue coloring
function blueParticle(x, y, xVelocity, yVelocity, lifeSpan, size){
	// create a new particle
	var newParticle = new particle(x, y, xVelocity, yVelocity, lifeSpan, size);
	
	// override the setColor function
	newParticle.setColor = function(ctx){
		ctx.fillStyle = "rgb(" + Math.round(255*this.alpha) + ", " +
			Math.round(255*this.alpha) + ", " +
			Math.round(255*this.alpha) + ")";
	}
	
	// return the new particle with the blue color
	return newParticle;
}

// customized particle with a red coloring
function redParticle(x, y, xVelocity, yVelocity, lifeSpan, size){
	// create a new particle
	var newParticle = new particle(x, y, xVelocity, yVelocity, lifeSpan, size);
	
	// override the setColor function
	newParticle.setColor = function(ctx){
		ctx.fillStyle = "rgb(255, " + Math.round(255*this.alpha*this.alpha*this.alpha) + ", " +
			Math.round(255*this.alpha*this.alpha*this.alpha) + ")";
	}
	
	// return the new particle with the blue color
	return newParticle;
}