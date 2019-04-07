/**
 * Created by Administrator on 2019/2/17.
 */



function  payModal(money)
{
	if((typeof(monthPay)  != 'undefined') && monthPay){
		$("body").append('<div class="modal-mask col" id="payModal">'+
		    '<div style="flex: 1;"></div>'+
		    ' <div class="modal-dialog">'+
		    '<div class="row_between modal_title_wrap">'+
		    ' <span>请选择支付方式</span>'+
		    ' <img src="../images/login/login_close.png" class="close_style" onclick="closeDialg();" />'+
		    '</div>'+
		    ' <div class="row_between money_item">'+
		    '<div>'+
		    ' <span>应付金额:</span>'+
		    '<span class="pay_money">￥'+money+'</span>'+
		    '</div>'+
		    '<span class="pay_warn">请在0小时30分内完成支付</span>'+
		    ' </div>'+
		    ' <form class="mui-input-group">'+
		    '<div class="mui-input-row mui-radio mui-right radio_item payItem" style="height: 0.55rem!important;">'+
		    ' <label>'+
		    ' <div class="row">'+
		    ' <span class="phone">月结</span>'+
		    ' </div>'+
		    '</label>'+
		    ' <input name="radio1" type="radio" value="wxpay" checked>'+
		    ' </div>'+
		'</form>'+
		'<<button type="button" class="mui-btn mui-btn-primary button" onclick="modalPay()">支付</button>'+
		'<</div>'+
		    '</div>')
			
		
	}else{
		$("body").append('<div class="modal-mask col" id="payModal">'+
		    '<div style="flex: 1;"></div>'+
		    ' <div class="modal-dialog">'+
		    '<div class="row_between modal_title_wrap">'+
		    ' <span>请选择支付方式</span>'+
		    ' <img src="../images/login/login_close.png" class="close_style" onclick="closeDialg();" />'+
		    '</div>'+
		    ' <div class="row_between money_item">'+
		    '<div>'+
		    ' <span>应付金额:</span>'+
		    '<span class="pay_money">￥'+money+'</span>'+
		    '</div>'+
		    '<span class="pay_warn">请在0小时30分内完成支付</span>'+
		    ' </div>'+
		    ' <form class="mui-input-group">'+
		    '<div class="mui-input-row mui-radio mui-right radio_item" style="height: 0.55rem!important;">'+
		    ' <label>'+
		    ' <div class="row">'+
		    ' <img src="../images/payWay_03.jpg" alt="">'+
		    ' <span class="phone">微信支付</span>'+
		    ' </div>'+
		    '</label>'+
		    ' <input name="radio1" type="radio" value="wxpay" checked>'+
		    ' </div>'+
		    ' <div class="mui-input-row mui-radio mui-right radio_item" style="height: 0.55rem!important;">'+
		    '<label>'+
		    '<div class="row">'+
		    ' <img src="../images/payWay_06.jpg" alt="">'+
		    ' <span class="phone">支付宝支付</span>'+
		   ' </div>'+
		'</label>'+
		'<input name="radio1" type="radio" value="alipay">'+
		'</div>'+
		'</form>'+
		'<<button type="button" class="mui-btn mui-btn-primary button" onclick="modalPay()">支付</button>'+
		'<</div>'+
		    '</div>')
	}
	

}

function modalPay()
{
	if((typeof(monthPay)  != 'undefined') && monthPay){
		//企业月结
		pay(3);
		
		
	}else{
		pay($('input:radio[name="radio1"]:checked').val());
	}
    
}

var payType, address_id;
// 2. 发起支付请求
function pay(payWay) {
    // 从服务器请求支付订单
    var PAYSERVER = '';
    if (payWay == 'wxpay')
    {
        PAYSERVER = 2;
    }
    else if(payWay=='alipay'){

        PAYSERVER=1;

    }else{
		//企业月结算
		PAYSERVER = 3
	}
	if((typeof(monthPay)  != 'undefined') && monthPay){
		
	}else{
		console.log("payWay==>"+payWay);
		console.log("payserver==>"+PAYSERVER);
		for (var i in channels)
		{
		    if (channels[i].id == payWay)
		    {
		        channel = channels[i];
		    }
		}
	}
    
	
	var url = payType+"/orders/"+id+"/pay";
	
	var params = {
		pay_method:PAYSERVER
	}
	
	if(address_id)
	{
		params.address_id=address_id;
	}
	

    Global.commonAjax({
        url: url,
        method: 'POST',
        data:params
    }, function(data){

        console.log("支付接口");
        console.log(JSON.stringify(channel));
        console.log(JSON.stringify(data));
		
		if((typeof(monthPay)  != 'undefined') && (monthPay == 1)){
			plus.nativeUI.alert("支付成功！", function() {
				
				var h = plus.webview.getWebviewById("my_order.html");
				mui.fire(h, 'myOrderRefresh', {});
				
				if(payType=="shop")
				{
					Global.openWindow({
					    url: 'my_order.html',
					    id: 'my_order.html',
					    waiting: {
					        autoShow: false
					    }
					})
				}
				else{
					back();
				}
			    
			});
			return;
		}

        var varpay = data;

        plus.payment.request(channel, varpay, function(result) {
            plus.nativeUI.alert("支付成功！", function() {
            	if(payType=="shop")
            	{
					var h = plus.webview.getWebviewById("mall_order.html");
					mui.fire(h, 'mallOrderRefresh', {});
					
            		Global.openWindow({
					    url: 'mall_order.html',
					    id: 'mall_order.html',
					    waiting: {
					        autoShow: false
					    }
					})
            	}
            	else{
            		back();
            	}
                
            });
        }, function(e) {
            plus.nativeUI.alert("支付失败");
            console.log(e.code);
            console.log(e.message);
        });


    }, function(err){
        console.log("支付错误");
        console.log(err);

    });




}

function closeDialg()
{
    $("#payModal").remove();
}