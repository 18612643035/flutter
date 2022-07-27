// pages/system/client/auditClient.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    show:false,
    log:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.userPending,    
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
      });
  },
  onSubmit: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    wx.request({
        url: config.service.userPass,    
        method:"POST", 
        data:{
          id:e.target.dataset.id
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){
            console.log(res);
            if(res?.data?.code == 0){
              toast.success('已完成');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },onReject: function(e){
    let _this = this;
    let data = {};
    data["id"] = e.target.dataset.id;
    if(_this.data.log == ""){
      toast.fail('内容不能为空');
			return
    }
    wx.request({
        url: config.service.userFail,    
        method:"POST", 
        data:{
          id:_this.data.details.id,
          reason:_this.data.log
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('已完成');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },
  onShowDialog: function(e){
    console.log(e)
    let index = e.target.dataset.index;
    this.setData({
      details:this.data.allData[index],
      show:true
    })
  },
    //组件传递的值
    onLog:function(e){
      e.detail.textData
      this.setData({
          log:e.detail.textData,
      })
    },
})