var config = require('../../../config')
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    show: false,
    columns: ['1','2','3'],
    handler:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.cservicePending,    
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
                  dictList:app.dict
              })
            }else{
              toast.fail(res.data.msg);
            }
        }
      })
    //获取指派人
    wx.request({
      url: config.service.role+'/CUSTOMER_SERVICE_HAN',    
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
          else{
            toast.fail(res.data.msg);
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
  showPopup:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
    let picker = this.selectComponent(".picker");
    picker.setColumnIndex(0,0); //设置默认索引
  },
    //指派处理人
    getUserInfo:function(e){
      let _this = this;
      wx.request({
        url: config.service.cassign,    
        method:"POST",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          handler:_this.data.handler,
          id:_this.data.details.id
        },    
        success:function(res){ 
            console.log(res) 
            if(res.data.code == 0){
              toast.success('指派成功');
              setTimeout(() => {
                _this.onLoad(); 
              },1000);
            }
        }
      })
    }
})