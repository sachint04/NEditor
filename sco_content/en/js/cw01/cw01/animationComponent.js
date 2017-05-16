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
	function pg02(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('pg02.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens
			this.oAnimationComponent;
			this.handleEvents 	= this.handleEvents.bind(this);
		// ** END - Declare Page variables for individual screens
		return this;
	}

	pg02.prototype									= Object.create(PageAbstract.prototype);
	pg02.prototype.constructor						= pg02;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg02.prototype.initialize						= function(){
		var oScope = this;
		this.oAnimationComponent  = this.getComponentByGUID('anim_1').component;
		this.oAnimationComponent.addEventListener('ANIMATION_STARTED', this.handleEvents);
		this.oAnimationComponent.addEventListener('ANIMATION_PAUSED', this.handleEvents);
		this.oAnimationComponent.addEventListener('ANIMATION_COMPLETE', this.handleEvents);
			this.$domView.find('#btnPlay').click(function(e){
				if(oScope.oAnimationComponent.isPlaying())return;
				oScope.oAnimationComponent.play(0);
			});
			this.$domView.find('#btnPause').click(function(e){
				if(oScope.oAnimationComponent.isPlaying()){
					oScope.oAnimationComponent.pause();					
				};
			});
			this.$domView.find('#btnResume').click(function(e){
				if(oScope.oAnimationComponent.isPlaying())return;
				oScope.oAnimationComponent.resume();
			});
		PageAbstract.prototype.initialize.call(this, true);


	};

	pg02.prototype.handleEvents 								= function(e){
		this.$domView.find('#keyNum').html('Event :  "'+ e.type + '" --- at key frame '+ e.key);		
	};
	/**
	 * Destroys the Page Object
	 */
	pg02.prototype.destroy 							= function(){
		//Logger.logDebug('pg02.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables


		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return pg02;
});