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
    log:'',
    show:false,
    cshow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.aservicemy,    
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
  aclose:function(e){
    let _this = this;
    wx.request({
      url: config.service.aclose,    
      method:"POST",
      data:{
        remarks:_this.data.reslut,
        id:_this.data.details.id
      },   
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.data?.records){
            toast.success('关闭成功');
            _this.setData({
                allData:res.data.data.records,
            })
          }
          else{
            toast.fail(res.data.msg);
          }
      }
    })
  },
  //新增维保日志
  addLog:function(e){
    let _this = this;
    wx.request({
      url: config.service.log,    
      method:"POST",
      data:{
        content:_this.data.log,
        maintenanceId:_this.data.details.id
      },   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.data){
            toast.success('新增成功');
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
  showPop:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        cshow:true,
    })
  },
    //组件传递的值
    onReceive:function(e){
        e.detail.textData
        this.setData({
            reslut:e.detail.textData,
        })
      },
   //组件传递的值
    onLog:function(e){
      e.detail.textData
      this.setData({
        log:e.detail.textData,
      })
    }
})