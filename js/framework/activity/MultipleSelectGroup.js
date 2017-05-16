define([
	'framework/activity/ToggleGroup',
	'framework/utils/Logger'
], function(ToggleGroup, Logger){

	function MultipleSelectGroup (p_aOptionsList) {
		ToggleGroup.call(this, p_aOptionsList);
		this.aSelectedOptions	= [];		
	}

	MultipleSelectGroup.prototype						= Object.create(ToggleGroup.prototype);
	MultipleSelectGroup.prototype.constructor			= MultipleSelectGroup;

	MultipleSelectGroup.prototype.handleEvents			= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var sType				= e.type,
			oOption				= e.target,
			sID					= oOption.getID(),
			sGroupID			= oOption.getGroupID(),
			bOptionIsSelected	= oOption.isSelected();

		if(bOptionIsSelected){
			var nIndexOfOption	= this.aSelectedOptions.indexOf(oOption);
			this.aSelectedOptions.splice(nIndexOfOption, 1);
			oOption.selected(false);
		}else{
			oOption.selected(true);
			this.aSelectedOptions.push(oOption);
		}

		this.dispatchEvent('OPTION_SELECT', {type:'OPTION_SELECT', target:this, currentTarget:oOption, isSelected:oOption.isSelected(),  option:e.target, optionID:sID, groupId:sGroupID});
	};

	MultipleSelectGroup.prototype.enable				= function(p_bEnable, p_optID){
		if(p_optID ){
			for(var i=0; i<this.aOptionsList.length; i++){
				var oOption	= this.aOptionsList[i];
				if(oOption.getID() === p_optID){
					oOption.enable(p_bEnable);
					return;
				}
			}
		}

		for(var i=0; i<this.aOptionsList.length; i++){
			var oOption	= this.aOptionsList[i];
			oOption.enable(p_bEnable);	
		}
	};
	
	
	MultipleSelectGroup.prototype.enableUnSelected					= function(p_bEnable){
		for(var i=0; i<this.aOptionsList.length; i++){
			var oOption	= this.aOptionsList[i];
			if(!oOption.isSelected()){
				oOption.enable(p_bEnable);				
			}
		}
	};
	
	MultipleSelectGroup.prototype.enableSelected					= function(p_bEnable){
		for(var i=0; i<this.aOptionsList.length; i++){
			var oOption	= this.aOptionsList[i];
			if(oOption.isSelected()){
				oOption.enable(p_bEnable);				
			}
		}
	};
	
	MultipleSelectGroup.prototype.reset					= function(){
		for(i=0;i<this.aSelectedOptions.length;i++){
			this.aSelectedOptions[i].reset();
			this.aSelectedOptions[i].$domOption.attr("tabindex",0);				
		};

		this.aSelectedOptions = [];
		
	};
	
	MultipleSelectGroup.prototype.resetOption					= function(p_sId){
		for(i=0;i<this.aSelectedOptions.length;i++){
			if(p_sId && this.aSelectedOptions[i].getID() === p_sId){
				this.aSelectedOptions[i].reset();
				this.aSelectedOptions[i].$domOption.attr("tabindex",0);
				//console.log('MultipleSelect | reset() '+this.aSelectedOptions[i].getID());
				this.aSelectedOptions.splice(i, 1);
				break;
			}
		}
	};

	MultipleSelectGroup.prototype.handleKeyboardEvents	= function(e) {
		//if(this.aSelectedOptions){
		/*var nSelectedRadioIndex	= this.aOptionsList.indexOf(this.oSelectedOption);
			//Logger.logDebug("MultipleSelectGroup.handleKeyboardEvents() | Event Type = " +e.type+' : Radio Index = '+nSelectedRadioIndex);
			nSelectedRadioIndex = (nSelectedRadioIndex < 0) ? 0 : nSelectedRadioIndex;
			if(e.type === 'KEY_SPACE'){
				this.handleEvents(e);
			}
			if(e.type === 'SHIFT_TAB'){
				e.target =  this.getOptionToFocus(nSelectedRadioIndex-1);
				$(oOption.$domView).focus();
				
			this._handleTabEvents(e);
			}else if(e.type === 'TAB'){
				e.target =  this.getOptionToFocus(nSelectedRadioIndex+1);
				
			this._handleTabEvents(e);
			}
		//}*/
	};
	
	MultipleSelectGroup.prototype._handleTabEvents			= function(e){
		//Logger.logDebug('ToggleGroup.handleEVent '+ e.type);
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var sType				= e.type,
			oOption				= e.target,
			$domRadioOptn		= e.$domRadioOption,
			sID					= oOption.getID(),
			sGroupID			= oOption.getGroupID(),
			bOptionIsSelected	= oOption.isSelected();
			
			this.oSelectedOption = oOption;
			$(oOption.$domOption).focus();
				$(oOption.$domOption).css("border:solid 1px black");
			//this.dispatchEvent('OPTION_SELECT', {type:'OPTION_SELECT', target:this, option:oOption, $domRadioOption:$domRadioOptn});
	};
	
	MultipleSelectGroup.prototype.getSelectedOptions	= function(){
		//Logger.logDebug('MultipleSelectGroup.getSelectedOptions() | '+this.toString());
		return this.aSelectedOptions;
	};

	MultipleSelectGroup.prototype.destroy				= function(){
		this.aSelectedOptions = null;
	};
	MultipleSelectGroup.prototype.toString				= function(){
		return 'framework/activity/MultipleSelectGroup';
	};

	return MultipleSelectGroup;
});
