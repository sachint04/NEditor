/**
 * @mixin framework/utils/EventDispatcher 
 */
define([
	'framework/utils/Logger'
], function(Logger){
	function EventDispatcher() {
		this.events = {};
		return this;
	}
	/**
	 *@constructor
	 * @alias EventDispatcher 
	 */
	EventDispatcher.prototype = {
		constructor					: EventDispatcher,
		/**
		 * 
		 * @member
		 * @param {String}  Event type
		 * @param {Object}  Handler function  
		 */
		addEventListener			: function (key, func) {
			//Logger.logDebug('$$$ addEventListener() : SCOPE = '+this+' : KEY = '+key+' : HAS property = '+this.events.hasOwnProperty(key));
		    if (!this.events.hasOwnProperty(key)) {
				//Logger.logDebug('\t$$$ Create NEW array for key "'+key+'"');
		        this.events[key] = [];
		    }
		    this.events[key].push(func);
		},
		/**
		 * Returns true if Event Handler is already added for the Key
		 * @member
		 * @param {String}  Event type
		 * @param {Object}  Handler function
		 * @returns {Boolean}    
		 */
		hasEventListener			: function (key, func) {
			//Logger.logDebug('$$$ addEventListener() : SCOPE = '+this+' : KEY = '+key+' : HAS property = '+this.events.hasOwnProperty(key));
		    if (this.events.hasOwnProperty(key)) {
				//Logger.logDebug('\t$$$ Create NEW array for key "'+key+'"');
				if(func){
					if(this.events[key].indexOf(func) !== -1){
						return true;
					}
				}
		    }
		    return false;
		},
		removeEventListener			: function (key, func) {
		    if (this.events.hasOwnProperty(key)) {
		        for (var i in this.events[key]) {
		        	//Logger.logDebug('removeEventListener() $$$ '+key+' :: '+(this.events[key][i] === func)+' :: \n\t'+this.events[key][i]+'\n\t'+func);
		            if (this.events[key][i] === func) {
		                this.events[key].splice(i, 1);
		                if(this.events[key].length == 0){
		                	delete this.events[key];	
		                }
		            }
		        }
		    }
		},
		removeAllEventListener		: function (key, func) {
			for(var key in this.events){
				var keyPointer	= this.events[key];
		        for (var i in keyPointer) {
		        	//Logger.logDebug('removeAllEventListener() $$$ '+key+' :: Type of Function = '+(typeof this.events[key][i] === 'function'));
	                this.events[key].splice(i, 1);
		        }
		        keyPointer = null;
			}
		},
		dispatchEvent				: function (key, dataObj) {
		    if (this.events.hasOwnProperty(key)) {
		        dataObj = dataObj || {};
		        dataObj.currentTarget = this;
		        //Logger.logDebug('$$$ dispatchEvent() | '+this.toString()+' : Length = '+this.events[key].length);
		        var eventKeyCopy	= this.events[key].slice(0);
		        for (var i=0; i < eventKeyCopy.length; i++) {
					//Logger.logDebug('\t$$$ index '+i);
					eventKeyCopy[i](dataObj);
				};
		        /*for (var i in this.events[key]) {
					//Logger.logDebug('\t$$$ index '+i);
					this.events[key][i](dataObj);
				}*/

		    }
		},
		destroy						: function () {
			/*
			for(var key in this.events){
							this.events[key] = null;
						}
						this.events = null;*/

		}
	};

	return EventDispatcher;
});