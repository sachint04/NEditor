define([
	'jquery',
	'framework/viewcontroller/PageAbstractController',
	'framework/utils/globals',
	'framework/utils/Logger',
	'framework/component/Menu'
], function($, PageAbstract, Globals, Logger, MenuComponent){
	/**
	 * Page Constructor
	 * @param p_oCourseController : Reference to CourseController
	 * @param p_$pageHolder : The HTML element to which the page will get appended
	 * @param p_domView : Page HTML View
	 * @param p_xmlData : Page XML Data
	 * @param p_cssData : Page CSS Data
	 * @return instance of Page
	 */
	function Menu(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('Menu.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens

		// ** END - Declare Page variables for individual screens
		return this;
	}

	Menu.prototype									= Object.create(PageAbstract.prototype);
	Menu.prototype.constructor						= Menu;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	Menu.prototype.initialize						= function(){
		//Logger.logDebug('Menu.initialize() ');
		// ** START - Custom Implementation for individual screens

		// ** END - Custom Implementation for individual screens
		// ** Required call to the Course Controller to remove the preloader
		PageAbstract.prototype.initialize.call(this, true);
	};

	/**
	 * Destroys the Page Object
	 */
	Menu.prototype.destroy 							= function(){
		//Logger.logDebug('Menu.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables

		// ** END - Custom Implementation for destroying Page variables
		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return Menu;
});