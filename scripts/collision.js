/* File comments updated: Sunday, March 25, 2012 at 12:38 AM
 *
 * COLLISION SYSTEM: provides functions to create collision objects
 *	and detect collisions between objects and points.
 * Used by most animated objects on the canvas to detect collisions.
 */

// POINT: contains an x and y position
function Point(x, y){
	this.x = x;
	this.y = y;
}
// VECTOR: contains an x and y direction
function Vector(x, y){
	this.x = x;
	this.y = y;
}
// TRIANGLE: described by three points p1, p2 and p3
//	which together form the verticies of the triangle.
function Triangle(p1, p2, p3){
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
}

// CIRCLE: described by an x and y position as the circle's
//	center, and a radius.
function Circle(center, radius){
	this.c = center;
	this.r = radius;
}

// DOT PRODUCT OF TWO VECTORS
function dotProduct(v1, v2){
	return v1.x*v2.x + v1.y*v2.y;
}

// TRIANGLE-TO-POINT COLLISION FUNCTION
//	Returns TRUE if the given point and triangle intersect;
//	that is, if they collide on a 2D x-y plane.
// See Triangle object above for details on triangles.
function triangle2point(tr, p0){
	var area0 = Math.abs((tr.p2.x-tr.p1.x)*(tr.p3.y-tr.p1.y)-(tr.p3.x-tr.p1.x)*(tr.p2.y-tr.p1.y));
	var area1 = Math.abs((tr.p1.x-p0.x)*(tr.p2.y-p0.y)-(tr.p2.x-p0.x)*(tr.p1.y-p0.y));
	var area2 = Math.abs((tr.p2.x-p0.x)*(tr.p3.y-p0.y)-(tr.p3.x-p0.x)*(tr.p2.y-p0.y));
	var area3 = Math.abs((tr.p3.x-p0.x)*(tr.p1.y-p0.y)-(tr.p1.x-p0.x)*(tr.p3.y-p0.y));
	return (Math.abs(area1+area2+area3-area0) <= 0.0001);
}

// SEGMENT-TO-SEGMENT COLLISION FUNCTION
//	Returns TRUE if the two given lines intersect;
//	that is, if they collide on a 2D x-y plane.
// Lines are given as two points.
//	PARAMETERS line #1 as (p11, p12) and line #2 as (p21, p22)
function segment2segment(p11, p12, p21, p22){
	var a1 = p12.y - p11.y;
	var b1 = p11.x - p12.x;
	var c1 = a1*p11.x + b1*p11.y;

	var a2 = p22.y - p21.y;
	var b2 = p21.x - p22.x;
	var c2 = a2*p21.x + b2*p21.y;
	
	var det = a1*b2 - a2*b1;
	if(det == 0){
		//Lines are parallel
		return false;
	}else{
		var xi = (b2*c1 - b1*c2)/det;
        var yi = (a1*c2 - a2*c1)/det;
		
		if(((p11.x<=xi && xi<=p12.x)||(p12.x<=xi && xi<=p11.x))&&
		((p11.y<=yi && yi<=p12.y)||(p12.y<=yi && yi<=p11.y))&&
		((p21.x<=xi && xi<=p22.x)||(p22.x<=xi && xi<=p21.x))&&
		((p21.y<=yi && yi<=p22.y)||(p22.y<=yi && yi<=p21.y))){
			return true;
		}
		else{
			return false;
		}
		
	}
}

// TRIANGLE-TO-TRIANGLE COLLISION FUNCTION
//	Returns TRUE if the two given triangles intersect;
//	that is, if they collide on a 2D x-y plane.
// See Triangle object above for details on triangles.
function triangle2triangle(tr1, tr2){
	if(segment2segment(tr1.p1, tr1.p2, tr2.p1, tr2.p2))
		return true;
	if(segment2segment(tr1.p1, tr1.p2, tr2.p2, tr2.p3))
		return true;
	if(segment2segment(tr1.p1, tr1.p2, tr2.p3, tr2.p1))
		return true;
	if(segment2segment(tr1.p2, tr1.p3, tr2.p1, tr2.p2))
		return true;
	if(segment2segment(tr1.p2, tr1.p3, tr2.p2, tr2.p3))
		return true;
	if(segment2segment(tr1.p2, tr1.p3, tr2.p3, tr2.p1))
		return true;
	if(segment2segment(tr1.p3, tr1.p1, tr2.p1, tr2.p2))
		return true;
	if(segment2segment(tr1.p3, tr1.p1, tr2.p2, tr2.p3))
		return true;
	if(segment2segment(tr1.p3, tr1.p1, tr2.p3, tr2.p1))
		return true;
	if(triangle2point(tr1,tr2.p1))
		return true;
	if(triangle2point(tr1,tr2.p2))
		return true;
	if(triangle2point(tr1,tr2.p3))
		return true;
	if(triangle2point(tr2,tr1.p1))
		return true;
	if(triangle2point(tr2,tr1.p2))
		return true;
	if(triangle2point(tr2,tr1.p3))
		return true;
}


