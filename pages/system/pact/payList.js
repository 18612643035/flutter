var config = require('../../../config')
import toast from '../../../dist/toast/toast';
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    show:false,
    details:[],
    status:0,
    columns: ['1','2','3'],
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2000, 10, 1).getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    remarks:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    console.log(JSON.parse(options.list));
    let id = JSON.parse(options.list);
    wx.request({
      url: config.service.pay,    
      method:"GET",    
      header:{
        "content-type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        contractId:id
      },     
      success:function(res){ 
        if(res.data?.data?.records){
            toast.success('查询成功');
            _this.setData({
              allData:res.data.data.records,
          })
        }
        else{
          toast.fail(res.data.msg);
        }  
      }
    })
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onChange(event) {
    const { value } = event.detail;
    this.setData({
      status:value.status,
    })
  },
  showPopup:function(e){
    let index = e.target.dataset.index;
    console.log(e.target)
    let col = [{"text":"未付款","status":0},{"text":"已付款","status":1}]
    console.log(col)
    this.setData({
        details:this.data.allData[index],
        show:true,
        status:this.data.allData[index].status,
        columns:col,
    })
  },
  inputChange: function (e) {
    var val = e.detail.value
    this.setData({
      remarks: val
    })
  },
  edit:function(e){
    let _this = this;
    wx.request({
      url: config.service.updatePayStatus,    
      method:"POST",    
      header:{
        "content-type":"application/json",
        'Authorization': 'Bearer '+config.service.token,
      },
      data:{
        id:_this.data.details.id,
        status:_this.data.status,
        amount:_this.data.details.amount,
        actualTime:util.formatTime(new Date(_this.data.currentDate)),
        remarks:_this.data.remarks,
      },    
      success:function(res){ 
          console.log(res) 
          if(res.data?.data){
            toast.success('指派成功');
          }
      }
    })
  }
})