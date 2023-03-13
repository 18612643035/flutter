var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dict:[],
    deviceTypes:[],
    customer:'',
    deviceType:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = config.dict;
    this.setData({
      dict: config.dictCol
    })
  },
  optChange(e){
    let _that = this;
     _that.setData({
       devType:e.detail
     })
    wx.request({ //获取类型查编号
      url: config.service.clientDev,  
      data: {customerId:e.detail},
      method:"get",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data){
            res.data.map((e)=>{
              e.text = e.label
            })
            _that.setData({
              deviceTypes:res.data
            })
            console.log(_that.data.option1)
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
  },
  optChange2(e){
    _that.setData({
      deviceType:e.detail
    })
  }
})