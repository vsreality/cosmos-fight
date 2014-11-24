/* File: menu.js
 *  Contains code to create and implement a variety of menus. Menus all use the
 *  GUI system and various GUI elements together to construct a complete menu.
 */


// TODO - the menus can be improved using HTML instead of Canvas drawings.
function Menu(){
    // add a title to this menu
    this.addTitle = function(titleText){
        this.title = new GuiText(titleText, display.getWidth()/2, 60, "#AAAAFF", 30);
        this.title.center();
        this.guiSys.addElement(this.title);
    }
    
    // add a custom text object with the provided values and positioning
    this.addText = function(text, x, y, color, size){
        var newText = new GuiText(text, x, y, color, size);
        this.guiSys.addElement(newText);
        return newText;
    }
    
    // add a back button, located on the bottom-left of the screen.
    //  if this button is not added, it will simply not appear on this menu;
    // the backFunction should be provided: this will be the function that is
    //  called by the button's click (generally, this will load the last menu)
    this.addBackButton = function(backFunction){
        var backButton = new GuiButton("Back", 40, display.getHeight()-30, 18);
        backButton.left();
        backButton.onClick = backFunction;
        this.guiSys.addElement(backButton);
        this.hasBackButton = true;
        // override backbutton sound
        backButton.playClickSound = function(){
            if(this.soundEnabled)
                gameSounds.playSound("menu_back");
        }
        return backButton;
    }
    
    // mouse action functions
    this.mousedown = function(x, y){
        this.guiSys.mousedown(x, y);
    }
    this.mouseup = function(x, y){
        this.guiSys.mouseup(x, y);
    }
    this.mousemove = function(x, y){
        this.guiSys.mousemove(x, y);
    }
    
    // functions called by keyboard listener:
    //  does nothing right now (these are for levels)
    this.pause = function(){}
    this.toggleHealthBars = function(){}
    this.toggleTimerBars = function(){}
}


// create a standard menu with the provided title as the text displayed on top
//  of the menu screen.
// The spacing parameter is optional, and it will adjust the spacing (in pixels)
//  between each menu item. Default spacing is 47.
function StandardMenu(title, spacing){
    this.guiSys = new GuiSystem();
    //Title of menu
    this.addTitle(title);
    
    // set up line spacing (spacing between the list of buttons in this menu)
    this.lines=0;
    this.lineSpacing = spacing || 47;
    
    // create the background of this menu
    this.background = new space(display.getContext());
    //Create layers of space
    this.background.createLayer(15, 4);
    this.background.createLayer(30, 2);
    this.background.createLayer(70, 0.5);
    
    // adjust the spacing (this can be done dynamically; each adjustion will only
    //  affect future items inserted, so elements added previously will not be
    //  updated with this new spacing)
    // NOTE: the spacing variable is calculated FROM THE TOP of the menu for each
    //  button inserted; e.g. if you have 50 as the spacing variable, and you add
    //  two buttons, they will be 50 pixels appart (100 pixels total). If you then
    //  change the spacing to 75, it will not be calculated as 50+50+75; instead,
    //  the next (third) button will be calculated as 75*3 = 225 pixels from the top.
    //  A fourth button added immediately after will be 75*4 = 300 pixels from the top.
    this.setSpacing = function(spacing){
        this.lineSpacing = spacing;
    }
    
    // add plain, non-interactive text to the menu:
    this.pushText = function(text){
        var y = 150 + (this.lineSpacing * this.lines);
        var newLine = new GuiText(text, display.getWidth()/2, y, "#C35617", 18);
        newLine.center();
        this.guiSys.addElement(newLine);
        this.lines++;
        return newLine;
    }
    // add a standard button to the menu:
    this.pushButton = function(text){
        var y = 150 + (this.lineSpacing * this.lines);
        var newLine = new GuiButton(text, display.getWidth()/2, y, 18);
        newLine.center();
        this.guiSys.addElement(newLine);
        this.lines++;
        return newLine;
    }
    // add a text-only button to the menu
    this.pushTextButton = function(text){
        var y = 150 + (this.lineSpacing * this.lines);
        var newLine = createGuiTextButton(text, display.getWidth()/2, y, 18);
        newLine.center();
        this.guiSys.addElement(newLine);
        this.lines++;
        return newLine;
    }
    
    // update the GUI and the background
    this.update = function(){
        this.background.update();
        this.guiSys.update();
    }
    
    // draw the GUI and the background
    this.draw = function(ctx){
        this.background.draw(ctx);
        this.guiSys.draw(ctx);
    }
    
    // add the VsReality logo to this menu:
    this.addText("VsReality",
            display.getWidth()-20, display.getHeight()-20, "#AAAAFF", 16).right();
}
// set the prototype to the generic menu
StandardMenu.prototype = new Menu();


