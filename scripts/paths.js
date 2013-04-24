/*
 *	PATH CLASS
 * Contains the Path object, and subpaths, allowing units to move in accordance
 *	to the specified path algorithm(s).
 * Also contains other movement-related algorithms, including the follow target object
 */
 

/* Main path constructor: creates a path object that generates position placement
 *	over time.
 */
function Path(){
	// position coordinates that this path is currently on
	this.pathX = 0;
	this.pathY = 0;
	
	// an array of all path pieces that collectively make up this path object's
	//	overall course. These are looped as the path continues to update.
	this.subpaths = new Array();
	
	// index into the current subpath (starting with the first one)
	this.pathIndex = 0;
	
	// add a new subpath to the list of subpaths that construct this overall path system
	this.addSubpath = function(newPath){
		this.subpaths.push(newPath);
		return this;
	}
	
	// updates the current subpath and the position of this path object based
	//	on the subpath's current position
	this.update = function(){
		// check if there is a subpath available; if not, return
		if(this.subpaths.length == 0)
			return;
		
		// otherwise, update the current subpath and set the current path position
		this.subpaths[this.pathIndex].update();
		this.pathX = this.subpaths[this.pathIndex].xFunction(this.subpaths[this.pathIndex].tVal);
		this.pathY = this.subpaths[this.pathIndex].yFunction(this.subpaths[this.pathIndex].tVal);
		
		// check if the subpath's delta ran out; if it did, proceed to the next subpath
		//	and reset this subpath
		if(this.subpaths[this.pathIndex].tVal >= 1){
			this.subpaths[this.pathIndex].reset();
			this.nextSubpath();
		}
	}
	
	// applies the path's current position coordinates to the given target object, rounding
	//	it off to the nearest whole for efficiency purposes of the HTML5 Canvas context
	this.applyPath = function(target){
		target.x = Math.round(this.pathX);
		target.y = Math.round(this.pathY);
	}
	
	// a function called to progress to the next subpath. If there are no subpaths
	//	available, this function does nothing. If the last subpath was just run,
	//	the paths loop over from the beginning.
	this.nextSubpath = function(){
		// check that the subpaths array has anything in it (if not, return)
		if(this.subpaths.length == 0)
			return false;
		
		// increment the path index. If the path index exceeds the number of subpaths,
		//	reset the counter to 0
		this.pathIndex++;
		if(this.pathIndex >= this.subpaths.length)
			this.pathIndex = 0;
		return true;
	}
}


// a generic subpath object
//	PARAMETER: duration (in seconds)
function Subpath(duration){
	// the t-value and delta of the path's position
	this.tVal = 0;
	this.tDelta = 1/secToFrames(duration);
	
	// updates the current tVal by the current delta and 
	this.update = function(){
		this.tVal += this.tDelta;
	}
	
	// resets the current path the its starting location. Also randomizes
	//	the path if it is able to be randomized.
	this.reset = function(){
		this.tVal = 0;
	}
	
	// OVERRIDE: These are the x and y coordinate functions needed to be overridden with
	//	the path's specific algorithm. Each function should return the immediate x and y
	//	position based on the given tVal, respectively (parametertic function).
	// These functions both return 0 by default.
	this.xFunction = function(t){ return 0; } // returns x-value
	this.yFunction = function(t){ return 0; } // returns y-value
}


// a basic line path that runs the course of a line over the period of the given duration
//	(in seconds)
function createLinePath(startX, startY, endX, endY, duration){
	// create the new subpath object
	var newPath = new Subpath(duration);
	
	// set up the definitional data for this line path object
	newPath.startX = startX;
	newPath.startY = startY;
	newPath.endX = endX;
	newPath.endY = endY;
	
	// x-function for the parametric equation of a line
	newPath.xFunction = function(t){
		return this.startX + t*(this.endX-this.startX);
	}
	
	// y-function for the parametric equation of a line
	newPath.yFunction = function(t){
		return this.startY + t*(this.endY-this.startY);
	}
	
	// return the new subpath
	return newPath;
}


