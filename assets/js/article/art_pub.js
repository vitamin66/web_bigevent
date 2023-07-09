$(function () {
    var form = layui.form
    var layer = layui.layer

    // 富文本编译器
    initEditor()

    // 定义一个方法发请求拿数据 并渲染文章类别
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // 进行模板引擎的渲染
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 因为是用模板引擎动态生成的 layui 不一定监听得到变化 所以要调用form.render 方法 重新让layui渲染 
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面绑定点击事件 点击时触发 file input 框的点击事件 
    $('#select_cover').on('click', function () {
        $('#coverFile').click()
    })


    // 监听coverFile的change 事件 并把预览区的img 的src 重新赋值
    $('#coverFile').on('change', function (e) {
        // 通过事件对象拿到 e.target.files 这个暂存数组 用户选择图片会暂存到里面 通过数组的长度来判断用户是否选择了文件
        var files = e.target.files
        // 先判断 用户是否上传了图片
        if (files.length === 0) {
            // 如果没有 选择文件 return 出去即可
            return
        }
        // 如果没有return 出去说明选择了文件 这时候就要把文件转换为url 地址  URL.createObjectURL(files)
        var newImgURL = URL.createObjectURL(files[0])
        // 然后重新配置 $image
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#btnSave1').on('click', function () {
        art_state = '已发布'
    })

    // 给 form-pub 表单 添加submit 提交事件 用FormDate 拿到 表单里的值
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // new FormData() 方法可以拿到表单里的值 这是一个原生js方法 用前需要将元素转换成元素js对象
        var fd = new FormData($('#form-pub')[0])
        // fd.apped() 方法可以往 fd 里添加键值
        fd.append('state', art_state)

        // 将裁剪好的图片 输出成一个文件 对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作 把  blob 存储到 FormData 中
                fd.append('cover_img', blob)
            })

        publishArticle(fd)

    })
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 如果发起请求时 传入的数据 是 FormData 格式的 需要额外添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功！')
                // 跳转到 列表页
                location.href = './art_list.html'
            }
        })
    }
})
