/**
 * Created by Administrator on 2019/1/18.
 */

mui.plusReady(function() {
    commonEvent();
    httpRequest();
    
    window.addEventListener('storageAddressValue', function(event) {
            var addressObj=myStorage.getItem("storageAddressValue");
            console.log(JSON.stringify(addressObj));
            if(myStorage.getItem("storageSelectAddressValue")==1)
            {
                $("#chufa").attr("data-id",addressObj.id);
                $("#chufa").addClass("active");
            	$("#chufa").find(".middle-value").html('<div class="middle-value-top">'+addressObj.name+'&nbsp'+addressObj.mobile+'</div>' +
                    '<div class="middle-value-bottom">'+addressObj.province+addressObj.city+addressObj.area+addressObj.detail+'</div>');
            }
            else if(myStorage.getItem("storageSelectAddressValue")==2)
            {
                $("#daoda").attr("data-id",addressObj.id);
                $("#daoda").addClass("active");
                $("#daoda").find(".middle-value").html('<div class="middle-value-top">'+addressObj.name+'&nbsp'+addressObj.mobile+'</div>' +
                    '<div class="middle-value-bottom">'+addressObj.province+addressObj.city+addressObj.area+addressObj.detail+'</div>');
            }
            
            
        }, false);
    
    

});

$("#wupinSelect").click(function()
{
    $(".beizhu-col").show();
    $("#goodsType").show();

});

$("#goodsType .tag-list span").click(function()
{
    $("#goodsType .tag-list span").removeClass("active");
    $(this).addClass("active");
    $("#wupinSelect .text").text( $("#goodsType .tag-list .active").text());
    hideBottomModal();
});

$("#payWay .tag-list span").click(function()
{
    $("#payWay .tag-list span").removeClass("active");
    $(this).addClass("active");
    $("#payWaySelect .text").text( $("#payWay .tag-list .active").text());
    hideBottomModal();
})

$("#beizhuWenzi").click(function()
{
    $(".beizhu-col").show();
    $("#beizhuText").show();
});

$("#payWaySelect").click(function()
{
    $(".beizhu-col").show();
    $("#payWay").show();
});

document.getElementById("baojiaSwitch").addEventListener('toggle', function(event) {

    if(event.detail.isActive)
    {
        $("#baojiaCol").show();
    }
    else
    {
        $("#baojiaCol").hide();
        $("#baojiaCol input").val("");
        $(".baofei").text("0");
    }

});

$("#confirmBtn").click(function()
{
    $("#beizhuWenzi .beizhu").text($("#beizhuText textarea").val());
    hideBottomModal();
});


var expressPriceList=[];

function  httpRequest()
{
    Global.commonAjax({
            url: "express/companies?create_type="+myStorage.getItem("storageExpressCreateType"),

        },
        function(data) {



            if(data)
            {
                var html="";

                for(var i=0;i<data.length;i++)
                {

                    //console.log(JSON.stringify(data[i]));

                    html=html+'<div class="swiper-slide" data-id="'+data[i].id+'">' +
                        '<div><img src="'+data[i].logo_url+'"/></div>' +
                        '<p>'+data[i].name+'</p>' +
                        '</div>';
                }

                $(".swiper-wrapper").append(html);

                initExpressList();

            }




        },
        function(err) {
			console.log("获取快递公司"+JSON.stringify(err));
        })

    //地理位置转换
    Global.commonAjax({
            url: "location?lat=31.3094530562&lng=121.5241955154",

        },
        function(data) {
            console.log(JSON.stringify(data));
        },
        function(err) {

        });

//快递计算价格
    Global.commonAjax({
            url: "express/calculate",
            method:"post"

        },
        function(data) {
            console.log("计算");
            expressPriceList=data;
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("失败");
        });


//快递订单搜索
    Global.commonAjax({
            url: "express/search?sn=1"

        },
        function(data) {
            console.log("快递计算价格");
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("失败");
        });

}


var expressPriceObj;
function initExpressList()
{

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3.6,
        spaceBetween: 15,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        }
    });

    $(".yunfei-img-list .swiper-slide").click(function()
    {
        $(".yunfei-img-list .swiper-slide").removeClass("active");
        $(this).addClass("active");
        var companyId=$(".yunfei-img-list .active").attr("data-id");
        for(var i=0;i<expressPriceList.length;i++)
        {
            if(companyId==expressPriceList[i].id)
            {
                expressPriceObj=expressPriceList[i];
            }
        }
        countFeiyong();
        console.log(JSON.stringify(expressPriceObj));

    });

}

