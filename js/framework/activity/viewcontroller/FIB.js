define([
	'jquery',
	'framework/utils/globals',
	'framework/activity/viewcontroller/ActivityAbstract',
	'framework/activity/model/FIBModel',
	'framework/activity/viewcontroller/InputField',
	'framework/utils/Logger'
], function($, Globals, ComponentAbstract, FIBModel, InputField,  Logger){

	function FIB(){
		//Logger.logDebug('FIB.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aInputFieldList = [];
		this.nMaxPossibleScore=0;
     	this.inputFieldHandleEvents = this._handleEvents.bind(this);
		return this;
	}

	FIB.prototype									= Object.create(ComponentAbstract.prototype);
	FIB.prototype.constructor						= FIB;

	FIB.prototype.init								= function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation){
		//Logger.logDebug('FIB.init() ');
		// ** Calling Super Class "init()" function
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
	};

	FIB.prototype._createDataModel					= function(p_xmlActivityNode){
		this.oDataModel = new FIBModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);

		/*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
		/*this.oDataModel.addEventListener('UPDATE', function(e){
			oScope.handleModelUpdates(e);
		});*/
	};

	FIB.prototype._populateLayout					= function(){
		//Logger.logDebug('FIB._populateLayout() ');
		var oScope							= this,
			sQuestionID						= this.oDataModel.getQuestionID(),
			aTypeInContainerList			= this.oDataModel.getTypeInContainerList(),
			sTypeInContainerClass			= this.oDataModel.getTypeInContainerClass(),
			/*aStatementList				= this.oDataModel.getTypeInStatementList(),*/
			$domActivity					= this.getElementByID(this.$domView, sQuestionID),
			$domTypeInContainerList			= this.getElementByClassName($domActivity, sTypeInContainerClass),
			nDomTypeInConatainersLength		= $domTypeInContainerList.length || 0,
			nTypeInContainerListLength		= aTypeInContainerList.length || 1,
			nMaxPossibleScore				= 0,
			nSubmitTabIndex;

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, $domActivity, sQuestionID);

		/* START - ARIA Implementation */
		$domActivity.attr({
			'role'		: 'application',
			'tabindex'	: -1
		});
		/* END - ARIA Implementation */

		// ** Check if the number of XML nodes for FIB Containers are Equal to the Number of FIB Containers in the DOM
		if(nTypeInContainerListLength !== nDomTypeInConatainersLength){
			Logger.logError('FIB._populateLayout() | ERROR: Number of "typeInConatainers" in the XML dont Match with the DOM elements having class "'+sTypeInContainerClass+'"');
		}

		//Logger.logDebug('aTypeInContainerList = '+JSON.stringify(aTypeInContainerList));
		if(this.isArray(aTypeInContainerList)){
			// ** Iterarating through the Type In List
			for(var i=0; i<nTypeInContainerListLength; i++){
				nMaxPossibleScore += this._createTypeIns($domActivity, i, $domTypeInContainerList[i], aTypeInContainerList[i]);
			}
			nSubmitTabIndex	= nTypeInContainerListLength + 1;
		}else{
			nMaxPossibleScore = this._createTypeIns($domActivity, 0, $domTypeInContainerList[0], aTypeInContainerList);
			nSubmitTabIndex	= 2;
		}

		//this.oDataModel.setMaxPossibleScore(nMaxPossibleScore);
		this.nMaxPossibleScore =nMaxPossibleScore;
		//Logger.logDebug('nMaxPossibleScore = '+this.nMaxPossibleScore);

		var sSubmitID	= sQuestionID+'_submit';
		this.$btnSubmit = $('#'+sSubmitID+'.btn-submit');
		this.$btnSubmit.addClass('btn disabled').attr({
			/* START - ARIA Implementation */
			'role'			: 'button',
			'tabindex'		: nSubmitTabIndex
			/* END - ARIA Implementation */
		}).on('click', function(e){
			e.preventDefault();
			if(oScope.isBtnActive(this)){
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {target:this, type:'ACTIVITY_LOADED', GUID:this.sGUID, eventID:this.sEventID, incidentID:this.sIncidentID});
	};

	FIB.prototype._createTypeIns					= function($domActivity, i, domTypeInContainerPointer, p_oTypeInContainerPointer){
		var oTypeInContainerPointer 	= p_oTypeInContainerPointer,
			$typeInContainerPointer		= $(domTypeInContainerPointer),
			/* The LI Container */
			sTypeInContainerClass		= oTypeInContainerPointer._class,
			/* Lable Statement Input Field */
			oTypeInStatement			= this.oDataModel.getTypeInStatement(i);
			sStmntClass					= oTypeInStatement._class,
			sStmntTxt					= oTypeInStatement.__cdata,
			aStmntTxt					= this._getStatementArray(sStmntTxt),
			nNumOfInputsInStmnt			= aStmntTxt.length - 1,
			/* Input Field Container */
			aTypeInList					= this.oDataModel.getTypeInList(i),
			nTypeInListLength			= (this.isArray(aTypeInList)) ? aTypeInList.length : 1,
			/* Custom Vars */
			sStatementID				= 'typein_'+(i+1)+'_label',
			nScore						= 0,
			j							= 0;

		if(nTypeInListLength !== nNumOfInputsInStmnt){
			Logger.logError('FIB._createTypeIns() | ERROR: Number ('+nNumOfInputsInStmnt+') of Input Fields specified in a "pageText" node doesnt match the number ('+nTypeInListLength+') of "typeIn" nodes specified in the XML for "typeInContainer" number "'+(i+1)+'".');
		}


		if(nTypeInListLength > 1){
			var $statement	= $('<p></p>');
			$statement.attr({
				 'id'				: sStatementID,
				 'class'			: sStmntClass
			});

			for(j=0; j<nTypeInListLength; j++){
				var oTypeInPointer		= aTypeInList[j],
					oInput				= this.oDataModel.getInputField(i, j),
					oInputProps			= this._createInputProperties(oTypeInPointer, oInput),
					sTypeInID			= 'typein_' + (i+1) + '~' + (j+1),
					$domTypeInField		= $('<input/>');

				nScore					+= this.sanitizeValue(oTypeInPointer._score, 1);

				$domTypeInField.attr({
					 'type'				: 'text',
					 'id'				: sTypeInID,
					 'class'			: 'type-in',
					 'aria-labelledby'	: sStatementID,
					 'title'			: 'Press Enter to select and type in your answer'
				});

				var oInputField = new InputField($domTypeInField[0], sTypeInID, oInputProps);//, aOptnParameters
				oInputField.addEventListener('TYPE_IN', this.inputFieldHandleEvents);
				oInputField.addEventListener('ENTER', this.inputFieldHandleEvents);
				this.aInputFieldList.push(oInputField);

	            $statement.append(aStmntTxt[j]).append($domTypeInField);
			}

			$statement.append(aStmntTxt[nTypeInListLength]);
		}else{
			var sTypeInID			= 'typein_' + (i+1) + '~' + 1;
			var $statement			= $('<label></label>');
			$statement.attr({
				 'id'				: sStatementID,
				 'class'			: sStmntClass,
				 'for'				: sTypeInID
			});

			var oTypeInPointer		= aTypeInList,
				oInput				= this.oDataModel.getInputField(i, 0),
				oInputProps			= this._createInputProperties(oTypeInPointer, oInput),
				$domTypeInField		= $('<input/>');

			nScore					+= this.sanitizeValue(oTypeInPointer._score, 1);

			$domTypeInField.attr({
				 'type'				: 'text',
				 'id'				: sTypeInID,
				 'class'			: 'type-in'
			});

			var oInputField = new InputField($domTypeInField[0], sTypeInID, oInputProps);//, aOptnParameters
				oInputField.addEventListener('TYPE_IN', this.inputFieldHandleEvents);
				oInputField.addEventListener('ENTER', this.inputFieldHandleEvents);
				this.aInputFieldList.push(oInputField);
			var oTickCrossSpan;
			if(this.oDataModel.displayTickCross()){
				
				oTickCrossSpan=$("<span class='correctincorrect top hide'></span>");
			}
			$statement.append(aStmntTxt[0]).append(oTickCrossSpan,$domTypeInField).append(aStmntTxt[1]);
		}

		$typeInContainerPointer.append($statement);

		return nScore;
	};

	FIB.prototype._createInputProperties			= function(oTypeInPointer, oInput){
		/* Input Field Properties and Restrictions */
		var oInputProps					= {
			sTypeInClass				: oInput._class,
			sRestrictTo					: this.sanitizeValue(oInput._restrictTo, 'none'),
			sAllowChars					: this.sanitizeValue(oInput._allowChars, ''),
			sRestrictChars				: this.sanitizeValue(oInput._restrictChars, ''),
			nMaxChars					: this.sanitizeValue(oInput._maxChars, 10),
			sCharCase					: this.sanitizeValue(oInput._charCase, 'both'),
			bCutCopyPaste				: this.sanitizeValue(oInput._cutCopyPaste, false),
			bCaseSensitiveValidation	: this.sanitizeValue(oInput._caseSensitiveValidation, false),
			sTypeInDefaultTxt			: this.sanitizeValue(oInput.__cdata, null),
			nScore						: this.sanitizeValue(oTypeInPointer._score, 1),
			sLinkedTo					: oTypeInPointer._linkedTo,
			/* Possible Answers */
			aAnswers					: oTypeInPointer.answers.answer
		};

		return oInputProps;
	};

	FIB.prototype._getStatementArray				= function(p_sStatement){
		var aPieces	= p_sStatement.split('<<INPUT>>');
		return aPieces;
	};

	FIB.prototype._handleEvents						= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type;
		//Logger.logDebug('FIB._handleEvents() | Target = '+ target+' : Type = '+type);

		switch(type){
			case 'TYPE_IN':
				//Logger.logDebug('FIB._handleEvents() | Input Field ID = '+ target.getID());
				this._dispatchTypeInEvent(e);
				this._checkAndEnableSubmit();
				break;
			case 'SUBMIT':
				this._dispatchSubmitEvent(e);
				this._evaluate(e);
				break;
			case 'ENTER':
				if(this._checkAndEnableSubmit()){
					this.$btnSubmit.click();
				}
				break;
		}
	};

	FIB.prototype._dispatchTypeInEvent				= function(e){
		e.inputList	= this.getInputFieldList();
		this.dispatchEvent(e.type, e);
	};

	FIB.prototype._dispatchSubmitEvent				= function(e){
		//Logger.logDebug('FIB._dispatchSubmitEvent() | Default Prevented = '+e.isDefaultPrevented());
		e.type					= 'SUBMIT';
		e.target				= this;
		e.deafultPrevented		= false;
		e.inputList				= this.aInputFieldList;
		e.returnFocusTo			= this.aInputFieldList[0].getInputField();

		this.dispatchEvent('SUBMIT', e);
	};

	FIB.prototype._checkAndEnableSubmit				= function(p_optionID){
		for(var i=0; i<this.aInputFieldList.length; i++){
			var oInputField = this.aInputFieldList[i];
			if(oInputField.getText() == ''){
				this.enableSubmit(false);
				return false;
			}
		}
		this.enableSubmit(true);
		return true;
	};

	/*
	FIB.prototype._evaluate							= function(e){
			//Logger.logDebug('FIB._evaluate() | Default Prevented = '+e.deafultPrevented);
			if(e.deafultPrevented){return;}
			var aUserScore			= [],
				aUserSelections     = [],
				oScope              = this,
				nUserScore			= 0;

			for(var i=0; i<this.aInputFieldList.length; i++){
				var oInputField		= this.aInputFieldList[i],
					sInputID		= oInputField.getID(),
					sText			= oInputField.getText(),
					nScore			= (oInputField.validate()) ? oInputField.getScore() : 0;
				//Logger.logDebug('FIB._evaluate() | Score = '+nScore+' : Text = '+sText);

				nUserScore	+= nScore;
				aUserScore.push(nScore);
				aUserSelections.push(sText);
			}
			this.updateModelScore(nUserScore, aUserScore, aUserSelections);

			var oFeedback = this.oDataModel.getFeedback(),
				oBookmark = this.oDataModel.getBookmark();
				  //Logger.logDebug('MCQGroup._evaluate() | FB = '+JSON.stringify(oFeedback));

			var sFeedbackTitle	= oFeedback.getTitle();
			var	sFeedback		= oFeedback.getContent();

			this.disableActivity();
						//sent to page
			var e = new EventObject('BEFORE_ACTIVITY_ATTEMPT_UPDATE', this, this, {
				callback: oScope,
				method: oScope.checkAndResetOptions,
			});

			this.dispatchEvent('BEFORE_ACTIVITY_ATTEMPT_UPDATE', e);
			if (e.defaultPrevented()) {
				return;
			} else {
				if (this.oDataModel.isShowFeedbackPopup()) {
					this.openFeedbackPopup(sFeedbackTitle, sFeedback);
				}
				else {
					this.checkAndResetOptions();
				}
			}


			//Logger.logDebug('FIB._evaluate() | FB = '+JSON.stringify(oFeedback));
			this.dispatchEvent('ACTIVITY_COMPLETE', {type:'ACTIVITY_COMPLETE', target:this, feedback:oFeedback, bookmark:this.oDataModel.getBookmark(), returnFocusTo:this.aInputFieldList[0].getInputField()});
		};
		*/
