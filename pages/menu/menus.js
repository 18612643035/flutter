// pages/menu/menus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{"name":"11"},
    url:{"1502":"system/client/addClient","1503":"system/client/auditClient","1501":"system/client/queryClient",
        "3200":"system/pact/auditPact","3500":"system/pact/toPending","3300":"system/pact/toPlan","8200":"system/cservice/crecord",
        "8400":"system/cservice/cvisit","4200":'system/aservice/pending',"4400":"system/aservice/dispose",
        "8300":"system/cservice/todo"
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.list));
    let option = JSON.parse(options.list);
    let data = [];
    //过滤掉没有的功能
    for(var i=0;i<option.length;i++){
      let id = option[i].id;
        if(this.data.url[id]){
          data.push(option[i]);
        }
    }
    this.setData({
      dataList: data
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