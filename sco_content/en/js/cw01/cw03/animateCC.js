define(['jquery', 'framework/viewcontroller/PageAbstractController', 'framework/utils/globals', 'framework/utils/VariableManager', 'framework/utils/Logger'], function($, PageAbstract, Globals, VariableManager, Logger) {
	/**
	 * Page Constructor
	 * @param p_oCourseController : Reference to CourseController
	 * @param p_$pageHolder : The HTML element to which the page will get appended
	 * @param p_domView : Page HTML View
	 * @param p_xmlData : Page XML Data
	 * @param p_cssData : Page CSS Data
	 * @return instance of Page
	 */
	function ClicakbleImages(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
		//Logger.logDebug('ClicakbleImages.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		this.onBtnClick = this.onBtnClick.bind(this);
		// ** START - Declare Page variables for individual screens

		// ** END - Declare Page variables for individual screens
		return this;
	}


	ClicakbleImages.prototype = Object.create(PageAbstract.prototype);
	ClicakbleImages.prototype.constructor = ClicakbleImages;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 *      1) populating the view with the required content based on ID mapping,
	 *      2) any activity initialization,
	 *      3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	ClicakbleImages.prototype.initialize = function() {

		this.aComponents[0].addEventListener('btn_click', this.onBtnClick);
		var oScope = this;
		if (VariableManager.getVariable('scenario-jump')) {
			$('#container_navigation').addClass('hide');
			VariableManager.setVariable('scenario-jump', false);
			this.$domView.find('#btn_start').removeClass('hide');
			var $btnStart = this.$domView.find('#btn_start');
			$btnStart.removeClass('hide');
			$btnStart.click(function(e) {
				oScope.navigateNext();
			});
			VariableManager.setVariable('scenario-jump', false)
		}
		PageAbstract.prototype.initialize.call(this, true);
	};

	ClicakbleImages.prototype.onBtnClick = function(e) {
		var sBtn = e.clicktarget;
		var sPopupID = '#popup_' + sBtn.split('_')[1];

		this.$domView.find('.page-popup').hide().addClass('hide');
		this.$domView.find(sPopupID).removeClass('hide').hide().fadeIn();
	};

	ClicakbleImages.prototype.handleEvents = function(e) {
		//Logger.logDebug('ClicakbleImages.handleButtonEvents() '+$(e.target).attr('id'));
		e.preventDefault();
		var obj = e.target.getAttribute('target') ? e.target : $(e.target).parent()[0];
		var sBtnName = obj.getAttribute('id'), sBtnText = $(obj).find("div").html();
		sPopupText = Globals.getElementByID(this.$domView, obj.getAttribute('target'), 'ClicakbleImages.initialize()').html();
		//To add call back take the returned obj below and add .setcallback call to it
		this.openPopup('popup_close', sBtnText, sPopupText, $(e.target));
	};

	/**
	 * Destroys the Page Object
	 */
	ClicakbleImages.prototype.destroy = function() {
		//Logger.logDebug('ClicakbleImages.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables

		this.aComponents[0].removeEventListener('btn_click', this.onBtnClick);
		// ** END - Custom Implementation for destroying Page variables
		$('#container_navigation').removeClass('hide');
		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return ClicakbleImages;
}); 