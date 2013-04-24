/* File comments updated: Tuesday, June 11, 2012
 *
 *  ENEMY WEAPON CLASS
 */
function noneWeapon(){
	this.update = function(){};
	this.draw = function(ctx){};
}
 
 function enemyWeapon(sInt){
	this.enemy;
	this.shootInterval = sInt*(FPS/30);
	
	this.setShootInterval = function(sInt){
		this.shootInterval = sInt*(FPS/30);
	}
	
	// Events
	this.onShootEvent = function(){}
	 
	// shoot interval: how many frames to wait for next firing of bullet (scaled by FPS)
    this.shootTimer = new LoopedTimer(this.shootInterval);
    this.shootTimer.property = this;
    this.shootTimer.onTime = function(enemy){
		if(!enemy.parent){
			if(enemy.y>5)
				enemy.weapon.onShootEvent(enemy);
		}
		else{
			enemy.weapon.onShootEvent(enemy);
		}
    }
    
	this.update = function(){
		this.shootTimer.update();
	}
	this.draw = function(ctx){};
}

function basicEnemyWeapon(sInt){
	var newWeapon = new enemyWeapon(sInt);
	newWeapon.onShootEvent = function(enemy){
        enemy.enemySys.addBullet(enemyBullet(enemy.getX(), enemy.getY() + 30, Math.PI, 6, 10));
    }
	return newWeapon;
}