/**
 * Created by Administrator on 2019/2/17.
 */



function  payModal(money)
{

$("body").append('<div class="modal-mask col" id="payModal" data-money="'+money+'">'+
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

function modalPay()
{
    pay($('input:radio[name="radio1"]:checked').val());
}

var payType, address_id;
// 2. 发起支付请求
function pay(payWay) {
    // 从服务器请求支付订单
    
    console.log("payWay==>"+payWay);
   
    for (var i in channels)
    {
        if (channels[i].id == payWay)
        {
            channel = channels[i];
        }
    }
	
	var url = "shop/order/pay";
	
	var params = {
		payment_code:payWay,
		order_id:id,
		
	}
	
	console.log("支付数据");
	console.log(JSON.stringify(params));

    Global.commonAjax({
        url: url,
        method: 'POST',
        data:params
    }, function(data){

        console.log("支付接口");
        console.log(JSON.stringify(channel));
        console.log(JSON.stringify(data));

		if(payWay=="alipay")
		{
			var payData={
				url:"shop/order/alipay",
				params:{
					pay_sn:(new Date()).getTime()+randomNum(10,99),
					amount:$("#payModal").attr("data-money"),
					goods_name:"商品购买"
				}
			}
			payWayCreateOrder(payData);
		}


    }, function(err){
        console.log("支付错误");
        console.log(err);

    });

}

//生成随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

function payWayCreateOrder(payData)
{
	
	 Global.commonAjax({
        url: payData.url,
        method: 'POST',
        data:payData.params
    }, function(data){

        console.log("支付接口");
        console.log(JSON.stringify(channel));
        console.log(JSON.stringify(data));

        var varpay = data;

        plus.payment.request(channel, varpay, function(result) {
            plus.nativeUI.alert("支付成功！", function() {
                back();
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