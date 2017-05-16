define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/core/score/ScoreManager',
    'framework/utils/globals',
    'framework/utils/Logger',
    'framework/core/AssessmentManager',

], function($, PageAbstract, ScoreManager,Globals, Logger, AssessmentManager) {
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function pg06(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
        //Logger.logDebug('pg06.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens

        // ** END - Declare Page variables for individual screens
        return this;
    }

    pg06.prototype = Object.create(PageAbstract.prototype);
    pg06.prototype.constructor = pg06;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     * 		1) populating the view with the required content based on ID mapping,
     * 		2) any activity initialization,
     * 		3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    pg06.prototype.initialize = function() {
        var oScope = this,
                $helpfulTipsBtn = this.$domView.find('[id^=btn_Popup]');
        this.dispatchPageLoadedEvent();
        PageAbstract.prototype.initialize.call(this, true);
        this.$domView.find('#btn_continue').click(function(e) {
            e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
                oScope.jumpToPage("cw01~assessment~pg01");
        });
        per = ScoreManager.getTotalAchievedScore() * 100 / ScoreManager.getTotalMaxPossibleScore();
        this.$domView.find('#txt_2').html("Your score is : "+per.toFixed() + "%");
        if(AssessmentManager.isPass()) 
            $("#img-result").html('<img alt="image" src="images/Ass_Correct_Img_iPad_01a.jpg">');
        else
            $("#img-result").html('<img alt="image" src="images/Ass_Wrong_Img_iPad_01a.jpg">');

    };



    pg06.prototype.handleEvents = function(e) {
        //Logger.logDebug('pg06.handleButtonEvents() '+$(e.target).attr('id'));
        e.preventDefault();
        var sBtnName = e.target.getAttribute('id'),
                sBtnText = $(e.target).html();
        sPopupText = Globals.getElementByID(this.$domView, e.target.getAttribute('target'), 'pg06.initialize()').html();
        //To add call back take the returned obj below and add .setcallback call to it
        this.openPopup('popup_close', sBtnText, sPopupText, $(e.target));
    };


    /**
     * Destroys the Page Object
     */
    pg06.prototype.destroy = function() {
        //Logger.logDebug('pg06.destroy() | ');
        // ** START - Custom Implementation for destroying Page variables
        var oScope = this,
                $helpfulTipsBtn = Globals.getElementByID(this.$domView, 'btn_helpfultips', 'pg06.initialize()');


        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return pg06;
});