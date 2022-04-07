var config = require('../../config');
import Notify from '../../dist/notify/notify';
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[{name:'23'}],
    myData:[],
    images: [],
    name:'',
    active:1
  },
  goFileup: function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onLoad: function () {
    const _this = this;
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
      url: config.service.userInfo,  //获取用户信息  
      method:"GET",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.dta?.sysUser){
            _this.setData({
                name:res.data.data.sysUser.name,
            })
          }
      }
    })
  },
  goMessage: function(){
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  goMenu: function(){ //打开菜单栏
    wx.reLaunch({
      url: '/pages/menu/menu',
    })
  },
  onRmove: function(e){ //删除vlog 
    let id = e.target.dataset.id;
    wx.request({ 
      url: config.service.deleteMy,  //获取用户信息  
      method:"POST",    
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        id:id
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.code === 0){
            Notify({ type: 'success', message: '删除成功' });
            wx.reLaunch({
              url: '/pages/home/home',
            })
          }else{
            Notify({ type: 'warning', message: res.data.msg});
          }
      }
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
    wx.request({
        url: config.service.getAll,//获取所有VLOG列表  
        method:"GET",    
        header:{
            "content-type":"application/json",
            'Authorization': 'Bearer '+config.service.token,
        },   
        success:function(res){ 
            console.log(res) 
            if(res.data.code == 0){
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
            else if(res.data.code == 401){
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
        },
        fail: function (res) {
          console.log(res)
        }
      });
      wx.request({
        url: config.service.getMy,//获取个人VLOG列表  
        method:"GET",    
        header:{
            "content-type":"application/json",
            'Authorization': 'Bearer '+config.service.token,
        },   
        success:function(res){ 
            console.log(res) 
            if(res.data.code == 0){
              _this.setData({
                myData:res.data.data,
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
              console.log(_this.data.myData);
            }
        },
        fail: function (res) {
          console.log(res)
        }
      });
  },

})