function countFeiyong()
{
    console.log("计算运费");
    if(expressPriceObj)
    {
        var weight=parseInt($(".sub-value").next().text());

        var priceText=weight*expressPriceObj.price;
        priceText=priceText.toFixed(1);
        $("#priceText").text(priceText);

    }


}

$("#baojiaColInput").on("blur",function()
{
    baojiaHttp();
});

function baojiaHttp()
{
    if($("#baojiaSwitch").hasClass("mui-active"))
    {

        var from_address_id=$("#chufa").attr("data-id");
        var to_address_id=$("#daoda").attr("data-id");

        var express_company_id=$(".yunfei-img-list .active").attr("data-id");
        var package=$("#wupinSelect .text").text();

        var weight=parseInt($(".sub-value").next().text());

        var insured_value=$("#baojiaCol input").val();

        var paramObj={
            from_address_id:from_address_id,
            to_address_id:to_address_id,
            express_company_id:express_company_id,
            package:package,
            weight:weight,
            insured_value:insured_value,
        };

        Global.commonAjax({
                url: "express/insurance/calculate",
                method:"POST",
               data:paramObj

            },
            function(data) {
                console.log("保费计算");
                console.log(JSON.stringify(data));
                console.log(data.insure_price);
                $(".baofei").text(data.insure_price);
            },
            function(err) {
                console.log("保费计算失败");
            });
    }
}


if(myStorage.getItem("storageExpressCreateType")==1)
{
    $("#titleCol").text("国内快递");
}
else if(myStorage.getItem("storageExpressCreateType")==2)
{
    $("#titleCol").text("国际快递");
}
else if(myStorage.getItem("storageExpressCreateType")==3)
{
    $("#titleCol").text("同城快递");
}
else
{
    $("#titleCol").text("物流大件");
}


//提交订单
function submitData()
{
    if(!$("#chufa").hasClass("active"))
    {
        mui.toast("请选择寄件地址");
        return;
    }

    if(!$("#daoda").hasClass("active"))
    {
        mui.toast("请选择收件地址");
        return;
    }

    if($("#wupinSelect .text").text()=="请选择")
    {
        mui.toast("请选择物品类型");
        return;
    }

    if($("#payWaySelect .text").text()=="请选择")
    {
        mui.toast("请选择付款方式");
        return;
    }

    if($("#baojiaSwitch").hasClass("mui-active"))
    {
        if(!$("#baojiaCol input").val())
        {
            mui.toast("请输入保额");
            return;
        }
    }

    if($(".yunfei-img-list .active").length==0)
    {
        mui.toast("请选择快递公司");
        return;
    }




    var from_address_id=$("#chufa").attr("data-id");
    var to_address_id=$("#daoda").attr("data-id");

    var express_company_id=$(".yunfei-img-list .active").attr("data-id");
    var package=$("#wupinSelect .text").text();

    var weight=parseInt($(".sub-value").next().text());

    var comment=$("#beizhuWenzi .beizhu").text();

	if(comment=="请输入备注信息")
	{
		comment="";
	}


    var is_freight_collect=$("#payWaySelect .text").val();
    is_freight_collect=is_freight_collect=="到付"?1:0;

    var is_print=$("#is_print").hasClass("mui-active");

    var type=myStorage.getItem("storageExpressType");
    var create_type=myStorage.getItem("storageExpressCreateType");
    var insured_value=parseFloat($("#baojiaColInput").val());
    var insured_price=parseFloat($(".baofei").text());

    var paramObj={
        from_address_id:from_address_id,
        to_address_id:to_address_id,
        express_company_id:express_company_id,
        package:package,
        weight:weight,
        comment:comment,
        is_freight_collect:is_freight_collect,
        is_print:is_print,
        type:type,
        create_type:create_type,
        insured_value:insured_value,
        insured_price:insured_price
    };

   console.log(JSON.stringify(paramObj));

    Global.commonAjax({
            url: "express/orders",
            method:"POST",
            data:paramObj
        },
        function(data) {
            console.log("提交订单");
            mui.toast("提交成功");
            mui.back();
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("提交订单失败");
        });

}

function selectAddress(value)
{
	
	myStorage.setItem("storageSelectAddressValue",value);
	Global.openWindow({
			    url: 'my_address.html',
			    id: 'my_address.html',
			    waiting: {
			        autoShow: false
			    }
			})
	
}

