		'use strict';
	/**
	 * Course TOC model 
	 * 
	 * @exports framework/model/CourseModel
	 * 
	 * @requires module:framework/core/AssessmentManager
	 * @requires module:framework/model/CourseConfigModel
	 * @requires module:framework/model/CWModel
	 * @requires module:framework/model/PageModel
	 * @requires module:framework/utils/EventDispatcher
	 * @requires module:framework/utils/globals
	 * @requires module:framework/core/AudioManager
	 *  
	 */
define([
    'jquery',
    'x2js',
    'framework/model/CourseConfigModel',
    'framework/model/CWModel',
    'framework/model/PageModel',
    'framework/utils/EventDispatcher',
    'framework/utils/globals',
    'framework/core/AssessmentManager',
    'framework/utils/Logger'
], function($, X2JS, CourseConfig, CWModel, PageModel, EventDispatcher, Globals, AssessmentManager, Logger) {
    var __instanceCourseModel;

    /** 
     * <b>framework/model/CourseModel</b> Model object for course.xml with helper methods
     * @constructor
     * @alias  module:CourseModel
     */
    function CourseModel() {
        Logger.logDebug('CourseModel.CONSTRUCTOR() | ');
        EventDispatcher.call(this);

        this.oCourseMap = {};
        this.aPageModelList = [];
        this.aCWModelList = [];
        this.oCurrentPageModel;
        this.sCurrentPageGUID;
        this.tmpArr = [];
        this.oCWRoot;
        this.sCourseTitle = "";
		this.sCurrTopicTitle = "";
        this.sLearnerName="";
        this.oResources;
        this.setCurrentPage = this.setCurrentPageModel.bind(this);
        this.getCurrentPage = this.getCurrentPageModel.bind(this);
    }

	/** Inheritance */
    CourseModel.prototype = Object.create(EventDispatcher.prototype);
    CourseModel.prototype.constructor = CourseModel;
    
    CourseModel.prototype.init = function(p_courseXML) {
        //Logger.logDebug('CourseModel.initialize() | ');
        //var $courseXML = $(p_courseXML);
        this.sCourseTitle = $(p_courseXML).find('cw').eq(0).attr('label');
		this.parseCourseXML(p_courseXML, null, null);
        if(CourseConfig.getConfig('assessment').guid) // if assessment present
            this.setAssessmentModel();
        //Logger.logDebug('oCourseMap = '+JSON.stringify(this.oCourseMap));
        //Logger.logDebug(Globals.toXMLString(p_courseXML));
        //Logger.logDebug(JSON.stringify(this.aPageModelList));
        this.dispatchEvent('COURSE_MODEL_CREATED', {target: this, type: 'COURSE_MODEL_CREATED'});
        $.publish("COURSE_MODEL_CREATED");
    };

    CourseModel.prototype.parseCourseXML = function(p_courseXML, p_sParentHirearchy, p_oParentCW) {
        //Logger.logDebug('CourseModel.parseCourseXML() | ');
        var oScope = this,
                $courseXML = $(p_courseXML),
                nPageNumber = 0;
        $courseXML.children().each(function(index, xmlnodeElement) {
            //Logger.logDebug('CourseModel.parseCourseXML() | '+xmlnodeElement.nodeName+' : '+xmlnodeElement.getAttribute('data')+' : '+xmlnodeElement.getAttribute('label'));
            var sGUID = oScope.getGUID(xmlnodeElement);
            //Logger.logDebug('sGUID = '+sGUID+' : '+p_sParentHirearchy);
            if (xmlnodeElement.nodeName === "cw") {
                //addProperties(xmlnodeElement, p_sParentHirearchy);

                var oCW = new CWModel(xmlnodeElement, sGUID, p_sParentHirearchy, p_oParentCW);
                oScope.aCWModelList[sGUID] = oScope.aCWModelList.length;
                oScope.aCWModelList.push(oCW);
                if (oScope.oCWRoot == null) {
                    oScope.oCWRoot = oCW;
                }

                oScope.parseCourseXML(xmlnodeElement, sGUID, oCW);
            }
            if (xmlnodeElement.nodeName === "page") {
                //addProperties(xmlnodeElement, p_sParentHirearchy);

                var oPageModel = new PageModel(xmlnodeElement, sGUID, p_sParentHirearchy, p_oParentCW);
                //oPageModel.setPageNumber(nPageNumber++);
                if (oScope.aPageModelList[sGUID]) {
                    Logger.logError('CourseModel.parseCourseXML() | ERROR: Duplicate GUID "' + sGUID + '" found.');
                }
                oScope.aPageModelList[sGUID] = oScope.aPageModelList.length;
                if (p_oParentCW.sGUID == CourseConfig.getConfig('assessment').guid)
                {
                    oScope.tmpArr.push(oScope.aPageModelList.length); //save the positions of the assesment pages in an array
                }
                oScope.aPageModelList.push(oPageModel);
                // ** Adding the page GUID to the CW
                oScope.aCWModelList[oScope.aCWModelList[p_sParentHirearchy]].addChildPages(sGUID);

                if (oScope.oCurrentPageModel == null) {
                    oScope.setCurrentPageModel(oPageModel);
                }
            }
            if (xmlnodeElement.nodeName === "resources") {
            	oScope.parseResourceData(xmlnodeElement);
            }
        });
    };
    CourseModel.prototype.setAssessmentModel = function() {
		if(CourseConfig.getConfig('assessment').guid != "") {
			var oScope = this;
			aPageModel = [];
			AssessmentManager.init(this.findCW(CourseConfig.getConfig('assessment').guid));
			oCW = this.findCW(CourseConfig.getConfig('assessment').guid);
			childPages = oCW.getChildPages();
			aTemp = childPages.slice(0, oCW.sCWPagesFromStart);
			aPageModel.push(this.findPage(childPages.slice(0, oCW.sCWPagesFromStart)));//save the page models of the asessment
		}
        jQuery.each(AssessmentManager.getQuestionSet(), function(i, val) {
            aTemp.push(val);
            aPageModel.push(oScope.findPage(val));
        });
        jQuery.each(childPages.slice(-oCW.sCWPagesFromStart), function(i, val) {
            aTemp.push(val);
            aPageModel.push(oScope.findPage(val));

        });

        oCW.aChildPages = aTemp;
        
        // the following code rearrange the assessment pages
        $.each(aTemp, function(key, value) {
            oScope.aPageModelList[oScope.tmpArr[key]] = aPageModel[key];
            oScope.aPageModelList[value] = oScope.tmpArr[key];
        });
		
        len = oScope.tmpArr.length;
        //remove the questions which are out of the picked questions from pagemodels
        for (i = 1; i <= (oScope.tmpArr.length - aTemp.length); i++)
        {
            a = oScope.tmpArr[len - i];
            oScope.aPageModelList.splice(a, 1);
        }
		
        $.each(AssessmentManager.getQuestionSetNotDisp(), function(key, value) {
            
            delete oScope.aPageModelList[value]
        });
    };
	
	CourseModel.prototype.bookmarkLearnerName = function(sLearnerName) {
		this.sLearnerName=sLearnerName;
	};
	
    CourseModel.prototype.parseBookmarkData = function(p_oBookmarkData) {
        // ** SAMPLE BOOKMARK DATA : '{"location":"cw01~cw01~pg04","cw_completion":"1", "page_completion":"2,2,2,1"}'

        var i,sLocation 	= p_oBookmarkData.location,
            aCWCompletion 	= p_oBookmarkData.cw_completion,
        	aPageCompletion = p_oBookmarkData.page_completion;
        	
			for (i = 0; i < aCWCompletion.length; i++) {
				this.aCWModelList[i].setCWStatus(Number(aCWCompletion[i]));
			};

        var temparr = [];
        for (i = 0; i < this.aPageModelList.length; i++) {
        	if(aPageCompletion[i]){
              this.aPageModelList[i].setPageStatus(Number(aPageCompletion[i]));        		
        	}
        }
        
    	var oPageModel 		= this.findPage(sLocation);
    	if(oPageModel){
	        var sCWID 			= oPageModel.getParentCWGUID(),
	        	oCW 			= this.findCW(sCWID),
	        	sCWLabel 		= oCW.getCWLabel();
			
	        if (sCWLabel != undefined && sCWLabel === "Assessment") {
	
	            oPageModel = this.findCWFirstPage(sCWID);
	        }
	
	        this.setCurrentPageModel(oPageModel);
    	};
    };

    CourseModel.prototype.getBookmarkData = function() {
        // ** SAMPLE BOOKMARK DATA : '{"location":"cw01~cw01~pg04","cw_completion":"1", "page_completion":"2,2,2,1"}'
        var i,
                sLocation = this.getCurrentPageGUID(),
                aCWCompletion = [],
                aPageCompletion = [];

        for (i = 0; i < this.aCWModelList.length; i++) {
        	var cwID = this.aCWModelList[i].getGUID();
            aCWCompletion.push(this.getCWStatus(cwID));
        }
		
        for (i = 0; i < this.aPageModelList.length; i++) {
            var sPageType = this.aPageModelList[i].getPageType();
                aPageCompletion.push(String(this.aPageModelList[i].getPageStatus()));
        }
        //Logger.logDebug('CourseModel.getBookmarkData() | Location = '+sLocation+' : CW Completion = '+aCWCompletion+' : Page Completion = '+aPageCompletion);
		
        return {location: sLocation,
            cw_completion: aCWCompletion,
            page_completion: aPageCompletion};
    };

    /*function addProperties(p_xmlnodeElement, p_sParentHirearchy){
     sHirearchy = this.getGUID(p_xmlnodeElement);
     $(p_xmlnodeElement).attr('parent', p_sParentHirearchy).attr('GUID', sHirearchy);;
     this.oCourseMap[sHirearchy] = p_xmlnodeElement;
     //Logger.logDebug('Parent Hirearchy = '+p_sParentHirearchy+' : Hirearchy = ' + sHirearchy + ' : Node = ' + Globals.toXMLString(p_xmlnodeElement));
     }*/

    CourseModel.prototype.getGUID = function(p_element) {
        var element = p_element;
        var sCWID = [$(element).attr('data')];
        while ($(element).parent().length > 0) {
            /*
             * The check below is exclude the last iteration which results in the ROOT of the XML Document.
             * It retrieves [object XMLDocument] instead of [object Element] due to which the data attribute
             * is retrieved as undefined.
             */
            //Logger.logDebug('LENGTH = '+$(element).parent()[0]);
            if ($(element).parent().attr('data') != undefined) {
                sCWID.push($(element).parent().attr('data'));
            }
            element = $(element).parent()[0];
        }
        //Logger.logDebug('Lebel = '+sCWID);

        return sCWID.reverse().join('~');
    };

    CourseModel.prototype.isNextAvailable = function() {
        var nPageIndex = this.aPageModelList[this.sCurrentPageGUID] + 1,
                nTotalPages = this.aPageModelList.length;
        //Logger.logDebug('CourseModel.isNextAvailable() | Curr Page Index = "' + nPageIndex +'" : Total Pages = "'+nTotalPages+'"');
        if (nPageIndex < nTotalPages) {
            return true;
        }
        return false;
    };

    CourseModel.prototype.isBackAvailable = function() {
        var nPageIndex = this.aPageModelList[this.sCurrentPageGUID];
        //Logger.logDebug('CourseModel.isBackAvailable() | Curr Page Index = "' + nPageIndex);
        if (nPageIndex === 0) {
            return false;
        }
        return true;
    };

    CourseModel.prototype.navigate = function(p_sDirection) {
        //Logger.logDebug('CourseModel.navigate() | Direction = "' + p_sDirection+'" ');
        var oPageModel,
                sDirection = p_sDirection.toUpperCase();

        if (sDirection !== 'NEXT' && sDirection !== 'BACK') {
            Logger.logError('CourseModel.navigate() | Invalid parameter "' + p_sDirection + '". Allowed parameters are "NEXT" or "BACK".');
        }

        if (sDirection == "BACK") {
            oPageModel = this.aPageModelList[this.aPageModelList[this.sCurrentPageGUID] - 1];
            if (oPageModel == null) {
                return false;
            }
        }

        if (sDirection == "NEXT") {
            oPageModel = this.aPageModelList[this.aPageModelList[this.sCurrentPageGUID] + 1];
            if (oPageModel == null) {
                return false;
            }
        }

        this.setCurrentPageModel(oPageModel);
        return true;
    };

    /**
     * Current Page Getter & Setter
     */
    CourseModel.prototype.getCurrentPageModel = function() {
        return this.oCurrentPageModel;
    };
    CourseModel.prototype.setCurrentPageModel = function(p_oPageModel) {
        this.oCurrentPageModel = p_oPageModel;
        this.sCurrentPageGUID = this.oCurrentPageModel.getGUID();
        this.dispatchEvent('PAGE_MODEL_UPDATED', {target: this, type: 'PAGE_MODEL_UPDATED', pageModel: this.oCurrentPageModel});
        //Logger.logDebug('CourseModel.setCurrentPageModel() | '+this.sCurrentPageGUID);
    };


	
	/**cdcd
     * Get the status of a given CW GUID.
     * @param p_sCWGUID:CW GUID
     * @return :Number  0=not visited | 1=visited | 2=completed
     */
    CourseModel.prototype.getCWStatus								= function(p_sCWGUID) {
		var oCW = 	this.findCW(p_sCWGUID);
    	//if(!p_bUpdated) return oCW.getCWStatus();
    	
    	var aPages 	= oCW.getChildPages();
			var bComplete 	= true;
			var nCWStatus 	= 0;
				
			for(var i = 0 ; i < aPages.length;i++){
				var oPage 			= this.findPage(aPages[i]);
				var sPageStatus 	= oPage.getPageStatus();  
				//console.log('getCWStatus() page : '+ oPage.getGUID()+'  |  status : '+sPageStatus);
				if(sPageStatus == 0 || sPageStatus == 1){
					bComplete = false;
				}
				if(sPageStatus == 1 || sPageStatus == 2){
					nCWStatus = 1;
				}					
			}
			if(bComplete){
				nCWStatus = 2;
			}
			oCW.setCWStatus(nCWStatus);
			return nCWStatus;
    };

    /**
     * Set the status of a given CW GUID.
     * @param p_sCWGUID:String CW GUID
     * @param p_nStatus:Number 0=not visited | 1=visited | 2=completed
     * @return :void
     */
    CourseModel.prototype.setCWVisitStatus = function(p_sCWGUID, p_nStatus) {
        //Logger.logDebug('CourseModel.setCWVisitStatus() | CW GUID = ' + p_sCWGUID + ' : Status = ' + p_nStatus);
    };

    /**
     * Get the Assessment completion
     * @return :Boolean
     */
    CourseModel.prototype.isAssessmentComplete = function() {
        var aPageStatus = [];
        for (i = 0; i < this.aCWModelList.length; i++) {
            var oCW = this.aCWModelList[i];
            if (oCW.getCWLabel().toLowerCase() == 'assessment') {
                var aPageModelGUIDList = this.getCWPageGUIDList(oCW.getGUID());
                for (i = 0; i < aPageModelGUIDList.length; i++) {
                    var sGUID = aPageModelGUIDList[i],
                            oPage = this.findPage(sGUID),
                            sPageType = oPage.getPageType();
                    if (sPageType == undefined || sPageType.toLowerCase() === "page") {
                        aPageStatus.push(String(oPage.getPageStatus()));
                    }
                }
                break;
            }
            //aCWCompletion.push(String(this.aCWModelList[i].getCWStatus()));
        }
        var sResult = aPageStatus.join(',');
        return (sResult.length > 0 && sResult.indexOf('1') == -1 && sResult.indexOf('0') == -1);
    };
    /**
     * This method updates the status of the respective page object and its respective parent CW.
     * @param p_oPage:Page Object
     * @param p_nStatus:Number status for the page
     * @return : Page Object
     */
    CourseModel.prototype.updateNavigationStatus = function(p_oPage, p_nStatus) {
        //Logger.logDebug('CourseModel.updateNavigationStatus() | Page = ' + p_oPage.getGUID() + ' : Status = ' + p_nStatus+' : '+(p_oPage instanceof PageModel));
        //if (!typeof p_oPage != PageModel) {
        if (!p_oPage instanceof PageModel) {
            Logger.logError('CourseModel.updateNavigationStatus() | Page needs to be an instance of "PageModel"');
        }
        if (p_oPage.getPageStatus() != 2) {
            p_oPage.setPageStatus(p_nStatus);
        }
    };

    /**
     * This method returns the Page Objects for the given CW GUID .
     * @param p_sCWGUID:String GUID of a CW
     * @return : Page Object Array
     */
    CourseModel.prototype.getCWPages = function(p_sCWGUID) {
        //Logger.logDebug('CourseModel.getCWPages() | CW GUID = ' + p_sCWGUID);
        var aTemp = [];
        for (var prop in this.aPageModelList) {
            //Logger.logDebug('CourseModel.getCWPages() ## Prop = ' + prop+' : '+prop.indexOf(p_sCWGUID));
            if (prop.indexOf(p_sCWGUID) == 0) {
                aTemp.push(this.aPageModelList[this.aPageModelList[prop]]);
            }
        }
        return aTemp;
    };

    /**
     * This method returns the Page Objects for the given CW GUID .
     * @param p_sCWGUID:String GUID of a CW
     * @return : Page Object Array
     */
    CourseModel.prototype.getCWPageGUIDList = function(p_sCWGUID) {
        //Logger.logDebug('CourseModel.getCWPageGUIDList() | CW GUID = ' + p_sCWGUID);
        var aTemp = [],
                oCW = this.findCW(p_sCWGUID);
        if (oCW.getCWID() == "assessment") {
            childPages = oCW.getChildPages();
            aTemp = childPages.slice(0, oCW.sCWPagesFromStart);
            jQuery.each(AssessmentManager.getQuestionSet(), function(i, val) {
                aTemp.push(val);
            });
            jQuery.each(childPages.slice(-oCW.sCWPagesFromStart), function(i, val) {
                aTemp.push(val);
            });
            return aTemp;
        }
        else {
            for (var prop in this.aPageModelList) {
                if (prop.indexOf(p_sCWGUID) == 0) {
                    aTemp.push(prop);
                }
            }
        }
        return aTemp;
    };

    /**
     * This method returns the Page Object for the given page GUID
     * @param p_sPageGUID:String GUID of a page
     * @return : Page Object
     */
    CourseModel.prototype.findPage = function(p_sPageGUID) {
        // TODO: Probably this method needs to go in the Course Controller
        //Logger.logDebug('CourseModel.findPage() | Page GUID = ' + p_sPageGUID);
        var oPageModel = this.aPageModelList[this.aPageModelList[p_sPageGUID]];
        if (oPageModel != null) {
            return oPageModel;
        }
        Logger.logWarn('CourseModel.findPage() | "' + p_sPageGUID + '" returns null. Result page not found.');
        return null;
    };

    /**
     * This method returns the CW Object for the given CW GUID
     * @param p_sCWGUID:String GUID of a page
     * @return : CW Object
     */
    CourseModel.prototype.findCW = function(p_sCWGUID) {
        var oCWModel = this.aCWModelList[this.aCWModelList[p_sCWGUID]];
        if (oCWModel != null) {
            return oCWModel;
        }
        Logger.logWarn('CourseModel.findCW() | "' + p_sPageGUID + '" returns null. Rresult CW does not exists.');
        return null;
    };

    /**
     * This method returns the first Page Object for the given CW GUID .
     * @param p_sCWGUID:String GUID of a CW
     * @return : Page Object
     */
    CourseModel.prototype.findCWFirstPage = function(p_sCWGUID) {
        //Logger.logDebug('CourseModel.findCWFirstPage() | CW GUID = ' + p_sCWGUID);
        if (p_sCWGUID) {
            for (var prop in this.aPageModelList) {
                //Logger.logDebug('CourseModel.findCWFirstPage() | prop = ' + prop+' : value = '+this.aPageModelList[prop]);
                if (prop.indexOf(p_sCWGUID) == 0) {
                    return this.aPageModelList[this.aPageModelList[prop]];
                }
            }
        } else {
            return this.aPageModelList[0];
        }

        /*for (var i = 0; i < arrObjPage.length; i++) {
         if (arrObjPage[i]._GUID.indexOf(p_sCWGUID) == 0) {
         return arrObjPage[i];
         }
         }*/
        Logger.logWarn("CourseModel.findCWFirstPage( " + p_sCWGUID + ") returns null. \nTrying to launch CW first page result page not found.");
        return null;
    };

    /**
     * This method returns the last Page Object for the given CW GUID .
     * @param p_sCWGUID:String GUID of a CW
     * @return : Page Object
     */
    CourseModel.prototype.findCWLastPage = function(p_sCWGUID) {
        //Logger.logDebug('CourseModel.findCWLastPage() | CW GUID = ' + p_sCWGUID);
        if (p_sCWGUID) {
            /*
             var oLastPage, sGUID;
             for(sGUID in this.aPageModelList){
             //Logger.logDebug('### CourseModel.findCWLastPage() | GUID = ' + sGUID+' : value = '+this.aPageModelList[sGUID].getParentCWGUID());
             var bMatch	= (sGUID.indexOf(p_sCWGUID) == 0);
             if(bMatch){oLastPage = this.aPageModelList[this.aPageModelList[sGUID]];}
             if(!bMatch && oLastPage){return oLastPage;}
             }*/

            var oLastPage, i;
            for (i = 0; i < this.aPageModelList.length; i++) {
                var oPageModel = this.aPageModelList[i],
                        bMatch = (oPageModel.getParentCWGUID() === p_sCWGUID);
                //Logger.logDebug('\tGUID = ' + oPageModel.getGUID()+' : PARENT GUID = '+oPageModel.getParentCWGUID());
                if (bMatch) {
                    oLastPage = oPageModel;
                }
                if (!bMatch && oLastPage) {
                    return oLastPage;
                }
            }
            ;
            // ** If the Parent GUID of the Page Model evaluated last in the loop above matches, but if there are no Page Models beyond it then return the last Matched page.
            if (bMatch && oLastPage) {
                return oLastPage;
            }
        } else {
            return this.aPageModelList[this.aPageModelList.length];
        }
        Logger.logWarn("CourseModel.findCWLastPage(" + p_sCWGUID + ") returns null. \nTrying to launch CW first page result page not found.");
        return null;
    };

    CourseModel.prototype.getCurrentPageGUID = function() {
        return this.sCurrentPageGUID;
    };

    CourseModel.prototype.getPagesForHierarchyLevel = function(p_sLevel) {
        var sCurrentPageParentGUID = this.oCurrentPageModel.getParentCWGUID(),
                nCWIndex = this.aCWModelList[sCurrentPageParentGUID],
                oCW = this.aCWModelList[nCWIndex];
        //Logger.logDebug('CourseModel.getPagesForHierarchyLevel() | Level = '+p_sLevel+' : Page Parent GUID = '+sCurrentPageParentGUID+' : nCWIndex = '+nCWIndex+' : oCW = '+oCW.getCWLabel());

        while (oCW != null && !(oCW.getHierarchyLevel() === p_sLevel)) {
            oCW = oCW.getParentCW();
        }
        if (oCW) {
            var sSelectedGUID = oCW.getGUID(),
                    aPagesInCW = this.getCWPageGUIDList(sSelectedGUID),
                    nCurrentPage,
                    nTotalPages = aPagesInCW.length;
            //Logger.logDebug('########## Received Level = '+p_sLevel+' : Level = '+oCW.getHierarchyLevel()+' : '+sSelectedGUID+' : Total Pages = '+nTotalPages+' : '+aPagesInCW);

            for (var i = 0; i < aPagesInCW.length; i++) {
                if (aPagesInCW[i] == this.getCurrentPageGUID()) {
                    nCurrentPage = (i + 1);
                    break;
                }
            }
            return {currentPage: nCurrentPage, totalPages: aPagesInCW.length, aPageId: aPagesInCW};
        }
        return null;
    };
	
    CourseModel.prototype.parseResourceData = function(xmlnode) {
    	var oX2JS 		=  new X2JS();
    	this.oResources	= oX2JS.xml2json(xmlnode);
    	if(this.oResources.item)
    	this.oResources.item = [this.oResources.item];
    };
    
    
    CourseModel.prototype.getResourceItem = function(p_sItem) {
    	for (var i=0; i < this.oResources.item.length; i++) {
		  	if(this.oResources.item[i]._name === p_sItem){
		  		return this.oResources.item[i];
		  		break;
		  	}
		};

    	return null;
    };
    
    
    CourseModel.prototype.getAllCWModels = function() {
        return this.aCWModelList;
    };
    CourseModel.prototype.getAllPageModels = function() {
        return this.aPageModelList;
    };
    CourseModel.prototype.getCourseTitle = function() {
        return this.sCourseTitle;
    };
    
    CourseModel.prototype.getTopicTitle = function() {
		return this.findCW(this.getCurrentPageModel().getParentCWGUID()).getCWLabel();
    };
    
    
    CourseModel.prototype.getTopicNumber = function() {
	
	var objPage	= this.getCurrentPageModel();
	var objParentCW	= objPage.getParentCWGUID();
	var nameLength	= objPage.getParentCWGUID().split("~")[objPage.getParentCWGUID().split("~").length - 1];
	var onlyNumber	= nameLength.substring(2, nameLength.length);
	var number	= parseInt(onlyNumber);
	return number;
    };
    

    
    if (!__instanceCourseModel) {
        __instanceCourseModel = new CourseModel();
        //console.log('^^^^^^^^^^^^ CourseModel INSTANCE ^^^^^^^^^^^^^^ '+__instanceCourseModel);
    };

    return __instanceCourseModel;
    
});