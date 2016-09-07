define(function () {
    var identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+";

        return {
            "ID": new RegExp( "^#(" + identifier + ")" ),
            "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
            "TAG": new RegExp( "^(" + identifier + "|[*])" )
    }
});