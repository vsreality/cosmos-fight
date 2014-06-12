/* File: display.js
 *
 * The Display object is a simple wrapper that contains an interface to draw
 * images on the 2D HTML5 canvas.
 */


function Display(canvasID) {
    // set the canvas and context variables
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("2d");
    
    
    // Creates a second context that will be drawn to, and each frame the
    //  context data will be drawn into the main context.
    this.canvas2 = false;
    this.context2 = false;
    this.hasDoubleContext = false;
    this.setDoubleContext = function(width, height) {
        // create the second canvas object
        this.canvas2 = document.createElement("canvas");
        this.canvas2.width = width;
        this.canvas2.height = height;
        
        // create the second context from the canvas
        this.context2 = this.canvas2.getContext("2d");
        
        // flag having a second context so we can return appropriate variables
        this.hasDoubleContext = true;
    }
    
    
    // Removes the second context, resetting to the default canvas.
    this.removeDoubleContext = function() {
        this.canvas2 = false;
        this.context2 = false;
        this.hasDoubleContext = false;
    }
    
    
    // Returns the current context of this Display. If using a double-context
    //  setup, the second context will be returned instead.
    this.getContext = function() {
        if(this.hasDoubleContext)
            return this.context2;
        else
            return this.context;
    }
    
    
    // Clears the context(s) to prepare for drawing the next frame.
    this.clear = function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.hasDoubleContext) {
            this.context2.clearRect(0, 0,
                this.canvas2.width, this.canvas2.height);
        }
    }
    
    
    // If using a double-context setup, this function will draw the second
    //  context's data into the main context to render it to the screen.
    this.render = function() {
        if(this.hasDoubleContext)
            this.context.drawImage(this.canvas2, 0, 0);
    }
    
    
    // Getters for the width and height of the screen (canvas). If using a
    //  double-context setup, the size of the second canvas is returned.
    this.getWidth = function() {
        if(this.hasDoubleContext)
            return this.canvas2.width;
        else
            return this.canvas.width;
    }
    this.getHeight = function() {
        if(this.hasDoubleContext)
            return this.canvas2.height;
        else
            return this.canvas.height;
    }
    
    
    // Resets the screen to default, restoring any changes made to it.
    this.reset = function() {
        this.removeDoubleContext();
    }
}