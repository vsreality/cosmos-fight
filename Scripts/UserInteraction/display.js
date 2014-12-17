/* File: display.js
 *
 * The Display object is a simple wrapper that contains an interface to draw
 * images on the 2D HTML5 canvas.
 */


function Display(canvas_id) {
    // set the canvas and context variables
    this.canvas_id = canvas_id;
    this.canvas = document.getElementById(canvas_id);
    this.context = this.canvas.getContext("2d");
    
    // width and height values from context
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    
    // flags and variables for displaying statistics on the screen
    this.stats_enabled = false;
    this.FPS = 0;
    
    // Stats get refreshed every time the interval triggers (set up in enableStats).
    this.refresh_handle = -1;
    this.refresh_stats = true;
    this.refreshStats = function() {
        this.refresh_stats = true;
    }
       
    // Enables showing statistics (such as the framerate) on or off. Stats are drawn
    // as text on the screen after rendering everything else.
    // The refresh rate (given in milliseconds) is how often stats will refresh.
    this.enableStats = function(refresh_rate) {
        this.stats_enabled = true;
        this.refresh_handle = setInterval(this.refreshStats.bind(this), refresh_rate);
    }
    
    // Disables showing all statistics.
    this.disableStats = function() {
        if(this.refresh_handle !== -1) {
            clearInterval(this.refresh_handle);
            this.refresh_handle = -1;
        }
        this.stats_enabled = false;
    }
    
    
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
    // If stats are enabled, stats will be drawn to whichever context is viewed.
    this.render = function(dT) {
        if(this.hasDoubleBuffering)
            this.context.drawImage(this.canvas2, 0, 0);
        if(this.stats_enabled) {
            this.context.save();
            this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
            this.context.fillRect(20, 20, 200, 30);
            this.context.fillStyle = "rgb(0, 255, 0)";
            this.context.font = "16px Ariel";
            this.updateStats(dT);
            this.context.fillText("FPS: " + this.FPS, 30, 40);
            this.context.restore();
        }
    }
    
    
    // Returns the current framerate of the game by computing the dT.
    this.updateStats = function(dT) {
        if(this.refresh_stats) {
            this.FPS = Math.floor(1000 / dT);
            this.refresh_stats = false;
        }
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
        return this.canvas_id;
    }
}