// create an options menu, which is specialized to adjust the settings for the game.
function OptionsMenu(backFunction){
    // create two gui systems: one for all options, and one that will be shown only
    //  if the user is not logged in; that is, a set of text that will only be drawn
    //  and updated if the settings system indicates that the user has not logged in.
    this.guiSys = new GuiSystem();
    this.guiSysLoginMessage = new GuiSystem();
    
    // add a menu title ("Options") on top of the menu
    this.addTitle("Options");
    
    // create the background of this menu
    this.background = new space(display.getContext());
    //Create layers of space
    this.background.createLayer(15, 4);
    this.background.createLayer(30, 2);
    this.background.createLayer(70, 0.5);
    
    // add a back button
    this.addBackButton(backFunction);
    
    // add a sound-enabled button and label
    var enableSoundLabel = new GuiText("Enable Sound", display.getWidth()/2, 140, "#FFFF33", 18);
    enableSoundLabel.right();
    this.guiSys.addElement(enableSoundLabel);
    // add the checkbox button
    var enableSoundCheckbox = new GuiCheckboxButton(display.getWidth()/2 + 30, 118, 25,
            (settings.soundVolume == 1)); // set checked value based on settings
    enableSoundCheckbox.left();
    enableSoundCheckbox.onClick = function(checked){
        settings.setSoundVolume(checked ? 1.0 : 0.0);
    }
    this.guiSys.addElement(enableSoundCheckbox);
    
    // add an effects level option button and label
    var effectsLevelLabel = new GuiText("Effects", display.getWidth()/2, 200, "#FFFF33", 18);
    effectsLevelLabel.right();
    this.guiSys.addElement(effectsLevelLabel);
    // create the selection list button
    var selList = new Array("Off", "Low", "Medium", "High", "Ultra");
    var effectsLevelSelection = new GuiHorizontalListButton(display.getWidth()/2 + 30, 170, 40, selList,
            settings.effectsLevel); // set effects selection based on settings
    effectsLevelSelection.left();
    effectsLevelSelection.onClick = function(id){
        settings.setEffectsLevel(id);
    }
    this.guiSys.addElement(effectsLevelSelection);
    
    // add a keybindings button
    var keybindingsButton = new GuiButton("Key Bindings", display.getWidth()/2, 280, 15);
    keybindingsButton.center();
    this.keybindingsMenu = new KeybindingsMenu(function(){
            currentLevel = optionsMenu;
        });
    keybindingsButton.parent = this;
    keybindingsButton.onClick = function(){
        currentLevel = this.parent.keybindingsMenu;
    }
    this.guiSys.addElement(keybindingsButton);
    
    // create a not-logged-in label
    var notLoggedInLabel = new GuiText("You are not logged in!",
            display.getWidth()/2, 360, "#999999", 18);
    notLoggedInLabel.center();
    this.guiSysLoginMessage.addElement(notLoggedInLabel);
    var logInInstructions = new GuiText(
            "To save these options permanently, please log in or create an account from the main menu.",
            display.getWidth()/2, 390, "#999999", 12);
    logInInstructions.font = "Arial";
    logInInstructions.center();
    this.guiSysLoginMessage.addElement(logInInstructions);
    
    // update the GUI and the background
    this.update = function(){
        this.background.update();
        this.guiSys.update();
        if(!settings.loggedIn)
            this.guiSysLoginMessage.update();
    }
    
    // draw the GUI and the background
    this.draw = function(ctx){
        this.background.draw(ctx);
        this.guiSys.draw(ctx);
        if(!settings.loggedIn)
            this.guiSysLoginMessage.draw(ctx);
    }
    
    // add the VsReality logo to this menu:
    this.addText("VsReality",
            display.getWidth()-20, display.getHeight()-20, "#AAAAFF", 16).right();
}
// set the prototype to the generic menu
OptionsMenu.prototype = new Menu();


