/**
 * @fileoverview 图片轮播滚动
 * @version 1.0.0 | 2016-08-04 版本信息
 * @author ZhaoLi
 * @param {
 *  $wrapper: null,//滚动图片父容器
    $leftNav: null,//左滑导航
    $rightNav: null,//右滑导航
    $sliderItem: null,//滚动对象数组
    speed: 500//滚动执行动画时长
    interval: 4000//滚动间隔时间
 * }
 * @example
 * requirejs([
     '$',
     'libscroll/slider'
     ],function($, Slider){
        Slider({
            $wrapper: $('#J_sliderWrapper'),
            $sliderItem: $('#J_sliderWrapper').find('.img-wrapper'),
            $leftNav: $('#J_leftNav'),
            $rightNav: $('#J_rightNav'),
            $sliderOuter: null
        });
    });
 */
define(['$'],function($){
    function Slider (option) {
        this.opt = $.extend({
            speed: 500,
            interval: 4000
        }, option);
        this.itemLen = this.opt.$sliderItem.length;
        this.startIndex = 1;
        this.setItem();
        if (this.itemLen > 1) {
            this.t = this.autoPlay();
        }
        this.navAction();
        return this;
    }

    /**
     * 设置左右滚动按钮显示与隐藏，并对按钮添加事件
     */
    Slider.prototype.navAction = function () {
        var ts = this,
            $sliderW = ts.opt.$sliderOuter ? ts.opt.$sliderOuter : ts.opt.$wrapper;
        $sliderW.hover(function () {
            if (ts.itemLen > 1) {
                clearInterval(ts.t);
                if (ts.opt.$leftNav) {
                    ts.opt.$leftNav.show();
                }
                if (ts.opt.$rightNav) {
                    ts.opt.$rightNav.show();
                }
            }
        }, function () {
            if (ts.itemLen > 1) {
                ts.t = ts.autoPlay();
                if (ts.opt.$leftNav) {
                    ts.opt.$leftNav.hide();
                }
                if (ts.opt.$rightNav) {
                    ts.opt.$rightNav.hide();
                }
            }
        });

        ts.opt.$leftNav.hover(function () {
            clearInterval(ts.t);
            ts.opt.$leftNav.show();
        });

        ts.opt.$rightNav.hover(function () {
            clearInterval(ts.t);
            ts.opt.$rightNav.show();
        });

        ts.opt.$leftNav.on('click', function () {
            ts.leftAction();
        });

        ts.opt.$rightNav.on('click', function () {
            ts.rightAction();
        });

    };

    /**
     * 设置元素，（滚动对象的复制与滚动按钮是否需要，）
     */
    Slider.prototype.setItem = function () {
        if (this.opt.$sliderItem && this.itemLen > 1) {
            this.opt.$sliderItem.css('width', 1 / (this.itemLen + 2) * 100 + '%');
            this.opt.$wrapper.css('width', (this.itemLen + 2) * 100 + '%');
            this.opt.$sliderItem.eq(0).clone().appendTo(this.opt.$wrapper);
            this.opt.$sliderItem.eq(0).before(this.opt.$sliderItem.eq(this.itemLen - 1).clone());
            this.opt.$wrapper.css('margin-left', -100 + '%');

            if (this.opt.$leftNav) {
                this.opt.$leftNav.hide();
            }
            if (this.opt.$rightNav) {
                this.opt.$rightNav.hide();
            }
        } else {
            if (this.opt.$leftNav) {
                this.opt.$leftNav.remove();
            }
            if (this.opt.$rightNav) {
                this.opt.$rightNav.remove();
            }
        }

    };

    /**
     * 滚动动画
     */
    Slider.prototype.animation = function (left) {
        var ts = this;
        ts.opt.$wrapper.stop().animate({
            marginLeft: -ts.startIndex * 100 + '%'
        }, ts.opt.speed, function () {
            if (ts.startIndex == 0) {
                ts.startIndex = ts.itemLen;
                ts.opt.$wrapper.css('margin-left', -(ts.itemLen * 100) + '%');
                return;
            }
            if (ts.startIndex == ts.itemLen + 1) {
                ts.opt.$wrapper.css('margin-left', -100 + '%');
                ts.startIndex = 1;
            }
        });
    };

    /**
     * 滚动自动执行
     * @returns {number}
     */
    Slider.prototype.autoPlay = function () {
        var ts = this;
        return setInterval(function () {
            ts.startIndex++;
            ts.animation();
        }, 4000);
    };

    /**
     * 向左滚执行方法
     */
    Slider.prototype.leftAction = function () {
        var ts = this;
        ts.startIndex = ts.startIndex == 0 ? ts.itemLen - 1 : ts.startIndex - 1;
        ts.animation(true);
    };

    /**
     * 向右滚执行方法
     */
    Slider.prototype.rightAction = function () {
        var ts = this;
        ts.startIndex = ts.startIndex == ts.itemLen + 1 ? 1 : ts.startIndex + 1;
        ts.animation();
    };

    return Slider

});
