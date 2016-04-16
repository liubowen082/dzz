/*
	创建申请模板 -- 用户添写
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

		var value = {
			value : a.value
		}

		// radio  和 checkbox生成选项
		if(a.input_type == 'select' || a.input_type == 'radio' || a.input_type == 'checkbox'){
			var optArr = a.option.split('###');
			var option = [];
			var name = getId();
			$(optArr).each(function(i,b){
				var val = a.value ? a.value.split('###') : [];
				option.push(modTemp(temp[rel].option , {
					optionTitle : b,
					name : name,
					checked : $.inArray(b,val) >= 0 ? 'checked="checked"' : '',
					value : a.value
				}))

			})
		}

		if(a.input_type == 'date_between'){
			var valueArr = a.value ?  a.value.split('###') : [];
			value.valueStart = valueArr[0];
			value.valueEnd = valueArr[1]
		}else if(a.input_type == 'data_list'){
			// 清单
			// "value" : "清单1|100|2015-01-22###清单2|1000|2015-01-12"
			var valueArr = !a.value || a.value=='' ? [] : a.value.split('###');

			var valueStr = [];
			$(valueArr).each(function(m,n){
				var val = n.split('|');

				if(m == 0){
					valueStr.push(modTemp(temp[rel].value,{
						value1 : val[0],
						value2 : val[1],
						value3 : val[2],
						option_else : a.option_else,
						option : a.option
					}))
				}else{

					valueStr.push(modTemp(temp[rel].valueOther,{
						value1 : val[0],
						value2 : val[1],
						value3 : val[2],
						option_else : a.option_else,
						option : a.option
					}))

				}

			});
			if(valueArr.length == 0){
				valueStr.push(modTemp(temp[rel].value,{
						option_else : a.option_else,
						option : a.option
					}))
			}

			// console.log(valueStr.join(''))
			value = {
				value : valueStr.join('')
			};

		}else if(a.input_type == 'user'){
			// 人

			var val = a.value ? a.value.split('###') : [];
			var option = [];
			$(val).each(function(m,n){
				var nStr = n.split('|');
				option.push(modTemp(temp[rel].option,{
					id : nStr[0],
					name : nStr[1]
				}))
			})
			value = {
				option : option.join('')
			}
		}else if(a.input_type == "attach"){
			//附件
			var valueList = [];
			var valArr = a.value ? a.value.split('###') : [];

			$(valArr).each(function(m,n){
				var val = n.split('|');

				valueList.push(modTemp(temp[rel].value,{
						url : val[1],
						size : '',
						downUrl : val[1],
						title : val[0],
						shortTitle : val[0].replace(/^(.{5})(.*)(.{5}\..*)$/,'$1'+'...'+'$3'),
						type : val[0].replace(/.*\.(.*)/,'$1'),
						id : getId(),
						listId : getId()
					}))
			})
			value = {
				valueList : valueList.join('')
			}

		}else if(a.input_type == 'select'){
			 
				value.value = a.value || '请选择';
		}

		value = $.extend({
			id:id,
			isMust : a.must ? '<span style="color:red">*</span>' : '',
			title : a.title,
			option : $.isArray(option) ? option.join('') : a.option,
			format : 'YYYY-MM-DD hh:mm:ss' || a.format,
			option_else : a.option_else
		},value)


		$(dom).append(modTemp(temp[rel].tpl,value));
		
		// $('#' + id).data(a);
		if(a.user_format=='signle'){
			$('#' + id).remove('[node-name="removeSearch"]')
					   .remove('input')
		}

		if((a.input_type == "radio" || a.input_type == "checkbox") && a.option_else != 0 )
			$('#'+id).find('label:last').after(modTemp(temp[rel].other,value));
	});

	$(GLOBAL).trigger('onCreateSubmitFormItem')

}


var createApproval = function(dom,items,temp){
	temp = temp || moduleList;

	$(items).each(function(i,a){
		var rel = 'user';
		var id = getId();
	
		var val = a.value.split('|');
		var option = [];
		
		option.push(modTemp(temp[rel].option , {
			id : val[0],
			name : val[1]
		}))

		$(dom).append(modTemp(temp[rel].tpl,{
			id:id,
			isMust : a.require ? '<span style="color:red">*</span>' : '',
			title : a.title,
			value : a.value,
			option : option,
			allow_select : a.allow_select
			// option_else : a.option_else
		}));
		
		// $('#' + id).data(a);
		if(a.allow_select == 1){
			$('#' + id).find('[node-name="removeSearch"]').remove();
			$('#' + id).find('input').remove();

		}
		
	});

	$(GLOBAL).trigger('onCreateApproval')

}

return {
	createFormList : createFormList,
	createApproval : createApproval
}

});