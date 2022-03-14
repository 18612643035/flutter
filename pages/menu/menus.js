// pages/menu/menus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{"name":"11"},
    url:{"1502":"system/client/addClient","1503":"system/client/auditClient","1501":"system/client/queryClient",
        "3200":"system/pact/auditPact","3500":"system/pact/toPending","3300":"system/pact/toPlan"},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.list));
    this.setData({
      dataList: JSON.parse(options.list)
    })
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
  goMenu: function(e){
    console.log(e.target.dataset.src);
    wx.navigateTo({
      url: "../"+this.data.url[e.target.dataset.src],
    })
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