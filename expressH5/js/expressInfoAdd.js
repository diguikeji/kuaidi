

$(".address-tab .address-col").click(function () {
    $(".address-tab .address-col").removeClass("active");
    $(this).addClass("active");

    if ($(this).index() == 2) {
        $(".liancheng-col").show();
    }
    else {
        $(".liancheng-col").hide();
    }
});

var channel;
var channels;
var id;
var payType;

mui.plusReady(function () {
	//企业快递增加月结字段
	if(myStorage.getItem("storageExpressType")==2)
	{
		$("#qiyeText").text("月结");
	}
	
    commonEvent();
    httpRequest();

    plus.payment.getChannels(function (cs) {
        channels = cs;
        console.log(JSON.stringify(channels));
    }, function (e) {
        //alert("获取支付通道失败：" + e.message);
    });

    window.addEventListener('storageAddressValue', function (event) {
        var addressObj = myStorage.getItem("storageAddressValue");
        console.log(JSON.stringify(addressObj));
        if (myStorage.getItem("storageSelectAddressValue") == 1) {
            $("#chufa").attr("data-id", addressObj.id);
            $("#chufa").addClass("active");
            $("#chufa").find(".middle-value").html('<div class="middle-value-top">' + addressObj.name + '&nbsp' + addressObj.mobile + '</div>' +
                '<div class="middle-value-bottom">' + addressObj.province + addressObj.city + addressObj.area + addressObj.detail + '</div>');
        }
        else if (myStorage.getItem("storageSelectAddressValue") == 2) {
            $("#daoda").attr("data-id", addressObj.id);
            $("#daoda").addClass("active");
            $("#daoda").find(".middle-value").html('<div class="middle-value-top">' + addressObj.name + '&nbsp' + addressObj.mobile + '</div>' +
                '<div class="middle-value-bottom">' + addressObj.province + addressObj.city + addressObj.area + addressObj.detail + '</div>');
        }
        else if (myStorage.getItem("storageSelectAddressValue") == 3) {
            $("#daoda1").attr("data-id", addressObj.id);
            $("#daoda1").addClass("active");
            $("#daoda1").find(".middle-value").html('<div class="middle-value-top">' + addressObj.name + '&nbsp' + addressObj.mobile + '</div>' +
                '<div class="middle-value-bottom">' + addressObj.province + addressObj.city + addressObj.area + addressObj.detail + '</div>');
        }
        countFeiyong();
    }, false);
});

$("#wupinSelect").click(function () {
    $(".beizhu-col").show();
    $("#goodsType").show();
});

$("#payWay .tag-list span").click(function () {
    $("#payWay .tag-list span").removeClass("active");
    $(this).addClass("active");
    $("#payWaySelect .text").text($("#payWay .tag-list .active").text());
	
	console.log("999999999")
	console.log($(this).text())
	if($(this).text() == '到付'){
		$(".yunfei-bottom .left").hide();
		$("#priceText").text("0.0");
		
	}else{
		$(".yunfei-bottom .left").show();
	}
	
    hideBottomModal();
    countFeiyong();
})

$("#beizhuWenzi").click(function () {
    $(".beizhu-col").show();
    $("#beizhuText").show();
});

$("#payWaySelect").click(function () {
    $(".beizhu-col").show();
    $("#payWay").show();
});

$("#fapiaoSelect").click(function () {
    $(".beizhu-col").show();
    $("#fapiaoType").show();
});

if ($("#baojiaSwitch").length > 0) {
    document.getElementById("baojiaSwitch").addEventListener('toggle', function (event) {
        if (event.detail.isActive) {
            $("#baojiaCol").show();
        }
        else {
            $("#baojiaCol").hide();
            $("#baojiaCol input").val("");
            $(".baofei").text("0");
            if($("#priceText").attr("data-yufei"))
            {
            	
            	if($("#priceText").attr("data-yufei")=="--")
		    	{
		    		$("#priceText").text("请与工作人员联系").addClass("small");;
		    	}
		    	else{
		    		
		    		$("#priceText").text("￥"+$("#priceText").attr("data-yufei"));
		    		
		    	}
				checkYunFei();
            }
        }
    });
}

//同城模板
function checkYunFei(){
	if (myStorage.getItem("storageExpressCreateType") == 3){
		//同城快递
		if($("#priceText").text() == "￥99999"){
			$("#priceText").text("请与工作人员联系").addClass("small");
			return;
		}
	}
	
}

$("#confirmBtn").click(function () {
    $("#beizhuWenzi .beizhu").text($("#beizhuText textarea").val());
    hideBottomModal();
});

