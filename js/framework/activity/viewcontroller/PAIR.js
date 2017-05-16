define([
    'jquery',
    'framework/utils/globals',
    'framework/activity/viewcontroller/ActivityAbstract',
    'framework/activity/ToggleGroup',
    'framework/model/CourseConfigModel',
    'framework/activity/model/PAIRModel',
    'framework/activity/viewcontroller/Option',
    'framework/utils/ResourceLoader',
    'framework/utils/Logger',
    'libs/jquery.jsPlumb-1.3.13-all-min'
], function($, Globals, ComponentAbstract, ToggleGroup, CourseConfig, PAIRModel, Option, ResourceLoader, Logger) {

    function PAIR() {
        //Logger.logDebug('PAIR.CONSTRUCTOR() ');
        ComponentAbstract.call(this);
        this.analogousPairObj;
        this.oIncidentController;
        this.aPAIRList = [];
        this.domTemplate = null;
        this.bFirstTime = true;
        this.currentSetID = null;
        this.$domOptnGrpsCntnr = null;
        this.$btnSubmit = null;
        this.sOptnGrpsCntnrClass = "";
        this.sOptionCls = "";
        this.sOptnTypeCls = "";
        this.sOptionLabelCls = "";
        this.sQuestionCls = "";
        this.sStatementCls = "";
        //this.nMaxPossibleScore			= 0;
        this.oSelectedToggleGrp = {};


        //Logger.logDebug('PAIR.CONSTRUCTOR() ');
        return this;
    }
    var options = [], // list of option identifier
            solution, // correct solution index
            response = [], // user's response index
            lastResponse = [], // array to hold last responses
            points = 0, // score to user's response
            totalPoints = 0, // holds total points
            correctCount = 0, // counter for correct answers
            incorrectCount = 0, // counter for incorrect answers
            status = null, // to hold the status
            numberOfAttempt = 0,
            totalNumberOfAttempts,
            uiMananagerForFeedbackPopup,
            arrFeedbacks,
            self = this;					// A reference to 'self' to get around scope related issue //  while working with inner-functions
    var pairYPositionCollection = new Array();
    var bothSideSelectionArray = new Array();
    var jumbleArray = new Array();
    var userAnswerCollection = new Array();
    var lastSelected, // array of references last selected response
//    that=this,
            totalOptionsCollection,
            totalPairCollection,
            totalDividerCollection,
            activityCompleted,
            mode = 'edit';							// editable or Readonly state ?

    PAIR.prototype = Object.create(ComponentAbstract.prototype);
    PAIR.prototype.constructor = PAIR;
    PAIR.prototype.init = function(p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation) {
        //Logger.logDebug('PAIR.init() | '+p_$domView);
        // ** Calling Super Class "init()" function
        //ComponentAbstract.prototype.init.call(this, p_xmlActivityNode, p_$domView);

        $xmlActivity = p_$xmlActivityNode;
        ComponentAbstract.prototype.init.call(this, p_$xmlActivityNode, p_$domView, p_sGUID, p_sScoringUID, p_bIsSimulation);
        ;
//        this.analogousPairObj = new Analogous_Pair();
//        this.analogousPairObj.init();

        var tempTotalOptionsCollection;
        var tempTotalPairCollection;
        //
        tempTotalOptionsCollection = $(".leftOptionUp");
        tempTotalPairCollection = $(".pairOptionUp");
        totalNumberOfAttempts = this.oDataModel.oDataModel._totalAttempts;
        //-----------------------------------------------------------
        //Cleaning unwanted Divs
        //-----------------------------------------------------------
        for (var i = 0; i < tempTotalOptionsCollection.length; i++)
        {
            $("#option" + (i + 1)).removeClass("hidden");
            if ($("#option" + (i + 1)).text().length == 0) {
                $("#option" + (i + 1)).remove();
                $("#divider" + (i + 1)).remove();
            } else {
                $("#option" + (i + 1)).wrapInner('<td valign="middle"></td>');
                $("#option" + (i + 1)).wrapInner('<tr></tr>');
                $("#option" + (i + 1)).wrapInner('<table id="innerTable" align="center" border="0" cellspacing="0" cellpadding="0" style="width:90%; height:100%; margin-left:5%;"></table>');
            }
        }
        //

        //
        for (var i = 0; i < tempTotalPairCollection.length; i++)
        {
            $("#pair" + (i + 1)).removeClass("hidden");
            if ($("#pair" + (i + 1)).text().length == 0) {
                $("#pair" + (i + 1)).remove();
            } else {
                $("#pair" + (i + 1)).wrapInner('<td valign="middle"></td>');
                $("#pair" + (i + 1)).wrapInner('<tr></tr>');
                $("#pair" + (i + 1)).wrapInner('<table id="innerTable" align="center" border="0" cellspacing="0" cellpadding="0" style="width:90%; height:100%; margin-left:5%;"></table>');
            }
        }
        //-----------------------------------------------------------
        //Regestering Final Divs
        //-----------------------------------------------------------
        totalOptionsCollection = $(".leftOptionUp");
        totalPairCollection = $(".pairOptionUp");

        if (tempTotalPairCollection.length > 4) {
            min_height = parseInt($("." + this.sOptnGrpsCntnrClass).css("min-height"), 10) + ((tempTotalPairCollection.length - 4) * 30);
            $("." + this.sOptnGrpsCntnrClass).css("min-height", min_height);
        }
        if (totalOptionsCollection.length != totalPairCollection.length || totalPairCollection.length < 2 || totalPairCollection.length > 10)
        {
            alert("ERROR! \n\nYou have not mentioned correct number of matching pair for both the sides. \nIn a Analogous Pairing template you need to mention same number of options for both the side and minimum of 2 options and maximum of 8 options.\n\n" + "Left Side: " + totalOptionsCollection.length + " Right Side: " + totalPairCollection.length)
        }


        //
        //updateHeadingAlignment();
        //updatesubmitResetButtonAlignment();

        //
        this.sizeObjectsWithMaxHeight()
        //-----------------------------------------------------------
        //Calling For Alignment
        //-----------------------------------------------------------
        this.AlignPairGroup();
        //-----------------------------------------------------------
        //disableReset();
        this.enableSubmit(false);
    };

    PAIR.prototype.AlignPairGroup = function()
    {
        //-----------------------------------------------------------
        //Align Left Objects
        //-----------------------------------------------------------
        var optionY = 0;
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            if (i > 0) {
                $("#option" + (i + 1)).offset({top: optionY});
            }
            optionY = $("#option" + (i + 1)).offset().top + $("#option" + (i + 1)).height() + 5;
        }
        //-----------------------------------------------------------
        //Align Pair Objects
        //-----------------------------------------------------------
        var optionY = 0;
        pairYPositionCollection.push($("#option1").offset().top);
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            if (i > 0) {
                $("#pair" + (i + 1)).offset({top: optionY});
                pairYPositionCollection.push(optionY);
            }
            optionY = $("#pair" + (i + 1)).offset().top + $("#pair" + (i + 1)).height() + 5;
            //pairYPositionCollection.push($("#pair"+(i+1)).offset().top);
        }
        //-----------------------------------------------------------
        //Align Divider Objects
        //-----------------------------------------------------------

        //-----------------------------------------------------------
        //Call toJumble the Pairs
        //-----------------------------------------------------------
        this.jumblePairGroup();
    }

    PAIR.prototype.jumblePairGroup = function() {
        var totalPairToRandom = totalPairCollection.length
        while (jumbleArray.length < totalPairToRandom) {
            var randomNum = Math.ceil(Math.random() * totalPairToRandom);
            if ($.inArray(randomNum, jumbleArray) == -1) {
                jumbleArray.push(randomNum)
            }

        }
        for (var i = 0; i < jumbleArray.length; i++) {
            $("#pair" + (jumbleArray[i])).offset({top: pairYPositionCollection[i]});//css("top",pairYPositionCollection[i]);//css("top",pairYPositionCollection[i]);
            pairYPositionCollection[i] = {"obj": jumbleArray[i], "ypos": pairYPositionCollection[i]};
        }
        //-----------------------------------------------------------
        //Calling For Event Assignment
        //-----------------------------------------------------------
        this.assignOptionsEvent();
        this.assignPairEvent();
        //-----------------------------------------------------------
        //YPairPositionRealignment();
    }
    PAIR.prototype.assignOptionsEvent = function()
    {
        var anyOptionLeft = false;
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            var that = this;
            if ($("#option" + (i + 1)).hasClass("ui-activity-button-over") == false) {
                anyOptionLeft = true;
                $("#option" + (i + 1)).css("cursor", "pointer");
                $("#option" + (i + 1)).unbind("click").bind("click", function(e) {
                    that.removeOptionsEvent();
                    $(this).removeClass("ui-activity-button-up").addClass("ui-activity-button-over");
                    //removePreviousConnection($(this))
                    bothSideSelectionArray.push($(this))
                    that.checkForUserResponse();
                    e.stopPropagation();
                });


                $("#option" + (i + 1)).bind("mouseover", function(e) {
                    $(this).removeClass("ui-activity-button-up").addClass("ui-activity-button-over");
                });

                $("#option" + (i + 1)).bind("mouseout", function(e) {
                    $(this).removeClass("ui-activity-button-over").addClass("ui-activity-button-up");
                });

            }
        }
        if (!anyOptionLeft) {
            activityCompleted = true;
            this.enableSubmit(true);
        } else {
            this.enableSubmit(false);
        }
    }
    PAIR.prototype.checkForUserResponse = function() {
        if (bothSideSelectionArray.length >= 2) {
            //
            if (bothSideSelectionArray[0].attr("id").indexOf("pair") > -1) {
                this.createConnection(bothSideSelectionArray[0], bothSideSelectionArray[1]);
            } else {
                this.createConnection(bothSideSelectionArray[1], bothSideSelectionArray[0]);
            }
            userAnswerCollection.push(bothSideSelectionArray);
            bothSideSelectionArray = new Array();
            this.assignOptionsEvent();
            this.assignPairEvent();
            //enableReset();
        }
    }
    PAIR.prototype.createConnection = function(source, target) {
        if (this.isAttemptsCompleted()) {
            var colorVal = "rgb(0,110,21)"
        } else {
            var colorVal = "rgb(131,8,135)"
        }
        jsPlumb.connect({
            source: source,
            target: target,
            anchors: ["LeftMiddle", "RightMiddle"],
            paintStyle: {lineWidth: 1, strokeStyle: colorVal},
            hoverPaintStyle: {strokeStyle: colorVal},
            endpointStyle: {width: 15, height: 15},
            endpoints: ["Rectangle", "Rectangle"],
            connector: "Straight"
        });
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            $("#pair" + (i + 1)).css("z-index", (i + 1000));
            $("#option" + (i + 1)).css("z-index", (i + 2000));
        }
    }
    PAIR.prototype.removeOptionsEvent = function()
    {
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            $("#option" + (i + 1)).css("cursor", "default");
            $("#option" + (i + 1)).unbind("click");
            $("#option" + (i + 1)).unbind("mouseover");
            $("#option" + (i + 1)).unbind("mouseout");
        }
    }
    PAIR.prototype.assignPairEvent = function()
    {
        var anyOptionLeft = false;
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            var that = this;
            if ($("#pair" + (i + 1)).hasClass("ui-activity-button-over") == false) {
                anyOptionLeft = true;
                $("#pair" + (i + 1)).css("cursor", "pointer");
                $("#pair" + (i + 1)).unbind("click").bind("click", function(e) {
                    that.removePairEvent();
                    $(this).removeClass("ui-activity-button-up").addClass("ui-activity-button-over");
                    //removePreviousConnection($(this));
                    bothSideSelectionArray.push($(this))
                    that.checkForUserResponse();
                    e.stopPropagation();
                });


                $("#pair" + (i + 1)).bind("mouseover", function(e) {
                    $(this).removeClass("ui-activity-button-up").addClass("ui-activity-button-over");
                });

                $("#pair" + (i + 1)).bind("mouseout", function(e) {
                    $(this).removeClass("ui-activity-button-over").addClass("ui-activity-button-up");
                });


            }
        }
        if (!anyOptionLeft) {
            activityCompleted = true;
            this.enableSubmit(true);
        } else {
            this.enableSubmit(false);
        }
    }
    PAIR.prototype.removePairEvent = function()
    {
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            $("#pair" + (i + 1)).css("cursor", "default");
            $("#pair" + (i + 1)).unbind("click");
            $("#pair" + (i + 1)).unbind("mouseover");
            $("#pair" + (i + 1)).unbind("mouseout");
        }
    }
    PAIR.prototype.sizeObjectsWithMaxHeight = function() {
        //-----------------------------------------------------------
        //Get Max Div Height
        //-----------------------------------------------------------
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            $("#option" + (i + 1)).css("height", 20);
        }
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            //$("#pair"+(i+1)).height(maxHeight);
            $("#pair" + (i + 1)).css("height", 20);
        }

        var optionHeights = $(".leftOptionUp").map(function() {
            return $(this).height();
        }).get(), maxHeight = Math.max.apply(null, optionHeights);
        var maxOptionHeight = Math.max.apply(this, optionHeights);
        var pairHeights = $(".pairOptionUp").map(function() {
            return $(this).height();
        }).get(), maxHeight = Math.max.apply(null, pairHeights);
        var maxPairHeight = Math.max.apply(this, pairHeights);
        var maxHeight;
        if (maxOptionHeight > maxPairHeight) {
            maxHeight = maxOptionHeight;
        } else {
            maxHeight = maxPairHeight;
        }
        if (maxHeight < 30) {
            maxHeight = 30;
        }
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            $("#option" + (i + 1)).css("height", maxHeight);
            $(("#option" + (i + 1) + " #innerTable")).css("height", maxHeight);
        }
        for (var i = 0; i < totalPairCollection.length; i++)
        {
            //$("#pair"+(i+1)).height(maxHeight);
            $("#pair" + (i + 1)).css("height", maxHeight);
            $(("#pair" + (i + 1) + " #innerTable")).css("height", maxHeight);
        }

        if ($("#pairHeading").height() <= $("#optionHeading").height()) {
            $("#pairHeading").height($("#optionHeading").height())
        }
    }
    PAIR.prototype._createDataModel = function(p_xmlActivityNode) {
        this.oDataModel = new PAIRModel(p_xmlActivityNode,  this.sGUID, this.sScoringUID);

        /*** Listener to the DATA MODEL can be added here to listen to Model updates ***/
        /*this.oDataModel.addEventListener('UPDATE', function(e){
         oScope.handleModelUpdates(e);
         });*/
    };

    /*** Model updates Handler to be used if required ***/
    /*PAIR.prototype.handleModelUpdates					= function(e){

     };*/

    PAIR.prototype._populateLayout = function(sExpressionID, sTrigger) {
        //Logger.logDebug('PAIR.populateLayout() | ');
        //aOptions, domPAIRTable, sStatementID, $domOptnGrpList, $domOptnGrpsCntnr, sOptnTypeCls, sOptionLabelCls, aOptionsList
        var oScope = this,
            oCurrentSet = this.oDataModel.getOptionGroup(),
            aOptions = oCurrentSet.option,
            $domOptnGrpList = null,
            aOptionsList = [],
            sQuestionID 	= this.oDataModel.getQuestionID();

        //Moved here from init
        //Option group specific, class may vary

        //This is done only once as the
        this.sOptnGrpsCntnrClass 	= this.oDataModel.geConfig('class');
        var domPAIRTable = this.$domView.find("." + this.sOptnGrpsCntnrClass);
        //Logger.logDebug('\tsOptnGrpsCntnrClass = '+this.sOptnGrpsCntnrClass);
        if (this.domTemplate == null) {
            this.$domOptnGrpsCntnr = this.getElementByClassName(this.$domView, this.sOptnGrpsCntnrClass);
            //picks up element from dom with same class name as that of the first option in the current set\
            this.domTemplate = this.getElementByClassName(domPAIRTable, oCurrentSet._class);
        }
        /* START - ARIA Implementation */
        this.$domView.attr({
            'role': 'application',
            'tabindex': -1
        });

        // ** Check to make sure that an element with the specified Question ID exists in the DOM
        this._hasQuestionContainer(this, this.$domView, sQuestionID);

        this.$btnSubmit = $('#' + sQuestionID + '_submit.btn-submit');
        //Validate Submit button
        if (this.$btnSubmit.length === 0) {
            Logger.logError('PAIR._populateLayout() | ERROR: "Submit" button not found. A button with id "' + sQuestionID + '_submit" and class "btn-submit" needs to exist within the Activity container');
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

        // clear Option, and  reset current UI
        //Method renamed from show response to question and scenario as needed for PAIR- Bharat
        //this._setScenarioAndQuestion();
        this._populateOptionText();
        //Since PAIR has only 1 element of UI present in its HTML, We need to replecate the UI depending on the number of options in the current Set
        //this._populateOptionText();
        // ** PAIR activity loaded
        this.bLoaded = true;
        this.dispatchEvent("ACTIVITY_LOADED", {target: this, type: 'ACTIVITY_LOADED', GUID: this.sGUID, eventID: this.sEventID, incidentID: this.sIncidentID});

        domPAIRTable = null;
    };


    /**
     * Update UI with Response Text
     * show Continue button if available
     * Update expression
     */
    PAIR.prototype._setScenarioAndQuestion = function() {
        var oScope = this,
                oCurrentSet = this.oDataModel.getOptionGroup(),
                //sQuestion				= this.oDataModel.getPAIRQuestion(oCurrentSet),
                //sStatement				= this.oDataModel.getPAIRScenario(oCurrentSet),
                arrPageText = [],
                $domContainer = "",
                domPAIRTable = this.$domView.find("." + oScope.sOptnGrpsCntnrClass),
                PageText = this.oDataModel.getPageTexts();
        if (PageText.length > 0) {
            arrPageText = PageText;
        }
        else {
            arrPageText = [PageText];
        }
        for (var i = 0; i < arrPageText.length; i++) {
            $domContainer = this.getElementByClassName(this.$domView, arrPageText[i]._class);
            $domContainer.html(arrPageText[i].__cdata);
            $domContainer.attr("aria-hidden", "false");
        }

        // Show Continue Button is available instead for Showing next options

        domPAIRTable = null;
        $domContainer = null;
        // //Logger.logDebug("Reset UI End");
    };

    PAIR.prototype._populateOptionText = function() {
        //Logger.logDebug("_populateOptionText :   : "  );
        var oScope = this,
            oCurrentSet = this.oDataModel.getOptionGroup(),
            aOptions = oCurrentSet.option,
            sStatementID = '',
            $domOptnGrpList = null,
            nMaxPossibleScore = 0,
            //nMaxPossibleScore	= this.oDataModel.getMaxPossibleScore(),
            aOptionsList = [],
            domPAIRTable = this.$domView.find("." + oScope.sOptnGrpsCntnrClass),
            $domOptnGrpsCntnr = this.getElementByClassName(this.$domView, oScope.sOptnGrpsCntnrClass);

        var nNumOfOptions = aOptions.length;
        domPAIRTable.find("." + oCurrentSet._class).remove();
        for (var i = 0; i < nNumOfOptions; i++) {
            //clone and append the template row from the html
            if (this.domTemplate != null) {
                domPAIRTable.append(this.domTemplate.clone().attr({
                    'role': 'link',
                    'aria-labelledby': sStatementID,
                    /*'tabindex'					: ""+(i+11),*/
                    'title': "Option " + (i + 1)
                            /*'aria-activedescendant'		: 'rg1-r4'*/
                }));


            }
            var oOption = aOptions[i];
            id = oOption._id.split('_');
            if (id[0] == "option") {
                $("." + oCurrentSet._class + ":eq(" + i + ")").addClass("leftOptionUp").attr("id", "option" + id[1]);
            }
            else {
                $("." + oCurrentSet._class + ":eq(" + i + ")").addClass("pairOptionUp").attr("id", "pair" + id[1]);

            }
        };


        // ** Iterarating within the Option Nodes
        for (var i = 0; i < nNumOfOptions; i++) {
            var oOption = aOptions[i],
                    sOptnID = oOption._id,
                    $domOptnList = null,
                    sStatementID = oOption._id,
                    nOptnScore = Number(oOption._score),
                    aOptnParameters = oOption.parameter,
                    sImmediateFeedBack = oOption.feedback.content.__cdata,
                    sImmediateFeedBackTitle = oOption.feedback.title.__cdata,
                    sOptnLblTxt = oOption.pageText.__cdata;

            // TODO: The if block below can be removed as its not used. Need to check any dependencies and remove it.

            if (!$domOptnGrpList) {
                $domOptnGrpList = this.getElementByClassName($domOptnGrpsCntnr, oCurrentSet.option[0]._class);
                //Logger.logDebug('############ '+$domOptnGrpsCntnr+' : '+oScope.sOptnTypeCls);
                // ** Check if the number of XML nodes for Radio Containers are Equal to the Number of Radio Containers in the DOM
                //Logger.logDebug('aOptions.length = '+ aOptions.length+" | $domOptnGrpList.length = "+$domOptnGrpList.length);
                if (aOptions.length != $domOptnGrpList.length) {
                    Logger.logError('PAIR._populateLayout() | Number of Radio Containers in the XML dont Match with the DOM');
                }
            }

            $domOptnGrpPointer = $($domOptnGrpList[i]);

            var $domOptnStmnt = this.getElementByClassName($domOptnGrpPointer, oCurrentSet.option[0].pageText._class);
            this._hasOptionStatement($domOptnStmnt, oCurrentSet.option[0].pageText._class, i, oCurrentSet.option[0]._class);
            $domOptnStmnt.html(sOptnLblTxt).attr('id', sStatementID);
            // ** Iterarating within the Option node for its text and parameters
            //iterating not needed here
            var nTabIndex = (i === 0) ? 0 : -1;
            /* START - ARIA Implementation */
            $domOptnGrpPointer.attr({
                'id': 'radio_' + sOptnID,
                'role': 'radiogroup',
                'aria-labelledby': sStatementID,
                'data-index': String(i),
                'aria-checked': 'false',
                'role'						: 'radio',
                        'tabindex': nTabIndex,
                'aria-posinset': (i + 1),
                'aria-setsize': nNumOfOptions
            });
            /* END - ARIA Implementation */
            $domOptnGrpPointer.find('.radio-icon').attr('role', 'presentation');
            /* END - ARIA Implementation */

            //feedback can contain any properties
            var oOptionData = {
                sImmediateFBTitle: sImmediateFeedBackTitle,
                sImmediateFB: sImmediateFeedBack,
            };


            //Logger.logDebug('PAIR._populateLayout() | DOM Radio '+domOptn+' : ID = '+sOptnID+' : Group ID = '+sOptnGrpID+' : Score = '+nOptnScore+' Params = '+aOptnParameters);
            var oOptn = new Option($domOptnGrpPointer, sOptnID, "1", nOptnScore, aOptnParameters, oOptionData);
            aOptionsList.push(oOptn);
            $domOptnStmnt.on('click', function(e) {
                e.preventDefault();
            });
            nMaxPossibleScore = Math.max(nMaxPossibleScore, nOptnScore);
        }
        //Logger.logDebug('PAIR._populateLayout() | Max Possible Score  = '+nMaxPossibleScore);
        this.oDataModel.setMaxPossibleScore(nMaxPossibleScore);
        //this.createToggleOptions(aOptionsList);

        $domOptnGrpList = null;
        domPAIRTable = null;
        $domOptnGrpsCntnr = null;
        $domOptnGrpPointer = null;
        $domOptnStmnt = null;
    };

//    PAIR.prototype.createToggleOptions = function(p_aOptionsList) {
//        var oScope = this,
//                oPAIRToggleGrp = new ToggleGroup(p_aOptionsList);
//        this.PAIRhandleEvents = this._handleEvents.bind(this);
//        oPAIRToggleGrp.addEventListener('OPTION_SELECT', this.PAIRhandleEvents);
//        this.aPAIRList.push(oPAIRToggleGrp);
//        this.oSelectedToggleGrp = oPAIRToggleGrp;
//        //Logger.logDebug("createToggleOptions() this.aPAIRList : "+this.aPAIRList);
//    };

    PAIR.prototype._handleEvents = function(e) {
        //Logger.logDebug("PAIR._handleEvents() | ");
        if (typeof e.preventDefault == 'function') {
            e.preventDefault();
        }
        var oScope = this;
        var target = e.target,
                oOption = e.option,
                currentTarget = e.currentTarget,
                type = e.type,
                oEvent;

        //Logger.logDebug('\tType = '+type+' : Target = '+target);
        switch (type) {
//            case 'OPTION_SELECT':
//                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
//                this.dispatchEvent('OPTION_SELECT', oEvent);
//                //this._checkAndEnableSubmit();
//                break;
            case 'SUBMIT':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this._evaluate('SUBMIT');
                this.dispatchEvent('SUBMIT', oEvent);
                break;
            case 'CONTINUE':
                oEvent = $.extend({}, e, {oScope: oScope, target: this, toggleGroup: target});
                this._populateOptionText(this.currentSetID);
                //this._evaluate('CONTINUE');
                this.dispatchEvent('CONTINUE', oEvent);
                break;
        }
    };

    PAIR.prototype._checkAndEnableSubmit = function(p_optionID) {
        for (var i = 0; i < this.aPAIRList.length; i++) {
            var oPAIRToggleGrp = this.aPAIRList[i];
            //Logger.logDebug("checkAndEnableSubmit() oPAIRToggleGrp.getSelectedOption() " + oPAIRToggleGrp.getSelectedOption());
            if (!oPAIRToggleGrp.getSelectedOption()) {
                this.enableSubmit(false);
                return;
            }
        }
        this.enableSubmit(true);
    };

    /**
     * Upadate Scoore, Set next set ID
     * Show Imidiate feedback if available
     */
    /*
     PAIR.prototype._evaluate							= function(){
     //Logger.logDebug("eVEALUATE () | ");
     this.oDataModel.setMaxPossibleScore(this.nMaxPossibleScore);
     // ** Updating Score

     var oPAIRToggleGrp					= this.oSelectedToggleGrp,
     oSelectedOption					= oPAIRToggleGrp.getSelectedOption(),
     sfbType				= this.oDataModel.getFeedbackType().toUpperCase();
     if(sfbType == "PARAMETERBASEDFEEDBACK"){
     this.updateScoreAndUserSelections(oSelectedOption.getParameters(), oSelectedOption.getID());

     }
     else{
     this.updateScoreAndUserSelections(oSelectedOption.getScore(),oSelectedOption.getID());
     }


     // ** Feedback
     this.oDataModel.getFeedback(true);
     // ** Bookmark
     this.getBookmark();

     this.processFeedbackPopup();
     this.enableSubmit(false);


     };
     */

    PAIR.prototype._evaluate = function() {
        //Logger.logDebug("PAIR._evaluate() | sTrigger = "+ sTrigger);
//        var oPAIRToggleGrp = this.oSelectedToggleGrp,
//                oSelectedOption = oPAIRToggleGrp.getSelectedOption(),
//                oSelectedOptionData = oSelectedOption.getOptionData();
        this.disableActivity();
        this.enableSubmit(false);
        this.oDataModel.updateAttempNumber();
        this.updateScoreAndUserSelections("", "");
    };

    PAIR.prototype.updateScoreAndUserSelections = function(oSelectedOption, oSelectedOptionData) {
        //Logger.logDebug("PAIR.updateScoreAndUserSelections() | "+oSelectedOptionData);

        numberOfAttempt++;
        //
        var correctFlag = true;
        for (var i = 0; i < userAnswerCollection.length; i++) {
            var pair1 = parseInt(userAnswerCollection[i][0].attr("id").match(/[0-9]+/)[0]);
            var pair2 = parseInt(userAnswerCollection[i][1].attr("id").match(/[0-9]+/)[0]);
            if (pair1 != pair2) {
                correctFlag = false;
                break;
            }
        }
        //
        if (correctFlag) {
            status = "correct";
            score = this.oDataModel.oScore.nMaxPossibleScore;
        } else {
            score = 0;
            status = "wrong";
        }
//        var sfbType				= this.oDataModel.getFeedbackType().toUpperCase(),
//			//aUserSelections		= [oSelectedOption.getID(), oSelectedOption.getGroupID()],
//			aUserSelections		= {
//				optionGroupID	:"",
//				optionID		: ""
//			},
//			score				= score;
//
        oScope = this,
                oEvent = {
                    type: 'SCORE_UPDATE',
                    target: oScope,
                    preventDefault: false,
                    callback: oScope.updateHistory,
                    args: []
                };

        ComponentAbstract.prototype.updateScoreAndUserSelections.call(this, score, "");

        this.dispatchEvent('SCORE_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.updateHistory();
        }
    };

    PAIR.prototype.updateHistory = function() {
        this.oDataModel.getFeedback(true);
        var oScope = this,
                oEvent = {
                    type: 'HISTORY_UPDATE',
                    target: oScope,
                    preventDefault: false,
                    callback: oScope.processFeedbackPopup,
                    args: []
                };

        this.dispatchEvent('HISTORY_UPDATE', oEvent);
        if (!oEvent.preventDefault) {
            this.processFeedbackPopup();
        }
    };

    PAIR.prototype.processFeedbackPopup = function() {


        var oScope = this,
                oFeedback = this.getFeedback(),
                sFeedbackTitle = oFeedback.getTitle(),
                sFeedback = oFeedback.getContent(),
                oTransitionPopup,
                oEvent = {
                    target: oScope,
                    popup: oTransitionPopup
                };
        //Logger.logDebug("PAIR.processFeedbackPopup() | \n\tShowFeedbackPopup = "+this.oDataModel.isShowFeedbackPopup());
        if (this.oDataModel.isShowFeedbackPopup()) {
            oTransitionPopup = this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));
            oTransitionPopup.setCallback(this, this.checkAndResetOptions);

        } else {
            this.checkAndResetOptions();
        }
        this.dispatchEvent('AFTER_ACTIVITY_POPUP', oEvent);
        //this.checkAndResetOptions();
    };
    PAIR.prototype.generateIncorrectFeedback = function() {
        //----------------------------------------------------------
        //Callback object while popup getting closed
        //----------------------------------------------------------
        var callbacks = $.Callbacks();
        callbacks.add(function() {
            onIncorrectFeedbackPopupClose()
        });
        //----------------------------------------------------------
        var feedBackTitle = $("#feedback" + (numberOfAttempt + 1)).find("div.feedbackTitleText").html();
        var feedBackText = $("#feedback" + (numberOfAttempt + 1)).find("div.feedbackText").html();
        uiMananagerForFeedbackPopup.createShowStatusPopup(feedBackTitle, feedBackText, status, callbacks);
        //----------------------------------------------------------
    }
    PAIR.prototype.generateCorrectFeedback = function() {
        //----------------------------------------------------------
        //Callback object while popup getting closed
        //----------------------------------------------------------
        var callbacks = $.Callbacks();
        callbacks.add(function() {
            onCorrectFeedbackPopupClose()
        });
        //----------------------------------------------------------
        var feedBackTitle = $("#feedback1").find("div.feedbackTitleText").html();
        var feedBackText = $("#feedback1").find("div.feedbackText").html();
        uiMananagerForFeedbackPopup.createShowStatusPopup(feedBackTitle, feedBackText, status, callbacks);
        //----------------------------------------------------------
        disableSubmit();
        disableReset();
    }
    // ** TODO: Check with Bharat if the method below is used or else remove it
    PAIR.prototype.getUserSelectedOptionID = function(p_nToggleGroupIndex) {
        var oToggleGroup = this.aPAIRList[p_nToggleGroupIndex],
                oOption = oToggleGroup.getSelectedOption()[0],
                sOptionID = oOption.getID();

        return sOptionID;
    };

    // ** TODO: Check with Bharat if the method below is used or else remove it
    PAIR.prototype.updateModelScore = function(p_nUserScore, p_aUserScore, p_aUserSelections) {
        this.oDataModel.setScore(p_nUserScore);
        this.oDataModel.setUserScores(p_aUserScore);
        this.oDataModel.setUserSelections(p_aUserSelections);
    };





    PAIR.prototype.disable = function(p_optionID) {
        //Logger.logDebug('PAIR.disable() | '+ p_optionID);
        for (var i = 0; i < this.aPAIRList.length; i++) {
            var oPAIRToggleGrp = this.aPAIRList[i];
            oPAIRToggleGrp.enable(false);
        }
        this.enableSubmit(false);
    };

    PAIR.prototype.disableActivity = function() {
        //Logger.logDebug('PAIR.disableActivity'+ this.aPAIRList.length);
        for (var i = 0; i < this.aPAIRList.length; i++) {
            var oPAIRToggleGrp = this.aPAIRList[i];
            oPAIRToggleGrp.enable(false);
            oPAIRToggleGrp.removeEventListener('OPTION_SELECT', this.PAIRhandleEvents);
        }
        this.enableSubmit(false);
    };

    PAIR.prototype.resetOptions = function() {
        //Logger.logDebug('PAIR.resetOptions() | '+this);
        for (var i = 0; i < userAnswerCollection.length; i++) {
            if (userAnswerCollection[i][0].attr("id").indexOf("pair") > -1) {
                jsPlumb.select({source: userAnswerCollection[i][0]}).detach();
            } else {
                jsPlumb.select({source: userAnswerCollection[i][1]}).detach();
            }
            userAnswerCollection[i][0].removeClass("ui-activity-button-over").addClass("ui-activity-button-up");
            userAnswerCollection[i][0].removeClass("ui-activity-button-over").addClass("ui-activity-button-up");

            userAnswerCollection[i][1].removeClass("ui-activity-button-over").addClass("ui-activity-button-up");
            userAnswerCollection[i][1].removeClass("ui-activity-button-over").addClass("ui-activity-button-up");
        }
        userAnswerCollection = new Array();
        this.assignOptionsEvent();
        this.assignPairEvent();
        //disableReset();
    };

    PAIR.prototype.enableSubmit = function(p_bEnable) {
        if (p_bEnable) {
            this.$btnSubmit.removeClass('disabled').attr({
                /* START - ARIA Implementation */
                'aria-disabled': false
                        /* END - ARIA Implementation */
            });

        } else {
            this.$btnSubmit.addClass('disabled').attr({
                /* START - ARIA Implementation */
                'aria-disabled': true
                        /* END - ARIA Implementation */
            });
        }
    };

    PAIR.prototype.openFeedbackPopup = function(sFeedbackTitle, sFeedback) {
        var oTransitionPopup = this.openPopup('popup_close', sFeedbackTitle, sFeedback, $('.btn-submit'));

        oTransitionPopup.setCallback(this, this.checkAndResetOptions);

    };

    PAIR.prototype.checkAndResetOptions = function(e) {
        //Logger.logDebug("PAIR.checkAndResetOptions() | \n\tis Attempts Completed = "+this.isAttemptsCompleted());

        if (this.isAttemptsCompleted()) {
            this.generateCorrectPair();
            this._activityCompleted();
        }
        else {
            this.resetOptions();
            this.resetScore();

        }
    };
    PAIR.prototype.generateCorrectPair = function() {
        for (var i = 0; i < userAnswerCollection.length; i++) {
            if (userAnswerCollection[i][0].attr("id").indexOf("pair") > -1) {
                jsPlumb.select({source: userAnswerCollection[i][0]}).detach();
            } else {
                jsPlumb.select({source: userAnswerCollection[i][1]}).detach();
            }
        }
        for (var i = 0; i < totalOptionsCollection.length; i++)
        {
            $("#option" + (i + 1)).removeClass("ui-activity-button-up").addClass("ui-activity-button-over");
            this.createConnection($("#pair" + (i + 1)), $("#option" + (i + 1)));
            userAnswerCollection[i] = [$("#pair" + (i + 1)), $("#option" + (i + 1))];
        }
        this.removeOptionsEvent();
        this.removePairEvent();
    }
    PAIR.prototype.isSelectionCorrect = function(p_bEnable) {
        return this.oDataModel.isSelectionCorrect();
    };


    PAIR.prototype._hasOptionStatement = function($domOptnStmnt, sStmntClass, i, sOptnGrpClass) {
        if ($domOptnStmnt.length == 0) {
            Logger.logError('PAIR._populateLayout() | No element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
        if ($domOptnStmnt.length > 1) {
            Logger.logError('PAIR._populateLayout() | More than 1 element with class "' + sStmntClass + '" found in the element number "' + (i + 1) + '" having class "' + sOptnGrpClass + '"');
        }
    };

    PAIR.prototype._hasOptionLabel = function($domOptnLbl, sOptnLblClass, j, i) {
        if ($domOptnLbl.length == 0) {
            Logger.logError('PAIR._populateLayout() | No element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
        if ($domOptnLbl.length > 1) {
            Logger.logError('PAIR._populateLayout() | More than 1 element with class "' + sOptnLblClass + '" found for Radio Number "' + (j + 1) + '" in Radio Container "' + (i + 1) + '"');
        }
    };

    PAIR.prototype._hasOptionGroupCotainer = function($domOptnGrpsCntnr, sOptnGrpsCntnrClass, sQuestionID) {
        if ($domOptnGrpsCntnr.length == 0) {
            Logger.logError('PAIR._populateLayout() | No element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
        if ($domOptnGrpsCntnr.length > 1) {
            Logger.logError('PAIR._populateLayout() | More than 1 element with class "' + sOptnGrpsCntnrClass + '" found in element "' + sQuestionID + '"');
        }
    };

    PAIR.prototype.destroy = function() {
        this.$btnSubmit.off();
        for (var i = 0; i < this.aPAIRList.length; i++) {
            var oPAIRToggleGrp = this.aPAIRList[i];
            oPAIRToggleGrp.destroy();
        }

        this.oIncidentController;
        this.aPAIRList = null;
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
        this.oSelectedToggleGrp = null;

        ComponentAbstract.prototype.destroy.call(this);
        this.prototype = null;
    };

    PAIR.prototype.toString = function() {
        return 'framework/activity/PAIR';
    };

    return PAIR;
});
