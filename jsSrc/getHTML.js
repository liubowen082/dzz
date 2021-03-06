/*
 * created by wangxin
 * 审批业务获取列表数据方法  2016-4-2
 */

define(function (require, exports, module) {

    var modTemp = require('modTemp');

    var parameter = {
        creater_id: '',
        start_time: '',
        end_time: '',
        template_id: '',
        approver_id: '',
        status: ''
    };

    var url = {
        approve: '/index.php?mod=shenpi&op=index&act=application_getList',
        manage: '/index.php?mod=shenpi&op=index&act=application_manageList'
    }, type;

    var tpl = [
            '<div class="ioffice-item">',
                '<div class="ioffice-summary" node_type="animateBox" node_id="#{id}">',
                    '<div class="fold"><a href="javascript:;" class="ico-angle-down"></a></div>',
                    '#{agreeAndReject}',
                    '<div class="time">#{create_time}</div>',
                    '<div class="user"><a href="/user.php?uid=#{create_id}" uid="#{create_id}">#{creater_name}</a></div>',
                    '<div class="face">',
                        '<a href="/user.php?uid=#{create_id}"><img src="#{creater_img}" class="img-circle"></a>',
                    '</div>',
                    '<div class="title">',
                        '<p>#{title_reason}<a href="javascript:;">&nbsp;#{title}</a></p>',
                    '</div>',
                '</div>',
                '<div class="ioffice-detail">',
                    '<div class="ioffice-info">',
                        '<div class="handle js_handle_8">',
                            '#{edit}',
                            '#{del}',
                            '<a href="#{print_link}"><span class="ico-print4"></span>打印</a>',
                        '</div>',
                        '<table class="ioffice-table">',
                            '<tbody>',
                                '#{form_content}',
                                '<tr>',
                                    '<td class="td-title" valign="top">申请人：</td>',
                                    '<td>',
                                        '<a href="/user.php?uid=#{create_id}" uid="#{create_id}">#{creater_name}</a>',
                                    '</td>',
                                '</tr>',
                                '#{approve_line}',
                            '</tbody>',
                        '</table>',
                    '</div>',
                    '<div class="tab-box">',
                        '<div class="tab-box-item">',
                            '<div class="dynamic-outer">',
                                '<div class="dynamic-in">',
                                    '#{approve_time_line}',
                                    '<dl class="dynamic-list">',
                                        '<dt class="dynamic-icon"><span class="handle-plus"><i class="icon-plus"></i></span></dt>',
                                        '<dd>',
                                            '<div class="comment-bg">',
                                                '<div class="comment-name"><a href="/user.php?uid=#{create_id}">#{creater_name}</a> 创建了申请</div>',
                                                '<div class="comment-info"><div class="time">#{create_time}</div></div>',
                                            '</div>',
                                        '</dd>',
                                    '</dl>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');

    function getObjlength(o){
        var i = 0;
        for(var n in o) i += 1;
        return i;
    }

    function createHTML(dataArr) {
        var arr = [], lengthArr = [],o = {}, getText = function (obj, i) {
            return modTemp(tpl, {
                agreeAndReject: (function () {
                    if (obj.visibleBtn.approve == 1) {
                        return '<div class="handle office_status_8 status"><a href="javascript:;" class="btn btn-green" node_type="agree" node_args="status=2&amp;id=' + obj.id + '">同意</a><a href="javascript:;" class="btn btn-gray" node_type="reject" node_args="status=3&amp;id=' + obj.id + '">驳回</a></div>';
                    } else if(obj.visibleBtn.check == 1) {
                    	return '<div class="handle office_status_8 status"><a href="javascript:;" class="btn btn-green" node_type="check" node_args="status=2&amp;id=' + obj.id + '">核销</a></div>';
                    } else {
                        var status = {
                            0: '<span class="btn-f60">待审批</span>',
                            1: '<span class="btn-f60">待审批</span>',
                            2: '<span class="btn-390">已通过</span>',
                            3: '<span class="btn-f00">已驳回</span>',
                            4: '<span class="btn-f60">待核销</span>',
                            5: '<span class="btn-f9">已核销</span>'
                        };
                        return '<div class="handle office_status_16 status">' + status[obj.status] + '</div>';
                    }
                })(),
                create_time: obj.create_time,
                creater_name: obj.creater_name,
                creater_img: obj.avatar,
                title_reason: '【'+ obj.template_title + '】',
                title: obj.title,
                print_link: './index.php?mod=shenpi&op=index&act=application_printPreview&id=' + obj.id,
                create_id: obj.creater_id,
                id: obj.id,
                del:(function(){
                    if (obj.visibleBtn.del == 1) {
                        return '<a node_args="id=' + obj.id + '" node_type="del_process" href="javascript:;"><span class="ico-remove"></span>删除 </a>';
                    }else{
                        return '';
                    }
                })(),
                edit: (function () {
                    if (obj.visibleBtn.edit == 1) {
                        return '<a target="_blank" href="/index.php?mod=shenpi&op=index&act=application_edit&id=' + obj.id + '"><span class="ico-pencil2"></span>编辑</a>';
                    } else {
                        return '';
                    }
                })(),
                approve_line:(function(){
                    var approver_result = eval(obj.approver_result),arr = [];
                    $.each(approver_result, function (i, item) {
                        arr.push('<tr><td class="td-title">' + item.title + ' :</td><td><a href="/user.php?uid=' + item.id + '" event-node="face_card" uid="' + item.id + '">&nbsp;' + item.name || '空缺' + '&nbsp;</a></td></tr>');
                    });
                    return arr.join('');
                })(),
                approve_time_line:(function(){

                    var html = '<dl class="dynamic-list"><dt class="dynamic-icon">#{icon}</dt><dd><div class="comment-bg"><div class="comment-arrow"><i class="ico-arrow-left22"></i></div><div class="comment-name"><a href="#">#{name}</a>&nbsp;#{msg}</div>#{remark}<div class="comment-info"><div class="time">#{approve_time}</div></div></div></dd></dl>';

                    var approver_result = eval(obj.approver_result),arr = [];
                    approver_result.reverse();
                    $.each(approver_result,function(i,item){
                        if(item.approve_time){
                            arr.push(modTemp(html,{
                                icon:(function(){
                                    if(item.status ==2){
                                        return '<span class="handle-plus"><i class="icon-ok"></i></span>';
                                    }else if(item.status ==3){
                                        return '<span class="handle-close"><i class="icon-error"></i></span>';
                                    }
                                })(),
                                uid:item.id,
                                name:item.name,
                                msg: (function () {
                                    if (item.status == 2) {
                                        return '同意了申请' + (item.remark ? '：' + item.remark : '');
                                    } else if (item.status == 3) {
                                        return '驳回了申请' + (item.remark ? '：' + item.remark : '');
                                    }
                                })(),
                                remark:(function(){
                                    if(item.status != 2 && item.status != 3){
                                        return '<div class="comment-text">' + item.remark + '</div>';
                                    }else{
                                        return ''
                                    }
                                })(),
                                approve_time:item.approve_time
                            }));
                        }else{
                            arr.push('');
                        }
                    });
                    return arr.join('');
                })(),
                form_content:(function(){
                    var json = eval(obj.form_content),
                        arr = [];

                    $.each(json, function (i, item) {
                        if (item.value) {
                            switch (item.input_type) {
                                case 'date_between':
                                    arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + item.value.replace(/###/gi, '&nbsp;~&nbsp;') + '</td></tr>');
                                    break;
                                case 'checkbox':
                                    arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + item.value.replace(/###/gi,'，') + '</td></tr>');
                                    break;
                                case 'user':
                                    var array = item.value.split('###'),names = '';
                                    $.each(array,function(index,ele){
                                        names += ele.split('|')[1];
                                        if(index != array.length -1 ){
                                            names += '，';
                                        }
                                    });
                                    arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + names + '</td></tr>');
                                    break;
                                case'data_list':
                                    var array = item.value.split('###'),all = 0;
                                    $.each(array,function(index,ele){
                                        var $arr = ele.split('|'),price = parseInt($arr[1],10);
                                        if(index == 0){
                                            arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + ele.replace(/\|/gi,'&nbsp;') + '</td></tr>');
                                            all += price;
                                        }else{
                                            arr.push('<tr><td class="td-title" valign="top"</td><td>' + ele.replace(/\|/gi,'&nbsp;') + '</td></tr>');
                                            all += price;
                                        }

                                        if (index == array.length - 1 && index != 0) {
                                            arr.push('<tr><td class="td-title" valign="top"</td><td>总计：' + all + '元</td></tr>');
                                        }
                                    });

                                    break;
                                case 'attach':
                                    var array= item.value.split('###'),html = '';
                                    $.each(array,function(index,ele){
                                        var s = ele.split('|');
                                        html += '<a href="'+s[1]+'">'+s[0]+'</a>';
                                        if(index != array.length -1 ){
                                            html += '，';
                                        }
                                    });
                                    arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + html + '</td></tr>');
                                    break;
                                default :
                                    arr.push('<tr><td class="td-title" valign="top">' + item.title + '：</td><td>' + item.value + '</td></tr>');
                                    break;
                            }
                        }
                    });

                    return arr.join('');
                })()
            });
        };

        $.each(dataArr, function (i, item) {
            if(type == 'approve'){
                if (item) {
                    var htmls = [];
                    if(Object.prototype.toString.call(item) === '[object Object]'){
                        lengthArr[i] = getObjlength(item);
                    }else{
                        lengthArr[i] = item.length;
                    }

                    if(i <3){
                        $.each(item, function (index, ele) {
                            htmls.push(getText(ele, i));
                        });
                        arr[i] = htmls.join('');
                    }else if(i == 3){
                        arr[i] = item;
                    }
                } else {
                    arr[i] = '';
                    lengthArr[i] = 0;
                }
            } else if (type == 'manage') {
                if (i == 'application_list') {
                    var htmls = [];
                    $.each(item, function (index, ele) {
                        htmls.push(getText(ele, i));
                    });
                    o[i] = htmls.join('');
                } else {
                    o[i] = item;
                }
            }
        });

        if (type == 'manage') {
            arr = o;
            lengthArr = dataArr.application_list.length;
        }

        return {
            html: arr,
            length: lengthArr
        };
    }

    function getData(data, cb, errCb) {
        $.ajax({
            url: url[type],
            data: data,
            dataType: 'json',
            success: function (json) {
                if (json.status == 0) {
                    cb && cb(createHTML(json.data));
                } else {
                    ui.error(json.msg || '请求异常请稍后再试');
                }
            },
            fail: function () {
                errCb && errCb();
            }
        });
    }

    module.exports = function (data, cb, _type, getArgs) {

        type = _type || 'approve';

        if(data == 'del creater_id'){
            parameter.creater_id = '';
            var args = parameter;
        }else{
            var args = type == 'approve' ? $.extend(parameter, data) : data;
        }

        getArgs && getArgs(args);

        getData(args, function (obj) {
            cb && cb(obj);
        }, function () {
            ui.error('服务端异常，请稍后重试');
        });
    }

});