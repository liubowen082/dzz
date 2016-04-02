/*
 * created by wangxin
 * 审批业务首页  2016-4-2
 */

define(function (require) {

    var getHTML = require('getHTML');
    var queryToJson = require('queryToJson');

    var parameter = {
        creater_id: '',
        start_time: '',
        end_time: '',
        template_id: '',
        approver_id: '',
        status: ''
    };

    var tpl = {
        nodata: '<div class="mod-empty" ><div style="height: 810px;" class="empty-table"><div class="empty-td"><i class="icon-ioffice"></i><div class="empty-txt">没有相关审批哦</div></div></div></div>',
        loading: '<div class="loading" style="text-align:center;padding:20px;"><span class="loader ico-spinner2"></span></div>',
        box:'<div class="M-content"><div class="hd"><a href="javascript:;" class="icon-close" onclick="ui.box.close();"></a><div class="M-title">同意</div></div><div id="layer-content" class="bd"><div class="pop-leave"><textarea placeholder="详细说明（选填）" id="office_tips" class="q-textarea"></textarea><div class="action clearfix"><a href="javascript:;" onclick="alert(81)" class="btn btn-green mr10"><span>同意</span></a><a onclick="ui.box.close();" href="javascript:" class="btn btn-gray"><span>取消</span></a></div></div></div></div>'
    };

    //初始换页面内容
    function createHTML() {
        getHTML({}, function (data) {
            var html = data.html, count = data.length;

            //渲染待我审批的数据
            if (html[0]) {
                var approve_need_me = $('#approve_need_me');
                approve_need_me.find('[node_type="count"]').html(count[0]);
                approve_need_me.find('[node_type="list"]').html(html[0]);
                approve_need_me.show();
            }

            if (html[1]) {
                $('#show_office_list').html(html[1]);
                $('#my_office_count').html(count[1]);
            } else {
                $('#show_office_list').html(tpl.nodata);
            }

            if (html[2]) {
                $('#my_done_count').html(count[2]);
            }
        });
    }

    //初始化导航条功能
    function initNavBar(t) {
        var navBar = $('#progress');

        $({property: 0}).animate({property: 100}, {
            duration: t,
            step: function () {
                var percentage = Math.round(this.property);

                navBar.css('width', percentage + "%");

                if (percentage == 100) {
                    //完成，清理进度条
                    navBar.addClass("done");
                }
            }
        });
    }

    //功能面板按钮
    function addNavTopEvt() {
        var navTop = $('#navTop'),
            drop_navtop = $('#drop-navtop');

        navTop.click(function () {
            drop_navtop.toggle();
            $('#create_menu').hide();
            return false;
        });
    }

    //全屏按钮
    function addFullScrEvt() {
        var fullScreenBtn = $('#fullScreen'),
            i = fullScreenBtn.find('i');

        var leftBar = $('#init_load'),
            mainBox = $('#main_box');

        fullScreenBtn.click(function () {
            if (i.hasClass('icon-contract')) {
                leftBar.removeClass('vanish');
                mainBox.removeClass('vanish');
            } else {
                leftBar.addClass('vanish');
                mainBox.addClass('vanish');
            }

            $('#navTop').toggle();
            i.toggleClass('icon-contract');
            $('#drop-navtop').hide();
            $('#office_time_drop').hide();
            $('#office_process_drop').hide();
        });
    }

    //创建申请按钮
    function addCreateBtnEvt() {
        var create_menu_btn = $('#create_menu'),
            as = create_menu_btn.find('a');

        as.click(function () {

            var target = $(this);

            //调用创建审批的方法
            alert('called method: ' + target.attr('node_type'));
            create_menu_btn.hide();

            return false;
        });

        $('#btn_create').click(function () {
            create_menu_btn.toggle();
            $('#drop-navtop').hide();
            $('#office_time_drop').hide();
            $('#office_process_drop').hide();
            return false;
        });

        $('body').click(function () {
            $('[node_type="layer"]').hide();
        });

    }

    //切换列表数据功能
    function addChangeListEvt() {
        var eles = $('h4[stype]'), box = $('#show_office_list');

        eles.click(function () {
            var target = $(this), i = target.attr('stype');

            eles.removeClass('current');
            target.addClass('current');

            box.html(tpl.loading);

            getHTML({}, function (data) {
                if (data.html[i]) {
                    box.html(data.html[i]);
                } else {
                    box.html(tpl.nodata);
                }
            });
        });
    }

    //筛选功能
    function addFilterEvt() {
        var js_filter = $('#js_filter'),
            filter_list = $('#filter_list');

        js_filter.click(function () {
            filter_list.toggle();
        });

        var office_time_drop = $('#office_time_drop'),
            office_process_drop = $('#office_process_drop'),
            timeClassify = $('#timeClassify'),
            typeClassify = $('#typeClassify');

        timeClassify.click(function () {
            timeClassify.find('.ico-angle-down').eq(0).className = 'ico-angle-up';
            office_time_drop.toggle();
            office_process_drop.hide();
            $('#drop-navtop').hide();
            $('#create_menu').hide();
            return false;
        });

        typeClassify.click(function () {
            typeClassify.find('.ico-angle-down').eq(0).className = 'ico-angle-up';
            office_process_drop.toggle();
            office_time_drop.hide();
            $('#drop-navtop').hide();
            $('#create_menu').hide();
            return false;
        });

        office_time_drop.find('li').click(function () {
            var target = $(this),
                data = target.find('a').attr('node_data'),
                box = $('#show_office_list');

            box.html(tpl.loading);
            $('#office_time').html(target.html());
            timeClassify.find('.ico-angle-up').eq(0).className = 'ico-angle-down';

            getHTML(queryToJson(data), function (data) {
                if (data.html[0]) {
                    box.html(data.html[0]);
                } else {
                    box.html(tpl.nodata);
                }
            });
        });

        office_process_drop.find('li').click(function () {
            var target = $(this),
                data = target.find('a').attr('node_data'),
                box = $('#show_office_list');;

            box.html(tpl.loading);
            $('#office_process').html(target.html());
            typeClassify.find('.ico-angle-up').eq(0).className = 'ico-angle-down';

            getHTML(queryToJson(data), function (data) {
                if (data.html[0]) {
                    box.html(data.html[0]);
                } else {
                    box.html(tpl.nodata);
                }
            });
        });

    }

    //列表内的所有操作功能，包括同意、驳回、下拉动画、删除、编辑等
    function addMainBoxEvt(){
        var box = $('#approve_need_me');

        //同意功能
        box.delegate('a[node_type="agree"]', 'click', function () {

            ui.box.show(tpl.box);
            return false;
        });

        //驳回功能
        box.delegate('a[node_type="reject"]', 'click', function () {

            ui.box.show(tpl.box);
            return false;
        });
    }

    ~function () {

        initNavBar(1000);
        createHTML();
        addCreateBtnEvt();
        addFullScrEvt();
        addNavTopEvt();
        addChangeListEvt();
        addFilterEvt();
        addMainBoxEvt();

        $(window).resize(function () {
            $('[node_type="layer"]').hide();
        });

    }();

});