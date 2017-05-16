define([
	'jquery',
	'jqueryalphanumeric',
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function($, jqueryalphanumeric, EventDispatcher, Logger){
	$.fn.limitMaxlength = function(options) {
        var settings = $.extend({
            attribute : "maxlength",
            onLimit : function() {
            },
            onEdit : function() {
            }
        }, options);

        // Event handler to limit the textarea
        var onEdit = function() {
            var textarea = $(this);
            var maxlength = parseInt(textarea.attr(settings.attribute));

            if (textarea.val().length > maxlength) {
                textarea.val(textarea.val().substr(0, maxlength));

                // Call the onlimit handler within the scope of the textarea
                //$.proxy(settings.onLimit, this)();
            }

            // Call the onEdit handler within the scope of the textarea
            $.proxy(settings.onEdit, this)(maxlength - textarea.val().length);
        };

        this.each(onEdit);

        // return this.keyup(onEdit).keydown(onEdit).focus(onEdit).live('input paste', onEdit);
        return this.keyup(onEdit).keydown(onEdit).focus(onEdit).bind('input paste', onEdit);
    };

	// InputField(domOptn,  sOptnGrpID, nOptnScore, aOptionsList);
	//function InputField (p_domOptn, p_sOptnGrpID,  p_aOptionsList) {
	function InputField (p_domTypeInField, p_sTypeInID, p_oInputProps) {
		//Logger.logDebug('InputField.CONSTRUCTOR() | DOM InputField '+p_domTypeInField+' : Typein ID = '+p_sTypeInID+' oProps = '+p_oInputProps);
		EventDispatcher.call(this);
		this.$domTIF					= $(p_domTypeInField);
		this.sID						= p_sTypeInID;
		this.oProps						= p_oInputProps;
		//this.oParameters	= p_oParameter;

		this.bEnabled		= false;
		this.sText			= '';
		// ** Define values for keycodes
		this.keys = {
			tab		: 9,
			enter	: 13,
			space	: 32,
			left	: 37,
			up		: 38,
			right	: 39,
			down	: 40
		};

		this.addProperties();
		this.enable(true);
	}

	InputField.prototype								= Object.create(EventDispatcher.prototype);
	InputField.prototype.constructor					= InputField;

	InputField.prototype.addProperties					= function(e){
		var oScope	= this;
		this.$domTIF.attr({
			'maxlength'		: oScope.oProps.nMaxChars
		}).limitMaxlength({
            /*onEdit : function(p_charsRemaining){
				$(this).css('background-color', '#ffffff');
            },
            onLimit : function(){
				$(this).css('background-color', '#336699');
            }*/
        });

		// ** If The user is not to be allowed to cut, copy & paste
        if(this.oProps.bCutCopyPaste){
	        this.$domTIF.bind("cut copy paste", function(e) {
	            e.preventDefault();
	        });
	    }
		//Logger.logDebug('RESTRICT TO '+JSON.stringify(this.oProps));
		var restrictInput	= this.oProps.sRestrictTo.toUpperCase();
	    if (restrictInput !== 'NONE') {
            var allowedChars		= this.oProps.sAllowChars,
            	restrictedChars		= this.oProps.sRestrictChars,
            	caseAllowed			= this.oProps.sCharCase.toUpperCase(),
            	/* Custom Properties */
            	o					= {},
            	propertiesCount		= 0;
            //Logger.logDebug('restrictInput = '+restrictInput+' : allowedChars = '+allowedChars+' : restrictedChars = '+restrictedChars+' : caseAllowed = '+caseAllowed);

            if (allowedChars !== '') {
                o.allow = allowedChars;
                propertiesCount++;
            }
            if (restrictedChars !== '') {
                o.ichars = restrictedChars;
                propertiesCount++;
            }
            if (caseAllowed !== 'BOTH') {
                o[caseAllowed] = true;
                propertiesCount++;
            }
            if (restrictInput == 'ALPHANUMERIC') {(propertiesCount > 0) ? this.$domTIF.alphanumeric(o) : this.$domTIF.alphanumeric();}
            if (restrictInput == 'ALPHABETS') {(propertiesCount > 0) ? this.$domTIF.alpha(o) : this.$domTIF.alpha();}
            if (restrictInput == 'NUMERIC') {(propertiesCount > 0) ? this.$domTIF.numeric(o) : this.$domTIF.numeric();}
        }
	};

	InputField.prototype._handleEvents					= function(e){
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type;
		//Logger.logDebug('InputField._handleEvents() | target = '+target+' : currentTarget = '+currentTarget+' : type = '+type);

		if(!this.$domTIF.hasClass('inactive') && !this.$domTIF.hasClass('disabled')){
			if(type === 'focusin' || type === 'click') {
	            this.$domTIF.removeClass('focusout').addClass('focusin');
			}else if(type === 'focusout') {
				this.$domTIF.removeClass('focusin').addClass('focusout');
	    	}
	    }
	};

	InputField.prototype._handleKeyboardEvents			= function(e){
		var target			= e.target,
			currentTarget	= e.currentTarget,
			type			= e.type,
			sStr			= this.$domTIF.val();
		//Logger.logDebug('InputField._handleKeyboardEvents() | target = '+target+' : currentTarget = '+currentTarget+' : type = '+type);

		if(!this.$domTIF.hasClass('inactive') && !this.$domTIF.hasClass('disabled')){
			if(type === 'keyup'){
				//Logger.logDebug('InputField._handleKeyboardEvents() | Stored Str = '+this.sText.length+' : Typed Str = '+sStr.length);
				if(this.sText.length !== sStr.length){
					this.sText = sStr;
					this.dispatchEvent('TYPE_IN', {type:'TYPE_IN', target:this, text:this.sText});
				}

				var code = e.which;
				if (code === this.keys.enter) {
					this.dispatchEvent('ENTER', {type:'ENTER', target:this, text:this.sText});
				}
			}
		}
	};

	InputField.prototype.getScore							= function(){
		return this.oProps.nScore;
	};
	InputField.prototype.getParameters						= function(){
		//return this.oParameters;
	};
	InputField.prototype.getInputField						= function(){
		return this.$domTIF;
	};
	InputField.prototype.getID								= function(){
		return this.sID;
	};
	InputField.prototype.getText							= function(){
		return this.sText;
	};
	InputField.prototype.reset								= function(){
		this.sText = '';
		this.$domTIF.val('');
		this.enable(true);
	};

	InputField.prototype.enable							= function(p_bEnable){
		var oScope = this;
		// ** Return if already enabled
		if(this.bEnabled === p_bEnable){return;}
		//Logger.logDebug('InputField.enable() | ID = '+this.getID()+' : Enable = '+p_bEnable+' : IS Enabled = '+this.bEnabled);

		if(p_bEnable){
			this.$domTIF.attr({
				/* START - ARIA Implementation */
				'aria-disabled'	: false
				/* END - ARIA Implementation */
			}).on('click focusin focusout', function(e){
				oScope._handleEvents(e);
			}).on('keyup', function(e){
				oScope._handleKeyboardEvents(e);
			}).removeClass('disabled').removeAttr('disabled');
			this.bEnabled = true;
		}else{
			this.$domTIF.attr({
				'disabled'		: 'disabled',
				/* START - ARIA Implementation */
				'aria-disabled'	: true
				/* END - ARIA Implementation */
			}).off().addClass('disabled');
			this.bEnabled = false;
		}
	};

	InputField.prototype.validate						= function(){
		var aAnsCache		= this.oProps.aAnswers,
			caseSensitive	= this.oProps.bCaseSensitiveValidation,
			aAnsCacheLength	= aAnsCache.length,
			i				= 0;

		if(aAnsCacheLength){
			for(i=0; i<aAnsCacheLength; i++){
				if(caseSensitive){
					if(aAnsCache[i].__cdata === this.sText){return true;}
				}else{
					if(aAnsCache[i].__cdata.toLowerCase() === this.sText.toLowerCase()){return true;}
				}
			}
			return false;
		}else{
			if(caseSensitive){
				if(aAnsCache.__cdata === this.sText){return true;}
			}else{
				if(aAnsCache.__cdata.toLowerCase() === this.sText.toLowerCase()){return true;}
			}
			return false;
		}
	};

	InputField.prototype.destroy						= function(){
		this.$domTIF.off();

		this.$domTIF		= null;
		this.sID			= null;
		for(var prop in this.oProps){this.oProps[prop]	= null;}
		this.oProps			= null;
		//this.oParameters	= null;

		this.bEnabled		= null;
		this.sText			= null;
	};

	InputField.prototype.toString						= function(){
		return 'framework/activity/viewcontroller/InputField';
	};

	return InputField;
});
