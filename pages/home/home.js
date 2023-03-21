var config = require('../../config');
import {
  goRequest
} from '../../utils/request.js'
import Notify from '../../dist/notify/notify';
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
    show: false,
    userShow:false,
    last: false,
    columns: ["1", "2", "3"],
    id: '',
    tabCur:0,
    images: [],
    imagesAll: [],
    name: '',
    active: 0,
    list: [],
    curpage: 1,
    empty:'none'
  },
  goFileup: function () {
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
    if (!token) {
      wx.navigateTo({
        url: '../login/login'
      })
      return
    } else {
      config.service.token = token;
    }
    this.getVlog(0); //查询所有Vlog
    this.getMy(); //查询自己Vlog
    this.init(); //获取用户客户信息
  },
  init: function() {
    let _this = this;
    goRequest({
      url: config.service.userInfo, //获取用户信息
      params: {},
      method: 'GET',
      header: {
        "content-type": "application/json",
        'Authorization': 'Bearer ' + config.service.token,
      },
    }).then(res => {
      console.log(res)
      _this.setData({
        user: res.data.data.sysUser,
        name: res.data.data.sysUser.name,
      })
    }).catch(function (e) {
      console.log(e);
    });
    goRequest({
      url: config.service.dict, //获取客户字典
      params: {},
      method: 'GET',
      header: {
        "content-type": "application/json",
        'Authorization': 'Bearer ' + config.service.token,
      },
    }).then(res => {
      console.log(res)
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
      console.log( app.dict);
      _this.setData({
        columns: col,
      })
    }).catch(function (e) {
      console.log(e);
    });
    wx.request({ //地区字典
      url: config.service.region,    
      method:"GET",   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            let dict = {};
            for (let i = 0; i < res.data.data.length; i++) {
              dict[res.data.data[i].value] = res.data.data[i].label;
            }
            config.regDict = dict;
          }else{
            toast.fail(res.data.msg);
          }
      }
    });
    wx.request({ //设备类型字典
      url: config.service.device_type,    
      method:"GET",   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            let col = [];
            let device_type = {};
            for (let i = 0; i < res.data.data.length; i++) {
              device_type[res.data.data[i].value] = res.data.data[i].label;
            }
            config.device_type = device_type;
          }else{
            toast.fail(res.data.msg);
          }
      }
    });
  },
  goMenu: function () { //打开菜单栏
    wx.reLaunch({
      url: '/pages/menu/menu',
    })
  },
  onRmove: function (e) { //删除vlog 
    let id = e.target.dataset.id;
    let _this = this;
    goRequest({
      url: config.service.deleteMy,
      params: {
        id: id
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + config.service.token,
      },
    }).then(res => {
      console.log(res)
        if (res.data?.code === 0) {
          Notify({
            type: 'success',
            message: '删除成功'
          });
          _this.getMy();
        } else {
          Notify({
            type: 'warning',
            message: res.data.msg
          });
        }
    }).catch(function (e) {
      console.log(e);
    });
  },
  previewImg: function (event) {
    console.log(event.currentTarget.dataset.presrc)
    let currentUrl = event.currentTarget.dataset.presrc;
    let images = this.data.imagesAll.concat(this.data.images);
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  },
  getVlog: function (page) {
    let _this = this;
    let data = {};
    data["page"] = page;
    this.data.id ? data["customerId"] = this.data.id : '';
    goRequest({
      url: config.service.getAll,
      params: data,
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + config.service.token,
      },
    }).then(res => {
      console.log(res)
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
        list: arr1,
        last: res.data.data.last
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
      console.log(e);
    });
  },
  onRemoveCur: function() {
    this.setData({
      id: '',
      list: []
    })
    this.getVlog(0);
  },
  getMy: function () {
    let _this = this;
    goRequest({
      url: config.service.getMy,
      params: {},
      method: 'GET',
      header: {
        "content-type": "application/json",
        'Authorization': 'Bearer ' + config.service.token,
      },
    }).then(res => {
      console.log(res)
      _this.setData({
        myData: res.data.data,
      })
      let images = [];
      for (let img in res.data.data) {
        for (let imgs in res.data.data[img].images) {
          images.push(res.data.data[img].images[imgs].url);
        }
      }
      let img1 = _this.data.images;
      let img2 = images;
      img1 = img1.concat(img2);
      _this.setData({
        images: img1,
      })
      console.log(_this.data.myData);
    }).catch(function (e) {
      console.log(e);
    });
  },
  onShow: function () {},
  userShow: function (e) { //选择客户弹窗
    this.setData({
      userShow: true,
    })
  },
  selectCus: function (e) { //选择客户弹窗
    let picker = this.selectComponent(".picker");
    picker.setColumnIndex(0, 0); //设置默认索引
    this.setData({
      show: true,
      id: this.data.columns[0].id,
    })
  },
  onTab: function(e) { //切换列表
    e.detail.index == 0 ? this.getVlog(0) : this.getMy();
    this.setData({
      tabCur:e.detail.index
    })
  },
  onReachBottom: function () { //下拉刷新
    if (this.data.last || this.data.tabCur) {
      return;
    }
    this.getVlog(this.data.curpage + 1);
  },
  onChange(event) { ///更改客户
    const {
      value
    } = event.detail;
    this.setData({
      list: [],
      id: value.id
    })
  },
  complete(event) { //
    this.setData({
      list: []
    })
    this.getVlog(0);
  },
})