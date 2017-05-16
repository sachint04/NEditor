define([
	'jquery',
	'framework/activity/viewcontroller/Option',
	'framework/utils/Logger'
], function($, Option, Logger){

	function Tile(p_domOption, p_sID, p_sGroupID, p_nScore, p_aParameter, p_oOptionData){
		//Logger.logDebug('Option.CONSTRUCTOR() | DOM Radio '+p_domOption+' : ID = '+p_sID+' : Group ID = '+p_sGroupID+' : Score = '+p_nScore+' Params = '+p_aParameter);
		Option.call(this, p_domOption, p_sID, p_sGroupID, p_nScore, p_aParameter, p_oOptionData);
		
	}

	Tile.prototype						= Object.create(Option.prototype);
	Tile.prototype.constructor			= Tile;

	Tile.prototype._handleEvents			= function(e){
		Logger.logDebug('Option._handleEvents() | \n\tOption Grp = '+this.getGroupID()+'\n\tOption ID = '+this.getID()+'\n\tHas "disabled" or "inactive" class = '+(this.$domOption.hasClass('inactive') && !this.$domOption.hasClass('disabled')));
		e.preventDefault();
		if(!this.$domOption.hasClass('inactive') && !this.$domOption.hasClass('disabled')){
			//this.dispatchEvent('OPTION_CLICK', {type:'OPTION_CLICK', target:this, currentTarget:this.$domOption, ID:this.sID, groupID:this.sGroupID});
			this.dispatchEvent('OPTION_CLICK', {type:'OPTION_CLICK', target:this, $domRadioOption:this.$domOption, ID:this.sID, groupID:this.sGroupID});
		}
	};
	Tile.prototype.enable					= function(p_bEnable){
		var oScope = this;
		// ** Return if already enabled
		if(this.bEnabled === p_bEnable){return;}
		//Logger.logDebug('Option.enable() | Option Grp length = '+this.$domOption.length+' |  ' +this.getGroupID()+' : Option ID = '+this.getID()+' : Enable = '+p_bEnable+' : IS Enabled = '+this.bEnabled);
		if(p_bEnable){
			this.$domOption.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
			this.$domIcon.removeClass('disabled');
			this.$domOption.on('click', function(e){
				oScope._handleEvents(e);
			}).on('keydown', function(e){
				oScope.handleKeyboardEvents(e);
			}).focus(function(e) {
				oScope.handleKeyboardEvents(e);
			}).blur(function(e) {
				oScope.handleKeyboardEvents(e);
			}).on('mouseleave', function(e){
				//oScope._handleEvents(e);				
			});
			this.bEnabled = true;
		}else{
			this.$domOption.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
			this.$domIcon.addClass('disabled');
			this.$domOption.off();
			this.bEnabled = false;
		}
	};
	Tile.prototype.selected					= function(p_bSelected){
		if(this.$domIcon.hasClass('disabled')){return;}
		this.bSelected = p_bSelected;
		if(this.bSelected){
			this.$domIcon.addClass('selected');
                        this.$domIcon.prevObject.parent().addClass('selected');
			this.$domOption.attr({
				'tabindex'		: 0,
				/* START - ARIA Implementation */
				'aria-checked'	: true
				/* END - ARIA Implementation */
			}).addClass('selected').focus();
		}else{
			var nTabIndex = (this.isCheckbox()) ? 0 : -1;
                        this.$domIcon.prevObject.parent().removeClass('selected');
			this.$domIcon.removeClass('selected');
			this.$domOption.attr({
				'tabindex'		: nTabIndex,
				/* START - ARIA Implementation */
				'aria-checked'	: false
				/* END - ARIA Implementation */
			}).removeClass('selected');
		}
	};
	Tile.prototype.focus					= function(){
		this.$domOption.focus();
	};
	Tile.prototype.tabIndex					= function(p_nTabIndex){
		this.$domOption.attr({
			'tabindex'		: p_nTabIndex
		});
	};


	Tile.prototype.isSelected				= function(){
		return this.bSelected;
	};
	//Bharat -Added during MMCQ change
	Tile.prototype.isCheckbox				= function(){
		return this.$domIcon.hasClass('checkbox-icon');
	};

	//End Bharat -Added during MMCQ change
	Tile.prototype.destroy				= function(){
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

		//EventDispatcher.prototype.destroy.call(this);

		this.prototype		= null;
	};
	Tile.prototype.toString				= function(){
		return 'framework/activity/controller/Option';
	};

	return Tile;
});
