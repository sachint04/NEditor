var animate = function(){var cjs = createjs;var img = {};var ss 	= {};var lib = function(){return this;};lib.images = function(_img){img = _img;};

var p; // shortcut to reference prototypes
lib.webFontTxtFilters = {}; 

// library properties:
lib.properties = {
	width: 870,
	height: 322,
	fps: 24,
	color: "#FFFFFF",
	webfonts: {},
	manifest: [
		{src:"images/csec620_06_01_01.png", id:"csec620_06_01_01"},
		{src:"images/csec620_06_01_03.png", id:"csec620_06_01_03"},
		{src:"images/csec620_06_01_05.jpg", id:"csec620_06_01_05"},
		{src:"images/csec620_06_01_07.png", id:"csec620_06_01_07"}
	]
};



lib.webfontAvailable = function(family) { 
	lib.properties.webfonts[family] = true;
	var txtFilters = lib.webFontTxtFilters && lib.webFontTxtFilters[family] || [];
	for(var f = 0; f < txtFilters.length; ++f) {
		txtFilters[f].updateCache();
	}
};
// symbols:



(lib.csec620_06_01_01 = function() {
	this.initialize(img.csec620_06_01_01);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,118,158);


(lib.csec620_06_01_03 = function() {
	this.initialize(img.csec620_06_01_03);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,433,330);


(lib.csec620_06_01_05 = function() {
	this.initialize(img.csec620_06_01_05);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,735,329);


(lib.csec620_06_01_07 = function() {
	this.initialize(img.csec620_06_01_07);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,615,91);


(lib.mc_outline = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AIAjAIBaiiIn/gDIgIgIIqsAAIBiD7IAAHPIKiARIFRhcIADnO");
	this.shape.setTransform(-0.5,0.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],-59.2,0,60.3,0).s().p("An3FdIAAnPIhij7IKsAAIAIAIIH/ADIhaCiIgCAEIgCHOIlSBcg");
	this.shape_1.setTransform(-0.5,0.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-61.7,-37.5,122.5,75.3);


(lib.gr_box6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("ACLArQgHgEgEgJQgEgJAAgMQAAgLAEgKQAEgLAHgGQAGgGAHgDQAHgEAJgBIAFAAIAEgBIAAALIgEAAIgFAAQgKACgHAFQgGAEgEAHQgEAHgBAHIABAAQADgEAFgDQAGgDAIAAQAIAAAGAEQAGADADAFQAEAGAAAJQAAAJgEAHQgDAHgHAFQgHAEgJAAQgKAAgHgFgACQAAQgEACgDAFIgBADIAAADQAAAHACAGQACAGAFADQAEAEAHAAQAIAAAFgGQAEgGABgKQgBgKgFgFQgFgEgIAAQgGAAgFACgAiqAvIgIgCIgHgDIADgKIAKAEIAMACQAJAAAGgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHAAgKQAAgHAEgGQAEgFAHgEQAGgDAKAAQAHAAAFABIAIADIgDAKIgHgCIgLgCQgGAAgEACQgEACgCAEQgCADAAADQAAAHAFAEQAEAEAKADQAMAFAGAEQAGAHAAAKQAAAHgDAHQgEAGgHADQgIAEgLAAIgJgBgAAZAvIAAhbIALgCIANAAQAJAAAGACQAHACAEAEQAEADACAFQACAFAAAGQAAAHgBAFQgCAFgEACQgFAFgHACQgIADgJAAIgFAAIgEgBIAAAmgAAqgkIgEAAIAAAkIAEAAIAGAAQALAAAGgDQAGgFAAgKQAAgJgGgFQgGgFgKAAIgHABgAgqAvIAAhdIAxAAIAAALIgkAAIAAAdIAiAAIAAAJIgiAAIAAAhIAmAAIAAALgAhdAvIAAhSIgdAAIAAgLIBGAAIAAALIgdAAIAABSg");
	this.shape_10.setTransform(-16.6,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgACqgpIgFAAQgJABgHAEQgIADgGAGQgGAGgFALQgEAKAAALQAAAMAEAJQAEAJAHAEQAHAFAKAAQAKAAAGgEQAHgFAEgHQADgHAAgJQAAgJgDgGQgEgFgGgDQgGgEgIAAQgIAAgFADQgGADgDADIAAAAQABgGADgHQAEgHAHgEQAHgFAJgCIAFAAIAEAAIAAgLIgDABgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACNAlQgEgDgCgGQgDgGAAgHIABgDIABgDQACgFAFgDQAFgBAFAAQAJAAAFAEQAFAFAAAKQAAAKgFAGQgFAGgIAAQgGAAgFgEgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_box5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("ACkjKIqYAAIAAHRIKfAQIFKhaIAAnTIrGAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AligjQB2AYB1AVQARAEASADIBnAWAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("ACIAuQgGgBgDgCIADgKIAIAEQAFABAGAAQAHAAAEgCQAFgCADgFQADgEAAgGQAAgJgHgGQgFgEgOAAIgHAAIgGAAIAGgqIAsAAIAAAKIgjAAIgDAXIACAAIAFAAIAKABQAFABAFADQAFADAEAEQADAGAAAIQABAJgFAHQgFAHgHAEQgIAEgKAAQgHAAgGgCgAioAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAAcAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAtgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgoAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhbAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_10.setTransform(-16.8,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AtQADACAGABQAGACAIAAQAKAAAHgEQAIgEAEgHQAFgHAAgJQAAgIgEgGQgEgFgFgCQgFgDgFgBIgKgBIgEAAIgDAAIADgXIAjAAIAAgKIgsAAIgGApIAGAAIAHgBQAOABAGAFQAGAGAAAJQAAAGgDAEQgDAFgFACQgEACgGAAQgHAAgFgBIgIgEgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_box4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AirAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgACiAvIAAgZIgqAAIAAgIIAog4IAOAAIAAA2IANAAIAAAKIgNAAIAAAZgACfgXIgEAGIgWAdIAdAAIAAgcIABgOIgBAAIgDAHgAAZAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAqgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgrAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAheAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_10.setTransform(-16.5,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAB1AQIAAAIIArAAIAAAZIALAAIAAgZIANAAIAAgKIgNAAIAAg2IgNAAgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACCAOIAWgdIAEgGIAEgHIAAAAIAAAOIAAAcgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_box3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("ACIAuIgJgEIADgJIAIADQAGACAHAAQAHAAAFgDQAFgCABgEQACgEAAgEQAAgHgEgEQgDgEgFgCQgFgBgHAAIgHAAIAAgIIAHAAIAJgBQAGgCACgDQADgEABgFQAAgEgCgDQgCgDgDgCQgDgCgGAAQgGAAgEACIgIAEIgEgJQAEgDAGgCQAHgCAHAAQAJAAAGADQAGADADAFQACAFAAAGQAAAHgEAGQgEAFgJADIAAABQAGAAAEACQAFADADAFQADAFgBAGQABAHgEAHQgEAGgHADQgIAEgKAAQgJAAgGgCgAioAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAAcAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAtgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgoAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhbAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_10.setTransform(-16.8,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AsIAKAEQAGACAIAAQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgGgDgFQgDgFgEgDQgFgDgFgBIAAAAQAIgCAEgFQAEgGAAgHQAAgGgCgFQgDgFgGgDQgGgDgJAAQgHAAgGACQgHACgDADIADAJIAIgEQAEgCAGAAQAGAAADACQAEACABADQACADAAAEQAAAFgDAEQgDADgFACIgJABIgHAAIAAAIIAHAAQAGAAAFABQAFACAEAEQADAEAAAHQAAAEgCAEQgBAEgFACQgEADgIAAQgHAAgFgCIgJgDgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_box2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AipAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAB+AvIAAgIIAKgJIATgTQAHgIAEgFQAEgHAAgHQAAgEgCgEQgCgEgEgDQgDgCgHAAQgGAAgFACQgGACgCADIgFgJQAGgEAGgCQAHgDAHAAQAKAAAGAEQAHAEADAGQACAGAAAHQAAAIgEAIQgEAFgGAIIgRASIgHAGIAoAAIAAALgAAbAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAsgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgpAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhcAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_10.setTransform(-16.7,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgACegdQAEADABAEQACAEAAAEQAAAHgEAHQgDAFgIAIIgTATIgJAJIAAAIIA6AAIAAgLIgpAAIAHgGIARgSQAHgIADgGQAEgHAAgIQAAgHgCgGQgDgGgHgEQgGgEgJAAQgIAAgHADQgGACgFAEIAEAJQADgDAFgCQAFgCAGAAQAHAAAEACgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_box1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// box
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape.setTransform(33.7,-8.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_1.setTransform(33.7,27.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_2.setTransform(34.5,9.2);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_3.setTransform(33.3,8.9);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_4.setTransform(-35.6,-15.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_5.setTransform(0,8.9);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_6.setTransform(14.5,-15.4);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_7.setTransform(-16.5,12.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_8.setTransform(-16.8,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_9.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// text
	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AifAvIgIgCIgHgDIADgKIAKAEIAMACQAJAAAGgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHAAgKQAAgHAEgGQAEgFAHgEQAGgDAKAAQAHAAAFABIAIADIgDAKIgHgCIgLgCQgGAAgEACQgEACgCAEQgCADAAADQAAAHAFAEQAEAEAKADQAMAFAGAEQAGAHAAAKQAAAHgDAHQgEAGgHADQgIAEgLAAIgJgBgACjAvIAAhOIgBAAIgPAJIgDgKIAUgKIALAAIAABZgAAkAvIAAhbIALgCIANAAQAJAAAGACQAHACAEAEQAEADACAFQACAFAAAGQAAAHgBAFQgCAFgEACQgFAFgHACQgIADgJAAIgFAAIgEgBIAAAmgAA1gkIgEAAIAAAkIAEAAIAGAAQALAAAGgDQAGgFAAgKQAAgJgGgFQgGgFgKAAIgHABgAgfAvIAAhdIAxAAIAAALIgkAAIAAAdIAiAAIAAAJIgiAAIAAAhIAmAAIAAALgAhSAvIAAhSIgdAAIAAgLIBGAAIAAALIgdAAIAABSg");
	this.shape_10.setTransform(-17.7,11.8);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLg");
	this.shape_11.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11},{t:this.shape_10}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.gr_ani6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 10
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape.setTransform(-49.8,28.3);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({x:-49,y:29.9},0).wait(1).to({x:-48.2,y:31.5},0).wait(1).to({x:-47.3,y:33.1},0).wait(1).to({x:-46.5,y:34.7},0).wait(1).to({x:-45.7,y:36.3},0).wait(1).to({x:-44.8,y:37.9},0).wait(1).to({x:-44,y:39.5},0).wait(1).to({x:-43.2,y:41.1},0).wait(1).to({x:-42.3,y:42.7},0).wait(1));

	// Layer 2
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_1.setTransform(-43.3,13.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1).to({x:-44,y:15.1},0).wait(1).to({x:-44.8,y:16.8},0).wait(1).to({x:-45.5,y:18.4},0).wait(1).to({x:-46.2,y:20.1},0).wait(1).to({x:-46.9,y:21.7},0).wait(1).to({x:-47.7,y:23.3},0).wait(1).to({x:-48.4,y:25},0).wait(1).to({x:-49.1,y:26.6},0).wait(1).to({x:-49.8,y:28.3},0).wait(1));

	// Layer 3
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_2.setTransform(-27.4,0);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(1).to({x:-29.1,y:1.5},0).wait(1).to({x:-30.9,y:3},0).wait(1).to({x:-32.7,y:4.5},0).wait(1).to({x:-34.5,y:6},0).wait(1).to({x:-36.2,y:7.5},0).wait(1).to({x:-38,y:9},0).wait(1).to({x:-39.8,y:10.5},0).wait(1).to({x:-41.6,y:12},0).wait(1).to({x:-43.3,y:13.5},0).wait(1));

	// Layer 4
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_3.setTransform(-9.9,-9.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(1).to({x:-11.8,y:-8.6},0).wait(1).to({x:-13.8,y:-7.5},0).wait(1).to({x:-15.7,y:-6.4},0).wait(1).to({x:-17.7,y:-5.3},0).wait(1).to({x:-19.6,y:-4.3},0).wait(1).to({x:-21.5,y:-3.2},0).wait(1).to({x:-23.5,y:-2.1},0).wait(1).to({x:-25.4,y:-1},0).wait(1).to({x:-27.4,y:0},0).wait(1));

	// Layer 5
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_4.setTransform(6.6,-16.9);

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(1).to({x:4.8,y:-16.1},0).wait(1).to({x:3,y:-15.3},0).wait(1).to({x:1.1,y:-14.5},0).wait(1).to({x:-0.7,y:-13.7},0).wait(1).to({x:-2.5,y:-12.8},0).wait(1).to({x:-4.4,y:-12},0).wait(1).to({x:-6.2,y:-11.2},0).wait(1).to({x:-8,y:-10.4},0).wait(1).to({x:-9.9,y:-9.6},0).wait(1));

	// Layer 6
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_5.setTransform(22,-21.3);

	this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1).to({x:20.3,y:-20.8},0).wait(1).to({x:18.6,y:-20.3},0).wait(1).to({x:16.9,y:-19.8},0).wait(1).to({x:15.2,y:-19.3},0).wait(1).to({x:13.4,y:-18.8},0).wait(1).to({x:11.7,y:-18.3},0).wait(1).to({x:10,y:-17.9},0).wait(1).to({x:8.3,y:-17.4},0).wait(1).to({x:6.6,y:-16.9},0).wait(1));

	// Layer 7
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_6.setTransform(36.3,-25.2);

	this.timeline.addTween(cjs.Tween.get(this.shape_6).wait(1).to({x:34.7,y:-24.8},0).wait(1).to({x:33.1,y:-24.3},0).wait(1).to({x:31.5,y:-23.9},0).wait(1).to({x:29.9,y:-23.5},0).wait(1).to({x:28.3,y:-23},0).wait(1).to({x:26.7,y:-22.6},0).wait(1).to({x:25.2,y:-22.2},0).wait(1).to({x:23.6,y:-21.7},0).wait(1).to({x:22,y:-21.3},0).wait(1));

	// Layer 8
	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_7.setTransform(49.9,-28.2);

	this.timeline.addTween(cjs.Tween.get(this.shape_7).wait(1).to({x:48.4,y:-27.9},0).wait(1).to({x:46.9,y:-27.6},0).wait(1).to({x:45.3,y:-27.2},0).wait(1).to({x:43.8,y:-26.9},0).wait(1).to({x:42.3,y:-26.6},0).wait(1).to({x:40.8,y:-26.2},0).wait(1).to({x:39.3,y:-25.9},0).wait(1).to({x:37.8,y:-25.6},0).wait(1).to({x:36.3,y:-25.2},0).wait(1));

	// Layer 9
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#162437").s().p("AgiAvIAAheIBFABIAABeg");
	this.shape_8.setTransform(49.9,-28.2);

	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(10));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-53.4,-33,106.8,66.2);


(lib.gr_ani5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape.setTransform(364.8,17.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({x:367},0).wait(1).to({x:369.2},0).wait(1).to({x:371.5},0).wait(1).to({x:373.7},0).wait(1).to({x:375.9},0).wait(1).to({x:378.1},0).wait(1).to({x:380.4},0).wait(1).to({x:382.6},0).wait(1).to({x:384.8},0).wait(1));

	// Layer 3
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_1.setTransform(344.8,17.7);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(1).to({x:347},0).wait(1).to({x:349.2},0).wait(1).to({x:351.4},0).wait(1).to({x:353.7},0).wait(1).to({x:355.9},0).wait(1).to({x:358.1},0).wait(1).to({x:360.3},0).wait(1).to({x:362.6},0).wait(1).to({x:364.8},0).wait(1));

	// Layer 4
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_2.setTransform(324.7,17.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_3.setTransform(331.4,17.6);
	this.shape_3._off = true;

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_4.setTransform(340.3,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2,p:{x:324.7}}]}).to({state:[{t:this.shape_2,p:{x:326.9}}]},1).to({state:[{t:this.shape_2,p:{x:329.1}}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4,p:{x:340.3}}]},1).to({state:[{t:this.shape_4,p:{x:342.5}}]},1).to({state:[{t:this.shape_4,p:{x:344.8}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(3).to({_off:false},0).wait(1).to({x:333.6},0).wait(1).to({x:335.8},0).wait(1).to({x:338.1},0).to({_off:true},1).wait(3));

	// Layer 5
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_5.setTransform(304.8,17.7);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_6.setTransform(311.4,17.6);
	this.shape_6._off = true;

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_7.setTransform(320.3,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5,p:{x:304.8}}]}).to({state:[{t:this.shape_5,p:{x:307}}]},1).to({state:[{t:this.shape_5,p:{x:309.2}}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7,p:{x:320.3}}]},1).to({state:[{t:this.shape_7,p:{x:322.5}}]},1).to({state:[{t:this.shape_7,p:{x:324.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_6).wait(3).to({_off:false},0).wait(1).to({x:313.6},0).wait(1).to({x:315.8},0).wait(1).to({x:318},0).to({_off:true},1).wait(3));

	// Layer 6
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_8.setTransform(284.9,17.6);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_9.setTransform(291.5,17.6);
	this.shape_9._off = true;

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_10.setTransform(300.4,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8,p:{x:284.9}}]}).to({state:[{t:this.shape_8,p:{x:287.1}}]},1).to({state:[{t:this.shape_8,p:{x:289.3}}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10,p:{x:300.4}}]},1).to({state:[{t:this.shape_10,p:{x:302.6}}]},1).to({state:[{t:this.shape_10,p:{x:304.8}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_9).wait(3).to({_off:false},0).wait(1).to({x:293.7},0).wait(1).to({x:295.9},0).wait(1).to({x:298.1},0).to({_off:true},1).wait(3));

	// Layer 7
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_11.setTransform(264.7,17.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_12.setTransform(271.4,17.6);
	this.shape_12._off = true;

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_13.setTransform(280.4,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11,p:{x:264.7}}]}).to({state:[{t:this.shape_11,p:{x:267}}]},1).to({state:[{t:this.shape_11,p:{x:269.2}}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13,p:{x:280.4}}]},1).to({state:[{t:this.shape_13,p:{x:282.6}}]},1).to({state:[{t:this.shape_13,p:{x:284.9}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_12).wait(3).to({_off:false},0).wait(1).to({x:273.7},0).wait(1).to({x:275.9},0).wait(1).to({x:278.2},0).to({_off:true},1).wait(3));

	// Layer 8
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_14.setTransform(244.7,17.6);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_15.setTransform(251.4,17.6);
	this.shape_15._off = true;

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_16.setTransform(260.3,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14,p:{x:244.7}}]}).to({state:[{t:this.shape_14,p:{x:246.9}}]},1).to({state:[{t:this.shape_14,p:{x:249.2}}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16,p:{x:260.3}}]},1).to({state:[{t:this.shape_16,p:{x:262.5}}]},1).to({state:[{t:this.shape_16,p:{x:264.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_15).wait(3).to({_off:false},0).wait(1).to({x:253.6},0).wait(1).to({x:255.8},0).wait(1).to({x:258.1},0).to({_off:true},1).wait(3));

	// Layer 9
	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_17.setTransform(224.6,17.7);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_18.setTransform(231.3,17.6);
	this.shape_18._off = true;

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_19.setTransform(240.2,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17,p:{x:224.6}}]}).to({state:[{t:this.shape_17,p:{x:226.8}}]},1).to({state:[{t:this.shape_17,p:{x:229.1}}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19,p:{x:240.2}}]},1).to({state:[{t:this.shape_19,p:{x:242.5}}]},1).to({state:[{t:this.shape_19,p:{x:244.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_18).wait(3).to({_off:false},0).wait(1).to({x:233.5},0).wait(1).to({x:235.8},0).wait(1).to({x:238},0).to({_off:true},1).wait(3));

	// Layer 10
	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_20.setTransform(204.6,17.6);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_21.setTransform(211.2,17.6);
	this.shape_21._off = true;

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_22.setTransform(220.1,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_20,p:{x:204.6}}]}).to({state:[{t:this.shape_20,p:{x:206.8}}]},1).to({state:[{t:this.shape_20,p:{x:209}}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22,p:{x:220.1}}]},1).to({state:[{t:this.shape_22,p:{x:222.4}}]},1).to({state:[{t:this.shape_22,p:{x:224.6}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_21).wait(3).to({_off:false},0).wait(1).to({x:213.5},0).wait(1).to({x:215.7},0).wait(1).to({x:217.9},0).to({_off:true},1).wait(3));

	// Layer 11
	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_23.setTransform(184.7,17.7);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_24.setTransform(191.3,17.6);
	this.shape_24._off = true;

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_25.setTransform(200.2,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_23,p:{x:184.7}}]}).to({state:[{t:this.shape_23,p:{x:186.9}}]},1).to({state:[{t:this.shape_23,p:{x:189.1}}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25,p:{x:200.2}}]},1).to({state:[{t:this.shape_25,p:{x:202.4}}]},1).to({state:[{t:this.shape_25,p:{x:204.6}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_24).wait(3).to({_off:false},0).wait(1).to({x:193.5},0).wait(1).to({x:195.8},0).wait(1).to({x:198},0).to({_off:true},1).wait(3));

	// Layer 12
	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_26.setTransform(164.7,17.6);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_27.setTransform(171.4,17.6);
	this.shape_27._off = true;

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_28.setTransform(180.3,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_26,p:{x:164.7}}]}).to({state:[{t:this.shape_26,p:{x:166.9}}]},1).to({state:[{t:this.shape_26,p:{x:169.2}}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_28,p:{x:180.3}}]},1).to({state:[{t:this.shape_28,p:{x:182.5}}]},1).to({state:[{t:this.shape_28,p:{x:184.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_27).wait(3).to({_off:false},0).wait(1).to({x:173.6},0).wait(1).to({x:175.8},0).wait(1).to({x:178.1},0).to({_off:true},1).wait(3));

	// Layer 13
	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_29.setTransform(144.7,17.7);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_30.setTransform(151.4,17.6);
	this.shape_30._off = true;

	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_31.setTransform(160.3,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_29,p:{x:144.7}}]}).to({state:[{t:this.shape_29,p:{x:146.9}}]},1).to({state:[{t:this.shape_29,p:{x:149.2}}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_30}]},1).to({state:[{t:this.shape_31,p:{x:160.3}}]},1).to({state:[{t:this.shape_31,p:{x:162.5}}]},1).to({state:[{t:this.shape_31,p:{x:164.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_30).wait(3).to({_off:false},0).wait(1).to({x:153.6},0).wait(1).to({x:155.8},0).wait(1).to({x:158.1},0).to({_off:true},1).wait(3));

	// Layer 14
	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_32.setTransform(124.7,17.6);

	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_33.setTransform(131.4,17.6);
	this.shape_33._off = true;

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_34.setTransform(140.3,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_32,p:{x:124.7}}]}).to({state:[{t:this.shape_32,p:{x:126.9}}]},1).to({state:[{t:this.shape_32,p:{x:129.2}}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_33}]},1).to({state:[{t:this.shape_34,p:{x:140.3}}]},1).to({state:[{t:this.shape_34,p:{x:142.5}}]},1).to({state:[{t:this.shape_34,p:{x:144.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_33).wait(3).to({_off:false},0).wait(1).to({x:133.6},0).wait(1).to({x:135.8},0).wait(1).to({x:138.1},0).to({_off:true},1).wait(3));

	// Layer 15
	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_35.setTransform(104.7,17.7);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_36.setTransform(111.4,17.6);
	this.shape_36._off = true;

	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_37.setTransform(120.3,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_35,p:{x:104.7}}]}).to({state:[{t:this.shape_35,p:{x:106.9}}]},1).to({state:[{t:this.shape_35,p:{x:109.2}}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_36}]},1).to({state:[{t:this.shape_37,p:{x:120.3}}]},1).to({state:[{t:this.shape_37,p:{x:122.5}}]},1).to({state:[{t:this.shape_37,p:{x:124.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_36).wait(3).to({_off:false},0).wait(1).to({x:113.6},0).wait(1).to({x:115.8},0).wait(1).to({x:118.1},0).to({_off:true},1).wait(3));

	// Layer 16
	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_38.setTransform(84.7,17.6);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_39.setTransform(91.4,17.6);
	this.shape_39._off = true;

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_40.setTransform(100.3,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_38,p:{x:84.7}}]}).to({state:[{t:this.shape_38,p:{x:86.9}}]},1).to({state:[{t:this.shape_38,p:{x:89.2}}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_39}]},1).to({state:[{t:this.shape_40,p:{x:100.3}}]},1).to({state:[{t:this.shape_40,p:{x:102.5}}]},1).to({state:[{t:this.shape_40,p:{x:104.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_39).wait(3).to({_off:false},0).wait(1).to({x:93.6},0).wait(1).to({x:95.8},0).wait(1).to({x:98.1},0).to({_off:true},1).wait(3));

	// Layer 17
	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_41.setTransform(64.7,17.7);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_42.setTransform(71.4,17.6);
	this.shape_42._off = true;

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_43.setTransform(80.3,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_41,p:{x:64.7}}]}).to({state:[{t:this.shape_41,p:{x:66.9}}]},1).to({state:[{t:this.shape_41,p:{x:69.1}}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_42}]},1).to({state:[{t:this.shape_43,p:{x:80.3}}]},1).to({state:[{t:this.shape_43,p:{x:82.5}}]},1).to({state:[{t:this.shape_43,p:{x:84.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_42).wait(3).to({_off:false},0).wait(1).to({x:73.6},0).wait(1).to({x:75.8},0).wait(1).to({x:78},0).to({_off:true},1).wait(3));

	// Layer 18
	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_44.setTransform(44.6,17.6);

	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_45.setTransform(51.3,17.6);
	this.shape_45._off = true;

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#162437").s().p("Ag2BMIAAiWIBtAAIAACWg");
	this.shape_46.setTransform(60.2,17.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_44,p:{x:44.6}}]}).to({state:[{t:this.shape_44,p:{x:46.8}}]},1).to({state:[{t:this.shape_44,p:{x:49}}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_45}]},1).to({state:[{t:this.shape_46,p:{x:60.2}}]},1).to({state:[{t:this.shape_46,p:{x:62.4}}]},1).to({state:[{t:this.shape_46,p:{x:64.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_45).wait(3).to({_off:false},0).wait(1).to({x:53.5},0).wait(1).to({x:55.7},0).wait(1).to({x:58},0).to({_off:true},1).wait(3));

	// Layer 19
	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_47.setTransform(24.8,17.6);

	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_48.setTransform(35.8,17.6);
	this.shape_48._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_47).wait(1).to({x:27},0).wait(1).to({x:29.2},0).wait(1).to({x:31.4},0).wait(1).to({x:33.6},0).to({_off:true},1).wait(5));
	this.timeline.addTween(cjs.Tween.get(this.shape_48).wait(5).to({_off:false},0).wait(1).to({x:38},0).wait(1).to({x:40.2},0).wait(1).to({x:42.4},0).wait(1).to({x:44.6},0).wait(1));

	// Layer 20
	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_49.setTransform(4.7,17.5);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_50.setTransform(11.4,17.6);
	this.shape_50._off = true;

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_51.setTransform(20.3,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_49,p:{x:4.7}}]}).to({state:[{t:this.shape_49,p:{x:6.9}}]},1).to({state:[{t:this.shape_49,p:{x:9.1}}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_50}]},1).to({state:[{t:this.shape_51,p:{x:20.3}}]},1).to({state:[{t:this.shape_51,p:{x:22.5}}]},1).to({state:[{t:this.shape_51,p:{x:24.8}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_50).wait(3).to({_off:false},0).wait(1).to({x:13.6},0).wait(1).to({x:15.8},0).wait(1).to({x:18.1},0).to({_off:true},1).wait(3));

	// Layer 21
	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_52.setTransform(-15.2,17.6);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_53.setTransform(-8.6,17.6);
	this.shape_53._off = true;

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_54.setTransform(0.3,17.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_52,p:{x:-15.2}}]}).to({state:[{t:this.shape_52,p:{x:-13}}]},1).to({state:[{t:this.shape_52,p:{x:-10.8}}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_53}]},1).to({state:[{t:this.shape_54,p:{x:0.3}}]},1).to({state:[{t:this.shape_54,p:{x:2.5}}]},1).to({state:[{t:this.shape_54,p:{x:4.7}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_53).wait(3).to({_off:false},0).wait(1).to({x:-6.4},0).wait(1).to({x:-4.1},0).wait(1).to({x:-1.9},0).to({_off:true},1).wait(3));

	// Layer 22
	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_55.setTransform(-35.3,17.5);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_56.setTransform(-28.6,17.6);
	this.shape_56._off = true;

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_57.setTransform(-19.6,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_55,p:{x:-35.3}}]}).to({state:[{t:this.shape_55,p:{x:-33}}]},1).to({state:[{t:this.shape_55,p:{x:-30.8}}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_56}]},1).to({state:[{t:this.shape_57,p:{x:-19.6}}]},1).to({state:[{t:this.shape_57,p:{x:-17.4}}]},1).to({state:[{t:this.shape_57,p:{x:-15.2}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_56).wait(3).to({_off:false},0).wait(1).to({x:-26.3},0).wait(1).to({x:-24.1},0).wait(1).to({x:-21.9},0).to({_off:true},1).wait(3));

	// Layer 23
	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_58.setTransform(-55.4,17.6);

	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_59.setTransform(-48.7,17.6);
	this.shape_59._off = true;

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_60.setTransform(-39.8,17.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_58,p:{x:-55.4}}]}).to({state:[{t:this.shape_58,p:{x:-53.2}}]},1).to({state:[{t:this.shape_58,p:{x:-50.9}}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_60,p:{x:-39.8}}]},1).to({state:[{t:this.shape_60,p:{x:-37.5}}]},1).to({state:[{t:this.shape_60,p:{x:-35.3}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_59).wait(3).to({_off:false},0).wait(1).to({x:-46.5},0).wait(1).to({x:-44.2},0).wait(1).to({x:-42},0).to({_off:true},1).wait(3));

	// Layer 24
	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_61.setTransform(-75.5,17.5);

	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_62.setTransform(-68.8,17.6);
	this.shape_62._off = true;

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_63.setTransform(-59.9,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_61,p:{x:-75.5}}]}).to({state:[{t:this.shape_61,p:{x:-73.3}}]},1).to({state:[{t:this.shape_61,p:{x:-71.1}}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_62}]},1).to({state:[{t:this.shape_63,p:{x:-59.9}}]},1).to({state:[{t:this.shape_63,p:{x:-57.7}}]},1).to({state:[{t:this.shape_63,p:{x:-55.4}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_62).wait(3).to({_off:false},0).wait(1).to({x:-66.6},0).wait(1).to({x:-64.4},0).wait(1).to({x:-62.1},0).to({_off:true},1).wait(3));

	// Layer 25
	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_64.setTransform(-95.6,17.6);

	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_65.setTransform(-88.9,17.6);
	this.shape_65._off = true;

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#162437").s().p("Ag2BMIAAiXIBtAAIAACXg");
	this.shape_66.setTransform(-80,17.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_64,p:{x:-95.6}}]}).to({state:[{t:this.shape_64,p:{x:-93.3}}]},1).to({state:[{t:this.shape_64,p:{x:-91.1}}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_65}]},1).to({state:[{t:this.shape_66,p:{x:-80}}]},1).to({state:[{t:this.shape_66,p:{x:-77.8}}]},1).to({state:[{t:this.shape_66,p:{x:-75.5}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_65).wait(3).to({_off:false},0).wait(1).to({x:-86.7},0).wait(1).to({x:-84.4},0).wait(1).to({x:-82.2},0).to({_off:true},1).wait(3));

	// Layer 26
	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_67.setTransform(-115.6,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_67).wait(1).to({x:-113.4},0).wait(1).to({x:-111.1},0).wait(1).to({x:-108.9},0).wait(1).to({x:-106.7},0).wait(1).to({x:-104.5},0).wait(1).to({x:-102.2},0).wait(1).to({x:-100},0).wait(1).to({x:-97.8},0).wait(1).to({x:-95.6},0).wait(1));

	// Layer 27
	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_68.setTransform(-135.6,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_68).wait(1).to({x:-133.4},0).wait(1).to({x:-131.2},0).wait(1).to({x:-128.9},0).wait(1).to({x:-126.7},0).wait(1).to({x:-124.5},0).wait(1).to({x:-122.3},0).wait(1).to({x:-120},0).wait(1).to({x:-117.8},0).wait(1).to({x:-115.6},0).wait(1));

	// Layer 28
	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_69.setTransform(-155.7,17.6);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#162437").s().p("Ag2BLIAAiWIBtAAIAACWg");
	this.shape_70.setTransform(-144.6,17.6);
	this.shape_70._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_69).wait(1).to({x:-153.5},0).wait(1).to({x:-151.3},0).wait(1).to({x:-149},0).wait(1).to({x:-146.8},0).to({_off:true},1).wait(5));
	this.timeline.addTween(cjs.Tween.get(this.shape_70).wait(5).to({_off:false},0).wait(1).to({x:-142.3},0).wait(1).to({x:-140.1},0).wait(1).to({x:-137.9},0).wait(1).to({x:-135.6},0).wait(1));

	// Layer 29
	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_71.setTransform(-175.7,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_71).wait(1).to({x:-173.5},0).wait(1).to({x:-171.2},0).wait(1).to({x:-169},0).wait(1).to({x:-166.8},0).wait(1).to({x:-164.6},0).wait(1).to({x:-162.4},0).wait(1).to({x:-160.2},0).wait(1).to({x:-157.9},0).wait(1).to({x:-155.7},0).wait(1));

	// Layer 30
	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_72.setTransform(-195.8,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_72).wait(1).to({x:-193.6},0).wait(1).to({x:-191.3},0).wait(1).to({x:-189.1},0).wait(1).to({x:-186.9},0).wait(1).to({x:-184.6},0).wait(1).to({x:-182.4},0).wait(1).to({x:-180.2},0).wait(1).to({x:-177.9},0).wait(1).to({x:-175.7},0).wait(1));

	// Layer 31
	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_73.setTransform(-215.8,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_73).wait(1).to({x:-213.6},0).wait(1).to({x:-211.3},0).wait(1).to({x:-209.1},0).wait(1).to({x:-206.9},0).wait(1).to({x:-204.7},0).wait(1).to({x:-202.5},0).wait(1).to({x:-200.3},0).wait(1).to({x:-198},0).wait(1).to({x:-195.8},0).wait(1));

	// Layer 32
	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_74.setTransform(-235.8,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_74).wait(1).to({x:-233.6},0).wait(1).to({x:-231.4},0).wait(1).to({x:-229.1},0).wait(1).to({x:-226.9},0).wait(1).to({x:-224.7},0).wait(1).to({x:-222.5},0).wait(1).to({x:-220.2},0).wait(1).to({x:-218},0).wait(1).to({x:-215.8},0).wait(1));

	// Layer 33
	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_75.setTransform(-255.9,17.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_75).wait(1).to({x:-253.6},0).wait(1).to({x:-251.4},0).wait(1).to({x:-249.2},0).wait(1).to({x:-247},0).wait(1).to({x:-244.7},0).wait(1).to({x:-242.5},0).wait(1).to({x:-240.3},0).wait(1).to({x:-238.1},0).wait(1).to({x:-235.8},0).wait(1));

	// Layer 34
	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_76.setTransform(-275.7,15.9);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#162437").s().p("Ag7BMIAAiXIB3AAIAACXg");
	this.shape_77.setTransform(-271.3,16.3);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#162437").s().p("Ag6BLIAAiWIB1AAIAACWg");
	this.shape_78.setTransform(-269.1,16.5);

	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#162437").s().p("Ag5BLIAAiVIBzAAIAACVg");
	this.shape_79.setTransform(-266.9,16.7);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#162437").s().p("Ag5BLIAAiWIBzAAIAACWg");
	this.shape_80.setTransform(-264.7,16.8);

	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#162437").s().p("Ag4BLIAAiWIBxAAIAACWg");
	this.shape_81.setTransform(-262.5,17);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#162437").s().p("Ag4BMIAAiWIBwAAIAACWg");
	this.shape_82.setTransform(-260.3,17.2);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#162437").s().p("Ag3BLIAAiWIBvAAIAACWg");
	this.shape_83.setTransform(-258.1,17.4);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#162437").s().p("Ag2BLIAAiVIBtAAIAACVg");
	this.shape_84.setTransform(-255.9,17.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_76,p:{x:-275.7,y:15.9}}]}).to({state:[{t:this.shape_76,p:{x:-273.5,y:16.1}}]},1).to({state:[{t:this.shape_77}]},1).to({state:[{t:this.shape_78}]},1).to({state:[{t:this.shape_79}]},1).to({state:[{t:this.shape_80}]},1).to({state:[{t:this.shape_81}]},1).to({state:[{t:this.shape_82}]},1).to({state:[{t:this.shape_83}]},1).to({state:[{t:this.shape_84}]},1).wait(1));

	// Layer 35
	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_85.setTransform(-290.8,13.6);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_86.setTransform(-289.1,13.8);

	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_87.setTransform(-285.7,14.4);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f("#162437").s().p("Ag8BLIAAiVIB5AAIAACVg");
	this.shape_88.setTransform(-282.4,14.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_85,p:{x:-290.8,y:13.6}}]}).to({state:[{t:this.shape_86,p:{x:-289.1,y:13.8}}]},1).to({state:[{t:this.shape_86,p:{x:-287.4,y:14.1}}]},1).to({state:[{t:this.shape_87}]},1).to({state:[{t:this.shape_86,p:{x:-284.1,y:14.6}}]},1).to({state:[{t:this.shape_88}]},1).to({state:[{t:this.shape_85,p:{x:-280.7,y:15.1}}]},1).to({state:[{t:this.shape_86,p:{x:-279,y:15.4}}]},1).to({state:[{t:this.shape_85,p:{x:-277.4,y:15.7}}]},1).to({state:[{t:this.shape_85,p:{x:-275.7,y:15.9}}]},1).wait(1));

	// Layer 36
	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_89.setTransform(-311,10.2);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_90.setTransform(-308.7,10.6);

	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_91.setTransform(-302,11.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_89}]}).to({state:[{t:this.shape_90,p:{x:-308.7,y:10.6}}]},1).to({state:[{t:this.shape_90,p:{x:-306.5,y:10.9}}]},1).to({state:[{t:this.shape_89}]},1).to({state:[{t:this.shape_91}]},1).to({state:[{t:this.shape_89}]},1).to({state:[{t:this.shape_89}]},1).to({state:[{t:this.shape_90,p:{x:-295.3,y:12.8}}]},1).to({state:[{t:this.shape_90,p:{x:-293,y:13.2}}]},1).to({state:[{t:this.shape_89}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_89).to({_off:true},1).wait(2).to({_off:false,x:-304.2,y:11.3},0).to({_off:true},1).wait(1).to({_off:false,x:-299.8,y:12.1},0).wait(1).to({x:-297.5,y:12.4},0).to({_off:true},1).wait(2).to({_off:false,x:-290.8,y:13.6},0).wait(1));

	// Layer 37
	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_92.setTransform(-332.3,5.8);

	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_93.setTransform(-329.9,6.3);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.f("#162437").s().p("Ag8BLIAAiVIB5AAIAACVg");
	this.shape_94.setTransform(-327.5,6.8);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_95.setTransform(-320.4,8.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_92,p:{x:-332.3,y:5.8}}]}).to({state:[{t:this.shape_93,p:{x:-329.9,y:6.3}}]},1).to({state:[{t:this.shape_94,p:{x:-327.5,y:6.8}}]},1).to({state:[{t:this.shape_94,p:{x:-325.2,y:7.2}}]},1).to({state:[{t:this.shape_93,p:{x:-322.8,y:7.7}}]},1).to({state:[{t:this.shape_95,p:{x:-320.4,y:8.2}}]},1).to({state:[{t:this.shape_92,p:{x:-318.1,y:8.7}}]},1).to({state:[{t:this.shape_92,p:{x:-315.7,y:9.2}}]},1).to({state:[{t:this.shape_95,p:{x:-313.3,y:9.7}}]},1).to({state:[{t:this.shape_92,p:{x:-311,y:10.2}}]},1).wait(1));

	// Layer 38
	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_96.setTransform(-351.9,-0.1);

	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_97.setTransform(-349.7,0.6);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.f("#162437").s().p("Ag8BLIAAiVIB5AAIAACVg");
	this.shape_98.setTransform(-341,3.2);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_99.setTransform(-336.6,4.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_96}]}).to({state:[{t:this.shape_97,p:{x:-349.7,y:0.6}}]},1).to({state:[{t:this.shape_97,p:{x:-347.5,y:1.2}}]},1).to({state:[{t:this.shape_96}]},1).to({state:[{t:this.shape_96}]},1).to({state:[{t:this.shape_98}]},1).to({state:[{t:this.shape_97,p:{x:-338.8,y:3.8}}]},1).to({state:[{t:this.shape_99}]},1).to({state:[{t:this.shape_96}]},1).to({state:[{t:this.shape_96}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_96).to({_off:true},1).wait(2).to({_off:false,x:-345.3,y:1.9},0).wait(1).to({x:-343.2,y:2.5},0).to({_off:true},1).wait(3).to({_off:false,x:-334.5,y:5.1},0).wait(1).to({x:-332.3,y:5.8},0).wait(1));

	// Layer 39
	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_100.setTransform(-369.4,-8);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_101.setTransform(-365.5,-6.2);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.f("#162437").s().p("Ag8BLIAAiVIB5AAIAACVg");
	this.shape_102.setTransform(-361.6,-4.5);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_103.setTransform(-353.8,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_100,p:{x:-369.4,y:-8}}]}).to({state:[{t:this.shape_100,p:{x:-367.5,y:-7.1}}]},1).to({state:[{t:this.shape_101,p:{x:-365.5,y:-6.2}}]},1).to({state:[{t:this.shape_101,p:{x:-363.6,y:-5.3}}]},1).to({state:[{t:this.shape_102,p:{x:-361.6,y:-4.5}}]},1).to({state:[{t:this.shape_102,p:{x:-359.7,y:-3.6}}]},1).to({state:[{t:this.shape_101,p:{x:-357.7,y:-2.7}}]},1).to({state:[{t:this.shape_101,p:{x:-355.8,y:-1.8}}]},1).to({state:[{t:this.shape_103,p:{x:-353.8,y:-1}}]},1).to({state:[{t:this.shape_103,p:{x:-351.9,y:-0.1}}]},1).wait(1));

	// Layer 40
	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_104.setTransform(-384.2,-17.6);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_105.setTransform(-382.6,-16.5);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.f("#162437").s().p("Ag8BLIAAiVIB5AAIAACVg");
	this.shape_106.setTransform(-379.3,-14.4);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_107.setTransform(-377.6,-13.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_104,p:{x:-384.2,y:-17.6}}]}).to({state:[{t:this.shape_105,p:{x:-382.6,y:-16.5}}]},1).to({state:[{t:this.shape_105,p:{x:-380.9,y:-15.4}}]},1).to({state:[{t:this.shape_106}]},1).to({state:[{t:this.shape_107,p:{x:-377.6,y:-13.3}}]},1).to({state:[{t:this.shape_107,p:{x:-376,y:-12.2}}]},1).to({state:[{t:this.shape_107,p:{x:-374.4,y:-11.2}}]},1).to({state:[{t:this.shape_105,p:{x:-372.7,y:-10.1}}]},1).to({state:[{t:this.shape_104,p:{x:-371.1,y:-9}}]},1).to({state:[{t:this.shape_105,p:{x:-369.4,y:-8}}]},1).wait(1));

	// Layer 41
	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.f("#162437").s().p("Ag8BMIAAiWIB5AAIAACWg");
	this.shape_108.setTransform(-390.4,-26.7);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.f("#162437").s().p("Ag8BMIAAiXIB5AAIAACXg");
	this.shape_109.setTransform(-389.7,-25.7);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.f("#162437").s().p("Ag8BLIAAiWIB5AAIAACWg");
	this.shape_110.setTransform(-389,-24.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_108}]}).to({state:[{t:this.shape_109,p:{x:-389.7,y:-25.7}}]},1).to({state:[{t:this.shape_110,p:{x:-389,y:-24.7}}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_109,p:{x:-387,y:-21.6}}]},1).to({state:[{t:this.shape_110,p:{x:-386.3,y:-20.6}}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_109,p:{x:-384.2,y:-17.6}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_108).to({_off:true},1).wait(2).to({_off:false,x:-388.3,y:-23.6},0).wait(1).to({x:-387.6,y:-22.6},0).to({_off:true},1).wait(2).to({_off:false,x:-385.6,y:-19.6},0).wait(1).to({x:-384.9,y:-18.6},0).to({_off:true},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-396.5,-34.3,766.9,59.6);


(lib.gr_ani4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AoYDyQAEgiAEgRQAGgbAOgYQBdiqEuiCQEwiCFbgMIAABkQrdBAj+EwQgfAkgXAoQgSAegNAfQgFgeADgfg");
	mask.setTransform(1.6,0.8);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3A5477").s().p("Ao+D8QgBgsAHgYIAEgHIAABMQAIgSALgSIADgGIAGgKIAAgiIAAgnIAZgkIAUgZIAjglIAABFIAOgNQAUgTAVgSIAAhCIAUgOQAWgQAggVIABAAIATgMIAABDQAagQAdgQIAAhDIBdguIAABCIAsgUIALgFIAAhBIBdgjIAABBIA1gRIgDg/IBhgaIAABBIA3gNIAAhAIATgEIBKgMIAABAIAbgFIAIgBIAUgDIAAg/IAUgDIA2gHIAAABQAMgCAIAAIAAA/IACAAIAmgEIAJAAIAAhBIBegKIAABLIheAJIAABGIgvAEIgCAAIgUACIAAhOIAAgBIg2AHIAABOQgDACgHAAIhVANIAAhPIg2AJIAABPIgTAEIg3AMIgUAEIAAhOIg2AOIAABOIgUAGQgjAKgSAHIgTAGIAAhNQgcAKgaAKIAABNIgUAIIgRAIIg6AaIAAhMIg2AbIAABKIgTAKIg3AfIgUANIAAhKQgdAQgZAUIAABKIgUAPQgdAXgaAZIgTAVIAAhJQgTAVgRAXIgDADIgCAEIAABHIgwBNIAAADQgJgZgBgtg");
	this.shape.setTransform(4.7,-0.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#3A5477").s().p("Ao8ECQgBgtAHgXIAAgBIAEgHIAABMIACgCIARgiIABgBIACgFIACgCIAEgIIAAgEIAAhFIAYgkIAEgGIAQgUIAEgEIAegiIABAEIAABBIAFgDIAIgJIAFgFIAkghIABgFIgBg8IATgQIAGgFIAwggIABgBIAEgCIABAAIAOgKIAAAEIABA+IAFgCIAxgdIAAgFIAAg+IAHgEIBVgrIAAADIABA+IAFgBIAmgSIAIgDIADgCIABgGIAAg8IAHgDIBVghIAAAFIABA8IAGgBIAugQIABgGIgDg4IAIgDIBXgZIAAAFIABA7IAHgBIAvgLIABgEIgBg8IAHgCQALgBABgBIAHgCIBCgMIABADIAAA9IAFAAIAWgDIAFgBIADAAIAFgBIAPgDIABgDIgBg8IAGgCIANgCIAGgBQAbgCAVgEIABAAIADAAIABAAIAPgBIAAACIABA9IACAAIAEAAIACAAIAggDIADAAIAGgCIAAgCIAAg+IBdgLIABBLIgCAAIhbAKIgBABIABBFIgvAFIgDAAIgQACIgDgBIAAhNIgBgBIAAgBIgyAHIgEABIABBPQgDABgFAAIgCAAIhPANIgGAAIAAhMIgBgCIgvAIIgGACIABBKIgBAFIgOADIgFAAIguALIgKACIgJADIgKAAIAAhGIgBgHIgsALIgJAFIABBGIgBAHIgMAEIgIACIgqAOIgLADIgJADIgJADIgBhHIAAgGQgZAJgWAJIgGAEIAABJIAAADIgPAHIgFACIgLAFIgGADIgxAWIgIADIgBhGIAAgGIgrAXIgKAGIAABKIgLAGIgJAEIgsAaIgLAHIgJAFIgKAFIAAhDIgBgHQgXAPgVAPIgJAJIABBBIgBAJIgLAJIgIAGQgYAUgWAVIgJAIIgLANIgIAGIAAhAIgBgHQgPASgPATIgDAFIgBACIgDADIgBABIgCADIABBGIAAABIgvBPIAAACQgJgZgCgtg");
	this.shape_1.setTransform(3.3,0.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#3A5477").s().p("Ao5EIQgCguAHgYIAAgBIAEgHIABBOIACgCQAHgRAJgSIABgBIADgFIABgCIAEgHIABgFIgChFIAYglIAEgGIAQgUIADgEIAfgjIABADIABBCIAEgDIAIgIIAFgFIAkghIABgGIgBg8IAFgGIANgKIAGgFQAUgPAbgTIABAAIAEgCIABgBIAOgKIABAEIABA+IAFgBIAwgdIABgGIAAg9IAGgFIBVgsIAAACIABA/IAFgBIAmgSIAIgDIADgCIABgGIAAg7IAGgFIBVghIABADIABA9IAFAAIAugQIABgGIgDg4IAHgEIBXgaIABAEIABA8IAGAAIAwgLIABgFIgBg7IAGgDIAMgDIAHgBIBDgNIAAACIABA+IAFAAIAWgDIAEgBIADgBIAFgBIAQgCIABgDIgBg8IAFgDIANgCIAGgBIAwgGIAAAAIADAAIABAAIAQgCIABACIABA9IACAAIADABIACAAIAggDIADAAIAHgBIAAgCIgBg/IADgBIBagLIABBLIgBAAIhbALIgBABIABBGIgvAFIgCAAIgRACIgDgBIgBhPIAAAAIgzAHIgDABIABBOIAAABIgIACIgCAAIhPANIgFgBIgBhLIgBgDIgvAJIgGADIACBKIgBAEIgPADIgFABIguALIgKADIgJACIgJgBIgBhGIgBgGIgsAMIgIAFIABBGIgCAHIgLAEIgIACIgqAPIgLADIgKADIgIABIgBhHIgBgFQgYAJgXAKIgFAEIABBJIgBAEIgOAGIgFACIgLAGIgHACIgwAYIgIABIgBhGIgBgFIgsAXIgIAHIABBCIgCAIIgLAGIgIAEIgsAbIgLAHIgJAGIgJACIgBhDIgBgGQgXAPgVARIgIAJIABBBIgBAJIgLAJIgJAGQgXAVgWAVIgIAJIgMANIgGADIgBhAIgCgFQgPASgOATIgDAFIgCACIgCADIgBABIgBADIABBHIgvBQIAAACQgJgZgCgtg");
	this.shape_2.setTransform(1.8,1.3);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#3A5477").s().p("Ao2EOIAAgBQgCgtAHgYIAAgBIADgHIACBNIABgBIARgjIABgBIACgFIACgCIADgIIABgEIgChGIADgGIAUgfIAEgGIAQgVIADgEIAfgjIABACIABBBIAEAAIAIgJIAFgFIAjgiIACgFIgBg9IAEgGIAMgKIAHgGIAvgiIABAAIAEgDIABAAIAOgKIABACIABA/IAFAAIAwgeIACgFIgCg9IAFgGIBVguIACACIABA/IAEABIAmgTIAHgDIADgCIADgFIgBg8IAFgFIBVgjIABADIABA9IAFABIAugRIACgFIgEg4IAGgFIBXgbIACADIABA8IAGACIAwgMIABgEIgBg8IAFgEIALgCIAIgCIBDgNIABACIABA+IAEABIAWgEIAFgBIADAAIAEgBIAQgDIACgDIgCg8IAEgDIANgCIAGgBIAxgHIAAAAIADAAIABAAIAQgCIABACIABA9IACABIADABIACAAIAggEIADAAIAHgBIABgCIgCg/IADgCIBagMIACBMIgBABIhbALIgBABIACBHIgwAFIgCAAIgRACIgDgBIgBhOIAAgBIAAgBIgzAIIgDACIACBOIgBABQgCABgFABIgCAAIhQAOIgEgCIgChMIgBgCIgwAJIgEADIABBLIgBAEIgPADIgFABIguAMIgKACIgJADIgIgDIgBhHIgDgEIgsAMIgGAGIABBHIgCAGIgMAEIgIADIgqAPIgLADIgJAEIgHgCIgChHIgCgDIguASIgFAFIACBKIgBADIgPAHIgFACIgLAFIgGADIgxAZIgGgBIgChHIgCgDIgsAYIgHAHIACBDIgDAHIgLAGIgIAFIgtAbIgKAHIgJAGIgIAAIgBhDIgCgEQgXAQgVAQIgHAKIACBCIgDAIIgLAJIgIAHQgXAVgWAWIgIAIIgLANIgGACIgChBIgCgDQgPASgOAUIgCAEIgCACIgCADIgBABIgBAEIACBGIguBRIAAADQgKgZgCgug");
	this.shape_3.setTransform(0.4,2);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#3A5477").s().p("AozEUIAAgBQgDguAHgYIAAgBIADgHIADBNIABAAIAQgjIABgCIACgFIACgCIAEgHIABgFIgDhGIACgGIAUggIAEgFIAQgWIADgEIAegkIACABIACBCIADABIAIgIIAFgGQAQgSATgRIACgFIgCg9IAEgGIAMgLIAGgFIAwgkIABAAIADgCIABgBIAOgKIACACIACA/IADABIAwgeIADgFIgCg+IAEgGIBVgvIACABIACA/IADACIAmgTIAHgDIADgCIADgFIgBg8IAEgGIBVgkIACACIABA9IAEACIAugQIADgFIgEg4IAEgHIBYgbIACACIACA9IAEACIAwgMIADgEIgCg7IAEgFIALgDIAIgBIBDgOIABABIACA+IAEADIAWgFIAEgBIADAAIAFgBIAQgCIACgEIgCg8IADgEIANgCIAGgBIAxgHIAAAAIADAAIABAAIAQgCIABABIACA+IACABIACABIACAAIAhgEIADAAIAHgCIAAgBIgChAIACgBIBbgNIACBMIgBABIhbAMIAAACIACBGIgwAFIgCABIgRACIgCgCIgChPIgBgBIgzAIIgCADIACBPIAAAAIgIACIgCAAIhQAPIgDgCIgDhNIgCgCIgvAKIgEAEIACBLIgBADIgPAEIgFABIgvAMIgKACIgJADIgHgEIgChHIgDgDIgsAMIgFAHIACBHIgEAGIgLAEIgIADQgbAJgQAGIgKAEIgJADIgGgCIgDhHIgDgDIguATIgDAFIACBKIgCAEIgOAGIgGADIgLAFIgGADIgxAZIgFgDIgChGIgDgCIgsAZIgGAIIACBCIgDAHIgLAHIgJAEIgsAdIgKAGIgJAHIgHgCIgChEIgDgDQgXAQgUASIgGAKIACBCIgDAIIgLAJIgIAHQgXAWgWAWIgIAJIgLAMIgFAAIgChBIgDgBQgPASgNAUIgDAEIgBACIgCADIgBABIgBADIACBHIgtBSIAAADQgKgZgCgug");
	this.shape_4.setTransform(-1.1,2.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#3A5477").s().p("AoxEaIAAgBQgCguAGgZIAAgBIADgHIADBOIABABQAHgTAJgSIABgCIACgEIACgCIADgHIABgFIgDhGIACgGIAUghIAEgGIAPgWIADgEIAfgkIABAAIACBCIADACIAIgJIAFgFIAjgiIADgGIgDg+IADgHIAMgKIAHgFQATgRAcgTIABgBIADgDIABAAIAOgKIACAAIADBAIADADQAWgQAagQIACgEIgCg+IADgHIBVgwIACABIADA/IACACIAmgSIAHgEIADgCIAEgFIgCg8IADgHIBVglIACACIADA9IADAEIAtgRIAEgFIgEg5IADgGIBYgdIACABIADA+IAEADIAwgMIACgEIgCg8IADgGIAMgCIAHgBIBEgPIACABIACA+IACADIAXgFIAEAAIADgBIAFgBIAQgDIACgCIgCg9IACgEIANgCIAGgBIAxgIIAAABIADgBIABAAIAQgDIACACIACA9IABACIACACIADgBIAggEIADAAIAHgBIACgCIgDg/IACgCIBagOIAEBNIgBABIhcAMIAAACIADBHIgwAGIgCAAIgSACIgBgCIgDhPIAAgBIg0AJIgCACIADBPIAAABQgDACgFAAIgCAAIhQAPIgDgDIgDhNIgCgBIgwAKIgDAFIADBLIgDADIgOAEIgFABIgvANIgKADIgKACIgFgGIgChHIgFgCQgWAGgWAIIgEAGIACBIIgDAFIgMAEIgIADIgrAQIgKAEIgJADIgFgEIgDhHIgEgCQgYAKgWAKIgDAGIADBKIgCACIgPAIIgFACIgLAGIgGADIgxAZIgEgDIgDhHIgDgBIgtAZIgEAJIACBDIgEAHIgLAGIgIAFIgsAcIgLAIIgJAGIgFgFIgChDIgEgBQgXAQgVASIgEALIACBDIgEAIIgLAJIgIAHQgXAVgVAXIgIAJIgLANIgEgDIgDhBIgDABQgPASgNAUIgCAEIgCADIgCACIgBABIAAAEIADBGIgBACIgsBRIAAADQgKgZgDgug");
	this.shape_5.setTransform(-2.5,3.6);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#3A5477").s().p("AouEgIAAgBQgDgvAGgZIAAgBIADgIIAEBPIABABIAPglIACgBIACgFIABgCIADgHIABgFIgDhHIABgGIATggIAFgHIAOgVIAEgFIAeglIACgBIADBDIACADIAIgIIAEgGQARgSASgRIAEgGIgEg/IACgGIANgLIAGgFIAvglIABAAIADgDIABgBIAPgKIACAAIADBAIACADQAXgPAZgQIADgFIgDg+IACgHIBWgxIACAAIADA/IACAEIAmgUIAGgDIADgCIAFgFIgDg8IACgIIBWglIACAAIADA+IADAFIAtgSIAEgEIgEg5IACgHIBYgdIADAAIADA9IADAFIAwgNIAEgDIgDg9IACgGIAMgCIAHgCIBEgPIACAAIADA/IABADIAYgEIAEgBIACgBIAFgBIAQgCIADgCIgDg+IACgFIANgCIAGgBIAxgIIAAAAIADgBIABABIAQgDIACABIADA+IAAABIACADIADgBIAggEIAEAAIAGgBIACgBIgEhAIACgDIBbgOIAEBMIgBACIhbAOIAAACIADBHIgwAGIgDAAIgRACIgBgCIgDhQIgBAAIg0AJIgBACIADBQIAAABIgIABIgCABIhRAQIgCgFIgDhNIgDgBIgwALIgCAGIADBMIgCACIgPAEIgFABIgwANIgKADIgJACIgEgGIgDhIIgFgBIgtAOIgCAIIACBIIgEAEIgMAFIgIACIgrARIgKAEIgJADIgEgGIgDhHIgFgBQgXAKgWALIgCAGIADBKIgDADIgPAHIgFADIgLAGIgGADIgxAaIgDgFIgEhIIgDAAIgtAaIgDAKIADBDIgGAGIgLAHIgIAFQgYAQgUAOIgKAHIgJAGIgEgGIgDhEIgFABQgXAQgVATIgCALIACBDIgEAIIgLAJIgJAHQgWAWgVAXIgHAJIgMAOIgDgGIgDhBIgEACQgPATgNAUIgCAFIgBABIgCADIgBABIgBAEIAEBHIAAABIgsBTIAAACQgKgZgDgug");
	this.shape_6.setTransform(-3.9,4.3);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#3A5477").s().p("AorEmIAAgCQgEguAGgaIAAgBIADgHIAFBOIAAACIAQglIABgCIACgEIABgCIADgIIACgEIgEhHIAAgHIAUggIAEgHIAOgWIAEgFIAdglIADgCIADBCIACAGIAIgJIAEgGQARgSARgSIAFgFIgEhAIABgGIANgLIAFgGIAwglIABAAIADgDIABgBIAOgKIADgCIADBBIACAFIAwggIADgFIgDg+IABgIIBVgzIAEAAIADBAIABAFIAlgVIAGgDIAEgCIAFgEIgCg9IAAgIIBVgnIAEAAIADA+IACAGIAtgSIAFgEIgFg5IACgIIBXgeIAEgBIADA+IADAGIAwgOIAEgDIgEg8IABgHIAMgDIAIgCIBEgPIACAAIAEA/IABAEIAXgFIAEgBIADAAIAEgBIAQgDIAEgCIgEg9IABgGIAOgDIAFgBIAygIIAAAAIADgBIAAABIAQgDIADABIAEA+IAAACIABACIACAAIAigFIADAAIAHgBIABgBIgDhAIABgEIBbgPIAFBOIgBACIhcAOIAAACIAEBIIhEAJIgBgDIgDhQIgBgBIg0AKIgBADIAEBQIgBAAQgDACgFAAIgBABIhSAQIgBgFIgEhOIgDAAIgwALIgBAGIADBNIgDACIgPAEIgFABIgwAOIgKACIgJADIgDgIIgEhJIgGABIgsAOIgCAJIAEBJIgGAEIgLAEIgJADIgrARIgJAEIgJAEIgDgIIgEhIIgFABIguAUIgBAHIAEBLIgEACIgOAIIgGADIgLAFIgGAEIgwAaIgDgGIgEhIIgEABQgZAOgUANIgCAKIAEBEIgHAGIgLAGIgIAGQgZAQgTAOIgKAHIgJAHIgDgJIgEhEIgFACQgXASgUASIgCAMIADBDIgGAIIgLAJIgIAIQgWAWgVAYIgHAIIgMAOIgCgHIgDhCIgFAEQgOATgNAVIgDAEIAAACIgCACIgBABIAAAEIAEBIIgBABIgrBTIAAADQgKgagDgug");
	this.shape_7.setTransform(-5.3,5.1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#3A5477").s().p("AopEsIAAgCQgDgvAFgaIAAgBIADgIIAFBPIABADIAPglIABgCIACgFIABgCIAEgHIABgEIgFhIIABgHIATghIAEgGIAOgXIADgFIAhgpIADBDIACAGIAHgIIAFgGQAQgTASgRIAEgFIgDhIIAMgKIAGgGIAvgnIABAAIADgDIABgBIAOgKIAEgCIADBAIABAHIAwghIAEgEIgDhHIBVg0IADgBIAEBAIABAGIAlgVIAGgDIADgBIAGgFIgDhGIBVgoIAEgBIAEA+IABAIIAtgSIAGgEIgGg6IAAgJIBdggIADA+IACAHIAwgOIAFgCIgEg9IAAgHIAMgDIAIgDIBHgQIAEA/IAAAGIAXgGIAEgBIADgBIAEgBIARgCIADgBIgDg+IAAgHIANgCIAGgBIAxgJIADgBIABABIAQgEIADABIAEA+IAAACIABAEIACgBIAigFIADAAIAHgBIACgBIgEhAIAAgFIBcgPIAFBNIgBADIhbAPIAAACIAEBIIgwAHIgCAAIgSACIgBgDIgEhRIgBAAIg0AKIgBAEIAFBRIgBAAIgIACIgCABIhRARIgFhVIgEAAIgwAMIgBAHIAFBNIgTAGIgFABIgwAOIgKADIgJACIgCgJIgEhJIgHACQgXAGgWAJIAAAKIAEBIIgGADIgMAFIgIADQgcAKgPAHIgKAFIgJAEIgCgKIgEhIIgHABIgtAWIAAAHIAEBMIgSAKIgFACIgLAGIgGADIgxAaIgCgHIgEhIIgGADQgYANgVAOIAAAMIAEBDIgSANIgJAFQgYARgTAOIgKAHIgJAHIgCgLIgEhEIgHAEQgXASgUASIAAANIADBEIgGAHIgLAJIgIAIQgXAXgUAYIgHAJIgLAOIgCgKIgEhCIgFAGQgPAUgMAUIgCAEIgBACIgCACIAAABIAAAEIAEBIIgqBVIAAADQgLgagEgug");
	this.shape_8.setTransform(-6.8,5.9);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#3A5477").s().p("AomEwQgEgxAGgaIADgIIAFBTIARgoIACgHIAGgLIgDglIgDgqIAXgoIARgcIAhgqIAFBLIAMgPQASgWAUgUIgFhKIATgPQAVgSAegYIABgBIASgOIAEBHQAZgRAbgSIgFhIIBZg3IAFBHIAqgYIALgGIgFhHIBagqIAEBGIA0gVIgHhEIBdghIAEBGIA2gRIgFhFIAUgFIBHgRIAFBFIAbgGIAHgCIAUgEIgEhFIASgEIA1gKIABAAIATgDIAFBFIACgBIAlgFIAKgCIgFhFIBcgQIAFBQIhcAQIAFBLIhEAKIgFhUIgBgBIg1AKIAGBVQgDACgGAAIhUATIgFhWIg1ANIAGBVIgTAFIg2AQIgTAGIgGhUIg0ASIAFBUIgTAHIgzAVIgSAIIgGhTQgbAMgZANIAFBTIgSAKIgRAJIg3AdIgGhQIgzAgIAFBQIgSAMQgeAUgWARIgTAOIgGhSQgaAVgYAXIAFBRIgSAQQgbAbgYAdIgSAXIgFhOQgSAXgOAZIgCAEIgDAFIAFBMIgqBXIAAACQgKgagFgwg");
	this.shape_9.setTransform(-8.2,6.6);

	this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},1).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-52.2,-29.6,107.7,60.8);


(lib.gr_ani3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3A5477").s().p("EAtJAAyIAAg2IhKAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih/AAIAAg2IhIAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih9AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih/AAIAAg2IhJAAIAAA2Ih/AAIAAg2IhKAAIAAA2Ih+AAIAAhjIAaAAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB/AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB/AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB/AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB9AAIAAA2IBJAAIAAg2IB/AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB+AAIAAA2IBKAAIAAg2IB+AAIAAA2IBJAAIAAg2IB/AAIAAA2IBKAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBJAAIAAg2IB/AAIAAA2IBKAAIAAg2IB+AAIAABjg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({x:2.2},0).wait(1).to({x:4.5},0).wait(1).to({x:6.7},0).wait(1).to({x:8.9},0).wait(1).to({x:11.1},0).wait(1).to({x:13.4},0).wait(1).to({x:15.6},0).wait(1).to({x:17.8},0).wait(1).to({x:20},0).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-291.5,-5,583.2,10);


(lib.gr_ani2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AnyC5QgygPgugQQoni+AGk0QBjD0H9CzQH9C1SLgRIAABkQhpAChkAAQuDAAoXigg");
	mask.setTransform(15.9,3);

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#3A5477").s().p("ACLDwIgagPIABhSQgdgSgagUIgTgNIAABUIhPhHIgagdIABhWIgHgJQgPgTgPgZIgBBZQgSgagIgQQgWgtgHg9QgHg7AChHQAFAQAHATQAMAdASAlQADgEADgKIBNBpIgBBOQAXAaAdAbIABhRIAaASQAgAZAqAaIAQAJIAKAFIgBBVIAXANIAABSIgYgNg");
	this.shape.setTransform(-84,-14.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#3A5477").s().p("AKUCOIhKgBIgBBNIh+gDIABhNIhKgDIgBBNIgBAAIgagCIhJgEIgEAAIgWgCIABhOIhLgGIAABOIh7gMIgEAAIABhOIglgEIgjgFIgBBOIh+gTIABhOIhKgOIgBBPIh9gaIABhOQgagGgxgMIAABOIgbgGIhIgWIgbgIIABhOQgEgCgKgCIg8gVIgBBNIh9guIABhQIhKggIgBBRIgagOIgwgYIAAhSQAaAPAXAKIABhVIAaANQAoASAiAOIAaALIgBBWIBJAcIABhWIBNAbIAXAIIAaAIIAABWQAXAHAxANIABhVIAaAHQAnAKAkAIIAaAGIgBBVIBJAQIABhWIB/AWIgBBWIBIALIABhZIAbAEIBIAJIAEAAIAKABQAJAAAEACIgBBYIBIAIIABAAIAAhZIB8AKIAEABIgBBZIBJAEIABhZIAZABIBiAFIAEAAIgBBZIBJACIABhZIBlABIAbABIgBBYIBJAAIABhZIB+AAIAAClIgaAAIAAhUIhKAAIAABUIgaAAIAAAAIhmABg");
	this.shape_1.setTransform(21.2,18.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#3A5477").s().p("AM+GKIAAhLIhKgBIAABNIh+gCIAAhKIgBgDIhGgDIgEAAIABBJIgBAEIgBAAIgVgBIgEAAIhFgEIgEAAIAAAAIgFAAIgSgCIgEAAIAAhJIAAgEIhGgGIgEAAIAABIIAAAFIh2gLIgEAAIgBgBIgEAAIAAhHIAAgGIgggDIgGgBIgggFIgEABIAABIIAAAFIh6gRIgEgBIAAhIIgBgGIhIgMIABBIIgBAFIh6gYIgDgBIgBhJIAAgFQgZgFgtgMIgEAAIAABJIAAAFIgXgGIgEgBIhHgVIgBAAIgZgHIgCgBIAAhMIgBgDIgLgEIgDgBIg7gUIgBAAIABBNIgBACIh9gvIgBhPIAAgBIhKggIAAABIAABPIgBABIgZgNIgCgBQghgPglgVIgGgDIgVgMIgBhQIgFgDQgagQgYgSIgGgEIgNgJIgBAHIABBJIgFgEIhMg+IgagdIgBgNIAAhKIgGgJIgBgBIgIgKIgXghIgBAKIAABOIgFgIQgNgVgHgMIgGgNQgSgogHg0IgCgRQgGg0AAg9IAAgCQAFAQAIATIAAABQANAcASAlIAFgOIBPBoIABAEIAABMIADADQAWAXAdAaIABgFIAAhNIADACIAWASIAFAEQAfAVAmAYIAIAEIAJAFIAIAEIACACIABAKIAABIIAIAFQAjAUAdANIACgKIgBhHIAIADIARAIIAKAFQAjAPAeAKIAHADIATAHIABAJIABBNIAGADIBCAZIABgIIgBhNIAIABIBFAYIALADIAMAFIANAEIANAEIACALIAABLIAKAEIA+ASIABgOIAAhHIAPACIAJADIAQADIA7AOIAQAEIAKACIACAQIAABGIAPAFIA5ALIACgPIAAhGIAOABIBtASIACAQIAABHIAOADIA5AIIACgOIAAhIIAMAAIANACIAPABIA7AHIAEAAIAKACIACAAIAEAAIAHABIAAACIABAOIABBHIAOADIA5AFIAAAAIACgOIgBhIIANgBIBtAJIAFAAIABAIIAAAFIABBKIANACIA6AEIACgQIAAhIIAOAAIAJAAIAPABIBXADIACAMIAABLIAMACIA8ABIABgMIAAhLIAKgBIBZAAIALAAIAQAAIABALIABBMIAKACIA+gBIABgKIgBhOIAJgBIB1gBIABAIIACCdIgFABIgUAAIgBgFIgBhPIgFgBIhEABIgBAEIABBQIgDABIgXAAIAAgBIhlACg");
	this.shape_2.setTransform(6.4,0.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#3A5477").s().p("ANFGFIgBhMIhKAAIABBLIAAACIh8gCIgCAAIgChJIAAgDIhHgDIgDABIACBIIgBABIgBADIgBAAIgVgBIgFAAIhEgDIgEAAIgBAAIgDgBIgTgBIgDgBIgChJIgBgEIhGgFIgDABIABBIIgBAEIh5gLIgCAAIgDgBIgBhHIgBgFIgggDIgGgBIgggEIgDAAIABBIIgBAFIh6gQIgEgCIgBhIIgCgFIhDgMIgEABIACBIIgCAFIh5gYIgEgCIgChIIgBgFIhGgQIgDAAIABBJIgBAEIgWgFIgEgBIhIgVIgBAAIgZgHIgBgBIgChMIAAgDIgMgEIgDgBIg7gUIgBABIACBNIgBACIh+gvIgChPIAAgBIhKgfIgBABIACBPIgBAAIgZgMIgCgBQghgPgmgUIgGgDIgVgMIgBgHIgChKIgEgDQgbgPgYgRIgGgEIgNgJIgBAFIACBJIgFgCIhMg+IgbgdIgCgMIgChKIgFgJIgBgBIgIgKIgXggIgCAHIABBOIgEgGIgVghIgGgNQgTgngHg0IgEgQQgGg0gBg+IAAgDQAEAPAJATIAAABQANAdAUAlIAEgPIBRBnIAAAEIACBNIADADQAWAXAeAZIABgEIgChNIAEACIAVARIAGAEQAfAVAnAYIAGAEIAJAEIAJAFIADABIACAJIABBIIAHAGQAiATAfAOIACgIIgChIIAHACIARAIIAKAEQAjAOAfALIAHADIATAIIACAHIABBNIAGAEIBCAYIADgGIgDhNIAHAAIBFAXIALAEIAMAEIAOAEIANAEQADAFAAAFIACBLIAJAFIA9ARIADgMIgBhHQAAgBAMABIAKADIAQAEIA7ANIAQADIALADIADAOIABBGIAOAGIA5AMIADgOIgBhGIAMgBIBuASIADAOIACBHIANAFIA5AIIAEgNIgChIIALgCIAMACIAQACIA6AGIAFAAIAKABIABAAIAFAAIAGACIABACQACAFABAHIABBHIANAFIA5AFIABAAIADgNIgChIIALgCIBtAHIAFABIACAHIABAEIABBKIANAEIA6ADIADgNIgBhJIAMgCIAJAAIAPABIBSACIAFABIADAKIACBLIAMADIA6ABIAEgKIgChMIAJgCIBZAAIAMAAIAPAAIADAJIACBNIAIACIA/gBIABgJIgBhOIAHgCIB2gBIABAHIAFCdIgEABIgUABIgCgFIgDhPIgDgBIhGABIAAAEIACBQIgCAAIgYABIAAgBIhlACg");
	this.shape_3.setTransform(8.1,1.3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#3A5477").s().p("ANMF/IgChLIhKAAIACBMIAAABIh9gBIgBgBIgDhJIgBgDIhHgCIgDABIAEBIIgBABIgCADIgBAAIgVgBIgEAAIhFgDIgEAAIAAAAIgEgBIgSgBIgDgBIgDhJIgCgDIhGgFIgDACIADBIIgCADIh2gKIgEAAIgBgBIgDgBIgChHIgCgEIgggEIgGgBIgfgDIgEABIADBIIgCADIh6gOIgDgDIgDhIIgCgEIhEgLIgDABIADBIIgCADIh6gWIgDgDIgDhIIgBgEQgagFgtgLIgDABIADBIQAAABAAAAQAAABAAAAQAAABgBABQAAAAAAABIgXgGIgDgBIhJgUIgBAAIgZgHIgBgBIgEhNIgBgCIgLgEIgDgBIg7gTIgBAAIADBNIgBACIh/guIgChPIAAgBIhLgeIgBABIADBPIAAAAIgagNIgCgBQghgOgmgTIgGgEIgVgLIgCgHIgDhKIgEgEQgbgOgZgRIgFgEIgOgJIgCAEIADBJIgDgBIhOg9IgbgcIgDgMIgDhKIgEgKIgBgBIgIgKIgYgfIgDAEIACBOIgDgDIgVggIgHgNQgUgngIg0IgDgQQgIg0gCg9IgBgGQAFAQAKATIAAABQANAcAUAlIAFgOIBRBlIABAFIADBLIADADQAWAXAfAaIABgDIgDhNIADAAIAWASIAGADQAeAWAoAWIAHAFIAJAEIAIAFIADACQACAEABAEIACBHIAGAHQAkATAdANIAFgGIgEhIIAGAAIASAIIAKAFQAjAMAfAMIAHADIATAIIADAHIADBMIAFAFIBDAYIACgFIgChOIAFgBIBFAXIALADIANAEIAMAFIAPADQADAFAAAEIADBMIAIAFQAWAIAnAJIAGgKIgEhHQABgBAKAAIAKACIAQAEQAfAHAcAFIARAEIAKADIAGAMIACBGIALAIIA6ALIAFgLIgChGIAKgEIBuASIAGAMIACBHIAMAHIA5AGIAFgKIgDhIQAGgCADgCIANACIAPABIA7AHIAEAAIAKABIACAAIAEAAIAHABIABACIAEAKIADBHIALAHIA5AFIABAAIAFgLIgDhIIAJgEIBtAHIAFAAIAEAGQAAABAAAAQAAABABAAQAAABAAAAQAAABAAABIADBJIAKAFIA7ADIAFgLIgDhJIAKgEIAJAAIAQABIBSACIAFAAIAFAJIACBLIALAEIA7ABIAFgJIgDhLIAHgEIBZgBIALAAIAQABQADADABAEIADBNIAIADIA+gBIADgIIgChOIAFgDIB2gCIADAGIAICdIgFACIgTABIgCgEIgFhPIgDgCIhFABIgBAEIADBQIgCABIgWABIgBgBIhmADg");
	this.shape_4.setTransform(9.8,1.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#3A5477").s().p("AKMF7IgBgBIgEhJIgCgDIhGgCIgDACIAFBIIgBABIgCADIgBAAIgVgBIgEAAIhFgDIgFAAIAAAAIgDgBIgTgBIgDgCIgEhIIgCgDIhHgFIgBACIADBIIgCAEIh2gKIgEAAIgBAAIgDgCIgDhIIgDgDIgfgDIgHgBIgfgEQgBABAAAAQgBAAAAAAQAAAAgBABQAAAAAAAAIAEBIIgCADIh7gPIgCgCIgFhIIgCgEIhEgLIgCACIAEBIIgDADIh7gWIgDgDIgDhIIgDgEQgZgEgtgLIgDABIAFBJQAAABAAAAQAAAAgBABQAAAAAAAAQgBABAAAAIgXgFIgDgBIhJgTIgBAAIgZgHIgBgBIgFhNIgBgCIgLgEIgEgBIg7gTIAAAAIADBOIgBABIh/gtIgEhPIgBgBIhLgeIAAABIAEBPIgBABIgZgNIgCgBQgigOgmgTIgFgEIgWgLIgDgGIgDhKIgEgEQgbgOgZgRIgFgEIgOgIIgDACIAEBJIgDAAIhOg8IgcgcIgDgLIgFhKIgEgKIgBgBIgIgKIgYgfIgEACIADBOIgCgBIgVghIgHgMQgVgngKgzIgDgQQgJg0gDg+IgBgGQAGAPAJATIAAABQAOAcAUAlIAFgPIBTBlIABAFIAFBLIACAEQAWAXAfAYIADgBIgFhOIACAAIAXARIAFADQAfAWAoAWIAHAFIAJAEIAJAFIADABQADAEAAAEIAEBIIAFAHQAjASAeANIAGgEIgFhIIAFgCIASAIIAJAFQAlANAfALIAHADIATAHIAEAGIAEBOIAFAFIBCAXIAFgEIgFhNIAFgCIBEAWIAMADIAMAEIANAEIAOAEQAEAEABAEIAEBLIAIAGQAVAIAoAJIAGgHIgDhIQAAgCAIgBIAKACIARADIA6ANIARADIAKACIAIAMIAEBGIAKAJIA5ALIAIgJIgEhGIAIgGIBuAQIAIALIADBHIAKAIIA6AIIAHgJIgEhIQAFgDACgDIANABIAPACIA7AGIAEAAIAKABIACAAIAEAAIAHABIABACQAFAEABAFIAEBHIAKAIIA5AFIAAAAIAIgJIgFhIIAHgHIBtAHIAGAAIAEAGQABAAAAAAQAAABAAAAQABABAAAAQAAAAAAABIAEBJIAJAHIA7ACIAGgJIgDhJIAIgGIAJABIAQAAIBSACIAFABIAEAEIACACIAEBMIAJAFIA8ABIAGgIIgFhLIAGgFIBagBIALAAIAQAAQADADABADIAFBNIAHAEIA+gCIAEgGIgEhOIAFgFIB2gCIAEAFIAKCdIgEADIgUABIgCgEIgGhPIgCgCIhGACIgBACIAFBRIgCABIgXABIAAAAIhmADIgBgBIgEhMIhKAAIADBMIgBABg");
	this.shape_5.setTransform(11.4,2.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#3A5477").s().p("AKSF1IgFhKIgDgBIhHgCIgBACIAFBJIAAAAIgCACIgCAAQgMAAgJgBIgEAAIhFgCIgEAAIgBAAIgDAAIgTgCIgCgCIgGhJIgCgBIhHgFIgBADIAFBIIgDACIh2gIIgFAAIAAgBIgCgCIgFhHIgEgEIgfgDIgGAAIgggEIgCADIAGBIIgEACIh6gOIgDgEIgFhIIgDgCIhEgLIgCACIAFBIIgDADIh8gVIgCgDIgFhJIgDgDIhHgQIgBADIAGBJQAAAAgBAAQAAABAAAAQgBAAAAAAQgBABgBAAIgWgFIgEgBIhIgTIgBAAIgagGIgBgCIgFhMIgCgCIgMgFIgCgBIg8gSIgBABIAGBNIgBABIiAgsIgGhPIAAgBIhMgdIgBAAIAGBPIAAABIgagMIgCgBQgigPglgSIgHgDIgUgLIgFgGIgEhLIgDgEQgdgOgYgQIgHgDIgNgJIgEABIAGBJIgCABIhPg7IgcgcIgGgLIgFhKIgEgKIAAgBIgJgJIgYggIgFAAIAFBOIgCABQgOgSgHgNIgIgNQgWgmgLgzIgDgRQgKgygEg+IgBgJQAGAPAJATIAAABQAPAcAVAlIAEgOIAAgBIBVBkIACAEIAFBMIACAEQAXAWAfAZIACgBIgFhNIACgBIAWAQIAGAEQAfAVAoAWIAHAFIAJAEIAJAEIADACQAEAFAAACIAGBIIAEAHQAjASAfANIAGgCIgFhIIADgEIARAIIAKAFQAlANAgAKIAIAEIATAHIAEAFIAGBOIADAEIBDAYIAFgCIgFhOIADgDIBGAVIALAEIAMAEIANADIAOAEQAGAFAAACIAHBMIAFAHIA9AQIAIgFIgFhHQABgEAFgDIALADIAQADIA8AMIARAEIAKACIAJAKIAFBGIAIAKIA7AKIAJgGIgGhGIAHgIIBuAQIAKAJIAFBHIAIAJIA5AHIAJgHIgEhIIAFgHIANACIAOABIA8AGIADAAIAKABIADAAIAEAAIAHABIABABQAFADADAEIAEBHIAJAKIA6AEIAJgHIgHhIIAHgHIBtAFIAFAAIAFAFQABAAABAAQAAABABAAQAAAAAAABQAAAAAAAAIAGBKIAHAIQAXAAAjACIAJgHIgFhJIAGgHIAIAAIAQAAIBTACIAGAAIAIAFIAFBMIAHAHIA8AAIAIgGIgGhMIAFgGIBZgCIALAAIAQAAQAFACABACIAGBNIAFAGIA/gCIAGgFIgGhOIAEgGIB2gDIAEAEIANCeIgCADIgVAAIgDgCIgGhPIgDgCIhGABIgBACIAGBQIgBACIgaABIAAgBIhkAFIgBgBIgFhMIhKAAIgBACIAFBLIgBABIh8AAg");
	this.shape_6.setTransform(13.1,3.1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#3A5477").s().p("AKZFvIgHhJIgCgCIhHgBIgBACIAGBJIAAAAIgDACIgBAAQgNAAgIgBIgFAAIhFgBIgEAAIgBAAIgDAAIgTgCIgBgCIgHhJIgDgCIhHgDIAAACIAGBJIgEACIh2gJIgFAAIAAAAIgCgDIgGhHIgFgDIgfgDIgGAAIgggDIgBADIAHBIIgFABIh6gNIgCgEIgGhIIgFgCIhDgLIgBADIAFBJIgDABIh8gUIgCgDIgGhJIgEgDIhGgPIgBADIAGBJQAAABAAAAQAAAAgBAAQAAAAgBAAQgBAAgBAAIgWgEIgEgBIhIgTIgBAAIgagGIgBgBIgHhNIgCgCIgLgEIgEgBIg7gSIAAABIAHBNIgDABIiAgrIgHhQIgBAAIhKgdIgCAAIAHBPIgBABIgZgMIgCgBQgigOgmgSIgGgDIgVgLIgFgFIgGhLIgCgFQgdgNgZgQIgGgEIgNgIIgFgBIAHBJIgBADIhZhCIgUgUIgGgKIgHhKIgDgLIgBgBIgIgJIgZgfIgGgDIAGBOIgBAEIgWgfIgIgNQgXgmgLgyIgEgRQgLgzgFg9IgBgLQAGAPAJATIAAABQAPAcAXAkIADgNIAAgBIBXBjIACAEIAHBMIABADQAXAXAgAYIADAAIgHhMIABgDIAXARIAFADQAgAVApAWIAGAEIAJAEIAJAFIAEABIAFAHIAGBIIAEAHQAkASAeANIAIgBIgHhIIACgFIARAIIAKAFQAmAMAgALIAIADIATAHIAFAFIAHBNIADAGIBDAXIAGgBIgHhNIACgFIBGAVIALADIANAEIAMADIAQAEQAGAEAAACIAIBMIAFAIQAVAGAoAKIAKgEIgHhHQAAgFAEgDIALACIAQAEIA8ALIARAEIAKACIALAIIAHBGIAHAMIA5AKIAMgEIgGhHIADgJIBwAPIALAHIAGBHIAHALIA6AHIAKgFIgGhIIAEgJIAMABIAPABIA7AGIAFAAIAJABIACAAIAFAAIAHABIACABQAGACACADIAGBHIAHAMIA6AEIALgFIgHhIIADgKIBuAFIAFABIAHADQABAAABAAQAAAAABABQAAAAAAAAQAAABAAAAIAHBKIAGAJIA6ACIAKgGIgFhIIADgKIAJAAIAQAAIBTABIAGABIAFADIAEABIAGBLIAGAIIA8AAIAKgFIgHhLIACgIIBagCIALAAIAQgBQAGACACACIAHBNIAEAHIA/gCIAHgFIgIhOIADgGIB3gEIAEADIAQCdIgBAEIgUABIgFgCIgHhPIgDgDIhFACIgCACIAHBQIgBACIgZABIAAAAIhkAEIgBAAIgHhMIhKABIgBABIAGBLIgBABIh8ABg");
	this.shape_7.setTransform(14.7,3.7);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#3A5477").s().p("AKgFqIgIhKIgDgBIhHAAIgBACIAIBJIgBAAIgDABIgBAAIgVAAIgEAAIhFgCIgFAAIgEAAIgSgBIgCgDIgIhJIgDgBIhHgDIAAADIAIBIIgGACIh2gIIgEAAIAAgBIgCgDIgHhHIgFgCIgggDIgGAAIgggDIgBAEIAJBIIgGAAIh6gMIgBgEIgIhIIgFgDIhEgJIgBADIAIBJIgEAAIh8gTIgCgEIgHhJIgFgCQgagEgtgKIgBAEIAJBIIgFABIgWgFIgDgBIhJgSIgBAAIgagGIgBgBIgIhNIgCgCIgMgEIgEgBIg7gRIAAABIAHBNIgCAAIiAgqIgIhPIgBgBIhMgcIgCAAIAJBPIAAABIgagMIgCgBQgigOgmgRIgGgDIgVgLIgGgFIgIhKIgCgGQgcgOgagOIgFgEIgOgJIgGgCIAJBKIgBAEIhRg6IgdgbIgHgKIgIhKIgDgLIgBgBIgIgJIgZgeIgIgGIAIBNIAAAHIgWgfIgIgMQgYglgNgzIgEgQQgLgzgHg+IgCgMQAHAPAKATIAAABQAPAcAXAkIAEgOIAAgBIBXBjIADADIAIBMIABADQAXAXAgAXIAEACIgIhMIAAgEIAYARIAFADQAfAUAqAWIAHAEIAJAFIAJAEIADACQAGAEAAABIAIBIIADAIQAjASAfANIAJAAIgJhHIACgHIASAIIAKAEIBFAXIAIADIATAHIAHAFIAJBNIABAGIBEAXIAHAAIgIhNIABgHIBGAVIALADIANAEIAMADIAQAEIAIAFIAJBMIADAJQAVAGAnAJIANgBIgIhHQAAgGADgFIAKADIARADQAfAHAcAEIARAEIAKACIAOAGIAIBGIAEAOIA7AJIANgCIgIhGIADgMIBuAPIAOAFIAIBHIAEANIA6AGIANgCIgIhJIACgLIAOABIANABIA8AFIAEAAIAKACIACAAIAEAAIAIABIABAAQAIACADACIAHBHIAGANIA4AEIABAAIANgDIgIhIIACgMIBtAFIAGAAIAIACQABAAAAABQABAAABAAQAAAAAAABQAAAAAAAAIAIBKIAFALIA6ABIAMgEIgIhIIADgMIAJAAIAPABIBUAAIAFAAIAIACIADABIAIBLIAFAKIA7gBIALgDIgHhLIABgKIBagDIAKAAIARAAQAGABADABIAIBNIADAIIA+gCIAJgDIgJhPIABgHIB3gFIAGACIASCeIAAAFIgUABIgFgBIgJhPIgCgEIhGACIgDABIAJBRIAAACIgaABIAAAAIhkAFIgBgBIgIhLIhKABIgBABIAHBLIh+ADg");
	this.shape_8.setTransform(16.4,4.4);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#3A5477").s().p("ALgGgIgJhKIgDgBIhHAAIAAADIAIBJIgBAAIgDABIgBAAIgVAAIgFAAIhFgBIgEAAIgBAAIgDAAIgTgBIgBgEIgJhJIgEgBIhHgCIAJBMIgFAAIh7gGIAAgBIgBgEIgJhHIgGgCIgfgCIgGAAIgggDIAAAEIAJBIIgGAAIh6gMIgCgFIgJhIIgFgBIhGgJIAJBMIgGAAIh6gTIgBgDIgIhJIgGgCIhHgOIAAAEIAKBJIgGgBIgWgEIgDAAIhJgSIgBAAIgagHIgBgBIgJhMIgDgCIgMgEIgDAAIg8gRIAAAAIAJBOIgCAAIiBgqIgKhQIgBAAIhMgbIgBgBIAJBQIAAAAIgagLIgCgBIhIgfIgGgDIgWgKIgGgFIgJhKIgBgGQgdgOgagQIgGgEIgUgMIAIBAIh9g3IAAhSIgOgKIgLgHQgDgCgDgFQgDgFgDgCIAAAVIAAADIgBAUIABABIgBAAIAAAlIhWhFIgagdIABhXIgIgKQgOgTgQgZIgBBbQgSgdgHgPQgXgtgGg9QgHg6ABhIQAFAQAIATQALAdATAlIAFgOIBOBpIgBBQIAIAJQAIAIANALIAGAFIAZAUIABhTIAaAUIAiAbIAUAPIANAJIAQAJIALAFIgBBQIAHAGIAYAIIgJhGIAYAQIAFACQAgAVApAWIAHADIAJADIAJAEIAEABIAHAGIAJBKIACAIQAkASAfAMIAKADIgKhLIAAgIIASAIIAKAFQAmANAhALIAIADIAaALIAKBNIACAGIBDAXIAIACIgJhOIAAgHIBGAVIALACIAMAEIANADIAQAEIAJAEIAKBMIADAJQAVAGAnAJIAOABIgJhHIAAgNIALACIARAEQAfAGAdAFIARADIAKACIAPAFIAJBHIAEAOIA6AJIANAAIgJhGIAAgOIByAOIAPAEIAJBHIAEAOIA5AGIAPAAIgJhJIAAgNIANABIAOACIA8AEIAEAAIAKABIACAAIAEAAIAIABIACAAQAJABADACIAIBHIAEAOIA5AEIAQgBIgKhIIAAgNIBuADIAFABIAJABQABAAABAAQABAAABAAQAAAAAAABQABAAAAAAIAIBKIAEAMIA6ABIAOgCIgJhJIAAgNIAJABIAQAAIBTAAIAGAAIAIABIAFAAIAJBKIADAMIA8gBIAMgCIgJhLIAAgLIBagDIALAAIAQgBQAIAAACABIAKBNIACAKIA/gDIAJgDIgKhOIAAgIIB3gGIAHABIAVCfIAAAEIgUACIgGgBIgKhOIgBgFIhGADIgEAAIALBRIAAADIgaABIAAAAIhmAFIgJhMIhLABIAAABIAJBMIh+ADg");
	this.shape_9.setTransform(12.3,-0.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#3A5477").s().p("ABxDmIAAhXIgGgEIgngaIgBAAIgKgHQgDgCgDgFQgDgEgDgDIAAAVIAAADIgBA8IhUhHIgagdIABhVIgIgKQgOgTgQgYIgBBYQgSgagHgQQgXgsgGg+QgHg6ABhIQAFAQAIATQALAdATAmQACgFADgKIBOBpIgBBPIAIAJQAJAJASAOIAXAUIABhRIAaATIAiAbQATAOAOAJIAQAJIALAGIgBBUQADACAXAEIAABZg");
	this.shape_10.setTransform(-83.8,-14.7);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#3A5477").s().p("AHWDgIhKgBIgFAAIgWgBIgIhMIhMgDIAIBNIhqgHIgEABIgIhNIgngDIglgDIAIBNIiFgMIgIhNIhMgKIAIBOIiCgTIgHhOIhNgOIAIBNIhngXIgcgGIgIhOIgPgFQgdgHghgKIAIBOIhGgWIAAAAIgrgPIgIhNQgcgHgygPIAIBNIgQgGIgMgEQgZgHg0gUIgdgKIgIhQQgKgFgNgJIgYgQQgKgGgLgFIAABMIhDgdIAAhYIAGAAQAcAEADACIgBg/IAdARQAMAHAUAOQAQAMANAGQAIAEAKADIALAFIAJBSQAwAUAdAJIgJhUIAcAKIABABIBNAVIAbAIIAJBTQAJACAFADQAGADAEABIAAABQARAEARAHIgJhUICFAkIAJBUIBLASIgIhUIAbAFIBNAMIAbAFIAJBXIBLALIgJhWICDAPIAIBXIBPAHIgJhXIBnAHIAEAAIAKABIANABIAJBXIA4AEIgKhXIB+AEIAFAAIAJBYIBKABIgJhYIAZAAIBpAAIAFgBIADBYIBKgCIgIhXIBkgEIAhgBIADBXIBAgEIABhYIB/gGIgCCkIgaACIgEhUIhGADIgBBUIgaABIAAAAIhgAGIgGhMIg+ACIADBMIh/AEIgEhNIhLABIAIBMIgBAAIgOAAIgMAAg");
	this.shape_11.setTransform(31.3,18.6);

	this.shape.mask = this.shape_1.mask = this.shape_2.mask = this.shape_3.mask = this.shape_4.mask = this.shape_5.mask = this.shape_6.mask = this.shape_7.mask = this.shape_8.mask = this.shape_9.mask = this.shape_10.mask = this.shape_11.mask = mask;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_11},{t:this.shape_10}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-98.2,-31.5,208.2,69.1);


(lib.gr_ani1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 51
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape.setTransform(378.5,52.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_1.setTransform(380.7,52.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_2.setTransform(394,52.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_3.setTransform(398.5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape,p:{x:378.5}}]}).to({state:[{t:this.shape_1,p:{x:380.7}}]},1).to({state:[{t:this.shape_1,p:{x:382.9}}]},1).to({state:[{t:this.shape,p:{x:385.1}}]},1).to({state:[{t:this.shape,p:{x:387.4}}]},1).to({state:[{t:this.shape_1,p:{x:389.6}}]},1).to({state:[{t:this.shape_1,p:{x:391.8}}]},1).to({state:[{t:this.shape_2,p:{x:394}}]},1).to({state:[{t:this.shape_2,p:{x:396.3}}]},1).to({state:[{t:this.shape_3}]},1).wait(1));

	// Layer 52
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_4.setTransform(358.5,52.8);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_5.setTransform(360.7,52.8);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_6.setTransform(369.6,52.8);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_7.setTransform(374,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4,p:{x:358.5}}]}).to({state:[{t:this.shape_5,p:{x:360.7}}]},1).to({state:[{t:this.shape_5,p:{x:362.9}}]},1).to({state:[{t:this.shape_4,p:{x:365.1}}]},1).to({state:[{t:this.shape_4,p:{x:367.4}}]},1).to({state:[{t:this.shape_6,p:{x:369.6}}]},1).to({state:[{t:this.shape_6,p:{x:371.8}}]},1).to({state:[{t:this.shape_7,p:{x:374}}]},1).to({state:[{t:this.shape_7,p:{x:376.3}}]},1).to({state:[{t:this.shape_6,p:{x:378.5}}]},1).wait(1));

	// Layer 53
	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_8.setTransform(338.5,52.8);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_9.setTransform(340.7,52.8);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_10.setTransform(358.5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_8}]}).to({state:[{t:this.shape_9,p:{x:340.7}}]},1).to({state:[{t:this.shape_9,p:{x:342.9}}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9,p:{x:349.6}}]},1).to({state:[{t:this.shape_9,p:{x:351.8}}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_10}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_8).to({_off:true},1).wait(2).to({_off:false,x:345.1},0).wait(1).to({x:347.4},0).to({_off:true},1).wait(2).to({_off:false,x:354},0).wait(1).to({x:356.3},0).to({_off:true},1).wait(1));

	// Layer 54
	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_11.setTransform(318.5,52.8);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_12.setTransform(320.7,52.8);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_13.setTransform(334,52.8);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_14.setTransform(338.5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_11,p:{x:318.5}}]}).to({state:[{t:this.shape_12,p:{x:320.7}}]},1).to({state:[{t:this.shape_12,p:{x:322.9}}]},1).to({state:[{t:this.shape_11,p:{x:325.1}}]},1).to({state:[{t:this.shape_11,p:{x:327.4}}]},1).to({state:[{t:this.shape_12,p:{x:329.6}}]},1).to({state:[{t:this.shape_12,p:{x:331.8}}]},1).to({state:[{t:this.shape_13,p:{x:334}}]},1).to({state:[{t:this.shape_13,p:{x:336.3}}]},1).to({state:[{t:this.shape_14}]},1).wait(1));

	// Layer 55
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_15.setTransform(298.5,52.8);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_16.setTransform(300.7,52.8);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_17.setTransform(318.5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_15}]}).to({state:[{t:this.shape_16,p:{x:300.7}}]},1).to({state:[{t:this.shape_16,p:{x:302.9}}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16,p:{x:309.6}}]},1).to({state:[{t:this.shape_16,p:{x:311.8}}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_17}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_15).to({_off:true},1).wait(2).to({_off:false,x:305.1},0).wait(1).to({x:307.4},0).to({_off:true},1).wait(2).to({_off:false,x:314},0).wait(1).to({x:316.3},0).to({_off:true},1).wait(1));

	// Layer 56
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_18.setTransform(278.5,52.8);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_19.setTransform(280.7,52.8);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_20.setTransform(285.1,52.8);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_21.setTransform(289.6,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_18,p:{x:278.5}}]}).to({state:[{t:this.shape_19,p:{x:280.7}}]},1).to({state:[{t:this.shape_19,p:{x:282.9}}]},1).to({state:[{t:this.shape_20,p:{x:285.1}}]},1).to({state:[{t:this.shape_20,p:{x:287.4}}]},1).to({state:[{t:this.shape_21,p:{x:289.6}}]},1).to({state:[{t:this.shape_21,p:{x:291.8}}]},1).to({state:[{t:this.shape_19,p:{x:294}}]},1).to({state:[{t:this.shape_19,p:{x:296.3}}]},1).to({state:[{t:this.shape_18,p:{x:298.5}}]},1).wait(1));

	// Layer 57
	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_22.setTransform(258.5,52.8);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_23.setTransform(260.7,52.8);
	this.shape_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_22).to({_off:true},1).wait(2).to({_off:false,x:265.1},0).wait(1).to({x:267.4},0).to({_off:true},1).wait(2).to({_off:false,x:274},0).wait(1).to({x:276.3},0).to({_off:true},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_23).wait(1).to({_off:false},0).wait(1).to({x:262.9},0).to({_off:true},1).wait(2).to({_off:false,x:269.6},0).wait(1).to({x:271.8},0).to({_off:true},1).wait(2).to({_off:false,x:278.5},0).wait(1));

	// Layer 58
	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_24.setTransform(238.5,52.8);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_25.setTransform(240.7,52.8);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_26.setTransform(245.1,52.8);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_27.setTransform(249.6,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_24,p:{x:238.5}}]}).to({state:[{t:this.shape_25,p:{x:240.7}}]},1).to({state:[{t:this.shape_25,p:{x:242.9}}]},1).to({state:[{t:this.shape_26,p:{x:245.1}}]},1).to({state:[{t:this.shape_26,p:{x:247.4}}]},1).to({state:[{t:this.shape_27,p:{x:249.6}}]},1).to({state:[{t:this.shape_27,p:{x:251.8}}]},1).to({state:[{t:this.shape_26,p:{x:254}}]},1).to({state:[{t:this.shape_26,p:{x:256.3}}]},1).to({state:[{t:this.shape_24,p:{x:258.5}}]},1).wait(1));

	// Layer 59
	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_28.setTransform(218.4,52.8);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_29.setTransform(222.9,52.8);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_30.setTransform(227.3,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_28,p:{x:218.4}}]}).to({state:[{t:this.shape_28,p:{x:220.7}}]},1).to({state:[{t:this.shape_29,p:{x:222.9}}]},1).to({state:[{t:this.shape_29,p:{x:225.1}}]},1).to({state:[{t:this.shape_30,p:{x:227.3}}]},1).to({state:[{t:this.shape_30,p:{x:229.6}}]},1).to({state:[{t:this.shape_29,p:{x:231.8}}]},1).to({state:[{t:this.shape_29,p:{x:234}}]},1).to({state:[{t:this.shape_30,p:{x:236.2}}]},1).to({state:[{t:this.shape_30,p:{x:238.5}}]},1).wait(1));

	// Layer 60
	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_31.setTransform(198.3,52.8);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_32.setTransform(205,52.8);
	this.shape_32._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_31).wait(1).to({x:200.5},0).wait(1).to({x:202.8},0).to({_off:true},1).wait(4).to({_off:false,x:213.9},0).wait(1).to({x:216.2},0).wait(1).to({x:218.4},0).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_32).wait(3).to({_off:false},0).wait(1).to({x:207.2},0).wait(1).to({x:209.5},0).wait(1).to({x:211.7},0).to({_off:true},1).wait(3));

	// Layer 61
	this.shape_33 = new cjs.Shape();
	this.shape_33.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_33.setTransform(178.4,52.8);

	this.shape_34 = new cjs.Shape();
	this.shape_34.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_34.setTransform(180.6,52.8);

	this.shape_35 = new cjs.Shape();
	this.shape_35.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_35.setTransform(182.8,52.8);

	this.shape_36 = new cjs.Shape();
	this.shape_36.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_36.setTransform(185,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_33}]}).to({state:[{t:this.shape_34,p:{x:180.6}}]},1).to({state:[{t:this.shape_35,p:{x:182.8}}]},1).to({state:[{t:this.shape_36,p:{x:185}}]},1).to({state:[{t:this.shape_35,p:{x:187.2}}]},1).to({state:[{t:this.shape_35,p:{x:189.5}}]},1).to({state:[{t:this.shape_36,p:{x:191.7}}]},1).to({state:[{t:this.shape_35,p:{x:193.9}}]},1).to({state:[{t:this.shape_36,p:{x:196.1}}]},1).to({state:[{t:this.shape_34,p:{x:198.3}}]},1).wait(1));

	// Layer 62
	this.shape_37 = new cjs.Shape();
	this.shape_37.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_37.setTransform(158.4,52.8);

	this.shape_38 = new cjs.Shape();
	this.shape_38.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_38.setTransform(160.6,52.8);

	this.shape_39 = new cjs.Shape();
	this.shape_39.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_39.setTransform(174,52.8);

	this.shape_40 = new cjs.Shape();
	this.shape_40.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_40.setTransform(178.4,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_37,p:{x:158.4}}]}).to({state:[{t:this.shape_38,p:{x:160.6}}]},1).to({state:[{t:this.shape_38,p:{x:162.9}}]},1).to({state:[{t:this.shape_37,p:{x:165.1}}]},1).to({state:[{t:this.shape_37,p:{x:167.3}}]},1).to({state:[{t:this.shape_38,p:{x:169.5}}]},1).to({state:[{t:this.shape_38,p:{x:171.8}}]},1).to({state:[{t:this.shape_39,p:{x:174}}]},1).to({state:[{t:this.shape_39,p:{x:176.2}}]},1).to({state:[{t:this.shape_40}]},1).wait(1));

	// Layer 63
	this.shape_41 = new cjs.Shape();
	this.shape_41.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_41.setTransform(138.4,52.8);

	this.shape_42 = new cjs.Shape();
	this.shape_42.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_42.setTransform(140.6,52.8);

	this.shape_43 = new cjs.Shape();
	this.shape_43.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_43.setTransform(149.5,52.8);

	this.shape_44 = new cjs.Shape();
	this.shape_44.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_44.setTransform(154,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_41,p:{x:138.4}}]}).to({state:[{t:this.shape_42,p:{x:140.6}}]},1).to({state:[{t:this.shape_42,p:{x:142.9}}]},1).to({state:[{t:this.shape_41,p:{x:145.1}}]},1).to({state:[{t:this.shape_41,p:{x:147.3}}]},1).to({state:[{t:this.shape_43,p:{x:149.5}}]},1).to({state:[{t:this.shape_43,p:{x:151.8}}]},1).to({state:[{t:this.shape_44,p:{x:154}}]},1).to({state:[{t:this.shape_44,p:{x:156.2}}]},1).to({state:[{t:this.shape_43,p:{x:158.4}}]},1).wait(1));

	// Layer 64
	this.shape_45 = new cjs.Shape();
	this.shape_45.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_45.setTransform(118.4,52.8);

	this.shape_46 = new cjs.Shape();
	this.shape_46.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_46.setTransform(122.8,52.8);

	this.shape_47 = new cjs.Shape();
	this.shape_47.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_47.setTransform(136.2,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_45,p:{x:118.4}}]}).to({state:[{t:this.shape_45,p:{x:120.6}}]},1).to({state:[{t:this.shape_46,p:{x:122.8}}]},1).to({state:[{t:this.shape_46,p:{x:125.1}}]},1).to({state:[{t:this.shape_45,p:{x:127.3}}]},1).to({state:[{t:this.shape_45,p:{x:129.5}}]},1).to({state:[{t:this.shape_46,p:{x:131.7}}]},1).to({state:[{t:this.shape_46,p:{x:134}}]},1).to({state:[{t:this.shape_47,p:{x:136.2}}]},1).to({state:[{t:this.shape_47,p:{x:138.4}}]},1).wait(1));

	// Layer 65
	this.shape_48 = new cjs.Shape();
	this.shape_48.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_48.setTransform(98.4,52.8);

	this.shape_49 = new cjs.Shape();
	this.shape_49.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_49.setTransform(100.6,52.8);

	this.shape_50 = new cjs.Shape();
	this.shape_50.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_50.setTransform(109.5,52.8);

	this.shape_51 = new cjs.Shape();
	this.shape_51.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_51.setTransform(113.9,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_48,p:{x:98.4}}]}).to({state:[{t:this.shape_49,p:{x:100.6}}]},1).to({state:[{t:this.shape_49,p:{x:102.8}}]},1).to({state:[{t:this.shape_48,p:{x:105}}]},1).to({state:[{t:this.shape_48,p:{x:107.3}}]},1).to({state:[{t:this.shape_50,p:{x:109.5}}]},1).to({state:[{t:this.shape_50,p:{x:111.7}}]},1).to({state:[{t:this.shape_51,p:{x:113.9}}]},1).to({state:[{t:this.shape_51,p:{x:116.2}}]},1).to({state:[{t:this.shape_50,p:{x:118.4}}]},1).wait(1));

	// Layer 66
	this.shape_52 = new cjs.Shape();
	this.shape_52.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_52.setTransform(78.4,52.8);

	this.shape_53 = new cjs.Shape();
	this.shape_53.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_53.setTransform(80.6,52.8);

	this.shape_54 = new cjs.Shape();
	this.shape_54.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_54.setTransform(98.4,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_52}]}).to({state:[{t:this.shape_53,p:{x:80.6}}]},1).to({state:[{t:this.shape_53,p:{x:82.8}}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_53,p:{x:89.5}}]},1).to({state:[{t:this.shape_53,p:{x:91.7}}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_52}]},1).to({state:[{t:this.shape_54}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_52).to({_off:true},1).wait(2).to({_off:false,x:85},0).wait(1).to({x:87.3},0).to({_off:true},1).wait(2).to({_off:false,x:93.9},0).wait(1).to({x:96.2},0).to({_off:true},1).wait(1));

	// Layer 67
	this.shape_55 = new cjs.Shape();
	this.shape_55.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_55.setTransform(58.4,52.8);

	this.shape_56 = new cjs.Shape();
	this.shape_56.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_56.setTransform(60.6,52.8);

	this.shape_57 = new cjs.Shape();
	this.shape_57.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_57.setTransform(73.9,52.8);

	this.shape_58 = new cjs.Shape();
	this.shape_58.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_58.setTransform(78.4,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_55,p:{x:58.4}}]}).to({state:[{t:this.shape_56,p:{x:60.6}}]},1).to({state:[{t:this.shape_56,p:{x:62.8}}]},1).to({state:[{t:this.shape_55,p:{x:65}}]},1).to({state:[{t:this.shape_55,p:{x:67.3}}]},1).to({state:[{t:this.shape_56,p:{x:69.5}}]},1).to({state:[{t:this.shape_56,p:{x:71.7}}]},1).to({state:[{t:this.shape_57,p:{x:73.9}}]},1).to({state:[{t:this.shape_57,p:{x:76.2}}]},1).to({state:[{t:this.shape_58}]},1).wait(1));

	// Layer 68
	this.shape_59 = new cjs.Shape();
	this.shape_59.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_59.setTransform(38.4,52.8);

	this.shape_60 = new cjs.Shape();
	this.shape_60.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_60.setTransform(40.6,52.8);

	this.shape_61 = new cjs.Shape();
	this.shape_61.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_61.setTransform(58.4,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_59}]}).to({state:[{t:this.shape_60,p:{x:40.6}}]},1).to({state:[{t:this.shape_60,p:{x:42.8}}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_60,p:{x:49.5}}]},1).to({state:[{t:this.shape_60,p:{x:51.7}}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_59}]},1).to({state:[{t:this.shape_61}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_59).to({_off:true},1).wait(2).to({_off:false,x:45},0).wait(1).to({x:47.3},0).to({_off:true},1).wait(2).to({_off:false,x:53.9},0).wait(1).to({x:56.2},0).to({_off:true},1).wait(1));

	// Layer 69
	this.shape_62 = new cjs.Shape();
	this.shape_62.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_62.setTransform(18.4,52.8);

	this.shape_63 = new cjs.Shape();
	this.shape_63.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_63.setTransform(20.6,52.8);

	this.shape_64 = new cjs.Shape();
	this.shape_64.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_64.setTransform(25,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_62,p:{x:18.4}}]}).to({state:[{t:this.shape_63,p:{x:20.6}}]},1).to({state:[{t:this.shape_63,p:{x:22.8}}]},1).to({state:[{t:this.shape_64,p:{x:25}}]},1).to({state:[{t:this.shape_64,p:{x:27.3}}]},1).to({state:[{t:this.shape_63,p:{x:29.5}}]},1).to({state:[{t:this.shape_63,p:{x:31.7}}]},1).to({state:[{t:this.shape_64,p:{x:33.9}}]},1).to({state:[{t:this.shape_64,p:{x:36.2}}]},1).to({state:[{t:this.shape_62,p:{x:38.4}}]},1).wait(1));

	// Layer 70
	this.shape_65 = new cjs.Shape();
	this.shape_65.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_65.setTransform(-1.6,52.8);

	this.shape_66 = new cjs.Shape();
	this.shape_66.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_66.setTransform(0.6,52.8);
	this.shape_66._off = true;

	this.shape_67 = new cjs.Shape();
	this.shape_67.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_67.setTransform(5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_65}]}).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67,p:{x:5}}]},1).to({state:[{t:this.shape_67,p:{x:7.3}}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_66}]},1).to({state:[{t:this.shape_67,p:{x:13.9}}]},1).to({state:[{t:this.shape_67,p:{x:16.2}}]},1).to({state:[{t:this.shape_66}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_66).wait(1).to({_off:false},0).wait(1).to({x:2.8},0).to({_off:true},1).wait(2).to({_off:false,x:9.5},0).wait(1).to({x:11.7},0).to({_off:true},1).wait(2).to({_off:false,x:18.4},0).wait(1));

	// Layer 71
	this.shape_68 = new cjs.Shape();
	this.shape_68.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_68.setTransform(-21.6,52.8);

	this.shape_69 = new cjs.Shape();
	this.shape_69.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_69.setTransform(-19.4,52.8);

	this.shape_70 = new cjs.Shape();
	this.shape_70.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_70.setTransform(-10.5,52.8);

	this.shape_71 = new cjs.Shape();
	this.shape_71.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_71.setTransform(-6.1,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_68,p:{x:-21.6}}]}).to({state:[{t:this.shape_69,p:{x:-19.4}}]},1).to({state:[{t:this.shape_69,p:{x:-17.2}}]},1).to({state:[{t:this.shape_68,p:{x:-15}}]},1).to({state:[{t:this.shape_68,p:{x:-12.7}}]},1).to({state:[{t:this.shape_70,p:{x:-10.5}}]},1).to({state:[{t:this.shape_70,p:{x:-8.3}}]},1).to({state:[{t:this.shape_71,p:{x:-6.1}}]},1).to({state:[{t:this.shape_71,p:{x:-3.8}}]},1).to({state:[{t:this.shape_70,p:{x:-1.6}}]},1).wait(1));

	// Layer 72
	this.shape_72 = new cjs.Shape();
	this.shape_72.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_72.setTransform(-41.7,52.8);

	this.shape_73 = new cjs.Shape();
	this.shape_73.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_73.setTransform(-37.2,52.8);

	this.shape_74 = new cjs.Shape();
	this.shape_74.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_74.setTransform(-32.8,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_72,p:{x:-41.7}}]}).to({state:[{t:this.shape_72,p:{x:-39.4}}]},1).to({state:[{t:this.shape_73,p:{x:-37.2}}]},1).to({state:[{t:this.shape_73,p:{x:-35}}]},1).to({state:[{t:this.shape_74,p:{x:-32.8}}]},1).to({state:[{t:this.shape_74,p:{x:-30.5}}]},1).to({state:[{t:this.shape_73,p:{x:-28.3}}]},1).to({state:[{t:this.shape_73,p:{x:-26.1}}]},1).to({state:[{t:this.shape_74,p:{x:-23.9}}]},1).to({state:[{t:this.shape_74,p:{x:-21.6}}]},1).wait(1));

	// Layer 73
	this.shape_75 = new cjs.Shape();
	this.shape_75.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_75.setTransform(-61.7,52.8);

	this.shape_76 = new cjs.Shape();
	this.shape_76.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_76.setTransform(-59.5,52.8);

	this.shape_77 = new cjs.Shape();
	this.shape_77.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_77.setTransform(-50.6,52.8);

	this.shape_78 = new cjs.Shape();
	this.shape_78.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_78.setTransform(-46.1,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_75,p:{x:-61.7}}]}).to({state:[{t:this.shape_76,p:{x:-59.5}}]},1).to({state:[{t:this.shape_76,p:{x:-57.2}}]},1).to({state:[{t:this.shape_75,p:{x:-55}}]},1).to({state:[{t:this.shape_75,p:{x:-52.8}}]},1).to({state:[{t:this.shape_77,p:{x:-50.6}}]},1).to({state:[{t:this.shape_77,p:{x:-48.3}}]},1).to({state:[{t:this.shape_78,p:{x:-46.1}}]},1).to({state:[{t:this.shape_78,p:{x:-43.9}}]},1).to({state:[{t:this.shape_77,p:{x:-41.7}}]},1).wait(1));

	// Layer 74
	this.shape_79 = new cjs.Shape();
	this.shape_79.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_79.setTransform(-81.8,52.8);

	this.shape_80 = new cjs.Shape();
	this.shape_80.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_80.setTransform(-77.3,52.8);
	this.shape_80._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_79).wait(1).to({x:-79.5},0).to({_off:true},1).wait(3).to({_off:false,x:-70.6},0).wait(1).to({x:-68.4},0).wait(1).to({x:-66.1},0).to({_off:true},1).wait(2));
	this.timeline.addTween(cjs.Tween.get(this.shape_80).wait(2).to({_off:false},0).wait(1).to({x:-75.1},0).wait(1).to({x:-72.8},0).to({_off:true},1).wait(3).to({_off:false,x:-63.9},0).wait(1).to({x:-61.7},0).wait(1));

	// Layer 75
	this.shape_81 = new cjs.Shape();
	this.shape_81.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_81.setTransform(-101.8,52.8);

	this.shape_82 = new cjs.Shape();
	this.shape_82.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_82.setTransform(-99.6,52.8);

	this.shape_83 = new cjs.Shape();
	this.shape_83.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_83.setTransform(-95.1,52.8);

	this.shape_84 = new cjs.Shape();
	this.shape_84.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_84.setTransform(-90.7,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_81,p:{x:-101.8}}]}).to({state:[{t:this.shape_82,p:{x:-99.6}}]},1).to({state:[{t:this.shape_82,p:{x:-97.3}}]},1).to({state:[{t:this.shape_83,p:{x:-95.1}}]},1).to({state:[{t:this.shape_83,p:{x:-92.9}}]},1).to({state:[{t:this.shape_84,p:{x:-90.7}}]},1).to({state:[{t:this.shape_84,p:{x:-88.4}}]},1).to({state:[{t:this.shape_83,p:{x:-86.2}}]},1).to({state:[{t:this.shape_83,p:{x:-84}}]},1).to({state:[{t:this.shape_81,p:{x:-81.8}}]},1).wait(1));

	// Layer 76
	this.shape_85 = new cjs.Shape();
	this.shape_85.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_85.setTransform(-121.9,52.8);

	this.shape_86 = new cjs.Shape();
	this.shape_86.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_86.setTransform(-117.4,52.8);
	this.shape_86._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_85).wait(1).to({x:-119.6},0).to({_off:true},1).wait(3).to({_off:false,x:-110.7},0).wait(1).to({x:-108.5},0).wait(1).to({x:-106.2},0).to({_off:true},1).wait(2));
	this.timeline.addTween(cjs.Tween.get(this.shape_86).wait(2).to({_off:false},0).wait(1).to({x:-115.2},0).wait(1).to({x:-112.9},0).to({_off:true},1).wait(3).to({_off:false,x:-104},0).wait(1).to({x:-101.8},0).wait(1));

	// Layer 77
	this.shape_87 = new cjs.Shape();
	this.shape_87.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_87.setTransform(-141.9,52.8);

	this.shape_88 = new cjs.Shape();
	this.shape_88.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_88.setTransform(-139.7,52.8);

	this.shape_89 = new cjs.Shape();
	this.shape_89.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_89.setTransform(-135.2,52.8);

	this.shape_90 = new cjs.Shape();
	this.shape_90.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_90.setTransform(-126.3,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_87,p:{x:-141.9}}]}).to({state:[{t:this.shape_88,p:{x:-139.7}}]},1).to({state:[{t:this.shape_88,p:{x:-137.4}}]},1).to({state:[{t:this.shape_89,p:{x:-135.2}}]},1).to({state:[{t:this.shape_89,p:{x:-133}}]},1).to({state:[{t:this.shape_88,p:{x:-130.8}}]},1).to({state:[{t:this.shape_88,p:{x:-128.5}}]},1).to({state:[{t:this.shape_90,p:{x:-126.3}}]},1).to({state:[{t:this.shape_90,p:{x:-124.1}}]},1).to({state:[{t:this.shape_87,p:{x:-121.9}}]},1).wait(1));

	// Layer 78
	this.shape_91 = new cjs.Shape();
	this.shape_91.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_91.setTransform(-162,52.8);

	this.shape_92 = new cjs.Shape();
	this.shape_92.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_92.setTransform(-157.5,52.8);
	this.shape_92._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_91).wait(1).to({x:-159.7},0).to({_off:true},1).wait(3).to({_off:false,x:-150.8},0).wait(1).to({x:-148.6},0).wait(1).to({x:-146.3},0).to({_off:true},1).wait(2));
	this.timeline.addTween(cjs.Tween.get(this.shape_92).wait(2).to({_off:false},0).wait(1).to({x:-155.3},0).wait(1).to({x:-153},0).to({_off:true},1).wait(3).to({_off:false,x:-144.1},0).wait(1).to({x:-141.9},0).wait(1));

	// Layer 79
	this.shape_93 = new cjs.Shape();
	this.shape_93.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_93.setTransform(-182,52.8);

	this.shape_94 = new cjs.Shape();
	this.shape_94.graphics.f("#314665").s().p("AidBOIDLibIBxAAIi+Cbg");
	this.shape_94.setTransform(-179.8,52.8);

	this.shape_95 = new cjs.Shape();
	this.shape_95.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_95.setTransform(-170.9,52.8);

	this.shape_96 = new cjs.Shape();
	this.shape_96.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_96.setTransform(-166.4,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_93,p:{x:-182}}]}).to({state:[{t:this.shape_94,p:{x:-179.8}}]},1).to({state:[{t:this.shape_94,p:{x:-177.5}}]},1).to({state:[{t:this.shape_93,p:{x:-175.3}}]},1).to({state:[{t:this.shape_93,p:{x:-173.1}}]},1).to({state:[{t:this.shape_95,p:{x:-170.9}}]},1).to({state:[{t:this.shape_95,p:{x:-168.6}}]},1).to({state:[{t:this.shape_96,p:{x:-166.4}}]},1).to({state:[{t:this.shape_96,p:{x:-164.2}}]},1).to({state:[{t:this.shape_95,p:{x:-162}}]},1).wait(1));

	// Layer 80
	this.shape_97 = new cjs.Shape();
	this.shape_97.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_97.setTransform(-202.1,52.8);

	this.shape_98 = new cjs.Shape();
	this.shape_98.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_98.setTransform(-197.6,52.8);

	this.shape_99 = new cjs.Shape();
	this.shape_99.graphics.f("#314665").s().p("AieBOIDMibIBwAAIi9Cbg");
	this.shape_99.setTransform(-184.2,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_97}]}).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_98,p:{x:-197.6}}]},1).to({state:[{t:this.shape_98,p:{x:-195.4}}]},1).to({state:[{t:this.shape_98,p:{x:-193.1}}]},1).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_97}]},1).to({state:[{t:this.shape_99,p:{x:-184.2}}]},1).to({state:[{t:this.shape_99,p:{x:-182}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_97).wait(1).to({x:-199.8},0).to({_off:true},1).wait(3).to({_off:false,x:-190.9},0).wait(1).to({x:-188.7},0).wait(1).to({x:-186.4},0).to({_off:true},1).wait(2));

	// Layer 81
	this.shape_100 = new cjs.Shape();
	this.shape_100.graphics.f("#314665").s().p("AidBNIDLiaIBwAAIi9Cbg");
	this.shape_100.setTransform(-222.1,52.8);

	this.shape_101 = new cjs.Shape();
	this.shape_101.graphics.f("#314665").s().p("AieBNIDMiaIBxAAIi+Cbg");
	this.shape_101.setTransform(-213.2,52.8);

	this.shape_102 = new cjs.Shape();
	this.shape_102.graphics.f("#314665").s().p("AidBOIDLibIBwAAIi9Cbg");
	this.shape_102.setTransform(-211,52.8);

	this.shape_103 = new cjs.Shape();
	this.shape_103.graphics.f("#314665").s().p("AieBOIDMibIBxAAIi+Cbg");
	this.shape_103.setTransform(-206.5,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_100}]}).to({state:[{t:this.shape_100}]},1).to({state:[{t:this.shape_100}]},1).to({state:[{t:this.shape_100}]},1).to({state:[{t:this.shape_101}]},1).to({state:[{t:this.shape_102,p:{x:-211}}]},1).to({state:[{t:this.shape_102,p:{x:-208.7}}]},1).to({state:[{t:this.shape_103,p:{x:-206.5}}]},1).to({state:[{t:this.shape_103,p:{x:-204.3}}]},1).to({state:[{t:this.shape_102,p:{x:-202.1}}]},1).wait(1));
	this.timeline.addTween(cjs.Tween.get(this.shape_100).wait(1).to({x:-219.9},0).wait(1).to({x:-217.6},0).wait(1).to({x:-215.4},0).to({_off:true},1).wait(6));

	// Layer 82
	this.shape_104 = new cjs.Shape();
	this.shape_104.graphics.f("#314665").s().p("AidBGIDKiRIBxAAIi8CXg");
	this.shape_104.setTransform(-242.1,52.6);

	this.shape_105 = new cjs.Shape();
	this.shape_105.graphics.f("#314665").s().p("AidBHIDLiTIBwAAIi8CZg");
	this.shape_105.setTransform(-239.9,52.6);

	this.shape_106 = new cjs.Shape();
	this.shape_106.graphics.f("#314665").s().p("AidBIIDKiUIBxAAIi8CZg");
	this.shape_106.setTransform(-237.7,52.7);

	this.shape_107 = new cjs.Shape();
	this.shape_107.graphics.f("#314665").s().p("AidBJIDKiVIBxAAIi9CZg");
	this.shape_107.setTransform(-233.2,52.7);

	this.shape_108 = new cjs.Shape();
	this.shape_108.graphics.f("#314665").s().p("AidBKIDKiWIBxAAIi8CZg");
	this.shape_108.setTransform(-231,52.7);

	this.shape_109 = new cjs.Shape();
	this.shape_109.graphics.f("#314665").s().p("AidBLIDKiYIBxAAIi9Cbg");
	this.shape_109.setTransform(-228.7,52.7);

	this.shape_110 = new cjs.Shape();
	this.shape_110.graphics.f("#314665").s().p("AidBLIDLiYIBwAAIi9Cbg");
	this.shape_110.setTransform(-226.5,52.7);

	this.shape_111 = new cjs.Shape();
	this.shape_111.graphics.f("#314665").s().p("AidBMIDLiZIBwAAIi9Cbg");
	this.shape_111.setTransform(-224.3,52.8);

	this.shape_112 = new cjs.Shape();
	this.shape_112.graphics.f("#314665").s().p("AidBNIDLiaIBwAAIi9Cbg");
	this.shape_112.setTransform(-222.1,52.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_104}]}).to({state:[{t:this.shape_105}]},1).to({state:[{t:this.shape_106,p:{x:-237.7}}]},1).to({state:[{t:this.shape_106,p:{x:-235.4}}]},1).to({state:[{t:this.shape_107}]},1).to({state:[{t:this.shape_108}]},1).to({state:[{t:this.shape_109}]},1).to({state:[{t:this.shape_110}]},1).to({state:[{t:this.shape_111}]},1).to({state:[{t:this.shape_112}]},1).wait(1));

	// Layer 83
	this.shape_113 = new cjs.Shape();
	this.shape_113.graphics.f("#314665").s().p("AidBAIDKiKIBxAHIi7COg");
	this.shape_113.setTransform(-262.2,51.8);

	this.shape_114 = new cjs.Shape();
	this.shape_114.graphics.f("#314665").s().p("AidBBIDKiLIBxAGIi8CPg");
	this.shape_114.setTransform(-259.9,51.9);

	this.shape_115 = new cjs.Shape();
	this.shape_115.graphics.f("#314665").s().p("AidBBIDKiLIBxAFIi7CQg");
	this.shape_115.setTransform(-257.7,52);

	this.shape_116 = new cjs.Shape();
	this.shape_116.graphics.f("#314665").s().p("AidBCIDKiMIBxAEIi7CRg");
	this.shape_116.setTransform(-255.5,52.1);

	this.shape_117 = new cjs.Shape();
	this.shape_117.graphics.f("#314665").s().p("AidBDIDKiOIBxAEIi7CTg");
	this.shape_117.setTransform(-253.2,52.2);

	this.shape_118 = new cjs.Shape();
	this.shape_118.graphics.f("#314665").s().p("AidBDIDKiOIBxADIi8CTg");
	this.shape_118.setTransform(-251,52.3);

	this.shape_119 = new cjs.Shape();
	this.shape_119.graphics.f("#314665").s().p("AidBEIDKiPIBxACIi8CVg");
	this.shape_119.setTransform(-248.8,52.3);

	this.shape_120 = new cjs.Shape();
	this.shape_120.graphics.f("#314665").s().p("AidBFIDKiQIBxABIi8CWg");
	this.shape_120.setTransform(-246.6,52.4);

	this.shape_121 = new cjs.Shape();
	this.shape_121.graphics.f("#314665").s().p("AidBGIDKiRIBxAAIi7CXg");
	this.shape_121.setTransform(-244.3,52.5);

	this.shape_122 = new cjs.Shape();
	this.shape_122.graphics.f("#314665").s().p("AidBGIDKiRIBxAAIi8CXg");
	this.shape_122.setTransform(-242.1,52.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_113}]}).to({state:[{t:this.shape_114}]},1).to({state:[{t:this.shape_115}]},1).to({state:[{t:this.shape_116}]},1).to({state:[{t:this.shape_117}]},1).to({state:[{t:this.shape_118}]},1).to({state:[{t:this.shape_119}]},1).to({state:[{t:this.shape_120}]},1).to({state:[{t:this.shape_121}]},1).to({state:[{t:this.shape_122}]},1).wait(1));

	// Layer 84
	this.shape_123 = new cjs.Shape();
	this.shape_123.graphics.f("#314665").s().p("AihA9IDPiJIB0ANIjECMg");
	this.shape_123.setTransform(-281.8,49.7);

	this.shape_124 = new cjs.Shape();
	this.shape_124.graphics.f("#314665").s().p("AihA+IDOiKIB1ANIjDCMg");
	this.shape_124.setTransform(-279.6,50);

	this.shape_125 = new cjs.Shape();
	this.shape_125.graphics.f("#314665").s().p("AigA+IDOiKIBzAMIjCCNg");
	this.shape_125.setTransform(-277.4,50.2);

	this.shape_126 = new cjs.Shape();
	this.shape_126.graphics.f("#314665").s().p("AigA+IDOiJIBzAKIjBCNg");
	this.shape_126.setTransform(-275.2,50.4);

	this.shape_127 = new cjs.Shape();
	this.shape_127.graphics.f("#314665").s().p("AigA/IDNiKIBzAKIjACNg");
	this.shape_127.setTransform(-273,50.7);

	this.shape_128 = new cjs.Shape();
	this.shape_128.graphics.f("#314665").s().p("AifA/IDMiKIBzAJIi/COg");
	this.shape_128.setTransform(-270.9,50.9);

	this.shape_129 = new cjs.Shape();
	this.shape_129.graphics.f("#314665").s().p("AieA/IDLiKIByAJIi+CNg");
	this.shape_129.setTransform(-268.7,51.1);

	this.shape_130 = new cjs.Shape();
	this.shape_130.graphics.f("#314665").s().p("AieBAIDLiKIByAHIi9COg");
	this.shape_130.setTransform(-266.5,51.4);

	this.shape_131 = new cjs.Shape();
	this.shape_131.graphics.f("#314665").s().p("AieBAIDLiKIBxAHIi8COg");
	this.shape_131.setTransform(-264.3,51.6);

	this.shape_132 = new cjs.Shape();
	this.shape_132.graphics.f("#314665").s().p("AidBAIDKiKIBxAHIi7COg");
	this.shape_132.setTransform(-262.2,51.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_123}]}).to({state:[{t:this.shape_124}]},1).to({state:[{t:this.shape_125}]},1).to({state:[{t:this.shape_126}]},1).to({state:[{t:this.shape_127}]},1).to({state:[{t:this.shape_128}]},1).to({state:[{t:this.shape_129}]},1).to({state:[{t:this.shape_130}]},1).to({state:[{t:this.shape_131}]},1).to({state:[{t:this.shape_132}]},1).wait(1));

	// Layer 85
	this.shape_133 = new cjs.Shape();
	this.shape_133.graphics.f("#314665").s().p("Ai6A4IDtiFICIAQIj2CLg");
	this.shape_133.setTransform(-299.2,47.1);

	this.shape_134 = new cjs.Shape();
	this.shape_134.graphics.f("#314665").s().p("Ai3A4IDqiFICFAQIjxCLg");
	this.shape_134.setTransform(-297.3,47.4);

	this.shape_135 = new cjs.Shape();
	this.shape_135.graphics.f("#314665").s().p("Ai1A4IDniFICEAPIjuCMg");
	this.shape_135.setTransform(-295.3,47.7);

	this.shape_136 = new cjs.Shape();
	this.shape_136.graphics.f("#314665").s().p("AiyA4IDjiGICCAQIjoCNg");
	this.shape_136.setTransform(-293.4,48.1);

	this.shape_137 = new cjs.Shape();
	this.shape_137.graphics.f("#314665").s().p("AivA5IDgiHIB/APIjjCOg");
	this.shape_137.setTransform(-291.5,48.4);

	this.shape_138 = new cjs.Shape();
	this.shape_138.graphics.f("#314665").s().p("AisA6IDciIIB9APIjfCOg");
	this.shape_138.setTransform(-289.5,48.7);

	this.shape_139 = new cjs.Shape();
	this.shape_139.graphics.f("#314665").s().p("AiqA6IDaiIIB6AOIjaCPg");
	this.shape_139.setTransform(-287.6,49);

	this.shape_140 = new cjs.Shape();
	this.shape_140.graphics.f("#314665").s().p("AinA6IDWiIIB5ANIjVCQg");
	this.shape_140.setTransform(-285.7,49.3);

	this.shape_141 = new cjs.Shape();
	this.shape_141.graphics.f("#314665").s().p("AikA6IDSiIIB3ANIjRCRg");
	this.shape_141.setTransform(-283.7,49.7);

	this.shape_142 = new cjs.Shape();
	this.shape_142.graphics.f("#314665").s().p("AihA7IDPiKIB0ANIjMCSg");
	this.shape_142.setTransform(-281.8,50);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_133}]}).to({state:[{t:this.shape_134}]},1).to({state:[{t:this.shape_135}]},1).to({state:[{t:this.shape_136}]},1).to({state:[{t:this.shape_137}]},1).to({state:[{t:this.shape_138}]},1).to({state:[{t:this.shape_139}]},1).to({state:[{t:this.shape_140}]},1).to({state:[{t:this.shape_141}]},1).to({state:[{t:this.shape_142}]},1).wait(1));

	// Layer 86
	this.shape_143 = new cjs.Shape();
	this.shape_143.graphics.f("#314665").s().p("Ai5A1IDviHICEAaIj5CLg");
	this.shape_143.setTransform(-319.4,43.1);

	this.shape_144 = new cjs.Shape();
	this.shape_144.graphics.f("#314665").s().p("Ai5A1IDviGICEAZIj4CKg");
	this.shape_144.setTransform(-314.9,44);

	this.shape_145 = new cjs.Shape();
	this.shape_145.graphics.f("#314665").s().p("Ai5A2IDviGICEAXIj4CKg");
	this.shape_145.setTransform(-312.7,44.4);

	this.shape_146 = new cjs.Shape();
	this.shape_146.graphics.f("#314665").s().p("Ai5A2IDuiGICFAWIj3CLg");
	this.shape_146.setTransform(-310.4,44.8);

	this.shape_147 = new cjs.Shape();
	this.shape_147.graphics.f("#314665").s().p("Ai5A2IDtiFICGAVIj3CKg");
	this.shape_147.setTransform(-308.2,45.3);

	this.shape_148 = new cjs.Shape();
	this.shape_148.graphics.f("#314665").s().p("Ai5A2IDtiFICGAUIj2CKg");
	this.shape_148.setTransform(-305.9,45.8);

	this.shape_149 = new cjs.Shape();
	this.shape_149.graphics.f("#314665").s().p("Ai6A3IDuiFICHASIj3CLg");
	this.shape_149.setTransform(-303.7,46.2);

	this.shape_150 = new cjs.Shape();
	this.shape_150.graphics.f("#314665").s().p("Ai6A3IDtiEICIARIj3CKg");
	this.shape_150.setTransform(-301.5,46.6);

	this.shape_151 = new cjs.Shape();
	this.shape_151.graphics.f("#314665").s().p("Ai6A4IDtiFICIAQIj2CLg");
	this.shape_151.setTransform(-299.2,47.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_143,p:{x:-319.4,y:43.1}}]}).to({state:[{t:this.shape_143,p:{x:-317.2,y:43.5}}]},1).to({state:[{t:this.shape_144}]},1).to({state:[{t:this.shape_145}]},1).to({state:[{t:this.shape_146}]},1).to({state:[{t:this.shape_147}]},1).to({state:[{t:this.shape_148}]},1).to({state:[{t:this.shape_149}]},1).to({state:[{t:this.shape_150}]},1).to({state:[{t:this.shape_151}]},1).wait(1));

	// Layer 87
	this.shape_152 = new cjs.Shape();
	this.shape_152.graphics.f("#314665").s().p("AiyApIDih9ICDAhIjvCIg");
	this.shape_152.setTransform(-340,38.3);

	this.shape_153 = new cjs.Shape();
	this.shape_153.graphics.f("#314665").s().p("AizAqIDkh+ICCAhIjwCIg");
	this.shape_153.setTransform(-337.7,38.8);

	this.shape_154 = new cjs.Shape();
	this.shape_154.graphics.f("#314665").s().p("AizArIDkh+ICEAfIjyCJg");
	this.shape_154.setTransform(-335.4,39.4);

	this.shape_155 = new cjs.Shape();
	this.shape_155.graphics.f("#314665").s().p("Ai0AtIDmiAICDAeIjyCKg");
	this.shape_155.setTransform(-333.2,39.9);

	this.shape_156 = new cjs.Shape();
	this.shape_156.graphics.f("#314665").s().p("Ai1AuIDoiBICDAdIj0CLg");
	this.shape_156.setTransform(-330.9,40.5);

	this.shape_157 = new cjs.Shape();
	this.shape_157.graphics.f("#314665").s().p("Ai2AwIDqiDICDAdIj2CKg");
	this.shape_157.setTransform(-328.6,41);

	this.shape_158 = new cjs.Shape();
	this.shape_158.graphics.f("#314665").s().p("Ai3AxIDsiEICDAcIj3CLg");
	this.shape_158.setTransform(-326.3,41.5);

	this.shape_159 = new cjs.Shape();
	this.shape_159.graphics.f("#314665").s().p("Ai4AyIDuiFICDAcIj4CLg");
	this.shape_159.setTransform(-324.1,42.1);

	this.shape_160 = new cjs.Shape();
	this.shape_160.graphics.f("#314665").s().p("Ai5AzIDwiGICDAbIj6CMg");
	this.shape_160.setTransform(-321.8,42.6);

	this.shape_161 = new cjs.Shape();
	this.shape_161.graphics.f("#314665").s().p("Ai6A1IDyiIICDAaIj7CNg");
	this.shape_161.setTransform(-319.5,43.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_152}]}).to({state:[{t:this.shape_153}]},1).to({state:[{t:this.shape_154}]},1).to({state:[{t:this.shape_155}]},1).to({state:[{t:this.shape_156}]},1).to({state:[{t:this.shape_157}]},1).to({state:[{t:this.shape_158}]},1).to({state:[{t:this.shape_159}]},1).to({state:[{t:this.shape_160}]},1).to({state:[{t:this.shape_161}]},1).wait(1));

	// Layer 88
	this.shape_162 = new cjs.Shape();
	this.shape_162.graphics.f("#314665").s().p("AizAZID5hwIBuAxIj5B+g");
	this.shape_162.setTransform(-359.5,31.4);

	this.shape_163 = new cjs.Shape();
	this.shape_163.graphics.f("#314665").s().p("Ai0AbID4hxIBxAvIj5B+g");
	this.shape_163.setTransform(-357.4,32.1);

	this.shape_164 = new cjs.Shape();
	this.shape_164.graphics.f("#314665").s().p("Ai0AdID2hzIBzAtIj3CAg");
	this.shape_164.setTransform(-355.3,32.9);

	this.shape_165 = new cjs.Shape();
	this.shape_165.graphics.f("#314665").s().p("Ai1AeID1hzIB2ArIj3CAg");
	this.shape_165.setTransform(-353.2,33.6);

	this.shape_166 = new cjs.Shape();
	this.shape_166.graphics.f("#314665").s().p("Ai1AgIDzh1IB4AqIj2CBg");
	this.shape_166.setTransform(-351.1,34.4);

	this.shape_167 = new cjs.Shape();
	this.shape_167.graphics.f("#314665").s().p("Ai1AhIDxh2IB6AoIj0CCg");
	this.shape_167.setTransform(-349,35.2);

	this.shape_168 = new cjs.Shape();
	this.shape_168.graphics.f("#314665").s().p("Ai1AkIDvh4IB8AmIjzCDg");
	this.shape_168.setTransform(-346.8,35.9);

	this.shape_169 = new cjs.Shape();
	this.shape_169.graphics.f("#314665").s().p("Ai2AlIDuh4IB/AkIjzCEg");
	this.shape_169.setTransform(-344.7,36.7);

	this.shape_170 = new cjs.Shape();
	this.shape_170.graphics.f("#314665").s().p("Ai2AnIDsh6ICBAiIjxCFg");
	this.shape_170.setTransform(-342.6,37.4);

	this.shape_171 = new cjs.Shape();
	this.shape_171.graphics.f("#314665").s().p("Ai3AoIDsh6ICCAgIjwCFg");
	this.shape_171.setTransform(-340.5,38.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_162}]}).to({state:[{t:this.shape_163}]},1).to({state:[{t:this.shape_164}]},1).to({state:[{t:this.shape_165}]},1).to({state:[{t:this.shape_166}]},1).to({state:[{t:this.shape_167}]},1).to({state:[{t:this.shape_168}]},1).to({state:[{t:this.shape_169}]},1).to({state:[{t:this.shape_170}]},1).to({state:[{t:this.shape_171}]},1).wait(1));

	// Layer 89
	this.shape_172 = new cjs.Shape();
	this.shape_172.graphics.f("#314665").s().p("Ai/gFIEZhNIBmA8IkKBpg");
	this.shape_172.setTransform(-378.4,21.7);

	this.shape_173 = new cjs.Shape();
	this.shape_173.graphics.f("#314665").s().p("Ai+gCIEVhQIBoA7IkIBqg");
	this.shape_173.setTransform(-376.3,22.7);

	this.shape_174 = new cjs.Shape();
	this.shape_174.graphics.f("#314665").s().p("Ai9AAIEShTIBpA6IkGBtg");
	this.shape_174.setTransform(-374.3,23.8);

	this.shape_175 = new cjs.Shape();
	this.shape_175.graphics.f("#314665").s().p("Ai8AEIEOhWIBrA3IkEBug");
	this.shape_175.setTransform(-372.2,24.9);

	this.shape_176 = new cjs.Shape();
	this.shape_176.graphics.f("#314665").s().p("Ai7AHIELhaIBsA3IkCBwg");
	this.shape_176.setTransform(-370.2,25.9);

	this.shape_177 = new cjs.Shape();
	this.shape_177.graphics.f("#314665").s().p("Ai7ALIEJheIBuA1IkBByg");
	this.shape_177.setTransform(-368.1,27);

	this.shape_178 = new cjs.Shape();
	this.shape_178.graphics.f("#314665").s().p("Ai6AOIEFhhIBwAzIj/B0g");
	this.shape_178.setTransform(-366.1,28.1);

	this.shape_179 = new cjs.Shape();
	this.shape_179.graphics.f("#314665").s().p("Ai5ARIEChkIBxAxIj9B2g");
	this.shape_179.setTransform(-364,29.1);

	this.shape_180 = new cjs.Shape();
	this.shape_180.graphics.f("#314665").s().p("Ai4AVID+hoIBzAwIj7B3g");
	this.shape_180.setTransform(-362,30.2);

	this.shape_181 = new cjs.Shape();
	this.shape_181.graphics.f("#314665").s().p("Ai3AZID7hsIB0AuIj5B5g");
	this.shape_181.setTransform(-359.9,31.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_172}]}).to({state:[{t:this.shape_173}]},1).to({state:[{t:this.shape_174}]},1).to({state:[{t:this.shape_175}]},1).to({state:[{t:this.shape_176}]},1).to({state:[{t:this.shape_177}]},1).to({state:[{t:this.shape_178}]},1).to({state:[{t:this.shape_179}]},1).to({state:[{t:this.shape_180}]},1).to({state:[{t:this.shape_181}]},1).wait(1));

	// Layer 90
	this.shape_182 = new cjs.Shape();
	this.shape_182.graphics.f("#314665").s().p("AjCg6IFYAHIAtAzIknA8g");
	this.shape_182.setTransform(-393.5,9.8);

	this.shape_183 = new cjs.Shape();
	this.shape_183.graphics.f("#314665").s().p("AjCg4IFRgCIAzA1IkjBAg");
	this.shape_183.setTransform(-391.8,11.4);

	this.shape_184 = new cjs.Shape();
	this.shape_184.graphics.f("#314665").s().p("AjBgyIFJgLIA6A2IkhBFg");
	this.shape_184.setTransform(-390.1,12.7);

	this.shape_185 = new cjs.Shape();
	this.shape_185.graphics.f("#314665").s().p("AjBgrIFDgVIBAA3IkgBKg");
	this.shape_185.setTransform(-388.4,14);

	this.shape_186 = new cjs.Shape();
	this.shape_186.graphics.f("#314665").s().p("AjBglIE8geIBGA4IkdBPg");
	this.shape_186.setTransform(-386.7,15.3);

	this.shape_187 = new cjs.Shape();
	this.shape_187.graphics.f("#314665").s().p("AjAgfIE0goIBNA6IkaBUg");
	this.shape_187.setTransform(-385.1,16.6);

	this.shape_188 = new cjs.Shape();
	this.shape_188.graphics.f("#314665").s().p("AjAgZIEugxIBTA6IkYBbg");
	this.shape_188.setTransform(-383.4,17.9);

	this.shape_189 = new cjs.Shape();
	this.shape_189.graphics.f("#314665").s().p("Ai/gTIEmg6IBZA7IkVBgg");
	this.shape_189.setTransform(-381.7,19.2);

	this.shape_190 = new cjs.Shape();
	this.shape_190.graphics.f("#314665").s().p("Ai/gMIEfhEIBgA8IkTBlg");
	this.shape_190.setTransform(-380,20.5);

	this.shape_191 = new cjs.Shape();
	this.shape_191.graphics.f("#314665").s().p("Ai/gGIEZhNIBmA9IkRBqg");
	this.shape_191.setTransform(-378.4,21.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_182}]}).to({state:[{t:this.shape_183}]},1).to({state:[{t:this.shape_184}]},1).to({state:[{t:this.shape_185}]},1).to({state:[{t:this.shape_186}]},1).to({state:[{t:this.shape_187}]},1).to({state:[{t:this.shape_188}]},1).to({state:[{t:this.shape_189}]},1).to({state:[{t:this.shape_190}]},1).to({state:[{t:this.shape_191}]},1).wait(1));

	// Layer 91
	this.shape_192 = new cjs.Shape();
	this.shape_192.graphics.f("#314665").s().p("AipAhIAehlIE1AmIAABjg");
	this.shape_192.setTransform(-397.2,-6);

	this.shape_193 = new cjs.Shape();
	this.shape_193.graphics.f("#314665").s().p("AiNAqIgbgGIAVhjIE3AiIAFBdIk2gWg");
	this.shape_193.setTransform(-396.5,-4.6);

	this.shape_194 = new cjs.Shape();
	this.shape_194.graphics.f("#314665").s().p("AiOAxIgZgJIALhjIE6AfIAKBYIk2gLg");
	this.shape_194.setTransform(-395.7,-3.2);

	this.shape_195 = new cjs.Shape();
	this.shape_195.graphics.f("#314665").s().p("AiPA3IgXgLIAChjIE8AcIAQBTIk3gBg");
	this.shape_195.setTransform(-394.9,-1.8);

	this.shape_196 = new cjs.Shape();
	this.shape_196.graphics.f("#314665").s().p("AiiArIgHhjIE/AZIAVBOIk3AJIgWgNg");
	this.shape_196.setTransform(-394.5,0.2);

	this.shape_197 = new cjs.Shape();
	this.shape_197.graphics.f("#314665").s().p("AidAqIgQhiIFCAVIAZBHIk2AVIgVgPg");
	this.shape_197.setTransform(-394.2,2.1);

	this.shape_198 = new cjs.Shape();
	this.shape_198.graphics.f("#314665").s().p("AiXAoIgahhIFFARIAeBDIk2AfIgTgSg");
	this.shape_198.setTransform(-393.9,4.1);

	this.shape_199 = new cjs.Shape();
	this.shape_199.graphics.f("#314665").s().p("AiRAnIgkhhIFIANIAjA+Ik2ArIgRgVg");
	this.shape_199.setTransform(-393.6,6.1);

	this.shape_200 = new cjs.Shape();
	this.shape_200.graphics.f("#314665").s().p("AiMAlIgthhIFLALIAoA4Ik2A2IgQgYg");
	this.shape_200.setTransform(-393.3,8);

	this.shape_201 = new cjs.Shape();
	this.shape_201.graphics.f("#314665").s().p("Ai8g8IFMAHIAtA0Ik2A+g");
	this.shape_201.setTransform(-392.9,10);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_192}]}).to({state:[{t:this.shape_193}]},1).to({state:[{t:this.shape_194}]},1).to({state:[{t:this.shape_195}]},1).to({state:[{t:this.shape_196}]},1).to({state:[{t:this.shape_197}]},1).to({state:[{t:this.shape_198}]},1).to({state:[{t:this.shape_199}]},1).to({state:[{t:this.shape_200}]},1).to({state:[{t:this.shape_201}]},1).wait(1));

	// Layer 92
	this.shape_202 = new cjs.Shape();
	this.shape_202.graphics.f("#314665").s().p("Ai/AXIBehQIEhATIhQBhg");
	this.shape_202.setTransform(-388.6,-19.9);

	this.shape_203 = new cjs.Shape();
	this.shape_203.graphics.f("#314665").s().p("Ai8AYIBWhSIEjAVIhHBgg");
	this.shape_203.setTransform(-389.5,-18.4);

	this.shape_204 = new cjs.Shape();
	this.shape_204.graphics.f("#314665").s().p("Ai6AaIBQhWIElAYIg/Bhg");
	this.shape_204.setTransform(-390.5,-16.9);

	this.shape_205 = new cjs.Shape();
	this.shape_205.graphics.f("#314665").s().p("Ai4AaIBJhXIEnAaIg1Bhg");
	this.shape_205.setTransform(-391.4,-15.3);

	this.shape_206 = new cjs.Shape();
	this.shape_206.graphics.f("#314665").s().p("Ai1AbIBBhZIEqAcIgsBhg");
	this.shape_206.setTransform(-392.4,-13.7);

	this.shape_207 = new cjs.Shape();
	this.shape_207.graphics.f("#314665").s().p("AiyAdIA6hcIEsAeIgkBhg");
	this.shape_207.setTransform(-393.4,-12.2);

	this.shape_208 = new cjs.Shape();
	this.shape_208.graphics.f("#314665").s().p("AiwAeIAzheIEuAgIgaBhg");
	this.shape_208.setTransform(-394.4,-10.7);

	this.shape_209 = new cjs.Shape();
	this.shape_209.graphics.f("#314665").s().p("AiuAeIAshgIExAiIgSBig");
	this.shape_209.setTransform(-395.3,-9.1);

	this.shape_210 = new cjs.Shape();
	this.shape_210.graphics.f("#314665").s().p("AisAgIAmhjIEzAkIgJBjg");
	this.shape_210.setTransform(-396.3,-7.6);

	this.shape_211 = new cjs.Shape();
	this.shape_211.graphics.f("#314665").s().p("AipAhIAehlIE1AmIAABjg");
	this.shape_211.setTransform(-397.2,-6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_202}]}).to({state:[{t:this.shape_203}]},1).to({state:[{t:this.shape_204}]},1).to({state:[{t:this.shape_205}]},1).to({state:[{t:this.shape_206}]},1).to({state:[{t:this.shape_207}]},1).to({state:[{t:this.shape_208}]},1).to({state:[{t:this.shape_209}]},1).to({state:[{t:this.shape_210}]},1).to({state:[{t:this.shape_211}]},1).wait(1));

	// Layer 93
	this.shape_212 = new cjs.Shape();
	this.shape_212.graphics.f("#314665").s().p("Ai5ARIBeg4IEVARIhdA9g");
	this.shape_212.setTransform(-373.2,-32.7);

	this.shape_213 = new cjs.Shape();
	this.shape_213.graphics.f("#314665").s().p("Ai6ARIBeg6IEXARIhcBCg");
	this.shape_213.setTransform(-374.9,-31.3);

	this.shape_214 = new cjs.Shape();
	this.shape_214.graphics.f("#314665").s().p("Ai7ASIBfg9IEYASIhbBFg");
	this.shape_214.setTransform(-376.6,-29.9);

	this.shape_215 = new cjs.Shape();
	this.shape_215.graphics.f("#314665").s().p("Ai7ATIBehAIEZASIhZBJg");
	this.shape_215.setTransform(-378.3,-28.4);

	this.shape_216 = new cjs.Shape();
	this.shape_216.graphics.f("#314665").s().p("Ai8AUIBfhDIEaASIhYBNg");
	this.shape_216.setTransform(-380,-27);

	this.shape_217 = new cjs.Shape();
	this.shape_217.graphics.f("#314665").s().p("Ai9AUIBfhFIEbASIhVBRg");
	this.shape_217.setTransform(-381.7,-25.6);

	this.shape_218 = new cjs.Shape();
	this.shape_218.graphics.f("#314665").s().p("Ai9AVIBfhIIEcASIhVBVg");
	this.shape_218.setTransform(-383.4,-24.2);

	this.shape_219 = new cjs.Shape();
	this.shape_219.graphics.f("#314665").s().p("Ai+AWIBfhLIEeATIhTBYg");
	this.shape_219.setTransform(-385.1,-22.8);

	this.shape_220 = new cjs.Shape();
	this.shape_220.graphics.f("#314665").s().p("Ai+AXIBehOIEfATIhRBcg");
	this.shape_220.setTransform(-386.9,-21.4);

	this.shape_221 = new cjs.Shape();
	this.shape_221.graphics.f("#314665").s().p("Ai/AXIBehQIEhATIhQBhg");
	this.shape_221.setTransform(-388.6,-19.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_212}]}).to({state:[{t:this.shape_213}]},1).to({state:[{t:this.shape_214}]},1).to({state:[{t:this.shape_215}]},1).to({state:[{t:this.shape_216}]},1).to({state:[{t:this.shape_217}]},1).to({state:[{t:this.shape_218}]},1).to({state:[{t:this.shape_219}]},1).to({state:[{t:this.shape_220}]},1).to({state:[{t:this.shape_221}]},1).wait(1));

	// Layer 94
	this.shape_222 = new cjs.Shape();
	this.shape_222.graphics.f("#314665").s().p("AisALIBngtIDyAZIhdAsg");
	this.shape_222.setTransform(-357,-41.7);

	this.shape_223 = new cjs.Shape();
	this.shape_223.graphics.f("#314665").s().p("AiuALIBngtID1AXIhcAug");
	this.shape_223.setTransform(-358.8,-40.7);

	this.shape_224 = new cjs.Shape();
	this.shape_224.graphics.f("#314665").s().p("AivAMIBlgvID6AXIhdAwg");
	this.shape_224.setTransform(-360.6,-39.7);

	this.shape_225 = new cjs.Shape();
	this.shape_225.graphics.f("#314665").s().p("AixANIBlgwID+AWIheAxg");
	this.shape_225.setTransform(-362.4,-38.7);

	this.shape_226 = new cjs.Shape();
	this.shape_226.graphics.f("#314665").s().p("AiyANIBkgxIEBAVIhdA0g");
	this.shape_226.setTransform(-364.2,-37.7);

	this.shape_227 = new cjs.Shape();
	this.shape_227.graphics.f("#314665").s().p("Ai0AOIBjgzIEFAUIhdA2g");
	this.shape_227.setTransform(-366,-36.7);

	this.shape_228 = new cjs.Shape();
	this.shape_228.graphics.f("#314665").s().p("Ai1AOIBigzIEJATIheA4g");
	this.shape_228.setTransform(-367.8,-35.7);

	this.shape_229 = new cjs.Shape();
	this.shape_229.graphics.f("#314665").s().p("Ai2APIBgg1IEOATIheA6g");
	this.shape_229.setTransform(-369.6,-34.7);

	this.shape_230 = new cjs.Shape();
	this.shape_230.graphics.f("#314665").s().p("Ai4AQIBgg2IERARIhdA8g");
	this.shape_230.setTransform(-371.4,-33.7);

	this.shape_231 = new cjs.Shape();
	this.shape_231.graphics.f("#314665").s().p("Ai5ARIBeg4IEVARIhdA9g");
	this.shape_231.setTransform(-373.2,-32.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_222}]}).to({state:[{t:this.shape_223}]},1).to({state:[{t:this.shape_224}]},1).to({state:[{t:this.shape_225}]},1).to({state:[{t:this.shape_226}]},1).to({state:[{t:this.shape_227}]},1).to({state:[{t:this.shape_228}]},1).to({state:[{t:this.shape_229}]},1).to({state:[{t:this.shape_230}]},1).to({state:[{t:this.shape_231}]},1).wait(1));

	// Layer 95
	this.shape_232 = new cjs.Shape();
	this.shape_232.graphics.f("#314665").s().p("AikABIBegcIDrAWIhdAgg");
	this.shape_232.setTransform(-341.4,-48);

	this.shape_233 = new cjs.Shape();
	this.shape_233.graphics.f("#314665").s().p("AilACIBfgdIDsAVIhdAig");
	this.shape_233.setTransform(-343.1,-47.3);

	this.shape_234 = new cjs.Shape();
	this.shape_234.graphics.f("#314665").s().p("AilADIBfgfIDtAWIhdAjg");
	this.shape_234.setTransform(-344.8,-46.6);

	this.shape_235 = new cjs.Shape();
	this.shape_235.graphics.f("#314665").s().p("AinAEIBhghIDuAXIheAkg");
	this.shape_235.setTransform(-346.6,-45.9);

	this.shape_236 = new cjs.Shape();
	this.shape_236.graphics.f("#314665").s().p("AinAFIBigjIDtAXIhcAmg");
	this.shape_236.setTransform(-348.3,-45.2);

	this.shape_237 = new cjs.Shape();
	this.shape_237.graphics.f("#314665").s().p("AioAHIBigmIDvAYIhdAng");
	this.shape_237.setTransform(-350.1,-44.5);

	this.shape_238 = new cjs.Shape();
	this.shape_238.graphics.f("#314665").s().p("AipAIIBkgnIDvAXIhdAog");
	this.shape_238.setTransform(-351.8,-43.8);

	this.shape_239 = new cjs.Shape();
	this.shape_239.graphics.f("#314665").s().p("AiqAJIBlgpIDwAYIhdApg");
	this.shape_239.setTransform(-353.6,-43.1);

	this.shape_240 = new cjs.Shape();
	this.shape_240.graphics.f("#314665").s().p("AirAKIBmgrIDxAYIhdArg");
	this.shape_240.setTransform(-355.3,-42.4);

	this.shape_241 = new cjs.Shape();
	this.shape_241.graphics.f("#314665").s().p("AisALIBngtIDyAZIhdAsg");
	this.shape_241.setTransform(-357,-41.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_232}]}).to({state:[{t:this.shape_233}]},1).to({state:[{t:this.shape_234}]},1).to({state:[{t:this.shape_235}]},1).to({state:[{t:this.shape_236}]},1).to({state:[{t:this.shape_237}]},1).to({state:[{t:this.shape_238}]},1).to({state:[{t:this.shape_239}]},1).to({state:[{t:this.shape_240}]},1).to({state:[{t:this.shape_241}]},1).wait(1));

	// Layer 96
	this.shape_242 = new cjs.Shape();
	this.shape_242.graphics.f("#314665").s().p("AihACIBYgWIDrATIhdAWg");
	this.shape_242.setTransform(-326.3,-52.5);

	this.shape_243 = new cjs.Shape();
	this.shape_243.graphics.f("#314665").s().p("AihACIBZgXIDqAUIhdAXg");
	this.shape_243.setTransform(-328,-52);

	this.shape_244 = new cjs.Shape();
	this.shape_244.graphics.f("#314665").s().p("AihACIBZgYIDqAUIhdAZg");
	this.shape_244.setTransform(-329.7,-51.5);

	this.shape_245 = new cjs.Shape();
	this.shape_245.graphics.f("#314665").s().p("AiiACIBagYIDqAUIheAZg");
	this.shape_245.setTransform(-331.3,-51);

	this.shape_246 = new cjs.Shape();
	this.shape_246.graphics.f("#314665").s().p("AiiABIBbgZIDqAWIhfAbg");
	this.shape_246.setTransform(-333,-50.5);

	this.shape_247 = new cjs.Shape();
	this.shape_247.graphics.f("#314665").s().p("AiiAAIBcgZIDpAWIheAdg");
	this.shape_247.setTransform(-334.8,-49.9);

	this.shape_248 = new cjs.Shape();
	this.shape_248.graphics.f("#314665").s().p("AiiABIBcgaIDpAWIheAeg");
	this.shape_248.setTransform(-336.5,-49.4);

	this.shape_249 = new cjs.Shape();
	this.shape_249.graphics.f("#314665").s().p("AiiAAIBdgaIDoAXIheAeg");
	this.shape_249.setTransform(-338.1,-48.9);

	this.shape_250 = new cjs.Shape();
	this.shape_250.graphics.f("#314665").s().p("AiiAAIBdgbIDoAXIheAgg");
	this.shape_250.setTransform(-339.8,-48.4);

	this.shape_251 = new cjs.Shape();
	this.shape_251.graphics.f("#314665").s().p("AiiAAIBdgcIDoAYIheAhg");
	this.shape_251.setTransform(-341.5,-47.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_242}]}).to({state:[{t:this.shape_243}]},1).to({state:[{t:this.shape_244}]},1).to({state:[{t:this.shape_245}]},1).to({state:[{t:this.shape_246}]},1).to({state:[{t:this.shape_247}]},1).to({state:[{t:this.shape_248}]},1).to({state:[{t:this.shape_249}]},1).to({state:[{t:this.shape_250}]},1).to({state:[{t:this.shape_251}]},1).wait(1));

	// Layer 97
	this.shape_252 = new cjs.Shape();
	this.shape_252.graphics.f("#314665").s().p("AikAAIBSgTID3AXIhdAQg");
	this.shape_252.setTransform(-311.7,-56.1);

	this.shape_253 = new cjs.Shape();
	this.shape_253.graphics.f("#314665").s().p("AijAAIBTgUID0AXIhdARg");
	this.shape_253.setTransform(-313.4,-55.6);

	this.shape_254 = new cjs.Shape();
	this.shape_254.graphics.f("#314665").s().p("AijAAIBUgUIDzAXIhdASg");
	this.shape_254.setTransform(-315,-55.3);

	this.shape_255 = new cjs.Shape();
	this.shape_255.graphics.f("#314665").s().p("AiiAAIBUgUIDxAWIhdATg");
	this.shape_255.setTransform(-316.7,-54.8);

	this.shape_256 = new cjs.Shape();
	this.shape_256.graphics.f("#314665").s().p("AihAAIBVgUIDuAVIhcAUg");
	this.shape_256.setTransform(-318.3,-54.4);

	this.shape_257 = new cjs.Shape();
	this.shape_257.graphics.f("#314665").s().p("AihAAIBWgVIDsAWIhbAVg");
	this.shape_257.setTransform(-320,-54);

	this.shape_258 = new cjs.Shape();
	this.shape_258.graphics.f("#314665").s().p("AigAAIBXgVIDqAVIhbAWg");
	this.shape_258.setTransform(-321.6,-53.6);

	this.shape_259 = new cjs.Shape();
	this.shape_259.graphics.f("#314665").s().p("AifAAIBXgVIDoAVIhbAWg");
	this.shape_259.setTransform(-323.3,-53.2);

	this.shape_260 = new cjs.Shape();
	this.shape_260.graphics.f("#314665").s().p("AieAAIBXgVIDmAVIhbAWg");
	this.shape_260.setTransform(-324.9,-52.8);

	this.shape_261 = new cjs.Shape();
	this.shape_261.graphics.f("#314665").s().p("AieABIBYgXIDlAWIhbAWg");
	this.shape_261.setTransform(-326.6,-52.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_252}]}).to({state:[{t:this.shape_253}]},1).to({state:[{t:this.shape_254}]},1).to({state:[{t:this.shape_255}]},1).to({state:[{t:this.shape_256}]},1).to({state:[{t:this.shape_257}]},1).to({state:[{t:this.shape_258}]},1).to({state:[{t:this.shape_259}]},1).to({state:[{t:this.shape_260}]},1).to({state:[{t:this.shape_261}]},1).wait(1));

	// Layer 98
	this.shape_262 = new cjs.Shape();
	this.shape_262.graphics.f("#314665").s().p("AirgFIBKgPIENAfIhfAKg");
	this.shape_262.setTransform(-297.4,-58.5);

	this.shape_263 = new cjs.Shape();
	this.shape_263.graphics.f("#314665").s().p("AiqgFIBLgPIEJAeIhdAKg");
	this.shape_263.setTransform(-299,-58.2);

	this.shape_264 = new cjs.Shape();
	this.shape_264.graphics.f("#314665").s().p("AiogFIBLgPIEGAeIhdALg");
	this.shape_264.setTransform(-300.7,-57.9);

	this.shape_265 = new cjs.Shape();
	this.shape_265.graphics.f("#314665").s().p("AiogEIBNgQIEEAeIheALg");
	this.shape_265.setTransform(-302.3,-57.6);

	this.shape_266 = new cjs.Shape();
	this.shape_266.graphics.f("#314665").s().p("AimgEIBNgQIEAAeIhdALg");
	this.shape_266.setTransform(-303.9,-57.4);

	this.shape_267 = new cjs.Shape();
	this.shape_267.graphics.f("#314665").s().p("AilgDIBOgRID9AdIhdANg");
	this.shape_267.setTransform(-305.5,-57);

	this.shape_268 = new cjs.Shape();
	this.shape_268.graphics.f("#314665").s().p("AikgDIBPgSID6AeIhdANg");
	this.shape_268.setTransform(-307.2,-56.8);

	this.shape_269 = new cjs.Shape();
	this.shape_269.graphics.f("#314665").s().p("AijgDIBRgSID2AeIhcANg");
	this.shape_269.setTransform(-308.8,-56.5);

	this.shape_270 = new cjs.Shape();
	this.shape_270.graphics.f("#314665").s().p("AiigDIBRgSID0AeIhcANg");
	this.shape_270.setTransform(-310.4,-56.2);

	this.shape_271 = new cjs.Shape();
	this.shape_271.graphics.f("#314665").s().p("AiggCIBSgTIDwAdIhcAOg");
	this.shape_271.setTransform(-312,-55.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_262}]}).to({state:[{t:this.shape_263}]},1).to({state:[{t:this.shape_264}]},1).to({state:[{t:this.shape_265}]},1).to({state:[{t:this.shape_266}]},1).to({state:[{t:this.shape_267}]},1).to({state:[{t:this.shape_268}]},1).to({state:[{t:this.shape_269}]},1).to({state:[{t:this.shape_270}]},1).to({state:[{t:this.shape_271}]},1).wait(1));

	// Layer 99
	this.shape_272 = new cjs.Shape();
	this.shape_272.graphics.f("#314665").s().p("AirgFIBKgPIENAfIhfAKg");
	this.shape_272.setTransform(-297.4,-58.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_272).wait(10));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-414.3,-60.6,808.7,121.3);


