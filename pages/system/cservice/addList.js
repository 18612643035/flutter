var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId:0,
    columns: ['1','2','3'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.request({ 
      url: config.service.dict,  //获取客户信息  
      method:"GET",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          let col = [];
          for(let i=0;i<res.data.data.length;i++){
            col.push({"text":res.data.data[i].name,"id":res.data.data[i].id});
          }
            _this.setData({
                columns:col,
                customerId:col[0].id
            })
      }
    })
  },
  onChange(event) {
    const { value } = event.detail;
    this.setData({
      customerId:value.id,
    })
  },
  formSubmit: function(e){
    console.log(e.detail);
    let data = {};
    const _this = this;
    data["content"] = e.detail.value.content;
    data["customerId"] = this.data.customerId;
    data["contact"] = e.detail.value.contact;
    data["contactPhone"] = e.detail.value.contactPhone;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.cserviceSave,  
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
            toast.fail(res.data.msg);
          }  
      }
    })
  }
})