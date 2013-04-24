/*
 *  LEVEL: SURVIVAL MODE
 */
 
function createLevelSurvival(){
	var survivalLevel = new level();
	
	// name of this level
	survivalLevel.levelName = "Survival Level";
	// reference to this level creation function (to reload it)
	survivalLevel.setLoadLevel(createLevelSurvival);
	
	// payer has only one live
	survivalLevel.player.lives = 1;
	
	// chance to randomly generate a bonus when an enemy dies
	survivalLevel.onEnemyDead = function(enemy){
        if(getRandNum(10) == 0)
            var newBonus = this.createRandomBonus(enemy.x, enemy.y);
	}
	
	survivalLevel.counter = 0;
	
	// add score for collecting bonuses
	survivalLevel.onCollectBonus = function(bonus){
		var scoreBonus = 50 * this.counter;
		this.player.score += scoreBonus;
		this.createFloatingTextPlayerPowerup("+" + scoreBonus + " Bonus Score",
			this.player.x, this.player.y+25);
	};
	
	survivalLevel.onPlayerCrash = function(enemy){
		this.player.score += 1000;
		this.createFloatingTextPlayerPowerup("Destruction Bonus! +" + 1000,
			this.player.x, this.player.y+25);
	}
	
	survivalLevel.onPlayerDead = function(){
		// create a death/game over menu
		var deathMenu = new StandardMenu("Game Over");
		// add a message and the score
		deathMenu.pushText("You faught bravely!");
		deathMenu.pushText("Score: " + this.player.score);
		// create a restart level button
		var restartButton = deathMenu.pushButton("Restart " + this.levelName);
		// add a reference to this level's reload function to the button
		restartButton.loadLevel = this.loadLevel;
		// create the onClick event to re-load this level
		restartButton.onClick = function(){
            currentLevel = this.loadLevel();
        }
		// add the button to return to the main menu
        deathMenu.pushButton("Main Menu").onClick = function(){
            currentLevel = mainMenu;
        }
		
		// set the death menu as the current level/menu
        currentLevel = deathMenu;
	};
	
	survivalLevel.createNextPhase = function(){
			this.counter++;
			var phaseFunction = function(lvl){
				// create the next wave
				var numEnemies = getRandNum(5+lvl.counter)+5+lvl.counter;
				lvl.createWarningText("Wave #" + lvl.counter + "! (" + numEnemies + ")", 3, 2);
				var newEvent = lvl.createEvent(secToFrames(5));
				newEvent.numEnemies = numEnemies;
				newEvent.onTime = function(l){
					for(var i=0; i<this.numEnemies; i++)
						l.enemySys.createEnemy();
					
					l.createLoopedEvent(1).onTime = function(l){
						if(l.enemySys.enemies.length == 0){
							this.deactivate();
							l.createNextPhase();
							l.moveToPhase(1);
						}
					}
				}
			}
			this.phaseList[1] = phaseFunction;
		}
	
	
	// create the first phase
	survivalLevel.addPhase(function(lvl){
			var img=new Image();
			img.src="images/example.png";
			lvl.createDialogBox("Fight until you die.", "The Girl", img, null, 3);
			lvl.setDialogsFinishEvent(
				function(){
					this.lvl.nextPhase();
				});
        });
		
	// create the repeating phase 2
	survivalLevel.createNextPhase();
		
	// start the phase
	survivalLevel.start();
	
	return survivalLevel;
}