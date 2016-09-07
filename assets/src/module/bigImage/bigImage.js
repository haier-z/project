/**
 * @author Zhao Li
 * @vision 1.0.0
 * @overviews 该插件九宫格为固定格式
 * 依赖于jQuery
 * 该插件九宫格为固定格式
 * @example：
 *      <div node-type="fl_pic_list">
 *           <ul>
 *            <li class="bigcursor">
 *               <img src="http://ww2.sinaimg.cn/square/a7295e45jw1ex9mmxzbkjj20go0ch3zq.jpg" data-bigPic="http://ww2.sinaimg.cn/bmiddle/a7295e45jw1ex9mmxzbkjj20go0ch3zq.jpg">
 *            </li>
 *            <li class="bigcursor">
 *               <img src="http://ww2.sinaimg.cn/square/a7295e45jw1ex9mmxzbkjj20go0ch3zq.jpg" data-bigPic="http://ww2.sinaimg.cn/bmiddle/a7295e45jw1ex9mmxzbkjj20go0ch3zq.jpg">
 *            </li>
 *        </ul>
 *    </div>
 * 弹出大图后，下面小图导航固定到大小为56*56，marginLeft = 3px
 * css兼容IE8以上以及chrome和firefox
* */
define([
    '$',
    'css!module/ui/mediaBigImage/bigImage'
], function($){

    var $loading = $('<i>', {
        'class': 'img-loading'
    });//loading

    function CreateWrapper (imgSrcArr, nowIndex, $currentImg, everyLittleImgWidth) {
        this.imgLen = imgSrcArr.length;
        this.imgSrcArr = imgSrcArr;
        this.nowIndex = nowIndex;
        this.$currentImg = $currentImg;
        this.everyLittleImgWidth = everyLittleImgWidth;
    }
    CreateWrapper.prototype.parentsWrapper = function () {//产生最外层的容器
        return $parentsWrapper = $('<div>', {
            'class': 'MED-img-wrapper'
        });
    }
    CreateWrapper.prototype.mediaDom = function () {//产生大图容器以及大图容器内的内容
        var $bigImageWrapper = $('<div>', {
            'class': 'media_show_box'
        });
        var $img = $('<img>', {
            src: $(this.$currentImg).attr('data-bigpic')
        });
        $img.prependTo($bigImageWrapper);
        return {
            '$viewImg' : $img,
            '$bigImageWrapper' : $bigImageWrapper
        }
    }

    CreateWrapper.prototype.chooseDom = function () {//产生图片选择器的选择部分容器以及内容
        var $chooseWrapper = $('<div>', {
            'class': 'pic_choose_box'
        });
        var $arrowLeft = $('<a>', {
            'class': 'arrow_small arrow_left_small',
            href: 'javascript:'
        });//向左按钮
        var $arrowLeftIcon = $('<span>', {
            'class': 'icon-font'
        }).html('&lsaquo;');//向左按钮图标
        var $arrowRight = $('<a>', {
            'class': 'arrow_small arrow_right_small',
            href: 'javascript:'
        });//向右按钮
        var $arrowRightIcon = $('<span>', {
            'class': 'icon-font'
        }).html('&rsaquo;');//向左按钮图标
        if (this.imgLen <= 1) {
            $arrowRight.addClass('arrow_dis');
        }
        $arrowLeft.append($arrowLeftIcon);
        $arrowRight.append($arrowRightIcon);
        $chooseWrapper.append($arrowLeft);
        $chooseWrapper.append($arrowRight);
        var $stageBoxWrapper = $('<div>', {
            'class': 'stage_box'
        });
        var ulWidth = this.imgLen * this.everyLittleImgWidth;
        var $ul = $('<ul>', {
            'class': 'choose_box',
            style: 'width:' + ulWidth + 'px'
        });
        var $aArr = [];
        var that = this;
        $.each(that.imgSrcArr, function (i, e) {
            var lSrc = $(e).attr('src');
            var $li = $('<li>'),
                $a = $('<a>', {
                    href: 'javascript:'
                }),
                $img = $('<img>', {
                    src: lSrc.substr(0, lSrc.length - 8) + '56/h/56',
                    alt: ''
                });
            $img.data('src', $(e).attr('data-bigpic'));
            if (i === that.nowIndex) {
                $a.addClass('current');
            }
            $img.prependTo($a);
            $aArr.push($a);
            $a.prependTo($li);
            $ul.append($li);
        });
        $ul.prependTo($stageBoxWrapper);
        $chooseWrapper.append($stageBoxWrapper);
        return {
            '$chooseWrapper' : $chooseWrapper,
            '$stageBoxWrapper' : $stageBoxWrapper,
            '$arrowLeft' : $arrowLeft,
            '$arrowRight' : $arrowRight,
            '$ul' : $ul,
            '$aArr' : $aArr
        }
    }

    function imgLoadComplete(imgSrc, callback) {
        var imgLoader = new Image();
        imgLoader.src = imgSrc;
        imgLoader.onload = function () {
            if (callback && $.isFunction(callback)) {
                callback();
            }
        }
    }


    $(document).on('click', '[node-type=fl_pic_list] .bigcursor img', function () {
        var $this = $(this),
            $wrapper = $this.parents('[node-type=fl_pic_list]'),//随实际情况改
            $m9 = $this.parents('ul'),
            imgArr = $m9.find('img'),//随实际情况改
            nowIndex = $this.parents('li').index();
        $this.parents('li').append($loading);
        var getDom = new CreateWrapper(imgArr, nowIndex, $this, 59);
        var $parentsWrapper = getDom.parentsWrapper();
        var mediaDom = getDom.mediaDom();
        $parentsWrapper.append(mediaDom.$bigImageWrapper);

        var chooseDom = getDom.chooseDom();
        $parentsWrapper.append(chooseDom.$chooseWrapper);

        $m9.hide();
        $parentsWrapper.prependTo($wrapper);

        function setUlMarginLeftAndSetArrow (index) {
            var stageWidth = chooseDom.$stageBoxWrapper.width(),
                stageHalfWidth = Math.round(stageWidth / 2),
                ulWidth = imgArr.length * 59,
                ulMarginLeft;
            if (ulWidth > stageWidth) {
                ulMarginLeft = Math.round((index + 0.5) * 59) - stageHalfWidth;
                if (ulMarginLeft > 0) {
                    if (ulWidth - ulMarginLeft < stageWidth) {
                        ulMarginLeft = ulWidth - stageWidth;
                        chooseDom.$arrowRight.addClass('arrow_dis');
                        chooseDom.$arrowLeft.removeClass('arrow_dis');
                    } else {
                        chooseDom.$arrowRight.removeClass('arrow_dis');
                        chooseDom.$arrowLeft.removeClass('arrow_dis');
                    }
                } else {
                    ulMarginLeft = 0;
                    chooseDom.$arrowLeft.addClass('arrow_dis');
                    chooseDom.$arrowRight.removeClass('arrow_dis');
                }
                //向左滑动向右滑动按钮事件绑定
                chooseDom.$arrowRight.on('click', function () {
                    var _ts = $(this),
                        _marL = 0,
                        _nowMarL = chooseDom.$ul.css('margin-left'),
                        _nowMarLLen = _nowMarL.length;
                    if (!_ts.hasClass('arrow_dis')) {
                        _marL += (parseInt(_nowMarL.substring(1, _nowMarLLen - 2) || 0) +  stageWidth);
                        if (ulWidth - _marL <= stageWidth) {
                            _marL = ulWidth - stageWidth;
                            _ts.addClass('arrow_dis');
                        }
                        chooseDom.$arrowLeft.removeClass('arrow_dis');
                        chooseDom.$ul.animate({
                            marginLeft: - _marL + 'px'
                        }, 200);
                    }
                });
                chooseDom.$arrowLeft.on('click', function () {
                    var _ts = $(this),
                        _marL = 0,
                        _nowMarL = chooseDom.$ul.css('margin-left'),
                        _nowMarLLen = _nowMarL.length;
                    if (!_ts.hasClass('arrow_dis')) {
                        _marL += (parseInt(_nowMarL.substring(1, _nowMarLLen - 2) || 0) -  stageWidth);
                        if (_marL <= 0) {
                            _marL = 0;
                            _ts.addClass('arrow_dis');
                        }
                        chooseDom.$arrowRight.removeClass('arrow_dis');
                        chooseDom.$ul.animate({
                            marginLeft: - _marL + 'px'
                        }, 200);
                    }
                });

            } else {//小图标未沾满stage的情况
                chooseDom.$arrowRight.addClass('arrow_dis');
                chooseDom.$arrowLeft.addClass('arrow_dis');
            }
            chooseDom.$ul.animate({
                marginLeft: - ulMarginLeft + 'px'
            }, 200);
        }

        $.each(chooseDom.$aArr, function (i, e) {
            e.on('click', function () {
                var $ts = $(this),
                    _index = $ts.parents('li').index();
                if (!$ts.hasClass('current')) {
                    $loading.prependTo(mediaDom.$bigImageWrapper);
                    mediaDom.$viewImg.animate({
                        opacity: 0
                    }, 200, function () {
                        imgLoadComplete(imgArr.eq(_index).attr('data-bigpic'), function () {
                            mediaDom.$viewImg.css('opacity', 1);
                            mediaDom.$viewImg.attr('src', imgArr.eq(_index).attr('data-bigpic'));
                            $loading.remove();
                        });

                    });

                    $.each(chooseDom.$aArr, function (i, e) {
                        if (e.hasClass('current')) {
                            e.removeClass('current');
                        }
                    });

                    //计算当前选择小图标应该处于的位置,并设置左右按钮的显示
                    setUlMarginLeftAndSetArrow(_index);

                    $ts.addClass('current');

                }
            });
        });



        $loading.remove();
        //计算首次选择小图标应该处于的位置,并设置左右按钮的显示
        setUlMarginLeftAndSetArrow(nowIndex);

        mediaDom.$bigImageWrapper.on('click', function () {
            $parentsWrapper.remove();
            $m9.show();
        });

    });

});

