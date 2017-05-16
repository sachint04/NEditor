define([
	'framework/component/AbstractComponent',
	'framework/utils/Logger'
], function(AbstractComponent, Logger) {

	function TabComponent(p_sID, p_oConfig) {
		//Logger.logDebug('TabComponent.CONSTRUCTOR() | '+p_sID);
		AbstractComponent.call(this, p_sID, p_oConfig);

		// define the class properties
		// Merging User Config Object with Concrete classes Config Object
		this.$tabsContainer;
		this.$tabs;
		this.$panels;

		this.oAnimateProps;
		this.bAnimating;

		return this;
	}

	TabComponent.prototype									= Object.create(AbstractComponent.prototype);
	TabComponent.prototype.constructor						= TabComponent;

	TabComponent.prototype.getComponentConfig				= function() {
		return {
			accordian					: false,
			accordianType				: 'vertical',
			firstSlide					: 1,
			accordianToggle				: true,
			tabShowSpeed				: 500,
			ariaITextIndicators			: 'To navigate the tab controls use the arrow keys. Use the Tab key to move to the tabs content.',
			ariaITextSlideBackButton	: 'Back to Tabs',
			ariaITextSlide				: 'Select <<ariaITextSlideBackButton>> button to move back to the selected Tab control',
			ariaIText					: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Select <<ariaITextSlideBackButton>> button to move back to the selected Tab control.'
		};
	};
	// Initialize any class properties / variables as required
	TabComponent.prototype.init								= function(p_sID, p_oConfig) {
		this.oAnimateProps	= {
			open	: {},
			close	: {}
		};

		// Done for backward compatibility
		// Call to the super calss
		if(p_sID && p_oConfig){AbstractComponent.prototype.init.call(this, p_sID, p_oConfig);}
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties
	TabComponent.prototype.createComponent					= function() {
		//Logger.logDebug('TabComponent.createComponent() | IS Accordian = '+(this.getConfig().accordian));
		// If runtime Tab and Panel creation is required by the component
		// tabs container.
		this.$tabsContainer		= this.$component.find('> .tablist');
		// Array of panel tabs.
		this.$tabs				= (this.getConfig().accordian) ? this.$component.find('> .tab') : this.$component.find('> .tablist > .tab');
		// Array of panel.
		this.$panels			= this.$component.find('> .panel');

		if(this.getConfig().accordian){
			this.$tabs.find('.icon-collapse').addClass('text-hide');

			if(this.getConfig().accordianType === 'horizontal'){
				var oScope				= this,
					nComponentWidth		= this.$component.outerWidth(true),
					nPanelOuterWidth	= this.$panels.outerWidth(true),
					nPanelWidth			= this.$panels.width(),

					nPanelPaddingLeft	= this.$panels.css('padding-left'),
					nPanelPaddingLeft	= Number(nPanelPaddingLeft.substring(0, nPanelPaddingLeft.length-2)),

					nPanelPaddingRight	= this.$panels.css('padding-right'),
					nPanelPaddingRight	= Number(nPanelPaddingRight.substring(0, nPanelPaddingRight.length-2)),

					nPanelMarginLeft	= this.$panels.css('margin-left'),
					nPanelMarginLeft	= Number(nPanelMarginLeft.substring(0, nPanelMarginLeft.length-2)),

					nPanelMarginRight	= this.$panels.css('margin-right'),
					nPanelMarginRight	= Number(nPanelMarginRight.substring(0, nPanelMarginRight.length-2)),

					nTabsTotalWidth		= 0;


				this.$component.append('<div class="clearfix"></div>');

				this.$tabs.each(function(i, elem) {
				    nTabsTotalWidth += $(this).outerWidth(true);
				});

				this.oAnimateProps.open		= {
					'width'			: (nComponentWidth - nTabsTotalWidth),
					'padding-left'	: nPanelPaddingLeft,
					'padding-right'	: nPanelPaddingRight,
					'margin-left'	: nPanelMarginLeft,
					'margin-right'	: nPanelMarginRight
				};
				this.oAnimateProps.close	= {
					'width'			: 0,
					'padding-left'	: 0,
					'padding-right'	: 0,
					'margin-left'	: 0,
					'margin-right'	: 0
				};

				this.$panels.each(function(i, elem) {
				    var $elems = $('<div class="panel-content-wrapper">').append($(this).find('> *').detach());
				    $(this).append($elems);
				}).css({
					'overflow-x'	: 'hidden',
					'overflow-y'	: 'auto',
					'position'		: 'relative'
				}).outerHeight(this.$tabs.outerHeight(true)).css(this.oAnimateProps.close);
				this.$panels.eq(this.getConfig().firstSlide-1).css(this.oAnimateProps.open);

				this.$panels.find('> div.panel-content-wrapper').width((nComponentWidth - nTabsTotalWidth) - (nPanelOuterWidth - nPanelWidth));
				this.getConfig().accordianToggle = true;
			}
		}
		if(this.$tabsContainer.length === 0 && !this.getConfig().accordian){
			Logger.logError('TabComponent.createComponent() | ERROR: The parent element containing the tab items need to have class "tablist".');
		}
		if(this.$tabs.length === 0){
			Logger.logError('TabComponent.createComponent() | ERROR: 0 Elements were declared with a "tab" class');
		}
		if(this.$panels.length === 0){
			Logger.logError('TabComponent.createComponent() | ERROR: 0 Elements were declared with a "panel" class');
		}
		if(this.$tabs.length !== this.$panels.length){
			Logger.logError('TabComponent.createComponent() | ERROR: Number of Tabs dont match with the number of Tab Panels');
		}

		// Call to the super calss
		AbstractComponent.prototype.createComponent.call(this);
	};
	TabComponent.prototype.addAriaRoles						= function() {
		//Logger.logDebug('TabComponent.addAriaRoles() | ');
	    var oScope = this;
	    // Set up ARIA i-text
		this.$component.prepend('<span class="aria-itext runtime" tabindex="-1">'+this.filterData(this.getConfig().ariaIText)+'</span>');
		this.$tabsContainer.attr({
			role		:'tablist'
		});
		this.$tabs.each(function(i, elem){
			$(this).attr({
				'id'				: oScope.sComponentID + '_tab' + i,
				'role'				: 'tab',
				'aria-selected'		: 'false',
				'aria-controls'		: oScope.sComponentID + '_panel' + i,
				'tabindex'			: '-1'
			});
		});
		this.$panels.each(function(i, elem){
			$(this).attr({
				'id'				: oScope.sComponentID + '_panel' + i,
				'role'				: 'tabpanel',
				'aria-labelledby'	: oScope.sComponentID + '_tab' + i,
				'aria-hidden'		: 'true'
			});
		}).append('<span class="aria-itext visually-hidden runtime">'+this.filterData(this.getConfig().ariaITextSlide)+'<button tabindex="0" class="tis-btn back2tab_btn">'+this.getConfig().ariaITextSlideBackButton+'</button></span>');
		//this.$panels.find('.slide-inner').attr('tabindex', '-1');

		if(this.getConfig().accordian){
			this.$tabs.attr({
				'aria-expanded'		: 'false'
			});
		}
	};
	TabComponent.prototype.bindHandlers						= function() {
		//Logger.logDebug('TabComponent.bindHandlers() | ');
		// Store the this pointer for reference
		var oScope = this;

		//////////////////////////////
		// Bind handlers for the tabs / accordian headers
		this.$tabs.on('keydown', function(e) {
			// bind a tab keydown handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return;}
			return oScope.handleTabKeyDown($(this), e);
		}).on('keypress', function(e){
			// bind a tab keypress handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return;}
			return oScope.handleTabKeyPress($(this), e);
		}).on('click', function(e){
			// bind a tab click handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return;}
			return oScope.handleTabClick($(this), e);
		}).on('focus', function(e){
			// bind a tab focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return;}
			return oScope.handleTabFocus($(this), e);
		}).on('blur', function(e){
			// bind a tab blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return;}
			return oScope.handleTabBlur($(this), e);
		});

		/////////////////////////////
		// Bind handlers for the panels
		this.$panels.on('keydown', function(e) {
			// bind a keydown handlers for the panel focusable elements
			return oScope.handlePanelKeyDown($(this), e);
		}).on('keypress', function(e) {
			// bind a keypress handler for the panel
			return oScope.handlePanelKeyPress($(this), e);
		}).on('focus', function(e){
			// bind a indicator slide focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleSlidePanelFocus($(this), e);
		}).on('blur', function(e){
			// bind a indicator slide blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleSlidePanelBlur($(this), e);
		});
		this.$panels.find('.back2tab_btn').on('click', function(e){
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleBackToTabClick($(this), e);
		});
	};
	TabComponent.prototype.initialize						= function() {
		// the selected tab - if one is selected
		var $tab;

		// add aria attributes to the panel container
		this.$component.attr('aria-multiselectable', this.getConfig().accordian);

		// hide all the panels
		this.$panels.addClass('hide');

		// All Tab Panels are hidden and first Tab is set to achieve Tab focus
		if(this.getConfig().firstSlide == -1){
			$tab = this.$tabs.eq(0);
			$tab.attr({
				'tabindex'			: '0'
			});
			return;
		}
		// Check "firstSlide" value
		if(this.getConfig().firstSlide < 1 || this.getConfig().firstSlide > this.$tabs.length){
			Logger.logError('TabComponent.initialize() | ERROR: Value specified for the "firstSlide" property is out of bounds.');
		}

		// get the selected tab
		$tab = this.$tabs.filter('.selected');

		if ($tab.length === 0) {
			$tab = this.$tabs.eq(this.getConfig().firstSlide-1);
		}

		// show the panel that the selected tab controls and set aria-hidden to false
		/*
		if (this.getConfig().accordian) {
					this.togglePanel($tab);
				}else{
					//this.showTabPanel($tab);
				}*/
		this.switchTabs(null, $tab);
		if (this.getConfig().accordian) {
			this.togglePanel($tab);
		}
	};

	TabComponent.prototype.getCurrentCarouselIndicator			= function(){
		return this.$indicators.filter('.selected');
	};
	TabComponent.prototype.getPreviousCarouselIndicator			= function($currItem){
		var $newIndicator,
			curNdx = this.$indicators.index($currItem);
		if (curNdx == 0) {
			// indicator is the first one:
			if(this.getConfig().wrap){
				// set newIndicator to last indicator
				$newIndicator = this.$indicators.last();
			}
		} else {
			// set newIndicator to previous
			$newIndicator = this.$indicators.eq(curNdx - 1);
		}
		return $newIndicator;
	};
	TabComponent.prototype.getNextCarouselIndicator				= function($currItem){
		var $newIndicator,
			curNdx = this.$indicators.index($currItem);
		//if (curNdx == this.$indicators.last().index()) {
		if (curNdx == (this.$indicators.length-1)) {
			// indicator is the last one:
			if(this.getConfig().wrap){
				// set newIndicator to first indicator
				$newIndicator = this.$indicators.first();
			}
		} else {
			// set newIndicator to next indicator
			$newIndicator = this.$indicators.eq(curNdx + 1);
		}
		return $newIndicator;
	};
	TabComponent.prototype.hasNext								= function($item){
		var $nextItem	= this.getNextCarouselIndicator($item);
		//Logger.logDebug('Carousel.hasNext() | Next Item = '+$nextItem);
		if($nextItem === undefined || $nextItem === null){return false;}
		return true;
	};
	TabComponent.prototype.hasPrevious							= function($item){
		var $prevItem	= this.getPreviousCarouselIndicator($item);
		//Logger.logDebug('Carousel.hasPrevious() | Prev Item = '+$prevItem);
		if($prevItem === undefined || $prevItem === null){return false;}
		return true;
	};
	TabComponent.prototype.switchTabs						= function($curTab, $newTab, e) {
		if($curTab && !this.isEnabled($newTab)){return false;}
		if($curTab){
			Logger.logDebug('TabComponent.switchTabs() | Curr Tab ID = '+$curTab.attr('id')+' : New Tab ID = '+$newTab.attr('id'));
			// Remove the highlighting from the current tab
			// remove tab from the tab order
			// update the aria attributes
			$curTab.removeClass('selected focus').attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false'
			}).find('.aria-itext.runtime').remove();
		}


		// Highlight the new tab
		// Make new tab navigable
		// give the new tab focus
		$newTab.addClass('selected focus').attr({
			'tabindex'			: '0',
			'aria-selected'		: 'true'
		}).focus();

		// If this is a tab panel, swap displayed tabs
		if (this.getConfig().accordian) {
			// Accordions are not suppossed to show the panels on arrow key navigations
			//this.togglePanel($tab);

			// get new list of focusable elements
			//this.$focusable.length = 0;
			//this.$panels.find(':focusable');
		}else{
			// hide the current tab panel and set aria-hidden to true
			if($curTab){
				this.$component.find('#' + $curTab.attr('aria-controls')).addClass('hide').attr('aria-hidden', 'true');
			}

			// Dispatch Tab Click Event
			var oEventObject = $.extend({}, e, {
				type		: 'TAB_CLICK',
				target		: this,
				tab			: $newTab
			});
			this.dispatchEvent('TAB_CLICK', oEventObject);

			// show the new tab panel and set aria-hidden to false
			this.showTabPanel($newTab);
		};
	};
	TabComponent.prototype.showTabPanel						= function($tab, e) {
		var oScope			= this,
			e				= e || {},
			oEventObject	= $.extend({}, e, {
				type		: 'PANEL_SHOWN',
				target		: this,
				tab			: $tab
			});

		$tab.attr({
			'tabindex'		: 0
		});

		this.$component.find('#' + $tab.attr('aria-controls')).fadeIn(this.getConfig().tabShowSpeed, function(e){
			oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
		}).removeClass('hide').attr({
			'aria-hidden'	: 'false'
		});
	};

	TabComponent.prototype.toggleAccordions					= function($tab){
		var $panel			= this.$component.find('#' + $tab.attr('aria-controls')),
			bPanelIsOpen	= ($panel.attr('aria-hidden') == 'false');
		// Tab not currently selected
		if(!bPanelIsOpen){
			var $openPanel	= this.$panels.filter('[aria-hidden=false]'),
				openTabID	= $openPanel.attr('aria-labelledby'),
				$openTab	= this.$component.find('#'+openTabID);

			// Close the Open Tab
			this.togglePanel($openTab);
			// Open the Clicked tab
			this.togglePanel($tab);
		}
	};
	TabComponent.prototype.togglePanel						= function($tab) {
		var oScope			= this,
			$panel			= this.$component.find('#' + $tab.attr('aria-controls'));
		Logger.logDebug('TabComponent.togglePanel() | Panel ID = '+$panel.attr('id')+' : ARIA Hidden = '+$panel.attr('aria-hidden'));
		this.bAnimating	= true;

		if ($panel.attr('aria-hidden') === 'true') {
			if(this.getConfig().accordianType === 'vertical'){
				/* Vertical Accordion */
				$panel.removeClass('hide').css('display', 'none').slideDown(this.getConfig().tabShowSpeed, function(e){
					oScope.toggleAnimationComplete($tab, $(this), true);
				});
			}else{
				/* Horizontal Accordion */
				$panel.find('.panel-content-wrapper').css('position', 'absolute');
				$panel.removeClass('hide').animate(this.oAnimateProps.open, this.getConfig().tabShowSpeed, function(e){
					$(this).find('.panel-content-wrapper').css('position', 'relative');
					oScope.toggleAnimationComplete($tab, $(this), true);
				});
			}
		} else {
			if(this.getConfig().accordianType === 'vertical'){
				/* Vertical Accordion */
				$panel.slideUp(this.getConfig().tabShowSpeed, function(e){
					oScope.toggleAnimationComplete($tab, $(this), false);
				});
			}else{
				/* Horizontal Accordion */
				$panel.find('.panel-content-wrapper').css('position', 'absolute');
				$panel.animate(this.oAnimateProps.close, this.getConfig().tabShowSpeed, function(e){
					$(this).find('.panel-content-wrapper').css('position', 'relative');
					oScope.toggleAnimationComplete($tab, $(this), false);
				});
			}
		}
	};

	TabComponent.prototype.toggleAnimationComplete			= function($tab, $panel, p_bOpen){
		Logger.logDebug('TabComponent.toggleAnimationComplete() | ');
		var e				= e || {},
			oEventObject	= $.extend({}, e, {
				target		: this,
				tab			: $tab
			});

		this.$tabs.removeClass('open selected').attr({
			'tabindex'			: '-1',
			'aria-selected'		: 'false',
			'aria-expanded'		: 'false'
		});

		if(p_bOpen){
			$panel.attr('aria-hidden', 'false');

			$tab.addClass('open selected').attr({
				'tabindex'			: '0',
				'aria-selected'		: 'true',
				'aria-expanded'		: 'true'
			}).find('.icon-collapse').html('expanded');
			//$tab.find('img').attr('src', 'images/expanded.gif').attr('alt', 'expanded');

			oEventObject.type	= 'PANEL_SHOWN';
			this.dispatchEvent('PANEL_SHOWN', oEventObject);
		}else{
			$panel.addClass('hide').attr('aria-hidden', 'true');

			$tab.find('.icon-collapse').html('collapsed');
			//$tab.find('img').attr('src', 'images/contracted.gif').attr('alt', 'collapsed');

			oEventObject.type	= 'PANEL_HIDDEN';
			this.dispatchEvent('PANEL_HIDDEN', oEventObject);
		}

		this.bAnimating	= false;
	};

	TabComponent.prototype.handleTabKeyDown					= function($tab, e) {
		Logger.logDebug('TabComponent.handleTabKeyDown() | ');
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.enter:
			case this.keys.space: {
				// Only process if this is an accordian widget
				if (this.getConfig().accordian == true) {
					if(this.bAnimating){e.stopPropagation(); return false;}

					// If the accordion panels need to Toggle
					if(this.getConfig().accordianToggle){
						this.toggleAccordions($tab);
						e.stopPropagation();
						return false;
					}
					// display or collapse the panel
					this.togglePanel($tab);

					e.stopPropagation();
					return false;
				}

				return true;
			}
			case this.keys.left:
			case this.keys.up: {

				var oScope = this;
				var $prevTab;
				// holds jQuery object of tab from previous pass
				var $newTab;
				// the new tab to switch to

				if (e.ctrlKey) {
					//Logger.logDebug('CNTRL + UP');
					// Ctrl+arrow moves focus from panel content to the open
					// tab/accordian header.
					//this.$tabs.filter('.selected').focus();
				} else {
					var curNdx = this.$tabs.index($tab);

					if (curNdx == 0) {
						// tab is the first one:
						// set newTab to last tab
						$newTab = this.$tabs.last();
					} else {
						// set newTab to previous
						$newTab = this.$tabs.eq(curNdx - 1);
					}

					// switch to the new tab
					this.switchTabs($tab, $newTab);
				}

				e.stopPropagation();
				return false;
			}
			case this.keys.right:
			case this.keys.down: {
				var oScope = this;
				var foundTab = false;
				// set to true when current tab found in array
				var $newTab;
				// the new tab to switch to

				var curNdx = this.$tabs.index($tab);
				//if (curNdx == this.$tabs.last().index()) {
				if (curNdx == (this.$tabs.length-1)) {
					// tab is the last one:
					// set newTab to first tab
					$newTab = this.$tabs.first();
				} else {
					// set newTab to next tab
					$newTab = this.$tabs.eq(curNdx + 1);
				}

				// switch to the new tab
				this.switchTabs($tab, $newTab);

				e.stopPropagation();
				return false;
			}
			case this.keys.home: {

				// switch to the first tab
				this.switchTabs($tab, this.$tabs.first());

				e.stopPropagation();
				return false;
			}
			case this.keys.end: {

				// switch to the last tab
				this.switchTabs($tab, this.$tabs.last());

				e.stopPropagation();
				return false;
			}
		}
	};

	TabComponent.prototype.handleTabKeyPress				= function($tab, e) {
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
			case this.keys.end: {
				e.stopPropagation();
				return false;
			}
			case this.keys.pageup:
			case this.keys.pagedown: {

				// The tab keypress handler must consume pageup and pagedown
				// keypresses to prevent Firefox from switching tabs
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

	TabComponent.prototype.handleTabClick					= function($tab, e) {
		Logger.logDebug('TabComponent.handleTabClick() | Tab ID = '+$tab.attr('id')+' : IS Selected = '+$tab.hasClass('selected')+' : Accordion = '+this.getConfig().accordian+' : Type = '+this.getConfig().accordianType);
		e.preventDefault();
		var bTabSlcted	= (!this.getConfig().accordian && $tab.hasClass('selected')),
			bHAccSlcted	= (this.getConfig().accordian && $tab.hasClass('selected') && this.getConfig().accordianType === 'horizontal');
		if(bTabSlcted || bHAccSlcted){ return; }

		var oEventObject = $.extend({}, e, {
			type		: 'TAB_CLICK',
			target		: this,
			tab			: $tab
		});
		this.dispatchEvent('TAB_CLICK', oEventObject);

		if(this.getConfig().accordian){
			if(this.bAnimating){e.stopPropagation(); return false;}

 			// If the accordion panels need to Toggle
			if(this.getConfig().accordianToggle){
				this.toggleAccordions($tab);
				e.stopPropagation();
				return false;
			}
			// Expand the new panel
 			this.togglePanel($tab);

			e.stopPropagation();
 			return false;
		}else{
			this.switchTabs(this.$tabs.filter('.selected'), $tab, e);
			// Remove the highlighting from all tabs
			/*
			this.$tabs.removeClass('selected');

						// hide all tab panels
						this.$panels.addClass('hide');

						// Highlight the clicked tab
						$tab.addClass('selected');
						// show the clicked tab panel
						this.showTabPanel($tab, e);*/

		}

		// give the tab focus
		//$tab.focus();

		return true;
	};

	TabComponent.prototype.handleTabFocus					= function($tab, e) {
		// Add the focus class to the tab
		//$tab.addClass('focus');
		if($tab.hasClass('selected')){
			$tab.append(
				'<span class="aria-itext runtime">tab selected</span><span class="aria-itext runtime">'+this.getConfig().ariaITextIndicators+'</span>'
			);
			
			this.$component.find('#'+$tab.attr('aria-controls')).attr({
				'tabindex' : '0'
			});
		}
		return true;
	};

	TabComponent.prototype.handleTabBlur					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleIndicatorBlur() | KEY Code = '+e.keyCode);
		$tab.removeClass('focus').find('.aria-itext.runtime').remove();
		return true;
	};

	TabComponent.prototype.handlePanelKeyDown				= function($elem, e) {
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.tab: {
				if(this.getConfig().accordian){
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
				}
				break;
			}
			case this.keys.esc: {
				e.stopPropagation();
				return false;
			}
			case this.keys.left:
			case this.keys.up: {
				if (!e.ctrlKey) {
					// do not process
					return true;
				}

				// get the jQuery object of the tab
				var $tab = $('#' + $elem.attr('aria-labelledby'));

				// Move focus to the tab
				$tab.focus();

				e.stopPropagation();
				return false;
			}
			case this.keys.pageup: {
				var $newTab;

				if (!e.ctrlKey) {
					// do not process
					return true;
				}

				// get the jQuery object of the tab
				var $tab = this.$tabs.filter('.selected');

				// get the index of the tab in the tab list
				var curNdx = this.$tabs.index($tab);

				if (curNdx == 0) {
					// this is the first tab, set focus on the last one
					$newTab = this.$tabs.last();
				} else {
					// set focus on the previous tab
					$newTab = this.$tabs.eq(curNdx - 1);
				}

				// switch to the new tab
				//Logger.logDebug('\tPAGE UP');
				this.switchTabs($tab, $newTab, e);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			case this.keys.pagedown: {

				var $newTab;

				if (!e.ctrlKey) {
					// do not process
					return true;
				}

				// get the jQuery object of the tab
				var $tab = $('#' + $elem.attr('aria-labelledby'));

				// get the index of the tab in the tab list
				var curNdx = this.$tabs.index($tab);

				if (curNdx == this.$tabs.last().index()) {
					// this is the last tab, set focus on the first one
					$newTab = this.$tabs.first();
				} else {
					// set focus on the next tab
					$newTab = this.$tabs.eq(curNdx + 1);
				}

				// switch to the new tab
				//Logger.logDebug('\tPAGE DOWN');
				this.switchTabs($tab, $newTab, e);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}

		return true;
	};

	TabComponent.prototype.handlePanelKeyPress				= function($elem, e) {
		/*
		Logger.logDebug('Carousel.handleSlidePanelKeyPress() | KEY Code = '+e.keyCode);

				Logger.logDebug('\tFocused Element = '+$(document).find('#tabpanel1_indicator3').is(':focus')+' : Tab Index = '+$(document).find('#tabpanel1_indicator3').attr('tabindex'));
				Logger.logDebug('\tTAB KEY down = '+(e.keyCode === this.keys.tab));
				Logger.logDebug('\tUP KEY down = '+(e.keyCode === this.keys.up));
				Logger.logDebug('\tCNTRL KEY down = '+(e.ctrlKey || e.keyCode === this.keys.cntrl));
				Logger.logDebug('\tSHIFT KEY down = '+(e.shiftKey || e.keyCode === this.keys.shift));*/

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
			case this.keys.esc: {
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}

		return true;
	};
	TabComponent.prototype.handleSlidePanelFocus				= function($slidePanel, e) {
		//Logger.logDebug('Carousel.handleSlidePanelFocus() | Tab ID = '+$slidePanel.attr('id'));
		// Add the focus class to the Panel
		/*
		$slidePanel.addClass('focus').attr({
					'tabindex' : '-1'
				});*/
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');

		return true;
	};
	TabComponent.prototype.handleSlidePanelBlur					= function($slidePanel, e) {
		//Logger.logDebug('Carousel.handleSlidePanelBlur() | Tab ID = '+$slidePanel.attr('id'));
		//$slidePanel.find('.aria-itext.runtime').remove();
		/*
		$slidePanel.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		//.find('.aria-itext-tabpanel').remove();

		return true;
	};
	TabComponent.prototype.handleBackToTabClick					= function($slidePanel, e){
		//Logger.logDebug('Carousel.handleBackToTabClick() | ');
		e.preventDefault();
		this.getCurrentCarouselIndicator().focus();
	};
	

	TabComponent.prototype.destroy							= function() {
		// Stop any on-going animations
		this.$panels.stop();
		
		this.$tabs.off();
		this.$panels.off();

		this.$tabsContainer	= null;
		this.$tabs			= null;
		this.$panels		= null;
		
		this.oAnimateProps	= null;
		this.bAnimating		= null;

		AbstractComponent.prototype.destroy.call(this);
	};
	TabComponent.prototype.toString							= function() {
		return 'framework/component/TabComponent';
	};

	return TabComponent;
});
