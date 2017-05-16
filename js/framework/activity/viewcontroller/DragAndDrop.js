define(['jquery', 
		'jqueryui', 
		'jqueryuitouch',
		'framework/utils/globals', 
		'framework/activity/viewcontroller/ActivityAbstract', 
		'framework/activity/TileGroup', 
		'framework/activity/TargetGroup',
		'framework/model/CourseConfigModel', 
		'framework/activity/model/DragAndDropModel', 
		'framework/activity/viewcontroller/Tile', 
		'framework/activity/viewcontroller/Target', 
		'framework/utils/ResourceLoader', 
		'framework/utils/Logger'], 
	function($, jqueryui, jqueryuitouch, Globals, ComponentAbstract, TileGroup, TargetGroup, CourseConfig, DragAndDropModel, Tile, Target, ResourceLoader, Logger) {

	function DragAndDrop() {
		//Logger.logDebug('DragAndDrop.CONSTRUCTOR() ');
		ComponentAbstract.call(this);
		this.aTileList = [];
		this.aTargetList = [];
		
		this.domTileTemplate = null;
		this.domTargetTemplate = null;
		
		this.$domTileGrpsCntnr = null;
		this.$domTargetGrpsCntnr = null;
		
		this.sTileGrpsCntnrClass = "";
		this.sTargetGrpsCntnrClass = "";

		this.sTileCls = "";
		this.sTileTypeCls = "";
		this.sTileLabelCls = "";

		this.sTargetCls = "";
		this.sTargetTypeCls = "";
		this.sTargetLabelCls = "";

		this.nMaxPossibleScore			= 0;
		this.oSelectedTileGrp = {};
		this.oSelectedTargetGrp = {};

		this.sQuestionCls = "";
		this.$btnSubmit = null;
		this.bFirstTime = true;
		this.currentSetID = null;
		this.DragAndDrophandleEvents 	= this._handleEvents.bind(this);
		
		this._handleDropEvent 			= this._handleDropEvent.bind(this);
		this._handDragStartEvent 		= this._handDragStartEvent.bind(this);
		this._handDragStopEvent 		= this._handDragStopEvent.bind(this);

		//Logger.logDebug('DragAndDrop.CONSTRUCTOR() ');
		return this;
	}


	DragAndDrop.prototype = Object.create(ComponentAbstract.prototype);
	DragAndDrop.prototype.constructor = DragAndDrop;
	DragAndDrop.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
		//Logger.logDebug('DragAndDrop.init() | '+p_$domView);
		// ** Calling Super Class "init()" function
		//ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);
		$xmlActivity = p_$xmlActivityNode;
		ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);

	};

	/**
	 * Last edited by : Sachin Tumbre
	 * date: 12/01/2014
	 * Moving activity level logic to 'onModelReady' method
	 */
	DragAndDrop.prototype._createDataModel = function(p_xmlActivityNode) {
		this.oDataModel = new DragAndDropModel(p_xmlActivityNode, this.sGUID, this.sScoringUID);
	};

	DragAndDrop.prototype._populateLayout = function(sExpressionID, sTrigger) {
		var oScope = this, 
		oCurrentTileSet 	= this.oDataModel.getTileGroup(), 
		oCurrentTargetSet 	= this.oDataModel.getTargetGroup(), 
		aTiles 				= oCurrentTileSet.tile, 
		aTargets 			= oCurrentTargetSet.target, 
		$domTileGrpList 	= null, 
		$domTargetGrpList 	= null, 
		aTilesList 			= [],
		aTargetsList 		= [];

		//This is done only once as the
		this.sTileGrpsCntnrClass 	= this.oDataModel.getConfig('tileContainerClass');
		this.sTargetGrpsCntnrClass 	= this.oDataModel.getConfig('targetContainerClass');
		var tileTable = this.$domView.find("." + this.sTileGrpsCntnrClass);
		var targetTable = this.$domView.find("." + this.sTargetGrpsCntnrClass);
		Logger.logDebug('\t this.sTileGrpsCntnrClass = '+this.sTileGrpsCntnrClass +' | this.sTargetGrpsCntnrClass = '+ this.sTargetGrpsCntnrClass);
		if (this.domTileTemplate == null) {
			this.$domTileGrpsCntnr = this.getElementByClassName(this.$domView, this.sTileGrpsCntnrClass);
			//picks up element from dom with same class name as that of the first tile in the current set\
			this.domTileTemplate = this.getElementByClassName(tileTable, oCurrentTileSet._class);
		}
		if (this.domTargetTemplate == null) {
			this.$domTargetGrpsCntnr = this.getElementByClassName(this.$domView, this.sTargetGrpsCntnrClass);
			//picks up element from dom with same class name as that of the first tile in the current set\
			this.domTargetTemplate = this.getElementByClassName(targetTable, oCurrentTargetSet._class);
		}
		/* START - ARIA Implementation */
		this.$domView.attr({
			'role' : 'application',
			'tabindex' : -1
		});

		// ** Check to make sure that an element with the specified Question ID exists in the DOM
		this._hasQuestionContainer(this, this.$domView, this.getQuestionID());

		this.$btnSubmit = $('#' + this.getQuestionID() + '_submit.btn-submit');

		//Validate Submit button
		if (this.$btnSubmit.length === 0) {
			Logger.logError('DragAndDrop._populateLayout() | ERROR: "Submit" button not found. A button with id "' + this.getQuestionID() + '_submit" and class "btn-submit" needs to exist within the Activity container');
		}

		//Initialize Submit Button
		this.$btnSubmit.click(function(e) {
			e.preventDefault();
			if (oScope.isBtnActive(this)) {
				e.type = 'SUBMIT';
				oScope._handleEvents(e);
			}
		});
		this.enableSubmit(false);

		// clear Tile, and  reset current UI
		//Method renamed from show response to question and scenario as needed for DragAndDrop- Bharat
		//this._setScenarioAndQuestion();
		this._populateTileText();
		this._populateTargetText();
		//Since DragAndDrop has only 1 element of UI present in its HTML, We need to replecate the UI depending on the number of tiles in the current Set
		//this._populateTileText();
		// ** DragAndDrop activity loaded
		this.bLoaded = true;
		this.dispatchEvent("ACTIVITY_LOADED", {
			target : this,
			type : 'ACTIVITY_LOADED',
			GUID : this.sGUID,
			eventID : this.sEventID,
			incidentID : this.sIncidentID
		});
		tilesTable = null;
	};

	/**
	 * Update UI with Response Text
	 * show Continue button if available
	 * Update expression
	 */
	DragAndDrop.prototype._setScenarioAndQuestion = function() {
		var oScope = this, oCurrentSet = this.oDataModel.getTileGroup(),
		//sQuestion		= this.oDataModel.getDragAndDropQuestion(oCurrentSet),
		//sStatement				= this.oDataModel.getDragAndDropScenario(oCurrentSet),
		arrPageText = [], $domContainer = "", tilesTable = this.$domView.find("." + oScope.sTileGrpsCntnrClass), PageText = this.oDataModel.getPageTexts();
		if (PageText.length > 0) {
			arrPageText = PageText;
		} else {
			arrPageText = [PageText];
		}
		for (var i = 0; i < arrPageText.length; i++) {
			$domContainer = this.getElementByClassName(oScope.$domView, arrPageText[i]._class);
			$domContainer.html(arrPageText[i].__cdata);
			$domContainer.attr("aria-hidden", "false");
		}

		// Show Continue Button is available instead for Showing next tiles

		tilesTable = null;
		$domContainer = null;
		// //Logger.logDebug("Reset UI End");
	};

	DragAndDrop.prototype._populateTileText = function() {

		//Logger.logDebug("_populateTileText :   : "  );
		var oScope 			= this, 
		oCurrentSet 		= this.oDataModel.getTileGroup(), 
		aTiles 				= oCurrentSet.tile, 
		$domTileGrpList 	= null, 
		tilesTable 			= this.$domView.find("." + oScope.sTileGrpsCntnrClass), 
		$domTileGrpsCntnr 	= this.getElementByClassName(oScope.$domView, oScope.sTileGrpsCntnrClass);

		this.aTilesList = []; 
		var nNumOfTiles = aTiles.length;
		tilesTable.find("." + oCurrentSet._class).remove();
		for (var i = 0; i < nNumOfTiles; i++) {
			//clone and append the template row from the html
			if (this.domTileTemplate != null) {
				tilesTable.append(this.domTileTemplate.clone().attr({
					'title' : "Tile " + (i + 1)
				}));
			}
		};

		// ** Iterarating within the Tile Nodes
		for (var i = 0; i < nNumOfTiles; i++) {
			var oTile 			= aTiles[i], 
			sTileID 			= oTile._id, 
			$domOptnList 		= null, 
			sStatementID 		= 'tilegroup_' + (i + 1) + '_label', 
			nOptnScore 			= Number(oTile._score), 
			aOptnParameters 		= oTile.PARAMETER || null, 
			/* Last edited by: Sachin Tumbre - added support for parameterized feedback */
			sImmediateFeedBack 		= oTile.feedback.content.__cdata, 
			sImmediateFeedBackTitle = oTile.feedback.title.__cdata, 
			sTileLblTxt = oTile.pageText.__cdata;

			// TODO: The if block below can be removed as its not used. Need to check any dependencies and remove it.
			if (!$domTileGrpList) {
				$domTileGrpList = this.getElementByClassName($domTileGrpsCntnr, oCurrentSet.tile[0]._class);
				//Logger.logDebug('############ '+$domTileGrpsCntnr+' : '+oScope.sTileTypeCls);
				// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
				//Logger.logDebug('aTiles.length = '+ aTiles.length+" | $domTileGrpList.length = "+$domTileGrpList.length);
				if (aTiles.length != $domTileGrpList.length) {
					Logger.logError('DragAndDrop._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');
				}
			}

			$domTileGrpPointer 	= $($domTileGrpList[i]);
		var  tileid = 	$domTileGrpPointer.attr('id');
		var pos 		= $domTileGrpPointer.position(); 
		
		//Logger.logDebug('create tile id = '+tileid+ ' | pos = '+ JSON.stringify(pos));
			var $domTileStmnt 	= this.getElementByClassName($domTileGrpPointer, oCurrentSet.tile[0].pageText._class);
			this._hasTileStatement($domTileStmnt, oCurrentSet.tile[0].pageText._class, i, oCurrentSet.tile[0]._class);
			$domTileStmnt.html(sTileLblTxt).attr('id', sStatementID);

			// ** Iterarating within the Tile node for its text and parameters
			//iterating not needed here
			var nTabIndex = (i === 0) ? 0 : -1;
			/* START - ARIA Implementation */
			$domTileGrpPointer.attr({
				'id' : 'tile' + sTileID,
				'aria-labelledby' : sStatementID,
				'role' : 'tile',
				'tabindex' : nTabIndex,
				'data-tileleft' : 'null',
				'data-tiletop' : 'null',
				'data-targetid':'null'
			});
			Logger.logDebug('$domTileGrpPointer  = '+ $domTileGrpPointer.attr('id'));
			var constrainDragIn = this.oDataModel.getConfig('constrainDragIn');
			$domTileGrpPointer.draggable({
				containment: constrainDragIn,
				cursor:'move',
				hoverClass: 'hover',
				revert:'invalid',
				start:oScope._handDragStartEvent
				// revert:oScope._handTileRevertEvent				 				
			});
			
			/* END - ARIA Implementation */
			$domTileGrpPointer.find('.tile-icon').attr('role', 'presentation');
			/* END - ARIA Implementation */

			//feedback can contain any properties
			var oTileData = {
				sImmediateFBTitle : sImmediateFeedBackTitle,
				sImmediateFB : sImmediateFeedBack
			};

			if (this.oDataModel.displayTickCross()) {
				var sTextForTickCross = parseInt(nOptnScore) > 0 ? "correct" : "incorrect";
				$domTileGrpPointer.parent().addClass(sTextForTickCross);
			}

			//Logger.logDebug('DragAndDrop._populateLayout() | DOM Radio '+domOptn+' : ID = '+sTileID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
			var oTile = new Tile($domTileGrpPointer, 
			sTileID, "1", nOptnScore, aOptnParameters, oTileData);
			this.aTilesList.push(oTile);
			
			
		}
		
	
	//	this.createToggleTiles(aTilesList);
		
		
		$domTileGrpList = null;
		tilesTable = null;
		$domTileGrpsCntnr = null;
		$domTileGrpPointer = null;
		$domTileStmnt = null;
	};

	DragAndDrop.prototype.createToggleTiles = function(p_aTilesList) {
		var oScope = this, 
		tileGrp = new TileGroup(p_aTilesList);
		tileGrp.addEventListener('OPTION_SELECT', this.DragAndDrophandleEvents);
		this.aTileList.push(tileGrp);
		this.oSelectedTileGrp = tileGrp;
		//Logger.logDebug("createToggleTiles() this.aTileList : "+this.aTileList);
	};
	
	DragAndDrop.prototype._populateTargetText = function() {

		//Logger.logDebug("_populateTargetText :   : "  );
		var oScope = this, 
		oCurrentSet = this.oDataModel.getTargetGroup(), 
		aTargets = oCurrentSet.target, 
		$domTargetGrpList = null, 
		targetsTable = this.$domView.find("." + oScope.sTargetGrpsCntnrClass), 
		$domTargetGrpsCntnr = this.getElementByClassName(oScope.$domView, oScope.sTargetGrpsCntnrClass);
		this.aTargetList = []; 

		this.nMaxPossibleScore 	= 0;

		var nNumOfTargets = aTargets.length;
		targetsTable.find("." + oCurrentSet._class).remove();
		for (var i = 0; i < nNumOfTargets; i++) {
			//clone and append the template row from the html
			if (this.domTargetTemplate != null) {
				targetsTable.append(this.domTargetTemplate.clone().attr({
					'title' : "Target " + (i + 1)
				}));
			}
		};

		// ** Iterarating within the Target Nodes
		for (var i = 0; i < nNumOfTargets; i++) {
			var oTarget 			= aTargets[i]
			$domTargetGrpPointer  	= null, 
			sTargetID 				= oTarget._id,
			sTileID 				= oTarget._tileID,
			$domOptnList 			= null, 
			sStatementID 			= 'targetgroup_' + (i + 1) + '_label', 
			sTargetLblTxt 			= oTarget.pageText.__cdata;
			nTargetScore 			= Number(oTarget._score);
			
			this.nMaxPossibleScore 		+= nTargetScore;
			// TODO: The if block below can be removed as its not used. Need to check any dependencies and remove it.
			if (!$domTargetGrpList) {
				$domTargetGrpList = this.getElementByClassName($domTargetGrpsCntnr, oCurrentSet.target[0]._class);
				//Logger.logDebug('############ '+$domTargetGrpsCntnr+' : '+oScope.sTargetTypeCls);
				// ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
				//Logger.logDebug('aTargets.length = '+ aTargets.length+" | $domTargetGrpList.length = "+$domTargetGrpList.length);
				if (aTargets.length != $domTargetGrpList.length) {
					Logger.logError('DragAndDrop._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');
				}
			}

			$domTargetGrpPointer 	= $($domTargetGrpList[i]);
			

			var $domTargetStmnt 	= this.getElementByClassName($domTargetGrpPointer, oCurrentSet.target[0].pageText._class);
			this._hasTargetStatement($domTargetStmnt, oCurrentSet.target[0].pageText._class, i, oCurrentSet.target[0]._class);
			$domTargetStmnt.html(sTargetLblTxt).attr('id', sStatementID);

			// ** Iterarating within the Target node for its text and parameters
			//iterating not needed here
			var nTabIndex = (i === 0) ? 0 : -1;
			/* START - ARIA Implementation */
			$domTargetGrpPointer.attr({
				'id' 				: 'target' + sTargetID,
				'aria-labelledby' 	: sStatementID,
				'data-index' 		: String(i),
				'tabindex' 			: nTabIndex,
				'aria-posinset' 	: (i + 1),
				'aria-setsize' 		: nNumOfTargets,
				'data-answer'		: sTileID,
				'data-tileid' 		: 'null'
			});
			Logger.logDebug('$domTargetGrpPointer  = '+ $domTargetGrpPointer.attr('id'));
		
			$domTargetGrpPointer.droppable({
				 drop: oScope._handleDropEvent,
				 accept: '.tile'				 
			});
			/* END - ARIA Implementation */
			$domTargetGrpPointer.find('.target-icon').attr('role', 'presentation');
			/* END - ARIA Implementation */

			//feedback can contain any properties
			var oTargetData = {
				 // sImmediateFBTitle 	: sImmediateFeedBackTitle,
				 // sImmediateFB 		: sImmediateFeedBack,
				 nScore 			: nTargetScore,
				 sAnswer    		: sTileID,
				 sLable 			: sTargetLblTxt,
				 sStatementID       : sStatementID
			};

			if (this.oDataModel.displayTickCross()) {
				var sTextForTickCross = parseInt(nOptnScore) > 0 ? "correct" : "incorrect";
				$domTargetGrpPointer.parent().addClass(sTextForTickCross);
			}

			//Logger.logDebug('DragAndDrop._populateLayout() | DOM Radio '+domOptn+' : ID = '+sTargetID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
			var oTarget = new Target($domTargetGrpPointer[0], sTargetID, "1", oTargetData);
			this.aTargetList.push(oTarget);		

			//nMaxPossibleScore = Math.max(nMaxPossibleScore, nOptnScore);
		}
		this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
		//this.createTargets(aTargetList);

		$domTargetGrpList = null;
		targetsTable = null;
		$domTargetGrpsCntnr = null;
		$domTargetGrpPointer = null;
		$domTargetStmnt = null;
	};
	
	DragAndDrop.prototype.createTargets = function(p_aTargetsList) {
		var oScope = this, 
		targetGrp = new TargetGroup(p_aTargetsList);
		//targetGrp.addEventListener('OPTION_SELECT', this.DragAndDrophandleEvents);
		this.oSelectedTargetGrp = targetGrp;
		//Logger.logDebug("createToggleTargets() this.aTargetList : "+this.aTileList);
	};

	DragAndDrop.prototype._handTileRevertEvent= function(e, ui) {
          $tile =  $(e.target),
           nleft 	= $tile.attr('data-tileleft') ,
			ntop 	= $tile.attr('data-tiletop');
            $tile.data("uiDraggable").originalPosition = {
                top : nleft,
                left : ntop
            };
           // return boolean
           //this._checkAndEnableSubmit();
            return !e;
            // that evaluate like this:
            // return event !== false ? false : true;
	}
	DragAndDrop.prototype._handDragStartEvent= function(e, ui) {
		var $tile =  $(e.target),
		id  	= $tile.attr('id'),
		targetID = $tile.attr('data-targetid');
//		Logger.logDebug('_handDragStartEvent id = '+ id+ ' | targetID = '+ targetID );
		//Reset current target Target 
		if(targetID != 'null'){
			var $target = $('#'+targetID); 
			$target.attr('data-tileid', 'null');
			$tile.attr('data-targetid', 'null');
		}
		
		// set origin position
		if($tile.attr('data-tileleft') == 'null'){
			var tileleft 	= $tile.css('left'),
			tiletop 	= $tile.css('top');
			$tile.attr('data-tileleft' , tileleft)
			$tile.attr('data-tiletop' , tiletop)
		}
		tileleft 	= Number($tile.attr('data-tileleft').split('px')[0]);
		tiletop 	= Number($tile.attr('data-tiletop').split('px')[0]);
		//Logger.logDebug('Original position left = '+ tileleft+ ' | top '+ tiletop);
		 $tile.data("uiDraggable").originalPosition = {
                top : tiletop,
                left : tileleft
           };
		
		$tile.draggable( 'option', 'revert', true );

		this._checkAndEnableSubmit();
	}
	DragAndDrop.prototype._handDragStopEvent= function(e, ui) {
		Logger.logDebug('_handDragStopEvent () '+ ui.draggable.attr('id'))
	}
	DragAndDrop.prototype._handleDropEvent= function(e, ui) {
		e.preventDefault();
		Logger.logDebug('_handleDropEvent '+ ui.draggable.attr("id"));
		var $target 	= $(e.target),
		$tile 			= $(ui.draggable),
		targetID 		= $target.attr('id'),
		tileID 			= $tile.attr('id'),
		sAnswer 		= $target.attr('data-answer'),
		sCurrentTileId 	= $target.attr('data-tileid');
		$currentTile 	= $('#'+sCurrentTileId);
		if(sCurrentTileId != 'null'){
			var left = $currentTile.attr('data-tileleft'),
			top = $currentTile.attr('data-tiletop');
			$currentTile.draggable( 'option', 'revert', true );
			$currentTile.attr('data-targetid', 'null');
			$currentTile.animate({left: left, top:top}, 200 );
		}
		if(tileID != sCurrentTileId){
			$tile.draggable( 'option', 'revert', false );
			$target.attr('data-tileid', tileID);
			$tile.attr('data-targetid', targetID);
			$tile.animate({
				'left': $target.css('left'),
				'top' : $target.css('top')
			},'fast');
		}
		this._checkAndEnableSubmit();
		//Logger.logDebug('_handleDropEvent drop event = '+ tileID+ ' | '+ targetID +' | sAnswer = '+ sAnswer+ ' | left = '+ $tile.css('left')+' | top '+ $tile.css('top')+' | target offset = '+ JSON.stringify($target.offset()));
		
		
		
	}
	


	DragAndDrop.prototype._handleEvents = function(e) {
		//Logger.logDebug("DragAndDrop._handleEvents() | ");
		if ( typeof e.preventDefault == 'function') {
			e.preventDefault();
		}
		var oScope = this;
		var target = e.target, 
		oTile = e.tile, 
		currentTarget = e.currentTarget, 
		type = e.type, oEvent;

		//Logger.logDebug('\tType = '+type+' : Target = '+target);
		switch (type) {
			case 'SUBMIT':
				oEvent = $.extend({}, e, {
					oScope : oScope,
					target : this,
					tileGroup : target
				});
				this._evaluate('SUBMIT');
				this.dispatchEvent('SUBMIT', oEvent);
				break;
		}
	};

	DragAndDrop.prototype._checkAndEnableSubmit = function() {
		//Logger.logDebug(' _checkAndEnableSubmit() this.aTargetList length  = '+  this.aTargetList.length );
		for (var i = 0; i < this.aTargetList.length; i++) {
			var $target = this.aTargetList[i].$domOption;
			Logger.logDebug(' checkAndEnableSubmit this.aTargetList[i] Target = '+  $target.attr("id")+ ' | tile id = '+$target.attr("data-tileid"));
			if ($target.attr('data-tileid') == 'null') {
				this.enableSubmit(false);
				return;
			}
		}
		this.enableSubmit(true);
	};

	DragAndDrop.prototype._evaluate = function() {
		var bCorrect 	= true,
		aSelection 		= [],
		nScore 			= 0;
		for (var i = 0; i < this.aTargetList.length; i++) {
			var oTarget = this.aTargetList[i],
			optionData  = oTarget.getOptionData(),
			$target 	= oTarget.$domOption,
			sCurTileID 	= $target.attr("data-tileid");
			
			aSelection.push({targetID:oTarget.getID(), tileID:sCurTileID});
			
			/* EDITED BY TANMAY FOR MULTIPLE CORRECT DROPS */
			//alert(optionData.sAnswer +"="+ sCurTileID);
			
			//optionData.sAnswer = "tile1-tile2-tile3" for multiple correct answers
			//<target id="3" class="target" tileID="tile1-tile3-tile4" score="1">
			
			var multiCorrect = optionData.sAnswer.indexOf("-");
			//alert(multiCorrect);
			if(multiCorrect >= 0){
			var hasDroppedCorrect = optionData.sAnswer.indexOf(sCurTileID);
				if(hasDroppedCorrect >= 0){
					nScore += optionData.nScore;
					//alert("nScore 1: "+ nScore);
			}
			
			}
			else{
				if(optionData.sAnswer === sCurTileID){
					nScore += optionData.nScore;
					//alert("nScore 2: "+ nScore);
				}	
			}		
		}
		//alert("nMaxPossibleScore "+this.nMaxPossibleScore);
		/* END OF EDIT */
		
		this.oDataModel.setMaxPossibleScore(1);
		if(nScore == this.nMaxPossibleScore){
			nScore = 1
		}else{
			nScore = 0
		}
		this.oDataModel.updateAttempNumber();
		this.updateScoreAndUserSelections(aSelection, nScore);
		//this.disableActivity();
		//this.enableSubmit(false);
	
	};

	DragAndDrop.prototype.updateScoreAndUserSelections = function(p_aSelection, p_nscore) {
	
		var score = p_nscore;
		oScope = this, 
		oEvent = {
			type : 'SCORE_UPDATE',
			target : oScope,
			preventDefault : false,
			callback :null,
			args : []
		};

		ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, p_nscore, p_aSelection);

		this.dispatchEvent('SCORE_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.updateHistory(p_aSelection);
		}
	};

	/**
	 *  Last updated- Sachin tumbre(12/22/2014) added loop feedbacks in history
	 */
	DragAndDrop.prototype.updateHistory = function(p_aSelectedTile) {
		for (var i = 0; i < p_aSelectedTile.length; i++) {
			this.oDataModel.updateFeedbackHistory(p_aSelectedTile[i], i);
		}
		this.oDataModel.getFeedback(true);
		var oScope = this, oEvent = {
			type : 'HISTORY_UPDATE',
			target : oScope,
			preventDefault : false,
			callback : oScope.processFeedbackPopup,
			args : []
		};

		this.dispatchEvent('HISTORY_UPDATE', oEvent);
		if (!oEvent.preventDefault) {
			this.processFeedbackPopup();
		}
	};

	DragAndDrop.prototype.processFeedbackPopup = function() {
		var oScope = this, oFeedback = this.getFeedback(), sFeedbackTitle = oFeedback.getTitle(), sFeedback = oFeedback.getContent(), oTransitionPopup, oEvent = {
			target : oScope,
			popup : oTransitionPopup
		};

		//Logger.logDebug("DragAndDrop.processFeedbackPopup() | \n\tShowFeedbackPopup = "+this.oDataModel.isShowFeedbackPopup());
		if (this.oDataModel.isShowFeedbackPopup()) {
			oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));
			oTransitionPopup.setCallback(this, this.checkAndResetTiles);

		} else {
			this.checkAndResetTiles();
		}
		this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
		//this.checkAndResetTiles();
	};

	// ** TODO: Check with Bharat if the method below is used or else remove it
	DragAndDrop.prototype.getUserSelectedTileID = function(p_nToggleGroupIndex) {
		var oToggleGroup = this.aTileList[p_nToggleGroupIndex], oTile = oToggleGroup.getSelectedTile()[0], sTileID = oTile.getID();

		return sTileID;
	};

	// ** TODO: Check with Bharat if the method below is used or else remove it
	DragAndDrop.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
		this.oDataModel.setScore(p_nUserScore);
		this.oDataModel.setUserScores(p_aUserScore);
		this.oDataModel.setUserSelections(p_aUserSelections);
	};

	DragAndDrop.prototype.disable = function(p_tileID) {
		//Logger.logDebug('DragAndDrop.disable() | '+ p_tileID);
		for (var i = 0; i < this.aTileList.length; i++) {
			var oDragAndDropToggleGrp = this.aTileList[i];
			oDragAndDropToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	DragAndDrop.prototype.disableActivity = function() {
		//Logger.logDebug('DragAndDrop.disableActivity'+ this.aTileList.length);
		for (var i = 0; i < this.aTileList.length; i++) {
			var oDragAndDropToggleGrp = this.aTileList[i],
			$tile = oDragAndDropToggleGrp.$domOption;
			$tile.draggable('disable');
			
			oDragAndDropToggleGrp.enable(false);
		}
		this.enableSubmit(false);
	};

	DragAndDrop.prototype.resetTiles = function() {
		//Logger.logDebug('DragAndDrop.resetTiles() | '+this);
		for (var i = 0; i < this.aTileList.length; i++) {
			var oDragAndDropToggleGrp = this.aTileList[i],
			$tile 		= oDragAndDropToggleGrp.$domOption,
			tileleft 		= $tile.attr('data-tileleft'),
			tiletop 		= $tile.attr('data-tiletop');
			$tile.css({
				left:tileleft,
				top:tiletop
			})
			$tile.draggable('enable');
			oDragAndDropToggleGrp.enable(true);
			oDragAndDropToggleGrp.reset();
		}
		this.enableSubmit(false);
	};

	DragAndDrop.prototype.enableSubmit = function(p_bEnable) {
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
	};

	DragAndDrop.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) {
		var oTransitionPopup = this.openPopup('feedback', sFeedbackTitle, sFeedback, $('.btn-submit'));
		oTransitionPopup.setCallback(this, this.checkAndResetTiles);
	};

	DragAndDrop.prototype.checkAndResetTiles = function(e) {
		//Logger.logDebug("DragAndDrop.checkAndResetTiles() | \n\tis Attempts Completed = "+this.isAttemptsCompleted());
		if (this.isAttemptsCompleted()) {
			this._activityCompleted();
		} else {
			this.resetTiles();
			this.resetScore();
			//this.updateAttempNumber();
		}
	};

	DragAndDrop.prototype.isSelectionCorrect = function(p_bEnable) {
		return this.oDataModel.isSelectionCorrect();
	};

	DragAndDrop.prototype._hasTileStatement = function($domTileStmnt, sStmntClass, i, sOptnGrpClass) {
		if ($domTileStmnt.length == 0) {
		//	Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
		if ($domTileStmnt.length > 1) {
			//Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
	};

	DragAndDrop.prototype._hasTileLabel = function($domOptnLbl, sOptnLblClass, j, i) {
		if ($domOptnLbl.length == 0) {
			//Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
		if ($domOptnLbl.length > 1) {
		//	Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
	};

	DragAndDrop.prototype._hasTileGroupCotainer = function($domTileGrpsCntnr, sTileGrpsCntnrClass, sQuestionID) {
		if ($domTileGrpsCntnr.length == 0) {
			// Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sTileGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
		if ($domTileGrpsCntnr.length > 1) {
			// Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sTileGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
	};
	
	DragAndDrop.prototype._hasTargetStatement = function($domTargetStmnt, sStmntClass, i, sOptnGrpClass) {
		if ($domTargetStmnt.length == 0) {
		//	Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
		if ($domTargetStmnt.length > 1) {
			//Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
		}
	};

	DragAndDrop.prototype._hasTargetLabel = function($domOptnLbl, sOptnLblClass, j, i) {
		if ($domOptnLbl.length == 0) {
			//Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
		if ($domOptnLbl.length > 1) {
		//	Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
		}
	};

	DragAndDrop.prototype._hasTargetGroupCotainer = function($domTargetGrpsCntnr, sTargetGrpsCntnrClass, sQuestionID) {
		if ($domTargetGrpsCntnr.length == 0) {
			// Logger.logError('DragAndDrop._populateLayout() | No element with class "' + sTileGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
		if ($domTargetGrpsCntnr.length > 1) {
			// Logger.logError('DragAndDrop._populateLayout() | More than 1 element with class "' + sTileGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
		}
	};

	DragAndDrop.prototype.destroy = function() {
		this.$btnSubmit.off();
		for (var i = 0; i < this.aTileList.length; i++) {
			var tileGrp = this.aTileList[i];
			tileGrp.destroy();
		}

		this.oIncidentController
		this.aTileList = null;
		this.aTargetList = null;
		this.domTileTemplate = null;
		this.domTargetTemplate = null;
		this.bFirstTime = null;
		this.currentSetID = null;
		this.$domTileGrpsCntnr = null;
		this.$domTargetGrpsCntnr = null;
		this.$btnSubmit = null;
		this.sTileGrpsCntnrClass = null;
		this.sTargetGrpsCntnrClass = null;
		this.sTileCls = null;
		this.sTargetCls = null;
		this.sTileTypeCls = null;
		this.sTargetTypeCls = null;
		this.sTileLabelCls = null;
		this.sTargetLabelCls = null;
		this.sQuestionCls = null;
		this.sStatementCls = null;
		this.oSelectedTileGrp = null;
		this.oSelectedTargetGrp = null;

		ComponentAbstract.prototype.destroy.call(this);
		this.prototype = null;
	};
	DragAndDrop.prototype.getQuestionID					= function(){
		return this.oDataModel.getDragDropID();
	};
	
	DragAndDrop.prototype.toString = function() {
		return 'framework/activity/DragAndDrop';
	};

	return DragAndDrop;
});
