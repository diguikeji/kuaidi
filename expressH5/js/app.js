var Global = {};

(function() {

    Global = {
    	
    	openWindow:function($obj)
    	{
			
    		var options = {
						styles:{
							popGesture: "close"
						},
						extras:$obj.extras
					};
    		
    		options.styles.statusbar = {
							background: "#fff"
						};
    		
    		mui.openWindow($obj.url, $obj.id,options);
    		
    	},
        showLoading: function() {
            if ($("#ShowLoading").length == 0) {
                $("body").append("<div id='ShowLoading' style='width:100%;height:100%;background:rgba(0,0,0,0.5);display:table;position: fixed;left:0;top:0;z-index:1000000;'><div style='width:100%;text-align:center;vertical-align:middle;display: table-cell;'><img src='../images/loading.gif' style='width: 98px; height: 44px;'/></div></div>");
            }
        },
        hideLoading: function() {
            $("#ShowLoading").remove();
        },
        error500: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/500.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'error500.html',
                id: 'error500.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        error404: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/404.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'error404.html',
                id: 'error404.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        errorNet: function() {
            //$(".mui-content").html('<div class="error-col"><img src="../images/error/wangluo.png"/><button type="button" class="mui-btn mui-btn-outlined go-home" >返回首页</button></div>');
            mui.openWindow({
                url: 'errornet.html',
                id: 'errornet.html',
                waiting: {
                    autoShow: false
                }
            })
        },
        errorDetail: function() {
            $(".mui-content").html('<div class="error-col"><img src="../images/error/tixian.png"/></div>');
        },
        errorNews: function() {
            $(".mui-content").html('<div class="error-col"><img src="../images/error/xiaoxi.png"/></div>');

        },
        emptyList: function() {
            $(".mui-table-view-condensed").html('<div class="error-col"><img src="../images/error/xiaoxi.png"/></div>');

        },
        showModal: function(title, reload, callback) {
            if ($('.global-modal').length == 0 || reload) {


                // var html = '<div class="global-modal modal-mask row"><div class="modal-dialog"><img src="../images/close_icon.png" class="closeDialg" /><div class="modal-content"><div class="dialog_title">'
                // 			+title+'</div><div class="dialog_content">'+msg+
                // 			'</div></div></div></div>';

                var html = '<div class="global-modal row"><div class="modal-dialog"><img src="../images/close_icon.png" class="closeDialg" /><div class="modal-content">' +
                    title + '</div></div></div>';
                $(document.body).append(html);
            } else {
                $('.global-modal').removeClass("hideClass");
            }

            $('.closeDialg').click(function() {
                if (callback) {
                    callback();
                } else {
                    $('.global-modal').addClass("hideClass");
                }

            });


        },
        hideModal: function() {
            $('.global-modal').addClass("hideClass");
        },
        isShowModal: function() {
            var isClose = ($('.global-modal').length == 0) || $('.global-modal').hasClass("hideClass");
            console.log($('.global-modal').length)
            return !isClose;
        },
        refreshUser:function()
        {
				Global.commonAjax({
					url: 'profile'
				}, function(data){
					console.log(JSON.stringify(data));
					myStorage.setItem("user", data);
					$("#qiye").text(data.company_id);
					
				}, function(err){
					
				});
       },
        //网络请求
        commonAjax: function(params,callback, errorback) {
           var baseUrl = "https://lfb.kai-dian.com/api/";

            //默认 get请求
            if (!params.method) {
                params.method = "GET";
            } else {
                params.method = params.method;
            }
			
			//没有网络
			console.log("params+"+params.url);
            if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
                Global.errorNet();
                return;
            }
			
			var waiting;
            mui.ajax(baseUrl + params.url, {
                dataType: "json",
                type: params.method,
                data: params.data,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.setRequestHeader("Accept", "application/json");
                    var token = myStorage.getItem("token");
                    
                    if (token) {
                        xhr.setRequestHeader("Authorization", "Bearer " + token);
                    };

                    //Global.showLoading();
                    waiting = plus.nativeUI.showWaiting("加载中...");

                },
                success: function(data) {
                    // console.log(JSON.stringify(data));
					if (data.success) {
                        callback(data.data ? data.data : "");
                    } else{
						errorback(data.msg ? data.msg : "");
					}

                },
                error: function(data) {
					

                },
                complete: function(xhr, status) {
                    console.log(xhr.status);
					waiting.close();
					if(xhr.status == 401){
						//重新登录
// 						if(params.url.indexOf("profile") != -1){
// 							
// 							errorback("");
// 						}else{
// 							Global.goToLogin();
// 						}
						Global.goToLogin();
						
					}else if(xhr.status == 200){
						
					}else{
						errorback("请求出错");
					}

                }
            });


        },
		
		goToLogin: function(){
			
			var path = plus.webview.currentWebview();
			//获取所有已经打开的webview窗口
			var wvs = plus.webview.all();
			for (var i = 0, len = wvs.length; i < len; i++) {
			    if (wvs[i].getURL().indexOf("login.html") != -1) {
			        return;
			    }
			}
			console.log("ddddddddddddddd")
			if(path && path.__view_array__[0] && 
					path.__view_array__[0].id.indexOf("html/") != -1){
				//包含
				Global.openWindow({
				    url: 'html/login.html',
				    id: 'html/login.html',
				    waiting: {
				        autoShow: false
				    }
				})
			}else{
				Global.openWindow({
				    url: 'login.html',
				    id: 'login.html',
				    waiting: {
				        autoShow: false
				    }
				})
			}
			
		},

		getCanvasBase64: function(img) {
		    var image = new Image();
		    //至关重要
		    image.crossOrigin = '';
		    image.src = img;
		    //至关重要
		    var deferred = $.Deferred();
		    if (img) {
		        image.onload = function() {
		            deferred.resolve(Global.compress(image)); //将base64传给done上传处理
		        }
		        return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
		    }
		},
		
		
		compress: function(img) {
		    //    用于压缩图片的canvas
		    var canvas = document.createElement("canvas");
		    var ctx = canvas.getContext('2d');
		    //    瓦片canvas
		    var tCanvas = document.createElement("canvas");
		    var tctx = tCanvas.getContext("2d");
		
		    var initSize = img.src.length;
		    var width = img.width;
		    var height = img.height;
		
		    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
		    var ratio;
		    if ((ratio = width * height / 4000000) > 1) {
		        ratio = Math.sqrt(ratio);
		        width /= ratio;
		        height /= ratio;
		    } else {
		        ratio = 1;
		    }
		
		    canvas.width = width;
		    canvas.height = height;
		
		    //        铺底色
		    ctx.fillStyle = "#fff";
		    ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		    //如果图片像素大于100万则使用瓦片绘制
		    var count;
		    if ((count = width * height / 1000000) > 1) {
		        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
		
		        //            计算每块瓦片的宽和高
		        var nw = ~~(width / count);
		        var nh = ~~(height / count);
		
		        tCanvas.width = nw;
		        tCanvas.height = nh;
		
		        for (var i = 0; i < count; i++) {
		            for (var j = 0; j < count; j++) {
		                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
		
		                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
		            }
		        }
		    } else {
		        ctx.drawImage(img, 0, 0, width, height);
		    }
		
		    //进行最小压缩
		    var ndata = canvas.toDataURL("image/jpeg", 0.5);
		
		    console.log("压缩前：" + initSize);
		    console.log("压缩后：" + ndata.length);
		    console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");
		
		    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
		
		    return ndata;
		}
    
   
	
	}
}());


