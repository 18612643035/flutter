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
        url: config.service.queryObj,    
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
      })
  },
  formSubmit: function(e){
    console.log(e.detail);
    const _this = this;
    let data = {};
    data["name"] = e.detail.value.name;
    data["address"] = e.detail.value.address;
    data["contact"] = e.detail.value.contact;
    data["id"] = e.detail.value.id;
    data["contactPhone"] = e.detail.value.contactPhone;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.addObj,  
      data: JSON.stringify(data),   
      method:"PUT",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data?.code == 0){
            toast.success('修改成功');
          }
          else{
            toast.fail(res.data.msg);
          } 
      }
    })
  },
})