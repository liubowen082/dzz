/*
	create updata
	liubowen082@163.com
	2016-3-31  19:30
*/
define(function(require, exports, module) {

	var createShowForm = require('createShowForm');
	var moduleShowList = require('moduleShowList');
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
				_renderItem : function(ul, item) {
					console.log(22)
					return $("<li></li>")
        					.data("item.autocomplete", item)
        					.attr('search_id',item.id)
        					.append('<div class="face"><img src="'+item.img+'" width="20px" height="20px" /></div>')
        					.append('<div class="content"><a href="javascript:void(0)">'+ item.lable +'</a><span>'+item.note+'</span></div></li>')
						    .appendTo( ul );




					var html = '<ul class="at-user-list">';
                                
				},
				// source: function(request, response) {
				//     $.ajax({
				//         url: "http://demo.com/ajax/Autocomplete.ashx",
				//         dataType: "json",
				//         data: {
				//             top: 10,
				//             key: request.term
				//         },
				//         success: function(json) {
				//         	f(json.status == 0){
				//              response($.map(json.data, function(item) {
				//                  return { label: item.name, value: item.id }
				//              }));
				//         }
				//     });
				// },
				source: ['aa', 'bb', 'ab', 'de', 'ff'],
				select: function(event, ui) {
					//提交搜索...
					var obj = ui.item;
					var pre = $(this).prev();
					var tpl = '<li search_id="#{id}" class="user-list"><div class="content"><span class="search-name">#{name}</div><a class="ico-remove" href="javascript:;" node-name="removeSearch"></a></li>';
					$(pre).append(modTemp(tpl, {
						name: obj.label,
						id: obj.value,
						img : obj.img,
						note : obj.note
					}))


				},
				delay: 200
			});


			// 附件

		    var uploadLoad = function(args) {
			    var obj = eval(args.obj);
			    var upload_id = args.upload_id;
			    var manualuploader = new qq.FineUploader({
			        element: $("#" + upload_id)[0],
			        request: {
			            endpoint: "widget/Upload/save",
			            params: {
			                attach_max_size: args.max_size,
			                allow_exts: args.allow_exts
			            }
			        },
			        validation: {
			            allowedExtensions: args.allow_exts.split(","),
			            sizeLimit: args.max_size
			        },
			        autoUpload: true,
			        text: {
			            uploadButton: '<i class="icon-paperclip"></i><span>添加文件</span>'
			        },
			        drop_area_id: args.drop_area_id,
			        callbacks: {
			            onSubmit: function(id, filename, chunkData) {
			                if ($(".new-upload-list").css("display") == "none") {
			                    $(".new-upload-list").show()
			                }
			            },
			            onUpload: function(id, filename) {
			                var func = "undefined" == typeof(obj.onUploadCallback) ? "": obj.onUploadCallback;
			                if ("function" == typeof(func)) {
			                    func(id, filename)
			                }
			            },
			            onProgress: function(id, filename, loaded, total) {
			                var file_sign = $('input[name="file_sign"]').val();
			                var arr = filename.split(".");
			                var count = arr.length;
			                var ext = arr[count - 1];
			                ext = ext.toLowerCase(ext);
			                if (file_sign == 1) {
			                    $("#file_exten_" + id).addClass("icon-" + ext + "-big")
			                } else {
			                    $("#file_exten_" + id).addClass("ico-" + ext)
			                }
			                percent = Math.round(loaded / total * 100) + "%";
			                $(".progress_precent_" + id).width(percent);
			                $("#cancel_file_" + id).bind("click", function() {
			                    manualuploader.cancel(id)
			                })
			            },
			            onComplete: function(id, filename, responseJSON) {
			                $("#manual-fine-uploader .qq-upload-success").last().find(".qq-upload-size").html(responseJSON.data.size);
			                var func = "undefined" == typeof(obj.uploadCallback) ? "": obj.uploadCallback;
			                if ("function" == typeof(func)) {
			                    func(responseJSON, id, args)
			                }
			                if (responseJSON.status == 1) {
			                    var file_extension = responseJSON.data.extension;
			                    responseJSON.data.extension = file_extension.toLowerCase();
			                    $("#manual-fine-uploader").find(".qq-uploader").find(".qq-upload-list").remove();
			                    var down_url = U("widget/Attach/down", {
			                        attach_id: responseJSON.data.attach_id
			                    });
			                    var html = "";
			                    var target_type = args.target_type != "" ? 'target="_blank"': "";
			                    html += '<li id="attach_' + responseJSON.data.attach_id + '" class="qq-upload-success" style="background:rgb(245, 245, 245)"><div class="qq-progress-bar"></div><span class="qq-upload-spinner" style="display: none;"></span><span class="qq-upload-finished"></span><a href="' + U("file/Index/fileDetail", {
			                        attach_id: responseJSON.data.attach_id
			                    }) + '" event-node="feed_ajax_detail" title="' + responseJSON.data.name + '" ' + target_type + '><span class="qq-upload-icon"><i class="qg-ico16-file ico-' + responseJSON.data.extension + '"></i></span></a><a class="qq-upload-delete icon-close" onclick="' + args.obj + ".deleteAttach(" + args.ext_id + "," + responseJSON.data.attach_id + ",'" + args.inputname + '\')" href="javascript:;"></a><span class="qq-upload-size">(' + responseJSON.data.size + ')</span><span class="qq-upload-file"><a href="' + U("file/Index/fileDetail", {
			                        attach_id: responseJSON.data.attach_id
			                    }) + '" event-node="feed_ajax_detail" title="' + responseJSON.data.name + '" ' + target_type + ">" + responseJSON.data.name + '</a></span><span class="qq-upload-download"><a href="' + down_url + '" class="icon-download"></a></span><span class="qq-upload-status-text"></span></li>';
			                    if ($(".new-upload-list").css("display") == "none") {
			                        $(".new-upload-list").show()
			                    }
			                    if ($(".new-upload-list").find("li").length > 0) {
			                        $(html).insertBefore($(".new-upload-list").find("li:first"))
			                    } else {
			                        $(".new-upload-list").html(html)
			                    }
			                    M($("#upload_list")[0])
			                }
			            },
			            onCancel: function(id, filename) {
			                $(".file_loading_" + id).remove()
			            },
			            onSubmitDelete: function(id, data) {
			                var func = "undefined" == typeof(obj.delCallback) ? "": obj.delCallback;
			                if ("function" == typeof(func)) {
			                    func(data)
			                }
			            },
			            onUploadInfo: function(result) {
			                if ("undefined" !== typeof(result.data)) {
			                    ui.error(result.data)
			                }
			            }
			        }
			    })
			};

			$(t.layCon).find('[type="file"]').each(function(){

				var obj = {
					max_size : '',
					allow_exts : '',
					upload_id : '',
					drop_area_id : '', 
					onUploadCallback : function(){}
				}



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
							var val = arr.join(',');
						break;	

						break;
						case 'attach' : 

						break;
						case 'user' : 
							var ids = $(a).find('li');
							var arr = [];
							$(ids).each(function(j,b){
								var search_id = $(b).attr('search_id');
								arr.push(search_id)
							})
							var val = arr.join(',');
						break;
						case 'date_between' : 
							var val = input.eq(0).val() + ',' + input.eq(1).val();

						break;
						case 'data_list' :

							

						break;
					}



					_data_[i].value = val;





				});


				var tm = this;
				$.ajax({
					url: '/index.php?mod=shenpi&op=index&act=process_detail',
					data: {
						id: t.id
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