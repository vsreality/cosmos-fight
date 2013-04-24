/* GUI CLASS:
 *	Elements that are used by the menus and other GUI containers, such as buttons.
 *	These elements all share the same GuiObject prototype.
 */


/***** GLOBAL VARIABLES (used to identify GUI modes) *****/
var GUI_BUTTON_NORMAL = 0;
var GUI_BUTTON_HIGHLIGHTED = 1;
var GUI_BUTTON_DEPRESSED = 2;


/***** STANDARD GUI OBJECT (prototype for all other objects *****/
function GuiObject(x, y, w, h){
	// standard position and size values
	this.x = x;
	this.x2 = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.size = 0; // size is used for text objects
	this.position = 1; // defaults to 1 (right alignment)
	this.focused = false; // this element is not focused by default
    
	// Mouse event action functions
    this.mousemove = function(x, y){}
    this.mousedown = function(x, y){}
    this.mouseup = function(x, y){}
    
	// update: sets the position of this GUI rectangle based on the
	//	current positioning option.
    this.update = function(){
        switch(this.position){
            case 1 : this.x2 = this.x; break;
            case 2 : this.x2 = this.x - this.width / 2; break;
            case 3 : this.x2 = this.x - this.width; break;
        }
    }
	
	// draw function: must be overridden for specific objects
	this.draw = function(ctx){}
	
	// Alignment functions:
	this.left = function(){ // align this object to the left side
		this.position = 1;
		return this;
	}
	this.center = function(){ // align this object to the center
		this.position = 2;
		return this;
	}
    this.right = function(){ // align this object to the right side
        this.position = 3;
        return this;
    }
    
	// returns TRUE if the given x, y coordinate overlap the position
	//	of this rectangle GUI.
	this.intersects = function(x, y){
		y += this.size;
		return (x > this.x2 && x < (this.x2 + this.width) &&
				y > this.y && y < (this.y + this.size));
	};
}


// GUI Filled Rectangle:
// 	create a rectangular GUI object with the given rectangular dimensions.
//	This object is used as an embedded or popup menu within the level.
function GuiFillRectangle(x, y, w, h){
    this.x = x;
    this.x2= x;
    this.y = y;
    this.width = w;
    this.height = h;
	
	// set the style of the given context in the draw function.
	//	this function needs to be overridden specifically
    this.style = function(ctx){};
    
	// draw the GUI rectangle
	this.draw = function(ctx){
		ctx.save();
		this.style(ctx);
		ctx.fillRect(this.x2, this.y, this.width, this.height);
		ctx.restore();
	}
}
// make GuiFillRectangle a subclass of the generic GuiObject:
GuiFillRectangle.prototype = new GuiObject(0, 0, 0, 0);


// GUI Rounded Rectangle:
//	same as GUI Fill Rectangle, except draws a rounded rectangle instead
function GuiRoundedRectangle( x, y, w, h, r){
	// setup specific values for this GUI rectangle
    this.x = x;
    this.x2= x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.r = r;
	
	// set the style of the given context in the draw function.
	//	this function needs to be overridden specifically
    this.style = function(ctx){};
    
	// override the draw function to draw a rounded rectangle instead
    this.draw = function(ctx){
		ctx.save();
        ctx.beginPath();
        this.style(ctx);
        pathRoundedRectangle(ctx, this.x2, this.y, this.width, this.height, this.r);
        ctx.fill();
		ctx.stroke();
        ctx.closePath();
		ctx.restore();
    }
}
// make GuiFillRectangle a subclass of the generic GuiObject:
GuiRoundedRectangle.prototype = new GuiObject(0, 0, 0, 0);


