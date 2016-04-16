/*
	创建申请模板
	liubowen082@163.com
	2016-3-25  22:10
*/
define(function(require, exports, module) {
var moduleList = require('moduleList');
var modTemp = require('modTemp');
var getId = require('getId');// id生成器

var createFormList = function(dom,items,temp){
	temp = temp || moduleList;

	$(items).each(function(i,a){
		var rel = a.input_type;
		var id = getId();
		
		if(a.option_else != 0 ){
			a.select = a.option + '###othersIsOpen'
		}else{
			a.select = a.option
		}

		var optArr = a.option.split('###');

		delete(a.option)

		$(dom).append(modTemp(temp[rel].tpl,{id:id,title:a.title}));
		
		$('#' + id).data(a)

		// radio  和 checkbox生成选项
		if(a.input_type != 'radio' || a.input_type != 'checkbox'){
			return;
		}
		
		setTimeout(function(){
			$(optArr).each(function(i,a){
				var clone = $('#'+id).find('label:first').clone();
				clone.find('em').text(a)
				$('#'+id).find('label:last').after(clone)

			})
			if(a.option_else != 0 )
				$('#'+id).find('label:last').after('<label>&nbsp;其他：<input type="text" class="q-txt" disabled="true" style="width:100px"></label>');
		},100)
	});

	$(GLOBAL).trigger('onCreateFormItem')

}

return createFormList

});