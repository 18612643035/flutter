const config = require("../../config");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allData:[],
		maintenanceData:[],
		http:{}
  },

  onLoad: function (options) {
    let _this = this;
    console.log(options)
    let data = JSON.parse(options.data);
		let httpData = {
			url: config.service.getByInstall,
			id: data.id,
			deleteUrl:app.config.service.maintenanceLog
		};
    this.setData({
      allData: data,
      dict: app.dict,
      devices: app.device_type,
			http: httpData
    })
  },
  goFileup: function () {
    let data = {};
    data["submitUrl"] = "maintenanceLog";
		data["id"] = this.data.allData.id;
    wx.navigateTo({
      url: './upLoad?list='+JSON.stringify(data),
    })
  },

})