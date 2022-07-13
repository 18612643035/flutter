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
        url: config.service.finishedList,    
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
  showPopup(e) {
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
        signingTime:util.formatTime(new Date(this.data.allData[index].signingTime))
    })
  },
})