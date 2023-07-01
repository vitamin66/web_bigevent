$(function () {

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: 'http://127.0.0.1/my/userinfo',
        // 请求头配置对象 
        headers: {
            // Authorization 字段的值为登录账号时的 token
            Authorization:a
        },
        success: function (res) {
            console.log(res)
        }
    })
}