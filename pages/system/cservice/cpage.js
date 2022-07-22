var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.cservicePage,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              let app = getApp();
              let db =  app.filter(res.data.data.records);
              _this.setData({
                  allData:db,
                  dictList:app.dict
              })
            }else{
              toast.fail(res.data.msg);
            }
        }
      })
  },

})