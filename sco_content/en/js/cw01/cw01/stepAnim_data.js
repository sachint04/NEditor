define([], function(){
	

var Page = function() {
	this.im = 'sco_content/en/images/';
	this.resources = [];
	this.fonts = {};
	this.resources = [];

};

Page.prototype.getData = function() {
var symbols = {
"stage": {
   version: "1.5.0",
   minimumCompatibleVersion: "1.5.0",
   build: "1.5.0.217",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
         dom: [
         {
            id:'pg07_01_bg',
            type:'image',
            rect:['2px','2px','834px','258px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_01_bg.png','0px','0px']
         },
         {
            id:'pg07_02_bg',
            type:'image',
            rect:['0','119px','485px','372px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_02_bg.png','0px','0px']
         },
         {
            id:'pg07_02_dialg01',
            type:'image',
            rect:['63px','207px','252px','152px','auto','auto'],
            opacity:0,
            fill:["rgba(0,0,0,0)",'stepAnimation_02_dialg01.png','0px','0px']
         },
         {
            id:'pg07_02_char01',
            type:'image',
            rect:['0px','299px','149px','191px','auto','auto'],
            opacity:0,
            fill:["rgba(0,0,0,0)",'stepAnimation_02_char01.png','0px','0px']
         },
         {
            id:'pg07_02_dialg02',
            type:'image',
            rect:['322px','305px','116px','79px','auto','auto'],
            opacity:0,
            fill:["rgba(0,0,0,0)",'stepAnimation_02_dialg02.png','0px','0px']
         },
         {
            id:'pg07_02_char02',
            type:'image',
            rect:['316px','359px','92px','133px','auto','auto'],
            opacity:0,
            fill:["rgba(0,0,0,0)",'stepAnimation_02_char02.png','0px','0px']
         },
         {
            id:'pg07_03_bg',
            type:'image',
            rect:['412px','0px','501px','490px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_03_bg.png','0px','0px']
         },
         {
            id:'Ellipse',
            type:'ellipse',
            rect:['705px','84px','149px','149px','auto','auto'],
            borderRadius:["50%","50%","50%","50%"],
            fill:["rgba(240,14,14,1.00)"],
            stroke:[0,"rgba(0,0,0,1)","none"]
         },
         {
            id:'pg07_01_dialg01',
            type:'image',
            rect:['117px','2px','444px','135px','auto','auto'],
            opacity:0,
            fill:["rgba(0,0,0,0)",'stepAnimation_01_dialg01.png','0px','0px']
         },
         {
            id:'pg07_01_char012',
            type:'image',
            rect:['2px','24px','128px','236px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_01_char01.PNG','0px','0px']
         },
         {
            id:'pg07_03_char02',
            type:'image',
            rect:['800px','280px','113px','208px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_03_char02.png','0px','0px']
         },
         {
            id:'pg07_03_dialg02',
            type:'image',
            rect:['676px','177px','237px','135px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_03_dialg02.PNG','0px','0px']
         },
         {
            id:'pg07_03_dialg01',
            type:'image',
            rect:['481px','80px','224px','149px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_03_dialg01.png','0px','0px']
         },
         {
            id:'pg07_03_char01',
            type:'image',
            rect:['457px','187px','248px','303px','auto','auto'],
            fill:["rgba(0,0,0,0)",'stepAnimation_03_char01.png','0px','0px']
         }],
         symbolInstances: [

         ]
      },
   states: {
      "Base State": {
         "${_pg07_02_char02}": [
            ["style", "top", '359px'],
            ["style", "opacity", '0'],
            ["style", "left", '316px']
         ],
         "${_pg07_02_bg}": [
            ["style", "top", '119px'],
            ["style", "opacity", '0']
         ],
         "${_Ellipse}": [
            ["color", "background-color", 'rgba(240,14,14,1.00)'],
            ["style", "opacity", '0']
         ],
         "${_pg07_03_char02}": [
            ["style", "top", '280px'],
            ["style", "opacity", '0'],
            ["style", "left", '800px']
         ],
         "${_pg07_03_dialg02}": [
            ["style", "top", '177px'],
            ["style", "opacity", '0'],
            ["style", "left", '676px']
         ],
         "${_pg07_02_dialg02}": [
            ["style", "top", '305px'],
            ["style", "opacity", '0'],
            ["style", "left", '322px']
         ],
         "${_pg07_01_char012}": [
            ["style", "top", '24px'],
            ["style", "opacity", '0'],
            ["style", "left", '2px']
         ],
         "${_pg07_02_dialg01}": [
            ["style", "top", '207px'],
            ["style", "opacity", '0'],
            ["style", "left", '63px']
         ],
         "${_pg07_03_dialg01}": [
            ["style", "top", '84px'],
            ["style", "opacity", '0'],
            ["style", "left", '481px']
         ],
         "${_pg07_03_char01}": [
            ["style", "top", '187px'],
            ["style", "opacity", '0'],
            ["style", "left", '457px']
         ],
         "${_pg07_03_bg}": [
            ["style", "top", '0px'],
            ["style", "opacity", '0.0546875'],
            ["style", "left", '412px']
         ],
         "${_Stage}": [
            ["color", "background-color", 'rgba(255,255,255,1)'],
            ["style", "width", '1000px'],
            ["style", "height", '500px'],
            ["style", "overflow", 'hidden']
         ],
         "${_pg07_02_char01}": [
            ["style", "top", '299px'],
            ["style", "opacity", '0'],
            ["style", "left", '0px']
         ],
         "${_pg07_01_bg}": [
            ["style", "top", '2px'],
            ["style", "opacity", '0.1015625'],
            ["style", "left", '2px']
         ],
         "${_pg07_01_dialg01}": [
            ["style", "top", '2px'],
            ["style", "opacity", '0'],
            ["style", "left", '117px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 3445,
         autoPlay: true,
         timeline: [
            { id: "eid2", tween: [ "style", "${_pg07_03_bg}", "opacity", '0.0546875', { fromValue: '0.0546875'}], position: 0, duration: 0 },
            { id: "eid11", tween: [ "style", "${_pg07_03_bg}", "opacity", '1', { fromValue: '0.054688'}], position: 2000, duration: 325 },
            { id: "eid28", tween: [ "style", "${_pg07_03_char01}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid36", tween: [ "style", "${_pg07_03_char01}", "opacity", '1', { fromValue: '0.000000'}], position: 2325, duration: 280 },
            { id: "eid45", tween: [ "style", "${_Ellipse}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid44", tween: [ "style", "${_Ellipse}", "opacity", '1', { fromValue: '0'}], position: 2560, duration: 605 },
            { id: "eid7", tween: [ "style", "${_pg07_01_bg}", "opacity", '1', { fromValue: '0.101563'}], position: 0, duration: 500 },
            { id: "eid18", tween: [ "style", "${_pg07_02_char01}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid20", tween: [ "style", "${_pg07_02_char01}", "opacity", '1', { fromValue: '0.000000'}], position: 1000, duration: 305 },
            { id: "eid40", tween: [ "style", "${_pg07_03_dialg01}", "top", '84px', { fromValue: '84px'}], position: 3165, duration: 0 },
            { id: "eid15", tween: [ "style", "${_pg07_01_char012}", "opacity", '1', { fromValue: '0'}], position: 0, duration: 385 },
            { id: "eid4", tween: [ "style", "${_pg07_02_bg}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid9", tween: [ "style", "${_pg07_02_bg}", "opacity", '1', { fromValue: '0.000000'}], position: 670, duration: 330 },
            { id: "eid31", tween: [ "style", "${_pg07_03_dialg02}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid39", tween: [ "style", "${_pg07_03_dialg02}", "opacity", '1', { fromValue: '0.000000'}], position: 3165, duration: 280 },
            { id: "eid22", tween: [ "style", "${_pg07_02_dialg02}", "opacity", '1', { fromValue: '0.000000'}], position: 1805, duration: 195 },
            { id: "eid30", tween: [ "style", "${_pg07_03_dialg01}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid38", tween: [ "style", "${_pg07_03_dialg01}", "opacity", '1', { fromValue: '0.000000'}], position: 2885, duration: 280 },
            { id: "eid24", tween: [ "style", "${_pg07_02_char02}", "opacity", '1', { fromValue: '0.000000'}], position: 1305, duration: 295 },
            { id: "eid29", tween: [ "style", "${_pg07_03_char02}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid37", tween: [ "style", "${_pg07_03_char02}", "opacity", '1', { fromValue: '0.000000'}], position: 2605, duration: 280 },
            { id: "eid26", tween: [ "style", "${_pg07_02_dialg01}", "opacity", '1', { fromValue: '0.000000'}], position: 1600, duration: 205 },
            { id: "eid14", tween: [ "style", "${_pg07_01_dialg01}", "opacity", '0', { fromValue: '0'}], position: 0, duration: 0 },
            { id: "eid17", tween: [ "style", "${_pg07_01_dialg01}", "opacity", '1', { fromValue: '0.000000'}], position: 385, duration: 285 }         ]
      }
   }
}
};
	return {
				imagePath	: 'sco_content/en/images/',
				resources	: this.resources,
				fonts 		: this.fonts,
				symbols		: symbols
			};
			

};

return Page;

});