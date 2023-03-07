/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
//var ip = 'https://www.madecloud.net:7012';
var ip = 'http://192.168.0.250';
var host = ip+'/contract';
var user = ip+'/auth';
var client = ip+'/contract';
var admin = ip+'/admin';
var maintain = ip+'/contract';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        getAll: `${host}/vlog/getAll`,
        getMy: `${host}/vlog/getMy`,
        deleteMy: `${host}/vlog/delete`,
        // 上传图片 上传视频
        upFiles: `${host}/vlog/addFile`,
        conText: `${host}/vlog/save`,
        login: `${user}/oauth/token`,
        phone: `${user}/sms/send`,
        addObj: `${client}/customer`,
        dict: `${client}/customer/dict`,//客户字典
        queryObj: `${client}/customer/myPage`, //我的客户列表
        queryAll: `${client}/customer/officialCustomer`, //所有客户列表
        userPending: `${client}/customer/pending`, //待审核客户
        userPass: `${client}/customer/pass`, //审核不通过
        userFail: `${client}/customer/fail`, //审核通过
        userSubmit: `${client}/customer/submit`, //提交审核
        userSearch: `${client}/customer/customerDictByName`, //搜索客户
        userInfo: `${admin}/user/info`, //用户信息
        menu: `${admin}/menu`,//用户菜单
        role: `${admin}/user/list`,//获取指派人列表
        pendingList: `${client}/contract/pendingList`,//合同列表
        details: `${client}/contract/details`,//合同详情
        approved: `${client}/contract/approved`,//合同通过
        denied: `${client}/contract/denied`,//合同不通过
        pactPending: `${client}/contractInstall/pending`,//待处理合同安装任务
        planningList: `${client}/contract/planningList`,//合同待计划列表
        pactPage: `${client}/contract/inProcessList`,//合同进行中列表
        finishedList: `${client}/contract/finishedList`,//合同已完成列表
        pay: `${client}/contractPayment/page`,//合同付款记录
        haspay: `${client}/contract/completePaymentList`,//已付款列表
        updatePayStatus: `${client}/contractPayment/updatePayStatus`,//合同付款记录状态
        paymentList: `${client}/contract/paymentList`,//待付款列表
        
        contractPlan: `${client}/contractInstall/finish`,//完成安装任务
        startPact: `${client}/contract/start`,//启动计划
        closed: `${client}/contract/closed`, //关闭合同
        cservicePending: `${maintain}/customersupport/pending`, //获取待指派客服记录列表
        cservicePage: `${maintain}/customersupport/page`, //获取客服记录列表
        cserviceSave: `${maintain}/customersupport`, //新增客服记录列表
        cserviceTodu: `${maintain}/customersupport/myTodo`, //获取待处理客服记录列表
        closeCus: `${maintain}/customersupport/close`, //关闭客服记录
        cvisitPage: `${maintain}/returnVisit/page`, //回访记录列表
        vClose: `${maintain}/returnVisit/close`, //关闭回访记录
        maintenance: `${maintain}/maintenance`, //创建维保
        maintenancePage: `${maintain}/maintenance/myPage`, //新增维保列表
        apending: `${maintain}/maintenance/pending`, //待指派维保列表
        assign: `${maintain}/maintenance/assign`, //指派给指定维保
        cassign: `${maintain}/customersupport/assign`, //指派给指定客服
        aservicemy:`${maintain}/maintenance/my`, //当前待处理维保
        aclose:`${maintain}/maintenance/close`, //关闭维保
        log:`${maintain}/maintenanceLog`, //新增维保日志
        showLog:`${maintain}/maintenanceLog/page`, //查询维保日志
        deleteLog:`${maintain}/maintenanceLog`, //删除维保日志
        plog:`${maintain}/contractPlanLog`, //合同计划日志
        pshowLog:`${maintain}/contractPlanLog/page`, //查询合同计划日志
        aserviceDone:`${maintain}/maintenance/page`, //维保列表
        inmProcess:`${maintain}/maintenance/inProcess`, //进行中维保
        showDev:`${maintain}/contractDevice/page`, //查询合同设备
        clientDev:`${maintain}/contractDevice/deviceTypeDictByCustomer`, //根据客户查设备类型
        numberDev:`${maintain}/contractDevice/deviceDictByCustomerAndType`, //根据设备类型查编号
        deleteDev:`${maintain}/contractDevice`, //设备
        devDetails:`${maintain}/contractDevice/getDetails`, //设备详情
        region:`${admin}/dict/type/customer_region`, //获取地区
        device_type:`${admin}/dict/type/device_type`, //设备类型字典
    },
    token:'',
    dict:'',//医院字典
    regDict:'',//地区字典
    device_type:'',//
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
			}
		}
};


module.exports = config;