var expressPriceList = [];

function httpRequest() {
    Global.commonAjax({
        url: "express/companies?type=" + myStorage.getItem("storageExpressType")+"&create_type="+myStorage.getItem("storageExpressCreateType"),
    }, function (data) {
    	console.log("获取快递公司" + JSON.stringify(data));
        if (data) {
            render('.swiper-wrapper', 'expressCompanyList', { data: data }, true);
            initExpressList();
        }
    }, function (err) {
        console.log("获取快递公司" + JSON.stringify(err));
    })
}


function initExpressList() {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3.6,
        spaceBetween: 15,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        }
    });

    $(".yunfei-img-list .swiper-slide:first-child").addClass("active");
    var yunfei=$(".yunfei-img-list .swiper-slide:first-child .bottom").text();
    
    if(yunfei)
    {
    	if(yunfei=="--")
    	{
    		$("#priceText").text("请与工作人员联系").addClass("small");;
    	}
    	else{
    		
    		$("#priceText").text("￥"+yunfei);
    		
    	}
    	$("#priceText").attr("data-yufei",yunfei);
    	
		checkYunFei();
    }
    

    $(".yunfei-img-list .swiper-slide").click(function () {
    	countFeiyong();
        $(".yunfei-img-list .swiper-slide").removeClass("active");
        $(this).addClass("active");
        // if (is_freight_collect == 1) {
        //     $("#priceText").text("到付");
        // } else {
            var price = $(this).find(".bottom").text();
            if (price=="--") {
                $("#priceText").text("请与工作人员联系").addClass("small");
            } else {
            	if(price)
            	{
            		$("#priceText").attr("data-yufei",price);
            		
            		if(price=="--")
			    	{
			    		$("#priceText").text("请与工作人员联系").addClass("small");;
			    	}
			    	else{
			    		$("#priceText").text("￥"+price).removeClass("small");
			    	}
            		
                	
					checkYunFei();
            	}
            	
            }
        // }
    });
}


function countFeiyong() {
    console.log("计算运费");
    var from_address_id = $("#chufa").attr("data-id");
    var to_address_id = $("#daoda").attr("data-id");

    var express_company_id = $(".yunfei-img-list .active").attr("data-id");
    var package = $("#wupinSelect .text").text();
    var weight = parseFloat($(".weight-value").text()).toFixed(1);
    var type = myStorage.getItem("storageExpressType");
    var create_type = myStorage.getItem("storageExpressCreateType");

    if (window.location.href.indexOf("yunfei.html") > -1) {
        create_type = $("#kuaidiType .tag-list .active").attr("data-type");
    }
    var is_freight_collect = $("#payWaySelect .text").val();
    is_freight_collect = is_freight_collect== "到付" ? 1 : 0;

    var insured_value = 0;

    var paramObj = {
        from_address_id: from_address_id,
        to_address_id: to_address_id,
        express_company_id: express_company_id,
        package: package,
        weight: weight,
        create_type: create_type,
        type: type,
        is_freight_collect: is_freight_collect,
        insured_value: insured_value,
    };
    

    Global.commonAjax({
        url: "express/calculate",
        method: "POST",
        data: paramObj
    }, function (data) {
        console.log("运费计算");
        console.log(JSON.stringify(data));

        render('.swiper-wrapper', 'expressCompanyPirceList', { data: data });
        initExpressList();

        // for (var i in data) {
        //     if ((data[i] == 0) || (data[i] > 10000)) {
        //         $(".express-com-" + i).hide();
        //         $(".express-jiage" + i).text("无");
        //     } else {
        //         $(".express-com-" + i).show();
        //         $(".express-jiage" + i).text("￥" + data[i]);
        //     }
        // }

        // console.log("is_freight_collect:" + is_freight_collect);

    }, function (err) {
        console.log("运费计算失败");
    });
}

$("#baojiaColInput").on("blur", function () {
    baojiaHttp();
});

