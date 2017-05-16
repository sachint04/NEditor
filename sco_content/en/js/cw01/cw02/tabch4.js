define(['jquery', 'framework/viewcontroller/PageAbstractController', 'framework/utils/globals', 'framework/component/Tabs', 'framework/utils/Logger'], function($, PageAbstract, Globals, TabComponent, Logger) {
	/**
	 * Page Constructor
	 * @param p_oCourseController : Reference to CourseController
	 * @param p_$pageHolder : The HTML element to which the page will get appended
	 * @param p_domView : Page HTML View
	 * @param p_xmlData : Page XML Data
	 * @param p_cssData : Page CSS Data
	 * @return instance of Page
	 */
	function pg03(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
		//Logger.logDebug('pg03.CONSTRUCTOR() ');
		PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
		// ** START - Declare Page variables for individual screens
		this.oComponent
		this.selectedTabId = "tabpanel1_tab0";
		this.selectedTabIndex = 0;
		this.currentAudioId = "";

		this.onTabClicked = this.onTabClicked.bind(this);
		this.showEAT = this.showEAT.bind(this);
		// ** END - Declare Page variables for individual screens
		return this;
	}


	pg03.prototype = Object.create(PageAbstract.prototype);
	pg03.prototype.constructor = pg03;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	pg03.prototype.initialize = function() {
		// START - Custom Implementation for individual screens
		this.oComponent = this.oComponent = this.getComponentByGUID('tabpanel1').component;
		this.tabList = this.oComponent.getTabList();
		this.oComponent.addEventListener('TAB_CLICK', this.onTabClicked);
		if (this.$domView.find('.view-demo-icon').length > 0) {
			this.$domView.find('.view-demo-icon').on('click', this.showEAT);
		}
		this.playAudio('audio_1');
		// END - Custom Implementation for individual screens
		PageAbstract.prototype.initialize.call(this, true);
	};

	pg03.prototype.showEAT = function(e) {
		this.stopAudio();
		this.openPopup('simulation', 'Simulation', this.CourseControllerRef.getPageModelByGUID('cw01~cw01~pg04eat'), this.$domView.find('.view-demo-icon'));
	}
	pg03.prototype.onTabClicked = function(e) {
		this.selectedTabId = e.tab.attr('id');
		this.selectedTabIndex = Number(this.selectedTabId.split('_tab')[1]);
		this.playAudio.call(this, this.getSelectedAudioId());
	}

	pg03.prototype.getSelectedAudioId = function() {
		this.selectedTabIndex = Number(this.selectedTabId.split('_tab')[1]);
		return 'audio_' + (this.selectedTabIndex + 1);
	}
	pg03.prototype.onAudioComplete = function(e) {
		if (this.selectedTabIndex < this.tabList.length - 1) {
			var nextTabId = 'tabpanel1_tab' + (this.selectedTabIndex + 1)
			this.$domView.find('#' + nextTabId).trigger('click');
		} else {
			this.currentAudioId = "";
		}
	};
	/**
	 * Destroys the Page Object
	 */
	pg03.prototype.destroy = function() {
		// ** START - Custom Implementation for destroying Page variables
		//		this.oTabComponent.destroy();
		// ** END - Custom Implementation for destroying Page variables
		this.oComponent.removeEventListener('TAB_CLICK', this.onTabClicked);
		this.oComponent = null;
		this.selectedTabId = null;
		this.selectedTabIndex = null;
		this.currentAudioId = null;
		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return pg03;
}); 