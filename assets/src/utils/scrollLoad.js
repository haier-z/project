/**
 * @author Zhao Li
 * @vision 2016.05.28 | 1.0.0
 * @overviews 滚动加载
 */
define([
    '$'
], function ($) {

    /**
     * 窗口滚动到底部插件
     * @constructor
     */
    function WinScroll (option) {

        var setting = $.extend(this, {
            scrollWrapper: $(window),
            lazyFn: $.noop(),
            filter: true
        }, option);

        this.scrollWrapper = setting.scrollWrapper;
        this.lazyFn = setting.lazyFn;
        this.filter = setting.filter;

        console.log(this.filter);


        // threshold, callback
        var args = Array.prototype.slice.call(arguments),
            threshold = 0,
            callback = function () {};

        $.extend({
            getWindowHeight: function () {
                return $(window).height();
            },
            getDocumentHeight: function () {
                return document.body.scrollHeight;
            },
            getDocumentScrollTop: function () {
                return $(document).scrollTop();
            }
        });

        this.timer = null;
        this.threshold = threshold;
        this.callback = callback;

        if (args.length = 1) {
            if (!isNaN(args[0])) {
                this.threshold = args[0];
            } else if ($.isFunction(args[0])) {
                this.callback = args[0];
            }
        } else if (args.length = 2){
            if (!isNaN(args[0])) {
                this.threshold = args[0];
            }
            if ($.isFunction(args[1])) {
                this.callback = args[1];
            }
        }

        this.init();
    }

    WinScroll.prototype = {
        constructor: WinScroll,
        init: function () {
            this.start();
            // 首次加载
            this.callback();
        },
        pause: function () {
            $(window).off('scroll.lazy');
        },
        start: function () {
            var ts = this;
            $(window).on('scroll.lazy', function () {
                if (ts.timer) {
                    clearTimeout(ts.timer);
                }
                ts.timer = setTimeout(function () {
                    ts.scroll.call(ts);
                }, 200);
            });
        },
        scroll: function () {
            var ts = this,
                docH = $.getDocumentHeight(),
                docScrollTop = $.getDocumentScrollTop(),
                winH = $.getWindowHeight();
            if ((ts.threshold + docScrollTop) >= docH - winH - 10) {
                ts.callback();
            }
        }
    };
    return function (option) {
            new WinScroll(option);
        }
});