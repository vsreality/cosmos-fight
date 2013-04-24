/*
 *  Icon draw functions for shield icons
*/


// function to draw the armor shield icon
function drawArmorShieldIcon(ctx){
    // image of the icon
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    // draw the shield curve
    ctx.beginPath();
    ctx.arc(0, 0, 10.5, 0.8*Math.PI, 2.2*Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    // draw the ship icon
    ctx.strokeStyle = "#880000";
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(7, 9);
    ctx.lineTo(-7, 9);
    ctx.lineTo(0, -7);
    ctx.closePath();
    ctx.stroke();
}


// function to draw the reduction shield icon
function drawReductionShieldIcon(ctx){
    // image of the icon
    // draw the shield curve
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    //ctx.moveTo(-11, 0);
    //ctx.lineTo(11, 0);
    ctx.arc(0, 25, 25, 1.32*Math.PI, 1.68*Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    
    // draw the incoming bullets
    ctx.strokeStyle = "#BB0000";
    ctx.beginPath();
    ctx.moveTo(-2, -12);
    ctx.lineTo(-2, -3);
    ctx.moveTo(2, -12);
    ctx.lineTo(2, -3);
    ctx.moveTo(0, 12);
    ctx.lineTo(0, 3);
    ctx.stroke();
    ctx.closePath();
}


// function to draw the reflective shield icon
function drawReflectiveShieldIcon(ctx){
    // image of the icon
    // draw the shield line
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
        ctx.arc(0, 25, 25, 1.32*Math.PI, 1.68*Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    
    // draw the two bullets
    ctx.lineWidth = 3.0;
    ctx.beginPath();
        var gradient = ctx.createLinearGradient(-4, -15, -4, 9);
        gradient.addColorStop(0, "rgb(192, 192, 192)");
        gradient.addColorStop(1, "rgb(160, 0, 0)");
        ctx.strokeStyle = gradient;
        ctx.moveTo(-4, -12);
        ctx.lineTo(-4, 9);
        ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
        gradient = ctx.createLinearGradient(4, -9, 4, 15);
        gradient.addColorStop(0, "rgb(160, 0, 0)");
        gradient.addColorStop(1, "rgb(192, 192, 192)");
        ctx.strokeStyle = gradient;
        ctx.moveTo(4, 12);
        ctx.lineTo(4, -9);
    ctx.closePath();
    ctx.stroke();
}