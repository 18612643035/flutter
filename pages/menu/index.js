const app = getApp();
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    allData:{current:1,data:[]},
    maintainAllData:{current:1,data:[]},
    trainAllData:{current:1,data:[]}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let _this = this;
    this.setData({
      dict: app.dict,
      devices: app.device_type
    });
		// setTimeout(function(){
		// 			 if(_this.data.allData.data.length ==0){
		// 			 	if(_this.data.maintainAllData.data.length !=0){
		// 			 		_this.setData({active:1})
		// 			 	}else if(_this.data.trainAllData.data.length !=0){
		// 			 		_this.setData({active:2})
		// 			 	}
		// 			 }
		// },2000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	this.init();
  },
  init(){
		let _this = this;
		this.setData({
		  allData:{current:1,data:[]},
		  maintainAllData:{current:1,data:[]},
		  trainAllData:{current:1,data:[]},
		})
		 this.getInstall();
		 this.getMaintain(); 
	   this.getTrain();
	},
  getInstall(e){
    let _this = this;
    let cru = e ? e : _this.data.allData.current;
    app.goRequest(app.config.service.pactPending,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = [..._this.data.allData.data, ...app.filter(res.data.data.records)]
            _this.setData({
                allData:db,
            })
          }
          else{
            Toast(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  getMaintain(e){
    let _this = this;
    let cru = e ? e : _this.data.maintainAllData.current;
    app.goRequest(app.config.service.myPendingPage,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = [..._this.data.maintainAllData.data, ...app.filter(res.data.data.records)]
            _this.setData({
              maintainAllData:db,
            })
          }
          else{
            Toast(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  getTrain(e){
    let _this = this;
    let cru = e ? e : _this.data.trainAllData.current;
    app.goRequest(app.config.service.trainPage,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = [..._this.data.trainAllData.data, ...app.filter(res.data.data.records)]
						
            _this.setData({
              trainAllData:db,
            })
          }
          else{
            Toast(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  onChange(e){
		this.setData({
		  active:e.detail.index
		})
		console.log(e)
		e.detail.index == 1 && this.data.maintainAllData.data.length==0 ? this.getMaintain() : "";
		e.detail.index == 2 && this.data.trainAllData.data.length==0 ? this.getTrain() : "";
		e.detail.index == 0 && this.data.allData.data.length==0 ? this.getInstall() : "";
		
  },
  redirectInstall(e){
    let data = this.data.allData.data[e.target.dataset.index];
    data = JSON.stringify(data);
    wx.navigateTo({
      url: './install?data='+data
    })  
  },
	redirectMaintain(e){
	  let data = this.data.maintainAllData.data[e.target.dataset.index];
	  data = JSON.stringify(data);
	  wx.navigateTo({
	    url: './maintain?data='+data
	  })  
	},
	redirectTrain(e){
	  let data = this.data.trainAllData.data[e.target.dataset.index];
	  data = JSON.stringify(data);
	  wx.navigateTo({
	    url: './train?data='+data
	  })  
	},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.active == 0) {
      if((this.data.allData.size*this.data.allData.current)>=this.data.allData.total){
        return;
      }
      this.getInstall(this.data.allData.current+1);
    }
  },onPullDownRefresh:function(){//下拉刷新
	    this.onLoad();
			this.onShow();
	}
})