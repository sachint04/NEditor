define([
	'jquery',
	'x2js',
	'framework/simulation/model/Incident',
	'framework/simulation/model/IncidentEvent',
	'framework/model/CourseConfigModel',
	'framework/utils/VariableManager',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Timer',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function($, X2JS, Incident, IncidentEvent, CourseConfig, VariableManager, EventDispatcher, Globals, Timer, ResourceLoader, Logger){

	function IncidentController(p_DITLController) {
		//Logger.logDebug('IncidentController.CONSTRUCTOR() | Incident Config XML = '/*+p_xmlIncidentConfig+' : Incident Events XML = '+p_xmlIncidentEvents*/);
		EventDispatcher.call(this);

		this.sEventPrefix 						= 'event_';
		this.sIncidentPrefix 					= 'incident_';
		this.nCurrentDay						= 1;
		this.bDayTimeOver						= false;
		this.bLastDay							= undefined;

		// ** Defaults
		this.nMinIncidentsPerDayDefault			= 3;
		this.nMaxIncidentsPerDayDefault			= 5;
		this.nEventsPerDayDefault				= 1;
		this.nDayTimeLimitDefault				= 15;
		this.nExtraTimeDefault					= 15;
		this.oEventsIntervalDefaults			= {min:3, max:5};

		// ** Object Instance References
		this.DITLControllerRef					= p_DITLController;
		this.oSIMViewController;
		this.oIncidents;
		this.oIncidentEvents;
		this.oActiveIncidentEvent;
		this.oFeedbackPageModel;

		// ** Runtime Variables & Objects
		this.nCurrentIncident;
		this.aSelectedIncidents;

		this.oDayTimer;
		this.oEventsIntervalTimer;

		this.oTextDefaults;
		this.oPopupData;
		this.bDayOver			= false;

		this.oContext;
		this.fCallback;
		this.aArgs;

		// ** Simtree Config XML varaibles
		this.bRandomizeIncidents;
		this.nMinIncidentsPerDay;
		this.nMaxIncidentsPerDay;
		this.nEventsPerDay;
		this.nNoOfDays;
		this.bTriggerAllIncidentsOnLastDay;
		this.nDayTimeLimit;
		this.nExtraTime;
		this.bDeferEvents;
		this.oEventsInterval;
		this.oDayStartsAt;

		//this.parseIncidentConfig(p_xmlIncidentConfig, p_xmlIncidentEvents);
		this.handleEvents = this.handleEvents.bind(this);
	}

	IncidentController.prototype									= Object.create(EventDispatcher.prototype);
	IncidentController.prototype.constructor						= IncidentController;

	IncidentController.prototype.parseIncidentConfig 				= function(p_xmlIncidentConfig, p_oContext, p_fCallback, p_aArgs){
		this.oIncidents 			= {};
		//this.oIncidents.length		= 0;
		var oScope 					= this,
			$incidentNode			= $(p_xmlIncidentConfig),
			temp;

		this.bRandomizeIncidents 			= ($incidentNode.attr('randomizeIncidents') === 'true') ? true : false;
		this.nMinIncidentsPerDay 			= Number($incidentNode.attr('minIncidentsPerDay')) || this.nMinIncidentsPerDayDefault;
		this.nMaxIncidentsPerDay 			= Number($incidentNode.attr('maxIncidentsPerDay')) || this.nMaxIncidentsPerDayDefault;
		this.nEventsPerDay					= Number($incidentNode.attr('eventsPerDay')) || this.nEventsPerDayDefault;
		this.nNoOfDays						= Number($incidentNode.attr('noOfDays')) || -1;
		this.bTriggerAllIncidentsOnLastDay	= ($incidentNode.attr('triggerAllIncidentsOnLastDay') === 'true') ? true : false;
		this.nDayTimeLimit					= Number($incidentNode.attr('dayTimeLimit')) || this.nDayTimeLimitDefault;
		this.nExtraTime 					= Number($incidentNode.attr('extraTime')) || this.nExtraTimeDefault;
		this.bDeferEvents 					= ($incidentNode.attr('deferEvents') === 'true') ? true : false;
		temp 								= $incidentNode.attr('eventsInterval').split('-');
		this.oEventsInterval 				= (temp[0] != '' && temp[1] != '') ? {min:Number(temp[0]), max:Number(temp[1])} : this.oEventsIntervalDefaults;

		var hrs, mins, secs, ampm;
		temp = $incidentNode.attr('dayStartsAt');
		if(temp.indexOf(' ') != -1){
			var temp_1 = temp.split(' ');
			ampm = temp_1.pop().toUpperCase();
			temp = [temp_1[0]];
		}else{
			temp = temp.split(':');
		}
		ampm = (ampm == 'AM' || ampm == 'PM') ? ampm : 'am';
		if(temp[0] !== ''){
			temp	= temp[0].split(':');
			hrs		= temp[0] || 0;
			mins	= temp[1] || 0;
			secs	= temp[2] || 0;
		}else{
			hrs = 0, mins = 0, secs = 0;
		}
		this.oDayStartsAt 			= {
										hrs:Number(hrs),
										mins:Number(mins),
										secs:Number(secs),
										ampm:ampm
									  };
		//Logger.logDebug('IncidentController.parseIncidentConfig() | '+oScope.toString());

		/*
		$incidentNode.children().each(function(index, element){
					//Logger.logDebug('IncidentController.parseIncidentConfig() | Scope = '+oScope.toString()+' : Node Name = '+element.nodeName+' : '+Globals.toXMLString(element));
					var sIncidentID			= element.getAttribute('id'),
						nIncidentDay		= element.getAttribute('day') || "",
						bIncidentDependant	= element.getAttribute('dependant') || false;

					var oIncident = new Incident(sIncidentID, nIncidentDay, bIncidentDependant);
						oIncident.setIncidentControllerReference(oScope);
					oScope.oIncidents[oScope.sIncidentPrefix + sIncidentID] = oIncident;
					oScope.addIncidentListeners(oIncident);
					//oScope.oIncidents.length = oScope.oIncidents.length++;
				});*/
		this.parseIncidents($incidentNode);

		if(p_fCallback){
			p_aArgs = p_aArgs || [];
			p_aArgs.unshift(p_oContext, this);
			p_fCallback.apply(p_oContext, p_aArgs);
		}
	};

	IncidentController.prototype.parseIncidents						= function(p_$incidentNode, p_oContext, p_fCallback, p_aArgs){
		//Logger.logDebug('IncidentController.parseIncidents() | :: START ::');
		var oScope			= this,
			$incidentNode	= p_$incidentNode;

		$incidentNode.children().each(function(index, element){
			//Logger.logDebug('IncidentController.parseIncidentConfig() | Scope = '+oScope.toString()+' : Node Name = '+element.nodeName+' : '+Globals.toXMLString(element));
			var sIncidentID			= element.getAttribute('id'),
				nIncidentDay		= element.getAttribute('day') || "",
				bIncidentDependant	= element.getAttribute('dependant') || false;

			var oIncident = new Incident(sIncidentID, nIncidentDay, bIncidentDependant);
				oIncident.setIncidentControllerReference(oScope);
			oScope.oIncidents[oScope.sIncidentPrefix + sIncidentID] = oIncident;
			//oScope.addIncidentListeners(oIncident);
			//oScope.oIncidents.length = oScope.oIncidents.length++;
		});
		//Logger.logDebug('IncidentController.parseIncidents() | :: END ::');
	};
	IncidentController.prototype.addIncidentListeners				= function(p_oIncident){
		//Logger.logDebug('IncidentController.addIncidentListeners() | Incident ID = '+p_oIncident.getID());
		//p_oIncident.addEventListener('GOTO_EVENT', this.handleEvents);
		//p_oIncident.addEventListener('EVENT_COMPLETE', this.handleEvents);
	};
	IncidentController.prototype.removeIncidentListeners			= function(p_oIncident){
		//Logger.logDebug('IncidentController.removeIncidentListeners() | Incident ID = '+p_oIncident.getID());
		//p_oIncident.addEventListener('GOTO_EVENT', this.handleEvents);
		//p_oIncident.addEventListener('EVENT_COMPLETE', this.handleEvents);
	};

	IncidentController.prototype.parseIncidentEvents				= function(p_xmlIncidentEvents, p_oContext, p_fCallback, p_aArgs){
		//Logger.logDebug('IncidentController.parseIncidentEvents() | :: START ::');
		this.oIncidentEvents = {};
		var oScope = this,
			$incidentEvents = $(p_xmlIncidentEvents);

		//this.handleEvents = this.handleEvents.bind(this);

		$incidentEvents.children().children().children().each(function(index, element){
			var sNodeName = element.nodeName,
				sEventID = element.getAttribute('id'),
				sIncidentID = element.getAttribute('incidentid');
			//Logger.logDebug('\nNode Name = '+sNodeName+' : Incident ID = '+sIncidentID+' : sEventID = '+sEventID);
			if(sNodeName === 'event'){
				//var oIncident = oScope.oIncidents[oScope.sIncidentPrefix + sIncidentID];
				var oIncident = oScope.getIncidentByID(sIncidentID);

				/*
				 * Check If the Incident is declared in the SIM Config File
				 */
				if(!oIncident){Logger.logError('IncidentController.parseIncidentEvents() | Invalid Incident ID. Incident with ID "'+sIncidentID+'" not declared in SIM Config XML.');}

				/*
				 * Check for duplicate Event ID's
				 */
				if(oScope.oIncidentEvents[sEventID]){Logger.logError('IncidentController.parseIncidentEvents() | Invalid Event ID. Duplicate Event with ID "'+sEventID+'" found in Incident ID "'+sIncidentID+'".');}

				var oIncidentEvent = new IncidentEvent(element);
				oIncident.addIncidentEvent(oIncidentEvent);
				oScope.addIncidentEventListeners(oIncidentEvent);
				oScope.oIncidentEvents[oScope.sEventPrefix + sEventID] = oIncidentEvent;
			}
		});
		//Logger.logDebug('IncidentController.parseIncidentEvents() | :: END ::');
		this.initializeIncidents();

		if(p_fCallback){
			p_aArgs = p_aArgs || [];
			p_aArgs.unshift(p_oContext, this);
			p_fCallback.apply(p_oContext, p_aArgs);
		}
	};
	IncidentController.prototype.addIncidentEventListeners			= function(p_oIncidentEvent){
		//Logger.logDebug('IncidentController.addIncidentEventListeners() | Event ID = '+p_oIncidentEvent.getID()+' :: $$$$$$$$$ '+this);
		p_oIncidentEvent.addEventListener('NEW_TRIGGER', this.handleEvents);
		p_oIncidentEvent.addEventListener('NEXT_DECISION', this.handleEvents);
		//p_oIncidentEvent.addEventListener('GOTO_EVENT', this.handleEvents);
		p_oIncidentEvent.addEventListener('EVENT_COMPLETE', this.handleEvents);
		p_oIncidentEvent.addEventListener('EVENT_TIME_EXPIRED', this.handleEvents);
	};
	IncidentController.prototype.removeIncidentEventListeners		= function(p_oIncidentEvent){
		//Logger.logDebug('IncidentController.removeIncidentEventListeners() | Event ID = '+p_oIncidentEvent.getID());
		p_oIncidentEvent.removeEventListener('NEW_TRIGGER', this.handleEvents);
		p_oIncidentEvent.removeEventListener('NEXT_DECISION', this.handleEvents);
		//p_oIncidentEvent.removeEventListener('GOTO_EVENT', this.handleEvents);
		p_oIncidentEvent.removeEventListener('EVENT_COMPLETE', this.handleEvents);
		p_oIncidentEvent.removeEventListener('EVENT_TIME_EXPIRED', this.handleEvents);
	};
	IncidentController.prototype.initializeIncidents				= function(){
		var sIncident;
		for(sIncident in this.oIncidents){
			oIncident		= this.oIncidents[sIncident];
			oIncident.initialize();
		}
	};

	IncidentController.prototype.parseTextDefaults					= function(p_xmlTextDefaults, p_oContext, p_fCallback, p_aArgs){
		var oX2JS			= new X2JS(),
			temp			= oX2JS.xml2json(p_xmlTextDefaults),

			nTDItemLength	= temp.item.length,
			oItemPointer,
			sKey,
			i;

		this.oTextDefaults = {};

		if(nTDItemLength){
			for(i=0; i<nTDItemLength; i++){
				oItemPointer	= temp.item[i];
				sKey			= oItemPointer._id;
				if(this.oTextDefaults[sKey] && !(this.oTextDefaults[sKey] instanceof Array)){
					var oPrevItemPointer = this.oTextDefaults[sKey];
					this.oTextDefaults[sKey] = [];
					this.oTextDefaults[sKey].push(oPrevItemPointer);
				}
				if(this.oTextDefaults[sKey] instanceof Array){
					this.oTextDefaults[sKey].push(oItemPointer);
				}else{
					this.oTextDefaults[sKey] = oItemPointer;
				}
			}
		}else{
			oItemPointer	= temp.item[i];
			sKey			= oItemPointer._id;
			this.oTextDefaults[sKey] = oItemPointer;
		}

		//Logger.logDebug('IncidentController.parseTextDefaults() | oData = '+JSON.stringify(this.oTextDefaults));

		if(p_fCallback){
			p_aArgs = p_aArgs || [];
			p_aArgs.unshift(p_oContext, this);
			p_fCallback.apply(p_oContext, p_aArgs);
		}
	};

	IncidentController.prototype.parseDataFiles						= function(p_xmlDataFiles, p_sFolderPath, p_oContext, p_fCallback, p_aArgs){
		var oX2JS	= new X2JS(),
			oData	= oX2JS.xml2json(p_xmlDataFiles);
		//Logger.logDebug('IncidentController.parseDataFiles() | oData = '+JSON.stringify(oData));
		if(oData.item.length){
			// ** TODO: List of XML data files to load
		}else{
			var sFileName	= oData.item._filename,
				sLocation	= oData.item._location,
				sFilePath	= CourseConfig.getRootPath() + CourseConfig.getConfig(sLocation).folderURL + p_sFolderPath + sFileName,
				oRL			= new ResourceLoader();
			//Logger.logDebug('IncidentController.parseDataFiles() | sFilePath = '+sFilePath);
			oRL.loadResource(sFilePath, this, this.onDataFilesLoaded, [p_oContext, p_fCallback, p_aArgs]);
		}
	};
	IncidentController.prototype.onDataFilesLoaded					= function(p_oScope, p_aResources, p_oResourceLoader, p_oContext, p_fCallback, p_aArgs){
		var xmlData	= p_aResources[0],
			oX2JS	= new X2JS();
		this.oPopupData	= oX2JS.xml2json(xmlData);
		//Logger.logDebug('IncidentController.onDataFilesLoaded() | '+JSON.stringify(this.oPopupData));

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;

		if(p_fCallback){
			p_aArgs = p_aArgs || [];
			p_aArgs.unshift(p_oContext, this);
			p_fCallback.apply(p_oContext, p_aArgs);
		}
	};

	IncidentController.prototype.setDecisionPages					= function(p_aPageModels){
		//Logger.logDebug('IncidentController.setDecisionPages() | Page Models Length = '+p_aPageModels.length);
		var oIncidentEvent;

		for(var i=0; i<p_aPageModels.length; i++){
			var oPageModel = p_aPageModels[i];
			if(oPageModel.getEventID()){
				//Logger.logDebug('\tPage Models Event ID = '+oPageModel.getEventID());
				oIncidentEvent = this.oIncidentEvents[this.sEventPrefix + oPageModel.getEventID()];
				if(oIncidentEvent){
					oIncidentEvent.addDecisionPage(oPageModel);
				}else{
					Logger.logError('IncidentController.setDecisionPages() | Event with ID "'+oPageModel.getEventID()+'" not found.');
				}
			}else{
				Logger.logWarn('IncidentController.setDecisionPages() | Page "'+oPageModel.getGUID()+'" has no Event ID.');
			}
		}
	};

	IncidentController.prototype.setFeedbackPageModel				= function(p_oFeedbackPageModel){
		this.oFeedbackPageModel = p_oFeedbackPageModel;
	};
	IncidentController.prototype.getFeedbackPageModel				= function(){
		return this.oFeedbackPageModel;
	};

	IncidentController.prototype.setView							= function(p_oSIMViewController){
		var oScope = this;
		this.oSIMViewController = p_oSIMViewController;
		this.oSIMViewController.addEventListener('TRIGGER_ACTBTN_CLICK', this.handleEvents);
		this.oSIMViewController.addEventListener('EVENT_START', this.handleEvents);
		this.oSIMViewController.addEventListener('EVENT_DEFERRED', this.handleEvents);
		this.oSIMViewController.addEventListener('EVENT_UNDEFERRED', this.handleEvents);
		this.oSIMViewController.addEventListener('DECISION_START', this.handleEvents);
		this.oSIMViewController.addEventListener('DECISION_COMPLETE', this.handleEvents);
		this.oSIMViewController.addEventListener('LOADING_FEEDBACK', this.handleEvents);
		this.oSIMViewController.addEventListener('FEEDBACK_SHOWN', this.handleEvents);
		this.oSIMViewController.addEventListener('NEXT_DAY_START', this.handleEvents);
		//this.oSIMViewController.addEventListener('EVENT_COMPLETE', this.handleEvents);
	};

	IncidentController.prototype.parseBookmark						= function(p_oBookmark){
		Logger.logDebug('IncidentController.parseBookmark() | ');
		// ** TODO: Parse the bookmark data
	};
	IncidentController.prototype.getBookmark						= function(p_oBookmark){
		Logger.logDebug('IncidentController.getBookmark() | ');
		// ** TODO: get the bookmark data
	};

	IncidentController.prototype.handleEvents						= function(e){
		var sEventType	= e.type;
		//Logger.logDebug('IncidentController.handleEvents() | Event Type = '+sEventType+' : Scope = '+this.toString()+' : '+e.lapsedTime);
		switch(sEventType){
			case 'MINUTES_UPDATE':
			case 'TIMER_STARTED':
				var oScope			= this,
					oEventObject	= $.extend({}, e, {target:oScope, type:'TIME_UPDATE'});
				//Logger.logDebug('IncidentController.handleEvents() | Event Type = '+sEventType+' : '+e.lapsedTime);
				this.dispatchEvent('TIME_UPDATE', oEventObject);
				break;
			case 'TIME_OVER' :
				//Logger.logDebug('IncidentController.handleEvents() | TIME_OVER  | Timer Name = '+e.name);
				if(e.name === 'EVENTS_INTERVAL'){
					this.initializeEvent();
					return;
				}
				if(e.name === 'EXTRA_TIME'){
					this.bDayTimeOver = true;
					this.dayComplete();
					return;
				}
				this.startExtraTime(e);
				break;
			case 'NEW_TRIGGER' :
				var oTrigger	= e.trigger;
				Logger.logDebug('IncidentController.handleEvents() | "NEW_TRIGGER" \n\tIncident ID = '+oTrigger.getIncidentID()+' : Event ID = '+oTrigger.getEventID()+' : Trigger ID = '+oTrigger.getID());
				//Logger.logDebug('\n\tTrigger = '+JSON.stringify(oTrigger));
				oTrigger.setTimeStamp(this.oDayTimer.toCurrentTimeString());
				this.dispatchEvent('NEW_TRIGGER', {type:'NEW_TRIGGER', target:this, trigger:oTrigger});
				if(oTrigger.getState() === 'COMPLETED' && oTrigger.getEventState() === 'COMPLETED'){this.removeIncidentEventListeners(oIncidentEvent);}
				break;
			case 'GOTO_EVENT' :
				Logger.logDebug('IncidentController.handleEvents() | "GOTO_EVENT"');
				this.gotoEventHandler(e);
				break;
			case 'TRIGGER_ACTBTN_CLICK' :
				Logger.logDebug('IncidentController.handleEvents() | "TRIGGER_ACTBTN_CLICK"');
				this.onTriggerActBtnClick(e);
				break;
			case 'EVENT_START' :
				if(!this.bDayOver){
					Logger.logDebug('IncidentController.handleEvents() | "EVENT_START" | Incident ID = '+e.incidentID+' : Event ID = '+e.eventID);
					this.startDecision(e.incidentID, e.eventID);
				}
				break;
			case 'EVENT_DEFERRED' :
				Logger.logDebug('IncidentController.handleEvents() | "EVENT_DEFERRED"');
				this.onEventDeferredOrUndeferred(e, true);
				break;
			case 'EVENT_UNDEFERRED' :
				Logger.logDebug('IncidentController.handleEvents() | "EVENT_UNDEFERRED"');
				this.onEventDeferredOrUndeferred(e, false);
				break;
			case 'NEXT_DECISION' :
				Logger.logDebug('IncidentController.handleEvents() | "NEXT_DECISION"');
				this.nextDecision(e);
				break;
			case 'DECISION_START' :
				Logger.logDebug('IncidentController.handleEvents() | "DECISION_START"');
				this.eventDecisionStart(e);
				break;
			case 'DECISION_COMPLETE' :
				Logger.logDebug('IncidentController.handleEvents() | "DECISION_COMPLETE"');
				this.eventDecisionComplete(e);
				break;
			case 'EVENT_COMPLETE' :
				Logger.logDebug('IncidentController.handleEvents() | "EVENT_COMPLETE"');
				this.onEventComplete(e);
				break;
			case 'EVENT_TIME_EXPIRED' :
				Logger.logDebug('IncidentController.handleEvents() | "EVENT_TIME_OVER"');
				this.onEventTimeExpire(e);
				break;
			case 'LOADING_FEEDBACK' :
				Logger.logDebug('IncidentController.handleEvents() | "LOADING_FEEDBACK"');
				this.removeTimedTriggerListeners();
				break;
			case 'FEEDBACK_SHOWN' :
				Logger.logDebug('IncidentController.handleEvents() | "FEEDBACK_SHOWN"');
				break;
			case 'NEXT_DAY_START' :
				Logger.logDebug('IncidentController.handleEvents() | "NEXT_DAY_START"');
				this.nCurrentDay++;
				this.startSIM();
				break;
		}
	};

	IncidentController.prototype.startSIM							= function(){
		Logger.logDebug('IncidentController.startSIM() |\n\tCurrent Day = '+this.nCurrentDay);
		this.resetDayRuntimes();
		this.dispatchEvent('DAY_START', {type:'DAY_START', target:this, scope:this, method:this.onDayStartPopupClose});
		this.selectIncidents();
		//this.resetDayRuntimesForIncidents();
	};
	IncidentController.prototype.restartSIM							= function(){
		Logger.logDebug('IncidentController.restartSIM() | ');
		this.reset();
		this.startSIM();
	};

	IncidentController.prototype.onDayStartPopupClose				= function(){
		//Logger.logDebug('IncidentController.onDayStartPopupClose()');
		this.startDayTimer();
		this.initializeEvent();
	};
	IncidentController.prototype.onDayFailedPopupClose				= function(){
		//Logger.logDebug('IncidentController.onDayFailedPopupClose()');
		// ** RESET everything and start from day 1
		this.dispatchEvent('RESTART_SIM', {type:'RESTART_SIM', target:this});
		this.restartSIM();
		//this.resetAllIncidents();
	};
	IncidentController.prototype.onDayFailedPartialPopupClose		= function(){
		Logger.logDebug('IncidentController.onDayFailedPartialPopupClose()');
	};
	/*IncidentController.prototype.resetAllIncidents					= function(){
		this.oSIMViewController.reset();

		var sIncident;
		for (sIncident in this.oIncidents) {
			oIncident	= this.oIncidents[sIncident];
			oIncident.reset();
		};

		this.startSIM();
	};*/


	IncidentController.prototype.filterData							= function(p_sTxt){
		var sText			= p_sTxt,
			sStartPrefix	= '<<',
			sEndPrefix		= '>>',
			nStartIndex 	= (sText.indexOf(sStartPrefix) > -1) ? sText.indexOf(sStartPrefix) + sStartPrefix.length : -1,
			nEndIndex,
			sVariableName,
			sVariableValue;

		//Logger.logDebug('#### nStartIndex = '+nStartIndex);
		while(nStartIndex > -1){
			nEndIndex		= sText.indexOf(sEndPrefix, nStartIndex);
			sVariableName	= sText.substring(nStartIndex, nEndIndex);
			sVariableValue	= this[sVariableName];
			sText			= sText.substring(0, (nStartIndex - sStartPrefix.length)) + sVariableValue + sText.substring((nEndIndex + sEndPrefix.length), sText.length);
			//Logger.logDebug('######## Variable = '+sVariableName+' : Value = '+sVariableValue+' : '+nStartIndex+' : '+nEndIndex);
			nStartIndex 	= sText.indexOf(sStartPrefix, nEndIndex) + sStartPrefix;
		}
		//Logger.logDebug('#### Filtered text = '+sText);
		return sText;
	};
	IncidentController.prototype.getPopupData						= function(p_sID){
		var nLength = this.oPopupData.data.pageText.length;
		for (var i=0; i < nLength; i++) {
			var pageTextPointer	= this.oPopupData.data.pageText[i];
			if(pageTextPointer._id === p_sID){
				return this.filterData(pageTextPointer.__cdata);
			}
		};
	};

	/* ***** Incident ******  */
	IncidentController.prototype.selectIncidents					= function(){
		Logger.logDebug('IncidentController.selectIncidents()');
		var nIncidentsToShow			= Globals.getRandomNumber(this.nMinIncidentsPerDay, this.nMaxIncidentsPerDay),
			bIsLastDay					= this.isLastDay(),
			// ** Get the Incidents which have been played but the next subsequent event has to appear after some days
			aIncidentsSpecificDay		= this.getDaySpecificIncidents(),
			// ** Get the Incidents which have been played but the next subsequent event has to appear after some days
			//aIncidentsHibernate		= this.getIncidentsWithStatus('HIBERNATE'),
			// ** Get the Incidents which have been postponed to the next day
			aIncidentsDeferred			= this.getIncidentsWithStatus('DEFERRED'),
			aIncidentsDeferred			= (this.bRandomizeIncidents) ? Globals.shuffleArray(aIncidentsDeferred) : aIncidentsDeferred,
			// ** Get the Incidents which have been played but all Events have not been completed
			aIncidentsIncomplete		= this.getIncidentsWithStatus('INCOMPLETE'),
			aIncidentsIncomplete		= (this.bRandomizeIncidents) ? Globals.shuffleArray(aIncidentsIncomplete) : aIncidentsIncomplete,
			// ** Get the Incidents which have NOT been played even once
			aIncidentsNotStarted		= this.getIncidentsWithStatus('NOTSTARTED'),
			aIncidentsNotStarted		= (this.bRandomizeIncidents) ? Globals.shuffleArray(aIncidentsNotStarted) : aIncidentsNotStarted,
			// ** Merging the arrays accumulated above as per priority
			aIncidentsAvailable			= aIncidentsSpecificDay.concat(aIncidentsDeferred, aIncidentsIncomplete, aIncidentsNotStarted),

			// ** Get the Incidents which are to appear at some later day
			aIncidentBeyondCurrentDay	= this.getIncidentsBeyondCurrentDay(),
			// ** Get the Incidents which are to appear at some later day
			aIncidentDependant			= this.getDependantIncidents();

		// ** Detailed log of the Incident Selections
		Logger.logDebug('\tIncidents To be shown = '+nIncidentsToShow+'\n\tDay Specific Incidents : Length = '+aIncidentsSpecificDay.length+'\n\t=================================');
		this.enumerateIncidents(aIncidentsSpecificDay, '\t\tIncident ID = ');
		Logger.logDebug('\tDeferred Incidents : Length = '+aIncidentsDeferred.length+'\n\t=================================');
		this.enumerateIncidents(aIncidentsDeferred, '\t\tIncident ID = ');
		Logger.logDebug('\tIncomplete Incidents : Length = '+aIncidentsIncomplete.length+'\n\t=================================');
		this.enumerateIncidents(aIncidentsIncomplete, '\t\tIncident ID = ');
		Logger.logDebug('\tNot Started Incidents : Length = '+aIncidentsNotStarted.length+'\n\t=================================');
		this.enumerateIncidents(aIncidentsNotStarted, '\t\tIncident ID = ');
		Logger.logDebug('\tAvailable Incidents : Length = '+aIncidentsAvailable.length+'\n\t=================================');
		this.enumerateIncidents(aIncidentsAvailable, '\t\tIncident ID = ');

		// ** Concise log of the Incident Selections
		Logger.logDebug('\tAvailable Incidents Length = '+aIncidentsAvailable.length+'\n\tIncidents To be shown = '+nIncidentsToShow+'\n\n\tIncident Sepecific Day Length = '+aIncidentsSpecificDay.length+'\n\tIncident DEFERRED Length = '+aIncidentsDeferred.length+'\n\tIncident INCOMPLETE Length = '+aIncidentsIncomplete.length+'\n\tIncident NOT STARTED Length = '+aIncidentsNotStarted.length);

		if (this.isLastDay() && this.bTriggerAllIncidentsOnLastDay) {
			// ** Its the last day so show all the incidents including the ones beyond the current day
			aIncidentsAvailable				= aIncidentsAvailable.concat(aIncidentBeyondCurrentDay);
			this.aSelectedIncidents 		= aIncidentsAvailable.splice(0, aIncidentsAvailable.length);
			this.bLastDay					= true;
		} else{
			// ** If the Available Not Started Incidents is less than the Random Number picked from min-max incidents to be shown for the Day then get the Incomplete Incidents and add them to the list
			if(aIncidentsAvailable.length === nIncidentsToShow){
				this.aSelectedIncidents = aIncidentsAvailable.splice(0, aIncidentsAvailable.length);
			}else if(aIncidentsAvailable.length < nIncidentsToShow){
				this.aSelectedIncidents = aIncidentsAvailable.splice(0, aIncidentsAvailable.length);
				// TODO: As there are less number of Incidents here, we can add some logic to add the dependant incidents to the queue when it gets enabled, i.e. on completion of an Event
			}else if(aIncidentsAvailable.length > nIncidentsToShow){
				this.aSelectedIncidents = aIncidentsAvailable.splice(0, nIncidentsToShow);
			}

			// ** Check for Last Day as the Number of days have been set to unlimited
			if((aIncidentsAvailable.length === 0 && aIncidentBeyondCurrentDay.length === 0 && aIncidentDependant.length === 0) || (this.isLastDay() && !this.bTriggerAllIncidentsOnLastDay)){
				this.bLastDay	= true;
			}
		};

		Logger.logDebug('\tSelected Incidents : Length = '+this.aSelectedIncidents.length/*+'\n\tAvailable Incidents Length = '+aIncidentsAvailable.length*/+' : LAST DAY = '+this.bLastDay+'\n\t=================================\n');

		//this.enumerateIncidents(this.aSelectedIncidents, 'B4');
		// ** If Incidents are to be randomized
		if(this.bRandomizeIncidents){
			this.aSelectedIncidents = Globals.shuffleArray(this.aSelectedIncidents);
		}else{// ** Arrange Incidents as per their ID
			this.aSelectedIncidents.sort(function(a, b){
				return a.getID()-b.getID();
			});
		}
		this.enumerateIncidents(this.aSelectedIncidents, '\t\tIncident ID = ');

		return this.aSelectedIncidents;
	};
	IncidentController.prototype.getIncidentsWithStatus				= function(p_sStatus){
		//Logger.logDebug('IncidentController.getIncidentsWithStatus() | Status to find = '+p_sStatus);
		var aTemporary = [],
			sProp,
			oIncident,
			aStatusToFind = p_sStatus.split(' ').join('').split(','),
			sStatusToFind,
			bDaySpecific,
			bIsDependant,
			i;

		for(sIncident in this.oIncidents){
			oIncident = this.oIncidents[sIncident];
			//Logger.logDebug('\tChecking Incident ID = '+oIncident.getID());
			for(i=0; i<aStatusToFind.length; i++){
				sStatusToFind	= aStatusToFind[i].toUpperCase(),
				nIncidentDay	= oIncident.getDay();
				bDaySpecific	= (nIncidentDay !== -1);
				bIsDependant	= oIncident.isDependant();
				//Logger.logDebug('\t\tCurrent Day = '+this.nCurrentDay+' : Incident Day = '+(nIncidentDay)+' : Is Dependant = '+bIsDependant+' : Day Specific = '+bDaySpecific);
				// ** Filter out the Dependant & Day Specific incidents
				if(bIsDependant || bDaySpecific){
					//Logger.logDebug('\t\t<<<< BREAKING >>>>');
					break;
				}
				//Logger.logDebug('\t\tIncident Status = '+oIncident.getStatus()+' : Comparing Status = '+sStatusToFind);
				if(oIncident.getStatus() === sStatusToFind){
					//Logger.logDebug('\t\t<<<< Adding >>>> Incident ID = '+oIncident.getID());
					aTemporary.push(oIncident);
					break;
				}
			}
		}
		return aTemporary;
	};
	IncidentController.prototype.getDaySpecificIncidents			= function(){
		Logger.logDebug('IncidentController.getDaySpecificIncidents()');
		var aTemporary = [],
			oIncident,
			nIncidentDay,
			bOccursToday,
			bIsDependant,
			bIsOver,
			i;

		for(sIncident in this.oIncidents){
			oIncident		= this.oIncidents[sIncident];
			nIncidentDay	= oIncident.getDay();
			bIsOver			= oIncident.isOver();
			bOccursToday	= (nIncidentDay === this.nCurrentDay || (nIncidentDay != -1 && this.nCurrentDay > nIncidentDay && !bIsOver));
			bIsDependant	= oIncident.isDependant();
			Logger.logDebug('\tChecking Incident ID = '+oIncident.getID()+' : Occurs Today = '+bOccursToday+' : Is Dependant = '+bIsDependant);

			// ** Select Incidents which are NOT DEPENDANT and to APPEAR TODAY
			if(bOccursToday && !bIsDependant){
				//Logger.logDebug('\t\t<<<< Adding >>>> Incident ID = '+oIncident.getID());
				aTemporary.push(oIncident);
			}
		}

		return aTemporary;
	};
	IncidentController.prototype.getIncidentsBeyondCurrentDay		= function(){
		//Logger.logDebug('IncidentController.getIncidentsBeyondCurrentDay()');
		var aTemporary = [],
			oIncident,
			nIncidentDay,
			bOccursLater,
			bIsDependant,
			i;

		for(sIncident in this.oIncidents){
			oIncident		= this.oIncidents[sIncident];
			nIncidentDay	= oIncident.getDay();
			bOccursLater	= (nIncidentDay != -1 && this.nCurrentDay < nIncidentDay);
			bIsDependant	= oIncident.isDependant();
			//Logger.logDebug('\tChecking Incident ID = '+oIncident.getID()+' : Occurs Later = '+bOccursLater+' : Is Dependant = '+bIsDependant);

			// ** Select Incidents which are NOT DEPENDANT and are to APPEAR on some LATER day
			if(bOccursLater && !bIsDependant){
				//Logger.logDebug('\t\t<<<< Adding >>>> Incident ID = '+oIncident.getID());
				aTemporary.push(oIncident);
			}
		}

		return aTemporary;
	};
	IncidentController.prototype.getDependantIncidents				= function(){
		//Logger.logDebug('IncidentController.getDependantIncidents()');
		var aTemporary = [],
			oIncident,
			bIsDependant,
			i;

		for(sIncident in this.oIncidents){
			oIncident		= this.oIncidents[sIncident];
			bIsDependant	= oIncident.isDependant();
			//Logger.logDebug('\tChecking Incident ID = '+oIncident.getID()+' : Is Dependant = '+bIsDependant);

			// ** Select Incidents which are NOT DEPENDANT and are to APPEAR on some LATER day
			if(bIsDependant){
				//Logger.logDebug('\t\t<<<< Adding >>>> Incident ID = '+oIncident.getID());
				aTemporary.push(oIncident);
			}
		}

		return aTemporary;
	};
	IncidentController.prototype.resetDayRuntimesForIncidents		= function(){
		/*var i,
			oIncidentPointer;

		for (i=0; i < this.aSelectedIncidents.length; i++) {
			oIncidentPointer	= this.aSelectedIncidents[i];
			oIncidentPointer.resetDayRuntimes();
		};*/

		var sIncident,
			oIncidentPointer;
		for(sIncident in this.oIncidents){
			oIncidentPointer = this.oIncidents[sIncident];
			//Logger.logDebug('\tChecking Incident ID = '+oIncidentPointer.getID());
			oIncidentPointer.resetDayRuntimes();
		}
	};
	IncidentController.prototype.removeDependantFlagForIncidents	= function(p_aIncidentIDs){
		var i,
			sIncidentID,
			oIncident;

		for (i=0; i < p_aIncidentIDs.length; i++) {
			sIncidentID	= p_aIncidentIDs[i];
			oIncident	= this.getIncidentByID(sIncidentID);
			oIncident.removeDependantFlag();
		};
	};
	IncidentController.prototype.isLastDay							= function(){
		Logger.logDebug('IncidentController.isLastDay() | ');
		if(this.nNoOfDays !== -1){
			Logger.logDebug('\tNumber of Days is defined | Is Last Day = '+(this.nNoOfDays === this.nCurrentDay));
			if(this.nNoOfDays === this.nCurrentDay){return true;}
		}
		if(this.bLastDay){
			Logger.logDebug('\tLast Day is set to TRUE');
			return this.bLastDay;
		}
		return false;
	};
	/*
	IncidentController.prototype.isLastDay							= function(){
			Logger.logDebug('IncidentController.isLastDay() | Number Of Days = '+this.nNoOfDays+' : Current Day = '+this.nCurrentDay+' : '+(this.nNoOfDays != -1 && this.nNoOfDays === this.nCurrentDay));
			return (this.nNoOfDays != -1 && this.nNoOfDays === this.nCurrentDay);
		};*/

	/*IncidentController.prototype.isLastDay							= function(){
		var bIsLastDay;
		if(this.nNoOfDays != -1){
			bIsLastDay = (this.nNoOfDays === this.nCurrentDay) ? true : false;
		}else{
			// ** Get the Incidents which have been played but all Events have not been completed
			var aIncidentsIncomplete = this.getIncidentsWithStatus('HIBERNATE, DEFERRED, INCOMPLETE, NOTSTARTED'),
				// ** Get the Incidents which have NOT been played even once
				aIncidentsNotStarted = this.getIncidentsWithStatus('NOTSTARTED'),
				aPendingIncidents = aIncidentsIncomplete.concat(aIncidentsNotStarted);

			bIsLastDay = (aPendingIncidents.length < 1);
		}

		return bIsLastDay;
	};*/


	IncidentController.prototype.startDayTimer						= function(){
		//Logger.logDebug('IncidentController.startDayTimer() | '+JSON.stringify(this.oDayStartsAt));
		this.dispatchEvent('CURRENT_DAY_SET', {type:'CURRENT_DAY_SET', target:this, day:this.nCurrentDay});
		// ** Start Day Timer
		var oScope = this;
		//this.handleEvents = this.handleEvents.bind(this);

		this.oDayTimer = new Timer('DAY_TIME');
		this.oDayTimer.setCurrentTime(this.oDayStartsAt.hrs, this.oDayStartsAt.mins, this.oDayStartsAt.secs, this.oDayStartsAt.ampm);
		this.oDayTimer.setEndTime(this.nDayTimeLimit * 60);
		//this.oDayTimer.addEventListener('TIME_TICK', this.handleEvents);
		this.oDayTimer.addEventListener('TIMER_STARTED', this.handleEvents);
		this.oDayTimer.addEventListener('MINUTES_UPDATE', this.handleEvents);
		this.oDayTimer.addEventListener('TIME_OVER', this.handleEvents);
		this.oDayTimer.start(0);
	};
	IncidentController.prototype.startExtraTime         		    = function(e){
		//Logger.logDebug('IncidentController.startExtraTime() | ');
		// ** Start Extra Time Timer
		this.oDayTimer.reset();
		this.oDayTimer.setName('EXTRA_TIME');
		this.oDayTimer.setEndTime((this.nDayTimeLimit + this.nExtraTime) * 60);
		this.oDayTimer.start(this.nDayTimeLimit * 60);
	};
	IncidentController.prototype.stopDayTimer         		    	= function(e){
		//Logger.logDebug('IncidentController.stopDayTimer() | ');
		if(this.oDayTimer){
			this.oDayTimer.stop();
			this.oDayTimer.removeEventListener('MINUTES_UPDATE', this.handleEvents);
			this.oDayTimer.removeEventListener('TIME_OVER', this.handleEvents);
		}
	};

	IncidentController.prototype.areAllSelectedIncidentsComplete	= function(){
		Logger.logDebug('IncidentController.areAllSelectedIncidentsComplete() | \n\tCurrent Incident Index = '+(this.nCurrentIncident)+' : Selected Incidents = '+(this.aSelectedIncidents.length-1));
		var bDayComplete		= true;
		if(this.nCurrentIncident === (this.aSelectedIncidents.length - 1)){
			for(i=0; i<this.aSelectedIncidents.length; i++){
				oIncident		= this.aSelectedIncidents[i],
				sIncidentState	= oIncident.getState();
				if(sIncidentState !== 'COMPLETED'){
					bDayComplete = false;
					Logger.logDebug('\tINCOMPLETE Incident ID = '+oIncident.getID()+' : State = '+sIncidentState);
					break;
				}
			}
		}else{
			bDayComplete = false;
		}
		Logger.logDebug('\tDay Complete = '+bDayComplete);
		return bDayComplete;
	};
	IncidentController.prototype.dayComplete						= function(){
		Logger.logDebug('IncidentController.dayComplete() | ');
		this.bDayOver	= true;
		this.stopDayTimer();
		this.stopEventIntervalTimer();
		VariableManager.setVariable('nCurrentDay', this.nCurrentDay);
		if(this.bDayTimeOver){
			if(!this.isAnyEventCompletedToday()){
				// ** User was not able to complete "ANY" of the Events on time.
				Logger.logDebug('\tUser was not able to complete "ANY" of the Events on time.');
				this.dispatchEvent('DAY_FAILED', {type:'DAY_FAILED', target:this, timeExpired:this.bDayTimeOver, scope:this, method:this.onDayFailedPopupClose});
				return;
			}
			// ** User was not able to complete "ALL" the Events on time.
			Logger.logDebug('\tUser was not able to complete "ALL" the Events on time.');
			this.dispatchEvent('DAY_FAILED_PARTIAL', {type:'DAY_FAILED_PARTIAL', target:this, timeExpired:this.bDayTimeOver, scope:this, method:this.onDayFailedPartialPopupClose});
			return;
		}else{
			// ** User has either Completed | Failed | Deferred all the Events
			Logger.logDebug('\tUser has either "Completed | Failed | Deferred" all the Events.');
		}
		this.dispatchEvent('DAY_COMPLETE', {type:'DAY_COMPLETE', target:this, timeExpired:this.bDayTimeOver});
	};
	// ** This method helps clear the Timed Result Triggers when the user clicks on the continue button when the Day is Completed
	IncidentController.prototype.removeTimedTriggerListeners		= function(){
		//Logger.logDebug('IncidentController.removeTimedTriggerListeners() | ');
		for(var sIncidentEvent in this.oIncidentEvents){
			var oIncidentEvent = this.oIncidentEvents[sIncidentEvent];
			oIncidentEvent.removeTimedTriggerListeners();
		}
	};



	/* **** Incident Events **** */
	IncidentController.prototype.initializeEvent					= function(p_oIncidentEvent){
		Logger.logDebug('IncidentController.initializeEvent() | p_oIncidentEvent = '+p_oIncidentEvent);
		if(p_oIncidentEvent){
			var oIncidentEvent			= p_oIncidentEvent,
				sIncidentID				= oIncidentEvent.getIncidentID(),
				oIncident				= this.oIncidents[this.sIncidentPrefix + sIncidentID];
		}else{
			this.nCurrentIncident		+= 1;
			//Logger.logDebug('\tStart the NEXT Incident :: this.nCurrentIncident = '+this.nCurrentIncident);
			var oIncident				= this.aSelectedIncidents[this.nCurrentIncident];
			//Logger.logDebug('\tIncident Object = '+oIncident);
			var oIncidentEvent			= oIncident.getEvent();
			//Logger.logDebug('\tIncident Event Object = '+oIncidentEvent);
		}
		if(!oIncidentEvent){Logger.logError('ERROR: No Events found within Incident ID "'+oIncident.getID()+'"');}
		Logger.logDebug('\tIncident ID = '+oIncident.getID()+' : Event ID = '+oIncidentEvent.getID()+'\n\tCurrent Incident Index = '+this.nCurrentIncident+' : Selected Incidents Length = '+this.aSelectedIncidents.length+'\n\tGo To Event = '+p_oIncidentEvent);

		oIncident.start();
		oIncidentEvent.start();

		// ** Start the Events Interval Timer only if all the Incidents in the Selected Incidents stack are not over AND if its not a GO TO EVENT
		if(this.nCurrentIncident < (this.aSelectedIncidents.length - 1) && !p_oIncidentEvent){
			this.startEventIntervalTimer();
		}
	};
	IncidentController.prototype.isAnyEventCompletedToday			= function(){
		var nIncidentEventsCompletedToday	= 0;
		for (var i=0; i < this.aSelectedIncidents.length; i++) {
			var oIncident	= this.aSelectedIncidents[i];
			nIncidentEventsCompletedToday += oIncident.getIncidentEventsCompletedToday();
		};
		return (nIncidentEventsCompletedToday > 0) ? true : false;
	};
	IncidentController.prototype.onEventComplete					= function(e){
        var sEventType							= e.type,
        	oIncidentEvent  					= e.target,
            sIncidentID     					= oIncidentEvent.getIncidentID(),
            sEventID        					= oIncidentEvent.getID(),
            oIncident							= this.getIncidentByID(sIncidentID),
            sGoToEventID						= e.gotoEventID || null,
            nDaysToNextEvent					= e.daystoNextEvent || 0,
            aEnableIncidents					= e.enableIncidents || null,
            oGoToIncidentEvent					= (sGoToEventID) ? this.getIncidentEventByID(null, sGoToEventID) : null,
            sGoToIncidentID						= (sGoToEventID) ? oGoToIncidentEvent.getIncidentID() : null,
            bGoToEventBelongsToSameIncident		= (sIncidentID === sGoToIncidentID),
            bEventsPerDayCompletionMet			= (this.nEventsPerDay > -1 && oIncident.getIncidentEventsPlayedToday() >= this.nEventsPerDay) ? true : false;

		/*
		 * Moved this call to "handleEvents" method inside "NEW_TRIGGER" case as the result Trigger
		 * was not firing due to the removal of the Event Listener to the IncidentEvent
		 */
		//this.removeIncidentEventListeners(oIncidentEvent);
		if(aEnableIncidents){this.removeDependantFlagForIncidents(aEnableIncidents);}

		Logger.logDebug('IncidentController.onEventComplete() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID+'\n\tGo to Event ID = '+sGoToEventID+' : Days to Next Event = '+nDaysToNextEvent+'\n\tEnable Incidents = '+aEnableIncidents+'\n\tEvents to be Played Per Day = '+this.nEventsPerDay+' : Events Played for this Incident today = '+oIncident.getIncidentEventsPlayedToday());

		// ** If the number of played Events in an Incident is less than the Events to be played each day
		// ** OR If the Event completed has a leading Event belonging to the SAME Incident to be played the same day
		// ** OR If the Event completed has a leading Event belonging to the SAME Incident to be played the next day but the current day is the last day
		if(!bEventsPerDayCompletionMet || ((sGoToEventID && nDaysToNextEvent === 0) && bGoToEventBelongsToSameIncident) || (this.isLastDay() && this.bTriggerAllIncidentsOnLastDay)){
			Logger.logDebug('\tEvents Played for this Incident is LESS than the Events to be played per-day OR has a leading event to be played the same day OR its the LAST DAY');
			// ** Check to see if the Incident has not exhaused all its Events
			if (!oIncident.isOver()) {
				this.initializeEvent(oIncident.getEvent());
			}else{
				Logger.logDebug('\tIncident has exhaused all its Events');
				oIncident.setState('COMPLETED');
				this.removeIncidentListeners(oIncident);
				if(this.areAllSelectedIncidentsComplete()){this.dayComplete();}
			}
		}else{
			Logger.logDebug('\tEvents Played for this Incident is EQUAL to the Events to be played per-day');
			oIncident.setState('COMPLETED');
			this.removeIncidentListeners(oIncident);
			if(this.areAllSelectedIncidentsComplete()){this.dayComplete();}
		}

		// ** If the Event completed has a leading Event belonging to SOME OTHER Incident to be played the same day
		if((sGoToEventID && nDaysToNextEvent === 0) && !bGoToEventBelongsToSameIncident){
			// ** TODO: Triggering the GO TO Event in some other Incident
			Logger.logDebug('\tEvent completed has a leading Event belonging to SOME OTHER Incident to be played the same day');
		}

		// ** Remove the reference of the Incident Event as its no longer ACTIVE
		this.oActiveIncidentEvent	= undefined;

       	var oEvent = $.extend({}, e, {target:this, incidentID:sIncidentID, eventID:sEventID});
        this.dispatchEvent('EVENT_COMPLETE', oEvent);
	};
	/*IncidentController.prototype.gotoEventHandler					= function(e){
		var oIncident				= e.target,
			oIncidentEvent			= oIncident.getEvent();
		Logger.logDebug('IncidentController.gotoEventHandler() | \n\tIncident ID = '+oIncident.getID()+'\n\tGo To Event ID = '+e.gotoEventID);
		this.initializeEvent(oIncidentEvent);
	};*/
	IncidentController.prototype.onEventTimeExpire					= function(e){
        var sEventType			= e.type,
        	oIncidentEvent  	= e.target,
            sIncidentID     	= oIncidentEvent.getIncidentID(),
            sEventID	     	= oIncidentEvent.getID(),
            oIncident			= this.getIncidentByID(sIncidentID),
            oEvent				= $.extend({}, e, {type:'EVENT_TIME_EXPIRED', target:this, incidentID:sIncidentID, eventID:sEventID});
		Logger.logDebug('IncidentController.onEventTimeExpire() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID);

       	//if(sStatus === 'FAILED'){this.getIncidentByID(sIncidentID).setStatus('FAILED');}
       	oIncident.setState('COMPLETED');
		this.removeIncidentEventListeners(oIncidentEvent);
       	//this.removeIncidentListeners(oIncident);

       	// ** Save the Decision Feedback Data to the Variable Manager
       	var sContent	= this.getDefaultText('timeexpired', {
			  incidentID:sIncidentID,
			  eventID:sEventID
		});
		this.saveFeedbackData(oEvent, sContent);

		//var bIncidentEventCompleted = oIncidentEvent.evaluateAllDecisions();

		if(this.areAllSelectedIncidentsComplete()){this.dayComplete();}

       	this.dispatchEvent('EVENT_TIME_EXPIRED', oEvent);
	};
	IncidentController.prototype.startEventIntervalTimer			= function(){
		var nMin		= this.oEventsInterval.min,
			nMax		= this.oEventsInterval.max,
			nMinutes	= Globals.getRandomNumber(nMin, nMax);
		Logger.logDebug('IncidentController.startEventIntervalTimer() | \n\tInterval Minutes = '+nMinutes+' : END TIME = '+(nMinutes * 60));

		//this.handleEvents = this.handleEvents.bind(this);

		this.oEventsIntervalTimer = new Timer('EVENTS_INTERVAL');
		this.oEventsIntervalTimer.setEndTime(nMinutes * 60);
		this.oEventsIntervalTimer.addEventListener('TIME_OVER', this.handleEvents);
		this.oEventsIntervalTimer.start();
	};
	IncidentController.prototype.stopEventIntervalTimer				= function(){
		//Logger.logDebug('IncidentController.stopEventIntervalTimer() | ');
		if(this.oEventsIntervalTimer){
			this.oEventsIntervalTimer.stop();
			this.oEventsIntervalTimer.removeEventListener('TIME_OVER', this.handleEvents);
		}
	};



	/* **** Incident Events Decisions **** */
	/* Called when the ACT button is clicked. "SIMViewController" class dispatches the "TRIGGER_ACTBTN_CLICK" event */
	IncidentController.prototype.onTriggerActBtnClick				= function(e){
		//Logger.logDebug('IncidentController.onTriggerActBtnClick() | Incident ID = '+e.trigger.getIncidentID()+' : Event ID = '+e.trigger.getEventID());
		var sIncidentID		= e.trigger.getIncidentID(),
			sEventID		= e.trigger.getEventID(),
			oIncidentEvent	= this.getIncidentEventByID(sIncidentID, sEventID);

		// ** Stops the Event Timer (if it exists) as the user has started acting on the Event
		oIncidentEvent.setState('ACTIVE');
		oIncidentEvent.stopTimer();
		//this.showTransitionPopup(sIncidentID, sEventID);
	};

	/* Called when the DEFER / UNDEFER button is clicked. "SIMViewController" class dispatches the "EVENT_DEFERRED" / "EVENT_UNDEFERRED" event */
	IncidentController.prototype.onEventDeferredOrUndeferred		= function(e, p_bDeferred){
		//Logger.logDebug('IncidentController.onEventDeferredOrUndeferred() | Incident ID = '+e.trigger.getIncidentID()+' : Event ID = '+e.trigger.getEventID());
		var sIncidentID		= e.trigger.getIncidentID(),
			sEventID		= e.trigger.getEventID(),
			oIncident		= this.getIncidentByID(sIncidentID),
			oIncidentEvent	= this.getIncidentEventByID(sIncidentID, sEventID),
			sState			= (p_bDeferred) ? 'DEFERRED' : 'STARTED';

		oIncidentEvent.setState(sState);
		if(this.areAllSelectedIncidentsComplete()){this.dayComplete();}
	};

	/* Called when a Decision is complete. "IncidentEvent" class dispatches the "NEXT_DECISION" event */
	IncidentController.prototype.nextDecision						= function(e){
		Logger.logDebug('IncidentController.nextDecision() | Incident ID = '+e.incidentID+' : Event ID = '+e.eventID);
		this.startDecision(e.incidentID, e.eventID);
	};
	/* Called when the TRANSITION popup close button is clicked. "SIMViewController" class dispatches the "EVENT_START" event */
	IncidentController.prototype.startDecision						= function(p_sIncidentID, p_sEventID){
		//Logger.logDebug('IncidentController.startDecision() | \n\tIncident ID = '+p_sIncidentID+' : Event ID = '+p_sEventID);
		var oIncidentEvent = this.getIncidentEventByID(p_sIncidentID, p_sEventID);
		if(oIncidentEvent){
			var sIncidentID					= oIncidentEvent.getIncidentID(),
				sEventID					= oIncidentEvent.getID(),
				oDecisionPageModel			= oIncidentEvent.getDecisionPageModel(),
				aDecisionPageModelList		= oIncidentEvent.getDecisionPageModelList();
			//Logger.logDebug('IncidentController.startDecision() | '/*+JSON.stringify(oDecisionPageModel)*/);

			if(aDecisionPageModelList.length == 0){Logger.logError('IncidentController.startDecision() | No Decision Pages found for Incident ID "'+sIncidentID+'" Event ID "'+sEventID+'".');}

			// ** If an Event was already ACTIVE and the user decided to play another Event before completing the current one
			if(this.oActiveIncidentEvent && this.oActiveIncidentEvent.getIncidentID() !== oIncidentEvent.getIncidentID() &&
				this.oActiveIncidentEvent.getID() !== oIncidentEvent.getID()){
					this.oActiveIncidentEvent.setState('INACTIVE');
			}

			// ** Change the state of the current Event to ACTIVE
			oIncidentEvent.setState('ACTIVE');

			// ** Storing the reference to the currently ACTIVE Event
			this.oActiveIncidentEvent	= oIncidentEvent;

			this.dispatchEvent('NEW_DECISION', {type:'NEW_DECISION', incidentID:sIncidentID, eventID:sEventID, decisionPageModel:oDecisionPageModel, decisionPageModelList:aDecisionPageModelList});
			return;
		}
		Logger.logError('IncidentController.startDecision() | Invalid Event ID. Event ID "'+e.triggerInfo.eventID+'" not found.');
	};
	IncidentController.prototype.eventDecisionStart					= function(e){
        var target          = e.target,
            sIncidentID     = e.incidentID,
            sEventID        = e.eventID,
            sDecisionID     = e.decisionID;
        Logger.logDebug('IncidentController.eventDecisionStart() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID+' : Decision ID = '+sDecisionID);
	};
	IncidentController.prototype.eventDecisionComplete				= function(e){
        var target          = e.target,
            sGUID		    = e.GUID,
            sIncidentID     = e.incidentID,
            sEventID        = e.eventID,
            sDecisionID     = e.decisionID,
            sScoringID		= e.scoringuid,
            /*oFeedbackData	= e.feedbackData,
			oDecisionData   = e.decisionData,*/
            oIncidentEvent	= this.getIncidentEventByID(sIncidentID, sEventID);
		Logger.logDebug('IncidentController.eventDecisionComplete() | Incident ID = '+sIncidentID+' : Event ID = '+sEventID+' : Decision ID = '+sDecisionID+' : Scoring ID = '+sScoringID/*+' : Decision Data = '+JSON.stringify(oDecisionData)*/);

		//this.saveFeedbackData(oFeedbackData, sDecisionID);

		// ** Save the Decision Feedback Data to the Variable Manager
		this.saveFeedbackData(e);
		/*
		var sDay				= 'Day '+this.nCurrentDay,
			sEventUID			= 'i_'+sIncidentID+'~e_'+sEventID,
			sDecisionUID		= 'd_' + sDecisionID,
			aTemp				= sScoringID.split('~'),
			sQuestionID			= aTemp[aTemp.length - 1],
			oAllFeedbackData	= VariableManager.getVariable('decisionsFeedbackData');
				  if(!oAllFeedbackData){oAllFeedbackData	= VariableManager.setVariable('decisionsFeedbackData', {});}
		if(!oAllFeedbackData[sDay]){oAllFeedbackData[sDay] = {};}
		if(!oAllFeedbackData[sDay][sEventUID]){oAllFeedbackData[sDay][sEventUID] = {eventName:oIncidentEvent.getEventName()};}
		if(!oAllFeedbackData[sDay][sEventUID][sDecisionUID]){oAllFeedbackData[sDay][sEventUID][sDecisionUID] = {};}
		//oAllFeedbackData[sDay][sEventUID][sDecisionUID]		= oFeedbackData;
		oAllFeedbackData[sDay][sEventUID][sDecisionUID][sQuestionID] = sScoringID;*/

        //Logger.logDebug('IncidentController.saveFeedbackData() | '/*+JSON.stringify(oAllFeedbackData)*/);

		//var bIncidentEventCompleted = oIncidentEvent.evaluateDecision(oDecisionData, sDecisionID);
		var bIncidentEventCompleted = oIncidentEvent.evaluateDecision();
	};

	// ** Save the Decision Feedback Data to the Variable Manager
	IncidentController.prototype.saveFeedbackData 					= function(e, p_sContent){
		//Logger.logDebug('IncidentController.saveFeedbackData() | e = ');
		var sDay				= 'Day '+this.nCurrentDay,
        	sEventUID			= (e.incidentID !== undefined && e.eventID !== undefined) ? 'i_'+e.incidentID+'~e_'+e.eventID : null,
        	sDecisionUID		= (e.decisionID) ? 'd_' + e.decisionID : null,
        	oIncidentEvent		= (e.incidentID !== undefined && e.eventID !== undefined) ? this.getIncidentEventByID(e.incidentID, e.eventID) : null,
	        oAllFeedbackData	= VariableManager.getVariable('decisionsFeedbackData');
		Logger.logDebug('\tIncident Event ID = '+sEventUID+' : Decision ID = '+sDecisionUID);

        if(!oAllFeedbackData){oAllFeedbackData	= VariableManager.setVariable('decisionsFeedbackData', {});}
        if(!oAllFeedbackData[sDay]){oAllFeedbackData[sDay] = {};}
        if(oIncidentEvent !== null && !oAllFeedbackData[sDay][sEventUID]){oAllFeedbackData[sDay][sEventUID] = {eventName:oIncidentEvent.getEventName()};}

        if(sDecisionUID){
        	var sScoringID			= e.scoringuid,
	        	aTemp				= e.scoringuid.split('~'),
	        	sQuestionID			= aTemp[aTemp.length - 1];
			Logger.logDebug('\tScoring ID = '+sScoringID+' : Question ID = '+sQuestionID);

	        if(!oAllFeedbackData[sDay][sEventUID][sDecisionUID]){oAllFeedbackData[sDay][sEventUID][sDecisionUID] = {};}
	        //oAllFeedbackData[sDay][sEventUID][sDecisionUID]		= oFeedbackData;
	        // ** Example: "decision1~mcqgroup_1": The ScoreManager stores the Score for each decisions by their unique ID's
	        oAllFeedbackData[sDay][sEventUID][sDecisionUID][sQuestionID] = sScoringID;
        }else if(oIncidentEvent !== null){// ** Time Expired for Event
			oAllFeedbackData[sDay][sEventUID].content = p_sContent;
        }else{// ** Time Expired for Day
			oAllFeedbackData[sDay].content = p_sContent;
        }
        //Logger.logDebug('IncidentController.saveFeedbackData() | '/*+JSON.stringify(oAllFeedbackData)*/);
	};
	IncidentController.prototype.resetFeedbackData					= function(){
		var oAllFeedbackData	= VariableManager.getVariable('decisionsFeedbackData'),
			sDay,
			oDayPointer,
			sEventUID,
			oEventUIDPointer,
			sDecisionUID,
			sDecisionUIDPointer,
			sQuestionID;

		if(oAllFeedbackData){
			for(sDay in oAllFeedbackData){
				oDayPointer	= oAllFeedbackData[sDay];
				for(sEventUID in oDayPointer){
					oEventUIDPointer	= oDayPointer[sEventUID];
					for(sDecisionUID in oEventUIDPointer){
						sDecisionUIDPointer	= oEventUIDPointer[sDecisionUID];
						for(sQuestionID in oEventUIDPointer){
							oEventUIDPointer[sQuestionID] = null;
						}
						sDecisionUIDPointer = null;
					}
					oEventUIDPointer = null;
				}
				oDayPointer = null;
			}

			VariableManager.setVariable('decisionsFeedbackData', {});
		}
	};
	/*
	IncidentController.prototype.saveFeedbackData 					= function(p_oFeedbackData, p_sDecisionID){
			var sDay				= 'Day '+this.nCurrentDay,
				sEventUID			= this.sIncidentID+'~'+this.sEventID,
				sDecisionUID		= 'd_' + p_sDecisionID,
				oAllFeedbackData	= VariableManager.getVariable('decisionsFeedbackData');
				  if(!oAllFeedbackData){oAllFeedbackData	= VariableManager.setVariable('decisionsFeedbackData', {});}
			if(!oAllFeedbackData[sDay]){oAllFeedbackData	= VariableManager.setVariable(oAllFeedbackData[sDay], {});}
			if(!oAllFeedbackData[sDay][sEventUID]){oAllFeedbackData[sDay][sEventUID] = {eventName:''};}
			oAllFeedbackData[sDay][sEventUID][sDecisionUID]		= p_oFeedbackData;
			Logger.logDebug('IncidentController.saveFeedbackData() | '/*+JSON.stringify(oAllFeedbackData)*//*);
		};*/


	/* **** Helper Methods **** */
	IncidentController.prototype.setEventState               		= function(p_sIncidentID, p_sEventID, p_sState){
		Logger.logDebug('IncidentController.setEventState() | IncidentID = '+p_sIncidentID+' : EventID = '+p_sEventID+' : State = '+p_sState+' : '+this.toString());
		var oIncident	= this.oIncidents[this.sIncidentPrefix + p_sIncidentID],
			oIncidentEvent		= oIncident.getEventByID(p_sEventID);

		oIncidentEvent.setState(p_sState);
	};
	IncidentController.prototype.getIncidentByID					= function(p_sIncidentID){
		var oIncident       = (p_sIncidentID) ? this.oIncidents[this.sIncidentPrefix + p_sIncidentID] : null;
        return oIncident;
	};
	IncidentController.prototype.getIncidentEventByID				= function(p_sIncidentID, p_sEventID){
		var oIncident		= this.getIncidentByID(p_sIncidentID),
            oIncidentEvent	= (oIncident) ? oIncident.getEventByID(p_sEventID) : this.oIncidentEvents[this.sEventPrefix + p_sEventID];

        return oIncidentEvent;
	};
	IncidentController.prototype.getLocation						= function(p_sIncidentID, p_sEventID){
		if(p_sIncidentID && p_sEventID){
			var oIncidentEvent	= this.getIncidentEventByID(p_sIncidentID, p_sEventID),
	            sLocation 		= oIncidentEvent.getPageText('location');
		}else{
			var sLocation		= this.getDefaultText('location');
		}
		//Logger.logDebug('IncidentController.getLocation() | Location = '+sLocation);
        return sLocation;
	};
	IncidentController.prototype.getEventName						= function(p_sIncidentID, p_sEventID){
		if(p_sIncidentID && p_sEventID){
			var oIncidentEvent	= this.getIncidentEventByID(p_sIncidentID, p_sEventID),
	            sEventName 		= oIncidentEvent.getEventName();
		}else{
			var sEventName		= '';
		}
		//Logger.logDebug('IncidentController.getEventName() | sEventName = '+sEventName);
        return sEventName;
	};

	IncidentController.prototype.getDefaultText						= function(p_sKey, p_oAdditionalParams){
		var oItemPointer	= this.oTextDefaults[p_sKey],
			nTDItemLength	= oItemPointer.length,
			i;

		if(!oItemPointer){Logger.logWarn('IncidentController.getDefaulttext() | Default text for key "'+p_sKey+'" not found.');}

		if(nTDItemLength){
			for(i=0; i<nTDItemLength; i++){
				var oItemChildPointer	= oItemPointer[i];
				if(this.checkAdtnalParamsForDefaultTxt(oItemChildPointer, p_oAdditionalParams)){
					return oItemChildPointer.__cdata;
				}
			}
		}else{
			return oItemPointer.__cdata;
		}
	};

	IncidentController.prototype.checkAdtnalParamsForDefaultTxt		= function(p_oItemPointer, p_oAdditionalParams){
		//Logger.logWarn('IncidentController.checkAdtnalParamsForDefaultTxt() | ');
		var sAttributeID;

		for(sAttributeID in p_oAdditionalParams){
			if(p_oAdditionalParams[sAttributeID] !== p_oItemPointer['_'+sAttributeID]){return false;}
		}
		return true;
	};

	/* **** Public Config properties **** */
	IncidentController.prototype.canBeDeferred						= function(){return this.bDeferEvents;};
	IncidentController.prototype.getCurrentDay						= function(){return this.nCurrentDay;};

	/* **** Public Methods used by SIMScoreManager to apply SCORING RULES **** */
	IncidentController.prototype.anyEventWithPriorityPassed			= function(p_nPriorityLevel){
		var sEventID;
		for(sEventID in this.oIncidentEvents){
			var oIncidentEvent		= this.oIncidentEvents[sEventID],
				nPriority	= oIncidentEvent.getPriority();
			if(nPriority === p_nPriorityLevel){
				if(oIncidentEvent.getStatus() === 'FAILED'){return false;}
			}
		}
		return true;
	};
	IncidentController.prototype.eventWithTimePassed				= function(p_sEventID){
		var oIncidentEvent	= this.getIncidentEventByID(null, p_sEventID);
		if(oIncidentEvent.getStatus() === 'FAILED'){return false;}
		return true;
	};
	IncidentController.prototype.getExtraTimeSpent					= function(){
		var nLapsedMinutes	= 0;
		if(this.oDayTimer.getName() === 'EXTRA_TIME'){
			nLapsedMinutes = (this.oDayTimer.getLapsedTime() - this.nDayTimeLimit) / 60;
		}
		return Math.abs(nLapsedMinutes);
	};
	IncidentController.prototype.getTimeSaved						= function(){
		var nRemainingMinutes	= 0;
		if(this.oDayTimer.getName() === 'DAY_TIME'){
			nRemainingMinutes = this.oDayTimer.getRemainingTime() / 60;
		}
		return Math.abs(nRemainingMinutes);
	};

	IncidentController.prototype.destroy							= function(){
		this.reset();
		this.destroyIncidents();
		this.destroyIncidentEvents();

		this.DITLControllerRef				= null;
		this.sEventPrefix					= null;
		this.sIncidentPrefix				= null;
		this.oIncidents						= null;
		this.oIncidentEvents				= null;
		this.nMinIncidentsPerDayDefault		= null;
		this.nMaxIncidentsPerDayDefault		= null;
		this.nCurrentDay					= null;
		this.nDayTimeLimitDefault			= null;
		this.oDayTimer						= null;
		this.oEventsIntervalTimer			= null;
		this.nExtraTimeDefault				= null;
		this.oEventsIntervalDefaults		= null;
		this.oTextDefaults					= null;

		this.aSelectedIncidents				= null;
		this.nCurrentIncident				= null;

		this.bRandomizeIncidents			= null;
		this.nMinIncidentsPerDay			= null;
		this.nMaxIncidentsPerDay			= null;
		this.nNoOfDays						= null;
		this.nDayTimeLimit					= null;
		this.nExtraTime						= null;
		this.bDeferEvents					= null;
		this.oEventsInterval				= null;
		this.oDayStartsAt					= null;

		this.oSIMViewController				= null;
		this.oActiveIncidentEvent			= null;
		this.bDayTimeOver					= null;
		this.oPopupData						= null;
		this.oFeedbackPageModel				= null;

		this.oContext						= null;
		this.fCallback						= null;
		this.aArgs							= null;
		this.bDayOver						= null;
	};

	IncidentController.prototype.destroyIncidents					= function(){
		for(var sProp in this.oIncidents){
			oIncident = this.oIncidents[sProp];
			oIncident.destroy();
		}
	};

	IncidentController.prototype.destroyIncidentEvents				= function(){
		for(var sProp in this.oIncidentEvents){
			var oIncidentEvent		= this.oIncidentEvents[sProp];
			oIncidentEvent.destroy();
		}
	};

	IncidentController.prototype.reset								= function(){
		this.nCurrentDay			= 1;
		this.bLastDay				= undefined;
		this.resetDayRuntimes();
		this.resetFeedbackData();
	};
	IncidentController.prototype.resetDayRuntimes								= function(){
		this.stopEventIntervalTimer();
		this.stopDayTimer();
		this.resetDayRuntimesForIncidents();

		this.bDayTimeOver			= false;
		this.bDayOver				= false;
		this.oActiveIncidentEvent	= undefined;
		this.nCurrentIncident 		= -1;
		this.aSelectedIncidents		= [];
	};

	/* **** Debugging **** */
	IncidentController.prototype.enumerateIncidents					= function(array, s){
		for(var i=0; i<array.length; i++){
			Logger.logDebug(s+' = '+array[i].getID());
		}
	};
	IncidentController.prototype.toString							= function(){
		return 'framework/simulation/controller/IncidentController';
	};

	return IncidentController;
});