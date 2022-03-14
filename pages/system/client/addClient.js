// pages/client/addClient.js
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

  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  formSubmit: function(e){
    console.log(e.detail);
    let data = {};
    data["name"] = e.detail.value.name;
    data["address"] = e.detail.value.address;
    data["contact"] = e.detail.value.contact;
    data["contactPhone"] = e.detail.value.contactPhone;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.addObj,  
      data: JSON.stringify(data),   
      method:"POST",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data?.code == 0){
            toast.success('新增成功');

          }
          else{
            toast.fail('新增失败');
          }  
      }
    })
  }
})