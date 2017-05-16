/**
 * A module represents controller for the sprite element on the stage.
 * @module js/sprite  
 */

//var sprite 	=	function(p_view, p_container, _grid){
		
		/**
 		* Editable Sprite Controller
 		* @constructor
 		* @alias module:sprite
		*/
		var sprite = function(p_view, p_container, _grid){
			draggable.call(this, p_view, p_container,_grid);
			/** The class '$view' property - jQuery element */
			this.$view 			= p_view;
			/** The class '$conainer' property - jQuery element */
			this.$container		= p_container;
			/** The class 'offset' property - object */
			this.offset 		= this.$view.offset();
			this.offset.width 	= this.$view.width();
			this.offset.height 	= this.$view.height();
			
			var oScope = this;
			this.$view.click(function(e){
				e.preventDefault();
				oScope.dispatchEvent('sprite_left_click',{type:'sprite_left_click', target:this, view:oScope.$view});
				$(".sprite").removeClass('react-edit');
				oScope.$view.addClass('react-edit');								
			});
			this.$view.on('focus', function(e){
				oScope.$view.addClass('react-edit');				
			});
			
			this.$view.on('blur', function(e){
				//oScope.$view.removeClass('react-edit');
			});
			//addContextMenu.call(this);
			//this.init 	= this.init.bind(this);
			return this;
		};

	sprite.prototype								= Object.create(draggable.prototype);
	sprite.prototype.constructor					= sprite;
	
	/**
	 *Apply CSSS to view 
 	* @param {Object} css Style props
	 */	
	sprite.prototype.updateCSS						= function(css){
		this.$view.css(css);
	};
	
	/**
	 * Initialize sprite controller 
	 */
	sprite.prototype.init 							= function(){
		draggable.prototype.init.call(this);
		initEditor.call(this);
			//onDragStop.call(this, this.$view);		
	};

	/**
	 * Initiate JQueryUI lib on offset and scale handles 
 * @param {Object} bar
 * @param {Object} dragFun
	 */
	function setDrag(bar, dragStartFun, dragStopFun, dragFun){
		// bar.draggable({
			// start:dragStartFun.bind(this),
			// stop:dragStopFun.bind(this),
			// cursor:'move',
			// drag:dragFun
		// });
		
	};
	
	function initEditor(){
		var oScope	= this;
		tinymce.init({
		  target: oScope.$view[0],
		   	inline: true,
		    plugins: [
					    'advlist autolink lists link image charmap print preview anchor',
					    'searchreplace visualblocks code fullscreen',
					    'insertdatetime media table contextmenu paste'
					  ],
			toolbar: ' undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
		   	setup: function(editor) 
		   		{
				oScope.editor = editor;
			    editor.on('click', function(e) {
			    	e.preventDefault();
				     interact(oScope.$view[0]).draggable(false);
				     interact(oScope.$view[0]).resizable(false);
				     oScope.$view.addClass('edit-mode');
				     oScope.$view.css("curspr", "default");
			    });
			    editor.on('blur', function(e){
				     interact(oScope.$view[0]).draggable(true);				    	
				     interact(oScope.$view[0]).resizable(true);				    	
				     oScope.$view.removeClass('edit-mode');
			    });
			    editor.addMenuItem('style',{
			    	text: "Style",
			    	context: 'format',
			    	 menu: [{
					        text: 'background',
					        onclick: function() {
					          editor.insertContent('&nbsp;<strong>Menu item 1 here!</strong>&nbsp;');
					        }
					      }, {
					        text: 'border',
					        onclick: function() {
					          editor.insertContent('&nbsp;<em>Menu item 2 here!</em>&nbsp;');
					        }
					      }]

			    });
			  }
			
		});
	};
	
	/**
	 * Private: Drag handler for Offset handler 
	 */
	function onDragMove(e){
		var $elem 		= $(e.target),
		sTarget 	= $elem.attr('data-target');
		$target 	= $('#'+sTarget),
		offset1		= $elem.offset();
		
		$target.offset({
			'left':offset1.left,
			'top':offset1.top
			});		
		//console.log('onDragMove '+ JSON.stringify(offset1));
		// $elem.css({
			// 'left':(-($elem.width()/2))+'px',
			// 'top':(-($elem.width()/2))+'px'
			// });
	
		
	}

	/**
	 * Private: Drag handler for Scale handler 
	 */
	function onDragScale(e){
		var $scalebar 	= $(e.target),
		$target 		= $scalebar.parent();
		
		$target.css({
			'width': ($scalebar.position().left)+'px', 
			'height': ($scalebar.position().top)+'px' 
		});
		this.dispatchEvent('ondrag',{type:'ondrag', target:this, css:{
						"left":this.$view.css('left'), 
						"top":this.$view.css('top'), 
						"width":this.$view.css('width'), 
						"height":this.$view.css('height')
						}, $view:$target});		
	//	console.log($target.attr('data-target')+' | '+$target.offset().top+' | '+$target.offset().left);
	}
	
	/**
	 * Private: jQueryUI drag start handler 
 	* @param {Object} e Drag data
	 */
	function onDragStart(e){
	//	console.log('onDragStart'+e);
	}
	
	/**
	 * Private: jQueryUI drag stop handler 
	 * @param {Object} e Drag data
	 */
	function onDragStop(e){
		this.dispatchEvent('ondrag_stop',{type:'ondrag_stop', target:this, css:{
						"left":this.$view.css('left'), 
						"top":this.$view.css('top'), 
						"width":this.$view.css('width'), 
						"height":this.$view.css('height')
						}});
	};
	
	/**
	 * 
 	* @param {Object} e
	 */
	function onStart(e){
		$target = $(e.target),
		$elem 	= $target.parent();
		$target.css({
			'left':$elem.offset().left + ($elem.offset().width - ($target.width()/2))+'px',
			'top': $elem.offset().top + ($elem.offset().height - ($target.height()/2))+'px'
		});
	
	};
	
	/**
	 * Add context menu using third party lib (jquery-contextMenu.js ) 
	 */
	function addContextMenu(){
		var oScope 	= this;
    //  $(function(){
	    $.contextMenu({
	        selector: '#'+oScope.$view.attr('id'), 
	        callback: function(key, options) {
	            var m = "clicked: " + key + " on " + $(this).text();
	            oScope.dispatchEvent('sprite_left_click', {type:'sprite_left_click', target:oScope, key:key, view: oScope.$view}); 
	        },
	        items: {
	            "edit": {name: "Edit", icon: "edit"},
	            "append": {name: "Append", icon: "copy"},
	            "prepend": {name: "Prepend", icon: "copy"},
	            "copy": {name: "Copy", icon: "copy"},
	            "paste": {name: "Paste", icon: "paste"},
	            "delete": {name: "Delete", icon: "delete"},
	        }
	    });
	//});
	};
	
	
	
	/**
	 *	Show Hide tranform handlers 
 * @param {Boolean} show
	 */
	sprite.prototype.showControls  = function(show){
		var movebar 	= $("#headermove2"),
		scalebar 		= $("#scalebar");
		if(show){
			movebar.removeClass('hide');
			scalebar.removeClass('hide');
		}else{
			movebar.addClass('hide');
			scalebar.addClass('hide');
		}
	};
	
	/**
	 * Refresh transform handlers 
	 */
	sprite.prototype.invalidate  = function(){
		onDragStop.call(this);
	};
	
	/**
	 * Refresh transform handlers 
	 */
	sprite.prototype.invalidateControls  = function(){
		var bar 		= $("#headermove2"),w,h,l,t,width,height, pos;
		pos			= this.$view.position();
		l 				= pos.left;
		t 				= pos.top;
		width			= bar.width();
		height			= bar.height();
		
		bar.css({
			'position':'absolute',
			'left': (l -(width/2))+'px',
			'top': 	(t -(height/2))+'px'
		});
		
		bar 		= $("#scalebar");
		w 			= bar.width();
		h 			= bar.height();
		width 		= this.$view.width();
		height 		= this.$view.height();
		 
		bar.css({
			'position':'absolute',
			'left':(width 	- (w/2))+'px',
			'top': (height 	- (h/2))+'px'
		});
	};
	
	function onDragScaleStart(e){
		var $elem = $(e.target);	
	};
	function onDragScaleStop(e){
		var $elem = $(e.target);	
	};
	function onDragMoveStart(e){
		var $elem = $(e.target);
		if(!$elem.parent().hasClass('stage') ){
			var $stage		= $('.stage'),
			offset			= $elem.offset();
			
			$elem.attr('data-target',$elem.parent().attr('id'));
		//	console.log('onDragMoveStart - '+ JSON.stringify(offset));
			$elem.appendTo($stage)
			$elem.css(
				{
				'left':offset.left,	
				'top':offset.top	
			});			
		}	
	};
	
	function onDragMoveStop(e){
		var $elem = $(e.target);
		if($elem.parent().hasClass('stage') ){
			console.log('onDragMoveStop - '+ JSON.stringify($elem.offset()));
			var $target		= $('#'+$elem.attr('data-target'));
			$elem.appendTo($target);
			$elem.css({
				'left':'0px',
				'top': '0px'
			});			
		}	
	};
	
	function showCSSProperty(){
		alert('showCSSProperty');
	};
	
	sprite.prototype.destroy  = function(){
		this.$view.off().remove();
		this.$view 			= null;

		this.offset 		= null;
			
	};
	
//	return sprite(p_view, p_container, _grid);



//};