define([
	'framework/component/AbstractComponent',
    'framework/core/AudioManager',
	'framework/utils/Logger'
], function(AbstractComponent, AudioManager, Logger){

	function Carousel() {
		//Logger.logDebug('Carousel.CONSTRUCTOR() | ');
		AbstractComponent.call(this);

		// define the class properties
		// Merging User Config Object with Concrete classes Config Object
		this.$indicatorContainer;
		this.$indicators;
		this.$slidePanels;
		this.$prevBtn;
		this.$pagination;
		this.$nextBtn;
		this.sDirection;
		this.aVisited = [];

		this.oAnimateProps;
		this.bAnimating;

		return this;
	}

	Carousel.prototype										= Object.create(AbstractComponent.prototype);
	Carousel.prototype.constructor							= Carousel;

	Carousel.prototype.getComponentConfig					= function() {
		return {
			firstSlide					: 1,
			wrap						: true,
			cycle						: true,
			showCarouselIndicators		: false,
			showCarouselPagination		: true,
			paginationStyle				: 'XX of YY',

			animationStyle				: 'slide',
			animationSpeed				: 500,

			indicatorsContainerClass	: 'indicators',
			indicatorClass				: 'indicator',
			prevClass					: 'prev-btn',
			paginationContainerClass	: 'pagination-container',
			paginationAccessible		: false,
			nextClass					: 'next-btn',
			slidesContainerClass		: 'slides',
			slideClass					: 'slide',

			ariaITextIndicators			: 'To navigate the tab controls use the arrow keys. Use the Tab key to move to the tabs content.',
			ariaITextSlideBackButton	: 'Back to Tabs',
			ariaITextSlide				: 'Select <<ariaITextSlideBackButton>> button to move back to the selected Tab control',
			ariaIText					: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Select <<ariaITextSlideBackButton>> button to move back to the selected Tab control.'
		};
		//ariaIText					: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Use SHIFT TAB key to move back to the selected TAB.'
	};
	// Initialize any class properties / variables as required
	Carousel.prototype.init									= function(p_sID, p_oConfig, p_$xmlComponent) {

		this.oAnimateProps	= {
			open	: {},
			close	: {}
		};

		// Done for backward compatibility
		// Call to the super calss
		if(p_sID && p_oConfig){
			Logger.logDebug('AbstractComponent.prototype.init p_sID: '+p_sID + " p_oConfig: "+p_oConfig);
			AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);

		}
		this.dispatchComponentLoadedEvent();
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties
	Carousel.prototype.createComponent						= function() {
		Logger.logDebug('Carousel.createComponent() | '+this.getConfig());
		// If runtime Tab and Panel creation is required by the component
		// Carousel Items container.
		this.$indicatorContainer			= this.$component.find('.' + this.getConfig().indicatorsContainerClass);
		Logger.logDebug('Carousel.createComponent() this.$indicatorContainer | '+this.$indicatorContainer);
		// Array of Carousel Items.
		this.$indicators					= this.$indicatorContainer.find(' > .' + this.getConfig().indicatorClass);
		Logger.logDebug('Carousel.createComponent() this.$indicators | '+this.$indicators);
		// Previous Button.
		this.$prevBtn						= this.$component.find('.' + this.getConfig().prevClass);
		// Previous Button.
		var $paginationContainer			= this.$component.find('.' + this.getConfig().paginationContainerClass).append('');
		this.$pagination					= $paginationContainer.find('.pagination');
		// Next Button.
		this.$nextBtn						= this.$component.find('.' + this.getConfig().nextClass);
		// Hide text in the Next & Prev Icons
		this.$prevBtn.find('.icon.prev').addClass('text-hide');
		this.$nextBtn.find('.icon.next').addClass('text-hide');
		// Array of slides.
		var $slidePanelContainer			= this.$component.find('.' + this.getConfig().slidesContainerClass);
		this.$slidePanels					= $slidePanelContainer.find('.' + this.getConfig().slideClass);
		$slidePanelContainer.removeClass(this.getConfig().slidesContainerClass).addClass('slide-mask');

		if(this.$indicatorContainer.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: The parent element containing the carousel items need to have class "'+this.getConfig().indicatorsContainerClass+'".');
		}
		if(this.$indicators.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: 0 Elements were declared with a "'+this.getConfig().indicatorClass+'" class');
		}
		if(this.$slidePanels.length === 0){
			Logger.logError('Carousel.createComponent() | ERROR: 0 Elements were declared with a "'+this.getConfig().slideClass+'" class');
		}
		if(this.$indicators.length !== this.$slidePanels.length){
			Logger.logError('Carousel.createComponent() | ERROR: Number of Carousel Items dont match with the number of Carousel Panels');
		}

		// Show / Hide Carousel Indicators dependng on the Config
		// TODO: Make this configurable. The text in the indicators should be hidden / shown depending on a parameter in the config
		this.$indicators.addClass('text-hide');
		(this.getConfig().showCarouselIndicators) ? this.$indicatorContainer.removeClass('visually-hidden') : this.$indicatorContainer.addClass('visually-hidden');

		// Show / Hide Carousel Pagination dependng on the Config
		(this.getConfig().showCarouselPagination) ? this.$pagination.parent().removeClass('hide') : this.$pagination.parent().addClass('hide');

		if(this.getConfig().animationStyle === 'slide'){
			var nPanelMaskWidth			= $slidePanelContainer.outerWidth();
			this.$slidePanels.wrapAll('<div class="'+this.getConfig().slidesContainerClass+'"></div>');
			$slidePanelContainer			= $slidePanelContainer.find('.'+this.getConfig().slidesContainerClass);

			/*$slidePanelContainer.width(
				nPanelMaskWidth * this.$slidePanels.length
			).css(
				'position', 'relative'
			).append('<div class="clearfix"></div>');*/
			$slidePanelContainer.css({
				'position'	: 'relative',
				'height'	: '100%'
			}).append('<div class="clearfix"></div>');

			this.$slidePanels.css({
				'float'		: 'left',
				'position'	: 'absolute',
				/*'width'		: nPanelMaskWidth+'px',*/
				'width'		: '100%',
				'height'	: '100%'
			});
		}

		// Call to the super calss
		AbstractComponent.prototype.createComponent.call(this);
	};
	Carousel.prototype.addAriaRoles							= function() {
		//Logger.logDebug('Carousel.addAriaRoles() | ');
	    var oScope = this;
	    // Set up ARIA i-text
		this.$component.prepend('<span class="aria-itext runtime" tabindex="-1">'+this.filterData(this.getConfig().ariaIText)+'</span>');

		this.$indicatorContainer.attr({
			role		:'tablist'
		});

		this.$indicators.each(function(i, elem){
			$(this).attr({
				'id'				: oScope.sComponentID + '_indicator' + i,
				'role'				: 'tab',
				'aria-selected'		: 'false',
				'aria-controls'		: oScope.sComponentID + '_slide' + i,
				'tabindex'			: '-1'
			});
		}).find('> span').addClass('text-hide');

		this.$slidePanels.each(function(i, elem){
			$(this).attr({
				'id'				: oScope.sComponentID + '_slide' + i,
				'role'				: 'tabpanel',
				'aria-labelledby'	: oScope.sComponentID + '_indicator' + i,
				'aria-hidden'		: 'true'
			});
		}).append('<span class="aria-itext visually-hidden runtime">'+this.filterData(this.getConfig().ariaITextSlide)+'<button tabindex="0" class="tis-btn back2tab_btn">'+this.getConfig().ariaITextSlideBackButton+'</button></span>');
		
		this.$slidePanels.find('.slide-inner').attr('tabindex', '-1');

		// If Pagination is not accessible then hide it from the screen reader
		if(!this.getConfig().paginationAccessible){
			this.$pagination.parent().attr({
				'aria-hidden'		: 'true'
			});
		}
	};
	Carousel.prototype.bindHandlers							= function() {
		//Logger.logDebug('Carousel.bindHandlers() | ');
		// Store the this pointer for reference
		var oScope = this;

		//////////////////////////////
		// Bind handlers for the Carousel Items
		this.$indicators.on('keydown', function(e) {
			// bind a indicator keydown handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleIndicatorKeyDown($(this), e);
		}).on('keypress', function(e){
			// bind a indicator keypress handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleIndicatorKeyPress($(this), e);
		}).on('click', function(e){
			// bind a indicator click handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleIndicatorClick($(this), e);
		}).on('focus', function(e){
			// bind a indicator focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleIndicatorFocus($(this), e);
		}).on('blur', function(e){
			// bind a indicator blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleIndicatorBlur($(this), e);
		});

		//////////////////////////////
		// Bind handlers for the Previous / Next buttons
		this.$prevBtn.on('click', function(e){
			// bind a Previous click handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handlePreviousClick($(this), e);
		});
		this.$nextBtn.on('click', function(e){
			// bind a Next click handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleNextClick($(this), e);
		});

		/////////////////////////////
		// Bind handlers for the slides
		this.$slidePanels.on('keydown', function(e) {
			// bind a keydown handlers for the slide focusable elements
			return oScope.handleSlidePanelKeyDown($(this), e);
		}).on('keypress', function(e) {
			// bind a keypress handler for the slide
			return oScope.handleSlidePanelKeyPress($(this), e);
		}).on('focus', function(e){
			// bind a indicator slide focus handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleSlidePanelFocus($(this), e);
		}).on('blur', function(e){
			// bind a indicator slide blur handler
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleSlidePanelBlur($(this), e);
		});
		
		this.$slidePanels.find('.back2tab_btn').on('click', function(e){
			if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			return oScope.handleBackToTabClick($(this), e);
		});
	};
	Carousel.prototype.initialize							= function() {
		//Logger.logDebug('Carousel.initialize() | ');
		// the selected indicator - if one is selected
		var $indicator;

		// hide all the slides
		this.$slidePanels.addClass('hide');

		// All Tab Panels are hidden and first Tab is set to achieve Tab focus
		if(this.getConfig().firstSlide == -1){
			$indicator = this.$indicators.eq(0);
			$indicator.attr({
				'tabindex'			: '0'
			});
			return;
		}

		// Check "firstSlide" value
		if(this.getConfig().firstSlide < 1 || this.getConfig().firstSlide > this.$indicators.length){
			Logger.logError('Carousel.initialize() | ERROR: Value specified for the "firstSlide" property is out of bounds.');
		}

		// get the selected indicator
		$indicator = this.$indicators.filter('.selected');

		if ($indicator.length === 0) {
			$indicator = this.$indicators.eq(this.getConfig().firstSlide-1);
		}

		if(this.getConfig().animationStyle === 'slide'){this.setStylesForSlideAnimtaion();}

		// show the slide that the selected tab controls and set aria-hidden to false
		this.switchIndicators(null, $indicator, {});
	};

	Carousel.prototype.setStylesForSlideAnimtaion			= function(){
		//Logger.logDebug('Carousel.setStylesForSlideAnimtaion() | ');
		/*
		this.$slidePanels.removeClass('hide');
				this.$slidePanels.css({
					'display'	: 'none'
				});*/

	};

	Carousel.prototype.handlePreviousClick					= function($prevBtn, e){
		e.preventDefault();
		var $currItem	= this.getCurrentCarouselIndicator(),
			$newItem	= this.getPreviousCarouselIndicator($currItem);
		//Logger.logDebug('Carousel.handlePreviousClick() | Wrap = '+this.getConfig().wrap+' : Has Prev = '+this.hasPrevious($newItem));

		this.sDirection	= 'BACKWARD';
		this.switchIndicators($currItem, $newItem, e);
	};
	Carousel.prototype.handleNextClick						= function($nextBtn, e){
		e.preventDefault();
		var $currItem	= this.getCurrentCarouselIndicator(),
			$newItem	= this.getNextCarouselIndicator($currItem);
		//Logger.logDebug('Carousel.handleNextClick() | Wrap = '+this.getConfig().wrap+' : Has Next = '+this.hasNext($newItem));

		this.sDirection	= 'FORWARD';
		this.switchIndicators($currItem, $newItem, e);
	};
	Carousel.prototype.updateNavStates						= function($newItem){
		if(this.hasNext($newItem)){
			this.$nextBtn.removeClass('disabled').attr({
				'aria-disabled'	: false
			});
		}else{
			this.$nextBtn.addClass('disabled').attr({
				'aria-disabled'	: true
			});
		}
		if(this.hasPrevious($newItem)){
			this.$prevBtn.removeClass('disabled').attr({
				'aria-disabled'	: false
			});
		}else{
			this.$prevBtn.addClass('disabled').attr({
				'aria-disabled'	: true
			});
		}
	};
	Carousel.prototype.updatePagination						= function($newItem){
		var curSlide		= this.$indicators.index($newItem) + 1,
			totSlides		= this.$indicators.length,
			paginationTxt	= this.getConfig().paginationStyle.replace(/XX/, curSlide),
			paginationTxt	= paginationTxt.replace(/YY/, totSlides);

		this.$pagination.html(paginationTxt);
	};

	Carousel.prototype.getCurrentCarouselIndicator			= function(){
		return this.$indicators.filter('.selected');
	};
	Carousel.prototype.getPreviousCarouselIndicator			= function($currItem){
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
	Carousel.prototype.getNextCarouselIndicator				= function($currItem){
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
	
	Carousel.prototype.checkComplitionState 			= function(p_sPanelID){
		if(!this.isComplete() && this.aVisited.length == this.$indicators.length){
			this.setCompleted();
		}
	};
	
	Carousel.prototype.getIndicatorList				= function(){
		var result = [];
		this.$indicators.each(function(){
			result.push($(this).attr('id'));
		});
		return result;
	};
	
	Carousel.prototype.hasNext								= function($item){
		var $nextItem	= this.getNextCarouselIndicator($item);
		//Logger.logDebug('Carousel.hasNext() | Next Item = '+$nextItem);
		if($nextItem === undefined || $nextItem === null){return false;}
		return true;
	};
	Carousel.prototype.hasPrevious							= function($item){
		var $prevItem	= this.getPreviousCarouselIndicator($item);
		//Logger.logDebug('Carousel.hasPrevious() | Prev Item = '+$prevItem);
		if($prevItem === undefined || $prevItem === null){return false;}
		return true;
	};

	Carousel.prototype.switchIndicators						= function($curIndicator, $newIndicator, e) {
		//Logger.logDebug('Carousel.switchIndicators() | KEY Code = '+e.keyCode);
		if($curIndicator && !this.isEnabled($newIndicator) || this.bAnimating){return false;}
		if($curIndicator){
			//Logger.logDebug('Carousel.switchIndicators() | Curr Tab ID = '+$curIndicator.attr('id')+' : New Tab ID = '+$newIndicator.attr('id'));
			// Remove the highlighting from the current indicator
			// remove indicator from the tab order
			// update the aria attributes
			$curIndicator.removeClass('selected focus').attr({
				'tabindex'			: '-1',
				'aria-selected'		: 'false'
			}).find('.aria-itext.runtime').remove();
		}

		// If this is a indicator slide, swap displayed indicators
		// hide the current indicator slide and set aria-hidden to true
		/*
		if($curIndicator){
					this.$component.find('#' + $curIndicator.attr('aria-controls')).addClass('hide').attr('aria-hidden', 'true');
				}*/


		// Dispatch Tab Click Event
		var oEventObject = $.extend({}, e, {
			type		: 'INDICATOR_CLICK',
			target		: this,
			indicator			: $newIndicator
		});
		this.dispatchEvent('INDICATOR_CLICK', oEventObject);

		// Highlight the new indicator
		// Make new indicator navigable
		// give the new indicator focus
		$newIndicator.addClass('selected focus').attr({
			'tabindex'			: '0',
			'aria-selected'		: 'true',
		}).focus();
		
		// show the new indicator slide and set aria-hidden to false
		this.showSlidePanel($curIndicator, $newIndicator);
		this.addToVisited($newIndicator.attr('id'));
		if(!this.bComplete){this.checkCompletionStatus();};
		if(!this.getConfig().wrap){this.updateNavStates($newIndicator);}
		if(this.getConfig().showCarouselPagination){this.updatePagination($newIndicator);}
		var playAudio = ($newIndicator.data('audio-id'));
		this.setCurrentPanelAudioID(playAudio);
		this.playCurrentAudio();	
	};
	Carousel.prototype.showSlidePanel						= function($curIndicator, $newIndicator, e) {
		//Logger.logDebug('Carousel.showSlidePanel() | '+this.getConfig().animationStyle.toUpperCase());
		var oScope			= this,
			$currSlidePanel	= ($curIndicator) ? this.$component.find('#' + $curIndicator.attr('aria-controls')) : null,
			$newSlidePanel	= this.$component.find('#' + $newIndicator.attr('aria-controls')),
			e				= e || {},
			oEventObject	= $.extend({}, e, {
				type		: 'SLIDE',
				target		: this,
				indicator			: $newIndicator
			});

		switch(this.getConfig().animationStyle.toUpperCase()){
			case 'FADE': {
				this.fade($currSlidePanel, $newSlidePanel);
				break;
			}
			default: {
				this.slide($currSlidePanel, $newSlidePanel);
			}
		}
	};

	Carousel.prototype.slide								= function($currSlidePanel, $newSlidePanel){
		//Logger.logDebug('Carousel.slide() | '+this.getCurrentCarouselIndicator().attr('id')+' : FORWARD = '+(this.sDirection	=== 'FORWARD'));
		var oScope					= this,
			$curIndicator			= this.getCurrentCarouselIndicator(),
			currIndex				= this.$indicators.index($curIndicator),
			left					= $newSlidePanel.outerWidth() * currIndex,
			currentPanelIndex		= this.$slidePanels.index($currSlidePanel),
			newPanelIndex			= this.$slidePanels.index($newSlidePanel);
		//Logger.logDebug('currIndex = '+currIndex+' Left = '+left+' : x = '+$newSlidePanel.css('left'));

		$newSlidePanel.attr({
			'aria-hidden'	: 'false',
			'tabindex'		: '0'
		}).css({
			'position'		: 'absolute'
		}).removeClass('hide');

		if($currSlidePanel){
			$currSlidePanel.attr({
				'aria-hidden'	: 'true',
				'tabindex'		: '-1'
			}).css({
				'position'		: 'absolute',
				'left'			: '0'
			});
		}

		if(this.sDirection === 'FORWARD'){
			this.bAnimating = true;
			// Forward
			$newSlidePanel.css({
				'left'			: '100%'
			}).animate({
				'left' : '0'
			}, this.getConfig().animationSpeed, function(e){
				$(this).css({
					'position'	: 'relative'
				});
				oScope.bAnimating = false;
				// Shift focus to the Slide Content if the Indicators are hidden, else the focus by default shifts to the Indicators
				//if(!oScope.getConfig().showCarouselIndicators){$(this).focus();}
			}).find('*').scrollTop(0);

			$currSlidePanel.animate({
				'left' : '-100%'
			}, this.getConfig().animationSpeed, function(e){
				$(this).addClass('hide').css({
					'position'	: 'relative'
				});
			});
		}else if(this.sDirection === 'BACKWARD'){
			// Back
			this.bAnimating = true;

			$newSlidePanel.css({
				'left'			: '-100%'
			}).animate({
				'left' : '0'
			}, this.getConfig().animationSpeed, function(e){
				$(this).css({
					'position'	: 'relative'
				});
				oScope.bAnimating = false;
				// Shift focus to the Slide Content if the Indicators are hidden, else the focus by default shifts to the Indicators
				//if(!oScope.getConfig().showCarouselIndicators){$(this).focus();}
			}).find('*').scrollTop(0);

			$currSlidePanel.animate({
				'left' : '100%'
			}, this.getConfig().animationSpeed, function(e){
				$(this).addClass('hide').css({
					'position'	: 'relative'
				});
			});
		}

		/*
		$newSlidePanel.css({
					'visibility'	: 'visible'
				}).attr({
					'aria-hidden'	: 'false',
					'tabindex'		: '0'
				}).find('*').scrollTop(0);

				$newSlidePanel.parent().animate({
					'left'			: -left,
				}, function(e){
					if($currSlidePanel){
						$currSlidePanel.css({
							'visibility'	: 'hidden'
						}).attr({
							'aria-hidden'	: 'true',
							'tabindex'		: '-1'
						});
						$currSlidePanel = $currSlidePanel.detach();
						$newSlidePanel.parent().find('div.clearfix').remove();
						$newSlidePanel.parent().append($currSlidePanel, '<div class="clearfix"></div>').css({
							'left':0
						});

					}
				});*/

	};
	Carousel.prototype.fade									= function($currSlidePanel, $newSlidePanel){
		Logger.logDebug('Carousel.fade() | '+this.getCurrentCarouselIndicator().attr('id'));
		var oScope = this;
		if($currSlidePanel){$currSlidePanel.addClass('hide').attr('aria-hidden', 'true');}
		$newSlidePanel.fadeIn(this.getConfig().animationSpeed, function(e){
			//$(this).find('*:first').attr('tabindex', 0).focus().attr('tabindex', -1);
			//$(this).focus();//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');
			//oScope.dispatchEvent('PANEL_SHOWN', oEventObject);
		}).removeClass('hide').attr({
			'aria-hidden'	: 'false',
			'tabindex'		: '0'
		}).find('*').scrollTop(0);
	};

	Carousel.prototype.handleIndicatorKeyDown				= function($indicator, e) {
		//Logger.logDebug('Carousel.handleIndicatorKeyDown() | ');
		if (e.altKey) {
			// do nothing
			return true;
		}

		switch (e.keyCode) {
			case this.keys.enter:
			case this.keys.space: {
				this.handleIndicatorClick($indicator, e);
				return true;
			}
			case this.keys.left:
			case this.keys.up: {
				var oScope = this;
				var $prevTab;
				// holds jQuery object of indicator from previous pass
				var $newIndicator;
				// the new indicator to switch to

				if (e.ctrlKey) {
					//Logger.logDebug('CNTRL + UP');
					// Ctrl+arrow moves focus from slide content to the open
					// indicator header.
					//this.$indicators.filter('.selected').focus();
				} else {
					//Logger.logDebug('\tLEFT or UP');
					// the new indicator to switch to
					var $newIndicator	= this.getPreviousCarouselIndicator($indicator);
					if($newIndicator !== undefined && $newIndicator !== null){
						this.sDirection	= 'BACKWARD';
						// switch to the new indicator
						this.switchIndicators($indicator, $newIndicator, e);
					}
				}

				e.stopPropagation();
				return false;
			}
			case this.keys.right:
			case this.keys.down: {
				// set to true when current indicator found in array
				//Logger.logDebug('\tRIGHT or DOWN');
				// the new indicator to switch to
				var $newIndicator	= this.getNextCarouselIndicator($indicator);
				if($newIndicator !== undefined && $newIndicator !== null){
					this.sDirection	= 'FORWARD';
					// switch to the new indicator
					this.switchIndicators($indicator, $newIndicator, e);
				}

				e.stopPropagation();
				return false;
			}
			case this.keys.home: {
				//Logger.logDebug('\tHOME');
				this.sDirection	= 'BACKWARD';
				// switch to the first indicator
				this.switchIndicators($indicator, this.$indicators.first(), e);

				e.stopPropagation();
				return false;
			}
			case this.keys.end: {
				//Logger.logDebug('\tEND');
				this.sDirection	= 'FORWARD';
				// switch to the last indicator
				this.switchIndicators($indicator, this.$indicators.last(), e);

				e.stopPropagation();
				return false;
			}
		}
	};
	Carousel.prototype.handleIndicatorKeyPress				= function($indicator, e) {
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

				// The indicator keypress handler must consume pageup and pagedown
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
	Carousel.prototype.handleIndicatorClick					= function($indicator, e) {
		Logger.logDebug('Carousel.handleIndicatorClick() | Tab ID = '+$indicator.attr('id')+' : IS Selected = '+$indicator.hasClass('selected'));
		e.preventDefault();
		if($indicator.hasClass('selected')){ return; }

		var oEventObject = $.extend({}, e, {
			type		: 'TAB_CLICK',
			target		: this,
			indicator			: $indicator
		});
		this.dispatchEvent('TAB_CLICK', oEventObject);

		//Logger.logDebug('\tTab Click | KEY Code = '+e.shiftKey+' : Tab ID = '+$indicator.attr('id')+' : Tab Index = '+$indicator.attr('tabindex')+' : Selected Tab ID = '+this.$indicators.filter('.selected').attr('id'));
		if(e.shiftKey && $indicator.attr('tabindex') === '-1'){
			//Logger.logDebug('\tSHIFT Tab Fix');
			// Fix for IE: Probably shift tab has been triggered
			this.$indicators.filter('.selected').focus();
			return false;
		}

		var $selectedTab = this.getCurrentCarouselIndicator();
		if($selectedTab.length > 0){
			var currentPanelIndex	= this.$indicators.index($selectedTab),
				newPanelIndex		= this.$indicators.index($indicator);
			Logger.logDebug('\tIF Tab Click | '+$selectedTab.attr('id')+' : '+(currentPanelIndex)+' : '+(newPanelIndex));
			this.sDirection	= (currentPanelIndex < newPanelIndex) ? 'FORWARD' : 'BACKWARD';
			this.switchIndicators($selectedTab, $indicator, e);
		}else{
			Logger.logDebug('\tELSE Tab Click | '+$selectedTab.attr('id'));
			this.switchIndicators(null, $indicator, e);
		}

		// Remove the highlighting from all indicators
		//this.$indicators.removeClass('selected');

		// hide all indicator slides
		//this.$slidePanels.addClass('hide');

		// Highlight the clicked indicator
		//$indicator.addClass('selected');
		/*
		var oEventObject = $.extend({}, e, {
					type		: 'TAB_CLICK',
					target		: this,
					indicator			: $indicator
				});
				this.dispatchEvent('TAB_CLICK', oEventObject);*/

		// show the clicked indicator slide
		//this.showSlidePanel($indicator, e);

		// give the indicator focus
		//$indicator.focus();

		return true;
	};
	Carousel.prototype.handleIndicatorFocus					= function($indicator, e) {
		//Logger.logDebug('Carousel.handleIndicatorFocus() | Tab ID = '+$indicator.attr('id')+' : Tab Has Selected = '+$indicator.hasClass('selected'));
		// Add the focus class to the indicator
		$indicator.addClass('focus');
		if($indicator.hasClass('selected')){
			$indicator.append(
				'<span class="aria-itext runtime">tab selected</span><span class="aria-itext runtime">'+this.getConfig().ariaITextIndicators+'</span>'
			);
			
			this.$component.find('#'+$indicator.attr('aria-controls')).attr({
				'tabindex' : '0'
			});
		}
		return true;
	};
	Carousel.prototype.handleIndicatorBlur					= function($indicator, e) {
		//Logger.logDebug('Carousel.handleIndicatorBlur() | KEY Code = '+e.keyCode);
		$indicator.removeClass('focus').find('.aria-itext.runtime').remove();
		return true;
	};

	Carousel.prototype.handleSlidePanelKeyDown				= function($elem, e) {
		Logger.logDebug('Carousel.handleSlidePanelKeyDown() | KEY Code = '+e.keyCode);
		if (e.altKey) {
			// do nothing
			return true;
		}

		Logger.logDebug('\tFocused Element = '+$(document).find('#tabpanel1_indicator3').is(':focus')+' : Tab Index = '+$(document).find('#tabpanel1_indicator3').attr('tabindex'));
		Logger.logDebug('\tTAB KEY down = '+(e.keyCode === this.keys.tab));
		Logger.logDebug('\tUP KEY down = '+(e.keyCode === this.keys.up));
		Logger.logDebug('\tCNTRL KEY down = '+(e.ctrlKey || e.keyCode === this.keys.cntrl));
		Logger.logDebug('\tSHIFT KEY down = '+(e.shiftKey || e.keyCode === this.keys.shift));
		Logger.logDebug('\tPanel Focus = '+($elem.is(':focus'))+' || '+($elem.find('*').is(':focus')));

		// SHIFT + Tab

		/*if(e.keyCode === this.keys.tab && (e.shiftKey || e.keyCode === this.keys.shift) && ($elem.is(':focus') || $elem.find('*').is(':focus'))){
					// Move the focus to the selected Tab
					Logger.logDebug('Selected Tab ID = '+this.$indicators.filter('.selected').attr('id'));
					var oScope = this;
					//oScope.$indicators.filter('.selected').focus();
					setTimeout(function(){oScope.$indicators.filter('.selected').focus();}, 10);
					return;
				} */


		switch (e.keyCode) {
			case this.keys.tab: {
				/*
				var $foucsibleList	= $elem.find(':focusable');
									if($($foucsibleList[$foucsibleList.length-1]).is(':focus')){
										Logger.logDebug('SET Focus to the TAB');
										//this.$indicators.filter('.selected').focus();
										var oScope = this;
										setTimeout(function(){oScope.$indicators.filter('.selected').focus();}, 1);
									}*/

				// TODO: SHIFT + TAB doesnot fire in IE9. It focus and selects the last element in the Tab
				// SHIFT + Tab
				/* */
				if(e.shiftKey && $elem.is(':focus')){
					// Move the focus to the selected Tab
					Logger.logDebug('Selected Tab ID = '+this.$indicators.filter('.selected').attr('id'));
					var oScope = this;
					//oScope.$indicators.filter('.selected').focus();
					//setTimeout(function(){oScope.$indicators.filter('.selected').focus();}, 10);
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

				// get the jQuery object of the indicator
				var $indicator = $('#' + $elem.attr('aria-labelledby'));

				// Move focus to the indicator
				$indicator.focus();

				e.stopPropagation();
				return false;
			}
			case this.keys.pageup: {
				var $newIndicator;

				if (!e.ctrlKey) {
					// do not process
					return true;
				}

				// get the jQuery object of the indicator
				var $indicator = this.$indicators.filter('.selected');

				// get the index of the indicator in the indicator list
				var curNdx = this.$indicators.index($indicator);

				if (curNdx == 0) {
					// this is the first indicator, set focus on the last one
					$newIndicator = this.$indicators.last();
				} else {
					// set focus on the previous indicator
					$newIndicator = this.$indicators.eq(curNdx - 1);
				}

				this.sDirection	= 'BACKWARD';
				// switch to the new indicator
				//Logger.logDebug('\tPAGE UP');
				this.switchIndicators($indicator, $newIndicator, e);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
			case this.keys.pagedown: {

				var $newIndicator;

				if (!e.ctrlKey) {
					// do not process
					return true;
				}

				// get the jQuery object of the indicator
				var $indicator = $('#' + $elem.attr('aria-labelledby'));

				// get the index of the indicator in the indicator list
				var curNdx = this.$indicators.index($indicator);

				if (curNdx == this.$indicators.last().index()) {
					// this is the last indicator, set focus on the first one
					$newIndicator = this.$indicators.first();
				} else {
					// set focus on the next indicator
					$newIndicator = this.$indicators.eq(curNdx + 1);
				}

				this.sDirection	= 'FORWARD';
				// switch to the new indicator
				//Logger.logDebug('\tPAGE DOWN');
				this.switchIndicators($indicator, $newIndicator, e);

				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		}

		return true;
	};
	Carousel.prototype.handleSlidePanelKeyPress				= function($elem, e) {
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
	Carousel.prototype.handleSlidePanelFocus				= function($slidePanel, e) {
		//Logger.logDebug('Carousel.handleSlidePanelFocus() | Tab ID = '+$slidePanel.attr('id'));
		// Add the focus class to the Panel
		/*
		$slidePanel.addClass('focus').attr({
					'tabindex' : '-1'
				});*/
		//.append('<span class="text-hide aria-itext-tabpanel">Use SHIFT TAB to move back to the selected TAB.</span>');

		return true;
	};
	Carousel.prototype.handleSlidePanelBlur					= function($slidePanel, e) {
		//Logger.logDebug('Carousel.handleSlidePanelBlur() | Tab ID = '+$slidePanel.attr('id'));
		//$slidePanel.find('.aria-itext.runtime').remove();
		/*
		$slidePanel.removeClass('focus').attr({
					'tabindex' : '0'
				});*/
		//.find('.aria-itext-tabpanel').remove();

		return true;
	};
	Carousel.prototype.handleBackToTabClick					= function($slidePanel, e){
		//Logger.logDebug('Carousel.handleBackToTabClick() | ');
		e.preventDefault();
		this.getCurrentCarouselIndicator().focus();
	};

	Carousel.prototype.destroy								= function() {
		this.$indicators.off();
		this.$slidePanels.off();

		this.$indicatorContainer			= null;
		this.$indicators					= null;
		this.$slidePanels					= null;
		this.$prevBtn						= null;
		this.$pagination					= null;
		this.$nextBtn						= null;

		this.bAnimating						= null;
		this.oAnimateProps					= null;

		AbstractComponent.prototype.destroy.call(this);
	};
	Carousel.prototype.toString								= function() {
		return 'framework/component/Carousel';
	};

	return Carousel;
});
