
define(function (require) {

	var userSuggest = require('userSuggest');
	window.managerAdd = managerAdd;
	
	function getUserTpl(id, name) {
    	var tpl = ''
		+'<div class="custom-item custom-item-avatar">'
		+'	<dl>'
		+'		<dt class="title">'
		+'			<h4>' + name + '</h4>'
		+'			<a href="javascript:;" class="icon-close icon-close-avatar" data-id="1"></a>'
		+'		</dt>'
		+'		<dd class="txt">'
		+'			<img alt="" src="http://114.215.157.142:8024/avatar.php?uid='+ id +'&size=large">'
		+'		</dd>'
		+'	</dl>'
		+'</div>'
		+'';
    	
    	return tpl;
    }
	
	function getBoxTpl() {
    	var tpl = ''
    	+'	<div class="qg-userlist">'
    	+'		<div class="choose-user choose-user-checker">'
    	+'			<ul model-node="search_list" class="user-list">'
    	+'			</ul>'
    	+'			<input type="text" id="search_ids_check_uid" class="q-txt" node-name="user" placeholder="请选择管理人员" >'
    	+'		</div>'
    	+'	</div>'
    	+'';
    	
    	tpl = ''
    	+'<div class="M-content">'
    	+'	<div class="hd">'
    	+'		<a href="javascript:;" class="icon-close" onclick="ui.box.close();"></a>'
    	+'		<div class="M-title">添加管理员</div>'
    	+'	</div>'
    	+'	<div id="layer-content" class="bd">'
    	+'		<div class="pop-leave">'
    	+			tpl
    	+'			<div class="action clearfix">'
    	+'				<a href="javascript:;" onclick="window.managerAdd()" class="btn btn-green mr10" id="a-submit-add"><span>提交</span></a>'
    	+'				<a onclick="ui.box.close();" href="javascript:" class="btn btn-gray"><span>取消</span></a>'
    	+'			</div>'
    	+'		</div>'
    	+'	</div>'
    	+'</div>'
    	+'';
    	return tpl;
    }
	
	function init() {
		$('.custom-plus').click(function() {
			ui.box.show(getBoxTpl());
			userSuggest($('.choose-user'));
			$('.ui-autocomplete').css('z-index', '9999999');
		});
		$('.icon-close-avatar').click(function() {
			var id = $(this).attr("data-id");
			managerDelete(id);
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
                    errrCb && errrCb(json.msg);
                }
            },
            fail: function () {
                ui.error('服务端异常，请稍后重试');
                senRequest = false;
            }
        });
    }
	
	function managerAdd() {
		var userList = $('.user-list li.user-list');
		var liLength = userList.length;
		var users = '';
		for(var i = 0; i < liLength; i++){
			users += $(userList[i]).attr('search_id');
			users += '|';   
        }  

		senRequestHandle('/index.php?mod=shenpi&op=index&act=manager_add',
			{users:users},
			function (result) {
				window.location.href = '/index.php?mod=shenpi&op=index&act=manager_index';
			},
			function (errrMsg) {
				ui.error(errrMsg);
			}
		);
	}

	function managerDelete(id) {
		
		senRequestHandle('/index.php?mod=shenpi&op=index&act=manager_delete',
			{id:id},
			function (result) {
				var currentItem = "#div-custom-item-" + id;
				$(currentItem).hide();
			},
			function (errrMsg) {
				ui.error(errrMsg);
			}
		);
	}
	~function () {
		init();

    }();

});