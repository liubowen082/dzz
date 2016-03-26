/*
	创建申请模板
	liubowen082@163.com
	2016-3-25  22:10
*/
define(function(require, exports, module) {
	var modTemp = require('modTemp')

	var moduleList = {
		'text' : {
			'name':'单行文本',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="text" data-title="单行文本" data-placeholder="" data-must="0"><dt>单行文本</dt><dd><input type="text" class="q-txt" disabled="true"></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'textarea' : {
			'name':'多行文本',
			'tpl' : '<dl id="#{id}"  class="ui-draggable current" rel="textarea" data-title="多行文本" data-placeholder="" data-must="0"><dt rel="textarea">多行文本</dt><dd><textarea class="q-textarea" disabled=""></textarea></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'select' : {
			'name':'下拉菜单',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="select" data-title="下拉菜单" data-placeholder="" data-must="0" data-select="选项"><dt rel="select">下拉菜单</dt><dd><div class="select-title btn-join q-txt"><span>请选择</span><i class="ico-caret-down"></i></div></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',

			'option':'<li class="js_opt"><span><input type="radio" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value||选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a><a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_select']
		},
		'date' : {
			'name':'日期',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="date" data-title="日期" data-placeholder="" data-must="0" data-format="Ymd"><dt rel="date">日期</dt><dd><input type="text" class="q-txt" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_format']
		},
		'date_between' : {
			'name':'时间段',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="date_between" data-title="时间段" data-placeholder="" data-must="0" data-format="Ymd"><dt rel="date_between">时间段</dt><dd><input type="text" class="q-txt" style="width:100px;" disabled="">&nbsp;&nbsp; ~ &nbsp;&nbsp; <input type="text" class="q-txt" style="width:100px;" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_format']
		},
		'data_list' : { // 清单
			'name':'清单',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="data_list" hash="7"><dt rel="date_between">清单</dt><dd><input type="text" class="q-txt" style="width:150px;" placeholder="名称" disabled="">&nbsp;&nbsp;<input type="text" class="q-txt" placeholder="金额" style="width:60px;" disabled="">&nbsp;<span class="js_else">元</span>&nbsp;&nbsp;<input type="text" class="q-txt" placeholder="时间" style="width:150px;" disabled="">&nbsp;&nbsp;<span class="ico-plus"></span><br>总计：<span class="js_else">元</span></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',
			'edit' : ['js_edit_title','js_edit_data_format','js_edit_data_option']
		},
		'user' : {
			'name':'人名输入框',
			'tpl' : '</dl><dl id="#{id}" class="ui-draggable current" rel="user" data-title="人名输入框" data-placeholder="" data-must="0" data-user_format="mulit" data-notify="0"><dt rel="user">人名输入框</dt><dd><input type="text" class="q-txt" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_user_format' , 'js_edit_notify']
		},
		'attach' : {
			'name':'附件',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="attach" data-title="附件" data-placeholder="" data-must="0"><dt rel="attach">附件</dt><dd><div class="design-file-preview"><i class="icon-paperclip"></i><span>添加文件</span>或拖拽到此上传</div></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'number' : {
			'name':'数字',
			'tpl' : '</dl><dl id="#{id}" class="ui-draggable current" rel="number" data-title="数字" data-placeholder="" data-must="0"><dt rel="number">数字</dt><dd><input type="text" class="q-txt" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'radio' : {
			'name':'单项选择',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="radio" data-title="单项选择" data-placeholder="" data-must="0" data-select="选项" ><dt rel="radio">单项选择</dt><dd><label><span><input type="radio" class="q-ck" disabled=""></span><em>选项</em></label></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'option':'<li class="js_opt"><span><input type="radio" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value || 选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a> <a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'other':'<li class="js_other_li"><span class="add-other-select js_select_other">添加其他选项</span></li><li class="js_other" style="display:none"><span>其他：</span><input type="text" disabled="true" placeholder="用户自由填写其他内容" class="q-txt" name="select" other="true"><a href="javascript:;" class="ico-minus-sign" hidePrec></a></li>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_select']
		},
		'checkbox' : {
			'name':'多项选择',
			'tpl' : '<dl id="#{id}" class="ui-draggable current" rel="checkbox" data-title="多项选择" data-placeholder="" data-must="0" data-select="选项"><dt rel="checkbox">多项选择</dt><dd><label><span><input type="checkbox" class="q-ck" disabled=""></span><em>选项</em></label></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'option':'<li class="js_opt"><span><input type="checkbox" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value || 选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a> <a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'other':'<li class="js_other_li"><span class="add-other-select js_select_other">添加其他选项</span></li><li class="js_other" style="display:none"><span>其他：</span><input type="text" disabled="true" placeholder="用户自由填写其他内容" class="q-txt" name="select" other="true"><a href="javascript:;" class="ico-minus-sign" hidePrec></a></li>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_select']
		}
	}

	// id生成器
	function getId (){
		return 'id'+ new Date().getTime();
	}
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
				if( i == 'must' || i == 'format' || i == "user_format" || i == 'notify'){
					$('#designBoxin .js_edit_'+ i + ' input[value="'+ data[i] +'"]').click();
				}
				if(i == 'select'){
					var arr = data.select.split("@@@@@@");
					var len = arr.length - 1;
					var html = [];
					var flag = false;
					$(arr).each(function(i,a){
						if(a == 'othersIsOpen'){
							html.push(list.other);
							flag = true;
						}else{
							html.push(modTemp(list.option,{value : a}))
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

	var setDomData = function(name){
		var id = $('#designBoxin').attr('editid');
		
		if(name == 'select'){
			var arr= []
			$('[name="select"]:visible').each(function(i,a){
				if($(a).attr('other') == 'true')
					arr.push('othersIsOpen')  // 标记用户自定义
				else
					arr.push($(a).val())
			})
			$('#' + id).data(name,arr.join('@@@@@@'))
		}else{
			$('#' + id).data(name,$(this).val())
		}
	}

	$('#designBoxin').on('change','input',function(){

		setDomData($(this).attr('name'))
		
		
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

		$('#designFormin').append(modTemp(moduleList[rel].tpl,{id:id}));


		$('#' + id).click();
	});

	// 左侧选中编辑
	$('#designFormin').on('click','dl',function(){
		$(this).parent().find('dl').removeClass('current')
		$(this).addClass('current');
		var rel = $(this).attr('rel');

		setEditMod(moduleList[rel],1 , $(this).attr('id') , $(this).data())

	}).on('click','.icon-close',function(){
		$(this).parent().parent().remove();
	})


})

