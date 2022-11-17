// pages/system/pact/toPlan.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
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
    curpage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.haspay,    
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
              _this.setData({
                curpage:res.data.data.current,
                allData:_this.data.allData.concat(res.data.data.records),
            })
          }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  showPopup(e) {
    let id = this.data.allData[e.target.dataset.index].id;
    wx.navigateTo({
      url: '../pact/details?id='+id,
    })
    // this.setData({
    //     details:this.data.allData[index],
    //     show:true,
    //     signingTime:util.formatTime(new Date(this.data.allData[index].signingTime))
    // })
  },
  onTap:function(e){
    wx.navigateTo({
      url: 'payList?list='+JSON.stringify(e.target.dataset.id),
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
})