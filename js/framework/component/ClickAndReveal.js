/**
 * @Custom 'framework/components/AbstractComponent' 
 */
define([
	'framework/component/AbstractComponent',
	'framework/core/PopupManager',
	'framework/model/CourseModel',
	'framework/utils/globals',
	'framework/utils/Logger'
], function(AbstractComponent, PopupManager, CourseModel, Globals, Logger){
	
	/**
	 * 
	 * 
	 *@constructor
	 *@Component 
	 */
	function ClickAndReveal(){	
		//Logger.logDebug('ClickAndReveal.CONSTRUCTOR() ');
		AbstractComponent.call(this);
		this.popupID 			= 'popup_close';
		this.defaultTabIndex 	= null;	
		this.handleClickEvent	= this.handleClickEvent.bind(this);
		this.popupEventHandler	= this.popupEventHandler.bind(this);
		this.closeAllPopup		= this.closeAllPopup.bind(this);
		return this;
	}

	ClickAndReveal.prototype										= Object.create(AbstractComponent.prototype);
	ClickAndReveal.prototype.constructor							= ClickAndReveal;
	
	
	// ClickAndReveal.prototype.init									= function(p_$domView, p_sClass, p_sPopupID, p_sComponentUID, p_$xmlComponent){
	ClickAndReveal.prototype.init									= function(p_sID, p_oConfig, p_$xmlComponent){
		AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
	};


	ClickAndReveal.prototype.createComponent						= function(e){
		var oScope			= this,
			sClassName		= this.$xmlData.attr('class') || 'cnr-btn';
			this.defaultTabIndex	= this.$xmlData.attr('defaultTabIndex') || null;

		this.popupID  	=	this.$xmlData.attr('popupConfigID');
		var $btn 		= 	this.$component.find('.'+sClassName);	
		$btn.on('click', function(e){
			oScope.handleClickEvent(e);
		});
		
		/*this.addEventListener('SHOW_POPUP', function (p_oEvent) {
			$('#popup_close').find('.next-btn')
				.addClass('whatever')
				.off('click')
				.on('click', $._data($(p_oEvent.popupID).find('.next-btn').get(0), 'events').click[0].handler);
		});*/
			
		this.dispatchComponentLoadedEvent();
		if(this.defaultTabIndex && !isNaN(this.defaultTabIndex)){
			$btn.eq(parseInt(this.defaultTabIndex) ).trigger('click');
		}
	};

	ClickAndReveal.prototype.getComponentConfig						= function () {
        return {
           /* TODO: add configs params */
        };
    };
	ClickAndReveal.prototype.handleClickEvent						= function(e){
		e.preventDefault();
		var oScope = this;
		var $currentTarget 	= $(e.currentTarget),
			sPopupID 		= '#' + $currentTarget.attr('href'),
			sStyle			= $currentTarget.attr('data-style');
			if($currentTarget.hasClass('selected') || $currentTarget.hasClass('disabled') || $currentTarget.hasClass('inactive') )return;
			try{
				this.$component.find('.cnr-btn.selected').removeClass('selected');
				this.$component.find('.cnr-btn.active').removeClass('active');
			}catch(e){};
			
		
			
		if(this.popupID === ""){
			this.dispatchEvent('SHOW_POPUP_BEFORE', {type:'SHOW_POPUP_BEFORE', target:this, popupID:sPopupID});
			oScope.closeAllPopup();
			var $popup = $(sPopupID); 
			$popup.removeClass('hide').hide().fadeIn();
			var $btnClose = $(sPopupID).find('.btn-close').attr('data-popup', sPopupID);
			
			if($btnClose.length){
				$btnClose.attr('data-btn', $currentTarget.attr('id'));
				$btnClose.off().click(function(e){
					var id = $(e.target).attr('data-popup');
					$(id).addClass('hide');
					oScope.popupEventHandler({
												type: 'POPUP_CLOSE',
												target: $(this),
												popupID: id
											});
					$currentTarget.removeClass('selected');						
					
				});
			}
			var $act 	= $(sPopupID).find('.question');
			var sReset 	=  this.$xmlData.attr('reset') || false;
			if(sReset === "true"){
				if($act.length){
					$act.each(function(index, elem){
						var sQID	= elem.id;
						oScope.dispatchEvent('RESET_ACTIVITY', {type:'RESET_ACTIVITY', target:this, questionID:sQID});
					});
				}
			}
			
		}else{
			var c = $(sPopupID).html();
			if(Globals.isPageGUID(sPopupID.split('#')[1])){
				c = CourseModel.findPage(sPopupID.split('#')[1]);
			}
			this.dispatchEvent('SHOW_POPUP_BEFORE', {type:'SHOW_POPUP_BEFORE', target:this, popupID:sPopupID});
			PopupManager.closePopup(this.popupID);
			this.openPopup($currentTarget.text(), c, $currentTarget, sStyle);
		}
		
		this.dispatchEvent('SHOW_POPUP', {type:'SHOW_POPUP', target:this, popupID:sPopupID});
			$currentTarget.addClass('selected');
		this.addToVisited($currentTarget.attr('id'));
		this.checkCompletionStatus();
		
	};

	ClickAndReveal.prototype.openPopup								= function(p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd){
		//Logger.logDebug('PageAbstract.openPopup() | '+p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo);
		var sClass	= p_sClassesToAdd||"";
		try{
		oPopup	= PopupManager.openPopup(this.popupID, {txt_title:p_sTitle, txt_content:p_sContent}, p_$returnFocusTo, sClass);
		oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
		oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
		}catch(e){}
		return oPopup;
	};
	
	ClickAndReveal.prototype.popupEventHandler						= function(e){
		var sEventType	= e.type,
			oPopup		= e.target,
			sPopupID	= (oPopup.getID)? oPopup.getID() :e.popupID;

		if(oPopup.getID && (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') ){
			oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
			oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
			PopupManager.closePopup(sPopupID);
		}
		var btnID = this.$component.find('.cnr-btn.selected').attr('id');
		this.$component.find('.cnr-btn.selected').removeClass('selected');
		this.dispatchEvent('POPUP_CLOSE',{type:'POPUP_CLOSE', popup:oPopup, target:this, btnID:btnID});
	};

	ClickAndReveal.prototype.closeAllPopup					= function() {
		var oScope		= this,
		sClassName		= this.$xmlData.attr('class') || 'cnr-btn';
		this.popupID  	= this.$xmlData.attr('popupConfigID');
		var aBtn 		= this.$component.find('.'+sClassName);
		for (var i=0; i < aBtn.length; i++) {
			var $btn 	= $(aBtn[i]),
			popupID	= '#'+$btn.attr('href');
			$(popupID+'.click-popup').addClass('hide');
		};
			
	};
	
	ClickAndReveal.prototype.checkCompletionStatus					= function() {
		var sClassName	= this.$xmlData.attr('class') || 'cnr-btn';
		var aComponents = this.$component.find('.'+sClassName);

		if(!this.isComplete() && this.aVisited.length == aComponents.length){
			this.setCompleted();
		}
	};

	ClickAndReveal.prototype.reset								= function(){
		this.closeAllPopup();
		this.$component.find('.cnr-btn').removeClass('selected');
		
		if(this.defaultTabIndex){
			var $btn = this.$component.find('.cnr-btn');
			$btn.eq(this.defaultTabIndex).trigger('click');
		}
	};
	
	ClickAndReveal.prototype.destroy								= function(){
		if(PopupManager.isOpen(this.popupID)){
			PopupManager.closePopup(this.popupID);			
		}
		this.popupID 			= null;
		this.popupEventHandler	= null;

		this.prototype			= null;

		AbstractComponent.prototype.destroy.call(this);
	};

	ClickAndReveal.prototype.toString								= function() {
		return 'framework/component/ClickAndReveal';
	};

	return ClickAndReveal;
});
