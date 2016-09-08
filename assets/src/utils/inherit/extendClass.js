/**
 * @fileoverview 类式继承方法
 * @version 1.0 | 2015-08-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 类式继承方法
 * */
define(function(){
	/**
   	 * 类式继承方法
     * subClass 子类
     * superClass 父类
     * 在子类的构造函数中，初始化父类的构造函数可使用如下操作：
     * subClass.superclass.constructor.call(this, 一系列参数); 
     */
    return function(subClass, superClass) {
    	var F = function() {};
	    F.prototype = superClass.prototype;
	    subClass.prototype = new F();
	    subClass.prototype.constructor = subClass;
	    subClass.superclass = superClass.prototype;
	    if(superClass.prototype.constructor == Object.prototype.constructor) {
	      superClass.prototype.constructor = superClass;
	    }
    };
});
