//============================ wormEnemy ==============================================
function wormEnemy(x, y, r, angle, speed){
    var newEnemy = new enemy(x, y, angle, speed);
    
    newEnemy.name = "Worm node";
    newEnemy.maxHealth = 10;
    newEnemy.health = 10;
    newEnemy.score = 10;
    newEnemy.weight = 50; // inflicts 200 damage if player crashes into it
    newEnemy.speed = Math.sqrt(speedX*speedX + speedY*speedY);
    newEnemy.r=r;
    newEnemy.nodes = new Array();
	
    // balance: this variable is used to animate the enemy (see draw function)
    newEnemy.balance = -10;
    newEnemy.dBalance = (30/FPS); // change in balance per frame based on FPS
    
    newEnemy.addCollision(new standardCollision(r));
	// OVERRIDE
	// function called by enemy abstract class when enemy falls off screen:
	//	This function resets the enemy position to the top of the screen at a
	//	random X position.
    newEnemy.onOutOfScreen = function(){
        
    }

    newEnemy.update = function(){
        var length = this.nodes.length;
		// increase x and y values based on x and y velocities
        if(!this.parent){
            this.x += this.speedX;
            this.y += this.speedY;
            
        }else{
            var dx = this.parent.speedX - this.x;
            var dy = this.parent.speedY - this.y;
                
            var distance = Math.sqrt(dx*dx+dy*dy);
            var normal_distance = this.r + this.parent.r;

            var k = (distance - normal_distance)/distance;
                
            this.speedX = dx*k;
            this.speedY = dy*k;

            this.x += this.speedX - this.parent.speedX;
            this.y += this.speedY - this.parent.speedY;
        }
            
		// if enemy goes under the screen, call the outOfScreen event function
        if(this.y > areaHeight+30 || this.x<-30 || this.x > areaWidth+30 || this.y<-30){
            this.onOutOfScreen(); // function overriden in extended enemy classes
        }
    }
    
    
	// OVERRIDE
    // Draw function called each frame to draw this enemy onto the canvas.
	//	This draws the enemies specific appearance and animations
    newEnemy.draw = function(ctx){
        var length = this.nodes.length;
        // update enemy animation (using balance variable)
        if(this.balance>=10)
            this.balance=-10;
        else // update balance based on dBalance (change value)
            this.balance += this.dBalance;
        
		// save context (start new drawing stack)
        ctx.save();
        ctx.translate(this.getX(), this.getY());
        ctx.strokeStyle = "FF0000";
        ctx.fillStyle = "FFFFFF";
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();    
		// restore the context draw stack (finish drawing this enemy)
        ctx.restore();
    }
    
    newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.basicExplosion(this.getX(), this.getY()));
    }
    
    newEnemy.hitEffect = function(x, y){
        //something
    }
    
    return newEnemy;
}

// Function created worm enemy of any length and return enemy objects
// There are 7 requirement arguments, additional arguments will create new nodes of worm
// Example: createWormEnemy(x, y, speedX, speedY, dirX, dirY, 30, 20, 10);
// It create worm with 3 nodes with radiuses 30, 20, 10
function createWormEnemy(x, y, angle, speed, dirX, dirY, r){
    var d = Math.sqrt(dirX*dirX + dirY*dirY);
    dirX /= d;
    dirY /= d;
    var firstWorm = wormEnemy(x, y, r, angle, speed);
    firstWorm.name = "Worm head";
    var newWorm = firstWorm;
    for(var i=7;i<arguments.length;i++){
        var currentWorm = wormEnemy(
            (newWorm.r + arguments[i])*dirX,
            (newWorm.r + arguments[i])*dirY,
            arguments[i],
            speedX,
            speedY
        );
        newWorm.addPart(currentWorm);
        newWorm = currentWorm;
    }
    return firstWorm;
}