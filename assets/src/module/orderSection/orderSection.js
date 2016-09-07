/**
 * @fileoverview 主站订阅科室 dom 与订阅等操作
 * @vision 1.0.0 | 2015-11-4 版本信息
 * @auther Zhao Li
 * @param {OBJECT}
 *         {
 *              canSelectedNumber           : 5,    //能选择的最大个数，{NUMBER} 默认为5个
                dialogOpenHandler           : '',   //弹出框弹出后的回掉函数 {FUNCTION} 默认为空
                isNeedSubmitSelectedSection : true, //是否需要提交 {BOOLEAN} 默认点击确定提交数据
                selectedSectionObj          : {},    //已选科室json {JSON} 默认为空的object 若有已选科室，则不执行getDataInstantiation.getSelectedData方法
                isNeedGetSelectedSection    : true,  //是否需要拉去已选科室数据 {BOOLEAN} 默认拉去已选科室， 否则在不执行getDataInstantiation.getSelectedData方法， 拉去科室
                dialogCloseHandler          : ''     //关闭弹出框的回掉方法
 *         }
 * @return 选择科室的dom 以及操作
 * @example  require([
                 'module/ui/orderSection/orderSection'
                 ], function (orderSection) {
                 ], function (orderSection) {
                            orderSection({
                                canSelectedNumber : 30,
                                dialogOpenHandler : function () {
                                    console.log('dialog has complete!');
                                },
                                isNeedGetSelectedSection : false,
                                selectedSectionObj : {
                                    'data': {
                                        'list' : [
                                                {
                                                    'id': 0,
                                                    'name' : '名字'
                                                },
                                                {
                                                    'id': 1,
                                                    'name' : '名字'
                                                }
                                            ]
                                    }
                                },
                                isNeedSubmitSelectedSection : false,
                                dialogCloseHandler : function (idArray, nameArray) {
                                    console.log(idArray);
                                    console.log(nameArray);
                                }

                            });
                        });
 */
