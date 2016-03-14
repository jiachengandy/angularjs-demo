/**
 * jiacheng
 */
define([ 'app', 'jquery-cookie' ], function() {
	angular.module("monitor").controller("userCtrl", userCtrl);
	function userCtrl($scope, $rootScope) {
		if ($.cookie("rememberStatus") == 'yes') {
			$scope.username = $.cookie("username");
			$scope.password = $.cookie("password");
			$scope.rememberStatus = true;
		}
		$scope.login = function() {
			var username = $scope.username;
			var password = $scope.password;
			$scope.$post({
				url : "user/login",
				data : {
					username : username,
					password : password
				},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						if (result != null && result !=''&& typeof result !='undefined') {
							$.cookie("username", result.username);
							$.cookie("name_zh", result.name_zh);
							$.cookie("user_role", result.role);
							window.location.href = "application";
							if ($scope.rememberStatus) {
								$.cookie("password", password);
								$.cookie("rememberStatus", "yes");
							} else {
								$.cookie("password", null);
								$.cookie("rememberStatus", null);
							}
							$scope.loginTip = "success";
						}else{
							$scope.loginTip = "error";
						}
					});
				}
			});
		};
		document.onkeydown = function(event) {
			var e = event ? event : (window.event ? window.event : null);
			if (e.keyCode == 13) {
				$scope.login();
			}
			;
		};
	};
});
