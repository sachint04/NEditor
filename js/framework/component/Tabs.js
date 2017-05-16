define([
	'framework/component/AbstractComponent',
	'framework/core/AudioManager',
	'framework/utils/Logger'
], function(AbstractComponent,AudioManager, Logger) {

	function TabComponent() {
		Logger.logDebug('TabComponent.CONSTRUCTOR() | ');
		AbstractComponent.call(this);

		// define the class properties
		// Merging User Config Object with Concrete classes Config Object
		this.$tabsContainer;
		this.$tabs;
		this.$panels;
		this.aVisited = [];

        this.sTabContainerClass;
        this.sTabHeaderClass;
        this.sTabPanelClass;

		return this;
	}

	TabComponent.prototype									= Object.create(AbstractComponent.prototype);
	TabComponent.prototype.constructor						= TabComponent;

	TabComponent.prototype.getComponentConfig				= function() {
		return {
			accordian							: false,
			accordianType						: 'vertical',
			firstSlide							: 1,
			accordianToggle						: true,
			tabShowSpeed						: 500,

			ariaITextTabsExpanded				: 'To navigate the tab controls use the arrow keys. Use the Tab key to move to the tabs content.',
			ariaITextTabsCollapsed				: 'To select the Tab Control use the ENTER key.',
			ariaITextPanelBackButton			: 'Back to Tabs',
			ariaITextPanel						: 'Select <<ariaITextPanelBackButton>> button to move back to the selected Tab control',
			ariaIText							: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Select <<ariaITextPanelBackButton>> button to move back to the selected Tab control.'
		};
	};
	// Initialize any class properties / variables as required
	TabComponent.prototype.init								= function(p_sID, p_oConfig, p_$xmlComponent) {
	    Logger.logDebug('TabComponent.init() | ');
        // Initialize any class properties / variables as required
		this.sTabContainerClass = '.tabs-list';
        this.sTabHeaderClass = '.tis-header';
        this.sTabPanelClass = '.tis-panel';
		// Done for backward compatibility
		// Call to the super calss
		AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties
	TabComponent.prototype.createComponent					= function() {
		Logger.logDebug('TabComponent.createComponent() | ');
		// If runtime Tab and Panel creation is required by the component
		// tabs container.
		this.$tabsContainer		= this.$component.find(this.sTabContainerClass);
		this.$tabsContainer.addClass('clearfix');
		// Array of panel tabs.
		this.$tabs				= this.$tabsContainer.find(this.sTabHeaderClass);
		// Array of panel.
		this.$panels			= this.$component.find(this.sTabPanelClass);
		this.$component.addClass('clearfix');

		if(this.$tabsContainer.length === 0){
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
		Logger.logDebug('TabComponent.addAriaRoles() | ');
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
		}).append(
			'<span class="aria-itext runtime"></span>'
		);
		this.$tabs.children().attr('role', 'presentation');

		this.$panels.each(function(i, elem){
			$(this).attr({
				'id'				: oScope.sComponentID + '_panel' + i,
				'role'				: 'tabpanel',
				'aria-labelledby'	: oScope.sComponentID + '_tab' + i,
				'aria-hidden'		: 'true',
				'tabindex'			: '-1'
			});
		}).append('<span class="aria-itext visually-hidden runtime">'+this.filterData(this.getConfig().ariaITextPanel)+'<button tabindex="0" class="tis-btn back2tab_btn">'+this.getConfig().ariaITextPanelBackButton+'</button></span>');
	};
	TabComponent.prototype.bindHandlers						= function() {
		Logger.logDebug('TabComponent.bindHandlers() | ');
		// Store the this pointer for reference
		var oScope = this;

		//////////////////////////////
		// Bind handlers for the tabs headers
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
			return oScope.handlePanelFocus($(this), e);
		}).on('blur', function(e){
			// bind a indicator slide blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePanelBlur($(this), e);
		});

		this.$panels.find('.back2tab_btn').on('click', function(e){
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleBackToTabClick($(this), e);
		});
	};
	TabComponent.prototype.initialize						= function() {
	    Logger.logDebug('TabComponent.initialize() | ');
		// the selected tab - if one is selected
		var $tab;

		// add aria attributes to the panel container
		this.$component.attr('aria-multiselectable', 'false');

		// hide all the panels
		this.$panels.addClass('hide');

		// Check "firstSlide" value
		if(this.getConfig().firstSlide < 1 || this.getConfig().firstSlide > this.$tabs.length){
			Logger.logError('TabComponent.initialize() | ERROR: Value specified for the "firstSlide" property is out of bounds.');
		}

		// get the selected tab
		$tab = this.$tabs.filter('.selected');

		if ($tab.length === 0) {
			$tab = this.$tabs.eq(this.getConfig().firstSlide-1);
            $tab.trigger('click');
		}

		// show the panel that the selected tab controls and set aria-hidden to false
		this.switchTabs(null, $tab);

		this.dispatchComponentLoadedEvent();
	};

	TabComponent.prototype.switchTabs						= function($curTab, $newTab, e) {
		if($curTab && !this.isEnabled($newTab)){return false;}
		if($curTab){
			//Logger.logDebug('TabComponent.switchTabs() | Curr Tab ID = '+$curTab.attr('id')+' : New Tab ID = '+$newTab.attr('id'));
			// Remove the highlighting from the current tab
			// remove tab from the tab order
			// update the aria attributes
			$curTab.removeClass('selected focus').attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false'
			});
			this.addARIARuntimeIText($curTab);
		}

		// Highlight the new tab
		// Make new tab navigable
		// give the new tab focus
		$newTab.addClass('selected focus').attr({
			'tabindex'			: '0',
			'aria-selected'		: 'true'
		});

		// Hide the current tab panel and set aria-hidden to true
		if($curTab){
			this.$component.find('#' + $curTab.attr('aria-controls')).addClass('hide').attr('aria-hidden', 'true');
		}

		// Dispatch Tab Click Event
		var oEventObject = $.extend({}, e, {
			type		: 'TAB_CLICK',
			target		: this,
			tab			: $newTab
		});
		//this.dispatchEvent('TAB_CLICK', oEventObject);

		// Show the new tab panel and set aria-hidden to false
		this.showTabPanel($newTab);

		this.addARIARuntimeIText($newTab);
		this.setPanelTabIndex($newTab);
		if(this.bInitialized){$newTab.focus();}

	};

	TabComponent.prototype.addARIARuntimeIText				= function(p_$focusedTab){
		//Logger.logDebug('TabComponent.addARIARuntimeIText() | Focused Tab = '+p_$focusedTab.attr('id'));
		var $runtimeARIAText = p_$focusedTab.find('.aria-itext.runtime');

		if(p_$focusedTab.hasClass('selected')){
			$runtimeARIAText.html(this.getConfig().ariaITextTabsExpanded);
		}else{
			$runtimeARIAText.html(this.getConfig().ariaITextTabsCollapsed);
		}
	};

	TabComponent.prototype.setPanelTabIndex					= function($tab){
		//Logger.logDebug('TabComponent.setPanelTabIndex() | ');
		if($tab.hasClass('selected')){
			this.$component.find('#'+$tab.attr('aria-controls')).attr({
				'tabindex' : '0'
			});
		}else{
			this.$component.find('#'+$tab.attr('aria-controls')).attr({
				'tabindex' : '-1'
			});
		}
	};

	TabComponent.prototype.handleTabKeyDown					= function($tab, e) {
		//Logger.logDebug('TabComponent.handleTabKeyDown() | '+$tab.attr('id'));
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.enter:
			case this.keys.space: {
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
					// tab header.
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
		Logger.logDebug('TabComponent.handleTabClick() | Tab ID = '+$tab.attr('id')+' : IS Selected = '+$tab.hasClass('selected'));
		var sID = $tab.attr('id');
		if($tab.hasClass('selected')){ return; }

		var oEventObject = $.extend({}, e, {
			type		: 'TAB_CLICK',
			target		: this,
			tab			: $tab
		});
		this.dispatchEvent('TAB_CLICK', oEventObject);
		if(this.aVisited.indexOf(sID) === -1){
			this.aVisited.push(sID);
		}
		this.switchTabs(this.$tabs.filter('.selected'), $tab, e);
		this.checkCompletionStatus();
		return true;
	};

	TabComponent.prototype.handleTabFocus					= function($tab, e) {
		//Logger.logDebug('Tabs.handleTabFocus() | ID = '+$tab.attr('id')+' :: Is Open = '+$tab.hasClass('open'));
		// Add the focus class to the tab
		$tab.addClass('focus');
		//this.addARIARuntimeIText($tab);
		//this.setPanelTabIndex($tab);
		return true;
	};

	TabComponent.prototype.handleTabBlur					= function($tab, e) {
		$tab.removeClass('focus');
		//this.addARIARuntimeIText($tab);
		//$tab.removeClass('focus').find('.aria-itext.runtime').remove();
		return true;
	};

	TabComponent.prototype.handlePanelKeyDown				= function($elem, e) {
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.tab: {
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
				this.switchTabs($tab, $newTab);

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
				this.switchTabs($tab, $newTab);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}

		return true;
	};

	TabComponent.prototype.handlePanelKeyPress				= function($elem, e) {
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
	TabComponent.prototype.handlePanelFocus					= function($panel, e) {
		//Logger.logDebug('TabComponent.handlePanelFocus() | Tab ID = '+$panel.attr('id'));
		// Add the focus class to the Panel
		/*
		$panel.addClass('focus').attr({
					'tabindex' : '-1'
				});*/
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');

		return true;
	};
	TabComponent.prototype.handlePanelBlur					= function($panel, e) {
		//Logger.logDebug('TabComponent.handlePanelBlur() | Tab ID = '+$panel.attr('id'));
		//$panel.find('.aria-itext.runtime').remove();
		/*
		$panel.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		//.find('.aria-itext-tabpanel').remove();

		return true;
	};
	TabComponent.prototype.showTabPanel						= function($tab, e) {
		//Logger.logDebug('TabComponent.showTabPanel() | ');
		var oScope			= this,
			e				= e || {},
			oEventObject	= $.extend({}, e, {
				type		: 'PANEL_SHOWN',
				target		: this,
				tab			: $tab
			});

		/*
		$tab.attr({
			'tabindex'		: 0
		});*/


		this.$component.find('#' + $tab.attr('aria-controls')).fadeIn(this.getConfig().tabShowSpeed, function(e){
			oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
		}).removeClass('hide').attr({
			'aria-hidden'	: 'false'
		}).scrollTop(0);

		this.$component.find('#' + $tab.attr('aria-controls')+' *').scrollTop(0);
		
		var playAudio = ($tab.data('audio-id'));
		this.setCurrentPanelAudioID(playAudio);
		this.playCurrentAudio();
	};

	TabComponent.prototype.handleBackToTabClick				= function($slidePanel, e){
		//Logger.logDebug('TabComponent.handleBackToTabClick() | ');
		e.preventDefault();
		this.getCurrentSelectedTab().focus();
	};
	TabComponent.prototype.getCurrentSelectedTab			= function(){
		return this.$tabs.filter('.selected');
	};
	
	TabComponent.prototype.checkCompletionStatus					= function() {
		if( this.aVisited.length == this.$tabs.length){
			this.setCompleted();
		}
	};

	TabComponent.prototype.reset							= function() {
		this.$tabs.eq(0).trigger('click');
	};
	TabComponent.prototype.destroy							= function() {
		this.$tabs.off();
		this.$panels.off();

		this.$tabsContainer	= null;
		this.$tabs			= null;
		this.$panels		= null;

        this.prototype      = null;
		AbstractComponent.prototype.destroy.call(this);
	};
	TabComponent.prototype.toString							= function() {
		return 'framework/component/TabComponent';
	};

	return TabComponent;
});
