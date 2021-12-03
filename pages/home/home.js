var config = require('../../config')
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[{name:'23'}],
  },
  goFileup: function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onLoad: function(){
    let _this = this;
    wx.request({
        url: config.service.getAll,  
        data:{'name':'admin'},   
        method:"GET",    
        header:{"content-type":"application/json"},   
        success:function(res){ 
            console.log(res) 
            if(res.data){
              _this.setData({
                  allData:res.data.data,
              })
              console.log(_this.data.allData);
            }
        }
      })
  },

})