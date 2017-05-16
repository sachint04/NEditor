define([
	'jquery',
	'framework/model/CourseConfigModel',
	'framework/controller/CourseController',
	'framework/utils/EventDispatcher',
	'framework/utils/ResourceLoader',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, CourseConfig, CourseController, EventDispatcher, ResourceLoader, Globals, Logger){
	function Popup(){
		//Logger.logDebug('Popup.CONSTRUCTOR() | ');
		EventDispatcher.call(this);

		this.$popup;
		this.$elemToReturnFocus;
		this.popupID;
		this.sType;
		this.bIsModal;
		this.bEscapeKeyEnabled;
		this.aButtonList;
		this.nDepth;
		this.nFocusIndex;
		this.bTitleFound;
		this.aClassList = [];
		this.oData = {};
		this.aPlaceholders	= [];
		this.aMediaElements	= [];
		this.oContext;
		this.fCallback;
		this.aArgs;

		this.bReplaceContextOfPageCSSBgImg		= Globals.sanitizeValue(CourseConfig.getConfig('css_background_image').replaceImgContext, false);
		this.bBrowserMatchesForReplaceContext	= Globals.matchBrowser(CourseConfig.getConfig('css_background_image').browserVersions);

		this.oPageController;
		this.onPageLoaded	= this.onPageLoaded.bind(this);
	}

	Popup.prototype								= Object.create(EventDispatcher.prototype);
	Popup.prototype.constructor					= Popup;

	Popup.prototype.init						= function(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList){
		this.$popup				= p_$domPopup;
		this.popupID 			= p_sID;
		this.sType		 		= p_sType || 'default';
		this.nDepth				= p_nDepth || 7;
		this.bEscapeKeyEnabled	= (p_bEscapeKeyEnabled != null) ? p_bEscapeKeyEnabled : true;
		this.bIsModal			= (p_bIsModal != null) ? p_bIsModal : true;
		//Logger.logDebug('Popup.init() | '+p_sID+' : '+this.bIsModal);
		this.aButtonList		= p_aButtonIDList || [];

		this.$popup.addClass('tis-popup').prepend('<div id="aria_inst" class="visually-hidden"></div>');
		//this.$popup.wrap('<div class="popup-bg"></div>');
	};

	Popup.prototype.show						= function(p_oData, p_sClass){
		//Logger.logDebug('Popup.show() | p_sClass = '+p_sClass);
		var oScope				= this;
		this.bTitleFound		= false;

		this.updateContent(p_oData);

		for(var i=0; i<this.aButtonList.length; i++){
			//Logger.logDebug('Popup.show() | Btn List Class = '+this.aButtonList[i]);
			var $btn	= Globals.getElementByID(this.$popup, this.aButtonList[i], 'Popup.show()');
			$btn.attr({
				'role'		: 'button'
			}).on('click', function(e){
				oScope.handleEvent(e);
			});/*.on('keydown', function(e){
				oScope.handleKeyboardEvents(e);
			});*/
		}
		this.nFocusIndex = -1;

		// ** Add Style
		if(p_sClass){this.addClass(p_sClass);}


		var aMediaElements 		= $(document).find("audio,video");
		if(aMediaElements.length>0){
			for(i=0;i<aMediaElements.length;i++){
				var oMediaElement = aMediaElements[i];

				if (!oMediaElement.paused) {
					this.aMediaElements.push(oMediaElement);
					oMediaElement.pause();
				}
			}
		}
		else{
			if(aMediaElements&&aMediaElements.length!=0){
				var oMediaElement = aMediaElements.get(0);

				if (!oMediaElement.paused) {
					this.aMediaElements.push(oMediaElement);
					oMediaElement.pause();
				}
			}
		}



		return this.$popup;
	};

	Popup.prototype.updateContent				= function(p_oData){
		// Logger.logDebug('updateContent() p_oData = '+ JSON.stringify(p_oData));
		this.$popup.hide();
		for(var prop in p_oData){
			var $txt				= Globals.getElementByID(this.$popup, prop, 'Popup.show()'),
				bClassRemoved		= false,
				bDisplayPropChanged	= false,
				sContent			= p_oData[prop],
				bIsFilePath			= false,//Globals.isFilePath(sContent),
				bIsJQueryObj		= Globals.isJQueryObject(sContent),
				bIsID				= Globals.isID(sContent),
				bIsClass			= Globals.isClass(sContent),
				bIsPageModel		= Globals.isPageObject(sContent),
				sPlaceHolderID;
			// Logger.logDebug('Popup.updateContent() | \n\tElement ID = '+prop+' | Content | Is File Path = '+bIsFilePath+' : Is JQuery Obj = '+bIsJQueryObj+' : Is Page Model = '+bIsPageModel+' : Is ID = '+bIsID+' : Is Class = '+bIsClass+' | sContent = '+sContent);

			if(bIsFilePath){
				// ** If the Content is an HTML | GIF | JPG |  PNG File Path, then load it
				// ** TODO: Handle Oepening PDF files
				this.loadResource(sContent, this, this.contentLoaded, [$txt]);
			}else if(bIsJQueryObj || bIsID || bIsClass){
				var sPlaceHolderID	= "placeholder_"+Globals.getRandomID(10),
					$content;
				if(bIsJQueryObj){
					// ** If the Content is a jQuery object
					$content	= sContent;
				}else if(bIsID){
					// ** If the Content is a ID
					$content	= $(Globals.getElementByID($, sContent.substring(1, sContent.length), 'Popup.show()'));
				}else if(bIsClass){
					// ** If the Content is a Class
					$content	= $(Globals.getElementByClassName($, sContent.substring(1, sContent.length), 'Popup.show()'));
				}

				if($content.hasClass('hide')){$content.removeClass('hide');bClassRemoved = true;}
				if($content.css('display') === 'none'){$content.css('display', 'block');bDisplayPropChanged = true;}

				// ** Create a place holder at the same DOM location
				$content.wrap('<div id="'+sPlaceHolderID+'"></div>');
				// **  Detach the content to show in the pop-up
				$content		= $content.detach();

				this.aPlaceholders.push({
					placeHolderID		: sPlaceHolderID,
					$content			: $content,
					classRemoved		: bClassRemoved,
					displayPropChanged	: bDisplayPropChanged
				});

				this.populateContent($txt, $content);
				this._displayReady();
			}else if(bIsPageModel){
				//Logger.logDebug('before load page $txt  = '+ $txt[0])
				this.loadPage($txt, sContent);
				this._displayReady();
			}else{
				// ** The Content is a String
				this.populateContent($txt, sContent);
				this._displayReady();
			}
		}
	};
	Popup.prototype.loadPage					= function(p_$txt, p_oPageModel){
		//Logger.logDebug('Popup.loadPage() | ');
		// ** TODO : Quick fix for accessing UIManager
		require([
			'framework/viewcontroller/UIManager'
		], function(UIManager){
			UIManager.showPreloader(true);
		});
		var oScope			= this,
			sJSFilePath		= Globals.getFile(p_oPageModel, 'js_location', 'Popup.show() | "sJSFilePath" '),
			sCSSFilePath	= Globals.getFile(p_oPageModel, 'css_location', 'Popup.show() | "sCSSFilePath" '),
			sXMLFilePath	= Globals.getFile(p_oPageModel, 'xml_location', 'Popup.show() | "sXMLFilePath" '),
			sHTMLFilePath	= Globals.getFile(p_oPageModel, 'html_location', 'Popup.show() | "sHTMLFilePath" ');

		require([
			'../'+sJSFilePath
		], function(PageController){
			var oRl = new ResourceLoader();
			oRl.loadResource([sHTMLFilePath, sXMLFilePath, sCSSFilePath],
							 oScope,
							 function(p_oScope, p_aResources, p_oResourceLoader, PageController, sCSSFilePath, p_oPageModel, p_$txt){
								oScope.initializePage(p_aResources, p_oResourceLoader, PageController, sCSSFilePath, p_oPageModel, p_$txt);
							 },
							 [PageController, sCSSFilePath, p_oPageModel, p_$txt]);
		});
	};
	Popup.prototype.initializePage				= function(p_aResources, p_oResourceLoader, PageController, p_cssPath, p_oPageModel, p_$txt){
		//Logger.logDebug('Popup.onPageLoad() | PageController = '+PageController+' | p_oScope = '+ this);
		var domPage						= p_aResources[0],
			xmlData						= p_aResources[1],
			cssData						= p_aResources[2];
		$.subscribe('PAGE_LOADED', this.onPageLoaded);
		//Logger.logDebug('\tPage Model = '+p_oPageModel+' : GUID = '+p_oPageModel.getGUID());
		//console.log('CHECK :: '+this.bReplaceContextOfPageCSSBgImg+' :: '+this.bBrowserMatchesForReplaceContext);
		if(this.bReplaceContextOfPageCSSBgImg  && this.bBrowserMatchesForReplaceContext){
			cssData = Globals.replaceContextOfCSSBgImages(cssData);
		}
		this.oPageController			= new PageController(null, p_$txt, domPage, xmlData, {cssPath:p_cssPath, cssData:cssData}, p_oPageModel.getGUID());
		this.oPageController.init();

		/*
		if(!oPageController instanceof PageAbstractController){
			Logger.logError('Popup.initializePage() | Invalid Page Object at "'+oPageController.getGUID()+'". The Page Controller type mentioned in the course XML for a page needs to extend the "PageAbstractController" Object.');
		}*/

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
	};
	Popup.prototype.onPageLoaded 				= function(e){
		//Logger.logDebug('Popup.onPageLoaded() | ');
		var oScope	= this;
		// ** TODO : Quick fix for accessing UIManager
		require([
			'framework/viewcontroller/UIManager'
		], function(UIManager){
			UIManager.showPreloader(false);
			oScope._displayReady();
		});
		$.unsubscribe('PAGE_LOADED', this.onPageLoaded);
	};
	Popup.prototype.loadResource				= function(p_aResourceList, p_oContext, p_fCallback, p_aArgs){
		var oContext				= p_oContext,
			fCallback				= p_fCallback,
			aArgs					= p_aArgs || [];

		var oRL	= new ResourceLoader();
		oRL.loadResource(p_aResourceList, oContext, fCallback, aArgs);
	};
	Popup.prototype.contentLoaded				= function(p_oScope, p_htmlData, p_oResourceLoader, p_$txt){
		//Logger.logDebug('Popup.contentLoaded() | Element ID = '+p_$txt.attr('id')+' : HTML DATA = '+p_htmlData);
		this.populateContent(p_$txt, p_htmlData[0]);
		this._displayReady();
		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
	};

	Popup.prototype.populateContent				= function(p_$txt, p_sContent){
		//Logger.logDebug('Popup.populateContent() | Element ID = '+p_$txt.attr('id')+' : Element Content = '+p_sContent);
		p_$txt.html(p_sContent);
		if(!this.bTitleFound){
			var sTagName		= p_$txt[0].tagName,
				nHeadingLevel	= Number(sTagName.substring(1, sTagName.length));
			//Logger.logDebug('Popup.populateContent() | Tag Name = '+sTagName+' : Heading Level = '+(nHeadingLevel));
			//if(p_$txt[0].indexOf('title') > -1 && !bTitleFound){this.$popup.attr('aria-labelledby', p_sContent);}
			//if(p_$txt[0].indexOf('title') > -1 && !bTitleFound){this.$popup.attr('aria-label', , p_sContent);}
			if(sTagName.length == 2 && sTagName.indexOf('H') == 0 && (nHeadingLevel > 0 && nHeadingLevel < 7)){
				this.updateARIAText(nHeadingLevel, p_sContent);
				this.bTitleFound = true;
			}
		}
	};

	Popup.prototype._displayReady				= function(){
		this.$popup.fadeIn('fast');
	};

	Popup.prototype.updateARIAText				= function(p_nHeadingLevel, p_sHeadingTxt){
		//Logger.logDebug('Popup.updateARIAText() | Heading Level = '+(p_nHeadingLevel)+' : Heading Text = '+p_sHeadingTxt);
		var sHiddenText	= 'Beginning of dialog window. It begins with a heading '+p_nHeadingLevel+' called '+p_sHeadingTxt+'.',
			$hiddenText	= Globals.getElementByID(this.$popup, 'aria_inst', 'Popup.updateARIAText');

		if(this.bIsModal){sHiddenText += 'Escape will cancel and close the window.';}
		$hiddenText.html(sHiddenText);
	};

	Popup.prototype.hide						= function(){
		//Logger.logDebug('Popup.hide() |');
		var oScope				= this,
			aButtonListLength	= this.aButtonList.length,
			aClassListLength	= this.aClassList.length,
			aPlaceholdersLength	= this.aPlaceholders.length,
			i;

		for(i=0; i<aPlaceholdersLength; i++){
			//Logger.logDebug('\tplaceHolderID = '+this.aPlaceholders[i].placeHolderID);
			var oPointer			= this.aPlaceholders[i],
				placeHolderID		= oPointer.placeHolderID,
				$content			= oPointer.$content,
				bClassRemoved		= oPointer.classRemoved,
				bDisplayPropChanged	= oPointer.displayPropChanged;

			if(bClassRemoved){$content.addClass('hide');}
			if(bDisplayPropChanged){$content.css('display', 'none');}

			$('#'+placeHolderID).replaceWith($content.detach());

			placeHolderID 	= null;
			$content		= null;
		}
		this.aPlaceholders = [];

		// ** If its a Page Object, then call destroy
		if(this.oPageController){
			this.oPageController.destroy();
			this.oPageController = undefined;
		}
		for(i=0; i<aButtonListLength; i++){
			var $btn	= Globals.getElementByID(this.$popup, this.aButtonList[i], 'Popup.hide()');
			$btn.off('click');
		}

		this.dispatchEvent('POPUP_CLOSE', {type:'POPUP_CLOSE', target:this, eventSrc:this.getID(), elemToReturnFocus:this.$elemToReturnFocus});

		// ** Callback if a function is registered
		if(this.fCallback){
			this.aArgs.unshift(this);
			this.fCallback.apply(this.oContext, this.aArgs);

			this.oContext = null;
			this.fCallback = null;
			this.aArgs = null;
		}

		// ** Do Clean-ups
		this.$popup.find('#txt_content').empty();

		for(i=0; i<aClassListLength; i++){
			var sClassName = this.aClassList[i];
			this.$popup.removeClass(sClassName);
		}
		this.aClassList = [];
		this.clearData();
	};

	Popup.prototype.handleEvent					= function(e){
		//Logger.logDebug('Popup.handleEvent() | Target = '+e.target.getAttribute('id'));
		$(e.target).blur();
		//this.hide();
		this.dispatchEvent('POPUP_EVENT', {type:'POPUP_EVENT', target:this, eventSrc:e.target.getAttribute('id'), elemToReturnFocus: this.$elemToReturnFocus});
	};

	Popup.prototype.handleKeyboardEvents		= function(e){
		//Logger.logDebug('Popup.handleKeyboardEvents() | Target = '+e.target.id);

	};

	Popup.prototype.setPopupPosition			= function(){
		//this.$popup.css('top',5000000000);
		var oScope	= this,
			/*x		= ($(window).width() / 2) - (this.$popup.width() / 2),
			y		= ($(window).height() / 2) - (this.$popup.height() / 2),*/
			x		= ($('#application').width() / 2) - (this.$popup.width() / 2),
			y		= ($('#application').height() / 2) - (this.$popup.height() / 2);
		//Logger.logDebug('Popup.centerPopup() | \n\tWindow width = '+$('#application').width()+' : Window Height = '+$('#application').height()+'\n\tPopup Width = '+this.$popup.width()+' : Popup Height = '+this.$popup.height()+'\n\t x = '+x+' : y = '+y);
		this.$popup.css({
			'left'		: x,
			'top'		: y,
			'margin'	: '0 auto'
		}) ;
		this.$popup.fadeIn("slow", function(){oScope.$popup.show();});
	};

	Popup.prototype.getID						= function(){return this.popupID;};
	Popup.prototype.setID						= function(p_sID){
		this.popupID = p_sID;
	};

	Popup.prototype.getElemToReturnFocus		= function(){return this.$elemToReturnFocus;};
	Popup.prototype.setElemToReturnFocus		= function(p_$elemToReturnFocus){
		this.$elemToReturnFocus = p_$elemToReturnFocus;
	};

	Popup.prototype.getType						= function(){return this.sType;};
	Popup.prototype.setType						= function(p_sPopupType){
		this.sType = p_sPopupType;
	};

	Popup.prototype.getDepth					= function(){return this.nDepth;};

	Popup.prototype.isModal						= function(){return this.bIsModal;};
	Popup.prototype.setModal					= function(p_bModal){
		this.bIsModal = p_bModal;
	};

	Popup.prototype.isEscapeKeyEnabled			= function(){return this.bEscapeKeyEnabled;};
	Popup.prototype.setEscapeKeyEnabled			= function(p_bEscapeKeyEnabled){
		this.bEscapeKeyEnabled = p_bEscapeKeyEnabled;
	};

	Popup.prototype.getFocUsIndex				= function(){return this.nFocusIndex;};
	Popup.prototype.setFocusIndex				= function(p_nFocusIndex){
		this.nFocusIndex = p_nFocusIndex;
	};

	Popup.prototype.addClass					= function(p_sClassName){
		if(this.aClassList.indexOf(p_sClassName) > -1){return;}
		this.$popup.addClass(p_sClassName);
		this.aClassList.push(p_sClassName);
	};
	Popup.prototype.setStyle					= function(p_oStyles){
		this.$popup.css(p_oStyles);
	};
	Popup.prototype.width						= function(){
		return this.$popup.width();
	};
	Popup.prototype.height						= function(){
		return this.$popup.height();
	};
	Popup.prototype.hasClass					= function(p_sClassName){
		return this.$popup.hasClass(p_sClassName);
	};

	Popup.prototype.getButtonList				= function(){return this.aButtonList;};

	Popup.prototype.getData						= function(p_sProp){
		//Logger.logDebug('Popup.getData() | '+this.getID()+' : Prop = '+p_sProp+' : Data = '+JSON.stringify(this.oData));
		var data = this.oData[p_sProp];
		if(!data){Logger.logWarn('Popup.getData() | WARN: No data found for "'+p_sProp+'".'); return;}
		return data;
	};
	Popup.prototype.setData						= function(p_sProp, p_value){
		if(this.oData[p_sProp]){Logger.logWarn('Popup.setData() | WARN: Overwiting data for "'+p_sProp+'".');}
		this.oData[p_sProp] = p_value;
		//Logger.logDebug('Popup.setData() | '+this.getID()+' : Prop = '+p_sProp+' : Value = '+JSON.stringify(p_value)+' : Data = '+JSON.stringify(this.oData));
	};
	Popup.prototype.clearData					= function(p_sProp){
		if(this.oData[p_sProp]){
			this.oData[p_sProp]	= null;
			return;
		}
		for(var sProp in this.oData){
			this.oData[sProp] = null;
		}
		this.oData = {};
		//Logger.logDebug('Popup.clearData() | '+this.getID()+' : Prop = '+p_sProp+' : Data = '+JSON.stringify(this.oData));
	};

	Popup.prototype.getView					= function(){
		return this.$popup;
	};
	Popup.prototype.setCallback					= function(p_oContext, p_fCallback, p_aArgs){
		if(!p_oContext || !p_fCallback){
			Logger.logError('Popup.setCallback() | ERROR: Invalid Parameters. Pass a Scope and a Callback Mehod as parameters.');
		}
		this.oContext = p_oContext;
		this.fCallback = p_fCallback;
		this.aArgs = p_aArgs || [];
	};

	Popup.prototype.destroy						= function(){
		this.$popup					= null;
		this.$elemToReturnFocus		= null;
		this.popupID				= null;
		this.sType					= null;
		this.bIsModal				= null;
		this.bEscapeKeyEnabled		= null;
		this.aButtonList			= null;
		this.nDepth					= null;
		this.nFocusIndex			= null;
		this.bTitleFound			= null;

		this.oData					= null;

		this.oContext				= null;
		this.fCallback				= null;
		this.aArgs					= null;
		this.aClassList				= null;
		this.aPlaceholders	= null;
	};

	Popup.prototype.toString					= function(){
		return 'framework/core/Popup';
	};

	return Popup;
});
