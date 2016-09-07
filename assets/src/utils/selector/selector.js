
define([
    'selector/matchExpr',
    'selector/matchSelector'
],function (MatchExpr, MatchSelector) {
    window.T = MatchExpr;
    function C (str) {
        if (MatchExpr.ID.test(str)) {
            return this.chooseId(MatchExpr.ID.exec(str)[1]);
        } else if (MatchExpr.CLASS.test(str)) {
            return this.chooseArray(MatchExpr.CLASS.exec(str)[0]);
        } else if (MatchExpr.TAG.test(str)) {
            return this.chooseArray(MatchExpr.TAG.exec(str)[0]);
        }
        return [];
    }

    C.prototype.chooseArray = function (str) {
        var allElement = document.getElementsByTagName('*'),
            result = [];
        for (var i = 0; i < allElement.length; i++) {
            if (MatchSelector(allElement[i], str)) {
                result.push(allElement[i]);
            }
        }
        return result;
    };

    return function (chooseStr) {
        return new C(chooseStr);
    }
});