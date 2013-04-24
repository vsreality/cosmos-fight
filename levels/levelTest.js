/*
 *  TEST LEVELS
 */
 
function createLevelTest(){
	// create level1 from the abstract level
	var level1 = new level();
	
	// combo point counter and achievement tracking variables
	level1.deadEnemies = 0;
	level1.comboCounter = 0;
    level1.notHit = true;
	
	// name of this level
	level1.setLevelName("Test Level");
	// name of NEXT level
	level1.setNextLevelName("Test Level again");
	// reference to this level creation function (to reload it)
	level1.setLoadLevel(createLevelTest);
	// reference to the next level (when called in the finish menu)
	level1.setNextLevel(createLevelTest);
	
	// action that occurs when an enemy dies
	level1.onEnemyDead = function(enemy){

	}
	
	// action that occurs when the player gets hit by an enemy bullet
	level1.onPlayerHit = function(bullet){

	}

    
    // create phase 1
    level1.addPhase(function(lvl){
		// Star enemy
		var star1 = Star3Enemy(0, 0, 0, 0);
		
		// create and add path:
		var starPath = new Path();
		/*
		// add two paths: both paths loop sequentially
		starPath.addSubpath(createCircularPath(
				areaWidth/2-100, areaHeight/2, // center of circle
				100, // radius
				false, 0, 5)); // path is clockwise, start angle is 0, path traversed in 5 seconds
		starPath.addSubpath(createCircularPath(
				areaWidth/2+100, areaHeight/2,
				100,
				true, Math.PI, 5));
		*/
		var sX = 0;
		var sY = 0;
		var eX = 0;
		var eY = 0;
		for(var i=0; i<5; i++){
			if((i%2)==0)
				eX = areaWidth-25;
			else
				eX = 25;
			eY = getRandNum(areaHeight-50)+25;
			starPath.addSubpath(createLinePath(sX, sY, eX, eY, 5));
			sX = eX;
			sY = eY;
		}
		starPath.addSubpath(createLinePath(sX, sY, 0, 0, 5));
		
		/*
		createCircularPath(
				areaWidth/2-100, areaHeight/2, // center of circle
				100, // radius
				false, 0, 5));*/
				
		star1.path = starPath;
		star1.updateEnemy = function(){
			this.path.update(); // update the path
			this.path.applyPath(this); // apply the path to this enemy object
			this.setAngle(this.getAngle()-Math.PI/30);
		}
		
		lvl.enemySys.addEnemy(star1);
		
		
		
		//createWormEnemy(50, 0, 0, 0, 0, -1, 20,15, 12, 10, 8, 6, 4, 2)
		//lvl.enemySys.addEnemy(createWormEnemy(400, 250, 0, 0, 0, -1, 30, 20, 15, 10, 8, 6, 4, 2));
		
		// Corvette Enemy
		/*
		var tower1 = smallTowerEnemy(-55,0,0,0)
		tower1.updateEnemy = function(){
				this.setAngle(this.getAngle()+Math.PI/180);
		}
		var tower2 = smallTowerEnemy(-23,0,0,0)
		tower2.updateEnemy = function(){
				this.setAngle(this.getAngle()+Math.PI/180);
		}
		var tower3 = smallTowerEnemy(9,0,0,0)
		tower3.updateEnemy = function(){
				this.setAngle(this.getAngle()+Math.PI/180);
		}
		var tower4 = smallTowerEnemy(41,0,0,0)
		tower4.updateEnemy = function(){
				this.setAngle(this.getAngle()+Math.PI/180);
		}
		
		lvl.enemySys.addEnemy(corvetteEnemy(500, 150, 0, 0)
			.addPart(tower1)
			.addPart(tower2)
			.addPart(tower3)
			.addPart(tower4)).updateEnemy = function(){
				this.setAngle(this.getAngle()-Math.PI/2000);
				for(var i=0; i<this.parts.length; i++)
					rotatePoint(this.parts[i], -Math.PI/2000);
			}
			*/
	});

	// start phase 1
    level1.start();
    
	return level1;
}



