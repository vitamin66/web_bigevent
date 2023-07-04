$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 上传文件的点击事件
    // 这步具体的实现思路是在页面中写一个 input type=file 上传文件框 然后隐藏掉 点击上传按钮时触发上传文件框
    $('#btnUpload').on('click', function (e) {
        e.preventDefault()
        $('#file').click()
    })

    // 给隐藏的input框绑定一个 change事件 用户选择好文件后触发
    $('#file').on('change', function (e) {
        // 先进行一个判断
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片')
        }
        // 通过事件对象里的 e.targer.files 可以拿到用户上传的文件 是一个伪数组
        var file = e.target.files[0]
        // 然后调用 url.createObjectURL 方法把用户上传的文件 转换为 url 地址 
        var newImgUrl = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 摧毁旧的裁剪区
            .attr('src', newImgUrl) // 更改 url 进行显示
            .cropper(options) // 重新初始化裁剪区域

    })

    // 给确定按钮绑定点击事件 触发时 获取裁剪区的头像并转换成 base64 格式的数据 然后发起ajax请求上传
    $('#queding').on('click', function (e) {
        e.preventDefault();
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 上传头像请求
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传失败');
                }

                // 成功之后需要提示用户并且重新获取用户信息并渲染到页面
                layer.msg('上传成功');
                window.parent.getUserInfo();
            }
        });
    });

})
