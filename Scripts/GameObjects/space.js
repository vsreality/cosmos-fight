/*
 *  SPACE CLASS
 */
 
function space(ctx){
    //Array of layers
    this.layers = new Array();
    //Layer Object
    this.layer = function(amount,speedY){
        this.x1 = 0;
        this.y1 = -areaHeight;
        this.x2 = 0;
        this.y2 = 0;
        this.speedY = speedY*(30/FPS);
        // First part of layer
        this.stars1 = new Array();
        for(i=0; i<amount/2; i++){
            this.stars1[i] = {
                x:getRandNum(areaWidth),
                y:getRandNum(areaHeight)
            }
        }
        //Second part of layer
        this.stars2 = new Array();
        for(i=0; i<amount/2; i++){
            this.stars2[i] = {
                x:getRandNum(areaWidth),
                y:getRandNum(areaHeight)
            }
        }
 
        this.update = function(){
            //Updating a "y" coordinat of first part of layer
            this.y1 = this.y1+this.speedY;
            if(this.y1>=areaHeight)
                this.y1 = -areaHeight;
            //Updating a "y" coordinat of second part of layer
            this.y2 = this.y2+this.speedY;
            if(this.y2>=areaHeight)
                this.y2 = -areaHeight; 
        }
        this.draw = function(ctx){
            //Draw first part of layer
            ctx.save();
            ctx.strokeStyle = "rgb(255,255,128)";
            ctx.translate(0,this.y1);
            ctx.beginPath();
            for(i=0; i<this.stars1.length; i++){
                ctx.moveTo(this.stars1[i].x-1, this.stars1[i].y);
                ctx.lineTo(this.stars1[i].x+1, this.stars1[i].y);
                ctx.moveTo(this.stars1[i].x, this.stars1[i].y-1);
                ctx.lineTo(this.stars1[i].x, this.stars1[i].y+1);
                //ctx.arc(this.stars2[i].x, this.stars2[i].y, 1, 0, 2 * Math.PI, false);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            
            //Draw second part of layer
            ctx.save();
            ctx.strokeStyle = "rgb(255,255,128)";
            ctx.translate(0,this.y2);
            ctx.beginPath();
            for(i=0; i<this.stars2.length; i++){
                
                ctx.moveTo(this.stars2[i].x-1, this.stars2[i].y);
                ctx.lineTo(this.stars2[i].x+1, this.stars2[i].y);
                ctx.moveTo(this.stars2[i].x, this.stars2[i].y-1);
                ctx.lineTo(this.stars2[i].x, this.stars2[i].y+1);
                //ctx.arc(this.stars2[i].x, this.stars2[i].y, 1, 0, 2 * Math.PI, false);
            }
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }
    //Create layer function (number of stars, speed of stars)
    this.createLayer = function(num, spY){
        var newLayer = new this.layer(num, spY);
        this.layers.push(newLayer);
		return newLayer;
    }
    
    this.update = function(){
        for(var i=0; i<this.layers.length; i++){
            this.layers[i].update();
        }
    }
    this.draw = function(ctx){
        for(var i=0; i<this.layers.length; i++){
            this.layers[i].draw(ctx);
        }
    }
}