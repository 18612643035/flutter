var config = require('../../config');
import Notify from '../../dist/notify/notify';
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[{name:'23'}],
    images: []
  },
  goFileup: function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.request({ 
      url: config.service.userInfo,  //获取用户信息  
      method:"GET",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
      }
    })
  },
  goMessage: function(){
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  goMenu: function(){
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },
  previewImg: function(event){
    console.log(event.currentTarget.dataset.presrc)
    let currentUrl = event.currentTarget.dataset.presrc
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },
  onShow: function(){
    let _this = this;
    let token = wx.getStorageSync('access_token');
    console.log(token);
    if(!token){
      wx.navigateTo({
        url: '../login/login'
      })  
    }
    else{
      config.service.token = token;
    }
    wx.request({
        url: config.service.getAll,//获取VLOG列表  
        method:"GET",    
        header:{
            "content-type":"application/json",
            'Authorization': 'Bearer '+config.service.token,
        },   
        success:function(res){ 
            console.log(res) 
            if(res.data){
              if(res.data.code == 401){
                let token = wx.getStorageSync('refresh_token');
                wx.request({
                  url: `${config.service.login}`,
                  data: {
                    username: '',
                    grant_type: 'refresh_token',
                    smsCode: '',
                    refresh_token:token
                  }, 
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                   // "Cookie": sessionId,
                    "Accpet": "application/json",
                    'Authorization': 'Basic dGVzdDp0ZXN0'
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    if (res.data && res.data.access_token) {
                      wx.setStorageSync('access_token', res.data.access_token);
                      wx.setStorageSync('refresh_token', res.data.refresh_token);
                      config.service.token = res.data.access_token;
                      Notify({ type: 'success', message: 'token验证成功' });
                      _this.onShow();
                    } else {
                      Notify({ type: 'warning', message: 'token验证失败' });
                      wx.removeStorageSync('access_token');
                      wx.navigateTo({
                        url: '../login/login'
                      })
                    }
                   
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              }
              _this.setData({
                  allData:res.data.data,
              })
              let images = [];
              for(let img in res.data.data){
                for(let imgs in res.data.data[img].images){
                  images.push(res.data.data[img].images[imgs].url);
                }
              }
              console.log(images);
              _this.setData({
                  images:images,
              })
              console.log(_this.data.allData);
            }
        },
        fail: function (res) {
          console.log(res)
        }
      });
  },

})