define([
    'jquery',
    'framework/viewcontroller/PageAbstractController',
    'framework/utils/globals',
    'framework/utils/Logger',
    'framework/component/Menu'

], function($, PageAbstract, Globals, Logger, MenuComponent) {
    /**
     * Page Constructor
     * @param p_oCourseController : Reference to CourseController
     * @param p_$pageHolder : The HTML element to which the page will get appended
     * @param p_domView : Page HTML View
     * @param p_xmlData : Page XML Data
     * @param p_cssData : Page CSS Data
     * @return instance of Page
     */
    function Intro(p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID) {
//Logger.logDebug('Intro.CONSTRUCTOR() ');
        PageAbstract.call(this, p_oCourseController, p_$pageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);
// ** START - Declare Page variables for individual screens
		this.oComponent;
		this.playedOnce = false;
		this.selectedTabId;
		this.selectedTabIndex = 0;
		this.currentAudioId = "";
		this.onTabClicked 	= this.onTabClicked.bind(this);
		this.showTip	= this.showTip.bind(this);
		this.showEAT	= this.showEAT.bind(this);
		// ** END - Declare Page variables for individual screens
		return this;
	}

	Intro.prototype									= Object.create(PageAbstract.prototype);
	Intro.prototype.constructor						= Intro;
	// ** The constructor and the lines above are mandatory for every page

    /**
     * Function initialize() : gets called after the folowing:
     * 1) populating the view with the required content based on ID mapping,
     * 2) any activity initialization,
     * 3) all images are loaded.
     * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
     */
    Intro.prototype.initialize = function() {
        this.dispatchPageLoadedEvent();
        this.oComponent = this.aComponents[1];
		//Logger.logDebug('this.oComponent in page 4 = '+ this.oComponent);
		this.oComponent.addEventListener('INDICATOR_CLICK', this.onTabClicked);
		if(this.$domView.find('.ui-tip-btn').length > 0){
			this.$domView.find('.ui-tip-btn').on('click', this.showTip);
		}
		if(this.$domView.find('.view-demo-icon').length > 0){
			this.$domView.find('.view-demo-icon').on('click', this.showEAT);
		}
        
        PageAbstract.prototype.initialize.call(this, true);
	};
	

	Intro.prototype.showEAT					= function(e){
		var file = this.getGUID().split('~'),
		windowTitle = this.getCurrentPageLabel().split(' ').join('');
		if(file.length > 0 ){
			file  = 'sco_content/en/EAT/'+file[file.length-1]+'_eat.html';
		}
		if(this.currentAudioId != ""){
			this.pauseAudio(this.currentAudioId);
		}
		window.open(file,windowTitle,"location=1,status=1,scrollbars=1,width=1014,height=576,left=0,top=0,location=0,menubar=0,resizable=1,titlebar=0,toolbar=0,",false );
	}
	Intro.prototype.showTip					= function(e){
		var content = "text not found! ";
		for(var i = 0; i<this.jsonXMLData.data.pageText.length;i++){
			if(this.jsonXMLData.data.pageText[i]._id.toLowerCase() == 'tip'){
				content = this.jsonXMLData.data.pageText[i].__cdata;
				break;
			}
		}
		/* stop audio if playing */
		if(this.currentAudioId != ""){
			this.pauseAudio(this.currentAudioId);
		}
		this.openPopup('transcript','Tip', content,this.$domView.find('.ui-tip-btn'), 'tip-popup')
	};
	
	Intro.prototype.handleEvents 					= function(e){
		//Logger.logDebug('Intro.handleButtonEvents() '+$(e.target).attr('id'));
		e.preventDefault();
		var sBtnName	= e.target.getAttribute('id'),
			sBtnText	= $(e.target).html();
		sPopupText			= Globals.getElementByID(this.$domView, e.target.getAttribute('target'), 'Intro.initialize()').html();
		//To add call back take the returned obj below and add .setcallback call to it
		this.openPopup('popup_close', sBtnText, sPopupText, $(e.target));
	};


	Intro.prototype.onTabClicked				= function(e){
		this.selectedTabId 	= e.indicator.attr('id');
		this.selectedTabIndex  	=  Number(this.selectedTabId.split('_indicator')[1]);
		this.currentAudioId  = 'audio_'+ (this.selectedTabIndex +1);
		this.stopAudio();
		PageAbstract.prototype.playAudio.call(this, this.currentAudioId);
	}
	
	Intro.prototype.playAudio				= function(p_sAudioID){
		this.currentAudioId = p_sAudioID;
		Logger.logDebug('playAudio | p_sAudioID = '+ p_sAudioID);
		PageAbstract.prototype.playAudio.call(this, p_sAudioID);
	};
	
	Intro.prototype.pauseAudio				= function(p_sAudioID){
		PageAbstract.prototype.pauseAudio.call(this, this.currentAudioId );
	
	};
	
	Intro.prototype.onAudioComplete				= function(e){
	//	Logger.logDebug('Intro.onAudioComplete() | Sound ID = "'+e.soundID);
		var audioId = 'audio_'+ (this.selectedTabIndex +1);
		if(this.currentAudioId === 'audio_1' && !this.playedOnce){
			// PageAbstract.prototype.playAudio.call(this, 'audio_2');
			this.$domView.find('#carousel1_indicator1').trigger('click');
			this.playedOnce = true;
		}else{
			this.currentAudioId ="";
		}
	};

	/**
	 * Destroys the Page Object
	 */
	Intro.prototype.destroy 							= function(){
		//Logger.logDebug('Intro.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables
		var oScope			= this,
			$helpfulTipsBtn		= Globals.getElementByID(this.$domView, 'btn_helpfultips', 'Intro.initialize()');


		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstract.prototype.destroy.call(this);
	};

	return Intro;
});