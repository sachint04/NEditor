editor = require('ckeditor');

function initEditor(){
	 // The "instanceCreated" event is fired for every editor instance created.
    CKEDITOR.dtd.$editable.span = 1;
	CKEDITOR.dtd.$editable.a = 1;
    $('body').on('click' , function(e){
		var $elem = $(e.target);
  		var editor = CKEDITOR.instances[$elem.attr('id')];
  		   
  		if($elem.length && $elem[0].hasAttribute('contenteditable') && $elem.attr('contenteditable') === "true"){
  		 	if (!editor) {
	  			editor = CKEDITOR.inline( $elem[0] );
	  			editor.on('blur', function(e){
	  				var id = $(e.editor.element).attr('id');
	  				console.log('id - '+ id);
	  			});
	  		}
  		}
  		
	});
};

module.exports = {
	"initEditor" : initEditor 
};
