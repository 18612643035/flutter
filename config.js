/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://192.168.0.183:2119';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getAll: `${host}/vlog/getAll`,
        // 上传图片 上传视频
        upFiles: `${host}/vlog/addFile`,
        conText: `${host}/vlog/save`,
    }
};

module.exports = config;
