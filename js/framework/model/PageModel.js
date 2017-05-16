'use strict';
/**
 *  PageModel represents 'page' node in course xml. It also store runtime time page data 
 * i.e. id, type, Status, script file name, css file name etc  
 * Model for "course.xml" page node 
 * @exports framework/model/PageModel 
 */
define([
	'jquery',
	'framework/utils/Logger'
], function($, Logger){
	/**
	 * @constructor
	 * @alias PageModel 
	 */
	function PageModel(p_xmlnodePage, p_sGUID, p_sParentCWGUID, p_oParentCW){
		var $xmlnodePage = $(p_xmlnodePage);
		/** property {String} pageID */
		this.sPageID = $xmlnodePage.attr('data');
		this.sPageLabel = $xmlnodePage.attr('label');
		this.sPageType = $xmlnodePage.attr('pageType');
		this.sTemplateID = $xmlnodePage.attr('templateID');
		this.sViewType = $xmlnodePage.attr('viewType');
		this.sScriptFileName = $xmlnodePage.attr('script');
		this.sCSSFileName = $xmlnodePage.attr('css');
		this.sEventID = $xmlnodePage.attr('eventid') || '';
		this.nOrder = Number($xmlnodePage.attr('order')) || '';

		this.sJumpToPageGUID = $xmlnodePage.attr('jumpTo');
		this.sBackToPageGUID = $xmlnodePage.attr('backTo');
		this.sParentCWGUID = p_sParentCWGUID; /*Reference to its parent CW GUID*/
		this.sGUID = p_sGUID; /*Global Unique Identifier*/
		this.sPrevPageID; /*Reference to the previous page Object*/
		this.sNextPageID; /*Reference to the next page Object*/
		this.nPageStatus = 0; /*0=not visited | 1=visited | 2=completed*/
		this.sPageNumber = ""; /*Stores the page Number for the Page object*/
		this.sDisplayPageNumber = ""; /*Stores the page Number for the Page object*/
		this.sDisplayTotalPageNumber = ""; /*Stores the page Number for the Page objec*/
		this.bIgnorePagination 		= ($xmlnodePage.attr('ignorepagination') === "true"); 
		
		
		
		return this;
	}
	

	PageModel.prototype = {
		/**
		 * @constructor
		 * @alias PageModel 
		 */
		constructor:PageModel,
		/**
		 * @member
		 * Function: toString
		 * Description:
		 * Returns a string representation of the current instance of the class. By
		 * default this will be the name of the class.
		 *
		 * Returns:
		 * String - name of the class or alternate implementation.
		 */
		toString:function(){
			return "framework.model.PageModel";
		},

		/**
		 * pageStatus Getter & Setter
		 */
		getPageStatus:function(){
			if(this.sPageType === 'page'  || this.sPageType === '' || !this.sPageType){
				return this.nPageStatus;
			}
			return 2;
		},
		setPageStatus:function(p_nPageStatus){
			//Logger.logDebug('PageModel.setPageStatus() | ');
			if(this.nPageStatus != 2 && p_nPageStatus < 3){
				//Logger.logDebug('\tSetting Status FROM  = '+this.nPageStatus+' : TO = '+p_nPageStatus);
				this.nPageStatus = p_nPageStatus;
			}
		},

		resetPageStatus:function(){
			this.nPageStatus = 0;
		},

		/**
		 * nextPageID Getter & Setter
		 */
		getNextPageID:function(){return this.sNextPageID;},
		setNextPageID:function(p_sNextPageID){
			this.sNextPageID = p_sNextPageID;
		},

		/**
		 * prevPageID Getter & Setter
		 */
		getPrevPageID:function(){return this.sPrevPageID;},
		setPrevPageID:function(p_sPrevPageID){
			this.sPrevPageID = p_sPrevPageID;
		},

		/**
		 * strPageNumber Getter & Setter
		 */
		getPageNumber:function(){return this.sPageNumber;},
		setPageNumber:function(p_sPageNumber){
			this.sPageNumber = p_sPageNumber;
		},

		/**
		 * strDisplayPageNumber Getter & Setter
		 */
		getDisplayPageNumber:function(){return this.sDisplayPageNumber;},
		setDisplayPageNumber:function(p_sDisplayPageNumber){
			this.sDisplayPageNumber = p_sDisplayPageNumber;
		},

		/**
		 * strTotalPageNumber Getter & Setter
		 */
		getDisplayTotalPageNumber:function(){return this.sDisplayTotalPageNumber;},
		setDisplayTotalPageNumber:function(p_sDisplayTotalPageNumber){
			this.sDisplayTotalPageNumber = p_sDisplayTotalPageNumber;
		},
		
		/**
		 * jumpToPageGUID Getter & Setter
		 */
		getJumpToPageGUID:function(){return this.sJumpToPageGUID;},
		setJumpToPageGUID:function(p_sJumpToPageGUID){
			this.sJumpToPageGUID = p_sJumpToPageGUID;
		},

		/**
		 * backToPageGUID Getter & Setter
		 */
		getBackToPageGUID:function(){return this.sBackToPageGUID;},
		setBackToPageGUID:function(p_sBackToPageGUID){
			this.sBackToPageGUID = p_sBackToPageGUID;
		},

		/**
		 * pageType Getter
		 */
		getPageType:function(){return this.sPageType;},

		/**
		 * viewType Getter
		 */
		getViewType:function(){return this.sViewType;},

		/**
		 * pageLabel Getter
		 */
		getPageLabel:function(){return this.sPageLabel;},

		/**
		 * templateID Getter
		 */
		getTmplateID:function(){return this.sTemplateID;},

		/**
		 * Returns parent {@link CWModel} GUID
		 * @returns {String} 
		 */
		getParentCWGUID 			: function(){return this.sParentCWGUID;},
		
		/**
		 * Returns current Page ID i.e. pg01
		 * @returns {String} 
		 */
		getPageID 					: function(){return this.sPageID;},
		/**
		 * Returns current Page GUID i.e. cw01~cw01~pg01
		 * @returns {String} 
		 */
		getGUID 					: function(){return this.sGUID;},
		/**
		 * Returns JS file name
		 * @returns {String} 
		 */
		getScriptFileName 			: function(){return this.sScriptFileName;},
		/**
		 * Returns CSS file name
		 * @returns {String} 
		 */
		getCSSFileName 				: function(){return this.sCSSFileName;},
		getEventID	 				: function(){return this.sEventID;},
		getOrder 					: function(){return this.nOrder;}
	};

	return PageModel;
});