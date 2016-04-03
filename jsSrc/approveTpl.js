/*
 * created by wangxin
 * 审批业务首页模板文件  2016-4-3
 */

define(function () {

    arguments[2].exports = {
        nodata: '<div class="mod-empty" ><div style="height: 810px;" class="empty-table"><div class="empty-td"><i class="icon-ioffice"></i><div class="empty-txt">没有相关审批哦</div></div></div></div>',
        loading: '<div class="loading" style="text-align:center;padding:20px;" id="loadMore"><span class="loader ico-spinner2"></span></div>',
        approve: function (msg) {
            return '<div class="handle office_status_16 status"><span class="btn-f60">' + msg + '</span></div>'
        },
        agree: function (arg) {
            return '<div class="M-content"><div class="hd"><a href="javascript:;" class="icon-close" onclick="ui.box.close();"></a><div class="M-title">同意</div></div><div id="layer-content" class="bd"><div class="pop-leave"><textarea placeholder="详细说明（选填）" id="office_tips" class="q-textarea"></textarea><div class="action clearfix"><a href="javascript:;" onclick="window.agree_reject_handle(this)" class="btn btn-green mr10" arg="' + arg + '"><span>同意</span></a><a onclick="ui.box.close();" href="javascript:" class="btn btn-gray"><span>取消</span></a></div></div></div></div>'
        },
        reject: function (arg) {
            return '<div class="M-content"><div class="hd"><a href="javascript:;" class="icon-close" onclick="ui.box.close();"></a><div class="M-title">驳回</div></div><div id="layer-content" class="bd"><div class="pop-leave"><textarea placeholder="详细说明（选填）" id="office_tips" class="q-textarea"></textarea><div class="action clearfix"><a href="javascript:;" onclick="window.agree_reject_handle(this)" class="btn btn-green mr10" arg="' + arg + '"><span>驳回</span></a><a onclick="ui.box.close();" href="javascript:" class="btn btn-gray"><span>取消</span></a></div></div></div></div>'
        }
    };
});