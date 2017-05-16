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
			accordian				: false,
			accordianType			: 'vertical',
			// TODO: Add code to open user specified panel
			firstSlide				: 1,
			accordianToggle			: true,
			tabShowSpeed			: 500,
			ariaIText				: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Use SHIFT TAB key to move back to the selected TAB.'
		};
	};
	// Initialize any class properties / variables as required
	TabComponent.prototype.initialize						= function() {
		this.oAnimateProps	= {
			open	: {},
			close	: {}
		};
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties 
	TabComponent.prototype.createComponent					= function() {
		//Logger.logDebug('TabComponent.createComponent() | IS Accordian = '+(this.getConfig().accordian));
		// If runtime Tab and Panel creation is required by the component
		
		// Set up ARIA i-text
		this.$component.prepend('<span class="aria-itext" tabindex="-1">'+this.getConfig().ariaIText+'</span>');
		// tabs container.
		this.$tabsContainer		= this.$component.find('> .tablist');
		// Array of panel tabs.
		this.$tabs				= (this.getConfig().accordian) ? this.$component.find('> .tab') : this.$component.find('> .tablist > .tab');
		// Array of panel.
		this.$panels			= this.$component.find('> .panel');
		
		if(this.getConfig().accordian){
			this.$tabs.find('.icon-collapse').addClass('text-hide');
			this.$tabs.first().addClass('open');
			
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
	    var oScope = this;
		if(!this.getConfig().accordian){
			this.$tabsContainer.attr({
				role		:'tablist'
			});
		}
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
		});
	};
	TabComponent.prototype.bindHandlers						= function() {
		// Store the this pointer for reference
		var oScope = this;

		//////////////////////////////
		// Bind handlers for the tabs / accordian headers
		this.$tabs.on('keydown', function(e) {
			// bind a tab keydown handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleTabKeyDown($(this), e);
		}).on('keypress', function(e){
			// bind a tab keypress handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleTabKeyPress($(this), e);
		}).on('click', function(e){
			// bind a tab click handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleTabClick($(this), e);
		}).on('focus', function(e){
			// bind a tab focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleTabFocus($(this), e);
		}).on('blur', function(e){
			// bind a tab blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
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
			// bind a tab focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePanelFocus($(this), e);
		}).on('blur', function(e){
			// bind a tab blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePanelBlur($(this), e);
		});
	};
	TabComponent.prototype.init								= function() {
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
			$tab.addClass('selected');
		}

		// show the panel that the selected tab controls and set aria-hidden to false
		this.showTabPanel($tab);
	};

	TabComponent.prototype.switchTabs						= function($curTab, $newTab, e) {
		Logger.logDebug('TabComponent.switchTabs() | KEY Code = '+e.keyCode);
		if(!this.isEnabled($newTab)){return false;}
		if($curTab){
			Logger.logDebug('TabComponent.switchTabs() | Curr Tab ID = '+$curTab.attr('id')+' : New Tab ID = '+$newTab.attr('id'));
			// Remove the highlighting from the current tab
			// remove tab from the tab order
			// update the aria attributes
			$curTab.removeClass('selected focus').attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false',
			});
		}

		// If this is a tab panel, swap displayed tabs
		if (this.getConfig().accordian == false) {
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
			
			if(this.getConfig().accordian){
				// get new list of focusable elements
				this.$focusable.length = 0;
				this.$panels.find(':focusable');
			}
		};
		
		// give the new tab focus
		// Highlight the new tab
		// Make new tab navigable
		$newTab.addClass('selected focus').attr({
			'tabindex'			: '0',
			'aria-selected'		: 'true',
		}).focus();
	};

	TabComponent.prototype.togglePanel						= function($tab) {
		var oScope			= this,
			e				= e || {},
			oEventObject	= $.extend({}, e, {
				type		: 'PANEL_SHOWN',
				target		: this,
				tab			: $tab
			}),
			$panel = this.$component.find('#' + $tab.attr('aria-controls'));
		//Logger.logDebug('TabComponent.togglePanel() | Panel ID = '+$panel.attr('id')+' : ARIA Hidden = '+$panel.attr('aria-hidden'));
		
		this.bAnimating	= true;
		
		if ($panel.attr('aria-hidden') === 'true') {
			oEventObject	= $.extend({}, oEventObject, {type		: 'PANEL_SHOWN'});
			if(this.getConfig().accordianType === 'vertical'){
				/* Vertical Accordion */
				$panel.removeClass('hide').css('display', 'none').slideDown(this.getConfig().tabShowSpeed, function(e){
					$(this).attr('aria-hidden', 'false');
					$tab.addClass('open');
					$tab.find('.icon-collapse').html('expanded'); 
					//$tab.find('img').attr('src', 'images/expanded.gif').attr('alt', 'expanded'); 
					oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
					oScope.bAnimating	= false;
				});
			}else{
				/* Horizontal Accordion */
				$panel.find('.panel-content-wrapper').css('position', 'absolute');
				$panel.removeClass('hide').animate(this.oAnimateProps.open, this.getConfig().tabShowSpeed, function(e){
					$(this).attr('aria-hidden', 'false');
					$tab.addClass('open');
					$tab.find('.icon-collapse').html('expanded'); 
					$(this).find('.panel-content-wrapper').css('position', 'relative');
					//$tab.find('img').attr('src', 'images/expanded.gif').attr('alt', 'expanded'); 
					oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
					oScope.bAnimating	= false;
				});
			}
		} else {
			oEventObject	= $.extend({}, oEventObject, {type		: 'PANEL_HIDDEN'});
			if(this.getConfig().accordianType === 'vertical'){
				/* Vertical Accordion */
				$panel.slideUp(this.getConfig().tabShowSpeed, function(e){
					$(this).addClass('hide').attr('aria-hidden', 'true');
					$tab.removeClass('open');
					$tab.find('.icon-collapse').html('collapsed'); 
					//$tab.find('img').attr('src', 'images/contracted.gif').attr('alt', 'collapsed'); 
					oScope.dispatchEvent('PANEL_HIDDEN', oEventObject);
					oScope.bAnimating	= false;
				});
			}else{
				/* Horizontal Accordion */
				$panel.find('.panel-content-wrapper').css('position', 'absolute');
				$panel.animate(this.oAnimateProps.close, this.getConfig().tabShowSpeed, function(e){
					$(this).addClass('hide').attr('aria-hidden', 'true');
					$tab.removeClass('open');
					$tab.find('.icon-collapse').html('collapsed'); 
					$(this).find('.panel-content-wrapper').css('position', 'relative');
					//$tab.find('img').attr('src', 'images/contracted.gif').attr('alt', 'collapsed'); 
					oScope.dispatchEvent('PANEL_HIDDEN', oEventObject);
					oScope.bAnimating	= false;
				});
			}
		}
	};

	TabComponent.prototype.handleTabKeyDown					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabKeyDown() | ');
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
				}else{
					this.handleTabClick($tab, e);
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
					// Ctrl+arrow moves focus from panel content to the open
					// tab/accordian header.
					//alert('CNTRL + UP');
					this.$tabs.filter('.selected').focus();
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
					Logger.logDebug('\tLEFT or UP');
					this.switchTabs($tab, $newTab, e);
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

				if (curNdx == this.$tabs.last().index()) {
					// tab is the last one:
					// set newTab to first tab
					$newTab = this.$tabs.first();
				} else {
					// set newTab to next tab
					$newTab = this.$tabs.eq(curNdx + 1);
				}

				// switch to the new tab
				Logger.logDebug('\tRIGHT or DOWN');
				this.switchTabs($tab, $newTab, e);

				e.stopPropagation();
				return false;
			}
			case this.keys.home: {

				// switch to the first tab
				Logger.logDebug('\tHOME');
				this.switchTabs($tab, this.$tabs.first(), e);

				e.stopPropagation();
				return false;
			}
			case this.keys.end: {
				// switch to the last tab
				Logger.logDebug('\tEND');
				this.switchTabs($tab, this.$tabs.last(), e);

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
		if(this.getConfig().accordian){
			if(this.bAnimating){e.stopPropagation(); return false;}
			
			// remove all tabs from the tab order
			this.$tabs.attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false',
			});
			
			// make clicked tab navigable
			$tab.attr({
				'tabindex'			: '0',
				'aria-selected'		: 'true',
			});
			
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
		}
		
		if($tab.hasClass('selected')){ return; }
		
		var $selectedTab = this.$tabs.filter('.selected');
		if($selectedTab.length > 0){
			Logger.logDebug('\tIF Tab Click | KEY Code = '+e.shiftKey+' : Tab ID = '+$tab.attr('id')+' : Tab Index = '+$tab.attr('tabindex')+' : Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
			if(e.shiftKey && $tab.attr('tabindex') === '-1'){
				// Fix for IE: Probably shift tab has been triggered
				this.$tabs.filter('.selected').focus();
				return false;
			}else{
				this.switchTabs($selectedTab, $tab, e);
			}
		}else{
			Logger.logDebug('\tELSE Tab Click | KEY Code = '+e.shiftKey+' : Tab ID = '+$tab.attr('id')+' : Tab Index = '+$tab.attr('tabindex')+' : Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
			if(e.shiftKey && $tab.attr('tabindex') === '-1'){
				// Fix for IE: Probably shift tab has been triggered
				this.$tabs.filter('.selected').focus();
				return false;
			}else{
				this.switchTabs(null, $tab, e);
			}
		}
		// Remove the highlighting from all tabs
		//this.$tabs.removeClass('selected');

		// hide all tab panels
		//this.$panels.addClass('hide');

		// Highlight the clicked tab
		//$tab.addClass('selected');
		/*
		var oEventObject = $.extend({}, e, {
					type		: 'TAB_CLICK',
					target		: this,
					tab			: $tab
				});
				this.dispatchEvent('TAB_CLICK', oEventObject);*/
		

		// show the clicked tab panel
		//this.showTabPanel($tab, e);

		// give the tab focus
		//$tab.focus();

		return true;
	};

	TabComponent.prototype.handleTabFocus					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabFocus() | Tab ID = '+$tab.attr('id')+' : Tab Has Selected = '+$tab.hasClass('selected'));
		// Add the focus class to the tab
		$tab.addClass('focus');
		if($tab.hasClass('selected')){
			this.$component.find('#'+$tab.attr('aria-controls')).attr({
				'tabindex' : '0'
			});
			//$tab.prepend('<span class="aria-itext aria-itext-tab">Selected</span>');
			//$tab.append('<span class="aria-itext aria-itext-tab">Use TAB key to move to controlled element.</span>');
		}
		return true;
	};

	TabComponent.prototype.handleTabBlur					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabBlur() | KEY Code = '+e.keyCode);
		/*$tab.removeClass('focus').find('.aria-itext-tab').remove();
		return true;*/
	};

	TabComponent.prototype.handlePanelKeyDown				= function($elem, e) {
		Logger.logDebug('TabComponent.handlePanelKeyDown() | KEY Code = '+e.keyCode);
		if (e.altKey) {
			// do nothing
			return true;
		}
		
		Logger.logDebug('\tFocused Element = '+$(document).find('#tabpanel1_tab3').is(':focus')+' : Tab Index = '+$(document).find('#tabpanel1_tab3').attr('tabindex'));
		Logger.logDebug('\tTAB KEY down = '+(e.keyCode === this.keys.tab));
		Logger.logDebug('\tUP KEY down = '+(e.keyCode === this.keys.up));
		Logger.logDebug('\tCNTRL KEY down = '+(e.ctrlKey || e.keyCode === this.keys.cntrl));
		Logger.logDebug('\tSHIFT KEY down = '+(e.shiftKey || e.keyCode === this.keys.shift));
		Logger.logDebug('\tPanel Focus = '+($elem.is(':focus'))+' || '+($elem.find('*').is(':focus')));
		
		// SHIFT + Tab
		/* */
		if(e.keyCode === this.keys.tab && (e.shiftKey || e.keyCode === this.keys.shift) && ($elem.is(':focus') || $elem.find('*').is(':focus'))){
					// Move the focus to the selected Tab
					Logger.logDebug('Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
					var oScope = this;
					//oScope.$tabs.filter('.selected').focus();
					setTimeout(function(){oScope.$tabs.filter('.selected').focus();}, 10);
					return;
				}
		
		
		switch (e.keyCode) {
			case this.keys.tab: {
				if(this.getConfig().accordian){
					var $focusable = $elem.find(':focusable');
					var curNdx = $focusable.index($(e.target));
					var panelNdx = this.$panels.index($elem);
					var numPanels = this.$panels.length;
					
					// SHIFT + Tab
					if (e.shiftKey || this.keys.shift) {
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
									e.stopPropagation();
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
									e.stopPropagation();
									return false;
								}
							}
						}
					}
				}else{
					/*
					var $foucsibleList	= $elem.find(':focusable');
										if($($foucsibleList[$foucsibleList.length-1]).is(':focus')){
											Logger.logDebug('SET Focus to the TAB');
											//this.$tabs.filter('.selected').focus();
											var oScope = this;
											setTimeout(function(){oScope.$tabs.filter('.selected').focus();}, 1);
										}*/
					
					// TODO: SHIFT + TAB doesnot fire in IE9. It focus and selects the last element in the Tab
					// SHIFT + Tab
					/* */
					if(e.shiftKey && $elem.is(':focus')){
						// Move the focus to the selected Tab
						Logger.logDebug('Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
						var oScope = this;
						//oScope.$tabs.filter('.selected').focus();
						setTimeout(function(){oScope.$tabs.filter('.selected').focus();}, 10);
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
				Logger.logDebug('\tPAGE UP');
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
				Logger.logDebug('\tPAGE DOWN');
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
		Logger.logDebug('TabComponent.handlePanelKeyPress() | KEY Code = '+e.keyCode);
				
				Logger.logDebug('\tFocused Element = '+$(document).find('#tabpanel1_tab3').is(':focus')+' : Tab Index = '+$(document).find('#tabpanel1_tab3').attr('tabindex'));
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
	
	TabComponent.prototype.handlePanelFocus					= function($elem, e) {
		//Logger.logDebug('TabComponent.handlePanelFocus() | Tab ID = '+$elem.attr('id'));
		// Add the focus class to the Panel

		$elem.addClass('focus').attr({
			'tabindex' : '-1'
		});
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');
		
		return true;
	};

	TabComponent.prototype.handlePanelBlur					= function($elem, e) {
		//Logger.logDebug('TabComponent.handlePanelBlur() | Tab ID = '+$elem.attr('id'));
		
		/*
		$elem.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		
		
		//.find('.aria-itext-tabpanel').remove();
		
		return true;
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
			'tabindex'			: 0,
			'aria-selected'		: 'true',
		});
		
		this.$component.find('#' + $tab.attr('aria-controls')).fadeIn(this.getConfig().tabShowSpeed, function(e){
			//$(this).find('*:first').attr('tabindex', 0).focus().attr('tabindex', -1);
			//$(this).focus();//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');
			oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
		}).removeClass('hide').attr({
			'aria-hidden'	: 'false',
			'tabindex'		: '0'
			
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

	TabComponent.prototype.destroy							= function() {
		this.$tabs.off();
		this.$panels.off();
		
		this.$tabsContainer	=	null;
		this.$tabs			=	null;
		this.$panels		=	null;
		
		AbstractComponent.prototype.destroy.call(this);
	};
	TabComponent.prototype.toString							= function() {
		return 'framework/component/TabComponent';
	};

	return TabComponent;
});
