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
    function ScorePage(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
        //Logger.logDebug('ScorePage.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens

        // ** END - Declare Page variables for individual screens
        return this;
    }

    ScorePage.prototype = Object.create(PageAbstract.prototype);
    ScorePage.prototype.constructor = ScorePage;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     * 		1) populating the view with the required content based on ID mapping,
     * 		2) any activity initialization,
     * 		3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    ScorePage.prototype.initialize = function() {
        var oScope = this,
        $helpfulTipsBtn = this.$domView.find('[id^=btn_Popup]');
        this.$domView.find('#btn_restart').click(function(e) {
            e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
                oScope.jumpToPage("cw01~assessment~pg01assessment");
        });
        // $('#btn_transcript').addClass('disabled');
        per = ScoreManager.getTotalAchievedScore() * 100 / ScoreManager.getTotalMaxPossibleScore();
        //Logger.logDebug('total achived score  = '+ ScoreManager.getTotalAchievedScore());
        //Logger.logDebug('getTotalMaxPossibleScore = '+ ScoreManager.getTotalMaxPossibleScore());
        this.$domView.find('#txt_2').html("Your score is: "+Math.round(per) + "%");

         PageAbstract.prototype.initialize.call(this, true);

    };





    /**
     * Destroys the Page Object
     */
    ScorePage.prototype.destroy = function() {
        //Logger.logDebug('ScorePage.destroy() | ');
        // ** START - Custom Implementation for destroying Page variables
        var oScope = this,
                $helpfulTipsBtn = Globals.getElementByID(this.$domView, 'btn_helpfultips', 'ScorePage.initialize()');


        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return ScorePage;
});