/* File: background.js
 *
 * Defines an interface for various backgrounds that are drawn behind menus or
 * levels. The default Background just draws a black screen. However, a
 * customized Background object can have complex animations.
 */


function Background() {

    // Update the animation this by the given time step.
    // Override to implement custom animation updates.
    this.update = function(dT) { }
    
    // Render the animation to the given context. Call before any other drawing
    // methods to ensure that the background doesn't overdraw anything else.
    // Override to implement custom animation rendering.
    // By default, the screen will just be black.
    this.draw = function(ctx) {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.restore();
    }
    
}