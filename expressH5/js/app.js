var Global = {};

(function() {

    Global = {
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
        commonAjax: function(params, callback, errorback) {
           var baseUrl = "http://app.dev.xianghq.cn/api/";
            // var baseUrl = "https://app.xhq520.com/api/"; 
            //   var baseUrl = "http://192.168.1.26:8081/api/";
            //应用版本号
            var appVersion = plus.runtime.version;
            //          //设备唯一标识
            var deviceId = plus.device.uuid;
            //          //系统的版本信息
            var osVersion = plus.os.version;
            //
            var appType = plus.os.name;
            var appName = "xhq";

            //默认 get请求
            if (!params.method) {
                params.method = "GET";
            } else {
                params.method = "POST";
            }

            if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
                Global.errorNet();
                return;
            }

            mui.ajax(baseUrl + params.url, {
                dataType: "json",
                type: params.method,
                data: params.data,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("deviceId", deviceId);
                    xhr.setRequestHeader("osVersion", osVersion);
                    xhr.setRequestHeader("appVersion", appVersion);
                    xhr.setRequestHeader("appType", appType);
                    xhr.setRequestHeader("appName", appName);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    // var token = myStorage.getItem("userToken");
//                     if (token) {
//                         xhr.setRequestHeader("Authorization", "Bearer " + token);
//                     };

                    if (params.url.indexOf("isShowPic=true") != -1) {
                        console.log("显示图片");
                    } else {
                        Global.showLoading();
                    }


                },
                success: function(data) {
                    //console.log(JSON.stringify(data));
                    if (data.code.indexOf("token") != -1 || params.url.indexOf("logout") != -1) {
                        //token 过期
//                         if (myStorage) {
//                             myStorage.removeItem("userToken");
//                             myStorage.removeItem("user");
//                             myStorage.removeItem("userInfo");
//                             myStorage.removeItem("wallet");
//                             myStorage.removeItem("headPic");
//                         }
                        var curr = plus.webview.currentWebview();
                        var wvs = plus.webview.all();
                        console.log(data.code);
                        if (wvs && wvs.length) {
                            for (var i = 0; i < wvs.length; i++) {
                                if (wvs[i]) {
                                    if (wvs[i].getURL() == curr.getURL()) {
                                        continue;
                                    }
                                    plus.webview.close(wvs[i]);
                                }

                            }
                            if (params.url.indexOf("logout") != -1) {
                                mui.toast("请重新登录");
                            } else {
                                mui.toast("登录信息已失效，请重新登录");
                            }

                            plus.webview.open('login.html');

                            curr.close();

                            return;
                        }

                    } else if (data.code == "pay.ok") {
                        callback(data.data ? data.data : "");
                    } else if (data.code == "SUCCESS" || data.code == "OK" ||
                        data.code == "success" || data.code == "ok") {
                        callback(data.data ? data.data : "");
                    }else if(data.code == "ocr.succ.over") {
                        errorback && errorback(data.msg, data.code);
                    }else if(data.code == "ocr.back.over"){
                    		mui.toast(data.msg);
                    		callback(data.data ? data.data : "");
                    }else {
                        errorback && errorback(data.msg);
                    }

                },
                error: function(data) {
                    console.log(JSON.stringify(data));
                    if (!data.response || !data.responseText) {
                        Global.error500();
                        return;
                    }
                    if (errorback) {
                        errorback(data.msg);
                    }

                },
                complete: function(xhr, status) {
                    if (params.url.indexOf("isShowPic=true") != -1) {
                        console.log("显示图片");
                        return;
                    }

                    // setTimeout(function() {
                    //     Global.hideLoading();
                    // }, 500);
                    Global.hideLoading();

                    if (params.url.indexOf("card") != -1) {
                        console.log("9999999");
                        return;
                    }

                    if (params.url.indexOf("changpay/prepare")) {
                        //支付短信平台出错

                        return;
                    }

                    if (status == 'error') {
                        Global.error404();
                    } else if (status == 'timeout') {
                        Global.error500();
                    } else if (status != 'success') {
                        Global.errorNet();
                    }


                }
            });


        },


    //家里
    //    $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://192.168.3.31:1337/vorlon.js'></script>");

    //公司
    //   $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://10.8.66.213:1337/vorlon.js'></script>");
    //$("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://192.168.23.109:1337/vorlon.js'></script>");

    //公司
    //  $("body").append("<div style='width:50px;height:50px;background:#000;position:absolute;right:0;bottom:50px;z-index:1000;' onclick='window.location.reload();'>reload</div><script src='http://10.8.66.150:1337/vorlon.js'></script>");
	
	
	}
}());