// CIRCLE-TO-CIRCLE COLLISION FUNCTION
//	Returns TRUE if the two given circles intersect;
//	that is, if they collide on a 2D x-y plane.
// 	This function takes two circles defined by x,y center and r radius.
function circle2circle(cir1, cir2){
	var d = (cir1.c.x - cir2.c.x)*(cir1.c.x - cir2.c.x)+(cir1.c.y - cir2.c.y)*(cir1.c.y - cir2.c.y);
	var r = (cir1.r + cir2.r)*(cir1.r + cir2.r);
	return (d <= r);
}

// CIRCLE-TO-POINT COLLISION FUNCTION
//	Returns TRUE if the given circle and point intersect;
//	that is, if they collide on a 2D x-y plane.
// 	This function takes a circle defined by an x,y center and r radius,
//	and a point defined as an x,y coordinate.
// PARAMETERS: point as (x1, y1) and circle as (x2, y2, r)
function circle2point(cir, p){
	var d = (cir.c.x - p.x)*(cir.c.x - p.x)+(cir.c.y - p.y)*(cir.c.y - p.y);
	return (d <= cir.r*cir.r);
}

// CREATE CIRCLE FROM TRIANGE
// Given a triangle object, this function returns a circle object based
//	on the triangle. Essentially, it encircles the traingle and returns
//	the circle such that the triangle is entirely encompassed by it.
// See functions at top of page for details on triangle and circle objects.
function circleByTriangle(tr){
	var midP1 = new Point((tr.p1.x + tr.p2.x)/2, (tr.p1.y + tr.p2.y)/2);
	var midP2 = new Point((tr.p2.x + tr.p3.x)/2, (tr.p2.y + tr.p3.y)/2);
	
	var A1 = tr.p2.y - tr.p1.y;
	var B1 = tr.p1.x - tr.p2.x;
	var D1 = -B1*midP1.x + A1*midP1.y;
	
	var A2 = tr.p3.y - tr.p2.y;
	var B2 = tr.p2.x - tr.p3.x;
	var D2 = -B2*midP2.x + A2*midP2.y;
	
	var det =  B2*A1 - B1*A2;
	var x = (A2*D1 - A1*D2)/det;
	var y = (B2*D1 - B1*D2)/det;
	var r = Math.sqrt((x - tr.p1.x)*(x - tr.p1.x) + (y - tr.p1.y)*(y - tr.p1.y));
	return (new Circle(new Point(x, y), r));
}

