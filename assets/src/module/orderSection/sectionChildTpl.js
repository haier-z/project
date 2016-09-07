/**
 * @author Zhao Li
 * @date 2015-11-6
 * @vision 1.0.0
 * @return 科室选择child科室（二级科室）html结构
 * @param 必须有children键值
 * @param example
 *   var res = {
                'child': [
                        {
                            'id': 0,
                            'name' : '名字',
                            'parentId': 2
                        },
                        {
                            'id': 1,
                            'name' : '名字',
                            'parentId': 2
                        }
                    ]
            }
 */
define(function () {
    return [
        '{{each childList as item i}}',
            '<a class="section-choose-child-tag{{if item.choosed == 1}} selected{{/if}}" href="javascript:;" data-id="{{item.id}}">{{item.name}}</a>',
        '{{/each}}'
    ].join('');
});