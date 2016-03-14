/**
 * RequireJS启动的入口
 * 
 * 主要实现一下功能： 1、加载requirejs各个模块的配置 2、获取当前页面的controller
 * 3、加载controller模块，并启动angularjs app
 * 
 */
// 配置requirejs的模块
var currentTime = (new Date()).getTime();
var requireConfig = {
	urlArgs : "bust=" + currentTime,
	waitSeconds : 7,
	baseUrl : monitorCfg.contextPath,
	paths : paths,
	shim : shim
};
requirejs.config(requireConfig);

// 获取当前页面的Controller
var required = [];
(function() {
	function scripts() {
		return document.getElementsByTagName('script');
	}

	for (var i = 0; i < scripts().length; i++) {
		var controller = scripts()[i].getAttribute('controller');
		if (controller) {
			required.push(controller);
		}
	}
	;
})();

// 加载Controller模块，启动AngularJS应用
require(required, function() {
	angular.bootstrap(document, [ "monitor-app" ]);
});