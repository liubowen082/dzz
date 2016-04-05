/*
 * created by wangxin
 * 审批业务管理页面  2016-4-3
 */

define(function (require) {

    var getHTML = require('getHTML');
    var queryToJson = require('queryToJson');

    var mainBox = $('#mainBox'),
        senRequest = false;

    var parameter = {
        creater_id: '',
        start_time: '',
        end_time: '',
        template_id: '',
        approver_id: '',
        status: ''
    };

    function createHTML(data) {
        getHTML(data, function (obj) {
            console.log(obj);
        }, 'manage');
    }

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

    //loading导航条功能
    function initNavBar(t) {
        var navBar = $('#progress');

        $({property: 0}).animate({property: 100}, {
            duration: t || 1000,
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

    //每条数据下拉的动画功能
    function addAnimateEvt() {
        mainBox.delegate('[node_type="animateBox"]', 'click', function () {
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

    function addEvt() {
        var cache = {
            box: null,
            arrow: null
        };

        function clearCache(){
            for(var i in cache) cache[i] = null;
        }

        mainBox.find('a[node_type="selectBtn"]').click(function () {
            var target = $(this),
                arrow = target.find('span').eq(1),
                id = target.attr('show_box');

            var showBox = $('#' + id);

            if (cache.box && cache.box.attr('id') != id) {
                cache.box.hide();
                cache.arrow.removeClass('ico-angle-up').addClass('ico-angle-down');
                clearCache();
            }

            showBox.toggle();

            if (showBox.is(':hidden')) {
                clearCache();
                arrow.removeClass('ico-angle-up').addClass('ico-angle-down');
            } else {
                cache.box = showBox;
                cache.arrow = arrow;
                arrow.removeClass('ico-angle-down').addClass('ico-angle-up');
            }

            return false;
        });

        $('body').click(function () {
            cache.box && cache.box.hide();
            cache.arrow && cache.arrow.removeClass('ico-angle-up').addClass('ico-angle-down');
            clearCache();
        });

        //删除模板功能
        mainBox.delegate('a[node_type="del_process"]', 'click', function () {
            var target = $(this), args = queryToJson(target.attr('node_args'));

            ui.confirm(target, '确定要删除吗', function () {
                senRequestHandle('/index.php?mod=shenpi&op=index&act=process_delete', args, function () {
                    target.closest('.ioffice-item').remove();
                });
            });
        });

        $('a[node_type="change_type"]').click(function () {
            var target = $(this), args = queryToJson(target.attr('node_args'));

            var btnBox = $('[show_box="' + cache.box.attr('id') + '"]'),
                typeBox = btnBox.find('span').eq(0);

            cache.box.hide();
            typeBox.html(target.html());
            cache.arrow.removeClass('ico-angle-up').addClass('ico-angle-down');

            data = $.extend(parameter, args);
            createHTML(data);
        });
    }

    ~function () {
        createHTML({
            creater_id: 2,
            template_id: 8,
            approver_id: 11,
            status: 2
        });
        addEvt();
        initNavBar(1000);
        addAnimateEvt();

        $(window).resize(function () {
            $('body').triggerHandler('click');
        });
    }();
});