define([
	'jquery',
	'createJs',
	'framework/model/CourseConfigModel',
	'framework/model/CourseModel',
	'framework/component/AbstractComponent',
	'framework/utils/Logger'
	], function($,createJs, CourseConfig, CourseModel, AbstractComponent,  Logger) {

	var Animate = function() {
		AbstractComponent.call(this);
		this.canvas, this.stage, this.exportRoot; this.images;
		this.timeline;this.oAnimData;
		this.ajaxtrycount = 0;
		this.ajaxmaxcount = 5;
		this.handleComplete = this.handleComplete.bind(this);
		this.handleFileLoad = this.handleFileLoad.bind(this);
		this.handleEvents 	= this.handleEvents.bind(this);
		return this;
	};
	
	Animate.prototype						= Object.create(AbstractComponent.prototype);
    Animate.prototype.constructor			= Animate;
	
	Animate.prototype.init 					= function(p_sID, p_oConfig, p_$xmlComponent) {
		var oScope = this;
		this.images = {};
		//console.log('Animate init() '+ p_sID);
		AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
	};
	
	Animate.prototype.getPath				= function(p_file, p_type) {
		var oPage 		= CourseModel.getCurrentPage(),
		pagelocation	= oPage.getGUID().split('~').join('/'),
		path 			= CourseConfig.getRootPath() + CourseConfig.getConfig(p_type).folderURL + pagelocation;
		return path+'/'+p_file;
	};
	
	Animate.prototype.createComponent		= function() {
		// Call to the super calss
		var oScope 			= this,
		scriptname			= this.getConfig().animdata;
			
		this.oAnimData 	= this.getPath(scriptname+'.js', 'js_location');
		//console.log('this.oAnimData - '+ this.oAnimData);
		$.getScript( this.oAnimData )
		  .done(function( script, textStatus ) {
		    //console.log( textStatus );

			createjs.MotionGuidePlugin.install();
			oScope.timeline = animate();//jQuery.extend({}, lib);
			oScope.canvas 	= oScope.$component.find("#canvas")[0];
			//console.log('oScope.canvas - '+ oScope.canvas);
			oScope.exportRoot = new oScope.timeline[scriptname]();
			
			oScope.updateAssetPath();
	
			var loader = new createjs.LoadQueue(false);
			loader.installPlugin(createjs.Sound); 
			loader.addEventListener("fileload", oScope.handleFileLoad);
			loader.addEventListener("complete", oScope.handleComplete);
			
			if(oScope.timeline.properties.manifest.length){
				loader.loadManifest(oScope.timeline.properties.manifest);
			}else{
				oScope.handleComplete();
			}
		  })
		  .fail(function( jqxhr, settings, exception ) {
		    console.log( "Triggered ajaxError handler. trying after again..."  );
		    setTimeout(function(){
		    	if(oScope.ajaxtrycount < oScope.ajaxmaxcount){
				    oScope.createComponent();
			    	oScope.ajaxtrycount++;		    	
		    	}else{
		    		oScope.ajaxtrycount = 0;
		    	}
		    	//console.log('ajaxtrycount - '+ oScope.ajaxtrycount);
		    }, 100);
		});
		//});
	};
	
	Animate.prototype.updateAssetPath 		= function(evt) {
		for (var i=0; i < this.timeline.properties.manifest.length; i++) {
		  var item = this.timeline.properties.manifest[i];
		  if(item.src && item.src.indexOf('images/') != -1 || item.src.indexOf('sounds/') != -1){
		  	var folder			=  this.getPath('', 'js_location');
		  	this.timeline.properties.manifest[i].src = folder+''+item.src;
		  }
		};
	};
	
	Animate.prototype.handleFileLoad 		= function(evt) {
		if (evt.item.type == "image") { this.images[evt.item.id] = evt.result; }
	};
	
	Animate.prototype.handleComplete 		= function(evt) {
		if(evt){
			evt.target.removeEventListener("fileload", this.handleFileLoad);
			evt.target.removeEventListener("complete", this.handleComplete);
		}
		
		this.canvas = this.$component.find('canvas')[0];//document.getElementById("canvas");
		this.timeline.images(this.images);
		this.exportRoot = new this.timeline[this.getConfig().animdata]();
		this.addTimelineListeners();
		
		this.exportRoot.stop();
		
		this.stage = new createjs.Stage(this.canvas);
		this.stage.addChild(this.exportRoot);
		this.stage.enableMouseOver();
		this.stage.update();
	
		createjs.Ticker.setFPS(this.timeline.properties.fps);
		createjs.Ticker.addEventListener("tick", this.stage);
		
		if(evt){
			evt.target.removeEventListener("complete", this.handleComplete);
		}
		AbstractComponent.prototype.createComponent.call(this);
	};
	
	Animate.prototype.addTimelineListeners	= function() {
		this.exportRoot.addEventListener('anim_stop', this.handleEvents);
		this.exportRoot.addEventListener('anim_start', this.handleEvents);
		this.exportRoot.addEventListener('btn_click', this.handleEvents);
	};
	
	Animate.prototype.removeTimelineListeners	= function() {
		this.exportRoot.removeEventListener('anim_stop', this.handleEvents);
		this.exportRoot.removeEventListener('anim_start', this.handleEvents);
		this.exportRoot.removeEventListener('btn_click', this.handleEvents);
	};

	Animate.prototype.initialize			= function() {
			
		if(this.getConfig().play){
			 this.exportRoot.play();			
		}
		 AbstractComponent.prototype.dispatchComponentLoadedEvent.call(this);
	};
	
	Animate.prototype.play 					= function(evt) {
		this.exportRoot.play();
	};

	Animate.prototype.gotoAndPlay 			= function(p_nframe) {
		this.exportRoot.gotoAndPlay(p_nframe);
	};
	Animate.prototype.gotoAndStop 			= function(p_nframe) {
		this.exportRoot.gotoAndStop(p_nframe);
	};

	Animate.prototype.stop 					= function(evt) {
		this.exportRoot.stop();
	};

	Animate.prototype.reset 					= function(evt) {
		this.gotoAndStop(1);
		if(this.getConfig().play){
			this.exportRoot.play();			
		}
	};

	Animate.prototype.addAriaRoles			= function() {
	};

	Animate.prototype.bindHandlers			= function() {
	};
	
	Animate.prototype.handleEvents			= function(evt) {
		var type 	= evt.type, 
		target 		= evt.target,
		timeline	= target.timeline,
		oLabels		= timeline._labels,
		nPosition	= timeline.position,
		curlabel,clicktargetname;
		for(var label in oLabels){
			//console.log('label - '+ label);
			if(oLabels[label] == nPosition){
				curlabel = label; 		
				break;
			}
		}
		
		switch(evt.type){
			case 'anim_stop' :
				if(curlabel && curlabel.toLowerCase() === "end"){
					type = 'anim_end';
				}
				
			break;
			case 'anim_start' :
			
			break;
			case 'btn_click' :
				clicktargetname = evt.targetName;
			break;
		}
		
		//console.log('events type - '+evt.type+' | '+ nPosition+' | label - '+ curlabel+' | clicktargetname - '+ clicktargetname+' | customEvent - '+ evt.customEvent);
		this.dispatchEvent(type,{type:type, target:this, clicktarget:clicktargetname, label:curlabel, position:nPosition, pageEvent:evt.customEvent});
	};

	Animate.prototype.destroy 				= function(){
		this.stop();
		this.removeTimelineListeners();
		this.canvas			= null;
		this.stage 			= null;
		this.exportRoot 	= null;
		this.images 		= null;;
		this.timeline 		= null;
		this.oAnimData 		= null;;
		this.ajaxtrycount 	= null;
		this.ajaxmaxcount 	= null;
		window.animate 		= null;
       AbstractComponent.prototype.destroy.call(this);
	};
	return Animate;

});
