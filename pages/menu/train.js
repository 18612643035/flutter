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
    currentDate: new Date().getTime(),
		curTime:'',
		time:'',
		show:false,
		showDev:false,
		showDev:false,
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
    let data = JSON.parse(options.data);
		let httpData = {
			url: app.config.service.getByTrainLog,
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
		if(app.previewImg){
			app.previewImg = false;
			return;
		}
		this.setData({logShow:true});
	},
	onHide(){
		if(app.previewImg){
			return;
		}
		this.setData({logShow:false});
	},
  findTime(e){
		this.setData({show:true})
	},
   showDevice(e){
		this.setData({
			showDev: true,
		});
	},
	onInput(event) {
		this.setData({
		  curTime: event.detail,
		});
	},
  find(e){
		let _this = this;
		let data = [];
		data["id"] = _this.data.allData.id;
		data["trainTime"] = app.formatTime2(new Date(_this.data.curTime));
		app.goRequest(app.config.service.finishTrain,data,'POST',{},).then(res => {
				Toast({
					message: "完成",
					forbidClick: true,
					onClose: () => {
						wx.navigateBack();
					}
				});
		  }).catch(function (e) {
						app.Toast(e.msg);
		});
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