
define(function (require) {
	
	window.processAdd = processAdd;
	window.processUpdate = processUpdate;
	window.processStop = processStop;
	window.processStart = processStart;
	window.processDelete = processDelete;
		
    function getTpl(id, title) {
		var clickEvent = 'window.processAdd()';
		var title = title;
    	if (id != 0) {
    		clickEvent = 'window.processUpdate(' + id +')';
    	}
    	var tpl = '<div class="M-content"><div class="hd"><a href="javascript:;" class="icon-close" onclick="ui.box.close();"></a><div class="M-title">创建新的审批模版</div></div><div id="layer-content" class="bd"><div class="pop-leave"><input type="text" placeholder="为这个模版起个名字吧" id="txt_title" class="q-txt" style="width:90%" value=' 
    				+ title + '></input><div class="action clearfix"><a href="javascript:;" onclick="' 
			    	+ clickEvent + '" class="btn btn-green mr10"><span>提交</span></a><a onclick="ui.box.close();" href="javascript:" class="btn btn-gray"><span>取消</span></a></div></div></div></div>';
    	return tpl;
    }
	
	function init() {
		$('.custom-plus').click(function() {
			ui.box.show(getTpl(0, ''));;
		});
		$('.custom-edite').click(function() {
			var id = $(this).attr("data-id");
			var title = $(this).attr("data-title");
			ui.box.show(getTpl(id, title));;
		});
		$('.custom-update').click(function() {
			var id = $(this).attr("data-id");
			window.location.href = '/index.php?mod=shenpi&op=index&act=process_step2&id=' + id;
		});
		$('.custom-stop').click(function() {
			var id = $(this).attr("data-id");
			processStop(id);
		});
		$('.custom-start').click(function() {
			var id = $(this).attr("data-id");
			processStart(id);
		});
		$('.custom-delete').click(function() {
			var id = $(this).attr("data-id");
			processDelete(id);
		});
		
	}
	
	function processAdd() {
		var title = $('#txt_title').val();
		if (title == '') {
			ui.error('请填写流程名称');
			return;
		}
		senRequestHandle('/index.php?mod=shenpi&op=index&act=process_add',
				{title:title},
				function (result) {
					window.location.href = '/index.php?mod=shenpi&op=index&act=process_step1&id=' + result.data['id'];
				},
				function (errrMsg) {
					ui.error(errrMsg);
				}
		);
	}
	
	function processUpdate(id) {
		var title = $('#txt_title').val();
		if (title == '') {
			ui.error('请填写流程名称');
			return;
		}
		senRequestHandle('/index.php?mod=shenpi&op=index&act=process_updateTitle',
				{title:title,id:id},
				function () {
					window.location.href = '/index.php?mod=shenpi&op=index&act=process_index';
				},
				function (errrMsg) {
					ui.error(errrMsg);
				}
		);
	}

	function processStop(id) {
		senRequestHandle('/index.php?mod=shenpi&op=index&act=process_stop',
				{id:id},
				function () {
					window.location.href = '/index.php?mod=shenpi&op=index&act=process_index';
				},
				function (errrMsg) {
					ui.error(errrMsg);
				}
		);
	}

	function processDelete(id) {
		senRequestHandle('/index.php?mod=shenpi&op=index&act=process_delete',
				{id:id},
				function () {
					window.location.href = '/index.php?mod=shenpi&op=index&act=process_index';
				},
				function (errrMsg) {
					ui.error(errrMsg);
				}
		);
	}
	
	function processStart(id) {
		senRequestHandle('/index.php?mod=shenpi&op=index&act=process_active',
				{id:id},
				function () {
					window.location.href = '/index.php?mod=shenpi&op=index&act=process_index';
				},
				function (errrMsg) {
					ui.error(errrMsg);
				}
		);
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
                    errrCb && errrCb(json.errrMsg);
                }
            },
            fail: function () {
                alert('服务端异常，请稍后重试');
                senRequest = false;
            }
        });
    }
	
	~function () {
		init();

    }();

});