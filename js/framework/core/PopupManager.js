define([
	'jquery',
	'framework/model/CourseConfigModel',
	'framework/utils/ResourceLoader',
	'framework/viewcontroller/Popup',
	'framework/utils/EventDispatcher',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, CourseConfig, ResourceLoader, Popup, EventDispatcher, Globals, Logger){
	var __instancePopupManager;

	function PopupManager(){
		//Logger.logDebug('PopupManager.CONSTRUCTOR() | ');
		EventDispatcher.call(this);

		this.aGlobalPopups; // ** These Pop-up's will generally reside in the UI
		this.aPopups; // ** Page Level pop-up's
		this.$popupContainer;
		this.oPopupTypes;
		this.aOpenPopups = [];
		this.oPopupsByName;
		this.keys;
	}

	PopupManager.prototype								= Object.create(EventDispatcher.prototype);
	PopupManager.prototype.constructor					= PopupManager;

	PopupManager.prototype.init						= function(){
		Logger.logDebug('PopupManager.init() | ');
		this.aGlobalPopups		= [];
		this.aPopups			= [];
		this.$popupContainer	= $('#'+CourseConfig.getConfig('ui_popups').containerID);
		this.$popupOverlay		= this.$popupContainer.find('.popup-overlay');
		this.oPopupTypes		= {};
		this.aOpenPopups			= [];
		this.oPopupsByName		= {};
		// Define values for keycodes
		this.keys = {
			tab		: 9,
			enter	: 13,
			esc		: 27,
			space	: 32
		};

		this.attachEvents();
		this.loadPopupFile();
	};

	PopupManager.prototype.attachEvents				= function(){
		var oScope	= this;
		this.$popupOverlay.on('click', function(e){
			oScope.closeAll();
		});
	};

	PopupManager.prototype.loadPopupFile			= function(){
		//Logger.logDebug('PopupManager.loadPopupFile() | '+this+' : '+CourseConfig.getRootPath());
		var sViewPopupsPath = CourseConfig.getRootPath() + CourseConfig.getConfig('ui_popups').view;
		var oResourceLoader = new ResourceLoader();
		oResourceLoader.loadResource([sViewPopupsPath], this, this.onPopupFileLoaded);
	};

	PopupManager.prototype.onPopupFileLoaded		= function(p_oContext, p_aFiles, p_oResourceLoader){
		//Logger.logDebug('PopupManager.onPopupFileLoaded() | '+p_aFiles[0]);
		var $domPopups	= $(p_aFiles[0]),
			aPopups		= CourseConfig.getConfig('popup'),
			i;
		for (var i=0; i < aPopups.length; i++) {
			var item					= aPopups[i],
				sPopupID				= item.popupID,
				sPopupType				= item.type,
				nDepth					= Number(item.depth),
				sScript					= item.script || null,
                sDataFileName		= item.data || null,
				bIsModal				= (item.isModal == 'true') ? true : false,
				bEscapeKeyEnabled		= (item.escapeKeyEnabled == 'true') ? true : false,
				aButtonIDList			= item.buttonIDList.split(' ').join(''),
				aButtonIDList			= (aButtonIDList.length > 0) ? aButtonIDList.split(',') : [],
				$domPopup				= $domPopups.find('#'+sPopupID).clone();

			if(sScript){
				//Logger.logDebug('PopupManager.onPopupFileLoaded() | '+$domPopup.length+' : Script = '+sScript);
				var sJSFilePath = CourseConfig.getConfig('ui_popups').scriptLocation + sScript;
                this.loadPopupScript($domPopup, sPopupID, sPopupType, nDepth, bEscapeKeyEnabled, bIsModal, aButtonIDList, sJSFilePath, sDataFileName);
			}else{
				this.addPopup($domPopup, sPopupID, sPopupType, nDepth, bEscapeKeyEnabled, bIsModal, aButtonIDList);
			}
		};

		p_oResourceLoader.destroy();
		p_oResourceLoader = null;
		//console.dir(aPopups);
	};

    PopupManager.prototype.addPopup = function(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList, p_oPopupView, p_sDataFileName) {
		Logger.logDebug('PopupManager.addPopup() | Name = '+p_sID+' : Type = '+p_sType+' : Escape = '+p_bEscapeKeyEnabled+' : Modal = '+p_bIsModal+' : Buttons = '+p_aButtonIDList+' : Script View = '+p_oPopupView+' : Data File Name = '+p_sDataFileName);
		var oPopup = (p_oPopupView) ? new p_oPopupView() : new Popup();
        oPopup.init(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList, p_sDataFileName);
		//(p_isGlobal) ? this.aGlobalPopups.push(oPopup) : this.aPopups.push(oPopup);
		if(!this.oPopupTypes.hasOwnProperty(p_sType)){
			this.$popupContainer.prepend('<div id="'+p_sType+'" class="popup-container"></div>');
			this.oPopupTypes[p_sType] = [p_sID];
		}else{
			this.oPopupTypes[p_sType].push(p_sID);
		}
		this.oPopupsByName[p_sID] = oPopup;
		//return oPopup;
	};

    PopupManager.prototype.loadPopupScript = function(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList, p_sJSFilePath, p_sDataFileName) {
		var oScope		= this;
		require([
			p_sJSFilePath
		], function(oPopupView){
            oScope.addPopup(p_$domPopup, p_sID, p_sType, p_nDepth, p_bEscapeKeyEnabled, p_bIsModal, p_aButtonIDList, oPopupView, p_sDataFileName);
		});
	};

	PopupManager.prototype.openPopup				= function(p_sID, p_oData, p_$ElemnToReturnFocusTo, p_sClass){
		//Logger.logDebug('PopupManager.openPopup() | \n\tPopup ID = '+p_sID+' : HAS PROPERTY = '+this.oPopupsByName.hasOwnProperty(p_sID));
		if(this.oPopupsByName.hasOwnProperty(p_sID)){
			//Logger.logDebug('\tInside :: ');
			var oScope				= this,
				oPopup				= this.oPopupsByName[p_sID],
				$popup				= oPopup.show(p_oData, p_sClass),
				$popupTypeContainer	= Globals.getElementByID(this.$popupContainer, oPopup.getType(), 'PopupManager.openPopup()'),
				nDepth				= oPopup.getDepth();
			//Logger.logDebug('\tPopup Container ID = '+$popupTypeContainer.attr('id')+' : Popup ID = '+$popup.attr('id'));

			oPopup.setElemToReturnFocus(p_$ElemnToReturnFocusTo);
            //Logger.logDebug(p_sID +' is Modal '+ oPopup.isModal()+ ' | nDepth = '+ nDepth);
			if(oPopup.isModal()){
				this.showOverlay(p_sID, oPopup.getType(), $popupTypeContainer, nDepth);
			}
			//if(p_sClass){$popup.addClass(p_sClass);}
            if (nDepth) {
                $popup.css('z-index', nDepth);
            }
			//$popup.attr({'role'		: 'alert'});
			$popup.attr({'role'		: 'dialog'});
			//$popupTypeContainer.prepend($popup.hide()).focus();
			$popupTypeContainer.prepend($popup).focus();
            this.$popupContainer.addClass('popup-show');
            $popupTypeContainer.addClass('popup-show');
			this.setInitialFocusModal($popup);
			//oPopup.setPopupPosition();
			this.aOpenPopups.push(p_sID);
			//set Popup btn states
            //$('#popup_container .modal-body').find('.tis-btn').removeClass('inactive').removeAttr('aria-disabled');
            this.$popupContainer.find('.tis-popup').find('.tis-btn').removeClass('inactive').removeAttr('aria-disabled');
			return oPopup;
		}
		Logger.logError('PopupManager.openPopup() | ERROR: No popup with name "'+p_sID+'" found.');
	};

	PopupManager.prototype.closePopup				= function(p_sID){
		//Logger.logDebug('PopupManager.closePopup() | Popup ID = '+p_sID+' : HAS PROPERTY = '+this.oPopupsByName.hasOwnProperty(p_sID));
        if (!this.isOpen(p_sID)) {
            return false;
        }
		if(this.oPopupsByName.hasOwnProperty(p_sID)){
			var oPopup				= this.oPopupsByName[p_sID],
				$popupTypeContainer	= Globals.getElementByID(this.$popupContainer, oPopup.getType(), 'PopupManager.closePopup()'),
				$popup				= Globals.getElementByID($popupTypeContainer, p_sID, 'PopupManager.closePopup()'),
				nDepth				= oPopup.getDepth();
				

            if (oPopup.isModal()) {
                this.hideOverlay(p_sID, oPopup.getType(), $popupTypeContainer, nDepth);
            }
			var sRemovedStr = this.aOpenPopups.splice(this.aOpenPopups.indexOf(p_sID), 1);
			//Logger.logDebug('PopupManager.closePopup() | Open Popups = '+this.aOpenPopups.length+' : Removed = '+sRemovedStr);
			oPopup.hide();
			$popup.remove();
			var otherPopups =   this.isOpen(null,oPopup.getType(), '0');
               if(!otherPopups){
               	
	                this.$popupContainer.removeClass('popup-show');
	                $popupTypeContainer.removeClass('popup-show');
               }
			return true;
		}
		Logger.logWarn('PopupManager.closePopup() | Warning: No popup with name "'+p_sID+'" found.');
		return false;
	};

	PopupManager.prototype.closeAll					= function(p_sType){
		//Logger.logDebug('PopupManager.closeAll() | Open popups length = '+this.aOpenPopups.length);
		var i,
			sPopupID,
			oPopup,
			nPopupCloseCount = 0;

		if(p_sType){
			for(i=0; i<this.aOpenPopups.length; i++){
				sPopupID	= this.aOpenPopups[i];
				oPopup		= this.oPopupsByName[sPopupID];
				//Logger.logDebug('PopupManager.closeAll() | '+sPopupID+' : '+p_sType);

				if(oPopup.getType() === p_sType){
					this.closePopup(sPopupID);
					nPopupCloseCount++;
					i--;
				}
			}
		}else{
			for(i=0; i<this.aOpenPopups.length; i++){
				sPopupID	= this.aOpenPopups[i];
				this.closePopup(sPopupID);
				nPopupCloseCount++;
			}
		}

		return nPopupCloseCount;
		//this.aOpenPopups	= [];
	};

	PopupManager.prototype.isOpen					= function(p_sPopupID, p_sType, p_aExclue){
		var bExists;
		if(p_sPopupID){
			bExists = (this.aOpenPopups.indexOf(p_sPopupID) != -1) ? true : false;
		}else{
			for (var i=0; i < this.aOpenPopups.length; i++) {
			   var oPopup 		= this.oPopupsByName[this.aOpenPopups[i]];
			   var sID 			= oPopup.getID();
			   var sType		= oPopup.getType();
			   if( sType === p_sType && p_aExclue.indexOf(sID) == -1){
					bExists = true;
					break;   	
			   }
			};			
		}
		return bExists;
	};

	PopupManager.prototype.showOverlay				= function(p_sPopupID, p_sType, p_$popupTypeContainer, p_nDepth){
		//Logger.logDebug('PopupManager.showOverlay() | Type Container = '+p_$popupTypeContainer.length+' : Type = '+p_sType);
		/*var oScope			= this,
			$overlay	= p_$popupTypeContainer.find('.popup-overlay'),
			bOverlayExists	= ($overlay.length == 0) ? false : true;

		if(p_nDepth && !bOverlayExists){
			$overlay	= $('<div></div>').addClass('popup-overlay').css('z-index', p_nDepth);
			p_$popupTypeContainer.append($overlay);
			$overlay.on('click', function(e){
				oScope.closeAll(p_sType);
			});
		}else if(p_nDepth && bOverlayExists){
			$overlay.css('z-index', p_nDepth);
		}else{
			if(this.$popupOverlay.hasClass('hide')){this.$popupOverlay.removeClass('hide');}
			this.$popupOverlay.fadeIn('fast');
		}*/
		var oScope			= this,
			$overlay	= p_$popupTypeContainer.find('.popup-overlay');

		if(p_nDepth){
			$overlay	= $('<div></div>').attr('id', p_sPopupID+'_overlay').addClass('popup-overlay').css('z-index', p_nDepth-1);
			p_$popupTypeContainer.append($overlay);
            		$overlay.on('click touchend', function(e) {
				var oPopup		= oScope.oPopupsByName[p_sPopupID];
				if(oPopup.isEscapeKeyEnabled()){
					oScope.closePopup(p_sPopupID);
				}
			});
		}else{
            if (this.$popupOverlay.hasClass('hide')) {
                this.$popupOverlay.removeClass('hide');
            }
			this.$popupOverlay.fadeIn('fast');
		}
		$(document).on('keydown', function(e){
			oScope.handleKeyPressEvent(e);
		});
		this.enableAllButtons(false);
	};

	PopupManager.prototype.hideOverlay				= function(p_sPopupID, p_sType, p_$popupTypeContainer, p_nDepth){
		//Logger.logDebug('PopupManager.hideOverlay() | Type Container = '+p_$popupTypeContainer.length+' : Type = '+p_sType);
		/*var $overlay	= p_$popupTypeContainer.find('.popup-overlay'),
			bOverlayExists	= ($overlay.length == 0) ? false : true;

		if(p_nDepth && bOverlayExists){
			$overlay.remove();
		}else{
			this.$popupOverlay.fadeOut('fast', function(){
				var $this	= $(this);
				if(!$this.hasClass('hide')){$this.addClass('hide');}
			});
		}*/
		var $overlay	= p_$popupTypeContainer.find('#'+p_sPopupID+'_overlay');
		if(p_nDepth){
			$overlay.remove();
		}else{
			this.$popupOverlay.fadeOut('fast', function(){
				var $this	= $(this);
                if (!$this.hasClass('hide')) {
                    $this.addClass('hide');
                }
			});
		}
		$(document).off('keydown');
		this.enableAllButtons(true);
	};

	PopupManager.prototype.enableAllButtons			= function(p_bEnable){
		if(p_bEnable) {
            $(document).find('.tis-btn.inactive').removeClass('inactive').removeAttr('aria-disabled');
			$('#content_wrapper').removeAttr('aria-hidden');
		}else{
            $(document).find('.tis-btn').not('.disabled').addClass('inactive').attr('aria-disabled', 'true');
			$('#content_wrapper').attr('aria-hidden', 'true');
		}
	};

	PopupManager.prototype.handleKeyPressEvent		= function(e){
		var oScope				= this,
			sPopupID			= this.aOpenPopups[this.aOpenPopups.length-1],
			oPopup				= this.oPopupsByName[sPopupID],
			aBtnList			= oPopup.getButtonList(),
			nFocusIndex			= oPopup.getFocUsIndex(),
			$popupTypeContainer	= Globals.getElementByID(this.$popupContainer, oPopup.getType(), 'PopupManager.handleKeyPressEvent()'),
			$popup				= Globals.getElementByID($popupTypeContainer, sPopupID, 'PopupManager.handleKeyPressEvent()'),
			sBtnID;
		//Logger.logDebug('PopupManager.handleKeyPressEvent() | Key Code  = '+e.keyCode+' : nFocusIndex = '+nFocusIndex);

		if(e.keyCode == this.keys.tab){
			e.preventDefault();
			e.stopPropagation();
			// Consume the tab event and do nothing
			if(e.shiftKey){
				// ** SHIFT + TAB
				(nFocusIndex == 0) ? oPopup.setFocusIndex(aBtnList.length-1) : oPopup.setFocusIndex(nFocusIndex-1);
			}else{
				// ** TAB
				(nFocusIndex == (aBtnList.length-1)) ? oPopup.setFocusIndex(0) : oPopup.setFocusIndex(nFocusIndex+1);
			}
			sBtnID	= oPopup.getButtonList()[oPopup.getFocUsIndex()];
			$popup.find('#'+sBtnID).focus();
			return false;
		}else if(e.keyCode == this.keys.esc){
			// ** ESC
			e.stopPropagation();
			if(oPopup.isEscapeKeyEnabled()){
				this.closePopup(this.aOpenPopups[this.aOpenPopups.length-1]);
			}
  			return false;
		}
	};

	/*PopupManager.prototype.trapTabKey				= function(obj,evt){
		var focusableElementsString ="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

		// if tab or shift-tab pressed
		if ( evt.which == 9 ) {
			// get list of all children elements in given object
			var o = obj.find('*');

			// get list of focusable items
			var focusableItems;
			focusableItems = o.filter(focusableElementsString).filter(':visible');

			// get currently focused item
			var focusedItem;
			focusedItem = jQuery(':focus');

			// get the number of focusable items
			var numberOfFocusableItems;
			numberOfFocusableItems = focusableItems.length;

			// get the index of the currently focused item
			var focusedItemIndex;
			focusedItemIndex = focusableItems.index(focusedItem);

			if (evt.shiftKey) {
				//back tab
				// if focused on first item and user preses back-tab, go to the last focusable item
				if(focusedItemIndex==0){
					focusableItems.get(numberOfFocusableItems-1).focus();
					evt.preventDefault();
				}
			} else {
				//forward tab
				// if focused on the last item and user preses tab, go to the first focusable item
				if(focusedItemIndex==numberOfFocusableItems-1){
					focusableItems.get(0).focus();
					evt.preventDefault();
				}
			}
		}

	};*/

	PopupManager.prototype.setInitialFocusModal		= function(p_$popup){
		var oPopup		= this.oPopupsByName[p_$popup.attr('id')],
			aBtnList	= oPopup.getButtonList();

		//p_$popup.focus();
		//p_$popup.find('#'+aBtnList[0]).focus();
		oPopup.setFocusIndex(0);

		/*var focusableElementsString ="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
		// get list of all children elements in given object
		var o = p_$popup.find('*');

		// set focus to first focusable item
		var focusableItems;
		focusableItems = o.filter(focusableElementsString).filter(':visible').first().focus();*/
	};

	PopupManager.prototype.toString					= function(){
		return 'framework/core/PopupManager';
	};

	if(!__instancePopupManager){
		__instancePopupManager = new PopupManager();
		//Logger.logDebug('^^^^^^^^^^^^ Popup MANAGER INSTANCE ^^^^^^^^^^^^^^ '+__instancePopupManager);
	}

	return __instancePopupManager;
});
