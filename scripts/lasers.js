/* File comments updated: Tuesday, June 5, 2012 at 7:48 PM
 *
 * LASER class: provides a core system for lasers (one per frame)
 *	that get animated on the screen. Each laser object is a beam
 *	that provides its start and end location (points), as well as
 *	the target it impacts and how much damage it does (this is damage
 *	for the frame of life it has), and provides a basic draw function.
 */


// basic core laser system (provides a quick and simple laser object
//	that is designed to last one frame
// PARAMETERS:	startX, startY - the starting location (origin) of the beam
//				endX, endY - the ending (impact) location of the beam, and also the
//					official (x, y) position that this laser will receive
//				color - the color of the laser beam (alpha will be 0.6)
//				damage - the amount of damage this laser inflicts (per frame)
//				target - the target that this laser hits (e.g. an enemy, or player)
function basicLaser(startX, startY, endX, endY, color, damage, target){
	// origin location
	this.startX = startX;
	this.startY = startY;
	
	// impact location
	this.x = endX;
	this.y = endY;
	
	// damage of the laser
	this.damage = damage;
	
	// target that this laser affects
	this.target = target;
	
	// color of this laser beam
	this.color = color;
	
	// active: used by the containing class (e.g. player) to determine whether or
	//	not this laser is still active, or if it has already been used up.
	this.active = true;
	
	// draw function: this function draws the laser beam (for this frame) onto the screen,
	//	starting from the origin point and ending at the impact point
	this.draw = function(ctx){
		ctx.save();
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 3;
			ctx.globalAlpha = 0.6;
			ctx.beginPath();
				ctx.moveTo(this.startX, this.startY);
				ctx.lineTo(this.x, this.y);
				ctx.stroke();
			ctx.closePath();
		ctx.restore();
	}
}


//	PLAYER LASER BEAM
// creates a new laser object, specified for a player
// PARAMETERS: origin point, impact point, and the enemy that this laser hits
function playerLaser(startX, startY, endX, endY, target){
	// startX, startY are origin locations
	// endX, endY are impact locations
	// "#33FF66" is the color - light green
	// 15/FPS - the damage per frame, scaled by framerate: 0.5 damage per frame on
	//		a 30 FPS runtime; this is exactly 15 damage per second
	// target - the target reference (the enemy) that this laser hits
	return new basicLaser(startX, startY, endX, endY, "#33FF66", 15/FPS, target);
}


function vampireDrainLaser(startX, startY, endX, endY, rate, target){
	return new basicLaser(startX, startY, endX, endY, "#FF0000", rate, target);
}

function vampireFeedLaser(startX, startY, endX, endY, target){
	return new basicLaser(startX, startY, endX, endY, "#CC3300", 0, target);
}