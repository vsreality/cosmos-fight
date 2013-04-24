function createLevel3(){
    var level3 = new level();

    // name of this level
    level3.setLevelName("Level 3");

    // reference to this level's creation function (to reload it)
    level3.setLoadLevel(createLevel3); // we add the very function we're creating now

    // reference to the next level (when called in the finish menu)
    //level3.setNextLevel(createLevel4);

    // name of NEXT level
    level3.setNextLevelName("Level 4");

    // add the first phase to the level
    level3.addPhase(function(lvl){
        // create warning text to indicate that an enemy wave is coming
        lvl.createWarningText("Incoming Wave! (10)", 3, 2);
        // create an event that triggers in 5 seconds, and set the following function to it:
        lvl.createEvent(secToFrames(5)).onTime = function(l){
            // create 10 enemies
            for(var i=0; i<10; i++){
                l.enemySys.createEnemy();
            }

            // check to see if enemies are all dead each frame with a looped event
            l.createLoopedEvent(1).onTime = function(l){
                // if enemies are all dead, continue to next phase
                if(l.enemyCount() == 0){
                    // clean up looped event
                    this.deactivate();
                    // move on to the next phase
                    l.nextPhase();
                }
            }
        }
    });

	// start the level
	level3.start();
	
    // return our level to the game engine
    return level3;
}