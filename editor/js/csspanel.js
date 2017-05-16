var csspanel 	=	function(p_$elem){
		
		var csspanel = function(p_$elem){
			EventDispatcher.call(this);
			this.app;
			this.$view 		= p_$elem;
			this.model 	= 	[];
			this.base	=	[];
			this.view;
			this.interactable = interact(this.$view.find("h4")[0])  
			  .draggable({
			  	restrict:'body',
			    // enable inertial throwing
			    inertia: false,
			    autoScroll: false,
			    // keep the element within the area of it's parent
			     onmove: dragMoveListener,
			  })
			  .resizable({
				    inertia: true,
				    autoScroll: true
				}
			);
			this.createModel 	= this.createModel.bind(this);
			this.setModel 		= this.setModel.bind(this);
			this.getModel 		= this.getModel.bind(this);
			return this;
			
		};
		
		csspanel.prototype								= Object.create(EventDispatcher.prototype);
		csspanel.prototype.constructor					= csspanel;
		
		 function dragMoveListener (event) {
			   // console.log(event.type, event.pageX, event.pageY);
			    var target = event.target,
			        // keep the dragged position in the data-x/data-y attributes
			        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
			        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
			
			    // translate the element
				// target.style.webkitTransform =
			    // target.style.transform =
			    // 'translate(' + x + 'px, ' + y + 'px)';
			
			$(target).parent()[0].style.left = x+'px';
			$(target).parent()[0].style.top = y+'px';
				
		    // update the posiion attributes
		    target.setAttribute('data-x', x);
		    target.setAttribute('data-y', y);
	 }
			  
	 csspanel.prototype.getModel		= function(){
	 	return this.model["css"];
	 };
	 
	 csspanel.prototype.setModel		= function(oJson, view){
	 	var oScope 	= this;
	 	var freshArr		=	 angular.copy(this.base);
	 	this.model["css"] = oJson || freshArr;
	 	this.view = view;
	 	if(oJson){
		 	console.log(oJson[0].value+ " | " + oJson[0].value);	 		
	 	}
	 	
	 	
 		 var $scope = angular.element(this.elem).scope();
 		// var $cntrl 	= angular.element(this.elem).controller("cssObj");
	 	 $scope.$apply(function(){
//	 		 $scope.controller('cssObj').updateModel(oJson || oScope.base);
		 $('input#search').val("").trigger("change");
		// $scope.search = angular.copy($scope.default);
	 	 });
	
	 };
	 csspanel.prototype.createModel		= function(oJson, elem){
	 	var oScope = this;
	 	this.base =  angular.copy(oJson);
	 	this.elem = elem;
	 	this.app = angular.module('csspanel', [])
	 	.controller('cssObj', ['$scope', function($scope){
	 		$scope.model = 	oScope.model;
	 		$scope.onChange 	= function(label , value){
	 			oScope.view.css(label, value);
	 		};
	 		
	 	}]);
	 	
 			angular.bootstrap(elem, ['csspanel']);
	 };
				
		return new csspanel(p_$elem);
	};
