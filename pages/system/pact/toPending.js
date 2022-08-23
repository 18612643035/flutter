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
    curpage:0
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
              })
              console.log(_this.data.allData)
              console.log(_this.data.allData.length < 1)
            }
            else{
              toast.fail(res.data.msg);
            }  
        }
      })
  },
  getUserInfo: function(e){
    let _this = this;
    if(_this.data.finishContent == ""){
      toast.fail('请填写合同计划完成情况');
      return 
    }
    let data = {};
    data["id"] = Number(_this.data.details.id);
    data["content"] = _this.data.details.content;
    data["finishTime"] = util.formatTime(new Date(_this.data.input));
    data["finishContent"] = _this.data.finishContent;
    data["startTime"] = _this.data.details.startTime;
    data["endTime"] = _this.data.details.endTime;
    data["status"] = _this.data.details.status;
    data["directorName"] = _this.data.details.directorName;
    data["contractId"] = _this.data.details.contractId;
    data["director"] = _this.data.details.director;
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
  //新增日志
  addLog:function(e){
    let _this = this;
    if(_this.data.log == ""){
      toast.fail('内容不能为空');
			return
    }
    wx.request({
      url: config.service.plog,    
      method:"POST",
      data:{
        content:_this.data.log,
        contractPlanId:_this.data.details.id
      },   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.data){
            toast.success('新增成功');
           }
     }
    })
  },
   //编辑日志
   editLog:function(e){
    let ind = e.target.dataset.index;
    let id = this.data.allData[ind].id;
    wx.navigateTo({
      url: '../pact/editDispose?id='+id,
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
  showLog:function(e){ //查询日志
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
    })
    let _this = this;
    wx.request({
        url: config.service.pshowLog,    
        method:"GET",    
        header:{
          "content-type":"application/x-www-form-urlencoded",
          'Authorization': 'Bearer '+config.service.token,
        },
        data:{
          content:'',
          contractPlanId:_this.data.details.id,
          size:200
        },       
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              _this.setData({
                LOG:res.data.data.records,
                showLog:true
              })
              console.log(_this.data.logData)
            }else{
              toast.fail('查询失败');
            }
        }
      });
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
          content:'',
          contractPlanId:_this.data.details.id,
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
    if(e.detail.value.type == "" || e.detail.value.number == "" || e.detail.value.setupTime == ""){
      toast.fail('内容不能为空');
			return
    }
    wx.request({
      url: config.service.deleteDev,    
      method:"POST",
      data:{
        type:e.detail.value.type,
        number:e.detail.value.number,
        setupTime: util.formatTime(new Date(_this.data.input)),
        contractId:_this.data.details.contractId
      },   
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data?.data){
            toast.success('新增成功');
            _this.setData({show2:false})
           }
           else{
            toast.fail(res.data.msg);
          }
     }
    })
  },
  delete:function(e){ //删除日志
    let _this = this;
    let id = e.target.dataset.id;
    wx.request({
      url: config.service.plog+'/'+id,    
      method:"DELETE", 
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },     
      success:function(res){ 
          console.log(res) 
          if(res.data.code == 0){
            toast.success('删除成功');
            _this.setData({ showLog: false });
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
  showPop(e) {//完成计划
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        finishContent:this.data.allData[index].finishContent,
        finishTime:this.data.allData[index].finishTime,
        status:this.data.allData[index].status,
        pshow:true,
    })
  },
  onReachBottom: function () { //下拉刷新
    app.onReach(this);
  }
})