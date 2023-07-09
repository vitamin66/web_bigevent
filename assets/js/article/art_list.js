$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义一个过滤器用来美化时间
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 补零函数 拼接
    function padZero(date) {
        return date > 9 ? date : '0' + date
    }

    // 定义一个查询的参数对象 q 里面存的是数据 在每次发起请求的时候需要把 q 提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的id 
        state: '' // 文章发布的状态
    }
    // 当我点开这个页面 加载完毕后自动调用
    initTable()
    initCate()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 用模板引擎渲染列表数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 定义一个获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表数据失败')
                }
                // 通过模板引擎的方式渲染数据到 文章分类的下拉框
                var htmlStr = template('wzfl', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 给筛选按钮绑定提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()

        // 把对应的下拉框的值拿过来
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 赋值给q对象对应的属性
        q.cate_id = cate_id
        q.state = state
        // 赋值成功之后需要重新渲染页面 
        initTable()
    })

    // 定义一个渲染页码的函数
    function renderPage(total) {
        laypage.render({
            elem: 'laypage', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  // 每页显示的条数
            curr: q.pagenum,  // 默认起始页 
            // layout 页码属性 指向一个数组 默认是 ['prev','page','next'] 可以根据需求自定一下 layout属性
            // 其中 数组里值的顺序就是页面中 显示的顺序
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump(obj) 回调函数 obj.curr 可以拿到当前的页码值
            // obj.limit 可以拿到每页显示的条数
            jump: function (obj, first) {
                // 然后把页码值 和 每页显示的条数 赋值到 q 查询参数对象里
                q.pagenum = obj.curr
                // 把 obj.limit 重新赋值  给 q.pagesize 重新渲染 因为obj.limit 可以拿到用户选择的条目数
                q.pagesize = obj.limit
                // 然后重新获取一下数据 并进行渲染
                // 这里有个重点 必须要用first 首次不执行 因为只要执行了  laypage.render 就会执行jump回调 会造成死循环
                // 并不是只有切换页码时才会调 jump 函数 因为页面一打开并没切换页码 而也执行了 laypage.render
                // 所以要用 first 阻止第一次执行 jump 回调
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 给删除按钮绑定点击事件 用事件委托的形式 绑定
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到当前页码的页面中删除按钮的数量 因为一个删除按钮代表一条数据 当删除按钮的数量=== 1的时候
        // 说明页面中只有最后一条数据了 确认删除后会触发下面的请求 这时候 就需要将页码值 -1 并且重新渲染页面
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: `/my/article/delete/${id}`,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //  有一个bug  如果 最后从最后一页开始倒着删 会触发这个bug
                    // 页面中 数据删完后 不会重新渲染 但是页码值会变  这个变是假变 实际还是在当前页码 
                    // 可以利用这个特性 没删一条数据就判断当前页面中是否还有数据 如果还有就不做操作
                    // 如果为空 没有数据了 则把页码值 -1 并且重新调用 initTable 方法 渲染页面
                    if (len === 1) {
                        // 页码值最小必须是1 只有不等于 1 是才进行 -1 操作 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 注意 这里重新渲染的 方法 不能放在 if 里 需要放在外面
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})
