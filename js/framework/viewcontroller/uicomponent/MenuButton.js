define([
    'jqueryui',
    'framework/viewcontroller/uicomponent/AbstractUIComponent',
    'framework/controller/CourseController',
    'framework/core/PopupManager',
    'framework/core/AudioManager',
    'framework/utils/Logger'
], function(jqueryui, AbstractUIComponent, CourseController, PopupManager, AudioManager, Logger) {
    function MenuButton() {
        //Logger.logDebug('MenuButton.CONSTRUCTOR() ');
        AbstractUIComponent.call(this);
        this.showMenuPopup 		= this.showMenuPopup.bind(this);
        this.popupEventHandler 	= this.popupEventHandler.bind(this);
        this.isAudioPlaying 	= false;
    }

    MenuButton.prototype									= Object.create(AbstractUIComponent.prototype);
    MenuButton.prototype.constructor						= MenuButton;

    MenuButton.prototype.getComponentConfig					= function() {
		//Logger.logDebug('MenuButton.getComponentConfig() | ');
		return {
			/*TODO: Implement any default configurations*/
		};
	};
    MenuButton.prototype.init								= function(p_sID, p_oConfig, p_$xmlComponent) {
      // Logger.logDebug('MenuButton.init() | p_sID = ' + p_sID + ' : p_oConfig = ' + JSON.stringify(p_oConfig)+' : p_$xmlComponent = '+p_$xmlComponent.attr('id'));
       
		AbstractUIComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };
    
    MenuButton.prototype.createComponent					= function(){
//    	Logger.logDebug('MenuButton.prototype.createComponent '+ this.$xmlData[0]);
		$('#btn_course_menu').on('click',this.showMenuPopup);
        this.dispatchUIComponentLoadedEvent();
	};
	
    MenuButton.prototype.showMenuPopup					= function(e){
    	e.preventDefault();
    	if($(e.target).hasClass('disabled'))return;
    	//Logger.logDebug('Menu Button | showMenuPopup () '+ this.$xmlData.attr('id'));
    	this.openPopup('menu','Menu',{'txt_title':'Menu','txt_content':CourseController.getPageModelByGUID('cw01~menu')}, this.$xmlData);
    }
    

    MenuButton.prototype.openPopup						= function(p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd, p_fCallback, p_aArgs) {
        Logger.logDebug('MenuButton.openPopup() | '+p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd);
        oPopup = PopupManager.openPopup(p_sPopupID, p_sContent, p_$returnFocusTo, p_sClassesToAdd);
        oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
        if (p_fCallback) {
            oPopup.setCallback(this, p_fCallback, p_aArgs);
        }
        this.pauseAudio();
        return oPopup;
    };
    MenuButton.prototype.closePopup					= function(p_sPopupID) {
        //Logger.logDebug('MenuButton.closePopup() | '+p_sPopupID);
        return true;
    };

    MenuButton.prototype.popupEventHandler				= function(e) {
        var sEventType = e.type,
            oPopup = e.target,
            sPopupID = oPopup.getID();
        //Logger.logDebug('MenuButton.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

        if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
            oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
            if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            }
            Logger.logDebug(' this.isAudioPlaying = '+ this.isAudioPlaying);
             if(this.isAudioPlaying){
            	AudioManager.playAudio();
            	this.isAudioPlaying = false;
            }
            $(window).focus();
        }
    };
	MenuButton.prototype.pauseAudio = function() {
    	this.isAudioPlaying = AudioManager.isPlaying(); 
    	if(this.isAudioPlaying){
        	AudioManager.pauseAudio();
        }
    }

	MenuButton.prototype.preventDefaults					= function(e){
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	};
    MenuButton.prototype.destroy							= function() {
		this.popupEventHandler	= null;
		this.prototype			= null;

		AbstractUIComponent.prototype.destroy.call(this);
    };
    MenuButton.prototype.toString							= function() {
		return 'framework/component/MenuButton';
	};

    return MenuButton;
});
