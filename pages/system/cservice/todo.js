var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    reslut:'',
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.cserviceTodu,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              _this.setData({
                  allData:res.data.data.records,
              })
            }else{
              toast.fail('查询失败');
            }
        }
      })
  },
  showPopup:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
  },
  closeRecord:function(e){
      let _this = this;
      wx.request({
        url: config.service.closeCus,    
        method:"POST",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          remarks:_this.data.reslut,
          id:_this.data.details.id
        },    
        success:function(res){ 
            console.log(res) 
            if(res.data?.data){
              toast.success('关闭成功');
            }
        }
      })
    },
    //组件传递的值
    onReceive:function(e){
      e.detail.textData
      this.setData({
          reslut:e.detail.textData,
      })
    }
})