function baojiaHttp() {
    if ($("#baojiaSwitch").hasClass("mui-active")) {
        var from_address_id = $("#chufa").attr("data-id");
        var to_address_id = $("#daoda").attr("data-id");

        var express_company_id = $(".yunfei-img-list .active").attr("data-id");
        var package = $("#wupinSelect .text").text();

        var weight=parseFloat($(".weight-value").text()).toFixed(1);
        console.log($(".weight-value").next())

        var type = myStorage.getItem("storageExpressType");
        var create_type = myStorage.getItem("storageExpressCreateType");

        var insured_value = $("#baojiaCol input").val();

        var paramObj = {
            from_address_id: from_address_id,
            to_address_id: to_address_id,
            express_company_id: express_company_id,
            package: package,
            type: type,
            create_type: create_type,
            weight: weight,
            insured_value: insured_value,
        };
        
        Global.commonAjax({
            url: "express/insurance/calculate",
            method: "POST",
            data: paramObj
        },
        function (data) {
            console.log("保费计算");
            console.log(JSON.stringify(data));
            console.log(data.insure_price);
            
            var yunfei=$("#priceText").attr("data-yufei");
            if(yunfei)
            {
            	yunfei=parseFloat(yunfei)+data.insure_price;
            }
            if(yunfei=="--")
	    	{
	    		$("#priceText").text("请与工作人员联系").addClass("small");;
	    	}
	    	else{
	    		$("#priceText").text("￥"+yunfei);
	    	}
            $(".baofei").text(data.insure_price);
			checkYunFei();
        },
        function (err) {
            console.log("保费计算失败");
        });
    }
}

if (myStorage.getItem("storageExpressCreateType") == 1) {
    $("#titleCol").text("国内快递");
    $(".guoji-col").show();
} else if (myStorage.getItem("storageExpressCreateType") == 2) {
    $("#titleCol").text("国际快递");
    $("#goodsType .tag-list").html('<span class="active">文件</span><span>包裹</span>');
} else if (myStorage.getItem("storageExpressCreateType") == 3) {
    $("#titleCol").text("同城快递");
    $(".tongcheng-col").show();
    $(".guoji-col").show();
} else {
    $("#titleCol").text("物流大件");
    $(".guoji-col").show();
}

$("#baoguoCol").click(function () {
    $(".beizhu-col").show();
    $("#baoguoAdd").show();
});

mui("#baoguoDetailCol").on('tap', '.baoguo-delete', function (event) {
    event.stopPropagation();
    $(this).parent().remove();
});

function addBaoguoRow() {
    if ($("#rowValue1").val() == "") {
        mui.toast("内件品名不能为空");
        return;
    }
    if ($("#rowValue3").val() == "") {
        mui.toast("重量不能为空");
        return;
    }
    if ($("#rowValue4").val() == "") {
        mui.toast("单件价值不能为空");
        return;
    }
    if ($("#rowValue5").val() == "") {
        mui.toast("原产地不能为空");
        return;
    }

    $("#baoguoDetailCol").append('<div class="baoguo-row">' +
        '<div><span class="row-value1">' + $("#rowValue1").val() + '</span><span><label class="row-value2">' + $("#rowValue2").text() + '</label>件</span><span>重量：<label class="row-value3">' + $("#rowValue3").val() + '</label>KG</span></div>' +
        '<div><span>价格：<label class="row-value4">' + $("#rowValue4").val() + '</label>USD</span><span>原产地：<label class="row-value5"">' + $("#rowValue5").val() + '</label></span></div>' +
        '<span class="right baoguo-delete">' +
        '<span class="mui-icon mui-icon-minus"></span>' +
        '</span>' +
        '</div>');

    $("#baoguoAdd input").val("");
    $("#rowValue2").text("1");
    hideBottomModal();
}

$("#goodsType .tag-list span").click(function () {
    $("#goodsType .tag-list span").removeClass("active");
    $(this).addClass("active");
    $("#wupinSelect .text").text($("#goodsType .tag-list .active").text());
	hideBottomModal();

    if (myStorage.getItem("storageExpressCreateType") == 2) {
        if ($("#wupinSelect .text").text() == "文件") {
            $(".baoguo-col").hide();
        }
        else if ($("#wupinSelect .text").text() == "包裹") {
            $(".baoguo-col").show();
        }
    }


});

$("#fapiaoType .tag-list span").click(function () {
    $("#fapiaoType .tag-list span").removeClass("active");
    $(this).addClass("active");
    $("#fapiaoSelect .text").text($("#fapiaoType .tag-list .active").text());
    $("#fapiaoSelect .text").attr("data-value", $("#fapiaoType .tag-list .active").attr("data-value"));
    hideBottomModal();
});


