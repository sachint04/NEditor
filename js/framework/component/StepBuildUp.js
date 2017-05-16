define([
    'framework/component/AbstractComponent',
    'framework/component/Accordian',
    'framework/utils/Logger'
], function(AbstractComponent, Accordian, Logger) {

    function StepBuildUpComponent() {
        //Logger.logDebug('StepBuildUpComponent.CONSTRUCTOR() | '+p_sID);
        Accordian.call(this);
        // Define the class properties

        return this;
    }

    StepBuildUpComponent.prototype = Object.create(Accordian.prototype);
    StepBuildUpComponent.prototype.constructor = StepBuildUpComponent;

    StepBuildUpComponent.prototype.getComponentConfig = function() {
        var oConfig = Accordian.prototype.getComponentConfig.call(this);
        oConfig.defaultOpen = false;
        oConfig.accordianToggle = false;
        //Logger.logDebug('StepBuildUpComponent.getComponentConfig() | '+JSON.stringify(oConfig));
        return oConfig;
    };

    function overrideDefaults(){
        this.sAccordianContainerClass = 'tis-stepbuildup';
    }

    StepBuildUpComponent.prototype.createComponent                = function() {
        //Logger.logDebug('StepBuildUpComponent.createComponent() | ');
        overrideDefaults.call(this);
        Accordian.prototype.createComponent.call(this);
    };

    StepBuildUpComponent.prototype.initialize = function() {
        //Logger.logDebug('StepBuildUpComponent.initialize() | ');
        this.$accordians.not(':first').addClass('interaction-disabled');
        Accordian.prototype.initialize.call(this);
    };

    StepBuildUpComponent.prototype.handleAccordianClick = function($accordian, e) {
        //Logger.logDebug('StepBuildUpComponent.handleAccordianClick() | Accordian ID = '+$accordian.attr('id')+' : IS Selected = '+$accordian.hasClass('selected')+' : Type = '+this.getConfig().componentDirection);
        Accordian.prototype.handleAccordianClick.call(this, $accordian, e);
        // If the clicked accordian header is already open, then close all subsequent open panels below it
        if ($accordian.hasClass('open')) {
            var oScope = this,
                $subsequentAccordianHeaders = $accordian.nextAll('.' + this.sAccordianHeaderClass),
                $subsequentOpenAccordianHeaders = $subsequentAccordianHeaders.filter('.open');

            $subsequentAccordianHeaders.addClass('interaction-disabled');
            $subsequentOpenAccordianHeaders.each(function(i, $elem) {
                oScope.togglePanel($(this));
            });
        }
    };

    StepBuildUpComponent.prototype.toggleAnimationComplete = function($accordian, $panel, p_bOpen) {
        if (p_bOpen) {
            // Add class "interaction-disabled" to the clicked accordian header and Remove it from the NEXT header
            $accordian/*.addClass(
                'interaction-disabled'
            )*/.nextAll(
                '.' + this.sAccordianHeaderClass + ':first'
            ).removeClass(
                'interaction-disabled'
            );
            /*Logger.logDebug('Accordian headers having "interaction-disabled" class = '+this.$accordians.not('.interaction-disabled').length);
            // If all accordian headers have "interaction-disabled" class then remove it from all the headers to enable collapsing
            if (this.$accordians.not('.interaction-disabled').length === 0) {
                this.$accordians.removeClass('interaction-disabled');
            }*/
        }
        Accordian.prototype.toggleAnimationComplete.call(this, $accordian, $panel, p_bOpen);
    };

    StepBuildUpComponent.prototype.isEnabled = function(p_$target) {
        if (!Accordian.prototype.isEnabled.call(this, p_$target) || p_$target.hasClass('interaction-disabled')) {
            return false;
        }
        return true;
    };

    StepBuildUpComponent.prototype.destroy                        = function () {
        this.prototype                  = null;
        Accordian.prototype.destroy.call(this);
    };

    StepBuildUpComponent.prototype.toString                       = function () {
        return 'framework/component/StepBuildUpComponent';
    };

    return StepBuildUpComponent;
});
