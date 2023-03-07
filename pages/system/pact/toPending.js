// pages/system/pact/toPending.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
let app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    details:[],
    isShow:false,
    show: false,
    pshow:false,
    finishContent:'',
    finishTime:'',
    status:0,
    log:'',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    input:"",
    curpage:1,
    device_type:''
  },
  onInput(event) {
    this.setData({
      input: event.detail,
    });
    console.log(util.formatTime(new Date(event.detail)));
  },
  // handChange(e){//状态切换
  //   let stu = e.detail.value;
  //   this.setData({
  //     status: stu
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
        url: config.service.pactPending,    
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
              toast.success('查询成功');
              let db =  app.filter(res.data.data.records);
              _this.setData({
                  curpage:res.data.data.current,
                  allData:_this.data.allData.concat(db),
                  device_type:config.device_type
              })
              console.log(_this.data)
            }
            else{
              toast.fail(res.data.msg);
            }  
        }
      })
  },
  getUserInfo: function(e){//完成合同
    let _this = this;
    let data = {};
    data["id"] = Number(_this.data.details.id);
    console.log(data.id)
    return false;
    wx.request({
        url: config.service.contractPlan,    
        method:"POST", 
        data:data,   
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res?.data?.code == 0){
              toast.success('完成');
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
  inputChange: function (e) {
    var val = e.detail.value
    this.setData({
      finishContent: val
    })
  },
  showPopup:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show:true,
    })
  },
  showPopup2:function(e){
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        show2:true,
    })
  },
  showLog2:function(e){ //查询设备
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
    })
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
          installId:_this.data.details.id,
          size:200
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                LOG:res.data.data.records,
                showLog2:true
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
  },
   //新增设备
   addLog2:function(e){
    let _this = this;
    _this.setData({
        details:_this.data.allData[index],
    })
    if(e.detail.value.type == "" || e.detail.value.number == "" || e.detail.value.setupTime == ""){
      toast.fail('内容不能为空');
			return
    }
    wx.request({
      url: config.service.deleteDev,    
      method:"POST",
      data:{
        installId:_this.data.details.id,
        type:e.detail.value.type,
        number:e.detail.value.number,
        notes:e.detail.value.remarks,
        setupTime: util.formatTime2(new Date(_this.data.input)),
        contractId:_this.data.details.contractId
      },   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.code == 0){
            toast.success('新增成功');
            _this.setData({show2:false})
           }
           else{
            toast.fail(res.data.msg);
          }
     }
    })
  },
  delete2:function(e){ //删除设备
    let _this = this;
    let id = e.target.dataset.id;
    wx.request({
      url: config.service.deleteDev+'/'+id,    
      method:"DELETE", 
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('删除成功');
            _this.setData({ showLog2: false });
          }
          else{
            toast.fail(res.data.msg);
          }
      }
    })
  },
  //新增弹框组件传递的值
  onLog:function(e){
    e.detail.textData
    this.setData({
      log:e.detail.textData,
    })
  },
  showPop(e) {//完成任务
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        pshow:true,
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})