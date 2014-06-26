/* File: display.js
 *
 * The Display object is a simple wrapper that contains an interface to draw
 * images on the 2D HTML5 canvas.
 */


function Display(canvasID) {
    // set the canvas and context variables
    this.canvasID = canvasID;
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("2d");
    
    // width and height values from context
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Creates a second context that will be drawn to, and each frame the
    //  context data will be drawn into the main context.
    this.canvas2 = false;
    this.context2 = false;
    this.hasDoubleBuffering = false;
    this.enableDoubleBuffering = function() {
        // create the second canvas object
        this.canvas2 = document.createElement("canvas");
        this.canvas2.width = this.width;
        this.canvas2.height = this.height;
        
        // create the second context from the canvas
        this.context2 = this.canvas2.getContext("2d");
        
        // flag having a second context so we can return appropriate variables
        this.hasDoubleBuffering = true;
    }
    
    
    // Removes the second context, resetting to single-buffering mode.
    this.disableDoubleBuffering = function() {
        this.canvas2 = false;
        this.context2 = false;
        this.hasDoubleBuffering = false;
    }
    
    
    // Returns the current context of this Display. If using a double-buffering
    //  setup, the second context will be returned instead.
    this.getContext = function() {
        if(this.hasDoubleBuffering)
            return this.context2;
        else
            return this.context;
    }
    
    
    // Clears the context(s) to prepare for drawing the next frame.
    this.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height);
        if(this.hasDoubleBuffering)
            this.context2.clearRect(0, 0, this.width, this.height);
    }
    
    
    // If using a double buffering setup, this function will draw the second
    //  context's data into the main context to render it to the screen. If
    //  double-buffering is not enabled, this will do nothing.
    this.render = function() {
        if(this.hasDoubleBuffering)
            this.context.drawImage(this.canvas2, 0, 0);
    }
    
    
    // Basic getters for the width and height of the screen (canvas).
    this.getWidth = function() {
        return this.width;
    }
    this.getHeight = function() {
        return this.height;
    }
    
    // Returns the ID value of the canvas this Display object is using.
    this.getCanvasID = function() {
        return this.canvasID;
    }
}