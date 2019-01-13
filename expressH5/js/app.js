var Global = {};

(function() {

    Global = {
    	
    	openWindow:function($obj)
    	{
    		
    		var options = {
						styles:{
							popGesture: "close"
						},
						extras:{}
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
        //网络请求
        commonAjax: function(params,callback, errorback) {
           var baseUrl = "https://lfb.kai-dian.com/api/";

            //默认 get请求
            if (!params.method) {
                params.method = "GET";
            } else {
                params.method = "POST";
            }
			
			//没有网络
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
                       var token = myStorage.getItem("userToken");
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
                    console.log(JSON.stringify(data));
                    errorback(data.msg ? data.msg : "");

                },
                complete: function(xhr, status) {
                    //Global.hideLoading();
					waiting.close();

//                     if (status == 'error') {
//                         Global.error404();
//                     } else if (status == 'timeout') {
//                         Global.error500();
//                     } else if (status != 'success') {
//                         Global.errorNet();
//                     }


                }
            });


        },


    //家里
    //    $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://192.168.3.31:1337/vorlon.js'></script>");

    //公司
    //   $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://10.8.66.213:1337/vorlon.js'></script>");
    //$("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://192.168.23.109:1337/vorlon.js'></script>");

   
	
	}
}());


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


	 //调试
      //$("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:10000;' onclick='window.location.reload();'>reload</div>");
	
	
	  $(".mui-title").click(function()
	  {
	  	//window.location.reload(1);
	  });






	