(lib.gr_ani7_6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// Layer 1
	this.instance = new lib.gr_box6("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:-146.6,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.gr_ani7_5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// Layer 1
	this.instance = new lib.gr_box5("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:-65.6,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.gr_ani7_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// Layer 1
	this.instance = new lib.gr_box4("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:16.4,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.gr_ani7_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// Layer 1
	this.instance = new lib.gr_box3("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:99.4,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.gr_ani7_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// box ani
	this.instance = new lib.gr_box2("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:181.4,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.gr_ani7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_134 = function() {
		/* stop();
		*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(134).call(this.frame_134).wait(1));

	// Layer 1
	this.instance = new lib.gr_box1("synched",0);
	this.instance.setTransform(-283.2,29.9,0.252,0.252,0,0,180,1.2,0.6);
	this.instance.alpha = 0.91;

	this.timeline.addTween(cjs.Tween.get(this.instance).to({scaleX:0.7,scaleY:0.7,guide:{path:[-283.1,30,-354.7,43.5,-380.6,60.8,-406.6,78,-387,99]},alpha:0.941},38).to({scaleX:1,scaleY:1,guide:{path:[-387,98.9,-386.8,99,-386.7,99.1,-316,128.7,-230.7,122.9]},alpha:0.98},39).to({x:263.4,y:124.5},55).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-296.7,23.8,27.4,16.2);


(lib.btn_6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{normal:0,over:1,down:2,disable:3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJgACTAzIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_2.setTransform(34.2,-26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_3.setTransform(-21.5,-23.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJABXhyIA8ClIFmAAIBeilg");
	this.shape_4.setTransform(-0.2,-23.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_2},{t:this.shape_3},{t:this.shape_4}]},1).wait(1));

	// box
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_5.setTransform(33.7,-8.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_6.setTransform(33.7,27.3);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_7.setTransform(34.5,9.2);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_8.setTransform(33.3,8.9);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_9.setTransform(-35.6,-15.2);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_10.setTransform(0,8.9);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_11.setTransform(14.5,-15.4);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_12.setTransform(-16.5,12.7);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_13.setTransform(-16.8,-15.2);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_14.setTransform(14.6,-15.3);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("ACkjKIqYAAIAAHRIKfAQIFKhaIAAnTIrGAA");
	this.shape_15.setTransform(0,8.9);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("Ai6glQB1AYB0AWQARADASADIBpAX");
	this.shape_16.setTransform(-2.3,-15.2);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_17.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_14},{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5}]}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_17},{t:this.shape_16},{t:this.shape_15},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5}]},2).wait(2));

	// text
	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgACqgpIgFAAQgJABgHAEQgIADgGAGQgGAGgFALQgEAKAAALQAAAMAEAJQAEAJAHAEQAHAFAKAAQAKAAAGgEQAHgFAEgHQADgHAAgJQAAgJgDgGQgEgFgGgDQgGgEgIAAQgIAAgFADQgGADgDADIAAAAQABgGADgHQAEgHAHgEQAHgFAJgCIAFAAIAEAAIAAgLIgDABgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACNAlQgEgDgCgGQgDgGAAgHIABgDIABgDQACgFAFgDQAFgBAFAAQAJAAAFAEQAFAFAAAKQAAAKgFAGQgFAGgIAAQgGAAgFgEgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#FFFFFF").s().p("ACLArQgHgEgEgJQgEgJAAgMQAAgLAEgKQAEgLAHgGQAGgGAHgDQAHgEAJgBIAFAAIAEgBIAAALIgEAAIgFAAQgKACgHAFQgGAEgEAHQgEAHgBAHIABAAQADgEAFgDQAGgDAIAAQAIAAAGAEQAGADADAFQAEAGAAAJQAAAJgEAHQgDAHgHAFQgHAEgJAAQgKAAgHgFgACQAAQgEACgDAFIgBADIAAADQAAAHACAGQACAGAFADQAEAEAHAAQAIAAAFgGQAEgGABgKQgBgKgFgFQgFgEgIAAQgGAAgFACgAiqAvIgIgCIgHgDIADgKIAKAEIAMACQAJAAAGgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHAAgKQAAgHAEgGQAEgFAHgEQAGgDAKAAQAHAAAFABIAIADIgDAKIgHgCIgLgCQgGAAgEACQgEACgCAEQgCADAAADQAAAHAFAEQAEAEAKADQAMAFAGAEQAGAHAAAKQAAAHgDAHQgEAGgHADQgIAEgLAAIgJgBgAAZAvIAAhbIALgCIANAAQAJAAAGACQAHACAEAEQAEADACAFQACAFAAAGQAAAHgBAFQgCAFgEACQgFAFgHACQgIADgJAAIgFAAIgEgBIAAAmgAAqgkIgEAAIAAAkIAEAAIAGAAQALAAAGgDQAGgFAAgKQAAgJgGgFQgGgFgKAAIgHABgAgqAvIAAhdIAxAAIAAALIgkAAIAAAdIAiAAIAAAJIgiAAIAAAhIAmAAIAAALgAhdAvIAAhSIgdAAIAAgLIBGAAIAAALIgdAAIAABSg");
	this.shape_19.setTransform(-16.6,11.8);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgACqgpIgFAAQgJABgHAEQgIADgGAGQgGAGgFALQgEAKAAALQAAAMAEAJQAEAJAHAEQAHAFAKAAQAKAAAGgEQAHgFAEgHQADgHAAgJQAAgJgDgGQgEgFgGgDQgGgEgIAAQgIAAgFADQgGADgDADIAAAAQABgGADgHQAEgHAHgEQAHgFAJgCIAFAAIAEAAIAAgLIgDABgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACNAlQgEgDgCgGQgDgGAAgHIABgDIABgDQACgFAFgDQAFgBAFAAQAJAAAFAEQAFAFAAAKQAAAKgFAGQgFAGgIAAQgGAAgFgEgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_20.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_19},{t:this.shape_18}]}).to({state:[{t:this.shape_19},{t:this.shape_18}]},1).to({state:[{t:this.shape_19},{t:this.shape_20}]},1).to({state:[{t:this.shape_19},{t:this.shape_20}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.btn_5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"normal":0,"over":1,"down":2,"disable":3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJgACTAzIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_2.setTransform(34.2,-26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_3.setTransform(-21.5,-23.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).wait(1));

	// box
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_4.setTransform(33.7,-8.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_5.setTransform(33.7,27.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_6.setTransform(34.5,9.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_7.setTransform(33.3,8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_8.setTransform(-35.6,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_9.setTransform(0,8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_10.setTransform(14.5,-15.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_11.setTransform(-16.5,12.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_12.setTransform(-16.8,-15.2);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_13.setTransform(14.6,-15.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AC7AmIhpgXQgSgDgRgDQh0gWh1gY");
	this.shape_14.setTransform(-2.3,-15.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_15.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_15},{t:this.shape_14},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},2).wait(2));

	// text
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("ACIAuQgGgBgDgCIADgKIAIAEQAFABAGAAQAHAAAEgCQAFgCADgFQADgEAAgGQAAgJgHgGQgFgEgOAAIgHAAIgGAAIAGgqIAsAAIAAAKIgjAAIgDAXIACAAIAFAAIAKABQAFABAFADQAFADAEAEQADAGAAAIQABAJgFAHQgFAHgHAEQgIAEgKAAQgHAAgGgCgAioAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAAcAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAtgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgoAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhbAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_16.setTransform(-16.8,11.8);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AtQADACAGABQAGACAIAAQAKAAAHgEQAIgEAEgHQAFgHAAgJQAAgIgEgGQgEgFgFgCQgFgDgFgBIgKgBIgEAAIgDAAIADgXIAjAAIAAgKIgsAAIgGApIAGAAIAHgBQAOABAGAFQAGAGAAAJQAAAGgDAEQgDAFgFACQgEACgGAAQgHAAgFgBIgIgEgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_17.setTransform(-16.3,11.6);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AtQADACAGABQAGACAIAAQAKAAAHgEQAIgEAEgHQAFgHAAgJQAAgIgEgGQgEgFgFgCQgFgDgFgBIgKgBIgEAAIgDAAIADgXIAjAAIAAgKIgsAAIgGApIAGAAIAHgBQAOABAGAFQAGAGAAAJQAAAGgDAEQgDAFgFACQgEACgGAAQgHAAgFgBIgIgEgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1).to({state:[{t:this.shape_16},{t:this.shape_18}]},1).to({state:[{t:this.shape_18},{t:this.shape_16}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.btn_4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"normal":0,"over":1,"down":2,"disable":3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJgACTAzIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_2.setTransform(34.2,-26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_3.setTransform(-21.5,-23.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).wait(1));

	// box
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_4.setTransform(33.7,-8.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_5.setTransform(33.7,27.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_6.setTransform(34.5,9.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_7.setTransform(33.3,8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_8.setTransform(-35.6,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_9.setTransform(0,8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_10.setTransform(14.5,-15.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_11.setTransform(-16.5,12.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_12.setTransform(-16.8,-15.2);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_13.setTransform(14.6,-15.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AC7AmIhpgXQgSgDgRgDQh0gWh1gY");
	this.shape_14.setTransform(-2.3,-15.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_15.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_15},{t:this.shape_14},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},2).wait(2));

	// text
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AirAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgACiAvIAAgZIgqAAIAAgIIAog4IAOAAIAAA2IANAAIAAAKIgNAAIAAAZgACfgXIgEAGIgWAdIAdAAIAAgcIABgOIgBAAIgDAHgAAZAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAqgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgrAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAheAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_16.setTransform(-16.5,11.8);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAB1AQIAAAIIArAAIAAAZIALAAIAAgZIANAAIAAgKIgNAAIAAg2IgNAAgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACCAOIAWgdIAEgGIAEgHIAAAAIAAAOIAAAcgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_17.setTransform(-16.3,11.6);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAB1AQIAAAIIArAAIAAAZIALAAIAAgZIANAAIAAgKIgNAAIAAg2IgNAAgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgACCAOIAWgdIAEgGIAEgHIAAAAIAAAOIAAAcgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1).to({state:[{t:this.shape_18},{t:this.shape_16}]},1).to({state:[{t:this.shape_18},{t:this.shape_16}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.btn_3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"normal":0,"over":1,"down":2,"disable":3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJgACTAzIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_2.setTransform(34.2,-26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_3.setTransform(-21.5,-23.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).wait(1));

	// box
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_4.setTransform(33.7,-8.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_5.setTransform(33.7,27.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_6.setTransform(34.5,9.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_7.setTransform(33.3,8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_8.setTransform(-35.6,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_9.setTransform(0,8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_10.setTransform(14.5,-15.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_11.setTransform(-16.5,12.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_12.setTransform(-16.8,-15.2);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_13.setTransform(14.6,-15.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AC7AmIhpgXQgSgDgRgDQh0gWh1gY");
	this.shape_14.setTransform(-2.3,-15.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_15.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_15},{t:this.shape_14},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},2).wait(2));

	// text
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AsIAKAEQAGACAIAAQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgGgDgFQgDgFgEgDQgFgDgFgBIAAAAQAIgCAEgFQAEgGAAgHQAAgGgCgFQgDgFgGgDQgGgDgJAAQgHAAgGACQgHACgDADIADAJIAIgEQAEgCAGAAQAGAAADACQAEACABADQACADAAAEQAAAFgDAEQgDADgFACIgJABIgHAAIAAAIIAHAAQAGAAAFABQAFACAEAEQADAEAAAHQAAAEgCAEQgBAEgFACQgEADgIAAQgHAAgFgCIgJgDgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_16.setTransform(-16.3,11.6);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("ACIAuIgJgEIADgJIAIADQAGACAHAAQAHAAAFgDQAFgCABgEQACgEAAgEQAAgHgEgEQgDgEgFgCQgFgBgHAAIgHAAIAAgIIAHAAIAJgBQAGgCACgDQADgEABgFQAAgEgCgDQgCgDgDgCQgDgCgGAAQgGAAgEACIgIAEIgEgJQAEgDAGgCQAHgCAHAAQAJAAAGADQAGADADAFQACAFAAAGQAAAHgEAGQgEAFgJADIAAABQAGAAAEACQAFADADAFQADAFgBAGQABAHgEAHQgEAGgHADQgIAEgKAAQgJAAgGgCgAioAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAAcAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAtgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgoAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhbAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_17.setTransform(-16.8,11.8);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgAB5AsIAKAEQAGACAIAAQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgGgDgFQgDgFgEgDQgFgDgFgBIAAAAQAIgCAEgFQAEgGAAgHQAAgGgCgFQgDgFgGgDQgGgDgJAAQgHAAgGACQgHACgDADIADAJIAIgEQAEgCAGAAQAGAAADACQAEACABADQACADAAAEQAAAFgDAEQgDADgFACIgJABIgHAAIAAAIIAHAAQAGAAAFABQAFACAEAEQADAEAAAHQAAAEgCAEQgBAEgFACQgEADgIAAQgHAAgFgCIgJgDgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1).to({state:[{t:this.shape_17},{t:this.shape_18}]},1).to({state:[{t:this.shape_17},{t:this.shape_18}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.btn_2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"normal":0,"over":1,"down":2,"disable":3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ACTAzIAaBJIqfAAIhkjqIKjgOIAKAKIA8ClIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_2.setTransform(-21.5,-23.8);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_3.setTransform(34.2,-26.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).wait(1));

	// box
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_4.setTransform(33.7,-8.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_5.setTransform(33.7,27.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_6.setTransform(34.5,9.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_7.setTransform(33.3,8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_8.setTransform(-35.6,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_9.setTransform(0,8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_10.setTransform(14.5,-15.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_11.setTransform(-16.5,12.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_12.setTransform(-16.8,-15.2);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_13.setTransform(14.6,-15.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AC7AmIhpgXQgSgDgRgDQh0gWh1gY");
	this.shape_14.setTransform(-2.3,-15.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_15.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_15},{t:this.shape_14},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},2).wait(2));

	// text
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgACegdQAEADABAEQACAEAAAEQAAAHgEAHQgDAFgIAIIgTATIgJAJIAAAIIA6AAIAAgLIgpAAIAHgGIARgSQAHgIADgGQAEgHAAgIQAAgHgCgGQgDgGgHgEQgGgEgJAAQgIAAgHADQgGACgFAEIAEAJQADgDAFgCQAFgCAGAAQAHAAAEACgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_16.setTransform(-16.3,11.6);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#FFFFFF").s().p("AipAvIgIgCIgHgDIAEgKIAKAEIALACQAKAAAFgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHABgKQAAgHADgGQAEgFAHgEQAHgDAJAAQAHAAAFABIAIADIgCAKIgIgCIgKgCQgHAAgEACQgEACgCAEQgBADAAADQAAAHAEAEQAEAEAKADQANAFAFAEQAGAHABAKQAAAHgEAHQgEAGgHADQgHAEgMAAIgJgBgAB+AvIAAgIIAKgJIATgTQAHgIAEgFQAEgHAAgHQAAgEgCgEQgCgEgEgDQgDgCgHAAQgGAAgFACQgGACgCADIgFgJQAGgEAGgCQAHgDAHAAQAKAAAGAEQAHAEADAGQACAGAAAHQAAAIgEAIQgEAFgGAIIgRASIgHAGIAoAAIAAALgAAbAvIAAhbIAKgCIANAAQAJAAAGACQAIACADAEQAFADABAFQACAFAAAGQAAAHgBAFQgCAFgDACQgGAFgHACQgIADgJAAIgEAAIgFgBIAAAmgAAsgkIgFAAIAAAkIAFAAIAFAAQALAAAGgDQAGgFAAgKQABgJgHgFQgGgFgJAAIgHABgAgpAvIAAhdIAyAAIAAALIglAAIAAAdIAjAAIAAAJIgjAAIAAAhIAmAAIAAALgAhcAvIAAhSIgdAAIAAgLIBGAAIAAALIgcAAIAABSg");
	this.shape_17.setTransform(-16.7,11.8);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgACegdQAEADABAEQACAEAAAEQAAAHgEAHQgDAFgIAIIgTATIgJAJIAAAIIA6AAIAAgLIgpAAIAHgGIARgSQAHgIADgGQAEgHAAgIQAAgHgCgGQgDgGgHgEQgGgEgJAAQgIAAgHADQgGACgFAEIAEAJQADgDAFgCQAFgCAGAAQAHAAAEACgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1).to({state:[{t:this.shape_17},{t:this.shape_18}]},1).to({state:[{t:this.shape_17},{t:this.shape_18}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


(lib.btn_1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{"normal":0,"over":1,"down":2,"disable":3});

	// timeline functions:
	this.frame_0 = function() {
		/* stop();*/
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(4));

	// outline
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F28900").ss(2,1,1).p("AjRkUILFgDIABHVIlKBaIqfgPIAAnRg");
	this.shape.setTransform(0,8.7);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("rgba(148,148,148,0.2)").ss(1,1,1).p("ABXhyIgKgKIqjAOIBkDqIKfAAIgahJgACTAzIFmAAIBeilIoAAA");
	this.shape_1.setTransform(-0.2,-23.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],31.7,-8.5,-31.6,8.5).s().p("AjCBTIg8ilIH9AAIheClg");
	this.shape_2.setTransform(34.2,-26.9);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],45.7,-8.7,-11,6.5).s().p("AkdB8IhkjqIKjgNIALAKIA7CkIAaBJg");
	this.shape_3.setTransform(-21.5,-23.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1}]},1).wait(1));

	// box
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("rgba(148,148,148,0.482)").ss(1,1,1).p("AiJAEIBFA0ICzgsIAahD");
	this.shape_4.setTransform(33.7,-8.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("AiPBFIA4hSIC8g3IArAp");
	this.shape_5.setTransform(33.7,27.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("rgba(217,217,217,0.373)").ss(1,1,1).p("AAAiKIAAEV");
	this.shape_6.setTransform(34.5,9.2);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#AAAAAA").s().p("AinjKIFPhMIAAHTIlIBag");
	this.shape_7.setTransform(33.3,8.9);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("rgba(148,148,148,0.533)").ss(1,1,1).p("ACRglIkhBL");
	this.shape_8.setTransform(-35.6,-15.2);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f().s("rgba(148,148,148,0.498)").ss(1,1,1).p("AjRkWILGAAIAAHTIlKBaIqfgQIAAnRIKYAA");
	this.shape_9.setTransform(0,8.9);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AATAnIhngWQgSgDgRgEQh1gVh2gYAlogmILRAA");
	this.shape_10.setTransform(14.5,-15.4);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.lf(["#D6D6D6","#FFFFFF"],[0.047,0.882],-14.5,24.6,-5.8,-7.9).s().p("AlPDhIAAnRIKYAAIAHHhgAj6BcIH6AAIAAjMIn6AAg");
	this.shape_11.setTransform(-16.5,12.7);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],26.1,-1.3,0.1,-1.3).s().p("AlLAmIEihLIDpAuIAjAGIBqAXg");
	this.shape_12.setTransform(-16.8,-15.2);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.lf(["#D6D6D6","#FFFFFF"],[0.271,0.882],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_13.setTransform(14.6,-15.3);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("rgba(148,148,148,0.102)").ss(1,1,1).p("AC7AmIhpgXQgSgDgRgDQh0gWh1gY");
	this.shape_14.setTransform(-2.3,-15.2);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.lf(["#999999","#FFFFFF"],[0.91,1],32.5,1.3,-5.5,1.3).s().p("AhVAQIgjgHIjrgtILGAAIlLBJg");
	this.shape_15.setTransform(14.6,-15.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_13},{t:this.shape_12},{t:this.shape_11},{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]}).to({state:[{t:this.shape_12},{t:this.shape_11},{t:this.shape_15},{t:this.shape_14},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4}]},2).wait(2));

	// text
	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#FFFFFF").s().p("AifAvIgIgCIgHgDIADgKIAKAEIAMACQAJAAAGgEQAFgFAAgHQAAgHgEgEQgFgEgJgEQgMgDgGgFQgHgHAAgKQAAgHAEgGQAEgFAHgEQAGgDAKAAQAHAAAFABIAIADIgDAKIgHgCIgLgCQgGAAgEACQgEACgCAEQgCADAAADQAAAHAFAEQAEAEAKADQAMAFAGAEQAGAHAAAKQAAAHgDAHQgEAGgHADQgIAEgLAAIgJgBgACjAvIAAhOIgBAAIgPAJIgDgKIAUgKIALAAIAABZgAAkAvIAAhbIALgCIANAAQAJAAAGACQAHACAEAEQAEADACAFQACAFAAAGQAAAHgBAFQgCAFgEACQgFAFgHACQgIADgJAAIgFAAIgEgBIAAAmgAA1gkIgEAAIAAAkIAEAAIAGAAQALAAAGgDQAGgFAAgKQAAgJgGgFQgGgFgKAAIgHABgAgfAvIAAhdIAxAAIAAALIgkAAIAAAdIAiAAIAAAJIgiAAIAAAhIAmAAIAAALgAhSAvIAAhSIgdAAIAAgLIBGAAIAAALIgdAAIAABSg");
	this.shape_16.setTransform(-17.7,11.8);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#213863").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgACUgdIAABOIAMAAIAAhZIgKAAIgUAKIACAKIAQgJgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_17.setTransform(-16.3,11.6);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#FF5409").s().p("Aj8BmIAAjLIH5AAIAADLgAi8AsIAGADIAJACIAJABQALAAAHgEQAHgDAEgGQAEgHAAgHQAAgKgGgHQgGgGgMgDQgKgDgFgEQgEgEAAgHQAAgDACgDQABgEAEgCQAEgCAHAAIALACIAHACIADgKIgIgDQgGgBgHAAQgJAAgHADQgHAEgEAFQgDAGAAAHQAAAKAGAHQAHAEALAEQAKAEAEAEQAEAEAAAHQAAAHgFAFQgFAEgJAAIgMgCIgKgEgACUgdIAABOIAMAAIAAhZIgKAAIgUAKIACAKIAQgJgAAggsIgKACIAABbIAMAAIAAgmIAFABIAFAAQAJAAAHgDQAIgCAFgGQADgBACgFQACgFAAgHQAAgGgCgFQgCgFgEgDQgEgEgHgCQgHgCgJAAIgNAAgAgtAxIAzAAIAAgLIgnAAIAAghIAjAAIAAgJIgjAAIAAgdIAlAAIAAgLIgxAAgAh9ghIAcAAIAABSIANAAIAAhSIAcAAIAAgLIhFAAgAAnACIgFgBIAAgjIAFAAIAHgBQAKAAAGAFQAGAFAAAJQAAAKgHAFQgGADgLAAIgFAAg");
	this.shape_18.setTransform(-16.3,11.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_17},{t:this.shape_16}]}).to({state:[{t:this.shape_17},{t:this.shape_16}]},1).to({state:[{t:this.shape_18},{t:this.shape_16}]},1).to({state:[{t:this.shape_18},{t:this.shape_16}]},1).wait(1));

	// box
	this.instance = new lib.mc_outline();
	this.instance.setTransform(0.8,0.3);
	this.instance.shadow = new cjs.Shadow("rgba(242,137,0,1)",0,0,10);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(2).to({_off:false},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.1,-20.3,102.8,58.2);


