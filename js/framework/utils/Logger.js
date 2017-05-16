define([
	'jquery'
], function($){
	var nLogLevel,
		DEBUG = 1,
		INFO = 2,
		WARN = 2,
		ERROR = 3,
		FATAL = 4,
		TRACE = 5,
		settings,
		defaults = {
			id:'log',
			debug:false
		},
		aReport = [],
		elemDebug,
		initialized;

	function initailize(p_oOptions){
		settings = $.extend({}, defaults, p_oOptions);
		if(settings.id){
			elemDebug = $('#'+settings.id);
			//console.log(p_oOptions+" : Log Field ID = "+settings.id);
			if(elemDebug.length > 0){
				//(!settings.debug) ? elemDebug.hide() : elemDebug.show();
				addEvents();
				initialized = false;
				return;
			}
		}
		logError('Debug Logger Panel ID not set');
	}

	function addEvents(){
		var $debugNav = elemDebug.find('#log_nav');
		$debugNav.on('click', function(e){
			e.preventDefault();
			var target = $(e.target).attr('id');
			var $maximize = $(this).find('#maximize');
			var $minimize = $(this).find('#minimize');
			var $close = $(this).find('#close');
			//logDebug('TARGET = '+target+' : '+$minimize.length);
			switch(target){
				case 'maximize' :
					$minimize.show();
					$maximize.hide();
					elemDebug.removeClass('minimize');
					break;
				case 'minimize' :
					$minimize.hide();
					$maximize.show();
					elemDebug.addClass('minimize');
					break;
				case 'close' :
					elemDebug.hide();
					break;
			}
		});
	}

	function logMessage(p_sType, p_sMessage){
		//console.log('Logger.logMessage() | '+p_sType+' : '+p_sMessage);
		var consoleFn;

		switch (p_sType)
		{
			case "DEBUG":
				consoleFn = "debug";
				break;
			case "INFO":
				consoleFn = "info";
				break;
			case "WARN":
				consoleFn = "warn";
				break;
			case "ERROR":
				consoleFn = "error";
				try{elemDebug.show();}catch(e){}
				break;
			case "FATAL":
				consoleFn = "error";
				try{elemDebug.show();}catch(e){}
				break;
			case "TRACE":
				consoleFn = "log";
				break;
			case "REPORT":
				consoleFn = "report";
				break;
			default:
				consoleFn = "log";
				p_sType = 'UNKNOWN';
		};

		if(settings){
			if(settings.debug || (p_sType == "ERROR" || p_sType == "FATAL" || p_sType == "WARN")){
				/*var text = '<span class="'+p_sType.toLowerCase()+'"><strong>'+p_sType.toUpperCase()+':</strong> '+ p_sMessage + "</span><br/>";
				var $loggerTxt = elemDebug.find('p');
				$loggerTxt.append(text);*/

				if(p_sType == "ERROR" || p_sType == "FATAL"){
					throw new Error(p_sMessage);
				}
			}
			if(settings.debug){
				consoleFn = (console[consoleFn]) ? consoleFn : "log";
				console[consoleFn](p_sMessage);
			}
		}else if(window.console && defaults.debug){
			consoleFn = (console[consoleFn]) ? consoleFn : "log";
			console[consoleFn](p_sMessage);
		}
	};

	function getLogLevel(){
		return this.nLogLevel;
	}
	function setLogLevel(p_nLogLevel){
		if ((typeof(p_nLogLevel) == "number") && (p_nLogLevel >= this.DEBUG) && (p_nLogLevel <= this.FATAL)){
			this.nLogLevel = p_nLogLevel;
		}
	}
	function showLogger(p_show){
		//console.log('Logger.showLogger() | '+p_show);
		//(p_show && elemDebug) ? elemDebug.show() : elemDebug.hide();
	}
	function logDebug(p_sMessage){
		logMessage("DEBUG", p_sMessage);
	}
	function logInfo(p_sMessage){
		logMessage("INFO", p_sMessage);
	}
	function logWarn(p_sMessage){
		logMessage("WARN", p_sMessage);
	}
	function logError(p_sMessage){
		logMessage("ERROR", p_sMessage);
	}
	function logFatal(p_sMessage){
		logMessage("FATAL", p_sMessage);
	}
	function logTrace(p_sMessage){
		logMessage("TRACE", p_sMessage);
	}
	/*
	 * Does not print in console. stores time stamp and log in memmory.
	 * TODO: write cookie or text file
	 */
	function logReport(p_sMessage){
		var sMessage = p_sMessage;
		if(settings && settings.debug){
			var	date 		= new Date();
			aReport.push({
				time : date.getDate()+date.getDate()+'/'+ (date.getMonth()+1)+ '/'+date.getFullYear()+ ' - ['+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+']',
				log : p_sMessage
			});
		}
	};

	/*
	 * return report object
	 */
	function getReport(){
		if(settings && settings.debug){
			return aReport;
		}
	}
	return {
		init:initailize,
		getLogLevel:getLogLevel,
		setLogLevel:setLogLevel,
		showLogger:showLogger,
		logDebug:logDebug,
		logInfo:logInfo,
		logWarn:logWarn,
		logError:logError,
		logFatal:logFatal,
		logTrace:logTrace,
		logReport:logReport,
		getReport:getReport
	};
});

