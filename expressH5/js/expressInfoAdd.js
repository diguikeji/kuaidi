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



                for(var i=0;i<data.data.length;i++)
                {

                    console.log(JSON.stringify(data.data[i]));

                    html=html+'<div class="swiper-slide">' +
                        '<div><img src="'+data.data[i].logo_url+'"/></div>' +
                        '<p>'+data.data[i].name+'</p>' +
                        '<div class="bottom">' +
                        '<span class="first">￥8.0</span>' +
                        '<span class="second">¥10.0</span>' +
                        '</div>' +
                        '</div>';
                }

                $(".swiper-wrapper").append(html);
                $(".swiper-wrapper .swiper-slide").eq(0).addClass("active");

                initExpressList();

            }




        },
        function(err) {

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



//提交订单
function submitData()
{
    Global.commonAjax({
            url: "express/orders",
            method:"post",
            data:
            {
                "from_address_id": 61212,
                "to_address_id": 61213,
                "express_company_id": 1,
                "package": "文件",
                "weight": 1.0,
                "comment": "寄送的是文件",
                "express_company_id": 1,
                "type": "1",
                "insured_value": 0,
                "insured_price": 0
            }

        },
        function(data) {
            console.log("提交订单");
            console.log(JSON.stringify(data));
        },
        function(err) {
            console.log("提交订单失败");
        });

}



