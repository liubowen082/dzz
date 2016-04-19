/*
 * 审批项目打印页面功能
 * created by wangxin 2016-4-14
 */

define(function (require) {

    var modTemp = require('modTemp');
    var queryToJson = require('queryToJson');

    var o = (function (url) {
            var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
            var results = parse_url.exec(url);
            var that = {};
            for (var i = 0, len = names.length; i < len; i += 1) {
                that[names[i]] = results[i] || '';
            }
            return that;
        })(window.location.href), id = queryToJson(o.query).id,
        box = $('#print_box');

    function getFormContent(data) {
        var arr = [], form_content = eval(data.form_content);
        $.each(form_content, function (i, item) {
            if (item.value) {
                if (item.input_type == 'data_list') {
                    var array = item.value.split('###'), all = 0;
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:26px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;"><table class="table-data-list">');
                    $.each(array, function (index, ele) {
                        var $arr = ele.split('|'), price = parseInt($arr[1], 10);

                        arr.push('<tr><td>' + $arr[0] + '</td><td>' + price + '</td><td>' + $arr[2] + '</td></tr>');
                        all += price;
                        if (index == array.length - 1) {
                            arr.push('<tr><td colspan="3">总计：' + all + '元</td></tr>');
                        }
                    });
                    arr.push('</table></td></tr>');
                } else if (item.input_type == 'user') {
                    var array = item.value.split('###'), names = '';
                    $.each(array, function (index, ele) {
                        names += ele.split('|')[1];
                        if (index != array.length - 1) {
                            names += '，';
                        }
                    });
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;">' + names + '</td></tr>');
                } else if (item.input_type == 'attach') {
                    var array= item.value.split('###'),html = '';
                    $.each(array,function(index,ele){
                        var s = ele.split('|');
                        html += '<a href="'+s[1]+'">'+s[0]+'</a>';
                        if(index != array.length -1 ){
                            html += '，';
                        }
                    });
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;">' + html + '</td></tr>');
                } else if (item.input_type == 'checkbox') {
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;">' + item.value.replace(/###/gi, '，') + '</td></tr>');
                } else if (item.input_type == 'date_between') {
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;">' + item.value.replace(/###/gi, '&nbsp;~&nbsp;') + '</td></tr>');
                } else {
                    arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:6px 10px;width:120px;border-right:#000 solid 1px;border-bottom:#000 solid 1px;" valign="top">' + item.title + '：</td><td style="font-size:14px;line-height:18px;padding:6px 10px;border-bottom:#000 solid 1px;">' + item.value + '</td></tr>');
                }
            }
        });
        return arr.join('');
    }

    function createHTML(data) {

        var tpl = '<table align="center"><tr><td style="font-size:14px;padding:10px 0;">申请时间：#{create_time}&nbsp;&nbsp;&nbsp;&nbsp;申请人：#{create_name}</td></tr><tr><td><table width="600px" style="border:1px solid #000;" cellspacing="0" cellpadding="0"><tbody><tr><th colspan=2 style="text-align:center;background-color:#ccc;padding:10px;margin:0px;border:0px;height:30px;border-bottom:#000 solid 1px;font-size:14px;">报销申请信息</th></tr>#{form_content}<tr>#{approver_title}</tr></tbody><tfoot><tr><th colspan=2 style="text-align:center;background-color:#ccc;padding:10px;margin:0px;border:0px;height:30px;font-size:14px;border-top:#000 solid 1px;">流程记录</th></tr><tr><td style="text-align:right;font-size:14px;line-height:18px;padding:5px;">#{create_time_sub}</td><td style="font-size: 14px;line-height: 18px;padding: 5px 10px;">#{create_name}&nbsp; 创建了申请</td></tr>#{approver_result}</tfoot></table></td></tr></table>';

        var html = modTemp(tpl, {
            create_time: data.create_time,
            create_name: data.creater_name,
            create_time_sub: data.create_time.substring(0, 16),
            form_content: getFormContent(data),
            approver_result: (function () {
                var approver_result = eval(data.approver_result), arr = [];
                $.each(approver_result, function (i, item) {
                    if (item.approve_time) {
                        arr.push('<tr><td style="text-align:right;font-size:14px;line-height:18px;padding:5px;">' + item.approve_time.substring(0, 16) + '</td><td style="font-size: 14px;line-height: 18px;padding: 5px 10px;">' + item.name + '&nbsp; ' + (item.status == 2 ? '同意了申请&nbsp;' : '驳回了申请&nbsp;') + item.remark + '</td></tr>');
                    }
                });

                return arr.join('');
            })()
        });

        box.html(html);
    }

    if (id) {
        $.ajax({
            url: '/index.php?mod=shenpi&op=index&act=application_detail&id=' + id,
            dataType: 'json',
            success: function (res) {
                if (res.status == '0') {
                    createHTML(res.data);
                } else {
                    console.log(res.msg);
                }
            }
        })
    }

    window.print_office = function () {
        var oldHTML = window.document.body.innerHTML;
        var html = document.getElementById('print_box').innerHTML;
        window.document.body.innerHTML = html;
        window.print();
        window.document.body.innerHTML = oldHTML;
    }
});
