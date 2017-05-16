define([
    'framework/component/AbstractComponent',
    'x2js',
    'jquerypause',
    'framework/utils/globals',
    'framework/utils/Logger'
], function (AbstractComponent, X2JS, jQuerypause, Globals, Logger) {
	
	/**
	 * "StepAnimation" component is a created to support animations in LearnX Mobile Framework
	 * Dependicies : jQuery, jQuery.pause.mini
	 * "StepAnimation" component requires animation data (js) created using "Adobe Edge Animate"
	 * Animation data created using Edge should be custom template JS (example provided). 
	 * Reference of this custom js should be mentioned in "data" attribute of "component" node of page XML
	 */
    function StepAnimationComponent() {
        //Logger.logDebug('StepAnimationComponent.CONSTRUCTOR() | '+p_sID);
        AbstractComponent.call(this);

        // define the class properties
        // Merging User Config Object with Concrete classes Config Object
        this.oAnimData;
		this.sImagePath;
		this.aResources;
		this.container;
		this.aKeys = [];
		this.oKeys = {};
		this.aPreloadList = [];
		this.currentKey = -1;
		this._isPlaying;
		this.init 					= this.init.bind(this);
		this.createElements 		= this.createElements.bind(this);
		this.addStyles 				= this.addStyles.bind(this);
		this.getStates 				= this.getStates.bind(this);
		this.createDiv 				= this.createDiv.bind(this);
		this.createTimeLine 		= this.createTimeLine.bind(this);
		this.AnimationLoop 			= this.AnimationLoop.bind(this);
		this.StartKeyAnimation 		= this.StartKeyAnimation.bind(this);
		this.onPreloadComplete 		= this.onPreloadComplete.bind(this);
		this.jumpToKeyFrame 		= this.jumpToKeyFrame.bind(this);
		this.isPlaying 				= this.isPlaying.bind(this);

        return this;
    }

    StepAnimationComponent.prototype								= Object.create(AbstractComponent.prototype);
    StepAnimationComponent.prototype.constructor					= StepAnimationComponent;

    StepAnimationComponent.prototype.getComponentConfig			= function () {
        return {
         
        };
    };

    StepAnimationComponent.prototype.init							= function (p_sID, p_oConfig, p_$xmlComponent) {
      //  Logger.logDebug('StepAnimationComponent.init() | ');
        
//		this.oAnimData 	= p_oAnimData,
		
		AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };

    StepAnimationComponent.prototype.initialize					= function () {
    	var oScope = this,
    	sAnimDataPath = this.$xmlData.attr('data');
    	
    	require([sAnimDataPath], function(oAnimData){
    		var oAnimation 		= new oAnimData();
	      	oScope.oAnimData 	= oAnimation.getData();
	      	oScope.sImagePath  	= oScope.oAnimData.imagePath;
	      	
			var element 		= oScope.createElements(oScope.oAnimData.symbols.stage, 'anim');
			oScope.$component.append(element);
		
			Globals.checkImagesLoaded(oScope, oScope.onPreloadComplete);
			//oResourceLoader.loadResource(oScope.aPreloadList, oScope, oScope.onPreloadComplet);
    		
    	});
    };

	 StepAnimationComponent.prototype.onPreloadComplete = function(){
			this.dispatchComponentLoadedEvent();
	 		if(this.$xmlData.attr('autoPlay') === "true"){
		 		this.AnimationLoop(0);
	 		}
	 };
	 
 StepAnimationComponent.prototype.createElements = function(p_oSymbol, p_sID){
		var oSymbol 			= p_oSymbol;
		var oContent 			= oSymbol.content;
		var aDom 				= oContent.dom;
		var oStates 			= oSymbol.states;
		var symbolInstance 		= oContent.symbolInstances;
		var container 			= this.createDiv(p_sID);
		for(var i =0;i< aDom.length; i++){
			var oElementData  	= aDom[i]; 
			var element 		= this.createDiv(oElementData.id);
			element.addClass(oElementData.userClass);
			if(oElementData.fill != undefined){
				if(oElementData.fill.length > 1){
					var img = $('<img style="width:100%;height:100%" />'),
					imgPath = this.sImagePath+oElementData.fill[1];
					this.aPreloadList.push(imgPath);
					img.attr('src',imgPath);
					element.append(img);
				}else{
					element.css('background', oElementData.fill[0] );
				}
			}
			if(oElementData.text != undefined){
				element.append(oElementData.text);
			}
			var defaultStyle = this.getStates(oStates, oElementData.id);
			this.addStyles(element, defaultStyle);
			container.append(element);
		}
		if(symbolInstance != undefined){
			for(var i =0;i< symbolInstance.length; i++){
				var symbolPointer = symbolInstance[i];
				var oSymbolData = this.oAnimData.symbols[symbolPointer.id];
				if(oSymbolData != undefined){
					var symbolElement = this.createElements(oSymbolData, symbolPointer.id);
					container.append(symbolElement);
				}
			}
		}
		var oTimelines 			= oSymbol.timelines["Default Timeline"].timeline;
		if(oTimelines != undefined){
			this.createTimeLine(oTimelines);
		}
		return container;
	};
	


   StepAnimationComponent.prototype.AnimationLoop  	= function(time){
	//requestAnimationFrame(this.AnimationLoop);
	if(!isNaN(time)){
		var param = "key_"+time; 
		var index = this.oKeys[param];
		var keyData = this.aKeys[index];
		if(keyData){
			this.StartKeyAnimation(keyData, time);
			//this.oKeys[param] = null;
		};
	}	
};

	StepAnimationComponent.prototype.StartKeyAnimation  	= function(aKey, time ){
		if(time == this.currentKey)return;
		this.currentKey = time;
		this.logInfo();
		var oScope = this;
		for(var i = 0; i< aKey.length;i++){
			var oPointer = aKey[i],
			$elem 			= $("#"+oPointer.id);
			$elem.css(oPointer.defaultState);
			this.dispatchEvent('ANIMATION_STARTED', {type: 'ANIMATION_STARTED', target:this, key: this.currentKey});
			$elem.animate(oPointer.endState, oPointer.duration, function(){
				if(oScope.isPlaying){
					var nLastKey = oScope.getEndKey(); 
					if( oScope.currentKey == nLastKey ){
						oScope._isPlaying = false;	
						oScope.dispatchEvent('ANIMATION_COMPLETE', {type: 'ANIMATION_COMPLETE', target:oScope, key: oScope.currentKey});
					}else{
						oScope.AnimationLoop(oPointer.position + oPointer.duration);
					}
				}
			});
			if(!this._isPlaying){
				this._isPlaying = true;
			}	
		}
	};

	StepAnimationComponent.prototype.PauseKeyAnimation  	= function(aKey){
	var oScope = this;
		for(var i = 0; i< aKey.length;i++){
			var oPointer = aKey[i],
			$elem 			= $("#"+oPointer.id);
			$elem.pause();
			if(this._isPlaying){
				this._isPlaying = false;
				this.dispatchEvent('ANIMATION_PAUSED', {type: 'ANIMATION_PAUSED', target:this, key: this.currentKey});
			}
		}
	};
	
	
	
	StepAnimationComponent.prototype.ResumeKeyAnimation  	= function(aKey){
	var oScope = this;
	this._isPlaying = true;
		for(var i = 0; i< aKey.length;i++){
			var oPointer = aKey[i],
			$elem 			= $("#"+oPointer.id);
			$elem.resume();		
		}
	};


	/**
	 * 	[
	 * 		[
	 * 			{
	 * 				elem : $element,
	 * 				defaultState: {},
	 * 				endState: {},
	 * 				duration: Number
	 * 			}
	 * 		]
	 * 	] 
	 * @param {Object} oTimelines
	 */
	StepAnimationComponent.prototype.createTimeLine  	= function(oTimelines){
		if(oTimelines != undefined){
			for(var i = 0;i < oTimelines.length; i++){
				
				var item 	= oTimelines[i],
				tween 		= item.tween,
				sID 		= tween[1],	 
				obj 	= {};
				elemList = 	[]; 
				
				if(item.duration == 0)continue;
				if(tween[0] == "style" || tween[0] == "color")
				{
					sID 			= sID.slice(sID.indexOf('_') + 1, sID.lastIndexOf('}'));
					
					if(this.oKeys['key_'+ item.position] == undefined){
						this.oKeys['key_'+ item.position] = this.aKeys.length;
						this.aKeys.push(elemList);
					//console.log('Keys position = '+this.aKeys['key_'+ item.position]);
					}
					var aKey = this.aKeys[this.oKeys['key_'+ item.position]];
					var oElem = null;
					for(var s = 0; s < aKey.length; s++){
						var elemID = aKey[s].id; 
						if( elemID == sID){
							oElem = aKey[s];
							break;
						}
					}
		
				
					if(!oElem){
						oElem = {};
						oElem.type 		= tween[0];
						oElem.id 		= sID;
						oElem.elem 		= null;
						oElem.duration 	= item.duration;
						oElem.position 	=  item.position;
						oElem["defaultState"] = {};
						oElem["endState"] = {};
						this.aKeys[this.oKeys['key_'+ item.position]].push(oElem);
					}
					
					var prop = tween[2];
					oElem.endState[prop] 			= tween[3]; 
					oElem.defaultState[prop] 		= tween[4].fromValue; 					
				}				
				
			}
			
			//console.log('Keys = '+JSON.stringify(this.aKeys));
			
		};
	};

	StepAnimationComponent.prototype.addStyles  		= function(p_oElement, p_oStyle){
		var oStyle = {position:'absolute'};
		for(var style in p_oStyle){
			var aStyle = p_oStyle[style];
			if(aStyle[0] === 'style' || aStyle[0] === 'color' ){
				oStyle[aStyle[1]] = aStyle[2]; 
			}			
		}
		
		p_oElement.css(oStyle);
	};
	
	StepAnimationComponent.prototype.getStates 	= function(p_oStates, p_sId){
		var oStates = p_oStates['Base State'];
		for(var elem in oStates){
			var sID = '${_'+p_sId+'}';
			if(elem == sID){
				return oStates[elem];
				break;
			}
		}
		return {};
	};
	
	StepAnimationComponent.prototype.createDiv 	= function(id){
		var div = $('<div id="'+id+'"></div>');
		return div;
	};
	
	StepAnimationComponent.prototype.addAriaRoles					= function() {
	};
	
	StepAnimationComponent.prototype.bindHandlers					= function() {
	};
	
	
    StepAnimationComponent.prototype.getEndKey					= function () {
    	var nEndKey = 0;
    	for(var key in this.oKeys){
    		var nKey = Number(key.slice(key.indexOf('_') + 1 ));
    		if(nKey > nEndKey){
    			nEndKey = nKey;
    		}
    	}
    	return nEndKey;
    };
    StepAnimationComponent.prototype.jumpToKeyFrame					= function (p_nKeyFrame) {
    	var oKey = this.oKeys['key_'+p_nKeyFrame];
    	if(oKey != undefined){
    		this.AnimationLoop(p_nKeyFrame);
    		return;
    	}
    	Logger.logError('Error: keyframe not found in animation! | StepAnimation : jumpToKeyFrame() ');
    };
    
    StepAnimationComponent.prototype.getCurrentKeyPosition					= function (p_nKeyFrame) {
    	return this.currentKey;
    };
    
    StepAnimationComponent.prototype.pause					= function () {
    	if(this._isPlaying){
	    	this.PauseKeyAnimation( this.aKeys[this.oKeys['key_'+this.currentKey]]);
    	}
    };
    
    StepAnimationComponent.prototype.resume					= function () {
    	if(!this._isPlaying){
    		this.ResumeKeyAnimation( this.aKeys[this.oKeys['key_'+this.currentKey]]);
    	}
    };
    
    StepAnimationComponent.prototype.play					= function () {
    	this.reset();
    	this.AnimationLoop(0);
    };
    StepAnimationComponent.prototype.reset					= function () {
    	this._isPlaying = false;
		this.$component.empty(element);
		var element 		= this.createElements(this.oAnimData.symbols.stage, 'anim');
		this.$component.append(element);
    };
    StepAnimationComponent.prototype.isPlaying					= function () {
    	return this._isPlaying;
    };
    
    
    StepAnimationComponent.prototype.logInfo						= function () {
    	//if($('#keyNum').length > 0){
		//	$('#keyNum').html("Current key frame : "+this.currentKey);
		//}
    };
    StepAnimationComponent.prototype.destroy						= function () {
    	// Stop any on-going animations
		this.oAnimData 		= null; 
		this.sImagePath 	= null;
		this.aResources 	= null;
		this.container 		= null;
		this.aKeys 			= null;
		this.oKeys 			= null;
		this.aPreloadList 	= null;
		this.currentKey 	= null;
        this.prototype		= null;

        AbstractComponent.prototype.destroy.call(this);
    };
    StepAnimationComponent.prototype.toString						= function () {
        return 'framework/component/StepAnimationComponent';
    };

    return StepAnimationComponent;
});
