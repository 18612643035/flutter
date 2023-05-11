/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var ip = 'https://www.madecloud.net:7012';
var ip = 'https://mgr.madecloud.net';
//var ip = 'http://192.168.0.250';
var host = ip+'/contract';
var user = ip+'/auth';
var admin = ip+'/admin';


var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getAll: `${host}/vlog/getAll`,//获取VLOG数据
        deleteMy: `${host}/vlog/delete`,//删除VLOG数据
        updateAvatar:`${admin}/user/updateAvatar`,//上传用户头像
        cityDict:`${host}/customer/cityDict`, //获取市
				trainLog:`${host}/trainLog`,//添加培训记录
				maintenanceLog:`${host}/maintenanceLog`,//维保日志
				getByMaintenance:`${host}/maintenanceLog/getByMaintenance`,//维保日志查询
				installLog:`${host}/installLog`,//添加安装记录
        provinceDict: `${host}/customer/provinceDict`,//获取省
        pactPending: `${host}/contractInstall/pendingInstall`,//待处理合同安装任务
				trainPage: `${host}/contractInstall/pendingTrain`,//添加安装任务培训记录列表
        dealerDict: `${host}/dealer/dict`,//经销商字典 
        userSearch: `${host}/customer/customerDictByName`, //搜索客户
        conText: `${host}/vlog/save`,//新增VLOG
        upLoad: `${host}/file/upload`, // 完成任务上传
				uploadAvatar: `${host}/file/uploadAvatar`, // 头像上传
        upFiles: `${host}/vlog/addFile`,//vlog上传
        login: `${user}/oauth/token`,//微信手机号登录
        userInfo: `${admin}/user/info`, //用户信息
        dict: `${host}/customer/dict`,//客户字典
        device_type:`${admin}/dict/type/device_type`, //设备类型字典
        phone: `${user}/sms/send`,//发送验证码
				getByInstallLog: `${host}/installLog/getByInstall`,//查询培训记录
				getByTrainLog: `${host}/trainLog/getByInstall`,//查询培训记录
        myPendingPage:`${host}/maintenance/myPendingPage`,//维保日志
				finishInstall:`${host}/contractInstall/finishInstall`,//完成安装
				finishTrain:`${host}/contractInstall/finishTrain`,//完成培训
				maintenanceClose:`${host}/maintenance/close`,//完成维保
				getDateInfo:`${host}/maintenance/getDeviceInfo`,//维保设备详情
    },
    token:'',
    dict:'',//医院字典
    regDict:'',//地区字典
    dictCol:[],//地区字典集合
    device_type:'',//设备类型字典
		check:{
			//手机号验证
			testMobileNo(s) {
			    var pattern = /^[1][3-9]\d{9}$/
					if(!pattern.test(s)){
						wx.showModal({
						  title: '提示',
						  content: '手机号格式错误',
						  showCancel: false
						});
						return false;
					}else{
						return true;
					}
			  },
			//非空验证
			testNull(s,text){
				if(s == '' || s == null){
					wx.showModal({
					  title: '提示',
					  content: text+'不能为空',
					  showCancel: false
					});
					return false;
				}
				else{
					return true;
				}
			},
			//特殊字符验证
			testFont(s){
				if (/[<>*{}()^%$#@!~&= ]/.test(self.data.roomName)) {
				      wx.showModal({
				        title: '提示',
				        content: '名称不能为空或包含特殊字符',
				        showCancel: false
				      });
				      return false;
				}
				else{
					return true;
				}
      },
      //综合验证
      verify(isNullData){
        if(isNullData !==""){
          for(let key in isNullData){
            let test =  this.testNull(isNullData[key].value,isNullData[key].text);
            if(!test){
              return false;
            }
            else if(isNullData[key].isMobile){
              if(!this.testMobileNo(isNullData[key].value)){
                return false;
              }
            }
          }   
        }
        return true;
      }
    }
};


module.exports = config;
