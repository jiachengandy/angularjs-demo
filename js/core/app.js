/**
 * 
 */
/*define([ "angular", 'mainController', 'mainDirective' ], function(angular) {
	return angular.module("webapp", [ 'ui.router', 'ngStorage', 'ngSanitize',
			'webapp.controllers', 'webapp.directive' ]);
})*/

define(function(require)
{
	
	require('core_directive');
	require('coverDirective');
	require('headerDirective');
	require('permissionDirective');
	//support Array.forEach for IE8
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun /*, thisp*/)
		{
			var len = this.length;
			if ( typeof fun != "function")
				throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if ( i in this)
					fun.call(thisp, this[i], i, this);
			}
		};
	}
});
