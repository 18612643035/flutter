var config = require('../../../config')
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    curpage:1,
    show:false,
    types:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request();
  },
  request:function(page) {
    let _this = this;
    wx.request({
        url: config.service.deviceList,    
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
              // let col = [];
              // for(let key in config.regDict){
              //    col.push({
              //     "text": config.regDict[key],
              //     "id": key
              //   });
              // }
              _this.setData({
                curpage:res.data.data.current,
                //columns:col,
                types:config.device_type,
                dict:config.dict,
                allData:_this.data.allData.concat(res.data.data.records),
              })
            }else{
              toast.fail(res.data.msg);
            }
        }
      });
  },
  showPact(e){
    let _this = this;
    let ind =e.target.dataset.index;

    wx.request({
      url: config.service.details,    
      method:"GET", 
      data:{
          id:_this.data.allData[ind].contractId,
      },    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
        if(res.data?.code == 0){
            toast.success('查询成功');
            let basicInfo =  app.filter([res.data.data.basicInfo]);
            let deviceList =  app.filter(res.data.data.deviceList);
            let payment =  app.filter(res.data.data.payment);
            let installs = app.filter(res.data.data.installs);
            let terms =  app.filter(res.data.data.terms).length ? app.filter(res.data.data.terms) : [];
            console.log(res)
            _this.setData({
              details:basicInfo[0],
              deviceList:deviceList[0],
              installs:installs[0],
              terms:terms[0],
              show:true,
          })
        }
        else{
          toast.fail(res.data.msg);
        }  
      }
    })
  }
})