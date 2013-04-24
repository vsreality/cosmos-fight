/* File comments updated: Friday, May 25, 2012 at 8:14 PM
 *
 *  SHIELD CLASS
 */


// SHIELD: a generic shield attachement class used for the
//	player. By default, this class does nothing, but provides
//	a basis for the shield system.
// Parameters: unit should be a reference to the player object,
//		inner/outer RGB should be the gradient color schemes.
//		These are OPTIONAL, and will be defaulted to 0 if not passed
//		in. All 6 RGB parameters must be passed in, or none will be
//		applied (all-or-nothing).
function shield(unit, innerR, innerG, innerB, outerR, outerG, outerB){
	// which unit the weapon belongs to (e.g. Player)
    this.unit = unit;
    
    // the sheilds health (by default 100)
    this.health = 100;
    
    // the sheild's color (by default white)
    this.color = "#FFFFFF";
	
	// the shield's action text:
	//	for example, some shields may absorb all damage, so
	//	the action text would be "absorbed". Any non-empty
	//	text string put as the actionText variable will
	//	be placed into parentheses [e.g. if the sheild
	//	absorbs 10 damage and its actionText = "Absorbed",
	//	and it returns 0 as its dmg variable, the floating
	//	text displayed will be:
	//		-10 (Absorbed)
	//	otherwise, if the string remains empty, it will just be:
	//		-0
	//	]
    this.actionText = "";
	
	// TIMERS: used for the shield icon's border to display how long
	//	until the shield goes away
	// timer is at 100 (ratio in percentages)
	this.timer = 100;
	// timerDelta is how much to reduce the timer by each frame
	this.timerDelta = 0;
	// function to apply a duration to this shield's timer
	this.setTimerDelta = function(duration){
		this.timerDelta = this.timer / secToFrames(duration);
	}
	
	/**** COMPLEX SHIELD ANIMATION ****/
	// This is code to animate the shield with the visual effect...
	// The gradient spans outwards from the inner color to the outer edge of the
	//	shield's circle (the outer color). The center is animated to give a
	//	complex appearance. The colors also change to give a complex appearance.
	//	Overwrite the draw function to undo this animation
	
	// Gradient animation variables:
	this.radius = 30; // 45 pixel radius of shield (can be modified at any time)
	this.xOffset = 0; // offset dictates the center of the gradient
	this.yOffset = 0; // offset dictates the center of the gradient
	this.xDelta = -0.5; // speed of change in X-direction of the center of the gradient
	this.yDelta = -0.25; // speed of change in Y-direction of the center of the gradient
	
	// Gradient coloring for the inner point (RGB):
	//	The "base" indicates that these are the starting (original) inner colors
	//	Override these to change the color scheme of the shield animation
	// value will be set to 0 OR (if passed in, the respective parameter value)
	this.innerR_base = innerR || 0; // if innerR is undefined, null or 0, it will choose 0
	this.innerG_base = innerG || 0;
	this.innerB_base = innerB || 0;
	
	// Gradient coloring for the outer point (RGB)
	//	The "base" indicates that these are the starting (original) outer colors
	//	Override these to change the color scheme of the shield animation
	// value will be set to 0 OR (if passed in, the respective parameter value)
	this.outerR_base = outerR || 0;
	this.outerG_base = outerG || 0;
	this.outerB_base = outerB || 0;
	
	// Current colors of the active gradient (these change throughout):
	//	Start with the original colors (inner and outer as declared above)
	this.innerR_cur = this.innerR_base;
	this.innerG_cur = this.innerG_base;
	this.innerB_cur = this.innerB_base;
	this.outerR_cur = this.outerR_base;
	this.outerG_cur = this.outerG_base;
	this.outerB_cur = this.outerB_base;
	
	// This is the speed of change of the values - each value set changes at a
	//	different rate.
	// Values are changed by R,G,B independently, and flip between the inner and outer
	//	schemes and back. Combinations of this RGB arrise but the general color scheme
	//	will be a blend of the inner and outer colors.
	// Inner deltas
	this.innerR_delta = (-(this.innerR_base-this.outerR_base)/FPS)*0.5;
	this.innerG_delta = (-(this.innerR_base-this.outerR_base)/FPS);
	this.innerB_delta = (-(this.innerR_base-this.outerR_base)/FPS)*1.5;
	// Outer deltas (counter the speed of the inner deltas)
	this.outerR_delta = ((this.innerR_base-this.outerR_base)/FPS)*1.5;
	this.outerG_delta = ((this.innerR_base-this.outerR_base)/FPS)*0.5;
	this.outerB_delta = ((this.innerR_base-this.outerR_base)/FPS);
	
	// The actual color (updated per frame) of the inner part of the gradient
	this.innerColor = "rgb(" +
							this.innerR_cur + ", " +
							this.innerG_cur + ", " +
							this.innerB_cur + ")";
	
	// The actual color (updated per frame) of the outer part of the gradient
	this.outerColor = "rgb(" +
							this.outerR_cur + ", " +
							this.outerG_cur + ", " +
							this.outerB_cur + ")";
	
	// Function that houses all of the appropriate updates for the shield
	//	amination (this only deals with the complex animation variables above)
	this.updateShieldAnimation = function(){
		// update the COLORS here:
		
		// check if either color (RGB) is out of bounds for the inner
		//	and outer radient colors.
		// check each (r,g,b, inner and outer) in both cases (see first if example)
		//	INNER R (use as documentation example):
		if(!( // do if the following conditions do not hold:
			// current innerR is between original innerR and original outerR
			//	(i.e. outerR_base < innerR_cur < innerR_base)
			((this.innerR_cur < this.innerR_base) && (this.innerR_cur > this.outerR_base))
			|| // OR between original outerR and original innerR
			//	(i.e. innerR_base < innerR_cur < outerR_base)
			((this.innerR_cur < this.outerR_base) && (this.innerR_cur > this.innerR_base)) ) ){
				// if neither of those hold (that is, the current inner red is NOT between either
				//	the base outer and the base inner or between the base inner and base outer,
				//	then it is out of bounds any possible valid range, so reverse the delta
				this.innerR_delta *= -1; // reverse direction
		}
		//	INNER G:
		if(!(
			((this.innerG_cur < this.innerG_base) && (this.innerG_cur > this.outerG_base))
			||
			((this.innerG_cur < this.outerG_base) && (this.innerG_cur > this.innerG_base)) ) ){
				this.innerG_delta *= -1; // reverse direction
		}
		//	INNER B:
		if(!(
			((this.innerB_cur < this.innerB_base) && (this.innerB_cur > this.outerB_base))
			||
			((this.innerB_cur < this.outerB_base) && (this.innerB_cur > this.innerB_base)) ) ){
				this.innerB_delta *= -1; // reverse direction
		}
		//	OUTER R:
		if(!(
			((this.outerR_cur < this.innerR_base) && (this.outerR_cur > this.outerR_base))
			||
			((this.outerR_cur < this.outerR_base) && (this.outerR_cur > this.innerR_base)) ) ){
				this.outerR_delta *= -1; // reverse direction
		}
		//	OUTER G:
		if(!(
			((this.outerG_cur < this.innerG_base) && (this.outerG_cur > this.outerG_base))
			||
			((this.outerG_cur < this.outerG_base) && (this.outerG_cur > this.innerG_base)) ) ){
				this.outerG_delta *= -1; // reverse direction
		}
		//	OUTER B:
		if(!(
			((this.outerB_cur < this.innerB_base) && (this.outerB_cur > this.outerB_base))
			||
			((this.outerB_cur < this.outerB_base) && (this.outerB_cur > this.innerB_base)) ) ){
				this.outerB_delta *= -1; // reverse direction
		}
		
		// update the inner colors by their respective deltas
		this.innerR_cur += this.innerR_delta;
		this.innerG_cur += this.innerG_delta;
		this.innerB_cur += this.innerB_delta;
		
		// update the outer colors by their respective deltas
		this.outerR_cur += this.outerR_delta;
		this.outerG_cur += this.outerG_delta;
		this.outerB_cur += this.outerB_delta;
		
		// set the actual colors to the RGB as updated above
		//	The numbers are rounded because RGB strings must contain
		//	only whole numbers
		this.innerColor = "rgb(" +
								Math.round(this.innerR_cur) + ", " +
								Math.round(this.innerG_cur) + ", " +
								Math.round(this.innerB_cur) + ")";
		this.outerColor = "rgb(" +
								Math.round(this.outerR_cur) + ", " +
								Math.round(this.outerG_cur) + ", " +
								Math.round(this.outerB_cur) + ")";
		
		// update GRADIENT CENTER offset
		this.xOffset += this.xDelta;
		this.yOffset += this.yDelta;
		
		// if gradient center offset is out of bounds, reverse the direction
		//	of the delta (for x and y, respectively)
		if(this.xOffset <= -this.radius/2.5 || this.xOffset >= this.radius/2.5)
			this.xDelta *= -1;
		if(this.yOffset <= -this.radius/2.5 || this.yOffset >= this.radius/2.5)
			this.yDelta *= -1;
	}
	
	// animation of the shield
    this.draw = function(ctx){
        // don't bother if health is 0 or less
        if(this.health <= 0)
            return;
		
		// update the shield animation here
		this.updateShieldAnimation();
            
        ctx.save();
			// set stroke style to be the color of this shield
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 1; // width of line is 1 (just an outline)
			
			// set up the gradient for animation
			var grd = ctx.createRadialGradient(this.xOffset/2, // inner x (offset from 0)
											   this.yOffset/2, // inner y (offset from 0)
											   0, // inner radius (staring at 0, center)
											   -this.xOffset, // outer x (offset from 0)
											   -this.yOffset, // outer y (offset from 0)
											   this.radius); // outer radius
			grd.addColorStop(0, this.innerColor); // add inner color to the gradient
			grd.addColorStop(1, this.outerColor); // add outer color to the gradient
			
			// set the gradient object as the fill style of this shield
			ctx.fillStyle = grd;
			
			// draw the path (the arc) containing the gradient / shield outline
			ctx.beginPath();
				// compute the arc on the basis of the health:
				//	100 health means a full circle;
				//	0 health means no drawing
				//	anywhere inbetween implies drawing it only as a partial circle
				ctx.arc(0, 1, this.radius, Math.PI/2+Math.PI*(1-this.health/100), 
						5*Math.PI/2 - Math.PI*(1-this.health/100), false);
				
				// setup the alpha value
				ctx.globalAlpha = 0.6;
				ctx.stroke(); // outline the arc with the color
				
				// setup the fill alpha value (more transparent)
				ctx.globalAlpha = 0.4;
				ctx.fill(); // fill the arc with the gradient
			ctx.closePath();
        ctx.restore();
    }
    
	// draw the icon (border and icon) on the screen as the shield's
	//	icon visible to the player. This icon appears in the lower-right
	//	hand corner of the screen and displays the emblem of the active
	//	shield. Each shield should override the drawEmblem(ctx) function
	//	to correctly draw its own shield.
	this.drawIcon = function(ctx){
		this.drawIconBorder(ctx);
		ctx.save();
		ctx.translate(contextWidth - 18, contextHeight-17);
		this.drawEmblem(ctx);
		ctx.restore();
	}
	
	// This function draws the emblem of the active shield onto the
	//	screen. The overridden needs only to call the correct draw
	//	icon function (most likely the same one used to draw the
	//	corresponding bonus, if exists).
	this.drawEmblem = function(ctx){
		drawArmorShieldIcon(ctx);
	}

	// internal function used to draw the border surrounding the icon of the
	//	shield. This function acts as the draw function as well as the update
	//	function for the timers simultaneously (so that the timers stop when the
	//	game is paused)
	this.iconAlpha = 0.6; // shield icon border alpha
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
			var gradient = ctx.createLinearGradient(contextWidth, contextHeight-40,
													contextWidth-40, contextHeight);
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
			//	going from the corner up towards the upper-right end of the icon
			var fillGrd = ctx.createLinearGradient(contextWidth, // inner x
												   contextHeight, // inner y
												   contextWidth-30, // outer x
												   contextHeight-30); // outer y
			fillGrd.addColorStop(0, "#404040"); // dark color
			fillGrd.addColorStop(1, "#A0A0A0"); // bright color
			ctx.fillStyle = fillGrd;//"#808080";
			
			// starting point
			ctx.moveTo(contextWidth, contextHeight-40);
			// line 1 (horizontal)
			ctx.lineTo(contextWidth - 25, contextHeight-40);
			// line 2 (angled)
			ctx.lineTo(contextWidth - 40, contextHeight-25);
			// line 3 (vertical)
			ctx.lineTo(contextWidth - 40, contextHeight);
			ctx.stroke(); // draw the line
			// return to origin
			ctx.lineTo(contextWidth, contextHeight);
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
    
	// absorb filters the damage and returns the actual damage to the player;
    //  by default, it absorbs nothing and returns all damage
    // The parameter: the OBJECT must have a "damage" variable indicating
    //  how much damage this object applies.
    this.absorb = function(object){        
        return object.damage;
    }
    
    // action that occurs after the shield is destroyed:
    //  (e.g. this may returns some damage to the player);
    // by default, restore's unit (AKA player) to no shield
    this.destroy = function(){
        unit.shield = noShield(this.unit);
    }
}

