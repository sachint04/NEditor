/**
 * @author BharatK
 * @modified Vincent Gomes
 */
define([
	'framework/activity/model/ActivityModelAbstract',
	'framework/core/feedback/Feedback',
	'framework/core/feedback/FeedbackParameterBased',
	'framework/core/feedback/History',
	'framework/core/score/ScoreManager',
	'framework/core/score/GlobalParameterizedScore',
	'framework/model/CourseConfigModel',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function(ComponentModelAbstract, Feedback, FeedbackParameterBased, History, ScoreManager, GlobalParameterizedScore, CourseConfigModel, ResourceLoader, Logger){
	
	function ConversationModel(p_xmlActivityNode, p_sGUID, p_sScoringID){
		ComponentModelAbstract.call(this, p_xmlActivityNode, p_sGUID, p_sScoringID);
		this.aMCQList = [];		
	}

	ConversationModel.prototype										= Object.create(ComponentModelAbstract.prototype);
	ConversationModel.prototype.constructor							= ConversationModel;
	
	ConversationModel.prototype.loadDependencies					= function(){
		Logger.logDebug('ConversationModel : loadDependencies');
		$xmlActivity			= $(this.activityXMLNode);
		var sFileName			= $xmlActivity.attr('conversationFilename'),
			sLocation			= $xmlActivity.attr('conversationFileLocation'),
			sFolderPath			= this.sGUID.substring(0, this.sGUID.lastIndexOf('~')).split('~').join('/') + '/',
			sFilePath			= CourseConfigModel.getRootPath() + CourseConfigModel.getConfig(sLocation).folderURL + sFolderPath + sFileName,
			oRL					= new ResourceLoader();
		//Logger.logDebug('ConversationModel : loadDependencies| FILE PATH = '+sFilePath);
		oRL.loadResource(sFilePath, this, this.onDataFilesLoaded, [$xmlActivity]);
	};
	
	ConversationModel.prototype.onDataFilesLoaded					= function(p_oScope, p_aResources, p_oResourceLoader, p_$xmlActivityNode){
		var $xmlData			= $(p_aResources[0]);
		p_$xmlActivityNode.append($xmlData[0].childNodes);
		p_oResourceLoader.destroy();
		p_oResourceLoader 		= null;
		ComponentModelAbstract.prototype.loadDependencies.call(this);
	};
	
	/**
	 * override funtion - conversation will not have option based score
	 * @param p_nUserScore
	 */
	ConversationModel.prototype.updateUserScores					= function(p_nUserScore){
		/*
		if(this.oDataModel._fbType.toUpperCase() === 'GLOBALPARAMETERBASEDFEEDBACK'){
			GlobalParameterizedScore.updateUserScores( this.sScoringUID, p_nUserScore);
		}else{			
			Logger.logDebug('ConversationModel : updateUserScores| Fthis.oScore = '+this.oScore);
			this.oScore = updateUserScores(p_nUserScore);
		}
		*/
	};

	ConversationModel.prototype._generateFeedback					= function(){
		var blnCorrect  		= (this.getScore().getPercentScore() === 100) ? true : false,
		    aUserSelections		= this.getScore().getUserSelections(),
		    sFeedbackType		= this.getFeedbackType().toUpperCase(),
		    x2jsFeedback		= this._getFeedbackNode(sFeedbackType),
			i;
		this.oFeedback.processFeedback(x2jsFeedback, this.getScore());

		// ** Populating History in Feedback Object
		for (var i=0; i < aUserSelections.length; i++) {
			// ** @ userSelection : This could be a STRING, ARRAY or OBJECT. Example: String in case of MCQ, Array in case of Conversation
			var userSelection	= aUserSelections[i];
			// ** The method named "getHistory" needs to be implemented by all Final Data Models
			Logger.logDebug('ConversationModel._generateFeedback \n\t User Selection = '+JSON.stringify(userSelection));
			this.updateFeedbackHistory(userSelection, i);
		};

		var o	= {};
		this.getOptionalData(o);
		this.oFeedback.setOptionalData(o || {});
		return this.oFeedback;
	};
	
	ConversationModel.prototype.updateScore							= function(p_score){
		Logger.logDebug('ConversationModel.updateScore()'+ p_score);
		if(this.oDataModel._fbType.toUpperCase() === 'GLOBALPARAMETERBASEDFEEDBACK'){
			GlobalParameterizedScore.updateScore(p_score);
		}else{
			this.oScore.updateScore(p_score);
		}
	};
		
	ConversationModel.prototype.updateUserSelections	    		= function(p_sUserSelection){
		Logger.logDebug('ComponentModelAbstract.updateUserSelections() - UserSelection = '+ JSON.stringify(p_sUserSelection));
		this.getScore().updateUserSelections(p_sUserSelection);
	};
	
	// ** Gets the initial Set for coversation
	ConversationModel.prototype.getInitialConversationSet			= function(){
			//Initial is now default to 0 can be updated to get any set
			return this.oDataModel.Root.SCENARIO.CONVERSATION.SET[0];
		};	

	/*
	 * @ Returns : The x2js Set with the Set ID provided in the parameter from the collection of coversation sets
	 */
	ConversationModel.prototype.getConversationSet					= function(p_sSetID){
		var aSetList	= this.oDataModel.Root.SCENARIO.CONVERSATION.SET,
			nSetsLength	= aSetList.length,
			i;
		
		// ** Return first x2js SET if the "p_sSetID" is not passed
		if(!p_sSetID){p_sSetID = 0;}
		this.oDataModel.p_SetID		= p_sSetID;
		
		// ** Return the matching x2js SET
		for(i=0; i<nSetsLength; i++){
			if(aSetList[i]._ID == p_sSetID){return aSetList[i];}
		}
		
		Logger.logError('ConversationModel.getConversationSet() | ERROR: SET with ID "'+p_sSetID+'" not found.');
	};
	
	/**
	 * @return {String} - Return first/default set ID 
	 */
	ConversationModel.prototype.getDefaultSetID						= function(){
		return this.oDataModel.Root.SCENARIO.CONVERSATION.SET[0]._ID;
	};;
	/*
	 * @ p_setID 		: This parameter can either be a SET ID string or an x2js SET Object
	 * @ Returns : The x2js Set with the Set ID provided in the parameter from the collection of coversation sets
	 */
	ConversationModel.prototype.getX2JSSet									= function(p_setID){
		var x2jsSet	= (typeof(p_setID) === 'string') ? this.getConversationSet(p_setID) : p_setID;
		return x2jsSet;
	};
	/*
	 * @ p_setID 		: This parameter can either be a SET ID string or an x2js SET Object
	 * @ p_sOptionID	: This parameter is the option ID in the SET to be matched and returned
	 * @ Returns		: The matching x2js Option Object for a Set
	 */
	ConversationModel.prototype.getOptionForSet								= function(p_setID, p_sOptionID){
		var x2jsSet				= this.getX2JSSet(p_setID),
			aOptionList			= x2jsSet.OPTIONS.OPTION,
			nOptionListLength	= aOptionList.length,
			i;
		
		// ** Match the Option with the passed in Option ID and return the x2js Option Object
		for(i=0; i<nOptionListLength; i++){
			if(aOptionList[i]._ID == p_sOptionID){
				return aOptionList[i];
			}
		}
		Logger.logWarn('ConversationModel.getOptionForSet() | WARN: Option with ID "'+p_sOptionID+'" not found in Set ID "'+p_setID+'"');
		return false;
	};
	/*
	 * @ p_setID 		: This parameter can either be a SET ID string or an x2js SET Object
	 * @ p_sOptionID	: This parameter is the option ID in the SET to be matched and returned
	 * @ Returns		: The matching Option CDATA (text) for a Set
	 */
	ConversationModel.prototype.getOptionTextForSet							= function(p_setID, p_sOptionID){
		var x2jsSet		= this.getX2JSSet(p_setID),
			x2jsOption	= this.getOptionForSet(p_setID, p_sOptionID);
			
		return x2jsOption.__cdata;
	};
	/*
	 * @ p_setID 		: This parameter can either be a SET ID string or an x2js SET Object
	 * @ p_sOptionID	: This parameter is the option ID in the SET to be matched and returned
	 * @ Returns		: The FBK CDATA (text) for the matching Option in a Set
	 */
	ConversationModel.prototype.getOptionFeedbackTextForSet					= function(p_setID, p_sOptionID){
		var x2jsSet		= this.getX2JSSet(p_setID),
			x2jsOption	= this.getOptionForSet(p_setID, p_sOptionID),
			sFbkTitle	= (x2jsOption.FBK._TITLE !== undefined) ? x2jsOption.FBK._TITLE : 'Feedback',
			sFbkContent	= x2jsOption.FBK.__cdata;
		return {
			title	: sFbkTitle,
			content	: sFbkContent
		};
	};
	/*
	 * @ p_setID 		: This parameter can either be a SET ID string or an x2js SET Object
	 * @ p_sOptionID	: This parameter is the option ID in the SET to be matched and returned
	 * @ Returns		: An Array of PARAMETER list for the matching Option in a Set
	 */
	ConversationModel.prototype.getOptionParameterListForSet				= function(p_setID, p_sOptionID){
		var x2jsSet		= this.getX2JSSet(p_setID),
			x2jsOption	= this.getOptionForSet(p_setID, p_sOptionID);
		return x2jsOption.PARAMETER;
	};
	/*
	 * @ p_setID	: This parameter can either be a SET ID string or an x2js SET Object
	 * @ Returns	: The an Array of Objects for each Response in the matching Set
	 * 			   	[{
	 * 					characterID	: "1", 
	 * 					name		: "Mr. X", 
	 * 					response	: "..."
	 * 				 }, n, ...]
	 */
	ConversationModel.prototype.getResponseListForSet						= function(p_setID){
		// ** Accumulate Response Text
		var x2jsSet				= this.getX2JSSet(p_setID),
			aResponseList		= (x2jsSet.RESPONSE.length)? x2jsSet.RESPONSE : [x2jsSet.RESPONSE],
			nResponseCount		= aResponseList.length,
			aResponses			= [];

			for (var i=0; i < nResponseCount; i++) {
				var oResponsePointer	= aResponseList[i],
					oResponseInfo		= this.getResponseInfo(oResponsePointer);
				aResponses.push(oResponseInfo);
			};
		
		// ** [{characterID: "1", name: "Mr. X", response:"..."}, n]
		return aResponses;
	};
	
	/**
	 *@param {Object} p_x2jsResponse  - response data (JSON)
	 */
	ConversationModel.prototype.getResponseInfo								= function(p_x2jsResponse){
		var sCharacterID		= p_x2jsResponse._CHARACTERID,
			sCharacterName		= this.getCharacterNameByID(sCharacterID),
			sResponseText		= p_x2jsResponse.__cdata;
		//Logger.logDebug('ConversationModel.getResponseInfo() | \n\tCharacter ID = '+sCharacterID+'\n\tCharacter Name = '+sCharacterName/*+'\n\tResponse Text ='+sResponseText*/+'\n\n');
		
		// ** {characterID: "1", name: "Mr. X", response:"..."}
		return {characterID:sCharacterID, name:sCharacterName, response:sResponseText};
	};
	
	/**
	 * 	Returns Character Node 
	 *
	 * @param  {String} p_sCharacterID - character ID
	 */
	ConversationModel.prototype.getCharacterDataByID						= function(p_sCharacterID){
		var oCharacterPointer	= (this.oDataModel.Root.SCENARIO.CHARACTERS && this.oDataModel.Root.SCENARIO.CHARACTERS.CHARACTER)? this.oDataModel.Root.SCENARIO.CHARACTERS.CHARACTER :[];
		oCharacterPointer		= (oCharacterPointer.length) ? oCharacterPointer : [oCharacterPointer];
		i;

		for (i=0; i < oCharacterPointer.length; i++) {
		  if(oCharacterPointer[i]._ID === p_sCharacterID){
		  	return oCharacterPointer;
		  }
		};

		return null;
	};
	
	/**
	 * 	Returns Character name by ID 
	 *
	 * @param  {String} p_sCharacterID - character ID
	 */
	ConversationModel.prototype.getCharacterNameByID						= function(p_sCharacterID){
		var oCharacterPointer	= (this.oDataModel.Root.SCENARIO.CHARACTERS && this.oDataModel.Root.SCENARIO.CHARACTERS.CHARACTER)? this.oDataModel.Root.SCENARIO.CHARACTERS.CHARACTER :null;
		oCharacterPointer		= (oCharacterPointer && oCharacterPointer.length) ? oCharacterPointer : [];
		nLength				= oCharacterPointer.length,
		i;

		for (i=0; i < nLength; i++) {
		  if(oCharacterPointer[i]._ID === p_sCharacterID){
		  	return oCharacterPointer.NAME || "";
		  }
		};

		return "";
	};
	
	
	
	
	// Gets the Response text
	ConversationModel.prototype.getConversationResponse						= function(p_CurrentSet){
		//Initial is now default to 0 can be updated to get any set
		return p_CurrentSet.RESPONSE;
	};


	/**
	 * @return {Array} - Returns list of avaible expressions in ISAP 
	 */
	ConversationModel.prototype.getExpressionList								= function(sExpressionID){
		var result	= [],
		oExpressionSet 		= (this.oDataModel.Root.SCENARIO.EXPRESSIONS && this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION)? this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION : [];
		
		oExpressionSet		=  (oExpressionSet && oExpressionSet.length)?oExpressionSet : [oExpressionSet];
		
		for(i=0;i<oExpressionSet.length;i++)	{
			oCurrEXPSet=oExpressionSet[i];
			if (String(oCurrEXPSet._ID) == String(sExpressionID)){
				result.push(oCurrEXPSet.TYPE.toLowerCase());				
			}				
		}
		
		return result;
	};
	
	ConversationModel.prototype.getExpressions								= function(sExpressionID){
		var oCurrEXPSet, result, 
		oExpressionSet 		= (this.oDataModel.Root.SCENARIO.EXPRESSIONS && this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION)? this.oDataModel.Root.SCENARIO.EXPRESSIONS.EXPRESSION : [];
		
		oExpressionSet		=  (oExpressionSet.length)?oExpressionSet : [oExpressionSet];
		
		if(!oExpressionSet)return "";
		
		if(!sExpressionID){ 
			if(oExpressionSet.length){
				return oExpressionSet[0];
			}
			return null;
		}
		
		for(i=0;i<oExpressionSet.length;i++)	{
			oCurrEXPSet=oExpressionSet[i];
			if (String(oCurrEXPSet._ID) == String(sExpressionID)){
				result 		= oCurrEXPSet;
				break;
			}				
		}
		
		if(!result){
			Logger.logWarn('Expression not found for Expression ID '+ sExpressionID +' | p_sSetID = '+ p_sSetID);
		}
		return result;
	};
	
	/**
	 * return Character Name 
	 */
	ConversationModel.prototype.getCharacterCls								= function(sCharacterID){
		var result = '';
		var oCharacter 	= this.oDataModel.Root.SCENARIO.CHARACTERS.CHARACTER || [];
		oCharacter = (oCharacter.length)? oCharacter : [oCharacter];

		for(i=0;i<oCharacter.length;i++){
			if (oCharacter[i]._ID === String(sCharacterID)){
				result 	= oCharacter[i].NAME;
				break;
			}
		}
		return result;
	};


/* get all classess for conversation*/

	ConversationModel.prototype.getCoversationID							= function(){
		return this.oDataModel._questionId;
	};

	ConversationModel.prototype.hasContinue                              	  = function(){
		//Logger.logDebug('ConversationModel.hasContinue() | '+(this.oDataModel._hasContinue.toLowerCase() === 'true'));
    	return (this.oDataModel._hasContinue.toLowerCase() === 'true');
	};

	ConversationModel.prototype.getCoversationContainerCls					= function(){
		return this.oDataModel._optionsContainer;
	};

	//Returns the option row class
	ConversationModel.prototype.getCoversationOptionCls						= function(){
		return this.oDataModel._optionsClass;
	};

	//This returns "radio" for conversation type
	ConversationModel.prototype.getCoversationOptionTypeCls					= function(){
		return this.oDataModel._optionsTypeClass;
	};

	//This returns "radio-label" for conversation type
	ConversationModel.prototype.getCoversationOptionLabelCls				= function(){
		return this.oDataModel._optionLabelClass;
	};

	//This returns "radio-label" for conversation type
	ConversationModel.prototype.getCoversationResponseCls					= function(){
		return this.oDataModel._responseContainerClass;
	};


   /*This returns "Expression Container claass" for conversation type*/
    ConversationModel.prototype.getExpressionContainerCls                   = function(){
        return this.oDataModel._expressionContainerClass;
    };

   /*This returns "Expression Container claass" for conversation type */
    ConversationModel.prototype.isRandomized                				= function(){
        return (this.oDataModel._isRandomized.toLowerCase() === "true");
    };

	/* Return Fast-Track popup title */
    ConversationModel.prototype.getFasttrackTitle 							= function(){
        return this.oDataModel._fasttracktitle;
    };

	/* Return Fast-Track popup title */
    ConversationModel.prototype.getFastTrackDelay 							= function(){
    	var result = parseInt(this.oDataModel._fasttrackdelay);
        return (!isNaN(result)) ? result : 1 ;
    };
    
    /**
     * Additional parameter set in page xml to pick random expression 
     */
    ConversationModel.prototype.isExpressionRandomized							= function(){
    	return (this.oDataModel._showRandomExpression && this.oDataModel._showRandomExpression.toLowerCase() == true);
    };
    
	/*	RETURNS OVERALL SCORE AND FEEDBACK	 */
	ConversationModel.prototype.getOverAllFeedback							= function(){
		var oOverAllFeedback 		= {};
		oOverAllFeedback.score	=  this.getScore().getPercentScore();
			//Logger.logDebug("oOverallFeedback  oOverAllFeedback.score	 : "+oOverAllFeedback.score	);
		var oFeedback 		= this._getFeedbackNode();
		// var oOverallFeedback = this.oScore.getParameterObjByID("Overall Score");
		var nStrandCount = oFeedback.STRAND.length;
		for (var i=0; i < nStrandCount; i++) {
		  var oStrandPointer 		= oFeedback.STRAND[i];
			////Logger.logDebug("oOverallFeedback  oStrandPointer name : "+oStrandPointer._NAME)
			if(oStrandPointer._NAME.toLowerCase() === "over all"){
				var oParameterRange		= oStrandPointer.RANGE,
				nParameterRangeCount	= oParameterRange.length;
				////Logger.logDebug("oOverallFeedback  nParameterRangeCount : "+nParameterRangeCount)

					for (var j=0; j < nParameterRangeCount; j++) {
					  var oRange = oParameterRange[j];
					  var sRangeName 		= oRange._NAME;
					  var sScore 			= oRange._SCORE;
					  var nRangeStart 		= parseInt(sScore.split(",")[0]);
					  var nRangeEnd 		= parseInt(sScore.split(",")[1]);
					////Logger.logDebug("oOverallFeedback  nRangeStart : "+nRangeStart+" | nRangeEnd : "+nRangeEnd);
					if(nRangeStart == 0 && isNaN(nRangeEnd)){
						nRangeEnd = 0;
					}
					if(nRangeStart === 100 && isNaN(nRangeEnd)){
						nRangeStart = 100;
						nRangeEnd 	= 100;
					}

					//	//Logger.logDebug("oOverallFeedback  nRangeStart : "+nRangeStart+" | nRangeEnd = "+ nRangeEnd)
					  if(Number(oOverAllFeedback.score) >= nRangeStart && Number(oOverAllFeedback.score)<= nRangeEnd){
					  	oOverAllFeedback.feedback 	= oRange.__cdata;
					  	oOverAllFeedback.title		= oRange._TITLE;
						//Logger.logDebug("oOverallFeedback  oFeedback.title :  "+ oOverAllFeedback.title +" | oFeedback.feedback :  "+ oOverAllFeedback.feedback);
						break;
					  }
				};

			}
		};
		return oOverAllFeedback;
	};
	/**
	 *  Create user selection response and feedback data for parameters
	 */
	ConversationModel.prototype.geConversationDataByParameter				= function(){
		var i,j;
		var aDecision = {};
		for (i=0; i < this.aMCQList.length; i++) {
		  	var oMCQToggleGrp = this.aMCQList[i];
		  	var aParam = oMCQToggleGrp.oSelectedOption.aParameters;
		  	 // //Logger.logDebug('geConversationDataByParameter : parmeters = '+ JSON.stringify(aParam) );
		  	 for (j=0; j < aParam.length; j++) {
				 var oParam = aParam[j];
			  	 // //Logger.logDebug('geConversationDataByParameter : oParam = '+ oParam );
				 if(parseInt(oParam._VALUE) > 0 )
				 {
				 	if(aDecision[oParam._ID] === undefined){
				 		aDecision[oParam._ID] = [];
				 	}
				  	 // //Logger.logDebug('geConversationDataByParameter : Param.__VALUE = '+ oParam._VALUE );
				 	var oOptionData 	= oMCQToggleGrp.oSelectedOption.oOptionData;
				 		aDecision[oParam._ID].push({
				 		ID 				: oParam._ID,
				 		optionID 		: oOptionData.sID,
				 		responseID 		: oOptionData.nResponseSetID,
				 		expressionID 	: oOptionData.sExpressionID,
				 		optionText 		: oOptionData.sData,
				 		feedback 		: oOptionData.sImmediateFB,
				 		characterID 	: this.getConversationResponse(this.getConversationSet(oOptionData.nResponseSetID))._CHARACTERID,
				 		response 		: this.getConversationResponse(this.getConversationSet(oMCQToggleGrp.sQuestionID)).__cdata,
					});
				};
			};
		};
		 ////Logger.logDebug('geConversationDataByParameter '+ JSON.stringify(aDecision));
		return aDecision;
	};

	ConversationModel.prototype.getMCQList									= function(){
		return this.aMCQList;
	};

	ConversationModel.prototype.addToMCQList								= function(oMCQToggleGrp){

			this.aMCQList.push(oMCQToggleGrp);
	};

	

	/**
	 *	Sample Bookmark String
	 * Scoring UID is not included in bookmark string
	 * 	0,03,03-03,033,033|0,1,2,0,0,0,0,0,0,0|3
	 */
	ConversationModel.prototype.setBookmark								= function(p_sBookmark){
		Logger.logDebug('ConversationModel:setBookmark() '+ p_sBookmark);
		if(!p_sBookmark || p_sBookmark == undefined)return;

		this.checkFeedBackTypeAndInitializeScore();
		this.checkFeedBackTypeAndInitializeFeedback();
		var aBookmark  				= p_sBookmark.split('|'),
			aUserSelection 			= aBookmark[0].split('-'),
			aScore 					= aBookmark[1].split(','),
			nPercentScore 			= parseInt(aBookmark[2]),
			i,s;

		/* create user selction objects */
		for(i = 0;i<aUserSelection.length;i++){
			var aSelection =	aUserSelection[i].split(',');
			var oUserSelection	= {
				setID			: aSelection[0],
				optionID		: aSelection[1],
				nextSetID		: aSelection[2]
			}
			this.updateUserSelections(oUserSelection);
			var oOption 		= this.getOptionForSet(aSelection[0], aSelection[1]),
			aParameters 		= oOption.PARAMETER || oOption.parameter; 
			//Logger.logDebug('ConversationModel:setBookmark() aParameters : '+ JSON.stringify(aParameters));
			this.updateScore(aParameters);
		}
		var oFeedack = this.getFeedback(true);
		
	};

	ConversationModel.prototype.getHistory				= function(p_oUserSelection){
		//Logger.logDebug('ConversationModel.getHistory() |');
		// ** IT'S ASSUMED THAT A CONVERSATION WILL ALWAYS HAVE PARAMETER BASED FEEDBACK
		if(p_oUserSelection.setID == '')return null;
		var sSetID								= p_oUserSelection.setID,
			sOptionID							= p_oUserSelection.optionID,
			sNextSetID							= p_oUserSelection.nextSetID,
			
			x2jsCurrSet							= this.getConversationSet(sSetID),
			x2jsNextSet							= this.getConversationSet(sNextSetID),
			
			// ** Current Sets Option, Feedback, Responses & Parameter List
			sCurrSet_OptionTxt					= this.getOptionTextForSet(x2jsCurrSet, sOptionID),
			oCurrSet_ImmediateFbk				= this.getOptionFeedbackTextForSet(x2jsCurrSet, sOptionID),
			sCurrSet_ImmediateFbkTitleTxt		= oCurrSet_ImmediateFbk.title,
			sCurrSet_ImmediateFbkContentTxt		= oCurrSet_ImmediateFbk.content,
			/*
			 * [{
			 * 		characterID	: "1", 
			 * 		name		: "Mr. X", 
			 * 		response	: "..."
			 * 	}, n, ...]
			 */
			aCurrSet_Responses					= this.getResponseListForSet(x2jsCurrSet),
			nCurrSet_ResponsesLength			= aCurrSet_Responses.length,
			x2jsCurrSet_OptionParamList			= this.getOptionParameterListForSet(x2jsCurrSet, sOptionID),
			nCurrSet_OptionParamListLength		= x2jsCurrSet_OptionParamList.length,
			
			// ** Next Sets Responses
			/*
			 * [{
			 * 		characterID	: "1", 
			 * 		name		: "Mr. X", 
			 * 		response	: "..."
			 * 	}, n, ...]
			 */
			aNextSet_Responses					= this.getResponseListForSet(x2jsNextSet),
			nNextSet_ResponsesLength			= aNextSet_Responses.length,
			
			// ** Creating the History Object
			oHistory							= new History(
				null, 
				sCurrSet_OptionTxt, 
				sCurrSet_ImmediateFbkTitleTxt, 
				sCurrSet_ImmediateFbkContentTxt, 
				{
					id						: sSetID,
					currentSetResponses		: aCurrSet_Responses,
					nextSetResponses		: aNextSet_Responses
				}
			);
		//Logger.logDebug('\tSet ID = '+sSetID+' : Option ID = '+sOptionID+' : Next Set ID = '+sNextSetID/*+'\n\tHistory = '+JSON.stringify(oHistory)*/);
		
		var oParameterHistoryCollection		= {},
			i;
		
		for (i=0; i < nCurrSet_OptionParamListLength; i++) {
			var x2jsParameterPointer	= x2jsCurrSet_OptionParamList[i],
				sParameterID			= x2jsParameterPointer._ID,
				nParameterValue			= parseInt(x2jsParameterPointer._VALUE);
			//Logger.logDebug('\t:: CHECK :: Parameter ID = '+sParameterID+' : Parameter Value = '+nParameterValue);
			
			if(nParameterValue > 0){
				// ** Add the response text, the selected option & the selected option feedback text to the Parameter History
				oParameterHistory	= {
					currentSetResponses		: aCurrSet_Responses,
					selectedOptionText		: sCurrSet_OptionTxt,
					immediateFbkTitleText	: sCurrSet_ImmediateFbkTitleTxt,
					immediateFbkContentText	: sCurrSet_ImmediateFbkContentTxt,
					nextSetResponses		: aNextSet_Responses
				};
				oParameterHistoryCollection[sParameterID] = oParameterHistory;
				//Logger.logDebug('\tParameter "'+sParameterID+'" History = '+JSON.stringify(oParameterHistory));
			}
		};
		//Logger.logDebug('\tParameter History Collection = '+JSON.stringify(oParameterHistoryCollection));

		var oHistoryCollection	= {
			history				: oHistory,
			parameterHistory	: oParameterHistoryCollection
		};
		//Logger.logDebug('\tHistory Collection = '+JSON.stringify(oHistoryCollection));
		
		return oHistoryCollection;
	};
	
	ConversationModel.prototype._getFeedbackNode							= function(p_fbType){
		return {feedbackStrand:this.oDataModel.Root.SCENARIO.CONVERSATION.FEEDBACKSTRANDS.FEEDBACK,
			feedbackParameter: this.oDataModel.Root.SCENARIO.FEEDBACKPARAMETER};
	};

	ConversationModel.prototype._getFBTypeCorrectIncorrect					= function(){};

	ConversationModel.prototype._getFBTypeCorrectIncorrectSpecific			= function(){};

	ConversationModel.prototype.getResponseAndOptionTextForSet				= function(p_SetID, p_OptionID){
		var oSet			= this.getConversationSet(p_SetID),
			oOptionAndFbTxt	= this.getOptionAndFeedbackTextForSet(p_SetID, p_OptionID),
			aResponses		= this.getResponseListForSet(oSet);
		
		/* response = [{characterID: "1", name: "Mr. X", response:"..."}, n] */
		return $.extend({}, oOptionAndFbTxt, {response:aResponses});
	};
	
	ConversationModel.prototype.getOptionAndFeedbackTextForSet				= function(p_SetID, p_OptionID){
		var oSet	= this.getConversationSet(p_SetID),
			sOptionText,
			sOptionFbk;
		
		// ** Accumulate Option and Feedback Text
		for(i=0;i<oSet.OPTIONS.OPTION.length;i++){
			if(oSet.OPTIONS.OPTION[i]._ID == p_OptionID){
				sOptionText	= oSet.OPTIONS.OPTION[i].__cdata ;
				sOptionFbk	= oSet.OPTIONS.OPTION[i].FBK.__cdata;
				break;
			}
		}
		
		return {option			: sOptionText,
				feedback		: sOptionFbk};
	};
		
    ConversationModel.prototype.getRandomExpression							= function(p_oCurrEXPSet){
    	 return p_oCurrEXPSet[Math.round(Math.random()*(p_oCurrEXPSet.length-1))];
    }

	ConversationModel.prototype.getPageTexts								= function(){
		return 'Conversation Model page Text'
	};

	ConversationModel.prototype.getInteractionDelay							= function(){
		return this.oDataModel._optionsReloadDelay || 0;
	};

	ConversationModel.prototype.sanitizeFeedback							= function(p_aFeedback){
		/*var retObj = {};
		if(p_aFeedback.length){
			for(var j=0; j<p_aFeedback.length; j++){
				var o = p_aFeedbackp[j];
				for(var prop in o){
					retObj[prop] = o.prop.__cdata;
				}
			}
		}
		return retObj;*/
	};
	
	/**
	 * parameter score can be stored in global object or different score objects per activity.
	 * if 'GLOBALPARAMETERBASEDFEEDBACK' all activities will have only one score object per parameter,
	 * Score will be added to existing/previous score and vice versa
	 */
	ConversationModel.prototype.getScore							= function(){
		return (this.oDataModel._fbType.toUpperCase() === 'GLOBALPARAMETERBASEDFEEDBACK')? GlobalParameterizedScore.getScoreModel(this.sScoringUID) : ScoreManager.getScore(this.sScoringUID);
	};
	
	ConversationModel.prototype.toString 									= function(){
		return 'framework/activity/model/ConversationModel';
	};

	return ConversationModel;
});