// create a key bindings menu used to setup keybindings for the game controls
function KeybindingsMenu(backFunction){
    this.guiSys = new GuiSystem();
    
    // title of menu
    this.addTitle("Key Bindings");
    
    // add back button to the back-function
    this.addBackButton(backFunction);
    
    // create the background of this menu
    this.background = new space(display.getContext());
    // create layers of space
    this.background.createLayer(15, 4);
    this.background.createLayer(30, 2);
    this.background.createLayer(70, 0.5);
    
    // add movement key binding options
    var movementLabel = new GuiText("Movement Keys", display.getWidth()/4, 140, "#FFFF33", 16);
    movementLabel.center();
    this.guiSys.addElement(movementLabel);
    // up
    var upBinding = new GuiText("Up", 150, 190, "#FFFFFF", 10);
    upBinding.right();
    this.guiSys.addElement(upBinding);
    // down
    var downBinding = new GuiText("Down", 150, 230, "#FFFFFF", 10);
    downBinding.right();
    this.guiSys.addElement(downBinding);
    // left
    var leftBinding = new GuiText("Left", 150, 270, "#FFFFFF", 10);
    leftBinding.right();
    this.guiSys.addElement(leftBinding);
    // right
    var rightBinding = new GuiText("Right", 150, 310, "#FFFFFF", 10);
    rightBinding.right();
    this.guiSys.addElement(rightBinding);
    
    // add action key binding options
    var actionLabel = new GuiText("Action Keys", 3*display.getWidth()/4, 140, "#FFFF33", 16);
    actionLabel.center();
    this.guiSys.addElement(actionLabel);
    // shoot
    var shootBinding = new GuiText("Shoot", display.getWidth()/2+150, 190, "#FFFFFF", 10);
    shootBinding.right();
    this.guiSys.addElement(shootBinding);
    // pause
    var pauseBinding = new GuiText("Pause Game", display.getWidth()/2+150, 230, "#FFFFFF", 10);
    pauseBinding.right();
    this.guiSys.addElement(pauseBinding);
    // health bars toggle
    var healthToggleBinding = new GuiText("Toggle Health Bars", display.getWidth()/2+150, 270, "#FFFFFF", 10);
    healthToggleBinding.right();
    this.guiSys.addElement(healthToggleBinding);
    // timer bars toggle
    var timerToggleBinding = new GuiText("Toggle Timer Bars", display.getWidth()/2+150, 310, "#FFFFFF", 10);
    timerToggleBinding.right();
    this.guiSys.addElement(timerToggleBinding);
    
    // update the GUI and the background
    this.update = function(){
        this.background.update();
        this.guiSys.update();
    }
    
    // draw the GUI and the background
    this.draw = function(ctx){
        this.background.draw(ctx);
        this.guiSys.draw(ctx);
    }
    
    // add the VsReality logo to this menu:
    this.addText("VsReality",
            display.getWidth()-20, display.getHeight()-20, "#AAAAFF", 16).right();
}
// set the prototype to the generic menu
KeybindingsMenu.prototype = new Menu();