/*
	创建申请模板
	liubowen082@163.com
	2016-3-25  22:10
*/
define(function(require, exports, module) {
	var modTemp = require('modTemp')
	var modJsonToString = require('modJsonToString');
	var createFormList = require('createFormList');
	var moduleList = require('moduleList')
	var getId = require('getId');// id生成器

	// 设置编辑组件
	function setEditMod (list , index , id , data){

		$('.js_design_tab').removeClass('current').eq(index).addClass('current');
		$('[node-name="design-boxin"]').hide().eq(index).show();

		if(list && list.edit.length > 0){
			$('#designBoxin').attr('editId',id).find('div').hide();
			$(list.edit).each(function(i,a){
				$('#designBoxin .'+a).show().find('input:text').val('');
			});
			// 设置每一项的选择值
			for(var i in data){
				$('#designBoxin .js_edit_'+ i + ' input:text').val(data[i])
				if( i == 'must' || i == 'format' || i == "user_format" || i == 'notify' || i== 'data_format'){
					$('#designBoxin .js_edit_'+ i + ' input[value="'+ data[i] +'"]').click();
				}
				if(i == 'data_option'){  // 清单

					var arr = data.data_option.split('|');
					$('.js_edit_data_option').find('input:eq(0)').val(arr[0])
					$('.js_edit_data_option').find('input:eq(1)').val(arr[1])

				}
				if(i == 'select'){
					var arr = data.select.split("###");
					var len = arr.length - 1;
					var html = [];
					var flag = false;
					$(arr).each(function(i,a){
						if(a == 'othersIsOpen'){
							html.push(list.other);
							flag = true;
						}else{
							html.push(modTemp(list.option || '' ,{value : a}))
						}
						
					});
					if(!flag){
						html.push(list.other)
					}
					var el = $('#designBoxin .js_edit_'+ i).find('.form-select-option').html('')
												  .html(html.join(''));
					el.find('[add]:not(:last)').hide();

					flag && el.find('li:last').show().prev().hide();
				}

			}
			
		}

	}

	var setDomData = function(name ,val){
		var id = $('#designBoxin').attr('editid');
		
		if(name == 'select'){
			var arr= []
			$('[name="select"]:visible').each(function(i,a){
				if($(a).attr('other') == 'true')
					arr.push('othersIsOpen')  // 标记用户自定义
				else
					arr.push($(a).val())
			})
			$('#' + id).data(name,arr.join('###'))
		}else if(name == 'data_option'){
			var val = $('[name="data_option"]').eq(0).val() + '|'+ $('[name="data_option"]').eq(1).val();
			$('#' + id).data(name,val)
 
		}else{
			$('#' + id).data(name,val)
		}
	}

	$('#designBoxin').on('change','input',function(){
		setDomData($(this).attr('name'),$(this).val())
		
	})

	$('#designBoxin input[name="title"]').on('keyup',function(){
		var id = $('#designBoxin').attr('editid');
		$('#' + id).find('dt').eq(0).html($(this).val());
		// $('#' + id).data('title',$(this).val())

	})
	$('#designBoxin input[name="placeholder"]').on('keyup',function(){
		var id = $('#designBoxin').attr('editid');
		$('#' + id).find('input').val($(this).val())
		$('#' + id).find('textarea').html($(this).val())
	})

	// 清单
	$('#designBoxin input[name="data_format"]').on('click',function(){
		var id = $('#designBoxin').attr('editid');
		if($(this).val() == 'notime'){
			$('#' + id).find('input').eq(2).hide();
		}else{
			$('#' + id).find('input').eq(2).show();
		}
		
	})

	$('#designBoxin .js_edit_data_option input:text').eq(0).on('keyup',function(){
		var id = $('#designBoxin').attr('editid');
		$('#' + id).find('input').eq(1).val($(this).val());
	})
	$('#designBoxin .js_edit_data_option input:text').eq(1).on('keyup',function(){
		var id = $('#designBoxin').attr('editid');
		$('#' + id).find('.js_else').html($(this).val());
	})

	// 选项
	$('#designBoxin .js_edit_select').on('click','[add]',function(){
		var clone = $(this).parent().clone();
		var index = $(this).parent().index();
		clone.find('input:text').val('选项');
		$(this).parent().after(clone);
		$(this).hide();
		$(this).parent().parent().find('input:text').change();

		// 单项&多项
		var id = $('#designBoxin').attr('editid');
		var clone = $('#'+id).find('label:first').clone();
		clone.find('em').text('选项')
		$('#'+id).find('label').eq(index).after(clone)

	})
	$('#designBoxin .js_edit_select').on('click','[del]',function(){
		var pre = $(this).parent().prev()
		if(!$(this).next().is(':hidden')){
			pre.find('[add]').show();
		}
		var index = $(this).parent().index();
		$(this).parent().remove();
		pre.find('input:text').change();


		var id = $('#designBoxin').attr('editid');
		// 单项&多项
		 $('#'+id).find('label').eq(index).remove();
	});

	$('#designBoxin .js_edit_select').on('keyup','input:text',function(){
		var index = $(this).parent().index();
		var id = $('#designBoxin').attr('editid');
		// 单项&多项
		 $('#'+id).find('label').eq(index).find('em').html($(this).val());
	})

	//选项用户自定义
	$('#designBoxin .js_edit_select').on('click','.js_other_li',function(){
		$(this).hide().next().show();

		var id = $('#designBoxin').attr('editid');
		// 单项&多项
		$('#'+id).find('label:last').after('<label>&nbsp;其他：<input type="text" class="q-txt" disabled="true" style="width:100px"></label>');


		setDomData('select');  // 手动调用重绘数据


	})
	$('#designBoxin .js_edit_select').on('click','[hidePrec]',function(){
		$(this).parent().hide().prev().show();
		var id = $('#designBoxin').attr('editid');
		// 单项&多项
		$('#'+id).find('label:last').remove();
		setDomData('select')// 手动调用重绘数据
		return false
	})


	


	$('.js_design_tab').eq(0).on('click',function(){
		setEditMod(null,0);
		$('#designFormin .current').removeClass('current')

	})
	// 生成左侧
	$('#packageList').on('click','dl',function(){

		var rel = $(this).attr('rel');
		var id = getId();

		$('#designFormin').append(modTemp(moduleList[rel].tpl,{id:id,title : moduleList[rel].name}));


		$('#' + id).click();
		// $('div.ui-droppable').sortable('refresh')

	});

	// 左侧选中编辑
	$('#designFormin').on('click','dl',function(){
		$(this).parent().find('dl').removeClass('current')
		$(this).addClass('current');
		var rel = $(this).attr('rel');

		setEditMod(moduleList[rel], 1 , $(this).attr('id') , $(this).data())

	}).on('click','.icon-close',function(){
		$(this).parent().parent().remove();
	})


	// 保存
	var saveFormConfig = function(){

		var designFormin = $('#designFormin dl');
		var arr = [];


		designFormin.each(function(i,a){
			var _obj = $(a).data();

			_obj['input_type'] = $(a).attr('rel');

			var _arr = _obj.select ?  _obj.select.split('###') : [];
			if(_arr[_arr.length - 1] == 'othersIsOpen'){
				_obj['option_else'] = 1;
				_arr.pop();
			}
			_obj['option'] = _arr.join('###');

			delete(_obj.select);
			delete(_obj.sortableItem);

			_obj = $.extend({
			        "title": "",
			        "placeholder": "",
			        "must": "0",
			        "input_type": "",
			        "format": "",
			        "notify": "0",
			        "option": "",
			        "candel": "0",
			        "option_else": "0"
			    },_obj);

			arr.push(_obj)

		})

		return arr

	}

	var sendFormConfig = function(callback){
		var callback = callback || function(){};
		var obj = saveFormConfig();
		console.log(obj)

		var data = {
			id : GLOBAL.id,
			form_config : modJsonToString(obj)
		}

		$.ajax({

			url : '/index.php?mod=shenpi&op=index&act=process_saveConfig',
			data : data,
			catch : false,
			dataType : 'json',
			type : 'post',
			success : function(json){
				if(json.status == 0){
					callback();
				}else{
					alert(json.msg)
				}
			}
		})
	}

	$('#saveFormConfig').on('click',function(){
		sendFormConfig(function(){
			alert('保存成功')
		})
	});

	$('#saveFormConfigNext').on('click',function(){
		sendFormConfig(function(){
			window.location.href = '/index.php?mod=shenpi&op=index&act=process_step3&id=' + GLOBAL.id;
		})

	})

	$('#previewConfig').on('click',function(){
		var obj = saveFormConfig();

		var url = '/index.php?mod=shenpi&op=index&act=process_step2Preview';
		var form = $('<form>');
		form.attr('action',url).
			attr('target','_blank').
			attr('method','post').
			append('<input value="' + GLOBAL.id + '"').
			append('<input value="' + modJsonToString(obj) + '"').
			submit();

	})


// 获取模板列表
GLOBAL.tid != '' && $.ajax({
						url : '/index.php?mod=shenpi&op=index&act=process_detail',
							data : {
								id : GLOBAL.tid
							},
							catch : false,
							dataType : 'json',
							success : function(json){
								console.log(json)
								if(json.status == 0){
									var data = json.data && json.data.form_config
									data = eval('(' + data + ")")
									createFormList('#designFormin' , data);
									
								}else{
									alert('模板列表获取失败')
								}
							}

					});

if (!GLOBAL.tid || GLOBAL.tid == '') 
	createFormList([{
        "title": "申请事由",
        "placeholder": "请填写当前审批的申请事由",
        "must": "1",
        "input_type": "textMust",
        "format": "",
        "notify": "",
        "option": "",
        "option_else": "0",
        "candel": "0"
    }]);
	


// var pdsfsdf = [
//     {
//         "title": "申请事由",
//         "placeholder": "请填写当前审批的申请事由",
//         "must": "1",
//         "input_type": "textMust",
//         "format": "",
//         "notify": "",
//         "option": "",
//         "option_else": "0",
//         "candel": "0"
//     },
//     {
//         "title": "单行文本3333",
//         "placeholder": "dddd",
//         "must": "0",
//         "input_type": "text",
//         "format": "",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "多行文本",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "textarea",
//         "format": "",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "下拉菜单",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "select",
//         "format": "",
//         "notify": "0",
//         "option": "选项1###选项2",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "日期",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "date",
//         "format": "Ymd",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "时间段",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "date_between",
//         "format": "Ymd",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "清单",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "data_list",
//         "format": "time",
//         "notify": "0",
//         "option": "金额",
//         "candel": "1",
//         "option_else": "元"
//     },
//     {
//         "title": "用户选择框",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "user",
//         "format": "mulit",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "附件",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "attach",
//         "format": "",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "数字",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "number",
//         "format": "",
//         "notify": "0",
//         "option": "",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "单项选择",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "radio",
//         "format": "",
//         "notify": "0",
//         "option": "选项1###选项2",
//         "candel": "1",
//         "option_else": "0"
//     },
//     {
//         "title": "多项选择",
//         "placeholder": "",
//         "must": "0",
//         "input_type": "checkbox",
//         "format": "",
//         "notify": "0",
//         "option": "选项1###选项2",
//         "candel": "1",
//         "option_else": "1"
//     }
// ]

// createFormList(pdsfsdf);




// 注册拖拽
// $('div.ui-droppable').sortable({
// 	connectWith: '.ui-sortable',
// 	helper:"clone",
// 	// start :function(event,ui){
// 	// 	ui.helper.addClass('current')
// 	// },
// 	// stop : function(event,ui){
// 	// 	ui.helper.removeClass('current')
// 	// }
// });
temp_html = ''
$('.package-list dl').draggable({
	  	appendTo: ".design-form",
	  	helper: "clone",
	  	scroll:false,
        connectToSortable:'.design-formin',
        revert: "invalid",
        start:function(event,ui){
        	var id = getId()
        	var rel = $(ui.helper[0]).attr('rel');
        	var html = modTemp(moduleList[rel].tpl,{id:id,title : moduleList[rel].name})
        	$(ui.helper[0]).html(html);
        	$(ui.helper[0]).css({'width':'100%'});
        	temp_html = id;
        }
	});


$('.design-formin').sortable({
			  	items: "dl",
			  	revert: true,
		  		start :function(event,ui){
					ui.helper.addClass('current')
				},
			  	over:function(e,ui){
			  		
			  	},
			  	update:function(e,ui){
			  		$( this ).removeClass( "ui-state-default" );
			  	},
			  	stop : function(e,ui){
			  		if(temp_html && temp_html != ''){
			  			var html = $(ui.item[0]).html();
			  			$(ui.item[0]).after(html).remove();
			  			$('#' + temp_html).click();
			  			temp_html = ''
			  			
			  		}
			  		
			  		
			  	}
			});
$(".design-formin > dl" ).disableSelection();




})



