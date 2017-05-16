var main = function(){
	
		this.init = function(){
			var t = timeline($(".timlineview")); 
			var obj = {
				timesec: 8,
				fps: 25,
				currentframe:1
			};
			var loader = new moduleLoader();
			$.getJSON("editor/js/cssprops.json",function(data){
					//$csspanel 	= $('<div class="css-panel"><h4>CSS property</h4></div>');
					//$('body').append($csspanel);
					// for(var param in data){
						// $param = $('<div class="style"><label>'+param+'</label><input type="text">'+ data[param]+'</input></div>');
						// $csspanel.append($param);
					// }
					loader.load('',function(){
						t.init(timeline, data);						
					}.bind(timeline));
				}).fail(function() {
					console.log('json load failed');
				});
			
		}
	};
	
		
	//var timeline1 	=	timeline();




