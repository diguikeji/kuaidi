/**
 * Created by Administrator on 2019/1/18.
 */


mui.plusReady(function() {
    commonEvent();
    httpRequest()

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
        $("#baojiaCol input").text("");
    }

});

$("#confirmBtn").click(function()
{
    $("#beizhuWenzi .beizhu").text($("#beizhuText textarea").val());
    hideBottomModal();
});


function  httpRequest()
{
    Global.commonAjax({
            url: "express/companies",

        },
        function(data) {



            if(data)
            {
                var html="";



                for(var i=0;i<data.length;i++)
                {

                    console.log(JSON.stringify(data[i]));

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
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("失败");
        });


//快递计算价格
    Global.commonAjax({
            url: "express/search?sn=1"

        },
        function(data) {
            console.log("计算");
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("失败");
        });

}



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
    });

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

    if($(".yunfei-img-list .active").length==0)
    {
        mui.toast("请选择快递公司");
        return;
    }



    var express_company_id=$(".yunfei-img-list .active").attr("data-id");
    var package=$("#wupinSelect .text").text();

    var weight=parseInt($(".sub-value").next().text());

    var comment=$("#beizhuWenzi .beizhu").text();

    var is_freight_collect=$("#payWaySelect .text").val();
    is_freight_collect=is_freight_collect=="货到付款"?1:0;

    var is_print=$("#is_print").hasClass("mui-active");

    var type=myStorage.getItem("storageExpressType");
    var create_type=myStorage.getItem("storageExpressCreateType");
    var insured_value=100;
    var insured_price=30;

    var paramObj={
        from_address_id:43784,
        to_address_id:4839,
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
            method:"post",
            data:paramObj
        },
        function(data) {
            console.log("提交订单");
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("提交订单失败");
        });

}



