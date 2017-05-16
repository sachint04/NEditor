define([
    'jqueryui',
    'framework/viewcontroller/uicomponent/AbstractUIComponent',
    'framework/model/CourseModel',
    'framework/utils/globals',
    'framework/utils/Logger'
], function(jqueryui, AbstractUIComponent, CourseModel, Globals, Logger) {
    function TopicLabel() {
        //Logger.logDebug('TopicLabel.CONSTRUCTOR() ');
        AbstractUIComponent.call(this);

        return this;
    }

    TopicLabel.prototype									= Object.create(AbstractUIComponent.prototype);
    TopicLabel.prototype.constructor						= TopicLabel;

    TopicLabel.prototype.getComponentConfig					= function() {
		//Logger.logDebug('TopicLabel.getComponentConfig() | ');
		return {
			/*TODO: Implement any default configurations*/
		};
	};
    TopicLabel.prototype.init								= function(p_sID, p_oConfig, p_$xmlComponent) {
        //Logger.logDebug('TopicLabel.init() | p_sID = ' + p_sID + ' : p_oConfig = ' + JSON.stringify(p_oConfig)+' : p_$xmlComponent = '+p_$xmlComponent[0]);
		AbstractUIComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };

	TopicLabel.prototype.addAriaRoles						= function(){
		//Logger.logDebug('TopicLabel.addAriaRoles() | ');
	};
	TopicLabel.prototype.bindHandlers						= function(){
		//Logger.logDebug('TopicLabel.bindHandlers() | ');
		this.handleUIEvents = this.handleUIEvents.bind(this);
		CourseModel.addEventListener('PAGE_MODEL_UPDATED', this.handleUIEvents);
	};
	TopicLabel.prototype.initialize							= function(){
		//Logger.logDebug('TopicLabel.initialize() | ');
		this.dispatchUIComponentLoadedEvent();
	};

	TopicLabel.prototype.handleUIEvents						= function(p_oEvent) {
		//Logger.logDebug('TopicLabel.handleUIEvents() | Type = '+p_oEvent.type+' : Target = '+p_oEvent.target+' : Curr Target = '+p_oEvent.currentTarget);
		var sTopicLabel,
			bHierarchyLevelSpecific	= Globals.sanitizeValue(this.getConfig().hierarchyLevelSpecific),
			sHierarchyLevel			= this.getConfig().hierarchyLevel;

		if(!bHierarchyLevelSpecific){
			sTopicLabel = p_oEvent.pageModel.getPageLabel();
		}else{
			// TODO: Detect Hierarchy Level of the Page and set the CW's label as the Topic Label
		}

		this.$uiComponent.text(sTopicLabel);
    };
	TopicLabel.prototype.updateStates						= function(e) {
		var sEventType = e.type;
		Logger.logDebug('TopicLabel.updateStates() | Event Type = '+sEventType+' AM Playing = '+AudioManager.isPlaying());

    };

    TopicLabel.prototype.destroy							= function() {
		CourseModel.removeEventListener('PAGE_MODEL_UPDATED', this.handleUIEvents);

		this.handleUIEvents		= null;

		this.prototype			= null;

		AbstractUIComponent.prototype.destroy.call(this);
    };
    TopicLabel.prototype.toString							= function() {
		return 'framework/component/TopicLabel';
	};

    return TopicLabel;
});
