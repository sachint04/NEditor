	'use strict';
	/**
	 * BookmarkManager Module Parse/Construct LMS data object
	 * 
	 * @exports framework/core/BookmarkManager
	 */
define([
    'framework/controller/CourseController',
    'framework/utils/VariableManager',
    'framework/utils/EventDispatcher',
    'framework/core/BookmarkModelsGrenerator',
    'framework/core/score/ScoreManager',
    'framework/simulation/core/SIMScoreManager',
    'framework/utils/Logger'
], function(CourseController, VariableManager, EventDispatcher, BookmarkModelsGrenerator, ScoreManager, SIMScoreManager, Logger) {
    var __instanceBookmarkManager;
	
	/**
 	 * <b>BookmarkManager</b> is a singleton imeplementation. Parse/Construct LMS data object
     * @constructor
     * @alias module:BookmarkManager
     */
    function BookmarkManager() {
        //Logger.logDebug('BookmarkManager.CONSTRUCTOR() | CourseController = '+CourseController+' : VariableManager = '+VariableManager);
        //** TODO: Remove the reference of "CourseController" here

        EventDispatcher.call(this);
        this.onBookmarkUpdateComplete = this.onBookmarkUpdateComplete.bind(this);
        this.oBookmark = {};
    }

    BookmarkManager.prototype = Object.create(EventDispatcher.prototype);
    BookmarkManager.prototype.constructor = BookmarkManager;

    //** TODO: Remove the reference of "p_CourseController" here. The "CourseController" should directly be accessible by having a reference to it in the "define"
    BookmarkManager.prototype.init = function() {
        //Logger.logDebug('BookmarkManager.init() | CC = '+p_CourseController);
    };
	
	/**
	 * Parse bookmark json. Check for lesson location. Notify listeners to show "Resume"/"Restart" popup.
	 * @param {String} p_oBookmarkData
	 */
    BookmarkManager.prototype.parseBookmark = function(p_oBookmarkData) {
       	
       	
       	p_oBookmarkData["cw_completion"] = [];
       	p_oBookmarkData["page_completion"] = [];
       	
       	if(p_oBookmarkData){

			if(p_oBookmarkData.suspend_data)
			{
				p_oBookmarkData.suspend_data 			= p_oBookmarkData.suspend_data.replace(/\\n/g, "\\n")  
	               .replace(/\\'/g, "\\'")
	               .replace(/\\"/g, '\\"')
	               .replace(/\\&/g, "\\&")
	               .replace(/\\r/g, "\\r")
	               .replace(/\\t/g, "\\t")
	               .replace(/\\b/g, "\\b")
	               .replace(/\\f/g, "\\f");
				p_oBookmarkData.suspend_data 				= p_oBookmarkData.suspend_data.replace(/[\u0000-\u0019]+/g,""); 
				p_oBookmarkData.suspend_data 				= p_oBookmarkData.suspend_data.replace(/'/g, '"');
				try{
					p_oBookmarkData.suspend_data 			= JSON.parse(p_oBookmarkData.suspend_data);
					p_oBookmarkData.cw_completion			= p_oBookmarkData.suspend_data.cw_completion || [];
					p_oBookmarkData.page_completion			= p_oBookmarkData.suspend_data.page_completion || [];
					
				}catch(e){
					console.log('BookmarkManager: parseBookmark() Error! Suspend_data - invalid JSON format.');
				} 
				
			}

			CourseController.parseBookmarkData(p_oBookmarkData);

			var oEvent = {type:'BOOKMARK_EXISTS', target:this, isFirstPage: false};
			if(p_oBookmarkData.location == CourseController.findCWFirstPage().getGUID()){
				oEvent.isFirstPage = true;			
			}
			this.dispatchEvent('BOOKMARK_EXISTS', oEvent);
		}else{
			//** TODO: Use a Dispatch instead for loading the first Page
			CourseController.launchCourse();			
		}
    };

    BookmarkManager.prototype.onBookmarkUpdateComplete = function(e) {
        var ModelGenerator = e.target;
        ModelGenerator.removeEventListener('UPDATE_BOOKMARK_DATA_COMPLETE', this.onBookmarkUpdateComplete);
        ModelGenerator.destroy();
        ModelGenerator = null;
        CourseController.launchCourse();
        //this.dispatchEvent('BOOKMARK_EXISTS', {type:'BOOKMARK_EXISTS', target:this});
    };
    /*
     * {
     * 		location		: 'cw01~pg01',
     * 		completion		: 'incomplete',
     * 		suspend_data	: {
     * 			cw_completion		: [],
     * 			page_completion		: [],
     * 			activity_scoringUID	: {}
     * 		}
     * }
     */
    BookmarkManager.prototype.getBookmark = function() {
        //Logger.logDebug('BookmarkManager.getBookmark() | ');
        var oCourseModelBookMark = CourseController.getBookmarkData();

        this.oBookmark = {};
        this.oBookmark.location = oCourseModelBookMark.location;
        this.oBookmark.completion_status = this.getCompletionStatus(oCourseModelBookMark.page_completion);
        this.oBookmark.suspend_data = {
            cw_completion: oCourseModelBookMark.cw_completion,
            page_completion: oCourseModelBookMark.page_completion
        };
        this.oBookmark.percentScore = 0;
      
        if (oCourseModelBookMark.cw_completion.indexOf(1) === -1 && oCourseModelBookMark.cw_completion.indexOf(0) === -1) {
                this.oBookmark.completion_status = "completed";
        }
        return this.oBookmark;
    };

    BookmarkManager.prototype.getCompletionStatus = function(p_aPageCompletion) {
        var result = "incomplete";
        var sPageCompletion = p_aPageCompletion.toString();
        if (sPageCompletion.indexOf('1') == -1 && sPageCompletion.indexOf('0') == -1) {
            result = 'completed';
        }
        Logger.logDebug('BookmarkManager.getCompletionStatus() | result = ' + result);
        return result;
    };

    BookmarkManager.prototype.toString = function() {
        return 'framework/core/BookmarkManager';
    };

    if (!__instanceBookmarkManager) {
        __instanceBookmarkManager = new BookmarkManager();
        //console.log('^^^^^^^^^^^^ Bookmark MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instanceBookmarkManager);
    }

    return __instanceBookmarkManager;
});
