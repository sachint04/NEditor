define([
	'jquery',
	'framework/utils/EventDispatcher',
	'framework/model/CourseConfigModel',
	'framework/controller/CourseController',
	'framework/model/CourseModel',
	'framework/utils/ResourceLoader',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, EventDispatcher, CourseConfig, CourseController,  CourseModel, ResourceLoader, Globals, Logger){

	function BookmarkModelsGrenerator(){
		//Logger.logDebug('BookmarkModelsGrenerator.CONSTRUCTOR() | ');
		EventDispatcher.call(this);
		//** TODO: Remove the reference of "CourseController" here
		this.refToCourseController;
		this.oModels 				= {};
		this.aValidAcitivityList 	= [];
		this.oActivityClassPath		= {
			mcqgroup		: 'framework/activity/model/MCQGroupModel',
			conversation	: 'framework/activity/model/ConversationModel',
			branching		: 'framework/activity/model/BranchingModel',
			MMCQ			: 'framework/activity/model/MMCQModel',
			MCQ				: 'framework/activity/model/MCQModel',
			DropdownGroup	: 'framework/activity/model/DropdownGroupModel',
			FIB				: 'framework/activity/model/FIBModel',
			DropdownFIB		: 'framework/activity/model/DropdownFIBModel',
			MultipleDropdownGroupModel:'framework/activity/model/MultipleDropdownGroupModel'
		};


		this.parseActivityNode  			= this.parseActivityNode.bind(this);
		this.createActvity 					= this.createActvity.bind(this);
		this.checkBookmakrParseComplete 	= this.checkBookmakrParseComplete.bind(this);
		this.onModelReady 					= this.onModelReady.bind(this);
		this.parseBookmark 					= this.parseBookmark.bind(this);

	}

	BookmarkModelsGrenerator.prototype								= Object.create(EventDispatcher.prototype);
	BookmarkModelsGrenerator.prototype.constructor					= BookmarkModelsGrenerator;


	//** TODO: Remove the reference of "p_CourseController" here. The "CourseController" should directly be accessible by having a reference to it in the "define"
	BookmarkModelsGrenerator.prototype.init							= function(p_CourseController){
		//Logger.logDebug('BookmarkModelsGrenerator.init() | CC = '+p_CourseController);
		this.refToCourseController	= p_CourseController;
	};

/**
 *  p_sBookmark = suspend_data
 */
	BookmarkModelsGrenerator.prototype.parseBookmark					= function(p_sBookmark){
		//Logger.logDebug('BookmarkModelsGrenerator.parseBookmark() | '+p_sBookmark);
		if(!p_sBookmark || p_sBookmark.trim() === ""){
			this.dispatchEvent("UPDATE_BOOKMARK_DATA_COMPLETE", {target:this, type:'UPDATE_BOOKMARK_DATA_COMPLETE'});
			//Logger.logWarn('BoolmarkMOdelGenerator: parseBookmark() p_sBookmark: ('+p_sBookmark+')');
			return;
		}
		var oScope = this;
		var aModel 							= p_sBookmark.split('*');
		//Logger.logDebug('\taModel Length = '+aModel.length);
		// //Logger.logDebug('BookmarkModelsGrenerator.parseBookmark() oModels  : '+this.oModels);
		for(var i = 0;i<aModel.length;i++){
			var sData 						= aModel[i];
			var sScoringID 					= sData.split('|')[0];
			//Logger.logDebug('\tsData = '+sData+'\n\tsScoringID = '+sScoringID);
			if(this.isValidScoringID(sScoringID)){
				var sPageGUID 					= sScoringID.substring(0, sScoringID.indexOf('_'));
				var questionID 					= sScoringID.substring(sScoringID.indexOf('_')+1, sScoringID.length) || null;
				//Logger.logDebug('\tsPageGUID  : '+sPageGUID + '\n\tQuestionID :'+ questionID);
				if(!this.oModels[sPageGUID]){
					//Logger.logDebug('\tCreate Object with the Page GUID');
					this.oModels[sPageGUID] = {};
				}

				var tempPageData = sData.slice(sData.indexOf('|')+1);
				if(tempPageData && tempPageData != undefined){
					this.oModels[sPageGUID][questionID] 		= tempPageData;
					//Logger.logDebug('\t\tCreate Preperty within the Page GUID Object');
					//Logger.logDebug('\t\tsPageGUID = '+this.oModels[sPageGUID][questionID]);
				}

			}else {
				var sID 				= sData.split('|')[0];
				this.oModels[sPageGUID] = sData.slice(sData.indexOf('|')+1);

				/** TODO  handle flags */
			}

		}
		this.loadPageData();
	};

	BookmarkModelsGrenerator.prototype.loadPageData					= function(){

		var oScope 			= this;

		for(var str in this.oModels){
			var oPage 		= this.oModels[str];
			//Logger.logDebug('BookmarkModelsGrenerator.loadPageData() pageID :' + str);
			var sPageID	= str;
			if(this.isValidScoringID(sPageID))
			{

				var oPageModel 				= CourseModel.findPage(sPageID);
				var sSCOContentRoot			= CourseConfig.getRootPath();
				var sParentCWPath			= oPageModel.getParentCWGUID().split('~').join('/') + '/';

				// var sJSFilePath			= this.refToCourseController.getLocation(sParentCWPath, 'js_location', oPageModel.getScriptFileName());
					var xmlPath					= this.refToCourseController.getLocation(sParentCWPath, 'xml_location', oPageModel.getPageID(), 'xml');
					//Logger.logDebug('BookmarkModelsGrenerator.loadPageData() | xmlPath = '+xmlPath);
					$.ajax({
						async: 		false,
						url: 		xmlPath,
						dataType: 		'xml',
						 success: 	function(response) {
						 	var xmlData = $.parseXML(response);
						 	var $xml 	= $(xmlData);
							 oScope.parseActivityNode(response, sPageID);
						 	// for (var param in oPage){
						 		// var questionID  = param;
						 		// var sScoringUID = sPageID+'~'+questionID;
								// //Logger.logDebug('BookmarkModelsGrenerator.parseBookmark() page xml loaded | sScoringUID  = '+sScoringUID);
						 	// }
						 },
						 fail: 		function(){
						 	Logger.logError('FAIL TO LOAD XML'+ xmlData);
						 }
					});
				// }else{
					// this.dispatchEvent("UPDATE_BOOKMARK_DATA_COMPLETE", {target:this, type:'UPDATE_BOOKMARK_DATA_COMPLETE'})
				// }
			} else if (sPageID.trim().toLowerCase() === 'flags'){
			 	 //Logger.logDebug('BookmarkModelsGrenerator.parseBookmark() Flags found.' );
				/* restore Flags */
				require([
					'framework/simulation/model/SudoRulesModel'
				], function(SudoRulesModel){
				 	 //Logger.logDebug('BookmarkModelsGrenerator.parseBookmark() SudoRulesModel '+ SudoRulesModel + ' | ' +oScope.oModels[sScoringID] );
						SudoRulesModel.setBookmark(oScope.oModels[sPageID]);
						oScope.oModels[sPageID] = null;
				});
			}else if(sPageID.trim().toLowerCase() === 'activity_sequence'){

			}else{
				this.dispatchEvent("UPDATE_BOOKMARK_DATA_COMPLETE", {target:this, type:'UPDATE_BOOKMARK_DATA_COMPLETE'});
			}
		}
	};

	BookmarkModelsGrenerator.prototype.parseActivityNode			= function(p_pageXML, sPageGUID){
		var $xmlActivity 				= $(p_pageXML).find('activity');
		//Logger.logDebug(' parseActivityNode()sPageGUID : '+sPageGUID+ ' | $xmlActivity.length :'+ $xmlActivity.length);

		if($xmlActivity.length > 0){
			for(var i=0; i<$xmlActivity.length; i++){
				var $xmlActivityNode	= $xmlActivity[i],
					sScoringID 			= sPageGUID+'_'+ $($xmlActivity[i]).attr('questionId');
					sActivityType 		= $($xmlActivity[i]).attr('type').toUpperCase();

				//Logger.logDebug('parseActivityNode() sScoringID : '+sScoringID+' | Activity Type = '+sActivityType);


				if(sActivityType === 'MCQGROUP'){
					this.createActvity(this.oActivityClassPath.mcqgroup, $xmlActivityNode, sPageGUID);
				}
				if(sActivityType === 'CONVERSATION'){
					//this.loadConversationData(this.oActivityClassPath.conversation, $xmlActivityNode, sScoringID);
					this.createActvity(this.oActivityClassPath.conversation, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'BRANCHING'){
					this.createActvity(this.oActivityClassPath.branching, $xmlActivityNode , sScoringID, sPageGUID);
				}
				if(sActivityType === 'MMCQ'){
					this.createActvity(this.oActivityClassPath.MMCQ, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'MCQ'){
					this.createActvity(this.oActivityClassPath.MCQ, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'DROPDOWNGROUP'){
					this.createActvity(this.oActivityClassPath.DropdownGroup, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'FIB'){
					this.createActvity(this.oActivityClassPath.FIB, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'DROPDOWNFIB'){
					this.createActvity(this.oActivityClassPath.DropdownFIB, $xmlActivityNode, sScoringID, sPageGUID);
				}
				if(sActivityType === 'MULTIPLEDROPDOWNGROUP'){
					this.createActvity(this.oActivityClassPath.MultipleDropdownGroupModel, $xmlActivityNode, sScoringID, sPageGUID);
				}

			}
		}else{
			//Logger.logDebug('ONLY ONE ACTIVTY FOUND IN XML');

		}
	};

	BookmarkModelsGrenerator.prototype.createActvity				= function(p_jsFilePath, p_xmlActivityNode, p_sScoringID, p_sPageGUID) {
		//Logger.logDebug('BookmarkModelsGrenerator.createActvity() |  = '+ p_sScoringID+' | '+p_sPageGUID + " p_jsFilePath "+p_jsFilePath);
		var oScope				= this;
		var sScoringID 			= p_sScoringID;
		var sPageGUID 			= p_sPageGUID;
		var xmlActivityNode 	= p_xmlActivityNode;
		//Logger.logDebug('BookmarkModelsGrenerator.createActvity() |  = '+ sScoringID+' | '+sPageGUID);

		require([
			p_jsFilePath
		], function(Model){
			var oModel = new Model(xmlActivityNode,  sPageGUID, sScoringID );
				oModel.addEventListener('MODEL_READY', oScope.onModelReady);
				oModel.loadDependencies();
		});
	};

	/**
	 * Update model with scoring and Feedback data
	 */
	BookmarkModelsGrenerator.prototype.onModelReady						= function(e){
		var oModel 			= e.target;
		var sScoringID 		= oModel.getScoringUID();
		var sPageGUID 		= sScoringID.slice(0, sScoringID.lastIndexOf('_'));
		var questionID 		= sScoringID.slice(sScoringID.lastIndexOf('_')+1);
		//Logger.logDebug('BookmarkModelsGrenerator:onModelReady() oModel : '+ oModel);
		oModel.checkFeedBackTypeAndInitializeScore();// create Score object
		oModel.setBookmark(this.oModels[sPageGUID][questionID] );
		oModel.destroy();

		this.oModels[sPageGUID][questionID] = null;
		var allLoaded = true;
		for(var str in this.oModels[sPageGUID]){
			if(this.oModels[sPageGUID][str]){
				allLoaded = false;
				break;
			}
		}

		if(allLoaded){
			this.oModels[sPageGUID] = null;
		}

		this.checkBookmakrParseComplete();		//Populate Parameters if parameter based feedback
	//	//Logger.logDebug(this.toString()+' onModelReady() '+ JSON.stringify(oModel.getFeedback(true)));

	};

	/**
	 * check all models are done with creating data
	 */
	BookmarkModelsGrenerator.prototype.checkBookmakrParseComplete				= function(){
		for(var str in this.oModels){
			//Logger.logDebug(' checkBookmakrParseComplete() '+str+' = '+ this.oModels[str]);
			if(this.oModels[str]){
				return;
			}
		}
		this.dispatchEvent("UPDATE_BOOKMARK_DATA_COMPLETE", {target:this, type:'UPDATE_BOOKMARK_DATA_COMPLETE'});
	};

	BookmarkModelsGrenerator.prototype.isValidScoringID				= function(p_sID){
		return (p_sID.indexOf('cw01') === 0);
	};

	/*
	 * {
	 * 		location		: 'cw01~pg01',
	 * 		completion		: 'incomplete',
	 * 		suspend_data	: {
	 * 			cw_completion		: [],
	 * 			page_completion		: [],
	 * 			activity_scoringUID	: {}
	 * 		}
	 * }
	 */
	BookmarkModelsGrenerator.prototype.getModel							= function(){
		return this.oModel;
	};

	BookmarkModelsGrenerator.prototype.destroy 						= function() {
		//Logger.logDebug('BookmarkModelsGrenerator distroy() : ');
		this.refToCourseController 	= null;
		this.oModels 				= null;
		this.aValidAcitivityList 	= null;
		this.oActivityClassPath		= null;
	};

	BookmarkModelsGrenerator.prototype.xmlToString 						= function(xmlData) {

	    var xmlString;
	    //IE
	    if (window.ActiveXObject){
	        xmlString = xmlData.xml;
	    }
	    // code for Mozilla, Firefox, Opera, etc.
	    else{
	        xmlString = (new XMLSerializer()).serializeToString(xmlData);
	    }
	    return xmlString;
	};


	BookmarkModelsGrenerator.prototype.toString							= function(){
		return ' [framework/core/BookmarkModelsGrenerator] ';
	};

	return BookmarkModelsGrenerator;
});
