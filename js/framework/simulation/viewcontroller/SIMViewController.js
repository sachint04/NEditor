define([
	'jquery',
	'framework/model/CourseConfigModel',
	'framework/model/CourseModel',
	'framework/simulation/viewcontroller/DecisionAbstract',
	'framework/viewcontroller/UIManager',
	'framework/core/PopupManager',
	'framework/utils/VariableManager',
	'framework/utils/ResourceLoader',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, CourseConfig, CourseModel, DecisionAbstract, UIManager, PopupManager, VariableManager, ResourceLoader, EventDispatcher, Globals, Logger){

	function SIMViewController(p_$domView) {
		//Logger.logDebug('SIMViewController.CONSTRUCTOR() | DOM = '+p_$domView);
		EventDispatcher.call(this);

		this.$domView = p_$domView;
		this.oTriggerTypes;

		this.$infoPanel;
		this.$informationBar;
		this.$informationPanel;

		this.$btnMaximize;
		this.$btnMinimize;
		this.$eventsPanel;
		this.$eventName;
		this.$whichDay;
		this.$dayTimerText;
		this.$dayTimerGraphic;
		this.$location;
		this.$decisionHolder;

		this.$btnAct;
		this.$btnDefer;
		this.$btnUnDefer;
		this.$btnDayCompleteContinue;
		this.$imgBigTriggerIcon;
		this.$btnItext;

		this.$btnEventsPanelToggle;

		this.sSelectedTriggerType; // ** Stores the reference of the trigger (email | call | meeting) that's curently visible'
		this.sActiveEventDecisionID;
		this.bPanelEventsShow;
		this.oEventPanelOpen;
		this.oEventPanelClose;

		this.oIncidentController;
		this.oDataStore					= {};
		this.aTriggerList				= [];

		this.aDecisionPageModels;
		this.sInfoPanelDayTitlePrefix	= 'Day ';

		this.oContext;
		this.fCallback;
		this.aArgs;

		this.bDayComplete			= false;
		this.handleEvents			= this.handleEvents.bind(this);
		this.onDecisionPageLoaded	= this.onDecisionPageLoaded.bind(this);
		this.onDecisionComplete		= this.onDecisionComplete.bind(this);
		this.popupEventHandler		= this.popupEventHandler.bind(this);
		this.onFeedbackScreenLoaded	= this.onFeedbackScreenLoaded.bind(this);
		this.onNextDayStart			= this.onNextDayStart.bind(this);
	}

	SIMViewController.prototype = Object.create(EventDispatcher.prototype);
	SIMViewController.prototype.constructor = SIMViewController;

	SIMViewController.prototype.parseTriggers						= function(p_xmlTriggersNode, p_oContext, p_fCallback, p_aArgs){
		this.oTriggerTypes = {};
		this.oContext = p_oContext;
		this.fCallback = p_fCallback;
		this.aArgs = p_aArgs || [];

		var oScope = this;
		//Logger.logDebug('SIMViewController.parseTriggers() | '+oScope.toString());
		$(p_xmlTriggersNode).children().each(function(index, element){
			//Logger.logDebug('SIMViewController.parseTriggers() | Scope = '+oScope.toString()+' : Node Name = '+element.nodeName+' : '+Globals.toXMLString(element));
			var sTriggerType			= element.getAttribute('type'),
				sTriggerLabel			= element.getAttribute('label'),
				sTriggerAudio			= element.getAttribute('audioID'),
				$trigger 				= oScope.getElementByID(sTriggerType),
				$triggerPanel			= oScope.getElementByID(sTriggerType+'_panel'),
				$triggerMsg				= $triggerPanel.find('a[id="trigger_"]').clone();
			//Logger.logDebug('\tTrigger Type = '+sTriggerType);

			oScope.addToTriggerTypes(sTriggerType);
			oScope.addAudioIDToTriggerTypes(sTriggerType, sTriggerAudio);

			if($triggerMsg.length > 0 && $triggerMsg.length === 1){
				oScope.addMsgSampleToTriggerTypes(sTriggerType, $triggerMsg);
				$triggerPanel.empty();
			}
			// TODO: Check if the Trigger and the Trigger Panel exists in the DOM
			$trigger.attr('title', sTriggerLabel).addClass('tis-btn');
			$triggerPanel.addClass('hide');
		});

		this.addUIListeners();
		this.showEventsPanel(false);
	};

	SIMViewController.prototype.setController						= function(p_oIncidentController){
		//Logger.logDebug('SIMViewController.setController() | p_oIncidentController = '+p_oIncidentController);
		this.oIncidentController = p_oIncidentController;
		//this.handleEvents = this.handleEvents.bind(this);
		this.oIncidentController.addEventListener('CURRENT_DAY_SET', this.handleEvents);
		this.oIncidentController.addEventListener('TIME_UPDATE', this.handleEvents);
		this.oIncidentController.addEventListener('NEW_TRIGGER', this.handleEvents);
		this.oIncidentController.addEventListener('NEW_DECISION', this.handleEvents);
		this.oIncidentController.addEventListener('EVENT_COMPLETE', this.handleEvents);
		this.oIncidentController.addEventListener('EVENT_TIME_EXPIRED', this.handleEvents);
		this.oIncidentController.addEventListener('DAY_START', this.handleEvents);
		this.oIncidentController.addEventListener('DAY_COMPLETE', this.handleEvents);
		this.oIncidentController.addEventListener('DAY_FAILED', this.handleEvents);
		this.oIncidentController.addEventListener('DAY_FAILED_PARTIAL', this.handleEvents);
		this.oIncidentController.addEventListener('RESTART_SIM', this.handleEvents);
		this.updateLocation();
	};

	SIMViewController.prototype.handleEvents						= function(e){
		//Logger.logDebug('SIMViewController.handleEvents() | Event Type = '+e.type);
		switch(e.type){
			case 'CURRENT_DAY_SET' :
				this.displayCurrentDay(e);
				this.updateInfoPanelDay(e);
				break;
			case 'TIME_UPDATE' :
				this.onTimeUpdate(e);
				break;
			case 'NEW_TRIGGER' :
				this.displayNewTrigger(e);
				break;
			case 'NEW_DECISION' :
				var sIncidentID				= e.incidentID,
					sEventID				= e.eventID,
					oDecisionPageModel		= e.decisionPageModel,
					aDecisionPageModelList	= e.decisionPageModelList;
				this.onDecisionStart(sIncidentID, sEventID, oDecisionPageModel, aDecisionPageModelList);
				break;
			case 'EVENT_COMPLETE' :
				this.onEventComplete(e);
				break;
			case 'EVENT_TIME_EXPIRED' :
				this.onEventTimeExpire(e);
				break;
			case 'DAY_START' :
				this.showDayStartPopup(e);
				break;
			case 'DAY_COMPLETE' :
				this.onDayComplete(e);
				break;
			case 'DAY_FAILED' :
				this.showDayFailedPopup(e);
				break;
			case 'DAY_FAILED_PARTIAL' :
				this.showDayFailedPartialPopup(e);
				break;
			case 'RESTART_SIM' :
				this.restart();
				break;
		}
	};

	SIMViewController.prototype.handleInternalEvents				= function(e){
		e.preventDefault();
		var targetID = $(e.target).attr('id');
		var currentTargetID = $(e.currentTarget).attr('id');
		//Logger.logDebug('SIMViewController.handleInternalEvents() | Target = '+targetID+' : Cur Target = '+currentTargetID/*+' : Scope '+this.toString()*/);
		if(targetID == 'maximize'){
			this.showEventsPanel(true);
		}else if(targetID == 'minimize'){
			this.showEventsPanel(false);
		}else if(this.isTrigger(targetID)){
			// ** A Trigger Type Icon (email | meeting | call) is clicked
			this.showSelectedTriggerPanel(targetID);
		}else if(currentTargetID.indexOf('trigger_') == 0){
			// ** A Trigger Message (email | meeting | call) is clicked
			this.showTriggerDescription($(e.currentTarget));
		}else if(targetID == 'btn_act'){
			// ** Act button click
			this.handleActBtnClick(targetID);
		}else if(targetID == 'btn_defer' || targetID == 'btn_undefer'){
			// ** Defer | Undefer button click
			this.handleDeferUndeferBtnClick(targetID);
		}else if(targetID == 'btn_daycompletecontinue'){
			// ** Day Complete Continue button click
			this.showDayCompletePopup(targetID);
		}
	};

	SIMViewController.prototype.onDecisionStart						= function(p_sIncidentID, p_sEventID, p_oDecisionPageModel, p_aDecisionPageModelList){
		var $currentEventHolder			= this.getEventDecisionHolder(p_sIncidentID, p_sEventID),
			sCurrentEventHolderID		= $currentEventHolder.attr('id'),
			bCurrentEventHolderExists	= ($currentEventHolder.length > 0),
			bCurrentEventHolderHidden	= ($currentEventHolder.hasClass('hide'));
		//Logger.logDebug('SIMViewController.onDecisionStart() | Event Holder Exists = '+bCurrentEventHolderExists+' : Hidden = '+bCurrentEventHolderHidden);

		if(bCurrentEventHolderExists && !bCurrentEventHolderHidden){
			// ** Probably Loading Next Decision for the same event
			this.loadDecisionPage(p_oDecisionPageModel, p_sIncidentID, p_sEventID);
		}else if(bCurrentEventHolderExists && bCurrentEventHolderHidden){
			// ** Probably coming back to a Decision of some other event to complete it
			$currentEventHolder.removeClass('hide');

			// ** If the Event has class hidden, it means that some other event might have been active which is not COMPLETED.
			if(this.sActiveEventDecisionID){
				var $activeEventHolder	= this.$decisionHolder.find('#'+this.sActiveEventDecisionID);
				// ** So hide the currently active Event.
				$activeEventHolder.addClass('hide');
			}

			// ** Store the reference to the current Event to be displayed
			this.sActiveEventDecisionID	= sCurrentEventHolderID;
			this.displayDecisionPage(p_sIncidentID, p_sEventID);
		}else{
			this.loadDecisionPage(p_oDecisionPageModel, p_sIncidentID, p_sEventID);
		}
	};

	SIMViewController.prototype.loadDecisionPage					= function(p_oDecisionPageModel, p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.loadDecisionPage() | Page GUID = '+p_oDecisionPageModel.getGUID());
		UIManager.showPreloader(true);
		var oScope = this;
		/*var sViewPath = Globals.getJSFile(p_oDecisionPageModel, 'html_location'),
			sData = Globals.getJSFile(p_oDecisionPageModel, 'xml_location'),*/
		// TODO: Currently HARD CODED the 2 statements below to load and play decision1.html by default
		var sViewPath = (p_oDecisionPageModel.getPageID()) ? CourseConfig.getRootPath() + CourseConfig.getConfig('html_location').folderURL + p_oDecisionPageModel.getParentCWGUID().split('~').join('/') + '/' + p_oDecisionPageModel.sPageID+  '.html' : null,
			sData = (p_oDecisionPageModel.getPageID()) ? CourseConfig.getRootPath() + CourseConfig.getConfig('xml_location').folderURL + p_oDecisionPageModel.getParentCWGUID().split('~').join('/') + '/' + p_oDecisionPageModel.sPageID  + '.xml' : null,
			sJSFilePath = Globals.getJSFile(p_oDecisionPageModel, 'js_location'),
			sCSSFilePath = Globals.getCSSFile(p_oDecisionPageModel, 'css_location');
		//Logger.logDebug('SIMViewController.loadDecisionPage() | CSS = "'+sCSSFilePath+'" : JS = "'+sJSFilePath+'" : XML = "'+sData+'" : HTML = "'+sViewPath);

		require([
			'../'+sJSFilePath
		], function(DecisionViewController){
			var oRl = new ResourceLoader();
			oRl.loadResource([sViewPath, sData, sCSSFilePath],
							 oScope,
							 function(p_oScope, p_aResources, p_oResourceLoader, p_oDecisionPageModel, DecisionViewController, p_sIncidentID, p_sEventID){
								oScope.initializeDecisionPage(p_aResources, p_oResourceLoader, p_oDecisionPageModel, DecisionViewController, p_sIncidentID, p_sEventID);
							 },
							 [p_oDecisionPageModel, DecisionViewController, p_sIncidentID, p_sEventID]);
		});
	};
	SIMViewController.prototype.initializeDecisionPage				= function(p_aResources, p_oResourceLoader, p_oDecisionPageModel, DecisionViewController, p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.initializeDecisionPage() | Active Decision ID = '+this.sActiveEventDecisionID+' : Current Event Holder ID = '+this.getEventDecisionHolderName(p_sIncidentID, p_sEventID));
		// ** Hide the decision page which is currently displayed to maintain its state
		if(this.sActiveEventDecisionID != '' && this.getEventDecisionHolderName(p_sIncidentID, p_sEventID) != this.sActiveEventDecisionID){
			this.$decisionHolder.find('#'+this.sActiveEventDecisionID).addClass('hide');
		}
		var domDecisionView				= p_aResources[0],
			xmlData						= p_aResources[1],
			cssData						= p_aResources[2],
			// oCurrDecisionPageModel		= this.getDecisionPageModel(p_sIncidentID, p_sEventID),
			oCurrDecisionPageModel		= p_oDecisionPageModel,
			$domDecision				= this.createEventDecisionHolder(p_sIncidentID, p_sEventID),
			oDecisionViewController		= new DecisionViewController(null, $domDecision, domDecisionView, xmlData, cssData, oCurrDecisionPageModel.getGUID(), p_sIncidentID, p_sEventID);

		this.sActiveEventDecisionID	= $domDecision.attr('id');
		//Logger.logDebug('\tCurrent Page Model = '+oCurrDecisionPageModel+' : GUID = '+oCurrDecisionPageModel.getGUID()+' : Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);

		//Logger.logDebug('SIMViewController.initializeDecisionPage() | Active Decision ID = '+this.sActiveEventDecisionID);

		this.addDecisionPageListeners(oDecisionViewController);

		oDecisionViewController.init();

		this.addDecisionPageObjectToDS(p_sIncidentID, p_sEventID, this.getDecisionID(oCurrDecisionPageModel.getGUID()), oDecisionViewController);

		if(!oDecisionViewController instanceof DecisionAbstract){
			Logger.logError('SIMViewController.onDecisionPageLoad() | Invalid Page Object at "'+oCurrDecisionPageModel.getGUID()+'". The Page Controller type mentioned in the course XML for a page needs to extend the "PageAbstractController" Object.');
		}

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
	};
	SIMViewController.prototype.addDecisionPageListeners			= function(p_oDecisionViewController){
		//Logger.logDebug('SIMViewController.addDecisionPageListeners() | ');
		//this.onDecisionPageLoaded	= this.onDecisionPageLoaded.bind(this);
		//this.onDecisionComplete		= this.onDecisionComplete.bind(this);
		p_oDecisionViewController.addEventListener('PAGE_LOADED', this.onDecisionPageLoaded);
		p_oDecisionViewController.addEventListener('DECISION_COMPLETE', this.onDecisionComplete);
	};
	SIMViewController.prototype.removeDecisionPageListeners			= function(p_oDecisionViewController){
		//Logger.logDebug('SIMViewController.removeDecisionPageListeners() | ');
		p_oDecisionViewController.removeEventListener('PAGE_LOADED', this.onDecisionPageLoaded);
		p_oDecisionViewController.removeEventListener('DECISION_COMPLETE', this.onDecisionComplete);
	};
	SIMViewController.prototype.onDecisionPageLoaded				= function(e){
		//Logger.logDebug('SIMViewController.onDecisionPageLoaded() | '+this.toString());
		var	oDecisionViewController = e.target,
            sGUID                   = e.GUID,
            sIncidentID             = e.incidentID,
            sEventID                = e.eventID,
            sDecisionID             = this.getDecisionID(sGUID);
		//Logger.logDebug('SIMViewController.onDecisionPageLoaded() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID+' : Decision ID = '+sDecisionID+' : Page GUID = '+sGUID);

		oDecisionViewController.removeEventListener('PAGE_LOADED', this.onDecisionPageLoaded);
		this.displayDecisionPage(sIncidentID, sEventID);
		this.dispatchEvent('DECISION_START', {type:'DECISION_START', target:this, GUID:sGUID, incidentID:sIncidentID, eventID:sEventID, decisionID:sDecisionID});
	};
	SIMViewController.prototype.displayDecisionPage					= function(p_sIncidentID, p_sEventID){
		// TODO: Dispatch VIEW STATE CHANGE event if the Page Model view type is different than the previous Pages View Type
		UIManager.showPreloader(false);
		this.showEventsPanel(false);
		this.updateLocation(p_sIncidentID, p_sEventID);
		this.updateEventName(p_sIncidentID, p_sEventID);
		//this.oIncidentController.setEventState(sIncidentID, sEventID, 'ACTIVE');
	};
	SIMViewController.prototype.onDecisionComplete					= function(e){
		var oDecisionViewController = e.target/*,
			sScoringUID				= e.scoringuid,
			sGUID					= e.GUID,
			sIncidentID				= e.incidentID,
			sEventID				= e.eventID,
			sDecisionID				= e.decisionID,
			oFeedbackData			= e.feedbackData,
			oDecisionData			= e.decisionData*/;
		Logger.logDebug('SIMViewController.onDecisionComplete() | Incident ID = '+e.incidentID+' : Event ID = '+e.eventID+' : Decision ID = '+e.decisionID+' : Page GUID = '+e.GUID+' : ScoringID = '+e.scoringuid);

		oDecisionViewController.removeEventListener('DECISION_COMPLETE', this.onDecisionComplete);
		this.sActiveEventDecisionID = undefined;

		var oEvent = $.extend({}, e, {target:this});
		this.dispatchEvent('DECISION_COMPLETE', oEvent);
		oDecisionViewController.destroy();

		// ** Load the Next Decision Page
		/*var oCurrDecisionPageModel = this.getNextDecisionPageModel(sIncidentID, sEventID);
		this.loadDecisionPage(oCurrDecisionPageModel);*/
	};

	SIMViewController.prototype.getDecisionID						= function(p_sGUID){
	    return p_sGUID.substring(p_sGUID.lastIndexOf('~')+1, p_sGUID.length);
	};

	/* IncidentEvent Event Handlers */
	SIMViewController.prototype.onEventComplete						= function(e){
		var sEventType	= e.type,
			oTarget		= e.target,
			sIncidentID	= e.incidentID,
			sEventID	= e.eventID;
		//Logger.logDebug('SIMViewController.onEventComplete() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID);
		// ** All Decisions for the Event Completed
		this.updateAllTriggerStatusIcons(sIncidentID, sEventID);
		/*var $selectedTriggerMsg	= this.getSelectedTriggerType().$selectedTriggerMsg,
			sTriggerMsgID		= $selectedTriggerMsg.attr('id'),
			oTrigger			= this.getTriggerFromDS(sTriggerMsgID).trigger;
		//Logger.logDebug('\tTrigger ID = '+sTriggerMsgID+' : '+oTrigger.toString());

		this.updateActButtonState(oTrigger);
		this.updateDeferUndeferButtonState(oTrigger);*/
		this.unloadAllDecisions(sIncidentID, sEventID);
		this.updateAllInfoPanelButtonStates();
		this.updateEventName();
		this.updateLocation();
		this.showEventsPanel(true);
	};
	SIMViewController.prototype.onEventTimeExpire					= function(e){
		var sEventType	= e.type,
			oTarget		= e.target,
			sIncidentID	= e.incidentID,
			sEventID	= e.eventID;
		//Logger.logDebug('SIMViewController.onEventTimeExpire() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID);

		this.updateAllTriggerStatusIcons(sIncidentID, sEventID);
		this.updateAllInfoPanelButtonStates();
	};

	SIMViewController.prototype.unloadAllDecisions					= function(p_sIncidentID, p_sEventID){
		// ** Dispose all Decision Page Objects
		var aDecisionViewControllerList	= this.getDecisionPageObjectListFromDS(p_sIncidentID, p_sEventID),
			length						= aDecisionViewControllerList.length,
			oDecisionViewController,
			i;
		//Logger.logDebug('SIMViewController.unloadAllDecisions() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+'\n\tDecision View Controllers Length = '+length);

		for(i=0; i<length; i++){
			oDecisionViewController = aDecisionViewControllerList[i];
			this.removeDecisionPageListeners(oDecisionViewController);
			oDecisionViewController.destroy();
		}
		// ** Remove the DOM node for the INCIDENT EVENT (i1_e1)
		var $eventDecisionHolder				= this.getEventDecisionHolder(p_sIncidentID, p_sEventID);
		//Logger.logDebug('\t$eventDecisionHolder Length = '+$eventDecisionHolder.length);
		$eventDecisionHolder.remove();
	};

	SIMViewController.prototype.unloadDecisionPage					= function(p_sIncidentID, p_sEventID, p_sDecisionID){
		// ** Dispose all Decision Page Objects
		var aDecisionViewControllerList	= this.getDecisionPageObjectListFromDS(p_sIncidentID, p_sEventID),
			length						= aDecisionViewControllerList.length,
			i,
			oDecisionViewController;
		for(i=0; i<length; i++){
			oDecisionViewController = aDecisionViewControllerList[i];
			this.removeDecisionPageListeners(oDecisionViewController);
			oDecisionViewController.destroy();
		}
		// ** Remove the DOM node for the EVENT
		var $eventDecisionHolder				= this.getEventDecisionHolder(p_sIncidentID, p_sEventID);
		//Logger.logDebug('SIMViewController.unloadDecisionPage() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : Length = '+$eventDecisionHolder.length);
		$eventDecisionHolder.remove();
	};

	/* ***** Methods to handle Events Fired from the Incident Controller to display Popups ****** */
	SIMViewController.prototype.removePopupHandler					= function(p_oPopup){
		//Logger.logDebug('SIMViewController.removePopupHandler() | ');
		p_oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
	};
	SIMViewController.prototype.addPopupHandler						= function(p_oPopup){
		//Logger.logDebug('SIMViewController.addPopupHandler() | ');
		//this.popupEventHandler	= this.popupEventHandler.bind(this);
		p_oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
	};
	SIMViewController.prototype.popupEventHandler					= function(e){
		var sEventType	= e.type,
			oPopup		= e.target,
			sPopupID	= oPopup.getID();
		//Logger.logDebug('SIMViewController.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

		if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE'){
			this.removePopupHandler(oPopup);

			if(sEventType === 'POPUP_EVENT'){PopupManager.closePopup(sPopupID);}

			/*if(sPopupID === 'transition_daystart'){
				//this.startDayTimer();
				//this.initializeEvent();
				this.$infoPanel.show();
				this.$eventsPanel.show();
			}
			if(sPopupID === 'transition_dayfailedpartial' || sPopupID === 'transition_daycomplete'){
				this.dispatchEvent('LOADING_FEEDBACK', {type:'LOADING_FEEDBACK', target:this});
				this.loadFeedbackScreen();
			}
			if(sPopupID === 'transition_dayfailed'){

			}
			if(sPopupID === 'transition'){
				var oData	= oPopup.getData('ic_startdecision');
				//this.startDecision(oData.incidentID, oData.eventID);
				this.dispatchEvent('EVENT_START', {type:'EVENT_START', target:this, incidentID:oData.incidentID, eventID:oData.eventID});
			}*/

		}
	};

	SIMViewController.prototype.setupPopupCloseEvents				= function(p_sClassAdded, p_oTransitionPopup, e){
		var aArgs	= [p_sClassAdded];
		if(e.scope && e.method){aArgs.push(e.scope, e.method, (e.args || []));}
		p_oTransitionPopup.setCallback(this, this.handlePopupCloseEvents, aArgs);
		this.addPopupHandler(p_oTransitionPopup);
	};
	SIMViewController.prototype.handlePopupCloseEvents				= function(p_oPopup, p_sPopupClassAdded, p_oScope, p_fnCallbackMethod, p_aArgs){
		//Logger.logDebug('SIMViewController.handlePopupCloseEvents() | \n\tPopup Class Added = '+p_sPopupClassAdded+'\n\tCallback Scope = '+p_oScope+'\n\tCallback Method = '+p_fnCallbackMethod+'\n\tCallback Args = '+p_aArgs);
		if(p_sPopupClassAdded === 'day-start'){
			this.$infoPanel.show();
			this.$eventsPanel.show();
		}
		if(p_sPopupClassAdded === 'day-failed'){
			//this.dispatchEvent('LOADING_FEEDBACK', {type:'LOADING_FEEDBACK', target:this});
			this.resetAllNewIconForTriggerTypes();
			//this.closeAllPopups();
			//this.loadFeedbackScreen();
		}
		if(p_sPopupClassAdded === 'day-complete' || p_sPopupClassAdded === 'day-failed-partial'){
			this.dispatchEvent('LOADING_FEEDBACK', {type:'LOADING_FEEDBACK', target:this});
			this.resetAllNewIconForTriggerTypes();
			this.loadFeedbackScreen();
		}
		if(p_sPopupClassAdded === 'transition'){
			var oData	= p_oPopup.getData('ic_startdecision');
			this.dispatchEvent('EVENT_START', {type:'EVENT_START', target:this, incidentID:oData.incidentID, eventID:oData.eventID});
		}

		// ** Callback if any to the Incident Controller
		if(p_oScope && p_fnCallbackMethod){
			var oScope		= this,
				nTimeOut	= setTimeout(function(){
					p_aArgs.unshift(oScope);
					p_fnCallbackMethod.apply(p_oScope, p_aArgs);
				}, 100);
			//clearTimeout(nTimeOut);
		}
	};

	SIMViewController.prototype.showDayStartPopup					= function(e){
		this.showUI(true);
		this.bDayComplete		= false;
		var sTitle				= this.oIncidentController.getPopupData('daystart_title'),
			sContent			= this.oIncidentController.getPopupData('daystart_content'),
			sIText				= this.oIncidentController.getPopupData('daystart_itext'),
			oTransitionPopup	= PopupManager.openPopup('transition', {txt_title:sTitle, txt_content:sContent, txt_itext:sIText}, this.$decisionHolder, 'day-start');
		//Logger.logDebug('SIMViewController.showDayStartPopup() | ');

		this.setupPopupCloseEvents('day-start', oTransitionPopup, e);
	};
	SIMViewController.prototype.showTransitionPopup					= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.showTransitionPopup() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oIncidentEvent		= this.oIncidentController.getIncidentEventByID(p_sIncidentID, p_sEventID),
			sEventName			= oIncidentEvent.getEventName(),
			//sTransitionText		= oIncidentEvent.getPageText('transition'),
			aTransitionText		= oIncidentEvent.getTransitionText().pageText,
			oTransitionText		= {},
			sClassName,
			i;

		for(i=0; i<aTransitionText.length; i++){
			sClassName							= aTransitionText[i]._class.toLowerCase();
			oTransitionText['txt_'+sClassName]	= aTransitionText[i].__cdata;
		}
		var	oTransitionPopup	= PopupManager.openPopup('transition', oTransitionText, this.$decisionHolder);
		oTransitionPopup.setData('ic_startdecision', {incidentID:p_sIncidentID, eventID:p_sEventID});
		this.setupPopupCloseEvents('transition', oTransitionPopup, {});
	};
	SIMViewController.prototype.showDayFailedPopup					= function(e){
		this.closeAllPopups();
		this.showTriggerDescription();

		var sEventType			= e.type,
			oTarget				= e.target,
			bDayTimeExpired		= e.timeExpired,
			sTitle				= this.oIncidentController.getPopupData('dayfailed_title'),
			sContent			= this.oIncidentController.getPopupData('dayfailed_content'),
			sIText				= this.oIncidentController.getPopupData('dayfailed_itext');
		//Logger.logDebug('SIMViewController.showDayFailedPopup() | Time Expired = '+bDayTimeExpired);

		// ** TODO: Make this pop-up configurable
		var oTransitionPopup	= PopupManager.openPopup('transition', {txt_title:sTitle, txt_content:sContent, txt_itext:sIText}, this.$decisionHolder, 'day-failed');
		this.setupPopupCloseEvents('day-failed', oTransitionPopup, e);
	};
	SIMViewController.prototype.showDayFailedPartialPopup			= function(e){
		var sEventType			= e.type,
			oTarget				= e.target,
			bDayTimeExpired		= e.timeExpired,
			sTitle				= this.oIncidentController.getPopupData('dayfailedpartial_title'),
			sContent			= this.oIncidentController.getPopupData('dayfailedpartial_content'),
			sIText				= this.oIncidentController.getPopupData('dayfailedpartial_itext');
		//Logger.logDebug('SIMViewController.showDayFailedPartialPopup() | Time Expired = '+bDayTimeExpired);

		// ** TODO: Make this pop-up configurable
		var oTransitionPopup	= PopupManager.openPopup('transition', {txt_title:sTitle, txt_content:sContent, txt_itext:sIText}, this.$decisionHolder, 'day-failed-partial');
		this.setupPopupCloseEvents('day-failed-partial', oTransitionPopup, e);
	};
	SIMViewController.prototype.showDayCompletePopup				= function(e){
		var sEventType			= e.type,
			oTarget				= e.target,
			bDayTimeExpired		= e.timeExpired,
			sTitle				= this.oIncidentController.getPopupData('daycomplete_title'),
			sContent			= this.oIncidentController.getPopupData('daycomplete_content'),
			sIText				= this.oIncidentController.getPopupData('daycomplete_itext');
		//Logger.logDebug('SIMViewController.showDayCompletePopup() | Time Expired = '+bDayTimeExpired);

		// ** TODO: Make this pop-up configurable
		var oTransitionPopup	= PopupManager.openPopup('transition', {txt_title:sTitle, txt_content:sContent, txt_itext:sIText}, this.$decisionHolder, 'day-complete');
		this.setupPopupCloseEvents('day-complete', oTransitionPopup, e);
	};
	SIMViewController.prototype.closeAllPopups						= function(){
		PopupManager.closeAll();
	};

	SIMViewController.prototype.onDayComplete						= function(e){
		this.closeAllPopups();

		var sEventType			= e.type,
			oTarget				= e.target,
			bDayTimeExpired		= e.timeExpired;
		Logger.logDebug('SIMViewController.onDayComplete() | \n\tDay Time Expired = '+bDayTimeExpired);

		//if(bDayTimeExpired){
			this.removeAllDecisionPageObjectFromDS();
			this._updateAllTriggerStatusIcons();
			this.updateEventName();
			this.updateLocation();
		//}
		this.bDayComplete		= true;
		this.$btnItext.removeClass('hide').html(this.oIncidentController.getPopupData('itext_daycomplete'));
		this.$btnDayCompleteContinue.removeClass('hide');
		this.updateAllInfoPanelButtonStates();
		this.showEventsPanel(true);
		this.showDayCompletePopup(e);
	};

	SIMViewController.prototype.loadFeedbackScreen					= function(){
		//Logger.logDebug('SIMViewController.loadFeedbackScreen() | ');
		UIManager.showPreloader(true);

		var oFeedbackPageModel		= this.oIncidentController.getFeedbackPageModel();
		//Logger.logDebug('SIMViewController.loadFeedbackScreen() | Decisions JSON = '+JSON.stringify(oFeedbackPageModel));
		var oScope = this;
		var sViewPath		= Globals.getHTMLFile(oFeedbackPageModel, 'html_location'),
			sData			= Globals.getXMLFile(oFeedbackPageModel, 'xml_location'),
			sJSFilePath		= Globals.getJSFile(oFeedbackPageModel, 'js_location'),
			sCSSFilePath	= Globals.getCSSFile(oFeedbackPageModel, 'css_location');
		//Logger.logDebug('SIMViewController.loadFeedbackScreen() | CSS = "'+sCSSFilePath+'" : JS = "'+sJSFilePath+'" : XML = "'+sData+'" : HTML = "'+sViewPath);

		require([
			'../'+sJSFilePath
		], function(FeedbackViewController){
			var oRl = new ResourceLoader();
			oRl.loadResource(
				[sViewPath, sData, sCSSFilePath],
				oScope,
				function(p_oScope, p_aResources, p_oResourceLoader, p_oFeedbackPageModel, DecisionViewController){
					oScope.initializeFeedbackScreen(p_aResources, p_oResourceLoader, p_oFeedbackPageModel, DecisionViewController);
				},
				[oFeedbackPageModel, FeedbackViewController]
			);
		});
	};
	SIMViewController.prototype.initializeFeedbackScreen			= function(p_aResources, p_oResourceLoader, p_oFeedbackPageModel, FeedbackViewController){
		//Logger.logDebug('SIMViewController.initializeFeedbackScreen() | '/*+FeedbackViewController*/+this.toString());
		this.reset();
		var domFeedbackView				= p_aResources[0],
			xmlData						= p_aResources[1],
			cssData						= p_aResources[2],
			oCurrDecisionPageModel		= p_oFeedbackPageModel,
			//$domDecision				= this.createEventDecisionHolder(p_sIncidentID, p_sEventID),
			//oFeedbackViewController		= new FeedbackViewController($domDecision, domFeedbackView, xmlData, cssData);
			oFeedbackViewController		= new FeedbackViewController(null, this.$decisionHolder, domFeedbackView, xmlData, cssData, p_oFeedbackPageModel.getGUID());

		//this.onFeedbackScreenLoaded		= this.onFeedbackScreenLoaded.bind(this);
		//this.onNextDayStart				= this.onNextDayStart.bind(this);
		if(this.oIncidentController.isLastDay()){
			//Logger.logDebug('isLastDay = '+this.oIncidentController.isLastDay());
			VariableManager.setVariable('completion_status', 'completed');
		}

		oFeedbackViewController.addEventListener('PAGE_LOADED', this.onFeedbackScreenLoaded);
		oFeedbackViewController.addEventListener('NEXT_DAY_START', this.onNextDayStart);

		oFeedbackViewController.init(oCurrDecisionPageModel.getGUID());

		if(!oFeedbackViewController instanceof DecisionAbstract){
			Logger.logError('SIMViewController.onDecisionPageLoad() | Invalid Page Object at "'+oCurrDecisionPageModel.getGUID()+'". The Page Controller type mentioned in the course XML for a page needs to extend the "PageAbstractController" Object.');
		}

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
	};
	SIMViewController.prototype.onFeedbackScreenLoaded				= function(e){
		Logger.logDebug('SIMViewController.onFeedbackScreenLoaded() | '+this.toString());
		var	oFeedbackViewController = e.target,
            sGUID                   = e.GUID,
            sDecisionID             = this.getDecisionID(sGUID);
		//Logger.logDebug('SIMViewController.onFeedbackScreenLoaded() | Decision ID = '+sDecisionID+' : Page GUID = '+sGUID);

		oFeedbackViewController.removeEventListener('PAGE_LOADED', this.onFeedbackScreenLoaded);
		// TODO: Dispatch VIEW STATE CHANGE event if the Page Model view type is different than the previous Pages View Type
		UIManager.showPreloader(false);
		//this.reset();
		this.dispatchEvent('FEEDBACK_SHOWN', {type:'FEEDBACK_SHOWN', target:this});
	};

	SIMViewController.prototype.reset								= function(){
		Logger.logDebug('SIMViewController.reset() | ');
		this.bDayComplete		= false;
		this.showEventsPanel(false);
		this.showTriggerDescription();
		this.showUI(false);
		//this.removeAllTriggers();
		//this.$btnItext.addClass('hide');
		//this.$btnDayCompleteContinue.addClass('hide');
		this.resetSelectedTriggerMsg();
		this.removeAllDecisionPageObjectFromDS();
		this.removeAllTriggersFromDS();
		this.resetAllNewIconForTriggerTypes();
	};
	SIMViewController.prototype.restart								= function(){
		Logger.logDebug('SIMViewController.restart() | ');
		this.bDayComplete		= false;
		this.resetSelectedTriggerMsg();
		this.removeAllDecisionPageObjectFromDS();
		this.removeAllTriggersFromDS();
		this.resetAllNewIconForTriggerTypes();
		this.oDataStore = {};
		this.updateLocation();
		this.updateEventName();
	};

	SIMViewController.prototype.showUI								= function(p_bShow){
		if(p_bShow){
			this.$infoPanel.show();
			this.$eventsPanel.show();
		}else{
			this.$infoPanel.hide();
			this.$eventsPanel.hide();
		}
	};
	/*SIMViewController.prototype.removeAllTriggers					= function(p_sTriggerType){
		var triggerType;

		for (triggerType in this.oTriggerTypes) {
			//Logger.logDebug('SIMViewController.removeAllTriggers() | Trigger Type = '+triggerType+' Value = '+this.oTriggerTypes[triggerType]);
			if(p_sTriggerType){
				if(p_sTriggerType === triggerType){
					this.removeAllTriggersForType(triggerType);
					return;
				}
			}else{
				this.removeAllTriggersForType(triggerType);
			}
		};
	};
	SIMViewController.prototype.removeAllTriggersForType			= function(p_sTriggerType){
		var $triggerPanel		= this.getElementByID(p_sTriggerType+'_panel');
		$triggerPanel.empty();
	};*/


	SIMViewController.prototype.onNextDayStart						= function(e){
		Logger.logDebug('SIMViewController.onNextDayStart() | Is LAST DAY = '+this.oIncidentController.isLastDay());
		var oFeedbackScreen		= e.target;
		oFeedbackScreen.removeEventListener('NEXT_DAY_START', this.onNextDayStart);
		if(this.oIncidentController.isLastDay()){
			//oFeedbackScreen.navigateNext();
			this.dispatchEvent('SIM_COMPLETE', {type:'SIM_COMPLETE', target:this});
			return;
		}
		oFeedbackScreen.destroy();
		this.dispatchEvent('NEXT_DAY_START', {type:'NEXT_DAY_START', target:this});
	};


	/* ***** Displaying New Trigger Message ****** */
	SIMViewController.prototype.displayNewTrigger					= function(e){
		var oTrigger			= e.trigger,
			sTriggerType		= oTrigger.getType(),
			oTriggerText		= oTrigger.getPageText(),
			sEventName			= oTrigger.getEventName(),

			sIncidentID			= oTrigger.getIncidentID(),
			sEventID			= oTrigger.getEventID(),
			sTriggerID			= oTrigger.getID(),
			//sTriggerID		= $newMsg.attr('id') + sIncidentID + '$' + sEventID + '_' + nTriggerCount;
			//sTriggerMsgID		= 'trigger_'+sIncidentID+'~'+sEventID+'_'+sTriggerID,
			sTriggerMsgID		= 'trigger_'+sIncidentID+'_'+sEventID+'_'+sTriggerID,

			$triggerPanel		= this.getElementByID(sTriggerType+'_panel'),

			// ** Get the stored Message Sample for the specific Trigger Type
			$msgSample			= this.getSelectedTriggerMsgSample(sTriggerType),

			$newMsg 			= this._createTrigger($msgSample.clone(), oTriggerText);

		$newMsg.attr('id', sTriggerMsgID);

		Logger.logDebug('SIMViewController.displayNewTrigger() | Type = "'+sTriggerType+'" : Trigger ID = '+sTriggerMsgID/*+' | Trigger = '+JSON.stringify(oTrigger)*/);
		this.addTriggerToDS(sTriggerMsgID, oTrigger, $newMsg);

		$triggerPanel.append($newMsg);
		this.enableTabbingForEventsPanel();
		this.setTriggerState(sTriggerMsgID, 'UNREAD');
		this.updateTriggerStatusIcon(sTriggerMsgID);
		this.updateNewOnTriggerTypes(sTriggerMsgID);
		this._displayNewEventName(this.capitaliseFirstLetter(sTriggerType)+': '+sEventName);
	};

	SIMViewController.prototype.showSelectedTriggerPanel			= function(p_sTriggerType){
		//Logger.logDebug('SIMViewController.showSelectedTriggerPanel() | '+p_sTriggerType);
		var $triggerIcon	= this.getElementByID(p_sTriggerType),
			$triggerPanel;

		if($triggerIcon.hasClass('open')){return;}

		// ** Updating the Previous Trigger States & Making the Trigger Panel invisible
		//Logger.logDebug('\tsSelectedTriggerType = '+this.sSelectedTriggerType);
		if(this.sSelectedTriggerType !== p_sTriggerType){
			if(this.sSelectedTriggerType){
				$triggerIcon	= this.getElementByID(this.sSelectedTriggerType);
				$triggerPanel	= this.getElementByID(this.sSelectedTriggerType+'_panel');
				$triggerIcon.removeClass('open selected');
				$triggerPanel.addClass('hide');
			}

			// ** Updating the Trigger Title
			this._updtaeInfoPanelTitle(this.capitaliseFirstLetter(p_sTriggerType));

			// ** Storing a reference to the Selected Ttigger Type
			this.sSelectedTriggerType = p_sTriggerType;
			$triggerIcon	= this.getElementByID(this.sSelectedTriggerType);
			$triggerPanel	= this.getElementByID(this.sSelectedTriggerType+'_panel');

			// ** Updating the Trigger States & Making the Trigger Panel visible
			$triggerIcon.addClass('open selected');
			$triggerPanel.removeClass('hide');
		}

		// ** The minimize | maximize button in the Events Panel
		if(this.$btnEventsPanelToggle.hasClass('hide')){
			this.$btnEventsPanelToggle.removeClass('hide');
		}

		this.showEventsPanel(true);
		this.showTriggerDescription(this.getSelectedTriggerMsg());
	};

	SIMViewController.prototype.showTriggerDescription				= function(p_$triggerMsg){
		//Logger.logDebug('SIMViewController.showTriggerDescription() | '+p_$triggerMsg+' : '+(typeof p_$triggerMsg));
		var $triggerSubject			= this.getElementByID('trigger_subject'),
			$triggerTime			= this.getElementByID('trigger_time'),
			$triggerDescription		= this.getElementByID('trigger_description'),
			oTrigger;

		if(!p_$triggerMsg){
			// ** Show blank Trigger Description
			$triggerSubject.html('');
			$triggerTime.html('');
			$triggerDescription.html('');
			this.$btnAct.addClass('hide');
			this.$btnDefer.addClass('hide');
			this.$btnUnDefer.addClass('hide');
			if(!this.bDayComplete){
				this.$btnItext.addClass('hide');
				this.$btnDayCompleteContinue.addClass('hide');
			}
			this.$imgBigTriggerIcon.removeAttr('class');
			//Logger.logDebug('\tSIMViewController.showTriggerDescription() | Empty the trigger description area.');
		}else{
			// ** If there is a Trigger Message selected for the Trigger Type then show it's description
			var $triggerMsg		= p_$triggerMsg,
				sTriggerMsgID	= $triggerMsg.attr('id'),
				oTrigger 		= this.getTriggerFromDS(sTriggerMsgID).trigger;
			//Logger.logDebug('\tSIMViewController.showTriggerDescription() | '+$triggerMsg.attr('data-info'));

			//$triggerMsg.addClass('selected');
			//$triggerMsg.find('.trigger-icon').addClass('visited');
			this.setTriggerState(sTriggerMsgID, 'READ');
			this.updateNewOnTriggerTypes(sTriggerMsgID);
			// ** Storing a reference to the Trigger Message for a Trigger Type
			this.setSelectedTriggerMsg(null, $triggerMsg);

			$triggerDescription.html(oTrigger.getPageText().description);
			$triggerSubject.html(oTrigger.getPageText().subject);
			$triggerTime.html(oTrigger.getTimeStamp());
			this.$imgBigTriggerIcon.removeAttr('class').addClass(oTrigger.getType());
		}

		this.updateDeferUndeferButtonState(oTrigger);
		this.updateActButtonState(oTrigger);
	};

	/* **** Defer | Undefer Button **** */
	SIMViewController.prototype.handleDeferUndeferBtnClick			= function(p_btnID){
		if(this.$btnDefer.hasClass('disabled') || this.$btnDefer.hasClass('inactive')){return;}
		//Logger.logDebug('SIMViewController.handleDeferUndeferBtnClick() | btnID = '+p_btnID);
		var $selectedTriggerMsg	= this.getSelectedTriggerMsg(),
			sTriggerMsgID		= $selectedTriggerMsg.attr('id'),
			oTrigger 			= this.getTriggerFromDS(sTriggerMsgID).trigger,
			sIncidentID			= oTrigger.getIncidentID(),
			sEventID			= oTrigger.getEventID(),
			//sState				= (p_btnID == 'btn_defer') ? 'DEFERRED' : 'STARTED',
			sEventToDispatch	= (p_btnID == 'btn_defer') ? 'EVENT_DEFERRED' : 'EVENT_UNDEFERRED';

		//this.oIncidentController.setEventState(sIncidentID, sEventID, sState);
		this.dispatchEvent(sEventToDispatch, {type:sEventToDispatch, trigger:oTrigger});

		this.updateDeferUndeferButtonState(oTrigger);
		this.updateActButtonState(oTrigger);
		this.updateAllTriggerStatusIcons(sIncidentID, sEventID);
	};
	SIMViewController.prototype.updateDeferUndeferButtonState		= function(p_oTrigger){
		var oTrigger		= p_oTrigger;

		// TODO: Check if there is more than one event pending
		if(!oTrigger || !this.oIncidentController.canBeDeferred()){
			// ** No Trigger Message is selected
			this.hideDeferUndeferButton();
		}else{
			//Logger.logDebug('SIMViewController.updateDeferUndeferButtonState() | oTrigger = '+oTrigger+' : Event Life Left = '+oTrigger.getEventLifeLeft()+' : Event State = '+oTrigger.getEventState());
			// ** Trigger Message is selected
			if(oTrigger.getEventLifeLeft() > 0){
				// ** If life of the Event is Greater then 1 then show the DEFER & UNDEFER buttons
				var sEventState		= oTrigger.getEventState(),
					sTriggerState	= oTrigger.getStoredEventState();
				if(sTriggerState === 'COMPLETED' || sTriggerState === 'TIMEEXPIRED'){
					// ** Trigger Message has its own stored state as 'COMPLETED' then hide the Defer & Undefer buttons
					this.hideDeferUndeferButton();
				}else if(sEventState === 'COMPLETED' || sEventState === 'ACTIVE' || sEventState === 'TIMEEXPIRED'){
					// ** If Event is COMPLETED or ACTIVE Disable the Defer & Undefer buttons
					this.showDeferButton(true);
					this.enableDeferUndeferButton(false);
				}else if(sEventState === 'DEFERRED'){
					// ** If Event is Deferred show the Undefer button
					this.showDeferButton(false);
				}else{
					// ** If Event is NOT Deferred show the Defer button
					this.showDeferButton(true);
				}
			}else{
				// ** If life of the Event 1 then hide the DEFER & UNDEFER buttons
				this.hideDeferUndeferButton();
			}
		}
	};
	SIMViewController.prototype.showDeferButton						= function(p_bDefer){
		if(p_bDefer){
			this.showButton(this.$btnDefer, true);
			this.showButton(this.$btnUnDefer, false);
		}else {
			this.showButton(this.$btnDefer, false);
			this.showButton(this.$btnUnDefer, true);
		}
	};
	SIMViewController.prototype.hideDeferUndeferButton				= function(){
		this.showButton(this.$btnDefer, false);
		this.showButton(this.$btnUnDefer, false);
	};
	SIMViewController.prototype.enableDeferUndeferButton			= function(p_bEnable){
		if(p_bEnable){
			this.enableButton(this.$btnDefer, true);
			this.enableButton(this.$btnUnDefer, true);
		}else{
			this.enableButton(this.$btnDefer, false);
			this.enableButton(this.$btnUnDefer, false);
		}
	};

	/* **** Act Button **** */
	SIMViewController.prototype.handleActBtnClick					= function(p_btnID){
		if(this.$btnAct.hasClass('disabled') || this.$btnAct.hasClass('inactive')){return;}
		//Logger.logDebug('SIMViewController.handleActBtnClick() | btnID = '+p_btnID);
		var $selectedTriggerMsg	= this.getSelectedTriggerMsg(),
			sTriggerMsgID		= $selectedTriggerMsg.attr('id'),
			sIncidentID			= this.getTriggerIncidentID(sTriggerMsgID),
			sEventID			= this.getTriggerEventID(sTriggerMsgID),
			oTrigger 			= this.getTriggerFromDS(sTriggerMsgID).trigger;

		//this.oIncidentController.setEventState(sIncidentID, sEventID, 'ACTIVE');
		this.dispatchEvent('TRIGGER_ACTBTN_CLICK', {type:'TRIGGER_ACTBTN_CLICK', trigger:oTrigger});
		this.$btnItext.addClass('hide');
		this.updateDeferUndeferButtonState(oTrigger);
		this.updateActButtonState(oTrigger);
		this.updateAllTriggerStatusIcons(sIncidentID, sEventID);
		this.showTransitionPopup(sIncidentID, sEventID);
	};
	SIMViewController.prototype.updateActButtonState				= function(p_oTrigger){
		var oTrigger		= p_oTrigger;
		/*var $selectedTriggerMsg	= this.getSelectedTriggerMsg(),
			sTriggerMsgID		= $selectedTriggerMsg.attr('id'),
			oTrigger 			= this.getTriggerFromDS(sTriggerMsgID).trigger;*/

		if(!oTrigger){
			this.showButton(this.$btnAct, false);
		}else{
			this.showButton(this.$btnAct, true);
			var sEventState		= oTrigger.getEventState(),
				sTriggerState	= oTrigger.getStoredEventState();
			//Logger.logDebug('SIMViewController.updateActButtonState() | Trigger State = '+sTriggerState+' : Event State = '+sEventState);

			if(sTriggerState === 'COMPLETED' || sTriggerState === 'TIMEEXPIRED'){
				// ** Hide the Act button if the Trigger's STORED STATE is a COMPLETED | TIMEEXPIRED
				this.showButton(this.$btnAct, false);
				this.$btnItext.addClass('hide');
			}else if(sEventState === 'ACTIVE' || sEventState === 'COMPLETED' || sEventState === 'FAILED' || sEventState === 'DEFERRED' || sEventState === 'TIMEEXPIRED'){
				// ** Disable the Act button if the Decisions in an Event is COMPLETED | DEFERRED | FAILED | TIMEEXPIRED
				this.enableButton(this.$btnAct, false);
				this.$btnItext.addClass('hide');
			}else{
				// ** Enable the Act button if the Decisions in an Event is NOT COMPLETED or DEFERRED
				this.$btnItext.removeClass('hide');
				this.enableButton(this.$btnAct, true);
				this.$btnItext.removeClass('hide').html(this.oIncidentController.getPopupData('itext_act'));
			}
		}
	};


	/* **** Information Panel Update Methods **** */
	SIMViewController.prototype._createTrigger						= function(p_$sampleTrigger, p_oTriggerText){
		for(var prop in p_oTriggerText){
			var $elem = p_$sampleTrigger.find('.trigger-'+prop);
			if($elem.length > 0 && $elem.length === 1){
				$elem.html(p_oTriggerText[prop]);
			}
		}

		return p_$sampleTrigger;
	};
	SIMViewController.prototype.updateInfoPanelDay					= function(e){
		var $dayTitle = this.getElementByID('day_title');
		$dayTitle.html(this.sInfoPanelDayTitlePrefix + e.day);
	};
	SIMViewController.prototype._displayNewEventName				= function(p_sEventName){
		var $triggerInfoOrg		= this.getElementByID('trigger_info').addClass('hide'),
			$triggerInfo		= $triggerInfoOrg.removeClass('hide').clone();

		$triggerInfoOrg.parent().append($triggerInfo);
		//alert($triggerInfo.width());
		$triggerInfo.html(p_sEventName).css({
			'display'				: 'block',
			'opacity'				: 0,
			'left'					: 780
		}).animate({
			opacity			: 1,
			left			: 200
		}, 1500, function() {
			$(this).fadeOut(5000, function(e){
				$(this).remove();
			});
		});
	};
	SIMViewController.prototype._updtaeInfoPanelTitle				= function(p_sTriggerTitle){
		var $triggerTitle = this.getElementByID('trigger_title');
		$triggerTitle.html(p_sTriggerTitle);
	};
	SIMViewController.prototype.updateAllInfoPanelButtonStates		= function(){
		//Logger.logDebug('SIMViewController.updateAllInfoPanelButtonStates() | ');
		// ** Get the Trigger Object data from the currently selected Trigger Message
		var $selectedTriggerMsg	= this.getSelectedTriggerMsg();
		if(!$selectedTriggerMsg){Logger.logWarn('SIMViewController.updateAllInfoPanelButtonStates() | WARN: No Trigger Type OR No Trigger Message for the Trigger Type selected.'); return;}
		var sTriggerMsgID		= $selectedTriggerMsg.attr('id'),
			/*sIncidentID			= this.getTriggerIncidentID(sTriggerMsgID),
			sEventID			= this.getTriggerEventID(sTriggerMsgID),
			sTriggerID			= this.getTriggerID(sTriggerMsgID);*/
			oTrigger 			= this.getTriggerFromDS(sTriggerMsgID).trigger;

		//Logger.logDebug('sTriggerMsgID = '+sTriggerMsgID);

		// ** Update the Act and Defer | Undefer button staes based on the currently selected Trigger Message
		this.updateDeferUndeferButtonState(oTrigger);
		this.updateActButtonState(oTrigger);
	};

	/* ****** Adding Minimize | Maximize Events ****** */
	SIMViewController.prototype.addUIListeners 						= function(){
		this.$decisionHolder			= this.getElementByID('decision_holder');

		this.$infoPanel					= this.getElementByID('info_panel');
		this.$eventName					= this.getElementByID('event_name');
		this.$whichDay 					= this.getElementByID('which_day');
		this.$dayTimerText				= this.getElementByID('timer_text');
		this.$dayTimerGraphic			= this.getElementByID('timer_graphic');
		this.$location 					= this.getElementByID('location');

		this.$eventsPanel 				= this.getElementByID('events_panel');

		this.$btnEventsPanelToggle 		= this.getElementByID('eventspanel_toggle');
		this.$btnMaximize 				= this.getElementByID('maximize');
		this.$btnMinimize 				= this.getElementByID('minimize');

		this.$informationBar			= this.getElementByID('information_bar');

		this.$informationPanel			= this.getElementByID('information_panel');
		this.$imgBigTriggerIcon			= this.getElementByID('trigger_icon');
		this.$btnItext					= this.getElementByID('btn_itext');
		this.$btnAct					= this.getElementByID('btn_act');
		this.$btnDefer					= this.getElementByID('btn_defer');
		this.$btnUnDefer				= this.getElementByID('btn_undefer');
		this.$btnDayCompleteContinue	= this.getElementByID('btn_daycompletecontinue');


		this.$btnEventsPanelToggle.addClass('hide');

		var oScope = this;
		this.$btnMinimize.hide();
		// ** Trigger Type Icons Click
		this.$informationBar.on('click', function(e){
			oScope.handleInternalEvents(e);
		});
		// ** Trigger Message Clicks
		this.$informationPanel.on('click', 'a', function(e){
			oScope.handleInternalEvents(e);
		});
		// ** Defer & Undefer buttons
		this.$btnDefer.on('click', function(e){
			oScope.handleInternalEvents(e);
		});
		this.$btnUnDefer.on('click', function(e){
			oScope.handleInternalEvents(e);
		});
		// ** Act Button
		this.$btnAct.on('click', function(e){
			oScope.handleInternalEvents(e);
		});
		this.$btnDayCompleteContinue.on('click', function(e){
			oScope.handleInternalEvents(e);
		});

		var $p = $('<p id="events_panel" class="open"></p><p id="events_panel" class="close"></p>').hide().appendTo("body");
		var $open = $('#events_panel.open'),
			$close = $('#events_panel.close');
		//this.oEventPanelOpen = $open.getStyleObject();
		//this.oEventPanelClose = $close.getStyleObject();
		this.oEventPanelOpen = {'bottom':$open.css('bottom')};
		this.oEventPanelClose = {'bottom':$close.css('bottom')};
		//Logger.logDebug('########### '+$open.css('bottom')+' :: '+$close.css('bottom'))
		$open.remove();
		$close.remove();

		//Logger.logDebug('SIMViewController.parseTriggers() | FINISHED PARSING | Timer Graphic = '+this.$dayTimerGraphic.attr('id')+' : SCOPE = '+this);
		if(this.fCallback){
			this.aArgs.unshift(this.oContext, this);
			this.fCallback.apply(this.oContext, this.aArgs);
		}
	};

	/* **** Events Panel **** */
	SIMViewController.prototype.showEventsPanel						= function(p_bShow, p_oContext, p_fCallback, p_aArgs){
		//Logger.logDebug('SIMViewController.showEventsPanel() | Show = '+p_bShow+' : Scope '+this.toString());
		if(this.bPanelEventsShow === p_bShow){return;}
		this.bPanelEventsShow = p_bShow;
		//var nBottom = (p_bShow) ? '0px' : '-460px';
		var oStyleToApply = (p_bShow) ? this.oEventPanelOpen : this.oEventPanelClose;
		var oScope = this;
		this.$eventsPanel.animate(
			/*{bottom: nBottom},*/
			oStyleToApply,
			'slow',
			'linear',
			function(){
				oScope.onEventsPanelAnimationComplete(p_oContext, p_fCallback, p_aArgs);
			}
		);
	};
	SIMViewController.prototype.onEventsPanelAnimationComplete		= function(p_oContext, p_fCallback, p_aArgs){
		//Logger.logDebug('SIMViewController.onEventsPanelAnimationComplete() | Scope '+this.toString());
		if(this.bPanelEventsShow){
			this.$btnMaximize.hide();
			this.$btnMinimize.show();
			if(this.sSelectedTriggerType){this.getElementByID(this.sSelectedTriggerType).addClass('open');}
		}else{
			this.$btnMaximize.show();
			this.$btnMinimize.hide();
			if(this.sSelectedTriggerType){this.getElementByID(this.sSelectedTriggerType).removeClass('open');}
		}
		this.enableTabbingForEventsPanel();

		if(p_fCallback){
			p_aArgs.unshift(p_oContext);
			p_fCallback.apply(p_oContext, p_aArgs);
		}
	};
	SIMViewController.prototype.enableTabbingForEventsPanel			= function(){
		if(this.bPanelEventsShow){
			this.$eventsPanel.find('.tis-btn').removeAttr('tabIndex');
		}else{
			this.$eventsPanel.find('.tis-btn').attr('tabIndex', -1);
		}
	};

	/* **** On-Screen Timer and Current Day Display **** */
	SIMViewController.prototype.displayCurrentDay					= function(e){
		this.$whichDay.html(e.day);
	};
	SIMViewController.prototype.onTimeUpdate						= function(e){
		//Logger.logDebug('SIMViewController.onTimeUpdate() | Time = '+e.strLapsedTime+' | Timer Graphic ID = '+this.$dayTimerGraphic.attr('id')+' | Timer Text ID = '+this.$dayTimerText.attr('id')+' : SCOPE = '+this);
		this.$dayTimerText.html(e.strLapsedTime);
		var nLapsedMins				= parseInt(parseInt(e.lapsedTime) / 60),
			oBackgroundPosition		= this.getBackgroungPosition(this.$dayTimerGraphic),
			sDayTimerGraphicWidth	= this.$dayTimerGraphic.css('width'),
			nDayTimerGraphicWidth	= sDayTimerGraphicWidth.substring(0, (sDayTimerGraphicWidth.length-2)),
			backgroundXPos			= (nLapsedMins * nDayTimerGraphicWidth);
		//Logger.logDebug('Timer Graphic ID X = '+oBackgroundPosition.x+' | Timer Graphic ID Y = '+oBackgroundPosition.y+'\nDay Timer Graphic Width = '+sDayTimerGraphicWidth+' x Lapsed Mins = '+nLapsedMins+' = New X Pos = '+backgroundXPos);

		this.$dayTimerGraphic.css({
			'background-position': -backgroundXPos + 'px' + ' ' + oBackgroundPosition.y + 'px'
		});
	};
	SIMViewController.prototype.getBackgroungPosition				= function(p_$domElement){
		var sBackgroundXPosition,
			sBackgroundYPosition;

		if(p_$domElement.css('background-position')){
			var aBackgroundPosition	= this.$dayTimerGraphic.css('background-position').split(" ");
			sBackgroundXPosition	= aBackgroundPosition[0];
			sBackgroundYPosition	= aBackgroundPosition[1];
		}else{// ** For IE 8 (IE 8 does not recognize property background-position)
			sBackgroundXPosition	= this.$dayTimerGraphic.css('background-position-x');
			sBackgroundYPosition	= this.$dayTimerGraphic.css('background-position-y');
		}
		nBackgroundXPosition	= sBackgroundXPosition.substring(0, (sBackgroundXPosition.length-2));
		nBackgroundYPosition	= sBackgroundYPosition.substring(0, (sBackgroundYPosition.length-2));

		return {
			x	: nBackgroundXPosition,
			y	: nBackgroundYPosition
		};
	};
	SIMViewController.prototype.updateLocation						= function(p_sIncidentID, p_sEventID){
		var sLocation	= this.oIncidentController.getLocation(p_sIncidentID, p_sEventID);
		//Logger.logDebug('SIMViewController.updateLocation() |  Incident ID = '+p_sIncidentID+' : Event ID = '+ p_sEventID+' Location = '+sLocation);
		this.$location.html(sLocation);
	};
	SIMViewController.prototype.updateEventName						= function(p_sIncidentID, p_sEventID){
		var sEventName	= this.oIncidentController.getEventName(p_sIncidentID, p_sEventID);
		//Logger.logDebug('SIMViewController.updateEventName() |  Incident ID = '+p_sIncidentID+' : Event ID = '+ p_sEventID+' : Event Name = '+sEventName);
		this.$eventName.html(sEventName);
	};

	SIMViewController.prototype.isTrigger							= function(p_sTargetID){
		if(this.oTriggerTypes[p_sTargetID]){
			return true;
		}
		return false;
	};


	SIMViewController.prototype.addToTriggerTypes					= function(p_TriggerType){
		//Logger.logDebug('SIMViewController.addToTriggerTypes() | Trigger type "'+p_TriggerType+'"');
		if(!this.oTriggerTypes){this.oTriggerTypes = {};}
		if(!this.oTriggerTypes[p_TriggerType]){this.oTriggerTypes[p_TriggerType] = {}; return;}
		Logger.logWarn('SIMViewController.addToTriggerTypes() | Duplicate Trigger type "'+p_TriggerType+'" found.');
	};
	SIMViewController.prototype.addMsgSampleToTriggerTypes			= function(p_TriggerType, p_$triggerMsgSample){
		var oTriggerType		= this.getSelectedTriggerType(p_TriggerType);
			$triggerMsgSample	= oTriggerType.$msgSample;

		if($triggerMsgSample){Logger.logWarn('SIMViewController.addMsgSampleToTriggerTypes() | Replacing Message Sample for Trigger type "'+p_TriggerType+'".');}
		oTriggerType.$msgSample				= p_$triggerMsgSample;
		oTriggerType.$selectedTriggerMsg	= null;
		oTriggerType.nTriggerCount			= 0;
	};
	SIMViewController.prototype.addAudioIDToTriggerTypes			= function(p_TriggerType, p_sAudioID){
		var oTriggerType		= this.getSelectedTriggerType(p_TriggerType);
			sAudioID			= oTriggerType.audioID;

		if(sAudioID){Logger.logWarn('SIMViewController.addAudioIDToTriggerTypes() | Replacing Audio Details for Trigger type "'+p_TriggerType+'".');}
		oTriggerType.audioID	= p_sAudioID;
	};
	/*
	 * this.oTriggerTypes.call = {
	 * 	$msgSample 			: The selected Trigger Types Message sample,
	 * 	$selectedTriggerMsg : Reference to the selected Trigger Message for this Trigger Type,
	 * 	nTriggerCount		: Number of Trigger Samples used to Create DOM Trigger,
	 * 	interval			: The NEW Icon animation interval,
	 * 	audioID				: The audio ID that needs to be played when a new (Email / Meeting / Call) arrives
	 * }
	*/
	SIMViewController.prototype.getSelectedTriggerType				= function(p_TriggerType){
		var sTriggerType 	= p_TriggerType || this.sSelectedTriggerType,
			oTriggerType 	= this.oTriggerTypes[sTriggerType];
		//Logger.logDebug('SIMViewController.getSelectedTriggerType() | Trigger Type = '+sTriggerType);

		if(!sTriggerType){Logger.logWarn('SIMViewController.getSelectedTriggerType() | WARN: No Trigger type selected by the user.'); return;}
		if(!oTriggerType){Logger.logError('SIMViewController.getSelectedTriggerType() | ERROR: No Trigger type "'+sTriggerType+'" found.');}
		//Logger.logDebug('SIMViewController.getSelectedTriggerType() | Trigger Type = '+sTriggerType+' : oTriggerType = '+oTriggerType);

		return oTriggerType;
	};
	SIMViewController.prototype.getSelectedTriggerMsgSample			= function(p_TriggerType){
		//Logger.logDebug('SIMViewController.getSelectedTriggerMsgSample() | ');
		var oTriggerType		= this.getSelectedTriggerType(p_TriggerType),
			$triggerMsgSample	= oTriggerType.$msgSample;

		if(!$triggerMsgSample){Logger.logWarn('SIMViewController.getSelectedTriggerMsgSample() | No Trigger Message Sample found for "'+(p_TriggerType || this.sSelectedTriggerType)+'" type.');}

		oTriggerType.nTriggerCount++;

		return $triggerMsgSample;
	};
	SIMViewController.prototype.getSelectedTriggerMsg				= function(p_TriggerType){
		//Logger.logDebug('SIMViewController.getSelectedTriggerMsg() | For Type = '+p_TriggerType);
		var oTriggerType		= this.getSelectedTriggerType(p_TriggerType);
		if(!oTriggerType){Logger.logWarn('SIMViewController.getSelectedTriggerType() | WARN: No Trigger type selected by the user.'); return;}

		var $selectedTriggerMsg	= oTriggerType.$selectedTriggerMsg;
		if(!$selectedTriggerMsg){
			//Logger.logWarn('SIMViewController.getSelectedTriggerMsg() | WARN: No Trigger Message currently selected for "'+(p_TriggerType || this.sSelectedTriggerType)+'" type.');
		}

		return $selectedTriggerMsg;
	};
	SIMViewController.prototype.setSelectedTriggerMsg				= function(p_TriggerType, p_$triggerMsg){
		//Logger.logDebug('SIMViewController.setSelectedTriggerMsg() | Trigger Type = '+p_TriggerType+' : Trigger Msg = '+p_$triggerMsg);
		var oTriggerType		= this.getSelectedTriggerType(p_TriggerType),
			$selectedTriggerMsg	= oTriggerType.$selectedTriggerMsg;

		if(!$selectedTriggerMsg){
			Logger.logWarn('SIMViewController.setSelectedTriggerMsg() | No Trigger Message currently selected for "'+(p_TriggerType || this.sSelectedTriggerType)+'" type.');
		}else{
			$selectedTriggerMsg.removeClass('selected');
		}

		oTriggerType.$selectedTriggerMsg = p_$triggerMsg;
		oTriggerType.$selectedTriggerMsg.addClass('selected');
	};
	/*
	 * Keeps the "$msgSample" intact, but resets the "nTriggerCount" and the "$selectedTriggerMsg"
	 */
	SIMViewController.prototype.resetSelectedTriggerMsg				= function(){
		//Logger.logDebug('SIMViewController.resetSelectedTriggerInfo() | '+JSON.stringify(this.oTriggerTypes));
		for(var sTriggerType in this.oTriggerTypes){
			var oTriggerType	= this.oTriggerTypes[sTriggerType];
			if(oTriggerType.$selectedTriggerMsg){
				oTriggerType.$selectedTriggerMsg.removeClass('selected');
				oTriggerType.$selectedTriggerMsg = undefined;
			}
			oTriggerType.nTriggerCount	= 0;
		}
	};





	SIMViewController.prototype.getElementByID 						= function(p_sID){
		var $elem = this.$domView.find('#'+p_sID);
		if($elem.length == 0){Logger.logError('SIMViewController.getElementByID() | Element with ID "'+p_sID+'" not found.');}
		if($elem.length > 1){Logger.logWarn('SIMViewController.getElementByID() | Multiple Elements with ID "'+p_sID+'" found.');}
		return $elem;
	};

	SIMViewController.prototype.createEventDecisionHolder			= function(p_sIncidentID, p_sEventID){
		var $elem 		= this.getEventDecisionHolder(p_sIncidentID, p_sEventID);

		if($elem.length > 1){Logger.logError('SIMViewController.createEventDecisionHolder() | More than 1 element found in the DOM with the same Event ID "'+p_sIncidentID+'$'+p_sEventID+'"');}

		if($elem.length === 0){
			$elem = $('<div></div>').attr('id', this.getEventDecisionHolderName(p_sIncidentID, p_sEventID));
			this.$decisionHolder.append($elem);
			//Logger.logDebug('SIMViewController.createEventDecisionHolder() | '+sElementID+' = '+$elem);
			return $elem;
		}

		return $elem;
	};
	SIMViewController.prototype.getEventDecisionHolder				= function(p_sIncidentID, p_sEventID){
		var sElementID	= this.getEventDecisionHolderName(p_sIncidentID, p_sEventID),
			$elem 		= this.$decisionHolder.find('#'+sElementID);
		//Logger.logDebug('SIMViewController.getEventDecisionHolder() | '+sElementID+' = '+$elem.length);
		return $elem;
	};
	SIMViewController.prototype.getEventDecisionHolderName			= function(p_sIncidentID, p_sEventID){
		//var sElementID	= 'incident_'+p_sIncidentID+'__event_'+p_sEventID;
		var sElementID	= 'i'+p_sIncidentID+'_e'+p_sEventID;
		return sElementID;
	};

	SIMViewController.prototype.showButton							= function(p_$btn, p_bShow){
		(p_bShow) ? p_$btn.removeClass('hide') : p_$btn.addClass('hide');
	};
	SIMViewController.prototype.enableButton						= function(p_$btn, p_bEnable){
		(p_bEnable) ? p_$btn.removeClass('disabled') : p_$btn.addClass('disabled');
	};

	/* ************** START - Methods to create and maintain the Data Store ************** */
	SIMViewController.prototype.getDSData							= function(p_sIncidentID, p_sEventID){
		var oDS	= this.oDataStore[p_sIncidentID+'$'+p_sEventID];
		if(!oDS){
			// ** Each Event ID being unique all data required for an Event will be stored in this unique variable
			this.oDataStore[p_sIncidentID+'$'+p_sEventID] = {};
			oDS				= this.oDataStore[p_sIncidentID+'$'+p_sEventID];
			oDS.incidentID	= p_sIncidentID;
			oDS.eventID		= p_sEventID;
			//Logger.logDebug('SIMViewController.getDSData() | No Data found for "'+p_sIncidentID+'$'+p_sEventID+'" in Data Store.');
		}
		return oDS;
	};
	SIMViewController.prototype.addTriggerToDS						= function(p_sTriggerMsgID, p_oTrigger, p_$domTrigger){
		//Logger.logDebug('SIMViewController.addTriggerToDS() | '+p_sTriggerMsgID+' : $Trigger ID = '+p_$domTrigger.attr('id'));
		var sIncidentID	= this.getTriggerIncidentID(p_sTriggerMsgID),
			sEventID	= this.getTriggerEventID(p_sTriggerMsgID),
			sTriggerID	= this.getTriggerID(p_sTriggerMsgID),
			oDS			= this.getDSData(sIncidentID, sEventID);

		if(!oDS.oTriggerList){oDS.oTriggerList = {};}
		if(oDS.oTriggerList[p_sTriggerMsgID]){Logger.logWarn('SIMViewController.addTriggerToDS() | Replacing Trigger with the trigger ID "'+p_sTriggerMsgID+'".');}

		oDS.oTriggerList[p_sTriggerMsgID] = {trigger		: p_oTrigger,
											 $triggerMsg	: p_$domTrigger};
		//Logger.logDebug('\tTrigger Obj = '+oDS.oTriggerList[p_sTriggerMsgID].trigger);
	};
	SIMViewController.prototype.removeAllTriggersFromDS				= function(){
		//Logger.logDebug('SIMViewController.removeAllTriggersFromDS() | ');
		for(var prop in this.oDataStore){
			var pointer			= this.oDataStore[prop],
				oTriggerList	= pointer.oTriggerList;

			// ** DEBUG
			/*var aTemp = prop.split('$');
			Logger.logDebug('\tIncident ID = '+aTemp[0]+' : Event ID = '+aTemp[1]);*/


			if(oTriggerList){
				for(var sTriggerMsgID in oTriggerList){
					var oTriggerMsgPointer	= oTriggerList[sTriggerMsgID];
					//Logger.logDebug('\t\tTrigger Msg ID = '+sTriggerMsgID+' : $Trigger ID = '+oTriggerMsgPointer.$triggerMsg.attr('id')+' : Trigger Obj = '+oTriggerMsgPointer.trigger);
					//try{
						oTriggerMsgPointer.$triggerMsg.css('border', '2px solid green');
						oTriggerMsgPointer.$triggerMsg.remove();
						oTriggerMsgPointer.$triggerMsg.parent().empty();
						oTriggerMsgPointer.trigger		= null;
						oTriggerMsgPointer.$triggerMsg	= null;
					//}catch(e){}
				}
				oTriggerMsgPointer = null;
			}
			oTriggerList = null;
			pointer		= null;
		}

		//this.oDataStore = null;
		this.oDataStore = {};
	};
	SIMViewController.prototype.getTriggerFromDS					= function(p_sTriggerMsgID){
		//Logger.logDebug('SIMViewController.getTriggerFromDS() | '+p_sTriggerMsgID);
		var sIncidentID		= this.getTriggerIncidentID(p_sTriggerMsgID),
			sEventID		= this.getTriggerEventID(p_sTriggerMsgID),
			sTriggerID		= this.getTriggerID(p_sTriggerMsgID),
			oTriggerList	= this.getDSData(sIncidentID, sEventID).oTriggerList;

		if(!oTriggerList){Logger.logError('SIMViewController.getTriggerFromDS() | List of Triggers not found for "'+sIncidentID+'$'+sEventID+'" in Data Store.');}
		var oTriggerData = oTriggerList[p_sTriggerMsgID];
		if(!oTriggerData){Logger.logError('SIMViewController.getTriggerFromDS() | No Trigger with ID "'+p_sTriggerMsgID+'" found in Data Store.');}

		return oTriggerData;
	};
	SIMViewController.prototype.setTriggerState						= function(p_sTriggerMsgID, p_sState){
		//Logger.logDebug('SIMViewController.setTriggerState() | Trigger ID = '+p_sTriggerMsgID+' : State = '+p_sState);
		var sState			= p_sState.toUpperCase(),
			oTriggerData 	= this.getTriggerFromDS(p_sTriggerMsgID);

		if(!(sState === 'READ' || sState === 'UNREAD')){Logger.logError('SIMViewController.setTriggerState() | Invalid Trigger STATE "'+p_sState+'". Valid states are "READ" or "UNREAD".');}

		oTriggerData.trigger.setState(sState);
		var $triggerIcon = oTriggerData.$triggerMsg.find('.trigger-icon');
		(sState === 'READ') ? $triggerIcon.addClass('visited') : $triggerIcon.removeClass('visited');
	};
	// ** TODO: Think of a name for this method
	SIMViewController.prototype._updateAllTriggerStatusIcons		= function(){
		//Logger.logDebug('SIMViewController._updateAllTriggerStatusIcons() | ');
		for(var prop in this.oDataStore){
			var pointer			= this.oDataStore[prop],
				oTriggerList	= pointer.oTriggerList;

			// ** DEBUG
			//var aTemp = prop.split('$');
			//Logger.logDebug('\tIncident ID = '+aTemp[0]+' : Event ID = '+aTemp[1]);

			if(oTriggerList){
				for(var sTriggerMsgID in oTriggerList){
					this.updateTriggerStatusIcon(sTriggerMsgID);
				}
			}
		}
	};
	SIMViewController.prototype.updateAllTriggerStatusIcons			= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.updateAllTriggerStatusIcons() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oTriggerList	= this.getDSData(p_sIncidentID, p_sEventID).oTriggerList,
			sTriggerMsgID;

		for(sTriggerMsgID in oTriggerList){
			//this.setTriggerStatus(sTriggerMsgID, p_sStatus);
			this.updateTriggerStatusIcon(sTriggerMsgID);
		}
	};
    SIMViewController.prototype.updateTriggerStatusIcon				= function(p_sTriggerMsgID){
        //Logger.logDebug('SIMViewController.updateTriggerStatusIcon() | Trigger ID = '+p_sTriggerMsgID);
        var oTriggerData        = this.getTriggerFromDS(p_sTriggerMsgID),
            oTrigger            = oTriggerData.trigger,
            sEventState         = oTrigger.getEventState(),
            oTriggerIconClass   = this.getTriggerStatusClass(sEventState);

        var $triggerStatus = oTriggerData.$triggerMsg.find('.trigger-status');
        $triggerStatus.addClass(oTriggerIconClass.addClass).removeClass(oTriggerIconClass.removeClass);
    };
    SIMViewController.prototype.getTriggerStatusClass				= function(p_sEventState){
		var aClasses			= ['icon-started',
								   'icon-active',
								   'icon-inactive',
								   'icon-deferred',
								   'icon-timeexpired',
								   'icon-failed',
								   'icon-completed'],
			sClassToAdd			= 'icon-'+p_sEventState.toLowerCase(),
			nClassToAddIndex	= aClasses.indexOf(sClassToAdd),
			aClassToAdd			= aClasses.splice(nClassToAddIndex, 1),
			sClassToAdd			= aClassToAdd.join(''),
			sClassToRemove		= aClasses.join(' ');
		//Logger.logDebug('SIMViewController.getTriggerStatusClass() | Add = '+sClassToAdd+' : Remove = '+sClassToRemove);

		return {addClass:sClassToAdd, removeClass:sClassToRemove};
    };

	SIMViewController.prototype.updateNewOnTriggerTypes				= function(p_sTriggerMsgID){
		//Logger.logDebug('SIMViewController.updateNewOnTriggerTypes() | p_sTriggerMsgID = '+p_sTriggerMsgID);
		var oTriggerData		= this.getTriggerFromDS(p_sTriggerMsgID),
			oTrigger			= oTriggerData.trigger,
            sTriggerType		= oTrigger.getType(),
            aTriggerList		= this.getTriggersOfType(sTriggerType),
            nUnreadTriggerCount	= 0;
		//Logger.logDebug('SIMViewController.updateNewOnTriggerTypes() | sTriggerType = '+sTriggerType);

		for (var i=0; i < aTriggerList.length; i++) {
			var oTriggerData	= aTriggerList[i],
				oTrigger		= oTriggerData.trigger,
				sTriggerState	= oTrigger.getState();

			if(sTriggerState === 'UNREAD'){
				nUnreadTriggerCount++;
			}
		};
		var $triggerTypeIcon = this.getElementByID(sTriggerType);
		//Logger.logDebug('\tUnread Msgs Count	= '+nUnreadTriggerCount);
		if(nUnreadTriggerCount > 0){
			if(Number($triggerTypeIcon.find('.new-count').html()) === nUnreadTriggerCount){return;}
			$triggerTypeIcon.addClass('new');
			$triggerTypeIcon.find('.new-count').removeClass('hide').html(nUnreadTriggerCount);
			this.dispatchEvent('PLAY_AUDIO', {type:'PLAY_AUDIO', target:this, audioID:this.getSelectedTriggerType(sTriggerType).audioID});
			this.animateNewIconForTriggerType(sTriggerType, true);
		}else if(nUnreadTriggerCount === 0){
			$triggerTypeIcon.removeClass('new');
			$triggerTypeIcon.find('.new-count').addClass('hide').html('');
			this.animateNewIconForTriggerType(sTriggerType, false);
		}
	};
	SIMViewController.prototype.getTriggersOfType					= function(p_sTriggerType){
		//Logger.logDebug('SIMViewController.getTriggersOfType() | p_sTriggerType = '+p_sTriggerType);
		var aTriggerList	= [];

		for(var prop in this.oDataStore){
			var pointer			= this.oDataStore[prop],
				oTriggerList	= pointer.oTriggerList;

			// ** DEBUG
			//var aTemp = prop.split('$');
			//Logger.logDebug('\tIncident ID = '+aTemp[0]+' : Event ID = '+aTemp[1]);

			if(oTriggerList !== undefined){
				for(var sTriggerMsgID in oTriggerList){
					//Logger.logDebug('\tsTriggerMsgID = '+sTriggerMsgID);
					var oTriggerData		= this.getTriggerFromDS(sTriggerMsgID),
						oTrigger			= oTriggerData.trigger,
			            sTriggerType		= oTrigger.getType();
					//Logger.logDebug('SIMViewController.getTriggersOfType() | p_sTriggerType = '+p_sTriggerType+' : sTriggerType = '+sTriggerType);
			        if(p_sTriggerType === sTriggerType){
						aTriggerList.push(oTriggerData);
			        }
				}
			}
		}

		return aTriggerList;
	};
	SIMViewController.prototype.animateNewIconForTriggerType		= function(p_sTriggerType, p_bAnimate){
		if(p_bAnimate){
			var oScope					= this,
				nCurrentAnimationStep	= -1,
				nMaxStepsToAnimate		= 3,
				nLoopTimes				= 0,
				nMaxLoops				= 6;

			clearInterval(this.getSelectedTriggerType(p_sTriggerType).interval);
			this.getElementByID(p_sTriggerType).removeClass('s1 s2 s3');

			this.getSelectedTriggerType(p_sTriggerType).interval = setInterval(function () {
				nCurrentAnimationStep++;
				if(nCurrentAnimationStep > nMaxStepsToAnimate){
					nCurrentAnimationStep = 0;
					nLoopTimes++;
				}
				if(nLoopTimes >= nMaxLoops){oScope.animateNewIconForTriggerType(p_sTriggerType, false); return;}
				oScope.animateNewIcon(oScope.getElementByID(p_sTriggerType), nCurrentAnimationStep);
			}, 100);
		}else{
			clearInterval(this.getSelectedTriggerType(p_sTriggerType).interval);
			this.getElementByID(p_sTriggerType).removeClass('s1 s2 s3');
		}
	};
	SIMViewController.prototype.animateNewIcon						= function(p_$TriggerType, p_nCurrentAnimationStep){
		//Logger.logDebug('SIMViewController.animateNewIcon() | Current Animation Step = '+p_nCurrentAnimationStep);
		var aSteps			= ['s1', 's2', 's3'],
			sClassToRemove	= (p_nCurrentAnimationStep === 0) ? aSteps[aSteps.length - 1] : aSteps[p_nCurrentAnimationStep - 1];

		p_$TriggerType.removeClass(sClassToRemove).addClass(aSteps[p_nCurrentAnimationStep]);
	};
	SIMViewController.prototype.resetAllNewIconForTriggerTypes		= function(){
		for(var sTriggerType in this.oTriggerTypes){
			var oTriggerType	= this.oTriggerTypes[sTriggerType];
			//Logger.logDebug('SIMViewController.resetAllNewIconForTriggerTypes() | sTriggerType = '+sTriggerType);
			clearInterval(oTriggerType.interval);
			oTriggerType.interval = undefined;
			var $triggerTypeIcon = this.getElementByID(sTriggerType);
			$triggerTypeIcon.removeClass('new');
			$triggerTypeIcon.find('.new-count').addClass('hide').html('');
			$triggerTypeIcon.removeClass('s1 s2 s3');
		}
	};

	/*
	SIMViewController.prototype.addDecisionPagesModelsToDS			= function(p_sIncidentID, p_sEventID, p_aDecisionPageModels){
		//Logger.logDebug('SIMViewController.addDecisionPagesToDS() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oDS			= this.getDSData(p_sIncidentID, p_sEventID);

		if(oDS.aDecisionPageModels){Logger.logWarn('Replacing Decision Pages for Incident ID "'+p_sIncidentID+'" and Event ID "'+p_sEventID+'" as it already exists.');}

		oDS.aDecisionPageModels = p_aDecisionPageModels;
		oDS.nCurrentDecision	= -1;
	};*/
	SIMViewController.prototype.getAllDecisionPageModels			= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.getAllDecisionPageModels() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oDS					= this.getDSData(p_sIncidentID, p_sEventID),
			aDecisionPageModels	= oDS.aDecisionPageModels;

		if(!aDecisionPageModels){Logger.logError('SIMViewController.getAllDecisionPageModels() | No Decision Page Models found in Incident "'+oDS.incidentID+'" Event "'+oDS.eventID+'"');}

		return aDecisionPageModels;
	};
	SIMViewController.prototype.getDecisionPageModel				= function(p_sIncidentID, p_sEventID, p_nAdd){
		//Logger.logDebug('SIMViewController.getDecisionPageModel() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : nIndex = '+(p_nAdd));
		var oDS					= this.getDSData(p_sIncidentID, p_sEventID),
			aDecisionPageModels	= oDS.aDecisionPageModels;

		oDS.nCurrentDecision	= (p_nAdd) ? oDS.nCurrentDecision + p_nAdd : oDS.nCurrentDecision;

		if(!aDecisionPageModels){Logger.logError('SIMViewController.getDecisionPageModel() | No Decision Page Models found in Incident "'+oDS.incidentID+'" Event "'+oDS.eventID+'"');}

		if(oDS.nCurrentDecision > aDecisionPageModels.length-1) {return null;}

		return aDecisionPageModels[oDS.nCurrentDecision];
	};
	SIMViewController.prototype.getPrevDecisionPageModel			= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.getPrevDecisionPageModel() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oDecisionPageModel	= this.getDecisionPageModel(p_sIncidentID, p_sEventID, -1);

		if(!oDecisionPageModel){Logger.logWarn('SIMViewController.getNextDecisionPageModel() | No Decision Page Modle found at index "'+this.getDSData(p_sIncidentID, p_sEventID).nCurrentDecision+'"');}

		return oDecisionPageModel;
	};
	SIMViewController.prototype.getNextDecisionPageModel			= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.getNextDecisionPageModel() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oDecisionPageModel	= this.getDecisionPageModel(p_sIncidentID, p_sEventID, 1);

		if(!oDecisionPageModel){Logger.logError('SIMViewController.getNextDecisionPageModel() | No Decision Page Modle found at index "'+this.getDSData(p_sIncidentID, p_sEventID).nCurrentDecision+'"');}

		return oDecisionPageModel;
	};
	SIMViewController.prototype.isLastDecisionPageModel				= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.isLastDecisionPageModel() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oDS					= this.getDSData(p_sIncidentID, p_sEventID);
		if(oDS.nCurrentDecision === (this.getAllDecisionPageModels(p_sIncidentID, p_sEventID).length-1)){return true;}
		return false;
	};




	SIMViewController.prototype.addDecisionPageObjectToDS			= function(p_sIncidentID, p_sEventID, p_sDecisionID, p_oDecisionPageViewController){
		//Logger.logDebug('SIMViewController.addDecisionPageObjectToDS() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : sDecision ID = '+p_sDecisionID);
		var oDS							= this.getDSData(p_sIncidentID, p_sEventID);
		if(!oDS.aDecisionPageObjectList){oDS.aDecisionPageObjectList = [];}
		oDS.aDecisionPageObjectList[p_sDecisionID] = oDS.aDecisionPageObjectList.length;
		oDS.aDecisionPageObjectList.push(p_oDecisionPageViewController);
	};
	SIMViewController.prototype.removeDecisionPageObjectFromDS		= function(p_sIncidentID, p_sEventID, p_sDecisionID){
		//Logger.logDebug('SIMViewController.removeDecisionPageObjectFromDS() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : sDecision ID = '+p_sDecisionID);
		var aDecisionPageObjectList		= this.getDecisionPageObjectListFromDS(p_sIncidentID, p_sEventID),
			index						= aDecisionPageObjectList[p_sDecisionID],
			oDecisionPageObject			= aDecisionPageObjectList.splice(index, 1)[0];

		if(oDecisionPageObject){
			oDecisionPageObject.destroy();
			aDecisionPageObjectList[p_sDecisionID] = null;
			return true;
		}
		return false;
	};
	SIMViewController.prototype.removeAllDecisionPageObjectFromDS	= function(){
		Logger.logDebug('SIMViewController.removeAllDecisionPageObjectFromDS() | ');
		for(var prop in this.oDataStore){
			var pointer							= this.oDataStore[prop],
				aDecisionPageObjectListPointer	= pointer.aDecisionPageObjectList;

			// ** DEBUG
			//var aTemp = prop.split('$');
			//Logger.logDebug('\tIncident ID = '+aTemp[0]+' : Event ID = '+aTemp[1]);

			if(aDecisionPageObjectListPointer){
				for (var i=0; i < aDecisionPageObjectListPointer.length; i++) {
					var oDecisionPageObject	=	aDecisionPageObjectListPointer[i];
					oDecisionPageObject.destroy();
				};
				aDecisionPageObjectListPointer = null;
			}
		}
		this.$decisionHolder.children().each(function(index, element){
			//Logger.logDebug('$$$$$$$$$$$$$$ REMOVING $$$$$$$$$$$$$$ '+$(this).attr('id'));
			$(this).remove();
		});
	};
	SIMViewController.prototype.getDecisionPageObjectFromDS			= function(p_sIncidentID, p_sEventID, p_sDecisionID){
		//Logger.logDebug('SIMViewController.getDecisionPageObjectFromDS() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : sDecision ID = '+p_sDecisionID);
		var aDecisionPageObjectList		= this.getDecisionPageObjectListFromDS(p_sIncidentID, p_sEventID),
			index						= aDecisionPageObjectList[p_sDecisionID],
			oDecisionPageObject			= aDecisionPageObjectList[index];
		return oDecisionPageObject;
	};
	SIMViewController.prototype.getDecisionPageObjectListFromDS		= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('SIMViewController.getDecisionPageObjectListFromDS() | Incident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID+' : sDecision ID = '+p_sDecisionID);
		var oDS							= this.getDSData(p_sIncidentID, p_sEventID);
		return oDS.aDecisionPageObjectList;
	};




	SIMViewController.prototype.getTriggerIncidentID				= function(p_sTriggerMsgID){
		/*
		 * Sample Trigger Msg ID - "trigger_1_1_4"
		 */
		var nStartIndex		= p_sTriggerMsgID.indexOf('_')+1,
			nEndIndex		= p_sTriggerMsgID.indexOf('_', nStartIndex),
			sIncidentID		= p_sTriggerMsgID.substring(nStartIndex, nEndIndex);
		//var sIncidentID	= p_sTriggerMsgID.substring(p_sTriggerMsgID.indexOf('_')+1, p_sTriggerMsgID.indexOf('~'));
		//Logger.logDebug('SIMViewController.getTriggerIncidentID() | '+sIncidentID);
		return sIncidentID;
	};
	SIMViewController.prototype.getTriggerEventID					= function(p_sTriggerMsgID){
		var nEndIndex       = p_sTriggerMsgID.lastIndexOf('_'),
			nStartIndex		= p_sTriggerMsgID.lastIndexOf('_', nEndIndex-1)+1,
			sEventID		= p_sTriggerMsgID.substring(nStartIndex, nEndIndex);
		//var sEventID	= p_sTriggerMsgID.substring(p_sTriggerMsgID.indexOf('~')+1, p_sTriggerMsgID.lastIndexOf('_'));
		//Logger.logDebug('SIMViewController.getTriggerEventID() | '+sEventID);
		return sEventID;
	};
	SIMViewController.prototype.getTriggerID						= function(p_sTriggerMsgID){
		var sTriggerID	= p_sTriggerMsgID.substring(p_sTriggerMsgID.lastIndexOf('_')+1, p_sTriggerMsgID.length);
		//Logger.logDebug('SIMViewController.getTriggerID() | '+sTriggerID);
		return sTriggerID;
	};
	/* ************** END - Methods to create and maintain the Data Store ************** */

	SIMViewController.prototype.capitaliseFirstLetter				= function(string){
	    return string.charAt(0).toUpperCase() + string.slice(1);
	};

	SIMViewController.prototype.toString 							= function(){
		return 'framework/simulation/viewcontroller/SIMViewController';
	};

	SIMViewController.prototype.destroy								= function(){
		this.$infoPanel						= null;
		this.$informationBar				= null;
		this.$informationPanel				= null;

		this.$btnMaximize					= null;
		this.$btnMinimize					= null;
		this.$eventsPanel					= null;
		this.$eventName						= null;
		this.$whichDay						= null;
		this.$dayTimerText					= null;
		this.$dayTimerGraphic				= null;
		this.$location						= null;
		this.$decisionHolder				= null;

		this.$btnAct				 		= null;
		this.$btnDefer				 		= null;
		this.$btnUnDefer				 	= null;
		this.$btnDayCompleteContinue		= null;
		this.$imgBigTriggerIcon				= null;
		this.$btnItext				 		= null;

		this.$btnEventsPanelToggle			= null;
		this.$domView						= null;
		this.handleEvents				 	= null;
		this.bDayComplete					= null;
	};
	return SIMViewController;
});