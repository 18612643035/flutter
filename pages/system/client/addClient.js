// pages/client/addClient.js
var config = require('../../../config')
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage: 1,
    columns:[],
    allData:[],
    dictId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      curpage:1,
      allData:[]
    })
    this.request()
  },
  request:function(params) {
    let _this = this;
    wx.request({
        url: config.service.queryObj,    
        method:"GET",
        data:{
          current:_this.data.curpage,
        },     
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              if(!res.data.data.records.length && _this.data.curpage >1){
                toast.success('暂无更多数据');
                _this.setData({curpage:_this.data.curpage-1});
                return
              }
              //toast.success('查询成功')
              res.data.data.records.map((item) =>{
                item.region = config.regDict[item.region];
              });
              let col = [];
              for(let key in config.regDict){
                 col.push({
                  "text": config.regDict[key],
                  "value": key
                });
              }
              _this.setData({
                curpage:res.data.data.current,
                columns:col,
                allData:_this.data.allData.concat(res.data.data.records),
              })
            }else{
              toast.fail(res.data.msg);
            }
        }
      });
  },
  goEdit:function(e){
    let index = e.target.dataset.index;
    let db = [];
    db.push(this.data.allData[index])
    wx.navigateTo({
      url: './editClient?list='+JSON.stringify(db)
    })
  },
  onChange(event) { ///选中地区
    this.setData({
      dictId: event.detail
    })
  },
  goAudit:function (e) {
    let _this = this;
    let index = e.target.dataset.index;
    wx.request({
        url: config.service.userSubmit,    
        method:"POST", 
        data:{
          id:_this.data.allData[index].id
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
  },
  goDelete:function (e) {
    let _this = this;
    let index = e.target.dataset.index;
    wx.request({
        url: config.service.addObj+'/'+_this.data.allData[index].id,    
        method:"DELETE", 
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
      },     
        success:function(res){
            console.log(res);
            if(res?.data?.code == 0){
              toast.success('已完成');
              setTimeout(() => {
                _this.onShow(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  formSubmit: function(e){
    console.log(e.detail);
    let data = {};
    const _this = this;
    data["name"] = e.detail.value.name;
    data["address"] = e.detail.value.address;
    data["contact"] = e.detail.value.contact;
    data["remarks"] = e.detail.value.remarks;
    data["contactPhone"] = e.detail.value.contactPhone;
    data["region"] =_this.data.dictId == '' ? this.data.columns[1].id : _this.data.dictId;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.addObj,  
      data: JSON.stringify(data),   
      method:"POST",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data?.code == 0){
            toast.success('新增成功');
            setTimeout(() => {
              _this.onShow(); 
            },1000);
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
  },
  onReachBottom: function () { //下拉刷新
    //app.onReach(this);
    this.setData({
      curpage:this.data.curpage+1
    })
    this.request();
  },
})