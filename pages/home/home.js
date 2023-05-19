var config = require('../../config');
import {
  goRequest
} from '../../utils/request.js'
import Toast from '../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData: [],
    user:[],
    myData: [],
    userShow:false,
    last: false,
    images: [],
    imagesAll: [],
    curpage: 1,
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
        app.avatarUrl = res.data.data.sysUser.avatar;
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
        Toast(res.data.msg);
      }
    }).catch(function (e) {
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
    goRequest(config.service.deleteMy,{"id": id},'POST',{"type":"application/x-www-form-urlencoded"},).then(res => {
        if (res.data?.code === 0) {
          Toast('删除成功');
          _this.onLoad();
        } else {
          Toast('失败');
        }
    }).catch(function (e) {
    });
  },
  previewImg: function (event) {//缩略图放大
    let currentUrl = event.currentTarget.dataset.presrc;
    let images = this.data.imagesAll;
    app["previewImg"] = true;
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
      let arr1 = [];
      if(res.data.data.number != 0){
        arr1 = _this.data.list
      }else{
        _this.setData({
          imagesAll:[]
       })
      }
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
  resetAvatar: function() {
    let _this = this;
    wx.chooseImage({
      success (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({ //更新头像
          url: app.config.service.uploadAvatar,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          header:{
            "Content-Type":"application/x-www-from-urlencoded",
            'Authorization': 'Bearer '+app.config.service.token,
          },
          success(res) {
            res.data = JSON.parse(res.data);
            app.avatarUrl = res.data.data.url;
            _this.onLoad();
          },
        });
      }
    })
  },
  onShow: function () {
    if(app.previewImg){
			app.previewImg = false;
			return;
		}
    this.getVlog(0); //查询所有Vlog
  },
  onReachBottom: function () { //上拉加载
    if (this.data.last) {
      return;
    }
    this.getVlog(this.data.curpage + 1);
  },
	onPullDownRefresh:function(){//下拉刷新
	    this.onLoad();
	}
})