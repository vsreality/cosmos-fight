/* File: gui.js
 *  Elements that are used by the menus and other GUI containers, such as buttons.
 *  These elements all share the same GuiObject prototype.
 */


// GLOBAL VARIABLES (used to identify GUI modes)
var GUI_POSITION_LEFT = 1;
var GUI_POSITION_CENTER = 2;
var GUI_POSITION_RIGHT = 3;


// Basic GUI Object prototype.
function GuiObject() {
    // position values (x_default is the initial, unaltered x position)
    this.x = 0;
    this.x_default = 0;
    this.y = 0;
    this.position = GUI_POSITION_LEFT;
    
    // size values
    this.width = 0;
    this.height = 0;
    this.size = 0; // size is used for text objects
    this.focused = false; // this element is not focused by default
    this.ctxStyle = "#000000";
    
    // Mouse event action functions
    this.mousedown = function(x, y) { }
    this.mouseup = function(x, y) { }
    this.mousemove = function(x, y) { }
    
    // Returns the width of this GUI component to be used for other computations
    // that rely on width. By default, returns the width variable value.
    this.getWidth = function() {
        return this.width;
    }
    
    // Returns the context drawing style of this object.
    this.getStyle = function() {
        return this.ctxStyle;
    }
    
    // Set the style of the given context in the draw function.
    //  this function needs to be overridden specifically
    this.setStyle = function(style) {
        this.ctxStyle = style;
    }
    
    // Set the position of this object. Use this function to set position - do not
    // set the variables directly. Call update() after setting position.
    this.setPosition = function(x, y) {
        this.x = x;
        this.x_default = x;
        this.y = y;
    }
    
    // Sets the position of this GUI rectangle based on its current positioning.
    this.update = function() {
        switch(this.position) {
            case GUI_POSITION_CENTER:
                this.x2 = this.x - this.getWidth() / 2;
                break;
            case GUI_POSITION_RIGHT:
                this.x2 = this.x - this.getWidth();
                break;
            case GUI_POSITION_LEFT:
            default:
                this.x2 = this.x;
                break;
        }
    }
    
    // draw function: must be overridden for specific objects
    this.draw = function(ctx) { }
    
    // Alignment functions:
    this.left = function() { // align this object to the left side
        this.position = GUI_POSITION_LEFT;
    }
    this.center = function() { // align this object to the center
        this.position = GUI_POSITION_CENTER;
    }
    this.right = function() { // align this object to the right side
        this.position = GUI_POSITION_RIGHT;
    }
    
    // returns TRUE if the given x, y coordinate overlap the position
    //  of this rectangle GUI.
    this.intersects = function(x, y) {
        y += this.size;
        return (x > this.x && x < (this.x + this.width) &&
                y > this.y && y < (this.y + this.size));
    }
}


// GUI Filled Rectangle:
//  Creates a rectangular GUI object with the given rectangular dimensions.
//  This object is used as an embedded or popup menu within the level.
// Parameters:
//  x, y position of the object, and its width and height.
// To create a rounded rectangle, the 5th and 6th parameters must be set to
//  true and radius, respectively.
function GuiRectangle(x, y, w, h, rounded, r) {
    rounded = typeof rounded !== 'undefined' ? rounded : false;
    r = typeof r !== 'undefined' ? r : 0;
    
    this.setPosition(x, y);
    this.width = w;
    this.height = h;
    this.rounded = rounded;
    this.r = r;
    
    // draw the GUI rectangle
    this.draw = function(ctx) {
        ctx.save();
        ctx.style = this.getStyle();
        if(this.rounded) {
            ctx.beginPath();
            pathRoundedRectangle(ctx, this.x, this.y, this.width, this.height, this.r);
            ctx.fill();
        }
        else
            ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
// make GuiRectangle a subclass of the generic GuiObject:
GuiRectangle.prototype = new GuiObject();


// GUI Text object:
//  Creates a text object to be used inside a GUI menu. A text object is NOT
//  interactive, as opposed to a GUI button.
function GuiText(text, x, y, color, size) {
    this.text = text;
    this.setPosition(x, y);
    this.size = size;
    this.setStyle(color);
    
    this.getText = function() {
        return this.text;
    }
    
    this.setWidth = function(ctx) {
        ctx.save();
        ctx.font = "" + this.size + "pt " + this.font;
        this.width = context.measureText(this.text).width;
        GuiText.prototype.update.call(this);
        ctx.restore();
    }
    
    this.draw = function(ctx) {
        ctx.font = "" + this.size + "pt " + this.font;
        ctx.fillStyle = this.getStyle();
        ctx.fillText(this.text, this.x, this.y);
    }
}
// make GuiText a subclass of the generic GuiObject:
GuiText.prototype = new GuiObject();


// GUI SYSTEM: a system implemented by menus and other GUI containers to
//  keep track of all GUI elements.
function GuiSystem(){
    this.guiElements = new Array();
    this.focusedElement = 0;
    
    // add an element into the GuiSystem's element list (e.g. button or text)
    this.addElement = function(el){
        this.guiElements.push(el);
        return el;
    }
    
    // update function: check if all gui elements are alive (if not,
    //  remove them and do not continue to draw them).
    this.update = function(){
        for(var i=0; i<this.guiElements.length; i++){
            this.guiElements[i].update();
        }
    }
    
    // draw function: loop through and draw all active gui elements
    this.draw = function(ctx){
        for(var i=0; i<this.guiElements.length; i++){
            this.guiElements[i].draw(ctx);
        }
    }
    
    // mouse action functions
    this.mousedown = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
            this.guiElements[i].mousedown(x, y);
        }
    }
    this.mouseup = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
            this.guiElements[i].mouseup(x, y);
        }
    }
    this.mousemove = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
            this.guiElements[i].mousemove(x, y);
        }
    }
    return this;
}