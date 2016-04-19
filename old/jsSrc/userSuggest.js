/*
用户提示层
*/
define(function(require, exports, module) {
	var modTemp = require('modTemp');
	return function(layCon){

			$(layCon).on('click','[node-name="removeSearch"]',function(){
				$(this).parent().remove();
			})
			$(layCon).find('[node-name="user"]').autocomplete({
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
				        	if(json.status == 0){
					             response($.map(json.data, function(item) {
					                 return { label: item.username, value: item.uid ,img : item.avatar }
					             }));
					        }
					    }
				    });
				},
				select: function(event, ui) {
					//提交搜索...
					var obj = ui.item;
					var pre = $(this).prev();
					if($(this).prev().find('[search_id="' + obj.value + '"]').length > 0){
						$(this).val('');
						return false;
					}
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

			$(layCon).find('[node-name="user"]').on('focus',function(){
				$(this).autocomplete("search",'');
			})

	}


})