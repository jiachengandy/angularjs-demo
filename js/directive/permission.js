define(['app'], function()
{
	angular.module("monitor.core").directive('bssRole', function()
	{
		return {
			restrict : 'AE',
			//templateUrl : 'js/directive/html/cover.html',
			replace : true,
			scope :
			{
				role : '=bssRole'
			},
			transclude : false,
			controller : function($scope, $element, $attrs, $rootScope)
			{
				var userRole = $.cookie("user_role");
				var bssRole = $scope.role;
				if(userRole.indexOf(bssRole)<0){
					$element.remove();
				}
			},
			compile:function($scope, $element, $attrs, $rootScope){
			}
		};
	});
	
	angular.module("monitor.core").directive('bssDisabled', function()
			{
				return {
					restrict : 'AE',
					//templateUrl : 'js/directive/html/cover.html',
					replace : true,
					transclude : false,
					scope :
					{
						disabled : '=bssDisabled'
					},
					controller : function($scope, $element, $attrs, $rootScope)
					{
						var userRole = $.cookie("user_role");
						var bssRole = $scope.disabled;
						if(userRole.indexOf(bssRole)<0){
							$element.attr("disabled",'disabled');
						}
					},
					compile:function($scope, $element, $attrs, $rootScope){
						
					}
				};
			});
});
