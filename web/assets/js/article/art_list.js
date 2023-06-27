$(function () {
    var query = {
        pagenum: 1,
        pagesize: 5
    }
    initArticleList()
    initFilter()
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                renderPage(res.total)
            }
        })
    }

    function initFilter() {
        $.ajax({
            method: 'GET',
            url: '/my/artcate/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-filter', res)
                $('[name=cate_id]').html(htmlStr)
                layui.form.render()
            }
        })
    }

    $('#form-filter').on('submit', function (e) {
        e.preventDefault()

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        if (cate_id) {
            query.cate_id = cate_id
        } else {
            delete query.cate_id
        }
        if (state) {
            query.state = state
        } else {
            delete query.state
        }
        initArticleList()
    })

    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: query.pagesize,
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                if (!first) {
                    initArticleList()
                }
            }
        })
    }

    $('tbody').on('click', '.btnDelArticle', function (e) {
        var len = $('.btnDelArticle').length
        var id = $(this).attr('data-id')

        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.msg)
                    }

                    if (len === 1) {
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }

                    initArticleList()
                }
            })
            layui.layer.close(index)
        })
    })

    $('tbody').on('click', '.btnEditArticle', function (e) {
        var id = $(this).attr('data-id')
        location.href = `/article/art_pub.html?id=${id}`
    })
})