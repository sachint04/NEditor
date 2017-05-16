define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/utils/globals',
    'framework/utils/Logger'
], function($, PageAbstract, Globals, Logger){
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function ClicakbleImages(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
        //Logger.logDebug('ClicakbleImages.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens

        // ** END - Declare Page variables for individual screens
        return this;
    }

    ClicakbleImages.prototype                                   = Object.create(PageAbstract.prototype);
    ClicakbleImages.prototype.constructor                       = ClicakbleImages;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    ClicakbleImages.prototype.initialize                        = function(){
        //Logger.logDebug('ClicakbleImages.initialize() ');
        // ** START - Custom Implementation for individual screens
        /*var oScope                = this,
            $helpfulTipsBtn     = this.$domView.find('[id^=btn_Popup]');

        $helpfulTipsBtn.on('click', function(e){
            if(!$(this).hasClass('inactive') && !$(this).hasClass('disabled')){
                oScope.handleEvents(e);
            }
        }).attr({
            'aria-role'         : 'button',
            'role'              : 'button',
            'aria-labelledby'   : 'Start'
        });*/
        // ** END - Custom Implementation for individual screens

        // ** Required call to the Course Controller to remove the preloader



        //var oClickAndReveal = new ClickAndReveal(this.$domView.find('#comp_1'));
        this.dispatchPageLoadedEvent();
        PageAbstract.prototype.initialize.call(this, true);
    };



    ClicakbleImages.prototype.handleEvents                  = function(e){
        //Logger.logDebug('ClicakbleImages.handleButtonEvents() '+$(e.target).attr('id'));
        e.preventDefault();
        var obj = e.target.getAttribute('target')?e.target:$(e.target).parent()[0];
        var sBtnName    = obj.getAttribute('id'),
            sBtnText    = $(obj).find("div").html();
        sPopupText          = Globals.getElementByID(this.$domView, obj.getAttribute('target'), 'ClicakbleImages.initialize()').html();
        //To add call back take the returned obj below and add .setcallback call to it
        this.openPopup('popup_close', sBtnText, sPopupText, $(e.target));
    };


    /**
     * Destroys the Page Object
     */
    ClicakbleImages.prototype.destroy                           = function(){
        //Logger.logDebug('ClicakbleImages.destroy() | ');
        // ** START - Custom Implementation for destroying Page variables
        var oScope          = this,
            $helpfulTipsBtn     = Globals.getElementByID(this.$domView, 'btn_helpfultips', 'ClicakbleImages.initialize()');

        $helpfulTipsBtn.off();
        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return ClicakbleImages;
});