// a default shield that acts as a placeholder for the shield slot
//	and returns all damage uncalculated
function noShield(unit){
	// create the new "shield"
	var newShield = new shield(unit);
	// set draw functions to nothing
	newShield.draw = function(ctx){}
	newShield.drawIcon = function(ctx){}
	// by default, the shield object absorbs no damage
	return newShield;
}

// A basic armor shield that temporarily absorbs all damage
//  to itself, and eventually releases the damage
function armorShield(unit){
	// create shield, and pass in parameters for a gray-blue-colored gradient level:
    var newShield = new shield(unit,
							230, 230, 230, // inner RGB
							100, 100, 140); // outer RGB
    
    // this shield's health (starts at 100 for
	//	animation sake, but depletes at twice
	//	the normal speed. Essentially, this shield
	//	has the equivalent of 50 health.
    newShield.health = 100;
	
	// upon action, this shield should display that the
	//	damage was absorbed
	newShield.actionText = "Absorbed";
    
    // calculate damage absorbtion: if damaged, then return the
    //  amount of damage to be applied to the player
    newShield.absorb = function(object){
        this.health -= 2*object.damage; // deplete this shield's health (twice normal)
		
		// adjust the timer (in this case, it just indicates the shield's health):
		this.timer = this.health;
		if(this.timer < 0)
			this.timer = 0;
		
        var overflow = 0; // overflow (how much damage was not absorbed)
        if(this.health <=0){
            // adjust overflow appropriately
            overflow = 0 - Math.ceil(this.health / 2);
            // destroy this sheild (resets unit to default shield)
            this.destroy();
        }
		// return the overflow damaged
        return overflow;
    }
    
	// emblem that represents this shield
	newShield.drawEmblem = function(ctx){
		drawArmorShieldIcon(ctx);
        //ctx.font = "9pt Arial";
        //ctx.fillStyle = "#FFFF00";
		//ctx.globalAlpha = 0.6;
		//var text = "" + this.health + "%";
		//var xOffset = ctx.measureText(text).width / 2;
        //ctx.fillText(text, 0-xOffset, 4);
	}
	
    return newShield;
}


