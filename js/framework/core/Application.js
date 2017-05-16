	'use strict';
	/**
	 * Application Module controls Envoirnment settings
	 * 
	 * @exports framework/core/Application
	 *
	 *  
	 */
define([
	'jquery',
	'pubsub',
	'pipwerks',
	'framework/controller/CourseController',
	'framework/core/Constants',
	'framework/core/BookmarkManager',
	'framework/model/CourseConfigModel',
	'framework/viewcontroller/UIManager',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function($, pubsub, pipwerks, CourseController, Constants, BookmarkManager, CourseConfig, UIManager, EventDispatcher, Logger){

	var __instanceApplication;
	/**
 	 * <b>Application</b> is a singleton imeplementation. Application Module can be access from any level in the application.
     * @constructor
     * @alias framework/core/Application
     */
	function Application(){
		this.oDummyBookmarkData	= {
			location		: 'cw01~BranchingPage',
			completion		: 'incomplete',
			suspend_data	: '{"cw_completion":[],"page_completion":[],"activity_scoringUID":{}}'
			};			
		this.SCORMDebug			= true;
		this.sEnvironment;
		this.sType;
		this.scorm;
		this.lmsConnected = false;
		this.startTime;

		this.oBookmarkData;

		this.setEnvironmentVariables	= this.setEnvironmentVariables.bind(this);
		this.postBookmark				= this.postBookmark.bind(this);
		this.onBookmarkExists			= this.onBookmarkExists.bind(this);
	};

	Application.prototype							= Object.create(EventDispatcher.prototype);
	Application.prototype.constructor				= Application;

	Application.prototype.init						= function(p_sPageUID){
		//Logger.init({id:"logger", debug:true});
		//Logger.logDebug('Application.initialize() | '+Constants.CONFIGXMLURL);
		
		this.oDummyBookmarkData.location 	= p_sPageUID;
		
		$.subscribe("COURSE_CONTROLLER_CREATED", this.setEnvironmentVariables);
		$.subscribe("EXIT_COURSE", this.postBookmark);
		CourseController.init(Constants.CONFIGXMLURL);
	};
	
	/** 
	 * Check LMS settings in course_config.xml and update local variables  
	 * @param {Object} e - Subscribled Event
	 */
	Application.prototype.setEnvironmentVariables	= function(e){
		//Logger.logDebug('Application.setEnvironmentVariables() | ');
		$.unsubscribe("COURSE_CONTROLLER_CREATED");
		this.sEnvironment	= CourseConfig.getConfig('enviroment').compliance,
		this.sType			= CourseConfig.getConfig('enviroment').type;
		//Logger.logDebug('\tType = '+this.sType+' : Environment = '+this.sEnvironment);
		if(this.sType === 'LMS' && (this.sEnvironment === 'SCORM_1.2' || this.sEnvironment === 'SCORM_2004')){
			this.scorm			= pipwerks.SCORM;  //Shortcut

			var sScormVersion = this.sEnvironment.substring(this.sEnvironment.indexOf('_')+1, this.sEnvironment.length);
			this.scorm.version	= sScormVersion;
			this.lmsConnected	= this.scorm.init();
			//Logger.logDebug('\tLMS Connected = '+this.lmsConnected+' : SCORM Version = '+sScormVersion);
		}

		this.readBookmark();
	};
	
	/**
	 * ReadBookmare from LMS/LRS 
	 */
	Application.prototype.readBookmark				= function(){
		//Logger.logDebug('Application.readBookmark() | ');
		if(this.sType === 'LMS' && (this.sEnvironment === 'SCORM_1.2' || this.sEnvironment === 'SCORM_2004')){
			if(this.lmsConnected){
				var sCompletion_status,
					nPercentScore,
					sLocation,
					sLearnername,
					sSuspendData;

                if (this.sEnvironment === 'SCORM_1.2') {
                    sLocation 								= this.scorm.get("cmi.core.lesson_location") || null;
                    // ** "passed", "completed", "failed", "incomplete", "browsed", "not attempted"
                    sCompletion_status 						= this.scorm.get("cmi.core.lesson_status") || 'incomplete';
                    nPercentScore 							= Number(this.scorm.get("cmi.core.score.raw")) || 0;
                    sLearnername 							= this.scorm.get("cmi.core.student_name") || '';
                } else if (this.sEnvironment === 'SCORM_2004') {
                    sLocation 								= this.scorm.get("cmi.location") || null;
                    // ** "completed", "incomplete", "not attempted", "unknown"
                    sCompletion_status 						= this.scorm.get("cmi.completion_status") || 'incomplete';
                    nPercentScore 							= Number(this.scorm.get("cmi.score.raw")) || 0;
                    sLearnername 							= this.scorm.get("cmi.learner_name") || '';
                }

                sSuspendData 								= this.scorm.get("cmi.suspend_data") || null;
                this.oBookmarkData 							= {};
                this.oBookmarkData.learner_name 			= sLearnername; // store leaners's name from LMS - Pooja
                
                if (sLocation) {
                    this.oBookmarkData.location 			= sLocation || "";
                    this.oBookmarkData.completion_status 	= sCompletion_status || 'incomplete';
                    this.oBookmarkData.percentScore 		= nPercentScore || 0;
                    this.oBookmarkData.suspend_data 		= sSuspendData || "[]";

                    BookmarkManager.addEventListener('BOOKMARK_EXISTS', this.onBookmarkExists);
                    BookmarkManager.parseBookmark(this.oBookmarkData);
                    return;
                }
                
                BookmarkManager.parseBookmark(this.oBookmarkData);
                this.startTimer();
                this.onCourseRestart();
            } else {
                Logger.logError("Application.readBookmark() | Error: Course could not establish connection to the LMS!");
            }
        } else {
            // ** For Testing the Bookmark object in a local environment
            if (this.SCORMDebug) {
                //Logger.logDebug('\tBookmark JSON = '+JSON.stringify(this.oDummyBookmarkData));
                BookmarkManager.parseBookmark(this.oDummyBookmarkData);
                //return;
            }
            //BookmarkManager.parseBookmark();
            this.onCourseRestart();
        }
    };
	
	/**
	 * Check if bookmark data is available in LMS and show <b>Resume</b> popup.
	 * @param {Object} event - event Object {type: String, target: BookmarkManager, isFirstPage: Boolean}
	 */
	Application.prototype.onBookmarkExists			= function(e){
		this.startTimer();
		if(!e.isFirstPage){
			UIManager.courseResumePopup();
		}else{
			this.onCourseRestart();
		}
	};

	/**
	 * LMS data JSON :<br>
	 * 		<tt>{<br>
	 * 		location			: 'cw01~pg01',<br>
	 * 		completion_status	: String,<br>
	 * 		tsuspend_data		: Object<br>
	 * 		cw_completion		: Array[],<br>
	 * 		page_completion		: Array[],<br>
	 * 		activity_scoringUID	: Object{}<br>
	 * 		}<br></tt>
	 */
	Application.prototype.postBookmark				= function(){
		$.unsubscribe("COURSE_EXIT");
		//alert('\tType = '+this.sType+' : Environment = '+this.sEnvironment+' : Evaluated = '+(this.sType === 'LMS' && (this.sEnvironment === 'SCORM_1.2' || this.sEnvironment === 'SCORM_2004')));
		if(this.sType === 'LMS' && (this.sEnvironment === 'SCORM_1.2' || this.sEnvironment === 'SCORM_2004')){
			//alert('\tLMS Connected = '+this.lmsConnected);
			if(this.lmsConnected){
				var oBookmarkData	= BookmarkManager.getBookmark();
				var bCompletionstatus,
					bLocationSet,
					bSessionTimeSet,
					bSuspendDataSet,
					bPercentScoreSet,
					bSCORMSave,
					bSCORMQuit;

				//alert('\tLocation = '+oBookmarkData.location+' : Completion Status = '+oBookmarkData.completion_status+' : Suspend Data = '+JSON.stringify(oBookmarkData.suspend_data)+' : Time Spent = '+this.getTimeSpent());
				if(this.sEnvironment === 'SCORM_1.2'){
					bLocationSet		= this.scorm.set("cmi.core.lesson_location", oBookmarkData.location);
					// ** "passed", "completed", "failed", "incomplete", "browsed", "not attempted"
					if(this.scorm.get("cmi.core.lesson_status") !== 'completed'){
						// ** Do not reset the completion status is the sim is already completed
						bCompletionstatus	= this.scorm.set("cmi.core.lesson_status", oBookmarkData.completion_status);
					}else{
						bCompletionstatus = true;
					}
					Logger.logDebug('oBookmarkData.completion_status = '+ oBookmarkData.completion_status);
					Logger.logDebug('oBookmarkData.percentScore = '+ oBookmarkData.percentScore);
					bPercentScoreSet	= this.scorm.set("cmi.core.score.raw", oBookmarkData.percentScore);
					bSessionTimeSet		= this.scorm.set("cmi.core.session_time", this.getTimeSpent());
				}else if(this.sEnvironment === 'SCORM_2004'){
					bLocationSet		= this.scorm.set("cmi.location", oBookmarkData.location);
					// ** "completed", "incomplete", "not attempted", "unknown"
					if(this.scorm.get("cmi.completion_status") !== 'completed'){
						// ** Do not reset the completion status is the sim is already completed
						bCompletionstatus	= this.scorm.set("cmi.completion_status", oBookmarkData.completion_status);
					}
					bPercentScoreSet	= this.scorm.set("cmi.score.raw", oBookmarkData.percentScore);
					bSessionTimeSet		= this.scorm.set("cmi.session_time", this.getTimeSpent());
				}

				bSuspendDataSet			= this.scorm.set("cmi.suspend_data", JSON.stringify(oBookmarkData.suspend_data));
				//bSuspendDataSet			= this.scorm.set("cmi.suspend_data", oBookmarkData.suspend_data);
				bSCORMSave				= this.scorm.save();
				//alert('\tCompletion Status SET  completion_status = '+ oBookmarkData.completion_status +' : Location SET = '+bLocationSet+' : Session Time SET = '+bSessionTimeSet+' : Suspend Data SET = '+bSuspendDataSet+' : SCORM Saved = '+bSCORMSave+' : Percent Score SET = '+bPercentScoreSet);

				if(bCompletionstatus && bLocationSet && bSessionTimeSet && bSuspendDataSet && bSCORMSave && bPercentScoreSet){
					var bSuccess	= this.scorm.quit();
					//alert('this.scorm.quit bSuccess = '+ bSuccess);
					if(bSuccess){
						this.exitCourse();
					}else{
						Logger.logError("Application.postBookmark() | Error: Course could not QUIT LMS..!");
					}
				} else {
					Logger.logError("Application.postBookmark() | Error: Course could not POST data to LMS..!");
				}
			}else{
				Logger.logError("Application.postBookmark() | Error: Course could not establish connection to the LMS!");
			}
		}else{
			// ** For Testing the Bookmark object in a local environment
			if(this.SCORMDebug){
				return;
			}
			this.exitCourse();
		}
	};
	
	/**
	 * Display First Page   
	 */
	Application.prototype.onCourseRestart 			= function(e){
		CourseController.launchCourse();		
	};

	Application.prototype.startTimer				= function(){
		this.startTime = new Date().getTime();
		//alert('Application.startTimer() | Start Time = '+(this.startTime));
	};
	Application.prototype.getTimeSpent				= function(){
		//alert('Application.getTimeSpent() | Start Time = '+(this.startTime));
		var date		= new Date(),
			logoffTime	= date.getTime(),
			timeDiff	= logoffTime - this.startTime,
			sec			= timeDiff/1000,
			tmp			= sec/3600,
			hrs			= Math.floor(tmp),
			min1		= (tmp - hrs) * 60,
			min			= Math.floor(min1),
			sec1		= (min1-min)*60,
			sec			= Math.floor(sec1);
		//alert('\tlog off Time = '+(logoffTime)+' : Time Diff = '+(timeDiff)+' : hrs = '+(hrs)+' : min = '+(min)+' : sec = '+(sec));

		if (hrs < 10){hrs = "0" + hrs;}
		if (min < 10){min = "0" + min;}
		if (sec < 10){sec = "0" + sec;}

		time = hrs + ":" + min + ":" + sec;
		return time;
	};

	/**
	 * Exit Course Window 
	 */
	Application.prototype.exitCourse				= function(){
		this.lmsConnected = false;
		window.close();
	};

	/**
	* Debug mode only- show list of variables. Used in 'Holden'.<br>
	* <b>Dependecy</b> - course_config [framework_tools="4"]
	* @param {Boolean} p_bFlag - Show Portal Parameters in Debug mode 
	* 
	*/
	Application.prototype.showHidePortalParmeterPanel 		= function(p_bFlag){
		Logger.logDebug('showHidePortalParmeterPanel() '+p_bFlag);
		if(p_bFlag){
			$('#portalParametersPanel').removeClass('hide');
			
			$('#portalParamsShowHide').click(function(){
				if($('.PortalContent').css('display') == 'none'){
					$(this).html('Hide');
					$('.PortalContent').removeClass('hide').show();
					$('#portalParameters').empty();
					var aParams = GlobalParameterizedScore.getParameterList();
					for(sParamID in aParams){
						var oParameter	= aParams[sParamID];
						var sUpdated = (oParameter.isUpdated())? 'green' : 'red' ;
						var str = '<div class="'+sUpdated+'"><b>Parameter id :'+oParameter.getID()+ '</b> : ' + oParameter.getScore() +'<br> max score :'+oParameter.getMaxPossibleScore()+'<br> </div>';  
						$('#portalParameters').append(str);
					}

				}else{
					
					$('.PortalContent').hide();
					$(this).html('Show');
				};				
			});
		};
            
	};
	
	Application.prototype.toString					= function(){
		return 'framework/core/Application';
	};

	if(!__instanceApplication){
		__instanceApplication = new Application();
		//Logger.logDebug('^^^^^^^^^^^^ UI MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instanceUIManager);
	}

	return __instanceApplication;

	/*
	return{
		init			: initialize,
		postBookmark	: postBookmark,
		onCourseResume 	: onCourseResume.bind(this),
		onCourseRestart : onCourseRestart.bind(this)
	};*/
});