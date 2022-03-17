// pages/menu/menu.js
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{"name":"退出登录"},

  },
  selectNav: function(e){
    // this.setData({
    //   curNav: e.target.dataset.index
    // })
    if(e.target.dataset.name == "退出登录"){
      wx.navigateTo({
        url: '../login/login'
      })
      wx.removeStorageSync('access_token');
      return;
    }
    wx.navigateTo({
      url: '../menu/menus?list='+JSON.stringify(e.target.dataset.list),
    })
  },
  selectBt: function(e){
    console.log(e.target)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: `${config.service.menu}`, 
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },  
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data && res.data?.data) {
          res.data.data.push({"name":"退出登录"});
          _this.setData(
            {
              dataList: res.data.data
            }
          )
        }
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})