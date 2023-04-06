const app = getApp();
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
    this.setData({
      dict: app.dict,
      devices: app.device_type
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      allData:{current:1,data:[]},
      maintainAllData:{current:1,data:[]},
      trainAllData:{current:1,data:[]},
      active:0
    })
    this.getInstall();
  },
  getInstall(e){
    let _this = this;
    let cru = e ? e : _this.data.allData.current;
    app.goRequest(app.config.service.pactPending,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            res.data.data.records.length?'':app.Notify('暂无更多数据');
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = _this.data.allData.data.concat(app.filter(res.data.data.records))
            _this.setData({
                allData:db,
            })
          }
          else{
            app.Notify(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  getMaintain(e){
    let _this = this;
    let cru = e ? e : _this.data.maintainAllData.current;
    app.goRequest(app.config.service.myPendingPage,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            res.data.data.records.length?'':app.Notify('暂无更多数据');
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = _this.data.maintainAllData.data.concat(app.filter(res.data.data.records))
            _this.setData({
              maintainAllData:db,
            })
          }
          else{
            app.Notify(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  getTrain(e){
    let _this = this;
    let cru = e ? e : _this.data.trainAllData.current;
    app.goRequest(app.config.service.trainPage,{ current:cru},'GET',{},).then(res => {
          if(res.data?.data?.records){
            res.data.data.records.length?'':app.Notify('暂无更多数据');
            let db =  {};
            db["total"] = res.data.data.total
            db["size"] = res.data.data.size
            db["current"] = res.data.data.current
            db["data"] = _this.data.trainAllData.data.concat(app.filter(res.data.data.records))
            _this.setData({
              trainAllData:db,
            })
          }
          else{
            app.Notify(res.data.message);
          }  
      }).catch(function (e) {
    });
  },
  onChange(e){
		this.setData({
		  active:e.detail.index
		})
		e.detail.index == 0 ? this.getInstall() : "";
		e.detail.index == 1 ? this.getMaintain() : "";
		e.detail.index == 2 ? this.getTrain() : "";
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
  }
})