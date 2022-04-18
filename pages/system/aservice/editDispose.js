var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    log:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = JSON.parse(options.id);
    let _this = this;
    wx.request({
        url: config.service.showLog,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          content:_this.data.log,
          maintenanceId:id,
          size:20
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                allData:res.data.data.records,
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
  formSubmit:function(e){
      console.log(e.detail);
      const _this = this;
      let data = {};
      data["content"] = e.detail.value.content;
      data["maintenanceId"] = e.detail.value.maintenanceId;
      console.log(JSON.stringify(data));
      wx.request({
        url: config.service.log,  
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
  }
})