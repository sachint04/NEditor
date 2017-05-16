define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/utils/globals',
    'framework/component/Tabs',
    'framework/utils/Logger',
    'framework/utils/VariableManager',
], function($, PageAbstract, Globals, TabComponent, Logger,VariableManager) {
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function glossary(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
        Logger.logDebug('glossary.CONSTRUCTOR()  : ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens
        this.pageXMLData;
        this.$xml;
        // ** END - Declare Page variables for individual screens
        return this;
    }

    glossary.prototype = Object.create(PageAbstract.prototype);
    glossary.prototype.constructor = glossary;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    glossary.prototype.initialize = function() {
        // START - Custom Implementation for individual screens
        //        var oCompConfig     = {
        //                accordion       : false,
        //                tabShowSpeed    : 600
        var domView = this.$domView;
        var oScope = this;
        this.$domView.find('#glossary_btn_close').click(function(e) {
            e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
            oScope.jumpToPage(Globals.getVariable("lastPage"));
        });
//        };
//        this.oTabComponent = new TabComponent("tabpanel1", oCompConfig);
        Logger.logDebug("glossary.initialize() : ");

        /* */
        this.popuplateParseXML();

        /* */
        this.popuplateInstruction();



        /* popuplateTeamslisThroughSearch*/
        this.searchInputField();
        // END - Custom Implementation for individual screens
        PageAbstract.prototype.initialize.call(this, true);
    };
    glossary.prototype.popuplateParseXML = function() {
        this.pageXMLData = $(this.xmlData)[0];

        var xml = Globals.toXMLString($(this.xmlData)[0]);
        var xmlDoc = $.parseXML(xml);
        this.$xml = $(xmlDoc);

//		console.log("* popuplateParseXML * xml "+xml);

        /* popuplateAlphabetPanl */
        this.popuplateAlphabetPanl();
    };


    glossary.prototype.popuplateAlphabetPanl = function() {
        var pageScore = this;
        var alphabetCount = 26;
        var firstCharStr = "";
        /* */
        for (j = 0; j < alphabetCount; j++) {
            /* Create list of charactors */
            var charString = String.fromCharCode(65 + j).toLowerCase();
            var charElement = $('<li class="char disabled" id="char-' + String.fromCharCode(65 + j) + '"><button class="tiny">' + String.fromCharCode(65 + j) + '</button></li>');
            var classname = (j == 0) ? 'start' : ((j == 25) ? 'end' : 'main');
            $(charElement).addClass(classname);
            this.$domView.find('#alphabetPanel').append(charElement);
            /* */
            $(this.pageXMLData).find(charString).each(function() {
                if (firstCharStr == "") {
                    firstCharStr = charElement;
                }
                charElement.addClass('enabled');
                charElement.removeClass('disabled');

                charElement.click(function() {
                    $(".char").removeClass('selected');

                    $(this).addClass('selected');
                    var clickedAlphabet = String($(this).attr('id')).split("-")[1];
                    pageScore.popuplateTeamslist(clickedAlphabet.toLowerCase());

                });
            });

            firstCharStr.click();
        }
    };


    glossary.prototype.popuplateInstruction = function() {
        var $inst = this.$xml.find("instruction");
        this.$domView.find('#instPanel-text').text($inst.text());
    };


    /* popuplate Team list */
    glossary.prototype.popuplateTeamslist = function(_alphabet) {
        var oScope = this;
        var length = $(this.pageXMLData).find(_alphabet).children().length;
        var firstNameInstance = "";
        //Logger.logDebug('glossary.popuplateTeamslist _alphabet : '+_alphabet);
        //oScope.$domView.find('.searchField').text("a");
        Logger.logDebug(' searchField ');
        var $termList = $(this.pageXMLData).find(_alphabet);


        var descriptionTextArray = [];
        var nameTextArray = [];
        var index = 0;

        if (length == 0) {
            oScope.$domView.find('#termPanel').html("No Term Found for " + _alphabet);
            oScope.$domView.find('#descriptionPanel').html("Information not available");
        } else {
            oScope.$domView.find('#termPanel').html("");
            oScope.$domView.find('#descriptionPanel').html("Please click on to the term tab to the left.");
        }

        /* Reset Scroll position to top */
        oScope.$domView.find('#termPanel').scrollTop(1);
        oScope.$domView.find('#descriptionPanel').scrollTop(1);

        $($termList).find('term').each(function() {

            /* get xml data*/
            var nameStr, description;
            nameStr = $(this).children('name').text();
            description = $(this).children('description').text();
            descriptionTextArray.push(description);
            nameTextArray.push(nameStr);
            /* create elements */
            var name = $('<div class="name" id="name-' + index + '"><p>' + nameStr + '</p></div>');
            if (firstNameInstance == "") {
                firstNameInstance = name;
            }
            /* add Event to Element */
            $(name).click(function() {
                var clickedIndex = String($(this).attr('id')).split("-")[1];
                //Logger.logDebug('glossary.popuplateAlphabetPanl tearm clicked '+clickedIndex);

                oScope.$domView.find('#descriptionPanel').html("");
                $.each(nameTextArray, function(index, value) {
                    oScope.$domView.find('#descriptionPanel').append("<div class='row'><p><span class='glossary-name'>" + value + "</span><p>" + descriptionTextArray[index] + "</div>");
                });
            });

            /* appending elements to container for view*/

            oScope.$domView.find('#termPanel').append(name);
            //Logger.logDebug('glossary.popuplateAlphabetPanl nameStr : '+nameStr + " description: "+description);
            index++;
        });

        firstNameInstance.click();
    };

    /* add event to seach filed*/
    glossary.prototype.searchInputField = function() {
        var oScope = this;

        $('.searchField').bind("propertychange keyup input paste", function(event) {
            /* process Search Input */
            oScope.searchGlossaryTerm($('.searchField').val());
        });
    };

    /* Method: process Search Input */
    glossary.prototype.searchGlossaryTerm = function(_data) {
        var userInput = _data;
        var _this = this;
        var userInputCharLength = userInput.length;
        var matchedCharactors = 0;
        var descriptionArray = [];
        var index = 0;
        var termInstanceId = 0;

        /* Reset outout field*/
        _this.$domView.find('#termPanel').html("");
        _this.$domView.find('#descriptionPanel').html("");

        if (userInputCharLength <= 0) {
            return;
        }
        /* process each name element to match Input */
        var i = 0;
        $(this.pageXMLData).find('description').each(function() {
            //descriptionArray.push($(this).text());
        });

        $(this.pageXMLData).find('name').each(function() {
            var glossaryTerm = $(this).text();
            var glossaryTermDescription = $(this).next().text();

            matchedCharactors = 0;
            index++;

            /* */
            for (j = 0; j < userInputCharLength; j++) {
                if (glossaryTerm.length >= userInputCharLength) {
                    if (glossaryTerm[j].toLowerCase() == userInput[j].toLowerCase()) {
                        matchedCharactors++;
                    }
                }
            }

            /* */
            if (matchedCharactors == userInputCharLength) {
                var name = $('<div class="name" id="name-' + termInstanceId + '"><p>' + glossaryTerm + '</p></div>');
                _this.$domView.find('#termPanel').append(name);
                descriptionArray.push(glossaryTermDescription);


                $(name).click(function() {
                    var clickedIndex = String($(this).attr('id')).split("-")[1];
                    Logger.logDebug('glossary.searchGlossaryTerm clickedIndex : ' + clickedIndex);
                    _this.$domView.find('#descriptionPanel').html("");
                    _this.$domView.find('#descriptionPanel').html(descriptionArray[clickedIndex]);
                });

                termInstanceId++;
            }

        });
    };


    /* search Team list */
    glossary.prototype.popuplateTeamslisThroughSearch = function(_str) {
        Logger.logDebug('glossary.popuplateTeamslisThroughSearch _str : ' + _str);
    };

    /**
     * Destroys the Page Object
     */
    glossary.prototype.destroy = function() {
        // ** START - Custom Implementation for destroying Page variables

        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return glossary;
});
