/* File: definitions.js
 *
 * GLOBAL VARIABLE DEFINITIONS: contains constant variables that can be used
 * globally throughout the code without needing to be recomputed each time.
 */


// Angle values (relative to screen orientation):
//	Angle 0 starts on the right and goes clockwise.
var ANGLE_RIGHT = 0;          // 0 degrees (facing right of the screen)
var ANGLE_UP    = -Math.PI/2; // 90 degrees (facing up)
var ANGLE_LEFT  = Math.PI;    // 180 degrees (facing left of the screen)
var ANGLE_DOWN  = Math.PI/2;  // 270 degrees, or negative 90 degrees (facing down)

// More angle definitions (converted to assume standard counter-clockwise circle):
var ANGLE_45    = -Math.PI/4;
var ANGLE_67    = -3*Math.PI/8;
var ANGLE_113   = -5*Math.PI/8;
var ANGLE_135   = -3*Math.PI/4;
var ANGLE_N45   = Math.PI/4;
var ANGLE_N67   = 3*Math.PI/8;
var ANGLE_N113  = 5*Math.PI/8;
var ANGLE_N135  = 3*Math.PI/4;

// Alternative names for the above angles:
var ANGLE_TOP_RIGHT    = ANGLE_45;
var ANGLE_TOP_LEFT     = ANGLE_135;
var ANGLE_BOTTOM_RIGHT = ANGLE_N45;
var ANGLE_BOTTOM_LEFT  = ANGLE_N135;

// Other angle values:
var ANGLE_FULL_CIRCLE = 2*Math.PI;
var ANGLE_DRAW_OFFSET = Math.PI/2; // the context has a quarter-circle offset