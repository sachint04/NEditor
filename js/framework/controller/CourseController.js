	'use strict';
	/**
	 * 
	 * @exports framewrok/controller/CourseController
	 * @requires module:framework/viewcontroller/UIManager
	 * @requires module:framework/model/CourseConfigModel
	 * @requires module:framework/utils/ResourceLoader
	 * @requires module:framework/core/ActivityMarkupCollection
	 * @requires module:framework/viewcontroller/PageAbstractController
	 * @requires module:framework/model/CourseModel
	 * @requires module:framework/core/PopupManage
	 * @requires module:framework/core/AudioManager
	 * @requires module:framework/utils/globals'
	 * @requires module:framework/utils/Logger'
	 */
define([
    'jquery',
    'xml2json',
    'framework/utils/EventDispatcher',
    'framework/model/CourseConfigModel',
    'framework/utils/ResourceLoader',
    'framework/core/ActivityMarkupCollection',
    'framework/viewcontroller/UIManager',
    'framework/viewcontroller/PageAbstractController',
    'framework/model/CourseModel',
    'framework/core/PopupManager',
    'framework/core/AudioManager',
	'framework/utils/globals',
    'framework/utils/Logger'
], 
function($, xml2json, EventDispatcher, CourseConfig, ResourceLoader, ActivityMarkupCollection, UIManager, PageAbstractController, CourseModel, PopupManager, AudioManager, Globals, Logger){
	
	  /**
	   *@static 
	   */
    var __instanceCourseController;
	
   	var bReplaceContextOfPageCSSBgImg;
	var bBrowserMatchesForReplaceContext;
	/**
	 *  CourseController Module controls Course navigation
 	 * CourseController is a Singleton imeplementation. Can be accessed from any where 
 	 * 
     * @constructor 
     * @alias CourseController
     */
    function CourseController(){
		 /** property {Object} PageAbstractController {@link PageAbstractController} */
       	EventDispatcher.call(this);
       	this.oPageController  	= null;
       	this.onConfigReady 		= this.onConfigReady.bind(this);
       	this.loadCourseXML 		= this.loadCourseXML.bind(this);
	    this.createUI 			= this.createUI.bind(this);
	    this.onUICreated 		= this.onUICreated.bind(this);
	    this.onPrev 			= this.loadPrevFile.bind(this);
        this.onNext 			= this.loadNextFile.bind(this);
        this.onCourseExit 		= this.onCourseExit.bind(this);
        this.onCourseResumePopup = this.onCourseResumePopup.bind(this);
        this.onPageLoaded 		= this.onPageLoaded.bind(this);


	    this.loadLanguageSelection = this.loadLanguageSelection.bind(this);
    	this.attacUserAgentEvents();
    }
	
	CourseController.prototype								= Object.create(EventDispatcher.prototype);
	CourseController.prototype.constructor					= CourseController;
	
	/**
	 * Intialize. Used 'pubsub' library in some of the parts 
 	 */
    CourseController.prototype.init = function(p_sConfigXMLURL) {
        $.subscribe('COURSE_CONFIG_LOADED', this.onConfigReady);
        CourseConfig.load(p_sConfigXMLURL);
    };
	
	/**
	 * @ e {Object} Event listener 
	 */
    CourseController.prototype.onConfigReady = function(e) {
        //Logger.logDebug('CourseController.onConfigReady() | SELF = '+oScope.toString());
        $.unsubscribe('COURSE_CONFIG_LOADED', this.onConfigReady);

        var jsonRef;
        // ** Initialize Logger
        //jsonRef = CourseConfig.getConfig('logger');
        //var showLogger = (jsonRef.debug == "true") ? true : false;

        this.loadLanguageSelection();
        PopupManager.init();
    };

	/**
	 * Update language settings. 
	 */	
    CourseController.prototype.loadLanguageSelection = function() {
		bReplaceContextOfPageCSSBgImg		= Globals.sanitizeValue(CourseConfig.getConfig('css_background_image').replaceImgContext, false);
		bBrowserMatchesForReplaceContext	= Globals.matchBrowser(CourseConfig.getConfig('css_background_image').browserVersions);
        var language = CourseConfig.getConfig('language');
        if (language instanceof Array) {
            // TODO: Load an HTML Page for Language Selection & listen for an event to trigger the loadCourseXML() call
            $.subscribe('LANGUAGE_SELECTED', this.loadCourseXML);
        } else {
            this.loadCourseXML(null, language.suffix);
        }
    };

   /**
    * Load 'course.xml' 
    */
    CourseController.prototype.loadCourseXML = function(e, p_sSelectedLanguage) {
        //Logger.logDebug('CourseController.loadCourseXML() | Language Selected = '+p_sSelectedLanguage);
        var oScope = this;
        if (p_sSelectedLanguage) {
            CourseConfig.setSelectedLanguage(p_sSelectedLanguage);
        }
        // ** Load Course XML
        var courseXMLPath = this.getRootPath() + this.getConfig('course_xml').fileURL,
                sActivityHTMLPath = this.getRootPath() + this.getConfig('activitymarkup').view;
        var rl1 = new ResourceLoader();
        rl1.loadResource([courseXMLPath, sActivityHTMLPath], oScope, this.createCourseModel);
    };
	
	/**
	 * CourseModel created. Refer {@link CourseModel}
	 * @param {Object} p_oScope Current scope
	 * @param {Object}  p_aResources Data sesources.xml
	 * @param {Object}  p_oResourceLoader {@link ResourceLoader}
	 */
    CourseController.prototype.createCourseModel = function(p_oScope, p_aResources, p_oResourceLoader) {
        ActivityMarkupCollection.init(p_aResources[1]);
        $.subscribe("COURSE_MODEL_CREATED", this.createUI);
        CourseModel.init(p_aResources[0]);

        p_oResourceLoader.destroy();
        p_oResourceLoader = null;
    };
	
	/**
	 * Initiate global UI creation by making calls on {@link UIManager}
	 * @param {Object} e  'pubsub' event object
	 * 
	 */
    CourseController.prototype.createUI 			= function(e) {
        $.unsubscribe("COURSE_MODEL_CREATED");
        UIManager.addEventListener("UI_CREATED", this.onUICreated);
        UIManager.addEventListener("PREVIOUS_CLICK", this.onPrev);
        UIManager.addEventListener("NEXT_CLICK", this.onNext);
        UIManager.addEventListener("EXIT_COURSE", this.onCourseExit);
        UIManager.addEventListener("RESUME_COURSE", this.onCourseResumePopup);
        UIManager.addEventListener("RESTART_COURSE", this.onCourseResumePopup);

        /*$.subscribe("UI_CREATED", onUICreated);
         $.subscribe("PREVIOUS_CLICK", loadPrevFile);
         $.subscribe("NEXT_CLICK", loadNextFile);*/
        UIManager.init();
    };

    /**
     * Exit Course 
     */
    CourseController.prototype.onCourseExit 	= function(e) {
        //Logger.logDebug('CourseController.onCourseExit()');
        $.publish('EXIT_COURSE');
    };
	
	/**
	 *	'Listener' Global UI ready Listener
	 * @private 
	 */
    CourseController.prototype.onUICreated 	= function() {
        //Logger.logDebug('CourseController.onUICreated()');
        UIManager.removeEventListener("UI_CREATED", this.onUICreated);
        UIManager.updateCourseTitle(CourseModel.getCourseTitle());
        AudioManager.init();
        $.unsubscribe("UI_CREATED");
        $.publish("COURSE_CONTROLLER_CREATED");
    };
	
	/**
	 * @param {Object} p_oBookmarkData Update course state by parsing bookmark data recevied from LSM 
	 */
    CourseController.prototype.parseBookmarkData 	= function(p_oBookmarkData) {
        //Logger.logDebug('CourseController.parseBookmarkData() | '+JSON.stringify(p_oBookmarkData));
        if (p_oBookmarkData !== null) {
            CourseModel.parseBookmarkData(p_oBookmarkData);
        }
    };
	
	
    CourseController.prototype.getBookmarkData 		= function() {
        var oBookmarkData = CourseModel.getBookmarkData();
        //Logger.logDebug('CourseController.getBookmarkData() | '+JSON.stringify(oBookmarkData));
        return oBookmarkData;
    };

   	/**
   	 * Returns first Page  {@link PageModel} PageModel object in current CWModel.
   	 * 
   	 */
    CourseController.prototype.findCWFirstPage 		= function() {
    	return CourseModel.findCWFirstPage();
    };
    
    /**
     *  Course resume popup close event listener 
     */
    CourseController.prototype.onCourseResumePopup 		= function(e) {
        if (e.type === 'RESUME_COURSE') {
            this.launchCourse();
        } else {
            CourseModel.setCurrentPage(CourseModel.findCWFirstPage());
            this.launchCourse();
        }
    };
	
	/**
	 * Page launch sequence initiated.  
	 */
    CourseController.prototype.launchCourse 		= function() {
        this.loadPage(CourseModel.getCurrentPage());
		if(typeof window.onorientationchange != 'undefined'){
            $(window).trigger('resize');
		}
    };
	
	/**
	 * Page Assests load start.
	 * @param {Object}  p_oPageModel  Read {@link PageModel} and dependecies  
	 */
    CourseController.prototype.loadPage  	= function(p_oPageModel) {
        //Logger.logDebug('CourseController.loadPage() | GUID = '+p_oPageModel.getPageID()+' : View Type = '+p_oPageModel.getViewType()+' : Type = '+p_oPageModel.getPageType()+' : Label = '+p_oPageModel.getPageLabel()+' : Back GUID = '+p_oPageModel.getBackToPageGUID()+' : CSS File = '+p_oPageModel.getCSSFileName());
        var oScope = this;
		
		PopupManager.closeAll();
		UIManager.closeUtility();
		
        UIManager.showPreloader(true);

        var sSCOContentRoot = CourseConfig.getRootPath(),
                sParentCWPath = p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
                sJSFilePath = this.getLocation(sParentCWPath, 'js_location', p_oPageModel.getScriptFileName()),
                oResourcePaths = {
                    view: this.getLocation(sParentCWPath, 'html_location', p_oPageModel.getPageID(), 'html'),
                    data: this.getLocation(sParentCWPath, 'xml_location', p_oPageModel.getPageID(), 'xml'),
                    css: this.getLocation(sParentCWPath, 'css_location', p_oPageModel.getCSSFileName(), 'css')
                };

        // TODO: Dispatch VIEW STATE CHANGE event if the Page Model view type is different than the previous Pages View Type
        //var sViewType	= p_oPageModel.getViewType();
        //Logger.logDebug('CourseController.loadPage() | \n\tJS = "'+sJSFilePath+'"\n\tXML = "'+oResourcePaths.data+'"\n\tHTML = "'+oResourcePaths.view+'\n\tCSS = "'+oResourcePaths.css+'"');

        if (sJSFilePath) {
            require([
                '../' + sJSFilePath
            ], function(PageController) {
                var oRl = new ResourceLoader();
                oRl.loadResource(oResourcePaths, oScope, oScope.onPageLoad, [PageController, oResourcePaths.css]);
            });
        } else {
            var oRl = new ResourceLoader();
            oRl.loadResource(oResourcePaths, oScope, oScope.onPageLoad, [PageAbstractController, oResourcePaths.css]);
        }
    };
    
    CourseController.prototype.getLocation 		= function(p_sParentCWPath, p_sFileLocation, p_sFileName, p_sExtension) {
        if (p_sFileName) {
			if(p_sExtension){p_sFileName = p_sFileName + '.' + p_sExtension;}
			var rootPath = CourseConfig.getRootPath(); 
			var jsloc = CourseConfig.getConfig(p_sFileLocation).globalURL; // global js path
			if(jsloc && jsloc.trim() != "" && p_sFileLocation === "js_location"){// if global page js path defined
				if(rootPath.indexOf('/'+jsloc) == -1){//if current js path doesnt match with global js path
					rootPath = rootPath.substr(0, rootPath.indexOf('/')+1) + jsloc; // replace local path to global path
				}
			};
            return  rootPath + CourseConfig.getConfig(p_sFileLocation).folderURL + p_sParentCWPath + p_sFileName;
        }
        return null;
    };

    CourseController.prototype.updateNavigationState  = function() {
        if (CourseModel.isNextAvailable()) {
            UIManager.enableNext(true);
        } else {
            UIManager.enableNext(false);
        }
        if (CourseModel.isBackAvailable()) {
            UIManager.enableBack(true);
        } else {
            UIManager.enableBack(false);
        }
        UIManager.showUI(true);
    };

    CourseController.prototype.onPageLoad = function(p_oScope, p_aResources, p_oResourceLoader, PageController, cssPath) {
        var domPageView = p_aResources.view,
                xmlPageData = p_aResources.data,
                cssPageData = p_aResources.css,
                $domPageHolder = $('#content_wrapper > #content');
        //Logger.logDebug('CourseController.onPageLoad() | '+cssPageData);
        //Logger.logDebug('CourseController.onPageLoad() | Scope = '+p_oScope+' : GUID = '+CourseModel.getCurrentPage().getGUID()+' : Resources = '+p_aResources);
		if(bReplaceContextOfPageCSSBgImg  && bBrowserMatchesForReplaceContext){
			cssPageData = Globals.replaceContextOfCSSBgImages(cssPageData);
		}
        $.subscribe('PAGE_LOADED', this.onPageLoaded);
        if (this.oPageController) {this.unloadCurrentPage();}

        this.oPageController = new PageController(this, $domPageHolder, domPageView, xmlPageData, {cssPath:cssPath, cssData:cssPageData}, CourseModel.getCurrentPage().getGUID());
        this.oPageController.init();

        if (!this.oPageController instanceof PageAbstractController) {
            Logger.logError('CourseController.onPageLoad() | Invalid Page Object at "' + CourseModel.getCurrentPage().getGUID() + '". The Page Controller type mentioned in the course XML for a page needs to extend the "PageAbstractController" Object.');
        }

        p_oResourceLoader.destroy();
        p_oResourceLoader = null;
    };

    CourseController.prototype.onPageLoaded = function(e) {
        //Logger.logDebug('CourseController.onPageLoaded() | ');
        $.unsubscribe("PAGE_LOADED");
        this.updateNavigationState();
        $.publish("VIEW_STATE_CHANGE");
        UIManager.showPreloader(false);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|windows phone|Opera Mini/i.test(navigator.userAgent)) {
            UIManager.swipe();
        }
	
		UIManager.updateTopicTitle(CourseModel.getTopicTitle());
        $('#content_wrapper > #content').focus();
        this.dispatchEvent('PAGE_LOADED', {type:'PAGE_LOADED', target:this});
    };

    CourseController.prototype.unloadCurrentPage = function() {
        //Logger.logDebug('CourseController.unloadCurrentPage() | ');
        AudioManager.destroyPlayList();
        this.oPageController.destroy();
        this.oPageController = null;
        //Foundation.libs.dropdown.close($('.dropdown'));
    };

    CourseController.prototype.getPageNumbers = function() {
        //way 1
        //        var hierarchyLevel = getCurrentCWHierarchy();
        //        switch (hierarchyLevel) {
        //            case "level2":
        //                name = "page_num_display";
        //                var sLevel = getConfig(name).hierarchyLevel,
        //                        oPageNumInfo = CourseModel.getPagesForHierarchyLevel(sLevel);
        //                break;
        //            default:
        //                oPageNumInfo = CourseModel.getPagesForHierarchyLevel(hierarchyLevel);
        //        }

        //way 2-- independent of course_config.xml, works similar to way1
        var sLevel = CourseConfig.getConfig("page_num_display").hierarchyLevel ,
            oPageNumInfo = CourseModel.getPagesForHierarchyLevel(sLevel);
        return oPageNumInfo;
    };

    CourseController.prototype.getAllPageModels = function() {
        var aPageModels = CourseModel.getAllPageModels();
        //Logger.logDebug('CourseController.getAllPageModels() | Page Models = ' + aPageModels);
        return aPageModels;
    };

    CourseController.prototype.loadNextFile = function() {
        //Logger.logDebug('CourseController.loadNextFile() | '+this.toString());
        var oCurrPage = CourseModel.getCurrentPage(),
                nextPage = oCurrPage.sJumpToPageGUID;
        if (nextPage == "") {
            if (CourseModel.navigate('NEXT')) {
                this.loadPage(CourseModel.getCurrentPage());
            }
        }
        else {
            this.jumpToPage(nextPage);
        }
    };

   CourseController.prototype.loadPrevFile = function() {
        //Logger.logDebug('CourseController.loadPrevFile() | '+this.toString());
        var oCurrPage = CourseModel.getCurrentPage(),
                prevPage = oCurrPage.sBackToPageGUID;
        if (prevPage == "") {
            if (CourseModel.navigate('BACK')) {
                this.loadPage(CourseModel.getCurrentPage());
            }
        }
        else {
            this.jumpToPage(prevPage);
        }
    };
    CourseController.prototype.isNextAvailable = function() {
        //Logger.logDebug('CourseController.isNextAvailable() | '+this.toString());
        return CourseModel.isNextAvailable();
    };
   CourseController.prototype.isBackAvailable = function() {
        //Logger.logDebug('CourseController.isBackAvailable() | '+this.toString());
        return CourseModel.isBackAvailable();
    };

    /**
     * Jump to a specific page, GUID passed as param.
     * @param {String}	p_sPageGUID Page GUID to jump to.
     *  	
     */
    CourseController.prototype.jumpToPage = function(p_sPageGUID) {
        //Logger.logDebug("CourseController.jumpToPage() "+p_sPageGUID);
        var oPageModel = CourseModel.findPage(p_sPageGUID);
        // to save the last visited page when navigated from glossary -- Pooja
        if(typeof oPageModel != "undefined" && oPageModel != null && oPageModel.sPageID=="glossary")
        {
            
            Globals.setVariable("lastPage", CourseModel.getCurrentPageGUID());
        }
        CourseModel.setCurrentPage(oPageModel);
        this.loadPage(oPageModel);
    };

    /**
     * Reloads the current page
     */
    CourseController.prototype.reloadPage = function() {
        //Logger.logDebug("CourseController.reloadPage()");
        this.loadPage(CourseModel.getCurrentPageGUID());
    };

    /**
     * Jump to a specific CW's first page, GUID passed as param.
     * @param {String} p_sCWGUID - CW GUID to jump to.
     */
    CourseController.prototype.jumpToCW = function(p_sCWGUID) {
        //Logger.logDebug("CourseController.jumpToCW()");
        var oPageModel = CourseModel.findCWFirstPage(p_sCWGUID);
        CourseModel.setCurrentPage(oPageModel);
        this.loadPage(oPageModel);
    };
	
	/**
	 * Returns instance of {@link PageModel} of  a page GUID
	 * @param {String}  p_sGUID - page GUID
	 * @returns {Object}   
	 */
    CourseController.prototype.getPageModelByGUID = function(p_sGUID) {
        //Logger.logDebug("CourseController.getPageModelByGUID() | p_sGUID = "+p_sGUID);
        var oPageModel = CourseModel.findPage(p_sGUID);
        return oPageModel;
    };

    /**
     * Get the current Page Object
     * @returns {Object} {@link PageModel}
     */
    CourseController.prototype.getCurrentPage = function() {
        //Logger.logDebug("CourseController.getCurrentPage()");
        var oCurrPage = CourseModel.getCurrentPage();
        return oCurrPage;
    };

    /**
     * Returns current {@link CWModel} 
     * @returns {Object} 	
     */
    CourseController.prototype.getCurrentCW = function() {
        //Logger.logDebug("CourseController.getCurrentCW()");
        var oCurrPage = CourseModel.getCurrentPage();
        var oCurrCW = CourseModel.findCW(oCurrPage.getGUID());
        return oCurrCW;
    };

    /**
     * Return current CWModel 
     * @param {String}	CW_GUID 
     * @returns {Object} CWModel 	
     */
    CourseController.prototype.findCW = function(p_sCWGUID) {
        //Logger.logDebug("CourseController.findCW()");
        var oCurrCW = CourseModel.findCW(p_sCWGUID);
        return oCurrCW;
    };


    /**
     * Set the current page status<br>
     * Page status (0=not visited | 1=visited | 2=completed)
     * @param	{String} p_nStatus 
     */
    CourseController.prototype.setCurrentPageStatus = function(p_nStatus) {
        //Logger.logDebug("CourseController.setCurrentPageStatus() | "+p_nStatus);
        var oCurrPageModel = CourseModel.getCurrentPage();
        CourseModel.updateNavigationStatus(oCurrPageModel, p_nStatus);
    };

    /**
     * Set the  page status. Page status (0=not visited | 1=visited | 2=completed)
     * @param {String} p_sGUID
     * @param {String} p_nStatus
     */
    CourseController.prototype.setPageStatus = function(p_sGUID, p_nStatus) {
        //Logger.logDebug("CourseController.setPageStatus() | sGUID = "+p_sGUID+" : Status = "+p_nStatus);
        var oPage = CourseModel.findPage(p_sGUID);
        CourseModel.updateNavigationStatus(oPage, p_nStatus);
    };

    /**
     * Return current page status.  (0=not visited | 1=visited | 2=completed)
     * @returns {String} 
     */
    CourseController.prototype.getCurrentPageStatus = function() {
        var oCurrPageModel = CourseModel.getCurrentPageModel();
        //Logger.logDebug("CourseController.getCurrentPageStatus() | "+oCurrPageModel.getPageStatus());
        return oCurrPageModel.getPageStatus();
    };
    
    /**
     * Return page status of a given page GUID  (0=not visited | 1=visited | 2=completed)
     * @param {String}	p_sGUID:Page GUID
     * @returns {String} page status 	
     */
    CourseController.prototype.getPageStatus = function(p_sGUID) {
        var oPage = CourseModel.findPage(p_sGUID);
        //Logger.logDebug("CourseController.getPageStatus() | Page Obj = "+oPage+' : Status = '+oPage.getPageStatus());
        return oPage.getPageStatus();
    };

    /**
     * Return CW status
     * @param {String}	p_sCWGUID 
     * @returns {String} 	
     */
    CourseController.prototype.getCWStatus = function(p_sCWGUID) {
        //Logger.logDebug("CourseController.getCWStatus()");
        return CourseModel.getCWStatus(p_sCWGUID);
    };
	

    /**
     * Set the CW status. (0=not visited | 1=visited | 2=completed)
     * @param	{String} p_sCWGUID - CW ID
     * @param	{String} p_nStatus  - Status
     */
    CourseController.prototype.setCWStatus = function(p_sCWGUID, p_nStatus) {
        //Logger.logDebug("CourseController.setCWStatus()");
        CourseModel.setCWVisitStatus(p_sCWGUID, p_nStatus);
    };

    /**
     * Return current CW GUID
     * @returns {String} 	
     */
    CourseController.prototype.getCurrentCWGUID = function() {
        //Logger.logDebug("CourseController.getCurrentCWGUID()");
        var oCurrPage = CourseModel.getCurrentPage();
        return oCurrPage.getParentCWGUID();
    };

    /**
     * Return current Page GUID
     * @returns {String} 	
     */
    CourseController.prototype.getCurrentPageGUID = function() {
        //Logger.logDebug("CourseController.getCurrentPageGUID()");
        var oCurrPage = CourseModel.getCurrentPage();
        return oCurrPage.getGUID();
    };

    /**
     * Return current Page Label
     * @returns 	{String}
     */
    CourseController.prototype.getCurrentPageLabel = function() {
        //Logger.logDebug("CourseController.getCurrentPageLabel()");
        var oCurrPage = CourseModel.getCurrentPage();
        return oCurrPage.getPageLabel();
    };

    /**
     * Return current CW Label
     * @returns {String} 	
     */
    CourseController.prototype.getCurrentCWLabel = function() {
        //Logger.logDebug("CourseController.getCurrentCWLabel()");
        var oCurrPage = CourseModel.getCurrentPage();
        var oCurrCW = CourseModel.findCW(oCurrPage.getParentCWGUID());
        return oCurrCW.getCWLabel();
    };

   CourseController.prototype.getCurrentCWHierarchy = function() {
        //Logger.logDebug("CourseController.getCurrentCWLabel()");
        var oCurrPage = CourseModel.getCurrentPage();
        var oCurrCW = CourseModel.findCW(oCurrPage.getParentCWGUID());
        return oCurrCW.getHierarchyLevel();
    };

    /**
     * Return total number of pages of CW
     * @param	{String} p_sCWGUID
     * @returns {Number} 	
     */
    CourseController.prototype.getCWTotalPages = function(p_sCWGUID) {
        //Logger.logDebug("CourseController.getCWTotalPages()");
        var oCurrCW = CourseModel.findCW(p_sCWGUID);
        return oCurrCW.getCWTotalPages();
    };

    /**
     * Get the current Page Address (CW hierarchy of the page it belongs to)
     * @returns 	{String}
     */
    CourseController.prototype.getCurrentPageAddress = function() {
        var strGUID = getCurrentPageGUID();
        var strPageAddress = "";
        var flag = true;

        strPageAddress = getCurrentPageName();

        while (flag)
        {
            strGUID = strGUID.slice(0, strGUID.lastIndexOf("~"));
            var objCurrCW = CourseModel.findObjCW(strGUID);
            strPageAddress = objCurrCW._cwLabel + "|" + strPageAddress;
            if (strGUID.lastIndexOf("~") == -1)
            {
                flag = false;
            }
        }
        return strPageAddress;
    };

    /**
     * Return current Page Number from pageNumDisplay
     * @returns {Number} 	
     */
    CourseController.prototype.getCurrentPageNumber = function() {
        return objCourseController.get_currentPageNumber();
    };

    /**
     * Get the total pages of current pageNumDisplay
     * @returns {Number} 	
     */ 
    CourseController.prototype.getTotalPageNumber = function() {
        return objCourseController._totalPageNumber;
    };

    /**
     * Returncurrent Bookmark String
     * @param {String} argState - TBD
     * @returns  {String}
     */
    CourseController.prototype.getNavigationBookMark = function(argState) {
        return CourseModel.createBookMarkString(argState);
    };

    /**
     * Return total number of first level child CW under the given CW GUID
     * @param	{String} p_sCWGUID
     * @returns {Object} 	
     */
    CourseController.prototype.getChildCW = function(p_sCWGUID) {
        var objCW = CourseModel.findObjCW(p_sCWGUID);
        return objCW._arrChildCW;
    };

    /**
     * Return total number of first level child Pages under the given CW GUID
     * @param	{String} p_sCWGUID 
     * @returns {Array}	
     */
    CourseController.prototype.getChildPages = function(p_sCWGUID) {
        return CourseModel.getCWPages(p_sCWGUID);
    };

    /**
     * Return total number of first level child Pages under the given CW GUID
     * @param	{String} p_sCWGUID
     * @returns 	{Object}
     */
    CourseController.prototype.getCWLastPage = function(p_sCWGUID) {
        return CourseModel.findCWLastPage(p_sCWGUID);
    };

    /**
     * Return current Pagetype
     * @returns 	{String}
     */
    CourseController.prototype.getCurrentPageType = function() {
        var objCurrPage = CourseModel.getCurrentPage();
        return objCurrPage._pageType;
    };

    /**
     * Return current Page Viewtype (gets reflected in top/bottom band)
     * @returns {String} 	
     */
    CourseController.prototype.getCurrentViewType = function() {
        var objCurrPage = CourseModel.getCurrentPage();
        return objCurrPage.getViewType();
    };

    /**
     * Returns Assessment completion
     * @returns  {Boolean}
     */
    CourseController.prototype.isAssessmentComplete = function() {
    	return CourseModel.isAssessmentComplete();
    };

    /**
     * Set the current Page Viewtype (gets reflected in top/bottom band)
     * @param {String} argViewType	
     */
    CourseController.prototype.setCurrentViewType = function(argViewType) {
        this.refToUIManager.setBandViewType(argViewType);
    };

    CourseController.prototype.getConfig = function(p_sKey) {
        return CourseConfig.getConfig(p_sKey);
    };
    
    CourseController.prototype.getResourceItem = function(p_sKey) {
        return CourseModel.getResourceItem(p_sKey);
    };

    CourseController.prototype.getRootPath = function() {
        return CourseConfig.getRootPath();
    };


    CourseController.prototype.attacUserAgentEvents = function() {
        /*
         $( window ).on( "orientationchange", function(e) {
         //p_sID, p_oData, p_$ElemnToReturnFocusTo, p_sClass
         PopupManager.openPopup('alert', {txt_title:'Orientation Change', txt_content:'This device is in '+ e.orientation + ' mode!'}, $('#content'));
         //$( "#orientation" ).text( "This device is in " + e.orientation + " mode!" );
         });*/
		var oScope = this;
        if(typeof window.onorientationchange != 'undefined'){
    	    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                //Logger.logDebug(':: Touch Device Window ::');
                // Add a media query change listener
    	        oMediaQuery.addListener(function() {
    	            oScope.onOrientationChange();
    	        });
                //window.onorientationchange = onOrientationChange;
    	    } else {
                //Logger.logDebug(':: NORMAL Window ::');
                $(window).bind("resize", function() {
                    oScope.onOrientationChange();
                });
    	    }
        }
	};
    CourseController.prototype.onOrientationChange = function() {
		//Logger.logDebug('onOrientationChange() | ');
        var sScreenOrientation;
		// ** Do not show the pop-up in Apple Devices (iPad, etc.)
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            /*sScreenOrientation = (Math.abs(window.orientation) === 90) ? 'landscape' : 'portrait';*/

            // ** oMediaQuery Object Structure: {"matches":true, "media":"{orientation:portrait}"}
            //sScreenOrientation = (oMediaQuery.matches) ? 'portrait' : 'landscape';

            //$.publish("ORIENTATION_CHANGE", {orientation: sScreenOrientation});
            return;
        }
        sScreenOrientation = ($(window).innerWidth() > $(window).height()) ? 'landscape' : 'portrait';
        $.publish("ORIENTATION_CHANGE", {orientation: sScreenOrientation});
    };

    CourseController.prototype.toString = function() {
        return 'framework/controller/CourseController';
    };
	
    if(!__instanceCourseController){
		__instanceCourseController = new CourseController();
		//console.log('^^^^^^^^^^^^ UI CourseController INSTANCE ^^^^^^^^^^^^^^ '+__instanceCourseController);
	}
	
	return __instanceCourseController;

});