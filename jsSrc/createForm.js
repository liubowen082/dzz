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
	var modTemp = require('modTemp');
	var _data_ = [];


	var str = '<div class="layer-window ajax_detal_layer"><a href="javascript:;" class="layer-close icon-close" event-node="close_index_ajax"></a><div class="ajax_content"><div class="ioffice-plus-wrap"><form action="http://blkj.qimingdao.com/ioffice/Do/addOffice" method="POST"><input type="hidden" name="id" value="#{id}"><div class="ioffice-plus-title">#{title}</div><div class="ioffice-plus" node-name="layer-window"></div><div class="ioffice-plus-btn"><a href="javascript:;" class="btn btn-green-big" event-node="submit_btn"><span class="js_submit_btn" node-name="js_submit_btn">创建</span></a><a href="http://blkj.qimingdao.com/ioffice/Index/index" class="btn btn-gray-big"><span>取消</span></a></div></form></div></div></div>';



	var cretaeForm = {
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
				// _renderItem : function(ul, item) {
				// 	console.log(22)
				// 	return $("<li></li>")
    //     					.data("item.autocomplete", item)
    //     					.attr('search_id',item.id)
    //     					.append('<div class="face"><img src="'+item.img+'" width="20px" height="20px" /></div>')
    //     					.append('<div class="content"><a href="javascript:void(0)">'+ item.lable +'</a><span>'+item.note+'</span></div></li>')
				// 		    .appendTo( ul );




				// 	var html = '<ul class="at-user-list">';
                                
				// },
				source: function(request, response) {
				    $.ajax({
				        url: "index.php?mod=shenpi&op=index&act=user_getList",
				        dataType: "json",
				        data: {
				            top: 10,
				            key: request.term
				        },
				        success: function(json) {
				        	if(json.status == 0){
					             response($.map(json.data, function(item) {
					                 return { label: item.name, value: item.id }
					             }));
					        }
					    }
				    });
				},
				// source: ['aa', 'bb', 'ab', 'de', 'ff'],
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


				},
				create: function() {
				        $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
									console.log(22)
									return $("<li></li>")
				        					.data("item.autocomplete", item)
				        					.attr('search_id',item.id)
				        					.append('<div class="face"><img src="'+item.img+'" width="20px" height="20px" /></div>')
				        					.append('<div class="content"><a href="javascript:void(0)">'+ item.lable +'</a><span>'+item.note+'</span></div></li>')
										    .appendTo( ul );

									var html = '<ul class="at-user-list"></ul>';
				                                
								} 
				},
				delay: 200
			});



			// 附件
			// $(t.layCon).find('[type="file"]').each(function(){

			// 	var obj = {
			// 		max_size : '',
			// 		allow_exts : '',
			// 		upload_id : '',
			// 		drop_area_id : '', 
			// 		onUploadCallback : function(){}
			// 	}
			// 	uploadLoad(obj)

			// })


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
				$(dl).each(function(i,a){
					var input = $(a).find('input');
					var val = input.val();

					var rel = $(a).attr('rel');
					switch(a.type){
						case 'select' : 
							var val = $(a).find('select').val();
						break;
						case 'radio' : 
							var val = $(a).find('input:radio:checked').val();
						break;
						case 'checkbox':
							var arr = [];
							$(a).find('input:checkbox:checked').each(function(j,b){
								arr.push($(b).val())
							});
							var val = arr.join('###');
						break;	

						break;
						case 'attach' : 

						break;
						case 'user' : 
							var ids = $(a).find('li');
							var arr = [];
							$(ids).each(function(j,b){
								var search_id = $(b).attr('search_id');
								var search_name = $(b).attr('search_name');
								arr.push(search_id + ',' + search_name)
							})
							var val = arr.join('###');
						break;
						case 'date_between' : 
							var val = input.eq(0).val() + '###' + input.eq(1).val();

						break;
						case 'data_list' :

							var ids = $(a).find('.js_list');
							var data_listArr = [];
							$(ids).each(function(j,k){
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



					_data_[i].value = val;

				});
	

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
							

						} else {
							alert(json.msg)
						}
					}
				})


			})

		},
		show: function(id, e) {
			this.id = id;
			this.create(id);

			// window.history.pushState({
			// 	title : $(e),attr('title'),
			// 	href : $(e).attr('href')
			// }, $(e).attr("title"), $(e).attr("href"));


		}



	}

	return cretaeForm;

})