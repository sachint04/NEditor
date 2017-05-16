	'use strict';
	/**
	 * Application Module controls Envoirnment settings
	 * 
	 * @exports framework/core/ActivityMarkupCollection
	 */
define([
	'jquery',
	'framework/utils/Logger'
], function($, Logger){
	var __instanceActivityMarkupCollection;
	
	/**
 	 * <b>ActivityMarkupCollection</b> is a singleton imeplementation.Holds Activity templates View.
     * @constructor
     * @alias module:ActivityMarkupCollection
     */
	function ActivityMarkupCollection(){
		//Logger.logDebug('ActivityMarkupCollection.CONSTRUCTOR() | ');
		this.sActivityMarkup;
	}

	ActivityMarkupCollection.prototype.init						= function(p_htmlActivityMarkup){
		//Logger.logDebug('ActivityMarkupCollection.init() | '+p_htmlActivityMarkup);
		this.sActivityMarkup = p_htmlActivityMarkup;
	};

	ActivityMarkupCollection.prototype.getMarkup					= function(p_sMarkupID){
		//Logger.logDebug('ActivityMarkupCollection.init() | '+p_htmlActivityMarkup);
		var $foundMarkup	= $(this.sActivityMarkup).find('#'+p_sMarkupID);
		if($foundMarkup.length === 0){Logger.logError('ActivityMarkupCollection.getMarkup() | ERROR: Markup with ID "'+p_sMarkupID+'" not found.');}
		return $foundMarkup;
	};

	ActivityMarkupCollection.prototype.toString					= function(){
		return 'framework/core/ActivityMarkupCollection';
	};

	if(!__instanceActivityMarkupCollection){
		__instanceActivityMarkupCollection = new ActivityMarkupCollection();
		//Logger.logDebug('^^^^^^^^^^^^ Activity Markup Wrapper INSTANCE ^^^^^^^^^^^^^^ '+__instanceActivityMarkupCollection);
	}

	return __instanceActivityMarkupCollection;
});
