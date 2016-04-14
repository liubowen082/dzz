/*
	创建申请模板
	liubowen082@163.com
	2016-3-25  22:10
*/
define(function(require, exports, module) {
	var modTemp = require('modTemp');
	var createFormList = require('createFormList');
	var moduleList = require('moduleList')
	var tempList = null

	var createModule = function(data){
		var arr = [];
		tempList = data;
		$(data).each(function(i,a){
			arr.push(modTemp('<li data-id="#{id}" data-i="' + i + '"><a href="javascript:;">#{title}</a></li>',a));
		});

		$('#templateSide').append(arr.join(''))
		// $('#templateSide li:first').click();
	}


	// 获取模板
	$.ajax({
		url : '/index.php?mod=shenpi&op=index&act=process_getList',
		catch : false,
		dataType : 'json',
		success : function(json){
			if(json.status === 0){
				createModule(json.data)
			}else{
				alert('模板列表获取失败')
			}
		}


	});

	$('#templateSide').on('click','li',function(){
		var index = $(this).data('i');
		var id = $(this).data('id');
		if(index == -1){
			$('#templateCon').html('<div class="template-none"><h4>空白表单</h4></div>');
			GLOBAL.tid = '';
			return 
		}
		GLOBAL.tid = id;
		var data = tempList[index].form_config;
		var data = eval('(' + data + ')');
		createFormList($('#templateCon').html('') , data);
		$('#templateCon').find('.icon-close').parent().remove();
		$('#templateSide li').removeClass('current')
		$(this).addClass('current')

	});

	$('#gotoNext').on('click',function(){
		var url = $(this).attr('href') + '?id=' + GLOBAL.id + '&tid=' + GLOBAL.tid;
		$(this).attr('href' , url) 
	})


	// createModule([{"id":"8","title":"\u8bf7\u5047","form_config":"[{\"title\":\"\\u7533\\u8bf7\\u4e8b\\u7531\",\"placeholder\":\"\\u8bf7\\u586b\\u5199\\u5f53\\u524d\\u5ba1\\u6279\\u7684\\u7533\\u8bf7\\u4e8b\\u7531\",\"must\":\"1\",\"input_type\":\"text\",\"format\":\"\",\"notify\":\"\",\"option\":\"\",\"option_else\":\"0\",\"candel\":\"0\"}]","status":"1","approver_config":"","checker_id":"0","remark":"","update_time":"2016-03-27 10:36:36","create_time":"2016-03-27 10:36:36","creater_id":"1","updater_id":"1"},{"id":"9","title":"\u51fa\u5dee","form_config":"[{\"title\":\"\\u7533\\u8bf7\\u4e8b\\u7531\",\"placeholder\":\"\\u8bf7\\u586b\\u5199\\u5f53\\u524d\\u5ba1\\u6279\\u7684\\u7533\\u8bf7\\u4e8b\\u7531\",\"must\":\"1\",\"input_type\":\"text\",\"format\":\"\",\"notify\":\"\",\"option\":\"\",\"option_else\":\"0\",\"candel\":\"0\"}]","status":"1","approver_config":"","checker_id":"0","remark":"","update_time":"2016-03-27 10:36:41","create_time":"2016-03-27 10:36:41","creater_id":"1","updater_id":"1"}])




	// var createForm = require('createForm')
	// $('[event-node="ajax_detail"]').on('click',function(){


	// 	createForm.show(11,11);
	// 	// window.history.pushState({
	// 	// 		title : $(this),attr('title'),
	// 	// 		href : $(this).attr('href')
	// 	// 	}, $(e).attr("title"), $(this).attr("href"));

	// 	return false;

	// });
	// $(createForm).on('onSubmitSuccess',function(){
	// 	// do
	// 	this.hidden();
	// })

});