// pages/system/pact/auditPact.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    isShow:false,
    show: false,
    show2: false,
    show3: false,
    columns: ['1','2','3'],
    handler:'',
    no:'',
    close:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pendingList,    
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
                //获取合同制定人
                wx.request({
                  url: config.service.role+'/CONTRACT_DIRECTOR',    
                  method:"GET",    
                  header:{
                    "content-type":"application/json",
                    'Authorization': 'Bearer '+config.service.token,
                  },    
                  success:function(res){ 
                      console.log(res) 
                      if(res.data?.data){
                        let col = [];
                        for(var i =0;i<res.data.data.length;i++){
                          col.push({"text":res.data.data[i].name,"handler":res.data.data[i].userId});
                        }
                        console.log(col)
                        _this.setData({
                          columns:col,
                          handler:col[0].handler,
                        });
                      }
                  }
                })
            }
            else{
              toast.fail('查询失败');
            }
        }
      })
  },
  onChange(event) {
    const { value } = event.detail;
    this.setData({
      handler:value.handler,
    })
  },
  onShow1: function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
  },
  onShow2: function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show2:true,
    })
  },
  onShow3: function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show3:true,
    })
  },
  onSubmit: function(e){
    let _this = this;
    wx.request({
        url: config.service.approved,    
        method:"POST", 
        data:{
          id:_this.data.details.id,
          director: _this.data.handler
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data.code == 0){
              toast.success('成功');
            }
        }
      })
  },onReject: function(e){
    let _this = this;
    wx.request({
        url: config.service.denied,    
        method:"POST", 
        data:{
          id:_this.data.details.id,
          reason:_this.data.no
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          console.log(res);
          if(res?.data.code == 0){
            toast.success('成功');
          }
          
        }
      })
  },onClosed: function(e){
    let _this = this;
    wx.request({
        url: config.service.closed,    
        method:"POST", 
        data:{
          id:_this.data.details.id,
          reason:_this.data.close
        },   
        header:{
          "Content-Type": "application/x-www-form-urlencoded",
          "Accpet": "application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res?.data.code == 0){
            toast.success('成功');
          };  
        }
      })
  },
  onShowList: function(e){
    console.log(e)
    let index = e.target.dataset.index;
    this.setData({
      details:this.data.allData[index],
      isShow:true
  })
  },
  onHidden: function(){
    this.setData({
      isShow:false
     })
  },
  //组件传递的值
  onLog1:function(e){
  e.detail.textData
  this.setData({
      no:e.detail.textData,
  })
},
  onLog2:function(e){
    e.detail.textData
    this.setData({
      close:e.detail.textData,
    })
  }
})