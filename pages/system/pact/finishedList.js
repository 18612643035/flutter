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
        url: config.service.finishedList,    
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
              res.data.data.records.length?toast.success('查询成功'):toast.success('暂无更多数据');
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
    let id = this.data.allData[e.target.dataset.index].id;
    wx.navigateTo({
      url: '../pact/details?id='+id,
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
})