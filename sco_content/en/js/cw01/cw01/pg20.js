define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/utils/globals',
    'mediaplayer',
    'framework/utils/Logger'
], function($, PageAbstract, Globals, mediaplayer,  Logger){
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function VideoPage(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){

        //Logger.logDebug('VideoPage.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens

        // ** END - Declare Page variables for individual screens
        return this;
    }




    VideoPage.prototype                                 = Object.create(PageAbstract.prototype);
    VideoPage.prototype.constructor                     = VideoPage;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    VideoPage.prototype.initialize                      = function(){
        //Logger.logDebug('VideoPage.initialize() ');
        // ** START - Custom Implementation for individual screens

        var oScope          = this,
            $continueBtn    = Globals.getElementByID(this.$domView, 'continue_btn', 'Pg01.initialize()');




        $continueBtn.on('click', function(e){
            if(!$(this).hasClass('inactive') && !$(this).hasClass('disabled')){
                oScope.handleEvents(e);
            }
        }).attr({'aria-role'        : 'button',
                 'role'             : 'button',
                 'aria-labelledby'  : 'Start'});


        // ** END - Custom Implementation for individual screens

        // ** Required call to the Course Controller to remove the preloader
        //this.dispatchPageLoadedEvent();
        PageAbstract.prototype.initialize.call(this, true);
    };


    VideoPage.prototype.handleEvents                    = function(e){
        //Logger.logDebug('VideoPage.handleButtonEvents() '+$(e.target).attr('id'));
        Logger.logDebug('Pg01.handleButtonEvents() '+$(e.target).attr('id'));
        e.preventDefault();
        $continueBtn = $(e.target);
        var oScope  = this;
        $continueBtn.off('click', function(e){
            oScope.handleEvents(e);
        });
        this.navigateNext();
    };

    /**
     * Destroys the Page Object
     */
    VideoPage.prototype.destroy                             = function(){
        //Logger.logDebug('VideoPage.destroy() | ');
        // ** START - Custom Implementation for destroying Page variables
        var oScope          = this,
            $continueBtn    = Globals.getElementByID(this.$domView, 'continue_btn', 'VideoPage.destroy()');

        $continueBtn.off('click', function(e){
            oScope.handleEvents(e);
        });
        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return VideoPage;
});