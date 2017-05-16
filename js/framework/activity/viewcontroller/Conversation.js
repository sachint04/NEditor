	'use strict';
	/**
	 * 
	 * 
	 * @exports framework/activity/viewcontroller/Conversation
	 *  
	 */
define([
	'jquery',
	'framework/utils/globals',
	'framework/core/PopupManager',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/ToggleGroup',
	'framework/model/CourseConfigModel',
	'framework/activity/model/ConversationModel',
	'framework/activity/viewcontroller/Option',
	'framework/utils/ResourceLoader',
	'framework/utils/Logger'
], function($, Globals, PopupManager, ComponentAbstract, ToggleGroup, CourseConfig, ConversationModel, Option, ResourceLoader, Logger){
	
	/**
 	 * <b>Conversation</b> is a View Controller for an Activity.
     * @constructor
     * @alias ConversationViewController
     */
	function Conversation(){
		//Logger.logDebug('Conversation.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.oIncidentController;
		// this.aMCQList 					= [];
		this.domTemplate				= null;
		this.bFirstTime 				= true;
		this.currentSetID 				= null;
		this.sQuestionID				= "";
		this.sOptnGrpsCntnrClass		= "";
		this.sOptionCls					= "";
		this.sOptnTypeClass				= "";
		this.sOptionLabelCls			= "";
		this.ResponseCls				= "";
		this.sExpressionCls				= "";
		this.$domOptnGrpsCntnr 			= null;
		this.$domActivity				= null;
		this.$btnContinue				= null;
		this.$btnSubmit					= null;
		this.sPreviousExpressionID 		= null;
		this.nFasttrackDelay 			= 0;
		this.bNormalExit 				= false;
		this.MCQhandleEvents			= this.handleEvents.bind(this);
		this.popupEventHandler			= this.popupEventHandler.bind(this);
		

		//Logger.logDebug('Conversation.CONSTRUCTOR() ');
		return this;
	}

	Conversation.prototype										= Object.create(ComponentAbstract.prototype);
	Conversation.prototype.constructor							= Conversation;


	/**
	 * CREATE LOCAL DATA MODEL
	 */
	Conversation.prototype._createDataModel						= function(p_xmlActivityNode){
		//Logger.logDebug('Conversation._createDataModel() | '/*+JSON.stringify(p_xmlActivityNode)*/);
		this.oDataModel 			= new ConversationModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);
	};

	Conversation.prototype.onModelReady							= function(p_$domView){
		this.sExpressionCls      	= this.oDataModel.getExpressionContainerCls();/*Sachin Tumbre - view container for  expression*/
		this.sQuestionID			= this.oDataModel.getCoversationID();
		this.sOptnGrpsCntnrClass	= this.oDataModel.getCoversationContainerCls();
		this.sOptionCls				= this.oDataModel.getCoversationOptionCls();
		this.sOptnTypeClass			= this.oDataModel.getCoversationOptionTypeCls();
		this.sOptionLabelCls		= this.oDataModel.getCoversationOptionLabelCls();
		this.sResponseCls			= this.oDataModel.getCoversationResponseCls();
		this.$domActivity			= this.getElementByID(this.$domView, this.sQuestionID);
		this.nFasttrackDelay 		= this.oDataModel.getFastTrackDelay();		
		ComponentAbstract.prototype.onModelReady.call(this);
	};
	
	/**
	 * INIALIZE DEFAULT COMPONENT.
	 * THIS METHOD GETS CALLED ONCE ONLY BY SUPER (PAGEABSTRACT)
	 */
	Conversation.prototype._populateLayout						=  function(p_SetID, sExpressionID,sTrigger){
		//Logger.logDebug('Conversation._populateLayout() | p_SetID = '+p_SetID +" : sExpressionID = "+ sExpressionID+" : sTrigger = "+sTrigger);
		var oScope				= this;
		var sSetID 				= p_SetID || 0;
		var	oCurrentSet			= this.oDataModel.getConversationSet(sSetID),
			aOptions			= oCurrentSet.OPTIONS.OPTION,
			$domOptnGrpList		= null,
			aOptionsList		= [];
			var $domCoversationTable	=	this.$domView.find("."+this.sOptnGrpsCntnrClass);
			if(!this.isValidDomElement($domCoversationTable)){
				Logger.logError('Element '+ this.sOptnGrpsCntnrClass+ ' not found in activity container');
			}

			if(this.domTemplate==null){
				this.$domOptnGrpsCntnr 	= this.getElementByClassName(this.$domActivity, this.sOptnGrpsCntnrClass);
				this.domTemplate		= this.getElementByClassName($domCoversationTable, this.sOptionCls);

				if(!this.isValidDomElement(this.$domOptnGrpsCntnr)){
					Logger.logError('Conversation._populateLayout() | Element with style "'+ this.sOptnGrpsCntnrClass+ '" not found in activity container');
				}
				if(!this.isValidDomElement(this.domTemplate)){
					Logger.logError('Conversation._populateLayout() | Element with style "'+ this.sOptionCls+ '" not found in activity container');
				}
			}
			/* START - ARIA Implementation */
			oScope.$domActivity.attr({
				'role'		: 'application',
				'tabindex'	: -1
			});

		    /*  if activity has CONTINUE button */
		    if(this.oDataModel.hasContinue()){
		    	this.$btnContinue = this.$domActivity.find('#'+oScope.sQuestionID+'_continue');
				this.$btnContinue.click(function(e){
					e.preventDefault();
					if(oScope.isBtnActive(this)){
						e.type = 'CONTINUE';
					 	oScope.enableContinue(false);
						oScope.handleEvents(e);
					}
				});
				this.showContinue(true);
			    this.enableContinue(false);
			}
			
		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, this.$domActivity, this.sQuestionID);

		//Initialize Submit Button
		this.$btnSubmit 		=  this.$domView.find('#'+this.sQuestionID+'_submit');
		if(!this.isValidDomElement(this.$btnSubmit)){
			Logger.logError('Conversation._populateLayout() | Submit button not found in activity container');
		}
		this.$btnSubmit.click(function(e){
			e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope.handleEvents(e);
			}
		});
		this.enableSubmit(false);
		
		this.initResetBtn();
		
		//Since Conversation has only 1 element of UI present in its HTML,	We need to replecate the UI depending on the number of options in the current Set
		this.showResponse(sSetID, sExpressionID,oScope,
			function(){
					oScope.populateOptionText();
			});
			
		// ** Conversation activity loaded
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};
	/**
	 * Update UI with Response Text
	 * show Continue button if available
	 * Update expression
	 */
	Conversation.prototype.showResponse 						= function(p_SetID, sExpressionID, p_oScope, p_fCallback  ){
		//Logger.logDebug('Conversation : showResponse() p_SetID = '+ p_SetID+' | sExpressionID = '+ sExpressionID+ ' | sTrigger '+ sTrigger );
		var oScope				= this,
		oCurrentSet				= this.oDataModel.getConversationSet(p_SetID),
		sSetType				= oCurrentSet._TYPE,
		oResponse				= this.oDataModel.getConversationResponse(oCurrentSet),
		sCharacterClass			= oResponse._NPCNAME || this.oDataModel.getCharacterCls(),
		$domResponseContainer	= this.getElementByClassName(this.$domActivity, this.sResponseCls),
		$domCoversationTable 	= this.$domView.find("."+this.sOptnGrpsCntnrClass),
		sResponse				= oResponse.__cdata,
		$btnContinue			= "",
		fCallback 				= p_fCallback,
		callbackScope			= p_oScope,
		$responseTextHolder = $domResponseContainer.find(".response-text");
		if(sSetType == 'FAST-TRACK'){
			return;
		}		
		// show Expression
		if(!sExpressionID){
			sExpressionID = this.sPreviousExpressionID;
		}
		var sExpressionID 			= (sExpressionID)?sExpressionID:1;
		var oCurrExpression			= this.oDataModel.getExpressions(sExpressionID,oResponse._NPCID);
		var sExpressionClass		= oCurrExpression.TYPE.toLowerCase();
		var nExpressionDelay		= Number(oCurrExpression._DELAY);
		var $domExpressionContainer = this.getElementByClassName(this.$domActivity, this.sExpressionCls);
		//Logger.logDebug(this.toString()+' showResponse(0 ) sExpressionClass = '+ sExpressionClass+ '  | sExpressionID = '+ sExpressionID);
		// Show Continue Button is available instead for Showing next options

		if(!this.isValidDomElement($domResponseContainer)){
			Logger.logError('Element with style "'+this.sResponseCls + '" not found in activity container.');
		}
		if(!this.isValidDomElement($domExpressionContainer)){
			Logger.logError('Element with style "'+ this.sExpressionCls + '"  not found in activity container.');
		}
		if(!this.isValidDomElement($domCoversationTable)){
			Logger.logError('Element with style "'+this.sOptnGrpsCntnrClass + '" isnot found in activity container.');
		}
		if(!this.isValidDomElement($responseTextHolder)){
			Logger.logError('Element with style  "response-text" not found in activity container.');
		}
		$responseTextHolder.attr({'aria-hidden': 'false'});
		this.sPreviousExpressionID 	= sExpressionID;
		// Show Expressions after Delay
		setTimeout(function(){
			// Clear current expression style and add new one
            $($domExpressionContainer).removeClass(oScope.oDataModel.getExpressionList().join(' '));
            $($domExpressionContainer).addClass("expression-container "+sCharacterClass+ " " +sExpressionClass).fadeIn();

			// Clear current Response style and add new one
			//$($domResponseContainer).removeClass();
			if(sResponse !== ""){
			    // Display responce text and set focus
			    var $txt = $domResponseContainer.hide().find(".response-text");
			   // $domResponseContainer.addClass("response-container "+oScope.sResponseCls);
				 $txt.attr("aria-hidden","false").html(sResponse);
				// TODO Create animation controller for common tasks
				$domResponseContainer.removeClass('hide').hide().fadeIn("slow", function(){
					$(this).find(".response-text").scrollTop(0);
					$(this).focus();
					if(fCallback){
						fCallback.apply(callbackScope);
					}
				});
			}else{
			     $($domResponseContainer).addClass("response-container hide").attr('aria-hidden','true');
			     if(fCallback){
					fCallback.apply(callbackScope);
				}
			}

		},nExpressionDelay);
	};

	Conversation.prototype.showExpression						= function(sExpressionID, sCharID){
		// show Expression
		if(!sExpressionID){
			sExpressionID = this.sPreviousExpressionID;
		}
		var sExpressionID 			= (sExpressionID)?sExpressionID:"1";
		var sCharID 				= (sCharID)?sCharID:"0";
		var sCharacterClass			= this.oDataModel.getCharacterCls(sCharID);
		var oCurrExpression			= this.oDataModel.getExpressions(sExpressionID,sCharID);
		var sExpressionClass		= oCurrExpression.TYPE.toLowerCase();
		var nExpressionDelay		= Number(oCurrExpression._DELAY);
		var $domExpressionContainer = this.getElementByClassName(this.$domActivity, this.sExpressionCls);
		if(!this.isValidDomElement($domExpressionContainer)){
			Logger.logError('Element with style "'+ this.sExpressionCls + '"  not found in activity container.');
		}

	   $($domExpressionContainer).removeClass(this.oDataModel.getExpressionList().join(' '));
       $($domExpressionContainer).addClass("expression-container "+sCharacterClass+ " " +sExpressionClass).fadeIn();

		this.sPreviousExpressionID 	= sExpressionID;
	};
	/**
	 *	RENDER OPTIONS
	 */
	Conversation.prototype.populateOptionText					= function(p_SetID){
		//Logger.logDebug('Conversation.populateOptionText() | p_SetID = '+ p_SetID);
		var oScope				= this,
		oCurrentSet				= this.oDataModel.getConversationSet(p_SetID),
		$domCoversationTable	= this.$domView.find("."+this.sOptnGrpsCntnrClass),
		$domOptnGrpsCntnr		= this.getElementByClassName(this.$domActivity, this.sOptnGrpsCntnrClass),
		aOptions 				= [],
		sStatementID			= '',
		domOptnGrpList			= null,
		aOptionsList			= [],
		sSetType 				= oCurrentSet._TYPE;

		this.currentSetID		= p_SetID || this.oDataModel.getDefaultSetID();

		 if(sSetType.toLowerCase() 	=== "conversation"){
			aOptions			= oCurrentSet.OPTIONS.OPTION;
		 }else if(sSetType.toLowerCase() === "fast-track"){
		 	oScope.showFastTrack(oCurrentSet);
		 	return;
		 }else if(oCurrentSet._TYPE.toLowerCase() === "feedback" ){
	 		this.setActivityComplete();
		 	return;
		 }

		// Empty option node in the set found then check for fasttrack activity
		if (oCurrentSet.OPTIONS.OPTION.__cdata==""){
			this.showNextLinkedSet(oCurrentSet.OPTIONS.OPTION._SET_ID);
			return;
		}

		if(this.oDataModel.isRandomized() ){
			aOptions = this.randomizeArray(aOptions);
		}

		var nNumOfOptions	= aOptions.length;
		// Clear current option list elements
		$domCoversationTable.find("."+oScope.sOptionCls).remove();
		// Create new list of options
		for(var i=0; i<nNumOfOptions; i++){
			//clone and append the template row from the html
			if(this.domTemplate != null){
				var $newOpt = this.domTemplate.clone().attr({
					'id'						: "Option "+ (i+1),
					'role'						: 'button',
					'aria-labelledby'			: sStatementID
					
				}).removeClass('template hide');
				
				$domCoversationTable.append($newOpt);
			}
		};
		// Create Array of Radio button elememnts
		if(!domOptnGrpList){
			domOptnGrpList	= this.getElementByClassName($domOptnGrpsCntnr, this.sOptnTypeClass);
			// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
			if(aOptions.length != domOptnGrpList.length){Logger.logError('Conversation._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');}
		}

		// Iterarating within the Option Nodes
		for(var i=0; i<nNumOfOptions; i++)
		{
			var oOption			= aOptions[i],
			sOptnID				= oOption._ID,
			$domOptnList		= null,
			nMaxScore			= 0,
			nNextSetID			= oOption._SET_ID,
			sStatementID		= 'radiogroup_'+(i+1)+'_label',
			nOptnScore			= Number(oOption._score),
			aOptnParameters		= oOption.PARAMETER,
			sImmediateFeedBack	= oOption.FBK.__cdata,
			sOptnLblTxt			= oOption.__cdata,
			nMaxScore 			= Math.max(nMaxScore, nOptnScore),
			$domOptnGrpPointer 	= $(domOptnGrpList[i]),
			$domOptnStmnt		= this.getElementByClassName($domOptnGrpPointer, this.sOptionLabelCls);

			this.hasOptionStatement($domOptnStmnt, this.sOptionLabelCls, i, this.sOptnTypeClass);
			$domOptnStmnt.html(sOptnLblTxt).attr('id', sStatementID);
			// ** Iterarating within the Option node for its text and parameters
			//iterating not needed here
			var nTabIndex		= (i === 0) ? 0 : -1;
			/* START - ARIA Implementation */
			$domOptnGrpPointer.attr({
				'id'						: 'radio_' +  sOptnID,
				'role'						: 'radiogroup',
				'aria-labelledby'			: sStatementID,
				'data-index'				: String(i),
				'aria-label'				: 'not selected',
				'role'						: 'option',
				'aria-posinset'				: ""+(i+1),
				'tabindex'					: ""+(i+11),
			 	'aria-setsize'				: nNumOfOptions,
			 	'aria-hidden' 				: 'false'

			});
			$domOptnGrpPointer.find('.radio-icon').attr('role', 'presentation');
			/* END - ARIA Implementation */
			$domOptnGrpPointer.addClass('opt'+(i+1));

			//feedback can contain any properties
			var oOptionData = {
				sID 			: sOptnID,
				nResponseSetID	: nNextSetID,
				sImmediateFB	: sImmediateFeedBack,
				sExpressionID	: oOption._EXPRESSIONTYPE,
				sData 			: oOption.__cdata
			};

			var oOptn = new Option($domOptnGrpPointer, sOptnID, "1", nOptnScore, aOptnParameters, oOptionData);
			aOptionsList.push(oOptn);

			$domOptnStmnt.on('click', function(e){
				e.preventDefault();
			});
		}

		this.createToggleOptions(aOptionsList);
		this.animateOptions($domCoversationTable.find("."+this.sOptionCls));
		this.dispatchEvent("OPTIONS_GENERATED",{target:this, type:'OPTIONS_GENERATED'});
	};
	
	
	
	
	Conversation.prototype.animateOptions					= function(p_aOptionsList){
		p_aOptionsList.hide();
		var nCount= 0;

		var func 	= function(){
			if(nCount >= p_aOptionsList.length ){
				return;
			};
			p_aOptionsList.eq(nCount).fadeIn('fast',function(){
				func();
			});
			nCount++;			
		};
		func();
	};
	/**
	 * Create ToggleGroup objects and add it to MCQList in DataModel
	 */
	Conversation.prototype.createToggleOptions					= function(p_aOptionsList){
		//Logger.logDebug('Conversation.createToggleOptions() | aOptionsList length 	= '+p_aOptionsList.length);
		var oMCQToggleGrp		= new ToggleGroup(p_aOptionsList);
		oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);
		oMCQToggleGrp.addEventListener('KEY_ENTER', this.MCQhandleEvents);
		this.oDataModel.addToMCQList(oMCQToggleGrp);

	};

	Conversation.prototype.showNextLinkedSet					= function(p_sSetID){
		var oScope 				= this,
			oNextSet 				=  this.getSetByID(p_sSetID);
		//Logger.logDebug('showNextLinkedSet()  populateOptionText() callded oNextSet._ID = '+oNextSet._ID);
		this.showResponse(oNextSet._ID, null, oScope, 
			function(){
				oScope.populateOptionText(oNextSet._ID);
		});

	};

	Conversation.prototype.handleEvents							= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var oScope = this;
		var target			= e.target,
			oOption         = e.option,
			currentTarget	= e.currentTarget,
			oEvent,
			type			= e.type;
		switch(type){
			case 'OPTION_SELECT':
			    oEvent = $.extend({}, e, {target:this, toggleGroup:target, preventDefault:false});
				this.dispatchEvent('OPTION_SELECT', oEvent);
			    this.checkAndEnableSubmit();
				break;
			case 'SUBMIT':
			    oEvent = $.extend({}, e, {target:this, toggleGroup:target, preventDefault:false, callback:this.evaluate});
			    //Logger.logDebug(oEvent);
			    this.dispatchEvent('SUBMIT', oEvent);
			    if(!oEvent.preventDefault){this.evaluate();}
				break;
			case 'CONTINUE':
			    oEvent = $.extend({}, e, {target:this, toggleGroup:target, preventDefault:false, callback:this.populateOptionText, args:[this.currentSetID]});
			    //this.evaluate('CONTINUE');
			    this.dispatchEvent('CONTINUE', oEvent);
			    if(!oEvent.preventDefault){this.populateOptionText(this.currentSetID);}
//			    this.populateOptionText(this.currentSetID);
				break;
		}
	};

	Conversation.prototype.checkAndEnableSubmit					= function(p_optionID){
		var aMCQList = this.oDataModel.getMCQList();

		if(!aMCQList[aMCQList.length-1].getSelectedOption()){
			return;
		}
		this.enableSubmit(true);
	};

	/**
	 * Upadate Scoore, Set next set ID
	 * Show Imidiate feedback if available
	 */
	Conversation.prototype.evaluate								= function(){
		var nNextSetID,
			oMCQToggleGrp					= this.oDataModel.getMCQList()[this.oDataModel.getMCQList().length-1],
			oSelectedOption					= oMCQToggleGrp.getSelectedOption(),
			oSelectedOptionData				= oSelectedOption.getOptionData()/*,
			sImmediateFeedback				= oSelectedOptionData.sImmediateFB*/;
		//Logger.logDebug("Conversation.evaluate () | \n\toSelectedOption = "+oSelectedOption+"\n\tthis.currentSetID = "+this.currentSetID);

		this.enableSubmit(false);

		this.checkForNormalExit(oSelectedOption);
		this.updateScoreAndUserSelections(oSelectedOption, oSelectedOptionData);
	};
	Conversation.prototype.updateScoreAndUserSelections			= function(oSelectedOption, oSelectedOptionData){
		//Logger.logDebug("Conversation.updateScoreAndUserSelections() | "+oSelectedOptionData.nResponseSetID);
		var oUserSelection	= {
				setID			: this.currentSetID,
				optionID		: oSelectedOption.getID(),
				nextSetID		: oSelectedOptionData.nResponseSetID
			},
			oScope			= this,
			oEvent			= {
				type			: 'SCORE_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.updateHistory,
				args			: [oSelectedOption, oSelectedOptionData]
			};

		ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, oSelectedOption.getParameters(), oUserSelection);

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.updateHistory(oSelectedOption, oSelectedOptionData);}
	};
	Conversation.prototype.updateHistory						= function(oSelectedOption, oSelectedOptionData){
		//Logger.logDebug("Conversation.updateHistory() | "+oSelectedOptionData.nResponseSetID);
		this.oDataModel.updateFeedbackHistory({
			setID				: String(this.currentSetID),
			optionID			: oSelectedOption.getID(),
			nextSetID			: oSelectedOptionData.nResponseSetID
		});

		var oScope	= this,
			oEvent	= {
				type			: 'HISTORY_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.updateResponse,
				args			: [oSelectedOption, oSelectedOptionData]
			};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.updateResponse(oSelectedOption, oSelectedOptionData);}
	};
	Conversation.prototype.updateResponse						= function(oSelectedOption, oSelectedOptionData){
		Logger.logDebug("Conversation.updateResponse() | oSelectedOption = "+ JSON.stringify(oSelectedOptionData));
		var sImmediateFeedback				= oSelectedOptionData.sImmediateFB,
		oScope 								= this,
		selectedOptionData 					= oSelectedOptionData;

		if(this.oDataModel.hasImmediateFeedback() && sImmediateFeedback !== '' && sImmediateFeedback !== undefined){
			//Logger.logDebug("\tActivity HAS Immediate Feedback");
			// ** Activity HAS Immediate Feedback
			// ** TODO: Call the Abstract "openPopup" method and remove the reference of the PopupManager from here
			var oTransitionPopup	= PopupManager.openPopup('Conversation_ImmediateFeedback', {txt_title:'', txt_content:sImmediateFeedback}, $('#ImmediateFeedback_holder'), 'ui-skin');
			this.addPopupHandler(oTransitionPopup);
		}else{
			//Logger.logDebug("\tActivity DOES NOT have Immediate Feedback");
			// ** Activity DOES NOT have Immediate Feedback
			if(this.oDataModel.hasContinue()){
				//Logger.logDebug("\tActivity HAS  Contnue button"+ oSelectedOptionData.nResponseSetID);
				// ** Activity HAS  Contnue button
				this.currentSetID = oSelectedOptionData.nResponseSetID;
				// ** Enable the Continue Button
				this.enableContinue(true);
				// ** Show response with expression
				this.showResponse(oSelectedOptionData.nResponseSetID, oSelectedOptionData.sExpressionID);
				// ** Disable activity if Continue button is available for activity
				this.disableActivity();
			}else{
				//Logger.logDebug("\tActivity DOES NOT have Contnue button"+ this.$btnContinue);
				// ** Activity DOES NOT have Contnue button
				// ** Load the Next Set
				// ** Show response with expression
				this.showResponse(oSelectedOptionData.nResponseSetID, oSelectedOptionData.sExpressionID, oScope,
					function(){
						oScope.populateOptionText(selectedOptionData.nResponseSetID);
					});
				// this.populateOptionText(oSelectedOptionData.nResponseSetID);
			}
		}
	};

	Conversation.prototype.getCurrentSetID						= function(p_nIndex){
		return this.currentSetID;
	};

	Conversation.prototype.getHistory							= function(p_nIndex){
		return this.oDataModel.getFeedback(p_nIndex);
	};

	Conversation.prototype.checkForNormalExit 				= function(p_selectedOpt){
		var nextSetID = p_selectedOpt.getOptionData().nResponseSetID;
		var oSet = this.getSetByID(nextSetID);
		if (oSet.OPTIONS && oSet.OPTIONS.OPTION.__cdata == "")
		{
			var linkedSetID = oSet.OPTIONS.OPTION._SET_ID;
			var nextSet =  this.getSetByID(linkedSetID);
			if(nextSet._TYPE.toLowerCase() === "feedback"){
				//Logger.logDebug('ACTIVITY WILL BE COMPLETED NORMALlY');
				this.bNormalExit = true;
			}
		}

	};

	Conversation.prototype.getUserSelectedOptionID				= function(p_nToggleGroupIndex){
		var oToggleGroup	= this.oDataModel.getMCQList()[p_nToggleGroupIndex],
			oOption			= oToggleGroup.getSelectedOption(),
			sOptionID		= oOption.getID();

		return sOptionID;
	};

	/*Conversation.prototype.getResponseAndOptionTextForSet		= function(sSetID, sOptionID){
		return this.oDataModel.getResponseAndOptionTextForSet(sSetID, sOptionID);
	};*/


	Conversation.prototype.getSetByID							= function(sSetID){
		return this.oDataModel.getConversationSet(sSetID);
	};

	Conversation.prototype.getResponseBySet						= function(oSet){
		return this.oDataModel.getConversationResponse(oSet);
	};

	Conversation.prototype.getCurrentSetType					= function(){
		return this.oDataModel.getConversationSet(this.currentSetID)._TYPE;
	};

	Conversation.prototype.getMCQList							= function(){
		return this.oDataModel.getMCQList();
	};
	Conversation.prototype.getInteractionDelay					= function(){
		return this.oDataModel.getInteractionDelay();
	}
	/**
	 *	STUB METHOD
	 * Show Fast track data fond in CONVERSATION SET
	 *
	 */
	Conversation.prototype.showFastTrack						= function(p_oSet){
		var oScope 						= this;
		var oSet = p_oSet;
		//Logger.logDebug('showFastTrack() '+this.nFasttrackDelay);
		setTimeout(function(){
			var oCurrentSet, sResponse, oBranch, nextSetID, sTitle;
			oCurrentSet 				= oSet;
			sResponse 					= oCurrentSet.RESPONSE.__cdata;
			oBranch 					= oCurrentSet.BRANCHES.BRANCH;
			oScope.currentSetID 			= oBranch._TOSETID;// update current set ID with new set ID
			sTitle 						= oScope.oDataModel.getFasttrackTitle();
			var oPopup  =  PopupManager.openPopup(
				'fasttrack',
				{txt_title:sTitle,txt_content:sResponse},
				oScope.$domView.find('.itext'),
				'ui-skin'
			);
			oScope.addPopupHandler(oPopup);

		}, this.nFasttrackDelay);
		this.dispatchEvent('FASTTRACK_OPEN', {type:'FASTTRACK_OPEN', oTarget: this, setID: p_oSet});
	};
	/**
	 *	STUB METHOD:
	 * Show feedback data fond in CONVERSATION SET
	 * TODO: ADD BUSINESS LOGIC
	 */
	Conversation.prototype.showFeedback							= function(oSet){

	};

	Conversation.prototype.addPopupHandler						= function(p_oPopup){
		//Logger.logDebug('Conversation.addPopupHandler() | ');
		p_oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
	};

	Conversation.prototype.popupEventHandler					= function(e){
		//Logger.logDebug('Conversation.popupEventHandler() | ');
		var sEventType	= e.type,
			oPopup		= e.target,
			sPopupID	= oPopup.getID(),
			nNextSetID, oMCQToggleGrp, oSelectedOption, oFeedBack;
		//Logger.logDebug('\tsPopupID = '+sPopupID);

		if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE'){
			if(sEventType === 'POPUP_EVENT'){
				PopupManager.closePopup(sPopupID);
			}else if(sEventType === 'POPUP_CLOSE' ){
				// JUMP TO NEXT SET IF CURRENT SET IS FAST TRACK
				if(sPopupID.toLowerCase() === 'fasttrack'){
					//TODO CURRENTLY NEXT SET INFORMATION IS CONCATENATED TO POPUP ID.
					//TODO WE NEED TO HAVE SOPHISTICATED COMMUNICATION CHANNEL
					//Logger.logDebug('\tCurrentSetID = '+this.currentSetID);
					this.populateOptionText(this.currentSetID);
					this.dispatchEvent('FASTTRACK_CLOSE', {type:'FASTTRACK_CLOSE', oTarget:this});
				}else if(sPopupID.toLowerCase() === 'feedback'){
					// oMCQToggleGrp	= this.oDataModel.getMCQList()[this.oDataModel.getMCQList().length-1],
					// oSelectedOption	= oMCQToggleGrp.getSelectedOption(),
					// oFeedBack		= oSelectedOption.getOptionData();
		    		// this._populateLayout(oFeedBack.nResponseSetID,oFeedBack.sExpressionID,"POPUP");
	    		}
	    		this.removePopupHandler(oPopup);
    		}
		}
	};

	Conversation.prototype.removePopupHandler					= function(p_oPopup){
		//Logger.logDebug('IncidentController.removePopupHandler() | ');
		p_oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
		p_oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
	};

	Conversation.prototype.disable								= function(p_optionID){
		//Logger.logDebug('Conversation.disable() | '+ p_optionID);
		for(var i=0; i<this.oDataModel.getMCQList().length; i++){
			var oMCQToggleGrp = this.oDataModel.getMCQList()[i];
			oMCQToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	Conversation.prototype.disableActivity						= function(){
		//Logger.logDebug('Conversation.disableActivity'+ this.oDataModel.getMCQList().length);
		for(var i=0; i<this.oDataModel.getMCQList().length; i++){
			var oMCQToggleGrp = this.oDataModel.getMCQList()[i];
			oMCQToggleGrp.enable(false);
			oMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MCQhandleEvents);
		}
		this.enableSubmit(false);
	};

	Conversation.prototype.setActivityComplete					= function(){
		this.disableActivity();
		this.$btnSubmit.off();
		this.$btnContinue = this.$domActivity.find('#'+this.sQuestionID+'_continue');
		if(this.$btnContinue){
			this.$btnContinue.off();
		}
		// //Logger.logDebug("ConversationActivityCompleted : " );
		this.ConversationActivityCompleted();
	};

	Conversation.prototype.resetOptions							= function(){
		//Logger.logDebug('Conversation.resetOptions() | '+this);
		for(var i=0; i<this.oDataModel.getMCQList().length; i++){
			var oMCQToggleGrp = this.oDataModel.getMCQList()[i];
			oMCQToggleGrp.reset();
		}
		this.dispatchEvent('RESET_OPTIONS', {type:'RESET_OPTIONS', target:this});
		this.enableSubmit(false);
	};

	Conversation.prototype.enableSubmit							= function(p_bEnable){
		if(p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
			this.dispatchEvent('SUBMIT_ENABLE', {type:'SUBMIT_ENABLE', target:this});
		}else{
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
			this.dispatchEvent('SUBMIT_DISABLE', {type:'SUBMIT_DISABLE', target:this});
		}
	};

	Conversation.prototype.showSubmit							= function(p_bShow){
		//Logger.logDebug('Conversation.showSubmit() | Show = '+p_bShow);
		(p_bShow) ? this.$btnSubmit.removeClass('hide') : this.$btnSubmit.addClass('hide');
	};

	Conversation.prototype.showContinue							= function(p_bShow){
		//Logger.logDebug('Conversation.showSubmit() | Show = '+p_bShow);
		(p_bShow) ? this.$btnContinue.removeClass('hide') : this.$btnContinue.addClass('hide');
	};

	Conversation.prototype.enableContinue						= function(p_bEnable){
		//Logger.logDebug
		if(!this.oDataModel.hasContinue())return;

		if(p_bEnable) {
			this.$btnContinue.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
		}else{
			this.$btnContinue.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
		}


	};

	Conversation.prototype.hasOptionStatement					= function($domOptnStmnt, sStmntClass, i, sOptnGrpClass){
		if($domOptnStmnt.length == 0){Logger.logError('Conversation._populateLayout() | No element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
		if($domOptnStmnt.length > 1){Logger.logError('Conversation._populateLayout() | More than 1 element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
	};

	Conversation.prototype.hasOptionLabel						= function($domOptnLbl, sOptnLblClass, j, i){
		if($domOptnLbl.length == 0){Logger.logError('Conversation._populateLayout() | No element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
		if($domOptnLbl.length > 1){Logger.logError('Conversation._populateLayout() | More than 1 element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
	};

	Conversation.prototype.hasOptionGroupCotainer				= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		if($domOptnGrpsCntnr.length == 0){Logger.logError('Conversation._populateLayout() | No element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
		if($domOptnGrpsCntnr.length > 1){Logger.logError('Conversation._populateLayout() | More than 1 element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
	};

	Conversation.prototype.hasContinue							= function(){
		return this.oDataModel.hasContinue();
	};

	Conversation.prototype.isNormalExit							= function(){
		return this.bNormalExit;
	};

	Conversation.prototype.ConversationActivityCompleted		= function(){
		this._activityCompleted();
	};

	Conversation.prototype.destroy								= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		//Logger.logDebug('Conversation.destroy() | ');
		this.$btnSubmit.off();
		for(var i=0; i<this.oDataModel.getMCQList().length; i++){
			var oMCQToggleGrp = this.oDataModel.getMCQList()[i];
			oMCQToggleGrp.destroy();
		}
	};
	/**
	 * Randomized ARRAY TODO MOVE THIS TO COMMON CLASS
 	* @param {Object} p_aArray
	 */
	Conversation.prototype.randomizeArray						= function(p_aArray){
		var aTemp,aNew, i;
		aTemp 			= p_aArray.slice(0);
		aNew = [];
		while(aTemp.length>0){
			var index = Math.round(Math.random() * (aTemp.length-1));
			var elem = aTemp.splice(index, 1);
			aNew.push(elem[0]);
		};
		return aNew;
	};

	Conversation.prototype.toString 							= function(){
		return 'framework/activity/Conversation';
	};

	return Conversation;
});
