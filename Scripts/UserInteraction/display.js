/* File: display.js
 *
 * The Display object is a simple wrapper that contains an interface to draw
 * images on the 2D HTML5 canvas.
 */


function Display(canvas_id) {
    // set the canvas and context variables
    var canvas = document.getElementById(canvas_id);
    var context = canvas.getContext("2d");
    
    // width and height values from context
    var width = canvas.width;
    var height = canvas.height;
    
    
    // flags and variables for displaying statistics on the screen
    var stats_enabled = false;
    var FPS = 0;
    
    // Stats get refreshed every time the interval triggers (set up in enableStats).
    var refresh_handle = -1;
    var refresh_stats = true;
    this.refreshStats = function() {
        refresh_stats = true;
    }
       
    // Enables showing statistics (such as the framerate) on or off. Stats are drawn
    // as text on the screen after rendering everything else.
    // The refresh rate (given in milliseconds) is how often stats will refresh.
    this.enableStats = function(refresh_rate) {
        stats_enabled = true;
        refresh_handle = setInterval(this.refreshStats.bind(this), refresh_rate);
    }
    
    // Disables showing all statistics and stop the refresh timer.
    this.disableStats = function() {
        if(refresh_handle !== -1) {
            clearInterval(refresh_handle);
            refresh_handle = -1;
        }
        stats_enabled = false;
    }
    
    
    // Creates a second context that will be drawn to, and each frame the
    //  context data will be drawn into the main context.
    var canvas2 = null;
    var context2 = null;
    var hasDoubleBuffering = false;
    this.enableDoubleBuffering = function() {
        // create the second canvas object
        canvas2 = document.createElement("canvas");
        canvas2.width = width;
        canvas2.height = height;
        
        // create the second context from the canvas
        context2 = canvas2.getContext("2d");
        
        // flag having a second context so we can return appropriate variables
        hasDoubleBuffering = true;
    }
    
    
    // Removes the second context, resetting to single-buffering mode.
    this.disableDoubleBuffering = function() {
        canvas2 = null;
        context2 = null;
        hasDoubleBuffering = false;
    }
    
    
    // Returns the current context of this Display. If using a double-buffering
    //  setup, the second context will be returned instead.
    this.getContext = function() {
        if(hasDoubleBuffering)
            return context2;
        else
            return context;
    }
    
    
    // Clears the context(s) to prepare for drawing the next frame.
    this.clear = function() {
        context.clearRect(0, 0, width, height);
        if(hasDoubleBuffering)
            context2.clearRect(0, 0, width, height);
    }
    
    
    // (private)
    // Returns the current framerate of the game by computing the dT.
    function updateStats(dT) {
        if(refresh_stats) {
            FPS = Math.floor(1000 / dT);
            refresh_stats = false;
        }
    }
    
    
    // If using a double buffering setup, this function will draw the second
    //  context's data into the main context to render it to the screen. If
    //  double-buffering is not enabled, this will do nothing.
    // If stats are enabled, stats will be drawn to whichever context is viewed.
    this.render = function(dT) {
        if(hasDoubleBuffering)
            context.drawImage(canvas2, 0, 0);
        if(stats_enabled) {
            context.save();
            context.fillStyle = "rgba(0, 0, 0, 0.75)";
            context.fillRect(20, 20, 200, 30);
            context.fillStyle = "rgb(0, 255, 0)";
            context.font = "16px Ariel";
            updateStats(dT);
            context.fillText("FPS: " + FPS, 30, 40);
            context.restore();
        }
    }
    
    
    // Basic getters for the width and height of the screen (canvas).
    this.getWidth = function() {
        return width;
    }
    this.getHeight = function() {
        return height;
    }
    
    // Returns the ID value of the canvas this Display object is using.
    this.getCanvasID = function() {
        return canvas_id;
    }
}