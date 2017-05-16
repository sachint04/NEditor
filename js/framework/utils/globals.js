	'use strict';
	/**
	 * 
	 * 
	 * @module framework.utils.globals
	 *  
	 */
define([
	'jquery',
	'framework/model/CourseConfigModel',
	'framework/model/CourseModel',
	'framework/model/PageModel',
	'framework/utils/Logger'
], function($, CourseConfig, CourseModel, PageModel, Logger) {
	var oVariableStore = {};
	
	/**
	 * @property
	 * Returns String converted from Javascript XML Object
	 * @return {String}
	 */
	var getXmlString = function(p_xmlDocument) {
		var result;
		if(typeof XMLSerializer != "undefined"){
			result = (new XMLSerializer()).serializeToString(p_xmlDocument);
		} else {
			result = p_xmlDocument.xml;
		}
		return result;
	};

	/**
	 * @member
	 * Returns Javascript XML Object converted from String
	 * @returns {Object} XML Object
	 */
	var getXMLfromString 				= function(p_str){
		if (window.DOMParser)
		 {
		 	var parser=new DOMParser();
		 	var xmlDoc =parser.parseFromString(p_str,"text/xml");
		 	return xmlDoc;
		}else{
		/* IE8 */
			try{
			var xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
				xmlDocument.async = false;
				xmlDocument.loadXML(p_str);
				return xmlDocument;
			}catch(e){
				Logger.logError('Error : VariableManager: getXMLfromString() failt to create XML from String!');
			}
		};
		Logger.logError('Error : VariableManager: getXMLfromString() failt to create XML from String!');
		return null;
	};
	
	/**
	 * Return search and return jQuery element by Id
	 * @returns {JQuery}  
	 */
	var getElementByID = function(p_$domView, p_sID, p_sErrorScope){
		var $elem = p_$domView.find('#'+p_sID);
		if($elem.length == 0){Logger.logWarn(p_sErrorScope+' | Element with ID "'+p_sID+'" not found.');}
		if($elem.length > 1){Logger.logWarn(p_sErrorScope+' | Multiple Elements with ID "'+p_sID+'" found.');}
		return $elem;
	};

	/**
	 * @property
	 * Return search and return jQuery element by class name
	 * @returns {JQuery}  
	 */
	var getElementByClassName = function(p_$domView, p_sClassName, p_sErrorScope){
        //Logger.logDebug('Globals.getElementByClassName() | "'+p_sClassName+'"');
        if(p_sClassName.indexOf(' ')){p_sClassName = p_sClassName.split(' ').join('.');}
        var nIndexOfDot	= p_sClassName.indexOf('.');
        if(nIndexOfDot > -1 && nIndexOfDot == 0){p_sClassName = p_sClassName.substring(1, p_sClassName.length);}
        if(nIndexOfDot > -1 && nIndexOfDot == (p_sClassName.length - 1)){p_sClassName = p_sClassName.substring(0, nIndexOfDot);}
		var $elems = p_$domView.find('.'+p_sClassName);
		if($elems.length == 0){Logger.logWarn(p_sErrorScope+' | Elements with Class Name "'+p_sClassName+'" not found.');}
		return $elems;
	};

	var getElement			 = function(p_$domView, p_sClassNameOrID, p_sErrorScope){
        //Logger.logDebug('Globals.getElement() | "'+p_sClassNameOrID+'"');
		var $elems = p_$domView.find(p_sClassNameOrID);
		if($elems.length == 0){Logger.logWarn(p_sErrorScope+' | Elements with Class Name OR ID "'+p_sClassNameOrID+'" not found.');}
		return $elems;
	};
	
	var getContent = function(p_xmlNode){
        //Logger.logDebug('Globals.getContent() | "'+getXmlString(p_xmlNode)+'"');
        if(p_xmlNode.childNodes.length == 0){
            //Logger.logWarn('Globals.getContent() | No text found in "'+getXmlString(p_xmlNode)+'"');
            return;
        }
        var txt;
        for(var i=0; i<p_xmlNode.childNodes.length; i++){
        	var str = p_xmlNode.childNodes[i].nodeValue;
        	if(str != null){
        		txt = p_xmlNode.childNodes[i].nodeValue.replace(/^\s+|\s+$/g,'');
	            //Logger.logDebug('['+i+'] = Node Name = '+p_xmlNode.childNodes[i].nodeName+' : Node Type = '+p_xmlNode.childNodes[i].nodeType+' : Is Empty = '+(txt == '')+' : "'+txt+'"');
	            //if(p_xmlNode.childNodes[i].nodeName === '#cdata-section'){
	            if(txt != ''){
	                return txt;
	            }
            }
        }
        //Logger.logWarn('Globals.getContent() | No text found in "'+getXmlString(p_xmlNode)+'"');
        return "";
    };
	
	var trim = function(p_str){
		return p_str.split(' ').join('');
	};

	var setVariable = function(p_sKey, p_value){
		if(oVariableStore[p_sKey]){
			Logger.logWarn('Globals.setVariable() | Variable named "'+p_sKey+'" is being overridden.');
		}
		oVariableStore[p_sKey] = p_value;
	};
	var getVariable = function(p_sKey){
		if(oVariableStore[p_sKey] == null){
			Logger.logWarn('Globals.getVariable() | Variable named "'+p_sKey+'" not found');
		}
		return oVariableStore[p_sKey];
	};

	/**
	 * preload images in tag
	 */
	var checkImagesLoaded = function(p_oContext, p_fCallback, p_aArguments) {
	    var imageCount,cssData;
	    cssData = (p_aArguments && p_aArguments.length) ? p_aArguments[0] : null; // page css
	    checkAndAddAssets(cssData);// create image tags for each image refered in page css
	    imageCount 	= $('img:not(".no-cache")').length,

	    $('img:not(".no-cache")').one('load', function() {
	        imageCount--;
	        if (imageCount == 0) {
	        	p_fCallback.call(p_oContext, p_aArguments);
	        }
	    }).error(function(){
	    	Logger.logReport('Could not load image ('+ this.src+')');
	    	imageCount--;
	        if (imageCount == 0) {
	        	  	p_fCallback.call(p_oContext, p_aArguments);
	        }
	    }).each(function() {
	        if (this.complete)
	            $(this).load();

	    });

	};

	/**
	 * read styles and create temp image tags
	 */
	var checkAndAddAssets	= function(p_sCSSData){
		if(!p_sCSSData) return;
		var aList = p_sCSSData.match(/[^\("']+\.(gif|jpg|jpeg|png)/g),
		i,
		$adHocContainer = $('#adHocAsssetContainer');

		if(aList && aList.length){
			aList.sort();
			aList = aList.filter( function(v, i, a) { return !i || v !== a[i-1]; } );// remove duplicate entries;
			if($adHocContainer && $adHocContainer.length){
				$adHocContainer.empty().remove();
			}
			$adHocContainer = $('<div id="adHocAsssetContainer" style="background-color:rgba(255,255,255, 0.8); padding:5px;"><span style="font-size:12px;color:#0000ff;">Framework_tool(5) - Assets</span><span><a id="btnHide" href="#" style="float:right;font-size:12px;color:#ffffff;background-color:#000000;display:inline-block;padding:0px 5px;">Hide</a></span><br><div id="imageHolder"></div></div>');
			$('body').append($adHocContainer);
			$adHocContainer.find('a#btnHide').click(function(event){
				event.preventDefault();
				$adHocContainer.find('#imageHolder').toggle(function(){
					console.log($(this).css('display') );
					if($(this).css('display') == 'none'){
						$adHocContainer.find('a#btnHide').text('Show');
					}else{
						$adHocContainer.find('a#btnHide').text('Hide');
					}
				});
			});
			$adHocContainer.css({
				'position':'absolute',
				'left': '0px',
				'top' : '0px',
				'min-width':'180px',
				'z-index': '0',
     			'opacity' : '0'
			});

			/* show image icons if debug mode is on */
        	if(CourseConfig.getConfig('allow_framework_tool').status == '5'){
       			$adHocContainer.css({
       				'z-index': '1000',
     				'opacity' : '1.0'
       			});
        	}


			for(i = 0; i <aList.length;i++ ){
				var $imgTag = $('<img src="" class="add-hoc-img" />');
				$imgTag.attr({
					'src': aList[i],
					'title' : aList[i]
				}).css({
					'width':'40px',
					'height': '40px',
					'position':'relative',
					'border' : '1px dotted #ffffff',
					'background-color': '#000000'
				});

				$adHocContainer.find('#imageHolder').append($imgTag);
			}
		}
	};
	var replaceContextOfCSSBgImages = function(p_sCSSData){
		//Logger.logDebug('Globals.replaceContextOfCSSBgImages() | '+p_sCSSData);
		var nStartOfURL	= p_sCSSData.indexOf('url('),
			nLoopCount	= 0,
			nLoopLimit	= 10,
			sBgImgURL,
			str1,
			str2;

		while(nStartOfURL > -1){
			nEndOfURL = p_sCSSData.indexOf(')', nStartOfURL);

			sBgImgURL = p_sCSSData.substring(nStartOfURL, nEndOfURL+1);
			sBgImgURL = getBackgroundImgURL(sBgImgURL);
			//Logger.logDebug('Img URL = '+sBgImgURL);

			str1					= p_sCSSData.substring(0, nStartOfURL);
			str2					= p_sCSSData.substring(nEndOfURL+1, p_sCSSData.length);
			bHasHTTP		= (sBgImgURL.indexOf('http://') > -1 || sBgImgURL.indexOf('https://') > -1 || sBgImgURL.indexOf('www.') > -1);
			p_sCSSData	= str1 + '$x$' + ((bHasHTTP) ? '' : getReferrerPath()) + sBgImgURL + '$y$' + str2;

			nLoopCount++;
			if(nLoopCount >= nLoopLimit){break;}

			nStartOfURL	= p_sCSSData.indexOf('url(');
		}

		p_sCSSData = p_sCSSData.replace(/\$x\$/gi, 'url("');
		p_sCSSData = p_sCSSData.replace(/\$y\$/gi, '")');
		//Logger.logDebug(p_sCSSData);
		return p_sCSSData;
	};
	var getBackgroundImgURL			= function(p_sBgImgURL){
		//Logger.logDebug('Globals.getBackgroundImgURL() '+p_sBgImgURL);
		var hasDoubleQuotes	= (p_sBgImgURL.indexOf('("') > -1),
			hasSingleQuotes	= (p_sBgImgURL.indexOf("('") > -1),
			nStartIndex,
			nEndIndex;

		if(hasDoubleQuotes){
			nStartIndex		= p_sBgImgURL.indexOf('("');
			nEndIndex		= p_sBgImgURL.indexOf('")');
		}else if(hasSingleQuotes){
			nStartIndex		= p_sBgImgURL.indexOf("('");
			nEndIndex		= p_sBgImgURL.indexOf("')");
		}else{
			Logger.logError('Globals.getBackgroundImgURL() | Invalid Background Image declaration "'+p_sBgImgURL+'" in CSS. The value within the URL needs to be surrounded by single or double quotes.');
		}
		//Logger.logDebug(nStartIndex+' :: '+nEndIndex);
		return p_sBgImgURL.substring(nStartIndex+2, nEndIndex);
	};

	var shuffleArray = function(p_aArray){
		var nCurrentIndex = p_aArray.length,
			temporaryValue,
			nRandomIndex,
			randomizationIndex = [];

		// While there remain elements to shuffle...
		while (0 !== nCurrentIndex) {
			// Pick a remaining element...
			nRandomIndex = Math.floor(Math.random() * nCurrentIndex);
			randomizationIndex.push(nRandomIndex);
			nCurrentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = p_aArray[nCurrentIndex];
			p_aArray[nCurrentIndex] = p_aArray[nRandomIndex];
			p_aArray[nRandomIndex] = temporaryValue;
		}

		return p_aArray;
	};

	/**
	 * Returns a random number between min and max
	 */
	var getRandomNumber = function(nMinRange, nMaxRange){
		//return Math.random() * (nMaxRange - nMinRange) + nMinRange;
		//return Math.floor(Math.random() * range);
		return Math.floor(Math.random() * (nMaxRange - nMinRange + 1)) + nMinRange;
	};

	var getRandomChar		= function(){
		var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
		return chars.substr(getRandomNumber(0, chars.length), 1);
	};

	var getRandomID			= function(size){
		var str = "",
			i;
		for(i = 0; i < size; i++){
			str += getRandomChar();
		}
		return str;
	};

	/*
	 * getStyleObject Plugin for jQuery JavaScript Library
	 * From: http://upshots.org/?p=112
	 */
	(function($){
	    $.fn.getStyleObject = function(){
	        var dom = this.get(0);
	        var style;
	        var returns = {};
	        if(window.getComputedStyle){
	            var camelize = function(a,b){
	                return b.toUpperCase();
	            };
	            style = window.getComputedStyle(dom, null);
	            for(var i = 0, l = style.length; i < l; i++){
	                var prop = style[i];
	                var camel = prop.replace(/\-([a-z])/g, camelize);
	                var val = style.getPropertyValue(prop);
	                returns[camel] = val;
	            };
	            return returns;
	        };
	        if(style = dom.currentStyle){
	            for(var prop in style){
	                returns[prop] = style[prop];
	            };
	            return returns;
	        };
	        return this.css();
	    };
	})($);


	var getFile				= function(p_oPageModel, p_sLocationKey, p_sErrorScope){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sFileType		= p_sLocationKey.split('_')[0].toLowerCase(),
			sFileName;

		switch(sFileType){
			case 'js':
				sFileName	= p_oPageModel.getScriptFileName();
				break;
			case 'css':
				sFileName	= p_oPageModel.getCSSFileName() + '.css';
				break;
			case 'audio':
				sFileName	= p_oPageModel.getScriptFileName();
				break;
			case 'html':
				sFileName	= p_oPageModel.getPageID() + '.html';
				break;
			case 'xml':
				sFileName	= p_oPageModel.getPageID() + '.xml';
				break;
			default:
				Logger.logError(p_sErrorScope+' Location for file type "'+sFileType+'" does not exist.');
		}
		if(sFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_sLocationKey).folderURL + sParentCWPath + sFileName;
		}
		return null;
	};

	var getJSFile			= function(p_oPageModel, p_JSLocationKey){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sJSFileName		= p_oPageModel.getScriptFileName();
		if(sJSFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_JSLocationKey).folderURL + sParentCWPath + sJSFileName;
		}
		return null;
	};
	var getCSSFile			= function(p_oPageModel, p_CSSLocationKey){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sCSSFileName	= p_oPageModel.getCSSFileName();
		if(sCSSFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_CSSLocationKey).folderURL + sParentCWPath + sCSSFileName + '.css';
		}
		return null;
	};
	var getHTMLFile			= function(p_oPageModel, p_HTMLLocationKey){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sHTMLFileName	= p_oPageModel.getPageID();
		if(sHTMLFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_HTMLLocationKey).folderURL + sParentCWPath + sHTMLFileName +'.html';
		}
		return null;
	};
	var getXMLFile			= function(p_oPageModel, p_XMLLocationKey){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sXMLFileName	= p_oPageModel.getPageID();
		if(sXMLFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_XMLLocationKey).folderURL + sParentCWPath + sXMLFileName +'.xml';
		}
		return null;
	};
	var getAudioFilePath	= function(p_oPageModel, p_AudioLocationKey){
		var sSCOContentRoot	= CourseConfig.getRootPath(),
			sParentCWPath	= p_oPageModel.getParentCWGUID().split('~').join('/') + '/',
			sAudioFileName	= p_oPageModel.getPageID();
		if(sAudioFileName){
			return sSCOContentRoot + CourseConfig.getConfig(p_AudioLocationKey).folderURL + sParentCWPath;
		}
		return null;
	};

	var isFilePath			= function(p_value){
		var regPattern	= new RegExp('\.jpg|\.gif|\.jpeg|\.png|\.html$', 'i');
			isFilePath	= regPattern.test(p_value) ? true : false;
		//Logger.logDebug('Popup.isFilePath() | Data = '+p_value+' : '+isFilePath);
		//return isFilePath;
		return regPattern.test(p_value);
	};
	var isJQueryObject		= function(p_value){
		//Logger.logDebug('Popup.isJQueryObject() | Data = '+p_value+' : '+(p_value instanceof $));ll;
		return (p_value instanceof $);
	};
	var isID				= function(p_value){
		var nHashIndex	= (typeof p_value === 'string') ? p_value.indexOf('#') : null;
		//Logger.logDebug('Popup.isID() | Data = '+p_value+' : '+nHashIndex+' :: '+(nHashIndex !== null)+' :: '+(nHashIndex === 0));
		return (nHashIndex !== null && nHashIndex === 0);
	};
	var isClass				= function(p_value){
		var nDotInedx	= (typeof p_value === 'string') ? p_value.indexOf('.') : null;
		//Logger.logDebug('Popup.isClass() | Data = '+p_value+' : '+nDotInedx+' :: '+(nDotInedx !== null)+' :: '+(nDotInedx === 0));
		return (nDotInedx !== null && nDotInedx === 0);
	};
	var isPageObject		= function(p_value){
		//Logger.logDebug('Popup.isPageObject() | Data = '+p_value+' : '+(p_value instanceof PageModel));
		return (p_value instanceof PageModel);
	};
	var isPageGUID		= function(p_value){
		//Logger.logDebug('Popup.isPageObject() | Data = '+p_value+' : '+(p_value instanceof PageModel));
		return (CourseModel.findPage(p_value));
	};


	var removeChildSafe = function (el) {
		//before deleting el, recursively delete all of its children.
		while (el.childNodes.length > 0) {
			removeChildSafe(el.childNodes[el.childNodes.length - 1]);
		}
		el.parentNode.removeChild(el);
		discardElement(el);
	};
	var discardElement = function (el) {
		var bin = document.getElementById('IELeakGarbageBin');

		if (!bin) {
			bin = document.createElement('DIV');
			bin.id = 'IELeakGarbageBin';
			document.body.appendChild(bin);
		}

		bin.appendChild(el);
		bin.innerHTML = '';
	};

	var sanitizeValue		= function(p_sValue, p_sDefaults){
		if((typeof p_sValue) !== "string"){
			// ** Value is not a string
			return p_sValue;
		}
		var sValue	= p_sValue.split(' ').join(''),
			retVal;
		//Logger.logDebug('ComponentAbstract.sanitizeValue() | Value = '+p_sValue+' : Default = '+p_sDefaults);

		if(!sValue || sValue === '' || sValue === null || sValue === undefined){
			// ** Value is Not Specified OR Undefined
			retVal	= p_sDefaults;
		}else if(sValue.toUpperCase() === 'TRUE' || sValue.toUpperCase() === 'FALSE'){
			// ** Value is a Boolean
			retVal	= (sValue.toUpperCase() === 'TRUE') ? true : false;
		}else if(!isNaN(Number(sValue))){
			// ** Value is a Number
			retVal	= Number(p_sValue);
		}else{
			// ** Its a String
			retVal	= p_sValue;
		}
		return retVal;
	};
	var matchBrowser		= function(p_sValue){
		var aValue	= p_sValue.split(' ').join('').split(','),
			bIsRange	= (aValue[1].indexOf('-') > -1);
		//Logger.logDebug('Globals.matchBrowser() | Value = '+p_sValue);

		switch (aValue[0].toUpperCase()){
			case 'MSIE': {
				//Logger.logDebug('\tCheck MSIE');
				var ver = getInternetExplorerVersion();
				if(ver > -1){
					//Logger.logDebug('\tIS MSIE ver = "'+ver+'"');
					if(bIsRange){
						var aRange	= aValue[1].split('-');
						//Logger.logDebug('\tbIsRange | min = '+aRange[0]+' : max = '+aRange[1]);
						//Logger.logDebug('\t>= min :  '+(ver  >= parseFloat(aRange[0]))+' | <= max : '+(ver <= parseFloat(aRange[1])));
						if(ver  >= parseFloat(aRange[0]) &&  ver <= parseFloat(aRange[1])){
							//Logger.logDebug('\tIn Range');
							return true;
						}
					}else{
						// ** Array of version numbers, so find the exact match
						var aBrowserVersions = aValue.slice(1, aValue.length);
						for (var i=0; i < aBrowserVersions.length; i++) {
							if(parseFloat(aBrowserVersions[i]) === ver){
								//Logger.logDebug('\tMatchs');
								return true;
							}
						};
					}
				}
			}
			// TODO: Implementation for other browsers
		}

		return false;
	};

	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	var getInternetExplorerVersion		= function(){
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null){
				rv = parseFloat( RegExp.$1 );
			}
		}
		return rv;
	};
	var blinker = function($elem, p_oStyle1, p_oStyle2, p_nRepeat ,p_nSpeed, nStartCount, p_fCallback, p_oScope, p_aArg){
		var oScope 			= this;
		var elem 			= $elem;
		var nCount 			= nStartCount || 0;
		var speed 			= p_nSpeed;
		var currentStyle 	= p_oStyle1;
		var nextStyle 		= p_oStyle2;
		var repeat 			= p_nRepeat;
		
		//console.log('element found -'+elem.length+' | nCount = '+nCount+' | currentStyle = '+JSON.stringify(currentStyle)+' | nextStyle = '+  JSON.stringify(nextStyle)+' | repeat = '+repeat+' | speed = '+ speed)

		if(nCount > repeat){
			elem.removeClass(currentStyle+' '+ nextStyle);
			if(p_fCallback)
				p_fCallback.apply(p_oScope, p_aArg);
				return;
		}
		
		elem.switchClass(currentStyle, nextStyle, speed, function(){
			nCount++;
		 	oScope.blinker($(this), nextStyle, currentStyle, repeat, speed, nCount, p_fCallback, p_oScope, p_aArg);	
		});
		

	};
	
	var trimSpecialChars = function(txt, exclude, include){
		var str = '!#$%^&*()_+@~`>\\-<\//\=';
		
		if(exclude){
			for (var i=0; i < exclude.length; i++) {
			  if(str.indexOf(exclude.charAt(i)) != -1){
			  	str = str.replace(exclude.charAt(i), '');
			  }		  
			};
		};
		
		if(include)str += include;
		
		var reg = new RegExp('['+str+']', 'g');
		while ((res = reg.exec(txt)) !== null) {
			txt = txt.replace(res[0],'');
		}
	
		return txt;
	};
	/**
	 *  @alias module:framework.utils.globals 
	 */
	return {
		/** Convert  XML to String 		 */
		toXMLString 				: getXmlString,
		/** Return  xml cdata  		 */
		getContent 					: getContent,
		/** Returns JQuery element by ID 		 */
		getElementByID				: getElementByID,
		/**Returns jQuery Object 	 */
		getElementByClassName		: getElementByClassName,
		getElement					: getElement,
		/** Trim white spaces fro both ends		 */
		trim						: trim,
		setVariable					: setVariable,
		getVariable					: getVariable,
		checkImagesLoaded			: checkImagesLoaded,
		/**Randomize Array		 */
		shuffleArray				: shuffleArray,
		/**Returns random value		 */
		getRandomNumber				: getRandomNumber,
		getRandomID					: getRandomID,

		getXMLFile					: getXMLFile,
		getHTMLFile					: getHTMLFile,
		getCSSFile					: getCSSFile,
		getJSFile					: getJSFile,
		getAudioFilePath			: getAudioFilePath,
		getFile						: getFile,
		/** Returns true is String is valid file path */	
		isFilePath					: isFilePath,
		isJQueryObject				: isJQueryObject,
		isID						: isID,
		isClass						: isClass,
		/** Returns if Object is valid {@link PageModel} */
		isPageObject				: isPageObject,
		sanitizeValue				: sanitizeValue,
		removeChildSafe				: removeChildSafe,
		/** Convert XML string to XML Object */
		getXMLfromString 			: getXMLfromString,
		replaceContextOfCSSBgImages	: replaceContextOfCSSBgImages,
		matchBrowser				: matchBrowser,
		isPageGUID					:isPageGUID,
		blinker						: blinker,
		trimSpecialChars			: trimSpecialChars
	};
});

