define([
	'jquery',
	'framework/viewcontroller/PageAbstractController',
	'framework/core/PopupManager',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, PageAbstractController,PopupManager, Globals, Logger){

	function DropdownGroupPage(p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID){
		//Logger.logDebug('Pg01.CONSTRUCTOR() '+p_oCourseController+' ::::: '+p_$domPageHolder+' ::::: '+p_domPageView+' ::::: '+p_xmlPageData+' ::::: '+p_cssPageData);
		PageAbstractController.call(this, p_oCourseController, p_$domPageHolder, p_domView, p_xmlData, p_cssData, p_sGUID);

		return this;
	}

	DropdownGroupPage.prototype									= Object.create(PageAbstractController.prototype);
	DropdownGroupPage.prototype.constructor						= DropdownGroupPage;
	// ** The constructor and the lines above are mandatory for every page

	/**
	 * Function initialize() : gets called after the folowing:
	 * 		1) populating the view with the required content based on ID mapping,
	 * 		2) any activity initialization,
	 * 		3) all images are loaded.
	 * This function should be used to read additional parameters from the data XML and do the required customization to the HTML view
	 */
	DropdownGroupPage.prototype.initialize						= function(){
		//Logger.logDebug('DropdownGroupPage.initialize() | ');
		// ** START - Custom Implementation for individual screens


		// ** END - Custom Implementation for individual screens

		// ** Required call to the Course Controller to remove the preloader
		PageAbstractController.prototype.initialize.call(this, true);
	};





	/**
	 * Destroys the Page Object
	 */
	DropdownGroupPage.prototype.destroy							= function(){
		Logger.logDebug('DropdownGroupPage.destroy() | ');
		// ** START - Custom Implementation for destroying Page variables

		// ** END - Custom Implementation for destroying Page variables

		// ** Calling Super Class "destroy()" function
		PageAbstractController.prototype.destroy.call(this);
	};




	DropdownGroupPage.prototype.generateFeedbackPopup			= function (oComponent,sScoringUID,oFeedbackData,oDecisionData){
		var sDecisionID			= this.getDecisionID(this.sGUID),
			aFeedback			= oFeedbackData.getHistory(),

			nLength				= aFeedback.length,
			i,
			$resultPara			= $('<p class="txt-result"></p>'),
			$histroyContainer	= $('<div class="history-container"></div>'),
			$histroyContent		= $('<div class="history-content"><p class="txt-question"><span class="gr-question"></span><span class="txt"></span></p><p class="txt-option"><span class="radio-icon selected"></span><span class="radio-label"></span></p></div>'),
			$feedback			= $('<div class="feedback-container"><p>'+oFeedbackData.getTitle()+'</p><div class="feedback-content">'+oFeedbackData.getContent()+'</div></div>');
		/*
		<p class="txt-result"></p>
				<div class="history-container">
					<p class="txt-question"><span class="gr-question"></span><span class="txt"></span></p>
					<p class="txt-option"><span class="radio-icon selected"></span><span class="radio-label"></span></p>
				</div>*/


		for (i=0; i < nLength; i++) {
			var oFBPointer		= aFeedback[i],
				sQuestionText	= oFBPointer.sQuestionText || '',
				sOptionSelected	= oFBPointer.sOptionText || '',
				sFeedbackText	= oFBPointer.sImmediateFbContentText || '';
			//sPopupContent += '<strong>Question: </strong>'+sQuestionText+'<br/>';
			//sPopupContent += '<strong>Your Selection: </strong>'+sOptionSelected+'<br/>';
			//Logger.logDebug('Feedback Text = '+(sFeedbackText !== ''));
			//if(sFeedbackText !== ''){sResultFB += sFeedbackText+'<br/>';}
			if(sQuestionText !== '' && sOptionSelected !== ''){
				var $histroyContentClone	= $histroyContent.clone();
				$histroyContentClone.find('.txt-question .txt').append(sQuestionText);
				$histroyContentClone.find('.txt-option .radio-label').append(sOptionSelected);
				$histroyContainer.append($histroyContentClone);
				//Logger.logDebug('Feedback Text = '+(sFeedbackText !== ''));
			}
			if(sFeedbackText !== ''){
				$resultPara.append(sFeedbackText);
			}
		};

		var sPopupContent =$feedback.wrap('<div></div>').parent().html()+ $resultPara.wrap('<div></div>').parent().html() + $histroyContainer.wrap('<div></div>').parent().html();

		return this.openResultPopup('popup_close', 'RESULT', sPopupContent, this.$domView.find('#branching_1_submit'), 'branching-feedback');
	};

	/*
	DropdownGroupPage.prototype.onActivityComplete			= function(e){
		PageAbstractController.prototype.onActivityComplete.call(this, e);
		var oComponent		= e.target,
			sScoringUID		= e.scoringuid,
			oFeedbackData	= oComponent.getFeedback(),
			oDecisionData	= {};
		this.generateFeedbackPopup(oComponent,sScoringUID,oFeedbackData,oDecisionData);

	};
	*/

	DropdownGroupPage.prototype.openResultPopup						= function(p_sPopupID, p_sPopupTitle, p_sPopupContent, $returnFocusTo, p_sClassToAdd){
		var oPopup	= this.openPopup(p_sPopupID, p_sPopupTitle, p_sPopupContent, $returnFocusTo, p_sPopupID);

		return oPopup;
	};




	return DropdownGroupPage;
});