// A more complex shield that temporarily reduces all damage
//  by half, and but runs out after 10 seconds
function reductionShield(unit){
	// create shield, and pass in parameters for a blue-colored gradient level:
    var newShield = new shield(unit,
							0, 141, 255, // inner RGB
							125, 188, 188); // outer RGB
    
    // this shield's health
    newShield.health = 100;
    
    // this shield is light blue in color
    newShield.color = "#33CCFF";
    
    // return half of the damage that object applies
    newShield.absorb = function(object){
        return Math.floor(object.damage/2);
    }
    
	// emblem that represents this shield
	newShield.drawEmblem = function(ctx){
		drawReductionShieldIcon(ctx);
	}
    
    return newShield;
}

// A complex shield that temporarily reflects all bullets back to
//	the direction that they came from.
function reflectiveShield(unit){
    var newShield = new shield(unit);
    
    // this shield's health
    newShield.health = 100;
	
	// upon action, this shield should display that the
	//	damage was reflected
	newShield.actionText = "Reflected";
    
    // this shield is light blue in color
    newShield.color = "#33FF99";
    
    // IF the object in question is a bullet, the reflective
	//	shield does not return any (0) damage. Instead, it reverses
	//	the direction of the given bullet and adds it as part of
	//	the player's bullet set, and reverses the velocity.
	//	That is, the bullet is literally reflected back towards
	//	the enemy.
	// If the object is anything else (not a bullet), simply return
	//	the original damage.
    newShield.absorb = function(object){
		// check if this object is a bullet
        if(object instanceof bullet){
			// reverse the velocity of the bullet
            object.speedX = -1 * object.speedX;
            object.speedY = -1 * object.speedY;
			// add the bullet to its unit's bullet array
			unit.bullets.push(object);
			// return 0 damage as reduced by the shield
            return 0;
		}
        return object.damage;
    }
    
    // override the draw function to just a triangle that surrounds
    //  the ship (unit).
	// This drawn surrounding triangle is a light-green forcefield-like
	//	animation surrounding the ship
    newShield.draw = function(ctx){
        ctx.save();
        
		// width of lines = 5, 60% alpha, and light green color
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = this.color;
            
        ctx.beginPath();
            // draw a triangle to the LEFT side of the ship
            ctx.moveTo(0, 14);
            ctx.lineTo(-17, 19);
            ctx.lineTo(0, -20);
            // outline with the provided color
            ctx.stroke();
        ctx.closePath();
        
        ctx.beginPath();
            // draw a triangle to the RIGHT side of the ship
            ctx.moveTo(0, 14);
            ctx.lineTo(17, 19);
            ctx.lineTo(0, -20);
            // outline with the provided color
            ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    
	// emblem that represents this shield
	newShield.drawEmblem = function(ctx){
		drawReflectiveShieldIcon(ctx);
	}
	
    return newShield;
}