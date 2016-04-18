
/*
	模板数据
	liubowen082@163.com
	2016-3-29  11:30
*/
define(function(require, exports, module) {


	var moduleList = {
		'textMust' : {
			'name':'单行文本',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="text" data-title="单行文本" data-placeholder="" data-must="0"><dt>#{title||default:单行文本}</dt><dd><input type="text" class="q-txt" disabled="true" value="#{placeholder}"></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'text' : {
			'name':'单行文本',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="text" data-title="单行文本" data-placeholder="" data-must="0"><dt>#{title||default:单行文本}</dt><dd><input type="text" class="q-txt" disabled="true" value="#{placeholder}"></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'textarea' : {
			'name':'多行文本',
			'tpl' : '<dl id="#{id}"  class="ui-draggable" rel="textarea" data-title="多行文本" data-placeholder="" data-must="0"><dt rel="textarea">#{title||default:多行文本}</dt><dd><textarea class="q-textarea" disabled="">#{placeholder}</textarea></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'select' : {
			'name':'下拉菜单',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="select" data-title="下拉菜单" data-placeholder="" data-must="0" data-option="选项"><dt rel="select">#{title||default:下拉菜单}</dt><dd><div class="select-title btn-join q-txt"><span>请选择</span><i class="ico-caret-down"></i></div></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',

			'option':'<li class="js_opt"><span><input type="radio" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value||default:选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a><a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_select']
		},
		'date' : {
			'name':'日期',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="date" data-title="日期" data-placeholder="" data-must="0" data-format="YYYY-MM-DD"><dt rel="date">#{title||default:日期}</dt><dd><input type="text" class="q-txt" disabled="" value="#{placeholder}"></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_format']
		},
		'date_between' : {
			'name':'时间段',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="date_between" data-title="时间段" data-placeholder="" data-must="0" data-format="YYYY-MM-DD"><dt rel="date_between">#{title||default:时间段}</dt><dd><input type="text" class="q-txt" style="width:100px;" disabled="" value="#{placeholder}">&nbsp;&nbsp; ~ &nbsp;&nbsp; <input type="text" class="q-txt" style="width:100px;" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must','js_edit_format']
		},
		'data_list' : { // 清单
			'name':'清单',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="data_list"  data-title="清单" data-data_format="time" data-data_option="金额|元"><dt rel="date_between">#{title||default:清单}</dt><dd><input type="text" class="q-txt" style="width:150px;" placeholder="名称" disabled="">&nbsp;&nbsp;<input type="text" class="q-txt" placeholder="金额" style="width:60px;" disabled="" value="#{value1}">&nbsp;<span class="js_else">#{value2}</span>&nbsp;&nbsp;<input type="text" class="q-txt" placeholder="时间" style="width:150px;" disabled="">&nbsp;&nbsp;<span class="ico-plus"></span><br>总计：<span class="js_else">元</span></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',
			'edit' : ['js_edit_title','js_edit_data_format','js_edit_data_option']
		},
		'user' : {
			'name':'人名输入框',
			'tpl' : '</dl><dl id="#{id}" class="ui-draggable" rel="user" data-title="人名输入框" data-placeholder="" data-must="0" data-user_format="mulit" data-notify="0"><dt rel="user">#{title||default:人名输入框}</dt><dd><input type="text" class="q-txt" disabled=""></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_user_format' , 'js_edit_notify']
		},
		'attach' : {
			'name':'附件',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="attach" data-title="附件" data-placeholder="" data-must="0"><dt rel="attach">#{title||default:附件}</dt><dd><div class="design-file-preview"><i class="icon-paperclip">附件</i><span></span>或拖拽到此上传</div></dd><dd><a class="icon-close" href="javascript:;"></a></dd>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'number' : {
			'name':'数字',
			'tpl' : '</dl><dl id="#{id}" class="ui-draggable" rel="number" data-title="数字" data-placeholder="" data-must="0"><dt rel="number">#{title||default:数字}</dt><dd><input type="text" class="q-txt" disabled="" value="#{placeholder}"></dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must']
		},
		'radio' : {
			'name':'单项选择',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="radio" data-title="单项选择" data-placeholder="" data-must="0" data-option="选项"><dt rel="radio">#{title||default:单项选择}</dt><dd>#{option}</dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'optionTpl' : '<label><span><input type="radio" class="q-ck" disabled=""></span><em>#{title}</em></label>',
			'option':'<li class="js_opt"><span><input type="radio" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value||default:选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a> <a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'other':'',
			//<li class="js_other_li"><span class="add-other-select js_select_other">添加其他选项</span></li><li class="js_other" style="display:none"><span>其他：</span><input type="text" disabled="true" placeholder="用户自由填写其他内容" class="q-txt" name="select" other="true"><a href="javascript:;" class="ico-minus-sign" hidePrec></a></li>
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_select']
		},
		'checkbox' : {
			'name':'多项选择',
			'tpl' : '<dl id="#{id}" class="ui-draggable" rel="checkbox" data-title="多项选择" data-placeholder="" data-must="0" data-option="选项"><dt rel="checkbox">#{title||default:多项选择}</dt><dd>#{option}</dd><dd><a class="icon-close" href="javascript:;"></a></dd></dl>',
			'optionTpl' : '<label><span><input type="checkbox" class="q-ck" disabled=""></span><em>#{title}</em></label>',
			'option':'<li class="js_opt"><span><input type="checkbox" checked="checked" class="q-ck" disabled="true"></span><input type="text" value="#{value||default:选项}" class="q-txt" name="select"><a href="javascript:;" class="ico-minus-sign" del></a> <a href="javascript:;" class="ico-plus-sign" add></a></li>',
			'other':'',
			//'<li class="js_other_li"><span class="add-other-select js_select_other">添加其他选项</span></li><li class="js_other" style="display:none"><span>其他：</span><input type="text" disabled="true" placeholder="用户自由填写其他内容" class="q-txt" name="select" other="true"><a href="javascript:;" class="ico-minus-sign" hidePrec></a></li>'
			'edit' : ['js_edit_title','js_edit_placeholder','js_edit_must' , 'js_edit_select']
		}
	}

	return moduleList;

});