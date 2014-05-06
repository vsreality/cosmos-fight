/* GLOBAL FUNCTIONS */

// TODO - (possibly) add these functions into a class:
//	e.g. Cosmos.getRandNum(), or cosmos.pathRoundedRectangle(), etc.

// returns a random number from 0 to the given range
function getRandNum(range){
    return Math.floor(Math.random() * range);
}

// converts the given time in seconds to the time in frames
//  (adjusted by the current FPS rate)
function secToFrames(sec){
    return Math.ceil(sec*FPS);
}

// Create path of rounded rectangle on context
function pathRoundedRectangle(ctx,x,y,w,h,r){
	// start point (upper left corner [after the arc])
	ctx.moveTo(x+r, y);
	// top line
	ctx.lineTo(x+w-r, y);
	// arc in upper right corner (all arcs are quarter circles of radius 10)
	// arc: centerX, centerY, radius, startAngle, endAngle, clockwise
	ctx.arc(x+w-r, y+r, r, -Math.PI/2, 0, false);
	// right side line
	ctx.lineTo(x+w, y+h-r);
	// lower right corner arc
	ctx.arc(x+w-r, y+h-r, r, 0, Math.PI/2, false);
	// bottom line
	ctx.lineTo(x+r, y+h);
	// lower left corner
	ctx.arc(x+r, y+h-r, r, Math.PI/2, Math.PI, false);
	// left side line
	ctx.lineTo(x, y+r);
	// upper left corner
	ctx.arc(x+r, y+r, r, Math.PI, 3*Math.PI/2, false);
}

// returns the distance between two points, given by coordinates
function getDistance(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// returns the distance between two points (squared, for optimization),
//	given by coordinates
function getDistance2(x1, y1, x2, y2){
	return ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// returns 1 if positive, -1 if negative, or 0 if 0
function getSign(val){
    if(val < 0)
        return -1;
    else if(val > 0)
        return 1;
    else
        return 0;
}

// returns true if the first given string ends with the given suffix
//	Source: http://stackoverflow.com/questions/280634/endswith-in-javascript
function strEndsWith(str, suffix){
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}