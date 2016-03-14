define(['app'], function()
{
	angular.module("monitor").filter('arraySize', function()
	{
		return function(inputArray, begin, end)
		{
			if (!(inputArray instanceof Array))
				return inputArray;
			return inputArray.slice(begin, end);
		};
	});

	angular.module("monitor").filter('domainSorter', function()
	{
		return function(domains)
		{
			if (!(domains instanceof Array))
				return domains;

			for ( var i = 0; i < domains.length; i++)
			{
				var domain = domains[i];
				if (domain.domain == window.location.hostname)
				{
					domains.splice(i, 1);
					domains.unshift(domain);
					break;
				}
			}

			return domains;
		};
	});

	// service搜索过滤器
	angular.module("monitor").filter(
			'serviceSearchFilter',
			function($rootScope)
			{
				// inputArray表示当前进行过滤的array数据，keyword指当前的搜索条件
				return function(serviceArray, keyword)
				{
					if (!(serviceArray instanceof Array))
						return serviceArray;

					var matchArray = [];

					if (typeof (keyword) == "undefined")
					{
						return serviceArray;
					}

					keyword = keyword.toLocaleLowerCase();
					// 对传入的service进行遍历，若其中包含相关keyword则放入到matchArray中
					if (serviceArray != null && serviceArray instanceof Array)
					{
						for ( var i = 0; i < serviceArray.length; i++)
						{
							for ( var j = 0; j < serviceArray[i].services.length; j++)
							{
								if ((serviceArray[i].services[j].label != null && serviceArray[i].services[j].label.toLocaleLowerCase().indexOf(keyword) > -1)
										|| (serviceArray[i].services[j].provider != null && serviceArray[i].services[j].provider.toLocaleLowerCase().indexOf(keyword) > -1))
								{
									matchArray.push(serviceArray[i]);
									break;
								}
							}
						}
					}

			return matchArray;
		};
	});
	// application搜索过滤器
	angular.module("monitor").filter('applicationSearchFilter',function($rootScope)
	{
		// inputArray表示当前进行过滤的array数据，keyword指当前的搜索条件
		return function(applicationArray, keyword)
		{
			if (!(applicationArray instanceof Array))
				return applicationArray;

			var matchArray = [];

			if (typeof (keyword) == "undefined")
			{
				return applicationArray;
			}

			keyword = keyword.toLocaleLowerCase();
			// 对传入的service进行遍历，若其中包含相关keyword则放入到matchArray中
			if (applicationArray != null && applicationArray instanceof Array)
			{
				for ( var i = 0; i < applicationArray.length; i++)
				{
					for ( var j = 0; j < applicationArray[i].application.length; j++)
					{
						if ((applicationArray[i].application[j].name != null && applicationArray[i].application[j].name.toLocaleLowerCase().indexOf(keyword) > -1)
								|| (applicationArray[i].application[j].provider != null && applicationArray[i].application[j].provider.toLocaleLowerCase().indexOf(keyword) > -1))
						{
							matchArray.push(applicationArray[i]);
							break;
						}
					}
				}
			}

			return matchArray;
		};
	});
	angular.module("monitor").filter('filterServiceInstances', function()
	{
		return function(insances, bindedInstances)
		{
			if (!(insances instanceof Array && bindedInstances instanceof Array))
			{
				// 避免inputArray没定义
				if (typeof (inputArray) == "undefined")
				{
					return null;
				}
				else
				{
					return inputArray;
				}
			}
			var result = [];
			insances.forEach(function(instance)
			{
				var id = instance.guid;
				var used = false;
				bindedInstances.forEach(function(bindedInstance)
				{
					if (bindedInstance.guid == id)
					{
						used = true;
					}
				});
				if (!used)
				{
					result.push(instance);
				}
			});
			return result;
		};
	});
	
	angular.module("monitor").filter('filterIpSort', [ '$rootScope',function($rootScope)
	{
		return function(filterArray,arrayItem)
		{
			if (!(filterArray instanceof Array)){
				return filterArray;
			}
			if (typeof (arrayItem) == "undefined")
			{
				return filterArray;
			}
			 var temp; // 记录临时中间值   
			 var size = filterArray.length; // 数组大小   
			    for (var i = 0; i < size - 1; i++) {
			        for (var j = i + 1; j < size; j++) {
			        	var ip1 = parseIp(filterArray[i][arrayItem]);
			        	var ip2 = parseIp(filterArray[j][arrayItem]);
			            if (compartTo(ip1,ip2 )>0) { // 交换两数的位置   
			                temp = filterArray[i];   
			                filterArray[i] = filterArray[j];   
			                filterArray[j] = temp;   
			            }   
			        }   
			    }  
			return filterArray;
		};
	}]);
	
	function compartTo(ip1,ip2){
		var ip1Result=0,ip2Result=0;  
        for(var i=0;i<4;i++){  
            ip1Result+=(ip1[i]<<(24-i*8));  
        }  
        for(var i=0;i<4;i++){  
            ip2Result+=(ip2[i]<<(24-i*8));  
        }  
        if(ip1Result-ip2Result>0){  
            return 1;  
        }else if(ip1Result-ip2Result<0){  
            return -1;  
        }else{  
            return 0;  
        }  
	}
	
	function parseIp(ip){
     var result=[];  
     var ip1 = ip.split(".");  
        if(ip!=null){  
            result[0]=parseInt(ip1[0]);  
            result[1]=parseInt(ip1[1]);  
            result[2]=parseInt(ip1[2]);  
            result[3]=parseInt(ip1[3]);  
        }  
        return result;
	}
});
