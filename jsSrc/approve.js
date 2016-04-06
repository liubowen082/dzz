/*
 * created by wangxin
 * 审批业务首页  2016-4-2
 */

define(function (require) {

    var getHTML = require('getHTML');
    var queryToJson = require('queryToJson');
    var tpl = require('approveTpl');

    var parameter = {
        creater_id: '',
        start_time: '',
        end_time: '',
        template_id: '',
        approver_id: '',
        status: ''
    };

    var senRequest = false;

    //发送请求方法
    function senRequestHandle(url, args, cb, errrCb, type) {
        if (senRequest) {
            return false;
        }
        senRequest = true;

        $.ajax({
            url: url,
            data: args,
            dataType: type || 'json',
            success: function (json) {
                if (json.status == 0) {
                    cb && cb();
                } else {
                    alert(json.msg || '提交失败，请稍后重试');
                    errrCb && errrCb();
                }
                senRequest = false;
            },
            fail: function () {
                alert('服务端异常，请稍后重试');
                senRequest = false;
            }
        });
    }

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

    //loading导航条功能
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
            $(window).triggerHandler('resize');
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

            if (i == 2) {
                $('#office_user').show();
            }else{
                $('#office_user').hide();
            }
        });
    }

    //筛选功能(给自己挖个大坑)
    function addFilterEvt() {
        var js_filter = $('#js_filter'),
            filter_list = $('#filter_list');

        js_filter.click(function () {
            filter_list.toggle();
        });

        var office_time_drop = $('#office_time_drop'),
            office_process_drop = $('#office_process_drop'),
            office_user_drop = $('#office_user_drop'),
            timeClassify = $('#timeClassify'),
            typeClassify = $('#typeClassify'),
            userClassify = $('#userClassify');


        timeClassify.click(function () {
            var outH = timeClassify.outerHeight(),
                outW = timeClassify.outerWidth(),
                offset = timeClassify.offset();

            office_time_drop.css({
                top: offset.top + outH + 'px',
                left: offset.left - office_time_drop.width() + outW + 'px'
            });

            office_time_drop.toggle();
            if (office_time_drop.is(':hidden')) {
                timeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            } else {
                timeClassify.find('span').eq(1).removeClass('ico-angle-down').addClass('ico-angle-up');
            }
            office_process_drop.hide();
            typeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            office_user_drop.hide();
            userClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            $('#drop-navtop').hide();
            $('#create_menu').hide();
            return false;
        });

        typeClassify.click(function () {
            var outH = typeClassify.outerHeight(),
                outW = typeClassify.outerWidth(),
                offset = typeClassify.offset();

            office_process_drop.css({
                top: offset.top + outH + 'px',
                left: offset.left - office_process_drop.width() + outW + 'px'
            });

            office_process_drop.toggle();
            if (office_process_drop.is(':hidden')) {
                typeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            } else {
                typeClassify.find('span').eq(1).removeClass('ico-angle-down').addClass('ico-angle-up');
            }
            office_time_drop.hide();
            office_user_drop.hide();
            timeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            userClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            $('#drop-navtop').hide();
            $('#create_menu').hide();
            return false;
        });

        userClassify.click(function () {
            var outH = userClassify.outerHeight(),
                outW = userClassify.outerWidth(),
                offset = userClassify.offset();

            office_user_drop.css({
                top: offset.top + outH + 'px',
                left: offset.left - office_process_drop.width() + outW + 'px'
            });

            office_user_drop.toggle();
            if (office_user_drop.is(':hidden')) {
                userClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            } else {
                userClassify.find('span').eq(1).removeClass('ico-angle-down').addClass('ico-angle-up');
            }
            office_process_drop.hide();
            typeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            office_time_drop.hide();
            timeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
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
            timeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');

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
                box = $('#show_office_list');

            box.html(tpl.loading);
            $('#office_process').html(target.html());
            typeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');

            getHTML(queryToJson(data), function (data) {
                if (data.html[0]) {
                    box.html(data.html[0]);
                } else {
                    box.html(tpl.nodata);
                }
            });
        });

        office_user_drop.find('li').click(function () {
            var target = $(this),
                data = target.find('a').attr('node_data'),
                box = $('#show_office_list');

            box.html(tpl.loading);
            $('#office_user_btn').html(target.html());
            userClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');

            getHTML(queryToJson(data), function (data) {
                if (data.html[0]) {
                    box.html(data.html[0]);
                } else {
                    box.html(tpl.nodata);
                }
            });
        });
    }

    //列表内的所有操作功能，包括同意、驳回、删除等
    function addMainBoxEvt() {
        var box = $('#main_box'), approveBox = $('#approve_need_me');


        window.agree_reject_handle = function (ele) {
            var target = $(ele), args = queryToJson(target.attr('arg'));
            var office_tips = $('#office_tips'), v = $.trim(office_tips.val());

            if (v == '') {
                alert('请添加详细说明');
                return false;
            }

            if (target.attr('loading') == 'true') {
                return false;
            }
            target.attr('loading', 'true');

            args.remark = v;

            senRequestHandle('/index.php?mod=shenpi&op=index&act=application_approve', args, function () {
                target.attr('loading', 'false');
                ele.parent().replaceWith(tpl.approve(args.stauts == 2 ? '待审批' : '已驳回'));
                ui.box.close();
            }, function () {
                ui.box.close();
                target.attr('loading', 'false');
            });
        };

        //同意功能
        approveBox.delegate('a[node_type="agree"]', 'click', function (e) {
            var target = $(e.target), args = target.attr('node_args');

            ui.box.show(tpl.agree(args));
            return false;
        });

        //驳回功能
        approveBox.delegate('a[node_type="reject"]', 'click', function (e) {
            var target = $(e.target), args = target.attr('node_args');

            ui.box.show(tpl.reject(args));
            return false;
        });

        //删除模板功能
        box.delegate('a[node_type="del_process"]', 'click', function () {
            var target = $(this), args = queryToJson(target.attr('node_args'));

            ui.confirm(target, '确定要删除吗', function () {
                senRequestHandle('/index.php?mod=shenpi&op=index&act=process_delete', args, function () {
                    target.closest('.ioffice-item').remove();
                });
            });
        });
    }

    //每条数据下拉的动画功能
    function addAnimateEvt() {
        $('#main_box').delegate('[node_type="animateBox"]', 'click', function () {
            var target = $(this), detailBox = target.next();

            if (detailBox.is(':hidden')) {
                target.addClass('open');
                target.find(".ico-angle-down").removeClass().addClass("ico-angle-up");
                detailBox.slideDown();
            } else {
                target.removeClass("open");
                target.find(".ico-angle-up").removeClass().addClass("ico-angle-down");
                detailBox.slideUp();
            }
            //关闭掉其他的
            var open = target.parent().siblings().find('.open');
            open.removeClass("open");
            open.find(".ico-angle-up").removeClass().addClass("ico-angle-down");
            open.next(".ioffice-detail").slideUp();

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
        addAnimateEvt();

        $(window).resize(function () {
            var timeClassify = $('#timeClassify'),
                typeClassify = $('#typeClassify'),
                userClassify = $('#userClassify');
            $('[node_type="layer"]').hide();
            typeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            timeClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
            userClassify.find('span').eq(1).removeClass('ico-angle-up').addClass('ico-angle-down');
        });

    }();

});