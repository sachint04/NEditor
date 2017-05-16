define([
	'framework/component/ClickAndReveal',
	'framework/core/PopupManager',
	'framework/viewcontroller/Popup',
	'framework/utils/globals',
	'framework/utils/Logger'
], function(ClickAndReveal, PopupManager, Popup, Globals, Logger){
	function ClickSequence(){
		//Logger.logDebug('ClickSequence.CONSTRUCTOR() ');
		ClickAndReveal.call(this);
		this.aSeq;
		this.aStepVisited =[];
		this.nCount = -1;
		this.checkNextSequence 		= this.checkNextSequence.bind(this);
		this.checkInternalSteps 	= this.checkInternalSteps.bind(this);
		return this;
	}

	ClickSequence.prototype										= Object.create(ClickAndReveal.prototype);
	ClickSequence.prototype.constructor							= ClickSequence;

	// ClickSequence.prototype.init								= function(p_$domView, p_sClass, p_sPopupID, p_sComponentUID, p_$xmlComponent){
	ClickSequence.prototype.init								= function(p_sID, p_oConfig, sPopupConfigID, sComponentUID, p_$xmlComponent){
		ClickAndReveal.prototype.init.call(this, p_sID, p_oConfig, sPopupConfigID, sComponentUID, p_$xmlComponent);
	};

	ClickSequence.prototype.createComponent						= function(e){
		var oScope		= this,
			sClassName	= this.$xmlData.attr('class') || 'cnr-btn';
			this.aSeq 	= $('.seq');
			this.aSeq.addClass('hide');
		ClickAndReveal.prototype.createComponent.call(this, e);
		this.checkNextSequence();
	};

	ClickSequence.prototype.checkNextSequence					= function(){
		var oScope = this;
		
		
			
		
		this.nCount++;
		
		/* hide to be  expired element from previous sequence */
		this.$component.find('.seq .step').each(function(index, elem){
			var expireafter = $(elem).attr('data-expireafter');
			if(expireafter && parseInt(expireafter) === oScope.nCount){
				$(elem).addClass('hide');
			}	
			
		});
		
		if(this.aSeq.length > this.nCount){
			$(this.aSeq[this.nCount]).removeClass('hide').hide().fadeIn(500, function(){
				var $target = oScope.aSeq[oScope.nCount];
				oScope.checkInternalSteps($target);
			});
		}else{
			this.count = -1;
		}
	};

	ClickSequence.prototype.checkInternalSteps						= function(p_elem, p_fCallback){
		var oScope 	= this,
		p_$elem		= $(p_elem),
		aSteps		= p_$elem.find('.step'),
		stepcount	= aSteps.length, 
		cntstep 	= p_$elem.attr('data-cnt') || -1,
		nextStep	= (parseInt(cntstep) + 1);
		
		
		p_$elem.attr('data-cnt', nextStep);
		//console.log('nextStep '+ nextStep + ' | stepcount - '+ stepcount+'  has click - '+ p_$elem.find('.click').length);
		
		if(nextStep >= stepcount ){
			if(p_$elem.find('.click').length === 0){
				this.checkNextSequence();
			}
			return;
		};
		this.$component.find('.click.active').removeClass('active');
		p_$elem.find('.click').addClass('active');
		
		var $step 		= $(aSteps[nextStep]);
		// var isClickable = p_$elem.find('.click').length;
		var oConfig = this.getBlinkConfig();
		var hasBlinker 	= oScope.checkForBlinkers($step, function(p_bWasBlinker){
			//console.log('p_bWasBlinker - '+ p_bWasBlinker);
			var nDelay 	= (p_bWasBlinker)? oConfig.delay : 100;/* add deplay if  setp has blinker */
				setTimeout(function(){
					oScope.checkInternalSteps(p_$elem);					
				},nDelay );
		});
	};
	
	ClickSequence.prototype.checkForBlinkers						= function(p_$elem, p_fCallback, p_aArg){
		var oScope = this;
		if(!p_$elem.hasClass('blinker')){
			if(p_fCallback){
				if(p_aArg){
					p_aArg.push(true);
				}else{
					p_aArg = [true];
				}
				p_fCallback.apply(oScope, p_aArg);
			}
			return;
		}
		
		var aBlinker =	p_$elem;
		if(aBlinker.length){
			// for (var i=0; i < aBlinker.length; i++) {
			 	var $blinker 	= aBlinker;//$(aBlinker[i]),
			 	oConfig			= this.getBlinkConfig();
			 	//console.log('checkForBlinker - '+oConfig.nCount);
				Globals.blinker($blinker, oConfig.style1, oConfig.style2, oConfig.nCount, oConfig.nSpeed, null, function(){
					if(p_fCallback){
						if(p_aArg){
							p_aArg.push(true);
						}else{
							p_aArg = [true];
						}
						p_fCallback.apply(oScope, p_aArg);
					}
					
				}, oScope );
			// };
			return true;
		}
		
		return false;
	};
	
	ClickSequence.prototype.popupEventHandler					= function(e){
		var $target, popupID, btnID;
		if(e.target instanceof Popup){
			ClickAndReveal.prototype.popupEventHandler.call(this, e);
			btnID 		= e.elemToReturnFocus.attr('id');
		}else{
			$target 	= $(e.target);
			btnID 		= $target.attr('data-btn'); 	
			PopupManager.closePopup(e.popupID);
		}
		if(this.aStepVisited.indexOf(btnID) === -1){
			this.aStepVisited.push(btnID);
			var $popup = $(e.popupID);
			this.checkNextSequence();
			this.checkCompletionStatus();
		}
		this.$component.find('.click.active').removeClass('active');
		this.$component.find('.click.selected').removeClass('selected');
	};

	
	
	ClickSequence.prototype.getBlinkConfig								= function(){
		return{
				'style1' : 'blink-on',
	            'style2' : 'blink-off',
	            'nCount' : 10,
	            'nSpeed' : 150,
	            'delay'	 : 400
		};
		
	};
	
	ClickSequence.prototype.destroy								= function(){
		ClickAndReveal.prototype.destroy.call(this);
	};
	ClickSequence.prototype.toString							= function() {
		return 'framework/component/ClickSequence';
	};

	return ClickSequence;
});
