// pages/system/pact/toPlan.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    show: false,
    signingTime:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.planningList,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res.data?.data?.records){
              toast.success('查询成功');
							let app = getApp();
							let db =  app.filter(res.data.data.records);
              _this.setData({
                allData:db,
            })
          }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  onSubmit: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.startPact,    
        method:"GET", 
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
              toast.success('启动已完成');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },
  showPopup(e) {
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
        signingTime:util.formatTime(new Date(this.data.allData[index].signingTime))
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