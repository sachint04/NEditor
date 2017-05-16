define([
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(EventDispatcher, Logger){

	function ToggleGroup (p_aOptionsList) {
		//Logger.logDebug('ToggleGroup.CONSTRUCTOR() | aOptionsList = '+ p_aOptionsList);
		EventDispatcher.call(this);
		this.oSelectedOption		= null;
		this.aOptionsList			= p_aOptionsList;
		this.sGroupID 				= p_aOptionsList[0].sGroupID;
		this.handleEvents			= this.handleEvents.bind(this);
		this.handleKeyboardEvents	= this.handleKeyboardEvents.bind(this);
		this.enable(true);
		
		for(var i=0; i<this.aOptionsList.length; i++){
			var oOption	= this.aOptionsList[i];
			oOption.addEventListener('OPTION_CLICK', this.handleEvents);
			oOption.addEventListener('KEY_UP', this.handleKeyboardEvents);
			oOption.addEventListener('KEY_DOWN', this.handleKeyboardEvents);
			oOption.addEventListener('KEY_LEFT', this.handleKeyboardEvents);
			oOption.addEventListener('KEY_RIGHT', this.handleKeyboardEvents);
		}
		
		//this.aOptionsList[0].focus();
	}

	ToggleGroup.prototype				= Object.create(EventDispatcher.prototype);
	ToggleGroup.prototype.constructor		= ToggleGroup;

	ToggleGroup.prototype.handleEvents		= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var sType				= e.type,
			oOption				= e.target,
			$domRadioOptn		= e.$domRadioOption,
			sID					= oOption.getID(),
			sGroupID			= oOption.getGroupID(),
			bOptionIsSelected	= oOption.isSelected();

			if(bOptionIsSelected){return;}
			if(this.oSelectedOption){
				this.oSelectedOption.selected(false);
			}
			oOption.selected(true);
			this.oSelectedOption = oOption;

			this.dispatchEvent('OPTION_SELECT', {type:'OPTION_SELECT', target:this, option:oOption, $domRadioOption:$domRadioOptn});
	};

	ToggleGroup.prototype.enable				= function(p_bEnable){
		for(var i=0; i<this.aOptionsList.length; i++){
			var oOption	= this.aOptionsList[i];
			if(p_bEnable){
				oOption.enable(true);
			}else{
				oOption.enable(false);
			}
		}
	};

	ToggleGroup.prototype.reset					= function(){
		if(this.oSelectedOption){
			this.oSelectedOption.selected(false);
			this.oSelectedOption = null;
		}
		this.aOptionsList[0].$domOption.attr("tabindex",0);
	};

	ToggleGroup.prototype.handleKeyboardEvents	= function(e) {
		var nSelectedRadioIndex	= this.aOptionsList.indexOf(this.oSelectedOption);
		(nSelectedRadioIndex < 0) ? nSelectedRadioIndex = 0 : nSelectedRadioIndex;
		if(e.type === 'KEY_UP' || e.type === 'KEY_LEFT'){
			e.target = this.getOptionToFocus(nSelectedRadioIndex-1);
			this.handleEvents(e);
		}else if(e.type === 'KEY_DOWN' || e.type === 'KEY_RIGHT'){
			e.target = this.getOptionToFocus(nSelectedRadioIndex+1);
			this.handleEvents(e);
		}else if(e.type === 'KEY_SPACE' && !this.oSelectedOption){
			e.target = this.aOptionsList[0];
			this.handleEvents(e);
		}
	};

	ToggleGroup.prototype.getOptionToFocus		= function(p_nSelectedRadioIndex) {
		var nNumOfOptions	= this.aOptionsList.length;
		//Logger.logDebug("ToggleGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Options = '+nNumOfOptions);
		if(p_nSelectedRadioIndex === nNumOfOptions){// ** Last Option, so select First
			oOption	= this.aOptionsList[0];
		}else if(p_nSelectedRadioIndex < 0){// ** First Option, so select last one
			oOption	= this.aOptionsList[nNumOfOptions-1];
		}else{
			oOption	= this.aOptionsList[p_nSelectedRadioIndex];
		}
		return oOption;
	};

	ToggleGroup.prototype.updateSelection		= function(p_nSelectedRadioIndex) {
		var nNumOfOptions	= this.aOptionsList.length;
		//Logger.logDebug("ToggleGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Options = '+nNumOfOptions);
		if(p_nSelectedRadioIndex === nNumOfOptions){
			oOption	= this.aOptionsList[0];
		}else if(p_nSelectedRadioIndex < 0){
			oOption	= this.aOptionsList[nNumOfOptions-1];
		}else{
			oOption	= this.aOptionsList[p_nSelectedRadioIndex];
		}
		oOption.selected(true);
	};
	ToggleGroup.prototype.setSelectedOption		= function(p_sOptionID){
		//Logger.logDebug('ToggleGroup.setSelectedOption() | \n\tOption ID To Select = '+p_sOptionID);
		var oOption,
			sOptionID,
			i;

		for (i=0; i < this.aOptionsList.length; i++) {
			oOption		= this.aOptionsList[i];
			sOptionID	= oOption.getID();
			//Logger.logDebug('\tCompare | Option ID = '+sOptionID+' :: Parameter Option ID = '+p_sOptionID);
			if(sOptionID === p_sOptionID){
				oOption.$domOption.removeClass('selected disabled');
				oOption.$domOption.trigger('click');
				break;
			}
		};
	};
	
	ToggleGroup.prototype.getSelectedOption		= function(){
		//Logger.logDebug('ToggleGroup.getSelectedOption() | '+this.toString());
		return this.oSelectedOption;
	};
	ToggleGroup.prototype.getOptionsList		= function(){
		return this.aOptionsList;
	};
	ToggleGroup.prototype.destroy				= function(){
		this.oSelectedOption = null;
		var i,
			nNumOfOptns	= this.aOptionsList.length;
		for(i=0; i<nNumOfOptns; i++){
			var oOption	= this.aOptionsList[i];
			oOption.enable(false);
			oOption.removeEventListener('OPTION_CLICK', this.handleEvents);
			oOption.removeEventListener('KEY_UP', this.handleKeyboardEvents);
			oOption.removeEventListener('KEY_DOWN', this.handleKeyboardEvents);
			oOption.removeEventListener('KEY_LEFT', this.handleKeyboardEvents);
			oOption.removeEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			oOption.destroy();
		}
		
		this.aOptionsList		= null;
		this.oSelectedOption	= null;
		EventDispatcher.prototype.destroy.call(this);
		this.prototype			= null;
		
	};
	ToggleGroup.prototype.toString				= function(){
		return 'framework/activity/ToggleGroup';
	};

	return ToggleGroup;
});
