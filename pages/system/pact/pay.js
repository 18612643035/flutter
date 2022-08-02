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
    signingTime:'',
    curpage:0,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.paymentList,    
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
              let arr1 = [];
              res.data.data.current == 0 ? "" : arr1 = _this.data.list;
              arr1 = arr1.concat(res.data.data.records);
              _this.setData({
                curpage:res.data.data.current,
                allData:arr1,
                list:arr1,
                last: res.data.data.last
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
  onTap:function(e){
    wx.navigateTo({
      url: 'payList?list='+JSON.stringify(e.target.dataset.id),
    })
  },
  onReachBottom: function () { //下拉刷新
    if (this.data.last) {
      return;
    }
    this.setData({
      curpage:this.data.curpage+1
    })
    this.onLoad();
  },
})