// elliptical path (also works for a circular path)
//	PARAMETERS: centerX, centerY = center of the ellipse
//				widthRadius = radius at horizontal center of the ellipse
//				heightRadius = radius at vertical center of the ellipse
//				counterclockwise = (true/false) the direction of the path, TRUE is
//						the standard counterclockwise angle set
//				startAngle = the angle at which the path begins (direction is concidered)
function createEllipticalPath(centerX, centerY, widthRadius, heightRadius,
		counterclockwise, startAngle, duration){
	// create the new subpath object
	var newPath = new Subpath(duration);
	
	// setup the definitional data for this path
	newPath.centerX = centerX;
	newPath.centerY = centerY;
	newPath.rW = widthRadius;
	newPath.rH = heightRadius;
	newPath.counterclockwise = counterclockwise;
	newPath.startAngle = startAngle;
	
	// x-function for the parametric equation of the ellipse
	newPath.xFunction = function(t){
		// scale t by 2*PI to apply the fully eliptical path, and offset by the start angle
		t = t*2*Math.PI + this.startAngle;
		// if counterclockwise, inverse t (so the path goes in the opposite direction)
		if(counterclockwise)
			t *= -1;
		return this.centerX + this.rW * Math.cos(t);
	}
	
	// y-function for the parametric equation of the ellipse
	newPath.yFunction = function(t){
		// scale t by 2*PI to apply the fully eliptical path, and offset by the start angle
		t = t*2*Math.PI + this.startAngle;
		// if counterclockwise, inverse t (so the path goes in the opposite direction)
		if(counterclockwise)
			t *= -1;
		return this.centerY + this.rH * Math.sin(t);
	}
	
	// return the new subpath
	return newPath;
}



// circular path: this is an elliptical path, just with a single radius
function createCircularPath(centerX, centerY, radius,
		counterclockwise, startAngle, duration){
	return createEllipticalPath(centerX, centerY, radius, radius,
								counterclockwise, startAngle, duration);
}

// cubic bezier curve path: staring at startX and startY, with the
//	three x, y coordinates that follow as the path's specifications.
// Path ends at x3, y3.
function createCubicBezierPath(startX, startY, x1, y1, x2, y2, x3, y3, duration){
	// create the new subpath
	var newPath = new Subpath(duration);
	
	/*newPath.x0 = startX;
	newPath.y0 = startY;
	newPath.x1 = x1;
	newPath.y1 = y1;
	newPath.x2 = x2;
	newPath.y2 = y2;
	newPath.x3 = x3;
	newPath.y3 = y3;*/
	
	// create inner line paths for each of the three segments that create
	//	the main bezier lines for this bezier curve path
	newPath.l1 = createLinePath(startX, startY, x1, y1, duration);
	newPath.l2 = createLinePath(x1, y1, x2, y2, duration);
	newPath.l3 = createLinePath(x2, y2, x3, y3, duration);
	
	newPath.xFunction = function(t){
		// find parametric x-values on the main bezier lines
		var point1_x = this.l1.xFunction(t);
		var point2_x = this.l2.xFunction(t);
		var point3_x = this.l3.xFunction(t);
		
		// find the parametric x-value midpoints on the lines created
		//	from the three points above
		var midPoint1_x = xOnLine(point1_x, point2_x, t);
		var midPoint2_x = xOnLine(point2_x, point3_x, t);
		
		// return the parametric x-value from the two midpoints
		return xOnLine(midPoint1_x, midPoint2_x, t);
	}
	
	newPath.yFunction = function(t){
		// find parametric y-values on the main bezier lines
		var point1_y = this.l1.yFunction(t);
		var point2_y = this.l2.yFunction(t);
		var point3_y = this.l3.yFunction(t);
		
		// find the parametric y-value midpoints on the lines created
		//	from the three points above
		var midPoint1_y = yOnLine(point1_y, point2_y, t);
		var midPoint2_y = yOnLine(point2_y, point3_y, t);
		
		// return the parametric y-value from the two midpoints
		return yOnLine(midPoint1_y, midPoint2_y, t);
	}
}

function xOnLine(xStart, xEnd, t){
	return xStart + t*(xEnd-xStart);
}
function yOnLine(yStart, yEnd, t){
	return yStart + t*(yEnd-yStart);
}


// right angle paths / rectangular paths
// triangular paths
// S paths
// 8-loop paths

// bezier curve paths

// randomizing paths


// returns a POINT object {x, y} that is the position on the line
//	defined by the two points (start, end points, respectively) on
//	the given interval given by t.
// This function operates by calculating the line's parametric equation
// POINT Object: point.x, point.y are the two properties
function pointOnLine(startP, endP, t){
	// determine the x and y coordinate by the parametric equations
	var xVal = startP.x + t*(endP.x-startP.x);
	var yVal = startP.y + t*(endP.y-startP.y);
	return {x:xVal, y:yVal}; // return the new object
}

