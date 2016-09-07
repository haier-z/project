/**
* 依赖于jQuery
* init方法是用于初始化整个select组件，此时组件中并没有赋值，只是返回了一些组件的容器,并绑定了select的搜索事件、删除tag事件，选择item事件
* refreshListData方法是用于重新装载整个list，选择list以及读取选择了的item的值
  值保存在整个组件的input里面若为单选则直接保存选择了的id，若为多选，则把id保存为数组，取的方法select.input.data('id');
* @author Zhao Li
* @vision 1.0.0
* @date 2015/11/18
* @example
 *              require(['module/ui/selectList/selectList'], function (selectList) {
 *                  var select = selectList.init($('#J_select'), '搜索标签，例如：口腔修复');
        *              selectList.refreshListData({
                            selectItemWrapper : select.selectListItemWrapper,
                            searchInput : select.input,
                            listJson : res.data.tagList,//此处为json
                            selectListTag : 'name',
                            selectListKey : 'name',
                            chooseAfterFunction : function () {
                                this.searchInput.val('').attr('placeholder', '').trigger('keyup');
                            }
                        });
                        //当是编辑使用，（含有默认值的时候），在处理完以上赋值（默认值）时，再加上以下
                    selectList.setData(select.selectListItemWrapper, 1);
 *              })
 *
* */
define([
    '$',
    'utils/checkDataType',
    'css!./selectList.css'
], function($, checkType){
    var selectList = {
        init : function ($wrapper, placeholder) {
            if (!$wrapper) {
                return false;
            }
            var $selectWrapper = $('<div>', {
                'class' : 'selectList-wrapper'
            });
            var $tagWrapper = $('<div>', {
                'class' : 'selectList'
            });
            var $input = $('<input>', {
                'class' : 'selectList-search',
                'placeholder' : placeholder
            });
            $tagWrapper.html($input);
            $selectWrapper.html($tagWrapper);
            $wrapper.html($selectWrapper);
            var $selectListItemWrapper = $('<div>', {
                'class' : 'selectList-item-wrapper none'
            });
            var $selectListItem = $('<a>', {
                'class' : 'select-list-item',
                'href' : 'javascript:',
                'text' : '暂无更多选项'
            });
            $selectListItemWrapper.html($selectListItem);
            $selectWrapper.append($selectListItemWrapper);
            $input.on('keyup', function () {
                var _value = $input.val(),
                    _len = _value.length;
                if (_len) {
                    $input.css('width', _len + 2 + 'em');
                } else {
                    $input.removeAttr('style');
                }

            });
            $tagWrapper.on('click', function () {
                $selectListItemWrapper.removeClass('none');
                $tagWrapper.addClass('now');
            });
            $selectWrapper.on('click', function (e) {
                e.stopPropagation();
                $input.focus();
            });
            $(document).on('click', function () {
                $selectListItemWrapper.addClass('none');
                $tagWrapper.removeClass('now');
            });
            return {
                selectWrapper : $selectWrapper,                  //整个select组件最外面的容器
                selectListItemWrapper : $selectListItemWrapper,  //列表容器
                input : $input                                   //搜索输入框
            };
        },
        //selectListItemWrapper是整个列表的容器
        //listStr 是只整个列表中的
        refreshListData : function (selectListOption) {
            var selectSetting = $.extend({
                selectItemWrapper          : null,    //select列表容器,
                searchInput                : null,    //查询框
                selectNumber               : 1,       //可选择的最多个数
                listJson                   : {},      //传入json对象，
                selectListTag              : 'value', //json对象默认显示tag读取listJson中的‘value’并显示
                selectListKey              : 'Id',    //json对象获取tage的key，相当于获取的id
                selectOtherKey             : '',      //json对象除了id之外，其他作为key的属性，此处只是以属性的方式封装在列表上，若需要可自行获取
                chooseAfterFunction        : $.noop,  //选择之后的回调方法
                deleteSelectedAfterFunction: $.noop   //删除选择之后的回调方法
            }, selectListOption);
            if (!selectSetting.selectItemWrapper) {
                return false;//未确定容器，无法进入此方法
            }
            var str = '';
            if (selectSetting.listJson.length === 0 ) {
                str += '<a class="select-list-item" href="javascript:">暂无更多选项</a>';
                selectSetting.selectItemWrapper.html(str);
            } else {
                $.each(selectSetting.listJson, function (i, e) {
                    str += '<a class="select-list-item use" href="javascript:"';
                    if (e[selectSetting.selectListKey]) {
                        str += ' data-id="' + e[selectSetting.selectListKey] + '"';
                    }
                    if (selectSetting.selectOtherKey && e[selectSetting.selectOtherKey]) {
                        str += ' data-otherKey="' + e[selectSetting.selectOtherKey] + '"';
                    }
                    str += '>';
                    if (e[selectSetting.selectListTag]) {
                        str += e[selectSetting.selectListTag];
                    }
                    str += '</a>';
                });
                selectSetting.selectItemWrapper.html(str);//将整个json遍历并拼字符串，然后装载入容器
                var $selectItem = selectSetting.selectItemWrapper.find('.select-list-item');
                $selectItem.on('click', function () {
                    var $this = $(this);
                    if ($this.hasClass('choosed')) {
                        return false;
                    }
                    if (selectSetting.selectNumber === 1) {
                        var $tag = $('<span>', {
                            'class' : 'selectList-tag'
                        });
                        $tag.html($this.html() + '<a href="javascript:;" class="selectList-tag-delete">&times;</a>');
                        if (selectSetting.searchInput) {
                            selectSetting.searchInput.prev('.selectList-tag').remove().prevObject.before($tag);
                        }
                        selectSetting.searchInput.data('id', $this.data('id'));
                        $selectItem.removeClass('choosed');
                        $this.addClass('choosed');
                        if (selectSetting.deleteSelectedAfterFunction && checkType.isFunction(selectSetting.deleteSelectedAfterFunction)) {
                            selectSetting.deleteSelectedAfterFunction();
                        }
                    } else if (selectSetting.selectNumber > 1) {
                        var _data = selectSetting.searchInput.data('id') ? selectSetting.searchInput.data('id') : [];
                        if (_data.length == selectSetting.selectNumber) {
                            selectSetting.searchInput.prev('.selectList-tag').find('a').trigger('click');
                        }
                        var $tag = $('<span>', {
                            'class' : 'selectList-tag'
                        });
                        $tag.html($this.html() + '<a href="javascript:;" class="selectList-tag-delete">&times;</a>');
                        if (selectSetting.searchInput) {
                            selectSetting.searchInput.before($tag);
                        }
                        _data.push($this.data('id'));
                        selectSetting.searchInput.data('id', _data);
                        $this.addClass('choosed');
                    }
                    $tag.data('id', $this.data('id'));
                    $tag.find('a').on('click', function () {
                        if (selectSetting.selectNumber === 1) {
                            $selectItem.removeClass('choosed');
                            selectSetting.searchInput.removeData('id');
                        } else if (selectSetting.selectNumber > 1) {
                            var _index = $.inArray($tag.data('id'), _data);
                            if (_index != -1) {
                                _data.splice(_index, 1);
                                selectSetting.searchInput.data('id', _data);
                                $this.removeClass('choosed');
                            }
                        }
                        $tag.remove();
                        if (selectSetting.deleteSelectedAfterFunction && checkType.isFunction(selectSetting.deleteSelectedAfterFunction)) {
                            selectSetting.deleteSelectedAfterFunction();
                        }
                    });
                    selectSetting.selectItemWrapper.addClass('none');
                    selectSetting.searchInput.parents('.selectList').removeClass('now');
                    if (selectSetting.chooseAfterFunction && checkType.isFunction(selectSetting.chooseAfterFunction)) {
                        selectSetting.chooseAfterFunction($this.data('id'),$this.html());
                    }
                });
            }


        },
        //设置已选择项，根据提供的id来设置
        //selectItemWrapper只listItem容器
        //searchInput查询框，用于装载已选数据
        //dataOrDataArray只需要设置的值或者值数组
        setData : function (selectItemWrapper, searchInput, dataOrDataArray) {
            if (!dataOrDataArray) {
                return false;
            }
            if (!selectItemWrapper) {
                return false;
            }
            if (dataOrDataArray instanceof Array) {
                $.each(dataOrDataArray, function (i, e) {
                    if (selectItemWrapper.find('[data-id='+ e +']')) {
                        selectItemWrapper.find('[data-id='+ e +']').trigger('click');
                    }
                });
            } else {
                if (selectItemWrapper.find('[data-id='+ dataOrDataArray +']')) {
                    selectItemWrapper.find('[data-id='+ dataOrDataArray +']').trigger('click');
                }
            }
        }
    }


    return {
        init : function ($wrapper, placeholder) {
            return selectList.init($wrapper, placeholder);
        },
        refreshListData : function (selectListOption) {
            return selectList.refreshListData(selectListOption);
        },
        setData : function (selectItemWrapper, searchInput, dataOrDataArray) {
            selectList.setData(selectItemWrapper, searchInput, dataOrDataArray);
        }
    }

});

