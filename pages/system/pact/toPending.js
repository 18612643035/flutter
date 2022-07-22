// pages/system/pact/toPending.js
var config = require('../../../config');
var util = require('../../../utils/util');
import toast from '../../../dist/toast/toast';
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
    finishContent:'',
    finishTime:'',
    status:0,
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    input:""
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
        header:{
          "content-type":"application/json",
          'Authorization': 'Bearer '+config.service.token,
        },     
        success:function(res){ 
            console.log(res) 
            if(res.data?.data?.records){
              toast.success('查询成功');
              let app = getApp();
              let db =  app.filter(res.data.data.records);
              _this.setData({
                  allData:db,
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
  showPopup(e) {
    let index = e.target.dataset.index;
    this.setData({
        details:this.data.allData[index],
        finishContent:this.data.allData[index].finishContent,
        finishTime:this.data.allData[index].finishTime,
        status:this.data.allData[index].status,
        show:true,
    })
  },
  onClose() {
    this.setData({ show: false });
  },
})