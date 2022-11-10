// pages/system/client/details.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: config.service.details,    
      method:"GET", 
      data:{
          id:options.id,
          current:_this.data.curpage,
      },    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
        if(res.data?.code == 0){
            toast.success('查询成功');
            let basicInfo =  app.filter([res.data.data.basicInfo]);
            let deviceList =  app.filter(res.data.data.deviceList);
            let payment =  app.filter(res.data.data.payment);
            let terms =  app.filter(res.data.data.terms).length ? app.filter(res.data.data.terms) : [];
            console.log(res)
            _this.setData({
              details:basicInfo[0],
              deviceList:deviceList[0],
              payment:payment[0],
              terms:terms,
              isShow:true,
          })
        }
        else{
          toast.fail(res.data.msg);
        }  
      }
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