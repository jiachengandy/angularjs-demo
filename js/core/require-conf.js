/**
 * Requirejs配置文件，
 * 
 * 功能：配置模块path，以及引入的shim
 * 
 * 
 */

var paths = {
	// lib
	'jquery' : 'js/lib/jquery/jquery-2.0.3.min',
	'jquery-cookie' : 'js/lib/jquery/jquery.cookie',
	'angular' : 'js/lib/angularjs/angular',
	'angularRoute':'js/lib/angularjs/angular-route',
	'angularSanitize':'js/lib/angularjs/angular-sanitize.min',
	'angularAnimate':'js/lib/angularjs/angular-animate',
	'bootstrap':'js/lib/bootstrap/bootstrap.min',
	'ace':'js/lib/bootstrap/ace.min',
	'ace-elements':'js/lib/bootstrap/ace-elements.min',
	'ace-extra':'js/lib/bootstrap/ace-extra.min',
	'typeahead':'js/lib/bootstrap/typeahead-bs2.min',
	'easy-pie':'js/lib/tool/jquery.easy-pie-chart.min',
	'slimscroll':'js/lib/tool/jquery.slimscroll.min',
	'jquery-chosen':'js/lib/tool/chosen.jquery.min',
	
	
	//core
	'app':'js/core/app',
	'baseModule':'js/core/module',
	'core_directive': 'js/core/directive',
    'core_service': 'js/core/service',
    
    //directive
    'coverDirective': 'js/directive/cover',
    'headerDirective': 'js/directive/header',
    'permissionDirective': 'js/directive/permission',
    
	//control
	'userCtrl':'js/controller/userCtrl',
	'homeCtrl':'js/controller/homeCtrl',
	'applicationCtrl':'js/controller/applicationCtrl',
	'warningCheckCtrl':'js/controller/warningCheckCtrl',
	//service
	'utilService':'js/service/utilService',
	
	//Filter
	'htmlFilter':'js/filter/htmlFilter',
	'arrayFilter':'js/filter/arrayFilter',
	
};

var shim = {
	'jquery' : {
		exports : 'jquery'
	},
	'jquery-cookie': {
		exports : 'jquery-cookie',
		deps : [ 'jquery' ]
	},
	'angular' : {
		exports : 'angular',
		deps : [ 'jquery' ]
	},
	'angularRoute' : {
		exports : 'angularRoute',
		deps : [ 'angular' ]
	},
	'angularSanitize' : {
		exports : 'angularSanitize',
		deps : [ 'angular' ]
	},
	'angularAnimate': {
    	exports: 'angularAnimate',
        deps: ['angular']
    },
    'bootstrap': {
    	exports: 'bootstrap',
        deps: ['jquery']
    },
    'ace': {
    	exports: 'ace',
        deps: ['bootstrap']
    },
    'typeahead': {
    	exports: 'typeahead',
        deps: ['jquery']
    },
    'ace-elements':{
    	exports: 'ace-elements',
        deps: ['jquery']
    },
    'ace-extra':{
    	exports: 'ace-extra',
        deps: ['jquery']
    },
    'easy-pie':{
    	exports: 'easy-pie',
        deps: ['jquery']
    },
    'slimscroll':{
    	exports: 'slimscroll',
        deps: ['jquery']
    },
    'jquery-chosen':{
    	exports: 'jquery-chosen',
        deps: ['jquery']
    },
};