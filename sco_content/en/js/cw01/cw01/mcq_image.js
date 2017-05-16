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

	function pg19(p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('Pg01.CONSTRUCTOR() '+p_oCourseController+' ::::: '+p_$domPageHolder+' ::::: '+p_domPageView+' ::::: '+p_xmlPageData+' ::::: '+p_cssPageData);
	    PageAbstractController.call(this, p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);

		return this;
	}

	pg19.prototype									= Object.create(PageAbstractController.prototype);
	pg19.prototype.constructor						= pg19;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg19.prototype.initialize						= function(){
		//Logger.logDebug('pg19.initialize() | ');
		// ** START - Custom Implementation for individual screens
		// ** END - Custom Implementation for individual screens

		// ** Required call to the Course Controller to remove the preloader
		PageAbstractController.prototype.initialize.call(this, true);
//		 $("#txt_pagination").html('Page 10 of 14');
	};

	/**
	 * Destroys the Page Object
	 */
	pg19.prototype.destroy							= function(){
		Logger.logDebug('pg19.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables

		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstractController.prototype.destroy.call(this);
	};

	return pg19;
});