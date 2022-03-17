// pages/system/pact/toPending.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
Page({
  onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    isShow:false,
    show: false,
    finishContent:'',
    finishTime:'',
    status:0,
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
    console.log(util.formatTime(new Date(event.detail)));
  },
  // handChange(e){//状态切换
  //   let stu = e.detail.value;
  //   this.setData({
  //     status: stu
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pactPending,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              _this.setData({
                  allData:res.data.data.records,
              })
            }
            else{
              toast.fail('查询失败');
            }
        }
      })
  },
  getUserInfo: function(e){
    let _this = this;
    let id = Number(_this.data.details.id);
    let finishContent = _this.data.finishContent;
    let finishTime = util.formatTime(new Date(_this.data.currentDate));
    let status = _this.data.status;
    wx.request({
        url: config.service.contractPlan,    
        method:"POST", 
        data:{
          id:id,
          content:finishContent,
          time:finishTime,

        },   
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('启动已完成');
            }
            else{
              toast.fail('启动失败');
            } 
        }
      })
  },
  showPopup(e) {
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        finishContent:this.data.allData[index].finishContent,
        finishTime:this.data.allData[index].finishTime,
        status:this.data.allData[index].status,
        show:true,
        currentDate:new Date(this.data.allData[index].finishTime).getTime()
    })
  },
  onClose() {
    this.setData({ show: false });
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