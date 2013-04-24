/*
 *  TEST LEVELS
 */
 
function createLevelEnemies(){
	// create level1 from the abstract level
	var lvl = new level();
	
	// name of this level
	lvl.setLevelName("Enemies Level");
	// name of NEXT level
	lvl.setNextLevelName("Enemies Again");
	// reference to this level creation function (to reload it)
	lvl.setLoadLevel(createLevelEnemies);
	// reference to the next level (when called in the finish menu)
	lvl.setNextLevel(createLevelEnemies);
    
	// make player immune to damage
	lvl.player.invulnerable = true;
	
	// random color function
	lvl.getRandomColor = function(){
		var x = getRandNum(6);
		switch(x){
			case 0: return "#FFFF00";
			case 1: return "#FF0000";
			case 2: return "#00FF00";
			case 3: return "#0000FF";
			case 4: return "#00FFFF";
			case 5: return "#FF00FF";
			default: return "#0000FF";
		}
	}
	
    // create phase 1
    lvl.addPhase(function(lvl){
		var e1 = basicEnemy(50, 150, Math.PI/2, 0);
		e1.setColor(lvl.getRandomColor());
		var e2 = corvetteEnemy(150, 150, Math.PI/2, 0);
		var e3 = miniBoss1(250, 150, Math.PI/2, 0);
		var e4 = smallTowerEnemy(325, 150, Math.PI/2, 0);
		var e5 = Star3Enemy(400, 150, Math.PI/2, 0);
		var e6 = vampireEnemy(500, 150, Math.PI/2, 0);
		e6.updateEnemy = function(){} // so it doesn't move
		var e7 = createFanEnemy(650, 150);
		var e8 = octopusEnemy(100, 300, Math.PI/2, 0);
		
		lvl.enemySys.addEnemy(e1);
		lvl.enemySys.addEnemy(e2);
		lvl.enemySys.addEnemy(e3);
		lvl.enemySys.addEnemy(e4);
		lvl.enemySys.addEnemy(e5);
		lvl.enemySys.addEnemy(e6);
		lvl.enemySys.addEnemy(e7);
		lvl.enemySys.addEnemy(e8);
	});

	// start phase 1
    lvl.start();
    
	return lvl;
}