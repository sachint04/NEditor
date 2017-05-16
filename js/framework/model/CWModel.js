'use strict';
/**
 * <b>CWModel</b> represents 'cw' node in corse xml. It has helper methods to access data.
 * @exports framework/model/CWModel 
 */
define([
	'jquery',
	'framework/utils/Logger'
], function($, Logger){

	/**
	 * 
	 * @constructor 
	 *  @alias CWModel   
	 */
	function CWModel(p_xmlnodeCW, p_sGUID, p_sParentCWGUID, p_oParentCW){
		var $xmlnodeCW = $(p_xmlnodeCW);
		this.sCWID = $xmlnodeCW.attr('data');
		this.sHierarchyLevel = $xmlnodeCW.attr('hierarchyLevel');
		this.sCWLabel = $xmlnodeCW.attr('label');
                if(this.sCWLabel=="Assessment")
                {
			this.sCWRandomization=$xmlnodeCW.attr('randomization');
			if(typeof $xmlnodeCW.attr('totalDisplayPages') != "undefined")
				this.sCWPickQuestions=$xmlnodeCW.attr('totalDisplayPages');
			this.sCWPassPer=$xmlnodeCW.attr('pasPer');
			this.sCWPagesFromStart=$xmlnodeCW.attr('pagesFromStart');
			this.sCWPagesFromEnd=$xmlnodeCW.attr('pagesFromEnd');
                }
		this.nCWStatus = 0; /*0=not visited | 1=visited | 2=completed*/
		this.sParentCWGUID = p_sParentCWGUID;
		this.oParentCW = p_oParentCW;
		this.aChildPages = [];
		/*this.aChildCW = [];*/
		this.sGUID = p_sGUID;

		Logger.logDebug('CWModel.CONSTRUCTOR() | CWID = '+this.sCWID+' : Label = '+this.sCWLabel+' : PARENT = '+p_sParentCWGUID+' : GUID = '+this.sGUID);
		return this;
	}

	CWModel.prototype = {
		constructor:CWModel,
		
		
		toString:function(){
			return "framework.model.CWModel";
		},
		
		/**
		 * @member
		 * Returns total count of page in current topic (CW)
		 * @returns {Number} 
		 */
		getCWTotalPages:function(){
			return this.aChildPages.length;
		},
		
		/**
		 * Returns CW ID i.e 'CW01'
		 * @returns {String} 
		 */
		getCWID:function (){
			return this.sCWID;
		},
		
		/**
		 * Returns CW GUID i.e. 'cw01~cw01~cw01'
		 * @returns {String} 
		 */
		getGUID:function(){
			return this.sGUID;
		},
		getCWStatus:function(){return this.nCWStatus;},
		setCWStatus:function(p_nCWStatus){
			if(this.nCWStatus!=2)
				this.nCWStatus = p_nCWStatus;
		},
		
		/**
		 * Returns parent CW GUID i.e. 'cw01~cw01'
		 * @returns {String} 
		 */
		getParentCWGUID:function(){
			return this.sParentCWGUID;
		},
		
		/**
		 * Returns parent CW Object
		 * @returns {Object} 
		 */
		getParentCW:function(){
			return this.oParentCW;
		},
		getHierarchyLevel:function(){
			return this.sHierarchyLevel;
		},
		getCWLabel:function(){
			return this.sCWLabel;
		},
		
		/**
		 * Returns Array child {@link PageModel} Objects
		 * @returns {Array} 
		 */
		getChildPages:function(){
			return this.aChildPages;
		},
		
		addChildPages:function(argNewVal){
			this.aChildPages.push(argNewVal);
		}
	};

	return CWModel;
});