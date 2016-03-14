define(['app'], function()
{
	angular.module("monitor.core").directive('monitorHeader', function()
	{
		return {
			restrict : 'AE',
			templateUrl : 'js/directive/html/header.html',
			replace : true,
			transclude : true,
			controller : function($scope,$location, $element, $attrs, $rootScope)
			{
				$scope.active_user = $.cookie("name_zh");
				$scope.logout=function(){
					var username = $.cookie("username");
					$rootScope.$post({
						url:"user/logout",
						data:{
							username:username
						},
						success:function(result){
							window.location.href="login";
						}
					});
				};
			}
		};
	});
});
