/**
 * @mixin framework/utils/Timer 
 */
define([
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(EventDispatcher, Logger) {
	
	/**
	 *  
	 * Timer module is a provides many Time related utility methods.
	 * @constructor 
	 * alias Timer
	 */
	function Timer(p_sTimerName) {
		//Logger.logDebug('Timer.CONSTRUCTOR()');
		EventDispatcher.call(this);

		this.sTimerName;
		/*this.nStartHrs;
		this.nStartMins;
		this.nStartSecs;*/
		this.sAMPM;

		/*this.nEndHrs;
		this.nEndMins;
		this.nEndSecs;
		this.oEndTime;*/
		this.nDurationInSeconds;

		this.nCurrentHrs;
		this.nCurrentMin;
		this.nCurrentSec;

		this.nLapsedHrs;
		this.nLapsedMin;
		this.nLapsedSec;
		this.bPaused;

		this.bIsTimerStarted;
		this.bTimeOver;
		this.nInterval;

		this.setName(p_sTimerName);
	}

	Timer.prototype							= Object.create(EventDispatcher.prototype);
	Timer.prototype.constructor				= Timer;
	
 	/**
 	 * Set current time. Should be called atleast once to set inital time
 	 * @param  {Number} p_nHrs 
 	 * @param  {Number} p_nMins 
 	 * @param  {Number} p_nSecs
 	 * @param  {Number} p_sAMPM
 	 */
	Timer.prototype.setCurrentTime 			= function(p_nHrs, p_nMins, p_nSecs, p_sAMPM) {
		this.nCurrentHrs		= p_nHrs || 0;
		this.nCurrentMin		= p_nMins || 0;
		this.nCurrentSec		= p_nSecs || 0;
		this.sAMPM				= p_sAMPM || 'AM';
	};
	
	/**
	 * Set total time for the timer in Seconds
	 * @param {Number} p_nDurationInSeconds
	 */
	Timer.prototype.setEndTime 				= function(p_nDurationInSeconds) {
		this.nDurationInSeconds = p_nDurationInSeconds;
	};

	/**
	 * Start Timer. Pass lapsed seconds 
	 * @param {Number} p_nLapsedSeconds (optional)
	 */
	Timer.prototype.start 					= function(p_nLapsedSeconds) {
		var oScope = this;
		if(!this.nDurationInSeconds){
			Logger.logError('Timer.start() | The End Time is not set.');
			return;
		}
		if (!this.bIsTimerStarted && !this.bTimeOver) {
			this.bIsTimerStarted 	= true;
			/*this.nCurrentSec		= 0;
			this.nCurrentMin		= 0;
			this.nCurrentHrs		= 0;*/
			this.nLapsedHrs		= 0;
			this.nLapsedMin		= 0;
			this.nLapsedSec		= p_nLapsedSeconds || 0;
			this.nInterval			= setInterval(function(){
				oScope.tick();
			}, 1000);
			//this.dispatchEvent('STARTED', {type:'STARTED', target:this});
			this.dispatchTimerUpdates('TIMER_STARTED');
			//Logger.logDebug('Timer.start() | ');
		}
	};

	Timer.prototype.tick					= function() {
		//Logger.logDebug('Timer.tick() | INSIDE = '+this.toString());
		if (!this.bPaused) {
			this.nLapsedSec++;
			this.nCurrentSec++;
			this.dispatchTimerUpdates('SECONDS_UPDATE');
			if(this.nCurrentSec >= 60){
				this.nCurrentSec = 0;
				this.nCurrentMin++;
				//this.dispatchTimerUpdates('MINUTES_UPDATE');
				if (this.nCurrentMin >= 60) {
					this.nCurrentMin = 0;
					this.nCurrentHrs++;
					//this.dispatchTimerUpdates('HOURS_UPDATE');
					if(this.nCurrentHrs > 12){
						this.nCurrentHrs = 1;
						this.sAMPM = (this.sAMPM === 'AM') ? 'PM' : 'AM';
						this.dispatchTimerUpdates('MERIDIAN_UPDATE');
					}
				}
			}
			this.dispatchTimerUpdates('TIME_TICK');

			var hrs = Math.floor(this.nLapsedSec / 60 / 60),
		        min = Math.floor(this.nLapsedSec / 60 - hrs * 60),
		        sec = this.nLapsedSec % 60;
	        //Logger.logDebug(this.sTimerName+'.tick() | \nhrs = '+hrs+' : min = '+min+' : sec = '+sec+'\nLapsed Hrs = '+this.nLapsedHrs+' : Lapsed Min = '+this.nLapsedMin+' : Lapsed Sec = '+this.nLapsedSec);
			if(this.nLapsedMin !== min){
				this.nLapsedMin = min;
				//Logger.logDebug(this.sTimerName+'.tick() | MINUTES_UPDATE = '+this.nLapsedMin);
				this.dispatchTimerUpdates('MINUTES_UPDATE');
			}
			if(this.nLapsedHrs !== hrs){
				this.nLapsedHrs = hrs;
				//Logger.logDebug(this.sTimerName+'.tick() | HOURS_UPDATE = '+this.nLapsedHrs);
				this.dispatchTimerUpdates('HOURS_UPDATE');
			}
			/*if(this.nLapsedSec !== sec){
				this.nLapsedSec = sec;
				Logger.logDebug(this.sTimerName+'.tick() | SECONDS_UPDATE = '+this.nCurrentSec);
				this.dispatchTimerUpdates('SECONDS_UPDATE');
			}*/

			if(this.nLapsedSec === this.nDurationInSeconds){
				this.stop();
				this.bTimeOver = true;
				//Logger.logDebug(this.sTimerName+'.tick() | TIME_OVER = '+'\nLapsed Hrs = '+this.nLapsedHrs+' : Lapsed Min = '+this.nLapsedMin+' : Lapsed Sec = '+this.nLapsedSec);
				this.dispatchTimerUpdates('TIME_OVER');
			}
			//Logger.logDebug('Timer.tick() | Hrs = '+this.nCurrentHrs+' : Mins = '+this.nCurrentMin+' : Secs = '+this.nCurrentSec+'\n'+this.nLapsedSec+' === '+this.nDurationInSeconds);
		}
	};
	
	Timer.prototype.dispatchTimerUpdates	= function(p_sEventType){
		this.dispatchEvent(p_sEventType, {
			type				: p_sEventType,
			target				: this,
			name				: this.sTimerName,
			currentTime 		: this.toCurrentTimeString(),
			strLapsedTime		: this.getLapsedTime(true),
			strRemainingTime	: this.getRemainingTime(true),
			lapsedTime			: this.getLapsedTime(),
			remainingTime		: this.getRemainingTime()
		});
	};

	Timer.prototype.pause					= function(p_bPause){
		//Logger.logDebug('Timer.pause() | Pause = '+p_bPause);
		if((p_bPause && this.bPaused) || (!p_bPause && !this.bPaused) || this.bTimeOver){return;}
		if(p_bPause){
			//Logger.logDebug('Timer.PAUSE() | ');
			this.bPaused = true;
			clearTimeout(this.nInterval);
		}else{
			//Logger.logDebug('Timer.PLAY() | ');
			var oScope = this;
			this.bPaused = false;
			this.nInterval			= setInterval(function(){
				oScope.tick();
			}, 1000);
		}
	};

	/**
	 * Stop Timer 
	 */
	Timer.prototype.stop					= function(){
		//Logger.logDebug('Timer.stop() | '+this.toString());
		this.bIsTimerStarted = false;
		clearTimeout(this.nInterval);
		this.dispatchEvent('STOPPED');
	};
	
	/**
	 * Reset Timer  
	 */
	Timer.prototype.reset					= function() {
		this.stop();
		this.bTimeOver = false;
		this.dispatchEvent('RESET', {type:'RESET', target:this});
	};
	
	/**
	 * Return true if Timer is paused 
	 */
	Timer.prototype.isPaused				= function() {
		return this.bPaused;
	};
	
	/**
	 * Return Array with  time [hr, min, sec] 
	 */
	Timer.prototype.toCurrentTimeString		= function() {
	    /*var hrs = this.nStartHrs + Math.floor(this.nLapsedSec / 60 / 60),
	        min = this.nStartMins + Math.floor(this.nLapsedSec / 60 - hrs * 60),
	        sec = this.nStartSecs + this.nLapsedSec % 60;

	    return [hrs.padLeft("0", 2), min.padLeft("0", 2), sec.padLeft("0", 2)].join(" : ");*/
		//Logger.logDebug('Timer.toTimeString() | Name = '+this.getName()+' :: '+this.nCurrentHrs+' : '+this.nCurrentMin+' : '+this.nCurrentSec);
	    return [this._fixIntegers(this.nCurrentHrs), this._fixIntegers(this.nCurrentMin), this._fixIntegers(this.nCurrentSec)].join(" : ") + ' ' +this.sAMPM;
	};

	/**
	 * Get Lapsed time in Seconds 
 	* @param {Object} p_asString
	 */
	Timer.prototype.getLapsedTime			= function(p_asString){
		var output	= (p_asString) ? this.getTimeString(this.nLapsedSec) : this.nLapsedSec;
		return output;
	};
	
	/**
	 * Get remaining time in Seconds 
 	* @param {Object} p_asString
	 */
	Timer.prototype.getRemainingTime		= function(p_asString){
		var nRemainingSeconds	= this.nDurationInSeconds - this.nLapsedSec,
			output				= (p_asString) ? this.getTimeString(nRemainingSeconds) : nRemainingSeconds;
	    return output;
	};
	
	/**
	 * Get time in display format "02:07:50 pm" 
 * @param {Object} p_nSeconds
	 */
	Timer.prototype.getTimeString			= function(p_nSeconds){
		var hrs = Math.floor(p_nSeconds / 60 / 60),
	        min = Math.floor(p_nSeconds / 60 - hrs * 60),
	        sec = p_nSeconds % 60;
		//Logger.log('Timer.getLapsedSeconds() | LapsedSeconds = '+this.nLapsedSec+' | '+hrs+' : '+min+' : '+sec);
	    return [this._fixIntegers(hrs), this._fixIntegers(min), this._fixIntegers(sec)].join(":");
	};

	Timer.prototype.getName					= function(){return this.sTimerName;};
	
	Timer.prototype.setName					= function(p_sName){this.sTimerName = p_sName || '';};

	Timer.prototype._fixIntegers		 	= function(p_nInteger) {
		//Logger.logDebug('Timer._fixIntegers() | ');
		if (p_nInteger < 0)
			p_nInteger = 0;
		if (p_nInteger < 10)
			return "0" + p_nInteger;
		return "" + p_nInteger;
	};
	
	/**
	 * Clear memory 
	 */
	Timer.prototype.destroy				 	= function() {
		//Logger.logDebug('Timer.destroy() | ');
		clearTimeout(this.nInterval);
		this.sAMPM					= null;

		this.nDurationInSeconds		= null;

		this.nCurrentSec			= null;
		this.nCurrentMin			= null;
		this.nCurrentHrs			= null;
		this.nLapsedSec			= null;
		this.bPaused				= null;

		this.bIsTimerStarted		= null;
		this.bTimeOver				= null;
		this.nInterval				= null;
	};

	Timer.prototype.toString				= function(){
		return 'framework/utils/Timer';
	};

	return Timer;
});
