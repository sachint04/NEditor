define([
	'jquery',
	'framework/viewcontroller/PageAbstractController',
	'framework/utils/globals',
	'framework/component/Carouseltimeline',
	'framework/utils/Logger'
], function($, PageAbstract, Globals, Carousel, Logger){
	/**
	 * Page Constructor
	 * @param p_oCourseController : Reference to CourseController
	 * @param p_$pageHolder : The HTML element to which the page will get appended
	 * @param p_domView : Page HTML View
	 * @param p_xmlData : Page XML Data
	 * @param p_cssData : Page CSS Data
	 * @return instance of Page
	 */
	function pg08(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('pg08.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens
		this.oTabComponent;
		// ** END - Declare Page variables for individual screens
		return this;
	}

	pg08.prototype									= Object.create(PageAbstract.prototype);
	pg08.prototype.constructor						= pg08;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg08.prototype.initialize						= function(){
		// START - Custom Implementation for individual screens
		var oCompConfig		= {
				firstSlide				: 1,
				wrap					: false,
				cycle					: false,
				showCarouselIndicators	: true,
				showCarouselPagination	: false,
				paginationAccessible	: false,
				paginationStyle			: 'Slide XX of YY',

				animationStyle			: 'slide',
				animationSpeed			: 500
		};
		this.oTabComponent = new Carousel("carousel1", oCompConfig);
		this.oTabComponent.addEventListener('LOAD_COMPLETE');
		//this.oTabComponent.init("carousel1", oCompConfig);


		// END - Custom Implementation for individual screens
		PageAbstract.prototype.initialize.call(this, true);
	
	};

	/**
	 * Destroys the Page Object
	 */
	pg08.prototype.destroy 							= function(){
		// ** START - Custom Implementation for destroying Page variables
		this.oTabComponent.destroy();
		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return pg08;
});