// GUI Text object:
//	create a text object to be used inside a GUI menu. A text object is NOT
//	interactive, as opposed to a GUI button.
function GuiText(text, x, y, color, size){
	// text object variables
	this.text = text;
	this.x = x;
	this.x2= x;
	this.y = y;
	this.size = size;
    
	this.font = "MainFont";
	context.font = "" + this.size + "pt " + this.font;
	this.width = context.measureText(this.text).width;
    
	this.color = color;
	
	this.update = function(){
		context.font = "" + this.size + "pt " + this.font;
		this.width = context.measureText(this.text).width;
		switch(this.position){
			case 1 : this.x2 = this.x; break;
			case 2 : this.x2 = this.x - (context.measureText(this.text).width / 2); break;
			case 3 : this.x2 = this.x - context.measureText(this.text).width; break;
		}
		// GuiText.prototype.draw.call(this, ctx);
	}
    
    this.draw = function(ctx){
		ctx.font = "" + this.size + "pt " + this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.x2, this.y);
        ctx.strokeStyle = this.color;
        //ctx.strokeRect(this.x,  this.y - this.size, this.width, this.size);
    }
}
// make GuiText a subclass of the generic GuiObject:
GuiText.prototype = new GuiObject(0, 0, 0, 0);


// GUI Button object:
//	create a button object to be used inside a GUI menu. A button object is fully
//	interactive, and executes events when clicked.
function GuiButton(text, x, y, size){
	// button variables
	this.text = text;
    this.x = x;
    this.x2= x;
    this.y = y;
    this.size = size;
	
	// enabled: if not enabled, the button will not be clickable
	this.enabled = true;
	
	// default to normal mode (not highlighted nor depressed)
	this.mode = GUI_BUTTON_NORMAL;
    
	// EVENT that occurs when this button is successfully clicked
	this.onClick = function(){}
	
	/*** MOUSE MOVEMENT/ACTION EVENTS ***/
	// A button will automatically call its onClick event when it detects that it
	//	has been successfully clicked.
	// mouseover: called whenever the mouse moves
	this.mousemove = function(x, y){
		// if button isn't currently pressed down and the mouse moves over it,
		//	set it to highlighted (mouse over) mode
		if(this.mode != GUI_BUTTON_DEPRESSED && this.intersects(x, y))
			this.mode = GUI_BUTTON_HIGHLIGHTED;
		// otherwise, if the button isn't currently pressed down, set it to normal mode
		else if(this.mode != GUI_BUTTON_DEPRESSED)
			this.mode = GUI_BUTTON_NORMAL;
	}
	// mousedown: called when the mouse button is pushed down
	this.mousedown = function(x, y){
		// if the mouse button was pushed down over this button, set it to depressed
		//	(pressed down) mode
		if(this.intersects(x, y) && this.enabled)
			this.mode = GUI_BUTTON_DEPRESSED;
	}
	// mouseup: called when the mouse button is released (if it has already been pressed down
	//	before)
	this.mouseup = function(x, y){
		// if this button is pressed down and the mouse is released over it, this means the
		//	click action occurred. Set the button to highlighted (moused over) mode, and
		//	run the onClick event!
		if(this.mode == GUI_BUTTON_DEPRESSED && this.intersects(x, y)){
			this.mode = GUI_BUTTON_NORMAL;
			this.onClick();
		}
		// otherwise, the mouse isn't near the button, so just set it to normal mode
		else
			this.mode = GUI_BUTTON_NORMAL;
	}
    
	// determine the width of the button's text using context measureText function
    context.font = "" + this.size + "pt MainFont";
    this.width = context.measureText(this.text).width;
    
	// update function (called each frame, corrects any font metrics as needed)
    this.update = function(){
        context.font = "" + this.size + "pt MainFont";
        this.width = context.measureText(this.text).width;
        switch(this.position){
            case 1 : this.x2 = this.x; break;
            case 2 : this.x2 = this.x - (context.measureText(this.text).width / 2); break;
            case 3 : this.x2 = this.x - context.measureText(this.text).width; break;
        }
		// GuiButton.prototype.draw.call(this, ctx);
    }
	
	// DRAW FUNCTION:
	//	draw this button to the context (all graphics and designs go here)
    this.draw = function(ctx){
		ctx.save();
		
		// coloring if the button is enabled
		if(this.enabled){
			// setup stroke (border) with gradient
			var strokeGrd =
				ctx.createLinearGradient(this.x2-20, this.y-8, this.x2+this.width+20, this.y-8);
			strokeGrd.addColorStop(0, "#006600");
			// setup inner coloring based on button mode
			if(this.mode == GUI_BUTTON_NORMAL)
				strokeGrd.addColorStop(0.5, "#FF9900");
			else
				strokeGrd.addColorStop(0.5, "#FFFF00");
			strokeGrd.addColorStop(1, "#006600");
			ctx.strokeStyle = strokeGrd;
			ctx.lineWidth = 3;
			// setup fill gradient
			var fillGrd =
				ctx.createRadialGradient(this.x2+this.width/2, this.y-8, 0,
										 this.x2+this.width/2, this.y-8, this.width/2);
			fillGrd.addColorStop(0, "#330033");
			// setup outside coloring based on button mode
			if(this.mode == GUI_BUTTON_NORMAL)
				fillGrd.addColorStop(1, "#336699");
			else if(this.mode == GUI_BUTTON_HIGHLIGHTED)
				fillGrd.addColorStop(1, "#3399CC");
			else
				fillGrd.addColorStop(1, "#333366");
			ctx.fillStyle = fillGrd;
		}
		
		// coloring if the button is NOT enabled:
		else{
			var strokeGrd =
				ctx.createLinearGradient(this.x2-20, this.y-8, this.x2+this.width+20, this.y-8);
			strokeGrd.addColorStop(0, "#224422");
			strokeGrd.addColorStop(0.5, "#AA7744");
			strokeGrd.addColorStop(1, "#224422");
			ctx.strokeStyle = strokeGrd;
			ctx.lineWidth = 3;
			// setup fill gradient
			var fillGrd =
				ctx.createRadialGradient(this.x2+this.width/2, this.y-8, 0,
										 this.x2+this.width/2, this.y-8, this.width/2);
			fillGrd.addColorStop(0, "#000000");
			fillGrd.addColorStop(1, "#333333");
			ctx.fillStyle = fillGrd;
		}
		
		// draw the button shape
		ctx.beginPath();
			ctx.moveTo(this.x2 + this.width/2, this.y - 23);
			ctx.lineTo(this.x2 - 20, this.y - 28);
			ctx.lineTo(this.x2 - 15, this.y - 8);
			ctx.lineTo(this.x2 - 20, this.y + 12);
			ctx.lineTo(this.x2 + this.width/2, this.y + 7);
			ctx.lineTo(this.x2 + this.width + 20, this.y + 12);
			ctx.lineTo(this.x2 + this.width + 15, this.y - 8);
			ctx.lineTo(this.x2 + this.width + 20, this.y - 28);
			ctx.lineTo(this.x2 + this.width/2, this.y - 23);
			ctx.stroke();
			ctx.globalAlpha = 0.4;
			ctx.fill();
		ctx.closePath();
		ctx.globalAlpha = 1.0;
		
		// fill in the button text
		ctx.font = "" + this.size + "pt MainFont";
		// coloring if enabled:
		if(this.enabled){
			if(this.mode == GUI_BUTTON_NORMAL)
				ctx.fillStyle = "#FFFF33";
			else if(this.mode == GUI_BUTTON_HIGHLIGHTED)
				ctx.fillStyle = "#FFFFFF";
			else
				ctx.fillStyle = "#888888";
		}
		else{ // otherwise, just gray the text out
			ctx.fillStyle = "#777777";
		}
		// draw the text
		ctx.fillText(this.text, this.x2, this.y);
		
		ctx.restore();
    }
	
	// toggle enabled true or false with this option
	this.setEnabled = function(enabled){
		this.enabled = enabled;
	}
	
	// customized intersects function (because the button is bigger than the text)
	this.intersects = function(x, y){
		return (x > this.x2 - 20 && x < (this.x2 + this.width + 20) &&
				y > this.y - 28 && y < (this.y + 12));
	};
}
// make GuiButton a subclass of the generic GuiObject:
GuiButton.prototype = new GuiObject(0, 0, 0, 0);


