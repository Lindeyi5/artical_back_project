$(function () {
    var id = getUrlParam('id')

    initCate()
    initEditor() 

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artcate/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }

                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
            }
        })
    }

    var $image = $('#image');

    const options = {
        aspectRatio: 400 / 592,
        preview: '.img-preview'
    };

    $image.cropper(options);

    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').trigger('click')
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files

        if (files.length === 0) {
            return layui.layer.msg('请选择封面图片')
        }

        var newFileURL = URL.createObjectURL(files[0])

        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })

    var art_state = '已发布'

    $('#btnSave').on('click', function (e) {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()

        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 200
        }).toBlob(function (blob) { 
            fd.append('cover_img', blob)

            if (id) {
                fd.append('id', id)
                publishArticle(fd, '/my/article/edit')
            } else {
                publishArticle(fd, '/my/article/add')
            }

        })


    })

    function publishArticle(fd, url) {
        $.ajax({
            method: 'POST',
            url: url,
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                layui.layer.msg(res.msg)
                if (res.status !== 0) {
                    return
                }
                window.parent.setNavSelected('#article-list', '#article-pub')
                console.log(window.parent);
                location.href = '/article/art_list.html'
            }
        })
    }

    if (id) {
        $.ajax({
            method: 'GET',
            url: `/my/article/${id}`,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg)
                }
                layui.form.val('formPublish', res.data)
                $image.cropper('destroy').attr('src', 'http://127.0.0.1:3007' + res.data.cover_img).cropper(options);
            }
        })
    }

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]);
        return null; 
    }
})