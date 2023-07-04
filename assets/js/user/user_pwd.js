$(function () {
    // 表单验证 新密码框的值必须和确认新密码框的值 一样 同时必须符合正则的规则
    // 从layui中获取 form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 自定义 密码 必须在6-12位 并且不能有空格
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],


        // 校验新旧密码是否一致的规则
        samePwd: function (value) {
            if (value === $('#oldpwd').val()) {
                return '新旧密码不能相同!'
            }
        },

        // 校验两次密码是否一致的规则
        renewpwd: function (value) {
            // value 就是确认密码框的值
            // 再拿到 密码框的值 进行比较即可
            var newpwd = $('#newpwd').val()
            if (newpwd !== value) {
                return '两次密码不一致'
            }
        },
    })


    var timer = setTimeout
    // 给 layui-form 表单绑定一个submit 提交事件 并阻止默认提交行为
    // 然后发起ajax请求 修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 发起 ajax 请求
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            contentType: 'application/json',
            data: JSON.stringify({
                oldPwd: $('#oldpwd').val(),
                newPwd: $('#newpwd').val()
            }),
            success: function (res) {
                if (res.status === 3) {
                    return layer.msg('原密码输入错误')
                } else if (res.status === 1) {
                    return layer.msg('密码修改失败请稍后重试')
                } else if (res.status === 0) {
                    layer.msg('密码修改成功,请重新登录')
                    $('.layui-form')[0].reset()
                    setTimeout(function () {
                        clearTimeout(timer)
                        localStorage.clear()
                        window.parent.location.href = '../login.html'
                    }, 2000)
                }
            },
            complete: function () {
                clearTimeout(timer)
            }
        })
    })
})
