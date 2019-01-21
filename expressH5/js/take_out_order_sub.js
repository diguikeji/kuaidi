mui.plusReady(function() {
				getData();
			});
		
var page=1;
function getData(page)
{
	//外卖列表
	Global.commonAjax({
            url: "deliveries?page="+page
			
    },
	function(data) {
		console.log("外卖列表");
		console.log(JSON.stringify(data));
		var html="";
		for(var i=0;i<data.data.length;i++)
		{
			html=html+'<li data-id="'+data.data[i].id+'" class=" mui-table-view-cell-item item_wrap col_between">' +
				'<div class="row_between title_wrap">' +
				'<div class="row">' +
				'<img src="'+data.data[i].logo+'">' +
				'<span>'+data.data[i].resturant_name+'</span>' +
				'</div>' +
				'<div class="row_center item_status">' +
				'<span class="dian">·</span>' +
				'<span>&nbsp;'+Config.wmStatus[data.data[i].status]+'</span>' +
				'</div>' +
				'</div>' +
				'<div class="col_between content_wrap">' +
				'<span class="name">'+data.data[i].foods+'</span>' +
				'<span class="time">送达时间：'+data.data[i].delivery_at+'</span>' +
				'</div>' +
				'</li>';
		}
		$("#list").append(html);

		if(page==1&&data.data.length==0)
		{
			$(".empty_text").show();
		}

		
	},
	function(err) {
	    console.log("外卖列表失败"+JSON.stringify(err));
	});	
}


mui("#list").on('tap', 'li ', function() {
	
	var id=$(this).attr("data-id");

		Global.openWindow({
			url:"take_out_detail.html?id="+id,
			id: "take_out_detail.html",
			waiting: {
				autoShow: false
			}
		})
	
	
});