define([
    '$',
    'libs/template',
    'module/dialog/dialog',
    'module/xhr',
    'utils/checkDataType',
    'utils/interactive',
    'module/orderSection/sectionModalTpl',
    'module/orderSection/sectionChildTpl',
    'module/orderSection/choosedTagTpl',
    'css!module/ui/orderSection/orderSection'
], function ($, $template, Dialog, xhr, checkType, $interactive, $sectionModalTpl, $sectionChildTpl, $choosedTagTpl) {

    /**
     * 防止重复点击提交以及拉去数据
     * */
    var checkGetAllObj = $interactive(),
        checkGetSelectedObj = $interactive(),
        checkPostObj = $interactive();
    /**
     * 获取数据
     * */
    function GetData () {}
    /**
     * 拉取订阅的科室
     * */
    GetData.prototype.getSelectedData = function (callback, interactive) {
        xhr.req({
            type: 'get',
            url: '/home/subscribe-sections',
            success: function (res) {
                if (callback && checkType.isFunction(callback)) {
                    callback(res);
                }
            },
            error: function () {},
            complete: function () {
                if (interactive && checkType.isFunction(interactive)) {
                    interactive();
                }
            }
        });
    }
    /**
     * 拉取所有科室列表
     * */
    GetData.prototype.getAllSectionData = function (callback, interactive) {
        xhr.req({
            type: 'get',
            url: '/home/all-tree-sections',
            success: function (res) {
                if (callback && checkType.isFunction(callback)) {
                    callback(res);
                }
            },
            error: function () {},
            complete: function () {
                if (interactive && checkType.isFunction(interactive)) {
                    interactive();
                }
            }
        });
    }

    /**
     * 提交数据
     * @param data {ARRAY} 点击确定时，选择之后的科室id array
     *         callback 回调函数
     *         interactive 完成后的回掉函数
     * */
    function postData(data, callback, interactive) {
        xhr.req({
            type: 'post',
            data: {
                'sections' : data
            },
            url: '/home/update-subscribe-sections',
            success: function (res) {
                if (callback && checkType.isFunction(callback)) {
                    callback(res);
                }
            },
            error: function () {},
            complete: function () {
                if (interactive && checkType.isFunction(interactive)) {
                    interactive();
                }
            }
        });
    }


    /**
     * 处理数据，给已订阅的科室添加['choosed'] = 1, 未订阅的科室添加['choosed'] = 0
     * @params: dataArray为已订阅科室的id的一个数组,若不为数组则不执行
     *           sectionListObj {JSON} 为被处理数据json object
     * */
    function dealWhithData (dataArray, sectionListObj) {
        var selfSectionListObj = sectionListObj;
        if (checkType.isArray(dataArray) && checkType.isArray(sectionListObj)) {
            $.each(selfSectionListObj, function (i, e) {
                if (e.childList) {
                    $.each(e.childList, function (x, s) {
                        if ($.inArray(s.id, dataArray) != -1) {
                            s['choosed'] = 1;
                        } else {
                            s['choosed'] = 0;
                        }
                    });
                }
            });
            return selfSectionListObj;
        } else {
            return '';
        }
    }

    /**
     * 获取html dom 结构
     * @params allSectionDataObj {JSON} 所有科室json object 数据
     *          firstSelectedDataObj {JSON} 首次从数据库拉出来数据的json object 数据（当弹出层弹出后改变的选择数据，由js控制，由于弹出层每次关闭只是隐藏在页面，并没有remove）
     * */
    function GetHtml (allSectionDataObj, allSelectedNumber, firstSelectedDataObj) {
        this.allSectionDataObj = allSectionDataObj;
        this.firstSelectedDataObj = firstSelectedDataObj || [];
        this.firstSelectedNumber = this.firstSelectedDataObj.length;
        this.allSelectedNumber = allSelectedNumber;
        this.allSectionDataLength = this.allSectionDataObj.length;
    }
    /**
     * 获取弹出框最外面html 结构
     * */
    GetHtml.prototype.getSectionModalHtml = function () {
        var render = $template.compile($sectionModalTpl),
            selectionModalHtml = render({'sectionList' : this.allSectionDataObj, 'allSectionLength' : this.allSectionDataLength, 'data' : this.firstSelectedDataObj, 'selectedCount' : this.firstSelectedNumber, 'allSelectedNumber': this.allSelectedNumber});
        return selectionModalHtml;
    }
    /**
     * 获取科室子类html 结构
     * @param sectionChildObj {JSON}为子类科室json object 数据
     * */
    GetHtml.prototype.getSectionChildHtml = function (sectionChildObj) {
        if (checkType.isObject(sectionChildObj)) {
            var render = $template.compile($sectionChildTpl),
                sectionChildHtml = render(sectionChildObj);
            return sectionChildHtml;
        } else {
            return '';
        }
    }
    /**
     * 获取科室子类html 结构
     * @param sectionChildObj {JSON}为子类科室json object 数据
     * */
    GetHtml.prototype.getChoosedTagHtml = function (choosedTagObj) {
        if (checkType.isObject(choosedTagObj)) {
            var render = $template.compile($choosedTagTpl),
                choosedTagHtml = render(choosedTagObj);
            return choosedTagHtml;
        } else {
            return '';
        }
    }


    /**
     * 绑定事件
     * */
    function OperateFn () {
        this.modalWrapper = $('.modal-dialog');
        this.chooseWrapper = $('.section-choose-wrapper');
        this.parentSectionTag = this.modalWrapper.find('.section-choose-tag');
        this.childSectionWrapper = this.modalWrapper.find('.section-choose-child-tag-wrapper');
        this.chooseRusultWrapper = this.modalWrapper.find('.section-choose-result-wrapper');
    };
    /**
     * 绑定事件
     * @param parentIndex 点击的父类section index
     * */
    OperateFn.prototype.openChildSection = function (nowObj, allSectionJson, getHtmlFun) {
        var nowObjParent = nowObj.parents('.section-choose-line'),
            nowIndex = nowObj.index() + nowObjParent.index() / 2 * 3,
            htmlTemp = getHtmlFun(allSectionJson[nowIndex]);
        if (nowObj.hasClass('hover')) {
            nowObj.removeClass('hover');
            nowObjParent.next('.section-choose-child-tag-wrapper').html('').removeClass('current');
        } else {
            this.parentSectionTag.removeClass('hover');
            this.childSectionWrapper.html('').removeClass('current');
            nowObjParent.next('.section-choose-child-tag-wrapper').html(htmlTemp).addClass('current');
            nowObj.addClass('hover');
        }
    }

    OperateFn.prototype.childSectionClick = function (nowObj, lastNumber, selectedIdArray, selectedNameArray, getChoosedTagFn) {
        if (!nowObj.hasClass('selected') && lastNumber > 0) {
            var $selectedNumber = $('.section-selected-number'),
                id = nowObj.data('id'),
                name = nowObj.text(),
                selectedIdArraySelf = selectedIdArray,
                selectedNameArraySelf = selectedNameArray,
                str;
            str = getChoosedTagFn({'id' : id, 'text' : nowObj.text()})
            this.chooseRusultWrapper.append(str);
            nowObj.addClass('selected');
            selectedIdArraySelf.push(id);
            selectedNameArraySelf.push(name);
            $selectedNumber.html(parseInt($selectedNumber.text()) + 1);
            lastNumber - 1 === 0 ? (function () {
                var _parents = $selectedNumber.parents('.section-converge');
                _parents.addClass('warning');
                _parents.find('.J_string').html('已达选择上限');
            })() : ''
            return {
                'lastNumber' : lastNumber - 1,
                'selectedIdArray' : selectedIdArraySelf,
                'selectedNameArray' : selectedNameArraySelf
            }
        } else {
            return '';
        }
    }

    OperateFn.prototype.removeSlectedSection =  function (nowObj, lastNumber, selectedIdArray, selectedNameArray) {
        var id = nowObj.data('id'),
            $selectedNumber = $('.section-selected-number'),
            selectedIdArraySelf = selectedIdArray,
            selectedNameArraySelf = selectedNameArray,
            tempIndex;
        this.chooseWrapper.find('[data-id='+ id +']').removeClass('selected');
        $selectedNumber.html(parseInt($selectedNumber.text()) - 1);
        tempIndex = $.inArray(id, selectedIdArraySelf);
        if (tempIndex > -1) {
            selectedIdArraySelf.splice(tempIndex, 1);
            selectedNameArraySelf.splice(tempIndex, 1);
        }
        nowObj.parents('.section-result-item').remove();
        (function () {
            var _parents = $selectedNumber.parents('.section-converge');
            _parents.removeClass('warning');
            _parents.find('.J_string').html('已经添加');
        })()
        return {
            'lastNumber' : lastNumber + 1,
            'selectedIdArray' : selectedIdArraySelf,
            'selectedNameArray' : selectedNameArraySelf
        }
    }



    /**
     * 初始化弹出框，并展示在页面上，若页面上有，则直接把隐藏的弹出框展示，若页面上没有，则初始化弹出框
     * @param sectionChildObj {JSON}为子类科室json object 数据
     * */
    function dialogInitialize () {
        var args = [].slice.call(arguments);
        if (checkType.isString(args[0])) {
            Dialog.init({
                'dialogWidth' : 650,
                'type' : 'modal',
                'layerMarkToCloseDialog' : false,
                'dialogContentPosition' : 'absolute',
                'hasHeader' : false,
                'hasFooter' : false,
                'dialogPositionTop' : 500,
                'content' : args[0]
            });
        }
    }

    /**
     * 获取被订阅了的科室的id 数组
     * @param {JSON} 被订阅科室json object
     * */
    function getSelectedIdArray (selectedObj) {
        var responseArray = [];
        if (checkType.isArray(selectedObj)) {
            $.each(selectedObj, function (i, e) {
                responseArray.push(e.id);
            });
        }
        return responseArray;
    }

    /**
     * 获取被订阅了的科室的name 数组
     * @param {JSON} 被订阅科室json object
     * */
    function getSelectedNameArray (selectedObj) {
        var responseArray = [];
        if (checkType.isArray(selectedObj)) {
            $.each(selectedObj, function (i, e) {
                responseArray.push(e.name);
            });
        }
        return responseArray;
    }

    /**
     * 拉取数据完成的回掉 处理方法
     * 写此方法目的是为了公用alert这个方法，方便修改alert
     * */
    function handleData (res) {
        if (res && res.errcode == 0) {
            return res;
        } else {
            alert(res.errmsg);
            return '';
        }
    }
    
    function main (option) {
        var setting = $.extend({
            canSelectedNumber           : 5,    //能选择的最大个数，{NUMBER} 默认为5个
            dialogOpenHandler           : '',   //弹出框弹出后的回掉函数 {FUNCTION} 默认为空
            isNeedSubmitSelectedSection : true, //是否需要提交 {BOOLEAN} 默认点击确定提交数据
            selectedSectionObj          : {},    //已选科室json {JSON} 默认为空的object 若有已选科室，则不执行getDataInstantiation.getSelectedData方法
            isNeedGetSelectedSection    : true,  //是否需要拉去已选科室数据 {BOOLEAN} 默认拉去已选科室， 否则在不执行getDataInstantiation.getSelectedData方法， 拉去科室
            dialogCloseHandler          : ''     //关闭弹出框的回掉方法
        }, option);
        var allSectionDataObj,
            selectedObj,
            selectedIdArray = [],
            selectedNameArray = [],
            lastSelectNumber = setting.canSelectedNumber,
            getDataInstantiation = new GetData(),
            /**
             * 检测是否有修改（是否需要提交）
             * */
            modified = false;

        if (!checkGetAllObj.start() || !checkGetSelectedObj.start()) {
            return false;
        }
        /**
         * 获取所有科室数据实例化
         * */
        getDataInstantiation.getAllSectionData(function (res) {
            allSectionDataObj = handleData(res);
            defferAllSectionData.resolve(allSectionDataObj);
        }, function () {
            checkGetAllObj.end();
        });
        var defferAllSectionData = $.Deferred();
        var defferSelectedData = $.Deferred();

        /**
         * 获取已订科室数据实例化
         * */
         if (setting.isNeedGetSelectedSection) {
             getDataInstantiation.getSelectedData(function (res) {
                 selectedObj = handleData(res);
                 defferSelectedData.resolve(selectedObj);
             }, function () {
                 checkGetSelectedObj.end();
             });
         }  else {
             checkGetSelectedObj.end();
             defferSelectedData.resolve();
         }



        /**
         * 数据都拉取成功后执行
         * */
        $.when(defferAllSectionData, defferSelectedData).done(function (allSectionDataObj, selectedObj) {
            var selectedObjSelf = selectedObj;
            if (setting.isNeedGetSelectedSection) {//默认情况（插件内部拉取已选科室数据）
                /**
                 * 已选科室id组成数组
                 * */
                selectedIdArray = getSelectedIdArray(selectedObjSelf.data.list);
                lastSelectNumber = setting.canSelectedNumber - selectedIdArray.length;
                /**
                 * 已选科室name组成数组
                 * */
                selectedNameArray = getSelectedNameArray(selectedObjSelf.data.list);
            } else {
                if (setting.selectedSectionObj && setting.selectedSectionObj.data && checkType.isArray(setting.selectedSectionObj.data.list)) {//有默认已选科室数据情况
                    selectedObjSelf = setting.selectedSectionObj;
                    /**
                     * 已选科室id组成数组
                     * */
                    selectedIdArray = getSelectedIdArray(selectedObjSelf.data.list);
                    lastSelectNumber = setting.canSelectedNumber - selectedIdArray.length;
                    /**
                     * 已选科室name组成数组
                     * */
                    selectedNameArray = getSelectedNameArray(setting.selectedSectionObj.data.list);
                }
            }

            /**
             * 处理数据 ['choose'] = 1(已选)，['choose'] = 0(未选)
             * */
            allSectionDataObj.data.sectionList = dealWhithData(selectedIdArray, allSectionDataObj.data.sectionList);

            /**
             * 获取选择科室最外层弹出层modal html
             * */
            var getHtmlInstantiation = new GetHtml(allSectionDataObj.data.sectionList, setting.canSelectedNumber, selectedObjSelf ? selectedObjSelf.data.list : '');
            /**
             * 根据html弹出弹出层
             * */
            dialogInitialize(getHtmlInstantiation.getSectionModalHtml());

            if (option.dialogOpenHandler && checkType.isFunction(option.dialogOpenHandler)) {
                option.dialogOpenHandler();
            }

            /**
             * 实例化操作方法
             * */
            var operateFnInstantiation = new OperateFn();

            var $dialogWrapper = $('.modal-body');

            /**
             * 大类科室点击方法绑定以及实现
             * */
            $dialogWrapper.on('click', '.section-choose-tag', function () {
                var $this = $(this);
                operateFnInstantiation.openChildSection($this, allSectionDataObj.data.sectionList, getHtmlInstantiation.getSectionChildHtml);
            });

            /**
             * 子类科室点击方法绑定以及实现方法
             * */
            $dialogWrapper.on('click', '.section-choose-child-tag', function () {
                var $this = $(this);
                var selectedResult = operateFnInstantiation.childSectionClick($this, lastSelectNumber, selectedIdArray, selectedNameArray, getHtmlInstantiation.getChoosedTagHtml);
                modified = true;
                if (selectedResult) {
                    lastSelectNumber = selectedResult.lastNumber;
                    selectedIdArray = selectedResult.selectedIdArray;
                    selectedNameArray = selectedResult.selectedNameArray;
                    /**
                     * 处理数据 ['choose'] = 1(已选)，['choose'] = 0(未选)
                     * */
                    allSectionDataObj.data.sectionList = dealWhithData(selectedIdArray, allSectionDataObj.data.sectionList);
                }
            });

            /**
             * 已选科室移除方法绑定以及实现方法
             * */
            $dialogWrapper.on('click', '.section-remove', function () {
                var $this = $(this),
                    id = $this.data('id');
                var selectedResult = operateFnInstantiation.removeSlectedSection($this, lastSelectNumber, selectedIdArray, selectedNameArray);
                modified = true;
                if (selectedResult) {
                    lastSelectNumber = selectedResult.lastNumber;
                    selectedIdArray = selectedResult.selectedIdArray;
                    selectedNameArray = selectedResult.selectedNameArray;
                    /**
                     * 处理数据 ['choose'] = 1(已选)，['choose'] = 0(未选)
                     * */
                    allSectionDataObj.data.sectionList = dealWhithData(selectedIdArray, allSectionDataObj.data.sectionList);
                }
            });

            /**
             * 提交（确定）按钮方法绑定以及处理
             * */
            $dialogWrapper.find('.section-submit-btn').on('click', function () {
                if (!checkPostObj.start()) {
                    return false;
                }
                var $loading = $(this).parents('.g-state-btn'),
                    $layer = $('.layer-z0'),
                    $modal = $('.modal-z0');
                if (setting.isNeedSubmitSelectedSection && modified) {
                    $loading.addClass('loading-center');
                    postData(selectedIdArray, function () {
                        $layer.hide();
                        $modal.hide();
                        if (setting.dialogCloseHandler && checkType.isFunction(setting.dialogCloseHandler)) {
                            setting.dialogCloseHandler.call(this, selectedIdArray, selectedNameArray);
                        }
                    }, function () {
                        checkPostObj.end();
                        $loading.removeClass('loading-center');
                        modified = false;
                    });
                } else {
                    $layer.hide();
                    $modal.hide();
                    if (setting.dialogCloseHandler && checkType.isFunction(setting.dialogCloseHandler)) {
                        setting.dialogCloseHandler.call(this, selectedIdArray, selectedNameArray);
                    }
                    checkPostObj.end();
                }

            });

        });
    }

    return function (option) {
        /**
         * 若是第一次打开则初始化，若不是则直接显示隐藏dom
         * */
        if ($('.layer-z0').length && $('.modal-z0').length) {
            $('.layer-z0').show();
            $('.modal-z0').show();
            if (option.dialogOpenHandler && checkType.isFunction(option.dialogOpenHandler)) {
                option.dialogOpenHandler();
            }
        } else {
            return main(option);
        }

    }


});