define([
	'jqueryui',
    'framework/component/AbstractComponent',
    'framework/core/AudioManager',
    'framework/utils/Logger'
], function (jqueryui, AbstractComponent, AudioManager, Logger) {

    function AccordianComponent() {
        //Logger.logDebug('AccordianComponent.CONSTRUCTOR() | '+p_sID);
        AbstractComponent.call(this);
        // Define the class properties
        this.$accordiansContainer;
        this.$accordians;
        this.$panels;

        this.sAccordianContainerClass;
        this.sAccordianHeaderClass;
        this.sAccordianPanelClass;

        this.oAnimateProps;
        this.bAnimating;
        this.tabWidth;
        this.tabHeight;
        this.panelWidth;
        this.panelHeight;
        this.outerWidth;
        this.outerHeight;
        this.aCurrentPanelAudioID;

        return this;
    }

    AccordianComponent.prototype								= Object.create(AbstractComponent.prototype);
    AccordianComponent.prototype.constructor					= AccordianComponent;

    AccordianComponent.prototype.getComponentConfig				= function () {
        return {
            componentDirection					: 'vertical',
            firstSlide							: 1,
            accordianToggle						: true,
            //collapsible                         : false,
            // TODO: Implement the hightStyle as implemented in jQueryUI accordian component
            //heightStyle                         : "content" /* content, fill, */
            accordianShowSpeed					: 500,
            defaultOpen                         : true,

			ariaITextAccordianHeadingsCollapsed	: 'To select the Tab Control use the ENTER key.',
			ariaITextAccordianHeadingsExpanded	: 'To navigate the tab controls use the arrow keys. Use the Tab key to move to the tabs content.',
			ariaITextPanelBackButton			: 'Back to Tabs',
			ariaITextPanel						: 'Select <<ariaITextPanelBackButton>> button to move back to the selected Tab control',
			ariaIText							: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Select <<ariaITextPanelBackButton>> button to move back to the selected Tab control.'
        };
    };
    AccordianComponent.prototype.init							= function (p_sID, p_oConfig, p_$xmlComponent) {
        //Logger.logDebug('AccordianComponent.init() | ');
        // Initialize any class properties / variables as required
        this.oAnimateProps = {
            open: {},
            close: {}
        };
        this.sAccordianContainerClass = 'tis-accordian';
        this.sAccordianHeaderClass = 'tis-header';
        this.sAccordianPanelClass = 'tis-panel';
        //Logger.logDebug('AccordianComponent.init() | '+this.sAccordianContainerClass);

		// Call to the super calss
        AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };
    // Create Runtime assets / set pointers to DOM objects. Populate required class Properties
    AccordianComponent.prototype.createComponent				= function () {
        //Logger.logDebug('AccordianComponent.createComponent() | '+this.sAccordianContainerClass);
        // If runtime Accordian and Panel creation is required by the component
        // Accordians container.
        var $accContainer = this.$component.find('> .'+this.sAccordianContainerClass);
        this.$accordiansContainer = ($accContainer.length === 0) ? this.$component.filter('.'+this.sAccordianContainerClass) : $accContainer;

        // Array of panel accordians.
        this.$accordians = this.$accordiansContainer.find('> .'+this.sAccordianHeaderClass);
        // Array of panel.
        this.$panels = this.$accordiansContainer.find('> .'+this.sAccordianPanelClass);

        this.$accordians.find('.icon-collapse').addClass('text-hide');
        //this.$accordians.eq(this.getConfig().firstSlide - 1).addClass('open');

       
        if (this.$accordiansContainer.length === 0) {
            Logger.logError('AccordianComponent.createComponent() | ERROR: The parent element containing the accordian items need to have class "tis-accordian".');
        }
        if (this.$accordians.length === 0) {
            Logger.logError('AccordianComponent.createComponent() | ERROR: 0 Elements were declared with a "accordian" class');
        }
        if (this.$panels.length === 0) {
            Logger.logError('AccordianComponent.createComponent() | ERROR: 0 Elements were declared with a "panel" class');
        }
        if (this.$accordians.length !== this.$panels.length) {
            Logger.logError('AccordianComponent.createComponent() | ERROR: Number of Accordians dont match with the number of Accordian Panels');
        }

        // Call to the super calss
        AbstractComponent.prototype.createComponent.call(this);
    };
    AccordianComponent.prototype.addAriaRoles					= function () {
        //Logger.logDebug('AccordianComponent.addAriaRoles() | ');
        var oScope = this;
	    // Set up ARIA i-text
		this.$component.prepend('<span class="aria-itext visually-hidden runtime" tabindex="-1">'+this.filterData(this.getConfig().ariaIText)+'</span>');

        this.$accordiansContainer.attr({
			/*'role'					:'tablist',*/
			// add aria-multiselectable attributes for Accordian
			'aria-multiselectable'	:'true'
        });

        this.$accordians.each(function (i, elem) {
            $(this).attr({
                'id'				: oScope.sComponentID + '_heading' + i,
				'role'				: 'tab',
				'aria-selected'		: 'false',
                'aria-controls'		: oScope.sComponentID + '_panel' + i,
				'tabindex'			: '-1',
				'aria-expanded'		: 'false'
            });
		}).append(
			'<span class="aria-itext visually-hidden runtime"></span>'
		);
		this.$accordians.children('.aria-itext.runtime.visually-hidden').attr('role', 'presentation');

        this.$panels.each(function (i, elem) {
            $(this).attr({
                'id'				: oScope.sComponentID + '_panel' + i,
				'role'				: 'tabpanel',
                'aria-labelledby'	: oScope.sComponentID + '_heading' + i,
				'aria-hidden'		: 'true',
				'tabindex'			: '-1'
            });
		}).append('<span class="aria-itext visually-hidden runtime">'+this.filterData(this.getConfig().ariaITextPanel)+'<button tabindex="0" class="tis-btn back2tab_btn">'+this.getConfig().ariaITextPanelBackButton+'</button></span>');
    };
    AccordianComponent.prototype.bindHandlers					= function () {
        //Logger.logDebug('AccordianComponent.bindHandlers() | ');
        // Store the this pointer for reference
        var oScope = this;

        //////////////////////////////
        // Bind handlers for the accordians / accordian headers
        this.$accordians.on('keydown', function (e) {
            // bind a accordian keydown handler
            if (!oScope.isEnabled($(this))) {e.preventDefault();e.stopPropagation();return;}
            return oScope.handleAccordianKeyDown($(this), e);
        }).on('keypress', function (e) {
            // bind a accordian keypress handler
           if (!oScope.isEnabled($(this))) {e.preventDefault();e.stopPropagation();return;}
            return oScope.handleAccordianKeyPress($(this), e);
        }).on('click', function (e) {
            // bind a accordian click handler
            if (!oScope.isEnabled($(this))) {e.preventDefault();e.stopPropagation();return;}
            return oScope.handleAccordianClick($(this), e);
        }).on('focus', function (e) {
            // bind a accordian focus handler
            if (!oScope.isEnabled($(this))) {e.preventDefault();e.stopPropagation();return;}
            return oScope.handleAccordianFocus($(this), e);
        }).on('blur', function (e) {
            // bind a accordian blur handler
            if (!oScope.isEnabled($(this))) {e.preventDefault();e.stopPropagation();return;}
            return oScope.handleAccordianBlur($(this), e);
        });

        /////////////////////////////
        // Bind handlers for the panels
        this.$panels.on('keydown', function (e) {
            // bind a keydown handlers for the panel focusable elements
            return oScope.handlePanelKeyDown($(this), e);
        }).on('keypress', function (e) {
            // bind a keypress handler for the panel
            return oScope.handlePanelKeyPress($(this), e);
		}).on('focus', function(e){
			// bind a indicator slide focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePanelFocus($(this), e);
		}).on('blur', function(e){
			// bind a indicator slide blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePanelBlur($(this), e);
		});

		this.$panels.find('.back2tab_btn').on('click', function(e){
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleBackToAccordianClick($(this), e);
		});
    };
    AccordianComponent.prototype.initialize						= function () {
        //Logger.logDebug('AccordianComponent.initialize() | '+this);
        // The selected accordian - if one is selected
        var $accordian;
        if(this.$component.hasClass('vertical')){
        	this.getConfig().componentDirection = 'vertical';
        }else{
        	this.getConfig().componentDirection = 'horizontal';
        }

        // Check "firstSlide" value
        if (this.getConfig().firstSlide < 1 || this.getConfig().firstSlide > this.$accordians.length) {
            Logger.logWarn('AccordianComponent.initialize() | ERROR: Value specified for the "firstSlide" property is out of bounds.');
        }
        // Get the selected accordian
        $accordian = this.$accordians.filter('.selected');
        
        this.$panels.addClass('hide');
        // Select the first accordian header
        if ($accordian.length === 0) {
            $accordian = this.$accordians.eq(this.getConfig().firstSlide - 1);
        }
		
		this.tabWidth 		= this.$accordians.eq(0).outerWidth();
		this.tabHeight 		= this.$accordians.eq(0).outerHeight();
		this.panelWidth		= this.$panels.eq(0).outerWidth();
		this.panelHeight	= this.$panels.eq(0).outerHeight();
		this.outerWidth		= this.$component.parent().innerWidth();
		this.outerHeight	= this.$component.parent().innerHeight();
	
        // Show the panel that the selected accordian controls and set aria-hidden to false
        if(this.getConfig().defaultOpen){this.togglePanel(null, $accordian);}
//		setTimeout(this.dispatchComponentLoadedEvent.bind(this), this.getConfig().accordianShowSpeed);
		this.dispatchComponentLoadedEvent();
    };

    AccordianComponent.prototype.switchAccordians				= function ($curAccordian, $newAccordian, e) {
		if($curAccordian && !this.isEnabled($newAccordian)){return false;}

		if($curAccordian){
			//Logger.logDebug('AccordianComponent.switchAccordians() | Curr Accordian ID = '+$curAccordian.attr('id')+' : New Accordian ID = '+$newAccordian.attr('id'));
			// Remove the highlighting from the current Accordian
			// remove Accordian from the tab order
			// update the aria attributes
			$curAccordian.removeClass('selected focus').attr({'tabindex' : '-1'});
			this.addARIARuntimeIText($curAccordian);
		}

        // Highlight the new accordian
        // Make new Accordian navigable
		$newAccordian.addClass('selected focus').attr({
			'tabindex'			: '0'
		});

		this.addARIARuntimeIText($newAccordian);
		this.setPanelTabIndex($newAccordian);
        // give the new Accordian focus
		if(this.bInitialized){$newAccordian.focus();}
    };
    
	AccordianComponent.prototype.toggleAccordions				= function ($accordian) {
        var $panel			= this.$component.find('#' + $accordian.attr('aria-controls')),
			bPanelIsOpen	= ($panel.attr('aria-hidden') == 'false');
        // Accordian not currently selected
        if (!bPanelIsOpen) {
            var $openPanel = this.$panels.filter('[aria-hidden=false]'),
            	openAccordianID = $openPanel.attr('aria-labelledby'),
            	$openAccordian = this.$component.find('#' + openAccordianID);
          		this.togglePanel( $openAccordian, $accordian);
        }
    };
    
    AccordianComponent.prototype.togglePanel					= function ($accordian, $openAccordian) {
        var oScope 	= this,
        speed 		= 	this.getConfig().accordianShowSpeed,
        accWidth,offset, accLen, panelWidth,$panelClose,$panelOpen;
        
        if($accordian){
			$panelClose = this.$component.find('#' + $accordian.attr('aria-controls'));;
        }
        if($openAccordian){
			$panelOpen = this.$component.find('#' + $openAccordian.attr('aria-controls'));;
        }
        
        if(!$panelClose)
        	speed = 100;

       	this.bAnimating = true;
			if($panelClose){
	            if (this.getConfig().componentDirection === 'vertical') {
	                /* Vertical Accordion */
	               $panelClose.animate({'height':'1px'}, speed, function (e) {
	                	$(this).addClass('hide');
						oScope.toggleAnimationComplete($accordian, $(this), false);
	                });
	            } else {
	                /* Horizontal Accordion */
	                console.log('closing panel '+ $panelClose.attr('id'));
	                $panelClose.animate({'width':'1px'}, speed, function (e) {
	                	$(this).addClass('hide');
						oScope.toggleAnimationComplete($accordian, $(this), false);
	                });
	            }
        	}
            if (this.getConfig().componentDirection === 'vertical') {
               accHeight		= this.tabHeight;
               offset			= 1;							
               accLen 			= accHeight * this.$accordians.length;
               panelHeight 		= this.outerHeight - (accLen + offset);
               $panelOpen.removeClass('hide').animate({'height': panelHeight+'px'}, speed, function (e) {
					oScope.toggleAnimationComplete($openAccordian, $(this), true);
               });
            } else {
               accWidth			= this.tabWidth;
               offset			= 1;							
               accLen 			= accWidth * this.$accordians.length;
               panelWidth 		= this.outerWidth - (accLen + offset);
//	           console.log('one tab width - '+accWidth+'\n\t tab offset - '+offset+'\n\t all tab width - '+accLen+' \n\t outerWidth - '+outerWidth+' \n\t panelWidth - '+ panelWidth);	 
               
               $panelOpen.removeClass('hide').animate({'width': panelWidth+'px'}, speed, function (e) {
					oScope.toggleAnimationComplete($openAccordian, $(this), true);
                });
            }
        
    };
    
	AccordianComponent.prototype.toggleAnimationComplete		= function($accordian, $panel, p_bOpen){
		//Logger.logDebug('AccordianComponent.toggleAnimationComplete() | OPEN = '+p_bOpen);
		var e				= e || {},
			oEventObject	= $.extend({}, e, {
				target		: this,
				accordian	: $accordian
			});

		if(p_bOpen){
			$panel.attr('aria-hidden', 'false');

			$accordian.addClass('open selected').attr({
				'tabindex'			: '0',
				'aria-selected'		: 'true',
				'aria-expanded'		: 'true'
			}).find('.icon-collapse').html('expanded');
			this.addToVisited($panel.attr('id'));
			this.checkComplitionState();
			oEventObject.type	= 'PANEL_SHOWN';
			this.dispatchEvent('PANEL_SHOWN', oEventObject);
		}else{
			$panel.attr('aria-hidden', 'true');

			$accordian.removeClass('open selected').attr({
                'tabindex'          : '-1',
                'aria-selected'     : 'false',
                'aria-expanded'     : 'false'
            }).find('.icon-collapse').html('collapsed');
			//$accordian.find('img').attr('src', 'images/contracted.gif').attr('alt', 'collapsed');

			oEventObject.type	= 'PANEL_HIDDEN';
			this.dispatchEvent('PANEL_HIDDEN', oEventObject);
		}

		this.addARIARuntimeIText($accordian);
		this.setPanelTabIndex($accordian);

		this.bAnimating	= false;
		var playAudio = ($panel.data('audio-id'));
		this.setCurrentPanelAudioID(playAudio);
		if (p_bOpen){
			this.playCurrentAudio();	
		}
	};

    AccordianComponent.prototype.handleAccordianKeyDown			= function ($accordian, e) {
        if (e.altKey) {
            // do nothing
            return true;
        }
		//Logger.logDebug('AccordianComponent.handleAccordianKeyDown() | '+$accordian.attr('id')+' : Animating = '+this.bAnimating);

        switch (e.keyCode) {
            case this.keys.enter:
            case this.keys.space:
            {
				this.handleAccordianClick($accordian, e);
				return false;
            }
            case this.keys.left:
            case this.keys.up:
            {
                var oScope = this;
                // holds jQuery object of accordian from previous pass
                var $prevAccordian;
                // the new accordian to switch to
                var $newAccordian;

                if (e.ctrlKey) {
                    // Ctrl+arrow moves focus from panel content to the open
                    // accordian header.
                } else {
                    var curNdx = this.$accordians.index($accordian);

                    if (curNdx == 0) {
                        // accordian is the first one:
                        // set newAccordian to last accordian
                        $newAccordian = this.$accordians.last();
                    } else {
                        // set newAccordian to previous
                        $newAccordian = this.$accordians.eq(curNdx - 1);
                    }

                    // switch to the new accordian
                    this.switchAccordians($accordian, $newAccordian);
                }

                e.stopPropagation();
                return false;
            }
            case this.keys.right:
            case this.keys.down:
            {

                var oScope = this;
                // set to true when current accordian found in array
                var foundAccordian = false;
                // the new accordian to switch to
                var $newAccordian;

                var curNdx = this.$accordians.index($accordian);

                //if (curNdx == this.$accordians.last().index()) {
				if (curNdx == (this.$accordians.length-1)) {
                    // accordian is the last one:
                    // set newAccordian to first accordian
                    $newAccordian = this.$accordians.first();
                } else {
                    // set newAccordian to next accordian
                    $newAccordian = this.$accordians.eq(curNdx + 1);
                }

                // switch to the new accordian
                this.switchAccordians($accordian, $newAccordian);

                e.stopPropagation();
                return false;
            }
            case this.keys.home:
            {
                // switch to the first accordian
                this.switchAccordians($accordian, this.$accordians.first());

                e.stopPropagation();
                return false;
            }
            case this.keys.end:
            {
                // switch to the last accordian
                this.switchAccordians($accordian, this.$accordians.last());

                e.stopPropagation();
                return false;
            }
        }
    };
    AccordianComponent.prototype.handleAccordianKeyPress		= function ($accordian, e) {
        if (e.altKey) {
            // do nothing
            return true;
        }

        switch (e.keyCode) {
            case this.keys.enter:
            case this.keys.space:
            case this.keys.left:
            case this.keys.up:
            case this.keys.right:
            case this.keys.down:
            case this.keys.home:
            case this.keys.end:
            {
                e.stopPropagation();
                return false;
            }
            case this.keys.pageup:
            case this.keys.pagedown:
            {
                // The accordian keypress handler must consume pageup and pagedown
                // keypresses to prevent Firefox from switching accordians
                // on ctrl+pageup and ctrl+pagedown
                if (!e.ctrlKey) {
                    return true;
                }

                e.stopPropagation();
                return false;
            }
        }

        return true;
    };
    AccordianComponent.prototype.handleAccordianClick			= function ($accordian, e) {
		//Logger.logDebug('AccordianComponent.handleAccordianClick() | Accordian ID = '+$accordian.attr('id')+' : IS Selected = '+$accordian.hasClass('selected')+' : Type = '+this.getConfig().componentDirection);
		var bHAccSlcted	= ($accordian.hasClass('selected') && this.getConfig().componentDirection === 'horizontal');
		if(bHAccSlcted){ return; }

		var oEventObject = $.extend({}, e, {
			type		: 'ACCORDIAN_CLICK',
			target		: this,
			accordian			: $accordian
		});
		this.dispatchEvent('ACCORDIAN_CLICK', oEventObject);

		// If the accordion is still animating return
        if (this.bAnimating) {
            e.stopPropagation();
            return false;
        }
        // If the accordion panels need to Toggle
        if (this.getConfig().accordianToggle) {
            this.toggleAccordions($accordian);
            e.stopPropagation();
            return false;
        }
        // Expand the new panel
        this.togglePanel(null, $accordian);

        e.stopPropagation();
        return false;
    };
    AccordianComponent.prototype.handleAccordianFocus			= function ($accordian, e) {
		//Logger.logDebug('AccordianComponent.handleAccordianFocus() | ID = '+$accordian.attr('id')+' :: Open = '+$accordian.hasClass('open'));
        // Add the focus class to the accordian
        $accordian.addClass('focus');
		//this.addARIARuntimeIText($accordian);
		//this.setPanelTabIndex($accordian);
        return true;
    };
    AccordianComponent.prototype.handleAccordianBlur			= function ($accordian, e) {
    	//Logger.logDebug('AccordianComponent.handleAccordianBlur() | ID = '+$accordian.attr('id')+' :: Open = '+$accordian.hasClass('open'));
        $accordian.removeClass('focus');
		//this.addARIARuntimeIText($accordian);
		//$accordian.removeClass('focus').find('.aria-itext.runtime.visually-hidden').remove();
        return true;
    };

    AccordianComponent.prototype.handlePanelKeyDown				= function ($elem, e) {
        if (e.altKey) {
            // do nothing
            return true;
        }

		//Logger.logDebug('AccordianComponent.handlePanelKeyDown() | ');
        switch (e.keyCode) {
            case this.keys.tab:
            {
                var $focusable = $elem.find(':focusable');
                var curNdx = $focusable.index($(e.target));
                var panelNdx = this.$panels.index($elem);
                var numPanels = this.$panels.length;

                if (e.shiftKey) {
                    // if this is the first focusable item in the panel
                    // find the preceding expanded panel (if any) that has
                    // focusable items and set focus to the last one in that
                    // panel. If there is no preceding panel or no focusable items
                    // do not process.
                    if (curNdx == 0 && panelNdx > 0) {

                        // Iterate through previous panels until we find one that
                        // is expanded and has focusable elements
                        //
                        for (var ndx = panelNdx - 1; ndx >= 0; ndx--) {

                            var $prevPanel = this.$panels.eq(ndx);

                            // get the focusable items in the panel
                            $focusable.length = 0;
                            $focusable = $prevPanel.find(':focusable');

                            if ($focusable.length > 0) {
                                // there are focusable items in the panel.
                                // Set focus to the last item.
                                $focusable.last().focus();
                                e.stopPropagation;
                                return false;
                            }
                        }
                    }
                } else if (panelNdx < numPanels) {

                    // if this is the last focusable item in the panel
                    // find the nearest following expanded panel (if any) that has
                    // focusable items and set focus to the first one in that
                    // panel. If there is no preceding panel or no focusable items
                    // do not process.
                    if (curNdx == $focusable.length - 1) {

                        // Iterate through following panels until we find one that
                        // is expanded and has focusable elements
                        //
                        for (var ndx = panelNdx + 1; ndx < numPanels; ndx++) {

                            var $nextPanel = this.$panels.eq(ndx);

                            // get the focusable items in the panel
                            $focusable.length = 0;
                            $focusable = $nextPanel.find(':focusable');

                            if ($focusable.length > 0) {
                                // there are focusable items in the panel.
                                // Set focus to the first item.
                                $focusable.first().focus();
                                e.stopPropagation;
                                return false;
                            }
                        }
                    }
                }
                break;
            }
            case this.keys.esc:
            {
                e.stopPropagation();
                return false;
            }
            case this.keys.left:
            case this.keys.up:
            {
                if (!e.ctrlKey) {
                    // do not process
                    return true;
                }

                // get the jQuery object of the accordian
                var $accordian = $('#' + $elem.attr('aria-labelledby'));

                // Move focus to the accordian
                $accordian.focus();

                e.stopPropagation();
                return false;
            }
            case this.keys.pageup:
            {
                var $newAccordian;

                if (!e.ctrlKey) {
                    // do not process
                    return true;
                }

                // get the jQuery object of the accordian
                var $accordian = this.$accordians.filter('.selected');

                // get the index of the accordian in the accordian list
                var curNdx = this.$accordians.index($accordian);

                if (curNdx == 0) {
                    // this is the first accordian, set focus on the last one
                    $newAccordian = this.$accordians.last();
                } else {
                    // set focus on the previous accordian
                    $newAccordian = this.$accordians.eq(curNdx - 1);
                }

                // switch to the new accordian
                this.switchAccordians($accordian, $newAccordian);

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            case this.keys.pagedown:
            {

                var $newAccordian;

                if (!e.ctrlKey) {
                    // do not process
                    return true;
                }

                // get the jQuery object of the accordian
                var $accordian = $('#' + $elem.attr('aria-labelledby'));

                // get the index of the accordian in the accordian list
                var curNdx = this.$accordians.index($accordian);

                if (curNdx == this.$accordians.last().index()) {
                    // this is the last accordian, set focus on the first one
                    $newAccordian = this.$accordians.first();
                } else {
                    // set focus on the next accordian
                    $newAccordian = this.$accordians.eq(curNdx + 1);
                }

                // switch to the new accordian
                this.switchAccordians($accordian, $newAccordian);

                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        return true;
    };
    AccordianComponent.prototype.handlePanelKeyPress			= function ($elem, e) {
        if (e.altKey) {
            // do nothing
            return true;
        }

        if (e.ctrlKey && (e.keyCode == this.keys.pageup || e.keyCode == this.keys.pagedown)) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }

        switch (e.keyCode) {
            case this.keys.esc:
            {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }

        return true;
    };
	AccordianComponent.prototype.handlePanelFocus				= function($panel, e) {
		//Logger.logDebug('AccordianComponent.handlePanelFocus() | Accordian Panel ID = '+$panel.attr('id'));
		// Add the focus class to the Panel
		/*
		$panel.addClass('focus').attr({
					'tabindex' : '-1'
				});*/
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');

		return true;
	};
	AccordianComponent.prototype.handlePanelBlur				= function($panel, e) {
		//Logger.logDebug('AccordianComponent.handlePanelBlur() | Accordian ID = '+$panel.attr('id'));
		//$panel.find('.aria-itext.runtime.visually-hidden').remove();
		/*
		$panel.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		//.find('.aria-itext-tabpanel').remove();

		return true;
	};

    AccordianComponent.prototype.addARIARuntimeIText			= function(p_$focusedAccordian){
		//Logger.logDebug('AccordianComponent.addARIARuntimeIText() | Focused Accordian = '+p_$focusedAccordian.attr('id'));
		var $runtimeARIAText = p_$focusedAccordian.find('.aria-itext.runtime.visually-hidden');
		try{
			if(p_$focusedAccordian.hasClass('open')){
				$runtimeARIAText.html(this.getConfig().ariaITextAccordianHeadingsExpanded);
			}else{
				$runtimeARIAText.html(this.getConfig().ariaITextAccordianHeadingsCollapsed);
			}
		}catch(e){
			Logger.logWarn('Warning : Accordian JS - "ariaITextAccordianHeadingsExpanded" or "ariaITextAccordianHeadingsCollapsed not found in config');
		}
	};
	AccordianComponent.prototype.setPanelTabIndex				= function($accordian){
		//Logger.logDebug('AccordianComponent.setPanelTabIndex() | '+ this.$component);
		if($accordian.hasClass('open')){
			this.$component.find('#'+$accordian.attr('aria-controls')).attr({
				'tabindex' : '0'
			});
		}else{
			this.$component.find('#'+$accordian.attr('aria-controls')).attr({
				'tabindex' : '-1'
			});
		}
	};

	AccordianComponent.prototype.checkComplitionState 			= function(p_sPanelID){
		if(!this.isComplete() && this.aVisited.length == this.$panels.length){
			this.setCompleted();
		}
	};


	AccordianComponent.prototype.handleBackToAccordianClick		= function($slidePanel, e){
		//Logger.logDebug('AccordianComponent.handleBackToAccordianClick() | ');
		e.preventDefault();
		this.getCurrentSelectedAccordian().focus();
	};
	AccordianComponent.prototype.getCurrentSelectedAccordian	= function(){
		return this.$accordians.filter('.selected');
	};

    AccordianComponent.prototype.destroy						= function () {
    	// Stop any on-going animations
		this.$panels.stop();

        this.$accordians.off();
        this.$panels.off();

        this.$accordiansContainer		= null;
        this.$accordians				= null;
        this.$panels					= null;

        this.sAccordianContainerClass   = null;
        this.sAccordianHeaderClass      = null;
        this.sAccordianPanelClass       = null;

		this.oAnimateProps				= null;
		this.bAnimating					= null;

		this.prototype					= null;

        AbstractComponent.prototype.destroy.call(this);
    };
    AccordianComponent.prototype.toString						= function () {
        return 'framework/component/AccordianComponent';
    };

    return AccordianComponent;
});
