define([
    'framework/component/AbstractComponent',
    'framework/core/AudioManager',
    'framework/utils/Logger'
], function (AbstractComponent, AudioManager, Logger) {

    function SwiffyWidget() {
        //Logger.logDebug('SwiffyWidget.CONSTRUCTOR() | ');
        AbstractComponent.call(this);

        // define the class properties
		this.oSwiffy;
		this.jsonSwiffy;
		this.nSwiffyReadyInterval;
		this.bAudioListenersAdded;

		this.onCuepointPassed 		= this.onCuepointPassed.bind(this);
		this.checkAndPlaySwiffy		= this.checkAndPlaySwiffy.bind(this);

        return this;
    }

    SwiffyWidget.prototype								= Object.create(AbstractComponent.prototype);
    SwiffyWidget.prototype.constructor					= SwiffyWidget;

    SwiffyWidget.prototype.getComponentConfig			= function () {
        return {};
    };
    SwiffyWidget.prototype.init							= function (p_sID, p_oConfig, p_$xmlComponent) {
        //Logger.logDebug('SwiffyWidget.init() | '+p_sID+' : '+JSON.stringify(p_oConfig)+' : '/*+p_$xmlComponent.text()*/);
        // Initialize any class properties / variables as required
        var oScope = this;

        require([
            'libs/runtime_formatted'
        ], function(Component) {
			// Call to the super calss
	        AbstractComponent.prototype.init.call(oScope, p_sID, p_oConfig, p_$xmlComponent);
        });
    };
    // Create Runtime assets / set pointers to DOM objects. Populate required class Properties
    SwiffyWidget.prototype.createComponent				= function () {
        //Logger.logDebug('SwiffyWidget.createComponent() | '+this.$component.filter('#'+this.getComponentID())[0]);

        // Call to the super calss
        AbstractComponent.prototype.createComponent.call(this);
    };
    SwiffyWidget.prototype.addAriaRoles					= function () {
        //Logger.logDebug('SwiffyWidget.addAriaRoles() | ');
    };
    SwiffyWidget.prototype.bindHandlers					= function () {
        //Logger.logDebug('SwiffyWidget.bindHandlers() | ');
    };
    SwiffyWidget.prototype.initialize					= function () {
        //Logger.logDebug('SwiffyWidget.initialize() | '+this+' : Swiffy ID = '+this.getComponentID());
        this.jsonSwiffy = JSON.parse(this.$xmlData.text());
        this.initiateSwiffy();
        this.bAudioListenersAdded = true;
    };

    SwiffyWidget.prototype.initiateSwiffy					= function () {
		//Logger.logDebug('SwiffyWidget.initiateSwiffy() | Swiffy Obj = '+this.oSwiffy+ ' : Frame Count = '+ this.jsonSwiffy.frameCount+' : Swiffy ID = '+this.getComponentID());
    	if(this.oSwiffy !== null && this.oSwiffy != undefined ){
    		this.oSwiffy.destroy();
    		this.oSwiffy = null;
    	}
        if(this.jsonSwiffy.frameCount > 1){
            // ** Destroy Swiffy Object if its already present
            // ** Re-initialize the Swiffy Object
            this.oSwiffy    = new swiffy.Stage(this.$component.filter('#'+this.getComponentID())[0], this.jsonSwiffy, {});
            this.oSwiffy.setBackground(null);
            this.oSwiffy.start();
            // ** Add the Audio Listeners only if the Swiffy is ANIMATED
            if(!this.bAudioListenersAdded){
                AudioManager.addEventListener('CUEPOINT_PASSED', this.onCuepointPassed);
                AudioManager.addEventListener('AUDIO_PLAY', this.checkAndPlaySwiffy);
                AudioManager.addEventListener('AUDIO_PAUSE', this.checkAndPlaySwiffy);
                AudioManager.addEventListener('AUDIO_RESUME', this.checkAndPlaySwiffy);
            }
            // ** Check for the Swiffy API to be ready
            var oScope = this;
            this.nSwiffyReadyInterval = null;
            this.nSwiffyReadyInterval = setInterval(function(){
                if(oScope.oSwiffy.api != null){
                    clearInterval(oScope.nSwiffyReadyInterval);
                    oScope.dispatchComponentLoadedEvent();
                }
            }, 100);
        }else{
            // ** Initialize the Swiffy Object
            this.oSwiffy    = new swiffy.Stage(this.$component.filter('#'+this.getComponentID())[0], this.jsonSwiffy, {});
            this.oSwiffy.setBackground(null);
            this.oSwiffy.start();

            this.dispatchComponentLoadedEvent();
        }
    };


    SwiffyWidget.prototype.onCuepointPassed				= function(e){
		if(this.getConfig().soundID === e.soundID){
    	   Logger.logDebug('SwiffyWidget.onCuepointPassed() | Swiffy ID = '+this.getComponentID()+' : Sound ID = "'+e.soundID+'" : Position = "'+e.position+'" : Label = "'+e.cueLabel+'"');
			try{
				this.oSwiffy.api.gotoAndPlay(e.cueLabel);
			}catch(event){
			    Logger.logWarn('SwiffyWidget.onCuepointPassed() | Cue Label "'+e.cueLabel+'" at position "'+e.position+'" not found on Swiffy ID = '+this.getComponentID()+' for Sound ID = "'+e.soundID+'"');
			}
		}
	};
    SwiffyWidget.prototype.checkAndPlaySwiffy			= function(e){
		Logger.logDebug('SwiffyWidget.checkAndPlaySwiffy() | Swiffy ID = '+this.getComponentID()+' : Swiffy Audio ID = "'+this.getConfig().soundID + ' : e.soundID = '+ e.soundID );
		if(this.getConfig().soundID !== e.soundID)return;
		/* It's assumed that a FLA not containing the "bStopped" variable is not animated, hence no action needs to be taken on the Swiffy Object */
		if(this.oSwiffy != undefined && this.oSwiffy.api != null && this.oSwiffy.api != undefined && this.getConfig().soundID === e.soundID && this.oSwiffy.api.bStopped != null && this.oSwiffy.api.bStopped !== undefined){
			Logger.logDebug('\t Curr Frame = '+this.oSwiffy.api.currentFrame+' : Total Frames = '+this.oSwiffy.api.totalFrames+' : Stopped = '+this.oSwiffy.api.bStopped);
			var sEventType = e.type;
			switch(sEventType){
				case 'AUDIO_PLAY':
				case 'AUDIO_RESUME':
					if(!this.oSwiffy.api.bStopped){
						this.oSwiffy.api.play();
					}
					break;
				case 'AUDIO_PAUSE':
					if(!this.oSwiffy.api.bStopped){
						this.oSwiffy.api.stop();
					}
					break;
			}
		}
	};

    SwiffyWidget.prototype.destroy						= function () {
    	//Logger.logDebug('SwiffyWidget.destroy() | ');
    	// Stop any on-going animations
		this.oSwiffy.destroy();

		this.oSwiffy = null;
		this.jsonSwiffy = null;
		this.nSwiffyReadyInterval = null;
		this.bAudioListenersAdded = null;

		this.prototype		= null;
		AudioManager.removeEventListener('CUEPOINT_PASSED', this.onCuepointPassed);
		AudioManager.removeEventListener('AUDIO_PLAY', this.checkAndPlaySwiffy);
        AudioManager.removeEventListener('AUDIO_PAUSE', this.checkAndPlaySwiffy);
        AudioManager.removeEventListener('AUDIO_RESUME', this.checkAndPlaySwiffy);

        this.onCuepointPassed 		= null;
		this.checkAndPlaySwiffy		= null;

        AbstractComponent.prototype.destroy.call(this);
    };
    SwiffyWidget.prototype.toString						= function () {
        return 'framework/component/SwiffyWidget';
    };

    return SwiffyWidget;
});
