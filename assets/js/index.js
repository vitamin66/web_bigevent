// $(function () {
//     getUserInfo()
//     var layer = layui.layer
//     $('#btnLogout').on('click', function () {
//         // 提示用户是否确认退出 
//         layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
//             // 确定退出登录后 需要清空本地存储 的 token 和 用户名
//             localStorage.clear()
//             // 跳转到登录页
//             location.href = './login.html'

//             layer.close(index);
//         });
//     })
// })



// // 获取用户的基本信息
// function getUserInfo() {
//     $.ajax({
//         method: 'get',
//         url: '/my/userinfo',
//         success: function (res) {
//             if (res.status !== 0) {
//                 return layui.layer.msg('用户身份认证失败');
//             }
//             console.log(res.data)
//             renderAvatar(res.data)
//             generateBlob(res.data)
//         },
//         complete: function (res) {
//             if (res.responseJSON.status === 1 && res.responseJSON.msg === '身份认证失败') {
//                 localStorage.clear();
//                 location.href = './login.html';
//             }
//         }
//     });
// }



// // 渲染用户头像函数
// function renderAvatar(user) {
//     var user_name = user[0].nickname || user[0].username;
//     $('.welcome').html(`欢迎 ${user_name}`);
//     if (user[0].user_pic !== null) {
//         $('.layui-nav-img').attr('src', user[0].user_pic).show();
//         $('.text-avatar').hide();
//     } else {
//         $('.layui-nav-img').hide();
//         var text_tx = user_name.charAt(0).toUpperCase();
//         $('.text-avatar').text(text_tx).show();
//     }
// }


// // 根据用户信息生成 Blob 对象
// function generateBlob(user) {
//     var user_pic = user[0].user_pic
//     if (user_pic !== null) {
//         var byteCharacters = atob(user_pic);
//         var byteArrays = [];

//         for (var i = 0; i < byteCharacters.length; i++) {
//             byteArrays.push(byteCharacters.charCodeAt(i));
//         }

//         var byteArray = new Uint8Array(byteArrays);
//         var blob = new Blob([byteArray], { type: 'image/png' }); // 根据图片格式动态设置 type 属性

//         return blob;
//     }
// }


$(function () {
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // 确定退出登录后 需要清空本地存储 的 token 和 用户名
            localStorage.clear();
            // 跳转到登录页
            location.href = './login.html';

            layer.close(index);
        });
    });
});

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户身份认证失败');
            }
            console.log(res.data);
            renderAvatar(res.data);
        },
        complete: function (res) {
            if (
                res.responseJSON.status === 1 &&
                res.responseJSON.msg === '身份认证失败'
            ) {
                localStorage.clear();
                location.href = './login.html';
            }
        }
    });
}

// 渲染用户头像函数
function renderAvatar(user) {
    var user_name = user[0].nickname || user[0].username;
    $('.welcome').html(`欢迎 ${user_name}`);
    if (user[0].user_pic !== null) {
        $('.layui-nav-img').attr('src', user[0].user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text_tx = user_name.charAt(0).toUpperCase();
        $('.text-avatar').text(text_tx).show();
    }

    // 调用 generateBlob() 函数
    var blob = generateBlob(user)
}


function generateBlob(user) {
    var user_pic = user[0].user_pic;
    if (user_pic !== null) {
        var blob = new Blob([user_pic.data], { type: 'image/png' });
        return blob;
    }
}
