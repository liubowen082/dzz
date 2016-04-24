
define(function (require) {

	var userSuggest = require('userSuggest');
	
	window.closeDiv = function(numLevel) {
		$("#div_process_user" + numLevel).remove();
	};
	
    function getApproverTpl(numLevel) {

    	level = transfer(numLevel + '');
    	var approveTpl = 
		''
		+'<div class="process-item js_item" id="div_process_user'+ numLevel +'" hash="1">'
		+'	<dl>'
		+'		<dt class="title">'
		+'          <div class="handle"><a href="javascript:window.closeDiv('+ numLevel +');" class="icon-close delProcessUser" data-id="'+numLevel+'"></a></div>'
		+'			<h4>'+ level +'级审批</h4>'
		+'		</dt>'
		+'		<dd class="txt">'
		+'			<div class="process-title">名称：</div>'
		+'			<div class="process-input">'
		+'				<input type="hidden" name="hash['+(numLevel-1)+']" value="'+ numLevel +'">'
		+'				<input type="text" class="q-txt" value="'+ level +'级审批" name="name_process_user['+(numLevel-1)+']">'
		+'			</div>'
		+'			<div class="process-title">默认审批人：</div>'
		+'			<div class="qg-userlist">'
		+'				<div class="choose-user choose-user-approver">'
		+'					<ul class="user-list">'
		+'					</ul>'
		+'					<input type="text" class="q-txt" style="width:120px" node-name="user" placeholder="输入姓名选择审批人" user_format="signle">'
		+'				</div>'
		+'			</div>'
		+'			<div class="process-tips">'
		+'				<label>'
		+'					<input type="checkbox" class="q-ck" name="select_process_user_must['+(numLevel-1)+']" checked="checked" value="1">必填</label><br>'
		+'				<label>'
		+'					<input type="checkbox" class="q-ck" name="select_process_user['+(numLevel-1)+']" checked="checked" value="1">允许申请人自己选择审批人</label>'
		+'			</div>'
		+'		</dd>'
		+'	</dl>'
		+'</div>'
		+'';
    	return approveTpl;
    }
	
	function transfer(input) {
		var danwei = Array("", "十", "百", "千", "万", "十", "百", "千", "亿");
		var inputvalue = parseInt(input);
		var l = input.length;
		var a = new Array(l);
		var b = new Array(l);
		var result = "";
		for ( var i = 0; i < l; i++) {
			a[i] = input.substr(i, 1);
			b[i] = getchinese(a[i]);
			result += b[i] + danwei[l - i - 1];
		}
		return result;
	}
	function getchinese(input) {
		if (input == "0")
			return "零";
		else if (input == "1")
			return "一";
		else if (input == "2")
			return "二";
		else if (input == "3")
			return "三";
		else if (input == "4")
			return "四";
		else if (input == "5")
			return "五";
		else if (input == "6")
			return "六";
		else if (input == "7")
			return "七";
		else if (input == "8")
			return "八";
		else if (input == "9")
			return "九";
	}
	
	function init() {
		userSuggest($('.choose-user'));
		userSuggest($('.choose-user-checker'));
		$('.process-plus').click(function() {
			var level = $(this).attr('data-id');
			$('#div_add_process').before(getApproverTpl(level));
			$(this).attr('data-id', ++ level);
			userSuggest($('.choose-user'));
		});
		$('#a-display-checker').click(function() {
			$('.check-form').css("display","block"); 
			userSuggest($('.choose-user-checker'));
		});
		
		$('#btn-approver-save').click(function() {
			$('.choose-user-approver').each(function(){
				value = '';
				$(this).find('li').each(function () {
					value += $(this).attr('search_id') + "|" + $(this).attr('search_name') + "#";
				});
				value = value.substr(0, value.length - 1);
				$(this).append('<input type="hidden" name="approver[]" value="'+ value +'">');
			});
			
			$('.choose-user-checker').each(function(){
				value = '';
				$(this).find('li').each(function () {
					value += $(this).attr('search_id') + "|" + $(this).attr('search_name') + "#";
				});
				if (value != '') {
					value = value.substr(0, value.length - 1);
					$(this).append('<input type="hidden" name="checker[]" value="'+ value +'">');
				}
			});
			
			$('#formSaveChecker').submit();
			return false;
		});
		$('#a-process-delete').click(function() {
			var userSuggest = require('custome');
			var id = $(this).attr("data-id");
			window.processDelete(id);
		});
		
	}
	
	//发送请求方法
    function senRequestHandle(url, args, cb, errrCb, type) {
        $.ajax({
            url: url,
            data: args,
            dataType: type || 'json',
            success: function (json) {
                if (json.status == 0) {
                    cb && cb(json);
                } else {
                    errrCb && errrCb(errrMsg);
                }
                senRequest = false;
                if (cacheRequest.length != 0) {
                    senRequestHandle.apply(this, cacheRequest.shift());
                }
            },
            fail: function () {
                ui.error('服务端异常，请稍后重试');
                senRequest = false;
            }
        });
    }
	
	~function () {
		init();

    }();

});