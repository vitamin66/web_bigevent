$(function () {
    getUserInfo() 
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出 
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 确定退出登录后 需要清空本地存储 的 token 和 用户名
            localStorage.clear()
            // 跳转到登录页
            location.href = './login.html'

            layer.close(index);
        });
    })
})



// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     // Authorization 字段的值为登录账号时的 token
        //     Authorization: 'Bearer ' + localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户身份认证失败')
            }
            renderAvatar(res.data)
        },

        complete: function (res) {
            console.log(res)
            if (res.responseJSON.status === 1 && res.responseJSON.msg === '身份认证失败') {
                localStorage.clear()
                location.href = './login.html'
            }
        }
    });
}


// 渲染用户头像函数
function renderAvatar(user) {
    var user_name = user[0].nickname || user[0].username
    $('.welcome').html(`欢迎 ${user_name}`)
    if (user[0].user_pic !== null) {
        $('.layui-nav-img').attr('src', user[0].user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var text_tx = user_name.charAt(0).toUpperCase()
        $('.text-avatar').text(text_tx)
    }
}
