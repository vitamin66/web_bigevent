$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中获取 form对象
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 自定义 密码 必须在6-12位 并且不能有空格
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // value 就是确认密码框的值
            // 再拿到 密码框的值 进行比较即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#from_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1/my/signin',
            data: {
                username: $('#from_reg [name=username]').val(),
                password: $('#from_reg [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.meesage)
                }
                layer.msg('注册成功,请登录')
                $('#from_reg [name=username]').val('')
                $('#from_reg [name=password]').val('')
                $('#from_reg [name=repassword]').val('')
                $('#link_login').click()
            }
        })
    })


    // 监听登录表单的提交事件
    $('#from_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://127.0.0.1/my/login',
            data: {
                username: $('#from_login [name=username]').val(),
                password: $('#from_login [name=password]').val()
            },
            success: function (res) {
                if (res.status === 1) {
                    return layer.msg(res.meesage)
                } else if (res.status === 2) {
                    return layer.msg(res.meesage)
                }
                layer.msg('登录成功')
                // 把用户名也存到本地存储中 登录成功跳转之后还需要使用
                localStorage.setItem('username', $('#from_login [name=username]').val())
                // 把token 存到本地存储中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = './index.html'
            }
        })
    })


})
