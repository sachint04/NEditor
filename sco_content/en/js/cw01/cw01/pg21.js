define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/core/PopupManager',
    'framework/utils/globals',
    'framework/utils/Logger'
], function($, PageAbstractController,PopupManager, Globals, Logger){
    /**
     * Page Constructor
     * @param p_$domDecisionHolder : DOM Node where the HTML DOM Decision View gets appended
     * @param p_domDecisionView : Decision Page HTML DOM View
     * @param p_xmlDecisionData : Decision Page XML Data
     * @param p_cssDecisionData : Decision Page CSS Data
     * @return instance of Page
     */
    /*function MMCQpage(p_$decisionHolder, p_domView, p_xmlData, p_cssData){
        //Logger.logDebug('MMCQpage.CONSTRUCTOR() | CSS = '+p_cssData);
        PageAbstractController.call(this, p_$decisionHolder, p_domView, p_xmlData, p_cssData);
        // ** START - Declare Page variables for individual screens

        // ** END - Declare Page variables for individual screens
        return this;
    }*/
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function MMCQpage(p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
        //Logger.logDebug('Pg01.CONSTRUCTOR() '+p_oCourseController+' ::::: '+p_$domPageHolder+' ::::: '+p_domPageView+' ::::: '+p_xmlPageData+' ::::: '+p_cssPageData);
        PageAbstractController.call(this, p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);

        return this;
    }

    MMCQpage.prototype                                  = Object.create(PageAbstractController.prototype);
    MMCQpage.prototype.constructor                      = MMCQpage;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    MMCQpage.prototype.initialize                       = function(){
        //Logger.logDebug('MMCQpage.initialize() | ');
        // ** START - Custom Implementation for individual screens
        // ** END - Custom Implementation for individual screens
        // ** Required call to the Course Controller to remove the preloader
        PageAbstractController.prototype.initialize.call(this, true);
    
    };

    /**
     * Destroys the Page Object
     */
    MMCQpage.prototype.destroy                          = function(){
        Logger.logDebug('MMCQpage.destroy() | ');
        // ** START - Custom Implementation for destroying Page variables

        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstractController.prototype.destroy.call(this);
    };

    MMCQpage.prototype.openFeedbackPopup                        = function(sTitle,sContent){
        oPopup   = PopupManager.openPopup('popup_close', {txt_title:sTitle, txt_content:sContent}, $('#ImmediateFeedback_holder'));

        this.popupFeedbackEventHandler  = this.popupFeedbackEventHandler.bind(this);
        oPopup.addEventListener('POPUP_CLOSE', this.popupFeedbackEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupFeedbackEventHandler);

    };

    MMCQpage.prototype.addFeedbackPopupHandler              = function(p_oPopup){
        Logger.logDebug('MCQGroup.addPopupHandler() | ');
        this.popupFeedbackEventHandler  = this.popupFeedbackEventHandler.bind(this);
        p_oPopup.addEventListener('POPUP_CLOSE', this.popupFeedbackEventHandler);
        p_oPopup.addEventListener('POPUP_EVENT', this.popupFeedbackEventHandler);
    };
    MMCQpage.prototype.popupFeedbackEventHandler                = function(e){
        var sEventType  = e.type,
            oPopup      = e.target,
            sPopupID    = oPopup.getID();
        //Logger.logDebug('MCQGroup.popupFeedbackEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

        if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE'){
            this.removeFeedbackPopupHandler(oPopup);

            if(sEventType === 'POPUP_EVENT'){PopupManager.closePopup(sPopupID);}
            if(!this.aActivities[0].isAttemptsCompleted()&& !this.aActivities[0].isSelectionCorrect()){
                this.aActivities[0].updateAttempNumber();
                this.aActivities[0].resetOptions();
            }

        }
    };
    MMCQpage.prototype.removeFeedbackPopupHandler           = function(p_oPopup){
        //Logger.logDebug('MCQGroup.removeFeedbackPopupHandler() | ');

        p_oPopup.removeEventListener('POPUP_CLOSE', this.popupFeedbackEventHandler);
        p_oPopup.removeEventListener('POPUP_EVENT', this.popupFeedbackEventHandler);
    };
      /*
    MMCQpage.prototype.onActivityComplete           = function(e){
        var oComponent      = e.target,
            sScoringUID     = e.scoringuid,
            oFeedbackData   = e.feedback,
            oDecisionData   = e.bookmark,
            sDecisionID     = this.getDecisionID(this.sGUID);

        if(oComponent.isAttemptsCompleted() || oComponent.isSelectionCorrect()){
            PageAbstractController.prototype.onActivityComplete.call(this, e);
            oComponent.disableActivity();
        }

            // element has the Correct incorrect feedback
            sFeedbackTitle  = oFeedbackData.aFeedback[0].title;
            sFeedback       = oFeedbackData.aFeedback[0].content;

        this.openFeedbackPopup(sFeedbackTitle,sFeedback);

    };


  MMCQpage.prototype.onActivityLoaded               = function(e){
      Logger.logDebug('PageAbstract.onActivityLoaded() | ');
      var oComponent        = e.target;
      this.onBeforePopupLaunch = this.onBeforePopupLaunch.bind(this);
      PageAbstractController.prototype.onActivityLoaded.call(this, e);
      oComponent.addEventListener('BEFORE_ACTIVITY_ATTEMPT_UPDATE', this.onBeforePopupLaunch);
  };
 */





    return MMCQpage;
});