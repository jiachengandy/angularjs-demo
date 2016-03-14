/**
 * 
 */
define(['angular', 'angularRoute','angularAnimate'], function () {
    angular.module("monitor.core", ['ngRoute','ngAnimate']);
    angular.module("monitor.constant", ['monitor.core']).constant('cfg', monitorCfg);
    angular.module("monitor", ['monitor.constant']);
    angular.module("monitor-app", ["monitor"]).config(['$sceProvider','$routeProvider','$locationProvider',function ($sceProvider,$routeProvider,$locationProvider) {
        // Completely disable SCE to support IE7.
      $sceProvider.enabled(false);
      $routeProvider
        .when('/warningFilter', {
            templateUrl : 'html/tool/warningFilter.html'
        })
        .when('/test', {
            controller : 'CatsCtrl',
            template : '<h1>{{title}}</h1>'
        })
        .otherwise({
            redirectTo : '/'
        });
      $locationProvider.html5mode = true;
      $locationProvider.hashPrefix = '!';
    }]);
});
