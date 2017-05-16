define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/utils/globals',
    'framework/component/Tabs',
    'framework/utils/Logger'
], function($, PageAbstract, Globals, TabComponent, Logger){
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function reso(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
        //Logger.logDebug('reso.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
        // ** START - Declare Page variables for individual screens
        this.oTabComponent;
        //this.oAccordianComponent1;
        this.oAccordianComponent2;
        // ** END - Declare Page variables for individual screens
        return this;
    }

    reso.prototype                                  = Object.create(PageAbstract.prototype);
    reso.prototype.constructor                      = reso;
    // ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     *      1) populating the view with the required content based on ID mapping,
     *      2) any activity initialization,
     *      3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    reso.prototype.initialize                       = function(){
        // START - Custom Implementation for individual screens
        var oCompConfig     = {
                accordion       : false,
                tabShowSpeed    : 600
        };
        this.oTabComponent = new TabComponent("tabpanel1", oCompConfig);
        var oAccordianCompConfig		= {
				accordian				: true,
				accordianToggle			: true,
				tabShowSpeed			: 600
		};
		
		//this.oAccordianComponent1 = new TabComponent("accordian1", oAccordianCompConfig);
		this.oAccordianComponent2 = new TabComponent("accordian2", oAccordianCompConfig);
		    
        // END - Custom Implementation for individual screens
        PageAbstract.prototype.initialize.call(this, true);
    };

    /**
     * Destroys the Page Object
     */
    reso.prototype.destroy                          = function(){
        // ** START - Custom Implementation for destroying Page variables
        this.oTabComponent.destroy();
        //this.oAccordianComponent1.destroy();
		this.oAccordianComponent2.destroy();
        // ** END - Custom Implementation for destroying Page variables

        // ** Calling Super Class "destroy()" function
        PageAbstract.prototype.destroy.call(this);
    };

    return reso;
});