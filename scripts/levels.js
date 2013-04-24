/* File comments updated: Sunday, July 15, 2012 at 5:16 PM
 *
 *  LEVEL CLASS
 */
 
 // Generic level class: provides a basis for indivudual levels
 //		to script events and level progression
function level(){

	/***************** GAME AREA VARIABLES ****************/
	 
	// set the dimensions of the game area to the current screen size
	areaWidth = contextWidth;
	areaHeight = contextHeight;
	
	// create the area canvas to draw if area is active
	this.areaCanvas = document.createElement("canvas");
	this.areaCanvas.width = areaWidth;
	this.areaCanvas.height = areaHeight;
	
	// get the drawing context from the area canvas
	this.areaContext = this.areaCanvas.getContext("2d");
	
	// flag to determine whether or not the area is enabled
	this.areaEnabled = false;
	
	// function to enable a bigger game area (larger than the screen):
	//	parameters must be given as the width and height of the desired
	//	game area. In addition, the width and height must both be at least
	//	the same size as the screen's width and height, respectively.
	// If parameters are invalid, returns FALSE
	this.enableGameArea = function(width, height){
		// check if parameters are valid:
		if(width < contextWidth || height < contextHeight)
			return false;
		
		// set the global variables to the new width/height
		areaWidth = width;
		areaHeight = height;
		// set the area canvas to the new width/height
		this.areaCanvas.width = width;
		this.areaCanvas.height = height;
		// toggle the flag as true
		this.areaEnabled = true;
		
		return true;
	}
	
	// disable the game area. this function also resets the area size back
	//	to the screen size.
	this.disableGameArea = function(){
		// reset the global variables to the screen size
		areaWidth = contextWidth;
		areaHeight = contextHeight;
		
		// make sure player also resets if the current position is out
		//	of the bounds of the smaller area
		if(this.player.x > contextWidth-15)
			this.player.x = contextWidth-15;
		if(this.player.y > contextHeight-17)
			this.player.y = contextHeight-17;
	
		// untoggle the flag as false
		this.areaEnabled = false;
	}
	/******************************************************/
	
	
    // player and alive status
	this.player = new player();
    
    // space (the background of stars (space background)
    this.space = new space(context);
    //Create layers of space
    this.space.createLayer(25, 4);
    this.space.createLayer(50, 2);
    this.space.createLayer(100, 0.5);
	
    // containing systems: bonuses and enemies
	this.bonusSys = new bonusSystem();
	this.enemySys = new enemySystem(this);
	this.player.enemySys = this.enemySys; // give player a reference to the enemySys
    this.effectSys = new effectSystem();
	
	// duration for shaking (0 implies no shaking, else shake for that
	//	amount of frames
	this.shakeDuration = 0;
	// position of the shake (0, 0) means centered perfectly
	this.shakeX = 0;
	this.shakeXdelta = 4;
	this.shakeY = 0;
	this.shakeYdelta = 4;
	// function to shake for the given duration (in seconds)
	//	pass in 0 to stop shaking
	this.shake = function(duration){
		this.shakeDuration = secToFrames(duration);
	}
	
	//GUI System(Pause menu)
	this.guiSys = new GuiSystem();
	this.guiSys.level = this;
	//a rectangle that dims the screen when the menu is displayed
	this.guiSys.addElement(new GuiFillRectangle(0,0,contextWidth,contextHeight)).style = function(ctx){
		ctx.globalAlpha = 0.65;
		ctx.fillStyle = "#000000";
	}
	//add the rounded rectangle that contains the actual menu
	this.guiSys.addElement(
			new GuiRoundedRectangle(contextWidth/2,70,240,180,10))
		.center()
		.style = function(ctx){
				ctx.globalAlpha = 0.85;
				ctx.strokeStyle = "#FFFF00";
				ctx.fillStyle = "#000000";
		}
	//add the title of the menu
	this.guiSys.addElement(new GuiText("Game Menu", contextWidth/2, 100, "#AAAAFF", 18)).center();
	//add the restart level button
	this.restartButton = this.guiSys.addElement(
			createGuiTextButton("Restart Level",contextWidth/2, 150, 14));
	this.restartButton.center();
	//add a reference to the load level function here (set in the setLoadLevel function)
	this.restartButton.loadLevel = function(){}; // do nothing by default
	//link the restart buttons click action to run the load level function
	this.restartButton.onClick = function(){
			currentLevel = this.loadLevel();
		}
	//add a button to return to the level menu
	this.guiSys.addElement(createGuiTextButton("Exit to Menu",contextWidth/2, 190, 14)).center()
		.onClick = function(){
			currentLevel = levelMenu;
		}
	//add a button to resume the game (resumes the game and makes the pause menu go away)
	this.guiSys.addElement(createGuiTextButton("Resume Game",contextWidth/2, 230, 14)).center()
		.onClick = function(){
			currentLevel.paused=false;
		}
    
    // events: contains all active timer events
    //  for this level. Each event timer is updated
    //  in update() function.
    this.events = new Array();
    
    // texts: array that contains all interface text objects (e.g. warning text)
    //  and renders them on the screen
    this.texts = new Array();
	
	// floating text: array that contains all floating texts on the screen
	this.floatingTexts = new Array();
	
	// dialogBox system: the animated box over the screen that displays interactive
	//	text and the image of the character that speaks it. The dialogBox also
	//	contains the sound playback that is associated with it (if any).
	this.dialogSys = new dialogSystem(this);
	
	// if player is dead, the update system will not
	//	call updates on any player-related 
	this.playerDead = false;
	
	// keeps track of the current killstreak (how many enemies killed without getting hit)
	this.killStreak = 0;
	
	// keeps track of the current score bonus multiplier:
	//	each enemy kill increases it by one, each hit player takes
	//	reduces it by 1, and any crash reduces it to 0.
	this.bonusScoreMultiplier = 0;
	
	//Pause variable("true" when level paused)
	this.paused = false;
	
	// name of this level (declare in individual levels)
	this.levelName = "level";
	
	// name of the next level
	this.nextLevelName = "level";
	
	// set functions to set the name of this level, and the next level if applicable:
	this.setLevelName = function(name){
		this.levelName = name;
	}
	this.setNextLevelName = function(name){
		this.nextLevelName = name;
	}
	
	// a reference to functions to load this current level and the next one:
	//	this is used to automate level transitions and to re-load the current level
	// These functions must be overridden by specific levels
	this.loadLevel = function(){}
	this.nextLevel = function(){}
	
	// functions to set up the loadLevel and nextLevel functions
	//	PARAMETERS: the actual function reference to create the level
	this.setLoadLevel = function(level){
		this.loadLevel = level;
		this.restartButton.loadLevel = level;
	}
	this.setNextLevel = function(level){
		this.nextLevel = level;
	}
	
	// function that is called when the current level finishes:
	//	this function creates a level finished menu, which displays the score
	//	and provides an option to either restart the level, continue to the next
	//	level, or return to the main menu.
	// This function can be overridden in special circumstances
	this.onLevelFinished = function(){
		// create a menu for completing this level
		var winMenu = new StandardMenu("You win!");
		winMenu.setSpacing(80);
		
		// add a text displaying the score of completing this level
		winMenu.pushText("Your score was: " + this.player.score);
		
		// add a button to replay this level again
		var restartLevelButton = winMenu.pushButton("Replay " + this.levelName);
		// add the restart level link to the button
		restartLevelButton.replayThisLevel = this.loadLevel;
		// create the onClock event to reload the current level
		restartLevelButton.onClick = function(){
				currentLevel = this.replayThisLevel();
			}
		
		// add a button to continue to the next level
		winMenu.setSpacing(70);
		var nextLevelButton = winMenu.pushButton("Continue to " + this.nextLevelName);
		// add the next level function link to the button
		winMenu.setSpacing(75);
		nextLevelButton.loadNextLevel = this.nextLevel;
		// create the onClick event to load the next level
		nextLevelButton.onClick = function(){
				currentLevel = this.loadNextLevel();
			}
		
		// add a button to return to the main menu
		winMenu.pushTextButton("Return to Menu").onClick = function(){
				currentLevel = levelMenu;
			}
		
		// set the currentLevel as the menu
		currentLevel = winMenu;
	}
    
    // the init events: creates all events that run throughout the entire level.
    //  This function is used upon level start, or during a reset
    this.initEvents = function(){};
    
    // the current event list and index (defined by level scripts)
    this.currentPhase = 0;
    this.phaseList = new Array();
    
    // move to the next possible phase (if phase exists),
    //  otherwise, do nothing and return false
    this.nextPhase = function(){
        // check to make sure current phase is in bounds; if it is not,
		//	call the onLevelFinished event in 3 seconds
        if(this.currentPhase >= this.phaseList.length - 1){
			this.createWarningText("Level Complete!", 2, 1);
			this.createEvent(secToFrames(3)).onTime = function(lvl){
				lvl.onLevelFinished();
			}
        }
		else{
			// if all is well, increment curret phase and load it
			this.currentPhase++;
			this.phaseList[this.currentPhase](this);
		}
    }
    
    // move to the specified phase number (phases start at 0),
    //  and adjust currentPhase accordingly.
    // An invalid phase will create a javascript index-out-of-bounds error for
    //  the phaseList array.
    this.moveToPhase = function(phaseNum){
        this.currentPhase = phaseNum;
        this.phaseList[phaseNum](this);
    }
    
    // add a new phase into the list of phases. This will add the
    //  phase into the back of the list of phases
    this.addPhase = function(phaseFunction){
        this.phaseList.push(phaseFunction);
    }
	
	
	/*** action events:
    //  events that are triggered when a certain action
    //  occurs: such as an enemy dying or the player getting
    //  hit ***/
	
	// ON ENEMY DEAD: This is the GENERAL function called whenever an enemy
	//	dies. This function calculates the score addition as granted by this
	//	enemy, and then calls the onEnemyDead function as an extra event so
	//	any level can individually override it as necessary.
	this.onEnemyDead_GENERAL = function(enemy){
		// calculate the additional score
		var addScore = enemy.score;
		
		// increment the score by a multiplier given by the current killStreak,
		//	modified by difficulty level
		addScore += 2*this.bonusScoreMultiplier;
		
		// increment the killStreak by 1 more enemy
		this.killStreak++;
		
		// increment bonus score multiplier by 1 more enemy
		this.bonusScoreMultiplier++;
		
		// if at a 7x killStreak increment, add an extra bonus to the score
		if(this.killStreak % 10 == 0 && this.killStreak != 0){
			// calculate the extra bonus
			// multiply the score by 2 for each killStreak of 7
			addScore *= this.killStreak/2;
			// add the extra score to the player
			this.player.score += addScore;
			// adjust the display message with a killstreak indicator
			addScore = "" + addScore + " (" + this.killStreak + "x Bonus!)";
		}
		else{ // otherwise, if no killstreak
			// add the calculated score to the player's score normally
			this.player.score += addScore;
		}
		
		// create floating text indicating the score the player received
		//	above the now-dead enemy
		this.createFloatingTextEnemyHit("" + addScore, enemy.getX(), enemy.getY());
		
		// call the additional onEnemyDead event with the enemy as a parameter
        this.onEnemyDead(enemy);
	}
	
	// function that is called when an enemy dies (dead enemy is passed as a parameter)
	this.onEnemyDead = function(enemy){};
	
	
	// ON PLAYER HIT
	// general function called when the player is hit by a bullet. This function
	//	then triggers the onPlayerHit event, designed to be overridden by individual
	//	levels.
	this.onPlayerHit_GENERAL = function(bullet){
		// reset the killStreak to 0 (player got hit, so killstreak is reset)
		this.killStreak = 0;
		
		// reduce bonus multiplier by 1 (to a min of 0)
		this.bonusScoreMultiplier -= 1;
		if(this.bonusScoreMultiplier < 0)
			this.bonusScoreMultiplier = 0;
		
		// call the additional onPlayerHit event with the bullet as a parameter
		this.onPlayerHit(bullet);
	}
    
	// function that is called when player is hit (bullet that hits player is passed)
	this.onPlayerHit = function(bullet){};	
    
	
	// ON PLAYER LOSE LIFE
    // function that is called when player loses a life
	//	NOTE: This function works with the level's click(x, y) function
	//	below. See that function as well for more details.
    this.onPlayerLoseLife_GENERAL = function(){
		// remove all active texts on the screen
		this.texts = new Array();
		this.floatingTexts = new Array();
		// remove all active events
		this.events = new Array();
		// reset the shake counter
		this.shakeDuration = 0;
		
		// reset killStreak and bonus score multipliers
		this.killStreak = 0;
		this.bonusScoreMultiplier = 0;
		
		// create a special death text message
		var deathText = new textObject(
                            contextWidth/2,
                            contextHeight/2 - 20,
                            "You have died!",
                            "30pt MainFont",
                            "#FF0000",
                            -1, // -1 duration means it will last forever
                            0); // 0 fade time (we don't need a fadeout)
		this.texts.push(deathText);
		
		// if the player has lives remaining, display a message indicating
		//	score loss
		if(this.player.lives > 1){
			// create a score loss by 10% message
			var continueText = new textObject(
								 contextWidth/2, // center on screen by width
								 contextHeight/2 + 10, // center by Y + offset of 10
								 "You lose 10% of your score", // message
								 "12pt MainFont", // font
								 "#FF0000", // red color
								 -1, // -1 duration means it will last forever
								 0); // 0 fade time (we don't need a fadeout)
			this.texts.push(continueText);
		}
		
		// otherwise create a message indicating game over
		else{
			var continueText = new textObject(
								contextWidth/2, // center on screen by width
								contextHeight/2 + 10, // center by Y + offset of 10
								"Game Over! (you have no more lives left)", // message
								"12pt MainFont", // font
								"#FF0000", // red color
								-1, // -1 duration means it will last forever
								0); // 0 fade time (we don't need a fadeout)
				this.texts.push(continueText);
		}
		
		// create a click-to-continue text message
		var continueText = new textObject(
							contextWidth/2,
							contextHeight/2 + 50,
							"Click on the screen to continue",
							"12pt MainFont",
							"#A0A0A0",
							-1, // -1 duration means it will last forever
							0); // 0 fade time (we don't need a fadeout)
		this.texts.push(continueText);
		
		// add an explosion from the player into the effect system
		//	at the position where the player has died
		this.effectSys.addEffect(
			this.effectSys.giantRedExplosion(this.player.x, this.player.y));
		
		// toggle the player to be dead
		this.playerDead = true;
		
		// call the onPlayerLoseLife event (designed to be overridden by specific
		//	levels if they need it)
		this.onPlayerLoseLife();
    }
	
	// the general event called by onPlayerLoseLife_GENERAL:
	//	override this with the specific levels if need be
	this.onPlayerLoseLife = function(){}
    
	
	// ON PLAYER CRASH
    // function is called when player crashes into an enemy.
    //  returns TRUE if enemy dies, FALSE otherwise
    this.onPlayerCrash_GENERAL = function(enemy){
		var playerStillAlive = false;
		
		// apply the crash damage
		var dmgText = this.player.applyCrashDamage(enemy);
		
		// if player is still alive, calculate score multiplier penalty and
		//	create the enemy display effects
		if(this.player.isAlive()){
			// display the crash floating text
			this.createFloatingTextPlayerHit("" + dmgText + " (crashed)",
                            this.player.x, this.player.y);
			
			// reset killstreak to 0
			this.killStreak = 0;
			
			// deduct 20 kills from the score multiplier
			this.bonusScoreMultiplier -= 20;
			// make sure it's not less than 0
			if(this.bonusScoreMultiplier < 0)
				this.bonusScoreMultiplier = 0;
			
			// create an explosion effect on the area for the enemy crash
			//	explosion
			this.effectSys.addEffect(
				this.effectSys.midExplosion(enemy.x, enemy.y));
			
			// player is not dead, so set the return to true
			playerStillAlive = true;
		}
		
		// call the onPlayerCrash event for the level API
		this.onPlayerCrash(enemy);
		
		// return TRUE if player is still alive, FALSE if dead
		return playerStillAlive;
    };
    
	// function to override if necessary by the individual levels
	this.onPlayerCrash = function(enemy){}
	
	
	// ON COLLECT BONUS
	// function called when player collects a bonus (that bonus is passed as a parameter)
	this.onCollectBonus = function(bonus){};
    
	
	// ON PLAYER DEAD
	// function that is called when player dies (that is, when player's health
	//	reaches 0 AND the player has no more lives left). This function is called
	//	by onPlayerLoseLife_GENERAL()
	this.onPlayerDead = function(){
		// create a death/game over menu
		var deathMenu = new StandardMenu("Game Over");
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
	
	
	// IMAGES: a collection of all of the level's images stored
	//	in the Images object (see the Images class in data.js)
	this.images = new Images(this);
	
	// SOUNDS: a collection of all of the level's sound data, stored
	//	in the Sounds object (see the Sounds class in data.js)
	// sounds are played by the Audio engine
	this.sounds = new Sounds(this);
	
	
	// START FUNCTION
	//	loads all components of the level and then calls the startLevel
	//	function, which in turns starts the level's gameplay (starting with
	//	the first phase).
	this.start = function(){
		// create the loading level text: (-1 duration = infinite)
		this.createWarningText("Loading Level...", -1, 0);
		
		// toggle health and timer bars if settings has them enabled
		if(settings.showEnemyHealthBars)
			this.enemySys.toggleHealthBars();
		if(settings.showBonusTimerBars)
			this.bonusSys.toggleTimerBars();
		
		// set the Images list onload function to start this level
		//	when everything is loaded
		this.images.onload = function(){
				//this.parent.startLevel(); // parent is a reference to this level
				this.parent.sounds.loadSounds();
			}
			
		this.sounds.onload = function(){
				this.parent.startLevel();
			}
		
		// load all images (after this is finished, the
		//	onload function as defined above is triggered)
		this.images.loadImages();
	}
	
	// starts all initial events, displays the level name on the screen, and
	//	starts the first phase (if any) of the game. This function should be
	//	called by the start() function
	this.startLevel = function(){
		// clear off the texts
		this.texts = new Array();
		
		// create all initial events and setup
		this.initEvents();
		
		// display the level name for 3 seconds
		this.createBigText(this.levelName, 1, 2);
		
		// if this level has phases, start the first phase in 3 seconds (after the title disappears)
		this.createEvent(secToFrames(3)).onTime = function(lvl){
			if(lvl.phaseList.length > 0)
				lvl.phaseList[0](lvl);
		}
	}
	
    
    // UPDATE FUNCTION:
    //  called each frame to update all level subsystems
	this.update = function(){
		if(!this.paused){
			// if the player is currently dead, just update the effects
			//	and do not call any other updates (pause the game)
			if(this.playerDead){
				this.effectSys.update();
				return;
			}
			
			// update events
			//  if event is triggered, it will call its own
			//  trigger function.
			// if event is not alive (it died), delete it
			for(var i=0; i<this.events.length; i++){
				if(!this.events[i].isAlive()){
					this.events.splice(i, 1);
                    i--;
					continue;
				}
                else
                    this.events[i].update();
			}
			
			// update (reduce) screen shake duration if applicable
			if(this.shakeDuration > 0)
				this.shakeDuration--;
			
			// update systems
			//  each system has its own update functions internally
			this.player.update();
			this.bonusSys.update();
			this.enemySys.update();
			this.effectSys.update();
			this.space.update();
			this.dialogSys.update();
			
			// Update payer collision
			this.player.collision.updatePosition();
			
			// check if bullet hits player
			for(var i=0; i<this.enemySys.enemyBullets.length; i++){
				//Update enemy bullet position
				this.enemySys.enemyBullets[i].collision.updatePosition();
				// check if player intersects bullet
				if(isCollide(this.player.collision, this.enemySys.enemyBullets[i].collision)){
					// apply damage to player
					var dmgText = this.player.applyBulletDamage(this.enemySys.enemyBullets[i]);
					
					// create floating text
					this.createFloatingTextPlayerHit("" + dmgText,
						this.player.x, this.player.y);
					
					// apply function onPlayerHit with bullet and actual dmg count
					this.onPlayerHit_GENERAL(this.enemySys.enemyBullets[i]);
					this.enemySys.enemyBullets.splice(i, 1);
					i--;
				}
				
				// if player died after bullet updates,
				//  activate correct actions to deal with it.
				if(!this.player.isAlive()){
					this.onPlayerLoseLife_GENERAL();
					break;
				}
			}
			
			// apply damage to player for all enemy lasers
			for(var i=0; i<this.enemySys.enemyLasers.length; i++){
				// apply correct amount of damage
				this.enemySys.enemyLasers[i].target.applyLaserDamage(this.enemySys.enemyLasers[i]);
			}
			
			// apply damage for all player lasers
			for(var i=0; i<this.player.lasers.length; i++){
				// apply correct amount of damage
				this.player.lasers[i].target.applyDamage(this.player.lasers[i].damage);
				// create the hit effect
				this.player.lasers[i].target.burnEffect(
					this.player.lasers[i].x,
					this.player.lasers[i].y);
			}
			
			// check if enemy is alive, if not, delete it (check from other damage
			//	sources, such as lasers)
			for(var i=0; i<this.enemySys.enemies.length; i++){
				if(!this.enemySys.enemies[i].isAlive()){
					// execute enemy's death effect (e.g. explosion)
					this.enemySys.enemies[i].deathEffect();
					// call the main
					this.onEnemyDead_GENERAL(this.enemySys.enemies[i]);
					this.enemySys.enemies[i].onDeathEvent();
					this.enemySys.deleteEnemy(i);
					i--;
				}
			}
			
			// check if player bullets or hit enemies or enemy missiles
			for(var i=0; i<this.player.bullets.length; i++){
                // flag to ensure that if a bullet is deleted by hitting an enemy,
                //  it will not try to hit a missile
                var bulletDeleted = false;
                
				// Update player bullet collision
				this.player.bullets[i].collision.updatePosition();
                
				// check if bullet hits enemy
				for(var j=0; j<this.enemySys.enemies.length; j++){
					// Update enemy collision
					this.enemySys.enemies[j].collision.updatePosition();
                    
                    // check if collision occured
					if(isCollide(this.player.bullets[i].collision,
                                 this.enemySys.enemies[j].collision)){
						this.enemySys.enemies[j].applyDamage(this.player.bullets[i].damage);
						
						// delete enemy if it is dead, apply score calculations
						//	and call the onEnemyDead function
						if(!this.enemySys.enemies[j].isAlive()){
							// execute enemy's death effect (e.g. explosion)
							this.enemySys.enemies[j].deathEffect();
							// call the main
							this.onEnemyDead_GENERAL(this.enemySys.enemies[j]);
							this.enemySys.enemies[j].onDeathEvent();
							this.enemySys.deleteEnemy(j);
						}
						else{
							// create regular hit effect here
							this.enemySys.enemies[j].hitEffect(
								this.player.bullets[i].x,
								this.player.bullets[i].y);
						}
					
						// delete bullet
						this.player.bullets.splice(i, 1);
						i--;
						bulletDeleted = true;
						break;
					}
				}
                
                // if bullet was deleted, skip the rest of this loop
                if(bulletDeleted)
                    continue;
                
                // check if bullet hits enemy missile
                for(var j=0; j<this.enemySys.enemyMissiles.length; j++){
                    // update missile collision
                    this.enemySys.enemyMissiles[j].collision.updatePosition();
                    
                    // check if the collision occured
                    if(isCollide(this.player.bullets[i].collision,
                                 this.enemySys.enemyMissiles[j].collision)){
                        // detonate the missile
                        this.enemySys.enemyMissiles[j].detonate();
                        
                        // delete the bullets, stop the loop
						this.player.bullets.splice(i, 1);
						i--;
						
						break;
                    }
                }
			}
			
			// Player bonuses collision detection
			//  check if the player has intersected with a bonus.
			//  if so, activate the bonus on the player.
			for(var i=0; i<this.bonusSys.bonuses.length; i++){
				// Update bonus collision position
				this.bonusSys.bonuses[i].collision.updatePosition();
				if(isCollide(this.player.collision,this.bonusSys.bonuses[i].collision)){
					this.onCollectBonus(this.bonusSys.bonuses[i]);
					this.createFloatingTextPlayerHeal(this.bonusSys.bonuses[i].label,
						this.player.x, this.player.y);
					this.bonusSys.bonuses[i].activate(this.player);
					this.bonusSys.bonuses.splice(i,1);
					i--;
					continue;
				}
			}

			// check if player crashes into enemy
			//  (this launches an event).
			for(var i=0; i<this.enemySys.enemies.length; i++){
				this.enemySys.enemies[i].collision.updateAngle();
				this.enemySys.enemies[i].collision.updatePosition();
				if(isCollide(this.player.collision, this.enemySys.enemies[i].collision)){
				//if(this.player.intersectsEnemy(this.enemySys.enemies[i])){
					// apply function onPlayerCrash_GENERAL with enemy,
					//  and check to see if the enemy disappears or not (if it does not,
					//  player dies because he/she crashed into a boss); if it disappears,
					//	call the enemy's onDeathEvent function.
					if(this.onPlayerCrash_GENERAL(this.enemySys.enemies[i])){
						this.enemySys.enemies[i].onDeathEvent();
						this.enemySys.enemies.splice(i, 1);
						i--;
					}
					
					break;
				}
				
				// if player died after crash updates,
				//  activate correct actions to deal with it.
				if(!this.player.isAlive()){
					this.onPlayerLoseLife_GENERAL();
					break;
				}
			}
            
            // check if player crashes into an enemy missile (detonate if so)
            for(var i=0; i<this.enemySys.enemyMissiles.length; i++){
                // update the missile collision
                this.enemySys.enemyMissiles[i].collision.updatePosition();
                
                // check if a collision happened
                if(isCollide(this.player.collision,
                             this.enemySys.enemyMissiles[i].collision)){
                    this.enemySys.enemyMissiles[i].detonate();
                }
            }
			
			// update TEXT events
			//  loop through all text objects and update them
			for(var i=0; i<this.texts.length; i++){
				this.texts[i].update();
				if(!this.texts[i].isAlive()){
					this.texts.splice(i, 1);
					i--;
				}
			}
			for(var i=0; i<this.floatingTexts.length; i++){
				this.floatingTexts[i].update();
				if(!this.floatingTexts[i].isAlive()){
					this.floatingTexts.splice(i, 1);
					i--;
				}
			}
		}
		else{
			//Update GUI System only when game is paused
			this.guiSys.update();
		}
	}
	
    
    // DRAW FUNCTION:
    //  draws the entire level and all subsystems
	this.draw = function(ctx){
		ctx.save();
		
		// set up the current context to draw on (draw on the special area context
		//	if area is enabled, otherwise just draw on the regular screen context
		var currentContext;
		if(this.areaEnabled){ // area enabled, so draw on the area context (and clear it off)
			currentContext = this.areaContext; // set the current context to area context
			this.areaContext.clearRect(0, 0, areaWidth, areaHeight); // clear off area context
		}
		else // area disabled, so draw on the regular screen
			currentContext = ctx;
		
		// apply screen shaking if applicable (if shakeDuration is
		//	higher than 0 frames, and if the game is not paused
		if(this.shakeDuration > 0 && !this.paused){
			// update x and y position of the shake
			this.shakeX += this.shakeXdelta;
			if(this.shakeX > 3 || this.shakeX < -3)
				this.shakeXdelta *= -1;
			// translate the main screen canvas to the current shake location
			ctx.translate(this.shakeX, this.shakeY);
		}
		
		/*** DRAW ON THE CURRENT CONTEXT (main screen or area if enabled) ***/
		// draw the space/background
        this.space.draw(currentContext);
		
        // draw bonuses and enemies
		this.bonusSys.draw(currentContext);
		this.enemySys.draw(currentContext);
		
		// draw the player
		this.player.draw(currentContext);
		
        // draw all active effects
        this.effectSys.draw(currentContext);
		
		// draw all floating texts
		for(var i=0; i<this.floatingTexts.length; i++){
			this.floatingTexts[i].draw(currentContext);
		}
		
		/*** If area is enabled, crop the area context into the main screen's viewport ***/
		if(this.areaEnabled){
			// calculate the position scale relative to the player's position:
			//	if the player is in the center, scaleX will be 0.5;
			//	if the player is on the left end of the screen, scaleX will be 0,
			//	or if the player is on the right of the screen, scaleX will be 1;
			var scaleX = (1/areaWidth)*this.player.x;
			// adjust the left side of the viewport to be relative to the player's global position:
			//	set it on the player's position, and then move down between 0 (scaleX is 0)
			//	or contextWidth (scaleX is 1) to pan the viewport correctly.
			// scaleX is the ratio: 0 means player is completely to the left, 1 means
			//	player is completely to the right
			var viewLeftX = this.player.x - (contextWidth*scaleX);
			// make sure that the left side of the viewport is at least 0
			if(viewLeftX < 0)
				viewLeftX = 0;
			// make sure that the left side of the viewport is at least one screen-size
			//	(contextWidth) away from the right edge of the screen
			else if(viewLeftX + contextWidth > areaWidth)
				viewLeftX = areaWidth - contextWidth;
			
			// do the same for the Y-position (top edge of the viewport)
			var scaleY = (1/areaHeight)*this.player.y;
			var viewTopY = this.player.y - (contextHeight*scaleY);
			if(viewTopY < 0)
				viewTopY = 0;
			else if(viewTopY + contextHeight > areaHeight)
				viewTopY = areaHeight - contextHeight;
			
			// now draw the image of the area canvas (cropped to the position calculated
			//	above) to the actual canvas
			ctx.drawImage(this.areaCanvas,				// draw the area canvas to the actual screen
						  viewLeftX, viewTopY,			// top left corner of the area image to draw
						  contextWidth, contextHeight,	// width and height of the image to draw
						  0, 0,							// top left corner of the main screen to draw on
						  contextWidth, contextHeight);	// width and height of the screen to draw on
		}
		
		
		/*** DRAW ALL GUI ELEMENTS ON THE MAIN CONTEXT (screen context) ***/
		// if dialog box is active, draw it
		this.dialogSys.draw(ctx);
		
		// draw the player GUI (i.e. health bar, score, etc.)
		this.player.drawGUI(ctx);
		
		// if player is dead, draw a transparent rectangle
		//	on the screen that fades the game into the background while
		//	only displaying the death menu/effects
		if(this.playerDead){
			ctx.save();
			ctx.globalAlpha = 0.6;
			//ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, contextWidth, contextHeight);
			ctx.restore();
		}
		
        // draw text events
        //  loop through all text objects and draw them
        for(var i=0; i<this.texts.length; i++){
            this.texts[i].draw(ctx);
        }
        
		// if paused, draw the pause menu
        if(this.paused){
			this.guiSys.draw(ctx);
        }
		
		ctx.restore();
	}
    
    
	// returns the number of enemies currently active (to reduce implementations having
	//	to dig around the level's internal variables:
	this.enemyCount = function(){
		return this.enemySys.enemies.length;
	}
	
	
    // add a looped event into the level's events
    //  This function creates a and returns continuous timer that keeps
    //  ticking and repeating its events
    this.createLoopedEvent = function(interval){
        var t = new LoopedTimer(interval);
        t.property = this;
        this.events.push(t);
        return t;
    }
    
    
    // add a regular timed event into level's event
    //  This function creates and returns a timer that, when its time
    //  interval (in frames) expires, triggers its action.
    this.createEvent = function(interval){
        var t = new Timer(interval);
        t.property = this;
        this.events.push(t);
        return t;
    }
    
    // create floating text at x and y position with the given
    //  value, color and float velocity (1 for up, -1 for down, 0 for
    //  no movement).
    this.createFloatingText = function(val, x, y, color, velocity){
        
        // restrict y value to be within screen range (if they're above the
        //  screen range (or potentially will be), set the y value to
        //  be lower down
        if(y < 15)
            y = 15;
        
        // create the textObject with float-text parameters
        var newFloatingText = new textObject(
                                        x, y,
                                        val, "14pt Arial",
                                        color,
                                        0, 1);
        
        // adjust specific customized values for the floating text
        newFloatingText.velocity = velocity;
        newFloatingText.draw = function(ctx){
            ctx.save();
				ctx.font = this.font;
				ctx.globalAlpha = this.alpha;
				ctx.fillStyle = this.color;
				ctx.fillText(this.text, this.x, this.y + this.velocity*this.alpha);
			ctx.restore();
        }
        
        // we use unshift instead of push to make sure that floating text
        //  is always first in the array. As such, it will get drawn UNDER
        //  the warning texts that get pushed to the end of the array.
        this.floatingTexts.unshift(newFloatingText);
    }
    
    
    // create enemy hit floating text
    this.createFloatingTextEnemyHit = function(val, x, y){
        this.createFloatingText("+" + val, x, y - 1, "#FFFF00", 10);
    }
    
    // create player heal text
    this.createFloatingTextPlayerHeal = function(val, x, y){
        this.createFloatingText("+" + val, x, y - 1, "#00FF00", 10);
    }
    
    // create player powerup text
    this.createFloatingTextPlayerPowerup = function(message, x, y){
        this.createFloatingText(message, x, y - 1, "#FFFFFF", 10);
    }
    
    // create player hit text
    this.createFloatingTextPlayerHit = function(val, x, y){
        this.createFloatingText("-" + val, x, y + 10, "#FF0000", -10);
    }
    
    
    // create big message text
    this.createBigText = function(message, duration, fadeTime){
        var newWarning = new textObject(
                                 contextWidth/2,
                                 contextHeight/2,
                                 message,
                                 "36pt MainFont",
                                 "#FFFF00",
                                 duration,
                                 fadeTime);
        this.texts.push(newWarning);
    }
    
    // create warning message text
    this.createWarningText = function(message, duration, fadeTime){
        var newWarning = new textObject(
                                 contextWidth/2,
                                 contextHeight/2,
                                 message,
								 "16pt MainFont", //"20pt MainFont",
                                 "#82CAFF", //"#FF3366",
                                 duration,
                                 fadeTime);
        this.texts.push(newWarning);
    }
	
	// create a standard dialog box over the screen that displays the given text
	//	and the image (which should be the character that speaks the text), and
	//	plays the sound file that is associated with the given image.
	// PARAMETERS:	text:     the dialog text to display,
	//				image:    the image of the character speaking (image object)
	//				sound:    the sound object of the voice of the character
	//				duration: [optional] the time (in seconds) to keep the message alive
	this.createDialogBox = function(text, speaker, image, sound, duration){
		this.dialogSys.enqueue(text, speaker, image, sound, duration);
	}
	
	// set the given function (passed as parameter) to be the function that is called
	//	when all dialogs finish (when the queue runs out). By default, after the queue
	//	runs out, even if there was only one dialog box enqueued, the dialog finish function
	//	is reset to an empty function, so this must be set every time a chain of dialogs
	//	is created.
	this.setDialogsFinishEvent = function(eventFunction){
		this.dialogSys.onDialogsFinish = eventFunction;
	}
	
	
	/*** CREATE FUNCTIONS: for creating enemies, bonuses, etc. ***/
	
	// function for creating an enemy:
	this.createEnemy = function(enemyName, x, y){
		// if x or y are not passed in (optional parameters), default
		//	the x and y position of the enemy to a random place above the
		//	screen.
		x = x || getRandNum(areaWidth-60)+30;
		y = y || -30;
		// create the enemy in enemySys and return it
		return this.enemySys.createEnemy(enemyName, x, y);
	}
	
	// function for creating a bonus:
	this.createBonus = function(bonusName, x, y, lifeTime){
		// if x or y are not passed in (optional parameters), default
		//	to a random position on the screen
		x = x || getRandNum(areaWidth-30)+15;
		y = y || getRandNum(areaHeight-30)+15;
		// if lifeTime is not passed in (optional parameter), default it to
		//	15 to 20 seconds (randomly)
		lifeTime = lifeTime || getRandNum(6)+15;
		// create the bonus in bonusSys and return it
		return this.bonusSys.createBonusByName(bonusName, x, y, lifeTime);
	}
    
    // create a random bonus generated at the given x, y location.
    //  This bonus will remain collectable anywhere between 10 and 15 seconds,
    //  and will be randomly chosen by the distribution of probability of
    //  getting any one bonus in particular.
    this.createRandomBonus = function(x, y){
        var newBonus;
        //var x = getRandNum(contextWidth-80)+40;
        //var y = getRandNum(contextHeight-60)+30;
        
        // adjust x and y so that it doesn't appear off-screen
        if(x < 15)
            x = 15;
        else if(x > areaWidth-15)
            x = areaWidth-15;
        if(y < 15)
            y = 15;
        else if(y > areaHeight-15)
            y = areaHeight-15;
        
        // randomly choose a duration (time allowed for player to collect the bonus)
        //  between 15 and 20 seconds.
        var lifeTime = getRandNum(6)+15;
    
        // generate a random number (0 to 99) to act as the random probability roll
        var bonusType = getRandNum(100);
        
        // produce the bonus by its probability in accordance to the randomly generated
        //  roll number (bonusType)
        if(bonusType < 40) // 40% chance to get a health bonus
            newBonus = this.bonusSys.createHealthBonus(x, y, lifeTime);
        else if(bonusType < 48) // 8% chance to get a tripple gun
            newBonus = this.bonusSys.createTrippleGunBonus(x, y, lifeTime);
        else if(bonusType < 55) // 7% chance to get a disperse gun
            newBonus = this.bonusSys.createDisperseGunBonus(x, y, lifeTime);
        else if(bonusType < 65) // 10% chance to get a laser gun
			newBonus = this.bonusSys.createLaserGunBonus(x, y, lifeTime);
        else if(bonusType < 70) // 5% chance to get a super laser gun
			newBonus = this.bonusSys.createSuperLaserGunBonus(x, y, lifeTime);
        else if(bonusType < 80) // 10% chance to get an armor shield
            newBonus = this.bonusSys.createArmorShieldBonus(x, y, lifeTime);
        else if(bonusType < 90) // 10% chance to get an absorb shield
            newBonus = this.bonusSys.createReductionShieldBonus(x, y, lifeTime);
        else if(bonusType < 99) // 9% chance to get a reflective shield
            newBonus = this.bonusSys.createReflectiveShieldBonus(x, y, lifeTime);
        else // 1% chance to get an extra life bonus
            newBonus = this.bonusSys.createExtraLifeBonus(x, y, lifeTime);
		
		return newBonus;
    }
    
	// this function is called when the screen is clicked (when mouse button is pushed down)
	this.mousedown = function(x, y){
		if(this.paused)
			this.guiSys.mousedown(x, y);
	}
	
    // this function is called if the screen is clicked (when mouse is released)
    this.mouseup = function(x, y){
		// if the screen is clicked and the player is dead,
		//	reset the player and start the last phase again.
        if(this.playerDead){
			// if player has no more lives left, run the onPlayerDead
			//	function
			if(this.player.lives <= 1){
				this.onPlayerDead();
			}
			// otherwise, reset the level to the last active phase
			else{
				// unset player dead as true
				this.playerDead = false;
				
				// reset enemy system
				this.enemySys.reset();
				// remove all existing bonuses
				this.bonusSys.reset();
				// reset player
				this.player.reset();
				// remove all current text objects
				this.texts = new Array();
				this.floatingTexts = new Array();
				// remove all existing events
				this.events = new Array();
				// re-initialize all static events
				this.initEvents();
				
				// give a death warning, and then start the current event again
				this.createWarningText("Try again...", 3, 2);
				this.createEvent(secToFrames(5)).onTime = function(l){
						l.phaseList[l.currentPhase](l);
					}
			}
		}
		else{
			if(this.paused){
				this.guiSys.mouseup(x,y);
			}else{
				// check dialog boxes for clicking
				this.dialogSys.click(x, y);
			}
		}
    };
	
	// function to handle movement of the mouse: send the mouseover data
	//	to the enemy system to deal with displaying enemy health bars
	//	if an enemy is moused over
    this.mousemove = function(x, y){
		if(this.paused)
			this.guiSys.mousemove(x,y);
		else{
			this.enemySys.mouseOver(x, y);
			this.dialogSys.mouseMove(x, y);
		}
	}
	
	// function called when the user presses the key bound to toggle
	//	enemy health bars to display on the screen
	this.toggleHealthBars = function(){
		this.enemySys.toggleHealthBars();
		settings.showEnemyHealthBars = !settings.showEnemyHealthBars;
	}
	
	// function called when the user presses the key bound to toggle
	//	bonus timer bars to display on the screen
	this.toggleTimerBars = function(){
		this.bonusSys.toggleTimerBars();
		settings.showBonusTimerBars = !settings.showBonusTimerBars;
	}
}


/*
 * DIALOG SYSTEM: Used by the level to contain dialog boxes
 */
function dialogSystem(lvl){
	// reference to the level object to interact with events
	this.lvl = lvl;
	
	// x and y position that any dialog box in this dialog system
	//	is centered on
	this.x = contextWidth/2;
	this.y = contextHeight-90;
	
	// array that contains all of the active queued dialog boxes
	this.dialogs = new Array();

	// takes the data required to make a new dialog box object, and
	//	adds it to the queue of this dialog system
	// duration is in SECONDS
	this.enqueue = function(text, speaker, image, sound, duration){		
		// set up the valid duration: if duration is undefined, set it to an
		//	estimated length by the length of the text
		duration = secToFrames(duration) || (secToFrames(Math.round(text.length / 25) + 1.5));
		
		// create the dialog box with the correct duration and a reference to this
		var dialogBox = new dialogBoxObject(text, speaker, image, sound, duration, this);
		
		// add the dialog box to the queue array
		this.dialogs.push(dialogBox);
		
		// if this is the first dialog box, start it (this starts the sound and timer)
		if(this.dialogs.length == 1){
			dialogBox.start();
		}	
		
		// return the dialog box
		return dialogBox;
	}
	
	// returns the next dialog box object in the queue,
	//	and removes it from the queue array. If the dialog box
	//	is still running, it is stopped.
	// RETURNS the next dialog box in the queue, or
	//	null if the dialog set is empty
	this.next = function(){
		if(this.dialogs.length > 0){
			// dequeue the active dialog box
			var dialogBox = this.dialogs.shift();
			// stop it from running
			dialogBox.stop();
			
			// if there is another in the dialog queue, then start it now
			if(this.dialogs.length > 0){
				this.dialogs[0].start();
			}
			// otherwise, call the onDialogsFinish function
			else{
				// call the function
				this.onDialogsFinish();
				// reset it to nothing
				this.onDialogsFinish = function(){}
			}
			
			// return it
			return dialogBox;
		}
		else
			return null;
	}
	
	// updates the active dialog box (if any)
	this.update = function(){
		if(this.dialogs.length > 0)
			this.dialogs[0].update();
	}
	
	// draw the active dialogBox (if any) on the screen:
	//	that is, draws the dialog box in the current queue
	this.draw = function(ctx){
		// draw only if some dialog box exists
		if(this.dialogs.length > 0){
			ctx.save();
				// move to the correct location
				ctx.translate(this.x, this.y);
				// draw the top of the queue
				this.dialogs[0].draw(ctx);
			ctx.restore();
		}
	}
	
	// returns TRUE if this dialog set is active, FALSE otherwise:
	//	active implies that there is currently a running dialog box
	this.active = function(){
		return this.dialogs.length > 0;
	}
	
	// check mouseOver of the "X" button in the dialogBox object
	this.mouseMove = function(x, y){
		// if active, check (if inactive, there are no dialog boxes anyway)
		if(this.active()){
			// check if the mouse coordinate (with an offset of the position
			//	that this system draws boxes on - that is, this.x and this.y
			//	is where the dialog box is centered on) intersects the
			//	button, set it to highlighted... otherwise, set it to not
			//	highlighted
			if(this.dialogs[0].intersectsButton(x-this.x, y-this.y))
				this.dialogs[0].xMouseOver = true;
			else
				this.dialogs[0].xMouseOver = false;
		}
	}
	
	// check click action of the "X" button in the dialogBox object:
	//	if clicked, then cancel the current dialog box
	this.click = function(x, y){
		// if active, check (if inactive, there are no dialog boxes anyway)
		if(this.active()){
			// check if the mouse immediately intersects the button:
			//	if it does, call next() to skip this dialog box
			if(this.dialogs[0].intersectsButton(x-this.x, y-this.y))
				this.next();
		}
	}
	
	
	// function that is called when the dialog set finishes (or is
	//	fully skipped). This function is called every time but should
	//	be overridden by the level system for specific actions
	//	when the dialogs finish
	this.onDialogsFinish = function(){}
}

// Dialog Box object: a single dialog box created to be displayed on the
//	screen. This dialog box object is used directly by the dialog box system.
// PARAMETERS:
//	text:		the text that is to be displayed in the dialog box
//	speaker:	the name of the speaker that speaks the displayed text
//	image:		the image (picture) of the speaker
//	sound:		the sound file played during this dialog box
//	duration:	how long (in frames) this dialog box lasts
//	dialogSys:	a reference to the dialog box system to call when finished
function dialogBoxObject(text, speaker, image, sound, duration, dialogSys){
	this.text = text;
	this.speaker = speaker;
	this.image = image;
	this.sound = sound;
	this.duration = duration;
	this.dialogSys = dialogSys;
	
	this.soundFinished = false;
	
	// checked if the "X" is moused over, false otherwise
	this.xMouseOver = false;
	
	// "X" button boundaries
	this.xTop = -45;
	this.xBottom = -25;
	this.xLeft = 110;
	this.xRight = 130;
	
	// time to stop the duration counter (adjusted by start() function)
	this.stopTime = 0;
	
	// maximum length (in characters) that each line may be
	var maxLineLength = 55;
	
	// calculate the individual lines of the text based on length
	this.lines = new Array(); // array of lines
	// if there are more that maxLineLength characters in the text, compute
	//	individual lines and split the text up
	if(this.text.length > maxLineLength){
		// split the text into individual words
		var words = this.text.split(" ");
		words.push("END"); // push an irrelevant end word to cut off the end of the loop
		
		// current position in the lines array (pushed up to this point)
		var pos = 0;
		// last index in the words array that was pushed to lines
		var lastIndex = 0;
		// the current index in the words array being processed
		var index = 0;
		
		// while there are words in the words array (minus the extra last word pushed above)
		while(index < words.length-1){
			// curLength keeps track of the length of the current line
			var curLength = 0;
			// while there are still words and the length of this line is less than maxLineLength
			while(index < words.length && curLength < maxLineLength){
				// add the length of the word (plus 1 for a space) to the length of the line
				curLength += words[index].length + 1;
				// increment index to the next word in the words array
				index++;
			}
			// decrement index (the above loop goes one word over)
			index--;
			// create a string on the current line of text
			this.lines[pos] = "";
			// add all the words to the current line up to index
			for(var i=lastIndex; i<index; i++){
				this.lines[pos] += words[i] + " ";
			}
			// remove the last empty space from this line (tagged at the end)
			this.lines[pos] = this.lines[pos].substring(0, this.lines[pos].length-1);
			// increment position (current line)
			pos++;
			// set the last pushed index to be the current index
			lastIndex = index;
		}
	}
	else{ // otherwise, if there are maxLineLength or less characters, just use one line.
		this.lines.push(this.text);
	}
	
	// update function: this simply keeps track of the timer for this
	//	dialog box to determine when/if it is time to remove it
	this.update = function(){
		// if timer ran out, call the dialog system to load the next
		//	dialog (if any - this is determined by the dialog box system)
		if(this.stopTime <= gameTime || this.soundFinished)
			this.dialogSys.next();
	}
	
	// draw the dialog box, the text, and the image on the screen, centered on
	//	0, 0 (the actual absolute position must be determined prior to calling this
	//	draw function with a context.translate(x, y) function call)
	this.draw = function(ctx){
		/*** DRAW THE DIALOG BOX ***/
		ctx.strokeStyle = "#FFFFFF";
		ctx.lineWidth = 2;
		ctx.fillStyle = "#000000";
		ctx.globalAlpha = 0.85;
		ctx.beginPath();
			// boundaries of the rounded rectangle:
			//	centered around (0, 0)
			pathRoundedRectangle(ctx, -230, -45, 460, 90, 10);
			ctx.fill();
			// outline with the white color
			ctx.stroke();
		ctx.closePath();
		
		
		/*** DRAW THE IMAGE OF THE CHARACTER ***/
		// add the divider line on the right side of the box
		ctx.beginPath();
			ctx.moveTo(130, -45);
			ctx.lineTo(130, 45);
			ctx.stroke();
		ctx.closePath();
		// draw the image in there
		// image object, leftX, topY, width, height
		ctx.drawImage(image, 140, -40, 80, 80);
		
		
		/*** DRAW THE TEXT ONTO THE SCREEN ***/
		// draw the title (name of the speaker)
		ctx.font = "bold 11pt Arial";
		ctx.fillStyle = "#FFFF00"; // white text
		ctx.fillText(this.speaker, -217, -24);
		ctx.font = "10pt Arial";
		ctx.fillStyle = "#FFFFFF"; // white text
		// draw the actual text itself
		for(var i=0; i<this.lines.length; i++){
			ctx.fillText(this.lines[i], -215, -3 + 18*i);
		}
		
		/*** DRAW THE X (cancel) BUTTON ON THE SCREEN ***/
		// draw the white box to contain the "X" (cancel) button
		ctx.beginPath();
			//		x, y, width, height
			ctx.rect(this.xLeft, this.xTop, 20, 20);
			ctx.stroke();
			// if the X is moused over, fill it in
			if(this.xMouseOver){
				ctx.fillStyle = "#A52A2A";
				ctx.fill();
			}
		ctx.closePath();
		
		// now draw the X
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 4;
		// top-left to bottom-right slash ( \ )
		ctx.beginPath();
			ctx.moveTo(this.xLeft+2, this.xTop+2);
			ctx.lineTo(this.xRight-2, this.xBottom-2);
			ctx.stroke();
		ctx.closePath();
		// top-right to bottom-left slash ( / )
		ctx.beginPath();
			ctx.moveTo(this.xRight-2, this.xTop+2);
			ctx.lineTo(this.xLeft+2, this.xBottom-2);
			ctx.stroke();
		ctx.closePath();
	}
	
	// returns TRUE if the given x, y coordinate intersects the "X" button,
	//	FALSE if not in the bounds
	this.intersectsButton = function(x, y){
		var intersects = (this.xLeft <= x && this.xRight >= x &&
			this.xTop <= y && this.xBottom >= y);
		return intersects;
	}
	
	// start the countdown timer and starts playing back the sound (if any)
	this.start = function(){
		this.stopTime = gameTime + this.duration;
		// play the sound file here?
		if(this.sound){
			this.sound.dialogBox = this;
			this.sound.onended = function(){
					this.dialogBox.soundFinished = true;
				}
			this.sound.play();
		}
	}
	
	// pause the playback of the sound file
	this.pause = function(){
		//
	}
	
	// stop the sound playback
	this.stop = function(){
		if(this.sound)
			this.sound.pause();
		//
	}
}



/* generic text object
 *  PARAMETERS:
 *      x, y for location (centered exactly on that x, y coordinate)
 *      text is the actual text to be displayed
 *      font is the font string applied to the context to render the text
 *          passed as a string: (e.g. "36pt Arial")
 *      color is the color that this text will be displayed in: passed as a
 *          color string (e.g. "FFFFFF" or "rgb(255, 255, 255)")
 *      timeToLive is how long the text is going to be displayed on the
 *          screen (in SECONDS), before it starts fading out (see fadeTime).
 *			To make it last indefinately, set fadeTime to 0
 *      fadeTime is the number of seconds it takes the text to fade from full
 *          to nothing. This effect happens only after the text timeToLive
 *          expires.
*/          
function textObject(x, y, text, font, color, timeToLive, fadeTime){
    // set basic variables
    this.text = text;
    this.font = font;
    this.color = color;
    
    // center the text on the given x, y values using the
    //  given FONT value
    context.font = font;
    this.x = x - context.measureText(text).width / 2;
    this.y = y;
    
    // scale intervals to current framerate
    this.deathTime = gameTime + secToFrames(timeToLive);
    this.elapsedTime = 0;
    this.fadeTime = secToFrames(fadeTime);
	
	// if timeToLive is less than 0, this text is meant to last forever
	this.infinite = (timeToLive < 0);
    
    // set alpha to 1.0 (non-transparent)
    this.alpha = 1.0;
    // set change in alpha per frame while fading
    this.alphaDelta = this.alpha/this.fadeTime;
    
    // mutating update function:
    //  at first checks to see if the timeToLive interval
    //  expires. When it does, it changes the update function
    //  to deplete alpha by the alphaDelta value (i.e. it fades
    //  out). When delta is less than or equal to 0, isAlive
    //  will return false.
    this.update = function(){
		// if text isn't infinite, update it
		if(!this.infinite){
			// if text is past its time to live, change the update function
			if(this.deathTime <= gameTime){
				// modify update function to fade the text out over time
				//	(scaled by fadeTime variable)
				this.update = function(){
					this.alpha -= this.alphaDelta;
				}
			}
		}
    }
    
    // standard draw function (draws the text with the specified
    //  font and style and location and transparency)
    this.draw = function(ctx){
        ctx.save();
            ctx.font = this.font;
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
    
    // returns true as long as alpha is greater than 0; that is,
    //  the text is not absolutely transparent.
    // If it is completely transparent, it is "dead"
    this.isAlive = function(){
        return this.alpha > 0.0;
    }
}