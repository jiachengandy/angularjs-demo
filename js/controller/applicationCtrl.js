/**
 * jiacheng
 */
define([ 'app','jquery-cookie' ,'bootstrap', 'ace-extra', 'ace-elements', 'ace','easy-pie','slimscroll','jquery-chosen', 'htmlFilter','arrayFilter','utilService' ], function() {
	angular.module("monitor").controller("applicationCtrl", applicationCtrl);
	function applicationCtrl($scope, $rootScope,utilManager) {
		
		$('[data-rel=tooltip]').tooltip({container:'body'});
		$scope.initServerType = function() {
			$scope.$post({
				url : "application/serverTestType",
				dataType:"JSON",
				data : {
					testSign:null
				},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.serverTypes = result;
					});
					var nodeDatas = $scope.summaryServerType(result);
					$rootScope.$safeApply($scope, function() {
						$scope.nodeDatas = nodeDatas;
						$scope.nodeFlag = "key";
					});
				}
			});
		};

		/**
		 * 对探测类型分类
		 */
		$scope.summaryServerType = function(result) {
			var nodeItems = {};
			angular.forEach(result, function(item, index) {
				var key = item.nodeName;
				if (key == null) {
					nodeItems.temp = [];
				} else {
					nodeItems[key] = [];
				}
			});
			var nodeDatas = [];
			angular.forEach(nodeItems, function(item, index) {
				var data = {};
				data.key = index;
				data.value = item;
				data.items = [];
				nodeDatas.push(data);
			});
			angular.forEach(nodeDatas, function(item, index) {
				for (var i = 0; i < result.length; i++) {
					var temp = result[i].nodeName;
					temp = temp == null ? "temp" : temp;
					if (temp == item.key) {
						item.items.push(result[i]);
					}
				}
			});
			angular.forEach(nodeDatas, function(item, index) {
				var key = item.key;
				if (key == 'temp') {
					nodeDatas.otheritems = item.items;
					// delete nodeDatas.key;
				}
			});
			$(".app-slimscroll").slimScroll({
				height: '500px'
		    });
			return nodeDatas;
		};
		
		$scope.getServerTestInfoByType = function(flag, serverType,
				event) {
			$scope.currentItem = flag;
			if(flag==-1){
				getAllServerTestInfo(flag, serverType);
			}else{
				getServerTestInfo(flag, serverType);	
			}
		};
		
		function getServerTestInfo(flag, serverType) {
			$scope.serverType = serverType;
			$scope.flag = flag;
			$scope.$post({
				url : "application/serverTestInfo",
				cover : true,
				data : {
					type : flag
				},
				success : function(result) {
					//var servers = [];
					var normalServers = [];
					var exceptionServers = [];
					var countall = result.length;
					$rootScope.$safeApply($scope, function() {
						$scope.countall = countall;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.span_server = 0;
						$scope.span_exception = 0;
					});
					angular.forEach(result,function(item, index) {
					$scope.$post({
						url : "application/execAppTestSingle",
						cover : true,
						data : {
							server : JSON.stringify(item)
						},
						success : function(result2) {
							$rootScope.$safeApply($scope,function() 
							{
							$scope.span_server = $scope.span_server + 1;
							$scope.normalPercent=new Number((($scope.span_server)/$scope.countall).toFixed(2))*100;
							});
							if (result2.result != "0") {
							$scope.$safeApply($scope,function() {
							  $scope.span_exception = $scope.span_exception + 1;
							});
						  item.testInfo = "exception";
							}
							var server = {
								serverName : item.serverName,
								serverIp : item.serverIp,
								serverPort : item.serverPort,
								testRst : result2.testRst,
								taketime : result2.taketime,
								detailAll : result2,
								testInfo : item.testInfo,
								sortFlag : result2.result,
								state : item.state,
								configId : item.configId,
								selected : false
							};
							if (result2.result != "0") {
								exceptionServers.push(server);
							}else{
								normalServers.push(server);
							}
							//servers.push(server);	
					       $rootScope.$safeApply($scope,function() {
							var dateTime = utilManager
									.getLocalTime();
							$scope.dateTime = dateTime;
							//$scope.servers = servers;
							$scope.exceptionServers = exceptionServers;
							$scope.normalServers = normalServers;
							$scope.sortFlag = "-sortFlag";
							$scope.serverIp = "serverIp";
					      })
					      }
						});	
					});
				}
			});
		};
		
		function getAllServerTestInfo(flag, serverType){
			$scope.serverType = serverType;
			$scope.flag = flag;
			$scope.$post({
				url : "application/serverTestType",
				dataType:"JSON",
				data : {
					testSign:null
				},
				async:false,
				success : function(result) {
//					$scope.exceptionServers =[]
//					if (result.result != "0") {
//						exceptionServers.push(server);
//					}
//					$rootScope.$safeApply($scope,function() {
//						var dateTime = utilManager
//								.getLocalTime();
//						$scope.dateTime = dateTime;
//						$scope.exceptionServers = result;
//						$scope.sortFlag = "-sortFlag";
//						$scope.serverIp = "serverIp";
//					});	
					$scope.exceptionServers = [];
					angular.forEach(result,function(item,indx){
						$scope.$post({
							url : "application/allServerTestInfo",
							cover : true,
							async:false,
							data : {
								type : item.flag
							},
							success:function(result){
								$scope.exceptionServers.push(result);
								console.log("!!!!!!!",result);
							}
						});
					});
					console.log("....",$scope.exceptionServers);
				}
			});
		}
		
		/**
		 * 画图异常比例
		 */
		function drawServerPie(){
		$('.easy-pie-chart.percentage').each(function(){
			var $box = $(this).closest('.infobox');
			var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
			var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
			var size = parseInt($(this).data('size')) || 50;
			$(this).easyPieChart({
				barColor: barColor,
				trackColor: trackColor,
				scaleColor: false,
				lineCap: 'butt',
				lineWidth: parseInt(size/10),
				animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
				size: size
			});
		})
		}
		
		/**
		 * 探测结果详情
		 */
		$scope.queryServerDetail = function(detailAll){
			$scope.detailAll = detailAll;
		};
		
		$scope.switchServerTab = function(item){
			$scope.serverTab = item;
			if(item=='serverType'){
				$scope.tabDesc = "新增应用类型";
				$scope.serverTest={};
			}else if(item=='serverHost'){
				$scope.tabDesc = "新增服务主机";
				showServerTypeChosen();
				$scope.queryInterfaceParam();
			}else if(item=='serverInterface'){
				$scope.tabDesc = "新增服务接口";
			}else if(item=='interfaceParam'){
				$scope.tabDesc = "新增接口参数";
				$scope.queryServerInterface();
			}else if(item =='serverTypeSearch'){
				$scope.tabDesc = "查询应用类型";
				$scope.queryServerType();
			}
			else if(item =='serverInterfaceSearch'){
				$scope.tabDesc = "查询服务主机";
				$scope.queryServerInterfaceDetails();
			}
		};
		$scope.switchServerTab("serverType");
		
		/**
		 * 新增服务类型
		 */
		$scope.addServerTest = function(){
			var testName = $scope.serverTest.testName;
			var sendTime = $scope.serverTest.sendTime;
			var invokeTime = $scope.serverTest.invokeTime;
			var warningGrp = $scope.serverTest.grp ;
			var usedFlag = $(".test-type").val();
			if(typeof testName=='undefined'||typeof sendTime=='undefined'||typeof invokeTime=='undefined'
				||typeof warningGrp=='undefined'||typeof usedFlag=='undefined'){
				return;
			}
			$scope.$post({
				url : 'application/addServerTest',
				data : {
					testName:testName,
					sendTime:sendTime,
					invokeTime:invokeTime,
					warningGrp:warningGrp,
					usedFlag:usedFlag
				},
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("添加成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error("添加出错！", $scope);
					}
				},
				error : function(result) {
				}
			});
		};
		/**
		 * 初始化选择告警组
		 */
		$scope.beforeSelectGrp = function(){
			$scope.$post({
				url : "warningCheck/queryGroups",
				cover : false,
				success : function(result) {
					angular.forEach(result,function(item,index){
						var groupDesc = "";
						angular.forEach(item.members,function(item,index){
							groupDesc+=item.username+" ";
						});
						item.groupDesc = groupDesc;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.groups = result;
					});
					$("#warningGrpModal .modal-body").slimScroll({
						height: '400px'
				    });
				}
			});
		};
		/**
		 * 选择告警组
		 */
		$scope.selectGroups = function() {
			var grp = "";
			$(".td-group-first input[type='checkbox']").each(function() {
				if ($(this).is(':checked')) {
					grp += $(this).val() + ",";
				}
			});
			grp = grp.substring(0, grp.length - 1);
			//$scope.warningGrp = grp;
			$scope.serverTest.grp  = grp;
		};
		
		$scope.deleteServerTest = function(flag){
			$scope.$messageBox.confirm("确认删除？", $scope,function(){
				$scope.$post({
					url:"application/deleteServerTest",
					data:{
						flag:flag
					},
					success:function(result){
						if(result=='success'){
							$scope.$messageBox.success("删除成功！", $scope,function(){
								$scope.queryServerType();
							});
						}else{
							$scope.$messageBox.error( "删除出错！", $scope);
						}
					}
				});
			});
		};
		
		$scope.queryServerType = function(){
			$scope.$post({
				url : "application/serverTestType",
				cover : false,
				data : {
					testSign:"all"
				},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.serverTypes = result;
					});
				}
			});
		};
		
		function showServerTypeChosen(){
			$scope.$post({
				url : "application/serverTestType",
				cover : false,
				data : {
					testSign:"all"
				},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.serverTypes = result;
					});
					$(".select-server-type").chosen(); 
				}
			});
		}
		
		$scope.beforeModifyServerTest = function(serverTest){
			$scope.serverTest = serverTest;
			$(".server-used-flag").val(serverTest.usedFlag);
		};
		$scope.modifyServerTest = function(){
			var testName = $scope.serverTest.testName;
			var sendTime = $scope.serverTest.sendTime;
			var invokeTime = $scope.serverTest.invokeTime;
			var warningGrp = $scope.serverTest.grp ;
			var usedFlag = $(".server-used-flag").val();
			$scope.serverTest.usedFlag = usedFlag;
			if(typeof testName=='undefined'||typeof sendTime=='undefined'||typeof invokeTime=='undefined'
				||typeof warningGrp=='undefined'||typeof usedFlag=='undefined'){
				return;
			}
			$scope.$post({
				url : 'application/modifyServerTest',
				data : JSON.stringify($scope.serverTest),
				dataType : "text",
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("修改成功！", $scope,function(){
							$scope.queryServerType();	
						});
					}else{
						$scope.$messageBox.error("修改出错！", $scope);
					}
				},
				error : function(result) {
				}
			});
		};
		
		$scope.beforeModifyServer = function(server){
			$scope.serverInfo = server;
			$scope.currentConfigId = server.configId;
		};
		
		/**
		 * 修改服务信息
		 */
		$scope.modifyServer= function(){
			var serverName = $scope.serverInfo.serverName;
			var serverIp = $scope.serverInfo.serverIp;
			var serverPort = $scope.serverInfo.serverPort;
			$scope.$post({
				url : 'application/modifyServer',
				data : {
					configId:$scope.currentConfigId,
					serverName:serverName,
					serverIp:serverIp,
					serverPort:serverPort,
				},
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("修改成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error("修改出错！", $scope);
					}
				},
				error : function(result) {
				}
			});
		};
		
		/**
		 * 根据configId删除服务
		 */
		$scope.deleteServerById = function(configId){
			$scope.$messageBox.confirm("确认删除？", $scope,function(){
				$scope.$post({
					url:"application/deleteServerById",
					data:{
						configId:configId
					},
					success:function(result){
						if(result=='success'){
							$scope.$messageBox.success("删除成功！", $scope,function(){
								window.location.reload();	
							});
						}else{
							$scope.$messageBox.error( "删除出错！", $scope);
						}
					}
				});
			});
		}
		
		$scope.queryServerInterface = function(){
			$scope.$post({
				url : "application/queryServerInterface",
				cover : false,
				data : {
				},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.serverInterfaces = result;
					});
					$(".select-test-method").chosen(); 
				}
			});
		};
		$scope.queryInterfaceParam = function(){
			$scope.$post({
				url : "application/queryInterfaceParam",
				cover : false,
				data : {
				},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.interfaces = result;
					});
					$(".select-interface-param").chosen(); 
				}
			});
		};
		$scope.pageSize = 10;
		$scope.pageNo = 1;
		$scope.queryServerInterfaceDetails=function(){
			var serverName = $scope.serverIntfKey;
			$scope.$post({
				url : "application/serverInterfaceDetails",
				cover : true,
				data : {
					"serverName":serverName,
					"pageSize":$scope.pageSize,
					"pageNo":$scope.pageNo
				},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.interfaceDetails=result.list;
						$scope.pageNo = result.pageNo;
						$scope.pageSize= result.pageSize;
						$scope.pageCnt = result.pageCnt;
					});
				}
			});
		};
		$scope.$watch("pageNo",function(newv){
			if(typeof newv!='undefined'){
				if(newv<1){
					$scope.pageNo = 1;	
					return;
				} else if(newv>$scope.pageCnt){
					$scope.pageNo = $scope.pageCnt;	
					return;
				}else {
					$scope.queryServerInterfaceDetails();	
				}
			}
		});
		/**
		 * 添加服务主机
		 */
		$scope.addServerHost =function(){
			var serverName = $scope.serverName;
			var serverIp = $scope.serverIp;
			var serverPort = $scope.serverPort;
			if(typeof serverName=='undefined'||typeof serverIp==''||typeof serverPort=='undefined'){
				return;
			}
			var flag = $(".select-server-type").val();
			var paramId = $(".select-interface-param").val();
			$scope.$post({
				url : "application/addServerHost",
				cover : true,
				data : {
					"serverName":serverName,
					"serverIp":serverIp,
					"serverPort":serverPort,
					"flag":flag,
					"paramId":paramId
				},
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("添加成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error("添加出错", $scope);
					}
				}
			});
		};
		
		/**
		 * 校验测试方法时候存在
		 */
		$scope.validateTestMethod=function(){
			var testMethod = $scope.testMethod;
			$scope.$post({
				url : 'application/validateTestMethod',
				cover:false,
				data : {
					"testMethod":testMethod
				},
				success:function(result){
					if(result=='exist'){
						$scope.$messageBox.tip("notice", "该测试方法已存在！", $scope);
					}
				}
			});
		}
		
		/**
		 * 添加服务探测接口
		 */
		$scope.addServerInterface= function(){
			var testMethod = $scope.testMethod;
			var interfaceType = $scope.interfaceType;
			var methodUrl = $scope.methodUrl;
			var namespace = $scope.namespace;
			if(typeof testMethod=='undefined'||typeof interfaceType==''||typeof methodUrl=='undefined'){
				return;
			}
			$scope.$post({
				url : "application/addServerInterface",
				cover : true,
				data : {
					"testMethod":testMethod,
					"interfaceType":interfaceType,
					"methodUrl":methodUrl,
					"namespace":namespace
				},
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("添加成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error("添加出错！", $scope);
					}
				}
			});
		};
		$scope.addInterfaceParam=function(){
			var testMethod = $(".select-test-method").val();
			var paramType = $scope.interf.paramType;
			var paramName = $scope.interf.paramName;
			var paramValue = $scope.interf.paramValue;
			var returnType = $scope.interf.returnType;
			var returnName = $scope.interf.returnName;
			var returnValue = $scope.interf.returnValue;
			var urlParam = $scope.interf.urlParam;
			var methodName = $scope.interf.methodName;
			if(testMethod==''){
				return;
			}
			$scope.$post({
				url : "application/addInterfaceParam",
				cover : true,
				data : {
					"testMethod":testMethod,
					"paramType":paramType,
					"paramName":paramName,
					"paramValue":paramValue,
					"returnType":returnType,
					"returnName":returnName,
					"returnValue":returnValue,
					"urlParam":urlParam,
					"methodName":methodName
				},
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("添加成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error( "添加出错！", $scope);
					}
				}
			});
		};
		$scope.deleteServerInterfaceDetails = function(interfaceDetail){
			$scope.$messageBox.confirm("确认删除？", $scope,function(){
				var flag = interfaceDetail.flag;
				var paramId = interfaceDetail.paramId;
				$scope.$post({
					url:"application/deleteServerInterfaceDetails",
					data:{
						flag:flag,
						paramId:paramId
					},
					success:function(result){
						if(result=='success'){
							$scope.$messageBox.success("删除成功！", $scope,function(){
								$scope.queryServerInterfaceDetails();
							});
						}else{
							$scope.$messageBox.error( "删除出错！", $scope);
						}
					}
				});
			});
		};
	}
});
