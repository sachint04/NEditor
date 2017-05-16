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
	function pg05(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('pg05.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens

		// ** END - Declare Page variables for individual screens
		return this;
	}

	pg05.prototype									= Object.create(PageAbstract.prototype);
	pg05.prototype.constructor						= pg05;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg05.prototype.initialize						= function(){
		var oScope				= this,
			$helpfulTipsBtn		= this.$domView.find('[id^=btn_Popup]');
		this.dispatchPageLoadedEvent();
		PageAbstract.prototype.initialize.call(this, true);
	};



	pg05.prototype.handleEvents 					= function(e){
		//Logger.logDebug('pg05.handleButtonEvents() '+$(e.target).attr('id'));
		e.preventDefault();
		var sBtnName	= e.target.getAttribute('id'),
			sBtnText	= $(e.target).html();
		sPopupText			= Globals.getElementByID(this.$domView, e.target.getAttribute('target'), 'pg05.initialize()').html();
		//To add call back take the returned obj below and add .setcallback call to it
		this.openPopup('popup_close', sBtnText, sPopupText, $(e.target));
	};


	/**
	 * Destroys the Page Object
	 */
	pg05.prototype.destroy 							= function(){
		//Logger.logDebug('pg05.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables
		var oScope			= this,
			$helpfulTipsBtn		= Globals.getElementByID(this.$domView, 'btn_helpfultips', 'pg05.initialize()');

		
		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return pg05;
});