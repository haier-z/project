window.DELEGATE = {};//命名空间
/**
 * 事件处理对象
 * @type {{addHandler: addHandler, removeHandler: removeHandler}}
 */
window.DELEGATE.EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};
/**
 * 比较当前选择于目标函数是否相等
 * @param element 当前元素
 * @param selector 目标元素标识
 */
window.DELEGATE.matchesSelector = function(element, selector){
    if(element.matches){
        return element.matches(selector);
    } else if(element.matchesSelector){
        return element.matchesSelector(selector);
    } else if(element.webkitMatchesSelector){
        return element.webkitMatchesSelector(selector);
    } else if(element.msMatchesSelector){
        return element.msMatchesSelector(selector);
    } else if(element.mozMatchesSelector){
        return element.mozMatchesSelector(selector);
    } else if(element.oMatchesSelector){
        return element.oMatchesSelector(selector);
    } else if(element.querySelectorAll){
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
            i = 0;
        while(matches[i] && matches[i] !== element) i++;
        return matches[i] ? true: false;
    }
    throw new Error('Your browser version is too old,please upgrade your browser');
};

/**
 * 缓存所有事件，以数组形式缓存（一个dom上绑定了多个事件时），
 * 缓存例子为agentObj[e.currentTarget的id，无id用temp++值表示][event][触发事件的tag][]
 */
window.DELEGATE.agentObj = {};
/**
 * 用于缓存所有需要触发事件的dom tag，
 * 缓存例子：selectorObj[e.currentTarget的id，无id用temp++值表示][触发事件的tag][]
 * 用对象的目的在于方便判断是否已经缓存过了
 */
window.DELEGATE.selectorObj = {};
/**
 * 用于e.currentTarget没有id的情况，产生id
 */
window.DELEGATE.temp = 0;

/**
 *
 * @param parent 父节点id或者父节点元素
 * @param eventStr 触发事件
 * @param childTag 触发事件元素标志
 * @param handler 事件句柄
 * @constructor
 */
window.DELEGATE.Delegate  = function(parent, eventStr, childTag, handler) {
    var event = eventStr.toLowerCase(),
        parentObj = null;
    if (typeof parent == 'object') {
        parentObj =
            parent === document || parent === document.body || parent === document.documentElement ?
                document.body :
                parent;
        if (parentObj.id) {
            parent = parentObj.id
        } else {
            parent = ++window.DELEGATE.temp;
        }
    } else {
        parentObj = document.getElementById(parent);
    }

    if (!window.DELEGATE.selectorObj[parent]) {
        window.DELEGATE.selectorObj[parent] = {};
    }
    if (!window.DELEGATE.selectorObj[parent][childTag]) {
        window.DELEGATE.selectorObj[parent][childTag] = [];
    }
    if (!window.DELEGATE.agentObj[parent]) {
        window.DELEGATE.agentObj[parent] = {};
        window.DELEGATE.EventUtil.addHandler(parentObj, event, function (e) {
            e.stop = false;
            /**
             * 阻止冒泡，重置该方法
             */
            e.stopPropagation = function () {
                e.stop = true;
            };
            var parentElement = e.target;
            while (parentElement != e.currentTarget && !e.stop) {//从子节点向上冒泡遍历每一个节点与目标节点比较，一直到父节点停止
                for (var selector in window.DELEGATE.selectorObj[parent]) {
                    if (window.DELEGATE.matchesSelector(parentElement, selector)) {
                        for (var agent in window.DELEGATE.agentObj[parent][eventStr][selector]) {
                            window.DELEGATE.agentObj[parent][eventStr][selector][agent].call(parentElement, e);
                        }
                    }
                }
                parentElement = parentElement.parentElement || parentElement.parentNode;
            }
        });
    }
    if (!window.DELEGATE.agentObj[parent][eventStr]) {
        window.DELEGATE.agentObj[parent][eventStr] = {};
    }
    if (!window.DELEGATE.agentObj[parent][eventStr][childTag]) {
        window.DELEGATE.agentObj[parent][eventStr][childTag] = [];
    }
    window.DELEGATE.agentObj[parent][eventStr][childTag].push(handler);

};

/**
 * demo
 */
DELEGATE.Delegate(document, 'click', '.a', function () {
    alert(this.innerHTML);
});

DELEGATE.Delegate('J_list2Wrapper', 'click', 'span', function (e) {
    alert(this.innerHTML);
    e.stopPropagation();
});

DELEGATE.Delegate('J_list2Wrapper', 'click', 'li', function (e) {
    alert(this.innerHTML);
});

DELEGATE.Delegate('J_list3Wrapper', 'click', 'li', function (e) {
    alert(this.innerHTML);
});