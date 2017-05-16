define([
	'mediaplayer', 
	'framework/component/AbstractComponent', 
	'framework/core/PopupManager', 
	'framework/utils/Logger'
], function(mediaplayer, AbstractComponent, PopupManager, Logger) {
    function MediaPlayer() {
        //Logger.logDebug('MediaPlayer.CONSTRUCTOR() ');
        AbstractComponent.call(this);
        this.popupEventHandler 	= this.popupEventHandler.bind(this);
        this.onTimeUpdate 		= this.onTimeUpdate.bind(this);
        this.onSeeked 			= this.onSeeked.bind(this);
        this.onSeeking 			= this.onSeeking.bind(this);
        this.oMedia;
        this.$quePoints;
        this.bSeeking;
        this.nSeekStartTime		= 0;
        this.lastTime =	0;
        return this;
    }


    MediaPlayer.prototype = Object.create(AbstractComponent.prototype);
    MediaPlayer.prototype.constructor = MediaPlayer;

    MediaPlayer.prototype.init = function(p_sID, p_oConfig, p_$xmlComponent) {
        AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };

    MediaPlayer.prototype.createComponent = function() {
        var oScope = this;
        this.oMedia = this.$component.find("video,audio");
        if(this.$xmlData.attr("class") == "videoplayer") {
            var transcript 	= this.$xmlData.find('transcript').text();
            var sStyle 		= this.$xmlData.find('transcript').attr('style');
            this.$quePoints	= this.$xmlData.find('quepoints');
            
            
            
            //oMedia.hide();
            this.oMedia.acornMediaPlayer({
                themes : 'access accesslight',
                captionsOn : true
            });
            
            this.oMedia.show();
            this.createsteps();
           	this.$component.find('video, audio')[0].addEventListener('timeupdate',	oScope.onTimeUpdate, false);
           	this.$component.find('video, audio')[0].addEventListener('seeked',	oScope.onSeeked);
           	this.$component.find('video, audio')[0].addEventListener('seeking',	oScope.onSeeking);
            	
            //Page load completed only after video player loaded
            this.$component.find(".access").addClass("accesslight");
            this.$component.find(".acorn-transcript-button").click(function() {
                oScope.openPopup("popup_close", "Transcript", transcript, oScope.$component, sStyle);
                //$(this).focusout();loadstart
                $("#btn_continue").focus();
                $("#btn_continue").blur();
            });
        }
        /*if(this.$xmlData.attr("class") == "audioplayer") {
            if(this.$xmlData.attr("playOnLoad") == "true")
                AudioManager.playAudio(this.$xmlData.attr("id"));
            $(".ui-play-pause-btn").on('click', function(e) {
                if($(this).is(":checked")) {
                    AudioManager.setVolume(100);
                } else
                    AudioManager.setVolume(0);
            });
            if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                if(AudioManager.sIosPlay) {
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
        this.dispatchComponentLoadedEvent();
        this.setCompleted();
        /* TODO: notify when video is compete */
    };
    
    MediaPlayer.prototype.createsteps = function(e) {
       	var $quePoint = this.$component.find('.media-step');
       	if($quePoint.length){
       		$quePoint.each(function(index, elem){
       			var $elem 		= $(elem);
       			var sHidden		= ($elem.hasClass('hide'))? "hide" : "";
       			//console.log($elem.attr('id')+' - createStep - hide - '+ sHidden);
       			$elem.attr('data-hide', sHidden );
       		});
       	};
    };
    
    /**
     * video timer update 
     */
    MediaPlayer.prototype.onTimeUpdate = function(e) {
    	if(this.bSeeking)return;
    	var oScope = this;
    	this.lastTime = Math.round(e.target.currentTime * 1000);
    	if(this.$quePoints.length){
           	var quePoint = this.$quePoints.find('quepoint');
           	if(quePoint.length){
           		 	quePoint.each(function(index, elem){
           		 		if($(elem).attr('complete') !== 'complete')
     					oScope.updateQuePoint(elem, true, false);
           		});
           	}		
         };
    };
   
    /**
     * Update quepoint state  
     */
    MediaPlayer.prototype.updateQuePoint	= function(elem, updateVid, bAnimate) {
  		var oScope = this;
  		var $elem			= $(elem);
  		var vid				= this.$component.find('video, audio')[0];
		var time 			= Number($elem.attr('time'));
		var action			= $elem.attr('vidAction') || 'false';
		var target			= $elem.attr('target');
		var state			= $elem.attr('state');
		var preserveState	= $elem.attr('preserveState');
		var $target 		= this.$component.find('#'+target); 
		var complete		= $elem.attr('complete'); 
		var curTime 		= Math.round(vid.currentTime * 1000);
		if(curTime >= time){
			if($target.length){
				if(complete != "true"){
					oScope.updateState($elem, $target, state, curTime, bAnimate);
					
					if(updateVid){
						this.vidAction(action);						
					}
				}
			}
		}else{
			//this.resetQuePoint($elem, $target);
		}
    };
    
    /**
     * Update State of a element defined in que point 
     */
    MediaPlayer.prototype.updateState = function($elem, $target , state, curTime, bAimate) {
		$elem.attr('complete', 'true');
		$target.addClass('complete');
    	switch(state.toLowerCase()){
			case 'show' :
				if($target.hasClass('hide')){
					//console.log('udpateState Show | target - '+ $target.attr('id')+' | state - '+ state+' | curTime - '+ curTime);
					if(bAimate){
	       				$target.removeClass('hide').css('opacity', '0').animate({'opacity': '1'}, 800);       						
					}else{
	       				$target.removeClass('hide');       												
					}
				}
			break;
			case 'hide' :
			  //console.log('udpateState Hide | target - '+ $target.attr('id')+' | state - '+ state+' | curTime - '+ curTime);
   				$target.addClass('hide');       						           						
			break;
		};
    	
    };
    
    /**
     * take video action 
     */
    MediaPlayer.prototype.vidAction	= function( action) {
    	switch(action.toLowerCase()){
			case 'stop' :
				try{
					this.$component.find("video,audio")[0].pause();
				}catch(e){}
			break;
			case 'play' :
				try{
					this.$component.find("video,audio")[0].play();
				}catch(e){}
			break;
		}
    };

     
    /**
     * Seek bar activity started
     */
     MediaPlayer.prototype.onSeeking = function(e) {
    	var oScope = this;
    	this.nSeekStartTime = e.target.currentTime * 1000;
    	//console.log('nSeekStartTime - '+ this.nSeekStartTime);
    	this.bSeeking = true;
    };
    
    /**
     *  Seek bar activity stopped
     */
    MediaPlayer.prototype.onSeeked = function(e) {
    	var oScope = this;
    	var nSeekEndTime = e.target.currentTime * 1000;
    	//console.log('this.lastTime  -  '+this.lastTime+' | nSeekEndTime - '+ nSeekEndTime);
    	var nCurCue = 0;
    	if(this.$quePoints.length){
           	var quePoint = this.$quePoints.find('quepoint');
           	if(quePoint.length){
 	          	quePoint.each(function(index, elem){
 	          		var time = parseInt($(elem).attr('time'));
           			if(time < nSeekEndTime && time> nCurCue){
           				nCurCue 	= time;
           			}
           				
           			if(time <  oScope.lastTime ){
           				oScope.resetQuePoint(elem); 
           				oScope.updateQuePoint(elem, false, false);
           			}else{
           				oScope.resetQuePoint(elem);           				
           			}

           		});
           	};
       		var elem = this.$quePoints.find('quepoint[time="'+nCurCue+'"]');
       		if(elem.length){
       			$que = elem.eq(elem.length - 1);
           			oScope.resetQuePoint($que);
           			oScope.updateQuePoint($que, false, false);           				
       		}
           	
         };
        this.lastTime = nSeekEndTime;
    	this.bSeeking = false;
    	//console.log('onSeeked - '+e.target.currentTime);
    };
    
     
    /**
     * reset all que points 
     */
     MediaPlayer.prototype.resetQuePoint	= function(elem) {
    	var $elem 			= $(elem);
		var $target 		= this.$component.find('#'+$elem.attr('target'));
		var sHide			= $target.attr('data-hide') || '';
		$elem.attr('complete', '');
		$target.removeClass('complete').css('opacity', '1');
		$target.removeClass('hide').addClass(sHide); 
    };
    
    MediaPlayer.prototype.play = function() {
    };
    MediaPlayer.prototype.pause = function() {
    };
    MediaPlayer.prototype.isPlaying = function() {
    };
    MediaPlayer.prototype.getComponentConfig = function() {
        return {
            /* TODO: add configs params */
        };
    };
    MediaPlayer.prototype.openPopup = function(p_sPopupID, p_sTitle, p_sContent, p_$returnFocusTo, p_sClassesToAdd, p_fCallback, p_aArgs) {
        //Logger.logDebug('MediaPlayer.openPopup() | '+p_sPopupID, p_sTitle,
        // p_sContent, p_$returnFocusTo, p_sClassesToAdd);
        oPopup = PopupManager.openPopup(p_sPopupID, {
            txt_title : p_sTitle,
            txt_content : p_sContent
        }, p_$returnFocusTo, p_sClassesToAdd);
        oPopup.addEventListener('POPUP_CLOSE', this.popupEventHandler);
        oPopup.addEventListener('POPUP_EVENT', this.popupEventHandler);
        if(p_fCallback) {
            oPopup.setCallback(this, p_fCallback, p_aArgs);
        }
        return oPopup;
    };
    MediaPlayer.prototype.closePopup = function(p_sPopupID) {
        //Logger.logDebug('MediaPlayer.closePopup() | '+p_sPopupID);

        return true;
    };

    MediaPlayer.prototype.popupEventHandler = function(e) {
        var sEventType = e.type, 
		oPopup = e.target, 
		sPopupID = oPopup.getID();
        //Logger.logDebug('MediaPlayer.popupEventHandler() | Event Type = '+sEventType+' : Popup ID = '+sPopupID+' : Event Src = '+e.eventSrc);

        if(sEventType === 'POPUP_EVENT' || sEventType === 'POPUP_CLOSE') {
            oPopup.removeEventListener('POPUP_CLOSE', this.popupEventHandler);
            oPopup.removeEventListener('POPUP_EVENT', this.popupEventHandler);
            if(sEventType === 'POPUP_EVENT') {
                PopupManager.closePopup(sPopupID);
            }
            $(window).focus();
        }
    };

    MediaPlayer.prototype.destroy = function() {
        this.popupEventHandler = null;
        this.prototype = null;

        AbstractComponent.prototype.destroy.call(this);
    };
    MediaPlayer.prototype.toString = function() {
        return 'framework/component/MediaPlayer';
    };

    return MediaPlayer;
});
