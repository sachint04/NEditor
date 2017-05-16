	'use strict';
	/**
	 * CourseController Module controls Course navigation
	 * 
	 * @exports framework/viewcontroller/UIManager
	 * 
	 *  
	 */
define([
	'require',
	'jquery',
	'x2js',
    'swipe',
	'framework/utils/EventDispatcher',
    'framework/controller/CourseController',
    'framework/model/CourseConfigModel',
	'framework/core/AudioManager',
	'framework/core/PopupManager',
	'framework/utils/ResourceLoader',
    'framework/viewcontroller/uicomponent/AbstractUIComponent',
	'framework/utils/Logger'
], function(require, $, X2JS, swipe, EventDispatcher, CourseController, CourseConfig, AudioManager, PopupManager,  ResourceLoader, AbstractUIComponent, Logger) {

	var __instanceUIManager;
	
	/**
	 *@constructor 
	 *@alias  UIManager
	 */
	function UIManager(){
		//Logger.logDebug('UIManager.CONSTRUCTOR() | ');
		EventDispatcher.call(this);

		this.oUIModel;
		this.sViewState;
		this.$loader;
		this.$loaderOverlay;
        this.$navigation;
		this.$previousBtn;
		this.$nextBtn;
		this.$courseHelpBtn;
		this.$courseMenuBtn;
		this.$courseCloseBtn;
		this.$resourceArrow;
		this.$courseInfoBtn;
		this.$resourcesBtn;
        this.$glossaryBtn;
		this.$playBtn;
		this.$pauseBtn;
        this.$audioBtn;
		this.$transcriptBtn;
		this.$txt_pagination;
        this.$printBtn;
        this.$pdfBtn;
		
        this.$utilityBtn;
		
		this.oHelpData;
		this.oTranscriptPopup;
        this.oCourseController;
        this.oUIComponents				= {
			audiopanel		: 'framework/viewcontroller/uicomponent/AudioPanel',
			menubutton		: 'framework/viewcontroller/uicomponent/MenuButton',
			topiclabel		: 'framework/viewcontroller/uicomponent/TopicLabel'
        };
        this.nUIComponentCount			= 0;
		this.isAudioPlaying 			= false;
        this.onUIComponentLoaded		= this.onUIComponentLoaded.bind(this);
        this.handleUIComponentUpdates	= this.handleUIComponentUpdates.bind(this);
        this.popupEventHandler			= this.popupEventHandler.bind(this);
	}

	UIManager.prototype										= Object.create(EventDispatcher.prototype);
	UIManager.prototype.constructor							= UIManager;
    UIManager.prototype.init 								= function() {
        this.oCourseController = require('framework/controller/CourseController');
		this.preparePlayer();
		this.loadUI();
	};

	UIManager.prototype.preparePlayer 						= function(){
		//Logger.logDebug('UIManager.preparePlayer() | '+this);
		var viewStateChange 			= this.onViewStateChange.bind(this),
			orientationChange			= this.onOrientationChange.bind(this),
			showAudioControls			= this.showAudioControls.bind(this),
			updateAudioButtonState		= this.updateAudioButtonState.bind(this);

		$.subscribe('ORIENTATION_CHANGE', orientationChange);
		$.subscribe('VIEW_STATE_CHANGE', viewStateChange);

		// ** TODO: Do the implementation of the widgets through the UIConfig.xml
		var oScope = this;


        /*
		AudioManager.addEventListener('AUDIO_ADDED', showAudioControls);
		AudioManager.addEventListener('AUDIO_LIST_CLEARED', showAudioControls);
		AudioManager.addEventListener('AUDIO_PLAY', updateAudioButtonState);
		AudioManager.addEventListener('AUDIO_PAUSE', updateAudioButtonState);
		AudioManager.addEventListener('AUDIO_RESUME', updateAudioButtonState);
		AudioManager.addEventListener('AUDIO_STOPED', updateAudioButtonState);
		AudioManager.addEventListener('AUDIO_FINISH', updateAudioButtonState);
        AudioManager.addEventListener('AUDIO_VOULME_UPDATE', updateAudioButtonState);
        AudioManager.addEventListener('AUDIO_MUTE', updateAudioButtonState);
        AudioManager.addEventListener('AUDIO_UNMUTE', updateAudioButtonState);*/

		this.courseResumePopup		= this.showCourseResumePopup.bind(this);
	};

	UIManager.prototype.loadUI 								= function(){
		//Logger.logDebug('UIManager.loadUI() | '+this+' : '+CourseConfig.getRootPath());
		var sViewTopbandFilePath = CourseConfig.getRootPath() + CourseConfig.getConfig('ui_topband').view;
		var sViewBottombandFilePath = CourseConfig.getRootPath() + CourseConfig.getConfig('ui_bottomband').view;
		var sDataFilePath = CourseConfig.getRootPath() + CourseConfig.getConfig('ui').data;
		var oResourceLoader = new ResourceLoader();
		oResourceLoader.loadResource([sViewTopbandFilePath, sViewBottombandFilePath, sDataFilePath], this, this.onUILoaded);
	};

	UIManager.prototype.onUILoaded 							= function(p_oContext, p_aFiles, p_oResourceLoader){
		//Logger.logDebug('UIManager.onUILoaded() | ');
		/*var $ui = $('#ui');
		$ui.append(p_aFiles[0]);*/
        var oScope			= this,
        	domTopBand		= p_aFiles[0],
        	domBottomBand	= p_aFiles[1],
        	uiConfigXML		= p_aFiles[2],
        	$contentWrapper = $('#content_wrapper');



		$contentWrapper.prepend(domTopBand);
		$('#application').append(domBottomBand);

			this.oUIModel	= this.oUIModel || {};

		$(uiConfigXML).children().children().each(function(index, element){
			var nodeName = this.nodeName;
			//Logger.logDebug("\tNode Name = "+nodeName+' : No of items = '+$(this).children().length);
			if(nodeName === "items"){
				oScope.oUIModel['items'] = oScope.oUIModel['items'] || {};
				$(this).children().each(function(index, element){
					var sNodeName = this.nodeName,
						sId = this.getAttribute('id'),
						sClass = this.getAttribute('class'),
						sType = this.getAttribute('type'),
                        			sScript		= this.getAttribute('script'),
						sText = this.firstChild.nodeValue;
					//Logger.logDebug('\tNode Name = '+sNodeName+' : ID = '+sId+' : Class = '+sClass+' : Type = '+sType+' : Script = '+sScript);

					oScope.oUIModel['items'][sId] = oScope.oUIModel['items'][sId] || {};
					oScope.oUIModel['items'][sId]['itemNode'] = this;
					if(sScript !== undefined && sScript !== null && sScript !== ''){
						// Load the UIComponent Controller and pass the node
						oScope.nUIComponentCount++;
						var sUICompFilePath = oScope.oUIComponents[sScript] || sScript;
						oScope.createUIComponent(sUICompFilePath, $(this));
					}else{
					// var $elem = $contentWrapper.find('#'+sId);
					var $elem = $('#'+sId);
						//Logger.logDebug('\t\t'+sId+' = '+$elem.length+' ########## '+$elem.children().length);
					// TODO: Check to see if there are multiple items having SAME ID's in the XML or the UI HTML File
					if(sText != '' && $elem.children().length == 0){
						$elem.html(sText);
					}else if(sText != '' && $elem.children().length > 0){
						Logger.logWarn('UIManager.onUILoaded() | Replacing Child nodes with text for element having ID "'+sId+'"');
						$elem.html(sText);
					}
					if(sClass != '' && sClass.toUpperCase() != 'CLASS_OVERRIDE'){
						$elem.addClass(sClass);
					}
					if(sType === 'button'){
			                        $elem.attr({
			                        	'aria-role': 'button',
			                            'role': 'button',
			                            'aria-labelledby': sText,
			                            'aria-hidden': 'true'
			                        });
					}
					//Logger.logWarn('UIManager.onUILoaded() | Multiple elements with ID "'+sId+'" found in UI HTML.');

					oScope.oUIModel['items'][sId]['$elem']		= $elem;
					}
				});
			}else if(nodeName === "viewtypes"){
				oScope.oUIModel['viewtypes'] = oScope.oUIModel['viewtypes'] || {};
				$(this).children().each(function(index, element){
                    var sNodeName	= this.nodeName,
                    	sId			= this.getAttribute('id');
					//Logger.logDebug('\tView Type | Node Name = '+sNodeName+' : ID = '+sId);
					oScope.oUIModel['viewtypes'][sId] = this;
				});
			}else{
				Logger.logError('UIManager.onUILoaded() | Unrecognised Node "'+nodeName+'" found in UI Config XML.');
			}
		});

		//createModel(uiConfigXML.childNodes[0], oUIModel);
		//Logger.logDebug(JSON.stringify(oUIModel));

		/* Attach events to UI Buttons */
		this._attachUIEvents();

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
		//$.publish("UI_CREATED");
        //this.dispatchEvent('UI_CREATED');
        this.checkAndDispatchUICreatedEvent();

		// ** Testing: View State Change
		//onViewStateChange('1');
		//For Resource Contaier Collapse and Expand
	};
    
    UIManager.prototype.createUIComponent					= function(p_jsFilePath, p_$xmlComponent) {
    	//Logger.logDebug('UIManager.createUIComponent() | '+p_jsFilePath+' : '+p_$xmlComponent[0]);
        var oScope = this;

        require([
            p_jsFilePath
        ], function(UIComponent) {
            oScope.initUIComponent(UIComponent, p_$xmlComponent);
        });
    };
    
    UIManager.prototype.initUIComponent						= function(p_oUIComponent, p_$xmlComponent, p_oCompConfig){
		//Logger.logDebug('UIManager.initUIComponent() | ');
		var oCompConfig = (p_oCompConfig) ? p_oCompConfig : {};
        $.each(p_$xmlComponent.get(0).attributes, function(i, attrib) {
            var name	= attrib.name,
				value	= attrib.value;
            oCompConfig[name] = value;
        });
        oCompConfig.text = p_$xmlComponent.text() || '';
        //Logger.logDebug('UIManager.initUIComponent() | '+JSON.stringify(oCompConfig));

		var UIComponent						= p_oUIComponent,
			sComponentID					= p_$xmlComponent.attr('id'),
			oUIComponent					= new UIComponent();

		this.oUIModel.items = this.oUIModel.items || {};
		this.oUIModel.items[sComponentID]['$elem']	= oUIComponent;
		//Logger.logDebug('UIManager.initUIComponent() | Component ID = "'+sComponentID+'" Comp Obj = '+ this.oUIModel.items[sComponentID]['$elem'].toString());

        oUIComponent.addEventListener('UPDATE', this.handleUIComponentUpdates);
        oUIComponent.addEventListener('UICOMPONENT_LOADED', this.onUIComponentLoaded);

		oUIComponent.init(sComponentID, oCompConfig, p_$xmlComponent);
    };
    
    UIManager.prototype.onUIComponentLoaded					= function(e){
		//Logger.logDebug('UIManager.onUIComponentLoaded() | Type = '+e.type+' : '+e.target);
		this.nUIComponentCount--;
		this.checkAndDispatchUICreatedEvent();
    };
    
    UIManager.prototype.checkAndDispatchUICreatedEvent 		= function() {
        //Logger.logDebug('UIManager.checkAndDispatchUICreatedEvent() | '+this.haveAllUIComponentsLoaded());
        if (this.haveAllUIComponentsLoaded()) {this.dispatchEvent('UI_CREATED');}
        return false;
    };
    
    UIManager.prototype.haveAllUIComponentsLoaded 			= function() {
        //Logger.logDebug('UIManager.haveAllActivitiesLoaded() | ');
        if (this.nUIComponentCount === 0) {
            return true;
        }
        return false;
    };
    
    UIManager.prototype.handleUIComponentUpdates			= function(e){
		//Logger.logDebug('UIManager.handleUIComponentUpdates() | Type = '+e.type+' : '+e.target);
		/*
		 * Change the "target" of the Event Object to UIManager.
		 * Note: We are not changing the "currentTarget" property here. A developer can still access the Actual UIComponent which dispatched this event
		 */
		var oEventObj = {target:this};
		oEventObj = $.extend({}, e, oEventObj);
		this.dispatchEvent(e.type, oEventObj);
    };
    
    /**
     * Returns global (shell) UI component model. All global UI components are defined in "ui_config.xml". 
     * Value of "script" attribute is the reference to the JS module linked with UI componetn i.e. help, resources 
     * @param {String} p_sUIComponentID  component ID
     * @returns {Object} JS module 
     */
    UIManager.prototype._getUIComponentDataStoreByID		= function(p_sUIComponentID){
    	var oUIComponentDS = this.oUIModel.items[p_sUIComponentID];
    	if(oUIComponentDS === undefined){
    		Logger.logWarn('UIManager._getUIComponentDataStoreByID() | WARN: UI Conponent with ID "'+p_sUIComponentID+'" not found');
    		return null;
    	}
    	return oUIComponentDS;
    };
    
    /**
     * Return global ui component view (jQuery object)
     * @param {String} p_sUIComponentID  component ID
     * @returns {jQuery} jQuery element 
     */
    UIManager.prototype._getUIComponentByID					= function(p_sUIComponentID){
    	return this._getUIComponentDataStoreByID(p_sUIComponentID).$elem;
    };
    
    /**
     * Returns "ui_config.xml" item node (JSON)
     * @param {String} p_sUIComponentID  component ID
     * @return {Object} 
     */
    UIManager.prototype._getUIComponentConfigNodeByID		= function(p_sUIComponentID){
    	return this._getUIComponentDataStoreByID(p_sUIComponentID).itemNode;
    };
    
    /**
     * Returns "viewtype" node from "ui_config.xml"
     * @param {String} p_sViewTypeID "viewtype" node id
     * @returns {Object}
     */
    UIManager.prototype._getViewTypeConfigNodeByID			= function(p_sViewTypeID){
    	var oViewTypeDS = this.oUIModel.viewtypes[p_sViewTypeID];
    	if(oViewTypeDS === undefined){
    		Logger.logWarn('UIManager._getUIComponentByID() | WARN: UI Conponent with ID "'+p_sViewTypeID+'" not found');
    		return null;
    	}
    	return oViewTypeDS;
    };
	
	UIManager.prototype.setContentScroll 					= function(p_bFlag){
		//Logger.logDebug('UIManager.setContentScroll() | ');
		var scroll = (p_bFlag) ? 'auto' : 'hidden';
		$('#content_wrapper > #content').css('overflow-y', scroll);
	};

	UIManager.prototype._attachUIEvents 					= function(){
		//Logger.logDebug('UIManager.attachEvents() | ');
		var oScope				= this;
        this.$navigation 		= $('#navigation');
		this.$previousBtn		= $('#btn_previous');
		this.$nextBtn			= $('#btn_next');
		this.$courseHomeBtn		= $('#btn_home');
		this.$courseMenuBtn		= $('#btn_menu');
		this.$courseHelpBtn		= $('#btn_help');
		this.$courseCloseBtn	= $('#btn_course_close');
		this.$resourcesBtn      = $('#btn_resources');
        this.$glossaryBtn 		= $('#btn_course_glossary');
		this.$audioPanel		= $('.ui-audio-panel');
		this.$playBtn			= $('#btn_play');
		this.$pauseBtn			= $('#btn_pause');
        this.$audioBtn 			= $('.ui-audio-btn');
		this.$transcriptBtn		= $('#btn_transcript');
		this.$txt_pagination	= $('#txt_pagination');
		this.$loader			= $('#loader');
		this.$loaderOverlay		= $('.overlay');
		this.$printBtn			= $('#btn_print');
		
		if(!isMobile){
			/*$(document).on('mouseover focusin',
             '.ui-prev-btn, .ui-next-btn, .ui-help-btn, .ui-close-btn, .ui-play-btn, .ui-pause-btn, .ui-transcript-btn, .tis-btn',
							function(e){
								$(this).addClass('hover');
							});
			$(document).on('mouseout focusout',
             '.ui-prev-btn, .ui-next-btn, .ui-help-btn, .ui-close-btn, .ui-play-btn, .ui-pause-btn, .ui-transcript-btn, .tis-btn',
							function(e){
								$(this).removeClass('hover');
							});*/
			$(document).on('mouseover focusin',
                    '.tis-btn',
							function(e){
								var $this	= $(this);
								if(!$this.hasClass('inactive') && !$this.hasClass('disabled')){
									$this.addClass('hover');
								}
							});
            $(document).on('mouseout focusout mouseleave',
                    '.tis-btn',
							function(e){
								$(this).removeClass('hover');
							});

		}

		this.$previousBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, 'PREVIOUS_CLICK')){
				oScope.closeAllPopups();
			}
		});

		this.$nextBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, 'NEXT_CLICK')){
				oScope.closeAllPopups();
			}
		});
   
		this.$courseMenuBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, 'MENU_CLICK')){
                oScope.oCourseController.jumpToPage(CourseConfig.getConfig('menu').guid);
			}
		});
  
		this.$courseHomeBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, 'HOME_CLICK')){
			    oScope.oCourseController.jumpToPage('cw01~splash');
			}
		});
		this.$courseHelpBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, 'HELP_CLICK')){
				oScope.openHelpPopup();
			}
		});

		this.$courseCloseBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, null)){
				oScope.exitCourse();
			}
		});
		
	
		this.$resourcesBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, null)){
                //oScope.openResourcePopup();
            }
		});
        this.$glossaryBtn.on('click', function(e) {
           if (oScope.handleUIEvents(e, this, null)) {
              oScope.openGlossaryPopup();
           }
        });
	
        this.$printBtn.on('click', function(e) {
            if (oScope.handleUIEvents(e, this, null)) {
	            window.print();
           }
        });
		

		//this.updateTranscriptButtonState	= this.updateTranscriptButtonState.bind(this);
		//AudioManager.addEventListener('AUDIO_PLAY', this.updateTranscriptButtonState);
		//AudioManager.addEventListener('AUDIO_FINISH', this.updateTranscriptButtonState);
		//AudioManager.addEventListener('AUDIO_LIST_CLEARED', this.updateTranscriptButtonState);
        this.enable(this.$transcriptBtn, true);
		this.$transcriptBtn.on('click', function(e){
			if(oScope.handleUIEvents(e, this, null)){
				oScope.openTranscript(e);
			}
		});
	};

	UIManager.prototype.handleUIEvents						= function(p_oEvent, p_domBtn, p_sEventToDispatch){
		p_oEvent.preventDefault();
		p_domBtn.blur();
		 $("#utilityBtnHolder").removeClass('open').addClass('close');
	
		if(!$(p_domBtn).hasClass('inactive') && !$(p_domBtn).hasClass('disabled')){
            if (p_sEventToDispatch) {
                this.dispatchEvent(p_sEventToDispatch, {type: p_sEventToDispatch, target: this});
            }
			return true;
		}
		
		return false;
	};

	/**
	 * 	Show Resume/Restart Popup. 
	 */ 
	UIManager.prototype.showCourseResumePopup				= function(e){
        var oResumePopup = PopupManager.openPopup('resume', {txt_title: 'RESUME', txt_content: 'Do you wish to resume from the page you visited last in your previous session?'}, $('#content_wrapper > #content'));
		this.addPopupHandler(oResumePopup);
        this.showPreloader(false);
	};

	/**
	 * Updates Course title (#txt_coursetitle) in top band. This is called from {@link CourseController} once per page load.
	 * @param {String} p_sTitle 
	 */
	UIManager.prototype.updateCourseTitle 					= function(p_sTitle) {
		if($("#txt_coursetitle").length > 0){
			$("#txt_coursetitle").html(p_sTitle);
		}else{
			Logger.logWarn('UIManager : updateCourseTitle() Warning : "txt_coursetitle" element not found.');
		}
	};
	
	/**
	 * Updates Topic title (#txt_topictitle) in top band. This is called from {@link CourseController} once per page load.
	 * @param {String} p_sTitle 
	 */
	UIManager.prototype.updateTopicTitle 					= function(p_sTitle) {
		if($("#txt_topictitle").length > 0){
			$("#txt_topictitle").html(p_sTitle);
		}else{
			Logger.logWarn('UIManager : updateTopicTitle() Warning : "txt_topictitle" element not found.');
		}
	};
	
	UIManager.prototype.updateTranscriptButtonState			= function(e){
		if(e.type === 'AUDIO_FINISH' || e.type === 'AUDIO_LIST_CLEARED'){
			if(PopupManager.isOpen('transcript')){
				PopupManager.closePopup('transcript');
			}
			this.enable(this.$transcriptBtn, false);
		}else if(e.type === 'AUDIO_PLAY'){
			this.updateTranscriptData();
			if(!PopupManager.isOpen('transcript')){
				this.enable(this.$transcriptBtn, true);
			}
		}
	};

	UIManager.prototype.openTranscript						= function(e){
		if(AudioManager.getTranscript()){
			//Logger.logDebug('UIManager.openTranscript() | ');
			this.enable(this.$transcriptBtn, false);
			this.oTranscriptPopup	= PopupManager.openPopup('transcript', {txt_title:'TRANSCRIPT', txt_content:AudioManager.getTranscript()}, this.$transcriptBtn);
			this.addPopupHandler(this.oTranscriptPopup);
			//this.dispatchEvent('AUDIO_TRANSCRIPT_CLICK', {type:'AUDIO_TRANSCRIPT_CLICK', target:this});
		}
	};
	
	UIManager.prototype.updateTranscriptData				= function(){
		Logger.logDebug('UIManager.updateTranscriptData() | '+AudioManager.getTranscript()+' : '+PopupManager.isOpen('transcript'));
		if(AudioManager.getTranscript() && PopupManager.isOpen('transcript')){
			Logger.logDebug('UIManager.updateTranscriptData() | ');
			this.oTranscriptPopup.updateContent({txt_title:'TRANSCRIPT', txt_content:AudioManager.getTranscript()});
		}
	};

	UIManager.prototype.popupEventHandler					= function(e){
		var sEventType	= e.type,
			oPopup		= e.target,
			sPopupID	= oPopup.getID();
		//Logger.logDebug('UIManager.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

		if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE'){
			this.removePopupHandler(oPopup, sPopupID);
            if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            }

			if(sPopupID === 'transcript'){
				this.onTranscriptClose((e.eventSrc === 'btn_close'));
            }
            if (sPopupID === 'resources') {
                this.onResourceClose((e.eventSrc === 'btn_close'));
            }
            if (sPopupID === 'glossary') {
                this.onGlossaryClose((e.eventSrc === 'btn_close'));
            }
            if (sPopupID === 'course_info') {
                this.onCourseInfoClose((e.eventSrc === 'btn_close'));
            }else if(sPopupID === 'exit'){
				if(e.eventSrc === 'btn_yes'){
					this.onExitYes(true);
				}else if(e.eventSrc === 'btn_no'){
					this.onExitNo(true);
				}
			}else if(sPopupID === 'resume'){
				if(e.eventSrc === 'btn_yes'){
	                // for IOS device play dummy audio to activate autoplay functionality
	                AudioManager.playBlankAudio();
					this.onCourseResume(true);
				}else if(e.eventSrc === 'btn_no'){
					this.onCourseRestart(true);
				}
			}
            if(this.isAudioPlaying){
            	AudioManager.playAudio();
            	this.isAudioPlaying = false;
		}
        }
	};

	UIManager.prototype.removePopupHandler					= function(p_oPopup, p_sPopupID){
		p_oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
	};
	
	UIManager.prototype.addPopupHandler						= function(p_oPopup){
    	Logger.logDebug("UIManager.addPopupHandler() | "+p_oPopup);
		p_oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
	};

	/**
	* Open Help in a popup
	*  	
	*/
	UIManager.prototype.openHelpPopup						= function(){
		if(!this.oHelpData){
			var sHelpGUID		= CourseConfig.getConfig('help_xml').guid,
				sHelpFileURL	= CourseConfig.getRootPath() + CourseConfig.getConfig('help_xml').fileURL;
			//Logger.logDebug("UIManager.openHelpPopup() | sHelpGUID = "+sHelpGUID+' : sHelpFileURL = '+sHelpFileURL);
			if(sHelpGUID !== undefined && sHelpGUID !== null && sHelpGUID !== ''){
				this.oHelpData	= {txt_title:'Help Under Development' , txt_content:this.oCourseController.getPageModelByGUID(sHelpGUID)};
			}else{
				this.loadData(sHelpFileURL, 'oHelpData', this, this.openHelpPopup);
			}

		}
		// TODO: The audio should pause whenever a MODAL pop-up is opened. Ideally the line below needs to be written in "PopupManager" class
		//this.pauseAudio();
		var oHelpPopup	= PopupManager.openPopup('help', this.oHelpData, this.$courseHelpBtn, 'help-popup');
		this.addPopupHandler(oHelpPopup);
	};

	UIManager.prototype.loadData							= function(p_sFileURL, p_sDSName, p_oContext, p_fnCallback){
		//Logger.logDebug("UIManager.loadData() | File URL = "+p_sFileURL+' : DS Name = '+p_sDSName);
		var rl1 = new ResourceLoader();
		rl1.loadResource(p_sFileURL, this, this.sanitizeData, [p_oContext, p_fnCallback, p_sDSName]);
	};

	UIManager.prototype.sanitizeData						= function(p_oScope, p_aFiles, p_oResourceLoader, p_oContext, p_fnCallback, p_sDSName){
		var oX2JS			= new X2JS(),
			jsonHelpData	= oX2JS.xml2json(p_aFiles[0]),
			aDataPointer	= jsonHelpData.data.pageText;
		//Logger.logDebug('UIManager.sanitizeData() | JSON Help Data = '+JSON.stringify(jsonHelpData));

		//this.oHelpData		= {};
		this[p_sDSName]			= {};

		for(var i=0; i<aDataPointer.length; i++){
			var txtID			= aDataPointer[i]._id,
				txtContent		= aDataPointer[i].__cdata;

			//this.oHelpData[txtID]	= txtContent;
			this[p_sDSName][txtID]	= txtContent;
		}

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;

		p_fnCallback.apply(p_oContext);
	};

	/**
	* Exit the course Window
	*/
	UIManager.prototype.exitCourse							= function(){
        var oExitPopup = PopupManager.openPopup('exit', {txt_title: 'EXIT', txt_content: CourseConfig.getConfig('exit').message}, this.$courseCloseBtn);
		this.addPopupHandler(oExitPopup);
	};

	UIManager.prototype.expandResourcePanel					= function(){
			var oScope						= this,
			$resourceContainer			= this.$resourceArrow.parent(),
			nResourceContainerWidth		= $resourceContainer.width(),
			nResourceArrowWidth			= this.$resourceArrow.width();

		if($resourceContainer.hasClass('out')){
			$resourceContainer.animate({
				right	: (nResourceContainerWidth - nResourceArrowWidth)
			}, 500, function(e){
				$resourceContainer.removeClass('out').addClass('in');
				oScope.$resourceArrow.removeClass('collapsed').addClass('expand');
				$('.resource-arrow').attr("title", "Collapse");


			});
		}else{
			$resourceContainer.animate({
				right	: 0
			}, 500, function(e){
				$resourceContainer.removeClass('in').addClass('out');
				oScope.$resourceArrow.removeClass('expand').addClass('collapsed ');
				$('.resource-arrow').attr("title", "Expand");

			});
		}
	};

	UIManager.prototype.openCourseInfoPopup					= function(){
		//Logger.logDebug("UIManager.openCourseInfoPopup()");
        	this.enable(this.$courseInfoBtn, false);
		//var oCourseInfoPageModel    = this.oCourseController.getPageModelByGUID('cw01~reso'),
		var oCourseInfoPageModel    = 'Course Info Under Construction',
            oCourseInfoPopup		= PopupManager.openPopup('course_info', {txt_title:'COURSE INFO', txt_content:oCourseInfoPageModel}, this.$courseInfoBtn);
		this.addPopupHandler(oCourseInfoPopup);
	};

	UIManager.prototype.onCourseInfoClose    				= function(){
		Logger.logDebug("UIManager.onCourseInfoClose()");
		this.enable(this.$courseInfoBtn, true);
		this.dispatchEvent('COURSE_INFO_CLOSE', {type:'COURSE_INFO_CLOSE', target:this});
	};

	/**
	 * Open Resources in a Popup 
	 */
	UIManager.prototype.openResourcePopup					= function(){
        this.enable(this.$resourcesBtn, false);
	// TODO: The audio should pause whenever a MODAL pop-up is opened. Ideally the line below needs to be written in "PopupManager" class
        //this.pauseAudio();
		var oResourcePageModel    = this.oCourseController.getPageModelByGUID('cw01~reso'),
            oResourcePopup	= PopupManager.openPopup('resources', {txt_title:'RESOURCES', txt_content:oResourcePageModel}, this.$resourcesBtn);
		this.addPopupHandler(oResourcePopup);
	};
  	
  	/**
	 * Open Glossary in a Popup 
	 */
    UIManager.prototype.openGlossaryPopup 					= function() {
		Logger.logDebug("UIManager.openGlossaryPopup() | ");
        //this.enable(this.$glossaryBtn, false);
        this.pauseAudio();
        var oPage =  this.oCourseController.getPageModelByGUID('cw01~glossary');
        var oGlossaryPopup		= PopupManager.openPopup('glossary', {txt_title: '', txt_content:oPage}, this.$glossaryBtn);
        this.addPopupHandler(oGlossaryPopup);
    };
	
	var openUtilityValue = 0;
  
  	/**
	 * Open Utility panel  ("#utilityBtnHolder").
	 */
    UIManager.prototype.openUtility 						= function() {
		Logger.logDebug("UIManager.openUtility() | ");
		if($("#utilityBtnHolder").hasClass('open')){
			$("#utilityBtnHolder").switchClass('open', 'close', function(){
				$("#utilityOpener").removeClass('open');				
			});
			
		}else if($("#utilityBtnHolder").hasClass('close')){
			$("#utilityBtnHolder").switchClass('close', 'open', function(){
				$("#utilityOpener").addClass('open');								
			});
		}
    };
	
	 /**
	 * Close Utility panel  ("#utilityBtnHolder").
	 */
	UIManager.prototype.closeUtility 						= function() {
		if($("#utilityBtnHolder").hasClass('close'))return;
		$("#utilityBtnHolder").switchClass('open', 'close');
		
    };
	
	 /**
	 * Open Resources PDF (defined in "course_config.xml") new window.
	 */
	UIManager.prototype.launchPDF 							= function() {
		var path = this.oCourseController.getResourceItem('pdf')._value;
		window.open(path,'_blank',  'width=1000,height=600');
	};
	
	/**
	 * Resource Popup close event - dispatches event 'RESOURCE_CLOSE'
	 */
	UIManager.prototype.onResourceClose    					= function(){
		this.enable(this.$resourcesBtn, true);
		this.dispatchEvent('RESOURCE_CLOSE', {type:'RESOURCE_CLOSE', target:this});
	};
    
    /**
	 * Glossary Popup close event - dispatches event 'GLOSSARY_CLOSE'
	 */
    UIManager.prototype.onGlossaryClose 					= function() {
//Logger.logDebug("UIManager.onResourceClose()");
        this.enable(this.$glossaryBtn, true);
        this.dispatchEvent('GLOSSARY_CLOSE', {type: 'GLOSSARY_CLOSE', target: this});
    };
	
	/**
	 * Audio Transcript Popup close event - dispatches event 'TRANSCRIPT_CLOSE'
	 */
	UIManager.prototype.onTranscriptClose					= function(){
		
		this.oTranscriptPopup	= undefined;
		this.enable(this.$transcriptBtn, true);
		this.dispatchEvent('TRANSCRIPT_CLOSE', {type:'TRANSCRIPT_CLOSE', target:this});
	};

	/**
	 * Exit popup "Yes" button click event - dispatches event 'EXIT_COURSE'
	 */
	UIManager.prototype.onExitYes							= function(p_bBtnClicked){
		//Logger.logDebug("UIManager.onExitYes()");
        if (p_bBtnClicked) {
            this.dispatchEvent('EXIT_COURSE', {type: 'EXIT_COURSE', target: this});
        }
	};

	/**
	 * Exit popup "No" button click event - dispatches event 'EXIT_CLOSE'
	 */
	UIManager.prototype.onExitNo							= function(p_bBtnClicked){
		//Logger.logDebug("UIManager.onExitNo() | ");
        if (p_bBtnClicked) {
            this.dispatchEvent('EXIT_CLOSE', {type: 'EXIT_CLOSE', target: this});
        };
	};

	/**
	 * Course "Resume/Restart" confirmation popup "Resume" button click event - dispatches event 'RESUME_COURSE' 
	 */
	UIManager.prototype.onCourseResume 						= function(p_bBtnClicked){
        if (p_bBtnClicked) {
            this.dispatchEvent('RESUME_COURSE', {type: 'RESUME_COURSE', target: this});
        };
	};

	/**
	 * Course "Resume/Restart" confirmation popup "Restart" button click event - dispatches event 'RESTART_COURSE' 
	 */
	UIManager.prototype.onCourseRestart 					= function(p_bBtnClicked){
		//Logger.logDebug("UIManager.onCourseRestart() | ");
        if (p_bBtnClicked) {
            this.dispatchEvent('RESTART_COURSE', {type: 'RESTART_COURSE', target: this});
        };
	};
	
	
	UIManager.prototype.closeAllPopups 						= function(){
		PopupManager.closeAll();
	};

	UIManager.prototype.enable								= function(p_$btn, p_bEnable){
		if(p_bEnable){
			p_$btn.removeClass('disabled').removeAttr('aria-disabled');
		}else{
			p_$btn.addClass('disabled').attr('aria-disabled', 'true');
		}
	};

	/**
	 * Update page counter on global navigation UI. This functioned called every page load
	 */
	UIManager.prototype.updatePageNumber					= function(){
        var oPageNumInfo		= this.oCourseController.getPageNumbers();
        if(oPageNumInfo){
	        var aPages 				= oPageNumInfo.aPageId.slice(0);
	        var nTotalPages			= 0;
	        var nCurrentPageIndex 	= 0;
	        var i, oPage;  
	        if(oPageNumInfo.aPageId){
		       for (i=0; i < aPages.length; i++) {
				 	oPage = this.oCourseController.getPageModelByGUID(aPages[i]);
				 	if(oPage.bIgnorePagination){
			        	aPages.splice(i,1);
			        	i--;
				 	}
			   };
		        for (var i=0; i < aPages.length; i++) {
				 	oPage = this.oCourseController.getPageModelByGUID(aPages[i]);
			        if(oPage.getGUID() === this.oCourseController.getCurrentPage().getGUID()){
			        	nCurrentPageIndex = (i + 1);
			        }
				};
		       
		        if (CourseConfig.getConfig('page_number_display_format').value == "number") {
		            this.setPageNumber("Page " + nCurrentPageIndex + "-" + aPages.length);
		        }
		        else {
		            var i = 0,
		                    html = "";
		            while (i <  aPages.length) {
		                if (nCurrentPageIndex == i + 1)
		                    html += "<a class='pagination visit'></a>";
		                else
		                    html += "<a class='pagination'></a>";
		                i++;
		            }
		            this.setPageNumber(html);
		        }
		        $("li.menu-item").removeClass("visited");
		        $("li.menu-item[data-jumpid='"+this.oCourseController.getCurrentPage(). sGUID+"']").addClass("visited");
	       };
        };
	};
	
	/**
	 * Set page number explicitly on global navigation UI 
	 */
	UIManager.prototype.setPageNumber      					= function(p_sText){
        this.$txt_pagination.html(p_sText);
	};

	UIManager.prototype.onViewStateChange 					= function(p_sViewType){
        var sCurrentPageViewType = this.oCourseController.getCurrentViewType();
		if(sCurrentPageViewType !== this.sViewState){
			this.hideUIElements();
			this.sViewState = sCurrentPageViewType;
			this.showUIElements(this.sViewState);
		}
		this.updatePageNumber();
	};
    UIManager.prototype.swipe = function() {
    	/* TODO  swite creating issue with auto play audio. need to fix before beta*/
    	return;
        e = this.oCourseController;
        if (this.hasEventListener("NEXT_CLICK"))
        {
            if (!this.$navigation.hasClass("hide"))
            {

                $(document).swipe({right: function(e) {
                    }, left: function(e) {
                        if (e.isNextAvailable())
                            e.loadNextFile();
                    }, down: function() {
                        //alert("down")
                    }});
            }
        }
        if (this.hasEventListener("PREVIOUS_CLICK"))
        {
            if (!this.$navigation.hasClass("hide"))
            {
                $(document).swipe({right: function(e) {
                        if (e.isBackAvailable())
                            e.loadPrevFile();
                    }, left: function(e) {
                    }, down: function() {
                        //alert("down")
                    }});
            }
        }
    };
	UIManager.prototype.onOrientationChange					= function(e, p_oData){
		/*Logger.logDebug('UIManager.onOrientationChange() | '+p_oData.orientation);
		// landscape || portrait
		if(p_oData.orientation === 'portrait'){
			if(!PopupManager.isOpen('orientation_alert')){
				var oOrientationAlertPopup = PopupManager.openPopup('orientation_alert', {txt_title:'Alert', txt_content:'This course is best viewed in Landscape mode. Please view the course in Landscape mode.'}, $('#content_wrapper > #content'));
				var nLeft	= ($('#application').width() / 2) - (oOrientationAlertPopup.width() / 2),
					nTop	= ($('#application').height() / 2) - (oOrientationAlertPopup.height() / 2);
				//Logger.logDebug('UIManager.onOrientationChange() | nLeft = '+nLeft+' : nTop = '+nTop);
				oOrientationAlertPopup.setStyle({left:nLeft+'px', top:nTop+'px'});
				//this.addPopupHandler(oResumePopup);
			}
		}else{
			if(PopupManager.isOpen('orientation_alert')){
				PopupManager.closePopup('orientation_alert');
			}
		}*/
	};


	/**
	 * Show/Hide global UI element.
	 * @param {Boolean}  p_sViewType  "viewtype" node Id in 'ui_config.xml'
	 */
	UIManager.prototype.showUIElements 						= function(p_sViewType){
		//Logger.logDebug('UIManager.showUIElements() | ');
		var xnode_viewType	= this.oUIModel['viewtypes'][p_sViewType],
			oScope = this,
			$elem,
			sId,
			sClass;

        $(xnode_viewType).children().each(function(index, element) {
            sId = this.getAttribute('id');
            sClass = this.getAttribute('class');
			//Logger.logDebug('UIManager.showUIElements() | ID = '+sId+' : Class = "'+sClass+'"');
            var $elem = oScope._getUIComponentByID(sId);
			//var $elem = oScope.getElementByID(sId);
			/*if($elem instanceof AbstractUIComponent){
				// It's a AbstractUIComponent
			}else{
			}*/
			if($elem){
    			if($elem.hasClass('hide')){
    				$elem.removeClass('hide').attr('aria-hidden', 'false');
    			}
    			if(sClass != "" && !$elem.hasClass(sClass)){
    				$elem.addClass(sClass);
    				var sElementType = oScope._getUIComponentConfigNodeByID(sId).getAttribute('type');
    				if(sElementType === 'button'){
    					if($elem.hasClass('disabled')){
    						$elem.attr('aria-disabled', 'true');
    					}else{
    						$elem.removeAttr('aria-disabled');
    					}
    				}
    			}
			}
		});
	};
	
	/**
	 * Hide all global UI elements 
	 */
	UIManager.prototype.hideUIElements 						= function(){
		//Logger.logDebug('UIManager.hideUIElements() | ');
		for(var id in this.oUIModel['items']){
			Logger.logDebug('UIManager.hideUIElements() | ID = '+id+' : value = "'+this.oUIModel['items'][id]+'"');
			var xmlNode = this.oUIModel['items'][id]['itemNode'],
				$elem	= this.oUIModel['items'][id]['$elem'];
			/*if($elem instanceof AbstractUIComponent){
				// It's a AbstractUIComponent
			}else{
			}*/
			$elem.addClass('hide').attr('aria-hidden', 'true');
		}
	};

	/**
	 * Show Audio Controllers 
	 */
	UIManager.prototype.showAudioControls					= function(e){
		//Logger.logDebug('UIManager.showAudioControls() | Panel Hidden = '+this.$audioPanel.hasClass('hide')+' : Event Type = '+e.type);
		this.$audioPanel.stop();
		if(!this.$audioPanel.hasClass('in') && e.type == 'AUDIO_ADDED'){
			this.$audioPanel.removeClass('hide');
			this.$audioPanel.addClass('in');
			var nAudioPanelWidth	= this.$audioPanel.width();
			//Logger.logDebug('UIManager.showAudioControls() | SHOW = '+nAudioPanelWidth);
			if(this.$audioPanel.css('right') === 0){
				this.$audioPanel.css('right', -nAudioPanelWidth);
			}
			this.$audioPanel.fadeIn(5).animate({
					right:0
			  	},
			  	{
					queue: false,
					duration:600
					/*complete:function(e){
						//Logger.logDebug('UIManager.showAudioControls() | '+e);
						$content.fadeIn(500);
			 	}*/
			});
		}else if(this.$audioPanel.hasClass('in')){
			this.$audioPanel.removeClass('in');
			var nAudioPanelWidth	= this.$audioPanel.width();
			//Logger.logDebug('UIManager.showAudioControls() | HIDE = '+nAudioPanelWidth);
			this.$audioPanel.animate({
					right:-nAudioPanelWidth
			  	},
			  	{
					queue: true,
					duration:600,
					complete:function(){
						//Logger.logDebug('UIManager.showAudioControls() | Anim Complete :: '+$(this).attr('id'));
						//$(this).addClass('hide');
			 	}
			}).fadeOut(5);
		}
	};

	/**
	 * Enable/disable Audio controllers 
	 */
	UIManager.prototype.enableAudioControls					= function(p_bEnable){
		if(p_bEnable){
			this.$playBtn.removeClass('disabled');
			this.$pauseBtn.removeClass('disabled');
		}else{
			this.$playBtn.addClass('disabled');
			this.$pauseBtn.addClass('disabled');
		}
	};

	
	UIManager.prototype.updateAudioButtonState				= function(e){
		//Logger.logDebug('UIManager.updateAudioButtonState() | AM Playing = '+AudioManager.isPlaying()+' : AM Complete = '+AudioManager.isCompleted());
		if(AudioManager.isPlaying()){
			this.$playBtn.addClass('hide');
			this.$pauseBtn.removeClass('hide');
		}else{
			this.$playBtn.removeClass('hide');
			this.$pauseBtn.addClass('hide');
		}
	};

	UIManager.prototype.getElementByID						= function(p_sID, p_bIndexOf){
		var $elem;
		if(p_bIndexOf){
			$elem = $('#top_band').find('#[id*="'+p_sID+'"]') || $('#bottom_band').find('#[id*="'+p_sID+'"]');
		}else{
			var $topbandElem	= $('#top_band').find('#'+p_sID);
			var $bottombandElem	= $('#bottom_band').find('#'+p_sID);
			$elem =  ($topbandElem.length > 0) ? $topbandElem : $bottombandElem;
		}
		//Logger.logDebug('UIManager.getElementByID() | ID = '+p_sID+' : Selected Element Length = "'+$elem.length+'"');
		if($elem.length == 1){
			return $elem;
		}
		Logger.logError('UIManager.getElementByID() | Element with name "'+p_sID+'" not found in UI.');
	};

	/***************************************************************************************/
	/*************************** HANDLING BACK AND NEXT BUTTON *****************************/
	/***************************************************************************************/

	/**
	* Enable / Disable the back button.
	* @param (Boolean) 
	*/
	UIManager.prototype.enableBack 							= function(p_bEnable){
        if (p_bEnable && this.oCourseController.isBackAvailable()) {
			this.$previousBtn.removeClass('disabled').removeAttr('aria-disabled');
		}else{
			this.$previousBtn.addClass('disabled').attr('aria-disabled', 'true');
		}
	};

	/**
	* Enable / Disable the next button.
	* @param	(Boolean)
	*/
	UIManager.prototype.enableNext 							= function(p_bEnable){
        if (p_bEnable && this.oCourseController.isNextAvailable()) {
			this.$nextBtn.removeClass('disabled').removeAttr('aria-disabled');
		}else{
			this.$nextBtn.addClass('disabled').attr('aria-disabled', 'true');
		}
		//setCurrentPageStatus(2);
		//callJSFunction("updateBookmark", getNavigationBookMark(true));
	};
   
    UIManager.prototype.showUI 								= function(p_bShow) {
    	if(p_bShow){
	    	$('#top_band').removeClass('hide');
	    	$('#bottom_band').removeClass('hide');
    	}else{
	    	$('#top_band').addClass('hide');
	    	$('#bottom_band').addClass('hide');
    	}
    };
	
	/**
	 * Show 'Load progress' overlay screen
	 */
	UIManager.prototype.showPreloader 						= function(p_bShow){
		if(!this.$loader)return;
		if(p_bShow){
			this.$loader.removeClass('hide');
			this.$loaderOverlay.removeClass('hide');
			$('#content_wrapper').attr('aria-hidden', 'true');
		}else{
			this.$loader.addClass('hide');
			this.$loaderOverlay.addClass('hide');
			$('#content_wrapper').removeAttr('aria-hidden');
		}
	};

	UIManager.prototype.pauseAudio 							= function(){
		
	};
	/**
	 * Sachin Tumbre 912/18/2014
	 * Pagination feature activiated from framework instead of pages.
	 */
	UIManager.prototype.onPageLoaded						= function(){
		if(CourseConfig.getConfig("has_pagination").value.toLowerCase() == "true"){
			this.updatePageNumber();
		}
		Logger.logDebug('UIManager.prototype.onPageLoaded = '+ JSON.stringify(this.oCourseControllerRef.getCurrentPage()));
		try{
			$('#topic-title').html(this.oCourseControllerRef.getCurrentPage().sPageLabel);
		}catch(e){
			Logger.logWarn('no element found with ID  "topic-title"');
		}
	};


	UIManager.prototype.toString 							= function(){
		return 'framework/viewcontroller/UIManager';
	};

	if(!__instanceUIManager){
		__instanceUIManager = new UIManager();
	}

	/** Singletone implementation. Can be accessed from anywhere in the package. */
	return __instanceUIManager;
});