// Create a cubic (start point and three reference points) Bezier curve
//	object that stores the points and calculates the given position of any
//	value by a given T (time) value
function bezierCurveCubic(p0, p1, p2, p3){
	// save all reference points
	this.p0 = p0;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	// return position on the bezier curve by t (time 0 to 1)
	this.getPoint = function(t){
		var pA = pointOnLine(this.p0, this.p1, t);
		var pB = pointOnLine(this.p1, this.p2, t);
		var pC = pointOnLine(this.p2, this.p3, t);
		var startP = pointOnLine(pA, pB, t);
		var endP = pointOnLine(pB, pC, t);
		return pointOnLine(startP, endP, t);
	}
}



// Follow Target System: a system designed for automatically following
//	a target using direction vector calculations.
// To begin following the given target, call the go() function. To stop
//	following (to decelerate to a stop), call the stop() function.
// Each frame requires a call to the update(x, y) function, which takes the position
//	of the unit doing the following to update directional vector values.
// PARAMETERS:
//	speed - the maximum speed of the unit (automatically adjusted for current FPS)
//	accDelta - acceleration rate (per frame - scaled by FPS)
//	deAccDelta - deceleration rate (per frame - scaled by FPS)
// 	target - a target object that has getX() and getY() functions that will be the focus
//			unit to follow by this system.
function FollowTargetSystem(speed, accDelta, deAccDelta, target){
	// static physical calculation values
	this.maxSpeed = speed;
	this.accDelta = accDelta;
	this.deAccDelta = deAccDelta;
	this.dT = (1000/FPS);
	
	// acceleration values
	this.acc = 0;
	this.accelerating = false;
	
	// target
	this.target = target;
	
	// position change values
	this.dx = 0;
	this.dy = 0;
	// angle
	this.angle = 0;
	
	// begin accelerating (start or continue moving)
	this.go = function(){
		this.accelerating = true;
	}
	
	// begin decelerating (stop moving - brake)
	this.stop = function(){
		this.accelerating = false;
	}
	
	// returns TRUE if accelerating, and false otherwise
	this.isAccelerating = function(){
		return this.accelerating;
	}
	
	// change the target of this system: "target" must have getX() and getY() functions.
	this.setTarget = function(target){
		this.target = target;
	}
	
	// update the dx and dy values for this frame.
	//	curX and curY are the current X and Y positions of the object that follows
	//	the target.
	this.update = function(curX, curY){
		// if accelerate, keep adding accDelta (scaled by dT) until max speed
		if(this.accelerating){
			this.acc += (this.accDelta * this.dT) / 1000;
			if(this.acc >= this.maxSpeed)
				this.acc = this.maxSpeed;
		}
		// otherwise, decelerate until stop using deAccDelta
		else{
			this.acc -= (this.deAccDelta * this.dT) / 1000;
			if(this.acc <= 0)
				this.acc = 0;
		}
		
		// find distance between this and target
		var new_dx = this.target.getX() - curX;
		var new_dy = this.target.getY() - curY;
		
		// find angle to the target: use arctan function and conditions to find the
		//	exact angle in the direction of the target
		var new_angle;
		if(new_dx == 0){
			if(new_dy < 0)
				new_angle = -Math.PI;
			else
				new_angle = 0;
		}
		else{
			new_angle = Math.atan(new_dy / new_dx) - Math.PI/2;
			if(new_dx < 0)
				new_angle = new_angle + Math.PI;
		}
		
		// use the angle to determine the x and y directions
		new_dx = Math.cos(new_angle+Math.PI/2) ;
		new_dy = Math.sin(new_angle+Math.PI/2);
		
		// set the current dx and dy to new_dx and new_dy, respectively, after they
		//	are scaled by speed and acceleration
		this.dx = ((new_dx * this.acc) * this.dT) / 1000;
		this.dy = ((new_dy * this.acc) * this.dT) / 1000;
		this.angle = new_angle;
	}
	
	// returns the CHANGE in the x-direction to complete for the next update
	this.getXdelta = function(){
		return this.dx;
	}
	
	// returns the CHANGE in the y-direction to complete for the next update
	this.getYdelta = function(){
		return this.dy;
	}
	
	// returns the absolute angle that faces the target
	this.getAngle = function(){
		return this.angle;
	}
}