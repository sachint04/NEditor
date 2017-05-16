/**
 * RequreJS configuration
 * @copyright    2016 Tata Interactive Systems Pvt Ltd  
 */
require.config({
	waitSeconds: 200,
    shim:{
		'xml2json':{
			deps: ['jquery']
		},
    	'pubsub':{
    		deps: ['jquery']
    	},
    	'jqueryalphanumeric':{
    		deps: ['jquery']
    	},
    	'jqueryui':{
    		deps: ['jquery']
    	},
    	'jqueryuitouch':{
    		deps: ['jquery']
    	},
    	'swipe':{
    		deps: ['jquery']
    	},
    	'createJs':{
    		exports:'createjs'
    	},
    	/*'bootstrap':{
			deps: ['jquery']
		},*/
		'mediaplayer':{
			deps: ['jquery','jqueryui']
		},
		'jquerypause' :{
			deps : ['jquery']
		},
		'jqueryuitouchpunch':{
    		deps: ['jquery']
    	},
		/* Foundation */
		/*'foundation':{
			deps: ['jquery','modernizr'],
			exports: 'Foundation'
		},*/
		/*'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'foundation.clearing': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.equalizer': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.interchange': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.magellan': {
            deps: [
                'foundation.core'
            ]
        },
        'foundation.offcanvas': {
            deps: [
                'foundation.core'
            ]
        }, */
        /* Vendor Scripts */
		'jquery.cookie': {
			deps: ['jquery']
		},
		'fastclick': {
			exports: 'FastClick'
		},
		'modernizr': {
			exports: 'Modernizr'
		},
		'placeholder': {
			exports: 'Placeholders'
		}
    	/*
		'QUnit' :{
			deps: ['jquery'],
			exports	: 'QUnit',
			init	: function() {
			   QUnit.config.autoload = false;
			   QUnit.config.autostart = false;
		   }
		}*/
    },
    paths:{
        jquery				: 'libs/jquery-1.10.2',
        xml2json			: 'libs/jquery.xml2json',
        pubsub				: 'libs/jquery.ba-tinypubsub.min',
        x2js				: 'libs/xml2json.min',
        swipe				: 'libs/swipe',
        sm2					: 'libs/soundmanager2-jsmin',
        pipwerks			: 'libs/SCORM_API_wrapper',
        jqueryalphanumeric	: 'libs/jquery.alphanumeric.pack',
        nicescroll			: 'libs/jquery.nicescroll.min',

		/*bootstrap			: 'libs/bootstrap.min',*/

		mediaplayer			: 'libs/jquery.acornmediaplayer',
	    jqueryui			: 'libs/jquery-ui-1.11.3.min',
	    jqueryuitouch		: 'libs/jqueryui_touch',
	    jqueryuitouchpunch	: 'libs/jquery.ui.touch-punch.min', 
	    jquerypause			: 'libs/jquery.pause.min',
	    createJs			: 'libs/createjs-2015.11.26.min',
	    /* Foundation */
        /*'foundation'        : '../css/libs/foundation-5.5.2.custom/js/foundation.min',*/
        /* Vendor Scripts */
        /*
         * The "jquery-v2.1.4" reference is temporary, just in case if Foundation uses some
         * advanced functions available in 2.1.4. We have included jquery 1.10.0 for backward
         * compatibility in IE8 and below
        'jquery-v2.1.4'         : '../css/libs/foundation-5.5.2.custom/js/vendor/jquery',
         */
        'modernizr'         : '../css/libs/foundation-5.5.2.custom/js/vendor/modernizr',
        'jquery.cookie'     : '../css/libs/foundation-5.5.2.custom/js/vendor/jquery.cookie',
        'fastclick'         : '../css/libs/foundation-5.5.2.custom/js/vendor/fastclick',
        'placeholder'       : '../css/libs/foundation-5.5.2.custom/js/vendor/placeholder'

		/*,
		QUnit				: 'libs/qunit-1.14.0',
		testrunner			: 'test/testrunner'*/

        /*,
        es5shimmin: '../libs/es5-shim.min',
        CourseController: 'CourseController',
        CourseConfig: 'CourseConfig',
        ConfigParser: 'ConfigParser',
        Constants: 'Constants',
        ResourceLoader: 'ResourceLoader'*/

        /*,
        Builder: 'builder',
		SCORMFunctions: 'SCORMFunctions',
		SCORMWrapper: 'scorm/APIWrapper_scorm_12',
		sManager: 'vendor/soundmanager2-jsmin',
		xml2json:'vendor/jquery-xml2json',
		customInjection:'course_mini'*/
    }
});

/** 
 * Protect against IE8 not having developer console open.
 * @global
 * @property
 * @type Function  
 */
var console = window.console || {
    "log": function () {
    },
    "error": function () {
    },
    "trace": function () {
    }
};

/** @global  Credit to Douglas Crockford for this bind method.*/
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/** @global  closest thing possible to the ECMAScript 5 internal IsCallable function.*/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError ("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call (arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply (this instanceof fNOP && oThis
                            ? this
                            : oThis,
                            aArgs.concat (Array.prototype.slice.call (arguments)));
                };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP ();

        return fBound;
    };
}

