// 调用 ajaxPrefilter方法 在请求发起ajax 请求是 会经过改函数
// 可以在改函数里写 headers 请求头 和 url 地址的拼接
$.ajaxPrefilter(function (options) {
    options.url = 'http://127.0.0.1' + options.url

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

})




