var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    console.log(JSON.parse(options.list));
    let id = JSON.parse(options.list);
    wx.request({
      url: config.service.pay,    
      method:"GET",    
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        contractId:id
      },     
      success:function(res){ 
        if(res.data?.data?.records){
            toast.success('查询成功');
            _this.setData({
              allData:res.data.data.records,
          })
        }
        else{
          toast.fail('查询失败');
        } 
      }
    })
  }
})