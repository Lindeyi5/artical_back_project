$(function() {

    var $image = $('#image');
    const options = {
        aspectRatio: 1,
        preview: '.img-preview'
    };

    $image.cropper(options);

    $('#btnChooseImage').on('click', function() {
        $('#file').trigger('click')
    })

    $('#file').on('change', function(e) {
        var fileList = e.target.files
        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片')
        }

        var file = e.target.files[0]
        var imgURL = URL.createObjectURL(file)
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    })

    $('#btnUpload').on('click', function(e) {
        var dataURL = $image.cropper('getCroppedCanvas', {
            width: 100,
            heigeht: 100
        }).toDataURL('image/png')

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                layui.layer.msg(res.msg)

                if (res.status !== 0) return

                window.parent.getUserInfo()
            }
        })
    })
})