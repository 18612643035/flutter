//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    filter: function (data) {
        data.map(element => {
            element.finishTime == null ? element.finishTime = "无" : '';
            element.startTime == null ? element.startTime = "无" : '';
            element.endTime == null ? element.endTime = "无" : '';
            element.updateTime == null ? element.updateTime = "无" : '';
            element.actualTime  == null ? element.actualTime = "无" : '';
            element.planTime  == null ? element.planTime = "无" : '';
            element.createTime  == null ? element.createTime = "无" : '';
            element.customer == null ? element.customer = "无" : '';
            element.remarks  == null ? element.remarks = "无" : '';
        });
        return data;
    },
    dict:[],
    onReach: function (item) {
        // if (item.data.last) {
        //     return;
        //   }
        item.setData({
            curpage:item.data.curpage+1
          })
          item.onLoad();
    }
})