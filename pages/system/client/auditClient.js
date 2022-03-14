// pages/system/client/auditClient.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
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
        url: config.service.userPending,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                  allData:res.data.data.records,
              })
            }
        }
      });
  },
  onSubmit: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.userPass,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res);
            if(res?.data?.code == 0){
              toast.success('审核通过已完成');
  
            }
            else{
              toast.fail('审核通过失败');
            } 
        }
      })
  },onReject: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.userFail,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('审核不通过已完成');
  
            }
            else{
              toast.fail('审核不通过失败');
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