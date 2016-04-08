
/*
	前台用户添写 - 模板数据
	liubowen082@163.com
	2016-3-29 16:30
*/
define(function(require, exports, module) {


	var moduleList = {
		'textMust' : {
			'name':'申请事由',
			'tpl' : '<dl><dt>#{isMust} #{title}：</dt><dd><input type="text" class="q-txt" placeholder="请填写事由" value="#{value}"></dd></dl>'
		},
		'text' : {
			'name':'单行文本',
			'tpl' : '<dl rel="text"><dt>#{isMust} #{title||default:单行文本}</dt><dd><input type="text" class="q-txt" value="#{value}"></dd></dl>'
		},
		'textarea' : {
			'name':'多行文本',
			'tpl' : '<dl rel="textarea"><dt>#{isMust} #{title||default:多行文本}</dt><dd><textarea class="q-textarea">#{value}</textarea></dd></dl>'
		},
		'select' : {
			'name':'下拉菜单',
			'tpl' : '<dl rel="select" data-hiddenId="#{id}"><dt>#{isMust}  #{title||default:下拉菜单}</dt><dd><div class="item-rt"><div class="select-list" node-name="select_div"><div class="select-title btn-join"><span id="data10_span"><span id="#{id}">请选择</span><input type="hidden" value=""></span><i class="ico-caret-down"></i></div><div class="dropdown-menu" style="display:none;"><div class="dropdown-box">#{option}</div></div></div></div></dd></dd>',

			'option':'<a data-id="#{optionTitle}" data-title="#{optionTitle}" event-node="select_div_opt" href="javascript:;">#{optionTitle}</a>'
		},
		'date' : {
			'name':'日期',
			'tpl' : '<dl rel="date" id="#{id}"><dt>#{isMust} #{title||default:日期}</dt><dd><div class="widget-date"><input type="text" class="q-txt rcalendar_input" value="#{value}" readonly="readonly" format="#{format}" node-name="date_input"><i class="icon-clock2"></i></div></dd></dl>'
		},
		'date_between' : {
			'name':'时间段',
			'tpl' : '<dl id="#{id}" rel="date_between"><dt>#{isMust} #{title||default:时间段}</dt><dd><div class="period"><div class="widget-date" model-node="date_widget_load"><input name="data17_start" type="text" class="q-txt rcalendar_input" readonly="readonly" placeholder="" node-name="date_input" value="#{value}" format="#{format}"><i class="icon-clock2"></i></div><i class="vline">~</i><div class="widget-date" model-node="date_widget_load"><input type="text" class="q-txt rcalendar_input" readonly="readonly" placeholder="" value="#{value}" format="#{format}" node-name="date_input"><i class="icon-clock2"></i></div></div></dd></dl>'
		},
		'data_list' : { // 清单
			'name':'清单',
			'tpl' : '<dl rel="data_list" id="#{id}"><dt>#{isMust} #{title}：</dt><dd><div><div class="data-list js_list"><input type="text" class="q-txt" placeholder="名称" style="width:150px"><input type="text" class="q-txt" placeholder="#{option}" style="width:60px"><span class="vline">#{option_else}</span><div class="widget-date"><input type="text" class="q-txt rcalendar_input" id="" value="" onclick="laydate()" readonly="readonly" placeholder=""><i class="icon-clock2"></i></div><span class="icon-plus js_add" node-name="data_list_add"  option="#{option}" option_else="#{option_else}"></span></div><div class="js_total">总计：<span id="data_list_19_total">0</span>元</div></div></dd></dl>'
		},
		'user' : {
			'name':'人名输入框',
			'tpl' : '<dl id="#{id}" rel="user"><dt>#{isMust} #{title||default:人名输入框}</dt><dd><div class="qg-userlist"><div class="choose-user"><ul class="user-list"></ul><input type="text" class="q-txt" node-name="user"></div></div></dd></dl>'
		},
		'attach' : {
			'name':'附件',
			'tpl' : '<dl rel="attach" id="#{id}"><dt>#{title}：</dt><dd><div model-node="upload_widget"><div class="qq-uploader"><div class="qq-upload-drop-area" style="display:none"><span>拖动文件到此完成上传</span></div><div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;"><div class="qq-upload-text"><i class="icon-paperclip"></i><span>添加文件</span></div><div class="qq-drop-drag">或拖拽到此上传</div><input multiple="multiple" type="file" name="file" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;"></div><span class="qq-drop-processing"><span>请稍后再拖动文件...</span><span class="qq-drop-processing-spinner"></span></span></div></div><div class="qq-uploader"><ul class="qq-upload-list new-upload-list" style="display: none;"  node-name="upload_list"></ul></div><input type="hidden" value="" node-name="input"></dd></dl>'
		},
		'number' : {
			'name':'数字',
			'tpl' : '</dl><dl id="#{id}" rel="number"><dt>#{isMust} #{title||default:数字}</dt><dd><input type="text" class="q-txt" value="#{value}"></dd></dl>'
		},
		'radio' : {
			'name':'单项选择',
			'tpl' : '<dl id="#{id}" rel="radio"><dt rel="radio">#{isMust} #{title||default:单项选择}</dt><dd>#{option}</dd></dl>',
			'option':'<label><input type="radio" class="q-ck" value="#{optionTitle}" name="#{name}">#{optionTitle}</label>',
			'other':'<label>&nbsp;其他：<input type="text" class="q-txt" disabled="true" style="width:100px"></label>'
		},
		'checkbox' : {
			'name':'多项选择',
			'tpl' : '<dl id="#{id}" rel="checkbox"><dt>#{isMust} #{title||default:多项选择}</dt><dd>#{option}</dd></dl>',
			'option':'<label><input type="checkbox" class="q-ck" value="#{optionTitle}" name="#{name}">#{optionTitle}</label>',
			'other':'<label>&nbsp;其他：<input type="text" class="q-txt" disabled="true" style="width:100px"></label>'
		}
	}

	return moduleList;

});