// stage content:



(lib.animation = function(mode,startPosition,loop) {
if (loop == null) { loop = false; }	this.initialize(mode,startPosition,loop,{step01:210,step2:215,step3:220,step4:225,step5:230,step6:235,step1:240});

	// timeline functions:
	this.frame_205 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
		
		
		this.btn_1.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_1";
				this.dispatchEvent(evt); 
				this.gotoAndStop("step01");
			}.bind(this));
		this.btn_2.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_2";
		 	this.dispatchEvent(evt); 
				this.gotoAndStop("step2");
			}.bind(this));
		this.btn_3.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_3";
		 	this.dispatchEvent(evt); 
				this.gotoAndStop("step3");
			}.bind(this));
		this.btn_4.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_4";
		 	this.dispatchEvent(evt); 
				this.gotoAndStop("step4");
			}.bind(this));
		this.btn_5.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_5";
		 	this.dispatchEvent(evt); 
				this.gotoAndStop("step5");
			}.bind(this));
		this.btn_6.addEventListener("click", function()
			{
				var evt = new createjs.Event("btn_click",false,true); 
				evt["targetName"] 	=	"btn_6";
		 	this.dispatchEvent(evt); 
				this.gotoAndStop("step6");
			}.bind(this));
	}
	this.frame_210 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_215 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_220 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_225 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_230 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_235 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}
	this.frame_240 = function() {
		this.dispatchEvent(new createjs.Event("anim_stop",false,true));this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(205).call(this.frame_205).wait(5).call(this.frame_210).wait(5).call(this.frame_215).wait(5).call(this.frame_220).wait(5).call(this.frame_225).wait(5).call(this.frame_230).wait(5).call(this.frame_235).wait(5).call(this.frame_240).wait(1));

	// step6
	this.instance = new lib.btn_6("single",2);
	this.instance.setTransform(563.3,260.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(235).to({_off:false},0).to({_off:true},1).wait(5));

	// btn_6
	this.btn_6 = new lib.btn_6();
	this.btn_6.setTransform(563.3,260.5);
	this.btn_6._off = true;
	new cjs.ButtonHelper(this.btn_6, 0, 1, 2, false, new lib.btn_6(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_6).wait(205).to({_off:false},0).wait(36));

	// step5
	this.instance_1 = new lib.btn_5("single",2);
	this.instance_1.setTransform(482.3,260.4);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(230).to({_off:false},0).to({_off:true},1).wait(10));

	// btn_5
	this.btn_5 = new lib.btn_5();
	this.btn_5.setTransform(482.3,260.4);
	this.btn_5._off = true;
	new cjs.ButtonHelper(this.btn_5, 0, 1, 2, false, new lib.btn_5(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_5).wait(205).to({_off:false},0).wait(36));

	// step4
	this.instance_2 = new lib.btn_4("single",2);
	this.instance_2.setTransform(400.3,260.4);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(225).to({_off:false},0).to({_off:true},1).wait(15));

	// btn_4
	this.btn_4 = new lib.btn_4();
	this.btn_4.setTransform(400.3,260.4);
	this.btn_4._off = true;
	new cjs.ButtonHelper(this.btn_4, 0, 1, 2, false, new lib.btn_4(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_4).wait(205).to({_off:false},0).wait(36));

	// step3
	this.instance_3 = new lib.btn_3("single",2);
	this.instance_3.setTransform(317.3,260.4);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(220).to({_off:false},0).to({_off:true},1).wait(20));

	// btn_3
	this.btn_3 = new lib.btn_3();
	this.btn_3.setTransform(317.3,260.4);
	this.btn_3._off = true;
	new cjs.ButtonHelper(this.btn_3, 0, 1, 2, false, new lib.btn_3(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_3).wait(205).to({_off:false},0).wait(36));

	// step2
	this.instance_4 = new lib.btn_2("single",2);
	this.instance_4.setTransform(235.3,260.4);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(215).to({_off:false},0).to({_off:true},1).wait(25));

	// btn_2
	this.btn_2 = new lib.btn_2();
	this.btn_2.setTransform(235.3,260.4);
	this.btn_2._off = true;
	new cjs.ButtonHelper(this.btn_2, 0, 1, 2, false, new lib.btn_2(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_2).wait(205).to({_off:false},0).wait(36));

	// step1
	this.instance_5 = new lib.btn_1("single",2);
	this.instance_5.setTransform(153.3,260.4);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(210).to({_off:false},0).to({_off:true},1).wait(30));

	// btn_1
	this.btn_1 = new lib.btn_1();
	this.btn_1.setTransform(153.3,260.4);
	this.btn_1._off = true;
	new cjs.ButtonHelper(this.btn_1, 0, 1, 2, false, new lib.btn_1(), 3);

	this.timeline.addTween(cjs.Tween.get(this.btn_1).wait(205).to({_off:false},0).wait(36));

	// band
	this.instance_6 = new lib.csec620_06_01_01();
	this.instance_6.setTransform(101.8,179.4,1,1,0,0,180);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(241));

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("EhBzAUxMAAAgphMCDnAAAMAAAAphg");
	mask.setTransform(322,81.5);

	// Layer 22
	this.instance_7 = new lib.csec620_06_01_05();
	this.instance_7.setTransform(735,-0.2,1,1,0,0,180);

	this.instance_7.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(241));

	// Box 6
	this.instance_8 = new lib.gr_ani7_6("synched",121,false);
	this.instance_8.setTransform(417.9,136.6,1,1,0,0,180);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(183).to({_off:false},0).to({_off:true},22).wait(36));

	// Box 5
	this.instance_9 = new lib.gr_ani7_5("synched",125,false);
	this.instance_9.setTransform(417.9,136.5,1,1,0,0,180);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(175).to({_off:false},0).to({_off:true},30).wait(36));

	// Box 4
	this.instance_10 = new lib.gr_ani7_4("synched",127,false);
	this.instance_10.setTransform(417.9,136.5,1,1,0,0,180);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(165).to({_off:false},0).to({_off:true},40).wait(36));

	// Box 3
	this.instance_11 = new lib.gr_ani7_3("synched",128,false);
	this.instance_11.setTransform(417.9,136.5,1,1,0,0,180);
	this.instance_11._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(154).to({_off:false},0).to({_off:true},51).wait(36));

	// Box 2
	this.instance_12 = new lib.gr_ani7_2("synched",128,false);
	this.instance_12.setTransform(417.9,136.5,1,1,0,0,180);
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(141).to({_off:false},0).to({_off:true},64).wait(36));

	// Box 1
	this.instance_13 = new lib.gr_ani7("synched",0,false);
	this.instance_13.setTransform(417.9,136.5,1,1,0,0,180);

	this.timeline.addTween(cjs.Tween.get(this.instance_13).to({_off:true},205).wait(36));

	// Box 2
	this.instance_14 = new lib.gr_ani7_2("synched",0,false);
	this.instance_14.setTransform(417.9,137,1,1,0,0,180);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(13).to({_off:false},0).to({_off:true},128).wait(100));

	// Box 3
	this.instance_15 = new lib.gr_ani7_3("synched",0,false);
	this.instance_15.setTransform(417.9,137,1,1,0,0,180);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(26).to({_off:false},0).to({_off:true},128).wait(87));

	// Box 4
	this.instance_16 = new lib.gr_ani7_4("synched",0,false);
	this.instance_16.setTransform(417.9,137,1,1,0,0,180);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(38).to({_off:false},0).to({_off:true},127).wait(76));

	// Box 5
	this.instance_17 = new lib.gr_ani7_5("synched",0,false);
	this.instance_17.setTransform(417.9,137,1,1,0,0,180);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(50).to({_off:false},0).to({_off:true},125).wait(66));

	// Box 6
	this.instance_18 = new lib.gr_ani7_6("synched",0,false);
	this.instance_18.setTransform(417.9,137,1,1,0,0,180);
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(64).to({_off:false},0).to({_off:true},119).wait(58));

	// mask (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	mask_1.graphics.p("Eg7SAKvIAhmAUBP9ABRAGdgA6QR2hUEEh2IAnALIAogTIgFgbIBog+IAYAJIAUgLIgHgaIAlgqIAZgkIghhNIhLhYIhqhXIh9hLIiVg8IjKg3IAAi3IHCBxICDA1ICJBEIBVA2IBqBSIBBA8IAlBBIAaBSIAABNIglB1Ig+BaIhjBlQjtD9vzCPUgGgAAzgkbAAAQ1YAA/sgSg");
	mask_1.setTransform(458.9,240.9);

	// ani1
	this.instance_19 = new lib.gr_ani1("synched",0);
	this.instance_19.setTransform(424.1,230.6,1,1,0,0,180);

	this.instance_19.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// ani2
	this.instance_20 = new lib.gr_ani4("synched",0);
	this.instance_20.setTransform(752.4,202.4,1,1,0,0,180);

	this.instance_20.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// ani3
	this.instance_21 = new lib.gr_ani6("synched",0);
	this.instance_21.setTransform(785,204.4,1,1,0,0,180);

	this.instance_21.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// an4
	this.instance_22 = new lib.gr_ani2("synched",0);
	this.instance_22.setTransform(739.3,263.8,1,1,0,0,180);

	this.instance_22.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// ani5
	this.instance_23 = new lib.gr_ani3("synched",0);
	this.instance_23.setTransform(340.5,296.2,1,1,0,0,180);

	this.instance_23.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// ani6
	this.instance_24 = new lib.gr_ani5("synched",0);
	this.instance_24.setTransform(420.1,265.5,1,1,0,0,180);

	this.instance_24.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(196).to({mode:"single",startPosition:3},0).wait(45));

	// patch
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#162437").s().p("Eg9pALDIAAlGUAtwgAEAuOAARQIqgNFjhGQFkhGCRhIQCRhIA6g5QA6g3gLg+QgLg+hphhQhphghWgpQhVgphWgcQg9gUhpgbQhLgUhkgSQhagRhugLIAAiXQDcACEcBFQEnBGCbBQQCbBRBTBBQBTBCAtBPQAuBPgDBLQgCBJgUAoQgPAdgiAxQg5BTiABZQiABZkBBeQkFBglWAoQlVAontAXIAAACg");
	this.shape.setTransform(443,238.8);

	this.shape.mask = mask_1;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(241));

	// BG assets
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#223552").s().p("AgxNHIAA6NIBjAAIAAaAIAAANg");
	this.shape_1.setTransform(771.1,265.9);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#43536C").s().p("AgaNAIAA6AIA1AAIAAaAg");
	this.shape_2.setTransform(778.9,265.3);

	this.instance_25 = new lib.csec620_06_01_07();
	this.instance_25.setTransform(825.9,256.7,1,1,0,0,180);

	this.instance_26 = new lib.csec620_06_01_05();
	this.instance_26.setTransform(735,-0.2,1,1,0,0,180);

	this.instance_27 = new lib.csec620_06_01_03();
	this.instance_27.setTransform(872.2,-0.5,1,1,0,0,180);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.shape_2},{t:this.shape_1}]}).wait(241));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(418.8,160.5,888.4,350.3);

	return lib;
	};