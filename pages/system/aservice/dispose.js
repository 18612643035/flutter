var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    LOG:[],
    reslut:'',
    log:'',
    show:false,
    showLog:false,
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
  delete:function(e){
    let _this = this;
    let id = e.target.dataset.id;
    wx.request({
      url: config.service.deleteLog+'/'+id,    
      method:"DELETE", 
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('删除成功');
            _this.setData({ showLog: false });
          }
          else{
            toast.fail(res.data.msg);
          }
      }
    })
  },
  aclose:function(e){
    let _this = this;
    if(_this.data.reslut == ""){
      toast.fail('内容不能为空');
      return 
    }
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
  //新增维保日志
  addLog:function(e){
    let _this = this;
    if(_this.data.log == ""){
      toast.fail('内容不能为空');
      return 
    }
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
    //编辑维保日志
    editLog:function(e){
      let ind = e.target.dataset.index;
      let id = this.data.allData[ind].id;
      wx.navigateTo({
        url: '../aservice/editDispose?id='+id,
      })
    },
  showPopup:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
  },
  showLog:function(e){ //查询维保日志
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
    })
    let _this = this;
    wx.request({
        url: config.service.showLog,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          content:'',
          maintenanceId:_this.data.details.id,
          size:20
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                LOG:res.data.data.records,
                showLog:true
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
  showPop:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        cshow:true,
    })
  },
    //完成弹框组件传递的值
    onReceive:function(e){
        e.detail.textData
        this.setData({
            reslut:e.detail.textData,
        })
      },
   //新增弹框组件传递的值
    onLog:function(e){
      e.detail.textData
      this.setData({
        log:e.detail.textData,
      })
    }
})