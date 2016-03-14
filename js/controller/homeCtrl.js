/**
 * jiacheng
 */
define(['app'], function()
{
	angular.module("monitor").controller("homeCtrl", homeCtrl);
	function homeCtrl($scope, $rootScope)
	{
		$scope.hello="hehehhe";
	};
});
