define(['app'], function()
{
	angular.module("monitor.core").directive('monitorCover', function()
	{
		return {
			restrict : 'AE',
			templateUrl : 'js/directive/html/cover.html',
			replace : true,
			transclude : true
		};
	});
});
