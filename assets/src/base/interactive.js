/**
 * * @fileoverview 对于点击按钮交互处理是异步（请求数据）的应用场景，为了防止用户防爆点击，添加交互状态检测。
 * @version 1.0.0 | 2015-10-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 投票功能绑定方法
 * @example
 *   requirejs(['base/interactive'],function($interactive){
    	var check = $interactive();
    	node.click(function(){
    		if(check.start()){ //可以发起新的处理
    			//处理程序
    			//异步处理完成，通知完成处理
    			check.end();
    		}
    	});
     });
 */
define(function(){
	/**
	 * 状态检测类 
	 */
	function Interactive(){
		this.loading = false; //数据是否正在请求
	}
	/**
	 * 开始交互处理
	 * @return {Boolean} 是否可以开始新的交互处理
	 */
	Interactive.prototype.start = function(){
		if(this.loading){
			return false;
		}else{
			this.loading = true;
			return true;
		}
	};
	/**
	 * 结束交互处理
	 */
	Interactive.prototype.end = function(){
		this.loading = false;
	};
	return function(){
		return new Interactive();
	};
});
