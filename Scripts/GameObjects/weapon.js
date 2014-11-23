/* File: weapon.js
 *
 * TODO - incomplete
 */


function Weapon(gameObj, shootInterval = 0.25) {

    this.gameObj = gameObj;

    // minimum time needed between each shot (in seconds):
    this.shootInterval = shootInterval;

    this.isReady = false;
    this.ready = function() {
        return this.isReady;
    }

    // TODO - need timer to untoggle fire weapon

    // Fires the weapon to generate the appropriate bullets and missiles and
    //  returns a list of all fired projectiles.
    // Override this for each individual weapon.
    this.fire = function() {
        this.isReady = false;

        // TODO - x, y position of bullet needs to be offset by the game
        //  object's size, and then rotated over the orientation angle.
        var bullet = new Bullet(
            this.gameObj.getX(), this.gameObj.getY(), // position
            this.gameObj.getOrientation(), // angle
            // speed, damage, color, size
            6, 10, "#FFFFFF", 2);

        return bullet;
    }
}
