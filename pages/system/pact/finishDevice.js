// pages/system/pact/toPlan.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    show: false,
    devType:[],
    dict:[],
    deviceDb:[],
    signingTime:'',
    curpage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.installList,    
        method:"GET", 
        data:{
            current:_this.data.curpage,
        },    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res.data?.data?.records){
              toast.success('查询成功');
              let db =  app.filter(res.data.data.records);
              _this.setData({
                curpage:res.data.data.current,
                devType:config.device_type,
                dict:config.dict,
                allData:_this.data.allData.concat(db),
            })
          }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  showPopup(e){
    console.log(e)
    let index = e.target.dataset.index;
    let _this = this;
    wx.request({
        url: config.service.showDev,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          current:1,
          installId:_this.data.allData[index].id,
          size:200
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                deviceDb:res.data.data.records,
                show:true
              })
              res.data.data.records.map((item,i)=>{
                console.log(item,i)
            })
              console.log(_this.data.deviceDb)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
  
})