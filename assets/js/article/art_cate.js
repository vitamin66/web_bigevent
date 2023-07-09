$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过事件委托为 form-add表单绑定 submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: {
                name: $('#wzmc').val(),
                alias: $('#wzbm').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                // 调用获取文章列表方法 并渲染到页面
                initArtCateList()
                // 提示消息
                layer.msg('新增分类成功')
                // 关闭弹出层 根据 layer.open() 方法的返回值 关闭
                layer.close(indexAdd)
            }

        })
    })

    // 给编辑按钮绑定点击事件(由于编辑按钮是动态生成的所以需要用事件委托的形式绑定事件) 触发时打开弹出层 并且渲染出内容
    var indexEdit
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 获取编辑按钮的id 是自定义属性 根据之前获取文章类别的时候的数据 的id来给的
        // 目的是让 每一个编辑按钮对应上 他那条数据的 id 从而找到联系并渲染到编辑表单
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'get',
            url: `/my/article/cates/${id}`,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章信息失败')
                }
                // 给表单赋值
                $('#wzid').val(res.data[0].id)
                $('#xgmc').val(res.data[0].name)
                $('#xgbm').val(res.data[0].alias)
            }
        })
    })

    // 通过事件委托为 表单绑定submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: {
                id: $('#wzid').val(),
                name: $('#xgmc').val(),
                alias: $('#xgbm').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                console.log(res)
                layer.msg('更新分类数据成功')
                // 关闭弹出层
                layer.close(indexEdit)
                // 重新渲染页面
                initArtCateList()
            }
        })
    })


    // 通过事件委托的形式给 删除按钮绑定点击事件
    $('tbody').on('click', ".btn-delete", function () {
        // 然后拿到当前删除按钮对应数据的id 跟编辑按钮同理 需要用到自定义属性 data-id
        var id = $(this).attr('data-id')
        // 然后要弹出提示框 提示用户 
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: `/my/article/deletecate/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })


        });
    })
})
