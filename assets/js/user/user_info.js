$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称只能 1 ~ 6 个长度!'
            }
        }
    })

    initUserInfo()

    // 初始化用户信息函数
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户身份认证失败')
                }
                localStorage.setItem('id', res.data[0].id)
                form.val('formUserInfo', res.data[0])
            }
        })
    }

    // 更改用户信息的 ajax 请求函数
    function changeUserInfo() {
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: {
                nickname: $('#nickname').val().trim(),
                email: $('#email').val().trim(),
                id: localStorage.getItem('id')
            },
            success: function (res) {
                if (res.status !== 0) {
                    console.log()
                    return layer.msg('提交失败!')
                }
                console.log(res)
                form.val('formUserInfo', res.data[0])
                layer.msg('提交成功!')
                window.parent.getUserInfo()
            }

        })
    }


    // 重置按钮的点击事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 提交事件 修改用户基本信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        changeUserInfo()
    })
})




