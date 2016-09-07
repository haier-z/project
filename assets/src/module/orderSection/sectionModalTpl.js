/**
 * @author Zhao Li
 * @date 2015-11-5
 * @vision 1.0.0
 * @return 选择科室主要modal html结构
 * @param {JSON} (1):必须有data 键值 (2):必须有sectionList键值
 * @param example
 *    (1): var res = {
            'data': [
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
 *   (2) :var res = {
                'data': {
                    'sectionList': [
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
            }
 *
 */
define(['css!module/ui/orderSection/orderSection'], function () {
    return [
        '<div class="section-wrapper">',
            '<div class="section-header clearfix">',
                '<span class="g-state-btn inline">',
                    '<a class="section-submit-btn" href="javascript:" data-action="submit">确定</a>',
                '</span>',
                '<span class="section-converge {{if selectedCount == allSelectedNumber}}warning{{/if}}">',
                    '<span class="J_string">',
                        '{{if selectedCount == allSelectedNumber}}',
                            '已达选择上限',
                        '{{else}}',
                            '已经添加',
                        '{{/if}}',
                    '</span><span class="section-number"><span class="section-selected-number">{{selectedCount}}</span>/{{allSelectedNumber}}</span>',
                '</span>订阅你感兴趣的科室,不错过每一个精彩',
            '</div>',
            '<div class="section-choose-result-wrapper clearfix">',
                '{{each data as item i}}',
                    '<span class="section-result-item">',
                        '{{if !item.type}}',
                            '<a class="icon close-icon section-remove " href="javascript:;" data-id="{{item.id}}"></a>',
                        '{{/if}}',
                        '{{item.name}}',
                    '</span> ',
                '{{/each}}',
            '</div> ',
            '<div class="section-choose-wrapper">',
                '{{each sectionList as parentList x}}',
                    '{{if x%3 == 0}}',
                        '<div class="section-choose-line clearfix">',
                    '{{/if}}',
                    '<a class="section-choose-tag" href="javascript:;" ac-parentid="{{parentList.id}}">{{parentList.name}}<br><i class="icon below-icon"></i><i class="icon below-blue-icon"></i></a>',
                    '{{if x%3 == 2 || x == allSectionLength - 1}}',
                        '</div> ',
                        '<div class="section-choose-child-tag-wrapper clearfix"></div> ',
                    '{{/if}}',
                '{{/each}}',
            '</div> ',
        '</div>'
    ].join('');
});