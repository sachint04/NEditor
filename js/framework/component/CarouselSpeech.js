define([
	'framework/component/AbstractComponent',
	'framework/utils/Logger'
], function(AbstractComponent, Logger){

	function CarouselSpeech() {
		//Logger.logDebug('CarouselSpeech.CONSTRUCTOR() | ');
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

		this.oAnimateProps;
		this.bAnimating;

		this.$atteptedSlideId;
		this.$currentSlideId;

		this.currentCaption = 0;
		this.currentItem;
		return this;
	}

	CarouselSpeech.prototype										= Object.create(AbstractComponent.prototype);
	CarouselSpeech.prototype.constructor							= CarouselSpeech;

	CarouselSpeech.prototype.getComponentConfig						= function() {
		return {
			firstSlide					: 1,
			wrap						: true,
			cycle						: true,
			showCarouselSpeechIndicators		: true,
			showCarouselSpeechPagination		: true,
			paginationStyle				: 'XX of YY',

			animationStyle				: 'slide',
			animationSpeed				: 500,

			indicatorsContainerClass	: 'indicators',
			indicatorClass				: 'indicator',
			prevClass					: 'previous_btn',
			paginationContainerClass	: 'pagination-container',
			paginationAccessible		: false,
			nextClass					: 'continue_btn',
			slidesContainerClass		: 'slides',
			slideClass					: 'slide',
			slideItem					: 'item',
			ariaITextIndicators			: 'To navigate the tab controls use the arrow keys. Use the Tab key to move to the tabs content.',
			ariaITextSlideBackButton	: 'Back to Tabs',
			ariaITextSlide				: 'Select <<ariaITextSlideBackButton>> button to move back to the selected Tab control',
			ariaIText					: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Select Back to Tabs button to Move back to the selected Tab control.'
		};
		//ariaIText					: 'To navigate the following tab controls use the arrow keys. After selecting a tab, use the Tab key to move to the controlled element. Use SHIFT TAB key to move back to the selected TAB.'
	};
	// Initialize any class properties / variables as required
	CarouselSpeech.prototype.init									= function(p_sID, p_oConfig, p_$xmlComponent) {
		this.$currentSlideId = 0;
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

		this.dispatchEvent("COMPONENT_LOADED", {target:this, type:'COMPONENT_LOADED', GUID:this.sGUID});
	};
	// Create Runtime assets / set pointers to DOM objects. Populate required class Properties
	CarouselSpeech.prototype.createComponent						= function() {
		Logger.logDebug('CarouselSpeech.createComponent() | '+this.getConfig());
		this.$prevBtn = this.$component.find('#' + this.getConfig().prevClass);
		this.$nextBtn = this.$component.find('#' + this.getConfig().nextClass);
		this.$slidePanels = this.$component.find('.' + this.getConfig().slideItem);

		Logger.logDebug('CarouselSpeech.createComponent() | '+this.$prevBtn);
		// Call to the super calss
		AbstractComponent.prototype.createComponent.call(this);
	};
	CarouselSpeech.prototype.addAriaRoles							= function() {
		Logger.logDebug('CarouselSpeech.addAriaRoles() | ');
	    var oScope = this;

	};
	CarouselSpeech.prototype.initialize								= function() {
		//Logger.logDebug('CarouselSpeech.initialize() | ');
		// the selected indicator - if one is selected
		var $indicator;
		this.dispatchComponentLoadedEvent();
	};

	CarouselSpeech.prototype.bindHandlers							= function() {
		Logger.logDebug('CarouselSpeech.bindHandlers() | ');
		// Store the this pointer for reference
		var oScope = this;

		this.$prevBtn.on('click', function(e){
			Logger.logDebug("* $prevBtn * ");
			if(!$(this).hasClass('inactive') && !$(this).hasClass('disabled')){
				//oScope.updateSpeechContent();
				oScope.handleEvents($(this), e);
			}

		});

		this.$nextBtn.on('click', function(e){
			// bind a Next click handler
			Logger.logDebug("* $nextBtn * ");
			//if(!oScope.isEnabled($(this))){e.preventDefault(); e.stopPropagation(); return false;}
			if(!$(this).hasClass('inactive') && !$(this).hasClass('disabled')){

				oScope.handleEvents($(this), e);
			}
		});

	};

	CarouselSpeech.prototype.getSpeechContent						= function() {
		Logger.logDebug('CarouselSpeech.updateSpeechContent() | this.$currentSlideId: '+this.$currentSlideId);
	};

	CarouselSpeech.prototype.handleEvents 							= function($targetRefence, e){

		//pagecontainer_cw01_cw01_pg24
		var _targetID = $($targetRefence).attr("id");
		var _direction = "";
		Logger.logDebug('CarouselSpeech.handleEvents() | '+_targetID);
		switch(_targetID) {
		   case "continue_btn":
		       //this.$currentSlideId++;
		       _direction = "next";
		       break;
		   case "previous_btn":
		       //this.$currentSlideId--;
		       _direction = "prev";
		       break;
		   default:
		       //default code block
		};

		/* update Speech State */
		this.updateCarouselSpeechState(_direction);

		//this.$slidePanels
	};

	CarouselSpeech.prototype.updateCarouselSpeechState				= function(_direction){
		var oScope = this;
		var prevSlide = this.getConfig().slideItem+this.$currentSlideId;
		var prevCaption = this.currentCaption;
		var prevItemID = this.$currentSlideId;
		var isItemChanged = false;
		var itemsCount=this.$slidePanels.length;


		if(_direction == "prev"){
			 if(this.currentCaption == 0){
			 	this.currentCaption = 1;
			 	this.$currentSlideId--;
			 	isItemChanged = true;
			 }else {
			 	this.currentCaption = 0;
			 }
		}else{
			if(this.$currentSlideId == 0){}
			if(this.currentCaption == 0 || this.currentCaption == -1){
			 	this.currentCaption++;
			 }else{
			 	this.currentCaption = 0;
			 	this.$currentSlideId++;
			 	isItemChanged = true;
			 }
		}

		var currentSlide = this.getConfig().slideItem+this.$currentSlideId;

		if(isItemChanged){
			//
			//Logger.logDebug(' Show ID : '+"item-"+oScope.$currentSlideId);
			$(this.$slidePanels).each(function(i, elem){

				if($(this).attr("id") == String("item-"+prevItemID)){
					Logger.logDebug(' Remove ID : '+$(this).attr("id"));
					$(this).addClass("hide");
					$(this).removeClass("active");

				};
				Logger.logDebug(' this | this : '+String($(this).attr("id")));
				Logger.logDebug(' currentSlide | $currentSlideId : '+String("item-"+oScope.$currentSlideId));

				if($(this).attr("id") == String("item-"+oScope.$currentSlideId)){
					Logger.logDebug(' Show ID : '+$(this).attr("id"));
					$(this).removeClass("hide");
					$(this).addClass("active");
					oScope.currentItem = $(this);
				};
			});


		}
		$(oScope.currentItem).find("#caption-"+prevCaption).addClass("hide");
		$(oScope.currentItem).find("#caption-"+oScope.currentCaption).removeClass("hide");

		/* */
		//if(!$(this).hasClass('inactive') && !$(this).hasClass('disabled')){
		if(oScope.$currentSlideId > 0){
			this.$prevBtn.removeClass('inactive');
			this.$prevBtn.removeClass('disabled');
		}else{
			this.$prevBtn.addClass('inactive');
			this.$prevBtn.addClass('disabled');
		}

		if(oScope.$currentSlideId < (itemsCount-1)){
			this.$nextBtn.removeClass('inactive');
			this.$nextBtn.removeClass('disabled');
		}else{
			this.$nextBtn.addClass('inactive');
			this.$nextBtn.addClass('disabled');
		}

		/* */
	};

	CarouselSpeech.prototype.destroy								= function() {
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

		this.prototype						= null;

		AbstractComponent.prototype.destroy.call(this);
	};
	CarouselSpeech.prototype.toString								= function() {
		return 'framework/component/CarouselSpeech';
	};

	return CarouselSpeech;
});
