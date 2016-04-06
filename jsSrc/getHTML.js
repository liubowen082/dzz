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
                    '<div class="user"><a href="#{creater_link}" uid="#{create_id}">#{creater_name}</a></div>',
                    '<div class="face">',
                        '<a href="#{creater_link}"><img src="#{creater_img}" class="img-circle"></a>',
                    '</div>',
                    '<div class="title">',
                        '<p>#{title_reason}<a href="javascript:;">&nbsp;#{title}</a></p>',
                    '</div>',
                '</div>',
                '<div class="ioffice-detail">',
                    '<div class="ioffice-info">',
                        '<div class="handle js_handle_8">',
                            '#{edit}',
                            '<a node_args="id=#{id}" node_type="del_process" href="javascript:;"><span class="ico-remove"></span>删除 </a>',
                            '<a href="#{print_link}"><span class="ico-print4"></span>打印</a>',
                        '</div>',
                        '<table class="ioffice-table">',
                            '<tbody>',
                                '<tr>',
                                    '<td class="td-title" valign="top">申请事由：</td>',
                                    '<td>离职申请</td>',
                                '</tr>',
                                '<tr>',
                                    '<td class="td-title" valign="top">离职日期：</td>',
                                    '<td>2015-07-10</td>',
                                '</tr>',
                                '<tr>',
                                    '<td class="td-title" valign="top">离职事由：</td>',
                                    '<td>个人发展</td>',
                                '</tr>',
                                '<tr>',
                                    '<td class="td-title" valign="top">离职原因：</td>',
                                    '<td>思考良久，终究还是提出离职。感触良多，非常感谢公司这么久的培养，但由于个人希望转行，所以提此辞呈，不过将会按合同执行，烦请审批。</td>',
                                '</tr>',
                                '<tr>',
                                    '<td class="td-title" valign="top">申请人：</td>',
                                    '<td>',
                                        '<a href="#/core/Profile/index?uid=40606" event-node="face_card" uid="40606">#{creater_name}</a>',
                                    '</td>',
                                '</tr>',
                                '#{approve_line}',
                            '</tbody>',
                        '</table>',
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
        var arr = [], lengthArr = [], getText = function (obj, i) {
            return modTemp(tpl, {
                agreeAndReject: (function () {
                    if (i == 0) {
                        return '<div class="handle office_status_8 status"><a href="javascript:;" class="btn btn-green" node_type="agree" node_args="status=2&amp;id=' + obj.id + '">同意</a><a href="javascript:;" class="btn btn-gray" node_type="reject" node_args="status=3&amp;id=' + obj.id + '">驳回</a></div>';
                    } else {
                        var status = {
                            0: '<span class="btn-f60">待审批</span>',
                            1: '<span class="btn-f60">待审批</span>',
                            2: '<span class="btn-390">已通过</span>',
                            3: '<span class="btn-f9">已驳回</span>',
                            4: '<span class="btn-f60">待核销</span>',
                            5: '<span class="btn-f9">已核销</span>'
                        };
                        return '<div class="handle office_status_16 status">' + status[obj.status] + '</div>';
                    }
                })(),
                create_time: obj.create_time.split(' ')[0],
                creater_link: 'http://www.baidu.com/?uid=' + obj.id,
                creater_name: obj.creater_name,
                creater_img: obj.avatar,
                title_reason: '【'+ obj.template_title + '】',
                title: obj.title,
                print_link: 'http://blkj.qimingdao.com/ioffice/Index/print_office?office_id=' + obj.id,
                create_id: obj.creater_id,
                id: obj.id,
                edit: (function () {
                    if (obj.status == 1 || obj.status == 4) {
                        return '<a target="_blank" href="http://blkj.qimingdao.com/ioffice/Index/edit?office_id=' + obj.id + '"><span class="ico-pencil2"></span>编辑</a>';
                    } else {
                        return '';
                    }
                })(),
                approve_line:(function(){
                    var approver_result = eval(obj.approver_result),arr = [];
                    $.each(approver_result, function (i, item) {
                        //' + item.remark + '
                        arr.push('<tr><td class="td-title">' + item.title + ' :</td><td><a href="#/core/Profile/index?uid=' + item.id + '" event-node="face_card" uid="' + item.id + '">&nbsp;' + item.name + '&nbsp;</a></td></tr>');
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

                    $.each(item, function (index, ele) {
                        htmls.push(getText(ele, i));
                    });
                    arr[i] = htmls.join('');
                } else {
                    arr[i] = '';
                    lengthArr[i] = 0;
                }
            }else if(type == 'manage'){
                arr.push(getText(item, i));
            }
        });

        if (type == 'manage') {
            arr = arr.join('');
            lengthArr = dataArr.length;
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
                    alert(json.msg || '请求异常请稍后再试');
                }
            },
            fail: function () {
                errCb && errCb();
            }
        });
    }

    module.exports = function (data, cb, _type) {

        type = _type || 'approve';

        var args = type == 'approve' ? $.extend(parameter, data) : data;

        getData(args, function (obj) {
            cb && cb(obj);
        }, function () {
            alert('服务端异常，请稍后重试');
        });
    }

});