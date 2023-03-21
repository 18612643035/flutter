var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db:[],
    isShow:false,
    value:'',
    value1:'',
    value2:'',
    option1:[],
    deviceTypeName:'',
    deviceIdsName:'',
    option2:[],
    deviceIds:'',
    devType:'',
    show:'',//时间遮罩层
    show2:'',
    show:false,
    currentDate:'',
    customerId:'',
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
    console.log(options)
    this.setData({
      db:JSON.parse(options.list)
    })
    let arr = [];
    this.data.db.deviceIds.map((v,i)=>{
      let db={};
      db['id'] = v;
      db['name'] = this.data.db.devices[i];
      arr.push(db);
    })
    this.setData({
      value:this.data.db.customer,
      customerId:this.data.db.customerId,
      devType:this.data.db.deviceType,
      deviceIds:this.data.db.deviceIds[0],
      deviceIdsName: arr,
    })
    console.log(this.data)
    this.queryDev();
    this.queryDevid(this.data.db.deviceType);
  },
  onClick(e) {
    console.log(e)
    let _that = this;
    this.setData({
      value:e.target.dataset.value,
      isShow:false,
      customerId:e.target.dataset.id
    })
    this.queryDev();
  },
  queryDev(){
    let _that = this;
    wx.request({ //获取选择客户的设备类型
      url: config.service.clientDev,  
      data: {customerId: _that.data.customerId},   
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
              option1:res.data,
            })
            console.log(_that.data.option1)
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
  },
  queryDevid(type){
    let _that = this;
    wx.request({ //获取类型查编号
      url: config.service.numberDev,  
      data: {customerId:_that.data.customerId,type:type},   
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
              option2:res.data,
            })
            console.log(_that.data.option1)
          }
          else{
            toast.fail(res.data.msg);
          }  
      }
    })
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
        deviceIds:'',
        devType:'',
        option2:[],
        deviceIdsName:'',
        customerId:''
      });
    }
  },
  showDetails: function(e){
    let _this = this;
    let index = e.target.dataset.index;
    wx.request({
        url: config.service.devDetails+'/'+this.data.deviceIdsName[index].id,    
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
  optChange(e){
    let _that = this;
    let name='';
    for(let i=0;i<this.data.option1.length;i++){
      if(this.data.option1[i].value == e.detail){
        name = this.data.option1[i].text;
      }
    }
    _that.setData({
      devType:e.detail,
      deviceTypeName:name
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
  optChange2(e){
    let db ={ };
    for(let i=0;i<this.data.option2.length;i++){
      if(this.data.option2[i].value == e.detail){
        db.name = this.data.option2[i].text;
        db.id = this.data.option2[i].value;
      }
    }
    let arr = this.data.deviceIdsName;
    if(arr.map(e => e.name).indexOf(db.name)== -1){
      arr.push(db);
      this.setData({
        deviceIds:e.detail,
        deviceIdsName:arr
      })
    }
  },
  closeDevices(e){
    let arr = this.data.deviceIdsName;
    arr.splice(e.target.dataset.index,1);
    if(arr.length<1){
      this.setData({
        deviceIds:'',
        deviceIdsName:arr,
      })
    }else{
      this.setData({
        deviceIdsName:arr,
        deviceIds:arr[0].id,
      })
    }
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  cmtTime(e){
    this.setData({
      time:util.formatTime2(new Date(this.data.currentDate))
    })
  },
  onTime(e){
    this.setData({
      show:true
    })
  },
  formSubmit: function(e){ //修改提交
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
    data["id"] = _this.data.db.id;
    data["customerId"] = _this.data.customerId;
    data["deviceTypeName"] = _this.data.deviceTypeName ? _this.data.deviceTypeName : _this.data.db.deviceTypeName;
    data["deviceType"] = _this.data.devType ? _this.data.devType : _this.data.db.deviceType;
    data["deviceIds"] = _this.data.deviceIds ? [_this.data.deviceIds] : _this.data.db.deviceIds[0];
    data["contact"] = e.detail.value.contact;
    data["contactPhone"] = e.detail.value.contactPhone;
    data["maintainTime"] = e.detail.value.maintainTime;
    data["content"] = e.detail.value.content;
    data["result"] = e.detail.value.result;
    console.log(JSON.stringify(data));
    wx.request({
      url: config.service.maintenance,  
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
})