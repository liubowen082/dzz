/*
	create updata
	liubowen082@163.com
	2016-3-31  19:30
*/
define(function(require, exports, module) {

	var createShowForm = require('createShowForm');
	var moduleShowList = require('moduleShowList');
	var uploadLoad = require('updataFile');
	var modJsonToString = require('modJsonToString');
	var modUpdatePic = require('modUpdatePic');
	var userSuggest = require('userSuggest');
	var modTemp = require('modTemp');


	var bytesTosize = function(data){
        var unit = ["Bytes","KB","MB","GB"];
        var i = parseInt(Math.log(data)/Math.log(1024));
        return (data/Math.pow(1024,i)).toFixed(1) + " " + unit[i];
    }
	
	var _data_ = [] , _data_A = [];


	var str = '<div class="layer-window ajax_detal_layer"><a href="javascript:;" class="layer-close icon-close" event-node="close_index_ajax"></a><div class="ajax_content"><div class="ioffice-plus-wrap"><form action="#" method="POST"><div class="ioffice-plus-title" id="createTitle"></div><div class="ioffice-plus" node-name="layer-window"></div><div class="ioffice-plus-btn"><a href="javascript:;" class="btn btn-green-big" node-name="js_submit_btn"><span class="js_submit_btn">创建</span></a><a href="javascript:;" class="btn btn-gray-big" node-name="js_close_btn"><span>取消</span></a></div></form></div></div></div>';



	var createForm = {
		layCon: '[node-name="layer-window"]',
		init: function() {},
		get: function() {
			var t = this;
			$.ajax({
				url: '/index.php?mod=shenpi&op=index&act=process_detail',
				data: {
					id: t.id
				},
				catch: false,
				dataType: 'json',
				type: 'get',
				success: function(json) {
					if (json.status == 0) {

						$('#createTitle').html(json.data.title)
						
						var data = eval('(' + json.data.form_config + ')');
						console.log(data)
						createShowForm.createFormList($(t.layCon), data, moduleShowList);

						var dataA = eval('(' + json.data.approver_config + ')');
						createShowForm.createApproval($(t.layCon), dataA, moduleShowList);

						_data_ = data;
						_data_A = dataA
						t.addEvent();

					} else {
						ui.error(json.msg)
					}
				}
			})

		},
		getSValue: function() {
			var t = this;
			$.ajax({
				url: '/index.php?mod=shenpi&op=index&act=application_detail',
				data: {
					id: t.sid
				},
				catch: false,
				dataType: 'json',
				type: 'get',
				success: function(json) {
					if (json.status == 0) {
						
						$('#createTitle').html(json.data.title)
						var data = eval('(' + json.data.form_content + ')');
						createShowForm.createFormList($(t.layCon), data, moduleShowList);

						var dataA = eval('(' + json.data.approver_result + ')');
						createShowForm.createApproval($(t.layCon), dataA, moduleShowList);

						_data_ = data;
						_data_A = dataA;
						t.addEvent();

					} else {
						ui.error(json.msg)
					}
				}
			})

		},
		// create: function(data,sid) {

			
		// },

		// checkData: function(type) {
		// 	switch (type) {
		// 		case "text":

		// 			break;



		// 	}

		// },
		send: function() {},
		addEvent: function() {
			var t = this;

			// 关闭
			$('.layer-window').on('click', '[event-node="close_index_ajax"]', function() {
					$(this).parent().remove();
					$(document.body).css('overflow-y','auto')

				})
			// 	// 提交
			// $(t.layCon).on('click', '[event-node="submit_btn"]', function() {
			// 		var dl = $(t.layCon).find('dl');
			// 		$(dl).each(function(i, a) {
			// 			var rel = $(a).attr('rel');
			// 			var flag = t.checkData(rel);
			// 			if (!flag) {
			// 				return false;
			// 			}
			// 		})
			// 	})
			// select
			$(t.layCon).on('click', '[node-name="select_div"] .btn-join', function() {
				$(this).next().toggle();
				return false;
			})

			$(t.layCon).find('[node-name="select_div"] .dropdown-menu a').on('click', function() {
				var data = $(this).data();
				var parent = $(this).parents('dl');
				parent.data(data);
				var id = parent.attr('data-hiddenid');
				$('#' + id).html(data.title)
			})

			$(window).click('click', function() {
					$(t.layCon).find('[node-name="select_div"] .dropdown-menu').hide();
				})

			// 时间
			$(t.layCon).find('[node-name="date_input"]').on('click', function() {
				var format = $(this).attr('format');
				laydate({
					istime: true,
					format: format
				})
			})

			// 人
			userSuggest(t.layCon)



			// 附件
			$(t.layCon).find('[rel="attach"]').each(function(i,a){
				var parent = this;
				var file = $(a).find('[type="file"]');
				var list = $(parent).find('[node-name="upload_list"]');
				var input = $(a).find('[node-name="input"]');

				var upload = new modUpdatePic($(file));

				$(upload).on('onProgress',function(e,result){
						var id = result.id;
						var data = result.result;
		
						if($('#'+id).length == 0){
							var tpl = '<li class="qq-upload-success" id="' + id + '"></li>';
							list.append(tpl).show();
						}
						var loaded = Math.ceil((data.loaded / data.total) * 100);
						var tpl = '<div class="qq-progress-bar" style="display: block; width: '+ loaded+'%;"></div><span class="qq-upload-spinner" style="display: inline-block;"></span><a class="qq-upload-cancel" href="javascript:;" node-name="loadDel">取消</a><span class="qq-upload-size" style="display: inline;">已完成'+ loaded +'% ，总共' + bytesTosize(data.total) +'</span><span class="qq-upload-file">'+ result.name.replace(/^(.{5})(.*)(.{5}\..*)$/,'$1'+'...'+'$3') +'</span><span class="qq-upload-status-text"></span>'
						$('#'+id).html(tpl)

				})
				$(upload).on('onLoad',function(e,json){
					var id = json.id;
					var data = json.result.data;
					
					if($('#' + id).length == 0){
						return
					} 

					var tpl = '<span class="qq-upload-finished"></span><a href="#{url}" event-node="feed_ajax_detail" title="#{title}" target="_blank"><span class="qq-upload-icon"><i class="qg-ico16-file ico-#{type}"></i></span></a><a class="qq-upload-delete icon-close" node-name="fileDel" li-id="'+id+'"  href="javascript:;" li-file="#{title}|#{url}"></a><span class="qq-upload-size">#{size}</span><span class="qq-upload-file"><a href="#{url}" event-node="feed_ajax_detail" title="#{title}" target="_blank">#{shortTitle}</a></span><span class="qq-upload-download"><a href="#{downUrl}" class="icon-download" target="_blank"></a></span><span class="qq-upload-status-text"></span>';
					$('#' + id).html(modTemp(tpl,{
						url : data.path,
						size : "(" + data.size + ')',
						downUrl : data.path,
						title : data.name,
						shortTitle : data.name.replace(/^(.{5})(.*)(.{5}\..*)$/,'$1'+'...'+'$3'),
						type : data.name.replace(/.*\.(.*)/,'$1')
					}));

					var val = input.val();
					var valss = data.name + '|' + data.path;
					if($.trim(val) == ''){
						input.val(valss);
					}else{
						input.val(val + '###' + valss);
					}
					
				})
				$(upload).on('onLoadFailure',function(e,json){
					var name = json.name;
					ui.error(name + json.result.msg)
					$('#'+json.id).remove();
					
				})


			});
			//未上传完删除
			$(t.layCon).on('click','[node-name="loadDel"]',function(){

				$(this).parent().remove();
			})

			// 上传成功后删除
			$(t.layCon).on('click','[node-name="fileDel"]',function(){
				var id = $(this).attr('li-id');
				
				var input = $(this).parentsUntil('dl').find('[node-name="input"]');
				var str = input.val();

				var delStr = $(this).attr('li-file').replace('|','\\|');
				var reg = new RegExp('(###|^)'+ delStr +'(###|$)','g')
				var ss = str.replace(reg,'');
				input.val(ss)
				$('#' + id).remove();
			})

			// 清单
			$(t.layCon).on('click' , '[node-name="data_list_add"]' , function(){

				var str = moduleShowList.data_list.valueOther;

				// option="#{option}" option_else="#{option_else}"

				var option = $(this).attr('option');
				var data_format = $(this).attr('data_format');

				var data_option = $(this).attr('data_option').split('|');
				var option_else = $(this).attr('option_else');

				$(this).parent().parent().find('.js_total').before(modTemp(str,{
					option : option,
					option_else : option_else,
					value1 : data_option[0],
					value2 : 0,
					option1 : data_option[1],
					data_format_display : data_format == 'notime' ? 'style="display:none"' : ''
				}))


			})
			$(t.layCon).on('click','[node-name="data_list_remove"]' , function(){
				var par = $(this).parent();
				var pre = par.prev();
				par.remove();
				pre.find('[node-name="data-list-num"]').blur();
			});



			$(t.layCon).on('blur','[node-name="data-list-num"]',function(){
				var parent = $(this).parent().parent();

				var list = $(parent).find('[node-name="data-list-num"]');
				var num = 0;

				$(list).each(function(i,a){
					var val = $(a).val();
					num += (Number(val) || 0)
				})
				$(parent).find('[node-name="data-list-all"]').html(num)

			});
			$(t.layCon).find('[node-name="data-list-num"]').blur();

			// 关闭
			$('[node-name="js_close_btn"]').on('click',function(){
				t.hidden();
			})

			// 保存
			$('[node-name="js_submit_btn"]').on('click',function(){

				var dl = $(t.layCon).find('dl');
				var arr = [];
				var flag = false;
				$(dl).each(function(i,a){
					var input = $(a).find('input');
					var val = input.val();

					var rel = $(a).attr('rel');

					switch(rel){
						case 'textarea' :
							var val = $(a).find('textarea').val();
						break;
						case 'select' : 
							var val = $(a).data('id') || '';
						break;
						case 'radio' : 
							var val = $(a).find('input:radio:checked').val();
							val = val || ''
						break;
						case 'checkbox':
							var arr = [];
							$(a).find('input:checkbox:checked').each(function(j,b){
								arr.push($(b).val())
							});
							var val = arr.join('###');
						break;
						case 'attach' : 
							var id = $(a).attr('id');
							var val = $(a).find('[node-name="input"]').val();
						break;
						case 'user' : 
							var ids = $(a).find('li');
							var arr = [];
							$(ids).each(function(j,b){
								var search_id = $(b).attr('search_id');
								var search_name = $(b).attr('search_name');
								arr.push(search_id + '|' + search_name)
							})
							var val = arr.join('###');
						break;
						case 'date_between' : 
							var val = input.eq(0).val() + '###' + input.eq(1).val();

						break;
						case 'data_list' :

							var ids = $(a).find('.js_list');
							var data_listArr = [];
							$(ids).each(function(j,b){
								var input = $(b).find('input');
								var _data_listArr = [];
								input.each(function(m,k){
									_data_listArr.push($(k).val())
								});
								data_listArr.push(_data_listArr.join('|'))
							})
							var val = data_listArr.join('###')

						break;
					}

					

					if(_data_[i]){
						var must = _data_[i].must;
						if(must == 1 && val == ''){
							ui.error("请填写"+ _data_[i].title)
							flag = true;
							return false;
						}
						_data_[i].value = val;
					}else{
						var must = _data_A[i-_data_.length].require;
						if(must == 1 && val == ''){
							ui.error("请填写"+ _data_A[i-_data_.length].title)
							flag = true;
							return false;
						}
						_data_A[i-_data_.length].value = val;
					}
					

				});
				if(flag){
					return;
				}

				var sendData = {
						form_content : modJsonToString(_data_),
						approver_result : modJsonToString(_data_A)
					}
				var url = '/index.php?mod=shenpi&op=index&act=application_add';
				if(t.sid){
					url = '/index.php?mod=shenpi&op=index&act=application_update';
					sendData.id = t.sid;
				}else{
					sendData.template_id = t.id
				}

				var tm = this;
				$.ajax({
					url: url,
					data: sendData,
					catch: false,
					dataType: 'json',
					type: 'post',
					success: function(json) {
						if (json.status == 0) {
							$(t).trigger('onSubmitSuccess',{id:t.id,data:_data_});
							if(t.sid) {
								setTimeout(function(){window.close();},2*1000);
							}
						} else {
							ui.error(json.msg)
						}
					}
				})

			})

		},
		show: function(id,sid,data) {
			this.id = id;
			this.sid = sid && sid !='' ? sid : null;
			if($(this.layCon).length == 0)
				$(document.body).append(str);

			if(sid && sid != ''){
				this.sid = sid;
				this.getSValue()
			}else if(data){
				$('#createTitle').html(GLOBAL.title)
				createShowForm.createFormList($(this.layCon), data, moduleShowList);
				_data_ = data;
			}else{
				this.get();
			}
			$(document.body).css('overflow-y','hidden')

		},
		hidden : function(){
			this.id = null;
			this.sid = null;
			$('.layer-window [event-node="close_index_ajax"]').click();
		}

	}

	return createForm;

})