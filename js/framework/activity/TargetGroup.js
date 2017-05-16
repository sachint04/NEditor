define([
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(EventDispatcher, Logger){

	function TargetGroup (p_aTargetsList) {
		//Logger.logDebug('TargetGroup.CONSTRUCTOR() | aTargetsList = '+ p_aTargetsList);
		EventDispatcher.call(this);
		this.oSelectedTarget	= null;
		this.aTargetsList		= p_aTargetsList;

		this.handleEvents			= this._handleEvents.bind(this);
		this.enable(true);

		//this.aTargetsList[0].focus();
	}

	TargetGroup.prototype						= Object.create(EventDispatcher.prototype);
	TargetGroup.prototype.constructor			= TargetGroup;

	TargetGroup.prototype._handleEvents			= function(e){
		//Logger.logDebug('TargetGroup.handleEVent '+ e.type);
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var sType				= e.type,
			oTarget				= e.target,
			$domTarget			= e.$domTarget,
			sID					= oTarget.getID(),
			sGroupID			= oTarget.getGroupID(),
			bTargetIsSelected	= oTarget.isSelected();

			if(bTargetIsSelected){return;}
			if(this.oSelectedTarget){this.oSelectedTarget.selected(false);}
			oTarget.selected(true);
			this.oSelectedTarget = oTarget;

			this.dispatchEvent(sType, {type:sType, target:this, option:oTarget, $domTarget:$domTarget});
	};

	TargetGroup.prototype.enable				= function(p_bEnable){
	
		for(var i=0; i<this.aTargetsList.length; i++){
			var oTarget	= this.aTargetsList[i];
			Logger.logDebug('TargetGroup.enable() | Target Grp = '+oTarget.getGroupID()+' : Target ID = '+oTarget.getID());
			if(p_bEnable){
				oTarget.enable(true);
				// oTarget.addEventListener('DRAG_START', this.handleEvents);
				// oTarget.addEventListener('DRAG_STOP', this.handleEvents);
				// oTarget.addEventListener('KEY_UP', this.handleKeyboardEvents);
				// oTarget.addEventListener('KEY_DOWN', this.handleKeyboardEvents);
				// oTarget.addEventListener('KEY_LEFT', this.handleKeyboardEvents);
				// oTarget.addEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			}else{
				oTarget.enable(false);
				// oTarget.removeEventListener('DRAG_START', this.handleEvents);
				// oTarget.removeEventListener('DRAG_STOP', this.handleEvents);
				// oTarget.removeEventListener('KEY_UP', this.handleKeyboardEvents);
				// oTarget.removeEventListener('KEY_DOWN', this.handleKeyboardEvents);
				// oTarget.removeEventListener('KEY_LEFT', this.handleKeyboardEvents);
				// oTarget.removeEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			}
		}
	};

	TargetGroup.prototype.reset					= function(){
		//Logger.logDebug("this.oSelectedTarget" +this.oSelectedTarget);
		if(this.oSelectedTarget){
			this.oSelectedTarget.selected(false);
			this.oSelectedTarget = null;
		}
		this.aTargetsList[0].$domTarget.attr("tabindex",0);
	};

	TargetGroup.prototype.handleKeyboardEvents	= function(e) {
		var nSelectedRadioIndex	= this.aTargetsList.indexOf(this.oSelectedTarget);
		//Logger.logDebug("TargetGroup.handleKeyboardEvents() | Event Type = " +e.type+' : Radio Index = '+nSelectedRadioIndex);
		(nSelectedRadioIndex < 0) ? nSelectedRadioIndex = 0 : nSelectedRadioIndex;
		if(e.type === 'KEY_UP' || e.type === 'KEY_LEFT'){
			e.target = this.getTargetToFocus(nSelectedRadioIndex-1);
			this._handleEvents(e);
		}else if(e.type === 'KEY_DOWN' || e.type === 'KEY_RIGHT'){
			e.target = this.getTargetToFocus(nSelectedRadioIndex+1);
			this._handleEvents(e);
		}else if(e.type === 'KEY_SPACE' && !this.oSelectedTarget){
			e.target = this.aTargetsList[0];
			this._handleEvents(e);
		}
	};

	TargetGroup.prototype.getTargetToFocus		= function(p_nSelectedRadioIndex) {
		var nNumOfTargets	= this.aTargetsList.length;
		//Logger.logDebug("TargetGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Targets = '+nNumOfTargets);
		if(p_nSelectedRadioIndex === nNumOfTargets){// ** Last Target, so select First
			oTarget	= this.aTargetsList[0];
		}else if(p_nSelectedRadioIndex < 0){// ** First Target, so select last one
			oTarget	= this.aTargetsList[nNumOfTargets-1];
		}else{
			oTarget	= this.aTargetsList[p_nSelectedRadioIndex];
		}
		return oTarget;
	};

	TargetGroup.prototype.updateSelection		= function(p_nSelectedRadioIndex) {
		var nNumOfTargets	= this.aTargetsList.length;
		//Logger.logDebug("TargetGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Targets = '+nNumOfTargets);
		if(p_nSelectedRadioIndex === nNumOfTargets){
			oTarget	= this.aTargetsList[0];
		}else if(p_nSelectedRadioIndex < 0){
			oTarget	= this.aTargetsList[nNumOfTargets-1];
		}else{
			oTarget	= this.aTargetsList[p_nSelectedRadioIndex];
		}
		oTarget.selected(true);
	};

	TargetGroup.prototype.getSelectedTarget		= function(){
		//Logger.logDebug('TargetGroup.getSelectedTarget() | '+this.toString());
		return this.oSelectedTarget;
	};
	TargetGroup.prototype.getTargetsList		= function(){
		return this.aTargetsList;
	};
	TargetGroup.prototype.destroy				= function(){
		this.oSelectedTarget = null;
		var i,
			nNumOfOptns	= this.aTargetsList.length;
		for(i=0; i<nNumOfOptns; i++){
			var oTarget	= this.aTargetsList[i];
			oTarget.enable(false);
			// oTarget.removeEventListener('DRAG_START', this.handleEvents);
			// oTarget.removeEventListener('DRAG_STOP', this.handleEvents);
			// oTarget.removeEventListener('KEY_UP', this.handleKeyboardEvents);
			// oTarget.removeEventListener('KEY_DOWN', this.handleKeyboardEvents);
			// oTarget.removeEventListener('KEY_LEFT', this.handleKeyboardEvents);
			// oTarget.removeEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			oTarget.destroy();
		}
		
		this.aTargetsList		= null;
		this.oSelectedTarget	= null;
		EventDispatcher.prototype.destroy.call(this);
		this.prototype			= null;
		
	};
	TargetGroup.prototype.toString				= function(){
		return 'framework/activity/TargetGroup';
	};

	return TargetGroup;
});