// function to create an instance of a TEXT button (similar to a normal button,
//	but without the graphics - just pain (though interactive) text.
// This is based off the GuiButton, but is returned as a separate object
function createGuiTextButton(text, x, y, size){
	var textButton = new GuiButton(text, x, y, size);
	
	// simple draw function: no graphics, just text and colors based
	//	on how the button's state is
	textButton.draw = function(ctx){
		ctx.save();
		
		// set font
		ctx.font = "" + this.size + "pt MainFont";
		
		if(!this.enabled) // if disabled
			ctx.fillStyle = "#777777";
		else if(this.mode == GUI_BUTTON_NORMAL) // if normal
			ctx.fillStyle = "#FFFF33";
		else if(this.mode == GUI_BUTTON_HIGHLIGHTED) // if highlighted
			ctx.fillStyle = "#FFCCCC";
		else // if depressed
			ctx.fillStyle = "#88AA88";
		ctx.fillText(this.text, this.x2, this.y);
		
		ctx.restore();
	}
	
	// revert the intersect function to the prototype's function
	textButton.intersects = function(x, y){
		return GuiButton.prototype.intersects.call(this, x, y);
	};
	
	return textButton;
}


// GUI Checkbox Button object:
//	create a checkbox object to be used inside a GUI menu. A checkbox button object
//	is like a button, except its action determines two states: checked or unchecked,
//	and activating this button runs the onClick event with checked passed in as true/false.
// This button is a square, and "size: determines its width/height dimension.
function GuiCheckboxButton(x, y, size, checked){
	// button variables
    this.x = x;
    this.x2= x;
    this.y = y;
    this.size = size;
	
	// enabled: if not enabled, the button will not be clickable
	this.enabled = true;
	
	// default to normal mode (not highlighted nor depressed)
	this.mode = GUI_BUTTON_NORMAL;
	
	// checked: true if checked, false otherwise
	this.checked = checked;
    
	// toggle function: switches checked mode and calls the onClicked event
	this.toggle = function(){
		this.checked = !this.checked;
		this.onClick(this.checked);
	}
	
	// EVENT that occurs when this button is successfully clicked
	this.onClick = function(checked){}
	
	/*** MOUSE MOVEMENT/ACTION EVENTS ***/
	// A button will automatically call its onClick event when it detects that it
	//	has been successfully clicked.
	// mouseover: called whenever the mouse moves
	this.mousemove = function(x, y){
		// if button isn't currently pressed down and the mouse moves over it,
		//	set it to highlighted (mouse over) mode
		if(this.mode != GUI_BUTTON_DEPRESSED && this.intersects(x, y))
			this.mode = GUI_BUTTON_HIGHLIGHTED;
		// otherwise, if the button isn't currently pressed down, set it to normal mode
		else if(this.mode != GUI_BUTTON_DEPRESSED)
			this.mode = GUI_BUTTON_NORMAL;
	}
	// mousedown: called when the mouse button is pushed down
	this.mousedown = function(x, y){
		// if the mouse button was pushed down over this button, set it to depressed
		//	(pressed down) mode
		if(this.intersects(x, y) && this.enabled)
			this.mode = GUI_BUTTON_DEPRESSED;
	}
	// mouseup: called when the mouse button is released (if it has already been pressed down
	//	before)
	this.mouseup = function(x, y){
		// if this button is pressed down and the mouse is released over it, this means the
		//	click action occurred. Set the button to highlighted (moused over) mode, and
		//	run the onClick event!
		if(this.mode == GUI_BUTTON_DEPRESSED && this.intersects(x, y)){
			this.mode = GUI_BUTTON_HIGHLIGHTED;
			this.toggle();
		}
		// otherwise, the mouse isn't near the button, so just set it to normal mode
		else
			this.mode = GUI_BUTTON_NORMAL;
	}
    
	// update function (called each frame, and sets up allignment as needed)
    this.update = function(){
        switch(this.position){
            case 1 : this.x2 = this.x; break;
            case 2 : this.x2 = this.x - (this.size / 2); break;
            case 3 : this.x2 = this.x - this.size; break;
        }
    }
	
	// DRAW FUNCTION:
	//	draw this button to the context (all graphics and designs go here)
    this.draw = function(ctx){
		ctx.save();
		
		// coloring if the button is enabled
		if(this.enabled){
			if(this.mode == GUI_BUTTON_HIGHLIGHTED)
				ctx.strokeStyle = "#AAEE00";
			else
				ctx.strokeStyle = "#559900";
			// setup inside coloring based on button mode
			var fillColor;
			if(this.mode == GUI_BUTTON_NORMAL)
				fillColor = "#336699";
			else if(this.mode == GUI_BUTTON_HIGHLIGHTED)
				fillColor = "#3399CC";
			else
				fillColor = "#333366";
			ctx.fillStyle = fillColor;
		}
		
		// coloring if the button is NOT enabled:
		else{
			// border
			ctx.strokeStyle = "#224422";
			// inner fill color
			ctx.fillStyle = "#333333";
		}
		
		// draw the button shape
		ctx.lineWidth = 2;
		ctx.beginPath();
			ctx.rect(this.x2, this.y, this.size, this.size);
			ctx.stroke();
			ctx.globalAlpha = 0.4;
			ctx.fill();
		ctx.closePath();
		
		// if button is checked, draw the checkmark
		ctx.globalAlpha = 1.0;
		ctx.lineWidth = Math.round(this.size/6);
		ctx.strokeStyle = "#FFFF33";
		if(this.checked){
			ctx.beginPath();
				ctx.moveTo(Math.round(this.x2 + this.size/6),
						   Math.round(this.y + this.size/2));
				ctx.lineTo(Math.round(this.x2 + this.size/2),
						   Math.round(this.y + 4*this.size/5));
				ctx.lineTo(Math.round(this.x2 + 4.5*this.size/5),
						   this.y);
				ctx.stroke();
			ctx.closePath();
		}
		
		ctx.restore();
    }
	
	// toggle enabled true or false with this option
	this.setEnabled = function(enabled){
		this.enabled = enabled;
	}
	
	// customized intersects function (because the button is bigger than the text)
	this.intersects = function(x, y){
		return (x > this.x2 && x < (this.x2 + this.size) &&
				y > this.y && y < (this.y + this.size));
	};
}
// make GuiCheckboxButton a subclass of the generic GuiObject:
GuiCheckboxButton.prototype = new GuiObject(0, 0, 0, 0);


