/**
 * jiacheng
 */
define([ 'app', 'jquery-cookie', 'bootstrap', 'ace-extra', 'ace-elements',
		'ace', 'jquery-chosen','slimscroll','htmlFilter' ,'utilService' ], function() {
	angular.module("monitor").controller("warningCheckCtrl", warningCheckCtrl);
	function warningCheckCtrl($scope, $rootScope) {
		$('[data-rel=tooltip]').tooltip({container:'body'});
		$scope.pageSize = 10;
		$scope.pageNo = 1;
		$scope.queryMonitorControl = function() {
			var monitorKey = $scope.monitorKey
			$scope.$post({
				url : "warningCheck/queryMonitorControl",
				cover : false,
				data : {
					"monitorKey" : monitorKey,
					"pageSize" : $scope.pageSize,
					"pageNo" : $scope.pageNo
				},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.monitorControls = result.list;
						$scope.pageNo = result.pageNo;
						$scope.pageSize = result.pageSize;
						$scope.pageCnt = result.pageCnt;
					});
				}
			});
		};
		$scope.beforeModifyMonitorControl = function(monitorControl){
			$scope.monitorControl = monitorControl;
		};
		$scope.modifyMonitorControl = function(){
			$scope.$post({
				url : 'application/modifyMonitorControl',
				data : JSON.stringify($scope.monitorControl),
				dataType : "text",
				success : function(result) {
					if(result=='success'){
						$scope.$messageBox.success("修改成功！", $scope,function(){
							$scope.queryMonitorControl();	
						});
					}else{
						$scope.$messageBox.error("修改出错！", $scope);
					}
				},
				error : function(result) {
				}
			});
		};
		$scope.deleteMonitorControl = function(monitorControl){
			$scope.$messageBox.confirm("确认删除？", $scope,function(){
				var code = monitorControl.code;
				$scope.$post({
					url:"warningCheck/deleteMonitorControl",
					data:{
						code:code
					},
					success:function(result){
						if(result=='success'){
							$scope.$messageBox.success("删除成功！", $scope,function(){
								$scope.queryMonitorControl();
							});
						}else{
							$scope.$messageBox.error( "删除出错！", $scope);
						}
					},
					error:function(result){
						$scope.$messageBox.error( "删除出错！", $scope);
					}
				});
			});
		};
		$scope.switchMonitorTab = function(item) {
			$scope.monitorTab = item;
			if(item=='monitorQuery'){
				$scope.tabDesc = "查询告警配置";
				$scope.queryMonitorControl();
			}else if(item=='monitorAdd'){
				$scope.tabDesc = "新增告警配置";
				$scope.queryServerType();
			}else if(item=='warningGroupQuery'){
				$scope.tabDesc = "查询告警组";
				$scope.queryGroupMembers();
			} else if(item=='warningMemberAdd'){
				$scope.tabDesc = "新增告警成员";
				$scope.queryWarningGroups();
				$scope.queryWarningTypes();
			} else{
				$scope.tabDesc = "新增告警组";
			}
		};
		$scope.switchMonitorTab("monitorQuery");
		
		$scope.queryServerType = function(){
			$scope.$post({
				url : "application/serverTestType",
				cover : true,
				async:true,
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
		};
		
		$scope.$watch("pageNo", function(newv) {
			if (typeof newv != 'undefined') {
				if (newv < 1) {
					$scope.pageNo = 1;
					return;
				}
				;
				if (newv > $scope.pageCnt) {
					$scope.pageNo = $scope.pageCnt;
					return;
				}
			}
			$scope.queryMonitorControl();
		});
		$scope.validateMonitorCode = function(){
			var monitorCode = $scope.monitorCode;
			$scope.$post({
				url : "warningCheck/validateMonitorCode",
				cover : false,
				data:{
					monitorCode:monitorCode,
				},
				success : function(result) {
					if(result=='exist'){
						$scope.$messageBox.tip("notice", "该编码已存在！", $scope);
					};
				}
			});
		}
		$scope.addMonitorControl = function(){
			var monitorCode = $scope.monitorCode;
			var monitorName = $scope.monitorName;
			var monitorLevel = $scope.monitorLevel;
			var monitorType = $scope.monitorType;
			var testType = $(".select-server-type").val();
			var monitorRemark = $scope.monitorRemark;
			$scope.monitorControl.monitorCode= monitorCode;
			$scope.monitorControl.monitorName= monitorName;
			$scope.monitorControl.monitorLevel= monitorLevel;
			$scope.monitorControl.monitorType= monitorType;
			$scope.$post({
				url : "warningCheck/addMonitorControl",
				cover : true,
				data:{
					monitorCode:monitorCode,
					monitorName:monitorName,
					monitorLevel:monitorLevel,
					monitorType:monitorType,
					testType:testType,
					monitorRemark:monitorRemark
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
		$scope.validateGroupName = function(){
			var warningGroupName = $scope.warningGroupName;
			$scope.$post({
				url:"warningCheck/queryWarningGroupCnt",
				data:{
					warningGroupName:warningGroupName
				},
				cover:false,
				success:function(result){
					if(result=='success'){
						$scope.validateStatus = false;
					}else{
						$scope.validateStatus = true;
					}
				}
			});	
		};
		$scope.addWarningGroup = function(){
			var warningGroupName = $scope.warningGroupName;
			if(typeof warningGroupName=='undefined'){
				return;
			}
			if(!$scope.validateStatus){
				$scope.$messageBox.tip("notice", "该告警组名称已存在！", $scope);
				return;
			}
			$scope.$post({
				url:"warningCheck/addWarningGroup",
				data:{
					warningGroupName:warningGroupName
				},
				success:function(result){
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
		$scope.queryGroupMembers = function(){
			$scope.$post({
				url : "warningCheck/queryGroups",
				cover : true,
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
					$(".group-member-box").slimScroll({
						height: '400px'
				    });
				}
			});
		}
		$scope.queryWarningGroups = function(){
			$scope.$post({
				url:"warningCheck/queryWarningGroups",
				data:{
				},
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.warningGroups = result;
					});
					$(".select-warning-group").chosen(); 	
				}
			});
		};
		$scope.queryWarningTypes = function(){
			$scope.$post({
				url:"warningCheck/queryWarningTypes",
				data:{
				},
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.warningTypes = result;
					});
				}
			});
		};
		$scope.addWarningMember = function(){
			var groupName = $(".select-warning-group").val();
			var warningType = $scope.warningMember.warningType;
			var memberName = $scope.warningMember.memberName;
			var memberNumber = $scope.warningMember.memberNumber;
			var beginDt = $scope.warningMember.beginDt;
			var endDt = $scope.warningMember.endDt;
			$scope.$post({
				url:"warningCheck/addWarningMember",
				data:{
					groupName:groupName,
					warningType:warningType,
					memberName:memberName,
					memberNumber:memberNumber,
					beginDt:beginDt,
					endDt:endDt
				},
				success:function(result){
					if(result=='success'){
						$scope.$messageBox.success("添加成功！", $scope,function(){
							window.location.reload();	
						});
					}else{
						$scope.$messageBox.error("添加出错！", $scope);
					}
				}
			});	
		}
	}
});
