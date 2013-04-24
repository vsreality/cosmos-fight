/*
 *  Icon draw functions for health icons
*/


// function to draw the add health icon
function drawHealthIcon(ctx){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(-12, -2,24, 4);
    ctx.fillRect(-2, -12, 4, 24);
}


// function to draw the add life icon
function drawAddLifeIcon(ctx){
    // draw the inner heart
    ctx.fillStyle = "#FF0000"; // color of the heart (red)
    // scale to radius
    var width = 2.5;
    var height = 2.5;
    
    // create the actual lines
    ctx.beginPath();		
    ctx.moveTo(0*width, -2*height);
    ctx.bezierCurveTo(-4*width, -5*height, -5*width, 1*height, 0*width, 4*height);
    ctx.bezierCurveTo(5*width, 1*height, 4*width, -5*height, 0*width, -2*height);
    ctx.closePath();
    ctx.fill();
}