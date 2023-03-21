var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dict:[],
    deviceTypes:[],
    customer:'',
    deviceType:[],
    contractId:'',
    deviceType:[],
    editData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let data = config.dict;
    if(options.list){
      this.setData({
        editData:JSON.parse(options.list)
      })
      let data = {};
      data["detail"] = this.data.editData.customerId;
      this.optChange(data)
    }
    console.log(this.data.editData)
    this.setData({
      dict: config.dictCol,
      contractId:options.contractId
    })
  },
  formSubmit:function(e){
    console.log(e.detail);
    const _this = this;
    if(e.detail.value.content == ""){
      toast.fail('内容不能为空');
      return 
    }
    if(_this.data.editData){
      let data = {};
      data["customerId"] = _this.data.customerId;
      data["type"] = _this.data.deviceType.length >0 ? _this.data.deviceType : _this.data.editData.type;
      data["contractId"] = _this.data.editData.contractId ;
      data["id"] = _this.data.editData.id ;
      data["deviceAmount"] = e.detail.value.deviceAmount;
      data["warranty"] = e.detail.value.warranty;
      data["address"] = e.detail.value.address;
      data["infoDeptContact"] = e.detail.value.infoDeptContact;
      data["infoDeptPhone"] = e.detail.value.infoDeptPhone;
      data["deptName"] = e.detail.value.deptName;
      data["deptContact"] = e.detail.value.deptContact;
      data["deptPhone"] = e.detail.value.deptPhone;
      console.log(JSON.stringify(data));  
      wx.request({
        url: config.service.addContractPlan,  
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
    }else{
      let data = {};
      data["customerId"] = _this.data.customerId;
      data["type"] = _this.data.deviceType;
      data["contractId"] = _this.data.contractId;
      data["deviceAmount"] = e.detail.value.deviceAmount;
      data["warranty"] = e.detail.value.warranty;
      data["address"] = e.detail.value.address;
      data["infoDeptContact"] = e.detail.value.infoDeptContact;
      data["infoDeptPhone"] = e.detail.value.infoDeptPhone;
      data["deptName"] = e.detail.value.deptName;
      data["deptContact"] = e.detail.value.deptContact;
      data["deptPhone"] = e.detail.value.deptPhone;
      console.log(JSON.stringify(data));  
      wx.request({
        url: config.service.addContractPlan,  
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
            }
            else{
              toast.fail(res.data.msg);
            } 
        }
      })
    }

},
  optChange(e){
    let _that = this;
     _that.setData({
      customerId:e.detail
     })
    wx.request({ //获取类型查编号
      url: config.service.clientDev,  
      data: {customerId:e.detail},
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
              deviceTypes:res.data
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
    this.setData({
      deviceType:e.detail
    })
  }
})