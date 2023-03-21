// pages/system/pact/toPlan.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    allData2:[],
    details:[],
    show2:false,
    show: false,
    signingTime:'',
    curpage:1,
    curpage2:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pactPage,    
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
            console.log(res.data)
              res.data.data.records.length?toast.success('查询成功'):toast.success('暂无更多数据');
              let db =  app.filter(res.data.data.records);
              _this.setData({
                curpage:res.data.data.current,
                allData:_this.data.allData.concat(db),
            })
          }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  showInstall(e){
    let _this = this;
    this.setData({
      contractId:_this.data.allData[e.target.dataset.index].id
    })
    wx.request({
        url: config.service.installList,    
        method:"GET",
        data:{
          current:_this.data.curpage2,
          contractId:_this.data.allData[e.target.dataset.index].id
        },     
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res.data?.data?.records){
              let db =  app.filter(res.data.data.records);
              _this.setData({
                curpage2:res.data.data.current,
                allData2:db,
                show2:true,
                dict:config.dict,
                devType:config.device_type
            })
          }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  deleteInstall(e){
    let _this = this;
    this.setData({
      contractId:_this.data.allData[e.target.dataset.index].id
    })
    wx.request({
        url: config.service.addContractPlan+'/'+_this.data.allData2[e.target.dataset.index].id,    
        method:"DELETE",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
          if(res.code == 0){
              toast.success('删除成功');
              _this.setData({
                show2:false
              })
            }
          else{
            toast.fail(res.data.msg);
          }  
        }
      })
  },
  showPopup(e) {
    let id = this.data.allData[e.target.dataset.index].id;
    wx.navigateTo({
      url: '../pact/details?id='+id,
    })
    // this.setData({
    //     details:this.data.allData[index],
    //     show:true,
    //     signingTime:util.formatTime(new Date(this.data.allData[index].signingTime))
    // })
  },
  goAddInstall(e){
    this.setData({
      show2:false
    })
    wx.navigateTo({
      url: '../pact/addInstall?contractId='+this.data.contractId
    })
  },
  goEditInstall(e){
    this.setData({
      show2:false
    })
    let data = this.data.allData2[e.target.dataset.index];
    wx.navigateTo({
      url: '../pact/addInstall?list='+JSON.stringify(data)
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})