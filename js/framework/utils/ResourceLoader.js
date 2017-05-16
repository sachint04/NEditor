define([
	'jquery',
	'framework/utils/Logger'
], function($, Logger){
	function ResourceLoader(){
		var oScope = this,
			name = "default",
			aResourceList = null,
			aResourceData = null,
			
			oContext = null,
			fCallback = null,
			aArgs = null;
	}

	ResourceLoader.prototype = {
		constructor : ResourceLoader,
		/* -----------------------------------------*/
		/* 				 Private Methods 			*/
		/* -----------------------------------------*/
		_load				: function(p_resourcePath, p_dataType, p_nIndex){
			//Logger.logDebug('ResourceLoader._load() | '+(this.getName() || "")+' | Path = ' + p_resourcePath+' : dataType = '+p_dataType);
			var oScope = this;
			$.ajax({
				type : "GET",
				url : p_resourcePath,
				dataType : p_dataType,
				success : function(xml) {
					oScope._onResourceLoad(xml, p_nIndex);
				},
				error:function(jqXHR, textStatus, errorThrown){
			        Logger.logError('Not able to load '+p_dataType.toUpperCase()+' file "'+p_resourcePath+'" with ERROR:"'+errorThrown+'"');
				}
			});
		},
		_onResourceLoad		: function(p_oData, p_nIndex){
			//Logger.logDebug('ResourceLoader._onResourceLoad() | '+(this.getName() || "")+' | oData = ' + p_oData +' : Index = '+p_nIndex);
			this.aResourceData[p_nIndex] = p_oData;
			//this.aResourceData[this._getFileName(this.aResourceList[p_nIndex])] = p_oData;
			this.aResourceData.count++;
			//Logger.logDebug('ResourceLoader._onResourceLoad() | File Loaded = '+this._getFileName(this.aResourceList[p_nIndex])+' : Data Length = '+this.aResourceData.count+' : Resource Length = '+this.aResourceList.length);
			if(this.aResourceData.count == this.aResourceList.length){
				if(this.fCallback){
					this.aArgs.unshift(this.oContext, this.aResourceData, this);
					this.fCallback.apply(this.oContext, this.aArgs);
					//this.fCallback.call(this.oContext, this.aResourceData.slice(0), this, this.aArgs);
				}
			}
		},
		_getFileName		: function(p_sFilePath){
			return p_sFilePath.substring(p_sFilePath.lastIndexOf('/')+1, p_sFilePath.lastIndexOf('.'));
		},
		_getFileType		: function(p_sResourcePath){
			var oPattern_extDot		= new RegExp('.xml|.html|.js|.json|.txt|.css$', 'i'),
				oPattern_ext		= new RegExp('xml|html|js|json|txt|css$', 'i'),
				sFileType;
			
			//Logger.logDebug('ResourceLoader._getFileType() | Path = '+p_sResourcePath+' : Pattern Match = '+oPattern_extDot.test(p_sResourcePath));
			if (oPattern_extDot.test(p_sResourcePath)) {
				sFileType = oPattern_ext.exec(p_sResourcePath).toString().toLowerCase();
				if(sFileType == "js"){sFileType = "script";}
				if(sFileType == "css"){sFileType = "text";}
				//Logger.logDebug('File Type >> '+sFileType);
				return sFileType;
			}
			
			return null;
		},

		/* -----------------------------------------*/
		/* 				 Public Methods 			*/
		/* -----------------------------------------*/
		setName				: function(p_name){
			this.name = p_name;
		},
		getName				: function(){
			return this.name;
		},
		loadResource		: function(p_aResourceList, p_oContext, p_fCallback, p_aArgs){
			this.aResourceList = p_aResourceList;
			if(typeof p_aResourceList === 'string'){this.aResourceList = new Array(p_aResourceList);}
			var nResourceListLength = this.aResourceList.length;
			//Logger.logDebug('ResourceLoader.loadResource() | '+(this.getName() || "")+' : '+this.aResourceList+'\n\tResource List Length = '+nResourceListLength+"\n\tResource List is Array = "+(p_aResourceList instanceof Array)+"\n\tResource List is String = "+(typeof p_aResourceList === 'string'));
			this.aResourceData			= [];
			this.aResourceData.count	= 0;
			
			this.oContext				= p_oContext;
			this.fCallback				= p_fCallback;
			this.aArgs					= p_aArgs || [];

			if(nResourceListLength){
				var i;
				for(i=0; i < nResourceListLength; i++){
					var sResourcePath	= this.aResourceList[i],
						sFileType		= this._getFileType(sResourcePath);
					
					if(sFileType){this._load(sResourcePath, sFileType, i);}
				}
			}else{
				this.aResourceList.length = 0;
				for(i in this.aResourceList){
					var sResourceID		= i,
						sResourcePath	= this.aResourceList[i],
						sFileType		= this._getFileType(sResourcePath);
					//Logger.logDebug('\tFile Type = '+sFileType);
					
					if(sFileType){this.aResourceList.length++;}
				}
				//Logger.logDebug('\tResource Length = '+this.aResourceList.length);
				for(i in this.aResourceList){
					var sResourceID		= i,
						sResourcePath	= this.aResourceList[i],
						sFileType		= this._getFileType(sResourcePath);
					//Logger.logDebug('\tResource ID = '+sResourceID+' : File Type = '+sFileType+' : Resource Path = '+sResourcePath);
					
					if(sFileType){this._load(sResourcePath, sFileType, sResourceID);}
				}
			}
			
		},
		destroy				: function(){
			//Logger.logDebug('ResourceLoader.dispose() | '+(this.getName() || ""));
			this.oScope = null;
			this.name = null;
			this.aResourceList = null;
			this.aResourceData = null;
			this.oContext = null;
			this.fCallback = null;
			aArgs = null;
		}
	};

	return ResourceLoader;
});