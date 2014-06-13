/*
 *  LEVEL 1
 */
 
function createLevel1(){
	// create level1 from the abstract level
	var level1 = new Level();
	
	// combo point counter and achievement tracking variables
	level1.deadEnemies = 0;
	level1.comboCounter = 0;
    level1.notHit = true;
	
	// name of this level
	level1.setLevelName("Level 1");
	// name of NEXT level
	level1.setNextLevelName("Level 2");
	// reference to this level creation function (to reload it)
	level1.setLoadLevel(createLevel1);
	// reference to the next level (when called in the finish menu)
	level1.setNextLevel(createLevel2);
	
	// action that occurs when an enemy dies
	level1.onEnemyDead = function(enemy){
		/*var addScore = enemy.score;
		addScore += (2 * (this.deadEnemies - this.comboCounter));
		this.deadEnemies++;
		// update score
		this.player.score += addScore;*/
        
        // randomly generate a bonus (possibly)
        if(getRandNum(5) == 0)
            var newBonus = this.createRandomBonus(enemy.x, enemy.y);
        
        //this.createFloatingTextEnemyHit("" + addScore, enemy.x, enemy.y);
	}
	
	// action that occurs when the player gets hit by an enemy bullet
	level1.onPlayerHit = function(bullet){
        if(bullet.appliedDamage > 0)
            this.notHit = false;
		//this.comboCounter = this.deadEnemies;
	}
	
	// set the game area to be wider
	level1.enableGameArea(1000, 500);
	
	// add all images
	level1.images.add("kate", "images/cosgirl_v2.png");
	// to slow it down for testing
	/*level1.images.add([
			["a0","http://vsreality.com/win/dir/getImage.php?d0=desktop&d1=anime&name=anime_300.jpg"],
			["a1","http://vsreality.com/win/dir/getImage.php?d0=desktop&d1=anime&name=anime_301.jpg"],
			["a2","http://vsreality.com/win/dir/getImage.php?d0=desktop&d1=anime&name=anime_302.jpg"],
			["a3","http://vsreality.com/win/dir/getImage.php?d0=desktop&d1=anime&name=anime_303.jpg"],
			["a4","http://vsreality.com/win/dir/getImage.php?d0=desktop&d1=anime&name=anime_304.jpg"]
		]);*/
	level1.sounds.add("intro_instructions", "audio/speech/intro_instructions.mp3");
    
    // create phase 1
    level1.addPhase(function(lvl){
			lvl.createDialogBox("Welcome to Cosmos Fight! Use the arrow keys or W-A-S-D to " +
				"move, and press SPACE to shoot.", "Kate Anderson",
				lvl.images.get("kate"), lvl.sounds.get("intro_instructions"), 10);
			//lvl.createDialogBox("If you die, then you suck.", "President Amabo",
			//	lvl.images.get("amabo"), lvl.sounds.get("die_suck"), 5);
			/*lvl.createDialogBox("Images are working!", "Test Image 1",
				lvl.images.get("a0"), null, 1);
			lvl.createDialogBox("Images are working!", "Test Image 2",
				lvl.images.get("a1"), null, 1);
			lvl.createDialogBox("Images are working!", "Test Image 3",
				lvl.images.get("a2"), null, 1);
			lvl.createDialogBox("Images are working!", "Test Image 4",
				lvl.images.get("a3"), null, 1);
			lvl.createDialogBox("Images are working!", "Test Image 5",
				lvl.images.get("a4"), null, 1);*/
			lvl.setDialogsFinishEvent(
				function(){
					this.lvl.createLoopedEvent(secToFrames(2)).onTime = function(l){
						l.enemySys.createEnemy();
					
						var count = Math.floor(this.numLoops / 10);
						for(var i=0; i<count; i++)
							l.enemySys.createEnemy();
						
						if(this.numLoops == 15){
                            // stop the event
							this.deactivate();
							// phase finishes here
							l.nextPhase();
						}
					}
				});
        });
    
    // create phase 2 (wave 1)
    level1.addPhase(function(lvl){
            lvl.createWarningText("Incoming Wave! (10)", 3, 2);
            lvl.createEvent(secToFrames(5)).onTime = function(l){
                for(var i=0; i<10; i++){
                    l.enemySys.createEnemy();
                }
                
                l.createLoopedEvent(1).onTime = function(l){
                    if(l.enemyCount() == 0){
                        // finish event
                        this.deactivate();
                        // phase finishes here
                        l.nextPhase();
                    }
                }
            }
        });
    
    // create phase 3 (wave 2)
    level1.addPhase(function(lvl){
            lvl.createWarningText("Incoming Wave! (20)", 3, 2);
            lvl.createEvent(secToFrames(5)).onTime = function(l){
                for(var i=0; i<20; i++){
                    l.enemySys.createEnemy();
                }
                
                l.createLoopedEvent(1).onTime = function(l){
                    if(l.enemyCount() == 0){
                        // finish event
                        this.deactivate();
                        // phase finishes here
                        l.nextPhase();
                    }
                }
            }
        });
    
    // create phase 4 (wave 3)
    level1.addPhase(function(lvl){
            lvl.createWarningText("Incoming Wave! (30)", 3, 2);
            lvl.createEvent(secToFrames(5)).onTime = function(l){
                for(var i=0; i<30; i++){
                    l.enemySys.createEnemy();
                }
                
                l.createLoopedEvent(1).onTime = function(l){
                    if(l.enemyCount() == 0){
                        // finish event
                        this.deactivate();
                        // phase finishes here
                        l.nextPhase();
                    }
                }
            }
        });
    
    // create phase 5 (final boss)
    level1.addPhase(function(lvl){
			lvl.shake(2);
			lvl.createDialogBox("Did... did you hear that? What was that??", "Kate Anderson",
				lvl.images.get("kate"), null, 4);
			lvl.createDialogBox("Oh no! The boss is coming!", "Kate Anderson",
				lvl.images.get("kate"), null, 3);
			lvl.setDialogsFinishEvent(
				function(){
					lvl.createWarningText("Boss Time!!!", 2, 1);
					lvl.createEvent(secToFrames(3)).onTime = function(l){
						var boss1 = level1.enemySys.addEnemy(
								miniBoss1(
										display.getWidth() / 2,
										-50, 0.6, 1));
										
						boss1.player = l.player;
						// update script goes here
						boss1.updateEnemy = function(){
							var delta = this.player.y-this.y;
							if(Math.abs(delta-10)>20){
								this.y += delta/Math.abs(delta)*this.speedY;
								if(this.y>display.geteHeight()/3)
									this.y=display.geteHeight()/3;
							}
								
							if(this.x < this.player.x-20)
								this.x += this.speedX;
							else if(this.x > this.player.x+20)
								this.x -= this.speedX;
						}
						
						l.createLoopedEvent(1).onTime = function(l){
							if(l.enemyCount() == 0){
								if(l.notHit)
									l.createWarningText("Achievement WON: Don't get hit!", 3, 2);
								else
									l.createWarningText("You win! Level 1 Complete!", 3, 2);
									
								// create gifts
								l.bonusSys.createExtraLifeBonus(display.getWidth()/2, display.getHeight()/2, 30);
								
								var nlTimer = l.createEvent(secToFrames(5));
								nlTimer.property = l;
								nlTimer.onTime = function(q){
									q.nextPhase();
								}
								this.deactivate();
							}
						}
					}
				});
        });

	// start phase 1
    level1.start();
    
	return level1;
}