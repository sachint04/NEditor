
var courselistener = function(){
	EventDispatcher.call(this);
	this.pageGUID;
	
	
};

courselistener.prototype 		= Object.create(EventDispatcher.prototype);
courselistener.constructor		= courselistener;
 
courselistener.prototype.init	= function(){
	var oScope		= this;
	require(['framework/controller/CourseController'],
		function(CourseController){
			CourseController.addEventListener('PAGE_LOADED', pageUpdateListener.bind(oScope));
	});
};

courselistener.prototype.refreshPage	= function(){
	require(['framework/controller/CourseController'],
	function(controller){
		controller.reloadPage();
	});
};

courselistener.prototype.getPageText	= function(_callback){
	require(['framework/controller/CourseController'],
	function(controller){
		_callback(controller.oPageController.jsonXMLData.data.pageText);
	});
};

courselistener.prototype.getCurrentPage	= function(_callback){
	require(['framework/controller/CourseController'],
	function(controller){
		_callback(controller.getCurrentPage());
	});
};
var pageUpdateListener 	= function(evt){
	this.dispatchEvent(evt.type, {type: evt.type, target: this, controller:evt.target});
};




