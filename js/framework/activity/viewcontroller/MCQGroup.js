define([
	'jquery',
	'framework/utils/globals',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/ToggleGroup',
	'framework/activity/model/MCQGroupModel',
	'framework/activity/viewcontroller/Option',
	'framework/core/AudioManager',
	'framework/utils/Logger'
], function ($, Globals, ComponentAbstract, ToggleGroup, MCQGroupModel, Option, AudioManager, Logger) {

	function MCQGroup(){
		//Logger.logDebug('MCQGroup.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aMCQList = [];

		return this;
	}

	MCQGroup.prototype								= Object.create(ComponentAbstract.prototype);
	MCQGroup.prototype.constructor					= MCQGroup;

	MCQGroup.prototype.init							= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation){
		//Logger.logDebug('MCQGroup.init() ');
		// ** Calling Super Class "init()" function
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
	};

	MCQGroup.prototype._createDataModel				= function(p_xmlActivityNode){
		this.oDataModel = new MCQGroupModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);

		/*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
		/*this.oDataModel.addEventListener('UPDATE', function(e){
			oScope.handleModelUpdates(e);
		});*/
	};

	/*** Model updates Handler to be used if required ***/
	/*MCQGroup.prototype.handleModelUpdates			= function(e){

	};*/

	MCQGroup.prototype._populateLayout				= function(){
		var oScope				= this,
			sQuestionID			= this.oDataModel.getQuestionID(),
			sOptnGrpsCntnrClass	= this.oDataModel.getOptionGroupsContainerClass(),
			aOptionGroups		= this.oDataModel.getOptionGroupList(),
			$domActivity		= this.getElementByID(this.$domView, sQuestionID),
			$domOptnGrpList		= null,
			nMaxPossibleScore	= 0;

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, $domActivity, sQuestionID);

		var $domOptnGrpsCntnr = this.getElementByClassName($domActivity, sOptnGrpsCntnrClass);
		// ** Check to make sure that a Radio Group Container exists in the DOM to hold the Groups of Radio Button Containers
		this._hasOptionGroupCotainer($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID);

		/* START - ARIA Implementation */
		$domActivity.attr({
			'role'		: 'application',
			'tabindex'	: -1
		});
		/* END - ARIA Implementation */

		// ** Iterarating within the Option Group Node
		for(var i=0; i<aOptionGroups.length; i++){
			var oOptionGroupPointer = aOptionGroups[i],
				sOptnGrpID			= oOptionGroupPointer._id,
				sOptnGrpClass		= oOptionGroupPointer._class,
				sStmntClass			= oOptionGroupPointer.pageText._class,
				sStmntTxt			= oOptionGroupPointer.pageText.__cdata,
				$domOptnList		= null,
				nMaxScore			= 0,
				aOptionsList		= [],
				// ** Custom Vars
				sStatementID		= 'radiogroup_'+(i+1)+'_label';
			//Logger.logDebug('\tI = '+i);

			if(!$domOptnGrpList){
				$domOptnGrpList	= this.getElementByClassName($domOptnGrpsCntnr, sOptnGrpClass);
				// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
				if(aOptionGroups.length != $domOptnGrpList.length){
					Logger.logWarn('MCQGroup._populateLayout() | Number of Radio Containers in the XML dont Match with the number of elements in DOM');
					// ** Storing the reference to the the DOM option where the generated Radio Containers will get appended
					$domOptnGrpsCntnr				= $($domOptnGrpList[i]).parent();
					$domOptnGrpList.remove();
					var aTempRadioContainer			= [],
						sRadioContainerHTMLMarkup	= $($domOptnGrpList[i]).wrap('<div></div>').parent().html();
					//Logger.logDebug('\tRadio Container HTML Markup = '+sRadioContainerHTMLMarkup);
				}
			}
			if(sRadioContainerHTMLMarkup){
				var $domOptnGrpPointer = $(sRadioContainerHTMLMarkup);
				// ** Adding "alt" class for the generated row to display "alternate" row color
				if((i % 2) === 1){$domOptnGrpPointer.addClass('alt');}
				aTempRadioContainer.push($domOptnGrpPointer);
			}else{
				var $domOptnGrpPointer = $($domOptnGrpList[i]);
			}

			/* START - ARIA Implementation */
			$domOptnGrpPointer.attr({
				'role'						: 'radiogroup',
				'aria-labelledby'			: sStatementID/*,
				'aria-activedescendant'		: 'rg1-r4'*/
			});
			/* END - ARIA Implementation */

			var $domOptnStmnt	= this.getElementByClassName($domOptnGrpPointer, sStmntClass);
			this._hasOptionStatement($domOptnStmnt, sStmntClass, i, sOptnGrpClass);
			$domOptnStmnt.html(sStmntTxt).attr('id', sStatementID);

			// ** Iterarating within the Option node for its text and parameters
			var nNumOfOptions	= oOptionGroupPointer.option.length;
			for(var j=0; j<nNumOfOptions; j++){
				var oOption				= oOptionGroupPointer.option[j],
					sOptnID				= oOption._id,
					sOptnClass			= oOption._class,
					nOptnScore			= Number(oOption._score),
					aOptnParameters		= oOption.parameter,
					sOptnLblClass		= oOption.pageText._class,
					sOptnLblTxt			= oOption.pageText.__cdata,
					nMaxScore 			= Math.max(nMaxScore, nOptnScore),
					sLabelID 			= sOptnGrpID+'_'+sOptnID+'_'+sOptnLblClass; 
				//Logger.logDebug('\tJ = '+j);
				//Logger.logDebug('\tsOptnLblClass = '+sOptnLblClass+' : sOptnLblTxt = '+sOptnLblTxt);

				if(!$domOptnList){
					$domOptnList	= this.getElementByClassName($domOptnGrpPointer, sOptnClass);
					// ** Check if the number of XML nodes for Radio are Equal to the Number of Radio in the DOM
					if(oOptionGroupPointer.option.length != $domOptnList.length){
						Logger.logWarn('MCQGroup._populateLayout() | Number of Radios in the XML dont Match with the DOM');
						// ** PARENT node will be a "<td>" or a "<ul>"
						var $domRadioOption			= $($domOptnList[j]).parent(),
						// ** The syntax "$domRadioOption.wrap(<div></div>).html()" doesn't work here, hence using "outerHTML"
							sRadioHTMLMarkup		= $domRadioOption[0].outerHTML;
						$domRadioOption.remove();
						//Logger.logDebug('\tRadio HTML Markup = '+sRadioHTMLMarkup);
					}
				}

				if(sRadioHTMLMarkup){
					var $domTDOptnPointer = $(sRadioHTMLMarkup),
						$domOptnPointer = this.getElementByClassName($domTDOptnPointer, sOptnClass);

					$domOptnGrpPointer.append($domTDOptnPointer);
				}else{
					var $domOptnPointer = $($domOptnList[j]);
				}

				var nTabIndex		= (j === 0) ? 0 : -1;
				$domOptnPointer.attr({
					'id'			: 'radio_' + sOptnGrpID + '_' + sOptnID,
					'data-index'	: String(j),
					/* START - ARIA Implementation */
					'aria-checked'	: 'false',
					'role'			: 'radio',
					'tabindex'		: nTabIndex,
					'aria-posinset'	: (j+1),
				 	'aria-setsize'	: nNumOfOptions,
				 	'aria-labelledby' :sLabelID
					/* END - ARIA Implementation */
				});
				/* START - ARIA Implementation */
				$domOptnPointer.find('.radio-icon').attr('role', 'presentation');
				/* END - ARIA Implementation */
				if(this.oDataModel.displayTickCross()){
					var sTextForTickCross = parseInt(nOptnScore)>0?"correct":"incorrect";
					$domOptnPointer.addClass(sTextForTickCross);
				}
				//Logger.logDebug('MCQGroup._populateLayout() | DOM Radio '+$domOptnPointer[0]+' : ID = '+sOptnID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
				var oOptn = new Option($domOptnPointer[0], sOptnID, sOptnGrpID, nOptnScore, aOptnParameters);
				aOptionsList.push(oOptn);

				var $domOptnLbl	= this.getElementByClassName($domOptnPointer, sOptnLblClass);
				this._hasOptionLabel($domOptnLbl, sOptnLblClass, j, i);
				$domOptnLbl.attr('id', sLabelID);
				$domOptnLbl.html(sStmntTxt+' '+sOptnLblTxt);
			}

			this.createToggleOptions(aOptionsList);

			nMaxPossibleScore += nMaxScore;
		}
		if(sRadioContainerHTMLMarkup){
			//Logger.logDebug($tempRadioContainer.html());
			$domOptnGrpsCntnr.append(aTempRadioContainer);
		}
		this.oDataModel.setMaxPossibleScore(nMaxPossibleScore);

		var sSubmitID	= sQuestionID+'_submit';
		this.$btnSubmit = $('#'+sSubmitID+'.btn-submit');
		this.$btnSubmit.addClass('btn disabled').attr({
			/* START - ARIA Implementation */
			'role'			: 'button'
			/* END - ARIA Implementation */
			/* 'tabindex'		: 1*/ /* not required here */
		}).on('click', function(e){
			e.preventDefault();
			Logger.logDebug(' is submit active = '+ oScope.isBtnActive(this));
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);

		// ** MCQ Group activity loaded
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};

	MCQGroup.prototype.createToggleOptions			= function(p_aOptionsList){
		var oScope	= this,
			oMCQToggleGrp	= new ToggleGroup(p_aOptionsList);

		this.MCQhandleEvents = this._handleEvents.bind(this);
		oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);
		this.aMCQList.push(oMCQToggleGrp);
	};

	MCQGroup.prototype._handleEvents				= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type;
		//Logger.logDebug('MCQGroup._handleEvents() | Target = '+target+' : Current Target = '+currentTarget+' : Type = '+type);
		switch(type){
			case 'OPTION_SELECT':
				this._checkAndEnableSubmit();
				break;
			case 'SUBMIT':
				this._evaluate();
				break;
		}
	};

	MCQGroup.prototype._checkAndEnableSubmit		= function(p_optionID){
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			if(!oMCQToggleGrp.getSelectedOption()){
				this.enableSubmit(false);
				return;
			}
		}
		this.enableSubmit(true);
	};


	/*
	MCQGroup.prototype._evaluate							= function(){
		//Logger.logDebug("eVEALUATE () | ");

		// ** Updating Score
		for(var i=0;i<this.aMCQList.length;i++){
			var oMCQToggleGrp					= this.aMCQList[i],
				oSelectedOption					= oMCQToggleGrp.getSelectedOption(),
				sfbType				= this.oDataModel.getFeedbackType().toUpperCase();
				if(sfbType == "PARAMETERBASEDFEEDBACK"){
					this.updateScoreAndUserSelections(oSelectedOption.getParameters(), [oSelectedOption.getID(),oSelectedOption.getGroupID()]);

				}
				else{
					this.updateScoreAndUserSelections(oSelectedOption.getScore(), [oSelectedOption.getID(),oSelectedOption.getGroupID()]);
				}
		}

		// ** Feedback
		this.oDataModel.getFeedback(true);
		// ** Bookmark
		this.getBookmark();

		this.processFeedbackPopup();
		this.enableSubmit(false);
	};
	*/

	MCQGroup.prototype._evaluate							= function(){
		//Logger.logDebug("MCQ._evaluate() | sTrigger = "+ sTrigger);
		this.disableActivity();
		this.enableSubmit(false);
		this.oDataModel.updateAttempNumber();
        ComponentAbstract.prototype._evaluate.call(this)
        
		this.updateScoreAndUserSelections();
	};

	MCQGroup.prototype.updateScoreAndUserSelections		= function(){
		//Logger.logDebug("MCQ.updateScoreAndUserSelections() | ");
		var	nScore 				= 0;
		for(var i=0;i<this.aMCQList.length;i++){
			var oMCQToggleGrp		= this.aMCQList[i],
				oSelectedOption		= oMCQToggleGrp.getSelectedOption(),
				sfbType				= this.oDataModel.getFeedbackType().toUpperCase(),
				score				= (sfbType == "PARAMETERBASEDFEEDBACK") ? oSelectedOption.getParameters() : oSelectedOption.getScore(),
				aUserSelections		= [oSelectedOption.getID(), oSelectedOption.getGroupID()];
				nScore += oSelectedOption.getScore();
			ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aUserSelections);
		}

		var oScope			= this,
			oEvent			= {
				type			: 'SCORE_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.updateHistory,
				args			: []
			};

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.updateHistory();}
	};

	MCQGroup.prototype.updateHistory						= function(){
		this.oDataModel.getFeedback(true);
		var oScope	= this,
			oEvent	= {
				type			: 'HISTORY_UPDATE',
				target			: oScope,
				preventDefault	: false,
				callback		: oScope.processFeedbackPopup,
				args			: []
			};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if(!oEvent.preventDefault){this.processFeedbackPopup();}
		//Logger.logDebug('MCQGroup.updateHistory() | ###### Score = '+this.oDataModel.getScore().getScore()+' : % Score = '+this.oDataModel.getScore().getPercentScore());
	};






	MCQGroup.prototype.openFeedbackPopup = function (sFeedbackTitle, sFeedback) {
	    var oTransitionPopup = this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('#ImmediateFeedback_holder'));
	    oTransitionPopup.setCallback(this, this.checkAndResetOptions);
	};

	MCQGroup.prototype.checkAndResetOptions = function (p_oPopup, p_oArgs) {
		if (this.isAttemptsCompleted()) {
			this._activityCompleted();
	    }else{
	        this.resetOptions();
	        this.resetScore();
	        //this.updateAttempNumber();
	    }
	    ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
	};



	MCQGroup.prototype.updateModelScore				= function(p_nUserScore, p_aUserScore, p_aUserSelections){
		this.oDataModel.setScore(p_nUserScore);
		this.oDataModel.setUserScores(p_aUserScore);
		this.oDataModel.setUserSelections(p_aUserSelections);
	};

	MCQGroup.prototype.disable						= function(p_optionID){
		//Logger.logDebug('MCQGroup.disable() | '+ p_optionID);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	MCQGroup.prototype.disableActivity				= function(){
		//Logger.logDebug('MMCQ.disableActivity'+ this.aMMCQList.length);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.enable(false);
			//oMMCQToggleGrp.removeEventListener('OPTION_SELECT', this.MMCQhandleEvents);
		}
		this.enableSubmit(false);
	};

	MCQGroup.prototype.resetOptions					= function(){
		//Logger.logDebug('MMCQ.resetOptions() | '+this);
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.enable(true);
			oMCQToggleGrp.reset();
			oMCQToggleGrp.addEventListener('OPTION_SELECT', this.MCQhandleEvents);

		}
		this.enableSubmit(false);
	};
	MCQGroup.prototype.enableSubmit					= function(p_bEnable){
		if(p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			});
		}else{
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			});
		}
	};
	
	MCQGroup.prototype.setBookmark						= function(){
		var aUserSelections = this.oDataModel.getScore().getUserSelections();
		for( var i = 0;i < aUserSelections.length;i++){
			var oSelection = aUserSelections[i];
			var id 			= oSelection.optionID;
			var group 		= oSelection.optionGroupID;
			
			for( var j = 0;j < this.aMCQList.length;j++){
				var oToggleGrp = this.aMCQList[j];
				if(oToggleGrp.sGroupID === group){
					oToggleGrp.setSelectedOption(id);
					break;
				}
				
			}
			
		}
	};

	MCQGroup.prototype._hasOptionStatement			= function($domOptnStmnt, sStmntClass, i, sOptnGrpClass){
		if($domOptnStmnt.length == 0){Logger.logError('MCQGroup._populateLayout() | No element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
		if($domOptnStmnt.length > 1){Logger.logError('MCQGroup._populateLayout() | More than 1 element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sOptnGrpClass+'"');}
	};

	MCQGroup.prototype._hasOptionLabel				= function($domOptnLbl, sOptnLblClass, j, i){
		if($domOptnLbl.length == 0){Logger.logError('MCQGroup._populateLayout() | No element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
		if($domOptnLbl.length > 1){Logger.logError('MCQGroup._populateLayout() | More than 1 element with class "'+sOptnLblClass+'" found for Radio Number "'+(j+1)+'" in Radio Container "'+(i+1)+'"');}
	};

	MCQGroup.prototype._hasOptionGroupCotainer		= function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID){
		if($domOptnGrpsCntnr.length == 0){Logger.logError('MCQGroup._populateLayout() | No element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
		if($domOptnGrpsCntnr.length > 1){Logger.logError('MCQGroup._populateLayout() | More than 1 element with class "'+sOptnGrpsCntnrClass+'" found in element "'+sQuestionID+'"');}
	};

	MCQGroup.prototype.destroy						= function(){
		this.$btnSubmit.off();
		for(var i=0; i<this.aMCQList.length; i++){
			var oMCQToggleGrp = this.aMCQList[i];
			oMCQToggleGrp.destroy();
		}
	};

	MCQGroup.prototype.toString 					= function(){
		return 'framework/activity/MCQGroup';
	};

	return MCQGroup;
});
