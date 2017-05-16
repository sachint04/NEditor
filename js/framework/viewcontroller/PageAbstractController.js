/**
 *
 * @exports framework/viewcontroller/PageAbstractController
 *  
 */
define([
	'jquery',
	'pubsub',
	'x2js',
	/*'bootstrap',*/
	'framework/model/CourseConfigModel',
	'framework/core/AudioManager',
	'framework/core/PopupManager',
	'framework/viewcontroller/UIManager',
	'framework/model/CourseModel',
	'framework/utils/globals',
	'framework/utils/VariableManager',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function($, pubsub, X2JS, /*bootstrap,*/ CourseConfig, AudioManager, PopupManager, UIManager, CourseModel, Globals, VariableManager, EventDispatcher, Logger){

	/**
	 * PageAbstract - Super class for Page View js
	 * @param p_oCourseController : Reference to CourseController
	 * @param p_$pageHolder : The HTML element to which the page will get appended
	 * @param p_domView : Page HTML View
	 * @param p_xmlData : Page XML Data
	 * @param p_cssData : Page CSS Data
	 * @constructor
	 * @alias PageAbstractController
	 */
	function PageAbstract(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		EventDispatcher.call(this);
		this.CourseControllerRef	= p_oCourseController;
		this.xmlData				= p_xmlData;
		// var oX2JS 				= new X2JS();
		// this.jsonXMLData			= oX2JS.xml2json(p_xmlData);
		/** property this.bFadeInText  */ 
		this.bFadeInText			= true;
		this.bPageAssetsLoaded		= false;
		this.bActivityLoaded		= false;
		this.bAudiosLoaded			= false;
		this.bComponentsLoaded		= false;
		this.bComponentsComplete	= false;
		this.$imgLongDescAnchors;
		this.aComponents			= [];
		this.aActivities			= [];
		this.aActivitiesCompleted	= [];
		this.aUIListeners			= [];
		this.aMandatoryEvents		= [];
		this.cssData 				= p_cssData.cssData;
		this.aDependentActivities   = [];
		//this.sGUID                = p_sGUID.replace(/~/g, '@_@') || "";
		this.sGUID                  = p_sGUID || "";
		this.report					= {};
		/** property aPlayOnLoadList Audio list with 'playOnLoad' true*/ 
		this.aPlayOnLoadList;
		/** property this.bFadeInText  Component audio list with 'playOnLoad' true*/ 
		this.aPlayOnLoadComponentList;
	
		
        Logger.logDebug('PARAMETER GUID = '+p_sGUID+' : Stored GUID = '+this.sGUID);
		// ** decision_holder > i1_e1
		var $pageContainer	= $('<section id="pagecontainer_'+this.getCustomGUID('_')+'" class="row"><style type="text/css">'+p_cssData.cssData+'</style>'+p_domView+'</section>');
		$pageContainer.children('#content').attr('id', this.getCustomGUID('_')).addClass('tis-page');
		p_$pageHolder.append($pageContainer).scrollTop(0);
		this.$domView		= p_$pageHolder.find('#pagecontainer_'+this.getCustomGUID('_'));
		this.$domView.addClass('hide');

		this.oActivityClassPath		= {
			mcqgroup				: 'framework/activity/viewcontroller/MCQGroup',
			mmcqgroup				: 'framework/activity/viewcontroller/MMCQGroup',
			conversation			: 'framework/activity/viewcontroller/Conversation',
			branching				: 'framework/activity/viewcontroller/Branching',
			MMCQ					: 'framework/activity/viewcontroller/MMCQ',
			MCQ						: 'framework/activity/viewcontroller/MCQ',
			PAIR					: 'framework/activity/viewcontroller/PAIR',
			DropdownGroup			: 'framework/activity/viewcontroller/DropdownGroup',
			FIB						: 'framework/activity/viewcontroller/FIB',
			DropdownFIB				: 'framework/activity/viewcontroller/DropdownFIB',
			MultipleDropdownGroup	: 'framework/activity/viewcontroller/MultipleDropdownGroup',
			DragAndDrop				: 'framework/activity/viewcontroller/DragAndDrop',
			clickandclick			: 'framework/activity/viewcontroller/ClickAndClick',
			MultiActivity           : 'framework/activity/viewcontroller/MultiActivity',
			Matching           		: 'framework/activity/viewcontroller/Matching'
		};

        this.oComponentClassPath 	= {
            tab				: 'framework/component/Tabs',
            accordian		: 'framework/component/Accordian',
            stepbuildup		: 'framework/component/StepBuildUp',
            clickandreveal	: 'framework/component/ClickAndReveal',
            mediaplayer		: 'framework/component/MediaPlayer',
            carousel		: 'framework/component/Carousel',
            carouselspeech	: 'framework/component/CarouselSpeech',
            menu			: 'framework/component/Menu',
            stepanimation	: 'framework/component/StepAnimation',
            clicksequence	: 'framework/component/ClickSequence',
            animate			: 'framework/component/Animate'
        };
	

		this.onShowPopup 			= this.onShowPopup.bind(this);
        this.onInteractionComplete 	= this.onInteractionComplete.bind(this);
        this.onComponentLoaded 		= this.onComponentLoaded.bind(this);
        this.onActivityComplete 	= this.onActivityComplete.bind(this);
		this.onActivityLoaded		= this.onActivityLoaded.bind(this);
		this.uiPlayPauseHandler 	= this.uiPlayPauseHandler.bind(this);
		this.popupEventHandler 		= this.popupEventHandler.bind(this);
		this.resetActivityListener 	= this.resetActivityListener.bind(this);
		this.hideScreenElements     = this.hideScreenElements.bind(this);
		// ** Add listeners to the AudioManager
		this.onAudiosLoaded 		= this.onAudioLoaded.bind(this);
		AudioManager.addEventListener('AUDIO_LOADED', this.onAudioLoaded);
		this.onPreloadAudiosLoaded 	= this.onPreloadAudiosLoaded.bind(this);
		AudioManager.addEventListener('PRELOAD_AUDIOS_LOADED', this.onPreloadAudiosLoaded);
		this.onAllAudiosLoaded 		= this.onAllAudiosLoaded.bind(this);
		AudioManager.addEventListener('ALL_AUDIOS_LOADED', this.onAllAudiosLoaded);
		this.onCuepointPassed 		= this.onCuepointPassed.bind(this);
		AudioManager.addEventListener('CUEPOINT_PASSED', this.onCuepointPassed);
		this.onAudioComplete		= this.onAudioComplete.bind(this);
		AudioManager.addEventListener('AUDIO_FINISH', this.onAudioComplete);
		// ** Add listeners to the UIManager for the UI Play | Pause audio buttons
		UIManager.addEventListener('PLAY_AUDIO', this.uiPlayPauseHandler);
		UIManager.addEventListener('PAUSE_AUDIO', this.uiPlayPauseHandler);
		AudioManager.addEventListener('AUDIO_PLAY', this.hideScreenElements);
     	
		$pageContainer	= null;
		p_$pageHolder	= null;
		
		
		this.onTabClick 		= this.onTabClick.bind(this);

		
		return this;
	};

	PageAbstract.prototype								= Object.create(EventDispatcher.prototype);
	PageAbstract.prototype.constructor					= PageAbstract;

	/**
	 * Function init() : gets called after the view is populated with the required content based on ID mapping.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 * 
	 */
	PageAbstract.prototype.init							= function(){
		//Logger.logDebug('PageAbstract.init() | GUID = '+this.getGUID());

		// ** TODO: Have a "parseXML" method here to iterarate the XML nodes and add helper methods to handle each type of node
		// ** Setting the Page Content
		this.setContent();
		// ** Adding long description to any ANCHOR or BUTTON tags in the page have a class "dlink"
		this.addLongDescription();
		// ** Parse Sounds node
		this.parseSoundsNode();
		// ** Parse Activity node
		this.parseActivityNode();
		// ** Parse Component node
		this.parseComponentNode();
		// ** Parse Component node
		this.addCustomScripts();
		// ** Preloading the image sources specified in the IMG tag
		Globals.checkImagesLoaded(this, this.pageAssetsLoaded, [this.cssData]);
	};
	
	/**
	 *	Push  text in to view  
	 */
	PageAbstract.prototype.setContent 					= function(){
		//Logger.logDebug('PageAbstract.setContent() | GUID = '+this.sGUID/*+Globals.toXMLString(this.xmlData)*/);
		// ** Iterating the XML Data to populate the HTML View
		/* Sachin Tumbre -- Replace Variables in page */
		var oScope			= this,
			oX2JS 				= new X2JS(),
			sXmlData 			= Globals.toXMLString(this.xmlData),
			$xmlData,
			oPageModel,
			$elem,
			sClassName,
			sID,
			sContent,
			sPath,
			sAlt,
			/*sLongDesc,*/
			sLongDescHref,
			sAudioFilePath,
			sFileName;
	   sXmlData 			= VariableManager.resolveVariables(sXmlData);/* replace variables in string data */
	   this.xmlData 		= Globals.getXMLfromString(sXmlData); /* convert string to xml */
	   this.jsonXMLData	= oX2JS.xml2json(this.xmlData);
			$xmlData 		= $(this.xmlData);
	   /* END */
		$xmlData.children().children().each(function(index, element){
			//Logger.logDebug('\tNode Name = '+this.nodeName);
			if(this.nodeName.toUpperCase() == "PAGETEXT"){
				sClassName = this.getAttribute('class') || '';
				sID = this.getAttribute('id') || '';
					sContent		= Globals.getContent(this);
				//Logger.logDebug('PageAbstract.setContent() | ID = '+sID+' : DOM Obj = '+oScope.$domView.find('#'+sID)[0]+' : Content = '+sContent);
				/* Vincent Gomes (1/30/2015) optimized the logic */
				if(sID){
	                $elem = Globals.getElementByID(oScope.$domView, sID, 'PageAbstract.setContent() | ID = ' + sID);
                }else if(sClassName){
	                $elem = Globals.getElementByClassName(oScope.$domView, sClassName, 'PageAbstract.setContent() | Class Name = ' + sClassName);
                }

				if($elem.length > 0){
					$elem.html(sContent)
					//$elem.attr('contenteditable','true' );
				}
            }
            /* sachin tumbre (1/5/2015)  added image support. Removed Image dom creation in Component creation logic and */
            /* Vincent Gomes (1/30/2015) optimized the logic and handled alt & long description */
            if(this.nodeName.toUpperCase() == "IMAGE" || this.nodeName.toUpperCase() == "IMG"){
                sClassName 		= this.getAttribute('class') || '';
                sID 			= this.getAttribute('id') || '';
                /*sAlt			= Globals.getContent($(this).find('alt')[0]) || '';
                sLongDesc		= Globals.getContent($(this).find('longdescription')[0]) || '';
                sLongDescHref	= $(this).find('longdescription')[0].getAttribute('href') || '';*/
                sAlt			= Globals.getContent(this) || '';
                sPath 			= this.getAttribute('src') || '';
                sLongDescHref	= this.getAttribute('longDescription') || '';
				Logger.logDebug('PageAbstract.setContent() | IMAGE | ID = '+sID+' : Class = '+sClassName+' : sAlt = '+sAlt+' : Path = '+sPath+'\n\tLong Description Href = '+sLongDescHref);

				if(sID){
	                $elem = Globals.getElementByID(oScope.$domView, sID, 'PageAbstract.setContent() | ID = ' + sID);
                }else if(sClassName){
	                $elem = Globals.getElementByClassName(oScope.$domView, sClassName, 'PageAbstract.setContent() | Class Name = ' + sClassName);
                }

                if($elem.length > 0){
                	if(sLongDescHref){
                		if(!sID){
		                	// ** Add the ID attribute to the <IMG> tag as its required for long description
	                		$elem.attr({
			                	'id'	: 'tis_img_' + index
			                });
		                }
						/* Check if the Long Description Pop-up exists in the DOM */
						var $longDescPopup	= Globals.getElementByID(oScope.$domView, sLongDescHref, 'PageAbstract.setContent() | Long Desc Href = ' + sLongDescHref),
							$longDescPopup	= ($longDescPopup.length === 0) ?  Globals.getElementByClassName(oScope.$domView, sLongDescHref, 'PageAbstract.setContent() | Long Desc Href = ' + sLongDescHref) : $longDescPopup;

						if($longDescPopup.length > 0){
							/* Check if an ID is already assigned to the Long Description Pop-up */
							if($longDescPopup.attr('id') === undefined || $longDescPopup.attr('id') === ''){
								/* The Long Description popup has no ID attribute, so create one */
								$longDescPopup.attr({
									'id'	: 'tis_longdescription_' + index
								});
							}
						}else{
							Logger.logWarn('WARN: PageAbstract.setContent() | Element with ID / class "'+sLongDescHref+'" not found for Long Description pop-up. Creating one for it.');
							oScope.$domView.find('.tis-page').append('<div id="'+sLongDescHref+'" class="'+sLongDescHref+' hide"></div>');
							$longDescPopup = oScope.$domView.find('.tis-page #'+sLongDescHref);
							var $temp = $xmlData.children().find('pageText[id="'+sLongDescHref+'"]'),
								$temp = ($temp.length === 0) ? $xmlData.children().find('pageText[class="'+sLongDescHref+'"]') : $temp;

							sContent = Globals.getContent($temp[0]);
							$longDescPopup.html(sContent);
						}
		                /* Create an <a> tag for long description */
		                $('<a data-imgid="'+$elem.attr('id')+'" href="#'+$longDescPopup.attr('id')+'" title="Descriptive text about the previous image: " class="dlink"></a>').insertAfter($elem);
                	}

                	$elem.attr({
						'alt'	: sAlt,
                		'src'	: sPath
                	});
                }
            }

            /*if (this.nodeName.toUpperCase() == "COMPONENT") {
                if (this.getAttribute('type') == "MediaPlayer" && this.getAttribute('class') == "audioplayer"){
                    sAudioFilePath = Globals.getAudioFilePath(oPageModel, 'audio_location');
                    $(element).children().each(function(index_j, element) {
                        sFileName = $(this).attr('filename');
                        $(this).attr('filename', sAudioFilePath + sFileName);
                    });

                    AudioManager.parseSoundsNode(element);
                    // ** Add listeners for the UI Play | Pause audio buttons

                    UIManager.addEventListener('PLAY_AUDIO_CLICK', oScope.uiPlayPauseHandler);
                    UIManager.addEventListener('PAUSE_AUDIO_CLICK', oScope.uiPlayPauseHandler);
                }
            }*/
		});
		/*var $xmlPageText	= $xmlData.find('pageText');
		if($xmlPageText.length > 0){
			for(i=0; i<$xmlPageText.length; i++){
				var $xmlPageTextNode	= $($xmlPageText[i]),
					sId					= $xmlPageTextNode.attr('id'),
					sText				= Globals.getContent($xmlPageTextNode[0]);
				//Logger.logDebug('\tID = '+sId+' : Text = '+sText);

				Globals.getElementByID($domView, sId, 'PageAbstract.setContent() | '+this.sGUID).html(sText);
			}
		}*/
	};

	/**
	 * Initiate AudioManager with 'Sounds' node
	 */
	PageAbstract.prototype.parseSoundsNode				= function() {
		//Logger.logDebug('PageAbstract.parseSoundsNode() | ');
		var oPageModel			= (this.CourseControllerRef) ? this.CourseControllerRef.getCurrentPage() : null,
			$xmlData			= $(this.xmlData),
			$xmlSounds			= $xmlData.find('sounds');
			/*$xmlSounds = $xmlData.find('component[type="MediaPlayer"]');*/

		if($xmlSounds.find('sound').length > 0){
        	/* Modify the <sound> node to resolve the audio file path */
			var sAudioFilePath	= Globals.getAudioFilePath(oPageModel, 'audio_location'),
				$xmlSound		= $xmlSounds.find('sound'),
				sFileName,
				i;
            //Logger.logDebug('\tNo of Sounds = '+$xmlSound.length+' : sAudioFilePath = '+sAudioFilePath);

			for(i=0; i<$xmlSound.length; i++){
				var $xmlSoundNode	= $($xmlSound[i]),
                	sAudioName		= $xmlSoundNode.attr('name'),
					sFileName		= $xmlSoundNode.attr('filename');
	            //Logger.logDebug('\tSound Audio Name = '+sAudioName+' : sFileName = '+sFileName);

				$xmlSoundNode.attr('filename', sAudioFilePath + sFileName);
			}
			/* Pass the <sounds> node to the AudioManager for parsing */
			AudioManager.parseSoundsNode($xmlSounds[0]);

			// ** Add listeners for the UI Play | Pause audio buttons
			//UIManager.addEventListener('PLAY_AUDIO_CLICK', this.uiPlayPauseHandler);
			//UIManager.addEventListener('PAUSE_AUDIO_CLICK', this.uiPlayPauseHandler);
		}else{
			this.bAudiosLoaded			= true;
			//this.checkLoadComplete();
		}
	};

	/**
	 * Parse 'activity' node from page xml 
	 */
	PageAbstract.prototype.parseActivityNode			= function(){
		var oScope                = this,
		    $xmlData			= $(this.xmlData),
			$xmlActivity		= $xmlData.find('activity');
		//Logger.logDebug('PageAbstract.parseActivityNode() | No of Activities = '+$xmlActivity.length);

		if($xmlActivity.length > 0){
			for(var i=0; i<$xmlActivity.length; i++){
				var $xmlActivityNode	= $($xmlActivity[i]),
					sActivityType = $xmlActivityNode.attr('type').toUpperCase();
				//Logger.logDebug('\tActivity Type = '+sActivityType+' : DOM View = '+this.$domView[0]);

				// ** Add sections for each activity type
				if(sActivityType === 'MCQGROUP'){
					this.createActvity(this.oActivityClassPath.mcqgroup, $xmlActivityNode);
				}
				if(sActivityType === 'MMCQGROUP'){
					this.createActvity(this.oActivityClassPath.mmcqgroup, $xmlActivityNode);
				}
				if(sActivityType === 'CONVERSATION'){
					this.createActvity(this.oActivityClassPath.conversation, $xmlActivityNode);
				}
				if(sActivityType === 'BRANCHING'){
					this.createActvity(this.oActivityClassPath.branching, $xmlActivityNode);
				}
				if(sActivityType === 'MMCQ'){
					this.createActvity(this.oActivityClassPath.MMCQ, $xmlActivityNode);
				}
				if(sActivityType === 'MCQ'){
					this.createActvity(this.oActivityClassPath.MCQ, $xmlActivityNode);
				}
                                if(sActivityType === 'PAIR'){
					this.createActvity(this.oActivityClassPath.PAIR, $xmlActivityNode);
				}
				if(sActivityType === 'DROPDOWNGROUP'){
					this.createActvity(this.oActivityClassPath.DropdownGroup, $xmlActivityNode);
				}
				if(sActivityType === 'FIB'){
					this.createActvity(this.oActivityClassPath.FIB, $xmlActivityNode);
				}
				if(sActivityType === 'DROPDOWNFIB'){
					this.createActvity(this.oActivityClassPath.DropdownFIB, $xmlActivityNode);
				}
				if(sActivityType === 'MULTIPLEDROPDOWNGROUP'){
					this.createActvity(this.oActivityClassPath.MultipleDropdownGroup, $xmlActivityNode);
				}
				if(sActivityType === 'DRAGANDDROP'){
					this.createActvity(this.oActivityClassPath.DragAndDrop, $xmlActivityNode);
				}
				if(sActivityType === 'CLICKANDCLICK'){
					this.createActvity(this.oActivityClassPath.clickandclick, $xmlActivityNode);
				}
				if(sActivityType === 'MULTIACTIVITY'){
				    this.checkDependentActivities($xmlActivityNode.attr('deps'), function($xml){
    				    oScope.createActvity(oScope.oActivityClassPath.MultiActivity, $xml);    
				    }, [$xmlActivityNode]);
                    
                }
				if(sActivityType === 'MATCHING'){
					this.createActvity(this.oActivityClassPath.Matching, $xmlActivityNode);
				}
			}
		}else{
			this.bActivityLoaded = true;
			this.checkLoadComplete();
		}
	};
	
	PageAbstract.prototype.createActvity				= function(p_jsFilePath, p_$xmlActivity) {
		var oScope	= this;

		require([
			p_jsFilePath
		], function(Component){
			oScope.initActivity(Component, p_$xmlActivity, false);
		});
	};
	
	PageAbstract.prototype.initActivity					= function(p_oComponent, p_$xmlActivity, p_bIsSimulation){
		//Logger.logDebug('PageAbstract.initActivity() | Is Simulation = '+p_bIsSimulation);
		var Component		= p_oComponent,
			sQuestionID		= p_$xmlActivity.attr('questionId'),
			//sScoringUID		= this.getDecisionID(this.sGUID) + '_' + sQuestionID,
			sScoringUID		= this.getGUID() + '~' + sQuestionID,
			oComponent		= new Component();
		//console.log('\t initActivity  UID = '+sQuestionID);

		oComponent.addEventListener('ACTIVITY_COMPLETE', this.onActivityComplete );
		oComponent.addEventListener('ACTIVITY_LOADED', this.onActivityLoaded);
		oComponent.addEventListener('RESET_ACTIVITY', this.resetActivityListener);
		
		// ** Storing a reference of the component in the array

		oComponent.init(p_$xmlActivity, this.$domView.find("#"+sQuestionID), this.getGUID(), sScoringUID, p_bIsSimulation , this);
	};
	PageAbstract.prototype.onActivityLoaded				= function(e){
		//Logger.logDebug('PageAbstract.onActivityLoaded() | ');
		var oComponent		= e.target;
        
		oComponent.removeEventListener('ACTIVITY_LOADED', this.onActivityLoaded);
		Logger.logDebug('PageAbstract.onActivityLoaded() | haveAllActivitiesLoaded = '+this.haveAllActivitiesLoaded());
		this.aActivities.push(oComponent);
        this.createDepedentActivity(oComponent);
        if (this.haveAllActivitiesLoaded()) {
            this.bActivityLoaded = true;
        }
		this.checkLoadComplete();
	};
	PageAbstract.prototype.haveAllActivitiesLoaded		= function(){
		//Logger.logDebug('PageAbstract.haveAllActivitiesLoaded() | ');
		/*for (var i=0; i < this.aActivities.length; i++) {
			var oComponent	= this.aActivities[i];
			//Logger.logDebug('\tScoring UID = '+oComponent.getScoringUID()+' : Loaded = '+oComponent.hasLoaded());
			if(!oComponent.hasLoaded()){return false;}
		};
		return true;*/
		/*
		var nNoOfActivities = (this.jsonXMLData.data.activity.length) ? this.jsonXMLData.data.activity.length : 1;
		if(nNoOfActivities === this.aActivities.length){
			return true;
		}
		return false;*/
		if(this.jsonXMLData.data.activity instanceof Array){
			if(this.jsonXMLData.data.activity.length === this.aActivities.length){
				return true;
			}
		}else if(this.jsonXMLData.data.activity instanceof Object){
				return true;
		}
	};
    PageAbstract.prototype.haveAllComponentsLoaded = function() {
        if (this.jsonXMLData.data.component instanceof Array) {
        	Logger.logDebug('haveAllComponentsLoaded  number of components to load = '+this.jsonXMLData.data.component.length+' | '+this.aComponents.length);
            if (this.jsonXMLData.data.component.length === this.aComponents.length) {
                return true;
            }
        } else if (this.jsonXMLData.data.component instanceof Object) {
            return true;
        }
    };

	PageAbstract.prototype.parseComponentNode			= function(){
		var $xmlData			= $(this.xmlData),
			$xmlComponent		= $xmlData.find('component');
		//Logger.logDebug('PageAbstract.parseComponentNode() | No of Components = '+$xmlComponent.length);

		if($xmlComponent.length > 0){
			for(var i=0; i<$xmlComponent.length; i++){
				var $xmlComponentNode	= $($xmlComponent[i]),
					sComponentType		= $xmlComponentNode.attr('type').toUpperCase();
				//Logger.logDebug('\tComponent Type = '+sComponentType+' : DOM View = '+this.$domView[0]);

				// ** Add sections for each Component type
                if (sComponentType === 'TAB') {
                    this.createComponent(this.oComponentClassPath.tab, $xmlComponentNode);
                }
                if (sComponentType === 'ACCORDIAN') {
                    this.createComponent(this.oComponentClassPath.accordian, $xmlComponentNode);
                }
                if (sComponentType === 'STEPBUILDUP') {
                	Logger.logDebug("* STEPBUILDUP * ");
                    this.createComponent(this.oComponentClassPath.stepbuildup, $xmlComponentNode);
                }
				if(sComponentType === 'CLICKANDREVEAL'){
					this.createComponent(this.oComponentClassPath.clickandreveal, $xmlComponentNode);
				}
				if(sComponentType === 'MEDIAPLAYER'){
					this.createComponent(this.oComponentClassPath.mediaplayer, $xmlComponentNode);
				}
                if (sComponentType === 'CAROUSEL') {
                    this.createComponent(this.oComponentClassPath.carousel, $xmlComponentNode);
			}
                if (sComponentType === 'CAROUSELSPEECH') {
                    this.createComponent(this.oComponentClassPath.carouselspeech, $xmlComponentNode);
                    //this.createComponent(this.oComponentClassPath.carousel, $xmlComponentNode);
                }
                if (sComponentType === 'SWIFFY') {
                    this.createComponent(this.oComponentClassPath.swiffy, $xmlComponentNode);
                }
                if (sComponentType === 'MENU') {
                    this.createComponent(this.oComponentClassPath.menu, $xmlComponentNode);
                    //this.createComponent(this.oComponentClassPath.carousel, $xmlComponentNode);
                }
                if (sComponentType === 'ANIMATION') {
                    this.createComponent(this.oComponentClassPath.stepanimation, $xmlComponentNode);
                    //this.createComponent(this.oComponentClassPath.carousel, $xmlComponentNode);
                }
                if (sComponentType === 'CLICKSEQUENCE') {
                    this.createComponent(this.oComponentClassPath.clicksequence, $xmlComponentNode);
                }
                /*merge */
                if(sComponentType === 'ANIMATE'){
					this.createComponent(this.oComponentClassPath.animate, $xmlComponentNode);
				}
				/* -- end --- */
            }
		}else{
            this.bComponentsLoaded = true;
			this.checkLoadComplete();
		}
	};
	PageAbstract.prototype.createComponent				= function(p_jsFilePath, p_$xmlComponent) {
    	//Logger.logDebug('PageAbstract.createComponent() | GUID = '+this.getGUID());
		var oScope	= this;

		require([
			p_jsFilePath
		], function(Component){
			oScope.initComponent(Component, p_$xmlComponent);
		});
	};
    PageAbstract.prototype.initComponent = function(p_oComponent, p_$xmlComponent, p_oCompConfig) {
    	//Logger.logDebug('PageAbstract.initComponent() | GUID = '+this.getGUID() + ' - ');
       	var oCompConfig = (p_oCompConfig) ? p_oCompConfig : {};
        $.each(p_$xmlComponent.get(0).attributes, function(i, attrib) {
            var name	= attrib.name,
				value	= attrib.value;

            oCompConfig[name] = value;
        });
        //Logger.logDebug('PageAbstract.initComponent() | '+JSON.stringify(oCompConfig));

		var Component						= p_oComponent,
			sComponentID					= p_$xmlComponent.attr('componentID');
			oCompConfig['componentUID'] 	= this.getGUID() + '_' + sComponentID;
			oComponent						= new Component();
		//Logger.logDebug('PageAbstract.initComponent() | sComponentID = '+sComponentID+' this.$domView = '+this.$domView[0]);
        oComponent.addEventListener('COMPONENT_INTERACTION_COMPLETE', this.onInteractionComplete);
        oComponent.addEventListener('COMPONENT_LOADED', this.onComponentLoaded);
	oComponent.addEventListener('RESET_ACTIVITY', this.resetActivityListener);
	//cdcd
	oComponent.addEventListener('SHOW_POPUP', this.onShowPopup);
	//cdcd
		
		
		oComponent.addEventListener('TAB_CLICK', this.onTabClick);
		
		
        oComponent.init(sComponentID, oCompConfig, p_$xmlComponent);
	};
	
	
	PageAbstract.prototype.onTabClick			= function(e){
		
	};
	
	//cdcd
	PageAbstract.prototype.onShowPopup			= function(e){
		
	};
	//cdcd
	
	PageAbstract.prototype.onComponentLoaded			= function(e){
		var oComponent = e.target;
		 oComponent.removeEventListener('COMPONENT_LOADED', this.onComponentLoaded);
		// ** Storing a reference of the component in the array
		Logger.logDebug('PageAbstract.onComponentLoaded() | haveAllComponentsLoaded = '+this.haveAllComponentsLoaded());
		this.aComponents.push(oComponent);
        if (this.haveAllComponentsLoaded()) {
            this.bComponentsLoaded = true;
        }
		this.checkLoadComplete();
	};
	/**
	 * Component for Comple 'COMPONENT_INTERACTION_COMPLETE' listener
	 */
	PageAbstract.prototype.onInteractionComplete		= function(e){
		// var oComponent		= e.target,
		// sGUID		= oComponent.getComponentID();
		this.checkAndEnableNext();
	};

	PageAbstract.prototype.addCustomScripts				= function(){
		//Logger.logDebug('PageAbstract.addCustomScripts() | ');
		/*
		 * Any element having class "page-jump" having an attribute "href" pointing to a GUID in the course
		 * will be added a click event to jump to the particular page
		 */
		var oScope = this,
			sJumpID;
		this.$domView.on('click', '.page-jump', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			sJumpID = $(this).attr('href');
			if(sJumpID.indexOf('#') === 0){sJumpID = sJumpID.substring(1, sJumpID.length);}
			//Logger.logDebug('Jump ID = '+sJumpID);
			oScope.jumpToPage(sJumpID);
		});
	};
	PageAbstract.prototype.pageAssetsLoaded				= function(){
		//Logger.logDebug('PageAbstract.pageAssetsLoaded() | ');
		/*this.onCuepointPassed = this.onCuepointPassed.bind(this);
		AudioManager.addEventListener('AUDIO_START', this.onCuepointPassed);
		AudioManager.play();*/
		this.dispatchEvent('PAGE_ASSETS_LOADED', {target:this});
		this.bPageAssetsLoaded = true;
		this.checkLoadComplete();
	};

	PageAbstract.prototype.checkLoadComplete			= function(){
        Logger.logDebug('PageAbstract.checkLoadComplete() | bPageAssetsLoaded = '+this.bPageAssetsLoaded+' : bActivityLoaded = '+this.bActivityLoaded+' : bComponentsLoaded = '+this.bComponentsLoaded+ ' | page ID = '+ this.getGUID());
		//if(this.bActivityLoaded && this.bComponentsLoaded && this.bPageAssetsLoaded && this.bAudiosLoaded){
		if(this.bActivityLoaded && this.bComponentsLoaded && this.bPageAssetsLoaded){
			this.$domView.fadeIn().removeClass('hide').focus();
			// ** Call a Concrete class method to do its stuff and dispatch the 'PAGE_LOADED' event
			this.initialize(true);
			//this.checkAndInitSwiffy();
		}
	};
	/*
	PageAbstract.prototype.checkAndInitSwiffy						= function(p_bAnimate){
		var oComp = this.getComponentByGUID('swiffycontainer_1') || this.getComponentByGUID('swiffycontainer');
	    Logger.logDebug('PageAbstract.checkAndInitSwiffy() | oComp = '+oComp);
		if(oComp && oComp != undefined){
			oComp.component.initiateSwiffy();
		}
	};*/

	// ** Stub Method to be implemented in the Final Page Class
	PageAbstract.prototype.initialize						= function(p_bAnimate){
		//Logger.logDebug('PageAbstract.initialize() ');
		if(p_bAnimate){
			var $animateElements	= this.$domView.find('.animate');
			this.animate(0, $animateElements, {
				opacity: 0
			}, {
				opacity: 1
			}, 600);
		}

		this.dispatchPageLoadedEvent();
		this.checkAndEnableNext();
		this.$domView.parent().scrollTop(0);
		$('html').scrollTop(0);

		this.$domView.focus();
		this.checkAndAddMandatoryEvents();
		/**
	 	* get the playOnload = true Audio list from AudioManager  
	 	*/
		this.aPlayOnLoadList = AudioManager.getPlayOnLoadAudioList();
		/**
	 	* prepared the playOnload = true Components list  
	 	*/
		if(this.aComponents.length>0){
			this.aPlayOnLoadComponentList = this.getPlayOnLoadComponentList();
		}
		this.PlayOnLoadLists(); 
	};

	// ** Called from the 'initialize' method in the concrete classes
	PageAbstract.prototype.dispatchPageLoadedEvent		= function(){
		//Logger.logDebug('PageAbstract.dispatchPageLoadedEvent() | ');
		this.dispatchEvent("PAGE_LOADED");
		//this.dispatchEvent("PAGE_LOADED", {type:'PAGE_LOADED', target:this, GUID:this.getGUID()});
	};
    
    
    
    
	PageAbstract.prototype.createDepedentActivity 			= function(p_oComponent){
        
        for(var i = 0; i < this.aDependentActivities.length; i++){
            var oActivityData = this.aDependentActivities[i],
            activityID = p_oComponent.getQuestionID();
            if(oActivityData.deps.indexOf(activityID ) != -1){
               oActivityData.deps.splice(oActivityData.deps.indexOf(activityID),1);
               if(oActivityData.deps.length == 0){
                   oActivityData.callback.apply(this, oActivityData.arg);
                   this.aDependentActivities.splice(i, 1);
                   i--;
               }
            }
        }	    
	};
	
	PageAbstract.prototype.checkDependentActivities 			= function(p_sList, p_oCallback, p_args){
	   this.aDependentActivities.push({
	       deps : p_sList.split(','),
	       callback:p_oCallback,
	       arg: p_args
	   });
	};
	
	/**
	 * Abstracy activity complete event handler
	 * @param {Object} Event object 
	 */
	PageAbstract.prototype.onActivityComplete 			= function(e){
		var oComponent		= e.target,
			sScoringUID		= e.scoringuid,
			oTrigger		= e.trigger;
		// ** Remove the activity from the Activity List
		var o = this.getActivityByScoringUID(sScoringUID);
		this.aActivitiesCompleted.push(this.aActivities.splice(o.index, 1)[0]);
		this.checkAndEnableNext();

		// ** Destroy the Component
		oComponent.removeEventListener('ACTIVITY_COMPLETE', this.onActivityComplete );
		//check if current activity has a trigger
		if(oTrigger){
			var target = oTrigger.target,
			show,hide,action,condition;// trigger is made of 'action' and 'target'(optional)
			if(oTrigger.target){
				//if trigger has two parts 
				if(oTrigger.target.indexOf(' ') != -1){
					var arr	= oTrigger.target.split(' ');// convert to Array
					action 		= arr[0].trim();// action to be executed i.e. jump
					target 		= (arr.length > 1)? arr[1].trim() : null;// target on with will action will be executed
					condition 	= (arr.length > 2)? arr[2].trim() : null;// target on with will condition will be validated
					
					//Validate condition. Action will be null if condition is not satisfied
					switch(condition){
						case 'correct' :
							action = (oComponent.getScore().getPercentScore() === 100) ? action : null;						
						break;
						case 'incorrect' :
							action = (oComponent.getScore().getPercentScore() < 100) ? action : null;						
						break;
						
					};
					
				};
				
				
				//hide current activitiy 		
				if(action){
					oComponent.getView().addClass('hide');
					var isPage 		=	Globals.isPageGUID(target);
					var isAcitivity	= 	this.getActivityByQuestionID(target);
					var isElement	=  	this.$domView.find(target).length;	
					
					if(action === "show"){
						if(isPage){// target is a Page
							this.jumpToPage(target);
						}else if(isAcitivity){//target is Question ID
							this.getActivityByQuestionID(target).getView().removeClass('hide');
						}else if(isElement){ // target is page element
							var $target = this.$domView.find(target); 
							$target.removeClass("hide");
						}
					}else if(action === 'hide'){
						if(isElement){ // target is page element
							var $target = this.$domView.find(target); 
							$target.addClass("hide");
						}
					}
				}
			}
		}
		this.dispatchActivityCompleteEvent(e);
		//oComponent.destroy();
	};
	
	
	PageAbstract.prototype.dispatchActivityCompleteEvent	= function(e){
		var sScoringUID		= e.scoringuid,
			sDecisionID		= this.getDecisionID(this.getGUID());
		// ** Dispatch Event
		this.dispatchEvent('DECISION_COMPLETE', {type:'DECISION_COMPLETE', target:this, scoringuid:sScoringUID, GUID:this.getGUID(), decisionID:sDecisionID});
	};

    PageAbstract.prototype.areComponentsVisited			= function() {
    	var result = true;
    	for(var i =0; i < this.aComponents.length; i++ ){
    		if(!this.aComponents[i].isComplete() && this.aComponents[i].isMandatory()){
    			result = false;
    			break;
    		}
    	}
    	//Logger.logDebug('areComponentsVisited : \n\t this.aComponents.length  = '+ this.aComponents.length +' \n\t result = '+ result);
    	return result;
    };
    
    /**
     * This function is called onces on page load. Loop thru all ".tis-event" elements. 
     * Add all to mandatory event list and remove them on click event
     */
    PageAbstract.prototype.checkAndAddMandatoryEvents	= function() {
    	if(this.getPageStatus() == 2)return;
    	var oScope 	= this;
    	this.$domView.find('.tis-event').each(function(element){
    		oScope.aMandatoryEvents.push($(this).attr('id'));
    		$(this).click(function(){
    			var index = oScope.aMandatoryEvents.indexOf($(this).attr('id'));
    			if(index != -1){
	    			oScope.aMandatoryEvents.splice(index,1);
	    			oScope.checkAndEnableNext();
    			}
    		});
    	});
    };
    
    /**
     * Check current page Navigation mode and enable/disale "Next" button 
     */
    
	PageAbstract.prototype.checkAndEnableNext			= function(){
        var sEnableNext = CourseConfig.getConfig('enable_next_status').status,
        completionMode = CourseConfig.getConfig('page_completion_mode').value,
        nPageStatus    = this.getPageStatus(),
        //nPageStatus 	= '1';//this.getPageStatus(),
        bComplete = (nPageStatus!=2) ? false : true,
        bNextEnable		= false,
        bComp			= this.areComponentsVisited(),
        bEvt			= !this.aMandatoryEvents.length,
        bAct			= this.checkActivityCompletionStatus();
        bAudio			= this.checkAudioCompletionStatus();
		if(nPageStatus==0){
        this.setPageStatus(1);
		}

		if(completionMode === '1'){/** Enable "Next" button always */
			bComplete = true;
		}else if(completionMode === '2' && bAct ){/** On all activities completed */
			bComplete = true;
		}else if(completionMode === '3' && bComp && bEvt){/** On activities and components completed/attempted*/
			bComplete = true;
		}else if(completionMode === '4' && bAct && bComp && bEvt){/** On activities, components and mandatory events completed/attempted*/
			bComplete = true;
		}		
		
        if(bComplete){
             this.setPageStatus(2);
        }
        
        
        if(sEnableNext === '1'){
        	bNextEnable = true;
		}else if(sEnableNext === '2' && bAct && bComp && bAudio  && bEvt){
        	bNextEnable = true;
		}else if(sEnableNext === '3' && bComplete ){
        	bNextEnable = true;
        }
        
	    this.enableNext(bNextEnable);
	    
	    if(CourseConfig.getConfig('logger').debug ==="true")
	    this.reportPendingTasks();
	};

	/** 
	 *if pending activity is mandatory, page is incomplete 
	 */
	PageAbstract.prototype.checkActivityCompletionStatus						= function(){
		var result = true;
		for (var i=0; i < this.aActivities.length; i++) {
		  	var act 	=  this.aActivities[i];
		  	if(!act.attempted && act.mandatory){
		  		result  = false;
		  	}
		};
		
		return result;
	};
	PageAbstract.prototype.reportPendingTasks						= function(){
		this.report.comp = [];
		this.report.act = [];
		this.report.evt = this.aMandatoryEvents.splice(0);
		
		var i;
    	for( i =0; i < this.aComponents.length; i++ ){
    		if(!this.aComponents[i].isComplete()){
    			if(this.aComponents[i].mandatory){
    				this.report.comp.push(this.aComponents[i].getComponentID());
    			}    			
    		}
    	}

    	for( i =0; i < this.aActivities.length; i++ ){
    		if(!this.aActivities[i].attempted && this.aActivities[i].mandatory){
	    		this.report.act.push(this.aActivities[i].getQuestionID());    			
    		}
    	}

	};
	

	// ** Public Methods to be used by the Final Classes
	/*
	 * @ p_nDuration - In MilliSeconds
	 */
	PageAbstract.prototype.animate						= function(p_nIndex, p_$animateElements, p_oFromCSS, p_oToCSS, p_nDuration, p_oScope, p_fCallback, p_aArgs){
		//Logger.logDebug('PageAbstract.animate() | Index = '+p_nIndex+' : Length = '+p_$animateElements.length);
		var $animatedElement	= $(p_$animateElements[p_nIndex]),
			nMilliSeconds		= p_nDuration || 600,
			oScope				= this;
		$animatedElement.css(p_oFromCSS).removeClass('hide').animate(p_oToCSS, nMilliSeconds, function(e) {
			//Logger.logDebug(p_$animateElements.length+' === '+p_nIndex);
			if(p_nIndex < (p_$animateElements.length-1)){
				var nNewIndex = p_nIndex + 1;
				oScope.animate(nNewIndex, p_$animateElements, p_oFromCSS, p_oToCSS, nMilliSeconds, p_oScope, p_fCallback, p_aArgs);
			}else{
				if(p_oScope && p_fCallback){
					p_fCallback.apply(p_oScope, (p_aArgs || []));
				}
			}
		});
	};

    PageAbstract.prototype.getActivityByScoringUID = function(p_sScoringUID) {
    	// ** Return the only activity present in a page if not Scoring UID parameter is passed
    	if(p_sScoringUID === undefined && this.aActivities.length === 1){return {activity: this.aActivities[0], index: 0};}

    	if(p_sScoringUID === undefined){Logger.logWarn('PageAbstract.getActivityByScoringUID() | WARN: Scoring UID parameter expected'); return null;}
		var result,i,oActivity;
        for (i = 0; i < this.aActivities.length; i++) {
            oActivity = this.aActivities[i];
            if (p_sScoringUID === oActivity.getScoringUID()) {
                result =  {activity: oActivity, index: i};
            }
        };
          if(!result){
        	for (i = 0; i < this.aActivitiesCompleted.length; i++) {
            	oActivity = this.aActivitiesCompleted[i];
            	if (p_sScoringUID === oActivity.getScoringUID()) {
            	    result = {activity: oActivity, index: i};
            	}
        	};
        }
        
        return result;
	};

    PageAbstract.prototype.getActivityByQuestionID = function(p_sID) {
    	var result,i,oComponent;
        for (i = 0; i < this.aActivities.length; i++) {
            oComponent = this.aActivities[i];
            if (p_sID === oComponent.getQuestionID()) {
                result = oComponent;
            }
        };
        if(!result){
        	for (i = 0; i < this.aActivitiesCompleted.length; i++) {
            	oComponent = this.aActivitiesCompleted[i];
            	if (p_sID === oComponent.getQuestionID()) {
            	    result = oComponent;
            	}
        	};
        }
        return result;
    };
    PageAbstract.prototype.getComponentByGUID= function(p_sGUID) {
    	//Logger.logDebug('PageAbstract.getComponentByGUID() | p_sGUID = '+ p_sGUID);
    	// ** Return the only activity present in a page if not Scoring UID parameter is passed
    	if(p_sGUID === undefined && this.aComponents.length === 1){return {component: this.aComponents[0], index: 0};}

    	if(p_sGUID === undefined){Logger.logWarn('PageAbstract.getComponentByGUID() | WARN: Component GUID parameter expected'); return null;}

        for (var i = 0; i < this.aComponents.length; i++) {
            var oComponent = this.aComponents[i];
	    	//Logger.logDebug('getComponentByGUID | oComponent = '+ oComponent.getComponentID() +' | '+p_sGUID);
            if (p_sGUID === oComponent.getComponentID()) {
                return {component: oComponent, index: i};
            }
        };
    };
	PageAbstract.prototype.getElementByID				= function(p_sID, sFunctionScope){
		var $elem = Globals.getElementByID(this.$domView, p_sID, (sFunctionScope || 'PageAbstract.getElementByID() | ')+'ID = '+p_sID);
		return $elem;
	};
	PageAbstract.prototype.getElementByClass			= function(p_sClassName, sFunctionScope){
		var $elem = Globals.getElementByClassName(this.$domView, p_sClassName, (sFunctionScope || 'PageAbstract.getElementByClass() | ')+'ID = '+p_sClassName);
		return $elem;
	};

	/**
	 * For publishing events for other objects to listen
	 * @param p_sEvent : The Event identifier to broadcast
	 */
	// ** TODO: Modify this to use "EventDispatcher" instead of "pubsub"
	PageAbstract.prototype.dispatchEvent				= function(p_sEvent, p_oEventObject){
		//Logger.logDebug('PageAbstract.dispatchEvent() | Event Object = '+p_oEventObject);
		(p_oEventObject) ? EventDispatcher.prototype.dispatchEvent.call(this, p_sEvent, p_oEventObject) : $.publish(p_sEvent);
	};
	
	/**
	 * Returns GUID i.e. 'cw01~cw01~pg01' of current page 
	 */
	PageAbstract.prototype.getGUID						= function(){
	    //Logger.logDebug('GUID = '+this.sGUID);
	    //return this.sGUID.replace(/@_@/g, '~');
	    return this.sGUID;
	};
	PageAbstract.prototype.getCustomGUID				= function(p_sReplaceWith){
	    //Logger.logDebug('GUID = '+this.sGUID);
	    //return this.sGUID.replace(/@_@/g, p_sReplaceWith);
	    return this.sGUID.replace(/~/g, p_sReplaceWith);
	};

	PageAbstract.prototype.getDecisionID				= function(p_sGUID){
	    return p_sGUID.substring(p_sGUID.lastIndexOf('~')+1, p_sGUID.length);
	};
	
	/**
	 * Returns content (cdata) of a 'PageText' node in page xml 
	 * @param {String}  p_sPageTextNodeIDOrClass  Id or  class of a "pageText" node
	 * @returns {String}
	 */
	PageAbstract.prototype.getXMLContent 				= function(p_sPageTextNodeIDOrClass){
		//Logger.logDebug('PageAbstract.getXMLContent() | Page text ID = '+p_sPageTextNodeIDOrClass/*+' : '+JSON.stringify(this.jsonXMLData)*/);
		var aPageText	= this.jsonXMLData.data.pageText;
		if(this.isArray(aPageText)){
			for(var i=0; i<aPageText.length; i++){
				var oPageText	= aPageText[i];
				if(oPageText._id === p_sPageTextNodeIDOrClass || oPageText._class === p_sPageTextNodeIDOrClass){
					return oPageText.__cdata;
				}
			}
		}else{
			if(aPageText._id === p_sPageTextNodeIDOrClass || oPageText._class === p_sPageTextNodeIDOrClass){
				return aPageText.__cdata;
			}
		}
		Logger.logWarn('PageAbstract.getXMLContent() | WARN: Page Text node with ID "'+p_sPageTextNodeIDOrClass+'" not found.');
	};

	PageAbstract.prototype.isArray						= function(p_aValue){
		var bIsArray	= (p_aValue.length) ? true : false;
		return bIsArray;
	};

	/* ***********************************
	 			Popup methods
	   *********************************** */
	PageAbstract.prototype.addLongDescription			= function(){
		var oScope			= this,
			$anchorElem,
			sAnchorTitle,
			$img,
			sAltTxt;

		this.$imgLongDescAnchors	= Globals.getElement(this.$domView, 'a.dlink, button.dlink', 'PageAbstract.addLongDescription');
		//Logger.logDebug('PageAbstract.addLongDescription() | Long Desc Anchors  = '+this.$imgLongDescAnchors.length);
		this.$imgLongDescAnchors.each(function(index, elem){
			$anchorElem		= $(this);
			sAnchorTitle	= $anchorElem.attr('title');
			$img			= Globals.getElementByID(oScope.$domView, $anchorElem.attr('data-imgid'), 'PageAbstract.addLongDescription');
				sAltTxt			= $img.attr('alt');

			$anchorElem.attr({
				'title'				: sAnchorTitle + sAltTxt,
				'role'				: 'button'
			});
			//Logger.logDebug('PageAbstract.addLongDescription() | Href = '+$anchorElem.attr('href'));
			$(this).on('click', function(e){
				oScope.openLongDescription(e);
			});
		});
	};
	PageAbstract.prototype.openLongDescription			= function(e){
		e.preventDefault();
		var $anchorLink	= $(e.target),
            sLongDescElemID	= $anchorLink.attr('href'),
            oPopup			= this.openPopup('longdescription', $anchorLink.attr('title'), sLongDescElemID, $anchorLink);
        //Logger.logDebug('PageAbstract.openLongDescription() | sLongDescElemID = '+sLongDescElemID);
	};
	/**
	 * Open popup
	 * @param {String} p_sPopupID - Popup ID.
	 * @param {String} p_sTitle - Popup Title.
	 * @param {String} p_sContent - Popup Content.
	 * @param {jQuery} p_$returnFocusTo - jQuery element to return focus when popup is closed.
	 * @param {String} p_sClassesToAdd - Special style(class) to be applyed to popup skin.
	 * @param {Function} p_fCallback - Callback function when popup is closed.
	 * @param {Array} p_aArgs - Callback function Arugments. To persist data while popup is open.
	 *  
	 */
	PageAbstract.prototype.openPopup					= function(p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd, p_fCallback, p_aArgs){
		//Logger.logDebug('PageAbstract.openPopup() | '+p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd);
		var currentAudioID = AudioManager.getCurrentAudioID();
		AudioManager.pauseAudio(currentAudioID);
		oPopup	= PopupManager.openPopup(p_sPopupID, {txt_title:p_sTitle, txt_content:p_sContent}, p_$returnFocusTo, p_sClassesToAdd);
		oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
		oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
        if (p_fCallback) {
            oPopup.setCallback(this, p_fCallback, p_aArgs);
        }
		return oPopup;
	};
	/**
	 * Close popup with specific ID
	 * @param {String} p_sPopupID 
	 */
	PageAbstract.prototype.closePopup					= function(p_sPopupID){
		//Logger.logDebug('PageAbstract.closePopup() | Popup ID = '+p_sPopupID);
		return PopupManager.closePopup(p_sPopupID);
	};
	/**
	 * Close all popups with specific type
	 * @param {String} p_sType Popup type 
	 */
	PageAbstract.prototype.closeAllPopups				= function(p_sType){
		//Logger.logDebug('PageAbstract.closeAllPopups() | Popup Type = '+p_sType);
		return PopupManager.closeAll(p_sType);
	};
	
	/**
	 * Returns 'true' if Popup with ID is open
	 * @param {String} p_sPopupID Popup ID
	 * @returns {Boolean} 
	 */
    PageAbstract.prototype.isPopupOpen					= function(p_sPopupID) {
    	return PopupManager.isOpen(p_sPopupID);
    };
	PageAbstract.prototype.popupEventHandler			= function(e){
		var sEventType	= e.type,
			oPopup		= e.target,
			sPopupID	= oPopup.getID();
		//Logger.logDebug('PageAbstract.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

		if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE'){
			oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
			oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
            if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
		}
        }
	};

	// ** UI Audio Button Handlers
	PageAbstract.prototype.uiPlayPauseHandler			= function(e){
		Logger.logDebug('PageAbstract.uiPlayPauseHandler() | from = '+ e.name + ' with  type =  '+ e.type);
		var sEventType	= e.type;
		switch(sEventType){
			case 'PLAY_AUDIO':
				this.playAudio();
				break;
			case 'PAUSE_AUDIO':
				this.pauseAudio();
				break;
		}
	};
	/* ***********************************
	 		Audio Manager methods
	   *********************************** */
	PageAbstract.prototype.onAudioLoaded				= function(e){
		//Logger.logDebug('PageAbstract.onAudioLoaded() | soundID = '+e.soundID);
	};
	PageAbstract.prototype.onPreloadAudiosLoaded		= function(e){
		//Logger.logDebug('PageAbstract.onPreloadAudiosLoaded() | '+this.toString());
		AudioManager.removeEventListener('PRELOAD_AUDIOS_LOADED', this.onPreloadAudiosLoaded);
		this.bAudiosLoaded = true;
		//this.checkLoadComplete();
	};
	PageAbstract.prototype.onAllAudiosLoaded			= function(e){
		//Logger.logDebug('PageAbstract.onAllAudiosLoaded() | ');
		AudioManager.removeEventListener('ALL_AUDIOS_LOADED', this.onAllAudiosLoaded);
	};
	PageAbstract.prototype.onCuepointPassed				= function(e){
		//Logger.logDebug('PageAbstract.onCuepointPassed() | Sound ID = "'+e.soundID+'" : Position = "'+e.position+'" : Label = "'+e.cueLabel);
		var $elemList	= Globals.getElementByClassName(this.$domView, e.cueLabel, 'PageAbstract.onCuepointPassed()');
		$elemList.fadeIn();
		$("."+e.cueLabel).removeClass('deactive');
	};
	
	PageAbstract.prototype.onAudioComplete				= function(e){
		Logger.logDebug('PageAbstract.onAudioComplete() | Sound ID = "'+e.soundID);
		// fine the default Audio and play it in one by one
		this.PlayOnLoadLists();
		this.checkAndEnableNext();
	};
	
	/**
	 * Listen to components for 'RESET_ACTIVITY' event. 
	 * i.e. clickAndReveal will notify page to reset activites in popup element once it is opened.
	 */
	PageAbstract.prototype.resetActivityListener		= function(e){
		for (var i=0; i < this.aActivitiesCompleted.length; i++) {
		  	var act = this.aActivitiesCompleted[i],
		  	quesID	= act.getQuestionID();
		  	if(e.questionID === quesID){
		  		act.resetAttemptNumber();
		  		act.resetScore();
		  		act.resetOptions();
		  		this.resetActivity(quesID);
		  		break;
		  	}
		};	
		for (var i=0; i < this.aActivities.length; i++) {
		  	var act = this.aActivities[i],
		  	quesID	= act.getQuestionID();
		  	if(e.questionID === quesID){
		  		act.resetAttemptNumber();
		  		act.resetScore();
		  		act.resetOptions();
		  		break;
		  	}
		};	
	};
	
	/**
	 * Reset activity listeners and default params
	 * @param {Object/String}   
	 */
	PageAbstract.prototype.resetActivity				= function(p_act){
		/** if param is question ID ,  get Activity Object to process**/
		var activity,quesID,i;
		if(typeof p_act === 'string'){
			for (i=0; i < this.aActivities.length; i++) {
		  		activity 	= this.aActivities[i];
		  		quesID		= activity.getQuestionID();
		  		if(p_act === quesID){
		  			p_act =  activity;
		  			activity.resetAttemptNumber();
			  		activity.resetScore();
			  		activity.resetOptions();
					activity.hideAnswers();
		  			break;
		  		}
			}
			
			
			for (i=0; i < this.aActivitiesCompleted.length; i++) {
		  		activity = this.aActivitiesCompleted[i],
		  		quesID	= activity.getQuestionID();
		  		if(p_act === quesID){
		  			
		  			p_act =  activity;
		  			p_act.index = i;
		  			activity.resetAttemptNumber();
			  		activity.resetScore();
			  		activity.resetOptions();
					activity.hideAnswers();
		  			this.aActivities.push(this.aActivitiesCompleted.splice(i, 1)[0]);
		  			break;
		  		}
			}
		}
		if(!p_act.hasEventListener('ACTIVITY_COMPLETE' ,this.onActivityComplete )){
			p_act.addEventListener('ACTIVITY_COMPLETE', this.onActivityComplete );
		}
	};
	
	/**
	 * Play audio. 
	 * @param {String} AudioID 
	 */
	PageAbstract.prototype.playAudio					= function(p_sAudioID){
		Logger.logDebug('PageAbstract.playAudio() | sAudioID = '+p_sAudioID);
		if(p_sAudioID === undefined || typeof p_sAudioID !== 'string'){
			Logger.logWarn('PageAbstract.playAudio() | WARN: The parameter passed needs to be a valid sound ID.');
			//return;
		}
		AudioManager.playAudio(p_sAudioID);
	};
	
	/**
	 * Pause if audio is playing
	 * @param {String} Audio ID
	 */
	PageAbstract.prototype.pauseAudio					= function(p_sAudioID){
		Logger.logDebug('PageAbstract.pauseAudio() | sAudioID = '+p_sAudioID);
		if(p_sAudioID === undefined || typeof p_sAudioID !== 'string'){
			Logger.logWarn('PageAbstract.pauseAudio() | WARN: The parameter passed needs to be a valid sound ID.');
			//return;
		}
		AudioManager.pauseAudio(p_sAudioID);
	};
	
	/**
	 * 	Returns 'true' if specified audio is playing 
	 * @returns {Boolean} 
	 */
	PageAbstract.prototype.isAudioPlaying				= function(p_sAudioID){
			return AudioManager.isPlaying();
	};
	
	/**
	 * Set volume of currently playing audio 
	 */
	PageAbstract.prototype.setVolume					= function(p_nVolume){
		AudioManager.setVolume(p_nVolume);
	};
	PageAbstract.prototype.enableAudioControls			= function(p_bEnable){
		UIManager.enableAudioControls(p_bEnable);
	};
	
	/**
	 * Stops currently playing audio 
	 */
	PageAbstract.prototype.stopAudio					= function(e){
		AudioManager.stop();
	};
	PageAbstract.prototype.getSoundIdAtIndex			= function(p_nIndex){
		var $xmlData	= $(this.xmlData),
		$xmlSounds	= $xmlData.find('sounds > sound');
		if($xmlSounds.length > p_nIndex){
			return $xmlSounds.eq(p_nIndex).attr('id');
		}
		return '';
	};
	/*
	PageAbstract.prototype.onCuepointPassed				= function(e){
			//Logger.logDebug('PageAbstract.onCuepointPassed() | '+JSON.stringify(e));
		if(this.bFadeInText){
			var $txtElement	= Globals.getElementByID(this.$domView, e.txtID, 'PageAbstract.onCuepointPassed()');
			$txtElement.fadeIn();
		}
		};*/

	/* ***********************************
	 		UI Manager methods
	   *********************************** */
	PageAbstract.prototype.enableBack					= function(p_bEnable){
		//Logger.logDebug('PageAbstract.enableBack() | Enable = '+p_bEnable);
		UIManager.enableBack(p_bEnable);
	};
	PageAbstract.prototype.enableNext					= function(p_bEnable){
		UIManager.enableNext(p_bEnable);
	};
	PageAbstract.prototype.setContentScroll				= function(p_bFlag){
		UIManager.setContentScroll(p_bFlag);
	};
	PageAbstract.prototype.addUIListener				= function(p_sEventType, p_fEventHandler){
		var nListenerIndex	= this.aUIListeners.indexOf(p_sEventType);
		//Logger.logDebug('PageAbstract.addUIListener() | nListenerIndex = '+nListenerIndex);
		if(nListenerIndex < 0){
			UIManager.addEventListener(p_sEventType, p_fEventHandler);
			this.aUIListeners.push({
				type:p_sEventType,
				method:p_fEventHandler
			});
		}
	};
	PageAbstract.prototype.removeUIListener				= function(p_sEventType, p_fEventHandler){
		var nListenerIndex	= this.aUIListeners.indexOf(p_sEventType);
		//Logger.logDebug('PageAbstract.removeUIListener() | nListenerIndex = '+nListenerIndex);
		if(nListenerIndex > -1){
			UIManager.removeEventListener(p_sEventType, p_fEventHandler);
			this.aUIListeners.splice(nListenerIndex, 1);
		}
	};
	/**
	 * Exit Course
	 */
	PageAbstract.prototype.exitCourse					= function(){
		// TODO UIManager is undefined, Added patch here. Need to be fixed properly
		require(['framework/viewcontroller/UIManager'], function(UIManager){
			UIManager.exitCourse();
		});
	};
	PageAbstract.prototype.setPageNumber				= function(p_sText){
		UIManager.setPageNumber(p_sText);
	};

    /* ***********************************
	 		Course Controller methods
	   *********************************** */
	
	/**
	 * Reload current page. 
	 */
	PageAbstract.prototype.reloadPage					= function(){
		//Logger.logDebug('PageAbstract.reloadPage() | ');
		this.CourseControllerRef.reloadPage();
	};
	
	/**
	 * Navigate to next page.
	 */
	PageAbstract.prototype.navigateNext					= function(){
		//Logger.logDebug('PageAbstract.navigateNext() | ');
		this.CourseControllerRef.loadNextFile();
	};
	
	/**
	 * Navigate to previous page.
	 */
	PageAbstract.prototype.navigateBack					= function(){
		//Logger.logDebug('PageAbstract.loadPrevFile() | ');
		this.CourseControllerRef.loadPrevFile();
	};

	/**
	 * Navigate to a page {@link PageModel}.
	 * @param {String} p_sPageGUID Page GUIDi i.e. 'cw0~cw01~pg01'  
	 */
	PageAbstract.prototype.jumpToPage					= function(p_sPageGUID){
		//Logger.logDebug('PageAbstract.jumpToPage() | Page GUID =  '+ p_sPageGUID);
		this.CourseControllerRef.jumpToPage(p_sPageGUID);
	};
	
	/**
	 * Navigate to a CW {@link CWModel}
	 * @param {String} CW GUIDi i.e. 'cw0~cw01'  
	 */
	PageAbstract.prototype.jumpToCW						= function(p_sCWGUID){
		//Logger.logDebug('PageAbstract.jumpToCW() | p_sCWGUID  =  '+p_sCWGUID);
		this.CourseControllerRef.jumpToCW(p_sCWGUID);
	};
	
	/**
	 * Returns current page  {@link PageModel} label
	 * @returns {String} 
	 */
	PageAbstract.prototype.getCurrentPageLabel			= function(){
		//Logger.logDebug('PageAbstract.getCurrentPageLabel() | ');
		return this.CourseControllerRef.getCurrentPageLabel();
	};
	
	/**
	 * Returns current topic (CW) {@link CWModel} label
	 * @returns {String} 
	 */
	PageAbstract.prototype.getCurrentCWLabel			= function(){
		//Logger.logDebug('PageAbstract.getCurrentCWLabel() | ');
		return this.CourseControllerRef.getCurrentCWLabel();
	};
	
	/**
	 * Returns current Page status | 0 = 'not visited |  1 = 'incompete' | 2 = 'complete'
	 * @returns {Number}   
	 */
	PageAbstract.prototype.getPageStatus				= function(){
		//Logger.logDebug('PageAbstract.getPageStatus() | ');
		if(this.CourseControllerRef){
			return this.CourseControllerRef.getPageStatus(this.getGUID());
		}
		return 2;
	};
	/**
	 * For setting the status of the page as notstarted(0), incomplete(1), & completeted (2)
	 * @param {String} p_nStatus The numeric status value to be set for the Page
	 */
	PageAbstract.prototype.setPageStatus				= function(p_nStatus){
		//Logger.logDebug('PageAbstract.setPageStatus() | Status = '+p_nStatus);
        if (this.CourseControllerRef) {
            this.CourseControllerRef.setCurrentPageStatus(p_nStatus);
        }else{
        	CourseModel.findPage(this.getGUID()).setPageStatus(p_nStatus);
        }
	};
	
	/**
	 * Returns Array of {@link PageModel} from current CW {@link CWModel}
	 * returns {Array} 
	 */
	PageAbstract.prototype.getChildPagesInCurrentCW		= function(){
		//Logger.logDebug('PageAbstract.getChildPagesInCurrentCW() | ');
		var sParentGUID = this.CourseControllerRef.getCurrentPage().getParentCWGUID();
		//sParentGUID = "cw01~cw01~cw01"
		var aPageModels = this.CourseControllerRef.getChildPages(sParentGUID);
		//alert(aPageModels.length)
		return aPageModels;
	};
	
	/**
	 * Returns {@link PageModel} for last page in current CW {@link CWModel}
	 * @returns {Object}  {@link PageModel}
	 */
	PageAbstract.prototype.getCWLastPage				= function(){
		//Logger.logDebug('PageAbstract.getCWLastPage() | ');
		var sParentGUID = this.CourseControllerRef.getCurrentPage().getParentCWGUID();
		var oPageModel	= this.CourseControllerRef.getCWLastPage(sParentGUID);
		return oPageModel;
	};
	
	/**
	 * Returns {@link PageModel} for given page GUID
	 * @param {String} p_sGUID page GUID i.e. 'cw01~cw01~pg01'
	 * @returns {Object} {@link PageModel} 
	 */
	PageAbstract.prototype.getPageModelByGUID			= function(p_sGUID){
		//Logger.logDebug('PageAbstract.getPageModelByGUID() | ');
		var oPageModel	= this.CourseControllerRef.getPageModelByGUID(p_sGUID);
		return oPageModel;
	};

	/* ***********************************
	 		Variable Manager methods
	   *********************************** */
	/**
	 * Setting Variables for later retrieval
	 * @param {String} p_sKey : Identifier holding the variable value
	 * @param {Object}p_value : the value for the identifier
	 */
	PageAbstract.prototype.setVariable					= function(p_sKey, p_value){
		//Logger.logDebug('PageAbstract.setVariable() | ');
		VariableManager.setVariable(p_sKey, p_value);
	};
	/**
	 * Getting Variables set earlier
	 * @param {String} p_sKey : Identifier holding the variable value
	 * #return {Object} 
	 */
	PageAbstract.prototype.getVariable					= function(p_sKey){
		//Logger.logDebug('PageAbstract.getVariable() | ');
		return VariableManager.getVariable(p_sKey);
	};

	/**
	 * Destroys the Page Object
	 */
	PageAbstract.prototype.destroy						= function(){
		//Logger.logDebug('PageAbstract.destroy() | ');
        var oScope = this,
        	oComponent,
        	oActivity,
        	i;
		try{
            UIManager.removeEventListener('PLAY_AUDIO', this.uiPlayPauseHandler);
            UIManager.removeEventListener('PAUSE_AUDIO', this.uiPlayPauseHandler);
			this.$imgLongDescAnchors.each(function(index, elem){
				$(this).off();
			});
        } catch (e) {
            Logger.logWarn('PageAbsctract.destroy() | No Play / Pause Audio listeners found for this page.');
        }

		// ** Call Destroy on components
        for (i = 0; i < this.aComponents.length; i++) {
            try {
                oComponent = this.aComponents[i];
                oComponent.destroy();
                oComponent = null;
            } catch (e) {
            //	Logger.logWarn('PageAbsctract.destroy() | Method named "destroy" not implemented for "'+oComponent.toString()+'" component.');
            }
        };
        // ** Call Destroy on Activities
        for (i = 0; i < this.aActivities.length; i++) {
			try{
                oActivity = this.aActivities[i];
                oActivity.destroy();
                oActivity = null;
            } catch (e) {
            	//Logger.logWarn('PageAbsctract.destroy() | Method named "destroy" not implemented for "'+oActivity.toString()+'" activity.');
            }
		};
        // ** Call Destroy on completed Activities
        for (i = 0; i < this.aActivitiesCompleted.length; i++) {
			try{
                oActivity = this.aActivitiesCompleted[i];
                oActivity.destroy();
                oActivity = null;
            } catch (e) {
            	//Logger.logWarn('PageAbsctract.destroy() | Method named "destroy" not implemented for "'+oActivity.toString()+'" activity.');
            }
		};

		// ** Rmove UI EventListeners
        for (i = 0; i < this.aUIListeners.length; i++) {
			try{
				this.removeUIListener(this.aUIListeners[i].type, this.aUIListeners[i].method);
			}catch(e){}
		};
		AudioManager.removeEventListener('AUDIO_LOADED', this.onAudioLoaded);
		AudioManager.removeEventListener('PRELOAD_AUDIOS_LOADED', this.onPreloadAudiosLoaded);
		AudioManager.removeEventListener('ALL_AUDIOS_LOADED', this.onAllAudiosLoaded);
		AudioManager.removeEventListener('CUEPOINT_PASSED', this.onCuepointPassed);
		AudioManager.removeEventListener('AUDIO_FINISH', this.onAudioComplete);

		//Globals.removeChildSafe(this.$domView[0]);
		//this.$domView.innerHTML = '';
		this.$domView.remove();
		//this.$domView				= null;
		this.$imgLongDescAnchors	= null;
		this.CourseControllerRef 	= null;
		this.sGUID					= null;
		this.xmlData				= null;
		this.jsonXMLData 			= null;
		this.bFadeInText			= null;
		this.bPageAssetsLoaded		= null;
		this.bActivityLoaded		= null;
		this.bComponentsLoaded		= null;
		this.aActivities			= null;
		this.aComponents			= null;
		this.aUIListeners			= null;
		this.oActivityClassPath		= null;
		this.oComponentClassPath	= null;
		EventDispatcher.prototype.destroy.call(this);

		this.prototype		= null;
	};

    PageAbstract.prototype.isPageVisited 				= function(p_sPageID) {
        return this.CourseControllerRef.getCWStatus(p_sPageID);
    };
    //Rajib 10Jun
    PageAbstract.prototype.getTopicStatus 				= function(p_sCWGUID) {
        var sParentGUID = p_sCWGUID;
        sParentGUID = "cw01~cw01~cw02"
        var aPageModels = this.CourseControllerRef.getChildPages(sParentGUID);
        var tempScore = 0
        for (var i = 0; i < aPageModels.length; i++)
        {
            //tempStr = tempStr+aPageModels[i].getPageStatus()
            if (aPageModels[i].getPageStatus() !== 0) {
                tempScore++
            }

        }
        var tempPer = Math.round((tempScore / aPageModels.length) * 100)
        //alert(tempScore)
        alert(tempPer)
        return tempPer;
    };
    PageAbstract.prototype.getLearnerName 				= function(p_sCWGUID) {
        return this.CourseControllerRef.getLearnerName();
    };
    
   	/**
	 * Play page level audios with 'playOnLoad' property true. Once page audios are completed, look for component level audio and play the  audio list 
	 * 
 	 */
	PageAbstract.prototype.PlayOnLoadLists			= function(){
		var oScope = this;
		if (this.aPlayOnLoadList && this.aPlayOnLoadList.length > 0){
			var audioPlay = this.aPlayOnLoadList[0];
			this.aPlayOnLoadList.splice(0,1);		
			AudioManager.playAudio(audioPlay);
	        return;
	    }
		if(oScope.aPlayOnLoadComponentList && oScope.aPlayOnLoadComponentList.length>0){
	   		setTimeout(function(){
		       	oScope.aPlayOnLoadComponentList[0].setComponentActive(true);
		    	oScope.aPlayOnLoadComponentList[0].playCurrentAudio();
		    	oScope.aPlayOnLoadComponentList.splice(0,1);
		    }, 2000);
	    }
	};
	
	/**
	 * Create Array of component nodes with 'playOnLoad' is true.  
	 */
	PageAbstract.prototype.getPlayOnLoadComponentList			= function(){
		var aPlayOnLoadComponentList = [];
		// first component then Activity
		for(var i = 0; i < this.aComponents.length; i++){
			var Comp = this.aComponents[i];
			if(Comp.oConfig.audioPlayOnload){
				aPlayOnLoadComponentList.push(Comp);
			}
		}
		return aPlayOnLoadComponentList;
	};

    /**
	 * Returns true if all Mandatory page level audios are played 
	 */
	PageAbstract.prototype.checkAudioCompletionStatus						= function(){
		var result = true;
		var aAudios = AudioManager.getAudiosList();
		for(var sSoundID in aAudios){
		  	var audio 	=  aAudios[sSoundID];
		  	if(!audio.complete && audio.mandatory){
		  		result  = false;
		  		break;
		  	}
		}
		return result;
	};
    
    /**
	 * hide current audio screen elements which need to sync  
	 */
    	PageAbstract.prototype.hideScreenElements				= function(e){
		//var sAudioSinking = CourseConfig.getConfig('audio_sync').value;
		var className = AudioManager.getAllCueLabel(e.soundID);
		for (var i=0; i<className.length; i++)
		{
			this.$domView.find('.'+className[i]).css('display', 'none');
		}
	};
    
    
    PageAbstract.prototype.toString 					= function() {
        return 'framework/viewcontroller/PageAbstractController';
    };

	return PageAbstract;
});
