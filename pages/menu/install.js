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
		http: {},
		logShow:false,
		currentDate: new Date().getTime(),
		curTime:'',
		time:'',
		show:false,
		minDate: new Date(2000, 10, 1).getTime(),
		maxDate: new Date(2030, 10, 1).getTime(),
		formatter(type, value) {
		  if (type === 'year') {
		    return `${value}年`;
		  }
		  if (type === 'month') {
		    return `${value}月`;
		  }
		  return value;
		}
  },

  onLoad: function (options) {
    let _this = this;
    console.log(options)
    let data = JSON.parse(options.data);
		let httpData = {
			url: config.service.getByInstallLog,
			id: data.id,
			deleteUrl:app.config.service.installLog
		};
    this.setData({
      allData: data,
      dict: app.dict,
      devices: app.device_type,
			http: httpData
    })
  },
	onShow(){
		this.setData({logShow:true});
	},
	onHide(){
		this.setData({logShow:false});
	},
	onInput(event) {
	  this.setData({
	    curTime: event.detail,
	  });
	},
	findTime(e){
		this.setData({show:true})
	},
	find(e){
		let _this = this;
		let data = [];
		data["id"] = _this.data.allData.id;
		data["finishTime"] = app.formatTime2(new Date(_this.data.curTime));
		console.log("finishTime",data.finishTime)
		console.log(data.id)
		app.goRequest(app.config.service.finishInstall,data,'POST',{},).then(res => {
				Toast({
					message: "完成",
					forbidClick: true,
					onClose: () => {
						wx.navigateBack();
					}
				});
		  }).catch(function (e) {
						Toast(e.msg);
		});
	},
  goFileup: function () {
    let data = {};
    data["id"] = this.data.allData.id;
    data["submitUrl"] = "installLog";
    wx.navigateTo({
      url: './upLoad?list='+JSON.stringify(data),
    })
  },
	onPullDownRefresh:function(){//下拉刷新
	   this.onHide();
		 this.onShow();
	}
})