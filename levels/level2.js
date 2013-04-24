/*
	LEVEL 2
*/
 
function createLevel2(){
	var level2 = new level();
	
	// name of this level
	level2.setLevelName("Level 2");
	// name of NEXT level
	level2.setNextLevelName("Level 3"); // DNE
	// reference to this level creation function (to reload it)
	level2.setLoadLevel(createLevel2);
	// reference to the next level (when called in the finish menu)
	level2.setNextLevel(createLevel1); // no level exists yet)
	
	level2.onEnemyDead = function(enemy){
        // randomly generate a bonus
        if(getRandNum(6) == 0)
            this.createRandomBonus(enemy.x, enemy.y);
	}
	
	level2.initEvents = function(){
		this.bonusSys.createHealthBonus(50, 75, 300);
		this.bonusSys.createHealthBonus(contextWidth-50, 75, 300);
		this.bonusSys.createHealthBonus(50, contextHeight-50, 300);
		this.bonusSys.createHealthBonus(contextWidth-50, contextHeight-50, 300);
	}
	
	//Phase 1 Create 30 enemies
    level2.addPhase(function(lvl){
		lvl.createLoopedEvent(secToFrames(0.4)).onTime = function(l){
			l.enemySys.createEnemy();
			
			var count = Math.floor(this.numLoops / 10);
			for(var i=0; i<count; i++)
				l.enemySys.createEnemy();
				
			if(this.numLoops == 15){  //15
				this.deactivate();
			}
		}
		level2.createEvent(secToFrames(10)).onTime = function(l){//25
			l.nextPhase();
		}
	});
	// wave of 20 enemies
	level2.addPhase(function(lvl){
		lvl.createWarningText("Incoming Wave! (20)", 5, 3);
		level2.createEvent(secToFrames(5)).onTime = function(l){
			for(var i=0; i<20; i++){// Create 20 enemies
				l.enemySys.createEnemy();
			}
			l.createLoopedEvent(1).onTime = function(l){
				if(l.enemySys.enemies.length == 10){
					this.deactivate();
					l.nextPhase();
				}
			}
		}
	});
	//Wave of 30 enemies
	level2.addPhase(function(lvl){
		lvl.createWarningText("Incoming Wave! (30)", 5, 3);
		for(var i=0; i<30; i++){//Create 30 enemies
			lvl.enemySys.createEnemy();
		}
		lvl.createLoopedEvent(1).onTime = function(l){
			if(l.enemySys.enemies.length == 0){
                this.deactivate();
				l.nextPhase();
			}
		}
	});
	
	level2.addPhase(function(lvl){
		lvl.shake(2);
		lvl.createWarningText("Final wave soon...", 5, 3);
		// create extra bonuses
		lvl.bonusSys.createHealthBonus(100, 200, 90);
		lvl.bonusSys.createHealthBonus(200, 200, 90);
		lvl.bonusSys.createTrippleGunBonus(contextWidth/2, 250, 90);
        lvl.bonusSys.createTrippleGunBonus(contextWidth/2, 350, 90);
        lvl.bonusSys.createHealthBonus(contextWidth-200, 200, 90);
		lvl.bonusSys.createHealthBonus(contextWidth-100, 200, 90);
		lvl.createEvent(secToFrames(8)).onTime = function(l){
			l.healBy = 5;
			for(var i=0; i<20; i++){// Create 20 small enemies
				l.enemySys.createEnemy();
			}
			for(var i=0; i<5; i++){// Create 5 small bosses
				l.enemySys.addEnemy(miniBoss1(getRandNum(contextWidth-60) + 30, -50, Math.PI/2, 1));
			}
			l.createLoopedEvent(1).onTime = function(l){
				if(l.enemyCount() == 0){
					l.nextPhase();
					this.deactivate();
				}
			}
		}
	});
	
	// start the level
	level2.start();
    
	return level2;
}