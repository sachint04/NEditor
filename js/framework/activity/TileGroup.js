define([
	'framework/utils/EventDispatcher',
	'framework/utils/Logger'
], function(EventDispatcher, Logger){

	function TileGroup (p_aTilesList) {
		//Logger.logDebug('TileGroup.CONSTRUCTOR() | aTilesList = '+ p_aTilesList);
		EventDispatcher.call(this);
		this.oSelectedTile	= null;
		this.aTilesList		= p_aTilesList;

		this.handleEvents			= this._handleEvents.bind(this);
		this.handleKeyboardEvents	= this.handleKeyboardEvents.bind(this);
		this.enable(true);

		//this.aTilesList[0].focus();
	}

	TileGroup.prototype						= Object.create(EventDispatcher.prototype);
	TileGroup.prototype.constructor			= TileGroup;

	TileGroup.prototype._handleEvents			= function(e){
		//Logger.logDebug('TileGroup.handleEVent '+ e.type);
		if(typeof e.preventDefault == 'function'){e.preventDefault();}
		var sType				= e.type,
			oTile				= e.target,
			$domTile			= e.$domTile,
			sID					= oTile.getID(),
			sGroupID			= oTile.getGroupID(),
			bTileIsSelected	= oTile.isSelected();

			if(bTileIsSelected){return;}
			if(this.oSelectedTile){this.oSelectedTile.selected(false);}
			oTile.selected(true);
			this.oSelectedTile = oTile;

			this.dispatchEvent(sType, {type:sType, target:this, option:oTile, $domTile:$domTile});
	};

	TileGroup.prototype.enable				= function(p_bEnable){
	
		for(var i=0; i<this.aTilesList.length; i++){
			var oTile	= this.aTilesList[i];
			Logger.logDebug('TileGroup.enable() | Tile Grp = '+oTile.getGroupID()+' : Tile ID = '+oTile.getID());
			if(p_bEnable){
				oTile.enable(true);
				oTile.addEventListener('DRAG_START', this.handleEvents);
				oTile.addEventListener('DRAG_STOP', this.handleEvents);
				oTile.addEventListener('KEY_UP', this.handleKeyboardEvents);
				oTile.addEventListener('KEY_DOWN', this.handleKeyboardEvents);
				oTile.addEventListener('KEY_LEFT', this.handleKeyboardEvents);
				oTile.addEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			}else{
				oTile.enable(false);
				oTile.removeEventListener('DRAG_START', this.handleEvents);
				oTile.removeEventListener('DRAG_STOP', this.handleEvents);
				oTile.removeEventListener('KEY_UP', this.handleKeyboardEvents);
				oTile.removeEventListener('KEY_DOWN', this.handleKeyboardEvents);
				oTile.removeEventListener('KEY_LEFT', this.handleKeyboardEvents);
				oTile.removeEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			}
		}
	};

	TileGroup.prototype.reset					= function(){
		//Logger.logDebug("this.oSelectedTile" +this.oSelectedTile);
		if(this.oSelectedTile){
			this.oSelectedTile.selected(false);
			this.oSelectedTile = null;
		}
		this.aTilesList[0].$domTile.attr("tabindex",0);
	};

	TileGroup.prototype.handleKeyboardEvents	= function(e) {
		var nSelectedRadioIndex	= this.aTilesList.indexOf(this.oSelectedTile);
		//Logger.logDebug("TileGroup.handleKeyboardEvents() | Event Type = " +e.type+' : Radio Index = '+nSelectedRadioIndex);
		(nSelectedRadioIndex < 0) ? nSelectedRadioIndex = 0 : nSelectedRadioIndex;
		if(e.type === 'KEY_UP' || e.type === 'KEY_LEFT'){
			e.target = this.getTileToFocus(nSelectedRadioIndex-1);
			this._handleEvents(e);
		}else if(e.type === 'KEY_DOWN' || e.type === 'KEY_RIGHT'){
			e.target = this.getTileToFocus(nSelectedRadioIndex+1);
			this._handleEvents(e);
		}else if(e.type === 'KEY_SPACE' && !this.oSelectedTile){
			e.target = this.aTilesList[0];
			this._handleEvents(e);
		}
	};

	TileGroup.prototype.getTileToFocus		= function(p_nSelectedRadioIndex) {
		var nNumOfTiles	= this.aTilesList.length;
		//Logger.logDebug("TileGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Tiles = '+nNumOfTiles);
		if(p_nSelectedRadioIndex === nNumOfTiles){// ** Last Tile, so select First
			oTile	= this.aTilesList[0];
		}else if(p_nSelectedRadioIndex < 0){// ** First Tile, so select last one
			oTile	= this.aTilesList[nNumOfTiles-1];
		}else{
			oTile	= this.aTilesList[p_nSelectedRadioIndex];
		}
		return oTile;
	};

	TileGroup.prototype.updateSelection		= function(p_nSelectedRadioIndex) {
		var nNumOfTiles	= this.aTilesList.length;
		//Logger.logDebug("TileGroup.updateSelection() | Selected Radio Index = " +p_nSelectedRadioIndex+' : Num Of Tiles = '+nNumOfTiles);
		if(p_nSelectedRadioIndex === nNumOfTiles){
			oTile	= this.aTilesList[0];
		}else if(p_nSelectedRadioIndex < 0){
			oTile	= this.aTilesList[nNumOfTiles-1];
		}else{
			oTile	= this.aTilesList[p_nSelectedRadioIndex];
		}
		oTile.selected(true);
	};

	TileGroup.prototype.getSelectedTile		= function(){
		//Logger.logDebug('TileGroup.getSelectedTile() | '+this.toString());
		return this.oSelectedTile;
	};
	TileGroup.prototype.getTilesList		= function(){
		return this.aTilesList;
	};
	TileGroup.prototype.destroy				= function(){
		this.oSelectedTile = null;
		var i,
			nNumOfOptns	= this.aTilesList.length;
		for(i=0; i<nNumOfOptns; i++){
			var oTile	= this.aTilesList[i];
			oTile.enable(false);
			oTile.removeEventListener('DRAG_START', this.handleEvents);
			oTile.removeEventListener('DRAG_STOP', this.handleEvents);
			oTile.removeEventListener('KEY_UP', this.handleKeyboardEvents);
			oTile.removeEventListener('KEY_DOWN', this.handleKeyboardEvents);
			oTile.removeEventListener('KEY_LEFT', this.handleKeyboardEvents);
			oTile.removeEventListener('KEY_RIGHT', this.handleKeyboardEvents);
			oTile.destroy();
		}
		
		this.aTilesList		= null;
		this.oSelectedTile	= null;
		EventDispatcher.prototype.destroy.call(this);
		this.prototype			= null;
		
	};
	TileGroup.prototype.toString				= function(){
		return 'framework/activity/TileGroup';
	};

	return TileGroup;
});