/*
	FIB.prototype._evaluate							= function(){
		//Logger.logDebug("eVEALUATE () | ");
		this.disableActivity();
		// ** Updating Score
		for(var i=0;i<this.aInputFieldList.length;i++){
			var oToggleGrp					= this.aInputFieldList[i],

				sfbType				= this.oDataModel.getFeedbackType().toUpperCase();
				if(sfbType == "PARAMETERBASEDFEEDBACK"){
					this.updateScoreAndUserSelections(oToggleGrp.getParameters(), oToggleGrp.getID(),oToggleGrp.getGroupID());

				}
				else{
					this.updateScoreAndUserSelections(oToggleGrp.getScore(), oToggleGrp.getID());
				}
		}

		// ** Feedback
		this.getFeedback(true);
		// ** Bookmark
		this.getBookmark();

		this.processFeedbackPopup();
		this.enableSubmit(false);
	};
*/
	FIB.prototype._evaluate							= function(){
		
		
		this.disable();
		this.enableSubmit(false);
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections();



	};

	FIB.prototype.updateScoreAndUserSelections		= function(){
		//Logger.logDebug("FIB.updateScoreAndUserSelections() | ");
		var sfbType							= this.oDataModel.getFeedbackType().toUpperCase();
		for(var i=0;i<this.aInputFieldList.length;i++){
			var oToggleGrp					= this.aInputFieldList[i],
				aUserSelections				= [oToggleGrp.getID()],
				score						= (sfbType == "PARAMETERBASEDFEEDBACK") ? oToggleGrp.getParameters() :  ((oToggleGrp.validate()) ? oToggleGrp.getScore() : 0);
			
			ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aUserSelections);
		}
		this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);	
		oScope			= this,
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

	FIB.prototype.updateHistory						= function(){	
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
	};

	
	


	FIB.prototype.processFeedbackPopup					= function(){
		var oScope			= this,
			oFeedback		= this.getFeedback(),
			sFeedbackTitle	= oFeedback.getTitle(),
			sFeedback		= oFeedback.getContent(),
		 	oTransitionPopup,
			oEvent = {
				target				: oScope,
				popup				: oTransitionPopup
			};

	
		if(this.oDataModel.isShowFeedbackPopup()){
			oTransitionPopup		= this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));
			oTransitionPopup.setCallback(this, this.checkAndResetOptions);
			
		}else{
			this.checkAndResetOptions();
		}
		this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
	    //this.checkAndResetOptions();


	};
	
	FIB.prototype.setTickCrossUI						=function(){
		if(this.oDataModel.displayTickCross()){
			for(var i=0;i<this.aInputFieldList.length;i++){
				var oToggleGrp						= this.aInputFieldList[i],	
				sfbType								= this.oDataModel.getFeedbackType().toUpperCase(),
				score								= (sfbType == "PARAMETERBASEDFEEDBACK") ? oToggleGrp.getParameters() : oToggleGrp.getScore();
				sTextForTickCross 					= parseInt(score)>0?"correct":"incorrect";
				
				oToggleGrp.$domTIF.prev().addClass(sTextForTickCross);
				oToggleGrp.$domTIF.next().addClass(sTextForTickCross);
			}
		}
	};

	FIB.prototype.openFeedbackPopup = function (sFeedbackTitle, sFeedback) {
	    var oTransitionPopup = this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));
	    oTransitionPopup.setCallback(this, this.checkAndResetOptions);
	};

	FIB.prototype.checkAndResetOptions = function (e) {
		if (this.isAttemptsCompleted()) {
			this.disableActivity();
			this.setTickCrossUI();
			this._activityCompleted();
			
	    }else{
	        this.resetOptions();
	        this.resetScore();
	        //this.updateAttempNumber();
	    }
	};

	FIB.prototype.updateModelScore = function (p_nUserScore, p_aUserScore, p_aUserSelections) {
	    this.oDataModel.setScore(p_nUserScore);
	    this.oDataModel.setUserScores(p_aUserScore);
	    this.oDataModel.setUserSelections(p_aUserSelections);
	};

	FIB.prototype.getInputFieldList					= function(){
		return this.aInputFieldList;
	};

	FIB.prototype.disable							= function(p_optionID){
		//Logger.logDebug('FIB.disable() | '+p_optionID);
		for(var i=0; i<this.aInputFieldList.length; i++){
			var oInputField = this.aInputFieldList[i];
			oInputField.enable(false);
		}
		this.enableSubmit(false);
	};

	FIB.prototype.disableActivity					= function(){
		//Logger.logDebug('FIB.disableActivity() | ');
		for(var i=0; i<this.aInputFieldList.length; i++){
			var oInputField = this.aInputFieldList[i];
			oInputField.enable(false);
			oInputField.removeEventListener('TYPE_IN', this.inputFieldHandleEvents);
			oInputField.removeEventListener('ENTER', this.inputFieldHandleEvents);
		}
		this.enableSubmit(false);
	};

	FIB.prototype.resetOptions								= function(){
		//Logger.logDebug('FIB.reset() | ');
		for(var i=0; i<this.aInputFieldList.length; i++){
			var oInputField = this.aInputFieldList[i];
			oInputField.reset();
		}
		this.enableSubmit(false);
	};

	FIB.prototype.enableSubmit						= function(p_bEnable){
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



	FIB.prototype._hasOptionStatement				= function($domOptnStmnt, sStmntClass, i, sTypeInContainerClass){
		if($domOptnStmnt.length == 0){Logger.logError('FIB._populateLayout() | No element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sTypeInContainerClass+'"');}
		if($domOptnStmnt.length > 1){Logger.logError('FIB._populateLayout() | More than 1 element with class "'+sStmntClass+'" found in the element number "'+(i+1)+'" having class "'+sTypeInContainerClass+'"');}
	};

	FIB.prototype._hasInputField					= function($domOptn, sTypeInClass, i, sTypeInContainerClass){
		if($domOptn.length == 0){Logger.logError('FIB._populateLayout() | No element with class "'+sTypeInClass+'" found in the element number "'+(i+1)+'" having class "'+sTypeInContainerClass+'"');}
		if($domOptn.length > 1){Logger.logError('FIB._populateLayout() | More than 1 element with class "'+sTypeInClass+'" found in the element number "'+(i+1)+'" having class "'+sTypeInContainerClass+'"');}
	};

	FIB.prototype.destroy							= function($domTypeInsCntnr, sTypeInsCntnrClass, sQuestionID){
		this.$btnSubmit.off();
		for(var i=0; i<this.aInputFieldList.length; i++){
			var oInputField = this.aInputFieldList[i];
			oInputField.removeEventListener('TYPE_IN', this.inputFieldHandleEvents);
			oInputField.removeEventListener('ENTER', this.inputFieldHandleEvents);
			oInputField.destroy();
		}
	};

	FIB.prototype.toString 							= function(){
		return 'framework/activity/FIB';
	};

	return FIB;
});
