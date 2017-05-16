define([
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(EventDispatcher, Logger){

	// Dropdown(domOptn,  sOptnGrpID, nOptnScore, aOptionsList);
	function Dropdown (p_domOptn, p_sOptnGrpID,  p_aOptionsList) {
		//Logger.logDebug('Dropdown.CONSTRUCTOR() | DOM Dropdown '+p_domOptn+' : Group ID = '+p_sOptnGrpID+' Params = '+p_aOptionsList);
		EventDispatcher.call(this);
		this.$domOption				= p_domOptn;
		this.sOptnGrpID				= p_sOptnGrpID;
		this.aOptionsList			= p_aOptionsList;
		this.sSelectedOptionText;

		for(var i=0;i<this.aOptionsList.length;i++){
			var oOptn		= this.aOptionsList[i];
			//this.$domOption.append(new Option(oOptn.sOptnLblTxt, oOptn.sOptnID));
			this.$domOption.append("<option value='" + oOptn.sOptnID + "'>" + oOptn.sOptnLblTxt + "</option>");

			var $domOptn	= this.$domOption.children().eq(i);
			//Logger.logDebug('Dropdown.CONSTRUCTOR() | '+$domOptn.attr('value')+' : Text = '+oOptn.sOptnLblTxt);
			$domOptn.attr({
				'role'			: 'option'
			});
		}
		this.optionEventHandler	= this._handleEvents.bind(this);
		this.sSelectedOptionID	= null;
		this.enable(true);
	}

	Dropdown.prototype						= Object.create(EventDispatcher.prototype);
	Dropdown.prototype.constructor			= Dropdown;

	Dropdown.prototype._handleEvents			= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}

		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type;

		//Logger.logDebug('Dropdown._handleEvents() | this.$domOption.val()  = '+this.$domOption.val() );

		if(this.$domOption.val() > 0){
			this.sSelectedOptionID		= this.$domOption.val();
			this.sSelectedOptionText	= this.$domOption.text();
		}else{
			this.sSelectedOptionID = null;
		}

		//Logger.logDebug('DropdownGroup._handleEvents() | \n\tTarget = '+this.getSelectedOption);

		this.dispatchEvent('OPTION_SELECT', {type:'OPTION_SELECT', target:this});
	};

	Dropdown.prototype.enable					= function(p_bEnable){

		var oScope	= this;

		if(p_bEnable){
			//this.$domOption.removeClass('disabled');
			this.$domOption.attr({
				'disabled'		: false,
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
			if(!this.bEnabled){
				this.$domOption.on('change', function(e){
					oScope._handleEvents(e);
				});
			}
			this.bEnabled = true;
		}else{
			//this.$domOption.addClass('disabled');
			this.$domOption.attr({
				'disabled'		: true,
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
			if(this.bEnabled){
				this.$domOption.off();
				/*this.$domOption.off('change', function(e){
					optionEventHandler(e);
				});*/
			}
			this.bEnabled = false;
		}
	};


	Dropdown.prototype.reset				= function(){
		this.$domOption.val( '0' );
		this.enable(true);
		this.sSelectedOptionID = null;
	};

	Dropdown.prototype.getGroupID			= function(){
		return this.sOptnGrpID ;
	};
	Dropdown.prototype.getScore				= function(){
		try{
			var _score = this.aOptionsList[this.sSelectedOptionID].nOptnScore;			
		}catch(e){
			console.log(e);
		}
		return _score;
	};
	Dropdown.prototype.getSelectedOption		= function(){
		return this.sSelectedOptionID;
	};
	Dropdown.prototype.getSelectedOptionObj		= function(){
		var result;
		for (var i=0; i < this.aOptionsList.length; i++) {
		  var opt = this.aOptionsList[i];
		  if(opt._id === this.sSelectedOptionID){
		  	
		  	result = opt;
		  	break; 
		  }
		};
		return result;
	};
	Dropdown.prototype.getSelectedOptionText			= function(){
		return this.sSelectedOptionText;
	};

	Dropdown.prototype.getOptionsList		= function(){
		return this.aOptionsList;
	};
	Dropdown.prototype.showCorrectAnswer		= function(){
		for (var i=0; i <  this.aOptionsList.length; i++) {
		   if(this.aOptionsList[i].nOptnScore > 0){
				this.$domOption.val(this.aOptionsList[i].sOptnID);
			break;		   	
		   }
		};
	};
	Dropdown.prototype.showUserAnswer		= function(){
		this.$domOption.val(this.aOptionsList[this.sSelectedOptionID].sOptnID);
	};

	Dropdown.prototype.getParameters				= function(){
		var opt 	= this.getSelectedOptionObj().PARAMETER;
	};
	
	
	
	Dropdown.prototype.destroy				= function(){
		this.$domOption.off();

		this.$domOption			= null;
		this.sOptnGrpID			= null;
		this.aOptionsList		= null;
		this.sSelectedOptionID = null;
		this.sSelectedOptionText = null;
	};
	Dropdown.prototype.toString				= function(){
		return 'framework/activity/controller/ToggleGroup';
	};

	return Dropdown;
});