/**
 * @global
 * Array.indexOf fix for IE8
 * Recommended Polyfill MDC: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {
		if (this === undefined || this === null) {
			throw new TypeError('"this" is null or not defined');
		}

		var length = this.length >>> 0;// Hack to convert object.length to a UInt32

		fromIndex = +fromIndex || 0;

		if (Math.abs(fromIndex) === Infinity) {
			fromIndex = 0;
		}

		if (fromIndex < 0) {
			fromIndex += length;
			if (fromIndex < 0) {
				fromIndex = 0;
			}
		}

		for (; fromIndex < length; fromIndex++) {
			if (this[fromIndex] === searchElement) {
				return fromIndex;
			}
		}

		return -1;
	};
}

/** @global To Change Font And Font-Size in Handheld Device and PC*/
var deviceAgent     = navigator.userAgent.toLowerCase();

/** @global Detect device */
var isMobile	 = function(){
	var hasTouch = false;
    if(navigator.userAgent.match(/Android/i)){
    	hasTouch = true;
    }else if(navigator.userAgent.match(/BlackBerry/i)){
    	hasTouch = true;
    }else if(navigator.userAgent.match(/iPhone|iPad|iPod/i)){
    	hasTouch = true;
    }else if(navigator.userAgent.match(/IEMobile/i)){
    	hasTouch = true;
    }
    return hasTouch;
}();

/*
detectOrientation();
window.onorientationchange = detectOrientation;
function detectOrientation(){
    if(typeof window.onorientationchange != 'undefined'){
        if ( orientation == 0 ) {
            //Do Something In Portrait Mode
        }
        else if ( orientation == 90 ) {
            //Do Something In Landscape Mode
        }
        else if ( orientation == -90 ) {
            //Do Something In Landscape Mode
        }
        else if ( orientation == 180 ) {
            //Do Something In Landscape Mode
        }
    }
}
function getOrientation(){
	switch(window.orientation){
	case -90:
	case 90:
		return ('landscape');
		break;
	default:
		return ('portrait');
		break;
	}
}*/
/** @global mach device orientation */
if(window.matchMedia){
	var oMediaQuery = window.matchMedia("(orientation: portrait)");
}

/** @global Create 'trim' function */
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
};

/** @global Set iframe refrences [Need more input here]*/
var sReferrerPath;
var querystr;
function getReferrerPath(){
	return sReferrerPath;
}
function setReferrerPath(p_sReferrerPath){
	sReferrerPath		= p_sReferrerPath.substring(0, p_sReferrerPath.lastIndexOf('/')+1);
	$('#application_wrapper').find('iframe#referrer').remove();
}
function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  
/** 
 * Start point to Framework
 * @exports framework/Main
 * 
 */
require([
	// Load our app module and pass it to our definition function
	'framework/core/Application',
	'jquery',
	'jqueryui'
	/*'foundation'*/
//], function(Application, $, testrunner){
], function(Application, $, jqueryui){
    /**  Initialize Foundation */
    //$(document).foundation();
	// ** If Hand Held Device then reduce the font-size
	if (deviceAgent.match(/iphone|ipad|android|ipod/i)){
    	//$("body,.activity-container").css({"font-size":'0.9em',"line-height":'1.2em' });
	}else{
	    //$("body,.activity-container").css("font-size", '1em');
	}

	// ** Get the actual domain URL for loading assets
	// var referrerPage	= 'sco_content/en/common/referrer.html',
		// iframeStr		= '<iframe id="referrer" src="'+referrerPage+'"></iframe>';
	// $('#application_wrapper').append(iframeStr);
	
	// add InternetExplorer fallback 
	
	if(window.ActiveXObject !== undefined ){
		 var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", 'css/all-ie-only.css');
        
        if (typeof fileref!="undefined")
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(fileref);
         
	}
	// Debug mode implementation. Pass page GUID as dummy bookmark object 
	 var page =	getQueryStringValue("page").trim();


		
	/** 
	*	The "app" dependency is passed in as "{@link Application}
	* 
	*/
	Application.init(page);
// 	
	// window.onunload = function (){
		// Application.postBookmark();
	// };
	// window.onbeforeunload = function (){
		// Application.postBookmark();
	// };

	var myEvent		= window.attachEvent || window.addEventListener,
		chkevent	= (window.attachEvent) ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

    myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
    	Application.postBookmark();
        /*var confirmationMessage = 'Are you sure to leave the page?';  // a space
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;*/
    });
	//testrunner.init();
});



/*var hasTouch;
window.addEventListener('touchstart', function setHasTouch () {
    hasTouch = true;
    // Remove event listener once fired, otherwise it'll kill scrolling
    // performance
    window.removeEventListener('touchstart', setHasTouch);
}, false);*/

/*Object.createObject = (function(){
  var createObject;

  if (typeof Object.create === "function"){
    // found native, use it
    createObject = Object.create;
  } else {
    // native not found, shim it
    Object.createObject = function (o) {
      F.prototype = o;
      var child = new F();
      F.prototype = null; // clean up just in case o is really large
      return child;
    };

  }

  return createObject;

  // hoisted to closure scope so even poorly-optimized js engines can run fast:
  function F() {}

})();

*/