// CIRCLE-TO-TRIANGLE COLLISION FUNCTION
function circle2triangle(cir, tr){
	// Check if one of vertex of triangle inside of circle
	if(circle2point(cir, tr.p1))
		return true;
	if(circle2point(cir, tr.p2))
		return true;
	if(circle2point(cir, tr.p3))
		return true;
	// Check if center of circle inside of triangle
	if(triangle2point(tr,cir.c))
		return true;
	// Check if circle intersect one of edges of triangle
	//Edge p1-p2
	var v1 = new Vector(tr.p2.x - tr.p1.x, tr.p2.y - tr.p1.y);
	var v0 = new Vector(cir.c.x - tr.p1.x, cir.c.y - tr.p1.y);
	var dotV10 = dotProduct(v1, v0);
	if(dotV10>0){
		var lengthV1 = dotProduct(v1, v1);//squared length
		var lengthProection = dotV10*dotV10/lengthV1;//squared length of proection v0 on v1
		if(lengthProection<lengthV1){
			var lengthV0 = dotProduct(v0, v0);//squared length
			if(lengthV0-lengthProection < cir.r*cir.r){
				return true;
			}
		}
	}
	//Edge p2-p3
	v1 = new Vector(tr.p3.x - tr.p2.x, tr.p3.y - tr.p2.y);
	v0 = new Vector(cir.c.x - tr.p2.x, cir.c.y - tr.p2.y);
	dotV10 = dotProduct(v1, v0);
	if(dotV10>0){
		var lengthV1 = dotProduct(v1, v1);//squared length
		var lengthProection = dotV10*dotV10/lengthV1;//squared length of proection v0 on v1
		if(lengthProection<lengthV1){
			var lengthV0 = dotProduct(v0, v0);//squared length
			if(lengthV0-lengthProection < cir.r*cir.r){
				return true;
			}
		}
	}
	//Edge p3-p1
	v1 = new Vector(tr.p1.x - tr.p3.x, tr.p1.y - tr.p3.y);
	v0 = new Vector(cir.c.x - tr.p3.x, cir.c.y - tr.p3.y);
	dotV10 = dotProduct(v1, v0);
	if(dotV10>0){
		var lengthV1 = dotProduct(v1, v1);//squared length
		var lengthProection = dotV10*dotV10/lengthV1;//squared length of proection v0 on v1
		if(lengthProection<lengthV1){
			var lengthV0 = dotProduct(v0, v0);//squared length
			if(lengthV0-lengthProection < cir.r*cir.r){
				return true;
			}
		}
	}
	return false;
}
// Function return actual distance between point p and line p1, p2.
// It use sqrt function and don't recommended for frequent usage
function point2lineDistance(p,p1,p2){
	//http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
	return Math.abs((p2.x-p1.x)*(p1.y-p.y)-(p1.x-p.x)*(p2.y-p1.y))
			/Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
}

// Transformations
//Rotate on angle 'angle'
function rotatePoint(p, angle){
	var x = p.x;
	p.x = Math.cos(angle)*x - Math.sin(angle)*p.y;
	p.y = Math.sin(angle)*x + Math.cos(angle)*p.y;
	return p;
}
// Translate point on dx, dy
function translatePoint(p, dx, dy){
	p.x += dx;
	p.y += dy;
}

// Create point from existent point
function createPoint(p){
	return {x:p.x, y:p.y};
}
// Copy point p2 to p1
function copyPoint(p1, p2){
	p1.x = p2.x;
	p1.y = p2.y;
}

