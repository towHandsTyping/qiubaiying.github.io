var HOST="http://119.57.161.52"
$(function(){
	// 报告日期
	var myDate = new Date();
	var ms=parseInt(myDate.getMonth())+1
	if(ms<=9){
		ms="0"+ms
	}
	var ds=myDate.getDate()
	if(ds<=9){
		ds="0"+ds
	}
	$("#cover_indus .name_box span").html(myDate.getFullYear()+"/"+ms+"/"+ds)
	var updatename=null
	if(parseInt(document.body.clientHeight)>768){
		var radius = 200; //旋转半径;
		var dtr = Math.PI/200; 
		var d=350;
		var mcList = []; 
		var active = true;
		var lasta = 1;  
		var lastb = 1;
		var distr = true; 
		var tspeed=4; 
		var size=250; 
		
		var mouseX=30; 
		var mouseY=30;
		
		var howElliptical=1;
		
		var spanObj=null; 
		var oDiv=null; 
		var flag=false
		window.onload=function (){ 
			var i=0; 
			var oTag=null; 
			
			oDiv=document.getElementById('tagbox'); 
			
			spanObj=oDiv.getElementsByTagName('span'); 
			
			for(i=0;i<spanObj.length;i++){
				oTag={}; 
				
				oTag.offsetWidth=spanObj[i].offsetWidth; 
				oTag.offsetHeight=spanObj[i].offsetHeight; 
				
				mcList.push(oTag); 
			}
			
			sineCosine( 0,0,0 ); 
			
			positionAll(); 
			
			oDiv.onmouseover=function (){
				active=false;

			};
			// oDiv.onclick=function (){
			// 	console.log(1234)
			// };
			setTimeout(function(){
				// console.log("1234")
				updatename=setInterval(update, 30)
			},100)
			oDiv.onmouseout=function (){
				active=true; 
				// console.log(active)
				if(flag){
					flag=false
					updatename=setInterval(update, 30); 
				}
				// console.log(active)
			}; 
			
			oDiv.onmousemove=function (ev){
				var oEvent=window.event || ev; 
				
				mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/8); 
				mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/8); 
				// console.log(oDiv.offsetWidth+"+++++++++++++")

				mouseX/=5;
				mouseY/=5;
				// console.log(mouseX+"x")
				// console.log(mouseY+"y")
				if(oEvent.clientX<=oDiv.offsetLeft||oEvent.clientY<=oDiv.offsetTop||oEvent.clientX>=(oDiv.offsetLeft+oDiv.offsetWidth)||oEvent.clientY>=(oDiv.offsetTop+oDiv.offsetHeight)){
					active=true;
				}else{
					active=false;
				}
			}; 
			
		};
		
		function update(){
			var a; 
			var b; 
			// console.log(active)
			if(active){
				a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed; 
				b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed; 
			}else{
				a =0; 
				b =0; 
				clearInterval(updatename)
				flag=true
			}
			
			lasta=a; 
			lastb=b; 
		
			if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01){
				return; 
			} 
			
			var c=0; 
			sineCosine(a,b,c); 
			for(var j=0;j<mcList.length;j++){
				var rx1=mcList[j].cx; 
				var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa); 
				var rz1=mcList[j].cy*sa+mcList[j].cz*ca; 
				
				var rx2=rx1*cb+rz1*sb; 
				var ry2=ry1; 
				var rz2=rx1*(-sb)+rz1*cb; 
				
				var rx3=rx2*cc+ry2*(-sc); 
				var ry3=rx2*sc+ry2*cc; 
				var rz3=rz2; 
				
				mcList[j].cx=rx3; 
				mcList[j].cy=ry3; 
				mcList[j].cz=rz3; 
				
				per=d/(d+rz3); 
				
				mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2); 
				mcList[j].y=ry3*per; 
				mcList[j].scale=per; 
				mcList[j].alpha=per; 
				
				mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6); 
			} 
			
			doPosition(); 
			depthSort(); 
		} 
		
		function depthSort(){ 
			var i=0; 
			var aTmp=[]; 
			
			for(i=0;i<spanObj.length;i++){ 
				aTmp.push(spanObj[i]); 
			} 
			
			aTmp.sort(function (vItem1, vItem2){ 
				if(vItem1.cz>vItem2.cz){ 
					return -1; 
				}else if(vItem1.cz<vItem2.cz){ 
					return 1; 
				}else{ 
					return 0; 
				} 
			}); 
			
			for(i=0;i<aTmp.length;i++){ 
				aTmp[i].style.zIndex=i; 
			} 
		} 
		
		function positionAll(){
			var phi=0; 
			var theta=0; 
			var max=mcList.length; 
			var i=0; 
			
			var aTmp=[]; 
			var oFragment=document.createDocumentFragment(); 
			
			//随机排序 
			for(i=0;i<spanObj.length;i++){ 
				aTmp.push(spanObj[i]); 
			} 
			
			aTmp.sort(function (){ 
				return Math.random()<0.5?1:-1; 
			}); 
			
			for(i=0;i<aTmp.length;i++){
				oFragment.appendChild(aTmp[i]); 
			}
			
			oDiv.appendChild(oFragment); 
			
			for( var i=1; i<max+1; i++){
				if( distr ) {
					phi = Math.acos(-1+(2*i-1)/max); 
					theta = Math.sqrt(max*Math.PI)*phi; 
				}else{
					phi = Math.random()*(Math.PI); 
					theta = Math.random()*(2*Math.PI); 
				}
				//坐标变换 
				mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi); 
				mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi); 
				mcList[i-1].cz = radius * Math.cos(phi); 
				
				spanObj[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px'; 
				spanObj[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px'; 
			} 
		} 
		
		function doPosition(){
			var l=oDiv.offsetWidth/2; 
			var t=oDiv.offsetHeight/2; 
			for(var i=0;i<mcList.length;i++){
				spanObj[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px'; 
				spanObj[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px'; 
				
				spanObj[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px'; 
				// spanObj[i].style.transform="rotate("+Math.random()*30+"deg)"; 
				
				spanObj[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")"; 
				spanObj[i].style.opacity=mcList[i].alpha; 
			} 
		} 
	}else{
		var radius = 200; //旋转半径; 
		var dtr = Math.PI/200; 
		var d=350; 
		var mcList = []; 
		var active = true;
		var lasta = 1;  
		var lastb = 1;
		var distr = true; 
		var tspeed=4; 
		var size=250; 
		
		var mouseX=30; 
		var mouseY=30; 
		
		var howElliptical=1; 
		
		var spanObj=null; 
		var oDiv=null; 
		var flag=false
		window.onload=function (){ 
			var i=0; 
			var oTag=null; 
			
			oDiv=document.getElementById('tagbox'); 
			
			spanObj=oDiv.getElementsByTagName('span'); 
			
			for(i=0;i<spanObj.length;i++){
				oTag={}; 
				
				oTag.offsetWidth=spanObj[i].offsetWidth; 
				oTag.offsetHeight=spanObj[i].offsetHeight; 
				
				mcList.push(oTag); 
			} 
			
			sineCosine( 0,0,0 ); 
			
			positionAll(); 

			oDiv.onmouseover=function (){
				active=false;

			};
			// oDiv.onclick=function (){
			// 	console.log(1234)
			// };
			setTimeout(function(){
				// console.log("1234")
				updatename=setInterval(update, 30)
			},100)
			oDiv.onmouseout=function (){
				active=true; 
				// console.log(active)
				if(flag){
					flag=false
					updatename=setInterval(update, 30); 
				}
				// console.log(active)
			}; 
			
			oDiv.onmousemove=function (ev){
				var oEvent=window.event || ev; 
				
				mouseX=oEvent.clientX-(oDiv.offsetLeft+oDiv.offsetWidth/2); 
				mouseY=oEvent.clientY-(oDiv.offsetTop+oDiv.offsetHeight/2); 
				
				// console.log(oDiv.offsetWidth+"+++++++++++++")
				mouseX/=5; 
				mouseY/=5; 
				// console.log(mouseX+"x")
				// console.log(mouseY+"y")
				if(oEvent.clientX<=oDiv.offsetLeft||oEvent.clientY<=oDiv.offsetTop||oEvent.clientX>=(oDiv.offsetLeft+oDiv.offsetWidth)||oEvent.clientY>=(oDiv.offsetTop+oDiv.offsetHeight)){
					active=true;
				}else{
					active=false;
				}
			}; 
			
			// setInterval(update, 30); 
		}; 
		
		function update(){ 
			var a; 
			var b; 
			
			if(active){

				a = (-Math.min( Math.max( -mouseY, -size ), size ) / radius ) * tspeed; 
				b = (Math.min( Math.max( -mouseX, -size ), size ) / radius ) * tspeed; 
			}else{
				a =0; 
				b =0; 
				clearInterval(updatename)
				flag=true
			}
			lasta=a; 
			lastb=b; 
		
			if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01){ 
				return; 
			} 
			
			var c=0; 
			sineCosine(a,b,c); 
			for(var j=0;j<mcList.length;j++){ 
				var rx1=mcList[j].cx; 
				var ry1=mcList[j].cy*ca+mcList[j].cz*(-sa); 
				var rz1=mcList[j].cy*sa+mcList[j].cz*ca; 
				
				var rx2=rx1*cb+rz1*sb; 
				var ry2=ry1; 
				var rz2=rx1*(-sb)+rz1*cb; 
				
				var rx3=rx2*cc+ry2*(-sc); 
				var ry3=rx2*sc+ry2*cc; 
				var rz3=rz2; 
				
				mcList[j].cx=rx3; 
				mcList[j].cy=ry3; 
				mcList[j].cz=rz3; 
				
				per=d/(d+rz3); 
				
				mcList[j].x=(howElliptical*rx3*per)-(howElliptical*2); 
				mcList[j].y=ry3*per; 
				mcList[j].scale=per; 
				mcList[j].alpha=per; 
				
				mcList[j].alpha=(mcList[j].alpha-0.6)*(10/6); 
			} 
			
			doPosition(); 
			depthSort(); 
		} 
		
		function depthSort(){ 
			var i=0; 
			var aTmp=[]; 
			
			for(i=0;i<spanObj.length;i++){ 
				aTmp.push(spanObj[i]); 
			} 
			
			aTmp.sort(function (vItem1, vItem2){ 
				if(vItem1.cz>vItem2.cz){ 
					return -1; 
				}else if(vItem1.cz<vItem2.cz){ 
					return 1; 
				}else{ 
					return 0; 
				} 
			}); 
			
			for(i=0;i<aTmp.length;i++){ 
				aTmp[i].style.zIndex=i; 
			} 
		} 
		
		function positionAll(){
			var phi=0; 
			var theta=0; 
			var max=mcList.length; 
			var i=0; 
			
			var aTmp=[]; 
			var oFragment=document.createDocumentFragment(); 
			
			//随机排序 
			for(i=0;i<spanObj.length;i++){ 
				aTmp.push(spanObj[i]); 
			} 
			
			aTmp.sort(function (){ 
				return Math.random()<0.5?1:-1; 
			}); 
			
			for(i=0;i<aTmp.length;i++){
				oFragment.appendChild(aTmp[i]); 
			}
			
			oDiv.appendChild(oFragment); 
			
			for( var i=1; i<max+1; i++){
				if( distr ) {
					phi = Math.acos(-1+(2*i-1)/max); 
					theta = Math.sqrt(max*Math.PI)*phi; 
				}else{
					phi = Math.random()*(Math.PI); 
					theta = Math.random()*(2*Math.PI); 
				}
				//坐标变换 
				mcList[i-1].cx = radius * Math.cos(theta)*Math.sin(phi); 
				mcList[i-1].cy = radius * Math.sin(theta)*Math.sin(phi); 
				mcList[i-1].cz = radius * Math.cos(phi); 
				
				spanObj[i-1].style.left=mcList[i-1].cx+oDiv.offsetWidth/2-mcList[i-1].offsetWidth/2+'px'; 
				spanObj[i-1].style.top=mcList[i-1].cy+oDiv.offsetHeight/2-mcList[i-1].offsetHeight/2+'px'; 
			} 
		} 
		
		function doPosition(){
			var l=oDiv.offsetWidth/2; 
			var t=oDiv.offsetHeight/2; 
			for(var i=0;i<mcList.length;i++){
				spanObj[i].style.left=mcList[i].cx+l-mcList[i].offsetWidth/2+'px'; 
				spanObj[i].style.top=mcList[i].cy+t-mcList[i].offsetHeight/2+'px'; 
				
				spanObj[i].style.fontSize=Math.ceil(12*mcList[i].scale/2)+4+'px'; 
				// spanObj[i].style.transform="rotate("+Math.random()*30+"deg)"; 
				
				spanObj[i].style.filter="alpha(opacity="+100*mcList[i].alpha+")"; 
				spanObj[i].style.opacity=mcList[i].alpha; 
			} 
		} 
	}
	setTimeout(function(){
		for(var i=0;i<mcList.length;i++){
			// $(spanObj).eq(i).hover(function(){
			// 	// console.log(this)
			// 	$(this).css("font-size","28px")
			// })
			$(spanObj).eq(i).on("click",function(){
				// console.log(this)
				$("#tagbox").addClass("narrow")
				$("header").addClass("narrow")
				var con=$(this).html()
				$("#cover_indus .name_box p").html(con+"<br/>行业报告")
				// industry_name='<div id="industry_name">'+con+'</div>'
				$("#book .book_left #industry_name").html(con)
			/*行业报告颜色备用*/
			/*	var cover_style=''
				var str_codesss=label_code.tagcode
				var class_color = str_codesss.split("");
			        class_color=class_color[class_color.length-1];
			        console.log(class_color)
			 	switch(class_color){
			 		case "0":cover_style="_FFC17A";break;
			 		case "1":cover_style="_FFC17A";break;
			 		case "2":cover_style="_7DA8FF";break;
			 		case "3":cover_style="_7DA8FF";break;
			 		case "4":cover_style="_8DDAD5";break;
			 		case "5":cover_style="_8DDAD5";break;
			 		case "6":cover_style="_EC77AB";break;
			 		case "7":cover_style="_EC77AB";break;
			 		case "8":cover_style="_FE998B";break;
			 		case "9":cover_style="_FE998B";break;
			 		default : cover_style="_FE998B";break;
			 	}
			 	console.log(cover_style)
			 	$("#cover").addClass(cover_style)*/

				setTimeout(function(){
					$("#book").addClass("hid_narrow")
					$("header").html("行业报告生成中")
					$("header").removeClass("narrow")
					$("header").addClass("hid_narrow")
					setTimeout(function(){
						var str = '景星DI (Data Intelligence) 基于创投行业大数据，通过人工智能相关技术，为用户提供一键生成行业分析报告、实时跟踪企业运营情况及竟品发掘分析等相关服务。';
					   	var i = 0;
					   	// console.log(str.length)
						function typing(){
					    	var divTyping = document.getElementById('book_left_con');
					    	if (i <= str.length) {
					     		divTyping.innerHTML = str.slice(0, i++) + '_';
					     		setTimeout(typing,100);//递归调用
					    	}else{
					     		divTyping.innerHTML = str;//结束打字,移除 _ 光标
					     		setTimeout(echarts_bar_line(),400)
								setTimeout(function(){
									$("#book").animate({"left":"-500px"},1000,function(){
										$("#book .book_left").addClass("rotate_trun")
										$("header").addClass("head_turn")
										$("header").removeClass("hid_narrow")
										setTimeout(function(){
											$("header").html("行业报告生成完成")
										},600)
										setTimeout(function(){
											$("#cover_indus").addClass("rotate_truns")
											setTimeout(function(){
												$("#book .book_half").hide()
												$("#cover img").addClass("seal")
												$("#code").fadeIn(1000);
												$("#code .again").on("click",function(){
													history.go(0)
													// $("#book").removeClass("narrows")
													// $("#book").addClass("hid_narrows")
													// $("header").removeClass("head_turn")
													// $("tagbox").removeClass("narrow")
													// $("header").addClass("head_turn")
													// $("#tagbox").addClass("hid_narrow")
													// setTimeout(function(){
													// 	$("header").html("一键生成行业报告")
													// },600)
												})
											},500)
										},500)
									})
								},1300)
					    	}
					   	}
						typing();
					},1300)
				},1300)

				setTimeout(function(){
					$("#tagbox").hide()
				},2000)
			})
		}
	},1000) 
	function sineCosine( a, b, c){
		sa = Math.sin(a * dtr); 
		ca = Math.cos(a * dtr); 
		sb = Math.sin(b * dtr); 
		cb = Math.cos(b * dtr); 
		sc = Math.sin(c * dtr); 
		cc = Math.cos(c * dtr); 
	}
	var echarts_bar_line=function(){
	        myChart = echarts.init(document.getElementById('echarts_bar'));
	        // 指定图表的配置项和数据
	        var option = {
	        	animationDuration:1200,
	            //图例
	            
	            //直角坐标系内绘制网格（图表相对于#main的位置）
	            grid: [{
					zlevel: 0,
					z: 0,
					left:"0",   //左上坐标
					right:"0",
					top:"-1%",
					bottom:"2%",
					height:"99%",
					width:"100%",
				}],
				            
	            xAxis: [{
	            	//gridIndex:1,\
	            	name:"",
	            	nameTextStyle:{
	            		color:"#fff",
	            		fontStyle:"italic",
	            		fontWeight:"100",
	            		fontSize:"10"
	            	},
	            	nameGap:"0",
	            	//inverse:"true",//反向坐标轴，左右反转
	            	//nameRotate:"45",
	            	//坐标轴是否可交互
	            	//silent:false,
	            	axisLine: {
						show: true,
						onZero: true,
						lineStyle: {
							color: '#10E6EC',
							width:1,
							type: 'solid',
						},
					},
	            	axisTick:{
	            		show:false,
		            	alignWithLabel:false,
		            	length:'0',//坐标轴刻度的长度。
	            	},
	            	
	            	//刻度标签
	            	axisLabel: {
	            		show:false,//是否显示刻度标签。
		            //	rotate:"45",
		            	margin:"10",//
		            	interval:0,
						textStyle: {
						    fontFamily:"PingFang-SC-Regular",
							fontSize: 14,
							color: "#999999",
						},
	            	},
	                data: [1,2,3,4,5],
	            }],
	            yAxis: [{
		            name : '',
		            type : 'value',
		            position:"right",
		            nameTextStyle: {
						color:"#fff",
					},
		            axisLine:{
						show: false,
						onZero: true,
						lineStyle: {
							color: '#333',
							width: 1,
							type: 'solid',
						},
					},
					axisTick: {
						show:false,
					},
					axisLabel: {
						show: false,
						interval: 'auto',
						inside: false,
						rotate: 0,
						margin: 8,
						showMinLabel: null,
						showMaxLabel: null,
						textStyle: {
							color: "#999999",
							fontStyle: 'normal',
							fontWeight: "normal",
							fontFamily: 'PingFang-SC-Regular',
							fontSize:14,
							////////////////////////////////////////////:"-0.008rem",
						},
					},
					//坐标轴分割段数
					splitNumber:5,
					splitLine: {
						show: true,
	//					interval: 'auto',
						lineStyle: {
							color:'#10E6EC',
							width: 1,
							type: 'solid',
						},
					},
		        },
		        {
		            name : '',
		            type : 'value',
		            position:"left",
		            inverse: false,
		        	nameTextStyle: {
						color:"#fff",
					},
		            axisLine: {
						show: false,
						onZero: true,
					},
					axisTick: {
						show:false,
					},
					axisLabel: {
						show: false,
						interval: 'auto',
						inside: false,
						rotate: 45,
						margin:8,
						showMinLabel: null,
						showMaxLabel: null,
						textStyle: {
							color: "#999999",
							fontStyle: 'normal',
							fontWeight: "normal",
							fontFamily: 'PingFang-SC-Regular',
							fontSize:14,
							////////////////////////////////////////////:"-0.008rem",
						},
					},
					splitNumber:5,
					splitLine: {
						show: false,
						interval:0,
						lineStyle: {
							color:'#E5E5E5',
							width: 1,
							type: 'solid',
						},
					},
		        }],
	            series: [{
	                name: '',
	                type: 'line',
	                symbol:"circle",//折点属性
		            symbolSize:"8",
		            smooth:false,//平滑曲线
		         	itemStyle: {
					    normal: {
			         		//areaStyle: {type: 'default'},
					    	color:'#ccc',//柱状图柱颜色  折线图折点颜色
				            lineStyle:{
					        	color:'#ccc',//线条颜色
	//					        	width: "0.002rem",
	//                      		type: 'solid'
					        },
					        label:{
		            			show:false,
		            			textStyle:{
		            				fontFamily:"PingFang-SC-Regular",
									fontSize:14,
									color: "#ccc",
									////////////////////////////////////////////:"-0.008rem",
		            			}
		            		}
					    } 
					},
	                data:[12,18,24,35,43],
	            },
	            {
	                name: '',
	                type: 'bar',
	                //symbol:"triangle",//折点属性
	               // symbol: 'image://img/img2.jpg',//图片作为折点
		            yAxisIndex:1,/////多坐标轴有效
		            smooth:"true",//平滑曲线
		         	itemStyle: {
					    normal: {
					    	color:'#1CC8FF',//柱状图柱颜色  折线图折点颜色
					    }
					},
			    	label:{
			    		normal:{
		        			show:false,
		        			position:"top",
		        			offset:[0,2],
		        			textStyle:{
		        				fontFamily:"PingFang-SC-Regular",
								fontSize:14,
								color: "#1CC8FF",
	        				}
			    		},
	        		},
					barWidth:"44.8%",
	                data:[130,150,170,210,230]
	            }]
	        };
	        myChart.setOption(option);
		
	}


})













