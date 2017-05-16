define([
	'jquery',
	'x2js',
	'sm2',
	'framework/model/CourseConfigModel',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, X2JS, sm2, CourseConfig, EventDispatcher, Globals, Logger){
	var __instanceAudioManager;

	function AudioManager(){
		//Logger.logDebug('AudioManager.CONSTRUCTOR() | ');
		EventDispatcher.call(this);
		this.oAudioData;
		this.bPlaying;
		this.bComplete;
		this.sPlayingSoundID;
		this.sLastPlayedSoundID;
		this.nCurrentVolume;
		this.aPreloadingAudios;
		this.aBackgroundLoadingAudios;
		this.bMandatory;

		this.bAccumulatedTranscript;
		this.sAccumulatedTranscript;
        this.sIosPlay=true;
        this.bPlayOnLoad = false;
		//this.init();
		//this.initPlugin();
	}

	AudioManager.prototype								= Object.create(EventDispatcher.prototype);
	AudioManager.prototype.constructor					= AudioManager;

	AudioManager.prototype.init							= function(p_xmlSoundsNode){
		this.nCurrentVolume				= 80;
		this.aBackgroundLoadingAudios	= [];
		this.aPreloadingAudios			= [];
		this.bAccumulatedTranscript		= Globals.sanitizeValue(CourseConfig.getConfig('audio_transcript').accumulateTranscript, false);
		this.initPlugin();
	};
	

	AudioManager.prototype.initPlugin					= function(){
		//Logger.logDebug('AudioManager.initPlugin() | '+soundManager);
		soundManager.setup({
			url: 'js/libs/swf/',
		    preferFlash: false,
		    useConsole: true,
		    /*ignoreFlash: true,
			useHTML5Audio: true,*/
		    debugMode: false
		}).beginDelayedInit();
	};

	AudioManager.prototype.parseSoundsNode				= function(p_xmlSoundsNode){
		this.nCurrentAudioIndex 	= 0;
		this.oAudioData				= {};
		this.sAccumulatedTranscript	= '';
		if(p_xmlSoundsNode.nodeType){
			var oX2JS 			= new X2JS(),
				oAudioData		= oX2JS.xml2json(p_xmlSoundsNode),
				sEndChar		= '',
	            nSoundLength,
				i;

			oAudioData.sound	= (oAudioData.sound.length) ? oAudioData.sound : [oAudioData.sound];
			nSoundLength		= oAudioData.sound.length;
				for(i=0; i<nSoundLength; i++){
					sEndChar = (i == (nSoundLength-1)) ? '' : '<br/>';
					this._addAudioData(oAudioData.sound[i], sEndChar);
				}
			this.dispatchEvent('AUDIO_ADDED', {type:'AUDIO_ADDED', target:this});
			//Logger.logDebug('AudioManager.parseSoundsNode() | '+JSON.stringify(this.oAudioData));
		}else{
			Logger.logError('AudioManager.parseSoundsNode() | Invalid Parameter. '+(p_xmlActivityNode.nodeType));
		}
	};

	AudioManager.prototype._addAudioData				= function(oSound, sEndChar){
		//Logger.logDebug('AudioManager._addAudioData() | iD = '+oSound._id+' : FilePath = '+oSound._filename);

		var oScope				= this,
			sSoundID			= oSound._id,
			sFilePath			= oSound._filename,
			sTranscript			= oSound.transcript.__cdata,
			/*sElementIDList		= oSound._elementIDList.split(' ').join('').split(','),*/
			bPreload			= Globals.sanitizeValue(oSound._preload),
			bPlayOnLoad			= Globals.sanitizeValue(oSound._playOnLoad),
			oCuePoints			= (oSound.cuepoints) ? oSound.cuepoints : null,
			bMandatory   		= (oSound._mandatory) ? oSound._mandatory : false,
			bHasCuePoints		= (oCuePoints && oCuePoints.cuepoint) ? true : false,
			bComplete           = false;
			oSound				= soundManager.createSound({
									url		: [sFilePath+".mp3", sFilePath+".ogg"],
									id		: sSoundID,
									onload	: function() {
										if(this.readyState === 3) {
									    	//Logger.logDebug('onload '+this.id+' loading, '+this.bytesLoaded+' of '+this.bytesTotal+' : '+this.duration);
										    oScope.onAudioLoaded(sSoundID);
								        }
									},
									/*whileloading	: function() {
										Logger.logDebug('whileloading '+this.id+' loading, '+this.bytesLoaded+' of '+this.bytesTotal+' : '+this.duration);
									},*/
									whileplaying: function(){
									    //Logger.logDebug('whileplaying '+this.id+' loading, '+this.bytesLoaded+' of '+this.bytesTotal);
									    oScope.onPositionUpdate(this, this.position);
									}
						          }),
			i;

		if(bHasCuePoints){
			oCuePoints.cuepoint = (oCuePoints.cuepoint.length) ? oCuePoints.cuepoint : [oCuePoints.cuepoint];
			var i,
				oCueLabelStack = {},
				oCueLabelStackAll =[];

			for (i=0; i < oCuePoints.cuepoint.length; i++) {
				var oCuePoint		= oCuePoints.cuepoint[i],
					sCueLabel		= oCuePoint._cueLabel,
					nCuePosition	= Globals.sanitizeValue(oCuePoint._position) * 1000;
				oCueLabelStack['time_'+String(nCuePosition)]	= sCueLabel;
				oCueLabelStackAll.push(sCueLabel);
				oSound.onPosition(nCuePosition, function(eventPosition) { // fire at 1 second
					oScope.onCuePointPassed(this, eventPosition);
				});
			};
		}
		// ** Preload the audio file
		if(bPreload){
			this.aPreloadingAudios.push(sSoundID);
		soundManager.load(sSoundID);
		}else{
			this.aBackgroundLoadingAudios.push(sSoundID);
		}
		//Logger.logDebug('AudioManager._addAudioData() | sSoundID = '+sSoundID+' : FilePath = '+sFilePath);
		//this.bPlayOnLoad			= bPlayOnLoad;
		this.oAudioData[sSoundID]	= {transcript:sTranscript/*, elementIDList:sElementIDList*/, playOnLoad: bPlayOnLoad};
		if(oCueLabelStack){
			this.oAudioData[sSoundID].cueLabel = oCueLabelStack;
			this.oAudioData[sSoundID].cueLabelALL = oCueLabelStackAll;
			//Logger.logDebug('AudioManager._addAudioData() | cue point = '+JSON.stringify(this.oAudioData[sSoundID].cueLabel));
		}
		this.sAccumulatedTranscript	+= sTranscript + sEndChar;
	};

	AudioManager.prototype.onPositionUpdate							= function(p_oSound, p_nPosition){
		//Logger.logDebug('AudioManager.onPositionUpdate() | Sound ID = "' + p_oSound.id + '" has reached position = "' + p_nPosition+'"');
		this.dispatchEvent('AUDIO_POSITION_UPDATE', {type: 'AUDIO_POSITION_UPDATE', target: this, soundID:p_oSound.id, position:p_nPosition});
	};
	AudioManager.prototype.onCuePointPassed							= function(p_oSound, p_nCuePosition){
		//Logger.logDebug('AudioManager.onCuePointPassed() | Sound ID = "' + p_oSound.id + '" has reached position = "' + p_nCuePosition+'"');
		this.dispatchEvent('CUEPOINT_PASSED', {type: 'CUEPOINT_PASSED', target: this, soundID:p_oSound.id, position:p_nCuePosition, cueLabel:this.getCueLabel(p_oSound, p_nCuePosition)});
	};
	
	AudioManager.prototype.getAllCueLabel							= function(p_oSound){
		return this.oAudioData[p_oSound].cueLabelALL;
			
	};

	AudioManager.prototype.getCueLabel								= function(p_oSound, p_nCuePosition){
		//Logger.logDebug('AudioManager.getCueLabel() | Sound ID = "' + p_oSound.id + '" has reached position = "' + p_nCuePosition+'" : Cue Label = "'+this.oAudioData[p_oSound.id].cueLabel['time_'+String(p_nCuePosition)]+'"');
		return this.oAudioData[p_oSound.id].cueLabel['time_'+String(p_nCuePosition)];
	};

	AudioManager.prototype.onAudioLoaded							= function(p_sSoundID){
		//Logger.logDebug('AudioManager.onAudioLoaded() | sSoundID = '+p_sSoundID+' : Preloading Audios Length = '+this.aPreloadingAudios.length+' : Background Loading Audios Length = '+this.aBackgroundLoadingAudios.length+' : Audio Length = '+(this.getSoundByID(p_sSoundID)).duration);
		var bDispatched;
		if(this.aPreloadingAudios.length > 0){
			bDispatched = true;
			this.dispatchEvent('AUDIO_LOADED', {type: 'AUDIO_LOADED', target: this, soundID: p_sSoundID});
			var sSoundID	= this.aPreloadingAudios.splice(this.aPreloadingAudios.indexOf(p_sSoundID), 1);
			/* All audios to preload have NOT completed, so wait for the other "onload" event of the other sound objects  */
			if(this.aPreloadingAudios.length !== 0){return !0;}
			/* All audios to preload have completed, so dispatch the PRELOAD_AUDIOS_LOADED event */
			this.dispatchEvent('PRELOAD_AUDIOS_LOADED', {type: 'PRELOAD_AUDIOS_LOADED', target: this});
		}
		/* Continue loading any audios that are left to load in the background */
		if(this.aBackgroundLoadingAudios.length > 0){
			if(!bDispatched){this.dispatchEvent('AUDIO_LOADED', {type: 'AUDIO_LOADED', target: this, soundID: p_sSoundID});}
			var sSoundID	= this.aBackgroundLoadingAudios.shift(),
				oSound		= this.getSoundByID(sSoundID);

			soundManager.load(sSoundID);
			return !0;
		}
		/* All audios to preload as well as audios to load in the background have completed, so dispatch the ALL_AUDIOS_LOADED event */
		this.dispatchEvent('ALL_AUDIOS_LOADED', {type: 'ALL_AUDIOS_LOADED', target: this});
	};

	AudioManager.prototype.playAudio					= function(p_sSoundID){
		var oSound					= this.getSoundByID(p_sSoundID),
			oScope					= this;
		//Logger.logDebug('AudioManager.playAudio() | p_sSoundID = '+p_sSoundID+' : sPlayingSoundID = '+this.sPlayingSoundID+' :  sLastPlayedSoundID = '+this.sLastPlayedSoundID+' : bPlaying = '+this.bPlaying+' : bComplete = '+this.bComplete+' : oSound = '+oSound);
		if(oSound){
			if(this.sPlayingSoundID === p_sSoundID){
                // ** (RESUME) Resume the currently playing sound when Audio ID is supplied
				if(!this.bPlaying && !this.bComplete){
					soundManager.resume(p_sSoundID);
                } else if (!this.bPlaying && this.bComplete) {
                	// ** (REPLAY) User is trying to play the same audio which finished playing where Audio ID is supplied
					this.sPlayingSoundID = null;
					this.playAudio(p_sSoundID);
				}
            } else if(p_sSoundID !== undefined){
            	// ** (PLAY) Play Fresh Audio where Audio ID is supplied
				if(!oScope.bComplete){soundManager.stop(this.sPlayingSoundID);}
				this.sPlayingSoundID = p_sSoundID;
		        soundManager.setVolume(p_sSoundID, this.nCurrentVolume);
		        soundManager.play(p_sSoundID, {
		        	onplay		: function(){
						oScope.bPlaying = true;
						oScope.bComplete = false;
                        oScope.dispatchEvent('AUDIO_PLAY', {type: 'AUDIO_PLAY', target: oScope, soundID:p_sSoundID});
		        	},
		            onpause		: function() {
						oScope.bPlaying = false;
                        oScope.dispatchEvent('AUDIO_PAUSE', {type: 'AUDIO_PAUSE', target: oScope, soundID:p_sSoundID});
		            },
		        	onresume	: function() {
						oScope.bPlaying = true;
                        oScope.dispatchEvent('AUDIO_RESUME', {type: 'AUDIO_RESUME', target: oScope, soundID:p_sSoundID});
		            },
		            onstop		: function(){
						oScope.bComplete = true;
						oScope.bPlaying = false;
						oScope.sPlayingSoundID = null;
                        oScope.dispatchEvent('AUDIO_STOPPED', {type: 'AUDIO_STOPPED', target: oScope, soundID:p_sSoundID});
		            },
					onfinish	: function() {
						oScope.bComplete = true;
						oScope.bPlaying = false;
                        oScope.sLastPlayedSoundID = oScope.sPlayingSoundID;
						oScope.sPlayingSoundID = null;
						oScope.setAudioComplete(p_sSoundID);
                        oScope.dispatchEvent('AUDIO_FINISH', {type: 'AUDIO_FINISH', target: oScope, soundID:p_sSoundID});
					}
		  		});
            }else if(p_sSoundID === undefined && this.sPlayingSoundID  && !this.bPlaying && !this.bComplete){
				//Logger.logDebug('AudioManager.playAudio() | ## HERE ## IN IF');
				// ** (RESUME) Resuming Currently Playing Audio where no Audio ID is supplied
				/* sound ID is not provided, in that case last playing audio willbe resumed */
				this.playAudio(this.sPlayingSoundID);
			}else{
				Logger.logError('AudioManager Error : SoundID'+ p_sSoundID + ' and last PlayingSoundID '+this.sPlayingSoundID+' both are are not valid sound ID');
			}
		}else{
        	if(this.sLastPlayedSoundID !== null){
	        	this.playAudio(this.sLastPlayedSoundID);
        	}else{
			Logger.logWarn('AudioManager.playAudio() | No Sound with ID "'+p_sSoundID+'" found');
		}
        }
	};
	
	AudioManager.prototype.dispatchAudioCuePoints					= function(p_sSoundID){
		var oSound					= this.getSoundByID(p_sSoundID);
		var oCues 					=  this.oAudioData[oSound.id].cueLabel;
		for (var time in oCues) {
		  var sLabel	= oCues[time];
		  var nTime		= Number(time.split("time_")[1]);
			this.onCuePointPassed(oSound, nTime);
		};
	};

	AudioManager.prototype.pauseAudio					= function(p_sSoundID){
		Logger.logDebug('AudioManager.pauseAudio()  at level 1 | p_sSoundID = '+p_sSoundID);
		if(p_sSoundID == undefined){
			p_sSoundID = this.sPlayingSoundID;
		}
		var oSound					= this.getSoundByID(p_sSoundID);
		if(this.bPlaying && !this.bComplete){
			soundManager.pause(p_sSoundID);
		}
        //this.dispatchEvent('AUDIO_PAUSE', {type:'AUDIO_PAUSE', target:this, soundID:p_sSoundID});
	};

	AudioManager.prototype.isMuted										= function(){
		if(this.sPlayingSoundID){
			var oSound	= soundManager.getSoundById(this.sPlayingSoundID);
			//Logger.logDebug('AudioManager.isMuted() | '+oSound.muted);
			return oSound.muted;
		}
	};
	AudioManager.prototype.mute							= function(p_bMute){
		//Logger.logDebug('AudioManager.mute() | Curr Playing Sound ID = '+this.sPlayingSoundID+' : Mute = '+p_bMute);
		if(this.sPlayingSoundID){
			var oSound	= soundManager.getSoundById(this.sPlayingSoundID);
			(p_bMute) ? oSound.mute() : oSound.unmute();
			(p_bMute) ? this.dispatchEvent('AUDIO_MUTE', {type:'AUDIO_MUTE', target:this, soundID:oSound.id}) : this.dispatchEvent('AUDIO_UNMUTE', {type:'AUDIO_UNMUTE', target:this, soundID:oSound.id});;
		}
	};

	AudioManager.prototype.stop										= function(){
		//Logger.logDebug('AudioManager.stop() | Curr Playing Sound ID = '+this.sPlayingSoundID);
		if(this.sPlayingSoundID){
			var oSound	= soundManager.getSoundById(this.sPlayingSoundID);
			oSound.stop();
			//this.dispatchEvent('AUDIO_STOPPED', {type:'AUDIO_STOPPED', target:this, soundID:this.sPlayingSoundID});
		}
	};
	AudioManager.prototype.getDuration								= function(){
		//Logger.logDebug('AudioManager.durationEstimate() | Curr Playing Sound ID = '+this.sPlayingSoundID);
		if(this.sPlayingSoundID){
			var oSound	= soundManager.getSoundById(this.sPlayingSoundID);
			return oSound.duration;
			//return oSound.durationEstimate;
		}
	};

	AudioManager.prototype.getVolume								= function(){
		//Logger.logDebug('AudioManager.mute() | Curr Playing Sound ID = '+this.sPlayingSoundID+' : Vol = '+p_nVol+' : Curr Vol = '+this.nCurrentVolume);
		return this.nCurrentVolume;
	};
	AudioManager.prototype.setVolume					= function(p_nVol){
		//Logger.logDebug('AudioManager.mute() | Curr Playing Sound ID = '+this.sPlayingSoundID+' : Vol = '+p_nVol+' : Curr Vol = '+this.nCurrentVolume);
		if(p_nVol >= 0 && p_nVol <= 100){
			this.nCurrentVolume	= p_nVol;
			if(this.sPlayingSoundID){
				soundManager.setVolume(this.sPlayingSoundID, this.nCurrentVolume);
				this.dispatchEvent('AUDIO_VOULME_UPDATE', {type:'AUDIO_VOULME_UPDATE', target:this, soundID:this.sPlayingSoundID, volume:this.nCurrentVolume});
			}
		}
	};

	AudioManager.prototype.getSoundByID				= function(p_sSoundID){
		var sSoundID		= p_sSoundID || this.sPlayingSoundID,
			oSound = soundManager.getSoundById(sSoundID);
		//Logger.logDebug('AudioManager.getSoundByID() | oSound = '+oSound);

		if(!oSound){Logger.logWarn('AudioManager.getSoundByID() | No sound found with ID "'+p_sSoundID+'"');}
		return oSound;
	};

	AudioManager.prototype.getPlayOnLoadAudioList					= function(){
		var aOnLoadAudioList = [];
		for(var sSoundID in this.oAudioData){
			if(this.oAudioData[sSoundID].playOnLoad){
				aOnLoadAudioList.push(sSoundID);
			}
		}
		return aOnLoadAudioList;
	};
	
	AudioManager.prototype.getAudiosList					= function(){
		return this.oAudioData;
	};
	AudioManager.prototype.getTranscript			= function(p_sSoundID){
		if(this.bAccumulatedTranscript){
			var sTranscript			= this.sAccumulatedTranscript;
		}else{
			var sSoundID		= p_sSoundID || this.sPlayingSoundID || this.sLastPlayedSoundID,
				sTranscript		= (sSoundID) ? this.oAudioData[sSoundID].transcript : null;
		}
		Logger.logDebug('AudioManager.getTranscript() | Transcript = '+sTranscript+' for Sound ID "'+sSoundID+'"'+' | this.sLastPlayedSoundID = '+this.sLastPlayedSoundID);
		return sTranscript;
	};

	AudioManager.prototype.setLastPlayedAudioID							= function(p_sSoundID){
		this.sPlayingSoundID  = p_sSoundID;
	};
	/**
	 * return current/Last audioID 
	 */
	AudioManager.prototype.getCurrentAudioID 								= function(){
		return this.sPlayingSoundID;
	};
	
	AudioManager.prototype.setAudioComplete							= function(p_sSoundID){
		this.oAudioData[p_sSoundID].complete = true;
	};
	
	/**
	 * play blank audio 
	 * file location - "sco_content/en/audio/cw01/blank.mp3""
	 */
	AudioManager.prototype.playBlankAudio 								= function(){
		Logger.logDebug('AudioManager.playBlankAudio() ')
		var sNode 		='<data><sounds><sound id="blank" filename="sco_content/en/audio/cw01/blank" preload="true" playOnLoad="false"><cuepoints></cuepoints><transcript><![CDATA[]]></transcript></sound></sounds></data>',
		$xmlData  		= $(Globals.getXMLfromString(sNode)),
		$xmlSounds		= $xmlData.find('sounds');
		this.parseSoundsNode($xmlSounds[0]);
		this.playAudio('blank');
	};
	/*AudioManager.prototype.getElementIDList							= function(p_sSoundID){
		var sSoundID		= p_sSoundID || this.sPlayingSoundID,
			sElementIDList	= this.oAudioData[sSoundID].elementIDList;
		//Logger.logDebug('AudioManager.getElementIDList() | ElementIDList = '+sElementIDList+' for Sound ID "'+sSoundID+'"');
		return sElementIDList;
	};*/

	AudioManager.prototype.destroyPlayList			= function(){
		var sSoundID,
			oAudioData;

		if(this.sPlayingSoundID){soundManager.getSoundById(this.sPlayingSoundID).stop();}

		for(sSoundID in this.oAudioData){
			//Logger.logDebug('AudioManager.destroyPlayList() | Sound ID "'+sSoundID+'" : Value = '+this.oAudioData[sSoundID]);
			soundManager.unload(sSoundID);
			soundManager.destroySound(sSoundID);
		}

		this.sPlayingSoundID	= null;
		this.sLastPlayedSoundID			= null;
		this.bComplete			= true;
		this.bPlaying			= false;
		this.bPlayOnLoad 				= false;
		this.oAudioData			= {};
		this.aPreloadingAudios			= [];
		this.aBackgroundLoadingAudios	= [];
		this.dispatchEvent('AUDIO_LIST_CLEARED', {type:'AUDIO_LIST_CLEARED', target:this});
	};

	AudioManager.prototype.isPlaying				= function(){
		return this.bPlaying;
	};
	AudioManager.prototype.isCompleted				= function(){
		return this.bComplete;
	};
	
	AudioManager.prototype.isMandatory				= function(){
		return this.bMandatory;
	};
	
	AudioManager.prototype.toString					= function(){
		return 'framework/core/AudioManager';
	};


	if(!__instanceAudioManager){
		__instanceAudioManager = new AudioManager();
		//Logger.logDebug('^^^^^^^^^^^^ AUDIO MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instanceAudioManager);
	}

	return __instanceAudioManager;
});
