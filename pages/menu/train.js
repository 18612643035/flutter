const config = require("../../config");
import Toast from '../../dist/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allData:[],
		http:{},
  },

  onLoad: function (options) {
    let _this = this;
    console.log(options)
    let data = JSON.parse(options.data);
		let httpData = {
			url: config.service.getByTrainLog,
			id: data.id,
			deleteUrl: app.config.service.trainLog
		};
    this.setData({
      allData: data,
      dict: app.dict,
      devices: app.device_type,
			http:httpData
    })
  },
	onShow(){
		this.setData({logShow:true})
	},
	onHide(){
		this.setData({logShow:false})
	},
  goFileup: function () {
    let data = {};
    data["submitUrl"] = "trainLog";
		data["id"] = this.data.allData.id;
    wx.navigateTo({
      url: './upLoad?list='+JSON.stringify(data),
    })
  },
	onPullDownRefresh:function(){//下拉刷新
	   this.onHide();
		 this.onShow();
	}
})