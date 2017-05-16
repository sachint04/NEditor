define([
	'jquery',
	'framework/activity/viewcontroller/Option',
	'framework/utils/Logger'
], function($, Option, Logger){

	function Target(p_domOption, p_sID, p_sGroupID, p_oOptionData){
		//Logger.logDebug('Option.CONSTRUCTOR() | DOM Radio '+p_domOption+' : ID = '+p_sID+' : Group ID = '+p_sGroupID+' : Score = '+p_nScore+' Params = '+p_aParameter);
		Option.call(this, p_domOption, p_sID, p_sGroupID, null, [], p_oOptionData);
		this._correct = false;
		this.showTickCross		= this.showTickCross.bind(this);
		this.resetTickCross		= this.resetTickCross.bind(this);
	}

	Target.prototype						= Object.create(Option.prototype);
	Target.prototype.constructor			= Target;

	Target.prototype._handleEvents			= function(e){
		//Logger.logDebug('Option._handleEvents() | \n\tOption Grp = '+this.getGroupID()+'\n\tOption ID = '+this.getID()+'\n\tHas "disabled" or "inactive" class = '+(this.$domOption.hasClass('inactive') && !this.$domOption.hasClass('disabled')));
		e.preventDefault();
		if(!this.$domOption.hasClass('inactive') && !this.$domOption.hasClass('disabled')){
			//this.dispatchEvent('OPTION_CLICK', {type:'OPTION_CLICK', target:this, currentTarget:this.$domOption, ID:this.sID, groupID:this.sGroupID});
			this.dispatchEvent('OPTION_CLICK', {type:'OPTION_CLICK', target:this, $domRadioOption:this.$domOption, ID:this.sID, groupID:this.sGroupID});
		}
	};
	
	Target.prototype.selected				= function(p_bSelected){
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
	Target.prototype.focus					= function(){
		this.$domOption.focus();
	};
	Target.prototype.tabIndex				= function(p_nTabIndex){
		this.$domOption.attr({
			'tabindex'		: p_nTabIndex
		});
	};

	Target.prototype.showTickCross				= function(){
		if(this.$domOption.attr('data-tileid' ) === "null"){
			return;
		}
		
		if(this._correct){
			this.$domOption.find('.correctincorrect').addClass('correct').removeClass('incorrect hide');
		}else{
			this.$domOption.find('.correctincorrect').addClass('incorrect').removeClass('correct hide');
		}
	};
	Target.prototype.resetTickCross				= function(){
			this.$domOption.find('.correctincorrect').removeClass('correct incorrect').addClass('hide');
	};
	
	Target.prototype.setCorrect				= function(p_bCorrect){
		this._correct = p_bCorrect;
	};
	Target.prototype.isCorrect				= function(p_bCorrect){
		return this._correct;
	};
	Target.prototype.isSelected				= function(){
		return this.bSelected;
	};
	//Bharat -Added during MMCQ change
	Target.prototype.isCheckbox				= function(){
		return this.$domIcon.hasClass('checkbox-icon');
	};

	Target.prototype.resetTileID				= function(){
		return this.$domOption.attr('data-tileid', 'null');
	};

	//End Bharat -Added during MMCQ change
	Target.prototype.destroy				= function(){
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
	Target.prototype.toString				= function(){
		return 'framework/activity/Target';
	};

	return Target;
});
