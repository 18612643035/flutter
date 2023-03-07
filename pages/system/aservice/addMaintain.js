var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';

// pages/system/aservice/addMaintain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curpage:1,
    allData:[],
    columns:[],
    devDetails:[],//设备详情数据
    isShow:false,
    value:'',
    show:'',//时间遮罩层
    show2:false,//设备详情
    searchText:[],
    devType:'',
    deviceIds:'',
    deviceIdsName:'',
    option1:[],
    option2:[],
    customerId:'',
    currentDate: new Date().getTime(),
    time:'',
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function (page) {
    this.setData({
      curpage:1,
      allData:[]
    })
    this.request()
  },
  request:function(page) {
    let _this = this;
    wx.request({
        url: config.service.maintenancePage,    
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
  showDetails: function(e){
    let _this = this;
    wx.request({
        url: config.service.devDetails+'/'+this.data.deviceIds,    
        method:"GET",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data){
              toast.success('查询成功');
              _this.setData({
                devDetails:res.data.data,
                show2:true
              })
            }else{
              toast.fail(res.data.msg);
            }
        }
      });
  },
  delMaintenance:function (e) {//删除一条维保
    let _this = this;
    let index = e.target.dataset.index;
    wx.request({
        url: config.service.maintenance+'/'+_this.data.allData[index].id,    
        method:"DELETE", 
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
                _this.onShow(); 
              },1000);
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
  },
  goEdit:function(e){ //修改维保
    let index = e.target.dataset.index;
    wx.navigateTo({
      url: './editMaintain?list='+JSON.stringify(this.data.allData[index]),
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onChange(e) { //模糊查询
    let _that = this;
    if(e.detail != ''){
      this.setData({
        value: e.detail,
        isShow: true
      });
      
      wx.request({
        url: config.service.userSearch,  
        data: {name:e.detail},   
        method:"get",    
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
      },   
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              if(res.data.data.length<1){
                _that.setData({
                  searchText:[{name:'无数据'}]
                })
              }else{
                _that.setData({
                  searchText:res.data.data
                })
              }
            }
            else{
              toast.fail(res.data.msg);
            }  
        }
      })
    }else{
      this.setData({
        value: e.detail,
        isShow: false,
        option1:[],
        option2:[],
        customerId:'',
        deviceIds:'',
        deviceIdsName:'',
        devType:''
      });
    }
  },
  onClick(e) {
    console.log(e)
    let _that = this;
    this.setData({
      value:e.target.dataset.value,
      isShow:false,
      customerId:e.target.dataset.id
    })
    wx.request({ //获取选择客户的设备类型
      url: config.service.clientDev,  
      data: {customerId:e.target.dataset.id},   
      method:"get",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data){
            res.data.map((e)=>{
              e.text = e.label
            })
            _that.setData({
              option1:res.data
            })
            console.log(_that.data.option1)
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
  },
  optChange(e){
    let _that = this;
    _that.setData({
      devType:e.detail
    })
    wx.request({ //获取类型查编号
      url: config.service.numberDev,  
      data: {customerId:_that.data.customerId,type:e.detail},   
      method:"get",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
    },   
      success:function(res){ 
          console.log(res) 
          if(res?.data){
            res.data.map((e)=>{
              e.text = e.label
            })
            _that.setData({
              option2:res.data
            })
            console.log(_that.data.option1)
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
  },
  onTime(e){
    this.setData({
      show:true
    })
  },
  optChange2(e){
    let name='';
    for(let i=0;i<this.data.option2.length;i++){
      if(this.data.option2[i].value == e.detail){
        name = this.data.option2[i].text;
      }
    }
    this.setData({
      deviceIds:e.detail,
      deviceIdsName:name
    })
  },
  cmtTime(e){
    this.setData({
      time:util.formatTime2(new Date(this.data.currentDate))
    })
  },
  formSubmit: function(e){ //提交
    console.log(e.detail);
    const _this = this;
    const keys ={deviceType:'设备类型',deviceIds:'设备编号',contact:'联系人',contactPhone:'联系电话',maintainTime:'维修时间',content:'问题描述',result:'处理结果'};
    let isNull = false;
    for(let key in e.detail.value){
      console.log(e.detail.value[key])
      let test =  config.check.testNull(e.detail.value[key],keys[key]);
      if(!test){
        isNull == true;
        break;
      }
    }
    !config.check.testMobileNo(e.detail.value.contactPhone) ? isNull = true : '';
    if(isNull){
      return false;
    }
    let data = {};
    data["customerId"] = _this.data.customerId;
    data["deviceType"] = _this.data.devType;
    data["deviceIds"] = [_this.data.deviceIds];
    data["contact"] = e.detail.value.contact;
    data["contactPhone"] = e.detail.value.contactPhone;
    data["maintainTime"] = e.detail.value.maintainTime;
    data["content"] = e.detail.value.content;
    data["result"] = e.detail.value.result;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.maintenance,  
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
  onReachBottom(e){
    this.request(this.data.curpage++)
  }
})