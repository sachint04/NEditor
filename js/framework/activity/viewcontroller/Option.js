define([
	'jquery',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function($, EventDispatcher, Logger){

	function Option(p_domOption, p_sID, p_sGroupID, p_nScore, p_aParameter, p_oOptionData){
		//Logger.logDebug('Option.CONSTRUCTOR() | DOM Radio '+p_domOption+' : ID = '+p_sID+' : Group ID = '+p_sGroupID+' : Score = '+p_nScore+' Params = '+p_aParameter);
		EventDispatcher.call(this);
		this.$domOption		= $(p_domOption);
		this.$domIcon		= this.$domOption.find('.radio-icon,.checkbox-icon');
		this.sID			= p_sID;
		this.sGroupID		= p_sGroupID;
		this.nScore			= p_nScore || 0;
		this.aParameters	= p_aParameter;
		this.oOptionData	= p_oOptionData;

		this.bSelected		= false;
		this.bEnabled		= false;
		// ** Define values for keycodes
		this.keys = {
			tab		: 9,
			enter	: 13,
			space	: 32,
			left	: 37,
			up	: 38,
			right	: 39,
			down	: 40
		};
		
		this.handleKeyboardEvents 	= this.handleKeyboardEvents.bind(this);
		var oScope = this;
		
		this.$domOption.addClass('tis-btn');
	
		this.$domOption.on('click', function(e){
			oScope._handleEvents(e);
		}).on('keydown', function(e){
			oScope.handleKeyboardEvents(e);
		}).focus(function(e) {
			oScope.handleKeyboardEvents(e);
		}).blur(function(e) {
			oScope.handleKeyboardEvents(e);
		}).on('mouseleave', function(e){});
		
		this.enable(true);
	}

	Option.prototype						= Object.create(EventDispatcher.prototype);
	Option.prototype.constructor			= Option;
	
	/**
	 * Click event handler 
	 */
	Option.prototype._handleEvents			= function(e){
		e.preventDefault();
		if(!this.$domOption.hasClass('inactive') && !this.$domOption.hasClass('disabled')){
			this.dispatchEvent('OPTION_CLICK', {type:'OPTION_CLICK', target:this, $domRadioOption:this.$domOption, ID:this.sID, groupID:this.sGroupID});
		}
	};

	/**
	 * Keyboard event handler 
	 */
	Option.prototype.handleKeyboardEvents	= function(e){
		return;
		if($(!e.target).hasClass('tis-btn')){
			return;
		}
		var code = e.which;
		if (code === this.keys.enter || code === this.keys.space) {
			this.$domOption.click();
		}
		if (code === this.keys.up) {
			this.dispatchEvent('KEY_UP', {target:this, type:'KEY_UP'});
		}
		if (code === this.keys.down) {
			this.dispatchEvent('KEY_DOWN', {target:this, type:'KEY_DOWN'});
		}
		if (code === this.keys.left) {
			this.dispatchEvent('KEY_LEFT', {target:this, type:'KEY_LEFT'});
		}
		if (code === this.keys.right) {
			this.dispatchEvent('KEY_RIGHT', {target:this, type:'KEY_RIGHT'});
		}
		if (code === this.keys.space) {
			this.dispatchEvent('KEY_SPACE', {target:this, type:'KEY_SPACE'});
		}
	};
	
	
	/**
	 * Add/Remove 'disabled' class to element 
	 */
	Option.prototype.enable					= function(p_bEnable){
		if(this.bEnabled === p_bEnable){return;}
		var oScope = this;
		var $container = this.$domOption.closest('.container'); 
		if(p_bEnable){
			$container.removeClass('disabled');
			this.$domOption.removeClass('disabled').attr({
				'aria-disabled'	: false
			});
			this.$domIcon.removeClass('disabled');
			this.bEnabled = true;
		}else{
			$container.addClass('disabled');
			this.$domOption.addClass('disabled').attr({
				'aria-disabled'	: true
			});
			this.$domIcon.addClass('disabled');
		
			this.bEnabled = false;
		}
	};

	Option.prototype.getScore				= function(){
		return this.nScore;
	};
	
	Option.prototype.getOptionData			= function(){
		return this.oOptionData;
	};

	Option.prototype.getParameters			= function(){
		return this.aParameters;
	};
	
	Option.prototype.getGroupID				= function(){
		return this.sGroupID;
	};
	
	Option.prototype.getID					= function(){
		return this.sID;
	};
	
	Option.prototype.reset					= function(){
		this.bSelected = false;
		this.enable(true);
		this.$domOption.closest('.container').removeClass('disabled selected'); 
		this.$domOption.removeClass('disabled selected');
		this.$domIcon.removeClass('disabled selected');
	};
	
	/**
	 * Set or Get Selected state
	 * @param {Boolean} p_bSelected  -  new selected state 
	 * @param {Boolean} p_bViewChangeOnly - Change view only to show user answer, previous State will be maintained 
	 */	
	Option.prototype.selected				= function(p_bSelected , p_bViewChangeOnly){
		if(!p_bViewChangeOnly && this.$domIcon.hasClass('disabled')){return;}	
		this.bSelected = (!p_bViewChangeOnly)?p_bSelected : this.bSelected;
		var $container = this.$domOption.closest('.container'); 
		if(p_bSelected){
			$container.addClass('selected');
          	this.$domOption.attr({
				'tabindex'		: 0,
				'aria-checked'	: true
			}).focus();
		}else{
			var nTabIndex = (this.isCheckbox()) ? 0 : -1;
			$container.removeClass('selected');		
			this.$domOption.attr({
				'tabindex'		: nTabIndex,
				'aria-checked'	: false
			});
		}
	};
	
	Option.prototype.getView					= function(){
		return  this.$domOption;
	};
	Option.prototype.focus					= function(){
		this.$domOption.focus();
	};
	Option.prototype.tabIndex				= function(p_nTabIndex){
		this.$domOption.attr({
			'tabindex'		: p_nTabIndex
		});
	};


	Option.prototype.isSelected				= function(){
		return this.bSelected;
	};
	//Bharat -Added during MMCQ change
	Option.prototype.isCheckbox				= function(){
		return this.$domIcon.hasClass('checkbox-icon');
	};

	//End Bharat -Added during MMCQ change
	Option.prototype.destroy				= function(){
		this.$domOption.off();

		this.$domOption		= null;
		this.$domIcon		= null;
		this.sID			= null;
		this.sGroupID		= null;
		this.nScore			= null;
		this.aParameters	= null;
		this.oOptionData	= null;

		this.bSelected		= null;
		this.bEnabled		= null;
		this.keys			= null;

		EventDispatcher.prototype.destroy.call(this);

		this.prototype		= null;
	};
	Option.prototype.toString				= function(){
		return 'framework/activity/controller/Option';
	};

	return Option;
});