//提交订单
function submitData() {
    if (!$("#chufa").hasClass("active")) {
        mui.toast("请选择寄件地址");
        return;
    }

    if (!$("#daoda").hasClass("active")) {
        mui.toast("请选择收件地址");
        return;
    }

    if (myStorage.getItem("storageExpressCreateType") == 3 && $(".address-tab .address-col").index($(".address-tab .active")) == 2) {
        if (!$("#daoda1").hasClass("active")) {
            mui.toast("请选择最终收件地址");
            return;
        }
    }

    if ($("#wupinSelect .text").text() == "请选择") {
        mui.toast("请选择物品类型");
        return;
    }

    if (myStorage.getItem("storageExpressCreateType") != 2) {
        if ($("#payWaySelect .text").text() == "请选择") {
            mui.toast("请选择付款方式");
            return;
        }

        if ($("#baojiaSwitch").hasClass("mui-active")) {
            if (!$("#baojiaCol input").val()) {
                mui.toast("请输入保额");
                return;
            }
        }
    }

    if ($(".yunfei-img-list .active").length == 0) {
        mui.toast("请选择快递公司");
        return;
    }

    var from_address_id = $("#chufa").attr("data-id");
    var to_address_id = $("#daoda").attr("data-id");

    var express_company_id = $(".yunfei-img-list .active").attr("data-id");
    var package = $("#wupinSelect .text").text();

    var weight = parseFloat($(".weight-value").text()).toFixed(1);

    var comment = $("#beizhuWenzi .beizhu").text();

    if (comment == "请输入备注信息") {
        comment = "";
    }

    var is_freight_collect = $("#payWaySelect .text").text();
    
    is_freight_collect = is_freight_collect == "到付" ? 1 : 0;

    var is_print = $("#is_print").hasClass("mui-active");

    var type = myStorage.getItem("storageExpressType");
	
	
    var create_type = myStorage.getItem("storageExpressCreateType");
    var insured_value = 0;

    if ($("#baojiaColInput").val()) {
        insured_value = parseFloat($("#baojiaColInput").val());
    }

    var insured_price = parseFloat($(".baofei").text());

    var paramObj = {
        from_address_id: from_address_id,
        to_address_id: to_address_id,
        express_company_id: express_company_id,
        package: package,
        weight: weight,
        comment: comment,
        is_freight_collect: is_freight_collect,
        type: type,
        create_type: create_type
    };

    paramObj.insured_value = insured_value;
    paramObj.insured_price = insured_price;
    paramObj.is_print = is_print;

    if (myStorage.getItem("storageExpressCreateType") == 3) {
        if ($(".address-tab .address-col").index($(".address-tab .active")) == 2) {
            paramObj.is_flash_send = $("#jiajiSwitch").hasClass("mui-active");
            paramObj.dest_address_id = $("#daoda1").attr("data-id");
        }
        paramObj.qc_order_type = $(".address-tab .active").attr("data-id");
    }

    if (myStorage.getItem("storageExpressCreateType") == 2 && $("#wupinSelect .text").text() == "包裹") {

        paramObj.invoice_type = $("#fapiaoSelect .text").attr("data-value");

        var package_details = [];
        $("#baoguoDetailCol .baoguo-row").each(function () {
            var package_detailsObj = {};
            package_detailsObj.name = $(this).find(".row-value1").text();
            package_detailsObj.amount = $(this).find(".row-value2").text();
            package_detailsObj.weight = $(this).find(".row-value3").text();
            package_detailsObj.value = $(this).find(".row-value4").text();
            package_detailsObj.origin = $(this).find(".row-value5").text();
            package_details.push(package_detailsObj);
        });
        paramObj.package_details = package_details;
    }

    console.log(JSON.stringify(paramObj));

    Global.commonAjax({
        url: "express/orders",
        method: "POST",
        data: paramObj
    }, function (data) {
        console.log("提交订单");
        mui.toast("提交成功");

        id = data.id;

        if (myStorage.getItem("storageExpressType") == 2) {
            
            Global.openWindow({
                    url: 'express.html',
                    id: 'express.html',
                    waiting: {
                        autoShow: false
                    }
                })
        }
        else {
        	
        	if($("#priceText").text().substr(1)>0&&is_freight_collect==0)
        	{
        		payType="express";
            	payModal($("#priceText").text().substr(1));
        	}
        	else
        	{
        		Global.openWindow({
                    url: 'express.html',
                    id: 'express.html',
                    waiting: {
                        autoShow: false
                    }
                })
        	}
        	
        }
        console.log(JSON.stringify(data));
    }, function (err) {
        console.log("提交订单失败");
        mui.toast("提交订单失败");
    });

}

function selectAddress(value) {
    var need_extra = {};
    if ((typeof tosearch !== 'undefined') && tosearch) {
        var need_extra = {
            focus: true
        }
    } else {
        var need_extra = {}
    }
    myStorage.setItem("storageSelectAddressValue", value);
    Global.openWindow({
        url: 'my_address.html',
        id: 'my_address.html',
        extras: need_extra,
        waiting: {
            autoShow: false
        }
    })

}

