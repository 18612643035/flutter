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
    dictId:'',
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
              let col = [];
              for(let key in config.regDict){
                 col.push({
                  "text": config.regDict[key],
                  "id": key
                });
              }
              res.data.data.records.map((item) =>{
                item.region = config.regDict[item.region]; 
                let name = item.region;
                item.index =  col.findIndex((item) => item.text === name);
              });

              _this.setData({
                curpage:res.data.data.current,
                columns:col,
                allData:_this.data.allData.concat(res.data.data.records),
              })
            }
        }
      })
  },
  onChange(event) { ///选中地区
    const {
      value
    } = event.detail;
    this.setData({
      dictId: value.id
    })
  },
  formSubmit: function(e){
    console.log(e.detail);
    const _this = this;
    let data = {};
    data["name"] = e.detail.value.name;
    data["address"] = e.detail.value.address;
    data["contact"] = e.detail.value.contact;
    data["id"] = e.detail.value.id;
    data["region"] =_this.data.dictId;
    data["contactPhone"] = e.detail.value.contactPhone;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.addObj,  
      data: JSON.stringify(data),   
      method:"PUT",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data?.code == 0){
            toast.success('修改成功');
          }
          else{
            toast.fail(res.data.msg);
          } 
      }
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  },
})