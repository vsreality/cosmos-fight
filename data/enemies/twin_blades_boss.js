// FAN ENEMY

// create the enemy core (the center of the enemy)
function fanEnemyCore(x, y){
	// create at x, y position, 0 angle, 0 speed
	var newEnemy = new enemy(x, y, 0, 0);
	
	// this enemy dies in 1 normal hit
	newEnemy.maxHealth = 10;
	newEnemy.health = 10;
	newEnemy.score = 1000;
	newEnemy.name = "Alien Core";
	newEnemy.weight = 200; // does 200 damage if player crashes into it
	newEnemy.height = 54;
	
	// add a very dark gradient color
	newEnemy.grd = context.createRadialGradient(0, 0, 0, 0, 0, 20);
	newEnemy.grd.addColorStop(0, "#000000");// inner
	newEnemy.grd.addColorStop(1, "#000015");// outer
	
	// the core is shielded from all damage until all of its parts are dead
	newEnemy.partsAlive = 8;
	
	// draw function: draw a gradient dark core of the enemy
	newEnemy.draw = function(ctx){
		ctx.save();
		
		ctx.fillStyle = this.grd;
		ctx.beginPath();
		ctx.arc(this.getX(), this.getY(), 20, 0, 2*Math.PI, false);
		ctx.fill();
		// if core is still shielded, draw the shield around it
		if(this.partsAlive > 0){
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#003030";
			ctx.stroke();
		}
		ctx.closePath();
		
		ctx.restore();
	}
	
	// modify the applyDamage function to only do anything if all pieces
	//	are dead (the core is immune if all enemies are not dead)
	newEnemy.applyDamage = function(dmg){
		if(this.partsAlive <= 0){
			this.health -= dmg;
			if(this.health < 0)
				this.health = 0;
		}
    }
	
	// decrease the number of parts by 1 (register that a part died), and if
	//	all parts die, expload with a bunch of bullets
	newEnemy.registerPartDeath = function(){
		this.partsAlive--;
		// if this is the last part to die, create a massive bullet storm
		if(this.partsAlive == 0){
			this.addWeapon(new enemyWeapon(30))
				.onShootEvent = function(enemy){
					for(var i=0; i<80; i++){
						// x y angle speed dmg color size
						var bullet = enemyBullet(
							Math.cos(Math.PI/40*i)*20,
							Math.sin(Math.PI/40*i)*20,
							(Math.PI/40*i),
							8, 10,
							"#007070");
						
						translatePoint(bullet, enemy.getX(), enemy.getY());
						enemy.enemySys.addBullet(bullet);
					}
				}
			for(var i=0; i<80; i++){
				// x y angle speed dmg color size
				var bullet = enemyBullet(
					Math.cos(Math.PI/40*i)*20,
					Math.sin(Math.PI/40*i)*20,
					(Math.PI/40*i),
					8, 30,
					"#007070");
				
				translatePoint(bullet, this.getX(), this.getY());
				this.enemySys.addBullet(bullet);
			}
			/*var bullet = enemyBullet(15, 0, 
                                    enemy.getAngle(), 
                                    6, 10);
			bullet.color = "#006060";
            rotatePoint(bul1, enemy.getAngle());
            translatePoint(bul1,enemy.getX(), enemy.getY());

            enemy.enemySys.addBullet(bul1);*/
		}
	}
	
	// add a basic circular collision
	newEnemy.addCollision(new standardCollision(20));
	
	// when enemy dies, create a giant explosion
	newEnemy.deathEffect = function(){
        this.enemySys.addEffect(this.enemySys.effectSys.giantExplosion(this.getX(), this.getY()));
    }
    
	// when enemy is hit by a bullet, create a spark where the bullet hit
    newEnemy.hitEffect = function(x, y){
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, (3*Math.PI)/2));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
	
	return newEnemy;
}

