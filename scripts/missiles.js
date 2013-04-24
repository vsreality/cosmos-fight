/* File comments updated: Wednesday, June 27, 2012 at 7:37 PM
 *
 *  MISSILES CLASS
 */
 
 
 /* Standard missile constructor: sets up a target position, and
  * flies towards that target location and detonates.
  * PARAMETERS:
  *     startX, startY - the starting coordinate of the missile when launched
  *     targetX, targetY - the point to which the missile flies and detonates at
  *     speed - the speed at which this missile travels
  *     damage - the amount of damage this missile inflicts at the center of impact
  *     blastRadius - how wide the explosion reaches (damage decreases towards the edge)
  *     targetList - an array of all objects that can be afflicted by the blast. These
  *         targets must be standard collision-based objects with applyDamage(),
  *         hitEffect(), getX(), and getY() functions.
  *         In the case of a player object, the player must be pushed into an array container.
  *         In the case of enemies, pass in the enemies array.
  */
function StandardMissile(startX, startY, targetX, targetY,
        speed, damage, blastRadius, targetList, parentSys){
    // initialize positions of the missile
    this.x = startX;
    this.y = startY;
    
    // destination locations of the missile (where it detonates)
    this.targetX = targetX;
    this.targetY = targetY;
	
	// calculate the orientation angle using the start and target locations
    var distX = targetX - startX;
    var distY = targetY - startY;
	this.angle = Math.atan(distY/distX);
    if(distX < 0)
        this.angle += Math.PI;
	
	// bullet speed (x and y)
	this.speed = speed;
    this.speedX = speed*Math.cos(this.angle)*(30/FPS); // scaled speed by FPS
    this.speedY = speed*Math.sin(this.angle)*(30/FPS); // scaled speed by FPS
	
    // a link to the parent system (that contains this missile - such as enemySys)
    this.parentSys = parentSys;
    
    // crete a collision object for this missile
    this.collision = new standardCollision(13)
        .addObject(new cTriangle({x:-10,y:-4},{x:-10,y:4},{x:10,y:-4})) // body 1
        .addObject(new cTriangle({x:-10,y:4},{x:10,y:-4},{x:10,y:4}))   // body 2
        .addObject(new cTriangle({x:10,y:-4},{x:10,y:4},{x:15,y:0}));   // head
	this.collision.parent = this;
	
	// return the current x and y locations of the missile, respectively
	this.getX = function(){
		return this.x;
	}
	this.getY = function(){
		return this.y;
	}
	
    // set the speed (x and y) of this missile manually
	this.setSpeedX = function(speedX){
		this.speedX = speedX * (30/FPS);
		return this;
	}
	this.setSpeedY = function(speedY){
		this.speedY = speedY * (30/FPS);
		return this;
	}
    
    // remains TRUE as long as the missile is still flying; false after
    //  it already detonated and no longer has a destination.
    this.alive = true;
	
	// the amount of damage this bullet inflicts on hit
    this.damage = damage;
    
    // the blast radius (when the missile explodes, blast radius
    //  indicates how far the damage is disperesed from the center
    //  of the impact. The furter away from the center, the less
    //  damage the impact does
    this.blastRadius = blastRadius;
    
    // set up targets
    this.targetList = targetList;
	
	// color of the missile (animation color)
    this.color = "#000000";
    
    // find sign of distance between the x-coordinates and then y-coordinates of
    //  the target and start values (non-absolute)
    this.xSign = getSign(this.getX()-this.targetX);
    this.ySign = getSign(this.getY()-this.targetY);
    
	// update function: update the missile x and y position on the
	//	bases of x and y speed values.
    this.update = function(){
        // get the signs of the current non-absolute distance calculations
        var curXsign = getSign(this.getX()-this.targetX)
        var curYsign = getSign(this.getY()-this.targetY)
        
        // if either sign mismatched, or the points are the same, then
        //  the missile is either on, or passed, its target, so apply
        //  the detonation.
        if( (curXsign != this.xSign) ||
            (curYsign != this.ySign) ||
            (curXsign == 0 && curYsign == 0) ) // if both are 0, this is the same point
                {
            // adjust position to the target location
            this.x = this.targetX;
            this.y = this.targetY;
            // detonate the missile here
            this.detonate();
        }
        
        // otherwise just update the position by the delta (speedX, speedY)
        else{
            this.x += this.speedX;
            this.y += this.speedY;
            
            // create the particle effect for flying
            /*this.parentSys.effectSys.addEffect(
                this.parentSys.effectSys.missileRocketFire(
                    this.getX()-20, this.getY(), this.angle));*/
        }
    }
    
    // draw function: animate this missile on the screen.
    this.draw = function(ctx){
        ctx.save();
        
        // translate and rotate to the appropriate position
        ctx.translate(this.getX(), this.getY());
        ctx.rotate(this.angle);
        
        // temporary
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(-10, -4, 20, 8);
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
            ctx.moveTo(10, 4);
            ctx.lineTo(15, 0);
            ctx.lineTo(10, -4);
            ctx.lineTo(10, 4);
            ctx.fill();
        ctx.closePath();
        //ctx.strokeStyle = "#FFFFFF";
        //ctx.beginPath();
        //    ctx.arc(0, 0, this.blastRadius, 0, 2*Math.PI, false);
        //    ctx.stroke();
        //ctx.closePath();
        
        ctx.restore();
    }
    
    
    // function called when the missile blows up; the detonation
    //  event adds the effect for blowing up as well as adding the
    //  proper damage to the surrounding targets
    this.detonate = function(){
        // after detonation, the missile is no longer "alive"
        this.alive = false;
        
        // locate all targets and determine how much damage to apply,
        //  and generate a hit-effect in the center of the damaged target
        for(var i=0; i<this.targetList.length; i++){
            var dist = getDistance(this.getX(), this.getY(),
                this.targetList[i].getX(), this.targetList[i].getY());
            
            // if the blast is close enough to the target, apply the damage
            //  and all effects
            if(dist <= this.blastRadius){
                // get damage scale amount by calculating the distance vs. the
                //  blastRadius ratio
                // adjust distance to be maximally potent to 30 pixels within
                //  the center
                if(dist <= 30)
                    dist = 0;
                var dmgScale = 1 - (dist/this.blastRadius);
                
                // reduce maximum damage by the damage scale and round it up
                var dmg = Math.ceil(this.damage*dmgScale);
                
                // apply the damage
                this.targetList[i].applyDamage(dmg);
            }
        }
        
        // create the explosion effect
        this.parentSys.effectSys.addEffect(
            this.parentSys.effectSys.missileExplosion(this.getX(), this.getY()));
    }
    
    // returns TRUE if the missile is still alive/active, and FALSE if
    //  the missile already detonated, and thus it is no longer active.
    this.isAlive = function(){
        return this.alive;
    }
}


function enemyStandardMissile(startX, startY, targetX, targetY,
        speed, damage, blastRadius, enemySys){
    // create a container for the player
    var playerTargetListWrapper = new Array();
    playerTargetListWrapper.push(enemySys.lvl.player);
    
    // create the new missile
    var newMissile = new StandardMissile(
        startX, startY, targetX, targetY,
        speed, damage, blastRadius, playerTargetListWrapper, enemySys);
    
    return newMissile;
    
    /*
    // override some aspects of the missile to produce it as an "enemy"
    //  for the enemySystem
    newMissile.deathEffect = function(){}
    newMissile.burnEffect = function(){}
    newMissile.hitEffect = function(){}
    
    newMissile.onDeathEvent = function(){
        this.detonate();
    }
    
    newMissile.onOutOfScreen = function(){}
    newMissile.drawHealthBar = function(ctx){}
    applyDamage = function(dmg){}*/
}