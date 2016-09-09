/**
 * @author Zhao Li
 * @vision 1.0.0 | 2016.09.08
 * @overviews  demo
 */

require(['$'], function ($) {
    var $next = $('.js-next'),
        $back = $('.js-back'),
        host = window.location.host;
    history.replaceState(
        null,
        '主页',
        'index.html'
    );
    eval("require(['page/historyBack/index/index'], function () {});");
    $next.on('click', function () {
        history.pushState(
            {},
            'test',
            '/views/historyBack/test.html'
        );
//        $('#J_content').html('<h1>125</h1>');
//        $('#J_script').html(
//            "require(['page/test/test'], function (test) {});"
//            'alert(1);'
//        );
        eval("require(['page/historyBack/test/test'], function () {});");
    });
    $back.on('click', function () {
        history.back();
    });

    window.addEventListener("popstate", function() {
        var currentState = history.state;
        console.log(currentState);
    });

//    function
});