/* File: bullets.js
 *
 * Bullets are used as common weapon projectiles for the player and for enemies.
 * Each bullet is a game object equipped with direction (angle), speed, and
 * a damage value that it deals on impact.
 *
 * Main Object:  Bullet(x, y, angle, speed, damage)
 * Prototype(s): GameObject()
 */



// Main Bullet object: sets up an arbitrary with all necessary initial
//  variables and internal functions.
function Bullet(x, y, angle, speed, damage, color, size){
    
    // Set the bullets initial location
    this.setPosition(x, y, angle);
    
    // Motion controller will move this bullet object when updated each frame.
    this.setMotionController(speed, angle);
    
    // Collision manager will manage this bullet's collision detection.
    this.setCollisionManager();
    
    // TODO - remove
    this.collision = new standardCollision();
    this.collision.parent = this;
    
    // the amount of damage this bullet inflicts on hit
    this.damage = damage;
    
    // Temporary variable used by external objects for damage manipulation.
    this.appliedDamage = this.damage;
    
    // visual appearance of this bullet (color and size/thickness):
    this.color = color;
    this.size = size;
    
    // update function: update the bullet x and y position on the
    //  bases of x and y speed values.
    this.update = function() {
        this.getMotionController().update();
        this.getCollisionManager().update();
    }
    
    // draw function: draw the bullet on the screen in the correct place
    this.draw = function(ctx) {
        ctx.save();
        
        // move to bullet's x and y position and rotate correctly
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + ANGLE_DRAW_OFFSET);
        
        // set to bullet's specified color, size, and draw it
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(0, -3);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
}
// Bullet is a Game Object.
Bullet.prototype = new GameObject();



// BulletFactory contains methods for creating different types of bullets.
var BulletFactory = {

    // Create a Player Bullet with default values if none are specified.
    playerBullet: function(x, y, dmg, angle, speed, color, size) {
        return new Bullet(x, y,
            typeof angle !== 'undefined' ? angle : ANGLE_UP,  // angle
            typeof speed !== 'undefined' ? speed : 6,         // speed
            typeof dmg   !== 'undefined' ? dmg   : 10,        // damage
            typeof color !== 'undefined' ? color : "#FFFF66", // color
            typeof size  !== 'undefined' ? size  : 2          // size
        );
    },
    
    // Create an Enemy Bullet with default values if none are specified.
    enemyBullet: function(x, y, angle, speed, dmg, color, size) {
        return new Bullet(x, y, angle, speed,
            typeof dmg   !== 'undefined' ? dmg   : 10,        // damage
            typeof color !== 'undefined' ? color : "#FF0022", // color
            typeof size  !== 'undefined' ? size  : 2          // size
        );
    },
    
    // Construct an arbitrary bullet (given the pre-defined parameters).
    createBullet: function(x, y, angle, speed, dmg, color, size) {
        return new Bullet(x, y, angle, speed, dmg, color, size);
    }

}
