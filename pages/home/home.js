var config = require('../../config');
import {
  goRequest
} from '../../utils/request.js'
import Notify from '../../dist/notify/notify';
// import { json } from 'stream/consumers';
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData: [{
      name: '23'
    }],
    user:[],
    myData: [],
    userShow:false,
    last: false,
    images: [],
    imagesAll: [],
    curpage: 1,
    avatarUrl:'',
    userInfo:"",
    list:[],
  },
  goFileup: function () {
    let data = {};
    data["upfilesUrl"] = "upFiles";
    data["submitUrl"] = "upFiles";
    wx.navigateTo({
      url: '/pages/index/index?list='+JSON.stringify(data),
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onLoad: function () {
    const _this = this;
    let token = wx.getStorageSync('access_token');
    if (!token) {
      wx.navigateTo({
        url: '../login/login'
      })
      return
    } else {
      config.service.token = token;
    }
    this.getVlog(0); //查询所有Vlog
    this.init(); //获取用户客户信息
  },
  init: function() {
    let _this = this;
    goRequest(config.service.userInfo,{},'GET',{},).then(res => { //获取用户信息
      _this.setData({
        user: res.data.data.sysUser
      })
      if(!res.data.data.sysUser.avatar){
        _this.getUserInfo();
      }
    }).catch(function (e) {
    });
    goRequest(config.service.dict,{},'GET',{},).then(res => {//获取客户信息
      let col = [];
      let dict = {};
      for (let i = 0; i < res.data.data.length; i++) {
        dict[res.data.data[i].id] = res.data.data[i].name;
        col.push({
          "text": res.data.data[i].name,
          "id": res.data.data[i].id,
          "value": res.data.data[i].id
        });
      }
      let app = getApp();
      app.dict = dict;
      config.dict = dict;
      config.dictCol = col;
    }).catch(function (e) {
    });
    
    goRequest(config.service.device_type,{},'GET',{},).then(res => {//设备类型字典
      if(res.data.code == 0){
        let col = [];
        let device_type = {};
        for (let i = 0; i < res.data.data.length; i++) {
          device_type[res.data.data[i].value] = res.data.data[i].label;
        }
        getApp().device_type = device_type;
      }else{
        toast.fail(res.data.msg);
      }
    }).catch(function (e) {
    });
  },
  getUserInfo(e){
    let _this = this;
    wx.getStorage({//异步获取缓存
      key:"name",//本地缓存中指定的 key
      success:(res)=>{      
          _this.setData({
               avatarUrl:res.data.avatarUrl         
          })
          _this.updateAvatar(res.data.avatarUrl);        
      },
      fail(res){
          wx.showModal({
              title: '感谢您使用！',
              content: '请允许小程序可以使用您的头像和名字！',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  _this.getUserProfile()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
        }
      }); 
  },
  updateAvatar(url){
    let _this = this;
    let data = {};
    data.avatar = url;
    wx.request({
      url: config.service.updateAvatar, //获取用户头像
      data:  data,
      method: 'POST',
      header: {
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + config.service.token,
      },
      success:function(res){ 
      }
    })
  },
  getUserProfile(e) { 
    let _this = this;
    wx.getUserProfile({
      desc: '用于保存用户的头像', 
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          
        })
        wx.setStorage({
            key:'name',//本地缓存中指定的 key(类型：string)
            data:res.userInfo,//需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
            success:(s)=>{  
                this.setData({
                    avatarUrl:res.userInfo.avatarUrl,         
                })
                _this.updateAvatar(res.data.avatarUrl);   
            },
            fail:(f)=>{  

            }
        })
      }
    })
  },
  goMenu: function () { //打开菜单栏
    wx.reLaunch({
      url: '/pages/menu/menu',
    })
  },
  onRmove: function (e) { //删除vlog 
    let id = e.target.dataset.id;
    let _this = this;
    goRequest(config.service.deleteMy,{"id": id},'POST',{"type":"application/x-www-form-urlencoded"},).then(res => {
        if (res.data?.code === 0) {
          Notify({
            type: 'success',
            message: '删除成功'
          });
          _this.onLoad();
        } else {
          Notify({
            type: 'warning',
            message: res.data.msg
          });
        }
    }).catch(function (e) {
    });
  },
  previewImg: function (event) {//缩略图放大
    let currentUrl = event.currentTarget.dataset.presrc;
    let images = this.data.imagesAll.concat(this.data.images);
    wx.previewImage({
      current: currentUrl, 
      urls: images
    })
  },
  getVlog: function (page) {
    let _this = this;
    let data = {};
    data["page"] = page;
    this.data.id ? data["customerId"] = this.data.id : '';
    goRequest(config.service.getAll,data,'GET',{},).then(res => {//vlog数据
      if (res.data.code == 401) {
        _this.rToken();
      }
      let arr1 = [];
      res.data.data.number == 0 ? "" : arr1 = _this.data.list;
      let arr2 = res.data.data.content;
      arr1 = arr1.concat(arr2);
      _this.setData({
        allData: arr1,
        curpage: res.data.data.number,
        last: res.data.data.last,
        list: arr1
      })
      let images = [];
      for (let img in res.data.data.content) {
        for (let imgs in res.data.data.content[img].images) {
          images.push(res.data.data.content[img].images[imgs].url);
        }
      }
      let img1 = _this.data.imagesAll;
      let img2 = images;
      img1 = img1.concat(img2);
      _this.setData({
        imagesAll: img1,
      })
    }).catch(function (e) {
    });
  },
  onShow: function () {
    this.getVlog(0); //查询所有Vlog
  },
  onReachBottom: function () { //下拉刷新
    if (this.data.last) {
      return;
    }
    this.getVlog(this.data.curpage + 1);
  }
})