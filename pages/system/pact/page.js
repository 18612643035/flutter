// pages/system/pact/toPlan.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    show: false,
    signingTime:'',
    curpage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pactPage,    
        method:"GET",
        data:{
          current:_this.data.curpage,
        },     
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res.data?.data?.records){
              toast.success('查询成功');
              let db =  app.filter(res.data.data.records);
              _this.setData({
                curpage:res.data.data.current,
                allData:_this.data.allData.concat(db),
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
    console.log(this.data.allData[index])
    this.setData({
        details:this.data.allData[index],
        show:true,
        signingTime:util.formatTime(new Date(this.data.allData[index].signingTime))
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})