//数据配置文件
var Config={};
Config.wmStatus=["已经送出","派件中","已经送达楼服宝","已经送达用户","已经送达前台"];



function openWindowPage(url){
    
    var options = {
						styles:{
							popGesture: "close"
						},
						extras:{}
					};
    		
    		options.styles.statusbar = {
							background: "#fff"
						};
    		
    		mui.openWindow(url, url,options);
    
    
}

//加减法计算
mui("body").on('tap','.add-value',function(event){

    event.stopPropagation();
    var value=parseInt($(this).prev().text());
    value++;
    $(this).prev().text(value);

});
mui("body").on('tap','.sub-value',function(event){


    event.stopPropagation();
    var value=parseInt($(this).next().text());
    if(value<=1)
    {
        return;
    }
    value--;
    $(this).next().text(value);

});

mui('body').on('tap','a',function(){
	//window.top.location.href=this.href;
});

    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端



//公共ready后的事件
function commonEvent()
{
    if($("#louyuText").length>0)
    {
    	updateLouyuName();
        window.addEventListener('updateLouyuName', function(event) {
            console.log("updateLouyuName");
            updateLouyuName();
        }, false);
    }

}

function updateLouyuName()
{
	if(myStorage && myStorage.getItem("louyuName"))
	{
		var louyuObj=JSON.parse(myStorage.getItem("louyuName"));
	    console.log(louyuObj.name);
	    $("#louyuText").find("span").text(louyuObj.name);
	    $("#louyuText").find("span").attr("data-id",louyuObj.id);
	}
    
}

