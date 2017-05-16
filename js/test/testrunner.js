define([
	'QUnit',
	'framework/utils/VariableManager'
], function(QUnit, VariableManager) {

	var init						= function(){
		this.run();
		// start QUnit.
		QUnit.load();
		QUnit.start();
	};

	var run							= function() {
		test('VariableManager should store and return Hash Map value', function() {
			var dumdata = function() {
				var dumdata;
				return dumdata;
			};
			VariableManager.setVariable("score", 100);
			VariableManager.setVariable("dumdata", dumdata);
			VariableManager.setVariable("stringdata", '!@#123');
			equal(VariableManager.getVariable("score"), 100, 'Should return 100');
			equal(VariableManager.getVariable("dumdata"), undefined, 'Should return undefined');
			equal(VariableManager.getVariable("stringdata"), '!@#123', 'Should return !@#123');
		});
	};

	return {
		run			: run,
		init		: init
	};
});