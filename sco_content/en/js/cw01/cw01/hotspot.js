define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/core/PopupManager',
    'framework/utils/globals',
    'framework/utils/Logger',
    'libs/jquery.rwdImageMaps'
], function($, PageAbstractController, PopupManager, Globals, Logger, ImageMap) {
    /** 
     * Page Constructor 
     * @param p_oCourseController : Reference to CourseController 
     * @param p_$pageHolder : The HTML element to which the page will get appended 
     * @param p_domView : Page HTML View 
     * @param p_xmlData : Page XML Data 
     * @param p_cssData : Page CSS Data 
     * @return instance of Page 
     */
    function Pg02(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
//Logger.logDebug('Pg02.CONSTRUCTOR() '); 
        PageAbstractController.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
// ** START - Declare Page variables for individual screens 

// ** END - Declare Page variables for individual screens 
        return this;
    }

    Pg02.prototype = Object.create(PageAbstractController.prototype);
    Pg02.prototype.constructor = Pg02;
// ** The constructor and the lines above are mandatory for every page 

    /** 
     * Function initialize() : gets called after the folowing: 
     * 1) populating the view with the required content based on ID mapping, 
     * 2) any activity initialization, 
     * 3) all images are loaded. 
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view 
     */
    Pg02.prototype.initialize = function() {
//Logger.logDebug('Pg02.initialize() '); 
// ** START - Custom Implementation for individual screens 
        $('img[usemap]').rwdImageMaps();
        var oScope = this,
                $continueBtn = Globals.getElementByID(this.$domView, 'continue_btn', 'Pg02.init()');


        $continueBtn.on('click', function(e) {
            if (!$(this).hasClass('inactive') && !$(this).hasClass('disabled')) {
                oScope.handleEvents(e);
            }
        }).attr({'aria-role': 'button',
            'role': 'button',
            'aria-labelledby': 'Start'});



//Hotspot 

        $("area").each(function(index, element) {

            $(element).click(function() {
                oScope.openPopup($("#" + element.id + "_title").html(), $("#" + element.id + "_txt").html());
            });
        });
        $(".title_collection p").each(function(index, element) {

            $(element).click(function() {
                oScope.openPopup($("#" + element.id).html(), $("#" + element.id.replace("title", "txt")).html());
            });
        });

// ** END - Custom Implementation for individual screens 
        /*$(".tierraButton").click(function(){ 
         oScope.openPopup("",$("#popupText").html(),"intro-text"); 
         }); 
         $(".tierraButton").click();*/
// ** Required call to the Course Controller to remove the preloader 
        this.dispatchPageLoadedEvent();
        PageAbstractController.prototype.initialize.call(this, true);
    };

    Pg02.prototype.handleEvents = function(e) {
//Logger.logDebug('Pg02.handleButtonEvents() '+$(e.target).attr('id')); 
        e.preventDefault();
        /*var sBtnName = e.target.getAttribute('id'); 
         switch(sBtnName){ 
         case 'continue_btn' : 
         var $para1 = Globals.getElementByID(this.$domView, 'txt_1', 'Pg02.handleEvents()'), 
         $para2 = Globals.getElementByID(this.$domView, 'txt_2', 'Pg02.handleEvents()'); 
         if($para2.css('display') === 'none'){ 
         $para1.fadeOut(); 
         $para2.delay(400).fadeIn(); 
         }else{ 
         this.navigateNext(); 
         } 
         break; 
         }*/
    };

    /** 
     * Destroys the Page Object 
     */
    Pg02.prototype.destroy = function() {
//Logger.logDebug('Pg02.destroy() | '); 
// ** START - Custom Implementation for destroying Page variables 
        var oScope = this,
                $continueBtn = Globals.getElementByID(this.$domView, 'continue_btn', 'Pg02.destroy()');

        $continueBtn.off('click', function(e) {
            oScope.handleEvents(e);
        });
// ** END - Custom Implementation for destroying Page variables 

// ** Calling Super Class "destroy()" function 
        PageAbstractController.prototype.destroy.call(this);
    };

    Pg02.prototype.openPopup = function(sTitle, sContent, p_sClassToAdd) {
        oPopup = PopupManager.openPopup('popup_close', {txt_title: sTitle, txt_content: sContent}, $('#ImmediateFeedback_holder'), p_sClassToAdd);
//$("#popup_close #txt_content").append($("#mcqgroup_1").show()); 
// $('#popup_container .modal-body').find('.tis_btn').removeClass('inactive').removeAttr('aria-disabled'); 

        this.popupEventHandler = this.popupEventHandler.bind(this);
        oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);

    };

    Pg02.prototype.addPopupHandler = function(p_oPopup) {
        Logger.logDebug('MCQGroup.addPopupHandler() | ');
        this.popupEventHandler = this.popupEventHandler.bind(this);
        p_oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        p_oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
    };
    Pg02.prototype.popupEventHandler = function(e) {
        var sEventType = e.type,
                oPopup = e.target,
                sPopupID = oPopup.getID();
//Logger.logDebug('MCQGroup.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc); 

        if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            this.removePopupHandler(oPopup);

            if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            }



//Load the next set 
//Logger.logDebug('Conversation._evaluate() | Feedback ResponseSetID = '+oFeedBack.nResponseSetID); 

        }
    };
    Pg02.prototype.removePopupHandler = function(p_oPopup) {
        Logger.logDebug('MCQGroup.removePopupHandler() | ');
//$("#cw01_decision1").append($("#mcqgroup_1").hide()); 
        p_oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
        p_oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
    };

    return Pg02;
});