// === Collision objects ====
function standardCollision(r){
	// if 'r = 0' or undefined, then standardCollision object become point
	// if 'r != 0', then standardCollision is circle with radius 'r'
	r = typeof r !== 'undefined' ? r : 0;
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	this.r = r;
	this.parent;
	this.cObjects = new Array();
	// Add collision object to collision
	this.addObject = function(newOb){
		this.cObjects.push(newOb);
		return this;
	}
	// Update collision position
	this.updatePosition = function(){
		this.x = this.parent.getX();
		this.y = this.parent.getY();
		return this;
	}
	// Update collision angle
	this.updateAngle = function(){
		this.angle = this.parent.angle;
		return this;
	}
}
// === Collision objects ===
// Triangle collision object
// p1, p2, p3 are three points of triangle
function cTriangle(p1, p2, p3){
	// Temporary points
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	// Original points
	this.orP1 = createPoint(p1);
	this.orP2 = createPoint(p2);
	this.orP3 = createPoint(p3);
	
	// Rotare triangle on angle 'angle' from current position
	this.rotate = function(angle){
		rotatePoint(this.p1, angle);
		rotatePoint(this.p2, angle);
		rotatePoint(this.p3, angle);
		return this;
	}
	// Reset triangle on original position
	this.reset = function(){
		copyPoint(this.p1, this.orP1);
		copyPoint(this.p2, this.orP2);
		copyPoint(this.p3, this.orP3);
		return this;
	}
	// Rotate triangle on specific angle 'angle' from original position
	this.setOrientation = function(angle){
		this.reset();
		this.rotate(angle);
		return this;
	}
	// Translate triangle on dx, dy from current position
	this.translate = function(dx, dy){
		translatePoint(this.p1, dx, dy);
		translatePoint(this.p2, dx, dy);
		translatePoint(this.p3, dx, dy);
		return this;
	}
}
// Circle collision object
// 'center' is a center of collision circle (point object)
// 'radius' is a radius of collision object
function cCircle(center, radius){
	// Temporary center
	this.c = center;
	// Original center
	this.orC = createPoint(center);
	// Radius
	this.r = radius;
	// Rotate center of circle on 'angle' from current position
	this.rotate = function(angle){
		rotatePoint(this.c, angle);
		return this;
	}
	// Reset circle on original position
	this.reset = function(){
		copyPoint(this.c, this.orC);
		return this;
	}
	// Rotate center of circle on 'angle' from original position
	this.setOrientation = function(angle){
		this.reset();
		this.rotate(angle);
		return this;
	}
	// Translate circle on dx, dy
	this.translate = function(dx, dy){
		translatePoint(this.c, dx, dy);
		return this;
	}
}
// isCollide check if two collision collide with each other
// 'cObje1', 'cObje2' are collisions, objects of type "standardCollision"
isCollide = function(cObje1, cObje2){
	var d2 = (cObje1.x-cObje2.x)*(cObje1.x-cObje2.x)+(cObje1.y-cObje2.y)*(cObje1.y-cObje2.y);
	if(d2<((cObje1.r+cObje2.r)*(cObje1.r+cObje2.r))){
		// if one of the objects is a point?
		if(cObje1.r*cObje2.r == 0){
			// Who is a point?
			var pObject; // Point object
			var sObject; // Some object
			if(cObje1.r == 0){
				pObject = cObje1;
				sObject = cObje2;
			}else{
				pObject = cObje2;
				sObject = cObje1;				
			}
			// sObject is a just a circle?
			if(sObject.cObjects.length == 0){
				// Yes
				return true;
			}else{
				// No, and we have to check it children
				var objPoint = new Point(pObject.x, pObject.y);
				for(var i=0; i<sObject.cObjects.length; i++){
					sObject.cObjects[i].reset().rotate(sObject.angle).translate(sObject.x, sObject.y);

					if(sObject.cObjects[i] instanceof cTriangle)
						if(triangle2point(sObject.cObjects[i], objPoint))
							return true;
					
					if(sObject.cObjects[i] instanceof cCircle)
						if(circle2point(sObject.cObjects[i], objPoint))
							return true;
				}
				return false;
			}
		}else{
			// One or both objects just a circle?
			if(cObje1.cObjects.length*cObje2.cObjects.length == 0){
				if(cObje1.cObjects.length + cObje2.cObjects.length == 0 ){
					// They are both circles
					return true;
				}
				// One object is circle another some thing else
				var cirObject;
				var sObject;
				if(cObje1.cObjects.length == 0){
					cirObject = cObje1;
					sObject = cObje2;
				}else{
					cirObject = cObje2;
					sObject = cObje1;
				}
				
				var objCircle = new Circle(new Point(cirObject.x, cirObject.y), cirObject.r);
				for(var i=0; i<sObject.cObjects.length; i++){
					sObject.cObjects[i].reset().rotate(sObject.angle).translate(sObject.x, sObject.y);
					// Triangle?
					if(sObject.cObjects[i] instanceof cTriangle)
						if(circle2triangle(objCircle, sObject.cObjects[i]))
							return true;
					// Circle?
					if(sObject.cObjects[i] instanceof cCircle)
						if(circle2circle(objCircle, sObject.cObjects[i]))
							return true;
				}
				return false;
			}else{
				// Each object has complecs structure
				for(var i=0; i<cObje1.cObjects.length; i++){
					cObje1.cObjects[i].reset().rotate(cObje1.angle).translate(cObje1.x, cObje1.y);
					for(var j=0; j<cObje2.cObjects.length; j++){
						cObje2.cObjects[j].reset().rotate(cObje2.angle).translate(cObje2.x, cObje2.y);
						// First object is triangle?
						if(cObje1.cObjects[i] instanceof cTriangle){
							// Triangle to Triangle
							if(cObje2.cObjects[j] instanceof cTriangle)
								if(triangle2triangle(cObje1.cObjects[i], cObje2.cObjects[j]))
									return true;
								
							//Triangle to Circle
							if(cObje2.cObjects[j] instanceof cCircle)
								if(circle2triangle(cObje2.cObjects[j], cObje1.cObjects[i]))
									return true;
						}
						// First object is Circle?
						if(cObje1.cObjects[i] instanceof cCircle){
							// Circle to Triangle
							if(cObje2.cObjects[j] instanceof cTriangle)
								if(circle2triangle(cObje1.cObjects[i], cObje2.cObjects[j]))
									return true;
							
							if(cObje2.cObjects[j] instanceof cCircle)
								if(circle2circle(cObje1.cObjects[i], cObje2.cObjects[j]))
									return true;
						}
					}
				}
				return false;
			}
		}
	}else{
		return false
	}
}