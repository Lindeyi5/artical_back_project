$.ajaxPrefilter(function(options) {
    if (options.url.startsWith('/my')) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }

        options.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.msg === '身份认证失败') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    }

    options.url = 'http://127.0.0.1:3007' + options.url
})