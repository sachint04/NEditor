define([
	'jquery', 
	'framework/utils/globals', 
	'framework/activity/viewcontroller/ActivityAbstract', 
	'framework/activity/MultipleSelectGroup', 
	'framework/model/CourseConfigModel', 
	'framework/activity/model/MachingModel', 
	'framework/activity/viewcontroller/Option', 
	'framework/utils/ResourceLoader', 
	'framework/core/PopupManager', 
	'framework/utils/Logger'
	], function($, Globals, ComponentAbstract, MultipleSelectGroup, CourseConfig, MachingModel, Option, ResourceLoader, PopupManager, Logger) {

	function Maching() {
		//Logger.logDebug('Maching.CONSTRUCTOR() ');
		ComponentAbstract.call(this);

		this.aMachingList = [];
		this.domTemplate = null;
		this.bFirstTime = true;
		this.currentSetID = null;
		this.$domOptnGrpsCntnr = null;
		this.$btnSubmit = null;
		this.$btnReset = null;
		this.sOptnGrpsCntnrClass = "";
		this.sOptionCls = "";
		this.sOptnTypeCls = "";
		this.sOptionLabelCls = "";
		this.sQuestionCls = "";
		this.sStatementCls = "";
		this.nMaxPossibleScore = 0;
		this.oSelectedToggleGrp = {};
		this.maxConnections = 0;
		this.nMaxPossibleSelection;
		this.oConnections;
		this.oCurrentOpt;
		this.MachinghandleEvents = this._handleEvents.bind(this);

		return this;
	}


	Maching.prototype = Object.create(ComponentAbstract.prototype);
	Maching.prototype.constructor = Maching;
	Maching.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
		$xmlActivity = p_$xmlActivityNode;
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
	};

	Maching.prototype._createDataModel = function(p_xmlActivityNode) {
		this.oDataModel = new MachingModel(p_xmlActivityNode, this.sGUID, this.sScoringUID);
	};

	Maching.prototype._populateLayout = function(sExpressionID, sTrigger) {
		var oScope 					= this;
		this.sOptnGrpsCntnrClass 	= '.'+this.oDataModel.getConfig('class');
		this.sOptionCls 			= '.'+this.oDataModel.oDataModel.optionGroups.optionGroup[0].option[0]._class;
		this.sOptnTypeCls 			= '.'+this.oDataModel.oDataModel.optionGroups.optionGroup[0]._class;
		this.$domOptnGrpsCntnr 		= this.$domView.find(this.sOptnGrpsCntnrClass);
		this.oConnections			= [];
		
		if (this.domTemplate == null) {
			if(this.$domView.find(this.sOptnTypeCls).length === 1){
				this.domTemplate 		= this.$domView.find(this.sOptnTypeCls);				
			}
		}
			
		var sQuestionID 			= this.oDataModel.getQuestionID();
		this.bHasReset 			 	= this.oDataModel.getConfig('hasResetBtn')? (this.oDataModel.getConfig('hasResetBtn') == "true") : false;
		this.bHasShowAns		 	= this.oDataModel.getConfig('hasShowAnswer')? (this.oDataModel.getConfig('hasShowAnswer') == "true") : false;
		
		this.nMaxPossibleSelection 	= this.oDataModel.getConfig('maxSelection') ? parseInt(this.oDataModel.getConfig('maxSelection')) : null;

		/* START - ARIA Implementation */
		this.$domView.attr({
			'role' : 'application',
			'tabindex' : -1
		});

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, this.$domView, sQuestionID);
		
		this.$btnSubmit = this.$domView.find('.btn-submit').attr('id', this.getQuestionID() + '_submit');
		this.$btnReset = this.$domView.find('.btn-reset').attr('id', this.getQuestionID() + '_reset');

		//Validate Submit button
		if (this.$btnSubmit.length === 0) {
			Logger.logError('Maching._populateLayout() | ERROR: "Submit" button not found. A button with id "' + sQuestionID + '_submit" and class "btn-submit" needs to exist within the Activity container');
		}

		//Initialize Submit Button
		this.$btnSubmit.click(function(e) {
			e.preventDefault();
			if (oScope.isBtnActive(this)) {
				e.type = 'SUBMIT';
				oScope.MachinghandleEvents(e);
			}
		});
		this.enableSubmit(false);
		
		this.enableReset(false);
		if(this.$btnReset.length){
			this.$btnReset.attr('id',this.getQuestionID() + '_reset');
			if(this.bHasReset){
				this.$btnReset.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'RESET';
						oScope._handleEvents(e);
					}
				});
				this.$btnReset.removeClass('hide');
			}
		}


		this.$btnShowAns 	= this.$domView.find('.btn-show-ans');
		if(this.$btnShowAns.length){
			this.$btnShowAns.addClass('hide');
			this.$btnShowAns.attr('id',this.getQuestionID() + '_showAns');
			if(this.bHasShowAns){
				this.$btnShowAns.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'SHOW_ANSWER';
						oScope._handleEvents(e);
					}
				});
				this.$btnShowAns.removeClass('hide');
			}else{
				this.$btnShowAns.remove();
			}
		}
		
		this.$btnUserAns 		= this.$domView.find('.btn-show-my-ans');
		if(this.$btnUserAns.length){
			this.$btnUserAns.attr('id',this.getQuestionID() + '_myAns');
			this.$btnUserAns.addClass('hide');
			if(this.bHasShowAns){
				this.$btnUserAns.click(function(e) {
					e.preventDefault();
					if (oScope.isBtnActive(this)) {
						e.type = 'SHOW_USER_ANSWER';
						oScope._handleEvents(e);
					}
				});
//					this.$btnUserAns.removeClass('hide');
			}else{
				this.$btnUserAns.remove();
			}
		}

		this._populateOptionText();
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {
			target : this,
			type : 'ACTIVITY_LOADED',
			GUID : this.sGUID,
			eventID : this.sEventID,
			incidentID : this.sIncidentID
		});
	};

	

	Maching.prototype._populateOptionText = function() {
		var oScope 	= this,
		groups		= this.oDataModel.oDataModel.optionGroups.optionGroup,
		i;
		
		if(!groups.length){
			Logger.logError('Error', 'optionGroup should me more than one');
		}
		
		for(i = 0; i<groups.length;i++){
			var $optGrpCntr 		= this.$domOptnGrpsCntnr.eq(i);
			var $optCntr 			= $optGrpCntr.find(this.sOptnTypeCls).unwrap();
			$optGrpCntr.attr('id', 'group_'+(i+1));
			this.$domView.find('.optionscontainer .grp-holder').append($optGrpCntr);
			this.createGroup($optGrpCntr, $optCntr, groups[i] );
			$optCntr.remove();
		}			
				
		//this.$domOptnGrpsCntnr.remove();
		// this.domTemplate.remove();
		


		$domOptnGrpList = null;
		aOptionsList = null;
		$domOptnGrpsCntnr = null;
	};

	Maching.prototype.createGroup = function($optGrpCntr, $optCntr, p_oGroup, bDoNotShuffle) {
		var aOptions 			= p_oGroup.option,// bDoNotShuffle ? p_oGroup.option : Globals.shuffleArray(p_oGroup.option.slice(0)),
			nNumOfOptions 		= aOptions.length,
		    sStatementID 		= '',
		    $domOptnGrpList 	= null,
		    groupId				= p_oGroup._id,
		    aOptionsList 		= [],
		    $domTemplate 		= $optCntr,
		    i;

		this.oConnections[groupId] = [];
		
		if(this.maxConnections < nNumOfOptions)
			this.maxConnections = nNumOfOptions;
		
		for (i = 0; i < nNumOfOptions; i++) {
			
			//clone and append the template row from the html
			if ($domTemplate.length) {
				$optGrpCntr.append($domTemplate.clone().attr({
					'role' : 'checkbox',
					'aria-labelledby' : sStatementID,
					'title' : "Option " + (i + 1)
				}));
			}
		}

		for (i = 0; i < nNumOfOptions; i++) {
			var oOption 				= aOptions[i],
			    sOptnID 				= oOption._id,
			    $domOptnList 			= null,
			    nMaxScore 				= 0,
			    nNextSetID 				= oOption._jumpGroupID,
			    sStatementID 			= 'checkboxgroup_' + (i + 1) + '_label',
			    nOptnScore 				= Number(oOption._score),
			    aOptnParameters 		= oOption.PARAMETER || null,
			    sImmediateFeedBack 		= oOption.feedback.content.__cdata,
			    sImmediateFeedBackTitle = oOption.feedback.title.__cdata,
			    sOptnLblTxt 			= oOption.pageText.__cdata,
			    nMaxScore 				= Math.max(nMaxScore, nOptnScore),
				$domOptnGrpPointer 		= $optGrpCntr.find(this.sOptnTypeCls).eq(i),
			    $domOptnStmnt			= $domOptnGrpPointer.find('.checkbox-label'),
			    matchId					= oOption._matchId;
			
				$domOptnStmnt.html(sOptnLblTxt).attr('id', sStatementID);
	
				var nTabIndex = (i === 0) ? 0 : -1;
				$domOptnGrpPointer.attr({
					'id' : 'checkbox_' + sOptnID,
					'role' : 'checkboxgroup',
					'aria-labelledby' : sStatementID,
					'data-index' : String(i),
					'data-group' : groupId,
					'aria-checked' : 'false',
					'role' : 'checkbox',
					'tabindex' : 0,
					'aria-posinset' : (i + 1),
					'aria-setsize' : nNumOfOptions
				});
				
			/* END - ARIA Implementation */
			$domOptnGrpPointer.find('.checkbox-icon').attr('role', 'presentation');

			//feedback can contain any properties
			var oOptionData = {
				sOptionText : sOptnLblTxt,
				sImmediateFB : sImmediateFeedBack,
				sImmediateFBTitle : sImmediateFeedBackTitle,
				matchId				: matchId
			};

		

			////Logger.logDebug('Maching._populateLayout() | DOM Radio '+domOptn+' : ID = '+sOptnID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
			var oOptn = new Option($domOptnGrpPointer, sOptnID, groupId, nOptnScore, aOptnParameters, oOptionData);
			aOptionsList.push(oOptn);
			$domOptnStmnt.on('click', function(e) {
				e.preventDefault();
			});
			this.nMaxPossibleScore += Math.max(nMaxScore, 0);
		}
		this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
		this.createToggleOptions(aOptionsList);		
		
	};
	
	Maching.prototype.createToggleOptions = function(p_aOptionsList) {
		oMachingToggleGrp = new MultipleSelectGroup(p_aOptionsList);
		oMachingToggleGrp.addEventListener('OPTION_SELECT', this.MachinghandleEvents);
		this.aMachingList.push(oMachingToggleGrp);
		this.oSelectedToggleGrp = oMachingToggleGrp;
		//Logger.logDebug("createToggleOptions() this.aMachingList : "+this.aMachingList);
	};

	Maching.prototype._handleEvents = function(e) {
		//Logger.logDebug("handleEvents : "+ e.type);
		if ( typeof e.preventDefault == 'function') {
			e.preventDefault();
		}
		var oScope = this,
		    target = e.target,
		    oOption = e.option,
		    currentTarget = e.currentTarget,
		    oEvent,
		    type = e.type;
		//Logger.logDebug('\tCurrent Target = '+target+' : Type = '+type);
		switch (type) {
		case 'OPTION_SELECT':
			oEvent = $.extend({}, e, {
				oScope : oScope,
				target : this,
				toggleGroup : target
			});
			this.dispatchEvent('OPTION_SELECT', oEvent);
			var optId = oOption.getID();
			var grpId = oOption.getGroupID();
			//console.log('handleEvents() | option '+optId+' selected from '+grpId);
			if(oOption.bSelected){
				this.validateGroup(optId, grpId);
				this.addConnection(optId, grpId);
			}else{
				this.removeConnection(optId, grpId);
			}
			
			
			this._checkAndEnableSubmit();
			this.checkMaxSelection();
		

			break;

		case 'SUBMIT':
			oEvent = $.extend({}, e, {
				oScope : oScope,
				target : this,
				toggleGroup : target
			});
			this._evaluate('SUBMIT');
			this.dispatchEvent('SUBMIT', oEvent);
			break;
		case 'RESET' :
			this.reset();
			break;
			
		case 'SHOW_ANSWER' :
			this.showAnswer();
			this.$btnShowAns.addClass('hide');
			this.$btnUserAns.removeClass('hide');
			this.hideTickCross();
		break;
		case 'SHOW_USER_ANSWER' :
			this.showMyAnswer();
			this.displayTickCross();
			this.$btnUserAns.addClass('hide');
			this.$btnShowAns.removeClass('hide');
			this.dispatchEvent(type, oEvent);
		break;
		}
	};

	Maching.prototype.validateGroup = function(p_sId, p_grpId) {
		//console.log('validateGroup() | group id '+p_grpId+' | option id '+p_sId);
		var aGroup =  this.oConnections[p_grpId],i,result;
		if(!aGroup){
			throw new Error('hasConnection() | '+p_grpOd+ ' groupd not found.');
		}
		for(var param in this.oConnections){
			if(param != p_grpId){
				var grp			= this.oConnections[param];
				var len 		= grp.length;
				//console.log('\tValidateGroup() | other group '+ param+ ' found with '+len+' options.');
				//console.log('\tcurrnet selections group length '+ aGroup.length);
				if(aGroup.length > len){
					//console.log('\t group '+p_grpId+' has unlinked option '+aGroup );
					this.removeConnection(aGroup[aGroup.length -1], p_grpId);
					break;
				}
			}
		}

	};
	
	Maching.prototype.hasConnection = function(p_sId, p_grpId) {
		//console.log('hasConnection() | group id '+p_grpId+' | option id '+p_sId);
		var aGroup =  this.oConnections[p_grpId],i,result;
		if(!aGroup){
			throw new Error('hasConnection() | '+p_grpOd+ ' groupd not found.');
		}
		
		for(i = 0;i < aGroup.length; i++){
			if(aGroup[i].indexOf(p_sId) != -1){
				//console.log('\tconnection available for '+ p_sId);
				result = true;
				break;
			}
		}
		return result;
	};
	
	Maching.prototype.removeConnection = function(p_sId, p_grpId) {
		//console.log('removeConnection() | group id '+p_grpId+' | option id '+p_sId);
		var aGroup =  this.oConnections[p_grpId],i,result;
		if(!aGroup){
			throw new Error('removeConnection() | '+p_grpOd+ ' groupd not found.');
		}
		for(i = 0;i < aGroup.length; i++){
			if(aGroup[i] === p_sId){
				//console.log('\tremoveConnection() | removing option '+p_sId+' from group '+p_grpId+' at index '+ i);
				
				for (var j=0; j < this.aMachingList.length; j++) {
					if(this.aMachingList[j].sGroupID === p_grpId){
						//console.log('\tremoveConnection() | removing selection from '+p_sId+' from group '+p_grpId+' at index '+ j);
						this.aMachingList[j].resetOption(p_sId);
						break;
					}
				};
				
				aGroup.splice(i , 1);
				//console.log('\tremoveConnection() | group '+aGroup);
				break;
			}
		}
		
		for(var param in this.oConnections){
			if(param != p_grpId){
				var grp = this.oConnections[param];
				if(grp.length > i){
					for (var j=0; j < this.aMachingList.length; j++) {
						if(this.aMachingList[j].sGroupID === param){
							//console.log('\tremoveConnection() | removing selection '+grp[i]+' from group '+param+' at index '+ i);
							this.aMachingList[j].resetOption(grp[i]);
							break;
						}
					};
					var id='';
					if(p_grpId == "1"){
						this.removeLine(this.$domView.find('.connection'),p_grpId, p_sId, param, grp[i]);		
					}else{
						this.removeLine(this.$domView.find('.connection'), param, grp[i], p_grpId, p_sId );			
					}
					grp.splice(i , 1);
					break;
				}	
			} 
		}
		
	};
	
	Maching.prototype.addConnection = function(p_sId, p_grpId) {
		//console.log('addConnection() | group id '+p_grpId+' | option id '+p_sId);
		
		var aGroup =  this.oConnections[p_grpId];
		if(!aGroup){
			throw new Error('addConnection() | '+p_grpOd+ ' groupd not found.');
		}
		
		var index 	= aGroup.indexOf(p_sId);
		//console.log('\taddConnection() | index of  connection in  group '+p_grpId+' is '+index+'.');
		if(index === -1){
			aGroup.push(p_sId);
			//console.log('\taddConnection() | adding new connection '+p_sId+' to group '+p_grpId+' .');
			
			var $icon 			= this.$domView.find('#group_'+p_grpId + ' #checkbox_'+p_sId+ ' .checkbox-icon');
			var offset1 		= $icon.offset();
			offset1.top 		+= ($icon.height() / 2);
			offset1.left 		+= ($icon.width() / 2);
			
			offset1.top			-= this.$domView.parent().offset().top; 
			offset1.left		-= this.$domView.parent().offset().left;
			 
			var offset2;
			for(var param in this.oConnections){
				if(param != p_grpId){
					var grp = this.oConnections[param];
					if(grp.length >= aGroup.length){
						var $icon2 = this.$domView.find('#group_'+param + ' #checkbox_'+grp[aGroup.length - 1]+ ' .checkbox-icon');
						offset2 = $icon2.offset();
						offset2.top 		+= ($icon2.height() / 2);
						offset2.left 		+= ($icon2.width() / 2);
						offset2.top			-= this.$domView.parent().offset().top; 
						offset2.left		-= this.$domView.parent().offset().left;
						break;
					}	
				} 
			}
			
			if(offset2){
				var id='';
				if(p_grpId == "1"){
					id= p_grpId+ '_'+p_sId+ '_'+param+ '_'+grp[aGroup.length - 1];		
				}else{
					id = param+ '_'+grp[aGroup.length - 1]+ '_'+p_grpId+ '_'+p_sId;			
				}
				
				//console.log('\taddConnection() 	| drawing new connection with id '+ id );
				var line = this.$domView.find('.connection').append(this.addLine(offset1, offset2, id));			
			}
		}else{
			this.removeConnection(p_sId, p_grpId);	
			//console.log('\taddConnection() | connection already available.\n\t removing connection from group '+p_grpId+' .');
		}
			//console.log('\taddConnection() | group '+p_grpId+' has '+ aGroup);
	};
	
	/** disabled unchecked options on max possible selection */
	Maching.prototype.checkMaxSelection = function() {
		if (!this.nMaxPossibleSelection)
			return;
		var nCurrentCount = this.aMachingList[0].getSelectedOptions().length,
		    i;

		var flag = (nCurrentCount >= this.nMaxPossibleSelection);
		this.aMachingList[0].enableUnSelected(!flag);
	};
	
	Maching.prototype._checkAndEnableSubmit = function(p_optionID) {
		var grp1= this.oConnections['1'];
		var grp2= this.oConnections['2'];
		if(grp1.length === grp2.length && grp1.length === this.maxConnections){
			this.enableSubmit(true);
			return;
		}
		this.enableSubmit(false);
	};

	Maching.prototype._evaluate = function() {
		//Logger.logDebug("MCQ._evaluate() | sTrigger = "+ sTrigger);

		this.disableActivity();
		this.enableReset(false);
		var aSelectedOption = [];
		aSelectedOption.push(this.aMachingList[0].getSelectedOptions());
		aSelectedOption.push(this.aMachingList[1].getSelectedOptions());
		
	
		this.enableSubmit(false);
		this.enableReset(true);
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections(aSelectedOption);
		if(!this.isCorrect() && this.bHasShowAns){
			this.$btnShowAns.removeClass('disabled');
		}
		ComponentAbstract.prototype._evaluate.call(this);
	};

	Maching.prototype.getScore = function() {
		var grp1 	= this.oConnections['1'],
			grp2 	= this.oConnections['2'],
			score = 0,i;
		for ( i=0; i < grp1.length; i++) {
			var opt = this.getMatchOptAtIndex(i),
			matchId	= opt.getOptionData().matchId,
			curId	= grp2[i];
	  		//console.log('\tgetScore() | match  for option ' + grp1[i]+'  found '+ opt.getOptionData().matchId);
			if(curId  === matchId){
				score += Number(opt.getScore());
			}
		};
		//console.log('getScore() | score '+score);
		return score;
	};
	
	Maching.prototype.getMatchOptAtIndex = function(p_nIndex) {
		var grp1 	= this.oConnections['1'],
			grp2 	= this.oConnections['2'],
			sId 	=	grp1[p_nIndex],
		  	curId 	= 	grp2[p_nIndex],
		  	matchId, i, j,s,f; 
		  	for (j=0; j < this.aMachingList.length; j++) {
				if(this.aMachingList[j].sGroupID === '1'){
					var aList 	= this.aMachingList[j].getOptionsList();
					for (s =0; s < aList.length; s++) {
					  var opt = aList[s],
					  	optId =	opt.getID();
					  	if(optId === sId){
							matchId =	opt;
					  		//console.log('getMatchIdAtIndex() | match id for option ' + sId+'  is '+ opt.getOptionData().matchId);
							f = true;
							break;					  		
					  	}
					};
					if(f)break;
				}	
			};
			return matchId;
	};
	Maching.prototype.updateScoreAndUserSelections = function(aSelectedOption) {
		//Logger.logDebug("Maching.updateScoreAndUserSelections() | "+aSelectedOption);
		var sfbType = this.oDataModel.getFeedbackType().toUpperCase(),
		    aUserSelections = [],
			score = this.getScore();//(sfbType == "PARAMETERBASEDFEEDBACK") ? oSelectedOption.getParameters() : oSelectedOption.getScore();
			
//			//console.log('updateScoreAndUserSelections() | selection -'+ JSON.stringify(aSelectedOption));
			ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, aSelectedOption);
		oEvent = {
			type : 'SCORE_UPDATE',
			target : this,
			preventDefault : false,
			callback : this.updateHistory,
			args : [aSelectedOption]
		};
		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.updateHistory(aSelectedOption);
		}
	};

	Maching.prototype.updateHistory = function(p_oUserSelections) {
		//Logger.logDebug('Maching.updateHistory() | '+JSON.stringify(p_oUserSelections));
		for (var i = 0; i < p_oUserSelections.length; i++) {
			this.oDataModel.updateFeedbackHistory(p_oUserSelections[i], i);
		}
		this.oDataModel.getFeedback(true);
		var oEvent = {
			type : 'HISTORY_UPDATE',
			target : this,
			preventDefault : false,
			callback : this.processFeedbackPopup,
			args : []
		};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.processFeedbackPopup();
		}
	};

	
	Maching.prototype.getUserSelectedOptionID = function(p_nToggleGroupIndex) {
		var oToggleGroup = this.aMachingList[p_nToggleGroupIndex],
		    oOption = oToggleGroup.getSelectedOptions(),
		    sOptionID = oOption.getID();

		return sOptionID;
	};

	Maching.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
		this.oDataModel.setScore(p_nUserScore);
		this.oDataModel.setUserScores(p_aUserScore);
		this.oDataModel.setUserSelections(p_aUserSelections);
	};

	Maching.prototype.hideTickCross = function() {
		this.$domView.find('#group_1  .display-result').removeClass("correct incorrect");
	};
	
	Maching.prototype.displayTickCross = function() {
		var grp1 	= this.oConnections['1'],
			grp2 	= this.oConnections['2'],
			score = 0,i;
		for ( i=0; i < grp1.length; i++) {
			var opt = this.getMatchOptAtIndex(i);
	  		//console.log('\displayTickCross() | match  for option ' + grp1[i]+'  found '+ opt.getOptionData().matchId);
			if(grp2[i]  === opt.getOptionData().matchId){
				this.$domView.find('#group_1 #checkbox_' +grp1[i]).addClass('correct');
			}else{
				this.$domView.find('#group_1 #checkbox_' +grp1[i]).addClass('incorrect');
			}
		};
		if (this.oDataModel.displayTickCross()) {
			this.$domView.find('#group_1  .correctincorrect').removeClass("hide");
		}
	};
	Maching.prototype.disable = function(p_optionID) {
		//Logger.logDebug('Maching.disable() | '+ p_optionID);
		for (var i = 0; i < this.aMachingList.length; i++) {
			var oMachingToggleGrp = this.aMachingList[i];
			oMachingToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	Maching.prototype.disableActivity = function() {
		for (var i = 0; i < this.aMachingList.length; i++) {
			var oMachingToggleGrp = this.aMachingList[i];
			oMachingToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};
	Maching.prototype.enableActivity = function() {
		for (var i = 0; i < this.aMachingList.length; i++) {
			var oMachingToggleGrp = this.aMachingList[i];
			oMachingToggleGrp.enable(true);
		}
		this.enableSubmit(false);
	};

	Maching.prototype.reset = function() {
		//console.log('reset() | reseting both groups');
		var grp1 = this.oConnections['1'],
		grp2 = this.oConnections['2'],
		i;
		for (i=0; i < grp1.length; i++) {
		  this.removeConnection(grp1[i], '1');
		  i--;
		};
		for (i=0; i < grp2.length; i++) {
		  this.removeConnection(grp2[i], '2');
		  i--;
		};
		this.$domView.find('.connection').empty().removeClass('hide');
		this.$domView.find('.answer').empty().removeClass('hide');
		this.oConnections['1'] = [];
		this.oConnections['2'] = [];
		this.hideTickCross();
		this.resetScore();
		this.resetAttemptNumber();		
		this.enableReset(false);
		this.enableActivity();
		this.$btnShowAns.addClass('disabled hide');
		this.$btnUserAns.addClass('hide');
		if(this.bHasShowAns){
			this.$btnShowAns.removeClass('hide');
		}
		
		this.dispatchEvent('RESET', {type:'RESET', target: this});
	};
	
	Maching.prototype.resetOptions = function() {
		//Logger.logDebug('Maching.resetOptions() | '+this);
		for (var i = 0; i < this.aMachingList.length; i++) {
			var oMachingToggleGrp = this.aMachingList[i];
			oMachingToggleGrp.reset();
			oMachingToggleGrp.enable(true);
		}
		this.getView().find('.display-result').removeClass('correct incorrect');
		this.enableReset(false);
		this.enableSubmit(false);
	};

	Maching.prototype.enableSubmit = function(p_bEnable) {
		if (p_bEnable) {
			this.$btnSubmit.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : false
				/* END - ARIA Implementation */
			});
			this.$btnSubmit.removeAttr("disabled");

		} else {
			this.$btnSubmit.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : true
				/* END - ARIA Implementation */
			});
			this.$btnSubmit.attr("disabled", "true");
		}
		ComponentAbstract.prototype.enableSubmit.call(this, p_bEnable);
	};

	Maching.prototype.setBookmark = function() {
		var aUserSelections = this.oDataModel.getScore().getUserSelections();
		for (var i = 0; i < aUserSelections.length; i++) {
			var oSelection = aUserSelections[i];
			var id = oSelection.optionID;
			var group = oSelection.optionGroupID;

			for (var j = 0; j < this.aMachingList.length; j++) {
				var oToggleGrp = this.aMachingList[j];
				if (oToggleGrp.sGroupID === group) {
					oToggleGrp.setSelectedOption(id);
					break;
				}

			}

		}
	};

	Maching.prototype.enableReset = function(p_bEnable) {
		if (this.oDataModel.getResetBtn() != "true")
			return;
		if (p_bEnable) {
			this.$btnReset.removeClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : false
				/* END - ARIA Implementation */
			});
			this.$btnReset.removeAttr("disabled");
		} else {
			this.$btnReset.addClass('disabled').attr({
				/* START - ARIA Implementation */
				'aria-disabled' : true
				/* END - ARIA Implementation */
			});
			this.$btnReset.attr("disabled", "true");
		}
	};

	Maching.prototype.popupEventHandler = function(e) {
		var sEventType = e.type,
		    oPopup = e.target,
		    sPopupID = oPopup.getID();
		//Logger.logDebug('PageAbstract.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);
		if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
			oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
			oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
			//if (sEventType === 'POPUP_EVENT') {
			//this.enableReset(true);
			PopupManager.closePopup(sPopupID);
			//}
		}
	};

	Maching.prototype.getOptions = function() {
		return this.aMachingList[0].getOptionsList();
	};

	Maching.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) {
		var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));
		oTransitionPopup.setCallback(this, this.checkAndResetOptions);
	};

	Maching.prototype.checkAndResetOptions = function(p_oPopup, p_oArgs) {
		if (this.isAttemptsCompleted()) {
			this.disable();
			this._activityCompleted();
		} else {
			this.resetOptions();
			this.resetScore();
			//this.updateAttempNumber();
		}
		if (this.isCorrect()) {
			this.enableReset(false);
		} else {
			this.enableReset(true);
		}
		ComponentAbstract.prototype.checkAndResetOptions.call(this, p_oArgs);
	};
	
	Maching.prototype.showAnswer = function() {
		var grp1 	= this.oConnections['1'],i;
		this.$domView.find('.connection').addClass('hide');
		for ( i=0; i < grp1.length; i++) {
			var opt 			= this.getMatchOptAtIndex(i),
			optId				= opt.getOptionData().matchId,
			sId					= grp1[i],
			$icon 				= this.$domView.find('#group_1 #checkbox_'+sId+ ' .checkbox-icon');
			var offset1 		= $icon.offset();
			offset1.top 		+= ($icon.height() / 2);
			offset1.left 		+= ($icon.width() / 2);
			
			offset1.top			-= this.$domView.parent().offset().top; 
			offset1.left		-= this.$domView.parent().offset().left;
			 
			
			var $icon2 			= this.$domView.find('#group_2 #checkbox_'+optId+ ' .checkbox-icon'),
			offset2 			= $icon2.offset();
			offset2.top 		+= ($icon2.height() / 2);
			offset2.left 		+= ($icon2.width() / 2);
			offset2.top			-= this.$domView.parent().offset().top; 
			offset2.left		-= this.$domView.parent().offset().left;
			
			var id= '1_'+sId+ '_2_'+opt.getID();		
				
			//console.log('\taddConnection() 	| drawing new connection with id '+ id );
			this.$domView.find('.answer').append(this.addLine(offset1, offset2, id));			

		};
		
		
	};
	
	Maching.prototype.showMyAnswer = function() {
		this.$domView.find('.answer').empty();
		this.$domView.find('.connection').removeClass('hide');		
	};
	/**
	 * Update UI with Response Text
	 * show Continue button if available
	 * Update expression
	 */
	Maching.prototype._setScenarioAndQuestion = function() {
		//Logger.logDebug('Maching._setScenarioAndQuestion() ');
		var oCurrentSet = this.oDataModel.getOptionGroup(),
		    arrPageText = [],
		    $domContainer = "",
		    PageText = this.oDataModel.getPageTexts();
		if (PageText.length > 0) {
			arrPageText = PageText;
		} else {
			arrPageText = [PageText];
		}
		for (var i = 0; i < arrPageText.length; i++) {
			$domContainer = this.getElementByClassName(this.$domView, arrPageText[i]._class);
			$domContainer.html(arrPageText[i].__cdata);
			$domContainer.attr("aria-hidden", "false");
		}
	};

	Maching.prototype.addLine = function(p_oOffset1, p_oOffset2, p_sId) {
		//console.log('addLine() | offset1 '+ p_oOffset1+' | offset2 '+ p_oOffset1+' | id '+p_sId);
		var line = 	'<svg id="'+p_sId+'" height="100%" width="100%" style="position:absolute;">'+
 					'<line x1="'+p_oOffset1.left+'" y1="'+p_oOffset1.top+'" x2="'+p_oOffset2.left+'" y2="'+p_oOffset2.top+'" style="stroke:rgb(0,0,0);stroke-width:2" />'+
					'</svg>';
		return	$(line);
	};
	
	Maching.prototype.removeLine = function($container, p_grpId1, p_sId1, p_grpId2,p_sId2) {
		var id = p_grpId1+ '_'+p_sId1+'_'+p_grpId2+'_'+p_sId2;
		//console.log('removeLine() | id'+ id);
		var svg	= $container.find('#'+ id);
		if(svg.length){
			svg.remove();
		}
	};
	
	Maching.prototype.isSelectionCorrect = function(p_bEnable) {
		return this.oDataModel.isSelectionCorrect();
	};

	Maching.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptnGrpClass) {
		if ($domOptnStmnt.length == 0) {
			Logger.logError('Maching._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
		if ($domOptnStmnt.length > 1) {
			Logger.logError('Maching._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
	};

	Maching.prototype._hasOptionLabel = function($domOptnLbl, sOptnLblClass, j, i) {
		if ($domOptnLbl.length == 0) {
			Logger.logError('Maching._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
		if ($domOptnLbl.length > 1) {
			Logger.logError('Maching._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
	};

	Maching.prototype._hasOptionGroupCotainer = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
		if ($domOptnGrpsCntnr.length == 0) {
			Logger.logError('Maching._populateLayout() | No element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
		if ($domOptnGrpsCntnr.length > 1) {
			Logger.logError('Maching._populateLayout() | More than 1 element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
	};

	Maching.prototype.destroy = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
		this.$btnSubmit.off();

		for (var i = 0; i < this.aMachingList.length; i++) {
			var oMachingToggleGrp = this.aMachingList[i];
			oMachingToggleGrp.destroy();
			oMachingToggleGrp = null;
		}

		this.aMachingList = null;
		this.domTemplate = null;
		this.bFirstTime = null;
		this.currentSetID = null;
		this.$domOptnGrpsCntnr = null;
		this.$btnSubmit = null;
		this.sOptnGrpsCntnrClass = null;
		this.sOptionCls = null;
		this.sOptnTypeCls = null;
		this.sOptionLabelCls = null;
		this.sQuestionCls = null;
		this.sStatementCls = null;
		this.nMaxPossibleScore = null;
		this.oSelectedToggleGrp = null;

		ComponentAbstract.prototype.destroy.call(this);
		this.prototype = null;
	};

	Maching.prototype.toString = function() {
		return 'framework/activity/Maching';
	};

	return Maching;
});
