/**
 * A module represents Stage .
 * @module js/stage
 */

		/**
		 * 
		 * Stage controller
		 * @constructor 
		 * @alias module:stage
		 */
		var stage = function(_view){
			EventDispatcher.call(this);
			this.view 		= _view;
			
			this.$editor	 	= $('<div class="stage-editor hide"></div>');
			 var $padding		= $('<button class="btn-padding">P <input id="input_pad" class="hide" type="text"></input></button>');
			
			$padding.click(function(event){
				$(this).find('input').removeClass('hide');
			});
			
			var oScope	= this;
			$padding.find('input').keypress(function(e) {
			    if(e.which == 13) {
			    	oScope.view.css('padding', $(this).val()+'px');
			        $(this).addClass('hide');
			        oScope.dispatchEvent('style_change', {type:'style_change', target:oScope, stage:oScope.view});
			    }
			});
		
			$.contextMenu({
		        selector: '#'+oScope.view.attr('id'), 
		        items: {
		            "Insert": {name: "Insert"},
		            "copy": {name: "Copy", icon: "copy"},
		            "paste": {name: "Paste", icon: "paste"},
		            "delete": {name: "Delete", icon: "delete"},
		        },
		        callback: function(key, options) {
		            oScope.contextListener.call(oScope, key, options);
		        }
	   		 });
			
			this.$editor.append($padding);
			this.view.append(this.$editor);
			this.view.on('click', this.stageListener.bind(this));	
		};
		
		
		stage.prototype										= Object.create(EventDispatcher.prototype);
		stage.prototype.constructor							= stage;
		
		stage.prototype.stageListener 	= function(event){
			this.$editor.removeClass('hide');
			this.dispatchEvent('stage_click', {type:'stage_click', target:this, view:this.view});
			
		};
		
		stage.prototype.contextListener 	= function(key, options){
			var oScope		= this;
			this.dispatchEvent('stage_insert', {type:'stage_insert', target:oScope, key:key, options:options});
			
		};
		stage.prototype.setPageContainer 	= function($view){
			if(!$view || !$view.length)return;
			this.view = $view;
		};
		
//		return new stage(_view);
		
//};