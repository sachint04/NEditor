define([
	'jquery',
	'x2js',
	'framework/utils/Timer',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, X2JS, Timer, EventDispatcher, Globals, Logger){

	function Trigger(p_oEventModel, p_xmlTrigger) {
		//Logger.logDebug('Trigger.CONSTRUCTOR() | ');
		EventDispatcher.call(this);
		/*this.sType;
		this.sLabel;
		this.sID;
		this.sEventState;
		this.nTimeElapsed;
		this.nDeferredDays;*/
		this.oDataModel;
		this.oTriggerTimer;
		this.oEventModel		= p_oEventModel;

		this.sTimeStamp;
		/*
		 * NOTTRIGGERED	- Trigger message NOT read
		 * UNREAD		- Trigger message NOT read
		 * READ			- Trigger message read
		 */
		this.sState		= 'NOTTRIGGERED';
		/*
		 * NOTSTARTED	- Trigger message NOT started
		 * INCOMPLETE	- Trigger message started
		 * COMPLETED	- Trigger message completed
		 * DEFERRED		- Event for Trigger message deferred
		 */
		this.sStatus;

		//this.setStatus('NOTSTARTED');
		this.setState('NOTTRIGGERED');
		this._parseTrigger(p_xmlTrigger);
		this._addEventListeners();
	}

	Trigger.prototype												= Object.create(EventDispatcher.prototype);
	Trigger.prototype.constructor									= Trigger;

	Trigger.prototype._addEventListeners							= function(){
		//Logger.logDebug('Trigger._addEventListeners() | Trigger ID = '+this.getID());
		this.handleEvents = this.handleEvents.bind(this);
		this.oEventModel.addEventListener('EVENT_STATE_CHANGE', this.handleEvents);
	};
	Trigger.prototype._parseTrigger									= function(p_xmlTrigger){
		if(p_xmlTrigger.nodeType){
			var oX2JS = new X2JS();
			this.oDataModel = oX2JS.xml2json(p_xmlTrigger);
			//Logger.logDebug('Trigger.parseTrigger() | '+JSON.stringify(this.oDataModel));
		}else{
			Logger.logError('Trigger.parseTrigger() | Invalid Parameter. '+(p_xmlTrigger.nodeType));
		}
	};

	Trigger.prototype.handleEvents									= function(e){
		//if(this.getStatus() !== 'NOTSTARTED'){return;}
		if(this.getState() !== 'NOTTRIGGERED'){return;}
		var sEventType				= e.type,
			oIncidentEvent			= e.target,
			sIncidentEventState		= oIncidentEvent.getState(),
			sIncidentEventStatus	= oIncidentEvent.getStatus();
		//Logger.logDebug('Trigger.handleEvents() | Event Type = '+sEventType+'\n\tIncident ID = '+oIncidentEvent.getIncidentID()+' : Event ID = '+oIncidentEvent.getID()+' : Event State = '+sIncidentEventState+' : Event Status = '+sIncidentEventStatus);

		switch(sEventType){
			case 'EVENT_STATE_CHANGE':
				//Logger.logDebug('Trigger.handleEvents() | '+sIncidentEventState+' : Self State = '+this.getStoredEventState());
				this.eventStateChangeHandler(sIncidentEventState);
				break;
		}
	};

	Trigger.prototype.eventStateChangeHandler						= function(p_sIncidentEventState){
		//Logger.logDebug('Trigger.eventStateChangeHandler() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID()+'\n\t Self State = '+this.getStoredEventState()+' : Event State = '+sIncidentEventState);
		var sIncidentEventState	= p_sIncidentEventState;
		// ** Events current state matches the stored Event state
		if(sIncidentEventState === this.getStoredEventState()){
			var nTimeElapsed	= this.getTimeElapsed(),
				nDeferredDays	= this.getDeferredDays();
			//Logger.logDebug('\tTime Elapsed = '+nTimeElapsed+' : Deferred Days = "'+nDeferredDays+'"');

			// ** If Event State is COMPLETED
			if(sIncidentEventState === 'COMPLETED'){
				// ** Check if the SELF Trigger ID is set as one of the Result Trigger IDs
				if(this.isInResultTriggerList()){
					// ** Check if the Trigger is TIME based
					(this.isTimeBasedTrigger(nTimeElapsed)) ? this.startTimer(nTimeElapsed) : this.fireTrigger();
				};
				return;
			}

			// ** If Event State is STARTED | DEFERRED
			if(sIncidentEventState === 'STARTED' || sIncidentEventState === 'DEFERRED'){
				if(nDeferredDays && nDeferredDays !== -1){
					// ** Check the number of days the event has been deferred and then fire the Trigger
					if(this.getEventDeferredDays() === nDeferredDays){
						// ** Check if the Trigger is TIME based
						(this.isInResultTriggerList() && this.isTimeBasedTrigger(nTimeElapsed)) ? this.startTimer(nTimeElapsed) : this.fireTrigger();
						return;
					}
				}
			}

			// ** If Event State is STARTED | ACTIVE | INACTIVE | DEFERRED | TIMEEXPIRED | FAILED && Trigger is TIME based
			if(this.isTimeBasedTrigger(nTimeElapsed)){
				this.startTimer(nTimeElapsed);
				return;
			}

			// ** If nothing of the above holds true, FIRE the Trigger
			this.fireTrigger();
		}
	};

	Trigger.prototype.isTimeBasedTrigger							= function(p_nTimeElapsed){
		//Logger.logDebug('Trigger.isTimeBasedTrigger() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID()+' : Time Elapsed = '+p_nTimeElapsed+' : '+(p_nTimeElapsed && p_nTimeElapsed !== -1));
		if(p_nTimeElapsed && p_nTimeElapsed !== -1){
			return true;
		}
		return false;
	};

	Trigger.prototype.startTimer									= function(p_nTimeElapsed){
		//Logger.logDebug('Trigger.startTimer() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID()+' : Time Elapsed = '+p_nTimeElapsed);
		this.removeEventStateChangeListener();
		this.fireTrigger = this.fireTrigger.bind(this);

		this.oTriggerTimer = new Timer();
		this.oTriggerTimer.setEndTime(p_nTimeElapsed * 60);
		this.oTriggerTimer.addEventListener('TIME_OVER', this.fireTrigger);

		this.oTriggerTimer.start();
	};
	Trigger.prototype.stopTimer										= function(){
		//Logger.logDebug('Trigger.stopTimer() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID());
		if(this.oTriggerTimer){
			this.oTriggerTimer.removeEventListener('TIME_OVER', this.fireTrigger);
			this.oTriggerTimer.stop();
		}
	};

	Trigger.prototype.fireTrigger									= function(e){
		//Logger.logDebug('Trigger.fireTrigger() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID());
		this.removeAllListeners();
		this.dispatchEvent('FIRE_TRIGGER', {type:'FIRE_TRIGGER', target:this});
	};

	Trigger.prototype.removeEventStateChangeListener				= function(){
		this.handleEvents = this.handleEvents.bind(this);
		try{
			this.oEventModel.removeEventListener('EVENT_STATE_CHANGE', this.handleEvents);
		}catch(e){
			Logger.logWarn('Trigger.removeEventStateChangeListener() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID()+'. Failed to remove the "EVENT_STATE_CHANGE" event listener');
		};
	};
	Trigger.prototype.removeTimeOverListener						= function(){
		this.fireTrigger = this.fireTrigger.bind(this);
		try{
			this.oTriggerTimer.removeEventListener('TIME_OVER', this.fireTrigger);
		}catch(e){
			//Logger.logWarn('Trigger.removeTimeOverListener() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID()+'. Failed to remove the "TIME_OVER" event listener');
		};
	};
	Trigger.prototype.removeAllListeners							= function(){
		//Logger.logDebug('Trigger.removeAllListeners() | Incident ID = '+this.getIncidentID()+' : Event ID = '+this.getEventID()+' : Trigger ID = '+this.getID());
		this.removeEventStateChangeListener();
		this.removeTimeOverListener();
	};

	Trigger.prototype.getPageText									= function(){
		var data		= {},
			aPageText	= this.oDataModel.pageText,
			len			= aPageText.length,
			i;

		for(i=0; i<aPageText.length; i++){
			var pointer			= aPageText[i];
			data[pointer._id]	= pointer.__cdata;
		}

		return data;
	};

	/* XML Vars */
	Trigger.prototype.getID											= function(){return String(this.oDataModel._id);};
	Trigger.prototype.getType										= function(){return this.oDataModel._type;};
	Trigger.prototype.getStoredEventState							= function(){return this.oDataModel._eventState;};
	Trigger.prototype.getTimeElapsed								= function(){return Number(this.oDataModel._timeElapsed);};
	Trigger.prototype.getDeferredDays								= function(){return Number(this.oDataModel._deferredDays);};

	/* Event XML Vars */
	Trigger.prototype.getEventState									= function(){return this.oEventModel.getState();};
	Trigger.prototype.getEventID									= function(){return this.oEventModel.getID();};
	Trigger.prototype.getIncidentID									= function(){return this.oEventModel.getIncidentID();};
	Trigger.prototype.getEventName									= function(){return this.oEventModel.getEventName();};
	Trigger.prototype.getEventLife									= function(){return this.oEventModel.getLife();};
	Trigger.prototype.getEventLifeLeft								= function(){return this.oEventModel.getLifeLeft();};
	Trigger.prototype.getEventDeferredDays							= function(){return this.oEventModel.getDaysDeferred();};
	//Trigger.prototype.getEventTransitionText						= function(){return this.oEventModel.getTransitionText();};
	Trigger.prototype.getEventPageText								= function(){return this.oEventModel.getPageText();};

	/* Runtime Vars */
	Trigger.prototype.getTimeStamp									= function(){return this.sTimeStamp;};
	Trigger.prototype.setTimeStamp									= function(p_sTimeStamp){this.sTimeStamp = p_sTimeStamp;};

    Trigger.prototype.getState                                      = function(){return this.sState;};
    Trigger.prototype.setState                                      = function(p_sState){
        var sState = p_sState.toUpperCase();
        if(this.getState() === sState){return;}
        if(sState === 'UNREAD' || sState === 'READ'){
            this.sState = p_sState;
            return;
        }
        Logger.logError('Trigger.setState() | Invalid parameter "'+p_sState+'" cannot be set as Trigger State');
    };

	Trigger.prototype.isInResultTriggerList							= function(){
		var aResultTriggerList	= this.oEventModel.getResultTriggerList();
		for(var i=0; i<aResultTriggerList.length; i++){
			if(aResultTriggerList[i] === this.oDataModel._id){
				return true;
			}
		}
		return false;
	};

	Trigger.prototype.isTimed										= function(){
		var bIsTimed	= (this.oTriggerTimer) ? true : false;
		return bIsTimed;
	};

	Trigger.prototype.reset											= function(){
		this.sStatus		= 'NOTSTARTED';
		this.sState			= 'NOTTRIGGERED';
		this.oTriggerTimer	= null;
		this.removeAllListeners();
		//this._addEventListeners();
	};

	Trigger.prototype.toString										= function(){
		return 'framework/simulation/model/Trigger';
	};

	return Trigger;
});