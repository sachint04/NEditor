define([
    'jquery',
    'x2js',
    'framework/viewcontroller/Popup',
    'framework/utils/globals',
    'framework/component/Tabs',
    'framework/utils/Logger',
    'framework/utils/VariableManager',
], function($, X2JS, Popup, Globals, TabComponent, Logger,VariableManager) {
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function Glossary() {
		//Logger.logDebug('Glossary.CONSTRUCTOR()  : ');
        Popup.call(this);
        // ** START - Declare Page variables for individual screens
        this.pageXMLData;
        this.$xml;
        this.jsonXmlData;
        // ** END - Declare Page variables for individual screens
        return this;
    }

    Glossary.prototype												= Object.create(Popup.prototype);
    Glossary.prototype.constructor									= Glossary;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    Glossary.prototype.init											= function(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList, p_sXMLFilePath) {
        //Logger.logDebug("Glossary.init() | p_sXMLFilePath = "+p_sXMLFilePath);
		this.loadResource(p_sXMLFilePath, this, this.parseXML);


        /* popuplateTermslisthroughSearch*/
        //this.searchInputField();
        // END - Custom Implementation for individual screens
        Popup.prototype.init.call(this, p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList);
    };

	Glossary.prototype.parseXML										= function(p_oScope, p_xmlData, p_oResourceLoader){
		this.pageXMLData = $(p_xmlData)[0];
		var xml = Globals.toXMLString($(p_xmlData)[0]);
        var xmlDoc = $.parseXML(xml);
        this.$xml = $(xmlDoc);
		//Logger.logDebug('Glossary.parseXML() | '+p_xmlData+'\n\n'+Globals.toXMLString($(p_xmlData)[0]));

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;

		this.popuplateAlphabetPanel();
    };

    Glossary.prototype.popuplateAlphabetPanel = function() {
    	//Logger.logDebug('Glossary.popuplateAlphabetPanel() | ');
        var alphabetCount = 26,
        	aCharsList = [],
        	j,
        	$charElement;

        /* Create list of charactors */
        // for (j = 0; j < alphabetCount; j++) {
            // var sCharString		= String.fromCharCode(65 + j).toLowerCase(),
            	// $charElement	= $('<li class="char" id="char-' + String.fromCharCode(65 + j) + '"><button class="tiny">' + String.fromCharCode(65 + j) + '</button></li>');
//
			// //Logger.logDebug(sCharString+' : '+($(this.pageXMLData).find(sCharString).length > 0));
			// if($(this.pageXMLData).find(sCharString).length < 1){$charElement.addClass('disabled');}
            // aCharsList.push($charElement);
        // }
		var oX2JS 				= new X2JS();
		this.jsonXmlData 		= 	oX2JS.xml2json(this.pageXMLData).glossary;

		//Logger.logDebug('jsonXmlData = '+ JSON.stringify(this.jsonXmlData));

		for(var alphabet in this.jsonXmlData){
			if(alphabet !== "pageText" && alphabet !== "config" && alphabet !== "_type" ){
				$charElement	= $('<li class="char" id="char-' + alphabet + '"><button class="tiny">' + alphabet.toUpperCase() + '</button></li>');
				if(this.jsonXmlData[alphabet].term == undefined){
					$charElement.addClass('disabled');
				}
				aCharsList.push($charElement);
			}

		}

		// ** Attach the alphabets to the alphabets container
        this.$popup.find('#alphabetPanel').append(aCharsList);
        this.attachAlphabetEvents();
		$(this.$popup.find('#alphabetPanel > .char')[0]).click();
    };

    Glossary.prototype.attachAlphabetEvents					= function(){
    	//Logger.logDebug('Glossary.attachAlphabetEvents() | ');
    	var oScope		= this;
    	// ** Attach Click Event to the alphabets not having "disabled" class
		this.$popup.find('#alphabetPanel > .char').not('.disabled').on('click', function(e) {
			oScope.handleAlphabetClick(e);
        });
        // ** Fire Click Event for the first alphabet

    };

    Glossary.prototype.handleAlphabetClick					= function(e){
    	var $alphabet			= $(e.currentTarget),
    		$alphabetContainer	= $alphabet.parent(),
    		sClickedAlphabet 	= String($alphabet.attr('id')).split("-")[1];

    	$alphabetContainer.find('.char').removeClass('selected');
        $alphabet.addClass('selected');
        this.popuplateTermslist(sClickedAlphabet);
    };


    Glossary.prototype.popuplateInstruction = function() {
        var $inst = this.$xml.find("instruction");
        this.$popup.find('#instPanel-text').text($inst.text());
    };


    /* popuplate Team list */
    Glossary.prototype.popuplateTermslist = function(_alphabet) {
		//Logger.logDebug('Glossary.popuplateTermslist() | ');
        this.$popup.find('#descriptionPanel').empty();
		var oTerm = this.jsonXmlData[_alphabet].term;
			if(oTerm.length == undefined){
				oTerm  = [oTerm];
			}

			for(var i = 0;i < oTerm.length;i++){
				var sTermName = oTerm[i].name.__cdata,
				sTermDescription = oTerm[i].description.__cdata;
				this.$popup.find('#descriptionPanel').append("<div class='row'><p><span class='glossary-name'>" + sTermName + "</span></p><p>" + sTermDescription + "</p></div>");
			}



         // $($termList).find('term').each(function(i, elem) {
         	// var sTermName			= $(this).children('name').text(),
         		// sTermDescription	= $(this).children('description').text();
			// oScope.$popup.find('#descriptionPanel').append("<div class='row'><p><span class='glossary-name'>" + sTermName + "</span></p><p>" + sTermDescription + "</p></div>");
         // });
    };

    /* add event to seach filed*/
    Glossary.prototype.searchInputField = function() {
        var oScope = this;

        $('.searchField').bind("propertychange keyup input paste", function(event) {
            /* process Search Input */
            oScope.searchGlossaryTerm($('.searchField').val());
        });
    };

    /* Method: process Search Input */
    Glossary.prototype.searchGlossaryTerm = function(_data) {
        var userInput = _data;
        var _this = this;
        var userInputCharLength = userInput.length;
        var matchedCharactors = 0;
        var descriptionArray = [];
        var index = 0;
        var termInstanceId = 0;

        /* Reset outout field*/
        _this.$popup.find('#termPanel').html("");
        _this.$popup.find('#descriptionPanel').html("");

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
                _this.$popup.find('#termPanel').append(name);
                descriptionArray.push(glossaryTermDescription);


                $(name).click(function() {
                    var clickedIndex = String($(this).attr('id')).split("-")[1];
                    Logger.logDebug('Glossary.searchGlossaryTerm clickedIndex : ' + clickedIndex);
                    _this.$popup.find('#descriptionPanel').html("");
                    _this.$popup.find('#descriptionPanel').html(descriptionArray[clickedIndex]);
                });

                termInstanceId++;
            }

        });
    };


    /* search Team list */
    Glossary.prototype.popuplateTermslisthroughSearch = function(_str) {
        Logger.logDebug('Glossary.popuplateTermslisthroughSearch _str : ' + _str);
    };

	Glossary.prototype.show						= function(p_oData, p_sClass){
		Logger.logDebug('Glossary.show() | ');
		// ** Calling Super Class "show()" function
		Popup.prototype.show.call(this, p_oData, p_sClass);

		this.attachAlphabetEvents();
		return this.$popup;
	};

    /**
     * Destroys the Page Object
     */
    Glossary.prototype.destroy = function() {
        // ** START - Custom Implementation for destroying Page variables
		this.$popup.find('#alphabetPanel > .char').not('.disabled').off();
        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        Popup.prototype.destroy.call(this);
    };

	Glossary.prototype.toString					= function(){
		return 'framework/core/Glossary';
	};

    return Glossary;
});