//绑定企业
function  bindQiye()
{
    var btnArray = ['确定', '取消'];
    mui.prompt('企业号是企业统一支付服务费用的结算账户代码。请联系公司前台或行政负责人获取企业号,也可咨询楼服宝工作人员。', '请输入企业号', '企业号', btnArray, function(e) {
        if (e.index == 0) {
            var inputValue=e.value;
            //alert(inputValue);
            
            	if(inputValue=="")
            	{
            		mui.toast("企业号不能为空");
            		return;
            	}
            
            	//绑定
				Global.commonAjax({
	                    url: "user/company",
	                    method:"POST",
	                    data:{
	                    	code:inputValue
	                    }
						
	            },
				function(data) {
					console.log("绑定");
					mui.toast("绑定成功");
					Global.refreshUser();
					console.log(JSON.stringify(data));
				},
				function(err) {
				    console.log("绑定报错"+JSON.stringify(err));
				});
						
            
            
            
        } else {
            
        }
    })
}

function  unBindQiye()
{
    var btnArray = ['是', '否'];
    mui.confirm('是否解除绑定企业？', '企业号', btnArray, function(e) {
        if (e.index == 0) {

            //绑定
            Global.commonAjax({
                    url: "user/company",
                    method:"delete"
                },
                function(data) {
                    console.log("解除绑定");
                    mui.toast("解除绑定成功");
                    $("#qiye").text("未设置");
                    Global.refreshUser();
                    console.log(JSON.stringify(data));
                },
                function(err) {
                    console.log("解除绑定报错"+JSON.stringify(err));
                });

        } else {

        }
    })
}



$(".shadow-col").on("click",function()
{
	
    hideBottomModal();

});

$(".beizhu-col .right-close").click(function()
{
    hideBottomModal();
});

function  hideBottomModal()
{
    $(".beizhu-col").hide();
    $(".beizhu-col .beizhu-text").hide();
}

$("#louyuText").click(function()
{
    if(window.location.href.indexOf("index.html")>-1)
    {
        Global.openWindow({
            url: 'html/louyuList.html',
            id: 'louyuList.html',
            waiting: {
                autoShow: false
            }
        })
    }
    else {
        Global.openWindow({
            url: 'louyuList.html',
            id: 'louyuList.html',
            waiting: {
                autoShow: false
            }
        })
    }

});

//url传参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(r[2]); return null;
}


	 //调试
      //$("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:10000;' onclick='window.location.reload();'>reload</div>");
	
	
	  $(".mui-title").click(function()
	  {
	  	//window.location.reload(1);
	  });






	


