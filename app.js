let config = require('./config')
import Notify from './dist/notify/notify';
import {
    goRequest
  } from './utils/request.js'
App({
    onLaunch: function () {
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
            element.trainTime  == null ? element.trainTime = "无" : '';
            
        });
        return data;
    },
    menuFormat:function(data) { //下拉菜单数据格式
        data.map((e) => {
            e["text"] = e.name ? e.name : e.label;
            e["value"] = e.code ? e.code : e.value;
        })
        return data;
    },
    dict:[],
    goRequest:goRequest,
    device_type:[],
    Notify: Notify,
    config: config,
    onReach: function (item) {
        item.setData({
            curpage:item.data.curpage+1
          })
          item.onLoad();
    }
})