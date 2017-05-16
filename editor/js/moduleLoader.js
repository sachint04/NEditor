var moduleLoader  = function(){
		
	var moduleLoader = function(){
			this.path =	 "index.html";
			return this;
	};
	
	
	moduleLoader.prototype.load 	= function(path, _callback){
		$("#modulecontainer").load("index.html", function(response, status, xhr){
			if(status == "error"){
				$("#modulecontainer").html( msg + xhr.status + " " + xhr.statusText );
			}
			
			_callback();
		});	
	};
		
		
		
	return new moduleLoader();
};
