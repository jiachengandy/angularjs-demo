define([ 'app'], function() {
	// 用户操作
	angular.module("monitor").factory('utilManager', function($rootScope) {
		var utilManager = {
			// 空间下添加用户
			getQueryString : function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return decodeURI(unescape(r[2]));
				} else {
					return null;
				}

			},
			getLocalTime:function(){
				var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
				var yy = now.getFullYear(); //截取年，即2006 
				var mm = now.getMonth()+1; //截取月，即07 
				var dd = now.getDate(); //截取日，即29 
				//取时间 
				var hh = now.getHours(); //截取小时，即8 
				var mi = now.getMinutes(); //截取分钟，即34 
				var ss = now.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，
				ss = (ss - (ss % 1000)) / 1000;
				mm=mm<10?"0"+mm:mm;
				dd=dd<10?"0"+dd:dd;
				hh=hh<10?"0"+hh:hh;
				mi=mi<10?"0"+mi:mi;
				ss=ss<10?"0"+ss:ss;
				var dateTime=yy+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
				return dateTime;
			},
			getLocalDate:function(){
				var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
				var yy = now.getFullYear(); //截取年，即2006 
				var mm = now.getMonth()+1; //截取月，即07 
				var dd = now.getDate(); //截取日，即29 
				mm=mm<10?"0"+mm:mm;
				dd=dd<10?"0"+dd:dd;
				var date=yy+"-"+mm+"-"+dd;
				return date;
			},
			getLocalMonth:function(){
				var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
				var yy = now.getFullYear(); //截取年，即2006 
				var mm = now.getMonth()+1; //截取月，即07 
				mm=mm<10?"0"+mm:mm;
				var date=yy+"-"+mm;
				return date;
			},
			calculatePage : function(cpage) {
				if(typeof(cpage)!='undefined'&&cpage>page)
        		{
        			cpage=page;
        		}
        		if(typeof(cpage)!='undefined'&&cpage<1)
        		{
        			cpage=1;
        		}
        		return cpage;
			},
			showPage:function(size){
				var pages=[];
				page=size;
				for(var i=1;i<=size;i++)
				{
					pages.push(i);
				}
				return pages;
			},
			drawEchart:function(data,onafter){
				var myChart = echarts.init(document.getElementById(data.id));
				option = {
						grid : {
							x:50,
							x2:20,
							y:40,
							y2:80
						},
					    title : {
					        text: data.text,
					        subtext: data.subtext,
					        x:'center',
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    legend: {
					        data:data.legend,
					        y:'bottom'
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            //mark : {show: true},
					            //dataView : {show: true, readOnly: false},
					            magicType : {show: true, type: ['line', 'bar']},
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    noDataLoadingOption:{
					    	text:'获取数据异常！',
					    	textStyle:{
					    		fontSize :18,
					    		fontFamily:'Microsoft YaHei',
					    		color:'red'
					    	},
					    	effect:'whirling'
					    },
					    calculable : false,
					    xAxis : [
					        {
					            type : 'category',
					            boundaryGap : false,
					            data : data.xAxis,
					            splitLine:{show:false},
					            axisLabel: {
					            	rotate: data.xAxis.rotate,//设置轴旋转度数
					            	}
					        }
					    ],
					    yAxis : [
					        {
					            type : 'value',
					            axisLabel : {
					                formatter: data.formatter
					            },
					            scale:true,
					            min:data.min,
					            max:data.max
					        }
					    ],
					    series : data.series
					};
				 /*window.onresize = function () {
					myChart.resize(); //使第一个图表适应
					}*/
				 window.addEventListener("resize", function () {
						myChart.resize();
		            });
				myChart.setOption(option);
			},
			drawchart:function(data){
				$(".chart-win").css("display","block");
				$("body").append("<div class='masklayer'></div>");
				var series = [];
				$.each(data.series, function(i, e){
					series.push({name : e.stitle,data : e.sdata,lineWidth : 1,marker: {radius: 2}});
				});
				chart = new Highcharts.Chart({
					chart : {
						renderTo : "chartdetail",
						type : 'line',
						zoomType:'x',
						marginRight : 130,
						marginBottom : 25
					},
					title : {
						text : data.hostmsg,
						x : -20
					},
					xAxis : {
						categories : data.labels,
						labels: {y:50}
					},
					yAxis : {
						min:0,
						max:data.ymax,
						title : {
							text : data.ytitle
						},
						plotLines : [ 
						              {
						            	  value : 2,
						            	  width : 1,
						            	  color : '#808000'
						              } ],
						labels: {
							formatter:function(){
								return this.value+data.f.a;
								}
						}
					},
					tooltip : {
						crosshairs: true,
						formatter : function() {
							return '<b>'+ this.series.name +'</b><br/>'+data.f.b+this.x+'<br/>'+data.f.c+ this.y+data.f.a;
						}
					},
					legend : {
						layout : 'vertical',
						align : 'right',
						verticalAlign : 'top',
						x : -10,
						y : 100,
						borderWidth : 0
					},
					series : series
				});
			},
			formatDate:function(time, offset){
				if(offset == null)
					offset = 0;
				if(offset == -1){
					offset = 0;
					time.setHours(0,0,0,0);
				}
				if(offset == -2){
					offset = 0;
					time.setHours(23,59,59,999);
				}
				var tm = time.getTime() + offset * 1000 * 60 * 60 * 24;
				time = new Date(tm);
				var y = time.getYear();
				if(y < 1000)
					y += 1900;
				var m = time.getMonth() + 1;
				if(m < 10) m = "0" + m;
				var d = time.getDate();
				if(d < 10) d = "0" + d;
				var h = time.getHours();
				if(h < 10) h = "0" + h;
				var mi = time.getMinutes();
				if(mi < 10) mi = "0" + mi;
				return y + "-" + m + "-" + d + " " + h + ":" + mi;
			},
			animateFont:function(obj,size0,size1){
				obj.animate({"font-size":size0+"px"},300);
				obj.animate({"font-size":size0+"px"},300);
			},
			trim:function(str){  
			    return str.replace(/(^\s*)|(\s*$)/g, "");  
			} 
		};
		return utilManager;
	});

});