// GUI Horizontal List Button object:
//	create a horizontal list menu object to be used inside a GUI menu. A horizontal list button
//	object is like multiple checkboxes linked together, where selecting one will deselect
//	all others. Each change updates the selection variable, and also runs the onClick event
//	with the value of the current selection.
//	EXAMPLE: see options menu (effects level chooser)
// This button is a rectangle, and "size" determines height. With is determined based on how
//	many selections there are. The current selection text is displayed next to the box.
// The "selectionList" parameter should be an array of text values representing each selection.
// The "selected" parameter is the index (starting at 0) of the current selection.
function GuiHorizontalListButton(x, y, size, selectionList, selected){
	// button variables
    this.x = x;
    this.x2= x;
    this.y = y;
    this.size = size;
	
	// enabled: if not enabled, the button will not be clickable
	this.enabled = true;
	
	// default to normal mode (not highlighted nor depressed)
	this.mode = GUI_BUTTON_NORMAL;
	
	// list of selection and the index of which is selected
	this.selectionList = selectionList;
	this.selected = selected;
    
    // function to create an inner button:
    //  use the GuiButton object as a model to create a simplified inner button
    //  that will be used as a part of the inner buttons of this button list.
    this.createInnerButton = function(x, id){
        // create the new button object
        var button = new GuiButton("", x, this.y+5, this.size-10);
        button.width = Math.round((this.size-10)/2);
        button.selected = false;
        button.right();
        // modify the buttons draw function to draw a simple rectangular object instead
        button.draw = function(ctx){
            ctx.save();
            var color;
            if(this.selected)
                color = "#FF3300";
            else if(this.mode == GUI_BUTTON_NORMAL)
                color = "#3366FF";
            else if(this.mode == GUI_BUTTON_HIGHLIGHTED)
                color = "#33CCFF";
            else
                color = "#3300CC";
            ctx.fillStyle = color;
            ctx.fillRect(this.x2, this.y, this.width, this.size);
            ctx.restore();
        }
        // modify the intersect function to this simpler version
        button.intersects = function(x, y){
            return (x > this.x && x < this.x + this.width &&
                    y > this.y && y < this.y + this.size);
        }
        // set up the onClick event to register the click to the parent
        //  (this button list)
        button.parent = this;
        button.id = id; // id is the index of this button
        button.onClick = function(){
            this.parent.innerButtonClicked(this.id);
        }
        return button;
    }
    
    // now create all inner buttons using the createInnerButton function
    this.innerButtons = new Array();
    var curX = this.x+10; // x-position of the current button
    for(var i=0; i<selectionList.length; i++){
        // create the new inner button with id as its index
        var button = this.createInnerButton(curX, i);
        // set it to selected if it is the selected index
        button.selected = (this.selected == i);
        this.innerButtons.push(button);
        // increment the x-position for the next button
        curX += (Math.round((this.size-10)/2) + 10);
    }
    
    // set the width of this button to scale based on how many inner buttons
    //  were added (curX represents the end position of the inner buttons)
    this.width = curX - this.x;
	
    // the event that is called by the inner buttons to register a click event
    //  to the parent (this button list). When an inner button is clicked,
    //  set it to the selected value, and de-select all other buttons. Then run the
    //  regular onClick event.
    this.innerButtonClicked = function(id){
        for(var i=0; i<this.innerButtons.length; i++){
            if(i != id)
                this.innerButtons[i].selected = false;
            else{
                this.innerButtons[i].selected = true;
                this.selected = i;
            }
        }
        this.onClick(id);
    }
    
	// EVENT that occurs when this button is successfully clicked
	this.onClick = function(selectionIndex){}
	
	/*** MOUSE MOVEMENT/ACTION EVENTS ***/
	// This button list will automatically check the mouse activity events
    //  of its inner child buttons.
	// mouseover: called whenever the mouse moves
	this.mousemove = function(x, y){
		// if this button list is moused over, set it to higlighted, and check
        //  the mouseover event of all inner buttons.
		if(this.intersects(x, y)){
			this.mode = GUI_BUTTON_HIGHLIGHTED;
            for(var i=0; i<this.innerButtons.length; i++)
                this.innerButtons[i].mousemove(x, y);
        }
		// otherwise, set it and all inner buttons to normal mode
		else{
			this.mode = GUI_BUTTON_NORMAL;
            for(var i=0; i<this.innerButtons.length; i++)
                this.innerButtons[i].mode = GUI_BUTTON_NORMAL;
        }
	}
	// mousedown: called when the mouse button is pushed down
	this.mousedown = function(x, y){
		// if the mouse button was pushed down over this button and this button is enabled,
        //  check all inner buttons for mouse-down events
		if(this.intersects(x, y) && this.enabled){
			for(var i=0; i<this.innerButtons.length; i++)
                this.innerButtons[i].mousedown(x, y);
        }
	}
	// mouseup: called when the mouse button is released (if it has already been pressed down
	//	before)
	this.mouseup = function(x, y){
		// check all inner buttons for the mouseup event if it occured on this button
		if(this.intersects(x, y)){
			for(var i=0; i<this.innerButtons.length; i++)
                this.innerButtons[i].mouseup(x, y);
		}
	}
    
	// update function (called each frame, and sets up allignment as needed)
    this.update = function(){
        switch(this.position){
            case 1 : this.x2 = this.x; break;
            case 2 : this.x2 = this.x - (this.size / 2); break;
            case 3 : this.x2 = this.x - this.size; break;
        }
    }
	
	// DRAW FUNCTION:
	//	draw this button to the context (all graphics and designs go here)
    this.draw = function(ctx){
		ctx.save();
		
		// coloring if the button is enabled
		if(this.enabled){
			if(this.mode == GUI_BUTTON_HIGHLIGHTED)
				ctx.strokeStyle = "#AAEE00";
			else
				ctx.strokeStyle = "#559900";
			// setup inside coloring based on button mode
			var fillColor;
			if(this.mode == GUI_BUTTON_NORMAL)
				fillColor = "#336699";
			else
				fillColor = "#3399CC";
			ctx.fillStyle = fillColor;
		}
		
		// coloring if the button is NOT enabled:
		else{
			// border
			ctx.strokeStyle = "#224422";
			// inner fill color
			ctx.fillStyle = "#333333";
		}
		
		// draw the button shape
		ctx.lineWidth = 2;
		ctx.beginPath();
			ctx.rect(this.x2, this.y, this.width, this.size);
			ctx.stroke();
			ctx.globalAlpha = 0.4;
			ctx.fill();
		ctx.closePath();
		ctx.globalAlpha = 1.0;
        
        // draw the buttons
        for(var i=0; i<this.innerButtons.length; i++){
            this.innerButtons[i].draw(ctx);
        }
		
		// draw the current selection text
		ctx.fillStyle = "#FFFF33";
		ctx.font = "" + Math.round(this.size/2) + "px Arial"
		ctx.fillText(this.selectionList[this.selected],
				this.x2 + this.width + 20,
				this.y + 2*this.size/3);
		
		ctx.restore();
    }
	
	// toggle enabled true or false with this option
	this.setEnabled = function(enabled){
		this.enabled = enabled;
	}
	
	// customized intersects function (because the button is bigger than the text)
	this.intersects = function(x, y){
		return (x > this.x2 && x < (this.x2 + this.width) &&
				y > this.y && y < (this.y + this.size));
	};
}
// make GuiHorizontalListButton a subclass of the generic GuiObject:
GuiHorizontalListButton.prototype = new GuiObject(0, 0, 0, 0);


// GUI SYSTEM: a system implemented by menus and other GUI containers to
//	keep track of all GUI elements.
function GuiSystem(){
	this.guiElements = new Array();
    this.focusedElement = 0;
	
	// add an element into the GuiSystem's element list (e.g. button or text)
    this.addElement = function(el){
        this.guiElements.push(el);
        return el;
    }
    
	// update function: check if all gui elements are alive (if not,
	//	remove them and do not continue to draw them).
	this.update = function(){
		for(var i=0; i<this.guiElements.length; i++){
			this.guiElements[i].update();
		}
	}
	
	// draw function: loop through and draw all active gui elements
	this.draw = function(ctx){
		for(var i=0; i<this.guiElements.length; i++){
			this.guiElements[i].draw(ctx);
		}
	}
    
	// mouse action functions
    this.mousedown = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
            this.guiElements[i].mousedown(x, y);
        }
    }
    this.mouseup = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
			this.guiElements[i].mouseup(x, y);
        }
    }
    this.mousemove = function(x, y){
        for(var i=this.guiElements.length-1; i>=0; i--){
			this.guiElements[i].mousemove(x, y);
        }
    }
    return this;
}