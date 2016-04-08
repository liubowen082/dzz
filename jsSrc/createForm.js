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
	var modTemp = require('modTemp');


	var bytesTosize = function(data){
        var unit = ["Bytes","KB","MB","GB"];
        var i = parseInt(Math.log(data)/Math.log(1024));
        return (data/Math.pow(1024,i)).toFixed(1) + " " + unit[i];
    }
	
	var _data_ = [];


	var str = '<div class="layer-window ajax_detal_layer"><a href="javascript:;" class="layer-close icon-close" event-node="close_index_ajax"></a><div class="ajax_content"><div class="ioffice-plus-wrap"><form action="http://blkj.qimingdao.com/ioffice/Do/addOffice" method="POST"><input type="hidden" name="id" value="#{id}"><div class="ioffice-plus-title">#{title}</div><div class="ioffice-plus" node-name="layer-window"></div><div class="ioffice-plus-btn"><a href="javascript:;" class="btn btn-green-big" event-node="submit_btn"><span class="js_submit_btn" node-name="js_submit_btn">创建</span></a><a href="http://blkj.qimingdao.com/ioffice/Index/index" class="btn btn-gray-big"><span>取消</span></a></div></form></div></div></div>';



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
						$(document.body).append(modTemp(str, {
							id: t.id
						}));

						var data = eval('(' + json.data.form_config + ')');

						createShowForm($(t.layCon), data, moduleShowList);
						_data_ = data;
						t.addEvent();

					} else {
						alert(json.msg)
					}
				}
			})

		},
		create: function() {
			this.get();


		},
		checkData: function(type) {
			switch (type) {
				case "text":

					break;



			}

		},
		send: function() {},
		addEvent: function() {
			var t = this;

			// 关闭
			$('.layer-window').on('click', '[event-node="close_index_ajax"]', function() {
					console.log($(this).parent())
					$(this).parent().remove();
				})
				// 提交
			$(t.layCon).on('click', '[event-node="submit_btn"]', function() {
					var dl = $(t.layCon).find('dl');
					$(dl).each(function(i, a) {
						var rel = $(a).attr('rel');
						var flag = t.checkData(rel);
						if (!flag) {
							return false;
						}
					})
				})
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
			$(t.layCon).on('click','[node-name="removeSearch"]',function(){
				$(this).parent().remove();
			})


		
			$(t.layCon).find('[node-name="user"]').autocomplete({
				// autoFocus : true,
        		scroll: true,
				disabledType : true,
				minLength : 0,
				source: function(request, response) {
				    $.ajax({
				        url: "/index.php?mod=shenpi&op=index&act=user_getList",
				        dataType: "json",
				        data: {
				            top: 10,
				            key: request.term
				        },
				        success: function(json) {
				        	console.log(json)
				        	if(json.status == 0){
					             response($.map(json.data, function(item) {
					                 return { label: item.nickname, value: item.uid ,img : item.avatar }
					             }));
					        }
					    }
				    });
				},
				select: function(event, ui) {
					//提交搜索...
					var obj = ui.item;
					var pre = $(this).prev();
					var tpl = '<li search_id="#{id}" search_name="#{name}" class="user-list"><div class="content"><span class="search-name">#{name}</div><a class="ico-remove" href="javascript:;" node-name="removeSearch"></a></li>';
					$(pre).append(modTemp(tpl, {
						name: obj.label,
						id: obj.value,
						img : obj.img,
						note : obj.note
					}))

					$(this).val('');
					return false

				},
				create: function() {
				        $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
									return $("<li></li>")
				        					.data("item.autocomplete", item)
				        					.attr('search_id',item.value)
				        					.append('<div class="face"><img src="'+item.img+'" width="20px" height="20px" /></div>')
				        					.append('<div class="content"><a href="javascript:void(0)">'+ item.label +'</a></div></li>')
										    .appendTo( ul );
								} 
				},
				focus : function(event, ui){

					$(this).val(ui.item.label)
					return false;
				},
				delay: 200
			});

			$(t.layCon).find('[node-name="user"]').on('focus',function(){
				$(this).autocomplete("search",'');
			})



			// 附件
			$(t.layCon).find('[rel="attach"]').each(function(i,a){
				var parent = this;
				var file = $(a).find('[type="file"]');
				var list = $(parent).find('[node-name="upload_list"]');
				var input = $(a).find('[node-name="input"]');
				console.log(input)

				var upload = new modUpdatePic($(file));

				$(upload).on('onProgress',function(e,result){
						console.log(11)
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

					var tpl = '<span class="qq-upload-finished"></span><a href="#{url}" event-node="feed_ajax_detail" title="#{title}" target="_blank"><span class="qq-upload-icon"><i class="qg-ico16-file ico-#{type}"></i></span></a><a class="qq-upload-delete icon-close" node-name="fileDel" li-id="'+id+'"  href="javascript:;" li-file="#{title}|#{url}"></a><span class="qq-upload-size">(#{size})</span><span class="qq-upload-file"><a href="#{url}" event-node="feed_ajax_detail" title="#{title}" target="_blank">#{shortTitle}</a></span><span class="qq-upload-download"><a href="#{downUrl}" class="icon-download" target="_blank"></a></span><span class="qq-upload-status-text"></span>';
					$('#' + id).html(modTemp(tpl,{
						url : data.path,
						size : data.size,
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
					alert(name + json.result.msg)
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
				var ss = str.replace(reg,'')
				$('#' + id).remove();
			})

			
  



			// 清单
			$(t.layCon).on('click' , '[node-name="data_list_add"]' , function(){

				var str = '<div class="data-list js_list"><input type="text" class="q-txt" placeholder="名称" style="width:150px"><input type="text" class="q-txt" placeholder="#{option}" style="width:60px" event-node="data_list_edit"><span class="vline">#{option_else}</span><div class="widget-date" model-node="date_widget_load"><input type="text" class="q-txt rcalendar_input" id="" value="" onclick="laydate()" readonly="readonly" placeholder=""><i class="icon-clock2"></i></div><span class="js_add icon-close" node-name="data_list_remove"></span></div>'

				// option="#{option}" option_else="#{option_else}"

				var option = $(this).attr('option');
				var option_else = $(this).attr('option_else');
				$(this).parent().after(modTemp(str,{
					option : option,
					option_else : option_else
				}))


			})
			$(t.layCon).on('click','[node-name="data_list_remove"]' , function(){
				$(this).parent().remove()
			});


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
							var val = $(a).data('id');
						break;
						case 'radio' : 
							var val = $(a).find('input:radio:checked').val();
						break;
						case 'checkbox':
							var arr = [];
							console.log($(a).find('input:checkbox:checked'))
							$(a).find('input:checkbox:checked').each(function(j,b){
								arr.push($(b).val())
							});
							var val = arr.join('###');
						break;
						case 'attach' : 
							var id = $(a).attr('id');
							var val = $(a).find('[node-name="input_"' + id + ']').val();
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

					var must = _data_[i].must;
					if(must == 1){
						alert(请填写+ _data_[i])
						flag = true;
						return false;
					}


					_data_[i].value = val;

				});
				if(flag){
					return;
				}

				var tm = this;
				$.ajax({
					url: '/index.php?mod=shenpi&op=index&act=application_add',
					data: {
						template_id : t.id,
						form_content : modJsonToString(_data_)
					},
					catch: false,
					dataType: 'json',
					type: 'post',
					success: function(json) {
						if (json.status == 0) {
							$(t).trigger('onSubmitSuccess',{id:t.id,data:_data_});
						} else {
							alert(json.msg)
						}
					}
				})

			})

		},
		show: function(id) {
			this.id = id;
			this.create(id);
		},
		hidden : function(){
			$('.layer-window [event-node="close_index_ajax"]').remove();
		}

	}

	return createForm;

})