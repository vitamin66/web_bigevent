$(function () {
    var layer = layui.layer
    var form = layui.form
    getwzfl()
    // 定义一个获取文章分类的方法
    function getwzfl() {
        $('tbody').on('click', '#btn-edit', function () {
            var id = $(this).attr('data-edit-id')
            $.ajax({
                method: 'get',
                url: `/my/article/list/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('获取文章信息失败')
                    }
                    newres = res
                    // 拿到数据进行渲染
                    console.log(res.data)
                    setTimeout(function () {
                        location.href = './art_edit.html'
                    }, 100)
                    setTimeout(function () {

                        form.val("form-edit", res)
                    }, 200)
                }
            })
        })
    }
})
