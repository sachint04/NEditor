define([
    'jqueryui',
    'framework/viewcontroller/uicomponent/AbstractUIComponent',
    'framework/core/PopupManager',
    'framework/core/AudioManager',
    'framework/utils/globals',
    'framework/utils/Logger'
], function(jqueryui, AbstractUIComponent, PopupManager, AudioManager, Globals, Logger) {
    function AudioPanel() {
        //Logger.logDebug('AudioPanel.CONSTRUCTOR() ');
        AbstractUIComponent.call(this);

        this.$playBtn;
        this.$pauseBtn;
        this.$stopBtn;
        this.$muteBtn;
        this.$unmuteBtn;
        this.$transcriptBtn;

        this.$audioSlider;
        this.$volumeSlider;

        this.nVolumeLevel;

        this.oEventDS	= {
				play		: 'PLAY_AUDIO',
				pause		: 'PAUSE_AUDIO',
				stop		: 'STOP_AUDIO',
				mute		: 'MUTE_AUDIO',
				unmute		: 'UNMUTE_AUDIO',
				transcript	: 'SHOW_AUDIO_TRANSCRIPT',
				audioSeek	: 'SEEK_AUDIO',
				audioSeek	: 'SEEK_VOLUME',
        };

        this.showAudioControls = this.showAudioControls.bind(this),
        this.updateStates = this.updateStates.bind(this);
		this.popupEventHandler = this.popupEventHandler.bind(this);


        //AudioManager.addEventListener('AUDIO_ADDED', this.showAudioControls);
        //AudioManager.addEventListener('AUDIO_LIST_CLEARED', this.showAudioControls);

        AudioManager.addEventListener('AUDIO_PLAY', this.updateStates);
        AudioManager.addEventListener('AUDIO_PAUSE', this.updateStates);
        AudioManager.addEventListener('AUDIO_RESUME', this.updateStates);
        AudioManager.addEventListener('AUDIO_POSITION_UPDATE', this.updateStates);
        AudioManager.addEventListener('AUDIO_STOPPED', this.updateStates);
        AudioManager.addEventListener('AUDIO_FINISH', this.updateStates);
        AudioManager.addEventListener('AUDIO_VOULME_UPDATE', this.updateStates);
        AudioManager.addEventListener('AUDIO_MUTE', this.updateStates);
        AudioManager.addEventListener('AUDIO_UNMUTE', this.updateStates);

        return this;
    }

    AudioPanel.prototype									= Object.create(AbstractUIComponent.prototype);
    AudioPanel.prototype.constructor						= AudioPanel;

    AudioPanel.prototype.getComponentConfig					= function() {
		//Logger.logDebug('AudioPanel.getComponentConfig() | ');
		return {
			/*TODO: Implement any default configurations*/
		};
	};
    AudioPanel.prototype.init								= function(p_sID, p_oConfig, p_$xmlComponent) {
        //Logger.logDebug('AudioPanel.init() | p_sID = ' + p_sID + ' : p_oConfig = ' + JSON.stringify(p_oConfig)+' : p_$xmlComponent = '+p_$xmlComponent[0]);

		AbstractUIComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };
    AudioPanel.prototype.createComponent					= function(){
		//Logger.logDebug('AudioPanel.createComponent() | ');
        var oScope = this;
        var oMedia 						= this.$uiComponent.find("video,audio");
        this.$xmlData.children().each(function(i, xmlNode){
			var sNodeName	= this.nodeName,
                sID			= this.getAttribute('id'),
                sClass		= this.getAttribute('class'),
                bAvailable	= Globals.sanitizeValue(this.getAttribute('available')),
                sType		= this.getAttribute('type').toLowerCase(),
                sText		= this.firstChild.nodeValue,
                $elem		= oScope.$uiComponent.find('#' + sID);
			//Logger.logDebug('\tNode Name = '+sNodeName+' : ID = '+sID+' : Class = '+sClass+' : Type = '+sType+' : '+$elem.length);


			if (sText != '' && $elem.length === 1) {
                $elem.html(sText);
            } else if (sText != '' && $elem.length > 0) {
                Logger.logWarn('AudioPanel.onUILoaded() | Replacing Child nodes with text for element having ID "' + sID + '"');
                $elem.html(sText);
            }
            if (sClass != '' && sClass.toUpperCase() != 'CLASS_OVERRIDE') {
                $elem.addClass(sClass);
            }

			oScope.addAriaRoles(sType, $elem, sText, this, bAvailable);
			oScope.bindHandlers(sType, sID, $elem, this);
        });

        this.initialize();
        /*
        if (this.$xmlData.attr("class") == "audioplayer")
                {
                    if (this.$xmlData.attr("playOnLoad") == "true")
                        AudioManager.playAudio(this.$xmlData.attr("id"));
                    $(".ui-play-pause-btn").on('click', function(e) {
                        if ($(this).is(":checked"))
                        {
                            AudioManager.setVolume(100);
                        }
                        else
                            AudioManager.setVolume(0);
                    });
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                        if (AudioManager.sIosPlay) {
                            $("#ios_play").removeClass("hide");
                            $("#ios_play button").on('click', function() {
                                AudioManager.stop(this.$xmlData.attr("id"));
                                AudioManager.playAudio(this.$xmlData.attr("id"));
                                AudioManager.sIosPlay = false;
                                $("#ios_play").addClass("hide");

                            });
                        }
                    }
                }*/

        this.dispatchUIComponentLoadedEvent();
	};
	AudioPanel.prototype.addAriaRoles						= function(p_sType, p_$elem, p_sText, xmlNode, p_bAvailable){
		//Logger.logDebug('AudioPanel.addAriaRoles() | ');
		if (p_sType === 'button') {
            p_$elem.attr({
            	'aria-role': 'button',
                'role': 'button',
                'data-available': p_bAvailable,
                'aria-labelledby': p_sText/*,
				'aria-hidden': 'true'*/
            });
        }
	};
	AudioPanel.prototype.bindHandlers						= function(p_sType, p_sID, p_$elem, xmlNode){
		//Logger.logDebug('AudioPanel.bindHandlers() | '+ p_sType+ ' | p_sID = '+p_sID);
		var oScope	= this,
			sEventToDispatch;

		if(p_sType === 'button'){
			if(p_sID.indexOf('play') > -1){this.$playBtn = p_$elem; sEventToDispatch = this.oEventDS.play;}
			if(p_sID.indexOf('pause') > -1){this.$pauseBtn = p_$elem; sEventToDispatch = this.oEventDS.pause;}
			if(p_sID.indexOf('stop') > -1){this.$stopBtn = p_$elem; sEventToDispatch = this.oEventDS.stop;}
			if(p_sID.indexOf('mute') > -1 && p_sID.indexOf('unmute') < 0){this.$muteBtn = p_$elem; sEventToDispatch = this.oEventDS.mute;}
			if(p_sID.indexOf('unmute') > -1){this.$unmuteBtn = p_$elem; sEventToDispatch = this.oEventDS.unmute;}
			if(p_sID.indexOf('transcript') > -1){this.$transcriptBtn = p_$elem; sEventToDispatch = this.oEventDS.transcript;}

			p_$elem.on('click', function(e) {
	            oScope.handleUIEvents(e, this, sEventToDispatch);
	        });
		}

		if(p_sType === 'slider'){
			if(p_sID.indexOf('audioseek') > -1){this.$audioSlider = p_$elem; sEventToDispatch = this.oEventDS.audioSeek;}
			if(p_sID.indexOf('volume') > -1){this.$volumeSlider = p_$elem; sEventToDispatch = this.oEventDS.volumeSeek;}

			var oScope				= this,
				sSeeking			= $(xmlNode).attr('seeking'),
				bSeekingAvailable	= ($(xmlNode).attr('seeking') === 'true' || $(xmlNode).attr('seeking') === undefined),
				sDirection			= $(xmlNode).attr('direction'),
				sDirection			= (sDirection === undefined) ? 'horizontal' : sDirection.toLowerCase(),
				// set up the slider options for the jQuery UI slider
				sliderOptions	= {
					value			: 0,
					step			: 1,
					orientation		: sDirection,
					range			: 'min',
					min				: 0,
					max				: 100
				};

			if(bSeekingAvailable){
				sliderOptions.change		= function(e, ui){
					oScope.handleUIEvents(e, this, sEventToDispatch);
				};
			}else{
				sliderOptions.start			= function(e, ui){
					/* Stop the drag event for the slider */
					oScope.preventDefaults(e);
				};
			}

			// init the jQuery UI slider
			p_$elem.slider(sliderOptions);

			if(!bSeekingAvailable){
				p_$elem.css('cursor', 'default');
				p_$elem.find('.ui-slider-range').on('mousedown', function(e){
					oScope.preventDefaults(e);
				}).on('touchstart', function(e){
					oScope.preventDefaults(e);
				});
				p_$elem.find('.ui-slider-handle').on('mousedown', function(e){
					oScope.preventDefaults(e);
				}).on('touchstart', function(e){
					oScope.preventDefaults(e);
				});
				p_$elem.on('mousedown', function(e){
					oScope.preventDefaults(e);
				}).on('touchstart', function(e){
					oScope.preventDefaults(e);
				});
			}
		}
	};
	AudioPanel.prototype.initialize							= function(p_sType, p_sID, p_$elem, xmlNode){
		//Logger.logDebug('AudioPanel.initialize() | ');
		this.$pauseBtn.addClass('hide');
		this.$unmuteBtn.addClass('hide');
	};

	AudioPanel.prototype.handleUIEvents						= function(p_oEvent, p_domBtn, p_sEventToDispatch) {
		Logger.logDebug('AudioPanel.handleUIEvents() | p_sEventToDispatch = '+p_sEventToDispatch+' : '+p_oEvent.type+' : Target = '+p_oEvent.target+' : Curr Target = '+p_oEvent.currentTarget);
		if(p_oEvent.type !== 'slidechange'){
	        p_oEvent.preventDefault();
	        p_domBtn.blur();
        }
		if (!$(p_domBtn).hasClass('inactive') && !$(p_domBtn).hasClass('disabled')) {
            if (p_sEventToDispatch) {
	        	switch(p_sEventToDispatch){
					case 'PLAY_AUDIO':
					case 'PAUSE_AUDIO':{
						/* We just dispatch an Event Here as The UI Component doesn't know which audio to play*/
				        break;
					}
					case 'STOP_AUDIO':{
						AudioManager.stop();
						break;
					}
					case 'MUTE_AUDIO':{
						// ** Internally store the volume in a variable
						this.nVolumeLevel = AudioManager.getVolume();
						// DOES NOT work on iPad, hence used "setVolume"
						AudioManager.mute(true);
						AudioManager.setVolume(0);
				        break;
					}
					case 'UNMUTE_AUDIO':{
						// DOES NOT work on iPad, hence used "setVolume"
						AudioManager.mute(false);
						AudioManager.setVolume(this.nVolumeLevel);
				        break;
					}
					case 'SHOW_AUDIO_TRANSCRIPT':{
						this.openPopup('transcript', 'Transcript', AudioManager.getTranscript(), this.$transcriptBtn);
				        break;
					}
					case 'SEEK_AUDIO':{
						/* TODO: Audio seeking implementation */
				        break;
					}
					case 'SEEK_VOLUME':{
						var nVolume = this.$volumeSlider.slider('value');
						//Logger.logDebug('Volume Val = '+nVolume);
						AudioManager.setVolume(nVolume);//Valid Range between 0 - 100
				        break;
					}
				}

                this.dispatchEvent(p_sEventToDispatch, {type: p_sEventToDispatch, target: this, name:'audio Panel'});
            }
            return true;
        }
        return false;
    };
	AudioPanel.prototype.updateStates						= function(e) {
		var sEventType = e.type;
		if(sEventType !== 'AUDIO_POSITION_UPDATE'){
			//Logger.logDebug('AudioPanel.updateStates() | Event Type = '+sEventType+' AM Playing = '+AudioManager.isPlaying()+' : AM Complete = '+AudioManager.isCompleted());
		}

		switch(sEventType){
			case 'AUDIO_PLAY':
			case 'AUDIO_PAUSE':
			case 'AUDIO_RESUME':
				this.enable(this.$stopBtn, true);
		        if (AudioManager.isPlaying()) {
		            this.$playBtn.addClass('hide');
		            this.$pauseBtn.removeClass('hide');
		        } else {
		            this.$playBtn.removeClass('hide');
		            this.$pauseBtn.addClass('hide');
		        }
		        break;
			case 'AUDIO_STOPPED':
				this.enable(this.$stopBtn, false);
				this.$playBtn.removeClass('hide');
		        this.$pauseBtn.addClass('hide');
		        this.$audioSlider.slider( "value", 0 );
		        break;
			case 'AUDIO_MUTE':
				this.$muteBtn.addClass('hide');
				this.$unmuteBtn.removeClass('hide');
		        break;
			case 'AUDIO_UNMUTE':
				this.$muteBtn.removeClass('hide');
				this.$unmuteBtn.addClass('hide');
		        break;
			case 'AUDIO_FINISH':
				this.enable(this.$stopBtn, false);
				this.$playBtn.removeClass('hide');
				this.$pauseBtn.addClass('hide');
				this.$audioSlider.slider("value", 0);
		        break;
			case 'AUDIO_POSITION_UPDATE':
				/*
				 * jQueryUI slider	= ?				- 100
				 * Audio Position	= e.position	- AudioManager.getDuration()
				 */
				var val = e.position * 100 / AudioManager.getDuration();
				//Logger.logDebug('Audio Position = '+e.position+' : '+AudioManager.getDuration()+' : '+val);
				this.$audioSlider.slider("value", val);
		        break;
			case 'AUDIO_VOULME_UPDATE':
				/* TODO: This implementation will only be required if the volume is updated by some other element from some other page through code */
				/*
				 * jQueryUI slider	= ?							- 100
				 * Audio Volume		= AudioManager.getVolume()	- 100
				 */
				//var val = AudioManager.getVolume();
				//Logger.logDebug('Audio Position = '+val);
				//this.$volumeSlider.slider("value", val);
		        break;
		}
    };

	AudioPanel.prototype.showAudioControls					= function(e) {
        //Logger.logDebug('AudioPanel.showAudioControls() | Panel Hidden = ' + this.$audioPanel.hasClass('hide') + ' : Event Type = ' + e.type);
        //this.$audioPanel.stop();
        if (e.type == 'AUDIO_ADDED') {
            this.$transcriptBtn.addClass('in');
            this.$audioBtn.addClass('in');
            this.$transcriptBtn.removeClass('out');
            this.$audioBtn.removeClass('out');
//			var nAudioPanelWidth	= this.$audioPanel.width();
//			Logger.logDebug('AudioPanel.showAudioControls() | SHOW = '+nAudioPanelWidth);
//			if(this.$audioPanel.css('right') === 0){
//				this.$audioPanel.css('right', -nAudioPanelWidth);
//			}
//			this.$audioPanel.fadeIn(5).animate({
//					right:0
//			  	},
//			  	{
//					queue: false,
//					duration:600
//					/*complete:function(e){
//						//Logger.logDebug('AudioPanel.showAudioControls() | '+e);
//						$content.fadeIn(500);
//			 	}*/
//			});
        } else {
            $("#ios_play").addClass("hide");
            this.$transcriptBtn.removeClass('in');
            this.$audioBtn.removeClass('in');
            this.$transcriptBtn.addClass('out');
            this.$audioBtn.addClass('out');
//			var nAudioPanelWidth	= this.$audioPanel.width();
//			Logger.logDebug('AudioPanel.showAudioControls() | HIDE = '+nAudioPanelWidth);
//			this.$audioPanel.animate({
//					right:-nAudioPanelWidth
//			  	},
//			  	{
//					queue: true,
//					duration:600,
//					complete:function(){
//						//Logger.logDebug('AudioPanel.showAudioControls() | Anim Complete :: '+$(this).attr('id'));
//						//$(this).addClass('hide');
//			 	}
//			}).fadeOut(5);
        }
//                }
//            }).fadeOut(5);
//        }
    };
	AudioPanel.prototype.enableAudioControls				= function(p_bEnable) {
        if (p_bEnable) {
            this.$playBtn.removeClass('disabled');
            this.$pauseBtn.removeClass('disabled');
        } else {
            this.$playBtn.addClass('disabled');
            this.$pauseBtn.addClass('disabled');
        }
    };
    AudioPanel.prototype.enable								= function(p_$btn, p_bEnable){
		/* TODO: Enable / Disable Audio buttons and sliders */
    };
    AudioPanel.prototype.addClass							= function(p_sClassName){
		this.$uiComponent.addClass(p_sClassName);
		this.$uiComponent.children().each(function(i, elem){
			var $elem = $(this),
				bAvailable = Globals.sanitizeValue($elem.attr('data-available'));
			if(bAvailable){$(this).addClass(p_sClassName);}
		});
		this.updateStates({type:"AUDIO_PLAY"});
		return this.$uiComponent;
	};
	AudioPanel.prototype.removeClass							= function(p_sClassName){
		this.$uiComponent.removeClass(p_sClassName);
		this.$uiComponent.children().each(function(i, elem){
			var $elem = $(this),
				bAvailable = Globals.sanitizeValue($elem.attr('data-available'));
			if(bAvailable){$(this).removeClass(p_sClassName);}
		});
		this.updateStates({type:"AUDIO_PLAY"});
		return this.$uiComponent;
	};

    AudioPanel.prototype.openPopup						= function(p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd, p_fCallback, p_aArgs) {
        Logger.logDebug('AudioPanel.openPopup() | '+p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd);
        oPopup = PopupManager.openPopup(p_sPopupID, {txt_title: p_sTitle, txt_content: p_sContent}, p_$returnFocusTo, p_sClassesToAdd);
        oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
        if (p_fCallback) {
            oPopup.setCallback(this, p_fCallback, p_aArgs);
        }
        return oPopup;
    };
    AudioPanel.prototype.closePopup					= function(p_sPopupID) {
        //Logger.logDebug('AudioPanel.closePopup() | '+p_sPopupID);
        return true;
    };

    AudioPanel.prototype.popupEventHandler				= function(e) {
        var sEventType = e.type,
            oPopup = e.target,
            sPopupID = oPopup.getID();
        //Logger.logDebug('AudioPanel.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

        if (sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
            oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
            if (sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            }
            $(window).focus();
        }
    };

	AudioPanel.prototype.preventDefaults					= function(e){
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	};
    AudioPanel.prototype.destroy							= function() {
		this.popupEventHandler	= null;
		this.prototype			= null;

		AbstractUIComponent.prototype.destroy.call(this);
    };
    AudioPanel.prototype.toString							= function() {
		return 'framework/component/AudioPanel';
	};

    return AudioPanel;
});
