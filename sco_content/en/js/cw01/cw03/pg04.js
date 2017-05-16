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
	function pg04(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('pg04.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens

		// ** END - Declare Page variables for individual screens
		return this;
	}

	pg04.prototype									= Object.create(PageAbstract.prototype);
	pg04.prototype.constructor						= pg04;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg04.prototype.initialize						= function(){
		
		this.dispatchPageLoadedEvent();
		PageAbstract.prototype.initialize.call(this, true);
	};



	pg04.prototype.handleEvents 					= function(e){
		
	};


	/**
	 * Destroys the Page Object
	 */
	pg04.prototype.destroy 							= function(){
		
		// ** START - Custom Implementation for destroying Page variables
		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return pg04;
});