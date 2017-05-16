/*
 * oFeedback    = {
 *     activityType    : "CONVERSATION"
 *     feedbackType    : "PARAMETERBASEDFEEDBACK",
 *     strandFeedback    : [{"ParameterID":oOptnGrp._ID,"ParameterName":oOptnGrp._NAME,"ParameterFeedback":oOptn.__cdata}, n...],
 *     feedback        : {
 * 							title		: "title",
 * 							content		: "content",
 * 							History		: [{
 * 											question					: "",
 * 											option						: "",
 * 											immediateFbTitle			: "",
 * 											immediateFbContent			: "",
 * 											optionalData	: {}
 * 										  }],
 * 							optionalData: {}
 * 						  }
 * }
 */
define([
	'framework/core/feedback/History',
	'framework/utils/Logger'
], function(History, Logger){
	function Feedback(p_sType, p_sActivityType, p_sQuestionID){
		//Logger.logDebug('Feedback.CONSTRUCTOR()');
		this.sType				= p_sType;
		this.sActivityType		= p_sActivityType;
		this.sQuestionID		= p_sQuestionID;

		this.sTitle				= '';
		this.sContent			= '';
		this.aHistory			= [];
		this.oOptionalData		= {};
		this.sAudioID;
		this.sStyle             = "";
	}

	Feedback.prototype.constructor							= Feedback;

	Feedback.prototype.processFeedback						= function(p_x2jsFeedback, p_oScore){
		//Logger.logDebug('Feedback.processFeedback() | \n\tX2JS Feedback Node = '+JSON.stringify(p_x2jsFeedback));
		this.setTitle(p_x2jsFeedback.title.__cdata);
		this.setContent(p_x2jsFeedback.content.__cdata);
		this.setStyle(p_x2jsFeedback._class);
        this.setAudioID(p_x2jsFeedback._audioID);
	};
	// ** Getters
	/*
	 * @ returns the Feedback Type
	 */
	Feedback.prototype.getType								= function(){
		return this.sType;
	};

	/*
	 * @ returns the Activity Type
	 */
	Feedback.prototype.getActivityType						= function(){
		return this.sActivityType;
	};

	Feedback.prototype.getQuestionID						= function(){
		return this.sQuestionID;
	};

	Feedback.prototype.getTitle								= function(){
		return this.sTitle;
	};

	Feedback.prototype.getContent							= function(){
		return this.sContent;
	};

	Feedback.prototype.getOptionalData						= function(){
		return this.oOptionalData;
	};

	Feedback.prototype.getHistory							= function(p_nIndex){
		//Logger.logDebug('Feedback.getHistory() | Index = '+p_nIndex);
		if(p_nIndex !== undefined && this.checkHistoryInBounds(p_nIndex)){
			return this.aHistory[p_nIndex];
		}
		return this.aHistory;
	};
	// ** For using this method the Component Model needs to save the "id" property in the "optionalData" when generating History
	Feedback.prototype.getHistoryByID						= function(p_sID){
		for (var i=0; i < this.aHistory.length; i++) {
			var oHistory	= this.aHistory[i];
			if(oHistory.getID() === p_sID){
				return oHistory;
			}
		};
		Logger.logWarn('Feedback.getHistoryByID() | WARN: Failed to find History Object with ID "'+p_sID+'"');
	};
	Feedback.prototype.setStyle                                = function(p_sStyle){
        this.sStyle = p_sStyle;
    };
    Feedback.prototype.getStyle                             = function(){
        return this.sStyle;
    };

    Feedback.prototype.setAudioID                               = function(p_sAudioID){
        this.sAudioID = p_sAudioID;
    };
    Feedback.prototype.getAudioID                               = function(){
        return this.sAudioID;
    };
	// ** SETTERS - Sets the value of the current property
	Feedback.prototype.setTitle								= function(p_sTitle){
		this.sTitle = p_sTitle;
	};
	Feedback.prototype.setContent							= function(p_sContent){
		this.sContent = p_sContent;
	};
	Feedback.prototype.setOptionalData						= function(p_oOptionalData){
		this.oOptionalData = p_oOptionalData;
		//Logger.logDebug('Feedback.setOptionalData() | '+JSON.stringify(this.oOptionalData));
	};
	Feedback.prototype.setHistoryOptionalData				= function(p_oOptionalData, p_nIndex){
		if(p_nIndex && this.aHistory && this.checkHistoryInBounds(p_nIndex)){
			var oHistory = this.aHistory[p_nIndex];
			oHistory.setOptionalData(p_oOptionalData);
			return true;
		}
		Logger.debug('ERROR: Feedback.setHistoryOptionalData() | ');
	};

	// ** Update Methods - Update the values
	Feedback.prototype.updateOptionalData					= function(p_sKey, p_value){
		this.oOptionalData[p_sKey] = p_value;
	};

	Feedback.prototype.updateHistory						= function(p_oHistory, p_nIndex){
		//Logger.logDebug('Feedback.updateHistory() | ADD at Index = '+p_nIndex);
		if(!this.aHistory){this.aHistory = [];}
		//Logger.logDebug('\tBEFORE Update Length = '+this.aHistory.length);
		if(this.isHistory(p_oHistory)){
			//Logger.logDebug('\t:: CHECK :: Index Defined = '+p_nIndex+' : In Bounds = '+this.checkHistoryInBounds(p_nIndex)+' : Evaluated To = '+(p_nIndex && this.checkHistoryInBounds(p_nIndex)));
			if(p_nIndex != null && this.checkHistoryInBounds(p_nIndex)){
				//Logger.logDebug('\t\tADDING at Index = '+p_nIndex);
				this.aHistory[p_nIndex] = p_oHistory;
				return;
			}
			//Logger.logDebug('\t\tPUSHING at Index = '+this.aHistory.length);
			this.aHistory.push(p_oHistory);
		}
		//Logger.logDebug('\tAFTER Update Length = '+this.aHistory.length);
	};

	Feedback.prototype.reset									= function(){
		//Logger.logDebug('Feedback.reset() | BEFORE : History Length  = '+this.aHistory.length);
		for (var i=0; i < this.aHistory.length; i++) {
			var oHistory	= this.aHistory[i];
			oHistory.reset();
			oHistory.destroy();
		};
		//Logger.logDebug('Feedback.reset() | AFTER : History Length  = '+this.aHistory.length);
		this.sTitle				= '';
		this.sContent			= '';
		this.aHistory			= [];
		this.oOptionalData		= {};
	};

	Feedback.prototype.updateHistoryOptionalData			= function(p_sKey, p_value, p_nIndex){
		if(p_nIndex && this.checkHistoryInBounds(p_nIndex)){
			var oHistory = this.aHistory[p_nIndex];
			oHistory.updateOptionalData(p_sKey, p_value);
		}
	};

	// ** Helper Methods
	Feedback.prototype.checkHistoryInBounds					= function(p_nIndex){
		//Logger.logDebug('Feedback.checkHistoryInBounds() | \n\t('+p_nIndex+' > -1) = '+(p_nIndex > -1)+' : ('+p_nIndex+' < '+this.aHistory.length+') = '+(p_nIndex < this.aHistory.length));
		if((p_nIndex > -1) && (p_nIndex < this.aHistory.length)){return true;}
		Logger.logWarn('WARN: Index out of bounds. The index "'+p_nIndex+'" supplied is greater than the length of the history');
		return false;
	};

	Feedback.prototype.isHistory								= function(p_oHistory){
		//Logger.logDebug('Feedback.isHistory() | ');
		if(!p_oHistory instanceof History){Logger.logError('ERROR: Feedback.updateHistory() | History Objects needs to be an Instance of History Class');}
		return true;
	};

	Feedback.prototype.toString								= function(){
		//Logger.logDebug('Feedback.toString() | ');
		return 'framework/core/feedback/Feedback';
	};

	Feedback.prototype.destroy								= function(){
		//Logger.logDebug('Feedback.destroy() | Qstn ID = '+this.sQuestionID);
		this.sType				= null;
		this.sActivityType		= null;
		this.sQuestionID		= null;

		this.sTitle				= null;
		this.sContent			= null;
		this.aHistory			= null;
		this.oOptionalData		= null;
	};

	return Feedback;
});
