/**
 * @author Zhao Li
 * @date 2015-11-6
 * @vision 1.0.0
 * @return 选择科室之后生成蓝色带X小tag html
 *
 */
define(function () {
    return [
        '<span class="section-result-item">',
            '<a data-id="{{id}}" href="javascript:;" class="icon close-icon section-remove"></a>{{text}}',
        '</span> '
    ].join('');
});