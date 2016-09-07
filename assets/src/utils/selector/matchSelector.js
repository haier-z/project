define(function () {
    return function (element, selector) {
        if (element.matches) {
            return element.matches(selector);
        } else if (element.matchesSelector) {
            return element.matchesSelector(selector);
        } else if (element.webkitMatchesSelector) {
            return element.webkitMatchesSelector(selector);
        } else if (element.msMatchesSelector) {
            return element.msMatchesSelector(selector);
        } else if (element.mozMatchesSelector) {
            return element.mozMatchesSelector(selector);
        } else if (element.oMatchesSelector) {
            return element.oMatchesSelector(selector);
        } else if (element.querySelectorAll) {
            var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
                i = 0;
            while (matches[i] && matches[i] !== element) i++;
            return matches[i] ? true: false;
        }
        throw new Error('Your browser version is too old,please upgrade your browser');
    };
});