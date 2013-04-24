/* File comments updated: Wednesday, June 13, 2012 at 9:07 PM
 *
 *  DATA CLASSES: these classes provide ways of loading images,
 *		sound and other data/files provided by the server
 *		through HTML5 and Javascript technology.
 */


/*
 * IMAGES SYSTEM: Used by the level to load and store images used
 *	throughout the level. The images loaded here should be specific
 *	to this level alone (general images are loaded at the beginning
 *	of the game).
 */
function Images(parent){
	// reference to the parent object (to use when the onload function triggers)
	this.parent = parent;
	// list of all images
	this.list = Object();
	// amount of images currently in the list
	this.amount = 0;
	// amount of images that were already loaded
	this.loaded = 0;
	
	// event that is called when all images completely successfully loaded
	//	after the loadImages function is called.
	// Override this event to 
	this.onload = function(){}

	// add an image to the list. This function can be used in one of two ways:
	//	1) pass in a name (string) and a source URL on an image to add it
	//	2) pass in a single array of string pairs ([name, url])
	// images will be formed after the loadImages function is called.
	//	Each image will be associated with the name provided
	this.add = function(name, src){
		// if the first parameter is an array, add the entire array
		//	of name/src pairs to the list
		if(name instanceof Array){
			for(var i=0; i < name.length; i++){
				this.list[name[i][0]] = name[i][1];
				this.amount++;
			}
		// otherwise, add just the one name/src pair to the list
		}else{
			this.list[name] = src;
			this.amount++;
		}
		// return a reference to this object when add is finished
		return this;
	}

	// load all images: call this function only after all images in the
	//	list are added; this function downloads all images from
	//	their source, and when ALL images are fully loaded, calls the
	//	onload event function.
	this.loadImages = function(){
		// if there are no unloaded images, the function is done
		if(this.amount == this.loaded){
			this.onload();
		}
		// otherwise, load all images if necessary
		else{
			// for each image (source URL) in the list,
			for(var name in this.list){
				// get the source URL and modify the item to an image object
				var src = this.list[name];
				/*
				// if the image was already created, skip it
				if(src instanceof Image)
					continue;
				*/
				this.list[name] = new Image();
				// provide a reference to this Images object
				this.list[name].list = this;
				// when the Image finishes downloading, it will call this event function
				//	which will trigger the onloaded function IF all other images are
				//	already loaded:
				this.list[name].onload = function(){
					this.list.loaded++;
					if(this.list.loaded == this.list.amount){
						this.list.onload();
					}
					delete this.list;
				}
				this.list[name].src = src;
			}
		}
	}
	
	// returns the image object associated with the given name
	//	(e.g. Images.get("ship") will return the image added by
	//		Images.add("ship", "img/ship.png") )
	this.get = function(name){
		return this.list[name];
	}
}


/*
 * SOUNDS SYSTEM: Used by the level to load and store sounds used
 *	throughout the level. The sounds loaded here should be specific
 *	to this level alone (general audio is loaded at the beginning
 *	of the game). [similar to Image system]
 */
function Sounds(parent){
	// reference to the parent object (to use when the onload function triggers)
	this.parent = parent;
	// list of all sounds
	this.list = Object();
	// amount of sounds currently in the list
	this.amount = 0;
	// amount of sounds that were already loaded
	this.loaded = 0;
	
	// event that is called when all sounds completely successfully loaded
	//	after the loadSounds function is called.
	// Override this event to 
	this.onload = function(){}

	// add an sound to the list. This function can be used in one of two ways:
	//	1) pass in a name (string) and a source URL on an sound to add it
	//	2) pass in a single array of string pairs ([name, url])
	// sounds will be formed after the loadSounds function is called.
	//	Each sound will be associated with the name provided
	this.add = function(name, src){
		// if the first parameter is an array, add the entire array
		//	of name/src pairs to the list
		if(name instanceof Array){
			for(var i=0; i < name.length; i++){
				this.list[name[i][0]] = name[i][1];
				this.amount++;
			}
		// otherwise, add just the one name/src pair to the list
		}else{
			this.list[name] = src;
			this.amount++;
		}
		// return a reference to this object when add is finished
		return this;
	}

	// load all sounds: call this function only after all sounds in the
	//	list are added; this function downloads all sounds from
	//	their source, and when ALL sounds are fully loaded, calls the
	//	onload event function.
	this.loadSounds = function(){
		// if there are no unloaded sounds, the function is done
		if(this.amount == this.loaded){
			this.onload();
		}
		// otherwise, load all sounds if necessary
		else{
			// for each sound (source URL) in the list,
			for(var name in this.list){
				// get the source URL and modify the item to an sound object
				var src = this.list[name];
				/*
				// if the sound was already created, skip it
				if(src instanceof Audio)
					continue;
				*/
				// create the audio object
				this.list[name] = new Audio();
				
				// provide a reference to this Sounds object
				this.list[name].list = this;
				this.list[name].doneLoading = false;
				// when the Audio finishes downloading, it will call this event function
				//	which will trigger the onloaded function IF all other sounds are
				//	already loaded:
				//this.list[name].oncanplaythrough = function(){
				this.list[name].addEventListener('canplaythrough', function(){
					if(!this.doneLoading){
						this.doneLoading = true;
						this.list.loaded++;
						if(this.list.loaded == this.list.amount){
							this.list.onload();
						}
						delete this.list;
					}
				}, false);
				
				/*** Everything here was added because IE doesn't support .wav files. ***/
				// check browser compatibility and apply the extention based on which
				//	version the browser supports (mp3 or wav)
				if(this.list[name].canPlayType('audio/mp3')){
					// if can play mp3 files, load the .mp3 version
					this.list[name].src = src + ".mp3";
				}
				else if(this.list[name].canPlayType('audio/wav')){
					// otherwise, if can play the wav files, load the .wav version
					this.list[name].src = src + ".wav";
				}
				// if no audio file is supported, just fake the loading (the audio will be null,
				//	and thus will just not be played the the engine.
				else{
					// nullify the event (this will cause the file to be ignored by the level)
					this.list[name] = null;
					// continue to act as if this file was already loaded
					this.loaded++;
					if(this.loaded == this.amount){
						this.onload();
					}
				}
			}
		}
	}
	
	// returns the audio object associated with the given name
	//	(e.g. Sounds.get("song") will return the sound added by
	//		Sounds.add("song", "audio/song.wav") )
	this.get = function(name){
		return this.list[name];
	}
}