function createLevelTest2(){
	// create level1 from the abstract level
	var testLevel = new level();
	
	// name of this level
	testLevel.setLevelName("Test Level 2");
	// name of NEXT level
	testLevel.setNextLevelName("Test Level again");
	// reference to this level creation function (to reload it)
	testLevel.setLoadLevel(createLevelTest2);
	// reference to the next level (when called in the finish menu)
	testLevel.setNextLevel(createLevelTest2);
    
	// create vampire enemy test
	/*testLevel.addPhase(function(lvl){
		var vEnemy = vampireEnemy(contextWidth/2, 100, 0, 4);
		lvl.enemySys.addEnemy(vEnemy);
	});
	
	// create path test
	testLevel.addPhase(function(lvl){
		// put player out of harm's way
		lvl.player.x = 20;
		lvl.player.y = 20;
		lvl.createWarningText("Player moved to corner", 1, 2);
		
		// line path test
		// create enemy:
		var enemy1 = lvl.enemySys.createEnemy();
		enemy1.x = areaWidth/2;
		enemy1.y = 50;
		// create and add path:
		var testPath1 = new Path();
		var subpath1 = createLinePath(areaWidth/2, 50, areaWidth/2, areaHeight-50, 10);
		subpath1.randomize(50, 0, 100, 50);
		testPath1.addSubpath(subpath1);
		enemy1.path = testPath1;
		enemy1.updateEnemy = function(){
			this.path.update(); // update the path
			this.path.applyPath(this); // apply the path to this enemy object
		}
		
		// elliptical path test
		var enemy2 = lvl.enemySys.createEnemy();
		enemy2.x = areaWidth/2;
		enemy2.y = 50;
		var testPath2 = new Path();
		testPath2.addSubpath(createEllipticalPath(
				areaWidth/2, areaHeight/2, // center of ellipse (x, y)
				areaWidth/2-50, areaHeight/2-50, // width radius, height radius
				true, Math.PI/2, 10)); // path is counter-clockwise, start angle is 180, takes 10 seconds
		enemy2.path = testPath2;
		enemy2.updateEnemy = function(){
			this.path.update();
			this.path.applyPath(this);
		}
		
		// two circular paths test
		var enemy3 = miniBoss1(areaWidth/2-200, areaWidth/2, Math.PI/2, 0);
		lvl.enemySys.addEnemy(enemy3);
		var testPath3 = new Path();
		// add two paths: both paths loop sequentially
		testPath3.addSubpath(createCircularPath(
				areaWidth/2-100, areaHeight/2, // center of circle
				100, // radius
				false, 0, 5)); // path is clockwise, start angle is 0, path traversed in 5 seconds
		testPath3.addSubpath(createCircularPath(
				areaWidth/2+100, areaHeight/2,
				100,
				true, Math.PI, 5));
		enemy3.path = testPath3;
		enemy3.updateEnemy = function(){
			this.path.update();
			this.path.applyPath(this);
		}
	});*/
	
    // create base boss test
    testLevel.addPhase(function(lvl){
        var boss = lvl.enemySys.addEnemy(createCentralCoreBoss(400, 150))
        boss.start();
	});
    
    // create fan boss test
    testLevel.addPhase(function(lvl){
        lvl.createWarningText("Fan Boss", 2, 1);
        lvl.createEvent(secToFrames(3)).onTime = function(l){
                l.enemySys.addEnemy(createFanEnemy(400, 150));
                l.createLoopedEvent(1).onTime = function(l){
                        if(l.enemyCount() == 0){
                            this.deactivate();
                            l.nextPhase();
                        }
                    } // end of inner onTime
            } // end of outer onTime
	});

	// start phase 1
    testLevel.start();
    
	return testLevel;
}