let config = require('./config')
import {formatTime2} from './utils/util.js';
import Toast  from './dist/toast/toast';
import {
    goRequest
  } from './utils/request.js'
App({
    onLaunch: function () {
    },
    filter: function (data) {
        data.map(element => {
            element.finishTime == null ? element.finishTime = "无" : '';
            element.infoDeptContact == null || element.infoDeptPhone == "" ? element.infoDeptContact = "无" : '';
            element.endTime == null ? element.endTime = "无" : '';
            element.dealer == null || element.dealer == "" ? element.dealer = "无" : '';
						element.infoDeptPhone == null || element.infoDeptPhone == "" ? element.infoDeptPhone = "无" : '';
						element.deptName == null || element.deptName == "" ? element.deptName = "无" : '';
						element.deptContact == null || element.deptContact == "" ? element.deptContact = "无" : '';
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
		avatarUrl:'',
    goRequest:goRequest,
    device_type:[],
    Toast: Toast,
		formatTime2:formatTime2,
    config: config,
    onReach: function (item) {
        item.setData({
            curpage:item.data.curpage+1
          })
          item.onLoad();
    }
})