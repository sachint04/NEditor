define([
	'jquery',
	/*'framework/simulation/model/SIMConfigModel',*/
	'framework/simulation/core/SIMScoreManager',
	'framework/simulation/controller/IncidentController',
	'framework/simulation/viewcontroller/SIMViewController',
	'framework/utils/EventDispatcher',
	'framework/utils/ResourceLoader',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, SIMScoreManager, IncidentController, SIMViewController, EventDispatcher, ResourceLoader, Globals, Logger){


	function DITLController(p_oPageViewController, p_$domView, p_sSIMConfigPath, p_xmlIncidentEvents){
		//Logger.logDebug('DITLController.CONSTRUCTOR() | Page View = '+p_oPageViewController+' : DOM = '+p_$domView+' : SIM Config Path = '+p_sSIMConfigPath/*+' : Events XML = '+Globals.toXMLString(p_xmlIncidentEvents)*]);
		EventDispatcher.call(this);

		this.oPageViewRefController			= p_oPageViewController;
		this.xmlIncidentEvents		= p_xmlIncidentEvents;
		this.oSIMViewController;
		this.oIncidentController;

		this.bIncidentConfigParsed;
		this.bEventsParsed;
		this.bSIMViewReady;
		this.bTextDefaultsParsed;
		this.bDataFilesLoaded;

		this.onSIMComplete	=	this.onSIMComplete.bind(this);
		this.onPlayAudio	=	this.onPlayAudio.bind(this);

		var rl1 = new ResourceLoader();
		rl1.loadResource(p_sSIMConfigPath, this, this.parseSIMConfig);
	}

	DITLController.prototype								= Object.create(EventDispatcher.prototype);
	DITLController.prototype.constructor					= DITLController;

	DITLController.prototype.parseSIMConfig					= function(p_oScope, p_aResources, p_oResourceLoader){
		var oScope = this;
		var xmlSIMConfig = p_aResources[0];
		//Logger.logDebug('DITLController.parseSIMConfig() | ');
		$(xmlSIMConfig).children().children().each(function(index, element){
			var nodeName = element.nodeName.toUpperCase();
			//Logger.logDebug('DITLController.parseSIMConfig() | '+nodeName+' : '+oScope.toString()/*+' : '+Globals.toXMLString(element)*/);
			switch(nodeName){
				case 'INCIDENTS' :
					oScope.oIncidentController = new IncidentController(oScope);
					oScope.oIncidentController.parseIncidentConfig(element, oScope, oScope.checkReadyState, ['bIncidentConfigParsed']);
					oScope.oIncidentController.parseIncidentEvents(oScope.xmlIncidentEvents, oScope, oScope.checkReadyState, ['bEventsParsed']);
					break;
				case 'TRIGGERS' :
					oScope.oSIMViewController = new SIMViewController(oScope.oPageViewRefController.$domView);
					oScope.oSIMViewController.parseTriggers(element, oScope, oScope.checkReadyState, ['bSIMViewReady']);
					break;
				case 'SCORING' :
					SIMScoreManager.setScoringRulesConfig(element);
					break;
				case 'TEXTDEFAULTS' :
					oScope.oIncidentController.parseTextDefaults(element, oScope, oScope.checkReadyState, ['bTextDefaultsParsed']);
					break;
				case 'DATAFILES' :
					var sGUID		= oScope.oPageViewRefController.getGUID(),
						sFolderPath	= sGUID.substring(0, sGUID.lastIndexOf('~')).split('~').join('/') + '/';
					//Logger.logDebug('DITLController.parseSIMConfig() | sGUID = '+sGUID+' | '+sFolderPath);
					oScope.oIncidentController.parseDataFiles(element, sFolderPath, oScope, oScope.checkReadyState, ['bDataFilesLoaded']);
					break;
			}
		});

		this.oPageViewRefController.dispatchEvent("PAGE_LOADED");
	};

	DITLController.prototype.checkReadyState				= function(p_oScope, p_oIncidentControler, p_sVarName){
		//Logger.logDebug('DITLController.checkReadyState() | '+p_sVarName+' :: '+this.toString());
		this[p_sVarName] = true;
		if(this.bIncidentConfigParsed &&  this.bEventsParsed && this.bSIMViewReady && this.bDataFilesLoaded && this.bTextDefaultsParsed){
			// ** Parse decision pages only after Incident Events are created
			this.oIncidentController.setDecisionPages(this.getChildPagesInCurrentCW());
			this.oIncidentController.setFeedbackPageModel(this.getLastPageInCurrentCW());
			this.oIncidentController.setView(this.oSIMViewController);
			this.oSIMViewController.setController(this.oIncidentController);
			this.oSIMViewController.addEventListener('SIM_COMPLETE', this.onSIMComplete);
			this.oSIMViewController.addEventListener('PLAY_AUDIO', this.onPlayAudio);
			SIMScoreManager.setController(this.oIncidentController);
			this.oIncidentController.startSIM();
		}
	};

	DITLController.prototype.onSIMComplete					= function(e){
		//Logger.logDebug('DITLController.onSIMComplete() | ');
		this.oSIMViewController.removeEventListener('SIM_COMPLETE', this.onSIMComplete);
		this.dispatchEvent('SIM_COMPLETE', {type:'SIM_COMPLETE', target:this});
	};
	DITLController.prototype.onPlayAudio					= function(e){
		//Logger.logDebug('DITLController.onPlayAudio() | ');
		this.dispatchEvent('PLAY_AUDIO', {type:'PLAY_AUDIO', target:this, audioID:e.audioID});
	};

	DITLController.prototype.parseBookmark					= function(p_sBookmark){
		Logger.logDebug('DITLController.parseBookmark() | ');
		// TODO :
	};

	DITLController.prototype.getBookmark					= function(p_sBookmark){
		Logger.logDebug('DITLController.getBookmark() | ');
		// TODO:
	};

	/*getElementByID			= function(p_sID){
		var $elem = this.$domView.find('#'+p_sID);
		if($elem.length == 0){Logger.logError('DITLController.getElementByID() | Element with ID "'+p_sID+'" not found.');}
		if($elem.length > 1){Logger.logWarn('DITLController.getElementByID() | Multiple Elements with ID "'+p_sID+'" found.');}
		return $elem;
	};*/

	DITLController.prototype.getChildPagesInCurrentCW		= function(){
		//Logger.logDebug('DITLController.getChildPagesInCurrentCW() | ');
		return this.oPageViewRefController.getChildPagesInCurrentCW();
	};

	DITLController.prototype.getLastPageInCurrentCW			= function(){
		//Logger.logDebug('DITLController.getLastPageInCurrentCW() | ');
		return this.oPageViewRefController.getCWLastPage();
	};

	DITLController.prototype.destroy						= function(){
		//Logger.logDebug('DITLController.destroy() | ');
		this.oSIMViewController.removeEventListener('SIM_COMPLETE', this.onSIMComplete);
		this.oSIMViewController.removeEventListener('PLAY_AUDIO', this.onPlayAudio);
		this.oSIMViewController.destroy();
		this.oIncidentController.destroy();

		this.onSIMComplete			= null;
		this.onPlayAudio			= null;

		this.oPageViewRefController	= null;
		this.xmlIncidentEvents		= null;
		this.oSIMViewController		= null;
		this.oIncidentController	= null;

		this.bIncidentConfigParsed	= null;
		this.bEventsParsed			= null;
		this.bSIMViewReady			= null;
		this.bTextDefaultsParsed	= null;
		this.bDataFilesLoaded		= null;

		this.prototype				= null;
	};

	DITLController.prototype.toString						= function(){
		return 'framework/simulation/DITLController';
	};

	return DITLController;
});
