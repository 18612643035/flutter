// pages/menu/menu.js
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:{"name":"退出登录"},
    url:[1500,3000,8000,4000,1600]
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
  onShow: function (options) {
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
          let data = [];
          //过滤掉没有的功能
          for(var i=0;i<res.data.data.length;i++){
            let id = res.data.data[i].id;
              if(_this.data.url.indexOf(id) != -1){
                data.push(res.data.data[i]);
              }
          }
          data.push({"name":"退出登录"});
          _this.setData(
            {
              dataList: data
            }
          )
        }
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
})