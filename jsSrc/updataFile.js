/*
	提交 文件
	liubowen082@163.com
	2016-3-31  19:30
*/
define(function(require, exports, module) {
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

	return  uploadLoad
})