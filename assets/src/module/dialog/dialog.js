/**
 * @author Zhao Li
 * @vision 1.0.0
 * @overviews 弹出框插件，包括三种弹出框（alert，confirm，modal）,默认弹出框为水平与垂直居中于屏幕
 * @example require(['moudle/dialog/dialog'], function ($dialog) {
 *                  $dialog.init({
 *                      ...
 *                      });
 *                  $dialog.close();
 *                  })
 * */
define([
    '$',
    'css!./dialog.css'
], function($){
    var Dialog = {
        init : function (options) {
            return (function () {
                var setting = $.extend({
                    type                   : 'modal',    //弹出框的样式有alert ，confirm ，modal 默认modal
                    hasLayerMark           : true,       //是否显示遮罩层
                    layerMarkToCloseDialog : true,       //遮罩层是否具有关闭弹出框的功能
                    bodyScroll             : true,       //弹出遮罩层后，body是否还滚动
                    dialogContentPosition  : 'fixed',    //弹出框的position，例子：absolute，fixed，默认是fixed /
                    title                  : '提示',     //dialog的标题，默认是'提示'
                    hasCloseLittleButton   : true,       //是否有关闭小按钮/
                    content                : '',         //弹出的主要内容
                    dialogWidth            : 400,        //弹出框的宽度，默认是400px/
                    dialogPositionTop      : 50 + '%',   //弹出框位置的top值，默认是50%/
                    hasHeader              : true,       //弹出框是否有header
                    hasFooter              : true,       //弹出框是否有footer
                    buttonsSetting         : [],         //弹出框的button的设置，默认是一个空数组，里面可以设置buttonBackground，buttonHandler，按钮展示的文字，buttonText
                    sureFunction           : '',         //弹出框中‘确定’点击事件执行的方法，通常用于默认不设置buttons的情况下，展示出来默认按钮，‘确定’按钮绑定此方法,主要用于confirm和modal
                    dialogCompleteHandler  : '',         //dialog加载完成后的方法
                    dialogDestroyHandler   : ''          //dialog移除成后的方法
                },options);

                var _dialogNumber = $('.modal-dialog').length,
                    _layerMarkZIndex = parseInt(_dialogNumber) * 2 + 2000,
                    _dialogZIndex = parseInt(_dialogNumber) * 2 + 2001,
                    $wrapper = $('body');

                //创建dialog弹出框内容的容器
                var $dialogTemp = $('<div>', {
                    'class' : 'modal-content'
                });
                //创建弹出框内容的header部分
                if (setting.hasHeader) {
                    var $dialogHeaderWrapper = Dialog.createHeaderDom(setting.title, setting.hasCloseLittleButton,setting.dialogDestroyHandler);
                    $dialogTemp.append($dialogHeaderWrapper);
                }
                //创建弹出框内容的body部分
                var $dialogBodyWrapper = Dialog.createBodyDom(setting.type, setting.content);
                $dialogTemp.append($dialogBodyWrapper);
                //创建弹出框内容的footer部分
                if (setting.hasFooter) {
                    var $dialogFooterWrapper = Dialog.createFooterDom(setting.type, setting.buttonsSetting,setting.dialogDestroyHandler, setting.sureFunction);
                    $dialogTemp.append($dialogFooterWrapper);
                }
                //创建弹出框遮罩层部分并由设置弹出遮罩层
                if (setting.hasLayerMark) {
                    var $layerMark = Dialog.createLayerMarkDom(_dialogNumber, _layerMarkZIndex, setting.layerMarkToCloseDialog, setting.dialogDestroyHandler);
                    $wrapper.append($layerMark);
                    if (!setting.bodyScroll) {
                        $wrapper.css('overflow', 'hidden').addClass('modal-z' + _dialogNumber);
                    }
                }
                //创建弹出框内容的实际容器
                var $dialogWrapper = Dialog.createDialogWrapperDom(_dialogNumber, setting.dialogContentPosition, setting.dialogWidth, setting.dialogPositionTop, _dialogZIndex);
                $dialogWrapper.append($dialogTemp);
                //弹出弹出框在html的body里面
                $wrapper.append($dialogWrapper);
                //设置上下居中
                var dialogHeight = 0;
                if ($dialogHeaderWrapper) {
                    dialogHeight += $dialogHeaderWrapper.height();
                }
                if ($dialogFooterWrapper) {
                    dialogHeight += $dialogFooterWrapper.height();
                }
                dialogHeight += $dialogBodyWrapper.height();
                $dialogWrapper.css('margin-top',  - parseInt(dialogHeight/2) + 'px');
                //弹出框弹出后的回掉函数
                if(setting.dialogCompleteHandler) {
                    setting.dialogCompleteHandler();
                }
            })();
        },
        getBodyHeight : function () {
            return $('body').height();
        },
        createLayerMarkDom : function (dialogNumber, layerMarkZIndex, layerMarkToCloseDialog, dialogDestroyHandler) {
            var $layerMark = $('<div>',{
                'class'  : 'layer  layer-z' + dialogNumber,
                'css'    : {
                    'z-index' : layerMarkZIndex,
                    'height'  : Dialog.getBodyHeight()
                }
            });
            if (layerMarkToCloseDialog) {
                Dialog.addCloseFunction($layerMark, dialogDestroyHandler);
            }
            return $layerMark;
        },
        createDialogWrapperDom : function (dialogNumber, dialogContentPosition, dialogWidth, dialogPositionTop, dialogZIndex) {
            var $dialogWrapper = $('<div>', {
                'class' : 'modal-dialog modal-z' + dialogNumber,
                'css'   : {
                    'position' : dialogContentPosition,
                    'width'    : dialogWidth,
                    'margin-left' : "-" + parseInt(dialogWidth/2) + "px",
                    'top'      : dialogPositionTop,
                    'z-index'  : dialogZIndex
                }
            });
            return $dialogWrapper;
        },
        createHeaderDom : function (title, hasCloseLittleButton, dialogDestroyHandler) {
            var $dialogHeaderWrapper = $('<div>', {
                'class' : 'modal-header',
                'html'  : title
            });
            if(hasCloseLittleButton){
                var $closeLittleButton = $('<a>', {
                    'href' : 'javascript:',
                    'title': 'close',
                    'class': 'close',
                    'html' : '&times;'
                });
                Dialog.addCloseFunction($closeLittleButton, dialogDestroyHandler);
                $dialogHeaderWrapper.append($closeLittleButton);
            }
            return $dialogHeaderWrapper;
        },
        createBodyDom : function (type, content) {
            var $dialogBodyWrapper = $('<div>', {
                'class' : 'modal-body'
            });
            switch (type){
                case 'alert' : {
                    var $alertWrapper = $('<div>', {
                        'class' : 'alertBox',
                        'html'  : content || '操作已成功！'
                    });
                    $dialogBodyWrapper.append($alertWrapper);
                    break;
                }
                case 'confirm' : {
                    var $confirmWrapper = $('<div>', {
                        'class' : 'alertBox',
                        'html'  : content || '你确定要这么操作吗?'
                    });
                    $dialogBodyWrapper.append($confirmWrapper);
                    break;
                }
                case 'modal' : {
                    $dialogBodyWrapper.html(content);
                }
            }
            return $dialogBodyWrapper;
        },
        createFooterDom : function (type, buttonSettings, dialogCloseCallback, sureFunction) {
            var $dialogFooterWrapper = $('<div>', {
                'class' : 'modal-footer'
            });
            if (buttonSettings.length > 0) {
                var $button;
                $.each(buttonSettings, function (i, e) {
                    $button = $('<button>', {
                        'type' : 'button',
                        'css' : {
                            'background' : e.background || '#ccc'
                        },
                        'html' : e.title || '确定',
                        'click' : function() {
                            if (e.clickFunction) {
                                e.clickFunction();
                            }
                        }
                    });
                    $dialogFooterWrapper.append($button);
                });
            }else{
                switch (type) {
                    case 'alert' : {
                        var $button = $('<button>', {
                            'type' : 'button',
                            'html' : '确定'
                        });
                        Dialog.addCloseFunction($button, dialogCloseCallback);
                        $dialogFooterWrapper.append($button);
                        break;
                    }
                    default : {
                        var $sureButton = $('<button>', {
                            'type' : 'button',
                            'html' : '确定',
                            'click' : function () {
                                if(sureFunction) {
                                    sureFunction();
                                }
                            }
                        });
                        var $cancleButton = $('<button>', {
                            'type' : 'button',
                            'html' : '取消'
                        });
                        Dialog.addCloseFunction($cancleButton, dialogCloseCallback);
                        $dialogFooterWrapper.append($sureButton).append($cancleButton);
                        break;
                    }
                }
            }
            return $dialogFooterWrapper;
        },
        addCloseFunction : function (obj, closeCallBack) {
            obj.on('click', function () {
                Dialog.close(closeCallBack);
            });
        },
        close : function () {
            var $wrapper = $('body'),
                args = [].slice.call(arguments),
                tempCss;
            function isBodyLocked () {
                var classNumber = $wrapper[0].className.split(' ').length;
                return classNumber;
            }
            if (args.length == 1 && typeof args[0] === 'function') {
                var modalZIndex = $('.modal-dialog').length - 1;
                tempCss = $('.modal-dialog').eq(modalZIndex)[0].className.split(' ')[1];
                $('.modal-dialog').eq(modalZIndex).remove();
                $('.layer').eq(modalZIndex).remove();
                args[0]();
            } else {
                var modalZIndex = args[0] ? args[0] - 1 : $('.modal-dialog').length - 1;
                tempCss = $('.modal-dialog').eq(modalZIndex)[0].className.split(' ')[1];
                $('.modal-dialog').eq(modalZIndex).remove();
                $('.layer').eq(modalZIndex).remove();
            }
            if ($wrapper.attr('style')) {
                if (isBodyLocked() > 1) {
                    $wrapper.removeClass('modal-z' + modalZIndex);
                } else {

                    if ($wrapper.hasClass(tempCss)) {
                        $wrapper.removeAttr('style');
                        $wrapper.removeAttr('class');
                    }
                }
            }
            if (args[1]) {
                args[1]();
            }
        }
    };

    return  {
                init: function (options) {
                    return Dialog.init(options);
                },
                close: function (arguments) {
                    return Dialog.close(arguments);
                }
            }

});

