/*
 *  Icon draw functions for weapons icons
*/


// function to draw the tripple gun icon
function drawTrippleGunIcon(ctx){
    ctx.strokeStyle = "#FFFF00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(-5, -6);
    ctx.moveTo(0, 8);
    ctx.lineTo(0, -11);
    ctx.moveTo(5, 8);
    ctx.lineTo(5, -6);
    ctx.closePath();
    ctx.stroke();
}


// function to draw the disperse gun icon
function drawDisperseGunIcon(ctx){
    ctx.strokeStyle = "#FFFF00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 7);
    ctx.lineTo(-12, 0);
    ctx.moveTo(-2, 6);
    ctx.lineTo(-7, -8);
    ctx.moveTo(0, 4);
    ctx.lineTo(0, -11);
    ctx.moveTo(2, 6);
    ctx.lineTo(7, -8);
    ctx.moveTo(4, 7);
    ctx.lineTo(12, 0);
    ctx.closePath();
    ctx.stroke();
}


// function to draw the disperse gun icon
function drawBasicLaserIcon(ctx){
    ctx.strokeStyle = "#FFFF00";
    ctx.fillStyle = "#FFFF00";
	// inner arc (circle)
    ctx.beginPath();
		ctx.arc(0, 0, 5, 0, 2*Math.PI, false);
		ctx.fill();
    ctx.closePath();
	// draw the line through
    ctx.lineWidth = 2;
	ctx.beginPath();
		ctx.moveTo(0, -12);
		ctx.lineTo(0, 12);
		ctx.stroke();
	ctx.closePath();
}


// function to draw the disperse gun icon
function drawSuperLaserIcon(ctx){
    ctx.strokeStyle = "#FFFF00";
    ctx.fillStyle = "#FFFF00";
	// inner arc (circle)
    ctx.beginPath();
		ctx.arc(0, 0, 5, 0, 2*Math.PI, false);
		ctx.fill();
    ctx.closePath();
	// draw all the lines
    ctx.lineWidth = 2;
	ctx.beginPath();
		ctx.moveTo(-11, 0);
		ctx.lineTo(11, 0);
		ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
		ctx.moveTo(0, -12);
		ctx.lineTo(0, 11);
		ctx.stroke();
	ctx.closePath();
}