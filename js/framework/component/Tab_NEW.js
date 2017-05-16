define([
	'framework/component/AbstractComponent',
	'framework/utils/Logger'
], function(AbstractComponent, Logger){
	
	function Carousel(p_sID, p_oConfig) {
		//Logger.logDebug('Carousel.CONSTRUCTOR() | '+p_sID);
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

	Carousel.prototype									= Object.create(AbstractComponent.prototype);
	Carousel.prototype.constructor						= Carousel;

	Carousel.prototype.getComponentConfig				= function() {
		return {
			firstSlide				: 1,
			tabShowSpeed			: 500,
			tabsContainerClass		: 'tablist',
			tabClass				: 'tab',
			tabPanelClass			: 'panel',
			ariaIText				: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Use SHIFT TAB key to move back to the selected TAB.'
		};
	};
	// Initialize any class properties / variables as required
	Carousel.prototype.initialize						= function() {
		this.oAnimateProps	= {
			open	: {},
			close	: {}
		};
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties
	Carousel.prototype.createComponent					= function() {
		//Logger.logDebug('Carousel.createComponent() | IS Accordian = '+(this.getConfig().accordian));
		// If runtime Tab and Panel creation is required by the component
		// tabs container.
		this.$tabsContainer		= this.$component.find('> .' + this.getConfig().tabsContainerClass);
		// Array of tabs.
		this.$tabs				= this.$component.find('> .' + this.getConfig().tabsContainerClass + ' > .' + this.getConfig().tabClass);
		// Array of panel.
		this.$panels			= this.$component.find('> .' + this.getConfig().tabPanelClass);

		if(this.$tabsContainer.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: The parent element containing the tab items need to have class "tablist".');
		}
		if(this.$tabs.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: 0 Elements were declared with a "tab" class');
		}
		if(this.$panels.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: 0 Elements were declared with a "panel" class');
		}
		if(this.$tabs.length !== this.$panels.length){
			Logger.logError('Carousel.createComponent() | ERROR: Number of Tabs dont match with the number of Tab Panels');
		}

		// Call to the super calss
		AbstractComponent.prototype.createComponent.call(this);
	};
	Carousel.prototype.addAriaRoles						= function() {
	    var oScope = this;
	    // Set up ARIA i-text
		this.$component.prepend('<span class="aria-itext" tabindex="-1">'+this.getConfig().ariaIText+'</span>');
		
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
		});
	};
	Carousel.prototype.bindHandlers						= function() {
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
	Carousel.prototype.init								= function() {
		// the selected tab - if one is selected
		var $tab;

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
			Logger.logError('Carousel.initialize() | ERROR: Value specified for the "firstSlide" property is out of bounds.');
		}

		// get the selected tab
		$tab = this.$tabs.filter('.selected');

		if ($tab.length === 0) {
			$tab = this.$tabs.eq(this.getConfig().firstSlide-1);
		}

		// show the panel that the selected tab controls and set aria-hidden to false
		this.switchTabs(null, $tab, {});
	};
	
	Carousel.prototype.switchTabs						= function($curTab, $newTab, e) {
		Logger.logDebug('TabComponent.switchTabs() | KEY Code = '+e.keyCode);
		if(!this.isEnabled($newTab)){return false;}
		if($curTab){
			Logger.logDebug('Carousel.switchTabs() | Curr Tab ID = '+$curTab.attr('id')+' : New Tab ID = '+$newTab.attr('id'));
			// Remove the highlighting from the current tab
			// remove tab from the tab order
			// update the aria attributes
			$curTab.removeClass('selected focus').attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false',
			});
		}
		
		// If this is a tab panel, swap displayed tabs
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
		
		// Highlight the new tab
		// Make new tab navigable
		// give the new tab focus
		$newTab.addClass('selected focus').attr({
			'tabindex'			: '0',
			'aria-selected'		: 'true',
		}).focus();
	};
	Carousel.prototype.handleTabKeyDown					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabKeyDown() | ');
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.enter:
			case this.keys.space: {
				this.handleTabClick($tab, e);

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
					//Logger.logDebug('CNTRL + UP');
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
					//Logger.logDebug('\tLEFT or UP');
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
				//Logger.logDebug('\tRIGHT or DOWN');
				this.switchTabs($tab, $newTab, e);

				e.stopPropagation();
				return false;
			}
			case this.keys.home: {

				// switch to the first tab
				//Logger.logDebug('\tHOME');
				this.switchTabs($tab, this.$tabs.first(), e);

				e.stopPropagation();
				return false;
			}
			case this.keys.end: {

				// switch to the last tab
				//Logger.logDebug('\tEND');
				this.switchTabs($tab, this.$tabs.last(), e);

				e.stopPropagation();
				return false;
			}
		}
	};

	Carousel.prototype.handleTabKeyPress				= function($tab, e) {
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

	Carousel.prototype.handleTabClick					= function($tab, e) {
		Logger.logDebug('Carousel.handleTabClick() | Tab ID = '+$tab.attr('id')+' : IS Selected = '+$tab.hasClass('selected'));
		if($tab.hasClass('selected')){ return; }
		
		var oEventObject = $.extend({}, e, {
			type		: 'TAB_CLICK',
			target		: this,
			tab			: $tab
		});
		this.dispatchEvent('TAB_CLICK', oEventObject);
		
		//Logger.logDebug('\tTab Click | KEY Code = '+e.shiftKey+' : Tab ID = '+$tab.attr('id')+' : Tab Index = '+$tab.attr('tabindex')+' : Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
		if(e.shiftKey && $tab.attr('tabindex') === '-1'){
			//Logger.logDebug('\tSHIFT Tab Fix');
			// Fix for IE: Probably shift tab has been triggered
			this.$tabs.filter('.selected').focus();
			return false;
		}
		
		var $selectedTab = this.$tabs.filter('.selected');
		if($selectedTab.length > 0){
			//Logger.logDebug('\tIF Tab Click');
			this.switchTabs($selectedTab, $tab, e);
		}else{
			//Logger.logDebug('\tELSE Tab Click');
			this.switchTabs(null, $tab, e);
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

	Carousel.prototype.handleTabFocus					= function($tab, e) {
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

	Carousel.prototype.handleTabBlur					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabBlur() | KEY Code = '+e.keyCode);
		/*$tab.removeClass('focus').find('.aria-itext-tab').remove();
		return true;*/
	};

	Carousel.prototype.handlePanelKeyDown				= function($elem, e) {
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
		
		/*if(e.keyCode === this.keys.tab && (e.shiftKey || e.keyCode === this.keys.shift) && ($elem.is(':focus') || $elem.find('*').is(':focus'))){
					// Move the focus to the selected Tab
					Logger.logDebug('Selected Tab ID = '+this.$tabs.filter('.selected').attr('id'));
					var oScope = this;
					//oScope.$tabs.filter('.selected').focus();
					setTimeout(function(){oScope.$tabs.filter('.selected').focus();}, 10);
					return;
				} */
		
		
		switch (e.keyCode) {
			case this.keys.tab: {
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

	Carousel.prototype.handlePanelKeyPress				= function($elem, e) {
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
	
	Carousel.prototype.handlePanelFocus					= function($elem, e) {
		//Logger.logDebug('TabComponent.handlePanelFocus() | Tab ID = '+$elem.attr('id'));
		// Add the focus class to the Panel

		/*
		$elem.addClass('focus').attr({
					'tabindex' : '-1'
				});*/
		
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');
		
		return true;
	};

	Carousel.prototype.handlePanelBlur					= function($elem, e) {
		//Logger.logDebug('TabComponent.handlePanelBlur() | Tab ID = '+$elem.attr('id'));
		
		/*
		$elem.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		
		
		//.find('.aria-itext-tabpanel').remove();
		
		return true;
	};
	Carousel.prototype.showTabPanel						= function($tab, e) {
		Logger.logDebug('Carousel.showTabPanel() | ');
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

	Carousel.prototype.destroy							= function() {
		this.$tabs.off();
		this.$panels.off();

		this.$tabsContainer	=	null;
		this.$tabs			=	null;
		this.$panels		=	null;

		AbstractComponent.prototype.destroy.call(this);
	};
	Carousel.prototype.toString							= function() {
		return 'framework/component/Carousel';
	};

	return Carousel;
});
