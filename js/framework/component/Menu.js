define([
	'jquery',
    'framework/component/AbstractComponent',
	'framework/utils/EventDispatcher',
	'framework/controller/CourseController',
	'framework/model/CourseModel',
	'framework/utils/globals',
	'framework/utils/Logger'
], function($, AbstractComponent, EventDispatcher, CourseController, CourseModel, Globals, Logger) {

    function MenuComponent() {
		//Logger.logDebug('MenuComponent.CONSTRUCTOR() | ');
        AbstractComponent.call(this);

		// key code definitions
		this.keys	= {
			tab		: 9,
			enter	: 13,
			esc		: 27,
			space	: 32,
			left	: 37,
			up		: 38,
			right	: 39,
			down	: 40
		};

		return this;
	}

    MenuComponent.prototype								= Object.create(AbstractComponent.prototype);
	MenuComponent.prototype.constructor					= MenuComponent;

	MenuComponent.prototype.getComponentConfig			= function () {
		return{
			excludeList			: [],
			cwCollapseable		: false,
			navigateOnCWClick	: true,
			onlyModules			: false
        };

    };
    MenuComponent.prototype.init						= function(p_sID, p_oConfig, p_$xmlComponent) {
    	p_oConfig.excludeList = p_oConfig.excludeList.split(' ').join('').split(',');
        //Logger.logDebug('MenuComponent.init() | '+JSON.stringify(p_oConfig));
    	AbstractComponent.prototype.init.call(this, p_sID, p_oConfig, p_$xmlComponent);
    };
	MenuComponent.prototype.createComponent				= function(){
		//Logger.logDebug('MenuComponent.createComponent()  | navigateOnCWClick = '+(typeof this.oConfig.navigateOnCWClick)+' : cwCollapseable = '+(typeof this.oConfig.cwCollapseable)+' : onlyModules = '+(typeof this.oConfig.onlyModules));
		var oScope = this,
			aPageModels				= (!this.oConfig.onlyModules) ? CourseController.getAllPageModels() : CourseController.getChildPages("cw01~cw01"),
			$menuItem				= Globals.getElementByClassName(this.$component, 'menu-item', 'MenuComponent.CONSTRUCTOR() | '),

			nItemCount = 0,
			bGenerateMenu = false,
			$rootCWWrapperPointer	= $('<div id="root_CW_wrapper"></div>'),
			$rootCWPointer,
			$menuCWPointer,
			$newMenuItem,
			aFoldersList			= [],
			oPageModel,
			sParentCWGUID,
			_sParentCWGUID,
			_sGrandParentCWGUID,
			oCWModel,
			sCWLabel,
			sCWHierarchy,
			sPageLabel,
			sPageGUID,
			i;

		if ($menuItem.length === 1) {bGenerateMenu = true;}
		// ** If the Menu is to be generated, empty the UL List container
		if(bGenerateMenu){this.$component.empty();}

		for (i = 0; i < aPageModels.length; i++) {
			oPageModel			= aPageModels[i];
			sParentCWGUID		= oPageModel.getParentCWGUID();
			_sParentCWGUID		= sParentCWGUID.split('~').join('_');
			oCWModel			= CourseController.findCW(sParentCWGUID);
			sCWLabel			= oCWModel.getCWLabel();
			sCWHierarchy		= oCWModel.getHierarchyLevel();
			sPageLabel			= oPageModel.getPageLabel();
			sPageGUID			= oPageModel.getGUID();
			nTabIndex			= nItemCount;

			if(i === 0){
				if(bGenerateMenu){
					// ** Root CW so create a DOM UL element in the memory
					$rootCWPointer			= this.$component.clone();
					// ** Wrap the Root CW in a wrapper, so its easy to find the respective CW's
					$rootCWWrapperPointer.append($rootCWPointer);
					// ** Get a reference to the DOM UL where the LI element is going to get appended
					$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
				}else{
					$rootCWWrapperPointer 	= this.$component.wrap($rootCWWrapperPointer);
					$rootCWPointer			= this.$component;
				}

				$rootCWPointer.attr({
					'id'		: _sParentCWGUID,
					'tabindex'	: '-1'
				}).addClass(sCWHierarchy);
			}
			//Logger.logDebug('\tParent CWGUID = '+ sParentCWGUID +' : CW Label = '+ sCWLabel +' : Page Label = '+sPageLabel);

			// ** Leave the Menu Item that exists in the Exclude List of the Config & Continue with the next
			if (this.isInExcludeList(sPageGUID)) {
				//Logger.logDebug('\t\t::Exclude::');
				continue;
			}
			// ** Clone the LI element ||OR|| Point the LI element
			$newMenuItem = (bGenerateMenu) ? $menuItem.clone() : $($menuItem[nItemCount]);
			// ** Add ARIA attributes to the new LI element
			this.addARIAAttributesForPage($newMenuItem, -1);

			// ** The LI's (page's) containing UL (CW / Folder) doesnot exist in the DOM, hence create it
			//Logger.logDebug('\t\tnItemCount = '+nItemCount+' : I = '+i+' : _sParentCWGUID length = '+this.$component.find('#'+_sParentCWGUID).length);
			if(aFoldersList.indexOf(_sParentCWGUID) < 0 && !this.isInExcludeList(sParentCWGUID)){
			//if($rootCWWrapperPointer.find('#'+_sParentCWGUID).length === 0 && !this.isInExcludeList(sParentCWGUID)){
				//Logger.logDebug('\t\t\tCreate Folder');
				this.addARIAAttributesForFolder($newMenuItem, -1);

				// ** Make the new LI a container (folder) for the sub-menu UL element
				//commented by cd//
				//$newMenuItem.addClass('tis-btn folder submenu-in').attr({
				//commented by cd//
				$newMenuItem.addClass('tis-btn submenu-in').attr({
					/*'id'			: sPageGUID.split('~').join('_'),*/
					'id'			: 'foldercontainer_'+_sParentCWGUID.split('~').join('_'),
					'aria-owns'		: _sParentCWGUID,
					'data-jumpid'	: sPageGUID
				}).find('> .text').attr({
					/*'tabindex'	: '-1'*/
				}).html(sCWLabel);

				// ** Disable the LI container (folder) if its not functional
				if(!this.oConfig.navigateOnCWClick && !this.oConfig.cwCollapseable){
					//commented by cd//
					//$newMenuItem.addClass('disabled');
					//commented by cd//
				}

				if(bGenerateMenu){
					$newMenuItem.append('<ul id="'+_sParentCWGUID+'" tabindex="-1" role="group" class="'+sCWHierarchy+'"></ul>');
                    var len = _sParentCWGUID.lastIndexOf('_'),
                        len = (len === -1) ? sParentCWGUID.length : len;
					//_sGrandParentCWGUID = _sParentCWGUID.substring(0, len);
					_sGrandParentCWGUID = _sParentCWGUID.substring(0, _sParentCWGUID.lastIndexOf('_'));
					//Logger.logDebug('\t\t\tGrand Parent CW GUID = '+_sGrandParentCWGUID);
					// ** Change the $menuCWPointer pointer to point to the correct parent
					$menuCWPointer = (_sGrandParentCWGUID !== "") ? $rootCWWrapperPointer.find('#'+_sGrandParentCWGUID) : $rootCWWrapperPointer;
					// ** Append the new LI container (folder) to the correct Parent
					$menuCWPointer.append($newMenuItem);
					// ** Change the $menuCWPointer pointer to point to the currently created UL container
					$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
				}else{
					// ** Make the new LI a container (folder) for the sub-menu UL element
					$newMenuItem.find('> ul').attr({
						'id'		: _sParentCWGUID,
						'tabindex'	: '-1',
						'role'		: 'group'
					}).addClass(sCWHierarchy);
				}

				aFoldersList.push(_sParentCWGUID);
				
				if(CourseController.getCWStatus(_sParentCWGUID.split('_').join('~')) == 1) {
					$newMenuItem.find('.icon').removeClass("notVisited");
					$newMenuItem.find('.icon').addClass("started");
				} else if (CourseController.getCWStatus(_sParentCWGUID.split('_').join('~')) == 2) {
					$newMenuItem.find('.icon').removeClass("notVisited");
					$newMenuItem.find('.icon').removeClass("started");
					$newMenuItem.find('.icon').addClass("visited");
				}
				
				
				
				// ** Created a UL folder container within an LI for this submenu, so repeat the loop for creating the Page LI
				i--;
				nItemCount++;
				continue;
			}else if(aFoldersList.indexOf(_sParentCWGUID) > -1){
			    $menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
			}
			// ** Populate data for the menu page LI
			//Logger.logDebug('\t\t\t\tCreate Page');
			//commented by cd//
			/*$newMenuItem.addClass('tis-btn page').attr({
				'id'			: sPageGUID.split('~').join('_'),
				'data-jumpid'	: sPageGUID
			}).find('> .text').attr({*/
			//commented by cd//
				/*'tabindex'	: '-1'*/
			//commented by cd//
			//}).html(sPageLabel);
			//commented by cd//

			nItemCount++;
			if(bGenerateMenu){
				//commented by cd//
				//$menuCWPointer.append($newMenuItem);
				//commented by cd//
			}
		};
		// ** Replace the $component view with the created menu
		this.$component.replaceWith($rootCWPointer.unwrap());
		// ** Point the DOM view pointer to the Root node of the menu
		this.$component = $rootCWPointer;
		// ** Add Listener to the Menu Container for click events
		this.bindHandlers();

		this.dispatchComponentLoadedEvent();
	};
	/*MenuComponent.prototype.generateMenu				= function(){
		//Logger.logDebug('MenuComponent.generateMenu()  | ');
		var oScope					= this,
			aPageModels				= (!this.oConfig.onlyModules) ? CourseController.getAllPageModels() : CourseController.getChildPages("cw01~cw01"),
			$menuItem				= Globals.getElementByClassName(this.$component, 'menu-item', 'MenuComponent.CONSTRUCTOR() | '),

			nItemCount				= 0,
			bGenerateMenu			= false,
			$rootCWWrapperPointer	= $('<div id="root_CW_wrapper"></div>'),
			$rootCWPointer,
			$menuCWPointer,
			$newMenuItem,
			oPageModel,
			sParentCWGUID,
			_sParentCWGUID,
			_sGrandParentCWGUID,
			oCWModel,
			sCWLabel,
			sCWHierarchy,
			sPageLabel,
			sPageGUID,
			i;

		// ** Empty the UL List container
		this.$component.empty();

		for (i = 0; i < aPageModels.length; i++) {
			oPageModel			= aPageModels[i];
			sParentCWGUID		= oPageModel.getParentCWGUID();
			_sParentCWGUID		= sParentCWGUID.split('~').join('_');
			oCWModel			= CourseController.findCW(sParentCWGUID);
			sCWLabel			= oCWModel.getCWLabel();
			sCWHierarchy		= oCWModel.getHierarchyLevel();
			sPageLabel			= oPageModel.getPageLabel();
			sPageGUID			= oPageModel.getGUID();
			nTabIndex			= nItemCount;

			if(i === 0){
				// ** Root CW so create a DOM UL element in the memory
				$rootCWPointer			= this.$component.clone();
				// ** Wrap the Root CW in a wrapper, so its easy to find the respective CW's
				$rootCWWrapperPointer.append($rootCWPointer);
				$rootCWPointer.attr({
					'id'		: _sParentCWGUID,
					'tabindex'	: '-1'
				}).addClass(sCWHierarchy);
				// ** Get a reference to the DOM UL where the LI element is going to get appended
				$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
			}
			Logger.logDebug('\t\tParent CWGUID = '+ sParentCWGUID +' : CW Label = '+ sCWLabel +' : Page Label = '+sPageLabel);
			//Logger.logDebug('\t\tPointer ID = '+ $menuCWPointer.attr('id'));

			// ** Leave the Menu Item that exists in the Exclude List of the Config & Continue with the next
			if (this.isInExcludeList(sPageGUID)) {Logger.logDebug('\t\t\t::Exclude::');continue;}
			// ** Clone the LI element
			$newMenuItem = $menuItem.clone();
			// ** Add ARIA attributes to the new LI element
			this.addARIAAttributesForPage($newMenuItem, 0);

			// ** The LI's (page's) containing UL (CW / Folder) doesnot exist in the DOM, hence create it
			if($rootCWWrapperPointer.find('#'+_sParentCWGUID).length === 0 && !this.isInExcludeList(sParentCWGUID)){
				this.addARIAAttributesForFolder($newMenuItem, 0);
				// ** Make the new LI a container (folder) for the sub-menu UL element
				$newMenuItem.addClass('tis-btn folder submenu-in '+sCWHierarchy).attr({
					'id'			: sPageGUID.split('~').join('_'),
					'data-jumpid'	: sPageGUID
				}).append(
					'<ul id="'+_sParentCWGUID+'" tabindex="-1"></ul>'
				).find('> .text').attr({
					'tabindex'	: '-1'
				}).html(sCWLabel);

				_sGrandParentCWGUID = _sParentCWGUID.substring(0, _sParentCWGUID.lastIndexOf('_'));
				//Logger.logDebug('\t\t\tGrand Parent CW GUID = '+_sGrandParentCWGUID);
				// ** Change the $menuCWPointer pointer to point to the correct parent
				$menuCWPointer = $rootCWWrapperPointer.find('#'+_sGrandParentCWGUID);
				// ** Append the new LI container (folder) to the correct Parent
				$menuCWPointer.append($newMenuItem);
				// ** Change the $menuCWPointer pointer to point to the currently created UL container
				$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
				// ** Created a UL folder container within an LI for this submenu, so repeat the loop for creating the Page LI
				i--;
				continue;
			}
			// ** Populate data for the menu page LI
			$newMenuItem.addClass('tis-btn page ' + sCWHierarchy).attr({
				'id'			: sPageGUID.split('~').join('_'),
				'data-jumpid'	: sPageGUID
			}).find('> .text').attr({
				'tabindex'	: '-1'
			}).html(sPageLabel);

			$menuCWPointer.append($newMenuItem);
		};
		// ** Replace the $component view with the created menu
		this.$component.replaceWith($rootCWPointer.unwrap());
		// ** Point the DOM view pointer to the Root node of the menu
		this.$component = $rootCWPointer;
		// ** Add Listener to the Menu Container for click events
		this.bindHandlers();

		this.dispatchComponentLoadedEvent();
	};
	MenuComponent.prototype.populateMenu				= function(){
		Logger.logDebug('MenuComponent.populateMenu()  | ');
		var oScope					= this,
			aPageModels				= (!this.oConfig.onlyModules) ? CourseController.getAllPageModels() : CourseController.getChildPages("cw01~cw01"),
			$menuItem				= Globals.getElementByClassName(this.$component, 'menu-item', 'MenuComponent.CONSTRUCTOR() | '),

			nItemCount				= 0,
			bGenerateMenu			= false,
			$rootCWWrapperPointer	= $('<div id="root_CW_wrapper"></div>'),
			$rootCWPointer,
			$menuCWPointer,
			$newMenuItem,
			oPageModel,
			sParentCWGUID,
			_sParentCWGUID,
			_sGrandParentCWGUID,
			oCWModel,
			sCWLabel,
			sCWHierarchy,
			sPageLabel,
			sPageGUID,
			i;

		var failsafeCounter = 0;
		var failsafe = 1000;
		Logger.logDebug(' ******* '+$menuItem.length);
		// ** Empty the UL List container
		//this.$component.empty();

		for (i = 0; i < aPageModels.length; i++) {
			oPageModel			= aPageModels[i];
			sParentCWGUID		= oPageModel.getParentCWGUID();
			_sParentCWGUID		= sParentCWGUID.split('~').join('_');
			oCWModel			= CourseController.findCW(sParentCWGUID);
			sCWLabel			= oCWModel.getCWLabel();
			sCWHierarchy		= oCWModel.getHierarchyLevel();
			sPageLabel			= oPageModel.getPageLabel();
			sPageGUID			= oPageModel.getGUID();
			nTabIndex			= nItemCount;

			if(i === 0){
				// ** Root CW so create a DOM UL element in the memory
				//$rootCWPointer			= this.$component;//.clone();
				// ** Wrap the Root CW in a wrapper, so its easy to find the respective CW's
				//$rootCWWrapperPointer.append($rootCWPointer);
				$rootCWWrapperPointer 	= this.$component.wrap($rootCWWrapperPointer);
				$rootCWPointer			= this.$component;
				$rootCWPointer.attr({
					'id'		: _sParentCWGUID,
					'tabindex'	: '-1'
				}).addClass(sCWHierarchy);
				// ** Get a reference to the DOM UL where the LI element is going to get appended
				//$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
			}
			Logger.logDebug('\tParent CWGUID = '+ sParentCWGUID +' : CW Label = '+ sCWLabel +' : Page Label = '+sPageLabel);
			//Logger.logDebug('\tPointer ID = '+ $menuCWPointer.attr('id'));

			// ** Leave the Menu Item that exists in the Exclude List of the Config & Continue with the next
			if (this.isInExcludeList(sPageGUID)) {Logger.logDebug('\t\t::Exclude::');continue;}
			// ** Clone the LI element
			//$newMenuItem = $menuItem.clone();
			$newMenuItem = $($menuItem[nItemCount]);
			// ** Add ARIA attributes to the new LI element
			this.addARIAAttributesForPage($newMenuItem, 0);

			// ** The LI's (page's) containing UL (CW / Folder) doesnot exist in the DOM, hence create it
			Logger.logDebug('\t\tnItemCount = '+nItemCount+' : I = '+i+' : _sParentCWGUID length = '+$rootCWWrapperPointer.find('#'+_sParentCWGUID).length);
			if($rootCWWrapperPointer.find('#'+_sParentCWGUID).length === 0 && !this.isInExcludeList(sParentCWGUID)){
				Logger.logDebug('\t\t\tCreate Folder');
				this.addARIAAttributesForFolder($newMenuItem, 0);
				// ** Make the new LI a container (folder) for the sub-menu UL element
				$newMenuItem.addClass('tis-btn folder submenu-in '+sCWHierarchy).attr({
					'id'			: sPageGUID.split('~').join('_'),
					'data-jumpid'	: sPageGUID
				}).find('> ul').attr({
					'id'		: _sParentCWGUID,
					'tabindex'	: '-1'
				});
				$newMenuItem.find('> .text').attr({
					'tabindex'	: '-1'
				}).html(sCWLabel);

				//_sGrandParentCWGUID = _sParentCWGUID.substring(0, _sParentCWGUID.lastIndexOf('_'));
				//Logger.logDebug('\t\t\tGrand Parent CW GUID = '+_sGrandParentCWGUID);
				// ** Change the $menuCWPointer pointer to point to the correct parent
				//$menuCWPointer = $rootCWWrapperPointer.find('#'+_sGrandParentCWGUID);
				// ** Append the new LI container (folder) to the correct Parent
				//$menuCWPointer.append($newMenuItem);
				// ** Change the $menuCWPointer pointer to point to the currently created UL container
				//$menuCWPointer = $rootCWWrapperPointer.find('#'+_sParentCWGUID);
				// ** Created a UL folder container within an LI for this submenu, so repeat the loop for creating the Page LI
				i--;
				nItemCount++;
				continue;
			}
			// ** Populate data for the menu page LI
			Logger.logDebug('\t\t\t\tCreate Page');
			$newMenuItem.addClass('tis-btn page ' + sCWHierarchy).attr({
				'id'			: sPageGUID.split('~').join('_'),
				'data-jumpid'	: sPageGUID
			}).find('> .text').attr({
				'tabindex'	: '-1'
			}).html(sPageLabel);

			nItemCount++;
			//$menuCWPointer.append($newMenuItem);
		};
		// ** Replace the $component view with the created menu
		this.$component.replaceWith($rootCWPointer.unwrap());
		// ** Point the DOM view pointer to the Root node of the menu
		this.$component = $rootCWPointer;
		// ** Add Listener to the Menu Container for click events
		this.bindHandlers();

		this.dispatchComponentLoadedEvent();
	};*/

	MenuComponent.prototype.isInExcludeList				= function(p_sPageGUID) {
		var bExists = (this.oConfig.excludeList.indexOf(p_sPageGUID) > -1) ? true : false;
		return bExists;
	};
	MenuComponent.prototype.addARIAAttributesForPage	= function(p_$menuItem, p_nTabIndex) {
		p_$menuItem.attr({
			'role'		: 'treeitem',
			'tabindex'	: '-1'
		});
		p_$menuItem.find('> .icon').attr({
			'role'		: 'presentation'
		});
		p_$menuItem.find('> .text').attr({
			'role'		: 'presentation'
		});
	};
	MenuComponent.prototype.addARIAAttributesForFolder	= function(p_$menuItem, p_nTabIndex) {
		p_$menuItem.attr({
			'role'			: 'treeitem',
			'aria-expanded'	: 'true',
			'aria-haspopup'	: 'true',
			'tabindex'		: '0'
		});
		p_$menuItem.find('> .icon').attr({
			'role'		: 'presentation'
		});
		p_$menuItem.find('> .text').attr({
			'role'		: 'presentation'
		});
	};
	MenuComponent.prototype.bindHandlers				= function() {
		//Logger.logDebug('MenuComponent.bindHandlers() ');
		var oScope = this;
		this.$component.on('click', 'li.menu-item', function(e) {
			oScope.handleEvents(e);
		}).on('keydown', 'li.menu-item', function(e){
			oScope.handleItemKeyDown($(this), e);
		}).on('focus', 'li.menu-item', function(e){
			oScope.handleItemFocus($(this), e);
		}).on('blur', 'li.menu-item', function(e){
			oScope.handleItemBlur($(this), e);
		}).attr({
			'role' 			: 'tree',
		}).find('.menu-item:first').attr({
			'tabindex'		: '0'
		});
	};

	MenuComponent.prototype.handleEvents				= function(e) {
		e.preventDefault();
		e.stopPropagation();

		var $target = $(e.target),
			$currentTarget = $(e.currentTarget);
		//Logger.logDebug('MenuComponent.handleEvents() | Target TAG = '+$target.prop('tagName')+' : Curr Target TAG = '+$currentTarget.prop('tagName')+' : GUID To Jump = '+$currentTarget.attr('data-jumpid'));

		if ($currentTarget.hasClass('disabled') || $currentTarget.hasClass('inactive')) {return;}


		var oEventObject = $.extend({}, e, {
				type : 'MENU_NAVIGATION',
				target : this,
				menuItem : e.currentTarget
			}),
			bIsFolder		= $currentTarget.hasClass('folder'),
			sPageGUIDToJump = $currentTarget.attr('data-jumpid');

		this.dispatchEvent('MENU_NAVIGATION', oEventObject);

		// ** For Collapsing the folder CW Menu Item
		//Logger.logDebug('MenuComponent.handleEvents() | is FOLDER = '+bIsFolder+' : Collapseable = '+this.oConfig.cwCollapseable+' : navigateOnCWClick = '+this.oConfig.navigateOnCWClick);
		if (bIsFolder && this.oConfig.cwCollapseable) {
			//Logger.logDebug('Collapse on CW Click');
			if ($currentTarget.hasClass('submenu-in')) {
				$currentTarget.find('ul').slideUp(800, function(e) {
					$currentTarget.removeClass('submenu-in').addClass('submenu-out').attr('aria-expanded', 'false');
				});
			} else {
				$currentTarget.find('ul').slideDown(800, function(e) {
					$currentTarget.removeClass('submenu-out').addClass('submenu-in').attr('aria-expanded', 'true');
				});
			}
			return;
		}

		if (bIsFolder && !this.oConfig.navigateOnCWClick) {
			//Logger.logDebug('Do not navigate on CW Click');
			return;
		}

		// ** For navigating to a Page
		//Logger.logDebug('MenuComponent.handleEvents() | sPageGUIDToJump = '+sPageGUIDToJump);
		CourseController.jumpToPage(sPageGUIDToJump);
	};
	MenuComponent.prototype.handleItemFocus				= function($item, e) {
		$item.addClass('focus');
		return true;
	};
	MenuComponent.prototype.handleItemBlur				= function($item, e) {
		$item.removeClass('focus');
		return true;
	};
	MenuComponent.prototype.handleItemKeyDown			= function($item, e) {
		if (e.altKey || e.ctrlKey) {
			return true;
		}
		if (e.shiftKey) {
			if (e.keyCode == this.keys.tab) {
				e.stopPropagation();
				return false;
			}

			return true;
		}

		switch(e.keyCode) {
			case this.keys.tab: {
				return true;
			}
			case this.keys.esc: {
				e.stopPropagation();
				return false;
			}
			case this.keys.enter:
			case this.keys.space: {
				this.handleEvents(e);
				e.stopPropagation();
				return false;
			}
			case this.keys.up: {
				//var $listItems = $item.siblings().andSelf().not('.separator');
				var $listItems = this.$component.find('.menu-item');
				var curNdx = $listItems.index($item);
				var $prev;

				if (curNdx > 0) {
					$prev = $listItems.eq(curNdx - 1);
				} else {
					$prev = $listItems.last();
				}
				//Logger.logDebug('PREV :: Current Index = '+curNdx+' : Prev Item Index = '+$prev.text());

				$item.not('.folder').removeClass('focus').attr({
					'tabindex'		: '-1'
				});
				$prev.addClass('focus').attr({
					'tabindex'		: '0'
				}).focus();

				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			case this.keys.down: {
				//var $listItems = $item.siblings().andSelf().not('.separator');
				var $listItems = this.$component.find('.menu-item');
				var curNdx = $listItems.index($item);
				var $next;

				if (curNdx < $listItems.length - 1) {
					$next = $listItems.eq(curNdx + 1);
				} else {
					$next = $listItems.first();
				}
				//Logger.logDebug('NEXT :: Current Index = '+curNdx+' : Next Item Index = '+$next.text());

				$item.not('.folder').removeClass('focus').attr({
					'tabindex'		: '-1'
				});
				$next.addClass('focus').attr({
					'tabindex'		: '0'
				}).focus();

				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		}

		return true;
	};

	MenuComponent.prototype.enableMenuViewByGUID			= function(p_sGUID, p_bEnable) {
		if(p_bEnable){
			this.$component.find(p_sGUID).removeClass('disabled');
		}else{
			this.$component.find(p_sGUID).addClass('disabled');
		}
	};
	MenuComponent.prototype.enableCurrentPageView			= function(p_bEnable) {
		var sGUID = CourseController.getCurrentPage().getGUID().split('~').join('_'),
		$menuItem = this.$component.find('li#'+sGUID);
		Logger.logDebug('Menu : .enableCurrentPageView () sGUID  = '+ sGUID +' | menu item = '+ $menuItem.length );
		if(p_bEnable){
			$menuItem.removeClass('disabled');
		}else{
			$menuItem.addClass('disabled');
		}
	};
	/**
	 * Destroys the Menu Component
	 */
	MenuComponent.prototype.destroy						= function() {
		//Logger.logDebug('MenuComponent.destroy() | ');
		this.$component.off();
		this.keys		= null;
		this.prototype	= null;

		AbstractComponent.prototype.destroy.call(this);
	};

	MenuComponent.prototype.toString					= function() {
		return 'framework/viewcontroller/MenuComponent';
	};

	return MenuComponent;
});