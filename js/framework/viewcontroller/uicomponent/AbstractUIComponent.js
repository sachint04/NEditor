define([
	'jquery',
	'framework/utils/EventDispatcher',
	'framework/controller/CourseController',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, EventDispatcher, CourseController, Globals, Logger) {

	// focusable is a small jQuery extension to add a :focusable selector. It is used to
	// get a list of all focusable elements in a panel. Credit to ajpiano on the jQuery forums.
	//
	$.extend($.expr[':'], {
		focusable : function(element) {
			var nodeName = element.nodeName.toLowerCase();
			var tabIndex = $(element).attr('tabindex');

			// the element and all of its ancestors must be visible
			if (($(element)[(nodeName == 'area' ? 'parents' : 'closest')](':hidden').length) == true) {
				return false;
			}

			// If tabindex is defined, its value must be greater than 0
			if (!isNaN(tabIndex) && tabIndex < 0) {
				return false;
			}

			// if the element is a standard form control, it must not be disabled
			if (/input|select|textarea|button|object/.test(nodeName) == true) {
				return !element.disabled;
			}

			// if the element is a link, href must be defined
			if ((nodeName == 'a' || nodeName == 'area') == true) {
				return (element.href.length > 0);
			}

			// this is some other page element that is not normally focusable.
			return false;
		}
	});

	function AbstractUIComponent() {
		//Logger.logDebug('AbstractUIComponent.CONSTRUCTOR() | ');
		EventDispatcher.call(this);

		// Merging Concrete classes Config Object with the one here
		this.oConfig	= {};
		this.sUIComponentID;
		this.$uiComponent;
		this.sState;
		this.bInitialized;
		this.$xmlData;
		this.aVisited = [];

		// Define values for keycodes
		this.keys = {
			tab			: 9,
			enter		: 13,
			esc			: 27,
			space		: 32,
			pageup		: 33,
			pagedown	: 34,
			end			: 35,
			home		: 36,
			left		: 37,
			up			: 38,
			right		: 39,
			down		: 40
		};

		return this;
	}

	AbstractUIComponent.prototype									= Object.create(EventDispatcher.prototype);
	AbstractUIComponent.prototype.constructor						= AbstractUIComponent;

	AbstractUIComponent.prototype.getConfig							= function() {
		return this.oConfig;
	};
	AbstractUIComponent.prototype.getComponentConfig				= function() {
		Logger.logError('AbstractUIComponent.getComponentConfig() | ERROR: Concrete classes need to implement a method "getComponentConfig" for setting up default configuration of the component.');
	};

	AbstractUIComponent.prototype.init								= function(p_sID, p_oConfig, p_$xmlComponent) {
		//Logger.logDebug('AbstractUIComponent.init() | Comp ID = '+p_sID);
		// store the id of the containing div
		this.sUIComponentID	= p_sID;
		// store the jQuery object for the component
		this.$uiComponent		= $('#' + p_sID);
		// store XML data
		this.$xmlData 		= p_$xmlComponent;
		// Create the merged Config first
		this.createConfiguration(p_oConfig);
		// If runtime creation is required by the component
		this.createComponent();
	};
	AbstractUIComponent.prototype.createConfiguration				= function(p_oUserConfig){
		for (var sProp in p_oUserConfig) {
			//Logger.logDebug('AbstractUIComponent.createConfiguration() | Prop = '+sProp+' : Value = '+p_oUserConfig[sProp]+' : Type = '+(typeof p_oUserConfig[sProp]));
			p_oUserConfig[sProp] = Globals.sanitizeValue(p_oUserConfig[sProp], this.getConfig()[sProp]);
		};
		this.oConfig = $.extend({}, this.getConfig(), this.getComponentConfig(), (p_oUserConfig || {}));
		//Logger.logDebug('AbstractUIComponent.createConfiguration() | '+JSON.stringify(this.oConfig));
	};
	AbstractUIComponent.prototype.createComponent					= function() {
		//Logger.logDebug('AbstractUIComponent.createComponent() | ');
		// Add ARIA Roles
		this.addAriaRoles();
		// Bind event handlers
		this.bindHandlers();
		// Initialize the tab panel
		this.initialize();
		this.bInitialized = true;
	};
	AbstractUIComponent.prototype.addAriaRoles						= function() {
		Logger.logWarn('AbstractUIComponent.addAriaRoles() | WARN: ARIA roles implementation missing. Method named "addAriaRoles" needs to be implemented for the concrete class');
	};
	AbstractUIComponent.prototype.bindHandlers						= function() {
		Logger.logError('AbstractUIComponent.bindHandlers() | ERROR: Method named "bindHandlers" needs to be implemented for the concrete class');
	};
	AbstractUIComponent.prototype.initialize						= function() {
		Logger.logError('AbstractUIComponent.init() | ERROR: Method named "initialize" needs to be implemented for the concrete class');
	};

	AbstractUIComponent.prototype.dispatchUIComponentLoadedEvent	= function() {
		//Logger.logDebug('AbstractUIComponent.dispatchUIComponentLoadedEvent() | '+ this.sUIComponentID);
		//this.dispatchEvent('UICOMPONENT_LOADED', {target:this, type:'UICOMPONENT_LOADED', componentID:this.sUIComponentID});
		EventDispatcher.prototype.dispatchEvent.call(this, 'UICOMPONENT_LOADED', {target:this, type:'UICOMPONENT_LOADED', componentID:this.sUIComponentID});
	};

	AbstractUIComponent.prototype.isEnabled							= function(p_$target) {
		if (p_$target.hasClass('disabled') || p_$target.hasClass('inactive')) {return false;}
		return true;
	};

	AbstractUIComponent.prototype.getComponentID					= function(){
		return this.sUIComponentID;
	};

	AbstractUIComponent.prototype.addToVisited						= function(p_sID){
		if(this.aVisited.indexOf(p_sID) != -1)return;
		this.aVisited.push(p_sID);
	};

	AbstractUIComponent.prototype.checkCompletionStatus				= function() {
		Logger.logError('Error: AccordianComponent.checkComplitionState() not implemented in component.');
	};
	AbstractUIComponent.prototype.dispatchEvent						= function(p_sEventToDispatch, p_oEventObject){
		//Logger.logDebug('AbstractUIComponent.dispatchEvent() | p_sEventToDispatch = '+p_sEventToDispatch/*+' : Event Obj = '+JSON.stringify(p_oEventObject)*/);
		EventDispatcher.prototype.dispatchEvent.call(this, 'UPDATE', p_oEventObject);
	};
	/*
	AbstractUIComponent.prototype.handleItemFocus				= function($item, e) {
		$item.addClass('focus');
		return true;
	}
	AbstractUIComponent.prototype.handleItemBlur				= function($item, e) {
		$item.removeClass('focus');
		return true;
	}
	AbstractUIComponent.prototype.handleItemKeyDown			= function($item, e) {
		if (e.altKey || e.ctrlKey) {
			return true;
		}
		if (e.shiftKey) {
			if (e.keyCode == this.keys.tab) {
				e.stopPropagation();
				return false;
			}

			return true;
		}

		switch(e.keyCode) {
			case this.keys.tab: {
				return true;
			}
			case this.keys.esc: {
				e.stopPropagation();
				return false;
			}
			case this.keys.enter:
			case this.keys.space: {
				this.handleEvents(e);
				e.stopPropagation();
				return false;
			}
			case this.keys.up: {
				e.stopPropagation();
				return false;
			}
			case this.keys.down: {
				e.stopPropagation();
				return false;
			}
		}

		return true;
	}*/

	AbstractUIComponent.prototype.filterData						= function(p_sTxt){
		var sText			= p_sTxt,
			sStartPrefix	= '<<',
			sEndPrefix		= '>>',
			nStartIndex 	= sText.indexOf(sStartPrefix) + sStartPrefix.length,
			nEndIndex,
			sVariableName,
			sVariableValue;

		//Logger.logDebug('#### nStartIndex = '+nStartIndex);
		while(nStartIndex > -1){
			nEndIndex		= sText.indexOf(sEndPrefix, nStartIndex);
			sVariableName	= sText.substring(nStartIndex, nEndIndex);
			sVariableValue	= this.getConfig()[sVariableName];
			sVariableValue	= (!sVariableValue) ? this[sVariableName] : sVariableValue;
			sText			= sText.substring(0, (nStartIndex - sStartPrefix.length)) + sVariableValue + sText.substring((nEndIndex + sEndPrefix.length), sText.length);
			//Logger.logDebug('######## Variable = '+sVariableName+' : Value = '+sVariableValue+' : '+nStartIndex+' : '+nEndIndex);
			nStartIndex 	= sText.indexOf(sStartPrefix, nEndIndex) + sStartPrefix;
		}
		//Logger.logDebug('#### Filtered text = '+sText);
		return sText;
	};

	AbstractUIComponent.prototype.hasClass							= function(p_sClassName){
		return this.$uiComponent.hasClass(p_sClassName);
	};
	AbstractUIComponent.prototype.addClass							= function(p_sClassName){
		this.$uiComponent.addClass(p_sClassName);
		/*
		this.$uiComponent.children().each(function(i, elem){
					$(this).addClass(p_sClassName);
				});*/

		return this.$uiComponent;
	};
	AbstractUIComponent.prototype.removeClass						= function(p_sClassName){
		this.$uiComponent.removeClass(p_sClassName);
		/*
		this.$uiComponent.children().each(function(i, elem){
					$(this).removeClass(p_sClassName);
				});*/

		return this.$uiComponent;
	};
	AbstractUIComponent.prototype.attr                             = function(p_sAttribute, p_sValue){
		this.$uiComponent.attr(p_sAttribute, p_sValue);
		return this.$uiComponent;
	};
	/**
	 * Destroys the Object
	 */
	AbstractUIComponent.prototype.destroy							= function() {
		//Logger.logDebug('AbstractUIComponent.destroy() | ');
		this.oConfig		= null;
		this.sUIComponentID	= null;
		this.$uiComponent	= null;
		this.sState			= null;
		this.bInitialized	= null;
		this.keys			= null;
		this.prototype		= null;
	};

	AbstractUIComponent.prototype.toString							= function() {
		return 'framework/viewcontroller/AbstractUIComponent';
	};

	return AbstractUIComponent;
});