// create a fragment of the fan enemy (one of the triangles)
//	slanted on the given angle and positioned on the RELATIVE x, y position
function fanEnemyFragment(x, y, angle){
	var newEnemy = new enemy(x, y, angle, 0);
	newEnemy.maxHealth = 100;
	newEnemy.health = 100;
	newEnemy.score = 50;
	newEnemy.weight = 50;
	newEnemy.name = "Automated Blade";
	newEnemy.height = 40;
	
	newEnemy.draw = function(ctx){
		ctx.save();
		
        // adjust the context position and angle
		ctx.translate(this.getX(), this.getY());
        ctx.rotate(this.angle);
        
		ctx.strokeStyle = "#3F5F3F";
		ctx.fillStyle = "#090950";
		
		// start drawing enemy
        ctx.beginPath();
		ctx.moveTo(20, 0);
		ctx.lineTo(-20, -10);
		ctx.lineTo(-20, 10);
		ctx.lineTo(20, 0);
		/*ctx.moveTo(-10, 0);
		ctx.lineTo(10, 0);
		ctx.lineTo(0, 40);
		ctx.lineTo(-10, 0);*/
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
		
		ctx.restore();
	}
	
	// when the enemy dies, register the death the the core
	newEnemy.onDeathEvent = function(){
		this.parent.registerPartDeath();
	}
	
	newEnemy.deathEffect = function(){
		// create a basic explosion
		this.enemySys.addEffect(this.enemySys.effectSys.basicExplosion(this.getX(), this.getY()));
	}
    
	// when enemy is hit by a bullet, create a spark on the side that the bullet hit
    newEnemy.hitEffect = function(x, y){
		// create an angle
        var angle;
		// if bullet hit from the right, shift angle to the right side
        if(x > this.getX())
            angle = Math.PI/3;
		// if bullet hit from the left, shift angle to the left side
        else if(x < this.getX())
            angle = (2*Math.PI)/3;
		// otherwise, it hit in the middle so create the effect directed down
        else
            angle = (3*Math.PI)/2;
		// push the effect into the enemySys effect system
        this.enemySys.addEffect(this.enemySys.effectSys.basicSpark(x, y, angle));
    }
	
	// when enemy is burned by a laser, create a circular spart on the location of impact
	newEnemy.burnEffect = function(x, y){
		this.enemySys.addEffect(this.enemySys.effectSys.basicBurnEffect(x, y));
	}
	
	// fire a bullet every 10 to 15 seconds (randomly chosen value)
	newEnemy.addWeapon(new enemyWeapon(Math.ceil(10 + getRandNum(6))))
        .onShootEvent = function(enemy){
            var bul1 = enemyBullet(15, 0, 
                                    enemy.getAngle(), 
                                    6, 10);
            rotatePoint(bul1, enemy.getAngle());
            translatePoint(bul1,enemy.getX(), enemy.getY());

            enemy.enemySys.addBullet(bul1);
        }
	
	// add the collision triangle object
	newEnemy.addCollision(new standardCollision(40))
        .addObject(new cTriangle({x:20,y:0},{x:-20,y:-10},{x:-20,y:10}));
	
	return newEnemy;
}

// put together all pieces of the fan enemy and return the whole set,
//	referenced by the core (parent) of the enemy set
function createFanEnemy(x, y){
	// construct the core part
	var core = fanEnemyCore(x, y);
	// attach 8 parts "blades" to the core
	for(var i=0; i<8; i++){
		// calculate the angle of the part by 
		var ePart = fanEnemyFragment(
			Math.cos(Math.PI/4*i)*65,
			Math.sin(Math.PI/4*i)*65,
			Math.PI/4*i);
		// insert code to update the positions of each enemy
		ePart.spinSpeed = (432/FPS)/180; // 14.4 degrees per frame, to radians
		ePart.maxSpinSpeed = (810/FPS)/180; // 27 degrees per frame, to radians
		ePart.minSpinSpeed = (270/FPS)/180
		// update scaled by FPS
		ePart.spinSpeedDelta = (3/FPS)/180; //.1 degrees per frame, to radians
		ePart.updateEnemy = function(){
			// rotate the enemy around 
			var a = this.spinSpeed;
			this.spinSpeed += this.spinSpeedDelta;
			if(this.spinSpeed >= this.maxSpinSpeed || this.spinSpeed <= this.minSpinSpeed)
				this.spinSpeedDelta *= -1;
			rotatePoint(this, -a);
			this.setAngle(this.getAngle()+a);
		}
		core.addPart(ePart);
	}
	return core;
}