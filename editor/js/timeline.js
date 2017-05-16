var timeline 	= 	function(p_$view){
	var 	time 			= 10,
			fps				= 20, 
			currentframe 	= 1, playInterval, aSprites, oCSS={}, currentSprite, $playhead,$frame, $view,oEffect,$stage;

		/**
		 * 
		 * timeline. flash like time and play/pause controls
		 * @constructor 
		 * @alias module:timeline
		 */
	var obj  = function(p_$view){
		EventDispatcher.call(this);
		/** The class "stop" property. */ 
		this.stop 	= this.stop.bind(this);
		/** The class "play" property. */ 
		this.play 	= this.play.bind(this);
		this.init	= this.init.bind(this);
		$view = p_$view;
	};
	
	obj.prototype										= Object.create(EventDispatcher.prototype);
	obj.prototype.constructor							= obj;
	
	/** 
	 * timeline initialization
	 * @param {Object} timeline timeline controller object
	 * @param {Object} p_sprite sprite controller object
	 * @param {JSON} oJson timeline configuration
	 */
	obj.prototype.init = function(timeline,  oJson){
		var oScope 		= this;
		time 			=	oJson.timesec || 30;
		fps				= 	oJson.fps || 25;
		currentframe	=	oJson.currentframe || 1;
		createtimeline.call(this);	
		$stage 			= $('.stage');
		effect = oEffect;
		
		this.aSprites 		= [];
		this.setCurrentFrame(currentframe);
		
		var oScope = this;
		
		this.stage 	= new stage($stage);
		this.stage.addEventListener('style_change', function(event){
			oScope.grid.refresh(event.stage);
			for (var i=0; i < oScope.aSprites.length; i++) {
			  oScope.aSprites[i].refresh({x:oScope.grid.offset, y:'Infinity', range:(oScope.grid.offset / 2) });
			};
		});
		// Stage right click listener
		this.stage.addEventListener('stage_insert', function(event){
			if(event.key.toLowerCase() === "insert"){
				addSprite.call(oScope,  event.target.view, {left:event.options.$menu.offset().left, top:event.options.$menu.offset().top});
			}
			
		});
		
		$('.timeline-cntrl a' ).click(function(e){
			oScope.handleEvent.call(oScope, e);
		});
		
		$('.effects a').click(function(e){
			var sEffect = $(e.currectTarget).attr('id'); 
			oScope.addEffect.call(this, sEffect);
		});
		//moveBar.addEventListener('drag_progress', dragProgress.bind(this));
		
		this.grid = responsiveGrid($('#grid')[0], {
			col: 96,
			stage:$('#stage')
		});
		this.grid.draw();
		this.csspanel 	= csspanel($('.css-panel'));
		this.csspanel.createModel(oJson, $('#cssprop ')[0]);
		//checkSprite.call(this, {x:this.grid.offset, y:'Infinity', range:(this.grid.offset / 2) });
		this.setKeyFrame(1);
		
		this.cl = new courselistener();
		this.cl.addEventListener('PAGE_LOADED', setup.bind(this));
		this.cl.init();
	};
	
	
	function setup(evt){
		var oScope 	= this;
		var pageText = evt.target.getPageText(function(data){
			if(data){
				data = (data.length)? data : [data];
				for(var i= 0; i < data.length; i++){
					var pId		= data[i]._id,
					elem		= $('#'+pId);
					convertToSprite.call(oScope, elem);
				}
			}
			oScope.cl.getCurrentPage(function(oPage){
				var guid	= oPage.getGUID(),
					sId		= guid.split('~').join('_'),
					$page	= $("#"+sId);
				oScope.stage.setPageContainer($page.find('> div'));
			}.bind(oScope));
		}.bind(this));
	};
	
	function checkSprite(grid){
		var oScope 		= this;
		var $sprite 	= $('.sprite');
		var arr			= aSprites;
		$sprite.each(function(index, elem){
			var $elem 		= $(elem);
			var sp 			= new sprite($elem, $stage, grid);
			sp.addEventListener('sprite_right_click', onSpriteClick.bind(oScope));
			sp.addEventListener('sprite_left_click', onSpriteClick.bind(oScope));
			//sprite.addEventListener('ondrag', onDrag.bind(oScope));
			sp.init.call(sp);
			oScope.aSprites.push(sp);
		});
	};
	
	function convertToSprite($elem ){
		var $handle 	= $('<div class="handle bottom"></div>');
		$elem.append($handle);

		$elem.addClass('sprite');
		
		var offset 		= $elem.offset().left % this.grid.offset;
		$elem.css({'left': ($elem.offset().left - offset) +'px', 'top':$elem.offset().top + 'px'});
		
		var sp 			= new sprite($elem, this.$stage, {x:this.grid.offset, y:'Infinity' });
		$elem.attr({"data-x": $elem.offset().left, "data-y": $elem.offset().top});
		
		sp.addEventListener('sprite_right_click', onSpriteClick.bind(this));
		sp.addEventListener('sprite_left_click', onSpriteClick.bind(this));
		
		sp.init.call(sp);
		this.aSprites.push(sp);
	};
	
	function addSprite(target, options){
		var $elem 	= $('<div class="sprite" id="sprite'+(this.aSprites.length+1)+'"><div class="handle bottom"></div></div>');
		var offset = options.left % this.grid.offset;
		options.left = options.left - offset; 
		var sp 	= new sprite($elem, this.$stage, {x:this.grid.offset, y:'Infinity' });
		$elem.css({"left":options.left+"px", "top":options.top+"px"}).attr({"data-x": options.left, "data-y": options.top});
		target.append($elem);
		sp.addEventListener('sprite_right_click', onSpriteClick.bind(this));
		sp.addEventListener('sprite_left_click', onSpriteClick.bind(this));
		sp.init.call(sp);
		this.aSprites.push(sp);
		
	}
	
	/**
	 * Set current frame to Selected. Update CSS properties if current frame is key frame
 	* @param {Number} p_nframe Frame number
	 */
	obj.prototype.setCurrentFrame 		= function(p_nframe){
		//current frame is valid 
		if(p_nframe <= (time * fps)){
			currentframe = p_nframe;	
		}
		// set selected state
		$('.frame.item.selected').removeClass('selected');
		var  curFrame = $("#f_"+currentframe+".frame.item");			
		curFrame.addClass('selected');
		$('#frame_cnt').text(currentframe);
		//update CSS props of sprite if current frame is key frame
		if(oEffect){
			var lastFrame 	= this.getLastKeyFrame(currentframe),
			key				= oEffect.key[oEffect[currentframe]];
			if(key){
				sprite.updateCSS( key.css);
				sprite.invalidateControls.call(sprite);					
			}
		}
	};
	
	/**
	 * get previous key frame from current frame
 	* @param {Number} p_nframe current Frame number
	 */
	obj.prototype.getLastKeyFrame 		= function(p_nframe){
		var i = 1;
		$('.frame.item.key').each(function(index, elem){
			if(i > Number(p_nframe)){
				return false;
			}
			i 	= $(elem).attr('id').split('_')[1];
		});
		return i;
	};
	
	/**
	 * Chnage current frame to Key Frame 
 * @param {Number} p_nframe Frame Number
	 */
	obj.prototype.setKeyFrame 		= function(p_nframe){
		var  curFrame;
		if(p_nframe ){
			if(p_nframe > (time * fps))return;
			
			curFrame = parseInt(p_nframe);
		}else{
			curFrame = this.getCurrentFrame();			
		}
		this.stop();
		$curFrame = $("#f_"+curFrame+".frame.item");			
		if(!$curFrame.hasClass('key')){
			$curFrame.addClass('key');					
		}else{
			$curFrame.removeClass('key');
			sprite.invalidate();								
		}
	};
	
	
	obj.prototype.getCurrentFrame 		= function(p_num){
		return currentframe;
	};
	
	/**
	 * Play animation 
	 */
	obj.prototype.play 		= function(){
		if(playInterval){
			this.stop();
		}
		var oScope 	= this,
		nTime		= time;
		nFPS		= fps;
		
		playInterval 	= setInterval(function(){
			curfrm		= oScope.getCurrentFrame();
			if(curfrm >= (nTime * nFPS)){
				oScope.stop();
				clearInterval(playInterval);
			}
			oScope.setCurrentFrame(curfrm + 1);
		}.bind(oScope), Math.ceil(1000/fps));
		
		//sprite.showControls(false);
		createAnimation.call(this);
	};
	
	/**
	 * Stop animation 
	 */
	obj.prototype.stop 		= function(){
		if(playInterval){
			clearInterval(playInterval);
			playInterval = null;
		};
		if(this.currentSprite){
			this.currentSprite.showControls(true);
			this.currentSprite.invalidateControls(true);
		}
		clearAnimation.call(this);
	};
	
	/**
	 * Event handler 
 	* @param {Object} e Event
	 */
	obj.prototype.handleEvent = function(e){
		var oScope = this,
		id 	= $(e.currentTarget).attr('id');
		//console.log('handleEvent() - '+ id);
		switch(id.toLowerCase()){
			case "btn_pause" :
				oScope.stop();
				break;
			case "btn_play" :
				oScope.play();
				break;
			case "btn_key" :
				oScope.setKeyFrame(oScope.getCurrentFrame());
				break;
			case "btn_prev" :
				oScope.setCurrentFrame(1);
				break;
			case "btn_next" :
				oScope.setCurrentFrame(time * fps);
				break;
		};
	};
	
	/**
	 * Event listenter for Drag event 
 	* @param {Object} obj Drag event data
	 */
	function onDrag(obj){
		var curFrame 	= this.getCurrentFrame(),
		$curFrame		= $("#f_"+currentframe+".frame.item"),
		bKey			= $curFrame.hasClass('key');
		
		if(bKey){
			updateCSS.call(this,obj);
		}
		// moveBar.setTarget(obj.$view)
	};
	
	/**
	 *  Update CSS props in 'oEffect' object
 	* @param {Object} obj CSS data
	 */
	function updateCSS(obj){
		var curFrame 	= this.getCurrentFrame(),
		$curFrame		= $("#f_"+currentframe+".frame.item");
		if(!oEffect){
			oEffect = {key:[]};
		}
		if(isNaN(oEffect[curFrame])){
			oEffect[curFrame] 	= oEffect.key.length;
			oEffect.key.push({});
		}
		oEffect.key[oEffect[curFrame]] = {
				frame		: curFrame,
				css			: obj.css
			};	
			
		// console.log(JSON.stringify(oEffect));				
		 	
	};
	
	/**
	 * Create CSS styles of sprite transformation and Animation.
	 * Append it in the markup 
	 */
	function createAnimation(){
		var key = oEffect.key.slice(0);
		if(key.length){
			key.sort(function(a, b){
				return a.frame - b.frame;
			});
		};
		var totalF		= key[key.length - 1].frame;
		
		if(totalF){
			var s = '.sprite{animation-name: anim;animation-duration: '+Math.ceil(totalF /fps) +'s;}';
			var style = '@keyframes anim {';
			for (var i=0; i < key.length; i++) {
			  var frame = key[i].frame,
			  css		= key[i].css,
			  per		= Math.round((frame/totalF)* 100);
			  style		= style+' '+per+'% {';
			  	for (var prop in css) {
					style = style+ prop+':'+ css[prop]+';';
				  };
			  style		= style + '}';
			};
			 style		= style + '}';
			
			$('.anim-style').empty().append('<style>'+s+' '+style+'</style>');	
		}
	};
	
	/**
	 * Clear CSS style information from markup 
	 */
	function clearAnimation(){
		$('.anim-style').empty();
	};
	
	/**
	 * Create timeline view 
	 */
	function createtimeline(){
		if(time){
			var oScope = this,
			$frametemplate 	= $('<span class="frame hide"><a href="#" class="btn-frame">f</a></span>');
			
			$view.empty();
			$playhead 	= $('<div class"play-head"></div>');
			var frames = time * fps;
			
			for (var i=1; i <= frames; i++) {
				var $f 	= $frametemplate.clone().removeClass('hide').addClass('item');
				$f.attr({
					"id":'f_'+i,
					"title": ''+i
				})
				$f.click(function(e){
					oScope.stop();
					oScope.setCurrentFrame.call(oScope, parseInt($(this).attr('id').split('_')[1]));
					
				});
			  $view.append($f);
			};
			
		}
	};
	
	function getCurrentSpriteByView(elem){
		for(var i = 0; i <this.aSprites.length;i++){
			if(this.aSprites[i].$view[0] === elem){
				return this.aSprites[i];
			}
		};
	};
	function onSpriteClick(e){
		var type = e.type;
		switch(type.toLowerCase()){
			case "sprite_left_click" :
				onSpriteLeftClick.call(this, e);
			break;
			case "sprite_right_click" :
				onSpriteRightClick.call(this, e);
			break;
		}
		var sprite = getCurrentSpriteByView.call(this, e.target);
		
		if(this.currentSprite != sprite){
			if(this.currentSprite){
				setCSSModel.call(this, this.currentSprite.$view.attr("id"), this.csspanel.getModel());				
			}
			this.currentSprite = getCurrentSpriteByView.call(this, e.target);			
			this.csspanel.setModel(getCSSModel.call(this, this.currentSprite.$view.attr("id")), this.currentSprite.$view);
		};
		
		var offset = e.view.offset();
	};

	function onSpriteLeftClick(e){
		var oScope 		= this;
		var grid 		= {x:this.grid.offset, y:'Infinity' };
		switch(e.key){
			case "append" :
				var $elem 		= $('<div id="sprite'+(oScope.aSprites.length + 1)+'" class="sprite blue"></div>');
				var sp 		= new sprite($elem, e.view, grid);
				sp.addEventListener('sprite_right_click', onSpriteClick.bind(oScope));
				sp.addEventListener('sprite_left_click', onSpriteClick.bind(oScope));
				sp.init();
				oScope.aSprites.push(sp);
				e.view.append($elem);
			break;
			case "prepend" :
				var $elem 		= $('<div id="sprite1" class="sprite blue"></div>');
				var sp 		= new sprite($elem, $stage, grid);
				sp.addEventListener('sprite_right_click', onSpriteClick.bind(oScope));
				sp.addEventListener('sprite_left_click', onSpriteClick.bind(oScope));
				sp.init();
				oScope.aSprites.push(sp);
				e.view.prepend($elem);
			break;
			case 	"delete" :
				for (var i=0; i < oScope.aSprites.length; i++) {
				 	var sprite 	=  oScope.aSprites[i];
				 	if(sprite === e.target){
				 		sprite.destroy();	
				 		oScope.aSprites.splice(i,1);
				 		break;
				 	}
				};
			break;
		}
		
	};
	
	function getCSSModel(p_Id){
		if(oCSS[p_Id]){
			return oCSS[p_Id].css.slice(0);		
		}
		return null;
	};
	
	function setCSSModel(p_Id, oData){
		if(oCSS[p_Id]){
			oCSS[p_Id].css = oData;		
		}else{
			oCSS[p_Id] = {css: oData};
		}
		return null;
	};
	
	function onSpriteRightClick(e){
		this.csspanel.createModel(oJson, $('#cssprop ')[0]);
		
	};


	function dragProgress(e){
		console.log(JSON.stringify(e.offset));
		if(this.currentSprite){
			this.currentSprite.$view.offset(e.offset)
		}
	};
	
	return new obj(p_$view);
};

